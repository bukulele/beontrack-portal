"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { parse, format, isValid } from 'date-fns';
import { getOptionList } from '@/config/clientData';
import NumericInput from '../numericInput/NumericInput';

/**
 * FieldRenderer Component
 *
 * Dynamically renders form fields based on field type configuration
 *
 * @param {Object} field - Field configuration
 * @param {*} value - Current field value
 * @param {Function} onChange - Value change handler
 * @param {string} error - Validation error message
 */
export function FieldRenderer({ field, value, onChange, error }) {
  const { type, name, label, required, options, props = {}, validation = {}, dateRange } = field;

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

  // Common label component
  const FieldLabel = () => (
    <Label htmlFor={name} className="text-sm font-medium text-slate-700">
      {label || name}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
  );

  // Render based on field type
  switch (type) {
    case 'text':
    case 'email':
    case 'phone':
      return (
        <div className="space-y-1.5">
          <FieldLabel />
          <Input
            id={name}
            name={name}
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={error ? 'border-red-500' : ''}
            {...props}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-1.5">
          <FieldLabel />
          <Textarea
            id={name}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={error ? 'border-red-500' : ''}
            {...props}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      );

    case 'number':
      return (
        <div className="space-y-1.5">
          <FieldLabel />
          <NumericInput
            id={name}
            name={name}
            value={value || ''}
            onChange={(val) => onChange(val)}
            className={error ? 'border-red-500' : ''}
            {...props}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      );

    case 'select':
      // Get options from clientData or use provided options
      const optionsList = typeof options === 'string'
        ? getOptionList(options)
        : options || [];

      return (
        <div className="space-y-1.5">
          <FieldLabel />
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={props.placeholder || 'Select an option...'} />
            </SelectTrigger>
            <SelectContent>
              {optionsList.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      );

    case 'date':
      // Get date range from field config
      const startYear = dateRange?.start
        ? getYearFromRange(dateRange.start)
        : 1900;
      const endYear = dateRange?.end
        ? getYearFromRange(dateRange.end)
        : 2100;

      return (
        <div className="space-y-1.5">
          <FieldLabel />
          <DatePicker
            value={
              value
                ? parse(value, 'yyyy-MM-dd', new Date())
                : undefined
            }
            onChange={(date) => {
              onChange(date && isValid(date) ? format(date, 'yyyy-MM-dd') : '');
            }}
            startYear={startYear}
            endYear={endYear}
            className={error ? 'border-red-500' : ''}
            {...props}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      );

    case 'checkbox':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={name}
            checked={!!value}
            onCheckedChange={onChange}
            {...props}
          />
          <FieldLabel />
          {error && <p className="text-xs text-red-500 ml-2">{error}</p>}
        </div>
      );

    case 'file':
      // File input is handled separately in FileInput component
      return null;

    default:
      console.warn(`Unknown field type: ${type}`);
      return (
        <div className="space-y-1.5">
          <FieldLabel />
          <Input
            id={name}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            {...props}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      );
  }
}

export default FieldRenderer;
