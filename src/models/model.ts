export interface Transaction {
    id: string;
    payerUserId: string;
    description: string;
    amount: number;
    date: Date | string;
    isArchived: boolean
    participants?: Participant[];
}

export interface PostTransactionData {
    payerUserId: string;
    description: string;
    amount: number;
    date: Date | string;
    isArchived: boolean
    participants?: Participant[];
}

export interface Participant {
    userId: string;
    share: number;
}

export interface userAndTransactions {
    user: UserDetails
    transactions: Transaction[],
    archivedTransactions: Transaction[],
}

export interface UserDetails {
    profilePicture: string | undefined,
    email: string | undefined,
}

export interface GetTransactionData {
    _id: string;
    payerUserId: string;
    description: string;
    amount: number;
    date: Date | string;
    isArchived: boolean,
    payerProfilePicture: string,
    canEdit: boolean,
    participants?: GetParticipantData[];
}

export interface GetParticipantData {
    userId: string;
    share: number;
    profilePicture: string
}