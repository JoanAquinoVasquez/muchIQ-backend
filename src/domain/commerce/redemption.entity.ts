export class Redemption {
    id: string;
    userId: string;
    rewardId: string;
    code: string;
    claimed: boolean;
    claimedAt?: Date | null;
    locationClaimedId?: string | null;
    createdAt: Date;

    constructor(partial: Partial<Redemption>) {
        Object.assign(this, partial);
    }
}
