import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@repo/ui/sidebar";
import { Toaster } from "@repo/ui/sonner";

import "@repo/ui/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}>
        <Providers>
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>
              <div className="min-h-full">
                {children}
              </div>
            </SidebarInset>
          </div>
          <Toaster richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}

function Providers({ children }: { children: React.ReactNode; }) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col h-[100svh-var(--header-height)]!">
        <NextThemesProvider
          attribute="class"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          {children}
        </NextThemesProvider>
      </SidebarProvider>
    </div >
  );
}

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});