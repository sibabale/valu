# Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to standardize commit messages and enable automatic changelog generation.

## Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation
- **ci**: Changes to CI configuration files and scripts
- **revert**: Reverts a previous commit
- **build**: Changes that affect the build system or external dependencies
- **deps**: Dependency updates

## Examples

### Feature
```bash
feat: add search functionality to company list
feat(header): add info button with modal
```

### Bug Fix
```bash
fix: resolve company card press event not firing
fix(search): handle empty search results properly
```

### Documentation
```bash
docs: update README with setup instructions
docs(api): add JSDoc comments to utility functions
```

### Style Changes
```bash
style: format code with prettier
style(components): fix button alignment
```

### Refactoring
```bash
refactor: extract company card into separate component
refactor(utils): simplify date formatting logic
```

### Tests
```bash
test: add unit tests for search functionality
test(components): add integration tests for company list
```

### Chores
```bash
chore: update dependencies
chore: configure eslint rules
```

## Interactive Commit

Use the interactive commit tool:

```bash
npm run commit
```

This will guide you through creating a conventional commit message step by step.

## Manual Commit

You can also write conventional commits manually:

```bash
git commit -m "feat: add new company card component"
git commit -m "fix: resolve search input not updating state"
```

## Validation

All commit messages are automatically validated by the commit-msg hook. Invalid commit messages will be rejected.

## Breaking Changes

To indicate a breaking change, add `!` after the type/scope and `BREAKING CHANGE:` in the body:

```bash
feat!: change API response format

BREAKING CHANGE: API now returns data in camelCase instead of snake_case
```

## Commit Message Rules

- Type must be lowercase
- Subject must be lowercase
- No period at the end of subject
- Maximum 72 characters in header
- Body and footer must be separated by blank lines

## Benefits

- **Automatic changelog generation**
- **Clear commit history**
- **Better collaboration**
- **Automated versioning**
- **Easier code reviews** 