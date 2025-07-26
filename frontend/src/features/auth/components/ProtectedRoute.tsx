import AuthContext from "@/components/shared/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { getUser, refreshTokens } from "@/features/auth/api";
import { toast } from "sonner";
import TokenService from "@/lib/token-service";

function ProtectedRoute(props: { children: ReactNode }) {
    const auth = useContext(AuthContext);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const refreshTokensMutation = useMutation({
        mutationFn: refreshTokens,
        onSuccess: (response) => {
            auth.setAuth({
                user: null,
                isAuthenticated: true
            });
            const tokenService = TokenService.getInstance();
            tokenService.setTokens(response.accessToken, response.refreshToken);
        },
        onError: () => {
            const tokenService = TokenService.getInstance();
            tokenService.deleteTokens();
            auth.setAuth({
                user: null,
                isAuthenticated: false
            });
            navigate("/login");
        }
    });

    useEffect(() => {
        const tokenService = TokenService.getInstance();
        const accessToken = tokenService.getAccessToken();

        if (accessToken && !auth.auth.user) {
            queryClient.fetchQuery({
                queryKey: ['cognito-user'],
                queryFn: () => getUser({ accessToken: accessToken }),
            })
            .then((user) => {
                auth.setAuth({
                    isAuthenticated: true,
                    user: user
                })
            })
            .catch(err => {
                toast.error("Error", {
                    description: err.message
                });
                refreshTokensMutation.mutate({ refreshToken: tokenService.getRefreshToken() });
            });

        } else if (!auth.auth.isAuthenticated) {
            navigate("/login"); 
        }

    }, [auth.auth.isAuthenticated])

    return props.children;
    
}

export default ProtectedRoute;
