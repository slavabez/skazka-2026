"use client";

import type React from "react";
import { SWRConfig } from "swr";

const fetcher = async (resource: RequestInfo | URL, init?: RequestInit) => {
  const res = await fetch(resource, init);

  if (!res.ok) {
    let message = "Произошла ошибка при загрузке данных.";
    try {
      const text = await res.text();
      if (text) {
        message = text;
      }
    } catch {
      // Ignore parsing errors and keep default message.
    }
    throw new Error(message);
  }

  return res.json();
};

const SWRConfigProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig
      value={{
        fetcher,
        refreshInterval: 1000 * 60 * 5,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 2000,
        shouldRetryOnError: true,
        errorRetryCount: 2,
        keepPreviousData: true,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRConfigProvider;
