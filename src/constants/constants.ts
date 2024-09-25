export enum EndPoints {
    CATEGORY = 'category',
    MENU = 'foodmenu',
    LOGIN = 'auth/login',
    UPLOAD = 'upload',
    ORDER = 'orders',
    DASHBOARD = 'dashboard',
    ORDER_STATUS = `${ORDER}/update-status`,
    PAYMENT_STATUS = `${ORDER}/update-payment`,
    USER_ACCOUNT = "useraccount",
    ACTIVATE_USER_ACCOUNT = `${USER_ACCOUNT}/activate`,
    CHANGE_PASSWORD = `${USER_ACCOUNT}/change-password`
}

export type ROLE = "SUPERADMIN" | "ADMIN" | "USER" | "SALES"

export const CURRENCY = '£'