"use client";

import {
  FluentProvider,
  useThemeClassName,
  webDarkTheme,
} from "@fluentui/react-components";
import { useEffect } from "react";
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
        <FluentProvider theme={webDarkTheme}>
          <ApplyToBody />
          {children}
        </FluentProvider>
      </body>
    </html>
  );
}

// https://github.com/microsoft/fluentui/issues/23626#issuecomment-1162255474
function ApplyToBody() {
  const classes = useThemeClassName();

  useEffect(() => {
    const classList = classes.split(" ").filter((c) => c !== "");
    document.body.classList.add(...classList);

    return () => {
      document.body.classList.remove(...classList);
    };
  }, [classes]);

  return null;
}
