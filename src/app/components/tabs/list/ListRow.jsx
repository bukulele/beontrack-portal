"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import { GiSteeringWheel } from "react-icons/gi";
import { MdAirlineSeatIndividualSuite } from "react-icons/md";
import { Tooltip } from "react-tooltip";

/**
 * ListRow - Clickable row component for list tabs
 *
 * Displays entity information in a consistent, clickable format.
 * Used by ListTab to render each list item.
 *
 * @param {string} primary - Primary text (bold, main identifier)
 * @param {string} secondary - Secondary text (gray, additional info)
 * @param {string} metadata - Optional metadata text
 * @param {string} badge - Optional badge text
 * @param {string} role - Optional role indicator ('main' or 'co' for incidents/violations)
 * @param {Function} onClick - Click handler
 * @param {number} index - Row index for unique keys
 */
function ListRow({
  primary,
  secondary,
  metadata,
  badge,
  role,
  onClick,
  index,
}) {
  return (
    <Card
      className="mb-2 p-3 cursor-pointer hover:bg-accent transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left side: Primary + Secondary text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate">{primary}</p>
            {role && (
              <div
                className="flex items-center justify-center text-muted-foreground"
                data-tooltip-id={`role-tooltip-${index}`}
              >
                {role === 'main' ? (
                  <GiSteeringWheel size={16} />
                ) : (
                  <MdAirlineSeatIndividualSuite size={16} />
                )}
                <Tooltip
                  id={`role-tooltip-${index}`}
                  openEvents={{ mouseenter: true, focus: true, click: true }}
                  style={{ maxWidth: "90%", zIndex: 20 }}
                >
                  {role === 'main' ? 'Main driver' : 'Co-driver'}
                </Tooltip>
              </div>
            )}
          </div>
          {secondary && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {secondary}
            </p>
          )}
          {metadata && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {metadata}
            </p>
          )}
        </div>

        {/* Right side: Badge + Arrow icon */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {badge && (
            <Badge variant="outline" className="text-xs">
              {badge}
            </Badge>
          )}
          <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </Card>
  );
}

export default ListRow;
