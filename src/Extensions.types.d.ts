interface ExtensionsProps {
  extensions: Record<string, Extension>;
  onLinkClick(ev?: React.MouseEvent, item?: KeyedNavLink);
}

interface ExtensionInfo {
  extensionName: string;
  config?: Record<string, string>;
  stageDefinition?: Record<string, string[]>;
}

interface ExtensionError {
  lastError: {
    errorMessage: string;
    time: string;
  };
}

type Extension = ExtensionInfo | ExtensionError;
