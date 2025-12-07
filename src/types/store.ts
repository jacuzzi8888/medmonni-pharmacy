// Store Information Types

export interface StoreHours {
    day: string;
    open: string;
    close: string;
}

export interface ContactInfo {
    phone: string;
    email: string;
    whatsapp: string;
}

export interface StoreAddress {
    street: string;
    area: string;
    city: string;
    country: string;
    fullAddress: string;
}

export interface StoreInfo {
    name: string;
    address: StoreAddress;
    hours: StoreHours[];
    contact: ContactInfo;
}
