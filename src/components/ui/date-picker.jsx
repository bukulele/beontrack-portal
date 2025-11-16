"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
 * DatePicker - Shadcn date picker with input field
 *
 * Features:
 * - Calendar popover for date selection
 * - Direct text input for manual entry
 * - Validates and formats dates
 * - Returns dates in YYYY-MM-DD format
 * - Configurable year range for dropdown
 *
 * @param {Date | undefined} value - Selected date
 * @param {Function} onChange - Callback with Date object
 * @param {string} placeholder - Placeholder text
 * @param {string} className - Additional classes
 * @param {boolean} disabled - Disable input
 * @param {number} startYear - Start year for dropdown (default: 1900)
 * @param {number} endYear - End year for dropdown (default: 2100)
 */
export function DatePicker({
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
  className,
  disabled = false,
  startYear = 1900,
  endYear = 2100,
  ...props
}) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // Update input when value changes
  React.useEffect(() => {
    if (value && isValid(value)) {
      setInputValue(format(value, "yyyy-MM-dd"));
    } else {
      setInputValue("");
    }
  }, [value]);

  // Handle calendar selection
  const handleSelect = (date) => {
    onChange?.(date);
    setOpen(false);
  };

  // Handle manual input
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Try to parse the date
    const parsed = parse(newValue, "yyyy-MM-dd", new Date());
    if (isValid(parsed)) {
      onChange?.(parsed);
    } else if (newValue === "") {
      onChange?.(undefined);
    }
  };

  // Handle input blur - validate and format
  const handleInputBlur = () => {
    if (value && isValid(value)) {
      setInputValue(format(value, "yyyy-MM-dd"));
    } else {
      setInputValue("");
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
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
            onSelect={handleSelect}
            captionLayout="dropdown"
            startMonth={new Date(startYear, 0)}
            endMonth={new Date(endYear, 11)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
