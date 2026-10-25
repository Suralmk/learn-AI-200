import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Question } from "./questions"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function shuffleQuestionOptions(question: Question): Question {
  // Shuffle positions, not text, so duplicate option text can't confuse the mapping.
  const order = shuffleArray(question.options.map((_, i) => i));
  const newIndex = (oldIndex: number) => order.indexOf(oldIndex);
  return {
    ...question,
    options: order.map((i) => question.options[i]),
    answer: Array.isArray(question.answer)
      ? question.answer.map(newIndex).sort((a, b) => a - b)
      : newIndex(question.answer),
  };
}
