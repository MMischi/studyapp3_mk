import { Card } from "./card";

export interface Studykit {
    id: string;
    title: string;

    cards: Card[];
}