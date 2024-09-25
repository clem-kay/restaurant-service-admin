export enum EndPoints {
    CATEGORY = 'category',
    MENU = 'foodmenu',
    LOGIN = 'auth/login',
    UPLOAD = 'upload',
    ORDER = 'orders',
    DASHBOARD = 'dashboard',
    ORDER_STATUS = 'orders/update-status',
    PAYMENT_STATUS = 'orders/update-payment',
    USER_ACCOUNTS = "useraccount",
    ACTIVATE_USER_ACCOUNT = 'useraccount/activate',
    CHANGE_PASSWORD = 'useraccount/change-password'
}

export enum QueryKeys {
    CATEGORY = 'category',
    MENU = 'menu',
    LOGIN = 'login',
    REGISTER = 'register',
    UPLOAD = 'upload',
    ORDER = 'orders',
    DASHBOARD = 'dashboard',
    ORDER_STATUS = 'order-status',
    PAYMENT_STATUS = 'payment-status',
    USER_ACCOUNTS = "userAccounts",
    ACTIVATE_USER_ACCOUNT = 'activate',
    DELETE_USER_ACCOUNT = 'activate',
    CHANGE_PASSWORD = 'reset-password'
}



export type ROLE = "SUPERADMIN" | "ADMIN" | "USER" | "SALES"

export const CURRENCY = '£'