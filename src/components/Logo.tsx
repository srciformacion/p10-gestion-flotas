
import React from "react";

interface LogoProps {
  minimal?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ minimal = false }) => {
  return (
    <div className="flex items-center">
      <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold text-lg">
        A
      </div>
      {!minimal && (
        <span className="ml-2 text-lg font-medium text-gray-800">
          AmbulLink
        </span>
      )}
    </div>
  );
};
