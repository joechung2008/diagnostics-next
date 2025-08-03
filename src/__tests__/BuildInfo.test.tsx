import { render, screen } from "@testing-library/react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import BuildInfo from "../BuildInfo";

// Wrapper component to provide Fluent UI context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FluentProvider theme={webLightTheme}>{children}</FluentProvider>
);

describe("BuildInfo", () => {
  it("renders build version correctly", () => {
    const buildVersion = "1.2.3";

    render(
      <TestWrapper>
        <BuildInfo buildVersion={buildVersion} />
      </TestWrapper>
    );

    expect(screen.getByText("Build Version")).toBeInTheDocument();
    expect(screen.getByText("1.2.3")).toBeInTheDocument();
  });

  it("renders table with correct headers", () => {
    render(
      <TestWrapper>
        <BuildInfo buildVersion="test-version" />
      </TestWrapper>
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
  });

  it("has correct accessibility attributes", () => {
    render(
      <TestWrapper>
        <BuildInfo buildVersion="test-version" />
      </TestWrapper>
    );

    const table = screen.getByRole("table");
    expect(table).toHaveAttribute("aria-label", "Build Info");
  });
});
