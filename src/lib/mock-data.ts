// Course transcript data
export const courseTranscript = [
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

export const mockCourses = {
	course: {
		id: "course_emdr_001",
		title: "EMDR Therapist Training",
		description:
			"A structured training program designed to certify therapists in Eye Movement Desensitization and Reprocessing (EMDR). Includes theory, protocols, enriched scenarios, biometric insights, and supervised practice.",
		duration_hours: 40,
		level: "Professional Certification",
		modules: [
			{
				id: "module_1",
				title: "Foundations of EMDR",
				description:
					"Introduction to EMDR principles, history, and therapeutic rationale.",
				chapters: [
					{
						id: "chapter_1_1",
						title: "Introduction to Trauma and EMDR",
						lessons: [
							{
								id: "lesson_1_1_1",
								title: "History of EMDR",
								content_type: "video",
								duration_min: 15,
							},
							{
								id: "lesson_1_1_2",
								title: "Understanding Trauma",
								content_type: "reading",
								duration_min: 20,
							},
						],
						assessments: [
							{
								id: "quiz_1_1",
								title: "Trauma Fundamentals Quiz",
								type: "multiple_choice",
								questions: 5,
							},
						],
					},
				],
			},
			{
				id: "module_2",
				title: "EMDR Protocols & Therapeutic Process",
				description:
					"Step-by-step overview of the standard EMDR 8-Phase Protocol.",
				chapters: [
					{
						id: "chapter_2_1",
						title: "Phase 1: History Taking",
						lessons: [
							{
								id: "lesson_2_1_1",
								title: "Client Assessment & Case Formulation",
								content_type: "interactive_case",
								duration_min: 25,
							},
						],
					},
					{
						id: "chapter_2_2",
						title: "Phase 2: Preparation",
						lessons: [
							{
								id: "lesson_2_2_1",
								title: "Developing Client Safety & Resources",
								content_type: "exercise",
								duration_min: 20,
							},
						],
					},
				],
			},
			{
				id: "module_3",
				title: "Applied Scenarios & Simulation",
				description:
					"Practice enriched patient scenarios with branching dialogues and biometric feedback.",
				chapters: [
					{
						id: "chapter_3_1",
						title: "Enriched Patient Scenario: PTSD Veteran",
						lessons: [
							{
								id: "lesson_3_1_1",
								title: "Simulated Patient Interaction",
								content_type: "simulation",
								duration_min: 30,
								resources: ["enriched-patient-scenarios-6yunw8sb.md"],
							},
						],
					},
					{
						id: "chapter_3_2",
						title: "Biometric Data Insights",
						lessons: [
							{
								id: "lesson_3_2_1",
								title: "EEG & Heart Rate Monitoring During Session",
								content_type: "data_visualization",
								duration_min: 15,
								resources: ["EEAP: Biometric Data Dataset.pdf"],
							},
						],
					},
				],
			},
			{
				id: "module_4",
				title: "Ethics, Compliance & Certification",
				description:
					"Legal, ethical, and certification requirements for EMDR practice.",
				chapters: [
					{
						id: "chapter_4_1",
						title: "HIPAA & Patient Confidentiality",
						lessons: [
							{
								id: "lesson_4_1_1",
								title: "Regulatory Compliance for Therapists",
								content_type: "reading",
								duration_min: 25,
							},
						],
					},
					{
						id: "chapter_4_2",
						title: "Final Certification Exam",
						assessments: [
							{
								id: "exam_final",
								title: "EMDR Certification Assessment",
								type: "practical_exam",
								duration_min: 90,
							},
						],
					},
				],
			},
		],
	},
};
