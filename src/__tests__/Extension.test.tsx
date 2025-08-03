import { render, screen } from "@testing-library/react";
import Extension from "../Extension";

// Mock the child components
jest.mock("../Configuration", () => {
  return function MockConfiguration({
    config,
  }: {
    config: Record<string, string>;
  }) {
    return (
      <div data-testid="configuration">
        Configuration with {Object.keys(config).length} items
      </div>
    );
  };
});

jest.mock("../StageDefinition", () => {
  return function MockStageDefinition({
    stageDefinition,
  }: {
    stageDefinition: Record<string, string[]>;
  }) {
    return (
      <div data-testid="stage-definition">
        StageDefinition with {Object.keys(stageDefinition).length} stages
      </div>
    );
  };
});

describe("Extension", () => {
  const mockProps = {
    extensionName: "Test Extension",
    config: {
      setting1: "value1",
      setting2: "value2",
    },
    stageDefinition: {
      stage1: ["step1", "step2"],
      stage2: ["step3", "step4"],
    },
  };

  it("renders extension name", () => {
    render(<Extension {...mockProps} />);

    expect(screen.getByText("Test Extension")).toBeInTheDocument();
  });

  it("renders Configuration component when config is provided", () => {
    render(<Extension {...mockProps} />);

    expect(screen.getByTestId("configuration")).toBeInTheDocument();
    expect(screen.getByText("Configuration with 2 items")).toBeInTheDocument();
  });

  it("renders StageDefinition component when stageDefinition is provided", () => {
    render(<Extension {...mockProps} />);

    expect(screen.getByTestId("stage-definition")).toBeInTheDocument();
    expect(
      screen.getByText("StageDefinition with 2 stages")
    ).toBeInTheDocument();
  });

  it("does not render Configuration when config is not provided", () => {
    const propsWithoutConfig = {
      extensionName: "Test Extension",
      stageDefinition: mockProps.stageDefinition,
    };

    render(<Extension {...propsWithoutConfig} />);

    expect(screen.getByText("Test Extension")).toBeInTheDocument();
    expect(screen.queryByTestId("configuration")).not.toBeInTheDocument();
    expect(screen.getByTestId("stage-definition")).toBeInTheDocument();
  });

  it("does not render StageDefinition when stageDefinition is not provided", () => {
    const propsWithoutStageDefinition = {
      extensionName: "Test Extension",
      config: mockProps.config,
    };

    render(<Extension {...propsWithoutStageDefinition} />);

    expect(screen.getByText("Test Extension")).toBeInTheDocument();
    expect(screen.getByTestId("configuration")).toBeInTheDocument();
    expect(screen.queryByTestId("stage-definition")).not.toBeInTheDocument();
  });

  it("renders only extension name when neither config nor stageDefinition are provided", () => {
    const minimalProps = {
      extensionName: "Minimal Extension",
    };

    render(<Extension {...minimalProps} />);

    expect(screen.getByText("Minimal Extension")).toBeInTheDocument();
    expect(screen.queryByTestId("configuration")).not.toBeInTheDocument();
    expect(screen.queryByTestId("stage-definition")).not.toBeInTheDocument();
  });
});
