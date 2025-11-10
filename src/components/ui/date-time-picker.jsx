"use client";

import * as React from "react";
import { format, parse, isValid, set } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * DateTimePicker - Shadcn date and time picker with input fields
 *
 * Features:
 * - Calendar popover for date selection
 * - Separate time input field
 * - Direct text input for manual entry
 * - Validates and formats datetime
 * - Returns dates in YYYY-MM-DDTHH:mm format
 *
 * @param {Date | undefined} value - Selected datetime
 * @param {Function} onChange - Callback with Date object
 * @param {string} placeholder - Placeholder text
 * @param {string} className - Additional classes
 * @param {boolean} disabled - Disable input
 */
export function DateTimePicker({
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
  className,
  disabled = false,
  ...props
}) {
  const [open, setOpen] = React.useState(false);
  const [dateInput, setDateInput] = React.useState("");
  const [timeInput, setTimeInput] = React.useState("");

  // Update inputs when value changes
  React.useEffect(() => {
    if (value && isValid(value)) {
      setDateInput(format(value, "yyyy-MM-dd"));
      setTimeInput(format(value, "HH:mm"));
    } else {
      setDateInput("");
      setTimeInput("");
    }
  }, [value]);

  // Handle calendar selection
  const handleDateSelect = (date) => {
    if (date) {
      // Preserve time if it exists
      let newDate = date;
      if (value && isValid(value)) {
        newDate = set(date, {
          hours: value.getHours(),
          minutes: value.getMinutes(),
        });
      }
      onChange?.(newDate);
    }
    setOpen(false);
  };

  // Handle date input change
  const handleDateInputChange = (e) => {
    const newValue = e.target.value;
    setDateInput(newValue);

    // Try to parse the date
    const parsed = parse(newValue, "yyyy-MM-dd", new Date());
    if (isValid(parsed)) {
      // Preserve time if it exists
      let newDate = parsed;
      if (value && isValid(value)) {
        newDate = set(parsed, {
          hours: value.getHours(),
          minutes: value.getMinutes(),
        });
      }
      onChange?.(newDate);
    } else if (newValue === "") {
      onChange?.(undefined);
    }
  };

  // Handle time input change
  const handleTimeInputChange = (e) => {
    const newValue = e.target.value;
    setTimeInput(newValue);

    // Try to parse the time (HH:mm format)
    const timeParts = newValue.split(":");
    if (timeParts.length === 2) {
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);

      if (
        !isNaN(hours) &&
        !isNaN(minutes) &&
        hours >= 0 &&
        hours < 24 &&
        minutes >= 0 &&
        minutes < 60
      ) {
        const baseDate = value && isValid(value) ? value : new Date();
        const newDate = set(baseDate, { hours, minutes });
        onChange?.(newDate);
      }
    }
  };

  // Handle blur - validate and format
  const handleDateBlur = () => {
    if (value && isValid(value)) {
      setDateInput(format(value, "yyyy-MM-dd"));
    } else {
      setDateInput("");
    }
  };

  const handleTimeBlur = () => {
    if (value && isValid(value)) {
      setTimeInput(format(value, "HH:mm"));
    } else {
      setTimeInput("");
    }
  };

  return (
    <div className={cn("flex gap-2", className)}>
      {/* Date Input */}
      <div className="relative flex-1">
        <Input
          type="text"
          value={dateInput}
          onChange={handleDateInputChange}
          onBlur={handleDateBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-10"
          {...props}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              disabled={disabled}
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              captionLayout="dropdown"
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Input */}
      <div className="relative w-32">
        <Input
          type="time"
          value={timeInput}
          onChange={handleTimeInputChange}
          onBlur={handleTimeBlur}
          disabled={disabled}
          className="pr-10"
        />
        <Clock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
