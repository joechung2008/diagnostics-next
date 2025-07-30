import { Button, makeStyles } from "@fluentui/react-components";
import { byKey, isExtensionInfo, toNavLink } from "./utils";

const useStyles = makeStyles({
  root: {
    maxHeight: "calc(100vh - 116px)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  navButton: {
    justifyContent: "flex-start",
    textAlign: "left",
    width: "100%",
    minHeight: "1.6rem", // Ensure buttons are not squished vertically
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
    <nav className={styles.root} aria-label="Extensions">
      {links.map((link) => (
        <Button
          key={link.key}
          className={styles.navButton}
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
