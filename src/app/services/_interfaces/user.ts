import { Studykit } from "./studykit";

export interface User {
    id: string;
    email: string;
    nickname: string;
    
    studykits: Studykit[];
}