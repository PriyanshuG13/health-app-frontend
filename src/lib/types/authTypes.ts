export interface User {
    id: string;
    email: string;
    name: string;
    hasDrchrono: boolean;
}

export interface SessionData {
    user: User | null;
    isAuthenticated: boolean;
}
