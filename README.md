# 8P3P Learning Management System (LMS)

A minimal, production-ready LMS scaffold built with Next.js 15, TypeScript, and shadcn/ui. This application provides a foundation for building a full-featured learning management system for EMDR therapist training.

## Features

- **Authentication**: Login and signup pages with form validation, Google Sign-In integration
- **App Shell**: Responsive layout with sidebar navigation and top navbar
- **Course Viewing**: Video player with content tabs and resource listings
- **Progress Tracking**: Client-side progress tracking for course completion
- **Profile Management**: User profile editing functionality
- **Dashboard Widgets**: Interactive dashboard with quiz results and progress tracking
- **Community Feed**: Social interaction features with form validation using React Hook Form and Zod

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React useState/useContext
- **Data Tables**: Planned integration with TanStack Table for advanced data display

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
/src
  /app                    # App Router structure
    /(auth)               # Authentication routes (login, signup)
    /dashboard            # Dashboard with widgets and activity tracking
    /courses              # Course viewing pages
    /profile              # User profile page
  /components             # Reusable components
    /course               # Course-specific components
    /ui                   # shadcn/ui components
      /button.tsx         # Button component
      /card.tsx           # Card component
      /form.tsx           # Form components with React Hook Form integration
      /quiz-results-table.tsx # Quiz results display component
      /widget-card.tsx    # Dashboard widget container
      /navbar.tsx         # Navigation component
  /data                   # Mock data
  /hooks                  # Custom React hooks
    /use-mobile.ts        # Mobile detection hook
  /lib                    # Utility functions
  /types                  # TypeScript type definitions
```

## Authentication

The authentication system is built with AWS Amplify Gen 2 and includes:

- Email-based authentication with secure password policies
- Google Sign-In integration for streamlined user authentication
- Multi-factor authentication (SMS) as an optional security feature
- Custom user attributes for storing user profile information
- Email-based account recovery

Key authentication features:

- **User Attributes**: Required attributes include email and given name, with optional attributes for family name and profile picture
- **Custom Attributes**: Support for organization and role custom attributes
- **MFA**: Optional multi-factor authentication with SMS support
- **Account Recovery**: Email-based account recovery flow
- **External Providers**: Google authentication integration with proper callback and logout URL configuration

## Data Model

The application uses a typed data model for courses, modules, and chapters:

- **Course**: Contains multiple modules and metadata
- **Module**: Contains multiple chapters and belongs to a course
- **Chapter**: Contains content, video, and resources

## Future Enhancements

- Backend integration with a database
- Server-side authentication
- Progress persistence
- Admin dashboard for course management
- Payment integration
- Analytics and reporting
- TanStack Table integration for quiz results
- Enhanced form validation across all user inputs
- Expanded dashboard widgets and visualizations
- Edge case handling for unregistered users attempting to sign in (redirect to sign-up flow)
- Additional social login providers

## License

MIT
