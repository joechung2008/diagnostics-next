import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import App from "../app/page";

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

// Wrapper component to provide Fluent UI context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FluentProvider theme={webLightTheme}>{children}</FluentProvider>
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

describe("App", () => {
  beforeEach(() => {
    // Mock fetch to return our test data
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockDiagnostics),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    // Mock fetch to never resolve
    global.fetch = jest.fn().mockImplementation(() => new Promise(() => {}));

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
      expect(global.fetch).toHaveBeenCalledWith(
        "https://hosting.portal.azure.net/api/diagnostics"
      );
    });
  });
});
