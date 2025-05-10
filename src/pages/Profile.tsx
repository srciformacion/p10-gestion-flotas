
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RequireAuth } from "@/components/RequireAuth";
import { User, Settings, Mail, Phone, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    password: "",
    confirmPassword: "",
    notifications: {
      email: true,
      push: true
    },
    preferences: {
      darkMode: false,
      language: "es"
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (type: 'email' | 'push') => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate update profile
    setTimeout(() => {
      toast({
        title: "Perfil actualizado",
        description: "Los datos de tu perfil se han actualizado correctamente"
      });
      setIsSubmitting(false);
      setFormData(prev => ({
        ...prev,
        password: "",
        confirmPassword: ""
      }));
    }, 1000);
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'hospital': return 'Centro Sanitario';
      case 'individual': return 'Particular';
      case 'ambulance': return 'Empresa de Ambulancias';
      default: return role;
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
              Mi Perfil
            </h1>

            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Información Personal
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notificaciones
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Preferencias
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white">
                        <User className="h-8 w-8" />
                      </div>
                      <div>
                        <CardTitle>{user?.name}</CardTitle>
                        <CardDescription>
                          {getRoleText(user?.role || '')}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre</Label>
                          <div className="flex items-center relative">
                            <User className="h-4 w-4 absolute left-3 text-gray-400" />
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Correo electrónico</Label>
                          <div className="flex items-center relative">
                            <Mail className="h-4 w-4 absolute left-3 text-gray-400" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="pl-10"
                              disabled
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Teléfono</Label>
                          <div className="flex items-center relative">
                            <Phone className="h-4 w-4 absolute left-3 text-gray-400" />
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h3 className="font-medium mb-4">Cambiar contraseña</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="password">Nueva contraseña</Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              value={formData.password}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? "Guardando..." : "Guardar cambios"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferencias de notificaciones</CardTitle>
                    <CardDescription>
                      Configura cómo quieres recibir las notificaciones
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificaciones por email</Label>
                        <CardDescription>
                          Recibe actualizaciones en tu correo electrónico
                        </CardDescription>
                      </div>
                      <Switch
                        checked={formData.notifications.email}
                        onCheckedChange={() => handleNotificationToggle('email')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificaciones push</Label>
                        <CardDescription>
                          Recibe notificaciones en tiempo real
                        </CardDescription>
                      </div>
                      <Switch
                        checked={formData.notifications.push}
                        onCheckedChange={() => handleNotificationToggle('push')}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferencias de la cuenta</CardTitle>
                    <CardDescription>
                      Personaliza tu experiencia en la plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Modo oscuro</Label>
                        <CardDescription>
                          Cambia entre tema claro y oscuro
                        </CardDescription>
                      </div>
                      <Switch
                        checked={formData.preferences.darkMode}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, darkMode: checked }
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default Profile;
