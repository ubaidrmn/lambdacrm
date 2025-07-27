import TokenService from "@/lib/token-service";
import AppLoader from "../ui/loader";
import AuthContext from "./AuthContext";
import { useEffect, useState, type ReactNode } from "react";
import { getUserApi } from "@/features/auth/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AppAuthStateChangeEvent } from "@/lib/events";
import { useLocation, useNavigate } from "react-router";
import type { AuthContextValueType } from "@/types/core";

function AuthContextProvider(props: { children: ReactNode }) {
    const [auth, setAuth] = useState<AuthContextValueType>({ isAuthenticated: false, user: null, loading: false, verificationRequired: false });
    const protectedPaths = [
        "/dashboard", 
        "/leads", 
        "/contacts",
        "/settings",
    ]
    const authPaths = [
        "/login",
        "/signup",
        "/signup/confirm"
    ]
    const queryClient = useQueryClient();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const tokenService = TokenService.getInstance();

        document.addEventListener("authStateChange", (e: Event) => {
            const event = e as AppAuthStateChangeEvent;
            setAuth({ ...auth, isAuthenticated: event.detail.isAuthenticated })
        })

        // When the app gets loaded first time, check the tokens in cookies and fire the relevant events.

        if (tokenService.getAccessToken() && tokenService.getRefreshToken()) {
            setAuth({ ...auth, isAuthenticated: true })
        } else {
            setAuth({ ...auth, isAuthenticated: true })
        }
    }, [])

    useEffect(() => {
        console.log(auth)

        const tokenService = TokenService.getInstance();

        if (!auth.loading) {
            const accessToken =  tokenService.getAccessToken();

            if (!auth.user
                && auth.isAuthenticated
                && !auth.verificationRequired
                && accessToken
            ) {
                setAuth({ ...auth, loading: true });
                queryClient.fetchQuery({
                    queryKey: ['cognito-user'],
                    queryFn: () => getUserApi({ accessToken: accessToken }),
                })
                .then((user) => {
                    setAuth({
                        isAuthenticated: true,
                        user: user,
                        loading: false,
                        verificationRequired: !user.verified
                    })
                })
                .catch(err => {
                    setAuth({ ...auth, loading: false });
                    tokenService.deleteTokens();
                    toast.error("Error", {
                        description: err.message
                    });
                });
            }

            if (auth.isAuthenticated 
                && auth?.verificationRequired 
                && auth?.verificationEmail
            ) {
                // If user is logged in & verification is required, re-route to confirmation page.
                navigate("/signup/confirm");
                return;
            } else if (!auth.isAuthenticated
                && protectedPaths.includes(location.pathname)
            ) {
                // If user is logged out & is on a protected page, re-route to login page.
                navigate("/login");
                return;
            } else if (auth.isAuthenticated
                && authPaths.includes(location.pathname)
                && !auth.verificationRequired
            ) {
                // If user is logged in & verified & is on an auth page, re-route to dashboard.
                navigate("/dashboard")
            }
        }
    }, [auth])

    if (auth.loading) {
        return <AppLoader />;
    };

    return <AuthContext.Provider value={{ auth: auth, setAuth: setAuth }}>
        {props.children}
    </AuthContext.Provider>;
}

export default AuthContextProvider;
