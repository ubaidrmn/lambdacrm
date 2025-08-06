import React from "react"
import { type AuthContextType } from "@/features/auth/types"

const AuthContext = React.createContext<AuthContextType>({ 
    auth: { 
        isAuthenticated: false, 
        user: null,
    }, 
    setAuth: () => {} });

export default AuthContext;
