
import { Navbar } from "@/components/Navbar";
import { RequireAuth } from "@/components/RequireAuth";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const AdminUsers = () => {
  return (
    <RequireAuth allowedRoles={["admin"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Gestión de Usuarios</h1>
            
            <Card>
              <CardHeader>
                <CardTitle>Usuarios del Sistema</CardTitle>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Usuario Demo</TableCell>
                    <TableCell>usuario@ambulink.com</TableCell>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Activo</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default AdminUsers;
