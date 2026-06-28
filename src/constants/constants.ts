export enum EndPoints {
    LOGIN = 'auth/login',
    LOGOUT = 'auth/logout',
    REFRESH = 'auth/refresh',
    CATEGORY = 'category',
    MENU = 'foodmenu',
    UPLOAD = 'upload',
    ORDER = 'orders',
    DASHBOARD = 'dashboard',
    ORDER_STATUS = 'orders/update-status',
    PAYMENT_STATUS = 'orders/update-payment',
    USER_ACCOUNTS = 'useraccount',
    ACTIVATE_USER_ACCOUNT = 'useraccount/activate',
    CHANGE_PASSWORD = 'useraccount/change-password',
    CUSTOMERS = 'customer',
    RIDERS = 'rider',
    RESTAURANTS = 'restaurant/admin/all',
    RESTAURANT_PENDING = 'restaurant/admin/pending',
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
    USER_ACCOUNTS = 'userAccounts',
    ACTIVATE_USER_ACCOUNT = 'activate',
    DELETE_USER_ACCOUNT = 'activate',
    CHANGE_PASSWORD = 'reset-password',
    CUSTOMERS = 'customers',
    RIDERS = 'riders',
    RESTAURANTS = 'restaurants',
}

export type ROLE = 'PLATFORM_ADMIN' | 'RESTAURANT_ADMIN' | 'CUSTOMER' | 'RIDER' | 'SUPERADMIN' | 'ADMIN' | 'USER' | 'SALES'

export const CURRENCY = '£'
