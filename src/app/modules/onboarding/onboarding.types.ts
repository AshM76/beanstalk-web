export interface Credentials { 
    dispensary_email: string, 
    dispensary_password: string 
}

export interface Information {
    license_number: string,
    dispensary_name: string,
    dispensary_description: string,
    dispensary_logo?: string,
};

export interface Store {
    store_dispensary_id: string,
    store_dispensary_name: string,
    store_name: string,
    store_description: string,
    store_phone: string,
    store_email: string,
    store_addressLine1: string,
    store_addressLine2: string,
    store_city: string,
    store_state: string,
    store_zip: string,
    store_main: 1 | 2,
    store_available: boolean,
    store_hours: StoreHour[],
};

export interface SocialMedia {
    website?: string,
    facebook?: string,
    instagram?: string,
    twitter?: string,
    youtube?: string,
};

export interface StoreHour {
    day: string,
    selected_day: boolean,
    opensAt: string,
    closesAt: string
}
