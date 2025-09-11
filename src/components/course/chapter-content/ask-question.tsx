"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Send } from "lucide-react";

interface AskQuestionProps {
  chapterTitle: string;
}

export function AskQuestion({ chapterTitle }: AskQuestionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = () => {
    if (!question.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset after showing success message
      setTimeout(() => {
        setIsSubmitted(false);
        setQuestion("");
        setIsOpen(false);
      }, 3000);
    }, 1000);
  };
  
  if (!isOpen) {
    return (
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <HelpCircle className="h-4 w-4" />
        Ask a Question
      </Button>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Ask a Question about &quot;{chapterTitle}&quot;
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="bg-green-50 p-4 rounded-md text-green-800">
            <p className="font-medium">Question Submitted!</p>
            <p className="text-sm mt-1">
              Your question has been submitted. An instructor will respond to you shortly.
            </p>
          </div>
        ) : (
          <Textarea
            placeholder="What would you like to ask about this chapter?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[120px]"
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() => {
            setQuestion("");
            setIsOpen(false);
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!question.trim() || isSubmitting || isSubmitted}
          className="flex items-center gap-2"
        >
          {isSubmitting ? "Submitting..." : "Submit Question"}
          <Send className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
