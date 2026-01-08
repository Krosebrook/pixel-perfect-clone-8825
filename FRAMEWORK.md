# Framework and Technology Stack

## Overview

This document describes the core technologies, libraries, and architectural patterns used in the Pixel Perfect Clone platform, a modern web application built with React, TypeScript, and Supabase.

## Core Technologies

### Frontend Framework

**React 18.3.1**

- Modern React with Hooks and Concurrent Mode
- Component-based architecture
- Virtual DOM for efficient rendering
- Rich ecosystem of libraries and tools

**TypeScript 5.8.3**

- Static type checking for improved code quality
- Enhanced IDE support and developer experience
- Better refactoring capabilities
- Compile-time error detection

### Build Tools

**Vite 5.4.19**

- Lightning-fast development server with Hot Module Replacement (HMR)
- Optimized production builds
- Native ES modules support
- Plugin-based architecture

### UI Framework

**Tailwind CSS 3.4.17**

- Utility-first CSS framework
- Responsive design utilities
- Customizable design system
- Minimal CSS bundle size through purging

**shadcn-ui**

- High-quality, accessible UI components
- Built on Radix UI primitives
- Customizable with Tailwind CSS
- Copy-paste component architecture

## Key Libraries

### UI Components

**Radix UI**

Comprehensive component library for building accessible interfaces:

- `@radix-ui/react-dialog`: Modal dialogs
- `@radix-ui/react-dropdown-menu`: Dropdown menus
- `@radix-ui/react-tabs`: Tab navigation
- `@radix-ui/react-toast`: Toast notifications
- `@radix-ui/react-select`: Select dropdowns
- And many more accessible primitives

**Lucide React**

- Modern icon library with 1000+ icons
- Tree-shakeable for minimal bundle size
- Consistent design language

### Forms and Validation

**React Hook Form 7.61.1**

- Performant form management
- Minimal re-renders
- Easy integration with validation libraries

**Zod 3.25.76**

- TypeScript-first schema validation
- Type inference for validated data
- Composable schemas

**@hookform/resolvers**

- Integration between React Hook Form and validation libraries

### Routing

**React Router DOM 6.30.1**

- Declarative routing for React applications
- Nested routes support
- Code splitting with lazy loading
- Navigation guards and redirects

### State Management

**React Query (@tanstack/react-query) 5.83.0**

- Server state management
- Automatic caching and background refetching
- Optimistic updates
- Pagination and infinite scroll support

**React Context API**

- Built-in React state management for global state
- Theme management
- Authentication state

### Backend Services

**Supabase (@supabase/supabase-js) 2.89.0**

- PostgreSQL database with real-time capabilities
- Built-in authentication and authorization
- Row Level Security (RLS)
- Storage for file uploads
- Edge Functions for serverless compute
- Real-time subscriptions

## Architectural Patterns

### Component Architecture

**Atomic Design Principles**

Components are organized hierarchically:

1. **Atoms**: Basic UI elements (buttons, inputs, icons)
2. **Molecules**: Simple component groups (form fields, search bars)
3. **Organisms**: Complex components (forms, navigation bars)
4. **Templates**: Page layouts
5. **Pages**: Specific page instances

### Code Organization

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configurations
├── contexts/         # React Context providers
├── integrations/     # Third-party integrations (Supabase)
├── assets/           # Static assets
└── App.tsx           # Root component
```

### Data Flow

**Unidirectional Data Flow**

- Props flow down from parent to child components
- Events bubble up through callbacks
- Centralized state management where appropriate
- Server state managed by React Query

### Authentication Flow

1. User submits credentials
2. Supabase Auth validates and returns JWT
3. JWT stored in secure session
4. Authenticated requests include JWT in Authorization header
5. Supabase verifies JWT and enforces RLS policies

### Real-time Updates

**Supabase Real-time**

- WebSocket connections for live data
- Automatic re-rendering on data changes
- Optimistic UI updates for better UX
- Efficient change detection

## Styling Architecture

### Tailwind CSS Configuration

**Design System**

Custom configuration in `tailwind.config.ts`:

- Color palette
- Typography scale
- Spacing system
- Breakpoints
- Custom utilities

**Component Styling**

- Utility classes for rapid development
- Component variants using `class-variance-authority`
- Conditional styling with `clsx` and `tailwind-merge`

### Theme Support

**next-themes**

- Dark/light mode support
- System preference detection
- Persistent theme selection
- Smooth theme transitions

## Development Practices

### Code Quality

**ESLint 9.32.0**

- Code linting and style enforcement
- React-specific rules
- TypeScript integration
- Custom rule configuration

**TypeScript Configuration**

- Strict type checking enabled
- Path aliases for cleaner imports
- Separate configs for app and build tools

### Development Workflow

1. **Local Development**: `npm run dev` - Vite dev server with HMR
2. **Production Build**: `npm run build` - Optimized production bundle
3. **Preview**: `npm run preview` - Preview production build locally
4. **Linting**: `npm run lint` - Run ESLint checks

### Performance Optimization

- Code splitting with React.lazy()
- Route-based code splitting
- Image optimization
- Bundle size monitoring
- Tree-shaking unused code
- Lazy loading of heavy components

## Backend Architecture (Base44/Supabase)

### Database

**PostgreSQL**

- Relational database with ACID guarantees
- JSON/JSONB support for flexible schemas
- Full-text search capabilities
- Geospatial data support

**Schema Design**

- Normalized data structure
- Foreign key constraints
- Indexed columns for query performance
- Row Level Security policies

### API Layer

**Supabase REST API**

- Auto-generated REST API from database schema
- Query building with JavaScript client
- Real-time subscriptions via WebSocket
- File upload/download via Storage API

**Edge Functions**

- Serverless functions for custom backend logic
- TypeScript/Deno runtime
- Secure execution environment
- Low-latency edge deployment

### Authentication

**Supabase Auth**

- Email/password authentication
- OAuth provider integration
- Magic link authentication
- JWT-based session management
- Role-based access control

## Testing Strategy

### Testing Tools (Recommended)

- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing
- **Playwright/Cypress**: End-to-end testing
- **MSW**: API mocking for tests

### Testing Patterns

- Unit tests for utility functions
- Component tests for UI logic
- Integration tests for feature workflows
- E2E tests for critical user journeys

## Deployment

### Build Process

1. TypeScript compilation
2. Asset optimization
3. CSS purging
4. Bundle generation
5. Source map creation

### Hosting

- **Lovable Platform**: Primary deployment target
- **Static Hosting**: Compatible with Netlify, Vercel, AWS S3
- **Custom Domain**: Support for custom domain configuration

### CI/CD

- Automated builds on commit
- Deployment on merge to main
- Preview deployments for pull requests
- Environment-specific configurations

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md): System architecture overview
- [API_REFERENCE.md](./API_REFERENCE.md): API documentation
- [GITHUB_SETUP_INSTRUCTIONS.md](./GITHUB_SETUP_INSTRUCTIONS.md): CI/CD setup
