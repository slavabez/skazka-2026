"use client";

import {
  Anchor,
  Button,
  Card,
  Container,
  Grid,
  List,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";

const sections = [
  {
    title: "Заказы по дате",
    description: "Список рабочих заказов по дате создания.",
    href: "/orders/by-date",
  },
  {
    title: "Заказы по доставке",
    description: "Контроль заказов по дате доставки.",
    href: "/orders/by-delivery",
  },
  {
    title: "Продажи по товарам",
    description: "Аналитика продаж с группировкой по товарам.",
    href: "/reports/goods",
  },
  {
    title: "Продажи по клиентам",
    description: "Аналитика продаж с группировкой по клиентам.",
    href: "/reports/clients",
  },
  {
    title: "Товары и клиенты",
    description: "Сводный отчет по клиентам, производителям и товарам.",
    href: "/reports/goods-and-clients",
  },
  {
    title: "Задолженности",
    description: "Контроль долгов клиентов и связанных документов продажи.",
    href: "/reports/debts",
  },
];

export default function Home() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Stack gap="xs">
          <Title order={1}>Панель отчётов Сказка</Title>
          <Text c="dimmed">
            Веб-приложение для сотрудников Сказка, где можно отслеживать заказы,
            контролировать продажи и мониторить задолженности клиентов.
          </Text>
        </Stack>

        <Card withBorder radius="md" p="lg">
          <Stack gap="xs">
            <Title order={3}>Функционал</Title>
            <List spacing="xs">
              <List.Item>
                Сверяйте заказы по дате создания или дате доставки
              </List.Item>
              <List.Item>
                Смотрите отчеты по продажам для ежедневной работы Т.А.
              </List.Item>
              <List.Item>
                Контролируйте долги клиентов и статус документов продаж
              </List.Item>
            </List>
          </Stack>
        </Card>

        <Stack gap="xs">
          <Title order={3}>Разделы системы</Title>
          <Text c="dimmed">
            Начните с нужного раздела ниже, чтобы перейти к рабочим данным.
          </Text>
        </Stack>

        <Grid>
          {sections.map((section) => (
            <Grid.Col key={section.href} span={{ base: 12, sm: 6, lg: 4 }}>
              <Card withBorder radius="md" p="lg" h="100%">
                <Stack gap="xs">
                  <Title order={4}>{section.title}</Title>
                  <Text size="sm" c="dimmed">
                    {section.description}
                  </Text>
                  <Button component={Link} href={section.href}>
                    Перейти в раздел
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
