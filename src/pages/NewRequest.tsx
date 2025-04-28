
import { Navbar } from "@/components/Navbar";
import { RequireAuth } from "@/components/RequireAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { FileCheck } from "lucide-react";
import { PatientSection } from "@/components/requests/form/PatientSection";
import { LocationSection } from "@/components/requests/form/LocationSection";
import { TransportTypeSection } from "@/components/requests/form/TransportTypeSection";
import { AdditionalInfoSection } from "@/components/requests/form/AdditionalInfoSection";
import { useRequestForm } from "@/hooks/useRequestForm";

const NewRequest = () => {
  const navigate = useNavigate();
  const {
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
  } = useRequestForm();

  return (
    <RequireAuth allowedRoles={['admin', 'hospital', 'individual']}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
              Nueva Solicitud de Transporte
            </h1>
            
            <Card>
              <CardHeader>
                <CardTitle>Formulario de Solicitud</CardTitle>
                <CardDescription>
                  Complete todos los campos para solicitar un transporte sanitario
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {(error || submitError) && (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error || submitError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <PatientSection 
                    patientName={formData.patientName}
                    patientId={formData.patientId}
                    responsiblePerson={formData.responsiblePerson}
                    onChange={handleChange}
                  />
                  
                  <LocationSection 
                    origin={formData.origin}
                    destination={formData.destination}
                    onChange={handleChange}
                  />
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateTime">Fecha y hora deseada *</Label>
                    <Input
                      id="dateTime"
                      name="dateTime"
                      type="datetime-local"
                      value={formData.dateTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <TransportTypeSection 
                    transportType={formData.transportType}
                    onValueChange={handleRadioChange}
                  />
                  
                  <AdditionalInfoSection 
                    architecturalBarriers={formData.architecturalBarriers}
                    specialAttention={formData.specialAttention}
                    observations={formData.observations}
                    onChange={handleChange}
                  />
                  
                  {(user?.role === 'individual' || user?.role === 'admin') && (
                    <div className="space-y-2">
                      <Label htmlFor="authorizationFile">
                        Autorización médica (PDF) {user?.role === 'individual' ? '*' : ''}
                      </Label>
                      <div className="border rounded-md p-2">
                        <Input
                          id="authorizationFile"
                          name="authorizationFile"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="mb-2"
                          required={user?.role === 'individual'}
                        />
                        {uploadedFile && (
                          <div className="flex items-center text-sm text-green-600 mt-2">
                            <FileCheck className="h-4 w-4 mr-1" />
                            Archivo subido: {uploadedFile.name}
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {user?.role === 'individual' 
                            ? 'Para usuarios particulares, es obligatorio adjuntar la autorización médica del traslado en formato PDF.'
                            : 'Adjunte la autorización médica si está disponible.'}
                        </p>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar solicitud"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default NewRequest;
