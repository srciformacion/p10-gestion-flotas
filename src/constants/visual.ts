
// Constantes visuales de la aplicación AmbulLink - La Rioja

export const COLORS = {
  // Colores institucionales La Rioja
  rioja: {
    green: '#76BC21',     // Verde principal La Rioja
    blue: '#243746',      // Azul institucional La Rioja
    white: '#FFFFFF',     // Blanco
    lightGreen: '#84CC16', // Verde claro alternativo
    darkBlue: '#1e293b'   // Azul oscuro
  },
  
  // Estados de solicitudes
  status: {
    pending: '#f59e0b',    // Amarillo/naranja - Pendiente
    assigned: '#3b82f6',   // Azul - Asignada
    inRoute: '#76BC21',    // Verde Rioja - En ruta
    completed: '#10b981',  // Verde - Completada
    cancelled: '#ef4444'   // Rojo - Cancelada
  },
  
  // Colores de apoyo
  support: {
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      500: '#6b7280',
      700: '#374151',
      900: '#111827'
    },
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  }
};

export const TYPOGRAPHY = {
  fonts: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    heading: ['Georgia', 'serif'] // Para títulos institucionales
  },
  
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem'  // 36px
  }
};

export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem'     // 64px
};

export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Iconografía y elementos visuales
export const VISUAL_ELEMENTS = {
  borderRadius: {
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    full: '9999px'
  },
  
  // Configuración de componentes específicos
  components: {
    button: {
      height: {
        sm: '2rem',     // 32px
        md: '2.5rem',   // 40px
        lg: '3rem'      // 48px
      },
      padding: {
        sm: '0.5rem 1rem',
        md: '0.75rem 1.5rem',
        lg: '1rem 2rem'
      }
    },
    
    card: {
      padding: '1.5rem',
      borderRadius: '0.5rem',
      shadow: 'md'
    },
    
    navbar: {
      height: '4rem', // 64px
      background: COLORS.rioja.blue
    }
  }
};

// Roles de usuario y sus colores asociados
export const USER_ROLES = {
  admin: {
    label: 'Administrador',
    color: COLORS.rioja.blue,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  hospital: {
    label: 'Centro Sanitario',
    color: COLORS.rioja.green,
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  },
  individual: {
    label: 'Usuario Particular',
    color: COLORS.support.info,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  ambulance: {
    label: 'Empresa de Ambulancias',
    color: COLORS.support.warning,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  centroCoordinador: {
    label: 'Centro Coordinador',
    color: COLORS.rioja.blue,
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800'
  },
  equipoMovil: {
    label: 'Equipo Móvil',
    color: COLORS.status.inRoute,
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800'
  }
};

// Estados de solicitudes con sus estilos
export const REQUEST_STATUS = {
  pending: {
    label: 'Pendiente',
    color: COLORS.status.pending,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300'
  },
  assigned: {
    label: 'Asignada',
    color: COLORS.status.assigned,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300'
  },
  inRoute: {
    label: 'En Ruta',
    color: COLORS.status.inRoute,
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300'
  },
  completed: {
    label: 'Completada',
    color: COLORS.status.completed,
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-300'
  },
  cancelled: {
    label: 'Cancelada',
    color: COLORS.status.cancelled,
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300'
  }
};
