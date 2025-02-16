import API from '../httpService/apis';
import type { CreateVisitRequest, UpdateVisitRequest, Visit, AddVisitImagesRequest } from '../constants';

const visitApi = {
  getVisits: async (woundId: string): Promise<Visit[]> => {
    try {
      const response = await API.getWoundVisits(woundId);
      return response.data || [];
    } catch (error) {
      throw new Error('Failed to fetch visits');
    }
  },

  getVisitDetails: async (visitId: string): Promise<Visit> => {
    try {
      const response = await API.getVisit(visitId);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch visit details');
    }
  },

  createVisit: async (data: CreateVisitRequest): Promise<Visit> => {
    try {
      const response = await API.createVisit(data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create visit');
    }
  },

  updateVisit: async (id: string, data: UpdateVisitRequest): Promise<Visit> => {
    try {
      const response = await API.updateVisit(id, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update visit');
    }
  },

  addImages: async (id: string, data: AddVisitImagesRequest): Promise<Visit> => {
    try {
      const response = await API.addVisitImages(id, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to add visit images');
    }
  }
};

export default visitApi;