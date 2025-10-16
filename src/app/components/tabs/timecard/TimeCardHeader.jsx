/**
 * Time Card Header Component
 *
 * Navigation controls for time card period selection
 * - Previous/Next half-month navigation
 * - Today button to reset to current period
 * - Reload button to refresh data
 * - Add Adjustment button (conditional)
 * - Timezone message display
 */

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCw, Plus } from 'lucide-react';
import { formatPeriodLabel, calculateCurrentPeriod } from './utils';

export default function TimeCardHeader({
  period,
  onPeriodChange,
  onRefresh,
  onAddAdjustment,
  timezoneMessage,
}) {
  const handlePrev = () => {
    if (period.half === 1) {
      // Go to second half of previous month
      onPeriodChange({
        year: period.month === 0 ? period.year - 1 : period.year,
        month: period.month === 0 ? 11 : period.month - 1,
        half: 2,
      });
    } else {
      // Go to first half of same month
      onPeriodChange({ ...period, half: 1 });
    }
  };

  const handleNext = () => {
    if (period.half === 2) {
      // Go to first half of next month
      onPeriodChange({
        year: period.month === 11 ? period.year + 1 : period.year,
        month: period.month === 11 ? 0 : period.month + 1,
        half: 1,
      });
    } else {
      // Go to second half of same month
      onPeriodChange({ ...period, half: 2 });
    }
  };

  const handleToday = () => {
    onPeriodChange(calculateCurrentPeriod());
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Previous period button */}
      <Button variant="outline" size="icon" onClick={handlePrev}>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Period label */}
      <div className="text-sm font-medium w-56 text-center">
        {formatPeriodLabel(period)}
      </div>

      {/* Next period button */}
      <Button variant="outline" size="icon" onClick={handleNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Today button */}
      <Button variant="outline" size="sm" onClick={handleToday}>
        Today
      </Button>

      {/* Reload button */}
      <Button variant="outline" size="icon" onClick={onRefresh}>
        <RotateCw className="h-4 w-4" />
      </Button>

      {/* Add Adjustment button (conditional) */}
      {onAddAdjustment && (
        <Button variant="outline" size="sm" onClick={onAddAdjustment}>
          <Plus className="h-4 w-4 mr-1" />
          Add Adjustment
        </Button>
      )}

      {/* Timezone message */}
      <p className="ml-auto text-sm text-red-600">
        {timezoneMessage}
      </p>
    </div>
  );
}
