// Pharmacy Service Types

export interface PharmacyService {
    id: string;
    name: string;
    description: string;
    icon: string; // Material Symbols icon name
    isFree?: boolean;
}
