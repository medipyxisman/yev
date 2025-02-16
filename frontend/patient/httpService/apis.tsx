import HttpClient from "./httpClient";
import type {
    LoginRequest,
    RegisterRequest,
    CreatePatientRequest,
    UpdatePatientRequest,
    CreateWoundRequest,
    UpdateWoundRequest,
    CreateVisitRequest,
    UpdateVisitRequest,
    AddVisitImagesRequest,
    ApiResponse,
    AuthResponse,
    Patient,
    Wound,
    Visit,
    ExecutiveDashboardMetrics,
    ProviderUtilization,
    ROITracking
} from '../constants';

const Client = HttpClient.shared();

const API = {
    // Auth APIs
    login: (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
        return Client.request('/auth/login', 'POST', data);
    },
    register: (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
        return Client.request('/auth/register', 'POST', data);
    },
    getProfile: (): Promise<ApiResponse<AuthResponse['user']>> => {
        return Client.request('/auth/me', 'GET');
    },

    // Patient APIs
    getAllPatients: (): Promise<ApiResponse<Patient[]>> => {
        return Client.request('/patients', 'GET');
    },
    getPatient: (id: string): Promise<ApiResponse<Patient>> => {
        return Client.request(`/patients/${id}`, 'GET');
    },
    createPatient: (data: CreatePatientRequest): Promise<ApiResponse<Patient>> => {
        return Client.request('/patients', 'POST', data);
    },
    updatePatient: (id: string, data: UpdatePatientRequest): Promise<ApiResponse<Patient>> => {
        return Client.request(`/patients/${id}`, 'PUT', data);
    },
    archivePatient: (id: string): Promise<ApiResponse<Patient>> => {
        return Client.request(`/patients/${id}/archive`, 'PATCH');
    },

    // Wound APIs
    getPatientWounds: (patientId: string): Promise<ApiResponse<Wound[]>> => {
        return Client.request(`/wounds/patient/${patientId}`, 'GET');
    },
    getWound: (id: string): Promise<ApiResponse<Wound>> => {
        return Client.request(`/wounds/${id}`, 'GET');
    },
    createWound: (data: CreateWoundRequest): Promise<ApiResponse<Wound>> => {
        return Client.request('/wounds', 'POST', data);
    },
    updateWound: (id: string, data: UpdateWoundRequest): Promise<ApiResponse<Wound>> => {
        return Client.request(`/wounds/${id}`, 'PUT', data);
    },
    healWound: (id: string): Promise<ApiResponse<Wound>> => {
        return Client.request(`/wounds/${id}/heal`, 'PATCH');
    },

    // Visit APIs
    getWoundVisits: (woundId: string): Promise<ApiResponse<Visit[]>> => {
        return Client.request(`/visits/wound/${woundId}`, 'GET');
    },
    getVisit: (id: string): Promise<ApiResponse<Visit>> => {
        return Client.request(`/visits/${id}`, 'GET');
    },
    createVisit: (data: CreateVisitRequest): Promise<ApiResponse<Visit>> => {
        return Client.request('/visits', 'POST', data);
    },
    updateVisit: (id: string, data: UpdateVisitRequest): Promise<ApiResponse<Visit>> => {
        return Client.request(`/visits/${id}`, 'PUT', data);
    },
    addVisitImages: (id: string, data: AddVisitImagesRequest): Promise<ApiResponse<Visit>> => {
        return Client.request(`/visits/${id}/images`, 'POST', data);
    },

    // Metrics APIs
    getExecutiveDashboardMetrics: (): Promise<ApiResponse<ExecutiveDashboardMetrics>> => {
        return Client.request('/metrics/executive-dashboard', 'GET');
    },
    getProviderUtilization: (): Promise<ApiResponse<ProviderUtilization[]>> => {
        return Client.request('/metrics/provider-utilization', 'GET');
    },
    getROITracking: (): Promise<ApiResponse<ROITracking[]>> => {
        return Client.request('/metrics/roi-tracking', 'GET');
    }
};

export default API;