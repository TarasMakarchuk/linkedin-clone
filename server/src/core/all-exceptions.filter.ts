import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomHttpExceptionResponse, HttpExceptionResponse } from './models/http-exception-response.interface';
import * as fs from 'fs';

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

        const errorResponse = this.getErrorResponse(status, errorMessage, request, exception);
        const errorLog: string = this.getErrorLog(errorResponse, request, exception);
        this.writeErrorLogTpFile(errorLog);
        response.status(status).json(errorResponse);
    };

    private getErrorResponse = (
        status: HttpStatus,
        errorMessage: string,
        request: Request,
        exception: any,
    ): CustomHttpExceptionResponse => {
        const errorDetails = exception.getResponse().message instanceof Array
            ?
            exception.getResponse().message.map(message => message)
            :
            exception.getResponse().message;
        return {
            statusCode: status,
            error: errorMessage,
            errorDetails,
            path: request.url,
            method: request.method,
            timeStamp: new Date(),
        };
    };

    private getErrorLog = (
        errorResponse: CustomHttpExceptionResponse,
        request: Request,
        exception: unknown
    ): string => {
        const { statusCode, error } = errorResponse;
        const { method, url } = request;
        const showingException = exception instanceof HttpException ? exception.stack : error;
        return `
            Response code: ${statusCode} - Method: ${method} - URL: ${url}\n 
            ${JSON.stringify(errorResponse)}\n
            User: ${JSON.stringify(request.user ?? 'Not signed in')}\n
            ${showingException}\n
        `;
    };

    private writeErrorLogTpFile = (errorLog: string): void => {
        fs.appendFile('error.log', errorLog, 'utf8', (error) => {
                if (error) throw error;
            }
        );
    };
}
