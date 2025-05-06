
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LiveMap } from "@/components/map/LiveMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Demo = () => {
  const [activeTab, setActiveTab] = useState("mapa");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">AmbulLink Demo</h1>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link to="/registro">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow p-4 md:p-6 container mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bienvenido a la demostración de AmbulLink</CardTitle>
            <CardDescription>
              Esta es una versión de demostración que muestra algunas funcionalidades sin necesidad de iniciar sesión.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              AmbulLink es una plataforma de gestión para servicios de ambulancias y traslados sanitarios.
              Aquí puede ver una demostración del mapa en tiempo real y algunas estadísticas del sistema.
            </p>

            {/* Tabs para diferentes secciones de demo */}
            <Tabs 
              defaultValue="mapa" 
              className="mt-6"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mapa">Mapa en tiempo real</TabsTrigger>
                <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
              </TabsList>
              
              {/* Contenido del mapa */}
              <TabsContent value="mapa" className="mt-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Vista en vivo de vehículos y solicitudes activas
                  </p>
                </div>
                <div className="h-[500px]">
                  <LiveMap height="500px" />
                </div>
              </TabsContent>
              
              {/* Contenido de estadísticas */}
              <TabsContent value="estadisticas" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard title="Vehículos activos" value="24" icon="🚑" />
                  <StatCard title="Traslados hoy" value="142" icon="📊" />
                  <StatCard title="Tiempo medio respuesta" value="8.5 min" icon="⏱️" />
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Distribución por tipos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-52 flex items-center justify-center bg-gray-100 rounded-md">
                        <p className="text-gray-500">Gráfico de distribución (demostración)</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Actividad semanal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-52 flex items-center justify-center bg-gray-100 rounded-md">
                        <p className="text-gray-500">Gráfico de actividad (demostración)</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <p className="text-sm text-gray-500">
              Para acceder a todas las funcionalidades, por favor{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:underline">
                inicie sesión
              </Link>{" "}
              o{" "}
              <Link to="/registro" className="font-medium text-blue-600 hover:underline">
                cree una cuenta
              </Link>
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <DemoFeatureCard 
            title="Gestión de flotas" 
            description="Administre su flota de ambulancias y vehículos sanitarios en tiempo real."
            icon="🚑"
          />
          <DemoFeatureCard 
            title="Seguimiento de traslados" 
            description="Seguimiento en tiempo real de los traslados y servicios activos."
            icon="📍"
          />
          <DemoFeatureCard 
            title="Informes y estadísticas" 
            description="Acceda a informes detallados y estadísticas sobre sus servicios."
            icon="📊"
          />
          <DemoFeatureCard 
            title="Agenda y programación" 
            description="Gestione su agenda y programación de servicios de forma eficiente."
            icon="📅"
          />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-6 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 AmbulLink - Versión demostrativa
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
              Inicio
            </Link>
            <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700">
              Iniciar Sesión
            </Link>
            <Link to="/registro" className="text-sm text-gray-500 hover:text-gray-700">
              Registrarse
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Componente para las tarjetas de estadísticas
const StatCard = ({ title, value, icon }: { title: string; value: string; icon: string }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="text-3xl">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para las tarjetas de características
const DemoFeatureCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => {
  return (
    <Card>
      <CardContent className="pt-6 pb-6">
        <div className="flex gap-4 items-start">
          <div className="text-3xl bg-blue-100 p-3 rounded-lg">{icon}</div>
          <div>
            <h3 className="font-medium text-lg mb-1">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Demo;
