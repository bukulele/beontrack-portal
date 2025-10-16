/**
 * Time Card Row Component
 *
 * Renders a single day in the time card table with:
 * - Day number
 * - Check-in times (multiple entries possible)
 * - Check-out times (multiple entries possible)
 * - Total hours with medical leave indicator
 *
 * Supports adding new entries via "Add entry" button (visible on hover)
 */

import { TableRow, TableCell } from '@/components/ui/table';
import TimeEntryCell from './TimeEntryCell';
import TotalCell from './TotalCell';
import EmptyCell from './EmptyCell';

export default function TimeCardRow({
  day,
  editState,
  onEditStateChange,
  onSave,
  canEdit,
  config,
  medicalDaysLeft,
  currentUserId,
  hoveredCell,
  onHoverEntry,
  onHoverEmptyIn,
  onHoverEmptyOut,
  onHoverMedical,
  onClearHover,
}) {
  const hasEntries = day.entries.length > 0;
  const isMedical = day.entries[0]?.medical;

  // Check if user can mark this day as medical leave
  const canMarkMedical =
    config.features.medicalLeave.enabled &&
    canEdit &&
    !isMedical &&
    medicalDaysLeft > 0;

  // Check if third-party warnings should be shown
  const canViewWarnings = config.roles.viewThirdPartyWarnings;

  return (
    <TableRow>
      {/* Day number */}
      <TableCell className="font-medium text-center align-top">
        {day.date}
      </TableCell>

      {/* Check In column - multiple entries */}
      <TableCell className="text-center align-top">
        <div className="flex flex-col gap-1">
          {day.entries.length > 0 ? (
            <>
              {day.entries.map((entry, idx) => (
                <TimeEntryCell
                  key={entry.id}
                  entry={entry}
                  field="checkIn"
                  day={day.date}
                  isLastEntry={idx === day.entries.length - 1}
                  isEditing={
                    editState.mode === 'editEntry' &&
                    editState.entryId === entry.id &&
                    editState.field === 'in'
                  }
                  onEdit={() =>
                    onEditStateChange({
                      mode: 'editEntry',
                      entryId: entry.id,
                      field: 'in',
                      value: entry.check_in_time,
                    })
                  }
                  onSave={(value) => onSave(entry.id, 'check_in_time', value)}
                  onCancel={() => onEditStateChange({ mode: 'view' })}
                  onAddEntry={() =>
                    onEditStateChange({
                      mode: 'editEntry',
                      entryId: null,
                      field: 'in',
                      day: day.date,
                      value: '',
                    })
                  }
                  canEdit={canEdit}
                  showGps={
                    config.features.gpsTracking.enabled && entry.in_coordinates
                  }
                  onViewGps={() =>
                    onEditStateChange({
                      mode: 'viewMap',
                      coordinates: entry.in_coordinates,
                    })
                  }
                  showWarning={
                    canViewWarnings &&
                    hasThirdPartyWarning(entry, 'in', currentUserId)
                  }
                  hoveredCell={hoveredCell}
                  onHoverEntry={onHoverEntry}
                  onClearHover={onClearHover}
                />
              ))}
              {/* New entry input - shown when adding to existing entries */}
              {editState.mode === 'editEntry' &&
                editState.entryId === null &&
                editState.field === 'in' &&
                editState.day === day.date && (
                <TimeEntryCell
                  key="new-check-in"
                  entry={{ id: null, check_in_time: editState.value || '', check_out_time: '' }}
                  field="checkIn"
                  day={day.date}
                  isLastEntry={false}
                  isEditing={true}
                  onEdit={() => {}}
                  onSave={(value) => onSave(null, 'check_in_time', value)}
                  onCancel={() => onEditStateChange({ mode: 'view' })}
                  onAddEntry={null}
                  canEdit={canEdit}
                  showGps={false}
                  onViewGps={() => {}}
                  showWarning={false}
                  hoveredCell={hoveredCell}
                  onHoverEntry={onHoverEntry}
                  onClearHover={onClearHover}
                />
              )}
            </>
          ) : editState.mode === 'editEntry' &&
            editState.entryId === null &&
            editState.field === 'in' &&
            editState.day === day.date ? (
            // Editing empty check-in cell - show inline datetime input
            <TimeEntryCell
              key="new-check-in"
              entry={{ id: null, check_in_time: editState.value || '', check_out_time: '' }}
              field="checkIn"
              day={day.date}
              isLastEntry={false}
              isEditing={true}
              onEdit={() => {}}
              onSave={(value) => onSave(null, 'check_in_time', value)}
              onCancel={() => onEditStateChange({ mode: 'view' })}
              onAddEntry={null}
              canEdit={canEdit}
              showGps={false}
              onViewGps={() => {}}
              showWarning={false}
              hoveredCell={hoveredCell}
              onHoverEntry={onHoverEntry}
              onClearHover={onClearHover}
            />
          ) : (
            !isMedical && (
              <EmptyCell
                type="in"
                day={day.date}
                hoveredCell={hoveredCell}
                onHover={onHoverEmptyIn}
                onClearHover={onClearHover}
                onAddEntry={() =>
                  onEditStateChange({
                    mode: 'editEntry',
                    entryId: null,
                    field: 'in',
                    day: day.date,
                    value: '',
                  })
                }
              />
            )
          )}
        </div>
      </TableCell>

      {/* Check Out column - multiple entries */}
      <TableCell className="text-center align-top">
        <div className="flex flex-col gap-1">
          {day.entries.length > 0 ? (
            <>
              {day.entries.map((entry) => (
                <TimeEntryCell
                  key={entry.id}
                  entry={entry}
                  field="checkOut"
                  day={day.date}
                  isLastEntry={false} // OUT column never shows plus button
                  isEditing={
                    editState.mode === 'editEntry' &&
                    editState.entryId === entry.id &&
                    editState.field === 'out'
                  }
                  onEdit={() =>
                    onEditStateChange({
                      mode: 'editEntry',
                      entryId: entry.id,
                      field: 'out',
                      value: entry.check_out_time,
                    })
                  }
                  onSave={(value) => onSave(entry.id, 'check_out_time', value)}
                  onCancel={() => onEditStateChange({ mode: 'view' })}
                  onAddEntry={null} // OUT column doesn't use add entry
                  canEdit={canEdit}
                  showGps={
                    config.features.gpsTracking.enabled && entry.out_coordinates
                  }
                  onViewGps={() =>
                    onEditStateChange({
                      mode: 'viewMap',
                      coordinates: entry.out_coordinates,
                    })
                  }
                  showWarning={
                    canViewWarnings &&
                    hasThirdPartyWarning(entry, 'out', currentUserId)
                  }
                  hoveredCell={hoveredCell}
                  onHoverEntry={onHoverEntry}
                  onClearHover={onClearHover}
                />
              ))}
              {/* New entry input - shown when adding check-out to existing entries */}
              {editState.mode === 'editEntry' &&
                editState.entryId === null &&
                editState.field === 'out' &&
                editState.day === day.date && (
                <TimeEntryCell
                  key="new-check-out"
                  entry={{ id: null, check_in_time: '', check_out_time: editState.value || '' }}
                  field="checkOut"
                  day={day.date}
                  isLastEntry={false}
                  isEditing={true}
                  onEdit={() => {}}
                  onSave={(value) => onSave(null, 'check_out_time', value)}
                  onCancel={() => onEditStateChange({ mode: 'view' })}
                  onAddEntry={null}
                  canEdit={canEdit}
                  showGps={false}
                  onViewGps={() => {}}
                  showWarning={false}
                  hoveredCell={hoveredCell}
                  onHoverEntry={onHoverEntry}
                  onClearHover={onClearHover}
                />
              )}
            </>
          ) : editState.mode === 'editEntry' &&
            editState.entryId === null &&
            editState.field === 'out' &&
            editState.day === day.date ? (
            // Editing empty check-out cell - show inline datetime input
            <TimeEntryCell
              key="new-check-out"
              entry={{ id: null, check_in_time: '', check_out_time: editState.value || '' }}
              field="checkOut"
              day={day.date}
              isLastEntry={false}
              isEditing={true}
              onEdit={() => {}}
              onSave={(value) => onSave(null, 'check_out_time', value)}
              onCancel={() => onEditStateChange({ mode: 'view' })}
              onAddEntry={null}
              canEdit={canEdit}
              showGps={false}
              onViewGps={() => {}}
              showWarning={false}
              hoveredCell={hoveredCell}
              onHoverEntry={onHoverEntry}
              onClearHover={onClearHover}
            />
          ) : (
            !isMedical && (
              <EmptyCell
                type="out"
                day={day.date}
                hoveredCell={hoveredCell}
                onHover={onHoverEmptyOut}
                onClearHover={onClearHover}
                disabled={true} // OUT cell disabled when no entries (no check-in)
                onAddEntry={() =>
                  onEditStateChange({
                    mode: 'editEntry',
                    entryId: null,
                    field: 'out',
                    day: day.date,
                    value: '',
                  })
                }
              />
            )
          )}
        </div>
      </TableCell>

      {/* Total column with medical leave button */}
      <TableCell className="text-center align-top">
        <TotalCell
          entries={day.entries}
          config={config}
          day={day.date}
          canMarkMedical={canMarkMedical}
          isMedical={isMedical}
          onMarkMedical={() =>
            onEditStateChange({
              mode: 'confirmMedical',
              day: day.date,
            })
          }
          hoveredCell={hoveredCell}
          onHoverMedical={onHoverMedical}
          onClearHover={onClearHover}
        />
      </TableCell>
    </TableRow>
  );
}

/**
 * Helper function to check if entry has third-party warning
 * (Inline version to avoid circular dependency)
 */
function hasThirdPartyWarning(entry, field, currentUserId) {
  const userIds = field === 'in' ? entry.user_id_in : entry.user_id_out;
  if (!userIds) return false;

  const ids = userIds.split(',').map((id) => id.trim()).filter(Boolean);
  return ids.length > 1 || (ids.length === 1 && ids[0] !== currentUserId);
}
