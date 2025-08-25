import { Text } from "@fluentui/react-components";
import Configuration from "./Configuration";
import StageDefinition from "./StageDefinition";

const Extension: React.FC<ExtensionProps> = ({
  config,
  extensionName,
  stageDefinition,
}) => {
  return (
    <div className="extension-root grow">
      <Text size={600} weight="semibold" block>
        {extensionName}
      </Text>
      {config && <Configuration config={config} />}
      {stageDefinition && <StageDefinition stageDefinition={stageDefinition} />}
    </div>
  );
};

export default Extension;
