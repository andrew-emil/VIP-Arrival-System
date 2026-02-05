import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
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
      console.error(
        JSON.stringify({
          level: 'error',
          requestId,
          error: exception instanceof Error ? exception.message : exception,
          stack:
            exception instanceof Error
              ? exception.stack
              : undefined,
        }),
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
