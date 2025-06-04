
import { useState } from 'react';
import { useRequests } from '@/context/RequestsProvider';
import { TransportRequest } from '@/types/request';
import { useToast } from '@/hooks/use-toast';

export const useCreateRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { createRequest } = useRequests();
  const { toast } = useToast();

  const submitRequest = async (requestData: Omit<TransportRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'type' | 'priority'>) => {
    setIsLoading(true);
    try {
      const newRequest = await createRequest(requestData);
      toast({
        title: "Solicitud creada",
        description: "La solicitud se ha creado correctamente",
      });
      return newRequest;
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la solicitud",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitRequest,
    isLoading
  };
};
