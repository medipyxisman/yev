import API from '../httpService/apis';
import type { MedicalHistory } from '../constants';

const medicalHistoryApi = {
  updateMedicalHistory: async (patientId: string, data: MedicalHistory): Promise<void> => {
    try {
      await API.updatePatient(patientId, { medicalHistory: data });
    } catch (error) {
      throw new Error('Failed to update medical history');
    }
  },

  addCondition: async (patientId: string, condition: string): Promise<void> => {
    try {
      const patient = await API.getPatient(patientId);
      const conditions = [...(patient.data.medicalHistory?.conditions || []), condition];
      await API.updatePatient(patientId, {
        medicalHistory: {
          ...patient.data.medicalHistory,
          conditions
        }
      });
    } catch (error) {
      throw new Error('Failed to add condition');
    }
  },

  removeCondition: async (patientId: string, condition: string): Promise<void> => {
    try {
      const patient = await API.getPatient(patientId);
      const conditions = patient.data.medicalHistory?.conditions.filter(c => c !== condition) || [];
      await API.updatePatient(patientId, {
        medicalHistory: {
          ...patient.data.medicalHistory,
          conditions
        }
      });
    } catch (error) {
      throw new Error('Failed to remove condition');
    }
  },

  addAllergy: async (patientId: string, allergy: string): Promise<void> => {
    try {
      const patient = await API.getPatient(patientId);
      const allergies = [...(patient.data.medicalHistory?.allergies || []), allergy];
      await API.updatePatient(patientId, {
        medicalHistory: {
          ...patient.data.medicalHistory,
          allergies
        }
      });
    } catch (error) {
      throw new Error('Failed to add allergy');
    }
  },

  removeAllergy: async (patientId: string, allergy: string): Promise<void> => {
    try {
      const patient = await API.getPatient(patientId);
      const allergies = patient.data.medicalHistory?.allergies.filter(a => a !== allergy) || [];
      await API.updatePatient(patientId, {
        medicalHistory: {
          ...patient.data.medicalHistory,
          allergies
        }
      });
    } catch (error) {
      throw new Error('Failed to remove allergy');
    }
  },

  addMedication: async (patientId: string, medication: string): Promise<void> => {
    try {
      const patient = await API.getPatient(patientId);
      const medications = [...(patient.data.medicalHistory?.medications || []), medication];
      await API.updatePatient(patientId, {
        medicalHistory: {
          ...patient.data.medicalHistory,
          medications
        }
      });
    } catch (error) {
      throw new Error('Failed to add medication');
    }
  },

  removeMedication: async (patientId: string, medication: string): Promise<void> => {
    try {
      const patient = await API.getPatient(patientId);
      const medications = patient.data.medicalHistory?.medications.filter(m => m !== medication) || [];
      await API.updatePatient(patientId, {
        medicalHistory: {
          ...patient.data.medicalHistory,
          medications
        }
      });
    } catch (error) {
      throw new Error('Failed to remove medication');
    }
  }
};

export default medicalHistoryApi;