# Contributing to DeploriX Technologies

Thank you for your interest in contributing to the DeploriX Technologies web platform! We welcome contributions, bug fixes, feature enhancements, and documentation improvements.

To ensure a smooth collaboration, please read through these guidelines before submitting an issue or pull request.

---

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Branching & Commit Conventions](#branching--commit-conventions)
4. [Development Guidelines](#development-guidelines)
5. [Pre-Commit Quality Checks](#pre-commit-quality-checks)
6. [Submitting a Pull Request](#submitting-a-pull-request)
7. [Security & Secrets](#security--secrets)

---

## Code of Conduct

We are dedicated to providing a welcoming, inclusive, and respectful experience for all contributors. Please communicate courteously and constructively in all issues, pull requests, and discussions.

---

## Getting Started

### 1. Prerequisites
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Git**

### 2. Fork & Clone
1. Fork the repository to your GitHub account.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/deplorix-website.git
   cd deplorix-website
   ```
3. Set the upstream remote:
   ```bash
   git remote add upstream https://github.com/deplorix/deplorix-website.git
   ```

### 3. Installation
Install the project dependencies:
```bash
npm install
```

### 4. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in the necessary environment variables for MongoDB, Supabase, etc.
> **Note:** Never commit `.env` or any sensitive credentials to version control.

### 5. Running Locally
Start the development server:
```bash
npm run dev
```
The site runs locally at `http://localhost:8081/`. (Note: port 8081 is configured to avoid conflicts with background services on 8080).

---

## Branching & Commit Conventions

### Branch Naming
Create a feature branch from `main`:
- `feat/feature-name` (for new features)
- `fix/bug-description` (for bug fixes)
- `docs/update-readme` (for documentation)
- `refactor/component-cleanup` (for refactoring)
- `chore/update-dependencies` (for maintenance)

```bash
git checkout -b feat/your-feature-name
```

### Commit Messages
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat: add mobile navigation animation`
- `fix: resolve form validation for international phone numbers`
- `docs: update contributing guide`
- `refactor: simplify inquiry modal state`
- `test: add unit tests for inquiry preparation`

---

## Development Guidelines

### Tech Stack
- **Framework:** React 18 with TypeScript & Vite
- **Styling:** Tailwind CSS + Radix UI / shadcn/ui primitives
- **Animation:** Framer Motion
- **Database:** MongoDB Atlas (for customer service inquiries) & Supabase (for certificate verification)
- **Routing:** React Router v6

### Architectural Principles
1. **Mobile-First Responsiveness:**
   - All components, grids, buttons, and layouts must be tested on mobile (360px–420px), tablet, and desktop viewports.
   - Use responsive Tailwind utilities (`p-4 sm:p-7 md:p-10`, `w-full sm:w-auto`).
   - Touch targets for interactive elements must be at least 44x44px.

2. **TypeScript Strictness:**
   - Avoid using `any`. Write explicit TypeScript types and interfaces.
   - Run `npx tsc --noEmit` to ensure there are no compilation errors.

3. **Inquiry Form vs. Internship Application:**
   - **Service Inquiry ("Get in Touch")**: Connects directly to MongoDB (`inquiries` collection).
   - **Internship Application**: Exclusively routes via WhatsApp direct chat (`+91 99458 31090`). Do **not** store internship application details in MongoDB.

4. **Shared Server Validation:**
   - Any validation shared across Express, Vite middleware, and Vercel serverless routes lives in the `server/` directory.
   - Never rely solely on client-side validation for database submissions.

---

## Pre-Commit Quality Checks

Before pushing your changes and opening a pull request, run the quality checks locally:

```bash
# 1. Check for linting errors
npm run lint

# 2. Verify TypeScript types
npx tsc --noEmit

# 3. Run unit tests
npm test

# 4. Verify production build
npm run build
```

All 4 checks must pass cleanly with 0 errors.

---

## Submitting a Pull Request

1. **Keep PRs focused:** Submit small, focused pull requests addressing a single bug or feature.
2. **Update your branch:** Ensure your branch is rebased on the latest `main`:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
3. **Open the PR:**
   - Title: Follow the conventional commit format (e.g., `feat: improve mobile touch targets on FYP cards`).
   - Description: Provide a summary of the change, why it was made, and steps to test.
   - Include before/after screenshots or screen recordings for UI changes.
4. **Respond to Reviews:** Address feedback constructively and keep commits organized.

---

## Security & Secrets

- **Never commit secrets:** Never commit API keys, database credentials, or tokens.
- **Report Security Vulnerabilities:** If you discover a security issue or vulnerability, please do not open a public issue. Email us privately at `deplorixtechnologies@gmail.com`.

---

Thank you for helping make DeploriX Technologies better!
