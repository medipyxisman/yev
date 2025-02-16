import API from '../httpService/apis';
import type { Insurance } from '../constants';

const insuranceApi = {
  updateInsurance: async (patientId: string, data: { primary: Insurance; secondary?: Insurance }): Promise<void> => {
    try {
      await API.updatePatient(patientId, { insurance: data });
    } catch (error) {
      throw new Error('Failed to update insurance information');
    }
  },

  addInsurance: async (patientId: string, insurance: Insurance): Promise<void> => {
    try {
      const patient = await API.getPatient(patientId);
      const currentInsurance = patient.data.insurance || {};
      
      if (!currentInsurance.primary) {
        await API.updatePatient(patientId, {
          insurance: { primary: insurance }
        });
      } else if (!currentInsurance.secondary) {
        await API.updatePatient(patientId, {
          insurance: { ...currentInsurance, secondary: insurance }
        });
      } else {
        throw new Error('Patient already has both primary and secondary insurance');
      }
    } catch (error) {
      throw new Error('Failed to add insurance');
    }
  },

  removeSecondaryInsurance: async (patientId: string): Promise<void> => {
    try {
      const patient = await API.getPatient(patientId);
      const { primary } = patient.data.insurance || {};
      
      await API.updatePatient(patientId, {
        insurance: { primary }
      });
    } catch (error) {
      throw new Error('Failed to remove secondary insurance');
    }
  },

  updatePrimaryInsurance: async (patientId: string, insurance: Insurance): Promise<void> => {
    try {
      const patient = await API.getPatient(patientId);
      const { secondary } = patient.data.insurance || {};
      
      await API.updatePatient(patientId, {
        insurance: { primary: insurance, secondary }
      });
    } catch (error) {
      throw new Error('Failed to update primary insurance');
    }
  },

  updateSecondaryInsurance: async (patientId: string, insurance: Insurance): Promise<void> => {
    try {
      const patient = await API.getPatient(patientId);
      const { primary } = patient.data.insurance || {};
      
      if (!primary) {
        throw new Error('Patient must have primary insurance first');
      }
      
      await API.updatePatient(patientId, {
        insurance: { primary, secondary: insurance }
      });
    } catch (error) {
      throw new Error('Failed to update secondary insurance');
    }
  }
};

export default insuranceApi;