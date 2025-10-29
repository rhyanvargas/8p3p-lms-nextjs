"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

interface QuizQuestion {
	id: string;
	question: string;
	options: string[];
	correctOption: number;
}

interface Quiz {
	id: string;
	title: string;
	description: string;
	questions: QuizQuestion[];
	passingScore: number;
}

interface ChapterQuizProps {
	quiz: Quiz;
	onNextChapter?: () => void;
	chapterTitle?: string;
	chapterId?: string;
	onQuizComplete?: (passed: boolean, score: number) => void;
}

export function ChapterQuiz({
	quiz,
	onNextChapter,
	chapterTitle,
	chapterId,
	onQuizComplete,
}: ChapterQuizProps) {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [selectedOptions, setSelectedOptions] = useState<number[]>(
		Array(quiz.questions.length).fill(-1)
	);
	const [submitted, setSubmitted] = useState(false);
	const [score, setScore] = useState(0);

	const handleOptionSelect = (optionIndex: number) => {
		const newSelectedOptions = [...selectedOptions];
		newSelectedOptions[currentQuestion] = optionIndex;
		setSelectedOptions(newSelectedOptions);
	};

	const handleNext = () => {
		if (currentQuestion < quiz.questions.length - 1) {
			setCurrentQuestion(currentQuestion + 1);
		}
	};

	const handlePrevious = () => {
		if (currentQuestion > 0) {
			setCurrentQuestion(currentQuestion - 1);
		}
	};

	const handleSubmit = () => {
		// Calculate score
		const correctAnswers = selectedOptions.reduce((count, selected, index) => {
			return selected === quiz.questions[index].correctOption
				? count + 1
				: count;
		}, 0);

		const calculatedScore = Math.round(
			(correctAnswers / quiz.questions.length) * 100
		);
		const passed = calculatedScore >= quiz.passingScore;

		setScore(calculatedScore);
		setSubmitted(true);

		// Notify parent component of quiz completion
		if (onQuizComplete) {
			onQuizComplete(passed, calculatedScore);
		}
	};

	const handleRetry = () => {
		setSelectedOptions(Array(quiz.questions.length).fill(-1));
		setCurrentQuestion(0);
		setSubmitted(false);
		setScore(0);
	};

	// If quiz is submitted, show results
	if (submitted) {
		const passed = score >= quiz.passingScore;

		return (
			<Card>
				<CardHeader className={passed ? "bg-green-50" : "bg-red-50"}>
					<CardTitle className="flex items-center gap-2">
						{passed ? (
							<>
								<CheckCircle className="h-5 w-5 text-green-500" />
								<span>Quiz Passed!</span>
							</>
						) : (
							<>
								<XCircle className="h-5 w-5 text-red-500" />
								<span>Quiz Failed</span>
							</>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<div className="text-center mb-6">
						<div className="text-4xl font-bold mb-2">{score}%</div>
						<p className="text-muted-foreground">
							You answered{" "}
							{
								selectedOptions.filter(
									(option, index) =>
										option === quiz.questions[index].correctOption
								).length
							}{" "}
							out of {quiz.questions.length} questions correctly.
						</p>
					</div>

					<div className="space-y-4">
						{quiz.questions.map((question, index) => {
							const isCorrect =
								selectedOptions[index] === question.correctOption;

							return (
								<div
									key={question.id}
									className={`p-4 rounded-lg ${isCorrect ? "bg-green-50" : "bg-red-50"}`}
								>
									<div className="flex items-start gap-2">
										{isCorrect ? (
											<CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
										) : (
											<XCircle className="h-5 w-5 text-red-500 mt-0.5" />
										)}
										<div>
											<p className="font-medium mb-2">
												Question {index + 1}: {question.question}
											</p>
											<p className="text-sm">
												<span className="font-medium">Your answer:</span>{" "}
												{question.options[selectedOptions[index]]}
											</p>
											{!isCorrect && (
												<p className="text-sm text-green-600">
													<span className="font-medium">Correct answer:</span>{" "}
													{question.options[question.correctOption]}
												</p>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
				<CardFooter className="flex gap-2">
					{passed ? (
						<>
							{onNextChapter && (
								<Button
									onClick={onNextChapter}
									className="flex-1 flex items-center gap-2"
								>
									Next Chapter
									<ArrowRight className="h-4 w-4" />
								</Button>
							)}
						</>
					) : (
						<>
							<Button onClick={handleRetry} className="flex-1">
								Retry Quiz
							</Button>
						</>
					)}
				</CardFooter>
			</Card>
		);
	}

	// Current question
	const question = quiz.questions[currentQuestion];

	return (
		<Card className="shadow-none">
			<CardHeader>
				{/* <CardTitle>{quiz.title}</CardTitle>
				<p className="text-muted-foreground">{quiz.description}</p> */}
				<div className="">
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm font-medium">
							Question {currentQuestion + 1} of {quiz.questions.length}
						</span>
						<span className="text-sm text-muted-foreground">
							{Math.round(
								((currentQuestion + 1) / quiz.questions.length) * 100
							)}
							% complete
						</span>
					</div>
					<div className="w-full bg-muted h-2 rounded-full overflow-hidden">
						<div
							className="bg-primary h-full rounded-full"
							style={{
								width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
							}}
						></div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-6">
				<div className="mb-6">
					<h3 className="text-lg font-medium mb-4">{question.question}</h3>

					<RadioGroup
						value={selectedOptions[currentQuestion].toString()}
						onValueChange={(value: string) =>
							handleOptionSelect(parseInt(value))
						}
					>
						<div className="space-y-3">
							{question.options.map((option, index) => (
								<div
									key={index}
									className="flex items-center space-x-2 hover:bg-muted/50 rounded-lg p-1 pl-1.5"
								>
									<RadioGroupItem
										value={index.toString()}
										id={`option-${index}`}
									/>
									<Label
										htmlFor={`option-${index}`}
										className="flex-1 cursor-pointer py-2"
									>
										{option}
									</Label>
								</div>
							))}
						</div>
					</RadioGroup>
				</div>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button
					variant="ghost"
					onClick={handlePrevious}
					disabled={currentQuestion === 0}
				>
					Previous
				</Button>

				<div className="flex gap-2">
					{currentQuestion < quiz.questions.length - 1 ? (
						<Button
							onClick={handleNext}
							disabled={selectedOptions[currentQuestion] === -1}
						>
							Next
						</Button>
					) : (
						<Button
							onClick={handleSubmit}
							disabled={selectedOptions.includes(-1)}
						>
							Submit
						</Button>
					)}
				</div>
			</CardFooter>
		</Card>
	);
}
