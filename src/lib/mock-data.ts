import video_1_1 from "@/videos/Intro-8p3p-Ch1-Section-1-1.mp4";
import video_1_2 from "@/videos/How EMDR Works-8p3p-Ch1-Section-1-2.mp4";
import video_1_3 from "@/videos/Trauma and the Body-8p3p-Ch1-Section-1-3.mp4";
import video_1_4 from "@/videos/Closing-8p3p-Ch1-Section-1-4.mp4";
import { Asset } from "next-video/dist/assets.js";
import type { ConversationalContextConfig } from "@/types/tavus";

// Type definitions for simplified course structure
export interface TranscriptItem {
	id: number;
	time: string;
	text: string;
}

export interface QuizQuestion {
	id: string;
	question: string;
	options: string[];
	correctOption: number; // Index of correct answer (0-3)
}

export interface Quiz {
	id: string;
	title: string;
	description: string; // Added for component compatibility
	questions: QuizQuestion[];
	passingScore: number; // Added for component compatibility
}
export interface Section {
	id: string;
	title: string;
	learningObjective: string;
	videoScript: string;
	videoUrl?: Asset | string; // Path to video file
	videoVTT?: string; // WebVTT transcript content
	quiz?: Quiz; // Optional - not all sections have quizzes
	sectionType?: "video" | "ai_avatar" | "quiz"; // Type of learning object
	completed?: boolean;
	videoCompleted?: boolean;
	quizPassed?: boolean;
	questionAskedCount?: number;
	estimatedDuration?: number; // Duration in seconds for MVP calculations
}

export interface Chapter {
	id: string;
	title: string;
	sections: Section[];
	/**
	 * Conversational context for Tavus AI instructor
	 *
	 * Defines how the AI should behave when answering questions about this chapter
	 * Used by Ask a Question feature (Tavus integration)
	 */
	conversationalContext?: ConversationalContextConfig;
}

export interface Course {
	id: string;
	title: string;
	description: string;
	chapters: Chapter[];
	// Progress tracking
	progress: number; // 0-100
	completedChapters: string[]; // Array of completed chapter IDs
	lastViewedChapter?: string; // For resume functionality
	// Dashboard fields
	imageUrl?: string;
	duration?: string;
}

// Additional interfaces for existing features
export interface QuizResult {
	id: string;
	quiz: string;
	score: number;
	status: "pass" | "fail";
	date: string;
}

export interface CommunityUser {
	id: string;
	name: string;
	avatar: string;
	role: string;
}

export interface CommunityPost {
	id: string;
	user: CommunityUser;
	content: string;
	likes: number;
	comments: number;
	timeAgo: string;
}

// Course transcript data
export const courseTranscript: TranscriptItem[] = [
	{
		id: 1,
		time: "00:15",
		text: "Welcome to EMDR Therapy Fundamentals. In this module, we'll explore the history and development of EMDR.",
	},
	{
		id: 2,
		time: "00:45",
		text: "EMDR was developed by Dr. Francine Shapiro in the late 1980s when she noticed that certain eye movements...",
	},
	{
		id: 3,
		time: "01:20",
		text: "The adaptive information processing model suggests that traumatic memories become stuck...",
	},
	{
		id: 4,
		time: "02:10",
		text: "Research has consistently shown EMDR's effectiveness in treating PTSD and other trauma-related conditions.",
	},
];

// Course data

// Quiz results data
export const quizResults: QuizResult[] = [
	{
		id: "1",
		quiz: "EMDR Phase 1 Assessment",
		score: 92,
		status: "pass",
		date: "2023-09-16",
	},
	{
		id: "2",
		quiz: "Trauma Processing Techniques",
		score: 88,
		status: "pass",
		date: "2023-09-10",
	},
	{
		id: "3",
		quiz: "Client Safety Protocols",
		score: 95,
		status: "pass",
		date: "2023-09-05",
	},
	{
		id: "4",
		quiz: "Advanced Bilateral Stimulation",
		score: 68,
		status: "fail",
		date: "2023-08-28",
	},
];

