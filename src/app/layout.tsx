// /src/app/layout.tsx
// use client needed for any child that uses hooks or state, but layout can be server by default.
// we'll keep layout as server so we don't have to do client data fetching here.

import "@/styles/global.sass";
import { ReactNode } from "react";

export const metadata = {
  title: "BetsOnPets",
  description: "parimutuel betting dapp using next.js 15",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
