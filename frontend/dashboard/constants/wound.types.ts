import { BaseWoundMeasurements } from './shared.types';

export interface WoundBasicMeasurements extends BaseWoundMeasurements { }

export interface Wound {
    id: string;
    patient: string;
    location: string;
    type: 'pressure_ulcer' | 'diabetic_ulcer' | 'venous_ulcer' | 'arterial_ulcer' | 'surgical_wound' | 'traumatic_wound' | 'other';
    status: 'active' | 'healed' | 'worsening' | 'stable';
    identifiedDate: string;
    healedDate?: string;
    initialMeasurements?: WoundBasicMeasurements;
    etiology?: string;
    notes?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateWoundRequest {
    patient: string;
    location: string;
    type: Wound['type'];
    identifiedDate: string;
    initialMeasurements?: WoundBasicMeasurements;
    etiology?: string;
    notes?: string;
}

export interface UpdateWoundRequest extends Partial<CreateWoundRequest> { }