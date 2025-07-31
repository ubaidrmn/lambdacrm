import type { User } from "./user.model";

export type AuthContextValueType = {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    verificationRequired?: boolean;
    verificationEmail?: string;
};

export type AuthContextType = {
    auth: AuthContextValueType;
    setAuth: React.Dispatch<React.SetStateAction<AuthContextValueType>>;
};
