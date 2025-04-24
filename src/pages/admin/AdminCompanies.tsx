
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { RequireAuth } from "@/components/RequireAuth";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { CompanyRow } from "@/components/admin/CompanyRow";
import { NewCompanyDialog } from "@/components/admin/NewCompanyDialog";

const AdminCompanies = () => {
  const [isNewCompanyDialogOpen, setIsNewCompanyDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - this would come from your backend in a real app
  const companies = [
    { id: "1", name: "Ambulancias Sur", email: "info@ambulanciassur.com", type: "ambulance", active: true },
    { id: "2", name: "Hospital Central", email: "contacto@hospitalcentral.com", type: "hospital", active: true },
    { id: "3", name: "Clínica Norte", email: "admin@clinicanorte.com", type: "hospital", active: false },
  ];

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RequireAuth allowedRoles={["admin"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold">
                Gestión de Empresas
              </h1>
              <Button onClick={() => setIsNewCompanyDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Empresa
              </Button>
            </div>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar empresas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Empresas Registradas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((company) => (
                      <CompanyRow key={company.id} company={company} />
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
        <NewCompanyDialog 
          open={isNewCompanyDialogOpen} 
          onOpenChange={setIsNewCompanyDialogOpen}
        />
      </div>
    </RequireAuth>
  );
};

export default AdminCompanies;
