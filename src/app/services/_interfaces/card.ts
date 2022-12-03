import { Answer } from "./answer";

export interface Card {
    id: string;
    lastLearnedOn: Date;
    nextLearnDate: Date;
    repetitionTimes: number;
    type: string;

    question: string;
    answers: Answer[];
}