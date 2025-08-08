# Configuring Vercel to Block Deployments on Test Failures

This document explains how to configure Vercel to automatically run unit tests before deployment and block deployments if tests fail.

## Configuration Files

### 1. `vercel.json` - Vercel Configuration

```json
{
  "buildCommand": "npm run test:ci && npm run build",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

This configuration:

- Runs tests before building (`npm run test:ci && npm run build`)
- Uses the `&&` operator so build only proceeds if tests pass
- If tests fail, the entire deployment is blocked

### 2. `package.json` - CI Test Script

```json
{
  "scripts": {
    "test:ci": "jest --ci --coverage --watchAll=false --passWithNoTests"
  }
}
```

The `test:ci` script includes:

- `--ci`: Optimized for CI environments
- `--coverage`: Generates coverage reports
- `--watchAll=false`: Prevents Jest from watching files
- `--passWithNoTests`: Allows deployment even if no tests exist

### 3. `.github/workflows/ci.yml` - GitHub Actions (Optional)

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20.x"
          cache: "npm"
      - name: Install dependencies
        run: npm ci
      - name: Run linting
        run: npm run lint
      - name: Run tests
        run: npm run test:ci
      - name: Build project
        run: npm run build
```

## How It Works

1. **Developer pushes code** to repository
2. **Vercel detects changes** and starts deployment process
3. **Tests run first** via `npm run test:ci`
4. **If tests pass**: Build continues and deployment succeeds
5. **If tests fail**: Build stops and deployment is blocked

## Verification

The configuration was tested and verified working:

- **Test Success**: When all tests pass, deployment proceeds normally
- **Test Failure**: When tests fail, deployment is blocked with error message:
  ```
  Error: Command "npm run test:ci && npm run build" exited with 1
  ```

## Benefits

- **Quality Assurance**: Prevents broken code from reaching production
- **Automated Testing**: No manual intervention required
- **Fast Feedback**: Developers know immediately if their changes break tests
- **Cost Effective**: Prevents unnecessary deployments of broken code

## Alternative Methods

### Method 1: Custom Build Script

Create `scripts/vercel-build.sh`:

```bash
#!/bin/bash
set -e
echo "🧪 Running unit tests before build..."
npm test -- --watchAll=false --passWithNoTests
echo "✅ All tests passed! Proceeding with build..."
npm run build
```

### Method 2: Vercel Build Hook

Use Vercel's build hooks to run custom commands before deployment.

### Method 3: Git Hooks

Use pre-push hooks to run tests before code reaches the repository.

## Troubleshooting

### Common Issues

1. **Tests timeout in CI**: Increase Jest timeout or optimize slow tests
2. **Environment differences**: Ensure test environment matches production
3. **Missing dependencies**: Verify all test dependencies are in `package.json`

### Test Environment Issues

If tests fail in CI but pass locally, consider:

- Node.js version differences
- Environment variables
- Production vs development React builds
- File system case sensitivity

## Best Practices

1. **Keep tests fast**: Slow tests delay deployments
2. **Mock external dependencies**: Avoid network calls in tests
3. **Use appropriate test environments**: Configure Jest for your framework
4. **Monitor test coverage**: Maintain good test coverage metrics
5. **Handle flaky tests**: Fix or skip unreliable tests in CI

## Conclusion

This configuration ensures that only code passing all unit tests reaches production, improving code quality and reducing bugs in deployed applications.
