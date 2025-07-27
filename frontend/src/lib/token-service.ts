import Cookies from "universal-cookie";
import { refreshTokenApi } from "@/features/auth/api";
import { AppAuthStateChangeEvent } from "./events";

export default class TokenService {
    private static instance: TokenService;
    private cookies = new Cookies();

    public static getInstance(): TokenService {
        if (!TokenService.instance) {
            TokenService.instance = new TokenService();
        }

        return TokenService.instance;
    }

    setTokens(accessToken: string, refreshToken: string): void {
        this.cookies.set("access-token", accessToken, { path: "/" });
        this.cookies.set("refresh-token", refreshToken, { path: "/" });
 
        // Fire an event notifying that the user has been logged in.
        document.dispatchEvent(new AppAuthStateChangeEvent({ isAuthenticated: true }));
    }

    getAccessToken(): string {
        return this.cookies.get("access-token");
    }

    getRefreshToken(): string {
        return this.cookies.get("refresh-token");
    }

    deleteTokens(): void {
        this.cookies.remove("access-token");
        this.cookies.remove("refresh-token");

        // Fire an event notifying that the user has been logged out.
        document.dispatchEvent(new AppAuthStateChangeEvent({ isAuthenticated: false }));
    }

    async refreshTokens(): Promise<void> {
        const refreshToken = this.getRefreshToken();

        try {
            const result = await refreshTokenApi({ refreshToken: refreshToken });
            this.setTokens(result.accessToken, refreshToken);
        } catch (err) {
            this.deleteTokens();
        }
    }

}
