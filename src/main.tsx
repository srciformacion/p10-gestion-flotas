
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Asegurar que el DOM esté completamente cargado
const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found");
}

// Crear el root y renderizar inmediatamente
const root = createRoot(container);
root.render(<App />);

// Registrar Service Worker de forma asíncrona para no bloquear la carga inicial
if ('serviceWorker' in navigator) {
  // Esperar a que la página esté completamente cargada
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { 
      scope: '/',
      updateViaCache: 'none' // Evitar cache del SW mismo
    })
      .then((registration) => {
        console.log('SW registrado correctamente:', registration);
        
        // Verificar si hay actualizaciones
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Hay una nueva versión disponible
                console.log('Nueva versión del SW disponible');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log('Error al registrar SW:', error);
      });
  });
}
