"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useLoader } from "@/app/context/LoaderContext";
import { useVirtualizer } from "@tanstack/react-virtual";
import { format, parseISO, isValid } from "date-fns";

/**
 * ActivityLogTab - Universal tab for freeform text log entries
 *
 * Displays a list of log entries (timestamp, author, text) with ability to add new entries.
 * Uses virtual scrolling for performance with large lists.
 *
 * **Modern components**:
 * - shadcn Input, Button, Card, ScrollArea
 * - @tanstack/react-virtual for performance
 *
 * **Context is provided by UniversalCard** - no dynamic selection needed!
 *
 * @param {Object} config - Tab configuration
 * @param {Object} contextData - Entity data from context
 * @param {Function} loadData - Reload entity data function
 * @param {number} entityId - Entity ID
 */
function ActivityLogTab({ config, contextData, loadData, entityId }) {
  const [logEntries, setLogEntries] = useState([]);
  const [newLogText, setNewLogText] = useState("");

  const { data: session } = useSession();
  const { startLoading, stopLoading } = useLoader();

  const parentRef = useRef();

  // Extract log entries from context data
  useEffect(() => {
    if (!contextData) return;

    const entries = contextData[config.logKey] || [];
    // Sort newest first
    const sorted = [...entries].sort((a, b) => b.id - a.id);
    setLogEntries(sorted);
  }, [contextData, config.logKey]);

  // Virtual scrolling setup
  const rowVirtualizer = useVirtualizer({
    count: logEntries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  // Handle add log entry
  const handleAddLog = async () => {
    if (!newLogText.trim()) return;

    try {
      startLoading();

      const data = new FormData();
      data.append("updated_by", session?.user?.name || "Unknown");
      data.append("text", newLogText.trim());
      data.append(config.entityIdField, entityId);

      const response = await fetch(config.addEndpoint, {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        setNewLogText("");
        loadData();
      } else {
        console.error("Failed to add log entry");
        stopLoading();
      }
    } catch (error) {
      console.error("Error adding log entry:", error);
      stopLoading();
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddLog();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Add log entry section */}
      <div className="p-3 border-b space-y-2">
        <Label htmlFor="newLogText">{config.labels?.inputLabel || "Add log record"}</Label>
        <div className="flex items-end gap-2">
          <Input
            id="newLogText"
            value={newLogText}
            onChange={(e) => setNewLogText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter log text..."
            className="flex-1"
          />
          <Button
            onClick={handleAddLog}
            disabled={!newLogText.trim()}
            size="icon"
            title={config.labels?.buttonTooltip || "Add log record"}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Log entries list */}
      {logEntries.length > 0 && (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="p-3 pb-2">
            <h3 className="text-lg font-semibold">{config.labels?.header || "Change Log"}</h3>
          </div>

          {/* Table header */}
          <div className="px-3 pb-2 flex gap-2 border-b font-semibold text-xs text-slate-600">
            {config.columns?.map((col) => (
              <div
                key={col.key}
                className="px-1 text-center overflow-hidden"
                style={{ width: col.width }}
              >
                {col.label}
              </div>
            ))}
          </div>

          {/* Virtual scrolling container */}
          <div
            ref={parentRef}
            className="flex-1 overflow-auto px-3"
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const entry = logEntries[virtualRow.index];

                return (
                  <div
                    key={virtualRow.key}
                    className="flex gap-2 border-b py-2 hover:bg-slate-50 transition-colors text-sm"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {config.columns?.map((col) => {
                      let value = entry[col.key];

                      // Format based on column format
                      if (col.format === "datetime" && value) {
                        try {
                          const date = parseISO(value);
                          if (isValid(date)) {
                            value = format(date, "dd MMM yyyy, hh:mm a");
                          }
                        } catch (e) {
                          console.error("Error formatting datetime:", e);
                        }
                      } else if (col.format === "date" && value) {
                        try {
                          const date = parseISO(value);
                          if (isValid(date)) {
                            value = format(date, "dd MMM yyyy");
                          }
                        } catch (e) {
                          console.error("Error formatting date:", e);
                        }
                      }

                      return (
                        <div
                          key={col.key}
                          className="px-1 overflow-hidden text-ellipsis whitespace-nowrap"
                          style={{ width: col.width }}
                          title={value}
                        >
                          {value}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {logEntries.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <p>No log entries yet. Add your first entry above.</p>
        </div>
      )}
    </div>
  );
}

export default ActivityLogTab;
