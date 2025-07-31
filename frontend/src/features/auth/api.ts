import { InitiateAuthCommand, CognitoIdentityProviderClient, AuthFlowType, SignUpCommand, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider"
import { apiClient } from "@/lib/api-client";
import type { ConfirmUserRequestData, LoginUserRequestData, LoginUserResponseData, RefreshTokenRequestData, RefreshTokenResponseData, RegisterUserRequestData } from "./types";
import type { User } from "@/types/user.model";

export async function loginUserApi(data: LoginUserRequestData): Promise<LoginUserResponseData> {
    const client = new CognitoIdentityProviderClient({ region: "us-east-2" });
    const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: import.meta.env.VITE_AWS_COGNITO_APP_CLIENT_ID,
        AuthParameters: {
            USERNAME: data.email,
            PASSWORD: data.password,
        },
    });
    const result = await client.send(command)
    
    if (result.AuthenticationResult?.AccessToken && result.AuthenticationResult.RefreshToken) {
        return {
            accessToken: result.AuthenticationResult.AccessToken,
            refreshToken: result.AuthenticationResult.RefreshToken
        }
    }

    throw Error("Something went wrong when logging in.")
}

export async function registerUserApi(data: RegisterUserRequestData): Promise<User> {
    const client = new CognitoIdentityProviderClient({ region: "us-east-2" });
    const command = new SignUpCommand({
        ClientId: import.meta.env.VITE_AWS_COGNITO_APP_CLIENT_ID,
        Username: data.email,
        Password: data.password,
        UserAttributes: [
            { Name: "name", Value: data.fullName }
        ]
    });
    const result = await client.send(command);

    if (result.UserSub) {
        const user: User = {
            id: `USER_${result.UserSub}`,
            email: data.email,
            verified: false,
            name: data.fullName,
        }

        return user;
    }

    throw Error("Something went wrong when creating you account.")
}

export async function confirmUserApi(data: ConfirmUserRequestData): Promise<void> {
    const client = new CognitoIdentityProviderClient({ region: "us-east-2" });
    const command = new ConfirmSignUpCommand({
        ClientId: import.meta.env.VITE_AWS_COGNITO_APP_CLIENT_ID,
        Username: data.email,
        ConfirmationCode: data.code,
    });
    await client.send(command);
}

export async function getUserApi(): Promise<User> {
    const response = await apiClient("/users/me", { method: "GET" });
    const user = await response.json();
    return user?.data as User;
}

export async function refreshTokenApi(data: RefreshTokenRequestData): Promise<RefreshTokenResponseData> {
    const client = new CognitoIdentityProviderClient({ region: "us-east-2" });
    const command = new InitiateAuthCommand({
        ClientId: import.meta.env.VITE_AWS_COGNITO_APP_CLIENT_ID,
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
            REFRESH_TOKEN: data.refreshToken
        }
    })
    const response = await client.send(command);

    if (response.AuthenticationResult?.AccessToken) {
        return {
            accessToken: response.AuthenticationResult.AccessToken
        }
    }

    throw new Error("Something went wrong when refreshing tokens.");
}
