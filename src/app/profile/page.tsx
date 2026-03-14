"use client";

import { Avatar, Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { useAuthContext } from "@/providers/auth";

export default function ProfilePage() {
  const { user, logout } = useAuthContext();

  return (
    <Stack maw={640}>
      <Title order={2}>Профиль</Title>

      <Card withBorder p="lg">
        <Group align="center">
          <Avatar name={user?.name ?? "Пользователь"} radius="xl" size={56} />
          <Stack gap={2}>
            <Text fw={600}>{user?.name ?? "-"}</Text>
            <Text c="dimmed" size="sm">
              {user?.phone ?? "-"}
            </Text>
          </Stack>
        </Group>
        <Button mt="md" variant="light" color="red" onClick={logout}>
          Выйти
        </Button>
      </Card>
    </Stack>
  );
}
