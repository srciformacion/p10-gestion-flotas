
import { useState } from 'react';

export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  custom?: (value: any, formData?: Record<string, any>) => string | null;
}

export interface CrossFieldValidation {
  fields: string[];
  validator: (formData: Record<string, any>) => { field: string; error: string } | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = (
  rules: ValidationRules, 
  crossFieldRules?: CrossFieldValidation[]
) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (name: string, value: any, formData?: Record<string, any>): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    // Skip validation for boolean fields unless they have custom validation
    if (typeof value === 'boolean') {
      if (rule.custom) {
        return rule.custom(value, formData);
      }
      return null;
    }

    // Convert to string for validation
    const stringValue = String(value || '');

    // Required validation
    if (rule.required && (!stringValue || stringValue.trim() === '')) {
      return 'Este campo es obligatorio';
    }

    // Skip other validations if field is empty and not required
    if (!stringValue || stringValue.trim() === '') {
      return null;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(stringValue)) {
      if (name === 'email') return 'Ingrese un email válido';
      if (name === 'phone') return 'Ingrese un teléfono válido (ej: +34 941 123 456)';
      if (name === 'patientId') return 'Ingrese un DNI/NIE válido (ej: 12345678A o X1234567A)';
      if (name === 'postalCode') return 'Ingrese un código postal válido (5 dígitos)';
      return 'Formato inválido';
    }

    // Length validations
    if (rule.minLength && stringValue.length < rule.minLength) {
      return `Debe tener al menos ${rule.minLength} caracteres`;
    }

    if (rule.maxLength && stringValue.length > rule.maxLength) {
      return `No puede exceder ${rule.maxLength} caracteres`;
    }

    // Custom validation with access to full form data
    if (rule.custom) {
      return rule.custom(value, formData);
    }

    return null;
  };

  const validateCrossFields = (formData: Record<string, any>): ValidationErrors => {
    const crossErrors: ValidationErrors = {};
    
    if (crossFieldRules) {
      crossFieldRules.forEach(crossRule => {
        const result = crossRule.validator(formData);
        if (result) {
          crossErrors[result.field] = result.error;
        }
      });
    }
    
    return crossErrors;
  };

  const validateForm = (formData: Record<string, any>): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Validate individual fields
    Object.keys(rules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName], formData);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    // Validate cross-field rules
    const crossErrors = validateCrossFields(formData);
    Object.assign(newErrors, crossErrors);
    if (Object.keys(crossErrors).length > 0) {
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateSingleField = (name: string, value: any, formData?: Record<string, any>) => {
    const error = validateField(name, value, formData);
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
    return error;
  };

  const clearError = (name: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateForm,
    validateSingleField,
    clearError,
    clearAllErrors
  };
};

// Common validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+34|0034|34)?[6789]\d{8}$/,
  dni: /^[0-9]{8}[A-Z]$/,
  nie: /^[XYZ][0-9]{7}[A-Z]$/,
  dniOrNie: /^([0-9]{8}[A-Z]|[XYZ][0-9]{7}[A-Z])$/,
  postalCode: /^[0-9]{5}$/,
  name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/,
  organization: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\.]{2,}$/
};

// Common validation rules
export const commonValidationRules = {
  email: {
    required: true,
    pattern: validationPatterns.email
  },
  phone: {
    required: true,
    pattern: validationPatterns.phone
  },
  name: {
    required: true,
    pattern: validationPatterns.name,
    minLength: 2,
    maxLength: 100
  },
  patientId: {
    required: true,
    pattern: validationPatterns.dniOrNie
  },
  location: {
    required: true,
    minLength: 3,
    maxLength: 200
  },
  responsiblePerson: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  postalCode: {
    pattern: validationPatterns.postalCode
  },
  organization: {
    pattern: validationPatterns.organization,
    minLength: 2,
    maxLength: 200
  }
};

// Cross-field validation helpers
export const createCrossFieldValidations = {
  // Validar que dos campos sean diferentes
  fieldsDifferent: (field1: string, field2: string, errorMessage: string): CrossFieldValidation => ({
    fields: [field1, field2],
    validator: (formData) => {
      const value1 = formData[field1];
      const value2 = formData[field2];
      if (value1 && value2 && value1.trim() === value2.trim()) {
        return { field: field2, error: errorMessage };
      }
      return null;
    }
  }),

  // Validar que una fecha sea posterior a otra
  dateAfter: (laterField: string, earlierField: string, errorMessage: string): CrossFieldValidation => ({
    fields: [laterField, earlierField],
    validator: (formData) => {
      const laterDate = new Date(formData[laterField]);
      const earlierDate = new Date(formData[earlierField]);
      if (formData[laterField] && formData[earlierField] && laterDate <= earlierDate) {
        return { field: laterField, error: errorMessage };
      }
      return null;
    }
  }),

  // Validar coherencia entre campos
  conditionalRequired: (
    dependentField: string, 
    conditionField: string, 
    conditionValue: any, 
    errorMessage: string
  ): CrossFieldValidation => ({
    fields: [dependentField, conditionField],
    validator: (formData) => {
      if (formData[conditionField] === conditionValue && !formData[dependentField]) {
        return { field: dependentField, error: errorMessage };
      }
      return null;
    }
  })
};
