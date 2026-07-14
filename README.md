# KemetianTours Website

![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

Premium Egyptian travel experiences website - Built with modern web technologies for performance, accessibility, and maintainability.

## 🌟 Features

- **Responsive Design**: Mobile-first approach, works on all devices
- **High Performance**: Optimized assets, lazy loading, code splitting
- **Accessibility**: WCAG 2.1 AA compliant, semantic HTML, ARIA labels
- **SEO Optimized**: Proper metadata, structured data, sitemap
- **Modern Stack**: Webpack, Babel, Tailwind CSS, ES6+
- **Testing**: Unit tests (Jest) and E2E tests (Playwright)
- **CI/CD**: Automated testing and deployment with GitHub Actions

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Performance](#performance)
- [Browser Support](#browser-support)
- [License](#license)

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (or yarn/pnpm)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kemetian-tours/website.git
   cd kemetian-tours
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:8080`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header/
│   ├── Hero/
│   ├── Destinations/
│   ├── Testimonials/
│   ├── FAQ/
│   ├── ContactForm/
│   └── Footer/
├── pages/              # Page templates
│   ├── index.html
│   ├── destinations.html
│   └── contact.html
├── data/               # Static data (JSON)
│   ├── destinations.json
│   ├── tours.json
│   └── faqs.json
├── styles/             # CSS files
│   ├── tailwind.css
│   ├── components.css
│   └── responsive.css
├── scripts/            # JavaScript modules
│   ├── index.js
│   ├── modules/        # Feature modules
│   └── utils/          # Utility functions
└── images/             # Image assets
    └── [organized by type]

tests/
├── unit/               # Jest unit tests
├── integration/        # Integration tests
└── e2e/                # Playwright E2E tests

docs/
├── ARCHITECTURE.md     # Technical architecture
├── COMPONENTS.md       # Component documentation
├── API.md              # API endpoints
└── DEPLOYMENT.md       # Deployment guide
```

## 💻 Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Lint code (ESLint)
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code (Prettier)
npm run format

# Run all tests
npm run test

# Watch mode for tests
npm run test:watch

# Run E2E tests
npm run test:e2e

# Analyze bundle size
npm run analyze

# Type checking (TypeScript)
npm run type-check
```

### Code Style

This project uses **ESLint** and **Prettier** for consistent code formatting.

```bash
# Automatic format on commit
npm run pre-commit
```

### Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit with descriptive messages: `git commit -m "feat: add new feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## 🏗️ Building

### Development Build
```bash
npm run dev
```
- Source maps enabled
- No minification
- Faster builds

### Production Build
```bash
npm run build
```
- Minified output
- Tree-shaking enabled
- Asset optimization
- Code splitting

### Output
- **dist/index.html** - Main HTML file
- **dist/js/main.bundle.js** - Main JavaScript bundle
- **dist/css/main.css** - Main CSS bundle
- **dist/images/** - Optimized images

## 🧪 Testing

### Unit Tests (Jest)

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test -- --coverage
```

**Test Structure:**
```javascript
// src/scripts/utils/__tests__/validators.test.js
describe('Validators', () => {
  it('should validate email correctly', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid')).toBe(false);
  });
});
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Run with UI mode
npx playwright test --ui

# Run single test file
npx playwright test tests/e2e/home.spec.js
```

**Test Structure:**
```javascript
// tests/e2e/home.spec.js
test('should load homepage and display hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Explore Egypt');
});
```

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### GitHub Pages

```bash
# Build the site
npm run build

# Deploy
# Push dist/ to gh-pages branch
```

### Docker

```bash
# Build image
docker build -t kemetian-tours .

# Run container
docker run -p 80:8080 kemetian-tours
```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

## 📊 Performance

### Core Web Vitals Targets

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |

### Optimization Techniques

- ✅ Image lazy loading with native `loading="lazy"`
- ✅ Code splitting for faster initial load
- ✅ CSS minification and critical CSS inlining
- ✅ JavaScript tree-shaking and minification
- ✅ Asset compression (gzip/brotli)
- ✅ CDN delivery for static assets

Monitor performance at:
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)

## ♿ Accessibility

This project follows **WCAG 2.1 Level AA** standards:

- ✅ Semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`)
- ✅ ARIA labels for screen readers
- ✅ Keyboard navigation support
- ✅ Color contrast ratios >= 4.5:1
- ✅ Alt text for all images
- ✅ Focus indicators visible

Test accessibility with:
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

## 🌐 Browser Support

- Chrome/Edge >= 90
- Firefox >= 88
- Safari >= 14
- Mobile browsers (iOS Safari, Chrome Mobile)

See [browserslist](package.json) configuration.

## 🔒 Security

- ✅ HTTPS enforced
- ✅ Content Security Policy (CSP)
- ✅ Input validation & sanitization
- ✅ Environment variables for secrets
- ✅ Dependency vulnerability scanning

## 📝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Start for Contributors

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📚 Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Technical decisions and architecture
- [COMPONENTS.md](docs/COMPONENTS.md) - Component library documentation
- [API.md](docs/API.md) - API endpoints and integration guide
- [DEPLOYMENT.md](docs/DEPLOYMENT.md) - Deployment instructions

## 🐛 Bug Reports

Found a bug? Please create an issue with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/environment info

## 💡 Feature Requests

Have an idea? Open an issue with the `feature-request` label.

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

## 👥 Authors & Contributors

- **KemetianTours Team** - Initial work
- See [Contributors](https://github.com/kemetian-tours/website/contributors) for full list

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by best practices in web development
- Community feedback and contributions

## 📞 Contact

- **Website**: https://kemetiantours.com
- **Email**: bookings@kemetiantours.com
- **WhatsApp**: +20 12 04137431
- **Issues**: [GitHub Issues](https://github.com/kemetian-tours/website/issues)

---

**Happy coding! 🚀 Thank you for contributing to KemetianTours.**
