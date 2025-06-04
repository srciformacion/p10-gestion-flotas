
import React from "react";
import Navbar from "@/components/Navbar";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const { user } = useAuth();

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Mi Perfil</h1>
            
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Datos de tu cuenta en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                  <p className="text-lg">{user?.name || "No especificado"}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg">{user?.email || "No especificado"}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Rol</label>
                  <div className="mt-1">
                    <Badge variant="secondary">
                      {user?.role === 'individual' && 'Usuario Individual'}
                      {user?.role === 'hospital' && 'Hospital'}
                      {user?.role === 'admin' && 'Administrador'}
                      {user?.role === 'transport_team' && 'Conductor'}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID de Usuario</label>
                  <p className="text-sm text-muted-foreground">{user?.id}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default Profile;
