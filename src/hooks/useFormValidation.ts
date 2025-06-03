
import { useState } from 'react';

export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  custom?: (value: string) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (name: string, value: string): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || value.trim() === '')) {
      return 'Este campo es obligatorio';
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim() === '') {
      return null;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      if (name === 'email') return 'Ingrese un email válido';
      if (name === 'phone') return 'Ingrese un teléfono válido (ej: +34 941 123 456)';
      if (name === 'patientId') return 'Ingrese un DNI/NIE válido (ej: 12345678A o X1234567A)';
      return 'Formato inválido';
    }

    // Length validations
    if (rule.minLength && value.length < rule.minLength) {
      return `Debe tener al menos ${rule.minLength} caracteres`;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return `No puede exceder ${rule.maxLength} caracteres`;
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  };

  const validateForm = (formData: Record<string, string>): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName] || '');
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const validateSingleField = (name: string, value: string) => {
    const error = validateField(name, value);
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
  name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/
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
  }
};
