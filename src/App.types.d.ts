interface Diagnostics {
  buildInfo: BuildInfoProps;
  extensions: Record<string, Extension>;
  serverInfo: ServerInfoProps;
}
