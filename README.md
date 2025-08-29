# 8P3P Learning Management System (LMS)

A minimal, production-ready LMS scaffold built with Next.js 15, TypeScript, and shadcn/ui. This application provides a foundation for building a full-featured learning management system for EMDR therapist training.

## Features

- **Authentication**: Login and signup pages with form validation
- **App Shell**: Responsive layout with sidebar navigation and top navbar
- **Course Viewing**: Video player with content tabs and resource listings
- **Progress Tracking**: Client-side progress tracking for course completion
- **Profile Management**: User profile editing functionality

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React useState/useContext

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
    /(dashboard)          # Main application routes
      /courses            # Course viewing pages
      /profile            # User profile page
  /components             # Reusable components
    /course               # Course-specific components
    /navbar               # Navigation components
    /sidebar              # Sidebar components
    /ui                   # shadcn/ui components
  /data                   # Mock data
  /lib                    # Utility functions
  /types                  # TypeScript type definitions
```

## Authentication

The authentication system is currently client-side only. In a production environment, you would integrate with:

- NextAuth.js for authentication
- A database for user storage
- API routes for secure data handling

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

## License

MIT
