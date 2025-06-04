
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCreateRequest } from "@/hooks/useCreateRequest";
import { 
  useFormValidation, 
  commonValidationRules, 
  createCrossFieldValidations 
} from "@/hooks/useFormValidation";

export const useRequestForm = () => {
  const { user } = useAuth();
  const { submitRequest, isLoading } = useCreateRequest();
  
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    origin: "",
    destination: "",
    responsiblePerson: "",
    dateTime: "",
    transportType: "stretcher" as "stretcher" | "wheelchair" | "walking",
    observations: "",
    authorizationFile: "",
    architecturalBarriers: "",
    specialAttention: ""
  });
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Validation rules for the request form
  const validationRules = {
    patientName: commonValidationRules.name,
    patientId: commonValidationRules.patientId,
    origin: commonValidationRules.location,
    destination: commonValidationRules.location,
    responsiblePerson: commonValidationRules.responsiblePerson,
    dateTime: {
      required: true,
      custom: (value: string) => {
        if (!value) return null;
        const selectedDate = new Date(value);
        const now = new Date();
        if (selectedDate < now) {
          return "La fecha debe ser futura";
        }
        return null;
      }
    },
    transportType: {
      required: true,
      custom: (value: string, formData?: Record<string, any>) => {
        // Validación contextual basada en observaciones
        if (formData?.observations && formData.observations.toLowerCase().includes('urgente') && value === 'walking') {
          return "Para casos urgentes se recomienda transporte en camilla o silla de ruedas";
        }
        return null;
      }
    }
  };

  // Cross-field validations
  const crossFieldValidations = [
    createCrossFieldValidations.fieldsDifferent(
      'origin', 
      'destination', 
      'El destino debe ser diferente al origen'
    ),
    {
      fields: ['specialAttention', 'transportType'],
      validator: (formData) => {
        if (formData.specialAttention?.toLowerCase().includes('oxígeno') && formData.transportType === 'walking') {
          return { 
            field: 'transportType', 
            error: 'Pacientes con oxígeno requieren transporte en camilla o silla de ruedas' 
          };
        }
        return null;
      }
    }
  ];

  const { errors, validateForm, validateSingleField, clearError } = useFormValidation(
    validationRules, 
    crossFieldValidations
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      clearError(name);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    validateSingleField(name, value, formData);
  };
  
  const handleRadioChange = (value: "stretcher" | "wheelchair" | "walking") => {
    setFormData(prev => ({ ...prev, transportType: value }));
    // Revalidate transport type with current form data
    validateSingleField('transportType', value, { ...formData, transportType: value });
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.type !== 'application/pdf') {
        validateSingleField('authorizationFile', 'invalid-type');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        validateSingleField('authorizationFile', 'too-large');
        return;
      }
      
      setUploadedFile(file);
      setFormData(prev => ({ ...prev, authorizationFile: file.name }));
      clearError('authorizationFile');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required file for individual users
    if (user?.role === 'individual' && !uploadedFile) {
      validateSingleField('authorizationFile', 'required-file');
      return;
    }
    
    // Validate all form fields with cross-field validations
    const isValid = validateForm(formData);
    if (!isValid) {
      return;
    }
    
    const requestData = {
      ...formData,
      createdBy: user?.id || "",
    };
    
    await submitRequest(requestData);
  };

  return {
    formData,
    errors,
    submitError: null,
    isSubmitting: isLoading,
    uploadedFile,
    handleChange,
    handleBlur,
    handleRadioChange,
    handleFileUpload,
    handleSubmit,
    user
  };
};
