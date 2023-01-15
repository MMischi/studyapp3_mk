import { Studykit } from "./studykit";

export interface User {
    id: string;
    email: string;
    nickname: string;

    created_at: Date;
    updated_at: Date;
}