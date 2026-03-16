"use client";

import { Group, TextInput } from "@mantine/core";

export default function ReportDateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}) {
  return (
    <Group grow>
      <TextInput
        type="date"
        label="Дата начала"
        value={startDate}
        onChange={(event) => onStartDateChange(event.currentTarget.value)}
      />
      <TextInput
        type="date"
        label="Дата окончания"
        value={endDate}
        onChange={(event) => onEndDateChange(event.currentTarget.value)}
      />
    </Group>
  );
}
