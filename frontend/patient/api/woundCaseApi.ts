import API from '../httpService/apis';
import type { CreateWoundRequest, UpdateWoundRequest, Wound } from '../constants';

export interface WoundCase extends Wound {
  visitCount: number;
}

const woundCaseApi = {
  getWoundCases: async (patientId: string): Promise<WoundCase[]> => {
    try {
      const response = await API.getPatientWounds(patientId);
      return response.data || [];
    } catch (error) {
      throw new Error('Failed to fetch wound cases');
    }
  },

  createWoundCase: async (data: CreateWoundRequest): Promise<WoundCase> => {
    try {
      const response = await API.createWound(data);
      return response.data as WoundCase;
    } catch (error) {
      throw new Error('Failed to create wound case');
    }
  },

  updateWoundCase: async (id: string, data: UpdateWoundRequest): Promise<WoundCase> => {
    try {
      const response = await API.updateWound(id, data);
      return response.data as WoundCase;
    } catch (error) {
      throw new Error('Failed to update wound case');
    }
  },

  archiveWoundCase: async (id: string): Promise<void> => {
    try {
      await API.healWound(id);
    } catch (error) {
      throw new Error('Failed to archive wound case');
    }
  }
};

export default woundCaseApi;