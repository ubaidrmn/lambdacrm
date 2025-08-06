import TokenService from "@/lib/token-service";
import { AppAuthStateChangeEvent } from "./events";

type ApiClientOptions = { 
    method: 'POST' | 'GET' | 'PUT' | 'DELETE';
    body?: Record<string, any>
}

export async function apiClient(path: string, options: ApiClientOptions) {
    const tokenService = TokenService.getInstance();
    const accessToken = tokenService.getAccessToken();

    if (!accessToken) {
        document.dispatchEvent(new AppAuthStateChangeEvent({
            isAuthenticated: false
        }))
        throw Error("User is not logged in!")
    }

    const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

    const runFetch = async (accessToken: string) => {
        const _options: any = {
            method: options.method,
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        }

        if (options.method === "POST" && options.body) {
            _options["body"] = JSON.stringify(options.body);
        }

        const _response = await fetch(`${BASE_URL}${path}`, _options);
        return _response;
    }

    const response = await runFetch(accessToken);

    if (response.ok) {
        return response;
    }

    if (response.status === 401 || response.status === 403) {
        // Try again after refreshing access token.

        await tokenService.refreshTokens();
        const response = await runFetch(tokenService.getAccessToken());
        return response;
    }

    throw Error("An error occured!");

}
