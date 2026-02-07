// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ecom Admin Dashboard",
  description: "E-commerce admin dashboard with authentication",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar />
                <main className="w-full">
                  <Navbar />
                  <div className="px-4">{children}</div>
                </main>
              </SidebarProvider>
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
