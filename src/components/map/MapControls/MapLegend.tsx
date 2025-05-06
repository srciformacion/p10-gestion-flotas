
import React from 'react';

export const MapLegend: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-md z-[1000]">
      <div className="text-sm font-medium mb-1">Estado de vehículos:</div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span className="text-xs">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600"></div>
          <span className="text-xs">En servicio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-600"></div>
          <span className="text-xs">Mantenimiento</span>
        </div>
      </div>
    </div>
  );
};
