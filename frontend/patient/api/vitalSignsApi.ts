import API from '../httpService/apis';

export interface VitalSigns {
  id: string;
  patientId: string;
  recordedAt: string;
  recordedBy: string;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  respiratoryRate: number;
  temperature: number;
  oxygenSaturation: number;
  weight?: number;
  height?: number;
  bmi?: number;
  notes?: string;
}

const vitalSignsApi = {
  getVitalSigns: async (patientId: string): Promise<VitalSigns[]> => {
    try {
      // TODO: Replace with actual API call when backend is ready
      return [];
    } catch (error) {
      throw new Error('Failed to fetch vital signs');
    }
  },

  getLatestVitalSigns: async (patientId: string): Promise<VitalSigns | null> => {
    try {
      const vitals = await vitalSignsApi.getVitalSigns(patientId);
      return vitals.length > 0 ? vitals[0] : null;
    } catch (error) {
      throw new Error('Failed to fetch latest vital signs');
    }
  },

  recordVitalSigns: async (data: Omit<VitalSigns, 'id'>): Promise<VitalSigns> => {
    try {
      // TODO: Replace with actual API call when backend is ready
      return {
        id: Math.random().toString(),
        ...data
      };
    } catch (error) {
      throw new Error('Failed to record vital signs');
    }
  },

  updateVitalSigns: async (id: string, data: Partial<VitalSigns>): Promise<VitalSigns> => {
    try {
      // TODO: Replace with actual API call when backend is ready
      return {} as VitalSigns;
    } catch (error) {
      throw new Error('Failed to update vital signs');
    }
  },

  deleteVitalSigns: async (id: string): Promise<void> => {
    try {
      // TODO: Replace with actual API call when backend is ready
    } catch (error) {
      throw new Error('Failed to delete vital signs record');
    }
  }
};

export default vitalSignsApi;