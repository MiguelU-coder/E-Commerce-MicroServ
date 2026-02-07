"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  // Usar useState asegura que solo se cree un cliente por ciclo de vida del componente
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
global.localStorage;
