import type { CognitoUser } from "@/features/auth/types";

export type AuthContextValueType = {
    isAuthenticated: boolean;
    user: CognitoUser | null;
    loading: boolean;
    verificationRequired?: boolean;
    verificationEmail?: string;
};

export type AuthContextType = {
    auth: AuthContextValueType;
    setAuth: React.Dispatch<React.SetStateAction<AuthContextValueType>>;
};
