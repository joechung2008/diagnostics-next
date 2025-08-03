import { render, screen } from "@testing-library/react";
import RootLayout from "../app/layout";

// Mock the FluentProvider to avoid theme-related issues in tests
jest.mock("@fluentui/react-components", () => ({
  FluentProvider: ({
    children,
    theme,
  }: {
    children: React.ReactNode;
    theme: { name?: string };
  }) => (
    <div
      data-testid="fluent-provider"
      data-theme={theme?.name || "mocked-theme"}
    >
      {children}
    </div>
  ),
  webDarkTheme: { name: "webDarkTheme" },
}));

describe("RootLayout", () => {
  const mockChildren = <div data-testid="test-children">Test Content</div>;

  // Note: Testing Next.js layout components that render HTML structure is limited
  // in Jest/RTL environment. We focus on testing the component structure and props.

  it("renders component structure correctly", () => {
    const { container } = render(<RootLayout>{mockChildren}</RootLayout>);

    // The component should render without errors
    expect(container).toBeInTheDocument();
  });

  it("renders FluentProvider with webDarkTheme", () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    const fluentProvider = screen.getByTestId("fluent-provider");
    expect(fluentProvider).toBeInTheDocument();
    expect(fluentProvider).toHaveAttribute("data-theme", "webDarkTheme");
  });

  it("renders children inside FluentProvider", () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    const children = screen.getByTestId("test-children");
    expect(children).toBeInTheDocument();
    expect(children).toHaveTextContent("Test Content");

    // Verify children are inside FluentProvider
    const fluentProvider = screen.getByTestId("fluent-provider");
    expect(fluentProvider).toContainElement(children);
  });

  it("renders body element", () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    const bodyElement = document.body;
    expect(bodyElement).toBeInTheDocument();
  });

  it("handles multiple children", () => {
    const multipleChildren = (
      <>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </>
    );

    render(<RootLayout>{multipleChildren}</RootLayout>);

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
    expect(screen.getByTestId("child-3")).toBeInTheDocument();

    // All children should be inside FluentProvider
    const fluentProvider = screen.getByTestId("fluent-provider");
    expect(fluentProvider).toContainElement(screen.getByTestId("child-1"));
    expect(fluentProvider).toContainElement(screen.getByTestId("child-2"));
    expect(fluentProvider).toContainElement(screen.getByTestId("child-3"));
  });

  it("handles empty children", () => {
    render(<RootLayout>{null}</RootLayout>);

    const fluentProvider = screen.getByTestId("fluent-provider");
    expect(fluentProvider).toBeInTheDocument();
    expect(fluentProvider).toBeEmptyDOMElement();
  });

  it("handles string children", () => {
    render(<RootLayout>Simple text content</RootLayout>);

    const fluentProvider = screen.getByTestId("fluent-provider");
    expect(fluentProvider).toHaveTextContent("Simple text content");
  });

  it("handles complex nested children", () => {
    const complexChildren = (
      <div data-testid="parent">
        <header data-testid="header">Header Content</header>
        <main data-testid="main">
          <section data-testid="section">Section Content</section>
        </main>
        <footer data-testid="footer">Footer Content</footer>
      </div>
    );

    render(<RootLayout>{complexChildren}</RootLayout>);

    expect(screen.getByTestId("parent")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("main")).toBeInTheDocument();
    expect(screen.getByTestId("section")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();

    // Verify nested structure is preserved
    const parent = screen.getByTestId("parent");
    const main = screen.getByTestId("main");
    const section = screen.getByTestId("section");

    expect(parent).toContainElement(main);
    expect(main).toContainElement(section);
  });
});
