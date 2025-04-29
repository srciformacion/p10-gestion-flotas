
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { RequireAuth } from "@/components/RequireAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAdvancedRequestForm } from "@/hooks/useAdvancedRequestForm";
import { PatientSection } from "@/components/requests/form/PatientSection";
import { LocationSection } from "@/components/requests/form/LocationSection";
import { TransportTypeSection } from "@/components/requests/form/TransportTypeSection";
import { RecurrenceSection } from "@/components/requests/form/RecurrenceSection";
import { ServiceTypeSection } from "@/components/requests/form/ServiceTypeSection";
import { TripTypeSection } from "@/components/requests/form/TripTypeSection";
import { GeneratedTripsPreview } from "@/components/requests/form/GeneratedTripsPreview";
import { Steps } from "@/components/ui/steps";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NewAdvancedRequest = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const {
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
  } = useAdvancedRequestForm();

  const steps = [
    { title: "Información del paciente", description: "Datos del paciente y tipo de servicio" },
    { title: "Programación", description: "Configure la recurrencia y fechas" },
    { title: "Ubicaciones", description: "Origen y destino del transporte" },
    { title: "Configuración", description: "Tipo de transporte y opciones adicionales" },
    { title: "Confirmación", description: "Revise los traslados que se generarán" },
  ];

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePreview = () => {
    generatePreview();
  };
  
  return (
    <RequireAuth allowedRoles={['admin', 'hospital']}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
              Nueva Solicitud de Transporte Avanzada
            </h1>
            
            <div className="mb-8">
              <Steps 
                currentStep={currentStep} 
                steps={steps.map(step => ({ title: step.title, description: step.description }))} 
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>{steps[currentStep].title}</CardTitle>
                <CardDescription>{steps[currentStep].description}</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  {(error || submitError) && (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error || submitError}</AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Step 1: Patient Information */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <PatientSection 
                        patientName={formData.patientName}
                        patientId={formData.patientId}
                        responsiblePerson={formData.responsiblePerson}
                        onChange={handleChange}
                      />
                      
                      <ServiceTypeSection
                        serviceType={formData.serviceType}
                        onValueChange={handleServiceTypeChange}
                      />
                    </div>
                  )}
                  
                  {/* Step 2: Schedule Configuration */}
                  {currentStep === 1 && (
                    <RecurrenceSection 
                      recurrenceType={formData.recurrenceType}
                      startDate={formData.startDate}
                      endDate={formData.endDate}
                      weekdays={formData.weekdays}
                      pickupTime={formData.pickupTime}
                      returnTime={formData.returnTime}
                      excludeHolidays={formData.excludeHolidays}
                      onRecurrenceTypeChange={handleRecurrenceTypeChange}
                      onWeekdayChange={handleWeekdayChange}
                      onChange={handleChange}
                    />
                  )}
                  
                  {/* Step 3: Location Information */}
                  {currentStep === 2 && (
                    <LocationSection 
                      origin={formData.origin}
                      destination={formData.destination}
                      onChange={handleChange}
                    />
                  )}
                  
                  {/* Step 4: Transport Configuration */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <TripTypeSection
                        tripType={formData.tripType}
                        onValueChange={handleTripTypeChange}
                      />
                      
                      <TransportTypeSection 
                        transportType={formData.transportType}
                        onValueChange={handleRadioChange}
                      />
                    </div>
                  )}
                  
                  {/* Step 5: Preview and Confirmation */}
                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Vista previa de traslados</h3>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={handlePreview}
                          disabled={isGenerating}
                        >
                          {isGenerating ? "Generando..." : "Actualizar vista previa"}
                        </Button>
                      </div>
                      
                      <GeneratedTripsPreview 
                        trips={generatedTrips} 
                        isLoading={isGenerating} 
                        formData={formData}
                      />
                    </div>
                  )}
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                {currentStep > 0 && (
                  <Button variant="outline" onClick={goToPrevStep}>
                    Anterior
                  </Button>
                )}
                
                {currentStep === 0 && (
                  <Button variant="outline" onClick={() => navigate(-1)}>
                    Cancelar
                  </Button>
                )}
                
                {currentStep < steps.length - 1 && (
                  <Button onClick={goToNextStep}>
                    Siguiente
                  </Button>
                )}
                
                {currentStep === steps.length - 1 && (
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || generatedTrips.length === 0}
                  >
                    {isSubmitting ? "Enviando..." : "Crear solicitudes"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default NewAdvancedRequest;
