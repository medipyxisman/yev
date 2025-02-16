import API from '../httpService/apis';

export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  date: string;
  time: string;
  duration: number;
  type: 'initial' | 'follow-up' | 'treatment' | 'assessment';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  location: string;
  notes?: string;
  woundCaseId?: string;
  graftingDetails?: {
    estSqcm: number;
    graftBrand: string;
  };
}

const appointmentApi = {
  getAppointments: async (patientId: string): Promise<Appointment[]> => {
    try {
      // TODO: Replace with actual API call when backend is ready
      return [];
    } catch (error) {
      throw new Error('Failed to fetch appointments');
    }
  },

  getAppointmentById: async (appointmentId: string): Promise<Appointment> => {
    try {
      // TODO: Replace with actual API call when backend is ready
      return {} as Appointment;
    } catch (error) {
      throw new Error('Failed to fetch appointment details');
    }
  },

  createAppointment: async (data: Omit<Appointment, 'id'>): Promise<Appointment> => {
    try {
      // TODO: Replace with actual API call when backend is ready
      return {
        id: Math.random().toString(),
        ...data
      };
    } catch (error) {
      throw new Error('Failed to create appointment');
    }
  },

  updateAppointment: async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
    try {
      // TODO: Replace with actual API call when backend is ready
      return {} as Appointment;
    } catch (error) {
      throw new Error('Failed to update appointment');
    }
  },

  cancelAppointment: async (id: string): Promise<void> => {
    try {
      // TODO: Replace with actual API call when backend is ready
    } catch (error) {
      throw new Error('Failed to cancel appointment');
    }
  },

  getProviderAvailability: async (providerId: string, date: string): Promise<string[]> => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // Mock available time slots
      return [
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '14:00',
        '14:30',
        '15:00',
        '15:30'
      ];
    } catch (error) {
      throw new Error('Failed to fetch provider availability');
    }
  }
};

export default appointmentApi;