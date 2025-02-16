import API from '../httpService/apis';

export interface Document {
  id: string;
  patientId: string;
  name: string;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  category: 'medical' | 'insurance' | 'consent' | 'other';
  tags?: string[];
}

const documentApi = {
  getDocuments: async (patientId: string): Promise<Document[]> => {
    try {
      // TODO: Replace with actual API call when backend is ready
      return [];
    } catch (error) {
      throw new Error('Failed to fetch documents');
    }
  },

  uploadDocument: async (patientId: string, file: File, metadata: Partial<Document>): Promise<Document> => {
    try {
      // TODO: Replace with actual API call when backend is ready
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));
      
      // Mock response
      return {
        id: Math.random().toString(),
        patientId,
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadedBy: 'Current User',
        uploadedAt: new Date().toISOString(),
        category: metadata.category || 'other',
        tags: metadata.tags
      };
    } catch (error) {
      throw new Error('Failed to upload document');
    }
  },

  deleteDocument: async (documentId: string): Promise<void> => {
    try {
      // TODO: Replace with actual API call when backend is ready
    } catch (error) {
      throw new Error('Failed to delete document');
    }
  },

  updateDocument: async (documentId: string, updates: Partial<Document>): Promise<Document> => {
    try {
      // TODO: Replace with actual API call when backend is ready
      return {} as Document;
    } catch (error) {
      throw new Error('Failed to update document');
    }
  }
};

export default documentApi;