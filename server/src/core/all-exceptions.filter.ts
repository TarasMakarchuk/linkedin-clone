import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomHttpExceptionResponse, HttpExceptionResponse } from './models/http-exception-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();

        let status: HttpStatus;
        let errorMessage: string;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const errorResponse = exception.getResponse();
            errorMessage = (errorResponse as HttpExceptionResponse).error || exception.message;
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            errorMessage = 'Critical server error occurred';
        }

        const errorResponse = this.getErrorResponse(status, errorMessage, request);
        this.logError(errorResponse, request, exception);
    };

    private getErrorResponse = (
        status: HttpStatus,
        errorMessage: string,
        request: Request,
    ): CustomHttpExceptionResponse => ({
        statusCode: status,
        error: errorMessage,
        path: request.url,
        method: request.method,
        timeStamp: new Date(),
    });

    private logError = (
        errorResponse: CustomHttpExceptionResponse,
        request: Request,
        exception: unknown
    ): void => {
        const { statusCode, error } = errorResponse;
        const { method, url } = request;
        const showingException = exception instanceof HttpException ? exception.stack : error;
        const errorLog = `
            Response code: ${statusCode} - Method: ${method} - URL: ${url}\n\n 
            ${JSON.stringify(errorResponse)}\n\n
            User: ${JSON.stringify(request.user ?? 'Not signed in')}\n\n 
            ${showingException}\n\n
        `;
        console.log(errorLog);
    };
}
