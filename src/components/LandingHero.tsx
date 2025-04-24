
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Ambulance, Calendar, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const LandingHero = () => {
  const { user } = useAuth();
  
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <div className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Transporte sanitario</span>{" "}
                <span className="block text-primary-blue-dark">simplificado</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Conectamos centros sanitarios, particulares y empresas de ambulancias
                en una plataforma integrada para la gestión eficiente del transporte sanitario.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                {user ? (
                  <div className="rounded-md shadow">
                    <Link
                      to="/dashboard"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-blue hover:bg-primary-blue-dark md:py-4 md:text-lg md:px-10"
                    >
                      Ir al Dashboard
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="rounded-md shadow">
                      <Link
                        to="/registro"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-blue hover:bg-primary-blue-dark md:py-4 md:text-lg md:px-10"
                      >
                        Registrarse
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link
                        to="/login"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-blue bg-gray-100 hover:bg-gray-200 md:py-4 md:text-lg md:px-10"
                      >
                        Iniciar Sesión
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-0">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full bg-primary-blue-light bg-opacity-80 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
          <Ambulance className="h-32 w-32 text-white" strokeWidth={1} />
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-10 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-10">
            <h2 className="text-base text-primary-blue-dark font-semibold tracking-wide uppercase">
              Características
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Un servicio completo
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Gestiona todo el proceso de transporte sanitario de forma sencilla y eficiente.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-blue-dark rounded-md shadow-lg">
                        <Calendar className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Solicitudes sencillas
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Formulario intuitivo para solicitar ambulancias en pocos pasos. Programa traslados con anticipación.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-medical-red rounded-md shadow-lg">
                        <Ambulance className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Asignación en tiempo real
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Las empresas de ambulancias pueden ver y asignar vehículos a solicitudes de manera inmediata.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-status-inRoute rounded-md shadow-lg">
                        <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Seguimiento completo
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Sigue el estado de tus solicitudes en tiempo real desde la asignación hasta la finalización del servicio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
