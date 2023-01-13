export interface Answer {
    id: string;
    text: string;
    isRight: boolean;

    created_by: string;
    created_at: Date;
    updated_at: Date;
}