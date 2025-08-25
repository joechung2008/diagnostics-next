import { Button, makeStyles, mergeClasses } from "@fluentui/react-components";
import { byKey, isExtensionInfo, toNavLink } from "./utils";

const useStyles = makeStyles({
  navButton: {
    justifyContent: "flex-start",
    textAlign: "left",
    width: "100%",
    minHeight: "max-content",
    boxSizing: "border-box",
  },
});

const Extensions: React.FC<ExtensionsProps> = ({ extensions, onLinkClick }) => {
  const styles = useStyles();
  const links = Object.values(extensions)
    .filter(isExtensionInfo)
    .map(toNavLink)
    .sort(byKey);

  return (
    <nav className="extension-root" aria-label="Extensions">
      {links.map((link) => (
        <Button
          key={link.key}
          className={mergeClasses("extension-nav-button", styles.navButton)}
          appearance="subtle"
          onClick={(e) => onLinkClick?.(e, link)}
        >
          {link.name}
        </Button>
      ))}
    </nav>
  );
};

export default Extensions;
