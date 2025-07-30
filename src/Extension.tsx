import { Text, makeStyles } from "@fluentui/react-components";
import Configuration from "./Configuration";
import StageDefinition from "./StageDefinition";

const useStyles = makeStyles({
  root: {
    maxHeight: "calc(100vh - 116px)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
});

const Extension: React.FC<ExtensionProps> = ({
  config,
  extensionName,
  stageDefinition,
}) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <Text size={600} weight="semibold" block>
        {extensionName}
      </Text>
      {config && <Configuration config={config} />}
      {stageDefinition && <StageDefinition stageDefinition={stageDefinition} />}
    </div>
  );
};

export default Extension;
