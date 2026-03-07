"use client";

import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { theme } from "./mantine-theme";

const CustomMantineProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MantineProvider theme={theme}>
      <DatesProvider settings={{ locale: "ru" }}>{children}</DatesProvider>
    </MantineProvider>
  );
};

export default CustomMantineProvider;
