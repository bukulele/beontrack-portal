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
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { parse, format, isValid } from 'date-fns';
import { formatDateTime, prepareForApi } from './utils';
import ActionButtons from './ActionButtons';

export default function TimeEntryCell({
  entry,
  field, // 'checkIn' | 'checkOut'
  day, // Day number (1-31)
  period, // {year, month, half} - for prefilling dates
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
  const timeField = field === 'checkIn' ? 'clockInTime' : 'clockOutTime';
  const timeValue = entry[timeField];

  // Generate default datetime for new entries
  const getDefaultDateTime = () => {
    if (!period || !day) return '';

    if (field === 'checkIn') {
      // Check-in: Default to row date at 8:00 AM
      const defaultDate = new Date(period.year, period.month, day, 8, 0);
      return format(defaultDate, "yyyy-MM-dd'T'HH:mm");
    } else {
      // Check-out: Default to 8 hours after check-in (or row date at 5:00 PM if no check-in)
      if (entry.clockInTime) {
        const checkInDate = new Date(entry.clockInTime);
        const defaultDate = new Date(checkInDate.getTime() + 8 * 60 * 60 * 1000); // +8 hours
        return format(defaultDate, "yyyy-MM-dd'T'HH:mm");
      } else {
        const defaultDate = new Date(period.year, period.month, day, 17, 0); // 5:00 PM
        return format(defaultDate, "yyyy-MM-dd'T'HH:mm");
      }
    }
  };

  // Local state for edit value - prefill if empty
  const [editValue, setEditValue] = useState(() => {
    if (timeValue) return timeValue;
    return getDefaultDateTime();
  });

  // Sync editValue with timeValue when it changes (important for new entries)
  // Don't override prefilled values with empty timeValue
  useEffect(() => {
    if (timeValue) {
      setEditValue(timeValue);
    }
  }, [timeValue]);

  // Check if this entry's buttons should show
  const isHovered =
    hoveredCell?.type === 'entry' &&
    hoveredCell?.entryId === entry.id &&
    hoveredCell?.field === fieldType;

  const handleSave = () => {
    // Prepare value with timezone offset before sending to API
    const valueWithTimezone = prepareForApi(editValue);
    onSave(valueWithTimezone);
  };

  // Edit mode - show datetime picker with save/cancel buttons
  if (isEditing) {
    return (
      <div className="flex items-center justify-center gap-1">
        <div className="flex-1">
          <DateTimePicker
            value={
              editValue
                ? new Date(editValue)
                : undefined
            }
            onChange={(date) => {
              if (date && isValid(date)) {
                // Format as YYYY-MM-DDTHH:mm (without timezone for local editing)
                setEditValue(format(date, "yyyy-MM-dd'T'HH:mm"));
              } else {
                setEditValue('');
              }
            }}
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
