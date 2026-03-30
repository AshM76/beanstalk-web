export interface Deal {
    deal_id: string;
    deal_title: string;
    deal_description: string;
    deal_imageURL: string;
    deal_typeOfDeal: string;
    deal_amount: string;
    deal_offer: string;
    deal_typeOfProduct?: string;
    deal_brandOfProduct?: string;
    deal_rangeDeal: string;
    deal_startDate: Date;
    deal_endDate: Date;
    deal_url?: string;
    deal_publish_pushDate?: Date;
    deal_publish_timeZone?: string,
    deal_status: string;
    deal_dispensary_id: string;
    deal_dispensary_name: string;
    deal_stores_availables: {store_id: string}[];
}

export interface DealCreateResponse {
    error: boolean
    message: string
    data: {
        created: boolean
    }
}