import { Logger } from "@nestjs/common";

const defaultLogger = new Logger('AppLogger');

export function logInfo(payload: Record<string, any>, logger: any = defaultLogger) {
    logger.log(payload);
}
