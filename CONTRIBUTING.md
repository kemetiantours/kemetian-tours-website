# Contributing to KemetianTours

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the KemetianTours project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Testing Guidelines](#testing-guidelines)

## 📖 Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:

- Use inclusive language
- Be respectful of different opinions
- Accept constructive criticism
- Focus on what is best for the community
- Show empathy towards others

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/kemetian-tours.git
cd kemetian-tours

# Add upstream remote
git remote add upstream https://github.com/kemetian-tours/website.git
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Create a feature branch
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Make your changes in small, logical commits
- Test your changes locally
- Update documentation as needed

### 4. Keep Your Branch Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch on main
git rebase upstream/main
```

## 💡 How to Contribute

### 1. Reporting Bugs

**Before submitting a bug report:**
- Check if the bug has already been reported
- Be specific about what you were doing when the bug occurred
- Include steps to reproduce
- Describe the expected vs actual behavior

**Bug Report Template:**
```markdown
## Description
Brief description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14]
- Node version: [e.g., 18.0.0]
```

### 2. Requesting Features

**Feature Request Template:**
```markdown
## Description
Clear description of the feature

## Motivation
Why is this feature needed?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches considered
```

### 3. Writing Code

**Pick an issue or create one:**
- Look for issues labeled `good-first-issue` for beginners
- Comment on the issue to claim it
- Discuss approach before starting major work

**Code Organization:**
```
src/
├── components/ComponentName/
│   ├── ComponentName.js       # Component logic
│   ├── ComponentName.css       # Component styles
│   ├── ComponentName.test.js   # Tests
│   └── index.js                # Export
├── scripts/modules/
│   ├── carousel.js
│   ├── carousel.test.js
│   └── index.js
└── data/
    └── destinations.json
```

### 4. Documentation

- Update README.md if your changes affect usage
- Add inline comments for complex logic
- Update docs/ folder for architectural changes
- Include JSDoc comments for functions

## 📤 Pull Request Process

### Before Submitting

```bash
# Ensure your code follows our standards
npm run lint:fix
npm run format

# Run tests
npm run test
npm run test:e2e

# Build for production
npm run build
```

### Submission Steps

1. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request on GitHub:**
   - Use descriptive title (follow commit guidelines below)
   - Reference related issues: "Fixes #123"
   - Describe what changed and why
   - Link to relevant documentation

3. **PR Description Template:**
   ```markdown
   ## Description
   Brief description of changes

   ## Related Issues
   Fixes #123

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## How Has This Been Tested?
   Description of testing approach

   ## Checklist
   - [ ] Tests pass locally
   - [ ] Code follows style guidelines
   - [ ] Documentation updated
   - [ ] No breaking changes (unless discussed)
   ```

4. **Code Review:**
   - Address reviewer comments
   - Push additional commits to the same branch
   - Don't force-push after review has started (unless requested)

5. **Merging:**
   - Your PR will be merged once approved
   - Use "Squash and merge" for feature branches
   - Use "Create a merge commit" for important features

## 📝 Coding Standards

### JavaScript/TypeScript

```javascript
// ✅ Good: Clear naming, proper formatting
function calculateTourPrice(basePrice, discountPercent) {
  const discountAmount = basePrice * (discountPercent / 100);
  return basePrice - discountAmount;
}

