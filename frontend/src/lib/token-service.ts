import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

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
    }

    isAccessTokenExpired(): boolean {
        const tokenExpirationTimestamp = jwtDecode(this.getAccessToken()).exp;

        if (tokenExpirationTimestamp) {
            return Date.now() > (tokenExpirationTimestamp * 1000)
        }

        return false;
    }

}
