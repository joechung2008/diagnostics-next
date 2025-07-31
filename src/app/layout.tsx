"use client";

import { FluentProvider, webDarkTheme } from "@fluentui/react-components";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <title>Azure Portal Extension Dashboard</title>
      </head>
      <body>
        <FluentProvider theme={webDarkTheme}>{children}</FluentProvider>
      </body>
    </html>
  );
}
