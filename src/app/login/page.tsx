"use client";

import {
  Alert,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ANALYTICS_EVENTS } from "@/lib/events";
import { type LoginInput, loginSchema } from "@/lib/schemas/auth";
import { useAuthContext } from "@/providers/auth";
import type { UsersRecord } from "@/types/user";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginAsUser, trackEvent } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginInput>({
    initialValues: {
      phone: "",
      password: "",
    },
    validate: zod4Resolver(loginSchema),
  });

  useEffect(() => {
    const tokenFromQuery = searchParams.get("t");
    if (!tokenFromQuery) {
      return;
    }

    let cancelled = false;

    const loginViaToken = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(
          `/api/auth/impersonate?t=${encodeURIComponent(tokenFromQuery)}`,
        );
        if (!response.ok) {
          throw new Error(await response.text());
        }

        const authData = (await response.json()) as {
          user: UsersRecord;
          expiry: number;
        };

        if (cancelled) {
          return;
        }

        loginAsUser({
          ...authData.user,
          expiry: authData.expiry,
        });

        await trackEvent({
          name: ANALYTICS_EVENTS.loginSuccess,
          data: {
            role: authData.user.role ?? "unknown",
            mode: "impersonation",
          },
        });

        router.push("/");
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : "Ошибка авторизации";
          setErrorMessage(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loginViaToken();

    return () => {
      cancelled = true;
    };
  }, [loginAsUser, router, searchParams, trackEvent]);

  const handleSubmit = async (values: LoginInput) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const authData = (await response.json()) as {
        user: UsersRecord;
        expiry: number;
      };

      loginAsUser({
        ...authData.user,
        expiry: authData.expiry,
      });

      await trackEvent({
        name: ANALYTICS_EVENTS.loginSuccess,
        data: {
          role: authData.user.role ?? "unknown",
        },
      });

      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Ошибка авторизации";
      setErrorMessage(message);
      await trackEvent({
        name: ANALYTICS_EVENTS.loginFailed,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Добро пожаловать в Skazka</Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {errorMessage ? (
            <Alert color="red" mb="md">
              {errorMessage}
            </Alert>
          ) : null}
          <TextInput
            label="Номер телефона"
            placeholder="87001234567"
            required
            {...form.getInputProps("phone")}
          />
          <PasswordInput
            label="Пароль"
            placeholder="Ваш пароль"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <Group justify="space-between" mt="lg">
            <Button type="submit" fullWidth loading={isLoading}>
              Войти
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
