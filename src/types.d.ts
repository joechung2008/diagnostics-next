// Remove Fluent UI 8 dependency and define KeyedNavLink locally
type KeyedNavLink = {
  key: string;
  name: string;
  url?: string;
  [prop: string]: unknown;
};
