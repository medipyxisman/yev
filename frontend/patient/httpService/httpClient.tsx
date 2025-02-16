import axios from 'axios';
import type { ApiResponse } from '../constants';

const SERVER_URL = process.env.MONGODB_URI || "http://localhost:5000/";

class HttpClient {
    private static instance: HttpClient;
    private token: string | null = null;

    private constructor() { }

    public static shared(): HttpClient {
        if (!HttpClient.instance) {
            HttpClient.instance = new HttpClient();
        }
        return HttpClient.instance;
    }

    public setToken(token: string) {
        this.token = token;
    }

    public async request<T>(url: string, method: string, data?: any): Promise<ApiResponse<T>> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        url = SERVER_URL + url;

        try {
            const response = await axios({
                method,
                url,
                data: method === 'POST' || method === 'PUT' || method === 'PATCH' ? data : undefined,
                params: method === 'GET' ? data : undefined,
                headers
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw error.response.data;
            }
            throw error;
        }
    }
}

export default HttpClient;