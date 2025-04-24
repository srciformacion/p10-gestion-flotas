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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RequireAuth } from "@/components/RequireAuth";
import { useCreateRequest } from "@/hooks/useCreateRequest";

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
    authorizationFile: ""
  });
  
  const [error, setError] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRadioChange = (value: "stretcher" | "wheelchair" | "walking") => {
    setFormData(prev => ({ ...prev, transportType: value }));
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
    if (user?.role === 'individual' && !formData.authorizationFile) {
      setError("Como usuario particular, debe adjuntar la autorización médica");
      return;
    }
    
    await createRequest({
      ...formData,
      createdBy: user?.id || "",
    });
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
                    <Label htmlFor="observations">Observaciones médicas o necesidades especiales</Label>
                    <Textarea
                      id="observations"
                      name="observations"
                      placeholder="Indique cualquier información relevante para el traslado"
                      value={formData.observations}
                      onChange={handleChange}
                    />
                  </div>
                  
                  {user?.role === 'individual' && (
                    <div className="space-y-2">
                      <Label htmlFor="authorizationFile">
                        Autorización médica (PDF) *
                      </Label>
                      <Input
                        id="authorizationFile"
                        name="authorizationFile"
                        type="file"
                        accept=".pdf"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          if (e.target.files && e.target.files[0]) {
                            setFormData(prev => ({ 
                              ...prev, 
                              authorizationFile: e.target.files ? e.target.files[0].name : "" 
                            }));
                          }
                        }}
                        required
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Para usuarios particulares, es obligatorio adjuntar la autorización médica del traslado en formato PDF.
                      </p>
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
