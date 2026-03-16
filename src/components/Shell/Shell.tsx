"use client";

import {
  AppShell,
  Avatar,
  Burger,
  Button,
  Group,
  NavLink,
  rem,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  Box,
  Calendar,
  CreditCard,
  Home,
  LayoutGrid,
  LogIn,
  LogOut,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/providers/auth";

interface ShellProps {
  children: React.ReactNode;
}

const navLinks = [
  { label: "Главная", icon: Home, link: "/" },
  { label: "Утилиты", icon: Wrench, link: "/utils" },
  {
    label: "Заказы",
    links: [
      { label: "Заказы по дате", icon: Calendar, link: "/orders/by-date" },
      { label: "Заказы по доставке", icon: Truck, link: "/orders/by-delivery" },
    ],
  },
  {
    label: "Отчеты",
    links: [
      { label: "Продажи по товарам", icon: Box, link: "/reports/goods" },
      { label: "Продажи по клиентам", icon: Users, link: "/reports/clients" },
      {
        label: "По товарам и клиентам",
        icon: LayoutGrid,
        link: "/reports/goods-and-clients",
      },
      {
        label: "Задолженность клиентов",
        icon: CreditCard,
        link: "/reports/debts",
      },
    ],
  },
];

export function Shell({ children }: ShellProps) {
  const [opened, { toggle, close }] = useDisclosure();
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuthContext();

  if (pathname === "/login") {
    return <>{children}</>;
  }

  const renderLink = (item: any) => {
    const Icon = item.icon;
    const active = pathname === item.link;

    return (
      <NavLink
        key={item.link}
        component={Link}
        href={item.link}
        label={item.label}
        leftSection={Icon && <Icon size={rem(18)} strokeWidth={1.5} />}
        active={active}
        onClick={close}
      />
    );
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      footer={{ height: 40 }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={3}>Сказка П.У.</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section component={ScrollArea} grow>
          {navLinks.map((group) => {
            if (group.links) {
              return (
                <NavLink
                  key={group.label}
                  label={group.label}
                  childrenOffset={28}
                  defaultOpened
                >
                  {group.links.map(renderLink)}
                </NavLink>
              );
            }
            return renderLink(group);
          })}
        </AppShell.Section>
        <AppShell.Section pt="sm">
          {isAuthenticated && user ? (
            <Stack gap="xs">
              <NavLink
                component={Link}
                href="/profile"
                label={`Вошли как ${user.name ?? "Пользователь"}`}
                description="Профиль"
                leftSection={
                  <Avatar name={user.name ?? "Пользователь"} size="sm" />
                }
                active={pathname === "/profile"}
                onClick={close}
              />
              <Button
                variant="light"
                color="red"
                leftSection={<LogOut size={rem(16)} strokeWidth={1.5} />}
                onClick={() => {
                  close();
                  void logout();
                }}
              >
                Выйти
              </Button>
            </Stack>
          ) : (
            <NavLink
              component={Link}
              href="/login"
              label="Войти"
              leftSection={<LogIn size={rem(18)} strokeWidth={1.5} />}
              active={pathname === "/login"}
              onClick={close}
            />
          )}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>

      <AppShell.Footer p="xs">
        <Text size="xs" c="dimmed" ta="center">
          © {new Date().getFullYear()} Сказка, г Кокшетау. Все права защищены.
        </Text>
      </AppShell.Footer>
    </AppShell>
  );
}
