import { AnswerDTO } from "./dto_answer";

export interface CardDTO {
    id: string;
    lastLearnedOn: Date;
    nextLearnDate: Date;
    repetitionTimes: number;
    type: string;

    question: string;
    answers: AnswerDTO[];

    created_by: string;
    created_at: Date;
    updated_at: Date;
}