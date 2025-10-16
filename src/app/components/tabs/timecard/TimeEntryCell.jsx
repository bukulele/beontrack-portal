/**
 * Time Entry Cell Component
 *
 * Displays a single check-in or check-out time entry with inline editing capabilities.
 *
 * Timezone handling:
 * - Displays times in user's local timezone
 * - Sends times to server with timezone offset (ISO 8601 with offset)
 * - Uses safeToIsoWithOffset for API submissions
 *
 * Supports:
 * - View mode: Display time with GPS and warning icons
 * - Edit mode: Inline datetime picker with save/cancel
 * - Action buttons (edit/delete) visible on row hover
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Check, Globe, AlertTriangle } from 'lucide-react';
import DateTimeInput from '../../dateInput/DateTimeInput';
import { formatDateTime, prepareForApi } from './utils';
import ActionButtons from './ActionButtons';

export default function TimeEntryCell({
  entry,
  field, // 'checkIn' | 'checkOut'
  day,
  isLastEntry,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onAddEntry,
  canEdit,
  showGps,
  onViewGps,
  showWarning,
  hoveredCell,
  onHoverEntry,
  onClearHover,
}) {
  // Determine which time field to work with
  const fieldType = field === 'checkIn' ? 'in' : 'out';
  const timeField = field === 'checkIn' ? 'check_in_time' : 'check_out_time';
  const timeValue = entry[timeField];

  // Local state for edit value
  const [editValue, setEditValue] = useState(timeValue);

  // Sync editValue with timeValue when it changes (important for new entries)
  useEffect(() => {
    setEditValue(timeValue);
  }, [timeValue]);

  // Check if this entry's buttons should show
  const isHovered =
    hoveredCell?.type === 'entry' &&
    hoveredCell?.entryId === entry.id &&
    hoveredCell?.field === fieldType;

  const handleSave = () => {
    console.log('[TimeEntryCell] handleSave called:', { editValue, timeField });
    // Prepare value with timezone offset before sending to API
    const valueWithTimezone = prepareForApi(editValue);
    console.log('[TimeEntryCell] Calling onSave with:', valueWithTimezone);
    onSave(valueWithTimezone);
  };

  // Edit mode - show datetime picker with save/cancel buttons
  if (isEditing) {
    return (
      <div className="flex items-center justify-center gap-1">
        <div className="flex-1">
          <DateTimeInput
            name={timeField}
            value={editValue || ''}
            updateState={(updater) => {
              console.log('[TimeEntryCell] DateTimeInput updateState called with updater');
              // DateTimeInput passes a function updater, not an object
              // We need to call it with current state to get the new state
              setEditValue(prevValue => {
                // Create a fake state object with the current value
                const currentState = { [timeField]: prevValue };
                // Call the updater function to get the new state
                const newState = typeof updater === 'function' ? updater(currentState) : updater;
                console.log('[TimeEntryCell] New state from updater:', newState);
                // Extract just the field we care about
                return newState[timeField];
              });
            }}
            style="minimalistic"
          />
        </div>

        {/* Cancel button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 flex-shrink-0"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Save button - handles timezone conversion */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 flex-shrink-0"
          onClick={handleSave}
        >
          <Check className="h-4 w-4 text-green-600" />
        </Button>
      </div>
    );
  }

  // View mode - show time in local timezone with icons
  return (
    <div
      className="flex items-center justify-center gap-1 relative"
      onMouseEnter={() => onHoverEntry(entry.id, fieldType)}
      onMouseLeave={onClearHover}
    >
      {/* Third-party warning icon (always visible if applicable) */}
      {showWarning && (
        <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
      )}

      {/* Time value - displayed in user's local timezone */}
      <span className="text-sm">{formatDateTime(timeValue)}</span>

      {/* GPS button (always visible if coordinates exist) */}
      {showGps && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0"
          onClick={onViewGps}
        >
          <Globe className="h-3 w-3" />
        </Button>
      )}

      {/* Action buttons - visible only when this entry is hovered */}
      {canEdit && isHovered && (
        <ActionButtons
          field={field}
          isLastEntry={isLastEntry}
          onEdit={onEdit}
          onDelete={() => onSave('')}
          onAddEntry={onAddEntry}
        />
      )}
    </div>
  );
}
