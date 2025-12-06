# Testing Guide - Prompt Library

## Overview

This guide covers testing strategies and best practices for the Prompt Library application.

---

## 🧪 Testing Stack

### Recommended Tools

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom
```

### Configuration

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

module.exports = createJestConfig(customJestConfig)
```

Create `jest.setup.js`:

```javascript
import '@testing-library/jest-dom'
```

---

## 📝 Unit Tests

### Component Testing

#### Example: ThemeToggle Component

```typescript
// __tests__/components/ThemeToggle.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import ThemeToggle from '@/components/ThemeToggle'

describe('ThemeToggle', () => {
  it('renders theme toggle button', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )
    
    const button = screen.getByRole('button', { name: /toggle theme/i })
    expect(button).toBeInTheDocument()
  })

  it('toggles theme on click', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Theme should change
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
```

#### Example: SearchBar Component

```typescript
// __tests__/components/SearchBar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from '@/components/SearchBar'

describe('SearchBar', () => {
  it('calls onSearch when form is submitted', () => {
    const mockOnSearch = jest.fn()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByPlaceholderText(/search/i)
    const form = input.closest('form')
    
    fireEvent.change(input, { target: { value: 'test query' } })
    fireEvent.submit(form!)
    
    expect(mockOnSearch).toHaveBeenCalledWith('test query')
  })

  it('clears search on clear button click', () => {
    const mockOnSearch = jest.fn()
    render(<SearchBar onSearch={mockOnSearch} defaultValue="test" />)
    
    const clearButton = screen.getByRole('button', { name: /clear/i })
    fireEvent.click(clearButton)
    
    expect(mockOnSearch).toHaveBeenCalledWith('')
  })
})
```

### Utility Testing

#### Example: Analytics

```typescript
// __tests__/lib/analytics.test.ts
import { trackEvent } from '@/lib/analytics'

describe('Analytics', () => {
  beforeEach(() => {
    window.gtag = jest.fn()
  })

  it('tracks events correctly', () => {
    trackEvent({
      action: 'test_action',
      category: 'test_category',
      label: 'test_label',
    })

    expect(window.gtag).toHaveBeenCalledWith('event', 'test_action', {
      event_category: 'test_category',
      event_label: 'test_label',
      value: undefined,
    })
  })
})
```

---

## 🔗 Integration Tests

### API Route Testing

```typescript
// __tests__/api/prompts/search.test.ts
import { GET } from '@/app/api/prompts/search/route'
import { NextRequest } from 'next/server'

describe('Search API', () => {
  it('returns prompts for valid query', async () => {
    const request = new NextRequest('http://localhost:3000/api/prompts/search?q=test')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('prompts')
    expect(data).toHaveProperty('pagination')
  })

  it('handles pagination correctly', async () => {
    const request = new NextRequest('http://localhost:3000/api/prompts/search?page=2&limit=10')
    const response = await GET(request)
    const data = await response.json()

    expect(data.pagination.page).toBe(2)
    expect(data.pagination.limit).toBe(10)
  })
})
```

---

## 🌐 E2E Tests (Playwright)

### Setup

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Configuration

Create `playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3001',
  },
  webServer: {
    command: 'npm run dev',
    port: 3001,
    reuseExistingServer: !process.env.CI,
  },
})
```

### Example Tests

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('user can sign in', async ({ page }) => {
    await page.goto('/auth/signin')
    
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/')
  })

  test('password reset flow works', async ({ page }) => {
    await page.goto('/auth/signin')
    await page.click('text=Forgot password?')
    
    await expect(page).toHaveURL('/auth/forgot-password')
    
    await page.fill('input[type="email"]', 'test@example.com')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Check your email')).toBeVisible()
  })
})
```

```typescript
// e2e/dark-mode.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Dark Mode', () => {
  test('theme toggle works', async ({ page }) => {
    await page.goto('/')
    
    // Click theme toggle
    await page.click('button[aria-label="Toggle theme"]')
    
    // Check if dark class is added
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
    
    // Click again to toggle back
    await page.click('button[aria-label="Toggle theme"]')
    await expect(html).not.toHaveClass(/dark/)
  })
})
```

---

## 📊 Test Coverage

### Run Tests with Coverage

```bash
# Unit tests
npm test -- --coverage

# E2E tests
npx playwright test

# Specific test
npm test SearchBar.test.tsx
```

### Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths
- **E2E Tests**: User flows

---

## 🎯 Testing Checklist

### Before Each Release

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Lighthouse score > 90
- [ ] Accessibility audit passes
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] Dark mode works

### Critical Flows to Test

1. **Authentication**
   - Sign up
   - Sign in
   - Sign out
   - Password reset

2. **Prompts**
   - Create prompt
   - View prompt
   - Edit prompt
   - Delete prompt
   - Copy prompt

3. **Search & Filter**
   - Search prompts
   - Filter by category
   - Sort results
   - Pagination

4. **Collections**
   - Create collection
   - Add to collection
   - Remove from collection

5. **Favorites**
   - Add to favorites
   - Remove from favorites

6. **Ratings**
   - Rate prompt
   - Update rating
   - Delete rating

---

## 🔍 Manual Testing

### Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Device Testing

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### Accessibility Testing

```bash
# Install axe-core
npm install --save-dev @axe-core/playwright

# Run accessibility tests
npx playwright test --grep @a11y
```

---

## 🐛 Debugging Tests

### Jest Debug

```bash
# Debug specific test
node --inspect-brk node_modules/.bin/jest --runInBand SearchBar.test.tsx
```

### Playwright Debug

```bash
# Debug mode
npx playwright test --debug

# UI mode
npx playwright test --ui
```

---

## 📈 Performance Testing

### Lighthouse CI

```bash
# Install
npm install --save-dev @lhci/cli

# Run
lhci autorun
```

### Load Testing

```bash
# Install k6
brew install k6

# Run load test
k6 run load-test.js
```

---

## 🎓 Best Practices

1. **Write tests first** (TDD)
2. **Test user behavior**, not implementation
3. **Use meaningful test names**
4. **Keep tests isolated**
5. **Mock external dependencies**
6. **Test edge cases**
7. **Maintain test coverage**
8. **Run tests in CI/CD**

---

## 📚 Resources

- [Testing Library](https://testing-library.com)
- [Jest](https://jestjs.io)
- [Playwright](https://playwright.dev)
- [Next.js Testing](https://nextjs.org/docs/testing)

---

**Last Updated:** December 6, 2025
