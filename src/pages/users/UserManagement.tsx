
import { useState } from "react";
import { Plus, Search, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockUsers } from "@/services/api/mock-data";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin: 'Administrador',
      centroCoordinador: 'Centro Coordinador',
      hospital: 'Hospital',
      individual: 'Usuario Individual',
      equipoMovil: 'Equipo Móvil',
      ambulance: 'Ambulancia'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                {user.isActive ? (
                  <UserCheck className="h-5 w-5 text-green-500" />
                ) : (
                  <UserX className="h-5 w-5 text-red-500" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="outline">
                  {getRoleDisplayName(user.role)}
                </Badge>
                {user.organization && (
                  <p><strong>Organización:</strong> {user.organization}</p>
                )}
                {user.phone && (
                  <p><strong>Teléfono:</strong> {user.phone}</p>
                )}
                {user.lastLogin && (
                  <p className="text-sm text-muted-foreground">
                    Último acceso: {new Date(user.lastLogin).toLocaleDateString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
