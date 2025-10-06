# jEpub Test Suite

This document describes the comprehensive test suite for the jEpub library,
which provides unit tests, integration tests, and error handling tests.

## Test Coverage Status

✅ **All 91 tests passing** 📊 **89.46% statement coverage** 🎯 **95.6% branch
coverage**

## Test Structure

The test suite is organized into four main test files:

### 1. utils.test.js

Tests for utility functions used throughout the library:

- **uuidv4()**: UUID generation and validation
- **isObject()**: Object type checking
- **isEmpty()**: Empty value validation
- **getISODate()**: Date formatting
- **parseDOM()**: HTML/XHTML parsing
- **html2text()**: HTML to text conversion
- **validateUrl()**: URL validation
- **mime2ext()**: MIME type to file extension conversion

**Coverage**: 29 tests covering core utility functions

### 2. jepub.test.js

Unit tests for the main jEpub class:

- **Constructor**: Initialization of class properties
- **init()**: Book metadata setup and configuration
- **date()**: Publication date setting
- **uuid()**: UUID/URI configuration
- **cover()**: Cover image handling (Blob and ArrayBuffer)
- **image()**: Content image management
- **notes()**: Notes/appendix content
- **add()**: Page/chapter addition
- **generate()**: EPUB file generation
- **Method chaining**: Fluent API support

**Coverage**: 31 tests covering all public methods and features

### 3. integration.test.js

End-to-end integration tests:

- **Complete EPUB Generation**: Full workflow with all features
- **Minimal EPUB Creation**: Basic book generation
- **Image Format Support**: Different image type handling
- **Error Handling**: Graceful degradation
- **Performance**: Large content efficiency testing

**Coverage**: 7 comprehensive integration tests

### 4. errors.test.js

Error handling and edge case tests:

- **Initialization Errors**: Invalid configuration handling
- **Date Validation**: Invalid date object handling
- **UUID Validation**: Empty/invalid UUID handling
- **Image Errors**: Invalid image data handling
- **Content Validation**: Empty/invalid content handling
- **Generation Errors**: Unsupported output types
- **Edge Cases**: Large content, special characters, malformed HTML

**Coverage**: 24 tests for error scenarios and edge cases

- Date formatting
- HTML parsing and text conversion
- URL validation
- MIME type handling

- **`jepub.test.js`** - Unit tests for the main jEpub class
  - Constructor initialization
  - Method functionality
  - Input validation
  - Method chaining
  - EPUB generation

- **`integration.test.js`** - Integration tests
  - Complete EPUB creation workflow
  - Multiple image formats
  - Large content handling
  - Performance benchmarks

- **`errors.test.js`** - Error handling and edge cases
  - Invalid input validation
  - Error recovery
  - Edge case scenarios
  - Boundary conditions

### Test Configuration

- **`setup.js`** - Test environment setup
  - Mock browser APIs (crypto, DOMParser, XMLSerializer, Blob)
  - Global test constants
  - Environment compatibility helpers

- **`vitest.config.js`** - Vitest configuration
  - Test environment setup
  - Coverage reporting
  - File patterns and exclusions

## Running Tests

### Basic Test Execution

```bash
# Run all tests once
npm run test:run

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with UI interface
npm run test:ui
```

### Test Categories

```bash
# Run only unit tests
npx vitest run utils.test.js jepub.test.js

# Run only integration tests
npx vitest run integration.test.js

# Run only error tests
npx vitest run errors.test.js
```

## Test Coverage

The test suite aims for comprehensive coverage including:

- ✅ **Function Coverage** - All public methods tested
- ✅ **Branch Coverage** - All conditional paths tested
- ✅ **Edge Cases** - Boundary conditions and error scenarios
- ✅ **Integration** - Complete workflows and feature combinations
- ✅ **Performance** - Large data handling and time constraints

## Mock Objects and Test Data

### Test Constants

Available in all test files via `globalThis.TEST_CONSTANTS`:

```javascript
{
  SAMPLE_HTML: '<h1>Test Title</h1><p>Test content...</p>',
  SAMPLE_EPUB_CONFIG: {
    title: 'Test Book',
    author: 'Test Author',
    // ... other properties
  },
  MOCK_IMAGE_DATA: new Uint8Array([...]) // Sample JPEG data
}
```

### Browser API Mocks

The test environment provides mocks for:

- `crypto.getRandomValues()` - For UUID generation
- `DOMParser` - For HTML parsing
- `XMLSerializer` - For DOM serialization
- `Blob` - For binary data handling

## Writing New Tests

### Test File Naming

- Unit tests: `*.test.js`
- Integration tests: `integration.*.test.js`
- Error tests: `errors.*.test.js`

### Example Test Structure

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { functionToTest } from '../src/module.js';

describe('Module Name', () => {
  beforeEach(() => {
    // Setup before each test
  });

  describe('Function Name', () => {
    it('should handle normal case', () => {
      const result = functionToTest('input');
      expect(result).toBe('expected');
    });

    it('should handle edge case', () => {
      expect(() => functionToTest(null)).toThrow('Error message');
    });
  });
});
```

### Best Practices

1. **Descriptive Test Names** - Use clear, specific descriptions
2. **Arrange-Act-Assert** - Structure tests clearly
3. **Mock External Dependencies** - Use mocks for browser APIs
4. **Test Edge Cases** - Include null, undefined, empty values
5. **Async Testing** - Use async/await for Promise-based functions
6. **Cleanup** - Reset state between tests using `beforeEach`

## Debugging Tests

### Debug Individual Tests

```bash
# Run specific test file
npx vitest run utils.test.js

# Run specific test suite
npx vitest run -t "UUID generation"

# Run with debug output
npx vitest run --reporter=verbose
```

### Browser Debugging

```bash
# Open test UI in browser
npm run test:ui
```

## Continuous Integration

These tests are designed to run in CI environments and include:

- Cross-platform compatibility (Node.js and browser environments)
- No external dependencies beyond declared peer dependencies
- Deterministic results (mocked random functions)
- Performance benchmarks with reasonable timeouts

## Performance Benchmarks

The integration tests include performance benchmarks:

- Large content handling (100 chapters)
- Complete EPUB generation (< 5 seconds)
- Memory efficiency validation
- File size optimization checks
