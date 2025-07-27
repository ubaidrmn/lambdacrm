import { InitiateAuthCommand, CognitoIdentityProviderClient, AuthFlowType, SignUpCommand, ConfirmSignUpCommand, GetUserCommand, NotAuthorizedException } from "@aws-sdk/client-cognito-identity-provider"
import type { CognitoUser, ConfirmUserRequestData, GetUserRequestData, LoginUserRequestData, LoginUserResponseData, RefreshTokenRequestData, RefreshTokenResponseData, RegisterUserRequestData } from "./types";
import TokenService from "@/lib/token-service";

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

export async function registerUserApi(data: RegisterUserRequestData): Promise<CognitoUser> {
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
        const user: CognitoUser = {
            sub: result.UserSub,
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

export async function getUserApi(data: GetUserRequestData): Promise<CognitoUser> {
    let response;

    const client = new CognitoIdentityProviderClient({ region: "us-east-2" });

    try {
        const command = new GetUserCommand({
            AccessToken: data.accessToken
        });
        response = await client.send(command);
    } catch (err) {
        if (err instanceof NotAuthorizedException) {
            const tokenService = TokenService.getInstance();
            await tokenService.refreshTokens();
            const command = new GetUserCommand({
                AccessToken: tokenService.getAccessToken()
            });
            response = await client.send(command);
        } else {
            throw new Error("Something went wrong..")
        }
    };

    const attributes = Object.fromEntries(
        (response.UserAttributes || []).map(attr => [attr.Name, attr.Value])
    );

    const user: CognitoUser = {
        email: attributes.email,
        name: attributes.name,
        sub: attributes.sub,
        verified: Boolean(attributes.email_verified),
        picture: attributes.picture
    }

    return user;
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
