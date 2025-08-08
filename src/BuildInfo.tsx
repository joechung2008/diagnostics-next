import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@fluentui/react-components";

const BuildInfo: React.FC<BuildInfoProps> = ({ buildVersion }) => {
  const items = [
    {
      name: "Build Version",
      value: buildVersion,
    },
  ];

  return (
    <Table aria-label="Build Info">
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

export default BuildInfo;
