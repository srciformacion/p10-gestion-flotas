
import React from "react";
import { TransportRequestForm } from "@/components/requests/form/TransportRequestForm";
import { RequireAuth } from "@/components/RequireAuth";
import { AppLayout } from "@/components/layout/AppLayout";

const NewRequest = () => {
  return (
    <RequireAuth allowedRoles={["individual", "hospital", "admin"]}>
      <AppLayout>
        <div className="space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold">Nueva Solicitud de Transporte</h1>
          <TransportRequestForm />
        </div>
      </AppLayout>
    </RequireAuth>
  );
};

export default NewRequest;
