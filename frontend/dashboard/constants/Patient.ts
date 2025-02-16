import { ImageSourcePropType } from 'react-native';

export type PatientStatus = 'active' | 'inactive' | 'on-hold' | 'discharged' | 'archived';

export type WoundStatus = 'improving' | 'stable' | 'critical' | 'stagnant';

export type ExudateAmount = 'none' | 'light' | 'moderate' | 'heavy';
export type ExudateType = 'serous' | 'purulent' | 'sanguineous' | 'serosanguineous';

export type SmokingStatus = 'yes' | 'no' | 'former';

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface Insurance {
    provider: string;
    groupId: string;
    memberId: string;
}

export interface EmergencyContact {
    name: string;
    relationship: string;
    phoneNumber: string;
}

export interface PatientMetrics {
    daysSinceLastVisit: number;
    woundStatus: WoundStatus;
    patientSatisfaction: number;
}

export interface AssignedStaff {
    provider: string;
    bdRep: string;
    referringPhysician: string;
}

export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    status: PatientStatus;
    dateOfBirth: string;
    gender: string;
    contactNumber: string;
    alternateNumber?: string;
    email: string;
    address: Address;
    insurance: {
        primary: Insurance;
        secondary?: Insurance;
    };
    emergencyContact: EmergencyContact;
    metrics: PatientMetrics;
    assignedStaff: AssignedStaff;
    avatar?: ImageSourcePropType; // Added for React Native image support
}

export interface Dimensions {
    length: number;
    width: number;
    depth: number;
}

export interface UnderminingDetails {
    depth: number;
    direction: string;
}

export interface WoundCase {
    id: string;
    patientId: string;
    description: string;
    visitCount: number;
    isArchived: boolean;
    createdAt: string;
    allergies: string[];
    chronicConditions: string[];
    smokingStatus: SmokingStatus;
    medications: string[];
    supportSystem: string;
    psychosocialFactors: string;
    location: string;
    type: string;
    etiology: string;
    dimensions: Dimensions;
    hasUndermining: boolean;
    underminingDetails?: UnderminingDetails;
    images?: ImageSourcePropType[]; // Added for React Native image support
}

export interface LabResults {
    bloodGlucose?: number;
    wbc?: number;
    albumin?: number;
}

export interface WoundVisit {
    id: string;
    woundCaseId: string;
    visitNumber: number;
    date: string;
    providerId: string;
    dimensions: Dimensions;
    hasUndermining: boolean;
    underminingDetails?: UnderminingDetails;
    tissueType: string[];
    exudate: {
        amount: ExudateAmount;
        type: ExudateType;
    };
    periwoundCondition: string[];
    infectionSigns: string[];
    painLevel: number;
    painDescription?: string;
    images: string[];
    labResults?: LabResults;
    thumbnails?: ImageSourcePropType[]; // Added for React Native image thumbnails
}

export interface GraftingProduct {
    brand: string;
    type: string;
    barcodeData: string;
}

export interface Billing {
    cptCodes: string[];
    icd10Codes: string[];
    modifiers?: string[];
}

export interface Treatment {
    id: string;
    visitId: string;
    woundCaseId: string;
    date: string;
    providerId: string;
    dressingType: string;
    cleansingRegimen: string;
    therapies: string[];
    medications: string[];
    offloadingStrategies: string;
    graftingProduct?: GraftingProduct;
    billing: Billing;
    images?: ImageSourcePropType[]; // Added for React Native image support
}

// Added for React Native specific navigation
export type RootStackParamList = {
    Dashboard: undefined;
    PatientDetails: { id: string };
    Patients: undefined;
    WoundCase: { id: string };
    Treatment: { id: string };
    Visit: { id: string };
};