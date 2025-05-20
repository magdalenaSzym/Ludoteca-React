import type { Customer } from "./Customer";
import type { Game } from "./Game";

export interface Borrow {
    id: string,
    customer?:Customer,
    game?: Game,
    startDate: Date |null,
    finishDate: Date | null,
}

export interface BorrowResponse {
    content: Borrow[];
    totalElements: number;
}