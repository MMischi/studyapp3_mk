import { CardDTO } from "./dto_card";

export interface StudykitDTO {
    id: string;
    title: string;
    cards: CardDTO[];

    created_by: string;
    created_at: Date;
    updated_at: Date;
}