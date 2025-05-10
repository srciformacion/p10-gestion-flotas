import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth";
import { ServiceType, TripType, TransportType, RecurrenceType } from '@/types';
import { useRequests } from "@/context/requests";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { addDays, format, isWeekend, getDay } from "date-fns";

export interface AdvancedRequestFormData {
  patientName: string;
  patientId: string;
  origin: string;
  destination: string;
  responsiblePerson: string;
  recurrenceType: RecurrenceType;
  startDate: string;
  endDate: string;
  weekdays: string[];
  pickupTime: string;
  returnTime?: string;
  excludeHolidays: boolean;
  transportType: TransportType;
  serviceType: ServiceType;
  tripType: TripType;
  observations: string;
}

export interface GeneratedTrip {
  date: string;
  time: string;
  isReturn: boolean;
}

// Mock holidays data (in a real app, this would come from an API)
const HOLIDAYS_2025 = [
  "2025-01-01", // Año Nuevo
  "2025-01-06", // Reyes Magos
  "2025-04-18", // Viernes Santo
  "2025-05-01", // Día del Trabajo
  "2025-08-15", // Asunción de la Virgen
  "2025-10-12", // Fiesta Nacional de España
  "2025-11-01", // Todos los Santos
  "2025-12-06", // Día de la Constitución
  "2025-12-08", // Inmaculada Concepción
  "2025-12-25", // Navidad
];

export const useAdvancedRequestForm = () => {
  const { user } = useAuth();
  const { addRequest } = useRequests();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<AdvancedRequestFormData>({
    patientName: "",
    patientId: "",
    origin: "",
    destination: "",
    responsiblePerson: "",
    recurrenceType: "dateRange",
    startDate: "",
    endDate: "",
    weekdays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    pickupTime: "",
    transportType: "stretcher",
    serviceType: "consultation",
    tripType: "oneWay",
    observations: "",
    excludeHolidays: true
  });
  
  const [generatedTrips, setGeneratedTrips] = useState<GeneratedTrip[]>([]);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRadioChange = (value: TransportType) => {
    setFormData(prev => ({ ...prev, transportType: value }));
  };

  const handleServiceTypeChange = (value: ServiceType) => {
    setFormData(prev => ({ ...prev, serviceType: value }));
  };

  const handleTripTypeChange = (value: TripType) => {
    setFormData(prev => ({ ...prev, tripType: value }));
  };
  
  const handleRecurrenceTypeChange = (value: RecurrenceType) => {
    setFormData(prev => ({ ...prev, recurrenceType: value }));
  };
  
  const handleWeekdayChange = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      weekdays: checked 
        ? [...prev.weekdays, day]
        : prev.weekdays.filter(d => d !== day)
    }));
  };
  
  const isHoliday = (dateStr: string): boolean => {
    return HOLIDAYS_2025.includes(dateStr);
  };
  
  const getWeekdayIndex = (day: string): number => {
    const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    return weekdays.indexOf(day);
  };
  
  const generateTrips = useCallback(() => {
    if (!formData.startDate || !formData.endDate || !formData.pickupTime) {
      return [];
    }
    
    const trips: GeneratedTrip[] = [];
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (start > end) {
      return [];
    }
    
    // Map days of week from strings to numbers (0 = Monday, 4 = Friday)
    const selectedDays = formData.weekdays.map(day => getWeekdayIndex(day));
    
    let currentDate = start;
    while (currentDate <= end) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      const weekday = getDay(currentDate); // 0 = Sunday, 6 = Saturday
      const adjustedWeekday = weekday === 0 ? 6 : weekday - 1; // Convert to 0 = Monday, 6 = Sunday
      
      const isWeekdaySelected = formData.recurrenceType === 'dateRange' 
        ? !isWeekend(currentDate) // For date range, include all weekdays
        : selectedDays.includes(adjustedWeekday); // For weekly, check if this day is selected
      
      const isDateHoliday = formData.excludeHolidays && isHoliday(dateStr);
      
      if (isWeekdaySelected && !isDateHoliday) {
        // Add outbound trip
        trips.push({
          date: dateStr,
          time: formData.pickupTime,
          isReturn: false
        });
        
        // Add return trip if needed
        if (formData.tripType === 'roundTrip' && formData.pickupTime) {
          trips.push({
            date: dateStr,
            time: formData.pickupTime, // In a real app, add some hours to the pickup time
            isReturn: true
          });
        }
      }
      
      currentDate = addDays(currentDate, 1);
    }
    
    return trips;
  }, [formData]);
  
  const generatePreview = () => {
    setIsGenerating(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      const trips = generateTrips();
      setGeneratedTrips(trips);
      setIsGenerating(false);
      
      if (trips.length === 0) {
        setError("No se han podido generar traslados con los criterios seleccionados. Por favor, revise las fechas y días seleccionados.");
      } else {
        setError("");
      }
    }, 1000);
  };
  
  const validateForm = (): boolean => {
    // Basic validation
    if (!formData.patientName || !formData.patientId || !formData.origin || 
        !formData.destination || !formData.startDate || !formData.endDate ||
        !formData.pickupTime || !formData.responsiblePerson) {
      setError("Por favor, complete todos los campos obligatorios");
      return false;
    }
    
    // Validate date range
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end <= start) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio");
      return false;
    }
    
    // If weekly recurrence is selected, at least one weekday must be selected
    if (formData.recurrenceType === 'weekly' && formData.weekdays.length === 0) {
      setError("Debe seleccionar al menos un día de la semana");
      return false;
    }
    
    return true;
  };
  
  const createIndividualRequests = async () => {
    if (generatedTrips.length === 0) {
      setError("No hay traslados para crear. Actualice la vista previa.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // In a real app, we would batch this or use a specialized API endpoint
      for (const trip of generatedTrips) {
        const requestData = {
          patientName: formData.patientName,
          patientId: formData.patientId,
          origin: formData.origin,
          destination: formData.destination,
          responsiblePerson: formData.responsiblePerson,
          dateTime: `${trip.date}T${trip.time}`,
          transportType: formData.transportType,
          serviceType: formData.serviceType,
          // Fix: Ensure tripType is always of TripType enum
          tripType: trip.isReturn ? 'roundTrip' as TripType : 'oneWay' as TripType,
          observations: `Parte de una solicitud recurrente. ${formData.observations || ''}`,
          createdBy: user?.id || "",
          isAdvancedRequest: true,
          advancedRequestDetails: {
            recurrenceType: formData.recurrenceType,
            startDate: formData.startDate,
            endDate: formData.endDate,
            weekdays: formData.weekdays,
            excludeHolidays: formData.excludeHolidays
          }
        };
        
        await addRequest(requestData);
      }
      
      toast({
        title: "Solicitudes creadas",
        description: `Se han creado ${generatedTrips.length} solicitudes de transporte correctamente`,
      });
      
      navigate("/solicitudes");
    } catch (err) {
      setSubmitError("Error al crear las solicitudes. Inténtelo de nuevo más tarde.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!validateForm()) {
      return;
    }
    
    await createIndividualRequests();
  };
  
  // Generate preview when form data changes
  useEffect(() => {
    setGeneratedTrips([]);
  }, [formData.recurrenceType, formData.startDate, formData.endDate, formData.weekdays, formData.excludeHolidays, formData.tripType]);

  return {
    formData,
    generatedTrips,
    error,
    submitError,
    isSubmitting,
    isGenerating,
    handleChange,
    handleRadioChange,
    handleServiceTypeChange,
    handleTripTypeChange,
    handleRecurrenceTypeChange,
    handleWeekdayChange,
    generatePreview,
    handleSubmit,
    user
  };
};
