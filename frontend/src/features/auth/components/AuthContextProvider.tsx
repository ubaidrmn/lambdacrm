import TokenService from "@/lib/token-service";
import AppLoader from "@/components/ui/loader";
import AuthContext from "../context";
import { useEffect, useState, type ReactNode } from "react";
import { getUserApi } from "@/features/auth/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AppAuthStateChangeEvent } from "@/lib/events";
import { useLocation, useNavigate } from "react-router";
import type { AuthContextValueType } from "@/features/auth/types";

function AuthContextProvider(props: { children: ReactNode }) {
    const [auth, setAuth] = useState<AuthContextValueType>({ isAuthenticated: true, user: null, verificationRequired: false });
    const authPaths = [
        "/login",
        "/signup",
        "/signup/confirm"
    ]
    const queryClient = useQueryClient();
    const location = useLocation();
    const navigate = useNavigate();

    const isProtectedPageActive = (path: string) => {
        let active = false;
        const protectedPathPatterns = ["/app/*"];
        protectedPathPatterns.forEach(protectedPathPattern => {
            if (path.match(protectedPathPattern)) {
                active = true;
                return;
            }
        });
        return active;
    }

    useEffect(() => {
        const tokenService = TokenService.getInstance();

        document.addEventListener("authStateChange", (e: Event) => {
            const event = e as AppAuthStateChangeEvent;
            setAuth({ ...auth, isAuthenticated: event.detail.isAuthenticated })
        })

        // When the app gets loaded first time, check the tokens in cookies and fire the relevant events.

        if (!tokenService.getAccessToken() || !tokenService.getRefreshToken()) {
            setAuth({ ...auth, isAuthenticated: false })
        } else {
            setAuth({ ...auth, isAuthenticated: true })
        }
    }, [])

    useEffect(() => {
        console.log(auth);

        const tokenService = TokenService.getInstance();

        if (!auth.user
            && auth.isAuthenticated
            && !auth.verificationRequired
        ) {
            // If user is authenticated but user data is not fetched, fetch the user data.
            queryClient.fetchQuery({
                queryKey: ['get-user'],
                queryFn: () => getUserApi(),
            })
            .then((user) => {
                setAuth({
                    isAuthenticated: true,
                    user: user,
                    verificationRequired: !user.verified
                })
            })
            .catch(err => {
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
            && isProtectedPageActive(location.pathname)
        ) {
            // If user is logged out & is on a protected page, re-route to login page.
            navigate("/login");
            return;
        } else if (auth.isAuthenticated
            && authPaths.includes(location.pathname)
            && !auth.verificationRequired
        ) {
            // If user is logged in & verified & is on an auth page, re-route to dashboard.
            navigate("/app/organizations")
        }
    }, [auth, location.pathname])

    return <AuthContext.Provider value={{ auth: auth, setAuth: setAuth }}>
        {props.children}
    </AuthContext.Provider>;
}

export default AuthContextProvider;
