import React from "react";
import Navbar from "@/components/Navbar";
import { RequireAuth } from "@/components/RequireAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminSettings = () => {
  return (
    <RequireAuth allowedRoles={["admin"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Configuración del Sistema</h1>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Configuración General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nombre del Sitio</Label>
                  <Input id="siteName" placeholder="AmbulLink" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Email de Soporte</Label>
                  <Input id="supportEmail" type="email" placeholder="soporte@ambulink.com" />
                </div>
                <Button>Guardar Cambios</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default AdminSettings;
