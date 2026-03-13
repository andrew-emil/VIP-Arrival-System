export type CustomErrorResponse = {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
};