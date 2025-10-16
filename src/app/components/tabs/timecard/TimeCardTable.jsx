/**
 * Time Card Table Component
 *
 * Main table displaying all days in the current period with:
 * - Header row (Day, Check In, Check Out, Total)
 * - Data rows (one per day)
 * - Total row (sum of all hours)
 *
 * Uses shadcn Table component for clean, accessible layout
 */

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import TimeCardRow from './TimeCardRow';
import { calculatePeriodTotal, formatHours } from './utils';

export default function TimeCardTable({
  dayEntries,
  editState,
  onEditStateChange,
  onSave,
  config,
  canEdit,
  medicalDaysLeft,
  currentUserId,
  hoveredCell,
  onHoverEntry,
  onHoverEmptyIn,
  onHoverEmptyOut,
  onHoverMedical,
  onClearHover,
}) {
  // Calculate total hours for the period
  const totalHours = calculatePeriodTotal(dayEntries, config);

  return (
    <div className="rounded-md border overflow-auto">
      <Table className="table-fixed">
        {/* Table Header */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] text-center sticky top-0 bg-background z-10">
              Day
            </TableHead>
            <TableHead className="text-center sticky top-0 bg-background z-10">
              Check In
            </TableHead>
            <TableHead className="text-center sticky top-0 bg-background z-10">
              Check Out
            </TableHead>
            <TableHead className="w-[140px] text-center sticky top-0 bg-background z-10">
              Total
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {/* Day rows */}
          {dayEntries.map((day) => (
            <TimeCardRow
              key={day.date}
              day={day}
              editState={editState}
              onEditStateChange={onEditStateChange}
              onSave={onSave}
              canEdit={canEdit}
              config={config}
              medicalDaysLeft={medicalDaysLeft}
              currentUserId={currentUserId}
              hoveredCell={hoveredCell}
              onHoverEntry={onHoverEntry}
              onHoverEmptyIn={onHoverEmptyIn}
              onHoverEmptyOut={onHoverEmptyOut}
              onHoverMedical={onHoverMedical}
              onClearHover={onClearHover}
            />
          ))}

          {/* Total row */}
          <TableRow className="font-semibold bg-muted/50">
            <TableCell colSpan={3} className="text-right">
              Total Hours
            </TableCell>
            <TableCell>{formatHours(totalHours)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
