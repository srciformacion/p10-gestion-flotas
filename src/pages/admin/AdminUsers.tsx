
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { RequireAuth } from "@/components/RequireAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserCheck, UserX, Edit } from "lucide-react";
import { mockUsers } from "@/services/api/mock-data";
import { User } from "@/types/user";

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin: 'Administrador',
      centroCoordinador: 'Centro Coordinador',
      hospital: 'Hospital',
      individual: 'Usuario Individual',
      ambulance: 'Ambulancia'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500';
      case 'centroCoordinador': return 'bg-blue-500';
      case 'hospital': return 'bg-green-500';
      case 'ambulance': return 'bg-orange-500';
      case 'individual': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive }
        : user
    ));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  return (
    <RequireAuth allowedRoles={["admin"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Gestión de Usuarios</h1>
            
            {/* Filtros */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="all">Todos los roles</option>
                    <option value="admin">Administrador</option>
                    <option value="centroCoordinador">Centro Coordinador</option>
                    <option value="hospital">Hospital</option>
                    <option value="ambulance">Ambulancia</option>
                    <option value="individual">Usuario Individual</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usuarios del Sistema ({filteredUsers.length} de {users.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Organización</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Último Acceso</TableHead>
                      <TableHead>Fecha Registro</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                            {user.phone && (
                              <div className="text-sm text-muted-foreground">{user.phone}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getRoleBadgeColor(user.role)} text-white`}>
                            {getRoleDisplayName(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.organization || 'No asignada'}</TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.lastLogin)}</TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => console.log('Editar usuario', user.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleUserStatus(user.id)}
                              className={user.isActive ? "text-red-600" : "text-green-600"}
                            >
                              {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default AdminUsers;
