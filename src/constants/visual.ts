
// Constantes visuales de la aplicación AmbulLink - La Rioja

export const COLORS = {
  // Colores institucionales La Rioja
  rioja: {
    green: '#76BC21',     // Verde institucional principal
    blue: '#243746',      // Azul institucional principal
    white: '#FFFFFF',     // Blanco institucional
    lightGreen: '#84CC16', // Verde claro alternativo
    darkBlue: '#1e293b'   // Azul oscuro
  },
  
  // Estados de solicitudes
  status: {
    pending: '#FF9800',    // Amarillo/naranja - Pendiente
    assigned: '#3B82F6',   // Azul - Asignada
    inRoute: '#76BC21',    // Verde Rioja - En ruta
    completed: '#10B981',  // Verde - Completada
    cancelled: '#EF4444'   // Rojo - Cancelada
  },
  
  // Colores del sistema
  system: {
    primary: '#76BC21',        // Verde institucional
    primaryForeground: '#FFFFFF',
    secondary: '#F1F5F9',      // Gris claro
    secondaryForeground: '#243746',
    background: '#FFFFFF',
    foreground: '#243746',     // Azul para texto principal
    muted: '#F1F5F9',
    mutedForeground: '#64748B',
    accent: '#76BC21',         // Verde de acento
    destructive: '#EF4444',
    border: '#E2E8F0',
    ring: '#76BC21'            // Verde para focus
  },
  
  // Colores de apoyo
  support: {
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827'
    },
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
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

// Configuración de componentes específicos
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
        sm: '2rem',     // 32px (h-8)
        md: '2.5rem',   // 40px (h-10)
        lg: '3rem'      // 48px (h-12)
      },
      padding: {
        sm: '0.5rem 1rem',      // py-2 px-4
        md: '0.75rem 1.5rem',   // py-3 px-6
        lg: '1rem 2rem'         // py-4 px-8
      }
    },
    
    card: {
      padding: '1.5rem',        // p-6
      borderRadius: '0.5rem',   // rounded-lg
      shadow: 'md'
    },
    
    navbar: {
      height: '4rem',           // h-16
      background: COLORS.rioja.blue
    },
    
    sidebar: {
      widthExpanded: '15rem',   // w-60
      widthCollapsed: '3.5rem', // w-14
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
    textColor: 'text-blue-800',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  hospital: {
    label: 'Centro Sanitario',
    color: COLORS.rioja.green,
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    badgeClass: 'bg-green-100 text-green-800 border-green-300'
  },
  individual: {
    label: 'Usuario Particular',
    color: COLORS.support.info,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  ambulance: {
    label: 'Empresa de Ambulancias',
    color: COLORS.support.warning,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  },
  centroCoordinador: {
    label: 'Centro Coordinador',
    color: COLORS.rioja.blue,
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300'
  },
  equipoMovil: {
    label: 'Equipo Móvil',
    color: COLORS.status.inRoute,
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  }
};

// Estados de solicitudes con sus estilos
export const REQUEST_STATUS = {
  pending: {
    label: 'Pendiente',
    color: COLORS.status.pending,
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-300',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-300'
  },
  assigned: {
    label: 'Asignada',
    color: COLORS.status.assigned,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  inRoute: {
    label: 'En Ruta',
    color: COLORS.status.inRoute,
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    badgeClass: 'bg-green-100 text-green-800 border-green-300'
  },
  completed: {
    label: 'Completada',
    color: COLORS.status.completed,
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-300',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  cancelled: {
    label: 'Cancelada',
    color: COLORS.status.cancelled,
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
    badgeClass: 'bg-red-100 text-red-800 border-red-300'
  }
};

// Clases de utilidad comunes
export const UTILITY_CLASSES = {
  // Contenedores
  container: 'max-w-7xl mx-auto p-6',
  section: 'space-y-8',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  gridKpis: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
  
  // Títulos
  pageTitle: 'text-3xl md:text-4xl font-bold text-foreground mb-6',
  sectionTitle: 'text-xl md:text-2xl font-semibold text-foreground mb-4',
  
  // Botones
  btnPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200',
  btnSecondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-200',
  btnOutline: 'border border-primary text-primary hover:bg-primary/10 transition-colors duration-200',
  btnDestructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors duration-200',
  
  // Cards
  card: 'bg-background border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200',
  cardHeader: 'p-6 pb-3',
  cardContent: 'p-6 pt-0',
  
  // Estados interactivos
  hover: 'hover:bg-muted/50 transition-colors duration-200',
  focus: 'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  
  // Animaciones
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  hoverScale: 'hover:scale-105 transition-transform duration-200'
};

// Patrones de iconos por categoría
export const ICON_PATTERNS = {
  navigation: ['Home', 'Users', 'FileText', 'Settings', 'LogOut'],
  actions: ['Plus', 'Edit', 'Trash2', 'Download', 'Upload', 'Search'],
  states: ['Check', 'X', 'AlertCircle', 'AlertTriangle', 'Clock'],
  ai: ['Brain', 'Zap', 'Target', 'TrendingUp', 'BarChart3'],
  communication: ['MessageCircle', 'Bell', 'Send', 'Phone', 'Mail'],
  transport: ['Ambulance', 'Route', 'MapPin', 'Navigation']
};

