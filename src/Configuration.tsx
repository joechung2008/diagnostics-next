import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
} from "@fluentui/react-components";

const Configuration: React.FC<ConfigurationProps> = ({ config }) => {
  const items = Object.entries(config).reduce<KeyValuePair<string>[]>(
    (previous, [key, value]) => [...previous, { key, value }],
    []
  );

  return (
    <div>
      <Text size={400} weight="semibold">
        Configuration
      </Text>
      <Table aria-label="Configuration">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Key</TableHeaderCell>
            <TableHeaderCell>Value</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell>{item.key}</TableCell>
              <TableCell>{item.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Configuration;
