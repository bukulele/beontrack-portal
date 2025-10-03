/**
 * Global Field Type Registry - Layer 1
 *
 * Defines ALL possible field types that can be used in file uploaders.
 * This is universal and client-agnostic.
 *
 * Each field type defines:
 * - id: Unique identifier
 * - componentType: Which React component to render
 * - validation: Default validation rules
 * - defaultProps: Default props for the component
 * - valueTransform: How to transform value before sending to API
 */

export const FIELD_TYPES = {
  /**
   * Date Picker Field
   * Uses MUI DatePicker for date selection
   */
  DATE: {
    id: 'date',
    componentType: 'DatePicker', // MUI DatePicker
    validation: {
      type: 'date',
      required: false,
    },
    defaultProps: {
      format: 'DD/MM/YYYY',
      className: 'w-full',
    },
    valueTransform: (value) => value, // ISO string
  },

  /**
   * Text Input Field
   * Standard text input for short text
   */
  TEXT: {
    id: 'text',
    componentType: 'Input', // shadcn Input
    validation: {
      type: 'string',
      required: false,
      minLength: 0,
      maxLength: 255,
    },
    defaultProps: {
      type: 'text',
      className: 'w-full',
    },
    valueTransform: (value) => value?.trim() || '',
  },

  /**
   * Textarea Field
   * Multi-line text input for longer content
   */
  TEXTAREA: {
    id: 'textarea',
    componentType: 'Textarea', // shadcn Textarea
    validation: {
      type: 'string',
      required: false,
      minLength: 0,
      maxLength: 2000,
    },
    defaultProps: {
      rows: 4,
      className: 'w-full resize-none',
    },
    valueTransform: (value) => value?.trim() || '',
  },

  /**
   * Numeric Input Field
   * For numbers with optional formatting
   */
  NUMBER: {
    id: 'number',
    componentType: 'NumericInput', // Custom NumericInput
    validation: {
      type: 'number',
      required: false,
      min: null,
      max: null,
      pattern: null,
    },
    defaultProps: {
      className: 'w-full',
      allowNegative: false,
      allowDecimal: false,
    },
    valueTransform: (value) => value,
  },

  /**
   * Select/Dropdown Field
   * For choosing from predefined options
   */
  SELECT: {
    id: 'select',
    componentType: 'Select', // shadcn Select
    validation: {
      type: 'string',
      required: false,
      oneOf: [],
    },
    defaultProps: {
      className: 'w-full',
      placeholder: 'Select an option...',
    },
    valueTransform: (value) => value,
  },

  /**
   * File Input Field
   * For uploading files with compression/conversion
   */
  FILE: {
    id: 'file',
    componentType: 'FileInput', // Custom FileInput
    validation: {
      type: 'file',
      required: false,
      accept: '*/*',
      maxSize: 10 * 1024 * 1024, // 10MB
    },
    defaultProps: {
      className: 'w-full',
      showPreview: true,
      compress: true,
      convertHeic: true,
    },
    valueTransform: (value) => value, // File object
  },

  /**
   * Email Input Field
   * Text input with email validation
   */
  EMAIL: {
    id: 'email',
    componentType: 'Input', // shadcn Input
    validation: {
      type: 'email',
      required: false,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    defaultProps: {
      type: 'email',
      className: 'w-full',
      placeholder: 'email@example.com',
    },
    valueTransform: (value) => value?.trim().toLowerCase() || '',
  },

  /**
   * Phone Input Field
   * Text input with phone formatting
   */
  PHONE: {
    id: 'phone',
    componentType: 'Input', // shadcn Input
    validation: {
      type: 'phone',
      required: false,
      pattern: /^[\d\s\-\(\)\+]+$/,
    },
    defaultProps: {
      type: 'tel',
      className: 'w-full',
      placeholder: '(123) 456-7890',
    },
    valueTransform: (value) => value?.trim() || '',
  },

  /**
   * Checkbox Field
   * Boolean checkbox input
   */
  CHECKBOX: {
    id: 'checkbox',
    componentType: 'Checkbox', // shadcn Checkbox
    validation: {
      type: 'boolean',
      required: false,
    },
    defaultProps: {
      className: '',
    },
    valueTransform: (value) => Boolean(value),
  },

  /**
   * Switch Field
   * Toggle switch for boolean values
   */
  SWITCH: {
    id: 'switch',
    componentType: 'Switch', // shadcn Switch
    validation: {
      type: 'boolean',
      required: false,
    },
    defaultProps: {
      className: '',
    },
    valueTransform: (value) => Boolean(value),
  },
};

/**
 * Gets a field type definition by ID
 */
export function getFieldType(typeId) {
  const type = Object.values(FIELD_TYPES).find(t => t.id === typeId);
  if (!type) {
    console.warn(`Field type "${typeId}" not found in registry`);
    return null;
  }
  return type;
}

/**
 * Validates if a field type exists
 */
export function isValidFieldType(typeId) {
  return Object.values(FIELD_TYPES).some(t => t.id === typeId);
}

/**
 * Lists all available field types
 */
export function listFieldTypes() {
  return Object.values(FIELD_TYPES).map(t => t.id);
}

/**
 * Creates a complete field configuration by merging type defaults with specific config
 */
export function createFieldConfig(fieldConfig) {
  const fieldType = getFieldType(fieldConfig.type);

  if (!fieldType) {
    throw new Error(`Invalid field type: ${fieldConfig.type}`);
  }

  return {
    ...fieldType,
    ...fieldConfig,
    validation: {
      ...fieldType.validation,
      ...(fieldConfig.validation || {}),
    },
    props: {
      ...fieldType.defaultProps,
      ...(fieldConfig.props || {}),
    },
  };
}
