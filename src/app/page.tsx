"use client";

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Tab,
  TabList,
  Toolbar,
  ToolbarButton,
  makeStyles,
} from "@fluentui/react-components";
import { useReportWebVitals } from "next/web-vitals";
import { useEffect, useMemo, useState } from "react";
import BuildInfo from "../BuildInfo";
import Extension from "../Extension";
import Extensions from "../Extensions";
import ServerInfo from "../ServerInfo";
import { isExtensionInfo } from "../utils";

const useStyles = makeStyles({
  tabPanel: {
    padding: "10px",
  },
  stack: {
    display: "flex",
    flexDirection: "row",
    gap: "1rem",
  },
  grow: {
    flexGrow: 1,
  },
});

const enum Environment {
  Public = "https://hosting.portal.azure.net/api/diagnostics",
  Fairfax = "https://hosting.azureportal.usgovcloudapi.net/api/diagnostics",
  Mooncake = "https://hosting.azureportal.chinacloudapi.cn/api/diagnostics",
}

const App: React.FC = () => {
  useReportWebVitals(console.log);

  const styles = useStyles();
  const [diagnostics, setDiagnostics] = useState<Diagnostics>();
  const [extension, setExtension] = useState<ExtensionInfo>();
  const [environment, setEnvironment] = useState<Environment>(
    Environment.Public
  );
  const [selectedTab, setSelectedTab] = useState<string>("extensions");

  const environmentName = useMemo(() => {
    switch (environment) {
      case Environment.Public:
        return "Public Cloud";
      case Environment.Fairfax:
        return "Fairfax";
      case Environment.Mooncake:
        return "Mooncake";
      default:
        return "Select environment";
    }
  }, [environment]);

  const showPaasServerless = useMemo(
    () => isExtensionInfo(diagnostics?.extensions["paasserverless"]),
    [diagnostics?.extensions]
  );

  const environments = useMemo(
    () => [
      {
        key: "public",
        text: "Public Cloud",
        selected: environment === Environment.Public,
        onClick: () => {
          setEnvironment(Environment.Public);
          setExtension(undefined);
        },
      },
      {
        key: "fairfax",
        text: "Fairfax",
        selected: environment === Environment.Fairfax,
        onClick: () => {
          setEnvironment(Environment.Fairfax);
          setExtension(undefined);
        },
      },
      {
        key: "mooncake",
        text: "Mooncake",
        selected: environment === Environment.Mooncake,
        onClick: () => {
          setEnvironment(Environment.Mooncake);
          setExtension(undefined);
        },
      },
    ],
    [environment]
  );

  useEffect(() => {
    const getDiagnostics = async () => {
      const response = await fetch(environment);
      setDiagnostics(await response.json());
    };
    getDiagnostics();
  }, [environment]);

  if (!diagnostics) {
    return null;
  }

  const { buildInfo, extensions, serverInfo } = diagnostics;

  const handleLinkClick = (_?: React.MouseEvent, item?: KeyedNavLink) => {
    if (item) {
      const extension = extensions[item.key];
      if (isExtensionInfo(extension)) {
        setExtension(extension);
      }
    }
  };

  return (
    <>
      <Toolbar>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <MenuButton>{environmentName}</MenuButton>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {environments.map((env) => (
                <MenuItem
                  key={env.key}
                  onClick={env.onClick}
                  aria-checked={env.selected}
                  role="menuitemradio"
                >
                  {env.text}
                </MenuItem>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
        {showPaasServerless && (
          <ToolbarButton
            key="paasserverless"
            onClick={() => {
              const paasserverless = diagnostics?.extensions["paasserverless"];
              if (isExtensionInfo(paasserverless)) {
                setExtension(paasserverless);
              }
            }}
          >
            paasserverless
          </ToolbarButton>
        )}
        <ToolbarButton
          key="websites"
          onClick={() => {
            const websites = diagnostics?.extensions["websites"];
            if (isExtensionInfo(websites)) {
              setExtension(websites);
            }
          }}
        >
          websites
        </ToolbarButton>
      </Toolbar>
      <TabList
        selectedValue={selectedTab}
        onTabSelect={(_, data) => setSelectedTab(data.value as string)}
      >
        <Tab value="extensions">Extensions</Tab>
        <Tab value="build">Build Information</Tab>
        <Tab value="server">Server Information</Tab>
      </TabList>
      {selectedTab === "extensions" && (
        <div className={styles.tabPanel}>
          <div className={styles.stack}>
            <div>
              <Extensions
                extensions={extensions}
                onLinkClick={handleLinkClick}
              />
            </div>
            <div className={styles.grow}>
              {extension && <Extension {...extension} />}
            </div>
          </div>
        </div>
      )}
      {selectedTab === "build" && (
        <div className={styles.tabPanel}>
          <BuildInfo {...buildInfo} />
        </div>
      )}
      {selectedTab === "server" && (
        <div className={styles.tabPanel}>
          <ServerInfo {...serverInfo} />
        </div>
      )}
    </>
  );
};

export default App;
