export interface AuthLoginModel {
    access_token?: string
}

export interface AuthLoginDTO {
    login: string,
    password: string
}

export interface AuthRegisterDTO {
    username: string,
    email: string,
    password?: string,
    confirmPassword?: string
    is_admin?: boolean
}