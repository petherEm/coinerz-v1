# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Turbopack)
- **Build**: `npm run build` (uses Turbopack)
- **Production server**: `npm start`
- **Linting**: `npm run lint`

## Architecture Overview

This is a Next.js 15 application built with React 19, TypeScript, and TailwindCSS v4. The project uses the App Router pattern with the following structure:

- **Framework**: Next.js 15 with Turbopack for fast development and builds
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: TailwindCSS v4 with CSS variables and New York style preset
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **TypeScript**: Configured with strict mode and path aliases (`@/*` maps to `src/*`)

### Project Structure

- `src/app/` - Next.js App Router pages and layout
- `src/components/` - Reusable React components
- `src/components/ui/` - shadcn/ui component library
- `src/lib/` - Utility functions and shared logic
- `components.json` - shadcn/ui configuration

### Key Components

The application appears to be a cryptocurrency-related landing page with:
- `Hero` - Main hero section
- `IntroSection` - Introduction content
- `Navbar` - Navigation component
- `Footer` - Footer component

### Configuration Files

- `eslint.config.mjs` - ESLint configuration using Next.js recommended rules
- `tsconfig.json` - TypeScript configuration with path aliases
- `components.json` - shadcn/ui configuration for component generation
- `next.config.ts` - Next.js configuration (minimal setup)