# Contributing to Smart Model Router

First off, thank you for considering contributing to Smart Model Router! 🌸

## Code of Conduct

Be kind. Be respectful. We're all here to build something useful together.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When you create a bug report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs what actually happened
- **Environment details** (Node.js version, OS, etc.)
- **Code samples** if applicable

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Include:

- **Clear title** describing the suggestion
- **Detailed description** of the proposed functionality
- **Use case** explaining why this would be useful
- **Examples** of how it would work

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes**
4. **Add tests** for any new functionality
5. **Run the test suite**: `npm test`
6. **Ensure tests pass** and coverage remains high
7. **Update documentation** if needed
8. **Submit a pull request**

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/skylily-smart-router.git
cd skylily-smart-router

# Install dependencies
npm install

# Run tests in watch mode
npm run test:watch

# Build the project
npm run build

# Run with coverage
npm run test:coverage
```

## Project Structure

```
src/
├── index.ts      # Main exports
├── models.ts     # Model definitions and costs
├── analyzer.ts   # Task complexity analysis
├── router.ts     # Routing logic
├── cli.ts        # CLI implementation
└── errors.ts     # Custom error classes

tests/
├── models.test.ts
├── analyzer.test.ts
├── router.test.ts
└── integration.test.ts

examples/
├── basic-usage.ts
├── with-config.ts
└── batch-routing.ts
```

## Coding Guidelines

### TypeScript

- Use strict TypeScript (`strict: true`)
- Export all public types
- Document public APIs with JSDoc comments
- Avoid `any` - use proper types

### Testing

- Write tests for all new functionality
- Aim for 80%+ coverage
- Test edge cases and error conditions
- Use descriptive test names

### Commits

Use conventional commits:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation only
- `test:` adding/updating tests
- `refactor:` code change without feature/fix
- `chore:` maintenance tasks

Example:
```
feat: add support for custom model definitions
fix: handle empty task text gracefully
docs: add examples for batch routing
```

## Adding New Models

To add a new model:

1. Add the model definition to `src/models.ts`:
   ```typescript
   'provider/model-id': {
     id: 'model-id',
     provider: 'provider',
     name: 'Model Name',
     tier: 'standard',
     capabilities: ['coding', 'analysis'],
     contextWindow: 128000,
     maxTokens: 4096,
     cost: { inputPer1M: 1.0, outputPer1M: 2.0 },
     strengths: ['fast', 'reliable'],
     weaknesses: ['limited reasoning'],
     reasoning: false,
   },
   ```

2. Add tests for the new model
3. Update the README if it's a major addition

## Questions?

Feel free to open an issue for any questions about contributing.

Thank you for helping make Smart Model Router better! 🧠✨
