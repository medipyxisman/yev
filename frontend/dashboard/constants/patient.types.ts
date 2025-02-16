export interface Insurance {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    primary: boolean;
}

export interface EmergencyContact {
    name: string;
    relationship: string;
    phone: string;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface MedicalHistory {
    conditions: string[];
    allergies: string[];
    medications: string[];
}

export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    phone?: string;
    email?: string;
    address?: Address;
    insurance?: Insurance[];
    emergencyContact?: EmergencyContact;
    medicalHistory?: MedicalHistory;
    status: 'active' | 'inactive' | 'archived';
    assignedProvider?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePatientRequest {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    phone?: string;
    email?: string;
    address?: Address;
    insurance?: Insurance[];
    emergencyContact?: EmergencyContact;
    medicalHistory?: MedicalHistory;
    assignedProvider?: string;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> { }