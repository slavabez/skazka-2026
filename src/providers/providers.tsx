"use client";

import type React from "react";
import { AuthProvider } from "@/providers/auth";
import SWRConfigProvider from "@/providers/swr";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfigProvider>
      <AuthProvider>{children}</AuthProvider>
    </SWRConfigProvider>
  );
}
