/**
 * Empty Cell Component
 *
 * Displays an empty time card cell (IN or OUT column) with hover-based edit button.
 * Shows a dash by default, and a pencil icon button when hovered.
 */

import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

export default function EmptyCell({
  type, // 'in' | 'out'
  day,
  hoveredCell,
  onHover,
  onClearHover,
  onAddEntry,
  disabled = false, // for OUT cell when no check-in exists
}) {
  // Check if this cell is currently hovered
  const isHovered =
    hoveredCell?.type === `empty${type === 'in' ? 'In' : 'Out'}` &&
    hoveredCell?.day === day;

  // OUT cell requires check-in to be editable
  const showButton = type === 'in' ? isHovered : isHovered && !disabled;

  return (
    <div
      onMouseEnter={() => onHover(day, type === 'out' ? false : undefined)}
      onMouseLeave={onClearHover}
      className="flex w-full items-center justify-center gap-2 relative"
    >
      <span className="text-sm text-muted-foreground">-</span>

      {showButton && (
        <div className="absolute right-1 pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onAddEntry();
            }}
          >
            <Pencil className="h-3 w-3 pointer-events-none" />
          </Button>
        </div>
      )}
    </div>
  );
}
