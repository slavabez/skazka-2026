"use client";

import {
  Alert,
  Button,
  Card,
  CopyButton,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useState } from "react";
import {
  extractRefFrom1CLink,
  from1CIdToGuid,
  fromGuidTo1CId,
} from "@/lib/utils/ids";

export default function UtilsPage() {
  const [oneCLink, setOneCLink] = useState("");
  const [oneCId, setOneCId] = useState("");
  const [guid, setGuid] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLinkToGuid = () => {
    try {
      setError(null);
      const ref = extractRefFrom1CLink(oneCLink.trim());
      const convertedGuid = from1CIdToGuid(ref);
      setOneCId(ref);
      setGuid(convertedGuid);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка конвертации");
    }
  };

  const handle1CToGuid = () => {
    try {
      setError(null);
      setGuid(from1CIdToGuid(oneCId.trim()));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка конвертации");
    }
  };

  const handleGuidTo1C = () => {
    try {
      setError(null);
      setOneCId(fromGuidTo1CId(guid.trim()));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка конвертации");
    }
  };

  return (
    <Stack maw={720}>
      <Title order={2}>Утилиты</Title>
      <Text c="dimmed">
        Конвертация идентификаторов между форматом 1C и обычным UUID.
      </Text>

      <Card withBorder>
        <Stack>
          <TextInput
            label="Ссылка из 1C"
            placeholder="e1cib/data/Справочник.Пользователи?ref=..."
            value={oneCLink}
            onChange={(event) => setOneCLink(event.currentTarget.value)}
          />
          <Group>
            <Button onClick={handleLinkToGuid}>Из ссылки → UUID</Button>
            <CopyButton value={guid}>
              {({ copied, copy }) => (
                <Button variant="default" onClick={copy}>
                  {copied ? "Скопировано" : "Копировать UUID"}
                </Button>
              )}
            </CopyButton>
          </Group>
        </Stack>
      </Card>

      <Card withBorder>
        <Stack>
          <TextInput
            label="1C ID"
            placeholder="32 символа без дефисов"
            value={oneCId}
            onChange={(event) => setOneCId(event.currentTarget.value)}
          />
          <Group>
            <Button onClick={handle1CToGuid}>1C ID → UUID</Button>
            <CopyButton value={oneCId}>
              {({ copied, copy }) => (
                <Button variant="default" onClick={copy}>
                  {copied ? "Скопировано" : "Копировать 1C ID"}
                </Button>
              )}
            </CopyButton>
          </Group>
        </Stack>
      </Card>

      <Card withBorder>
        <Stack>
          <TextInput
            label="UUID"
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            value={guid}
            onChange={(event) => setGuid(event.currentTarget.value)}
          />
          <Group>
            <Button onClick={handleGuidTo1C}>UUID → 1C ID</Button>
            <CopyButton value={guid}>
              {({ copied, copy }) => (
                <Button variant="default" onClick={copy}>
                  {copied ? "Скопировано" : "Копировать UUID"}
                </Button>
              )}
            </CopyButton>
          </Group>
        </Stack>
      </Card>

      {error ? <Alert color="red">{error}</Alert> : null}
    </Stack>
  );
}
