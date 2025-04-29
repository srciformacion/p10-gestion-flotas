
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface AmbulanceVehiclesTabProps {
  options: Array<{
    title: string;
    description: string;
    icon: any;
    href: string;
    variant: "default" | "outline";
  }>;
}

export const AmbulanceVehiclesTab = ({ options }: AmbulanceVehiclesTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Gestión de mi Flota</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((option) => (
          <Card key={option.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <option.icon className="h-5 w-5 text-primary" />
                {option.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{option.description}</p>
              <Button variant={option.variant} className="w-full" asChild>
                <Link to={option.href}>{option.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
