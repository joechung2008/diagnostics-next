export function isExtensionInfo(
  value: Extension | undefined
): value is ExtensionInfo {
  return value !== undefined && "extensionName" in value;
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

export function when<T>(condition: boolean, ...args: T[]): T[] {
  return condition ? args : [];
}
