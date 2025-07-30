import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "@fluentui/react-components";

const ServerInfo: React.FC<ServerInfoProps> = ({
  deploymentId,
  extensionSync,
  hostname,
  nodeVersions,
  serverId,
  uptime,
}) => {
  const items = [
    {
      name: "Hostname",
      value: hostname,
    },
    {
      name: "Uptime",
      value: uptime,
    },
    {
      name: "Server ID",
      value: serverId,
    },
    {
      name: "Deployment ID",
      value: deploymentId,
    },
    {
      name: "Node Versions",
      value: nodeVersions,
    },
    {
      name: "Extension Sync | Total Sync All Count",
      value: extensionSync.totalSyncAllCount,
    },
  ];

  return (
    <Table aria-label="Server Info">
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Value</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, idx) => (
          <TableRow key={idx}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ServerInfo;
