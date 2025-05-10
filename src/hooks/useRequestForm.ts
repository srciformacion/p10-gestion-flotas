
import { useState, useCallback } from "react";
import { useAuth } from "@/context/auth";
import { ServiceType, TripType, TransportType } from '@/types';
import { useCreateRequest } from "@/hooks/useCreateRequest";

export const useRequestForm = () => {
  const { user } = useAuth();
  const { createRequest, error: submitError, isSubmitting } = useCreateRequest();
  
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    origin: "",
    destination: "",
    responsiblePerson: "",
    dateTime: "",
    returnDateTime: "", // For round trips
    transportType: "stretcher" as TransportType,
    serviceType: "consultation" as ServiceType,
    tripType: "oneWay" as TripType,
    observations: "",
    authorizationFile: "",
    architecturalBarriers: "",
    specialAttention: "",
    requiredEquipment: [] as string[]
  });
  
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleRadioChange = useCallback((value: TransportType) => {
    setFormData(prev => ({ ...prev, transportType: value }));
  }, []);

  const handleServiceTypeChange = useCallback((value: ServiceType) => {
    setFormData(prev => ({ ...prev, serviceType: value }));
  }, []);

  const handleTripTypeChange = useCallback((value: TripType) => {
    setFormData(prev => ({ ...prev, tripType: value }));
  }, []);
  
  const handleEquipmentChange = useCallback((equipment: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      requiredEquipment: checked 
        ? [...prev.requiredEquipment, equipment]
        : prev.requiredEquipment.filter(item => item !== equipment)
    }));
  }, []);
  
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.type !== 'application/pdf') {
        setError("El archivo debe ser un documento PDF");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError("El archivo no puede superar los 5MB");
        return;
      }
      
      setUploadedFile(file);
      setFormData(prev => ({ ...prev, authorizationFile: file.name }));
      
      if (error.includes("autorización")) {
        setError("");
      }
    }
  }, [error]);
  
  const validateForm = useCallback((): boolean => {
    // Basic validation
    if (!formData.patientName || !formData.patientId || !formData.origin || 
        !formData.destination || !formData.dateTime || !formData.responsiblePerson) {
      setError("Por favor, complete todos los campos obligatorios");
      return false;
    }
    
    // Validate round trip
    if (formData.tripType === 'roundTrip' && !formData.returnDateTime) {
      setError("Por favor, indique la fecha y hora de vuelta");
      return false;
    }
    
    // Check if return date is after initial date for round trips
    if (formData.tripType === 'roundTrip' && formData.returnDateTime) {
      const initialDate = new Date(formData.dateTime);
      const returnDate = new Date(formData.returnDateTime);
      
      if (returnDate <= initialDate) {
        setError("La fecha de vuelta debe ser posterior a la fecha de ida");
        return false;
      }
    }
    
    // For individual users, require authorization file
    if (user?.role === 'individual' && !uploadedFile) {
      setError("Como usuario particular, debe adjuntar la autorización médica");
      return false;
    }
    
    return true;
  }, [formData, uploadedFile, user]);
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }
    
    const requestData = {
      ...formData,
      createdBy: user?.id || "",
    };
    
    await createRequest(requestData);
  }, [createRequest, formData, user, validateForm]);

  return {
    formData,
    error,
    submitError,
    isSubmitting,
    uploadedFile,
    handleChange,
    handleRadioChange,
    handleServiceTypeChange,
    handleTripTypeChange,
    handleEquipmentChange,
    handleFileUpload,
    handleSubmit,
    user
  };
};
