"use client";

import {
  FormField as ShadcnFormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { parse, format, isValid } from "date-fns";

// Convert date range notation to actual years
const getYearFromRange = (rangeValue) => {
  const currentYear = new Date().getFullYear();

  if (rangeValue === 'current') {
    return currentYear;
  } else if (typeof rangeValue === 'string' && rangeValue.startsWith('current')) {
    // Handle 'current+5', 'current-16' etc
    const match = rangeValue.match(/current([+-]\d+)/);
    if (match) {
      return currentYear + parseInt(match[1]);
    }
  }

  return rangeValue; // Numeric year
};

/**
 * Render appropriate input based on field type
 */
function renderInput(field, formField) {
  switch (field.type) {
    case "text":
      return <Input {...formField} disabled={field.disabled} />;

    case "number":
      return (
        <Input
          type="number"
          {...formField}
          disabled={field.disabled}
          onChange={(e) => formField.onChange(e.target.valueAsNumber || "")}
        />
      );

    case "email":
      return <Input type="email" {...formField} disabled={field.disabled} />;

    case "date":
      // Get date range from field config
      const startYear = field.dateRange?.start
        ? getYearFromRange(field.dateRange.start)
        : 1900;
      const endYear = field.dateRange?.end
        ? getYearFromRange(field.dateRange.end)
        : 2100;

      return (
        <DatePicker
          value={
            formField.value
              ? parse(formField.value, "yyyy-MM-dd", new Date())
              : undefined
          }
          onChange={(date) => {
            formField.onChange(
              date && isValid(date) ? format(date, "yyyy-MM-dd") : ""
            );
          }}
          startYear={startYear}
          endYear={endYear}
          disabled={field.disabled}
        />
      );

    case "datetime":
      return (
        <DateTimePicker
          value={
            formField.value
              ? parse(formField.value.slice(0, 16), "yyyy-MM-dd'T'HH:mm", new Date())
              : undefined
          }
          onChange={(date) => {
            formField.onChange(
              date && isValid(date) ? format(date, "yyyy-MM-dd'T'HH:mm") : ""
            );
          }}
          disabled={field.disabled}
        />
      );

    case "textarea":
      return <Textarea {...formField} disabled={field.disabled} />;

    case "select":
      return (
        <Select
          value={formField.value}
          onValueChange={formField.onChange}
          disabled={field.disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${field.label}`} />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(field.options || {}).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "checkbox":
      return (
        <Checkbox
          checked={formField.value}
          onCheckedChange={formField.onChange}
          disabled={field.disabled}
        />
      );

    case "phone":
      return (
        <Input
          type="tel"
          {...formField}
          disabled={field.disabled}
          placeholder="(XXX) XXX-XXXX"
        />
      );

    default:
      return <Input {...formField} disabled={field.disabled} />;
  }
}

/**
 * FormField component - renders a single form field based on config
 */
export default function FormField({ field, form }) {
  return (
    <ShadcnFormField
      control={form.control}
      name={field.key}
      render={({ field: formField }) => (
        <FormItem className={field.fullWidth ? "col-span-2" : ""}>
          <FormLabel>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>{renderInput(field, formField)}</FormControl>
          {field.description && (
            <FormDescription>{field.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
