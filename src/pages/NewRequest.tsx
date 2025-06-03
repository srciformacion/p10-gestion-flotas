
import { Navbar } from "@/components/Navbar";
import { RequireAuth } from "@/components/RequireAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { FileCheck, AlertCircle } from "lucide-react";
import { LocationSection } from "@/components/requests/form/LocationSection";
import { TransportTypeSection } from "@/components/requests/form/TransportTypeSection";
import { AdditionalInfoSection } from "@/components/requests/form/AdditionalInfoSection";
import { useRequestForm } from "@/hooks/useRequestForm";

const NewRequest = () => {
  const navigate = useNavigate();
  const {
    formData,
    errors,
    submitError,
    isSubmitting,
    uploadedFile,
    handleChange,
    handleBlur,
    handleRadioChange,
    handleFileUpload,
    handleSubmit,
    user
  } = useRequestForm();

  const getFileError = () => {
    if (errors.authorizationFile === 'invalid-type') {
      return 'El archivo debe ser un documento PDF';
    }
    if (errors.authorizationFile === 'too-large') {
      return 'El archivo no puede superar los 5MB';
    }
    if (errors.authorizationFile === 'required-file') {
      return 'Como usuario particular, debe adjuntar la autorización médica';
    }
    return errors.authorizationFile;
  };

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
                <form onSubmit={handleSubmit} className="space-y-6">
                  {(Object.keys(errors).length > 0 || submitError) && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Errores en el formulario</AlertTitle>
                      <AlertDescription>
                        {submitError || "Por favor, corrija los errores marcados en el formulario"}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Información del Paciente</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Nombre del paciente"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.patientName}
                        required
                        placeholder="Nombre completo del paciente"
                      />
                      
                      <FormField
                        label="DNI/NIE del paciente"
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.patientId}
                        required
                        placeholder="12345678A o X1234567A"
                      />
                    </div>
                    
                    <FormField
                      label="Persona responsable del traslado"
                      name="responsiblePerson"
                      value={formData.responsiblePerson}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.responsiblePerson}
                      required
                      placeholder="Médico, enfermero, etc."
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Ubicaciones</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Centro de origen"
                        name="origin"
                        value={formData.origin}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.origin}
                        required
                        placeholder="Hospital de origen"
                      />
                      
                      <FormField
                        label="Destino"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.destination}
                        required
                        placeholder="Hospital de destino"
                      />
                    </div>
                  </div>
                  
                  <FormField
                    label="Fecha y hora deseada"
                    name="dateTime"
                    type="datetime-local"
                    value={formData.dateTime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.dateTime}
                    required
                  />
                  
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
                      <div className={`border rounded-md p-2 ${errors.authorizationFile ? 'border-destructive' : ''}`}>
                        <input
                          id="authorizationFile"
                          name="authorizationFile"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="mb-2 w-full"
                          required={user?.role === 'individual'}
                        />
                        {uploadedFile && (
                          <div className="flex items-center text-sm text-green-600 mt-2">
                            <FileCheck className="h-4 w-4 mr-1" />
                            Archivo subido: {uploadedFile.name}
                          </div>
                        )}
                        {errors.authorizationFile && (
                          <div className="flex items-center gap-2 text-sm text-destructive mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <span>{getFileError()}</span>
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
