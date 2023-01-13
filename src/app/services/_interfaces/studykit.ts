import { Card } from "./card";

export interface Studykit {
    id: string;
    title: string;
    cards: Card[];

    created_by: string;
    created_at: Date;
    updated_at: Date;
}