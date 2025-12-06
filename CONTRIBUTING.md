# Contributing to Prompt Library

First off, thank you for considering contributing to Prompt Library! 🎉

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)

---

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, Node version)

### Suggesting Features 💡

Feature suggestions are welcome! Please:

- **Use a clear title**
- **Provide detailed description**
- **Explain why it would be useful**
- **Include mockups** (if applicable)

### Pull Requests 🔧

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/prompt-library.git
cd prompt-library

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Generate secure secret
openssl rand -base64 32
# Add to .env.local as NEXTAUTH_SECRET

# 5. Setup database
npx prisma db push
npx prisma generate

# 6. Create admin user
npm run create-admin

# 7. Start development server
npm run dev
```

### Project Structure

```
prompt-library/
├── app/              # Next.js App Router
├── components/       # React components
├── lib/              # Utilities and helpers
├── prisma/           # Database schema
├── public/           # Static assets
├── docs/             # Documentation
└── scripts/          # Utility scripts
```

---

## Pull Request Process

### Before Submitting

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Run linting**: `npm run lint`
4. **Build successfully**: `npm run build`
5. **Test locally**: `npm run dev`

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Dependent changes merged

### PR Title Format

```
type(scope): description

Examples:
feat(auth): add password reset flow
fix(ui): resolve dark mode toggle issue
docs(readme): update installation steps
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

---

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types/interfaces
- Avoid `any` type
- Use meaningful variable names

```typescript
// ✅ Good
interface UserProfile {
  id: string
  name: string
  email: string
}

// ❌ Bad
const data: any = {}
```

### React Components

- Use functional components
- Use hooks appropriately
- Keep components small and focused
- Extract reusable logic

```tsx
// ✅ Good
export default function UserCard({ user }: { user: User }) {
  const { t } = useLanguage()
  
  return (
    <div className="card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
}
```

### Styling

- Use Tailwind CSS classes
- Follow design system (design.json)
- Ensure responsive design
- Support dark mode

```tsx
// ✅ Good
<button className="px-4 py-2 bg-primary-base text-white rounded-lg hover:bg-primary-hover transition-colors">
  Click me
</button>
```

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Pages: `kebab-case/page.tsx`
- Constants: `UPPER_SNAKE_CASE.ts`

---

## Commit Messages

### Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Examples

```bash
feat(auth): implement password reset flow

- Add forgot password page
- Create reset password API endpoint
- Send reset email with token

Closes #123

fix(ui): resolve dark mode toggle issue

The theme toggle was not persisting user preference.
Fixed by updating localStorage handling.

Fixes #456
```

### Best Practices

- Use present tense ("add" not "added")
- Use imperative mood ("move" not "moves")
- Limit first line to 72 characters
- Reference issues and PRs

---

## Testing

### Running Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### Writing Tests

```typescript
// Example test
describe('UserCard', () => {
  it('renders user information', () => {
    const user = { id: '1', name: 'John', email: 'john@example.com' }
    render(<UserCard user={user} />)
    
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })
})
```

---

## Documentation

### Code Comments

```typescript
/**
 * Fetches user profile from the database
 * @param userId - The unique identifier of the user
 * @returns User profile object or null if not found
 */
async function getUserProfile(userId: string): Promise<User | null> {
  // Implementation
}
```

### README Updates

- Keep README.md up to date
- Update feature list
- Add new dependencies
- Update screenshots

---

## Getting Help

- 📖 Read the [documentation](docs/)
- 💬 Join our [Discord](https://discord.gg/prompt-library)
- 🐛 Check [existing issues](https://github.com/yourusername/prompt-library/issues)
- 📧 Email: support@promptlibrary.com

---

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🙏
