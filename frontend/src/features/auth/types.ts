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

export type RefreshTokenRequestData = {
    refreshToken: string;
}

export type RefreshTokenResponseData = {
    accessToken: string;
}
