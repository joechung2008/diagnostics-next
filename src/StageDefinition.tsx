import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
} from "@fluentui/react-components";

const StageDefinition: React.FC<StageDefinitionProps> = ({
  stageDefinition,
}) => {
  const items = Object.entries(stageDefinition).reduce<
    KeyValuePair<string[]>[]
  >((previous, [key, value]) => [...previous, { key, value }], []);

  return (
    <div>
      <Text size={400} weight="semibold">
        Stage Definitions
      </Text>
      <Table aria-label="Stage Definitions">
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
              <TableCell>{item.value.join(", ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StageDefinition;
