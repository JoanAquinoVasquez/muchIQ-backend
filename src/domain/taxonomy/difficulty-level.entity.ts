export class DifficultyLevel {
    id: string;
    name: string;
    description?: string | null;
    color?: string | null;
    order: number;

    constructor(partial: Partial<DifficultyLevel>) {
        Object.assign(this, partial);
    }
}
