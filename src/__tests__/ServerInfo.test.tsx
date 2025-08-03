import { render, screen } from "@testing-library/react";
import ServerInfo from "../ServerInfo";

describe("ServerInfo", () => {
  const mockProps: ServerInfoProps = {
    deploymentId: "deploy-123",
    extensionSync: {
      totalSyncAllCount: 42,
    },
    hostname: "test-server.example.com",
    nodeVersions: "v18.17.0",
    serverId: "server-456",
    uptime: 3600000, // 1 hour in milliseconds
  };

  it("renders table with correct accessibility attributes", () => {
    render(<ServerInfo {...mockProps} />);

    const table = screen.getByRole("table");
    expect(table).toHaveAttribute("aria-label", "Server Info");
  });

  it("renders table headers", () => {
    render(<ServerInfo {...mockProps} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
  });

  it("renders all server information rows", () => {
    render(<ServerInfo {...mockProps} />);

    // Check all the row labels
    expect(screen.getByText("Hostname")).toBeInTheDocument();
    expect(screen.getByText("Uptime")).toBeInTheDocument();
    expect(screen.getByText("Server ID")).toBeInTheDocument();
    expect(screen.getByText("Deployment ID")).toBeInTheDocument();
    expect(screen.getByText("Node Versions")).toBeInTheDocument();
    expect(
      screen.getByText("Extension Sync | Total Sync All Count")
    ).toBeInTheDocument();

    // Check all the values
    expect(screen.getByText("test-server.example.com")).toBeInTheDocument();
    expect(screen.getByText("3600000")).toBeInTheDocument();
    expect(screen.getByText("server-456")).toBeInTheDocument();
    expect(screen.getByText("deploy-123")).toBeInTheDocument();
    expect(screen.getByText("v18.17.0")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders correct number of table rows", () => {
    render(<ServerInfo {...mockProps} />);

    const table = screen.getByRole("table");
    const rows = table.querySelectorAll("tbody tr");
    expect(rows).toHaveLength(6); // 6 server info items
  });

  it("handles zero uptime", () => {
    const propsWithZeroUptime = {
      ...mockProps,
      uptime: 0,
    };

    render(<ServerInfo {...propsWithZeroUptime} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("handles zero extension sync count", () => {
    const propsWithZeroSync = {
      ...mockProps,
      extensionSync: {
        totalSyncAllCount: 0,
      },
    };

    render(<ServerInfo {...propsWithZeroSync} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("handles empty string values", () => {
    const propsWithEmptyStrings = {
      ...mockProps,
      hostname: "",
      nodeVersions: "",
      serverId: "",
      deploymentId: "",
    };

    render(<ServerInfo {...propsWithEmptyStrings} />);

    // Should still render the labels
    expect(screen.getByText("Hostname")).toBeInTheDocument();
    expect(screen.getByText("Node Versions")).toBeInTheDocument();
    expect(screen.getByText("Server ID")).toBeInTheDocument();
    expect(screen.getByText("Deployment ID")).toBeInTheDocument();

    // Empty values should be rendered as empty cells
    const table = screen.getByRole("table");
    const cells = table.querySelectorAll("tbody td");

    // Check that some cells are empty (but still present)
    const emptyCells = Array.from(cells).filter(
      (cell) => cell.textContent === ""
    );
    expect(emptyCells.length).toBeGreaterThan(0);
  });
});
