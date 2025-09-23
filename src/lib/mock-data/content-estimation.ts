/**
 * Mock data for content estimation system testing
 * 
 * Provides realistic sample data for testing content analysis,
 * time estimation, and UI components during development.
 * 
 * Organized by content type and complexity for comprehensive testing.
 */

import type { MixedContent, UserProfile } from "@/lib/content-analysis";

/**
 * Sample text content for different complexity levels
 */
export const mockTextContent = {
  simple: `
    Welcome to EMDR therapy basics. This introduction covers the fundamental concepts 
    you need to understand before beginning your therapeutic journey. EMDR stands for 
    Eye Movement Desensitization and Reprocessing, a powerful therapeutic approach 
    developed by Dr. Francine Shapiro in the late 1980s.
    
    The therapy helps people heal from trauma and other distressing life experiences. 
    It's been extensively researched and proven effective for PTSD and many other 
    mental health conditions.
  `,
  
  moderate: `
    Eye Movement Desensitization and Reprocessing (EMDR) is an integrative psychotherapy 
    approach that has been extensively researched and proven effective for the treatment 
    of trauma. EMDR is a set of standardized protocols that incorporates elements from 
    different treatment approaches.
    
    The EMDR therapeutic process involves eight distinct phases of treatment which 
    comprehensively address the clinical needs of the client. These phases include: 
    client history and treatment planning, preparation, assessment, desensitization, 
    installation, body scan, closure, and reevaluation.
    
    During the desensitization phase, the client focuses on the traumatic memory while 
    simultaneously engaging in bilateral stimulation, typically in the form of guided 
    eye movements. This dual attention process appears to facilitate the integration 
    of traumatic memories with adaptive information, leading to symptom reduction and 
    improved psychological functioning.
    
    Research has demonstrated EMDR's efficacy in treating various conditions including 
    PTSD, anxiety disorders, depression, and complex trauma. The therapy's effectiveness 
    is supported by numerous randomized controlled trials and meta-analyses, making it 
    a recommended treatment by major health organizations worldwide.
  `,
  
  complex: `
    The neurobiological mechanisms underlying Eye Movement Desensitization and Reprocessing 
    (EMDR) therapy involve complex interactions between multiple brain systems, including 
    the limbic system, prefrontal cortex, and hippocampus. Current neuroimaging research 
    suggests that bilateral stimulation during EMDR may facilitate interhemispheric 
    communication and promote the integration of traumatic memories within existing 
    cognitive schemas.
    
    The Adaptive Information Processing (AIP) model, which serves as the theoretical 
    foundation for EMDR, posits that psychological health is contingent upon the 
    adaptive processing and integration of life experiences. When traumatic events 
    occur, they may become "stuck" in memory networks in their original disturbing 
    form, complete with the emotions, physical sensations, and beliefs present at 
    the time of the event.
    
    The eight-phase protocol of EMDR systematically addresses these maladaptively 
    stored memories through a comprehensive treatment approach. Phase 1 involves 
    detailed client history taking and treatment planning, including the identification 
    of target memories and the development of a comprehensive treatment plan. Phase 2 
    focuses on client preparation and stabilization, ensuring the client has adequate 
    coping resources and emotional regulation skills.
    
    Phases 3-6 constitute the core reprocessing components: assessment (identifying 
    target memory components), desensitization (bilateral stimulation while focusing 
    on disturbing aspects), installation (strengthening positive cognitions), and 
    body scan (identifying residual somatic activation). Phases 7-8 involve closure 
    and reevaluation procedures to ensure treatment stability and continued progress.
    
    Contemporary research in neuroscience has provided increasing support for EMDR's 
    mechanisms of action, with studies utilizing fMRI, EEG, and other neuroimaging 
    techniques demonstrating measurable changes in brain activation patterns following 
    successful EMDR treatment. These findings contribute to our understanding of how 
    psychotherapeutic interventions can produce lasting neurobiological changes.
  `
};

/**
 * Sample video content metadata
 */
export const mockVideoContent = [
  {
    url: "https://example.com/emdr-intro.mp4",
    duration: 480, // 8 minutes
    title: "Introduction to EMDR Therapy",
    type: "lecture" as const,
    format: "mp4" as const
  },
  {
    url: "https://example.com/bilateral-stimulation-demo.mp4",
    duration: 720, // 12 minutes
    title: "Bilateral Stimulation Demonstration",
    type: "demo" as const,
    format: "mp4" as const
  },
  {
    url: "https://youtube.com/watch?v=example",
    duration: 900, // 15 minutes
    title: "Interactive EMDR Session Practice",
    type: "interactive" as const,
    format: "youtube" as const
  }
];

