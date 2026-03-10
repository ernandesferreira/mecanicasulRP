import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import AccessGuard from "@/components/AccessGuard";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { ServicesProvider } from "@/context/ServicesContext";
import { BoxesProvider } from "@/context/BoxesContext";
import { PartnershipsProvider } from "@/context/PartnershipsContext";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auto Car Sul - Calculadora de Oficina",
  description: "Calculadora para oficina mecânica no GTA RP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white`}
      >
        <AuthProvider>
          <ProductsProvider>
            <ServicesProvider>
              <BoxesProvider>
                <PartnershipsProvider>
                  <CartProvider>
                    <Header />
                    <main className="min-h-screen">
                      <AccessGuard>{children}</AccessGuard>
                    </main>
                  </CartProvider>
                </PartnershipsProvider>
              </BoxesProvider>
            </ServicesProvider>
          </ProductsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
