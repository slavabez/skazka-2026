"use client";

import Script from "next/dist/client/script";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { PB_TOKEN_EXPIRY_THRESHOLD } from "@/lib/auth/auth";
import type { AnalyticsEvent } from "@/lib/events";
import { ANALYTICS_EVENTS } from "@/lib/events";
import type { UsersRecord } from "@/types/user";

interface AuthContext {
  isAuthenticated: boolean;
  user: Partial<UsersRecord> | null;
  logout: () => void | Promise<void>;
  loginAsUser: (loginData: UsersRecord & { expiry: number }) => void;
  trackEvent: (event: AnalyticsEvent) => Promise<void>;
}

const initialState: AuthContext = {
  isAuthenticated: false,
  user: null,
  logout: () => {},
  loginAsUser: () => {},
  trackEvent: async () => {},
};

export const authContext = createContext<AuthContext>(initialState);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage("auth", false);
  const [user, setUser] = useLocalStorage<Partial<UsersRecord> | null>(
    "user",
    null,
  );
  const [scriptHasLoaded, setScriptHasLoaded] = useState(false);

  const trackEvent = useCallback(
    async (event: AnalyticsEvent) => {
      console.debug("trackEvent:", event);
      await window?.umami?.track(event.name, {
        ...event?.data,
        u: user?.id,
      });
    },
    [user],
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      await trackEvent({
        name: ANALYTICS_EVENTS.logout,
      });
      setIsAuthenticated(false);
      setUser(null);
      router.push("/");
    }
  }, [router, setIsAuthenticated, setUser, trackEvent]);

  function loginAsUser(loginData: UsersRecord & { expiry: number }) {
    setUser(loginData);
    setIsAuthenticated(true);
  }

  const handleAnalyticsReady = useCallback(() => {
    if (user) {
      window?.umami?.identify({
        user_id: user?.id ?? "",
        name: user?.name ?? "",
        role: user?.role ?? "",
        external_id: user?.externalId ?? "",
      });
    } else {
      console.debug(
        "User is not logged in, skipping analytics identification.",
      );
    }
  }, [user]);

  useEffect(() => {
    if (scriptHasLoaded) {
      handleAnalyticsReady();
    }
  }, [scriptHasLoaded, handleAnalyticsReady]);

  const checkSession = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch("/api/auth/session");

      if (response.status === 200) {
        const data = await response.json();
        const { session, user: userData } = data;

        // Update user info if it changed
        if (JSON.stringify(userData) !== JSON.stringify(user)) {
          setUser(userData);
        }

        if (session.timeLeft < PB_TOKEN_EXPIRY_THRESHOLD) {
          console.debug("Session refreshed by backend endpoint.");
        }
      } else {
        const errorText = await response.text();
        console.error("Session check failed:", errorText);
        await trackEvent({
          name: ANALYTICS_EVENTS.sessionExpired,
        });
        void logout();
      }
    } catch (error) {
      console.error("Error checking session:", error);
    }
  }, [isAuthenticated, logout, setUser, trackEvent, user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAuthenticated) {
      // Initial check
      void checkSession();
      // Periodic check every 60 seconds
      interval = setInterval(checkSession, 60000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated, checkSession]);

  return (
    <authContext.Provider
      value={{
        isAuthenticated,
        user,
        logout,
        loginAsUser,
        trackEvent,
      }}
    >
      {children}
      <Script
        strategy="afterInteractive"
        src="https://analytics.ipbez.kz/script.js"
        data-website-id="ada6a9ec-0667-4826-b0cf-fd3398b356fa"
        onReady={() => {
          setScriptHasLoaded(true);
        }}
      />
    </authContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(authContext);
};
