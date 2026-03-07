// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { Roboto } from "next/font/google";
import CustomMantineProvider from "@/providers/mantine-provider";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
});

export const metadata = {
  title: "Сказка - панель управления",
  description: "Сказка - панель управления для сверки заказов и других отчётов",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" {...mantineHtmlProps} className={roboto.className}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <CustomMantineProvider>{children}</CustomMantineProvider>
      </body>
    </html>
  );
}
