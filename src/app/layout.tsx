"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <main className="min-h-screen bg-gray-50">{children}</main>;
  }

  // If not authenticated (and not on login page), the AuthContext will redirect.
  // But while checking/redirecting, we might want to show nothing or a loader.
  // However, for layout structure:
  if (!isAuthenticated) {
     return null; // Or a loading spinner
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="flex-1 md:pl-64 flex flex-col transition-all duration-300 ease-in-out">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
           {children}
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
            <AppLayout>
                {children}
            </AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
