"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export type QuizResult = {
	id: string;
	quiz: string;
	score: number;
	status: "pass" | "fail";
	date: string;
};

export interface QuizResultsTableProps {
	results: QuizResult[];
	showViewAll?: boolean;
	onViewAll?: () => void;
}

export function QuizResultsTable({
	results,
	showViewAll = true,
	onViewAll,
}: QuizResultsTableProps) {
	return (
		<div className="w-full">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Quiz</TableHead>
						<TableHead className="text-center">Score</TableHead>
						<TableHead className="text-center">Status</TableHead>
						<TableHead className="text-right">Date</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{results.map((result) => (
						<TableRow key={result.id}>
							<TableCell className="font-medium">{result.quiz}</TableCell>
							<TableCell className="text-center">{result.score}%</TableCell>
							<TableCell className="text-center">
								<span
									className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
										result.status === "pass"
											? "bg-green-100 text-green-800"
											: "bg-red-100 text-red-800"
									}`}
								>
									{result.status === "pass" ? "Pass" : "Fail"}
								</span>
							</TableCell>
							<TableCell className="text-right">{result.date}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
