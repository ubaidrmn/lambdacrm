import { InitiateAuthCommand, CognitoIdentityProviderClient, AuthFlowType, SignUpCommand, ConfirmSignUpCommand, GetUserCommand, GetTokensFromRefreshTokenCommand } from "@aws-sdk/client-cognito-identity-provider"
import type { CognitoUser, ConfirmUserRequestData, GetUserRequestData, LoginUserRequestData, LoginUserResponseData, RefreshTokensRequestData, RefreshTokensResponseData, RegisterUserRequestData } from "./types";

export async function loginUser(data: LoginUserRequestData): Promise<LoginUserResponseData> {
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

export async function registerUser(data: RegisterUserRequestData): Promise<CognitoUser> {
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
        return {
            sub: result.UserSub,
            email: data.email,
            verified: false,
            fullName: data.fullName,
        }
    }

    throw Error("Something went wrong when creating you account.")
}

export async function confirmUser(data: ConfirmUserRequestData): Promise<void> {
    const client = new CognitoIdentityProviderClient({ region: "us-east-2" });
    const command = new ConfirmSignUpCommand({
        ClientId: import.meta.env.VITE_AWS_COGNITO_APP_CLIENT_ID,
        Username: data.email,
        ConfirmationCode: data.code,
    });
    await client.send(command);
}

export async function getUser(data: GetUserRequestData): Promise<CognitoUser> {
    const client = new CognitoIdentityProviderClient({ region: "us-east-2" });
    const command = new GetUserCommand({
        AccessToken: data.accessToken
    });
    const response = await client.send(command);

    return {
        email: "rehmanubaid2003@gmail.com",
        fullName: "Ubaid Ur Rehman",
        sub: "12345678",
        verified: true,
    }
}

export async function refreshTokens(data: RefreshTokensRequestData): Promise<RefreshTokensResponseData> {
    console.log("THIS RAN")
    const client = new CognitoIdentityProviderClient({ region: "us-east-2" });
    const command = new GetTokensFromRefreshTokenCommand({
        ClientId: import.meta.env.VITE_AWS_COGNITO_APP_CLIENT_ID,
        RefreshToken: data.refreshToken
    })
    const response = await client.send(command);

    if (response.AuthenticationResult?.AccessToken && response.AuthenticationResult.RefreshToken) {
        return {
            refreshToken: response.AuthenticationResult.RefreshToken,
            accessToken: response.AuthenticationResult.AccessToken
        }
    }

    throw Error("Something went wrong when refreshing tokens.");
}
