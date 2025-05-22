
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Company {
  id: string;
  name: string;
  email: string;
  type: string;
  active: boolean;
}

interface CompanyRowProps {
  company: Company;
}

export const CompanyRow = ({ company }: CompanyRowProps) => {
  const getCompanyTypeText = (type: string) => {
    switch (type) {
      case 'hospital': return 'Centro Sanitario';
      case 'ambulance': return 'Empresa de Ambulancias';
      default: return type;
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{company.name}</TableCell>
      <TableCell>{company.email}</TableCell>
      <TableCell>{getCompanyTypeText(company.type)}</TableCell>
      <TableCell>
        <Badge variant={company.active ? "default" : "secondary"}>
          {company.active ? "Activa" : "Inactiva"}
        </Badge>
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
