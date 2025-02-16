import { BaseWoundMeasurements } from './shared.types';

export interface VisitWoundMeasurements extends BaseWoundMeasurements {
    undermining?: {
        present: boolean;
        location?: string;
        depth?: number;
    };
    tunneling?: {
        present: boolean;
        location?: string;
        depth?: number;
    };
}

export interface Assessment {
    tissueType?: Record<string, number>;
    exudate?: {
        amount: 'none' | 'light' | 'moderate' | 'heavy';
        type: 'serous' | 'sanguineous' | 'serosanguineous' | 'purulent';
    };
    periwoundSkin?: {
        macerated: boolean;
        erythema: boolean;
        indurated: boolean;
        intact: boolean;
    };
    pain?: {
        level: number;
        characteristics?: string;
    };
}

export interface Treatment {
    cleansing?: string;
    debridement?: {
        performed: boolean;
        method?: string;
        notes?: string;
    };
    dressing?: {
        primary?: string;
        secondary?: string;
        frequency?: string;
    };
    medications?: Array<{
        name: string;
        dosage: string;
        route: string;
    }>;
}

export interface VisitImage {
    url: string;
    type: 'overview' | 'closeup' | 'measurement';
    uploadedAt: string;
}

export interface Visit {
    id: string;
    wound: string;
    provider: string;
    date: string;
    measurements: VisitWoundMeasurements;
    assessment: Assessment;
    treatment: Treatment;
    images?: VisitImage[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateVisitRequest {
    wound: string;
    date: string;
    measurements: VisitWoundMeasurements;
    assessment: Assessment;
    treatment: Treatment;
    notes?: string;
}

export interface UpdateVisitRequest extends Partial<CreateVisitRequest> { }

export interface AddVisitImagesRequest {
    url: string;
    type: 'overview' | 'closeup' | 'measurement';
}