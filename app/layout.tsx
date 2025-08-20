"use client";

import { SessionProvider } from "next-auth/react";
import "@/app/ui/global.css";
import { inter } from "./ui/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = undefined; // si no usás SSR aquí, está ok
  const userId = (session as any)?.user?.id ?? "anon";
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider session={session} refetchOnWindowFocus={false}>
          {" "}
          <div key={userId}>{children}</div>
        </SessionProvider>
      </body>
    </html>
  );
}
