/**
 * Total Cell Component
 *
 * Displays total hours for a day with:
 * - Calculated hours with lunch deduction (if applicable)
 * - Medical leave button (visible on hover if user can mark medical)
 * - Medical leave indicator icon (if day is marked as medical)
 */

import { Button } from '@/components/ui/button';
import { HeartPulse } from 'lucide-react';
import { calculateDayHours, formatHours } from './utils';

export default function TotalCell({
  entries,
  config,
  day,
  canMarkMedical,
  isMedical,
  onMarkMedical,
  hoveredCell,
  onHoverMedical,
  onClearHover,
}) {
  // Calculate total hours for the day
  const totalHours = calculateDayHours(entries, config);

  // Check if lunch deduction was applied
  const hasLunchDeduction =
    config.calculations.lunchDeduction &&
    totalHours > 0 && // Only show if there are actual hours
    entries.length > 0 &&
    entries.reduce((sum, entry) => {
      // Calculate raw total (before deduction) to check threshold
      const hours = parseFloat(
        require('@/app/functions/calculateWorkingHours').default(
          entry.check_in_time,
          entry.check_out_time,
          false
        )
      );
      return sum + (isNaN(hours) ? 0 : hours);
    }, 0) >= config.calculations.lunchDeductionThreshold;

  // Check if medical button should show
  const showMedicalButton =
    !isMedical &&
    canMarkMedical &&
    hoveredCell?.type === 'medical' &&
    hoveredCell?.day === day;

  return (
    <div
      className="flex items-center justify-center gap-2"
      onMouseEnter={() => canMarkMedical && onHoverMedical(day)}
      onMouseLeave={onClearHover}
    >
      {/* Hours display with lunch deduction note */}
      <div className="text-sm">
        <div>{formatHours(totalHours)}</div>
        {hasLunchDeduction && (
          <div className="text-xs text-muted-foreground">
            (Lunch -{config.calculations.lunchDeductionMinutes}min)
          </div>
        )}
      </div>

      {/* Medical leave indicator or button */}
      {isMedical ? (
        // Show medical icon if day is marked as medical leave
        <HeartPulse className="h-4 w-4 text-blue-500 flex-shrink-0" />
      ) : (
        showMedicalButton && (
          <div className="absolute right-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onMarkMedical}
              title="Mark as medical leave"
            >
              <HeartPulse className="h-4 w-4" />
            </Button>
          </div>
        )
      )}
    </div>
  );
}
