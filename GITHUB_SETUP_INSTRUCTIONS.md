# GitHub Setup Instructions

## Overview

This document provides manual steps for setting up the GitHub repository and Actions for CI/CD in the Pixel Perfect Clone platform.

## Repository Setup

### Initial Repository Configuration

1. **Create or Configure Repository**

   If creating a new repository:
   ```bash
   # Create repository on GitHub first, then:
   git clone https://github.com/[username]/pixel-perfect-clone-8825.git
   cd pixel-perfect-clone-8825
   ```

   If configuring an existing repository:
   ```bash
   cd pixel-perfect-clone-8825
   git remote -v  # Verify remote is set correctly
   ```

2. **Branch Protection Rules**

   Navigate to: `Settings > Branches > Branch protection rules`

   Add rules for `main` branch:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Require linear history (optional)
   - ✅ Include administrators (optional)

3. **Repository Settings**

   **General Settings:**
   - Enable: Issues
   - Enable: Projects (optional)
   - Enable: Wiki (optional)
   - Disable: Allow merge commits (use squash or rebase)

   **Security:**
   - Enable Dependabot alerts
   - Enable Dependabot security updates
   - Enable Dependabot version updates

## Secrets Configuration

### Required Secrets

Navigate to: `Settings > Secrets and variables > Actions`

Add the following repository secrets:

1. **SUPABASE_URL**
   - Description: Supabase project URL
   - Value: `https://[project-id].supabase.co`
   - Usage: Used in build process for API endpoint

2. **SUPABASE_ANON_KEY**
   - Description: Supabase anonymous/public key
   - Value: Your Supabase anon key (safe to use in client)
   - Usage: Used for Supabase client initialization

3. **SUPABASE_SERVICE_ROLE_KEY** (if needed for backend operations)
   - Description: Supabase service role key
   - Value: Your Supabase service role key (keep secure!)
   - Usage: Server-side operations, migrations

### Optional Secrets

4. **LOVABLE_API_KEY** (if using Lovable platform)
   - Description: API key for Lovable platform
   - Value: Your Lovable API key

5. **DEPLOY_TOKEN** (if using custom deployment)
   - Description: Deployment authentication token
   - Value: Token for deployment service

## GitHub Actions Workflows

### 1. CI Workflow (Continuous Integration)

Create file: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Build application
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7
```

### 2. Deploy Workflow (Continuous Deployment)

Create file: `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Deploy to production
        run: |
          echo "Add deployment commands here"
          # Example: Deploy to Netlify, Vercel, or custom server
```

### 3. Dependency Update Workflow

Create file: `.github/workflows/dependency-update.yml`

```yaml
name: Dependency Update Check

on:
  schedule:
    - cron: '0 0 * * 1'  # Weekly on Monday
  workflow_dispatch:

jobs:
  check-dependencies:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Check for outdated packages
        run: npm outdated || true

      - name: Create issue for outdated packages
        if: success()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: 'Weekly Dependency Update Check',
              body: 'Automated dependency check completed. Review npm outdated output in Actions logs.',
              labels: ['dependencies']
            })
```

## Dependabot Configuration

### Setup Dependabot

Create file: `.github/dependabot.yml`

```yaml
version: 2
updates:
  # Enable version updates for npm
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 10
    reviewers:
      - "your-username"
    assignees:
      - "your-username"
    labels:
      - "dependencies"
    commit-message:
      prefix: "chore"
      include: "scope"

  # Enable version updates for GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
    labels:
      - "dependencies"
      - "github-actions"
```

## Issue and PR Templates

### Issue Template

Create file: `.github/ISSUE_TEMPLATE/bug_report.md`

```markdown
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: 'bug'
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

### Pull Request Template

Create file: `.github/PULL_REQUEST_TEMPLATE.md`

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] I have tested these changes locally
- [ ] I have added tests that prove my fix/feature works
- [ ] All new and existing tests pass

## Checklist
- [ ] Code follows project style guidelines
- [ ] I have commented my code where necessary
- [ ] I have updated documentation accordingly
- [ ] My changes generate no new warnings
- [ ] I have checked my code for security vulnerabilities

## Related Issues
Closes #(issue number)

## Screenshots (if applicable)
Add screenshots here
```

## Local Development Setup

### Prerequisites

Ensure developers have:
- Node.js 18+ installed
- npm or yarn
- Git configured
- Supabase account

### Developer Onboarding Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/[username]/pixel-perfect-clone-8825.git
   cd pixel-perfect-clone-8825
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   
   Create `.env` file:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your values:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Git Workflow

### Branch Naming Conventions

- `feature/` - New features (e.g., `feature/user-authentication`)
- `bugfix/` - Bug fixes (e.g., `bugfix/login-error`)
- `hotfix/` - Urgent production fixes (e.g., `hotfix/security-patch`)
- `docs/` - Documentation updates (e.g., `docs/api-reference`)
- `refactor/` - Code refactoring (e.g., `refactor/component-structure`)

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Example:**
```
feat(auth): add password reset functionality

Implement password reset flow with email verification.
Users can now request password reset link via email.

Closes #123
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes and Commit**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push to GitHub**
   ```bash
   git push origin feature/new-feature
   ```

4. **Create Pull Request**
   - Go to GitHub repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in PR template
   - Request reviewers

5. **Address Review Comments**
   ```bash
   # Make changes
   git add .
   git commit -m "fix: address review comments"
   git push
   ```

6. **Merge After Approval**
   - Ensure all checks pass
   - Get required approvals
   - Merge using squash or rebase

## Troubleshooting

### Common Issues

**1. Build Fails in CI**
- Check environment variables are set correctly
- Verify Node version matches local development
- Review build logs for specific errors

**2. Secrets Not Working**
- Verify secret names match exactly (case-sensitive)
- Ensure secrets are set at repository level
- Check workflow has permission to access secrets

**3. Dependabot PRs Failing**
- Review breaking changes in dependencies
- Update code to match new API
- May need to pin versions temporarily

**4. Deployment Fails**
- Verify deployment tokens/credentials
- Check deployment service status
- Review deployment logs

### Getting Help

- Check GitHub Actions logs for detailed error messages
- Review repository documentation
- Create an issue using the bug report template
- Contact repository maintainers

## Monitoring and Maintenance

### Regular Tasks

**Weekly:**
- Review open pull requests
- Check Dependabot updates
- Monitor CI/CD success rates

**Monthly:**
- Review and update dependencies
- Check for security vulnerabilities
- Update documentation as needed

**Quarterly:**
- Review and update CI/CD workflows
- Audit repository access and permissions
- Update branch protection rules

## Related Documentation

- [CHANGELOG_SEMANTIC.md](./CHANGELOG_SEMANTIC.md): Versioning and changelog guidelines
- [DOC_POLICY.md](./DOC_POLICY.md): Documentation governance
- [FRAMEWORK.md](./FRAMEWORK.md): Technology stack details
- [ARCHITECTURE.md](./ARCHITECTURE.md): System architecture
