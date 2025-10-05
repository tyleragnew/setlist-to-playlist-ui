# TypeScript Expert Instructions

## 1. Project Setup and Configuration

- **Enable Strict Mode:** Always set `"strict": true` in your `tsconfig.json`. This enforces all strict type-checking options, leading to more robust and reliable code.
- **Target Modern JavaScript:** Configure `target` to a recent ECMAScript version (e.g., `ES2022`, `ESNext`) in `tsconfig.json` for optimal performance and feature availability.
- **Module Resolution:** Understand and configure `moduleResolution` (e.g., `node`, `bundler`) based on your project's module system and build tools.
- **ESLint Integration:** Integrate ESLint with TypeScript support (e.g., `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`) for consistent code style and error detection.
- **Prettier Configuration:** Use Prettier for automated code formatting to maintain a consistent style across the codebase.

## 2. Type System Mastery

- **Generics:** Leverage generics extensively for writing reusable and type-safe code that works with various data types.
- **Advanced Types:** Master concepts like conditional types, infer keyword, mapped types, and template literal types for sophisticated type manipulation.
- **Utility Types:** Utilize built-in utility types (e.g., `Partial`, `Required`, `Pick`, `Omit`, `Exclude`, `Extract`) to transform and derive new types efficiently.
- **Type Guards and Assertions:** Employ type guards (e.g., `typeof`, `instanceof`, custom user-defined type guards) and type assertions (`as`) judiciously to narrow down types when appropriate.
- **Discriminated Unions:** Design robust and type-safe state management or data structures using discriminated unions.
- **Avoid `any`:** Strive to eliminate `any` usage. Use `unknown` when a type is truly unknown and perform runtime checks to narrow its type.

## 3. Code Structure and Best Practices

- **Interfaces vs. Types:** Understand the nuances and prefer interfaces for defining object shapes and classes, while using types for unions, intersections, and complex type aliases.
- **Functional Programming Principles:** Embrace functional programming concepts like immutability and pure functions, leveraging TypeScript's type system to enforce these principles.
- **Modularization:** Design your application with clear module boundaries, using named exports and imports for better organization and testability.
- **Error Handling:** Implement robust error handling strategies, defining custom error types and utilizing `try-catch` blocks with specific error type checks.
- **Performance Considerations:** Be mindful of type inference performance, especially with deeply nested or complex types, and optimize where necessary.
- **Documentation:** Provide clear and concise TSDoc comments for functions, classes, and interfaces to enhance code readability and maintainability.

## 4. Tooling and Development Workflow

- **VS Code Integration:** Maximize productivity with VS Code's excellent TypeScript support, including intelligent autocompletion, refactoring tools, and integrated debugging.
- **Build Process:** Optimize your build process using tools like Webpack, Rollup, or Vite, ensuring efficient compilation and bundling of your TypeScript code.
- **Testing:** Write comprehensive unit and integration tests for your TypeScript code, leveraging testing frameworks like Jest or Vitest with TypeScript support.
- **CI/CD Integration:** Integrate TypeScript compilation and linting into your CI/CD pipeline to ensure code quality and prevent regressions.
- **Stay Updated:** Keep abreast of the latest TypeScript versions and features, as the language evolves rapidly.