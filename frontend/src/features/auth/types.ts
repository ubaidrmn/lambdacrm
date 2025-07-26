export type RegisterUserRequestData = {
    email: string;
    password: string;
    fullName: string;
};

export type ConfirmUserRequestData = {
    email: string;
    code: string;
};

export type LoginUserRequestData = {
    email: string;
    password: string;
};

export type LoginUserResponseData = {
    accessToken: string;
    refreshToken: string;
};

export type CognitoUser = {
    email: string;
    fullName: string;
    sub: string;
    verified: boolean;
    picture?: string;
};

export type GetUserRequestData = {
    accessToken: string;
}

export type RefreshTokensRequestData = {
    refreshToken: string;
}

export type RefreshTokensResponseData = {
    accessToken: string;
    refreshToken: string;
}
