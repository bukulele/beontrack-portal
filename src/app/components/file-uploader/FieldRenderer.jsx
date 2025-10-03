"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
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
  const { type, name, label, required, options, props = {}, validation = {} } = field;

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
      return (
        <div className="space-y-1.5">
          <FieldLabel />
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              value={value ? moment(value) : null}
              onChange={(newValue) => {
                onChange(newValue ? newValue.format('YYYY-MM-DD') : '');
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small',
                  error: !!error,
                  className: 'w-full',
                },
              }}
              format="DD/MM/YYYY"
              {...props}
            />
          </LocalizationProvider>
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
