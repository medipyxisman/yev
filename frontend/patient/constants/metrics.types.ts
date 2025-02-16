export interface ExecutiveDashboardMetrics {
    id: string;
    metricDate: string;
    metricType: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'YTD';
    referralsByBd: Record<string, number>;
    activitiesByBd: Record<string, {
        meetings: number;
        calls: number;
        emails: number;
    }>;
    medicareTraditionalCount: number;
    otherInsuranceCount: number;
    totalGraftingVisits: number;
    totalSqcmGrafted: number;
    patientsGraftedCount: number;
    patientsNotReadyCount: number;
    patientsNotEligibleCount: number;
    graftedEncountersByProvider: Record<string, number>;
    providerUtilization: Record<string, number>;
    createdAt: string;
    updatedAt: string;
}

export interface ProviderUtilization {
    id: string;
    providerId: string;
    date: string;
    visitsCompleted: number;
    utilizationPercentage: number;
    createdAt: string;
    updatedAt: string;
}

export interface ROITracking {
    id: string;
    companyId: string;
    locationId?: string;
    referringProviderId?: string;
    dateRangeStart: string;
    dateRangeEnd: string;
    totalSqcmApplied: number;
    revenueMultiplier: number;
    totalRevenueEstimated: number;
    totalBdExpenses: number;
    netRoi: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}