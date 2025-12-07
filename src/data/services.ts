import { PharmacyService } from '../types/service';

export const PHARMACY_SERVICES: PharmacyService[] = [
    {
        id: 'bp-screening',
        name: 'Free Blood Pressure Screening',
        description: 'Get your blood pressure checked at no cost. Quick, accurate readings by trained staff.',
        icon: 'monitor_heart',
        isFree: true,
    },
    {
        id: 'medication-counseling',
        name: 'Free Medication Counseling',
        description: 'One-on-one sessions with our pharmacists to discuss your medications and health concerns.',
        icon: 'medication',
        isFree: true,
    },
    {
        id: 'supplements',
        name: 'Nutritional Supplements & Vitamins',
        description: 'Wide range of quality vitamins and supplements for your health and wellness needs.',
        icon: 'nutrition',
        isFree: false,
    },
    {
        id: 'skincare',
        name: 'Skin Care Consultations',
        description: 'Expert advice on skincare products and routines tailored to your skin type.',
        icon: 'face_retouching_natural',
        isFree: false,
    },
    {
        id: 'prescription-refills',
        name: 'Prescription Refills',
        description: 'Quick and easy prescription refills. Upload your prescription online or visit us in-store.',
        icon: 'clinical_notes',
        isFree: false,
    },
    {
        id: 'immunizations',
        name: 'Immunizations',
        description: 'Stay protected with our vaccination services including flu shots and travel vaccines.',
        icon: 'vaccines',
        isFree: false,
    },
    {
        id: 'health-screening',
        name: 'Health Screening',
        description: 'Comprehensive health checks including glucose, cholesterol, and BMI assessments.',
        icon: 'health_and_safety',
        isFree: false,
    },
    {
        id: 'local-delivery',
        name: 'Local Delivery Services',
        description: 'Get your medications delivered to your doorstep within Lekki and surrounding areas.',
        icon: 'local_shipping',
        isFree: false,
    },
];
