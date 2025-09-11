"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

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
					<TableRow className="border-none hover:bg-transparent">
						<TableHead className="text-muted-foreground">Quiz</TableHead>
						<TableHead className="text-center text-muted-foreground">
							Score
						</TableHead>
						<TableHead className="text-center text-muted-foreground">
							Status
						</TableHead>
						<TableHead className="text-right text-muted-foreground">
							Date
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{results.map((result) => (
						<TableRow key={result.id} className="border-none">
							<TableCell className="font-medium py-4">{result.quiz}</TableCell>
							<TableCell className="text-center font-medium py-4">
								{result.score}%
							</TableCell>
							<TableCell className="text-center py-4">
								<span
									className={`inline-flex items-center gap-1 px-4 py-1 rounded-full text-sm font-medium ${
										result.status === "pass"
											? "bg-green-50 text-green-700"
											: "bg-red-50 text-red-700"
									}`}
								>
									{result.status === "pass" ? (
										<>
											<CheckCircle className="h-4 w-4" />
											Pass
										</>
									) : (
										<>
											<XCircle className="h-4 w-4" />
											Fail
										</>
									)}
								</span>
							</TableCell>
							<TableCell className="text-right text-muted-foreground py-4">
								{result.date}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{showViewAll && (
				<div className="flex justify-end mt-4">
					<Button
						variant="link"
						onClick={onViewAll}
						className="text-amber-500 hover:text-amber-600 font-medium"
					>
						View All Results
					</Button>
				</div>
			)}
		</div>
	);
}
