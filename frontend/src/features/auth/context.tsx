import React from "react"
import { type AuthContextType } from "@/types/core"

const AuthContext = React.createContext<AuthContextType>({ 
    auth: { 
        isAuthenticated: false, 
        user: null,
        loading: false
    }, 
    setAuth: () => {} });

export default AuthContext;
