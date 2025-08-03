import { render, screen } from "@testing-library/react";
import StageDefinition from "../StageDefinition";

describe("StageDefinition", () => {
  const mockStageDefinition = {
    build: ["compile", "test", "package"],
    deploy: ["upload", "configure"],
    monitor: ["health-check"],
  };

  it("renders stage definition title", () => {
    render(<StageDefinition stageDefinition={mockStageDefinition} />);

    expect(screen.getByText("Stage Definitions")).toBeInTheDocument();
  });

  it("renders table with correct headers", () => {
    render(<StageDefinition stageDefinition={mockStageDefinition} />);

    expect(screen.getByText("Key")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
  });

  it("renders all stage definition key-value pairs", () => {
    render(<StageDefinition stageDefinition={mockStageDefinition} />);

    // Check that all keys are rendered
    expect(screen.getByText("build")).toBeInTheDocument();
    expect(screen.getByText("deploy")).toBeInTheDocument();
    expect(screen.getByText("monitor")).toBeInTheDocument();

    // Check that all values are rendered as comma-separated strings
    expect(screen.getByText("compile, test, package")).toBeInTheDocument();
    expect(screen.getByText("upload, configure")).toBeInTheDocument();
    expect(screen.getByText("health-check")).toBeInTheDocument();
  });

  it("renders correct number of table rows", () => {
    render(<StageDefinition stageDefinition={mockStageDefinition} />);

    const table = screen.getByRole("table");
    const rows = table.querySelectorAll("tbody tr");
    expect(rows).toHaveLength(3); // 3 stage definitions
  });

  it("handles empty stage definition", () => {
    render(<StageDefinition stageDefinition={{}} />);

    expect(screen.getByText("Stage Definitions")).toBeInTheDocument();
    expect(screen.getByText("Key")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();

    // Should not have any data rows
    const table = screen.getByRole("table");
    const rows = table.querySelectorAll("tbody tr");
    expect(rows).toHaveLength(0);
  });

  it("handles stage with empty array", () => {
    const stageWithEmptyArray = {
      "empty-stage": [],
      "normal-stage": ["step1", "step2"],
    };

    render(<StageDefinition stageDefinition={stageWithEmptyArray} />);

    expect(screen.getByText("empty-stage")).toBeInTheDocument();
    expect(screen.getByText("normal-stage")).toBeInTheDocument();

    // Empty array should render as empty string
    expect(screen.getByText("step1, step2")).toBeInTheDocument();

    // Find the row with empty-stage and check its value cell
    const table = screen.getByRole("table");
    const rows = table.querySelectorAll("tbody tr");
    const emptyStageRow = Array.from(rows).find((row) =>
      row.textContent?.includes("empty-stage")
    );
    expect(emptyStageRow).toBeTruthy();

    // The value cell should be empty for empty array
    const valueCells = emptyStageRow?.querySelectorAll("td");
    expect(valueCells?.[1]?.textContent).toBe("");
  });

  it("handles stage with single item", () => {
    const singleItemStage = {
      single: ["only-step"],
    };

    render(<StageDefinition stageDefinition={singleItemStage} />);

    expect(screen.getByText("single")).toBeInTheDocument();
    expect(screen.getByText("only-step")).toBeInTheDocument();
  });

  it("has correct accessibility attributes", () => {
    render(<StageDefinition stageDefinition={mockStageDefinition} />);

    const table = screen.getByRole("table");
    expect(table).toHaveAttribute("aria-label", "Stage Definitions");
  });

  it("handles special characters in stage names and steps", () => {
    const specialCharStages = {
      "stage-with-dashes": ["step_with_underscores", "step with spaces"],
      "stage.with.dots": ["step@symbol", "step#hash"],
    };

    render(<StageDefinition stageDefinition={specialCharStages} />);

    expect(screen.getByText("stage-with-dashes")).toBeInTheDocument();
    expect(screen.getByText("stage.with.dots")).toBeInTheDocument();
    expect(
      screen.getByText("step_with_underscores, step with spaces")
    ).toBeInTheDocument();
    expect(screen.getByText("step@symbol, step#hash")).toBeInTheDocument();
  });
});