// Community posts data
export const communityPosts: CommunityPost[] = [
	{
		id: "1",
		user: {
			id: "101",
			name: "David Kim",
			avatar: "",
			role: "Student",
		},
		content:
			"I found the practice session really helpful today. The breakout rooms were a great way to practice the protocol with peers.",
		likes: 8,
		comments: 2,
		timeAgo: "3 hours ago",
	},
	{
		id: "2",
		user: {
			id: "102",
			name: "Lisa Wang",
			avatar: "",
			role: "Student",
		},
		content:
			"Has anyone found good resources for explaining EMDR to clients? I'd appreciate any recommendations!",
		likes: 15,
		comments: 7,
		timeAgo: "1 day ago",
	},
	{
		id: "3",
		user: {
			id: "103",
			name: "Michael Chen",
			avatar: "",
			role: "Practitioner",
		},
		content:
			"Just completed the advanced bilateral stimulation workshop. The VR demonstrations were incredibly insightful for understanding how to adapt techniques for telehealth. Would highly recommend to anyone interested in remote EMDR practice.",
		likes: 23,
		comments: 5,
		timeAgo: "2 days ago",
	},
];

// Simplified course data following Course > Chapters > Sections structure
export const courses: Course[] = [
	{
		id: "1",
		title: "EMDR Therapy Fundamentals",
		description:
			"Learn the foundational principles of EMDR therapy through interactive lessons and practical exercises.",
		progress: 0, // Reset progress for new curriculum
		completedChapters: [], // Track completed chapters by ID
		imageUrl: "/emdr-xr-training.png",
		duration: "4 hours",
		chapters: [
			{
				id: "chapter_1",
				title: "EMDR Foundations",
				sections: [
					{
						id: "section_1_1",
						title: "Introduction",
						learningObjective:
							"Understand how the brain processes overwhelming experiences and the concept of dysfunctionally stored memory.",
						videoUrl: video_1_1,
						videoScript:
							"Welcome to Chapter 1 of the EMDR Foundations course! We're glad you're here to learn about how the brain processes overwhelming experiences. When people go through overwhelming experiences such as combat, assault, or childhood trauma, the brain may store memories in a way that keeps the pain alive. This is called dysfunctionally stored memory. Instead of fading into the past, these memories can trigger fear, shame, or physical reactions as if the danger is happening again.",
						videoVTT: `WEBVTT

1
00:00:00.000 --> 00:00:03.600
Welcome to chapter one of the EMDR Foundation's course.

2
00:00:03.600 --> 00:00:07.410
We're glad you're here to learn about how the brain processes overwhelming

3
00:00:07.410 --> 00:00:08.160
experiences.

4
00:00:08.160 --> 00:00:12.000
When people go through overwhelming experiences such as combat, assault, or

5
00:00:12.000 --> 00:00:13.120
childhood trauma,

6
00:00:13.120 --> 00:00:16.480
the brain may store memories in a way that keeps the pain alive.

7
00:00:16.480 --> 00:00:18.880
This is called dysfunctionally stored memory.

8
00:00:18.880 --> 00:00:23.010
Instead of fading into the past, these memories can trigger fear, shame, or

9
00:00:23.010 --> 00:00:24.160
physical reactions

10
00:00:24.160 --> 00:00:26.000
as if the danger is happening again.`,
						sectionType: "video",
						estimatedDuration: 30, // 30 seconds
						completed: false,
					},
					{
						id: "section_1_2",
						title: "How EMDR Works",
						learningObjective:
							"Learn how Eye Movement Desensitization and Reprocessing helps the brain unlock and reprocess traumatic memories.",
						videoUrl: video_1_2,
						videoScript:
							"Eye Movement Desensitization and Reprocessing, or EMDR, is a therapy that helps the brain unlock and reprocess those memories. Using bilateral stimulation such as guided eye movements, tapping, or tones the therapist activates the brain's natural information-processing system. This allows traumatic memories to shift from being raw and overwhelming into adaptive memories that feel resolved. Think of it like a physical wound, if it's blocked, it can't heal. EMDR clears the block so the mind and body can finish the healing process. Research shows that even long-lasting trauma can improve in just a few sessions.",
						videoVTT: `WEBVTT

1
00:00:00.000 --> 00:00:05.330
Eye movement desensitization and reprocessing, or EMDR, is a therapy that helps

2
00:00:05.330 --> 00:00:09.000
the brain unlock and reprocess those memories.

3
00:00:09.000 --> 00:00:13.080
Using bilateral stimulation such as guided eye movements, tapping, or tones,

4
00:00:13.080 --> 00:00:17.000
the therapist activates the brain's natural information processing system.

5
00:00:17.000 --> 00:00:20.860
This allows traumatic memories to shift from being raw and overwhelming into

6
00:00:20.860 --> 00:00:23.000
adaptive memories that feel resolved.

7
00:00:23.000 --> 00:00:27.000
Think of it like a physical wound. If it's blocked, it can't heal.

8
00:00:27.000 --> 00:00:32.000
EMDR clears the block so the mind and body can finish the healing process.

9
00:00:32.000 --> 00:00:36.710
Research shows that even long-lasting trauma can improve in just a few sessions

10
00:00:36.710 --> 00:00:37.000
.
`,
						sectionType: "video",
						estimatedDuration: 60, // 60 seconds
						completed: false,
					},
					{
						id: "section_1_3",
						title: "Trauma and the Body",
						learningObjective:
							"Understand how trauma is stored in both the mind and body, and how EMDR addresses both aspects.",
						videoUrl: video_1_3,
						videoScript:
							"Trauma is not only stored in the mind it also lives in the body. People may feel tense, numb, or constantly on alert. The body 'keeps the score,' holding the imprint of traumatic stress until it is released. EMDR, combined with grounding techniques, can reduce these reactions and restore balance across the brain's major networks which consist of the default mode (self-reflection), central executive (focus and planning), and salience network (threat detection).",
						videoVTT: `WEBVTT

1
00:00:00.000 --> 00:00:03.600
Trauma is not only stored in the mind, it also lives in the body.

2
00:00:03.600 --> 00:00:07.300
People may feel tense, numb, or constantly on alert.

3
00:00:07.300 --> 00:00:11.240
The body keeps the score, holding the imprint of traumatic stress until it is

4
00:00:11.240 --> 00:00:11.800
released.

5
00:00:11.800 --> 00:00:16.550
EMDR, combined with grounding techniques, can reduce these reactions and

6
00:00:16.550 --> 00:00:17.400
restore balance

7
00:00:17.400 --> 00:00:21.760
across the brain's major networks, which consist of the default mode, self-ref

8
00:00:21.760 --> 00:00:22.400
lection,

9
00:00:22.400 --> 00:00:27.600
central executive, focus and planning, and salient network, threat detection.
`,
						sectionType: "video",
						estimatedDuration: 45, // 45 seconds
						completed: false,
					},
					{
						id: "section_1_4",
						title: "Closing",
						learningObjective:
							"Understand the goal of EMDR therapy: helping people remember without reliving.",
						videoUrl: video_1_4,
						videoScript:
							"In this chapter, we learned how trauma can remain stuck, how EMDR reactivates the brain's natural ability to heal, and how restoring balance across brain networks allows people to remember without reliving. Now it's your turn. Take a short knowledge check quiz to review what you've learned and reinforce these key concepts before moving forward.",
						videoVTT: `WEBVTT

1
00:00:00.000 --> 00:00:04.780
In this chapter, we learned how trauma can remain stuck, how EMDR reactivates

2
00:00:04.780 --> 00:00:06.840
the brain's natural ability to heal,

3
00:00:06.840 --> 00:00:10.490
and how restoring balance across brain networks allows people to remember

4
00:00:10.490 --> 00:00:11.500
without reliving.

5
00:00:11.500 --> 00:00:12.860
Now it's your turn.

6
00:00:12.860 --> 00:00:16.660
Take a short knowledge check quiz to review what you've learned and reinforce

7
00:00:16.660 --> 00:00:19.340
these key concepts before moving forward.
`,
						sectionType: "video",
						estimatedDuration: 15, // 15 seconds
						completed: false,
					},
					{
						id: "section_1_5",
						title: "Knowledge Assessment",
						learningObjective:
							"Test your comprehensive understanding of EMDR foundations, trauma processing, and therapeutic goals.",
						videoScript:
							"Complete this assessment to demonstrate your mastery of the EMDR foundations concepts.",
						sectionType: "quiz",
						estimatedDuration: 300, // 5 minutes for quiz
						completed: true,
						quiz: {
							id: "quiz_1_foundations",
							title: "EMDR Foundations Final Assessment",
							description:
								"Test your comprehensive understanding of EMDR foundations, trauma processing, and therapeutic goals",
							passingScore: 70,
							questions: [
								{
									id: "q1",
									question:
										"Which of the following best describes trauma in EMDR theory?",
									options: [
										"A disorder caused only by biology",
										"An unresolved memory stored with distressing emotions and body sensations",
										"A temporary emotional reaction",
										"A conscious choice to feel bad",
									],
									correctOption: 1,
								},
								{
									id: "q2",
									question: "What does bilateral stimulation do in EMDR?",
									options: [
										"Distracts clients from trauma",
										"Reactivates the brain's natural information-processing system",
										"Erases traumatic memories",
										"Creates new memories",
									],
									correctOption: 1,
								},
								{
									id: "q3",
									question:
										"According to The Body Keeps the Score, trauma affects not just thoughts but also...",
									options: [
										"Only conscious memories",
										"The immune system and body responses",
										"Only recent experiences",
										"Only verbal memories",
									],
									correctOption: 1,
								},
								{
									id: "q4",
									question:
										"In the Network Balance Model, PTSD is linked to...",
									options: [
										"Balanced brain networks",
										"Loss of balance between large-scale neural networks",
										"Enhanced brain connectivity",
										"Improved network function",
									],
									correctOption: 1,
								},
								{
									id: "q5",
									question:
										"True or False: EMDR requires clients to give a detailed verbal description of their trauma.",
									options: [
										"True - detailed retelling is required",
										"False - EMDR does not require detailed retelling; processing occurs physiologically with minimal narration",
										"True - but only for severe trauma",
										"False - but only for recent trauma",
									],
									correctOption: 1,
								},
							],
						},
					},
					{
						id: "section_1_6",
						title: "Learning Check",
						learningObjective:
							"Engage in an interactive conversation with an AI Avatar to reinforce your understanding of EMDR foundations.",
						videoScript:
							"Welcome to the Learning Check! I'm your AI Avatar instructor. I'll ask you questions about what you've learned and provide personalized feedback to help reinforce the key concepts from the EMDR Foundations section.",
						sectionType: "ai_avatar",
						estimatedDuration: 600, // 10 minutes for AI conversation
						completed: false,
					},
				],
				conversationalContext: {
					instructorTone: "conversational",
					keyConcepts: [
						"trauma theory",
						"bilateral stimulation",
						"adaptive information processing",
						"dysfunctionally stored memory",
						"network balance model",
					],
					responseLength: "moderate",
					customInstructions:
						"Focus on foundational EMDR concepts. Use simple analogies to explain complex neuroscience. Encourage learners to connect concepts to real-world applications.",
				},
			},
			{
				id: "chapter_2",
				title: "EMDR Protocol",
				sections: [
					{
						id: "section_2_1",
						title: "8-Phase Protocol Overview",
						learningObjective:
							"Master the 8-phase EMDR protocol structure and implementation.",
						videoScript:
							"The EMDR protocol consists of 8 distinct phases, each serving a specific purpose in trauma processing. Phase 1 involves history taking and treatment planning...",
						sectionType: "video",
						estimatedDuration: 1800, // 30 minutes
						completed: true,
						quiz: {
							id: "quiz_2_1",
							title: "EMDR Protocol Quiz",
							description: "Test your knowledge of the 8-phase EMDR protocol",
							passingScore: 75,
							questions: [
								{
									id: "q1",
									question: "How many phases are in the EMDR protocol?",
									options: ["6", "7", "8", "9"],
									correctOption: 2,
								},
								{
									id: "q2",
									question: "What is Phase 1 of EMDR?",
									options: [
										"Preparation",
										"History taking",
										"Assessment",
										"Installation",
									],
									correctOption: 1,
								},
								{
									id: "q3",
									question: "The EMDR protocol is:",
									options: [
										"Flexible and adaptable",
										"Rigid and unchangeable",
										"Only for adults",
										"Only for children",
									],
									correctOption: 0,
								},
								{
									id: "q4",
									question: "Each phase of EMDR serves:",
									options: [
										"The same purpose",
										"A specific purpose",
										"No particular purpose",
										"Only assessment purposes",
									],
									correctOption: 1,
								},
							],
						},
					},
					{
						id: "ch_2_2",
						title: "Client Preparation",
						learningObjective:
							"Learn techniques for preparing clients for EMDR processing.",
						videoScript:
							"Client preparation is crucial for successful EMDR treatment. This phase involves building rapport, explaining the process, and teaching self-regulation techniques...",
						completed: false,
						quiz: {
							id: "quiz_2_2",
							title: "Client Preparation Quiz",
							description:
								"Test your understanding of client preparation techniques",
							passingScore: 70,
							questions: [
								{
									id: "q1",
									question: "Why is client preparation important?",
									options: [
										"It's not important",
										"Builds rapport and safety",
										"Saves time",
										"Reduces cost",
									],
									correctOption: 1,
								},
								{
									id: "q2",
									question: "Self-regulation techniques help clients:",
									options: [
										"Avoid therapy",
										"Manage distress",
										"Skip sessions",
										"End treatment early",
									],
									correctOption: 1,
								},
								{
									id: "q3",
									question: "Building rapport involves:",
									options: [
										"Being distant",
										"Creating trust and safety",
										"Rushing the process",
										"Avoiding eye contact",
									],
									correctOption: 1,
								},
								{
									id: "q4",
									question: "Explaining the EMDR process helps:",
									options: [
										"Confuse the client",
										"Reduce anxiety and increase cooperation",
										"Waste time",
										"Create fear",
									],
									correctOption: 1,
								},
							],
						},
					},
				],
				conversationalContext: {
					instructorTone: "professional",
					keyConcepts: [
						"8-phase protocol",
						"client preparation",
						"history taking",
						"treatment planning",
						"self-regulation techniques",
					],
					responseLength: "detailed",
					customInstructions:
						"Focus on practical protocol implementation. Provide step-by-step guidance. Reference specific phases when answering questions.",
				},
			},
		],
	},
	{
		id: "2",
		title: "Advanced EMDR Techniques",
		description:
			"Master advanced EMDR protocols and interventions for complex cases.",
		progress: 30,
		completedChapters: ["section_2_1"],
		imageUrl: "/emdr-xr-training.png",
		duration: "6 hours",
		chapters: [
			{
				id: "chapter_2",
				title: "Complex Trauma Cases",
				sections: [
					{
						id: "section_2_1",
						title: "Dissociative Disorders",
						learningObjective:
							"Understand EMDR modifications for clients with dissociative disorders.",
						videoScript:
							"Working with dissociative disorders requires careful modification of standard EMDR protocols. Safety and stabilization are paramount...",
						sectionType: "video",
						estimatedDuration: 900, // 15 minutes
						completed: true,
						quiz: {
							id: "quiz_3_1",
							title: "Dissociative Disorders Quiz",
							description:
								"Test your knowledge of EMDR modifications for dissociative disorders",
							passingScore: 80,
							questions: [
								{
									id: "q1",
									question:
										"When working with dissociative disorders, what is most important?",
									options: [
										"Speed of treatment",
										"Safety and stabilization",
										"Cost effectiveness",
										"Session frequency",
									],
									correctOption: 1,
								},
								{
									id: "q2",
									question:
										"EMDR protocols for dissociative disorders require:",
									options: [
										"No modifications",
										"Careful modifications",
										"Complete avoidance",
										"Faster processing",
									],
									correctOption: 1,
								},
								{
									id: "q3",
									question: "Dissociation is a:",
									options: [
										"Sign of weakness",
										"Protective mechanism",
										"Rare occurrence",
										"Treatment goal",
									],
									correctOption: 1,
								},
								{
									id: "q4",
									question: "Before processing trauma in dissociative clients:",
									options: [
										"Jump right in",
										"Establish safety and resources",
										"Use standard protocol",
										"Avoid preparation",
									],
									correctOption: 1,
								},
							],
						},
					},
					{
						id: "section_2_2",
						title: "Advanced Protocol Modifications",
						learningObjective:
							"Learn advanced modifications to EMDR protocols for complex trauma presentations.",
						videoScript:
							"Advanced EMDR techniques require careful consideration of client stability, resource availability, and trauma complexity. This section covers protocol modifications for challenging cases.",
						sectionType: "video",
						estimatedDuration: 1200, // 20 minutes
						completed: false,
					},
					{
						id: "section_2_3",
						title: "Case Study Analysis",
						learningObjective:
							"Analyze complex trauma cases and apply appropriate EMDR modifications.",
						videoScript:
							"Through detailed case studies, we'll examine how to adapt EMDR protocols for various complex trauma presentations including dissociation, attachment trauma, and developmental trauma.",
						sectionType: "ai_avatar",
						estimatedDuration: 900, // 15 minutes
						completed: false,
					},
					{
						id: "section_2_4",
						title: "Advanced Techniques Assessment",
						learningObjective:
							"Demonstrate mastery of advanced EMDR techniques and protocol modifications.",
						videoScript:
							"Complete this comprehensive assessment to demonstrate your understanding of advanced EMDR techniques for complex trauma cases.",
						sectionType: "quiz",
						estimatedDuration: 600, // 10 minutes
						completed: false,
						quiz: {
							id: "quiz_3_advanced",
							title: "Advanced EMDR Techniques Final Assessment",
							description:
								"Comprehensive assessment of advanced EMDR techniques and protocol modifications",
							passingScore: 85,
							questions: [
								{
									id: "q1",
									question:
										"Which factor is most important when modifying EMDR protocols for complex trauma?",
									options: [
										"Treatment speed",
										"Client safety and stabilization",
										"Protocol adherence",
										"Therapist preference",
									],
									correctOption: 1,
								},
								{
									id: "q2",
									question:
										"Advanced EMDR techniques are most appropriate for:",
									options: [
										"All trauma clients",
										"Clients with adequate resources and stability",
										"First-time therapy clients",
										"Clients seeking quick results",
									],
									correctOption: 1,
								},
								{
									id: "q3",
									question:
										"When working with attachment trauma, the therapist should prioritize:",
									options: [
										"Rapid memory processing",
										"Relationship building and safety",
										"Standard EMDR protocol",
										"Cognitive interventions only",
									],
									correctOption: 1,
								},
							],
						},
					},
				],
				conversationalContext: {
					instructorTone: "encouraging",
					keyConcepts: [
						"dissociative disorders",
						"complex trauma",
						"attachment trauma",
						"protocol modifications",
						"client safety",
						"stabilization techniques",
					],
					responseLength: "moderate",
					customInstructions:
						"Focus on advanced applications and clinical nuances. Emphasize safety considerations. Help learners understand when to modify standard protocols.",
				},
			},
		],
	},
];
