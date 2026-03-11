import Joi from "joi";
import { registerAs } from "@nestjs/config";

export const apiKeySchema = Joi.object({
    API_KEY: Joi.string().required(),
})

export default registerAs('apiKey', () => ({
    apiKey: process.env.API_KEY,
}));