
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
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
    transportType: "stretcher" as "stretcher" | "wheelchair" | "walking",
    observations: "",
    authorizationFile: "",
    architecturalBarriers: "",
    specialAttention: ""
  });
  
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRadioChange = (value: "stretcher" | "wheelchair" | "walking") => {
    setFormData(prev => ({ ...prev, transportType: value }));
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.patientName || !formData.patientId || !formData.origin || 
        !formData.destination || !formData.dateTime || !formData.responsiblePerson) {
      setError("Por favor, complete todos los campos obligatorios");
      return;
    }
    
    if (user?.role === 'individual' && !uploadedFile) {
      setError("Como usuario particular, debe adjuntar la autorización médica");
      return;
    }
    
    const requestData = {
      ...formData,
      createdBy: user?.id || "",
    };
    
    await createRequest(requestData);
  };

  return {
    formData,
    error,
    submitError,
    isSubmitting,
    uploadedFile,
    handleChange,
    handleRadioChange,
    handleFileUpload,
    handleSubmit,
    user
  };
};
