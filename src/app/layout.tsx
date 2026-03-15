// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { Roboto } from "next/font/google";
import { Shell } from "@/components/Shell/Shell";
import CustomMantineProvider from "@/providers/mantine-provider";
import AppProviders from "@/providers/providers";

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
        <CustomMantineProvider>
          <AppProviders>
            <Shell>{children}</Shell>
          </AppProviders>
        </CustomMantineProvider>
      </body>
    </html>
  );
}
