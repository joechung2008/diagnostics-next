import { Text } from "@fluentui/react-components";
import Configuration from "./Configuration";
import StageDefinition from "./StageDefinition";
import { useStyles } from "./utils";

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
