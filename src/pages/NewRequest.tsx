
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RequireAuth } from "@/components/RequireAuth";
import { useCreateRequest } from "@/hooks/useCreateRequest";
import { toast } from "sonner";
import { FileCheck, Upload } from "lucide-react";

const NewRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
      
      // Validamos que sea un archivo PDF
      if (file.type !== 'application/pdf') {
        setError("El archivo debe ser un documento PDF");
        return;
      }
      
      // Validamos el tamaño del archivo (máx. 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("El archivo no puede superar los 5MB");
        return;
      }
      
      setUploadedFile(file);
      setFormData(prev => ({ ...prev, authorizationFile: file.name }));
      
      // Limpiamos cualquier error previo relacionado con el archivo
      if (error.includes("autorización")) {
        setError("");
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validación básica
    if (!formData.patientName || !formData.patientId || !formData.origin || 
        !formData.destination || !formData.dateTime || !formData.responsiblePerson) {
      setError("Por favor, complete todos los campos obligatorios");
      return;
    }
    
    // Validación específica para usuarios particulares
    if (user?.role === 'individual' && !uploadedFile) {
      setError("Como usuario particular, debe adjuntar la autorización médica");
      return;
    }
    
    // En un sistema real, aquí se enviaría el archivo al servidor
    // Por ahora, simulamos que guardamos la referencia
    const requestData = {
      ...formData,
      createdBy: user?.id || "",
    };
    
    try {
      await createRequest(requestData);
      toast.success("Solicitud creada correctamente", {
        description: "Su solicitud ha sido registrada y está pendiente de aprobación"
      });
    } catch (err) {
      console.error("Error al crear la solicitud:", err);
    }
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  {(error || submitError) && (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error || submitError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Nombre del paciente *</Label>
                      <Input
                        id="patientName"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="patientId">DNI/NIE o SS del paciente *</Label>
                      <Input
                        id="patientId"
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="responsiblePerson">Persona responsable del traslado *</Label>
                    <Input
                      id="responsiblePerson"
                      name="responsiblePerson"
                      placeholder="Médico, enfermero, etc."
                      value={formData.responsiblePerson}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="origin">Centro de origen *</Label>
                      <Input
                        id="origin"
                        name="origin"
                        value={formData.origin}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destino *</Label>
                      <Input
                        id="destination"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
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
                  
                  <div className="space-y-2">
                    <Label>Medio requerido *</Label>
                    <RadioGroup 
                      value={formData.transportType} 
                      onValueChange={handleRadioChange}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="stretcher" id="stretcher" />
                        <Label htmlFor="stretcher">Camilla</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="wheelchair" id="wheelchair" />
                        <Label htmlFor="wheelchair">Silla de ruedas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="walking" id="walking" />
                        <Label htmlFor="walking">Andando</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="architecturalBarriers">Barreras arquitectónicas</Label>
                    <Input
                      id="architecturalBarriers"
                      name="architecturalBarriers"
                      placeholder="Escaleras, ascensor no operativo, etc."
                      value={formData.architecturalBarriers}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialAttention">Necesidades especiales</Label>
                    <Input
                      id="specialAttention"
                      name="specialAttention"
                      placeholder="Oxígeno, monitor, etc."
                      value={formData.specialAttention}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="observations">Observaciones médicas adicionales</Label>
                    <Textarea
                      id="observations"
                      name="observations"
                      placeholder="Indique cualquier información relevante para el traslado"
                      value={formData.observations}
                      onChange={handleChange}
                    />
                  </div>
                  
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
