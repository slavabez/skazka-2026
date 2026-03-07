"use client";

import type React from "react";
import { SWRConfig } from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("An error occurred while fetching the data.");
  }

  return res.json();
};

const SWRConfigProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        refreshInterval: 1000 * 60 * 30,
        fetcher,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRConfigProvider;
