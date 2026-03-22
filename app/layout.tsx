import type { Metadata } from "next";
import "./globals.css";

import { AppProvider } from "./lib/AppContext";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "TechJob — IT Job Management System",
  description: "Manage jobs, users, departments, equipment and issues in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="dark" enableSystem={false}>
          <AppProvider>
            {children}
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
