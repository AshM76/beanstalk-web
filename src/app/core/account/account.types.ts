import { Store } from "../dispensary/dispensary.types";

export interface DispensaryAccount {
    dispensary_id: string,
    dispensary_account_id: string,
    dispensary_account_email: string,
    dispensary_account_password?: string,
    dispensary_account_fullname: string,
    dispensary_account_available: boolean,
    dispensary_account_store: Store
}
