
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Crear el root inmediatamente
const root = createRoot(document.getElementById("root")!);

// Renderizar la aplicación de forma prioritaria
root.render(<App />);

// Registrar Service Worker después del primer render
if ('serviceWorker' in navigator) {
  // Usar setTimeout para no bloquear la renderización inicial
  setTimeout(() => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registrado:', registration);
      })
      .catch((error) => {
        console.log('SW registro falló:', error);
      });
  }, 2000);
}
