import API from '../httpService/apis';

export interface Note {
  id: string;
  patientId: string;
  authorId: string;
  authorName: string;
  content: string;
  category: 'clinical' | 'administrative' | 'follow-up' | 'other';
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

const noteApi = {
  getNotes: async (patientId: string): Promise<Note[]> => {
    try {
      // TODO: Replace with actual API call when backend is ready
      return [];
    } catch (error) {
      throw new Error('Failed to fetch notes');
    }
  },

  createNote: async (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
    try {
      // TODO: Replace with actual API call when backend is ready
      return {
        id: Math.random().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      };
    } catch (error) {
      throw new Error('Failed to create note');
    }
  },

  updateNote: async (id: string, data: Partial<Note>): Promise<Note> => {
    try {
      // TODO: Replace with actual API call when backend is ready
      return {} as Note;
    } catch (error) {
      throw new Error('Failed to update note');
    }
  },

  deleteNote: async (id: string): Promise<void> => {
    try {
      // TODO: Replace with actual API call when backend is ready
    } catch (error) {
      throw new Error('Failed to delete note');
    }
  }
};

export default noteApi;