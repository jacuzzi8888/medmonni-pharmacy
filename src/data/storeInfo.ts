import { StoreInfo } from '../types/store';

export const STORE_INFO: StoreInfo = {
    name: 'Medomni Pharmacy',
    address: {
        street: '1 Niyi Okunubi Street',
        area: 'Lekki Phase 1',
        city: 'Lagos',
        country: 'Nigeria',
        fullAddress: '1 Niyi Okunubi Street, Lekki Phase 1, Lagos, Nigeria',
    },
    hours: [
        { day: 'Monday', open: '8:00 AM', close: '9:00 PM' },
        { day: 'Tuesday', open: '8:00 AM', close: '9:00 PM' },
        { day: 'Wednesday', open: '8:00 AM', close: '9:00 PM' },
        { day: 'Thursday', open: '8:00 AM', close: '9:00 PM' },
        { day: 'Friday', open: '8:00 AM', close: '9:00 PM' },
        { day: 'Saturday', open: '8:00 AM', close: '9:00 PM' },
        { day: 'Sunday', open: '8:00 AM', close: '9:00 PM' },
    ],
    contact: {
        phone: '07052350000',
        email: 'medomnipharmacy@gmail.com',
        whatsapp: '2347052350000',
    },
};
