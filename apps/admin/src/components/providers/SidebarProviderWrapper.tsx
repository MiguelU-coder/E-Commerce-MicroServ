"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { safeLocalStorageGet } from "@/lib/utils";
import { ReactNode, useEffect, useState } from "react";

interface SidebarProviderWrapperProps {
    children: ReactNode;
    defaultOpen?: boolean;
}

export function SidebarProviderWrapper({
    children,
    defaultOpen = true,
}: SidebarProviderWrapperProps) {
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(defaultOpen);

    useEffect(() => {
        setMounted(true);
        // Solo en cliente y solo si localStorage es usable (evita Node con polyfill roto)
        const stored = safeLocalStorageGet("sidebar:state");
        if (stored !== null) {
            setOpen(stored === "true");
        }
    }, []);

    if (!mounted) {
        // Durante SSR, usa el defaultOpen de las cookies
        return <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>;
    }

    // Después de hidratar, usa el estado del localStorage
    return (
        <SidebarProvider defaultOpen={open} open={open} onOpenChange={setOpen}>
            {children}
        </SidebarProvider>
    );
}