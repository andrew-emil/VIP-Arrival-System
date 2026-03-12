export type ErrorResponse = {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
};