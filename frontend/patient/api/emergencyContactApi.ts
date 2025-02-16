import API from '../httpService/apis';
import type { EmergencyContact } from '../constants';

const emergencyContactApi = {
  updateEmergencyContact: async (patientId: string, data: EmergencyContact): Promise<void> => {
    try {
      await API.updatePatient(patientId, { emergencyContact: data });
    } catch (error) {
      throw new Error('Failed to update emergency contact');
    }
  },

  removeEmergencyContact: async (patientId: string): Promise<void> => {
    try {
      await API.updatePatient(patientId, { emergencyContact: null });
    } catch (error) {
      throw new Error('Failed to remove emergency contact');
    }
  }
};

export default emergencyContactApi;