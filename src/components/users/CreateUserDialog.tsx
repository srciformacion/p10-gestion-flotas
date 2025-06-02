
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, UserRole } from "@/types/user";

interface CreateUserDialogProps {
  onCreateUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
}

export const CreateUserDialog = ({ onCreateUser }: CreateUserDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'individual' as UserRole,
    organization: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCreateUser(formData);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'individual',
        organization: '',
        isActive: true
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Ej: Juan Pérez García"
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Ej: juan.perez@larioja.es"
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono *</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="Ej: +34 941 123 456"
        />
        {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Rol</Label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => handleInputChange('role', e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="individual">Usuario Individual</option>
          <option value="hospital">Hospital</option>
          <option value="centroCoordinador">Centro Coordinador</option>
          <option value="equipoMovil">Equipo Móvil</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="organization">Organización</Label>
        <Input
          id="organization"
          value={formData.organization}
          onChange={(e) => handleInputChange('organization', e.target.value)}
          placeholder="Ej: Hospital San Juan de Dios"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="rounded border-input"
        />
        <Label htmlFor="isActive">Usuario activo</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" className="btn-primary">
          Crear Usuario
        </Button>
      </div>
    </form>
  );
};
