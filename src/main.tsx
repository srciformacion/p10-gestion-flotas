
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Optimización para la carga inicial
const root = createRoot(document.getElementById("root")!);

// Renderizar la aplicación con prioridad
root.render(<App />);

// Registrar Service Worker de forma asíncrona para no bloquear la carga inicial
if ('serviceWorker' in navigator) {
  // Usar requestIdleCallback si está disponible, sino setTimeout
  const registerSW = () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registrado con éxito: ', registration);
        
        // Escuchar actualizaciones
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('Nueva versión disponible');
                // Aquí podrías mostrar una notificación al usuario
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log('SW registration failed: ', error);
      });
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(registerSW);
  } else {
    setTimeout(registerSW, 1000);
  }
}
