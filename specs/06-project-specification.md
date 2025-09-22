# 8P3P LMS Project Specification

## Executive Summary

The 8P3P Learning Management System is a production-ready platform for EMDR therapist training, built with Next.js 15, AWS Amplify Gen2, and modern web technologies. The system provides structured learning paths with video content, interactive assessments, and AI-powered learning assistance.

## Project Requirements

### Functional Requirements

#### Must Have (MVP)
- ✅ **User Authentication**: Multi-layer security with Google OAuth
- ✅ **Course Management**: Hierarchical content structure (Course → Chapters → Sections)
- ✅ **Video Learning**: Video content with progress tracking
- ✅ **Assessment System**: Quizzes with retry logic and randomization
- 🔄 **AI Learning Assistance**: Tavus AI integration for questions and learning checks
- 🔄 **Progress Tracking**: Individual, chapter, and course-level progress
- 🔄 **Time Estimation**: Accurate completion time calculations
- 🔄 **Timer Components**: Reusable timing functionality

#### Should Have
- **Advanced Analytics**: Learning progress and performance insights
- **Mobile Optimization**: Enhanced mobile learning experience
- **Offline Support**: Content caching for offline access
- **Social Learning**: Discussion forums and peer interaction

#### Could Have
- **Gamification**: Badges, achievements, and leaderboards
- **Advanced AI**: Personalized learning recommendations
- **Multi-language**: Internationalization support
- **Advanced Video**: Interactive video features and annotations

#### Won't Have (Current Iteration)
- **Live Streaming**: Real-time video sessions
- **Payment Processing**: Subscription and payment management
- **Advanced Reporting**: Complex analytics dashboards
- **Third-party Integrations**: LTI or SCORM compliance

### Non-Functional Requirements

#### Performance
- **Page Load**: < 3 seconds initial load
- **Video Streaming**: < 2 seconds start time
- **API Response**: < 500ms average response time
- **Mobile Performance**: 90+ Lighthouse score

#### Scalability
- **Concurrent Users**: Support 1000+ simultaneous users
- **Content Volume**: Handle 100+ courses with 1000+ sections
- **Storage**: Scalable video and content storage
- **Database**: Efficient query performance at scale

#### Security
- **Authentication**: Multi-factor authentication support
- **Data Protection**: GDPR and HIPAA compliance considerations
- **API Security**: Rate limiting and input validation
- **Content Security**: Secure video streaming and content protection

#### Accessibility
- **WCAG Compliance**: AA level accessibility standards
- **Screen Reader**: Full screen reader support
- **Keyboard Navigation**: Complete keyboard accessibility
- **Color Contrast**: High contrast mode support

## System Architecture

### Technology Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript 5.9
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Authentication**: AWS Amplify Gen2 with Cognito
- **Backend**: AWS Amplify Gen2 with GraphQL API
- **Database**: DynamoDB (via Amplify) with hot-swappable DAL
- **AI Integration**: Tavus AI for conversational features
- **Deployment**: AWS Amplify Hosting with CI/CD

### Data Architecture
```
Course
├── id: string
├── title: string
├── description: string
├── estimatedDuration: number (minutes)
├── chapters: Chapter[]
└── progress: CourseProgress

Chapter
├── id: string
├── title: string
├── description: string
├── estimatedDuration: number (minutes)
├── videoUrl?: string (optional)
├── sections: Section[]
├── quiz: Quiz
├── learningCheck: LearningCheck
└── progress: ChapterProgress

Section
├── id: string
├── title: string
├── content: string
├── videoUrl: string (required)
├── estimatedDuration: number (minutes)
└── progress: SectionProgress
```

### Component Architecture
```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── course/            # Course-specific components
│   ├── common/            # Reusable components (Timer, etc.)
│   └── ai/                # AI integration components
├── lib/
│   ├── data/              # Hot-swappable data layer
│   ├── ai/                # AI service integrations
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript definitions
└── hooks/                 # Custom React hooks
```

## Development Milestones

### Phase 1: Content Hierarchy Update (Current)
**Timeline**: 1-2 weeks
**Deliverables**:
- ✅ Updated content structure (Chapters ↔ Sections naming flip)
- 🔄 Enhanced progress tracking system
- 🔄 Estimated time calculation components
- 🔄 Updated mock data and TypeScript interfaces

### Phase 2: AI Integration
**Timeline**: 2-3 weeks
**Deliverables**:
- Tavus AI integration for "Ask Question" feature
- AI-powered Learning Check system
- Timer components for all timed interactions
- Conversation logging and analysis

### Phase 3: Enhanced Assessment System
**Timeline**: 2-3 weeks
**Deliverables**:
- Quiz retry logic with attempt limits
- Question randomization system
- Advanced progress analytics
- Completion requirement enforcement

### Phase 4: Performance & Polish
**Timeline**: 1-2 weeks
**Deliverables**:
- Performance optimization
- Mobile experience enhancements
- Accessibility improvements
- Production deployment optimization

## Technical Constraints

### Development Standards
- **Next.js 15+ Compliance**: Server Components first approach
- **TypeScript Strict Mode**: Full type safety enforcement
- **ESLint v9**: Strict code quality standards
- **Tailwind CSS v4**: CSS-first configuration approach
- **AWS Amplify Gen2**: Modern backend architecture

### Integration Constraints
- **Tavus AI**: API rate limits and response time considerations
- **Video Streaming**: Bandwidth and storage optimization
- **Mobile Performance**: Limited processing power and network
- **Accessibility**: Screen reader and keyboard navigation support

### Business Constraints
- **EMDR Training Focus**: Specialized content and requirements
- **Professional Audience**: High-quality, reliable experience expected
- **Compliance**: Healthcare industry standards and regulations
- **Scalability**: Growth from pilot to full deployment

## Risk Assessment

### Technical Risks
- **AI Integration Complexity**: Tavus API integration challenges
- **Video Performance**: Large video file streaming optimization
- **Mobile Compatibility**: Cross-device experience consistency
- **Data Migration**: Hot-swappable DAL implementation complexity

### Mitigation Strategies
- **Incremental Integration**: Phase AI features gradually
- **Performance Testing**: Regular performance monitoring and optimization
- **Cross-device Testing**: Comprehensive device and browser testing
- **Abstraction Layers**: Clean interfaces for data layer swapping

## Success Criteria

### User Experience
- **Completion Rates**: 80%+ course completion rate
- **User Satisfaction**: 4.5+ star rating
- **Performance**: < 3 second page load times
- **Accessibility**: 100% keyboard navigation support

### Technical Performance
- **Uptime**: 99.9% availability
- **Response Time**: < 500ms API responses
- **Error Rate**: < 0.1% error rate
- **Security**: Zero security incidents

### Business Impact
- **User Engagement**: 70%+ weekly active users
- **Content Consumption**: 90%+ video completion rates
- **Assessment Performance**: 85%+ quiz pass rates
- **Support Efficiency**: < 2% support ticket rate

---

**Next Steps**: Create detailed Feature Specification documents for each major feature area.
