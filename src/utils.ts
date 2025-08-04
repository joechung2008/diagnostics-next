import { makeStyles } from "@fluentui/react-components";

export function isExtensionInfo(
  value: Extension | undefined
): value is ExtensionInfo {
  return (
    value !== undefined && typeof value === "object" && "extensionName" in value
  );
}

export function byKey(a: KeyedNavLink, b: KeyedNavLink): number {
  return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
}

export function toNavLink({ extensionName }: ExtensionInfo): KeyedNavLink {
  return {
    key: extensionName,
    name: extensionName,
    url: "",
  };
}

export const useStyles = makeStyles({
  root: {
    maxHeight: "calc(100vh - 116px)",
    minHeight: "calc(100vh - 116px)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
});

export function when<T>(condition: boolean, ...args: T[]): T[] {
  return condition ? args : [];
}
