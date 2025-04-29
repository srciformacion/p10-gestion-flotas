
import { useState } from 'react';
import { useRequests } from '@/context/requests';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { TransportRequest } from '@/types';

export const useCreateRequest = () => {
  const { addRequest } = useRequests();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createRequest = async (formData: Omit<TransportRequest, 'id' | 'status'>) => {
    setError("");
    setIsSubmitting(true);

    try {
      await addRequest(formData);
      
      toast({
        title: "Solicitud creada",
        description: "Su solicitud de transporte ha sido registrada correctamente",
      });
      
      navigate("/solicitudes");
    } catch (err) {
      setError("Error al crear la solicitud. Inténtelo de nuevo más tarde.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }

    return { error, isSubmitting };
  };

  return { createRequest, error, isSubmitting };
};
