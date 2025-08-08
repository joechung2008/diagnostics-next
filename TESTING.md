# Unit Testing Guide for Diagnostics Next

This project uses Jest and React Testing Library for unit testing. This guide covers how to write, run, and maintain tests for your Next.js application.

## Table of Contents

1. [Setup](#setup)
2. [Running Tests](#running-tests)
3. [Writing Tests](#writing-tests)
4. [Testing Patterns](#testing-patterns)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

## Setup

The testing environment is already configured with:

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **@testing-library/jest-dom**: Custom Jest matchers for DOM elements
- **@testing-library/user-event**: User interaction simulation
- **jsdom**: DOM environment for Node.js

### Configuration Files

- `jest.config.js`: Jest configuration with Next.js integration
- `jest.setup.js`: Global test setup and mocks
- `tsconfig.json`: TypeScript configuration including Jest types

## Running Tests

### Available Scripts

```bash
# Run all tests once
npm test

# Run tests in watch mode (reruns on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test File Patterns

Jest automatically finds and runs files matching these patterns:

- `**/__tests__/**/*.{js,jsx,ts,tsx}`
- `**/*.{test,spec}.{js,jsx,ts,tsx}`

## Writing Tests

### Basic Test Structure

```typescript
import { render, screen } from '@testing-library/react'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'
import MyComponent from '../MyComponent'

// Wrapper for Fluent UI components
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FluentProvider theme={webLightTheme}>
    {children}
  </FluentProvider>
)

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(
      <TestWrapper>
        <MyComponent />
      </TestWrapper>
    )

    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### Testing Utility Functions

```typescript
import { isExtensionInfo, byKey } from "../utils";

describe("utils", () => {
  describe("isExtensionInfo", () => {
    it("should return true for valid ExtensionInfo object", () => {
      const extensionInfo = {
        extensionName: "test-extension",
        version: "1.0.0",
      };
      expect(isExtensionInfo(extensionInfo)).toBe(true);
    });

    it("should return false for undefined", () => {
      expect(isExtensionInfo(undefined)).toBe(false);
    });
  });
});
```

### Testing Components with Props

```typescript
describe('BuildInfo', () => {
  it('renders build version correctly', () => {
    const buildVersion = '1.2.3'

    render(
      <TestWrapper>
        <BuildInfo buildVersion={buildVersion} />
      </TestWrapper>
    )

    expect(screen.getByText('Build Version')).toBeInTheDocument()
    expect(screen.getByText('1.2.3')).toBeInTheDocument()
  })
})
```

### Testing User Interactions

```typescript
import { fireEvent, waitFor } from '@testing-library/react'

it('handles button click', async () => {
  const mockHandler = jest.fn()

  render(
    <TestWrapper>
      <MyButton onClick={mockHandler} />
    </TestWrapper>
  )

  fireEvent.click(screen.getByRole('button'))

  expect(mockHandler).toHaveBeenCalledTimes(1)
})
```

### Testing Async Operations

```typescript
it('loads data correctly', async () => {
  // Mock API call
  global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue({ data: 'test' })
  })

  render(
    <TestWrapper>
      <MyComponent />
    </TestWrapper>
  )

  await waitFor(() => {
    expect(screen.getByText('test')).toBeInTheDocument()
  })

  expect(global.fetch).toHaveBeenCalledWith('/api/data')
})
```

## Testing Patterns

### 1. Component Mocking

When testing complex components, mock child components to isolate the component under test:

```typescript
jest.mock('../ChildComponent', () => {
  return function MockChildComponent({ prop }: { prop: string }) {
    return <div data-testid="child-component">{prop}</div>
  }
})
```

### 2. API Mocking

Mock fetch calls in your tests:

```typescript
beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue(mockData),
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
```

### 3. Testing with Fluent UI

Always wrap Fluent UI components in a FluentProvider:

```typescript
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FluentProvider theme={webLightTheme}>
    {children}
  </FluentProvider>
)
```

### 4. Accessibility Testing

Test for proper accessibility attributes:

```typescript
it('has correct accessibility attributes', () => {
  render(
    <TestWrapper>
      <MyTable />
    </TestWrapper>
  )

  const table = screen.getByRole('table')
  expect(table).toHaveAttribute('aria-label', 'Data Table')
})
```

## Best Practices

### 1. Test Behavior, Not Implementation

Focus on testing what the component does, not how it does it:

```typescript
// Good: Testing behavior
expect(screen.getByText("Submit")).toBeInTheDocument();

// Avoid: Testing implementation details
expect(component.state.isSubmitting).toBe(false);
```

### 2. Use Semantic Queries

Prefer queries that reflect how users interact with your app:

```typescript
// Good: Semantic queries
screen.getByRole("button", { name: "Submit" });
screen.getByLabelText("Email address");
screen.getByText("Welcome message");

// Avoid: Implementation-focused queries
screen.getByClassName("submit-btn");
screen.getById("email-input");
```

### 3. Test Edge Cases

Include tests for error states, empty states, and boundary conditions:

```typescript
it('handles empty data gracefully', () => {
  render(
    <TestWrapper>
      <DataList items={[]} />
    </TestWrapper>
  )

  expect(screen.getByText('No items found')).toBeInTheDocument()
})
```

### 4. Keep Tests Focused

Each test should verify one specific behavior:

```typescript
// Good: Focused test
it("displays error message when validation fails", () => {
  // Test implementation
});

// Avoid: Testing multiple behaviors
it("handles form submission and validation and error display", () => {
  // Too much in one test
});
```

### 5. Use Descriptive Test Names

Test names should clearly describe what is being tested:

```typescript
// Good: Descriptive names
it("displays loading spinner while fetching data");
it("shows error message when API call fails");
it("enables submit button when form is valid");

// Avoid: Vague names
it("works correctly");
it("handles input");
```

## Troubleshooting

### Common Issues

#### 1. "Found multiple elements with the text"

This happens when Fluent UI renders duplicate elements. Use more specific selectors:

```typescript
// Instead of:
screen.getByText("Build Information");

// Use:
screen.getByRole("tab", { name: "Build Information" });
```

#### 2. "Cannot find name 'describe'"

Make sure Jest types are included in your tsconfig.json:

```json
{
  "compilerOptions": {
    "types": ["jest", "@testing-library/jest-dom"]
  }
}
```

#### 3. "Property 'toBeInTheDocument' does not exist"

Ensure jest-dom is imported in your setup file:

```typescript
// jest.setup.js
import "@testing-library/jest-dom";
```

#### 4. Tests timing out

Increase Jest timeout for slow tests:

```typescript
jest.setTimeout(10000); // 10 seconds
```

### Debugging Tests

1. **Use screen.debug()** to see the rendered DOM:

   ```typescript
   render(<MyComponent />)
   screen.debug() // Prints the DOM to console
   ```

2. **Use screen.logTestingPlaygroundURL()** for interactive debugging:

   ```typescript
   render(<MyComponent />)
   screen.logTestingPlaygroundURL()
   ```

3. **Check what queries are available**:
   ```typescript
   render(<MyComponent />)
   screen.getByRole('') // Will show available roles in error message
   ```

## Coverage Reports

Generate coverage reports to see which parts of your code are tested:

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory and show:

- Line coverage
- Function coverage
- Branch coverage
- Statement coverage

Aim for high coverage but focus on testing critical functionality rather than achieving 100% coverage.

## Continuous Integration

For CI/CD pipelines, run tests with:

```bash
npm test -- --ci --coverage --watchAll=false
```

This ensures tests run once without watch mode and generate coverage reports.
