interface ServerInfoProps {
  deploymentId: string;
  extensionSync: {
    totalSyncAllCount: number;
  };
  hostname: string;
  nodeVersions: string;
  serverId: string;
  uptime: number;
}
