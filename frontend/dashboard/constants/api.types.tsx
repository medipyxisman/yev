export interface ApiResponse<T> {
    data?: T;
    error?: {
        message: string;
        errors?: Array<{
            msg: string;
            param: string;
            location: string;
        }>;
    };
}