
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
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registrado correctamente:', registration);
      })
      .catch((error) => {
        console.log('Error al registrar SW:', error);
      });
  });
}
