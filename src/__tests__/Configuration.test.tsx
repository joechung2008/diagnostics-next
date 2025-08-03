import { render, screen } from "@testing-library/react";
import Configuration from "../Configuration";

describe("Configuration", () => {
  const mockConfig = {
    setting1: "value1",
    setting2: "value2",
    setting3: "value3",
  };

  it("renders configuration title", () => {
    render(<Configuration config={mockConfig} />);

    expect(screen.getByText("Configuration")).toBeInTheDocument();
  });

  it("renders table with correct headers", () => {
    render(<Configuration config={mockConfig} />);

    expect(screen.getByText("Key")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
  });

  it("renders all configuration key-value pairs", () => {
    render(<Configuration config={mockConfig} />);

    // Check that all keys are rendered
    expect(screen.getByText("setting1")).toBeInTheDocument();
    expect(screen.getByText("setting2")).toBeInTheDocument();
    expect(screen.getByText("setting3")).toBeInTheDocument();

    // Check that all values are rendered
    expect(screen.getByText("value1")).toBeInTheDocument();
    expect(screen.getByText("value2")).toBeInTheDocument();
    expect(screen.getByText("value3")).toBeInTheDocument();
  });

  it("renders empty table when config is empty", () => {
    render(<Configuration config={{}} />);

    expect(screen.getByText("Configuration")).toBeInTheDocument();
    expect(screen.getByText("Key")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();

    // Should not have any data rows
    const table = screen.getByRole("table");
    const rows = table.querySelectorAll("tbody tr");
    expect(rows).toHaveLength(0);
  });

  it("has correct accessibility attributes", () => {
    render(<Configuration config={mockConfig} />);

    const table = screen.getByRole("table");
    expect(table).toHaveAttribute("aria-label", "Configuration");
  });
});
