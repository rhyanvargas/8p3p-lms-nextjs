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

export interface Chapter {
	id: string;
	title: string;
	learningObjective: string;
	videoScript: string;
	quiz: Quiz;
	completed?: boolean;
	videoCompleted?: boolean;
	quizPassed?: boolean;
	questionAskedCount?: number;
}

export interface Section {
	id: string;
	title: string;
	chapters: Chapter[];
}

export interface Course {
	id: string;
	title: string;
	description: string;
	sections: Section[];
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

// Simplified course data following Course > Sections > Chapters structure
export const courses: Course[] = [
	{
		id: "1",
		title: "EMDR Therapy Fundamentals",
		description: "Learn the foundational principles of EMDR therapy through interactive lessons and practical exercises.",
		progress: 65,
		completedChapters: ["ch_1_1", "ch_1_2", "ch_2_1"], // Track completed chapters by ID
		imageUrl: "/emdr-xr-training.png",
		duration: "4 hours",
		sections: [
			{
				id: "section_1",
				title: "EMDR Foundations",
				chapters: [
					{
						id: "ch_1_1",
						title: "History of EMDR",
						learningObjective: "Understand the origins and development of EMDR therapy by Dr. Francine Shapiro.",
						videoScript: "Welcome to EMDR Therapy Fundamentals. In this module, we'll explore the history and development of EMDR. EMDR was developed by Dr. Francine Shapiro in the late 1980s when she noticed that certain eye movements...",
						completed: true,
						quiz: {
							id: "quiz_1_1",
							title: "EMDR History Quiz",
							description: "Test your knowledge about the history and development of EMDR therapy",
							passingScore: 70,
							questions: [
								{
									id: "q1",
									question: "Who developed EMDR therapy?",
									options: ["Dr. Francine Shapiro", "Dr. Judith Beck", "Dr. Aaron Beck", "Dr. Albert Ellis"],
									correctOption: 0
								},
								{
									id: "q2",
									question: "In which decade was EMDR developed?",
									options: ["1970s", "1980s", "1990s", "2000s"],
									correctOption: 1
								},
								{
									id: "q3",
									question: "What does EMDR stand for?",
									options: ["Eye Movement Desensitization and Reprocessing", "Emotional Memory Desensitization and Recovery", "Eye Movement Disorder and Recovery", "Emotional Movement Desensitization and Reprocessing"],
									correctOption: 0
								},
								{
									id: "q4",
									question: "EMDR is primarily used to treat:",
									options: ["Depression only", "Anxiety disorders only", "PTSD and trauma-related conditions", "Personality disorders only"],
									correctOption: 2
								}
							]
						}
					},
					{
						id: "ch_1_2",
						title: "Understanding Trauma",
						learningObjective: "Identify different types of trauma and their impact on memory processing.",
						videoScript: "The adaptive information processing model suggests that traumatic memories become stuck. Research has consistently shown EMDR's effectiveness in treating PTSD and other trauma-related conditions.",
						completed: true,
						quiz: {
							id: "quiz_1_2",
							title: "Trauma Understanding Quiz",
							description: "Test your understanding of trauma types and memory processing",
							passingScore: 70,
							questions: [
								{
									id: "q1",
									question: "What happens to traumatic memories according to AIP model?",
									options: ["They are forgotten", "They become stuck", "They are enhanced", "They are deleted"],
									correctOption: 1
								},
								{
									id: "q2",
									question: "EMDR is most effective for treating:",
									options: ["All mental health conditions", "PTSD and trauma conditions", "Only childhood trauma", "Only recent trauma"],
									correctOption: 1
								},
								{
									id: "q3",
									question: "What does AIP stand for?",
									options: ["Adaptive Information Processing", "Advanced Information Processing", "Automatic Information Processing", "Active Information Processing"],
									correctOption: 0
								},
								{
									id: "q4",
									question: "Trauma can affect:",
									options: ["Memory only", "Emotions only", "Memory, emotions, and body sensations", "Behavior only"],
									correctOption: 2
								}
							]
						}
					}
				]
			},
			{
				id: "section_2",
				title: "EMDR Protocol",
				chapters: [
					{
						id: "ch_2_1",
						title: "8-Phase Protocol Overview",
						learningObjective: "Master the 8-phase EMDR protocol structure and implementation.",
						videoScript: "The EMDR protocol consists of 8 distinct phases, each serving a specific purpose in trauma processing. Phase 1 involves history taking and treatment planning...",
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
									correctOption: 2
								},
								{
									id: "q2",
									question: "What is Phase 1 of EMDR?",
									options: ["Preparation", "History taking", "Assessment", "Installation"],
									correctOption: 1
								},
								{
									id: "q3",
									question: "The EMDR protocol is:",
									options: ["Flexible and adaptable", "Rigid and unchangeable", "Only for adults", "Only for children"],
									correctOption: 0
								},
								{
									id: "q4",
									question: "Each phase of EMDR serves:",
									options: ["The same purpose", "A specific purpose", "No particular purpose", "Only assessment purposes"],
									correctOption: 1
								}
							]
						}
					},
					{
						id: "ch_2_2",
						title: "Client Preparation",
						learningObjective: "Learn techniques for preparing clients for EMDR processing.",
						videoScript: "Client preparation is crucial for successful EMDR treatment. This phase involves building rapport, explaining the process, and teaching self-regulation techniques...",
						completed: false,
						quiz: {
							id: "quiz_2_2",
							title: "Client Preparation Quiz",
							description: "Test your understanding of client preparation techniques",
							passingScore: 70,
							questions: [
								{
									id: "q1",
									question: "Why is client preparation important?",
									options: ["It's not important", "Builds rapport and safety", "Saves time", "Reduces cost"],
									correctOption: 1
								},
								{
									id: "q2",
									question: "Self-regulation techniques help clients:",
									options: ["Avoid therapy", "Manage distress", "Skip sessions", "End treatment early"],
									correctOption: 1
								},
								{
									id: "q3",
									question: "Building rapport involves:",
									options: ["Being distant", "Creating trust and safety", "Rushing the process", "Avoiding eye contact"],
									correctOption: 1
								},
								{
									id: "q4",
									question: "Explaining the EMDR process helps:",
									options: ["Confuse the client", "Reduce anxiety and increase cooperation", "Waste time", "Create fear"],
									correctOption: 1
								}
							]
						}
					}
				]
			}
		]
	},
	{
		id: "2",
		title: "Advanced EMDR Techniques",
		description: "Master advanced EMDR protocols and interventions for complex cases.",
		progress: 30,
		completedChapters: ["ch_3_1"],
		imageUrl: "/emdr-xr-training.png",
		duration: "6 hours",
		sections: [
			{
				id: "section_3",
				title: "Complex Trauma Cases",
				chapters: [
					{
						id: "ch_3_1",
						title: "Dissociative Disorders",
						learningObjective: "Understand EMDR modifications for clients with dissociative disorders.",
						videoScript: "Working with dissociative disorders requires careful modification of standard EMDR protocols. Safety and stabilization are paramount...",
						completed: true,
						quiz: {
							id: "quiz_3_1",
							title: "Dissociative Disorders Quiz",
							description: "Test your knowledge of EMDR modifications for dissociative disorders",
							passingScore: 80,
							questions: [
								{
									id: "q1",
									question: "When working with dissociative disorders, what is most important?",
									options: ["Speed of treatment", "Safety and stabilization", "Cost effectiveness", "Session frequency"],
									correctOption: 1
								},
								{
									id: "q2",
									question: "EMDR protocols for dissociative disorders require:",
									options: ["No modifications", "Careful modifications", "Complete avoidance", "Faster processing"],
									correctOption: 1
								},
								{
									id: "q3",
									question: "Dissociation is a:",
									options: ["Sign of weakness", "Protective mechanism", "Rare occurrence", "Treatment goal"],
									correctOption: 1
								},
								{
									id: "q4",
									question: "Before processing trauma in dissociative clients:",
									options: ["Jump right in", "Establish safety and resources", "Use standard protocol", "Avoid preparation"],
									correctOption: 1
								}
							]
						}
					}
				]
			}
		]
	}
];


