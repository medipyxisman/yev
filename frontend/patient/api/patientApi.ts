import API from '../httpService/apis';
import type { CreatePatientRequest, UpdatePatientRequest, Patient } from '../constants';

const patientApi = {
  getPatients: async (): Promise<Patient[]> => {
    try {
      const response = await API.getAllPatients();
      return response.data || [];
    } catch (error) {
      throw new Error('Failed to fetch patients');
    }
  },

  getPatientDetails: async (id: string): Promise<Patient> => {
    try {
      const response = await API.getPatient(id);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch patient details');
    }
  },

  createPatient: async (data: CreatePatientRequest): Promise<Patient> => {
    try {
      const response = await API.createPatient(data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create patient');
    }
  },

  updatePatient: async (id: string, data: UpdatePatientRequest): Promise<Patient> => {
    try {
      const response = await API.updatePatient(id, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update patient');
    }
  },

  archivePatient: async (id: string): Promise<Patient> => {
    try {
      const response = await API.archivePatient(id);
      return response.data;
    } catch (error) {
      throw new Error('Failed to archive patient');
    }
  }
};

export default patientApi;