/**
 * Sample mixed content for different lesson types
 */
export const mockLessons: Record<string, MixedContent> = {
  introductionLesson: {
    text: mockTextContent.simple,
    videos: [mockVideoContent[0]],
    title: "EMDR Therapy Introduction",
    contentType: "lesson"
  },
  
  comprehensiveChapter: {
    text: mockTextContent.moderate,
    videos: [mockVideoContent[0], mockVideoContent[1]],
    title: "Understanding EMDR Mechanisms",
    contentType: "chapter"
  },
  
  advancedSection: {
    text: mockTextContent.complex,
    videos: mockVideoContent,
    title: "Advanced EMDR Techniques and Neuroscience",
    contentType: "section"
  },
  
  practiceQuiz: {
    text: `
      Test your understanding of EMDR therapy basics with this comprehensive quiz. 
      Each question is designed to assess your grasp of key concepts covered in 
      the previous lessons. Take your time and consider each answer carefully.
      
      This assessment covers: EMDR history, eight-phase protocol, bilateral 
      stimulation techniques, trauma processing mechanisms, and clinical applications.
    `,
    title: "EMDR Basics Assessment",
    contentType: "quiz"
  },
  
  videoOnlyLesson: {
    videos: [mockVideoContent[1], mockVideoContent[2]],
    title: "Practical EMDR Demonstrations",
    contentType: "lesson"
  },
  
  textOnlyLesson: {
    text: mockTextContent.moderate,
    title: "EMDR Theory and Research",
    contentType: "lesson"
  }
};

/**
 * Sample user profiles for testing personalization
 */
export const mockUserProfiles: Record<string, UserProfile> = {
  fastReader: {
    readingSpeed: 280,
    completionRate: 0.9,
    learningPace: "fast",
    experienceLevel: "intermediate"
  },
  
  averageReader: {
    readingSpeed: 200,
    completionRate: 1.1,
    learningPace: "moderate",
    experienceLevel: "beginner"
  },
  
  slowReader: {
    readingSpeed: 150,
    completionRate: 1.3,
    learningPace: "slow",
    experienceLevel: "beginner"
  },
  
  experiencedLearner: {
    readingSpeed: 240,
    completionRate: 0.8,
    learningPace: "fast",
    experienceLevel: "advanced"
  },
  
  newUser: {
    // No historical data - will use defaults
    experienceLevel: "beginner"
  }
};

/**
 * Sample time estimates for testing UI components
 */
export const mockTimeEstimates = {
  shortLesson: {
    total: 600, // 10 minutes
    breakdown: {
      reading: 300,
      video: 240,
      interaction: 60,
      breaks: 0
    },
    confidence: 0.85,
    isPersonalized: true,
    recommendations: {
      suggestedSessions: 1,
      sessionLength: 600,
      breakFrequency: 1,
      pace: "moderate" as const
    }
  },
  
  mediumLesson: {
    total: 1800, // 30 minutes
    breakdown: {
      reading: 720,
      video: 720,
      interaction: 360,
      breaks: 0
    },
    confidence: 0.78,
    isPersonalized: true,
    recommendations: {
      suggestedSessions: 2,
      sessionLength: 900,
      breakFrequency: 2,
      pace: "moderate" as const
    }
  },
  
  longLesson: {
    total: 3600, // 60 minutes
    breakdown: {
      reading: 1200,
      video: 1800,
      interaction: 600,
      breaks: 0
    },
    confidence: 0.72,
    isPersonalized: false,
    recommendations: {
      suggestedSessions: 3,
      sessionLength: 1200,
      breakFrequency: 3,
      pace: "slow" as const
    }
  }
};

/**
 * Sample progress data for testing progress components
 */
export const mockProgressData = {
  justStarted: {
    progress: 5,
    elapsedTime: 120, // 2 minutes
    estimatedTime: 1800 // 30 minutes
  },
  
  halfway: {
    progress: 50,
    elapsedTime: 900, // 15 minutes
    estimatedTime: 1800 // 30 minutes
  },
  
  nearCompletion: {
    progress: 85,
    elapsedTime: 1440, // 24 minutes
    estimatedTime: 1800 // 30 minutes
  },
  
  completed: {
    progress: 100,
    elapsedTime: 1680, // 28 minutes (faster than estimated)
    estimatedTime: 1800 // 30 minutes
  },
  
  behindSchedule: {
    progress: 30,
    elapsedTime: 900, // 15 minutes (should be at 50% by now)
    estimatedTime: 1800 // 30 minutes
  }
};
