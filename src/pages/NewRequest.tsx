
import React from "react";
import Navbar from "@/components/Navbar";
import { TransportRequestForm } from "@/components/requests/form/TransportRequestForm";
import { RequireAuth } from "@/components/RequireAuth";

const NewRequest = () => {
  return (
    <RequireAuth allowedRoles={["individual", "hospital", "admin"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Nueva Solicitud de Transporte</h1>
            <TransportRequestForm />
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default NewRequest;
