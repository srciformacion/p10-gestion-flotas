
import { LandingHero } from "@/components/LandingHero";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <LandingHero />
      </main>
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">&copy; 2025 AmbulLink. Todos los derechos reservados.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                Términos de uso
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
