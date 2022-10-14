import { Answer } from "./answer";
import { Question } from "./Question";

export interface Card {
    id: string;
    lastLearnedOn: Date;
    repetitionTimes: number;

    question: Question;
    answers: Answer[];
}