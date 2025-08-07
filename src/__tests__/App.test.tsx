import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SWRConfig } from "swr";
import App from "../app/page";
import { fetchDiagnostics } from "../utils";

// Mock the child components
jest.mock("../BuildInfo", () => {
  return function MockBuildInfo({ buildVersion }: { buildVersion: string }) {
    return <div data-testid="build-info">Build Version: {buildVersion}</div>;
  };
});

jest.mock("../Extensions", () => {
  return function MockExtensions({ extensions, onLinkClick }: ExtensionsProps) {
    return (
      <div data-testid="extensions">
        {Object.keys(extensions).map((key) => (
          <button
            key={key}
            onClick={() => onLinkClick(undefined, { key, name: key })}
            data-testid={`extension-${key}`}
          >
            {key}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock("../Extension", () => {
  return function MockExtension({ extensionName }: { extensionName: string }) {
    return <div data-testid="extension-detail">Extension: {extensionName}</div>;
  };
});

jest.mock("../ServerInfo", () => {
  return function MockServerInfo() {
    return <div data-testid="server-info">Server Info</div>;
  };
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SWRConfig value={{ provider: () => new Map() }}>
    <FluentProvider theme={webLightTheme}>{children}</FluentProvider>
  </SWRConfig>
);

// Mock data
const mockDiagnostics = {
  buildInfo: {
    buildVersion: "1.0.0",
  },
  extensions: {
    websites: {
      extensionName: "websites",
      config: {},
    },
    paasserverless: {
      extensionName: "paasserverless",
      config: {},
    },
  },
  serverInfo: {
    serverName: "test-server",
  },
};

jest.mock("../utils", () => {
  const original = jest.requireActual("../utils");
  return {
    ...original,
    fetchDiagnostics: jest.fn(),
  };
});

describe("App", () => {
  beforeEach(() => {
    (fetchDiagnostics as jest.Mock).mockResolvedValue(mockDiagnostics);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    // Mock fetchDiagnostics to never resolve
    (fetchDiagnostics as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Should render nothing while loading
    expect(screen.queryByText("Extensions")).not.toBeInTheDocument();
  });

  it("renders main tabs after data loads", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("tab", { name: "Extensions" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: "Build Information" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("tab", { name: "Server Information" })
      ).toBeInTheDocument();
    });
  });

  it("renders environment selector", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Public Cloud")).toBeInTheDocument();
    });
  });

  it("renders toolbar buttons for extensions", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("extension-websites")).toBeInTheDocument();
      expect(
        screen.getByTestId("extension-paasserverless")
      ).toBeInTheDocument();
    });
  });

  it("switches tabs correctly", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("extensions")).toBeInTheDocument();
    });

    // Click on Build Information tab
    fireEvent.click(screen.getByRole("tab", { name: "Build Information" }));

    await waitFor(() => {
      expect(screen.getByTestId("build-info")).toBeInTheDocument();
      expect(screen.queryByTestId("extensions")).not.toBeInTheDocument();
    });

    // Click on Server Information tab
    fireEvent.click(screen.getByRole("tab", { name: "Server Information" }));

    await waitFor(() => {
      expect(screen.getByTestId("server-info")).toBeInTheDocument();
      expect(screen.queryByTestId("build-info")).not.toBeInTheDocument();
    });
  });

  it("fetches data from correct environment", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(fetchDiagnostics).toHaveBeenCalledWith(
        "https://hosting.portal.azure.net/api/diagnostics"
      );
    });
  });

  it("switches environments correctly", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Public Cloud")).toBeInTheDocument();
    });

    // Click on environment dropdown
    await user.click(screen.getByText("Public Cloud"));

    // Wait for menu to appear and click Fairfax
    await waitFor(() => {
      expect(screen.getByText("Fairfax")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Fairfax"));

    // Verify fetchDiagnostics was called with Fairfax URL
    await waitFor(() => {
      expect(fetchDiagnostics).toHaveBeenCalledWith(
        "https://hosting.azureportal.usgovcloudapi.net/api/diagnostics"
      );
    });
  });

  it("switches to Mooncake environment", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Public Cloud")).toBeInTheDocument();
    });

    // Click on environment dropdown
    await user.click(screen.getByText("Public Cloud"));

    // Wait for menu to appear and click Mooncake
    await waitFor(() => {
      expect(screen.getByText("Mooncake")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Mooncake"));

    // Verify fetchDiagnostics was called with Mooncake URL
    await waitFor(() => {
      expect(fetchDiagnostics).toHaveBeenCalledWith(
        "https://hosting.azureportal.chinacloudapi.cn/api/diagnostics"
      );
    });
  });

  it("handles extension selection from Extensions component", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("extensions")).toBeInTheDocument();
    });

    // Click on an extension in the Extensions component
    fireEvent.click(screen.getByTestId("extension-websites"));

    await waitFor(() => {
      expect(screen.getByTestId("extension-detail")).toBeInTheDocument();
      expect(screen.getByText("Extension: websites")).toBeInTheDocument();
    });
  });

  it("handles paasserverless toolbar button click", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("extensions")).toBeInTheDocument();
    });

    // Click on paasserverless toolbar button
    const toolbar = screen.getByRole("toolbar");
    const paasButton = Array.from(toolbar.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("paasserverless")
    );
    expect(paasButton).toBeInTheDocument();
    fireEvent.click(paasButton!);

    await waitFor(() => {
      expect(screen.getByTestId("extension-detail")).toBeInTheDocument();
      expect(screen.getByText("Extension: paasserverless")).toBeInTheDocument();
    });
  });

  it("handles websites toolbar button click", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("extensions")).toBeInTheDocument();
    });

    // Click on websites toolbar button
    const toolbar = screen.getByRole("toolbar");
    const websitesButton = Array.from(toolbar.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("websites")
    );
    expect(websitesButton).toBeInTheDocument();
    fireEvent.click(websitesButton!);

    await waitFor(() => {
      expect(screen.getByTestId("extension-detail")).toBeInTheDocument();
      expect(screen.getByText("Extension: websites")).toBeInTheDocument();
    });
  });

  it("does not show paasserverless button when extension is not valid", async () => {
    const mockDiagnosticsWithoutPaas = {
      ...mockDiagnostics,
      extensions: {
        websites: {
          extensionName: "websites",
          config: {},
        },
        paasserverless: "invalid-extension", // Not a valid ExtensionInfo
      },
    };

    (fetchDiagnostics as jest.Mock).mockResolvedValue(
      mockDiagnosticsWithoutPaas
    );

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("extensions")).toBeInTheDocument();
    });

    // paasserverless button should not be visible in toolbar
    const toolbar = screen.getByRole("toolbar");
    const toolbarButtons = Array.from(
      toolbar.querySelectorAll("button")
    ).filter((button) => button.textContent?.includes("paasserverless"));
    expect(toolbarButtons).toHaveLength(0);
  });

  it("handles extension selection with invalid extension", async () => {
    const mockDiagnosticsWithInvalidExt = {
      ...mockDiagnostics,
      extensions: {
        websites: "invalid-extension", // Not a valid ExtensionInfo
        paasserverless: {
          extensionName: "paasserverless",
          config: {},
        },
      },
    };

    (fetchDiagnostics as jest.Mock).mockResolvedValue(
      mockDiagnosticsWithInvalidExt
    );

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("extensions")).toBeInTheDocument();
    });

    // Click on websites toolbar button (which has invalid extension data)
    const toolbar = screen.getByRole("toolbar");
    const websitesButton = Array.from(toolbar.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("websites")
    );
    expect(websitesButton).toBeInTheDocument();
    fireEvent.click(websitesButton!);

    // Extension detail should not appear since the extension is invalid
    expect(screen.queryByTestId("extension-detail")).not.toBeInTheDocument();
  });

  it("handles handleLinkClick with undefined item", async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("extensions")).toBeInTheDocument();
    });

    // Simulate clicking with undefined item (edge case)
    const extensionsComponent = screen.getByTestId("extensions");
    const mockEvent = new MouseEvent("click", { bubbles: true });

    // This should not cause any errors or state changes
    fireEvent(extensionsComponent, mockEvent);

    // Should still be on extensions tab with no extension selected
    expect(screen.getByTestId("extensions")).toBeInTheDocument();
    expect(screen.queryByTestId("extension-detail")).not.toBeInTheDocument();
  });

  it("returns to Extensions tab after switching environments", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("extensions")).toBeInTheDocument();
    });

    // Switch to Build tab first
    fireEvent.click(screen.getByRole("tab", { name: "Build Information" }));

    await waitFor(() => {
      expect(screen.getByTestId("build-info")).toBeInTheDocument();
    });

    // Now switch environment
    await user.click(screen.getByText("Public Cloud"));
    await waitFor(() => {
      expect(screen.getByText("Fairfax")).toBeInTheDocument();
    });
    await user.click(screen.getByText("Fairfax"));

    // Should still be on Build tab after environment switch
    await waitFor(() => {
      expect(screen.getByTestId("build-info")).toBeInTheDocument();
    });
  });
});
