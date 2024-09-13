export enum EndPoints {
    CATEGORY = 'category',
    MENU = 'foodmenu',
    LOGIN = 'auth/login',
    UPLOAD = 'upload',
    ORDER = 'orders',
    DASHBOARD = 'dashboard',
    ORDER_STATUS = 'orders/update-status',
    PAYMENT_STATUS = 'orders/update-payment',
    LOGOUT = 'auth/logout',
    REFRESH = 'auth/refresh',
    USERACCOUNT = "useraccount"
}

export type ROLE =  "SUPERADMIN" | "ADMIN" | "USER" | "SALES"

export const CURRENCY = '£'