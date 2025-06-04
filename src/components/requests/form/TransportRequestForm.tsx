
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PatientSection } from "./PatientSection";
import { LocationSection } from "./LocationSection";
import { TransportTypeSection } from "./TransportTypeSection";
import { AdditionalInfoSection } from "./AdditionalInfoSection";
import { useRequestForm } from "@/hooks/useRequestForm";

export const TransportRequestForm = () => {
  const {
    formData,
    errors,
    isSubmitting,
    uploadedFile,
    handleChange,
    handleBlur,
    handleRadioChange,
    handleFileUpload,
    handleSubmit,
    user
  } = useRequestForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientSection
            patientName={formData.patientName}
            patientId={formData.patientId}
            responsiblePerson={formData.responsiblePerson}
            onChange={handleChange}
          />
          {errors.patientName && (
            <p className="text-sm text-red-600 mt-1">{errors.patientName}</p>
          )}
          {errors.patientId && (
            <p className="text-sm text-red-600 mt-1">{errors.patientId}</p>
          )}
          {errors.responsiblePerson && (
            <p className="text-sm text-red-600 mt-1">{errors.responsiblePerson}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ubicaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <LocationSection
            origin={formData.origin}
            destination={formData.destination}
            onChange={handleChange}
          />
          {errors.origin && (
            <p className="text-sm text-red-600 mt-1">{errors.origin}</p>
          )}
          {errors.destination && (
            <p className="text-sm text-red-600 mt-1">{errors.destination}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Programación y Transporte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dateTime">Fecha y hora programada *</Label>
            <Input
              id="dateTime"
              name="dateTime"
              type="datetime-local"
              value={formData.dateTime}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {errors.dateTime && (
              <p className="text-sm text-red-600">{errors.dateTime}</p>
            )}
          </div>

          <TransportTypeSection
            transportType={formData.transportType}
            onValueChange={handleRadioChange}
          />
          {errors.transportType && (
            <p className="text-sm text-red-600">{errors.transportType}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información Adicional</CardTitle>
        </CardHeader>
        <CardContent>
          <AdditionalInfoSection
            architecturalBarriers={formData.architecturalBarriers}
            specialAttention={formData.specialAttention}
            observations={formData.observations}
            onChange={handleChange}
          />
        </CardContent>
      </Card>

      {user?.role === 'individual' && (
        <Card>
          <CardHeader>
            <CardTitle>Autorización Médica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="authorizationFile">Archivo de autorización (PDF) *</Label>
              <Input
                id="authorizationFile"
                name="authorizationFile"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                required={user?.role === 'individual'}
              />
              {uploadedFile && (
                <p className="text-sm text-green-600">Archivo cargado: {uploadedFile.name}</p>
              )}
              {errors.authorizationFile && (
                <p className="text-sm text-red-600">{errors.authorizationFile}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="min-w-32"
        >
          {isSubmitting ? "Enviando..." : "Crear Solicitud"}
        </Button>
      </div>
    </form>
  );
};
