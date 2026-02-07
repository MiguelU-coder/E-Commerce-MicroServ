"use client";

import * as React from "react";
import dynamic from "next/dynamic";

// next-themes usa localStorage en el estado inicial. Cargarlo solo en el cliente
// evita el error en servidor (Node con localStorage roto / --localstorage-file).
const NextThemesProvider = dynamic(
  () => import("next-themes").then((mod) => ({ default: mod.ThemeProvider })),
  { ssr: false },
);

export function ThemeProvider({
  children,
  ...props
}: React.PropsWithChildren<Record<string, unknown>>) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <>{children}</>;
  }
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
