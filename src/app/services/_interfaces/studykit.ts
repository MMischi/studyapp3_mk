import { Card } from "./card";

export interface Studykit {
    id: string;
    title: string;
    description: string;
    cards: Card[];

    published: boolean;

    created_by: string;
    created_at: Date;
    updated_at: Date;
}