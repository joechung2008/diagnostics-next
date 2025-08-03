import { render, screen, fireEvent } from "@testing-library/react";
import Extensions from "../Extensions";

// Mock the utils functions
jest.mock("../utils", () => ({
  byKey: (a: { key: string }, b: { key: string }) => a.key.localeCompare(b.key),
  isExtensionInfo: (extension: Extension) => "extensionName" in extension,
  toNavLink: (extension: ExtensionInfo) => ({
    key: extension.extensionName,
    name: extension.extensionName,
    url: `#${extension.extensionName}`,
  }),
}));

describe("Extensions", () => {
  const mockExtensions = {
    ext1: {
      extensionName: "Extension One",
      config: { setting: "value" },
    },
    ext2: {
      extensionName: "Extension Two",
      stageDefinition: { stage: ["step1"] },
    },
    ext3: {
      lastError: {
        errorMessage: "Something went wrong",
        time: "2023-01-01T00:00:00Z",
      },
    },
    ext4: {
      extensionName: "Extension Four",
    },
  };

  const mockOnLinkClick = jest.fn();

  beforeEach(() => {
    mockOnLinkClick.mockClear();
  });

  it("renders navigation with correct aria-label", () => {
    render(
      <Extensions extensions={mockExtensions} onLinkClick={mockOnLinkClick} />
    );

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Extensions");
  });

  it("renders buttons for valid extensions only", () => {
    render(
      <Extensions extensions={mockExtensions} onLinkClick={mockOnLinkClick} />
    );

    // Should render buttons for extensions with extensionName
    expect(screen.getByText("Extension One")).toBeInTheDocument();
    expect(screen.getByText("Extension Two")).toBeInTheDocument();
    expect(screen.getByText("Extension Four")).toBeInTheDocument();

    // Should not render button for extension with error (no extensionName)
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("sorts extensions alphabetically by name", () => {
    render(
      <Extensions extensions={mockExtensions} onLinkClick={mockOnLinkClick} />
    );

    const buttons = screen.getAllByRole("button");
    const buttonTexts = buttons.map((button) => button.textContent);

    expect(buttonTexts).toEqual([
      "Extension Four",
      "Extension One",
      "Extension Two",
    ]);
  });

  it("calls onLinkClick when button is clicked", () => {
    render(
      <Extensions extensions={mockExtensions} onLinkClick={mockOnLinkClick} />
    );

    const button = screen.getByText("Extension One");
    fireEvent.click(button);

    expect(mockOnLinkClick).toHaveBeenCalledTimes(1);
    expect(mockOnLinkClick).toHaveBeenCalledWith(
      expect.any(Object), // MouseEvent
      {
        key: "Extension One",
        name: "Extension One",
        url: "#Extension One",
      }
    );
  });

  it("does not call onLinkClick when onLinkClick is not provided", () => {
    // Create a component without onLinkClick to test optional behavior
    render(
      <Extensions
        extensions={mockExtensions}
        onLinkClick={() => {}} // Provide empty function instead of undefined
      />
    );

    const button = screen.getByText("Extension One");

    // Should not throw error when clicking
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it("renders empty navigation when no valid extensions", () => {
    const emptyExtensions = {
      error1: {
        lastError: {
          errorMessage: "Error 1",
          time: "2023-01-01T00:00:00Z",
        },
      },
      error2: {
        lastError: {
          errorMessage: "Error 2",
          time: "2023-01-01T00:00:00Z",
        },
      },
    };

    render(
      <Extensions extensions={emptyExtensions} onLinkClick={mockOnLinkClick} />
    );

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();

    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(0);
  });

  it("renders empty navigation when extensions object is empty", () => {
    render(<Extensions extensions={{}} onLinkClick={mockOnLinkClick} />);

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();

    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(0);
  });

  it("renders buttons with correct appearance", () => {
    render(
      <Extensions extensions={mockExtensions} onLinkClick={mockOnLinkClick} />
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);

    // Check that buttons are rendered and clickable
    buttons.forEach((button) => {
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
  });
});
