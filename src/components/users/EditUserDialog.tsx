
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { User, UserRole } from "@/types/user";
import { useFormValidation, commonValidationRules } from "@/hooks/useFormValidation";

interface EditUserDialogProps {
  user: User;
  onEditUser: (user: User) => void;
  onCancel: () => void;
}

export const EditUserDialog = ({ user, onEditUser, onCancel }: EditUserDialogProps) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    organization: user.organization || '',
    isActive: user.isActive ?? true
  });

  const validationRules = {
    name: commonValidationRules.name,
    email: commonValidationRules.email,
    phone: { ...commonValidationRules.phone, required: false }
  };

  const { errors, validateForm, validateSingleField, clearError } = useFormValidation(validationRules);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm(formData)) {
      onEditUser({
        ...user,
        ...formData
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      clearError(name);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateSingleField(name, value);
  };

  const handleSelectChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Nombre completo"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        onBlur={handleBlur}
        error={errors.name}
        required
        placeholder="Ej: Juan Pérez García"
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        onBlur={handleBlur}
        error={errors.email}
        required
        placeholder="Ej: juan.perez@larioja.es"
      />

      <FormField
        label="Teléfono"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        onBlur={handleBlur}
        error={errors.phone}
        placeholder="Ej: +34 941 123 456"
      />

      <div className="space-y-2">
        <Label htmlFor="edit-role">Rol</Label>
        <select
          id="edit-role"
          value={formData.role}
          onChange={(e) => handleSelectChange('role', e.target.value as UserRole)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="individual">Usuario Individual</option>
          <option value="hospital">Hospital</option>
          <option value="centroCoordinador">Centro Coordinador</option>
          <option value="equipoMovil">Equipo Móvil</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <FormField
        label="Organización"
        name="organization"
        value={formData.organization}
        onChange={handleInputChange}
        placeholder="Ej: Hospital San Juan de Dios"
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="edit-isActive"
          checked={formData.isActive}
          onChange={(e) => handleSelectChange('isActive', e.target.checked)}
          className="rounded border-input"
        />
        <Label htmlFor="edit-isActive">Usuario activo</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="btn-primary">
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
};
