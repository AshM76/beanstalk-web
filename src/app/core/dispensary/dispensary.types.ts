import { DispensaryAccount } from "../account/account.types"

export interface Dispensary {
    dispensary_id: string,
    dispensary_email: string
    dispensary_license: string,
    dispensary_name: string,
    dispensary_description: string,
    dispensary_logo?: string,
    dispensary_available: boolean,
    dispensary_stores: Store[],
    dispensary_accounts: DispensaryAccount[]
};

export interface Store {
    store_id: string,
    store_name: string,
    store_description?: string,
    store_email?: string,
    store_phone?: string,
    store_addressLine1: string,
    store_addressLine2?: string,
    store_city: string,
    store_state: string,
    store_zip: string,
    store_website?: string,
    store_facebook?: string,
    store_instagram?: string,
    store_twitter?: string,
    store_youtube?: string,
    store_main: 1 | 2, //1 -> Main Store, 2 -> Secondary Store
    store_available: boolean,
    store_photos: { photo_url: string }[],
    store_hours: StoreHour[]
};

export interface StoreHour {
    day: string,
    selected_day: boolean,
    opensAt: string,
    closesAt: string
}