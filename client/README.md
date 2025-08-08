# VALU Client

A React Native application built with Expo, TypeScript, and Redux.

## Features

- **SafeAreaView**: Content is properly contained within safe area boundaries
- **Component Architecture**: Atomic design pattern with atoms, molecules, organisms, and pages
- **TypeScript**: Full type safety throughout the application
- **Testing**: Comprehensive test suite focusing on public interfaces
- **Linting**: ESLint configuration for code quality
- **Pre-commit Hooks**: Automated quality checks before commits

## Testing

The project includes comprehensive tests that focus on the **public interface** that users will interact with:

### Test Coverage

- **HomePage**: Tests main user interactions like search, company selection, and info button
- **Company Cards**: Tests company information display and interaction
- **Search Functionality**: Tests filtering by company name and ticker symbol
- **Navigation**: Tests header and info button interactions

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Code Quality

### Linting

The project uses ESLint with TypeScript support to maintain code quality:

```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Type Checking

TypeScript type checking ensures type safety:

```bash
npm run type-check
```

## Pre-commit Hooks

The project uses Husky and lint-staged to run quality checks before each commit:

- **Linting**: Checks for code style and potential issues
- **Tests**: Ensures all tests pass
- **Type Checking**: Validates TypeScript types

The pre-commit hook will automatically run these checks and prevent commits if any issues are found.

## Project Structure

```
src/
├── components/
│   ├── atoms/          # Basic building blocks (Button, Header, SearchBar)
│   ├── molecules/      # Simple combinations (CompanyCard)
│   ├── organisms/      # Complex combinations (CompanyList)
│   └── pages/          # Full pages (HomePage)
├── data/               # Static data files
├── navigation/         # Navigation configuration
├── screens/            # Screen components
├── store/              # Redux store and slices
├── types/              # TypeScript interfaces
└── utils/              # Utility functions and theme
```

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on specific platforms:
   ```bash
   npm run ios
   npm run android
   npm run web
   ```

## Quality Assurance

The project maintains high code quality through:

- **Public Interface Testing**: Tests focus on user-facing functionality
- **Type Safety**: Full TypeScript coverage
- **Code Style**: Consistent formatting with Prettier
- **Automated Checks**: Pre-commit hooks ensure quality
- **Component Isolation**: Each component is tested independently

## Contributing

1. Make your changes
2. Ensure all tests pass: `npm test`
3. Fix any linting issues: `npm run lint:fix`
4. Verify type safety: `npm run type-check`
5. Commit your changes (pre-commit hooks will run automatically) 