// ✅ Good: Async error handling
async function fetchDestinations() {
  try {
    const response = await fetch('/api/destinations');
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
}

// ❌ Avoid: Unclear naming, missing error handling
function calc(p, d) {
  return p - p * d / 100;
}

const data = fetch('/api/destinations').then(r => r.json());
```

### CSS/Tailwind

```css
/* ✅ Good: Organized, modular */
.destination-card {
  @apply rounded-lg shadow-md hover:shadow-lg transition-shadow;
  @apply bg-white p-4;
}

.destination-card__title {
  @apply text-xl font-bold text-gray-900;
}

/* ❌ Avoid: Inline styles, magic numbers */
.destination {
  margin: 12px;
  padding: 8px;
  border-radius: 5px;
}
```

### HTML

```html
<!-- ✅ Good: Semantic, accessible -->
<article class="destination-card" aria-label="Cairo destination">
  <img 
    src="cairo.jpg" 
    alt="Pyramids of Giza in Cairo"
    loading="lazy"
  />
  <h2>Cairo</h2>
  <p>Experience ancient wonders</p>
</article>

<!-- ❌ Avoid: Non-semantic, no alt text -->
<div class="destination">
  <img src="cairo.jpg"/>
  <h2>Cairo</h2>
</div>
```

### Comments

```javascript
// ✅ Good: Explains WHY not WHAT
// We use trim() because API sometimes includes trailing spaces
const destination = response.trim();

// ✅ Good: JSDoc for functions
/**
 * Calculates the total tour cost including all fees
 * @param {number} basePrice - Base tour price in USD
 * @param {number[]} addOns - Array of additional service costs
 * @returns {number} Total cost including all fees
 */
function calculateTotalCost(basePrice, addOns) {
  return basePrice + addOns.reduce((sum, cost) => sum + cost, 0);
}

// ❌ Avoid: Explains obvious code
const x = 5; // Set x to 5
x++; // Increment x
```

## 📌 Commit Message Guidelines

We follow **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **ci**: CI/CD configuration changes
- **chore**: Dependency updates, build changes

### Examples

```bash
# Good: Feature with scope
git commit -m "feat(destinations): add filter by price range"

# Good: Bug fix with description
git commit -m "fix(carousel): prevent auto-play during modal open

- Stop animation when modal opens
- Resume when modal closes
Fixes #456"

# Good: Documentation update
git commit -m "docs: update deployment instructions for Vercel"

# Bad: Vague message
git commit -m "update stuff"

# Bad: Imperative mood not used
git commit -m "Added new feature"
```

## 🧪 Testing Guidelines

### Writing Tests

```javascript
// Unit test example
describe('TourService', () => {
  describe('calculatePrice', () => {
    it('should calculate correct price with discount', () => {
      const result = calculatePrice(100, 10);
      expect(result).toBe(90);
    });

    it('should handle zero discount', () => {
      const result = calculatePrice(100, 0);
      expect(result).toBe(100);
    });

    it('should throw error for invalid input', () => {
      expect(() => calculatePrice('invalid', 10)).toThrow();
    });
  });
});
```

### E2E Test Example

```javascript
// E2E test example
test('user can book a tour', async ({ page }) => {
  // Navigate to site
  await page.goto('/');
  
  // Click destination
  await page.click('[data-test="cairo-destination"]');
  
  // Fill booking form
  await page.fill('[name="name"]', 'John Doe');
  await page.fill('[name="email"]', 'john@example.com');
  
  // Submit
  await page.click('button[type="submit"]');
  
  // Verify success
  await expect(page.locator('text=Booking confirmed')).toBeVisible();
});
```

### Test Requirements

- Write tests for new features
- Update tests when modifying code
- Ensure tests pass before submitting PR
- Aim for >80% code coverage

## 🔍 Review Process

### What Reviewers Look For

- Code quality and readability
- Test coverage
- Documentation updates
- Performance implications
- Security concerns
- Consistency with project standards

### Responding to Feedback

- Be gracious and open-minded
- Ask questions if feedback is unclear
- Update your code based on feedback
- Push new commits to the same branch
- Avoid force-pushing after review starts

## ✨ Best Practices

### Before You Start

- Check existing issues and PRs
- Read ARCHITECTURE.md
- Understand the project structure
- Set up development environment

### During Development

- Make small, focused commits
- Write meaningful commit messages
- Test locally before pushing
- Keep your branch updated
- Ask for help in comments

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests written and passing
- [ ] No console.logs or debug code
- [ ] Documentation updated
- [ ] No breaking changes (discuss if needed)
- [ ] Performance impact considered
- [ ] Accessibility standards met
- [ ] Security implications reviewed

## 🎓 Learning Resources

- [JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Jest Testing Library](https://jestjs.io/)
- [Web Accessibility](https://www.w3.org/WAI/)

## 🆘 Getting Help

- Check [existing issues](https://github.com/kemetian-tours/website/issues)
- Read [documentation](docs/)
- Comment on the issue you're working on
- Join our [discussions](https://github.com/kemetian-tours/website/discussions)

## 📞 Contact

- **Email**: bookings@kemetiantours.com
- **Issues**: [GitHub Issues](https://github.com/kemetian-tours/website/issues)

---

**Thank you for contributing to KemetianTours! Every contribution helps us create an amazing travel experience. 🙏**
