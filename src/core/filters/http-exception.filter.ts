import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) { }
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();
    const request = ctx.getRequest<any>();

    const requestId = request.requestId;

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message = 'Internal server error';
    let details: any[] | undefined;

    /* -----------------------------
       Known HTTP exceptions
       ----------------------------- */
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();

      const res = exception.getResponse() as any;

      error =
        res?.error ||
        exception.name ||
        HttpStatus[statusCode];

      message =
        res?.message ||
        exception.message ||
        message;

      if (Array.isArray(res?.details)) {
        details = res.details;
      }
    }

    /* -----------------------------
       Server-side logging (500)
       ----------------------------- */
    if (statusCode === 500) {
      this.logger.error(
        {
          requestId,
          error: exception instanceof Error ? exception.message : exception,
          stack:
            exception instanceof Error
              ? exception.stack
              : undefined,
        },
        'Internal Server Error'
      );
    }

    /* -----------------------------
       Unified error response
       ----------------------------- */
    const payload: any = {
      statusCode,
      error,
      message,
      requestId,
    };

    if (details) {
      payload.details = details;
    }

    response.status(statusCode).json(payload);
  }
}
