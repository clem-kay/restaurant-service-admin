export enum EndPoints {
    LOGIN = 'auth/login',
    LOGOUT = 'auth/logout',
    REFRESH = 'auth/refresh',
    CATEGORY = 'category',
    CATEGORY_MINE = 'category/mine',
    MENU = 'foodmenu',
    MENU_MINE = 'foodmenu/mine',
    UPLOAD = 'upload',
    ORDER = 'orders',
    ORDER_MINE = 'orders/mine',
    DASHBOARD = 'dashboard',
    ORDER_STATUS = 'orders/update-status',
    PAYMENT_STATUS = 'orders/update-payment',
    USER_ACCOUNTS = 'useraccount',
    ACTIVATE_USER_ACCOUNT = 'useraccount/activate',
    CHANGE_PASSWORD = 'useraccount/change-password',
    CUSTOMERS = 'customer',
    CUSTOMERS_MINE = 'customer/mine',
    RIDERS = 'rider',
    RESTAURANTS = 'restaurant/admin/all',
    RESTAURANT_PENDING = 'restaurant/admin/pending',
    NOTIFICATIONS = 'notifications',
    RESTAURANT_CREATE = 'restaurant/admin/create',
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
    DELETE_USER_ACCOUNT = 'deactivate',
    CHANGE_PASSWORD = 'reset-password',
    CUSTOMERS = 'customers',
    RIDERS = 'riders',
    RESTAURANTS = 'restaurants',
}

export type ROLE = 'PLATFORM_ADMIN' | 'RESTAURANT_ADMIN' | 'RESTAURANT_STAFF' | 'CUSTOMER' | 'RIDER' | 'SUPERADMIN' | 'ADMIN' | 'USER' | 'SALES'

export const CURRENCY = '£'
