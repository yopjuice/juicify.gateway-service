import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { status } from '@grpc/grpc-js';
import { DomainError } from '../../shared/errors/domain-errors.js';
import * as errors from '../../shared/errors/domain-errors.js';
import {
  IncomingGrpcError,
  IncomingHttpError,
} from '../../shared/errors/incoming-error.interface.js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorName = 'InternalServerError';

    const errorType = this.resolveErrorType(exception);

    switch (errorType) {
      case 'domain': {
        const domainErr = exception as DomainError;
        errorName = domainErr.constructor.name;
        message = domainErr.message;

        if (domainErr instanceof errors.EntityNotFoundError)
          httpStatus = HttpStatus.NOT_FOUND;
        else if (domainErr instanceof errors.EntityAlreadyExistsError)
          httpStatus = HttpStatus.CONFLICT;
        else if (domainErr instanceof errors.InvalidArgumentError)
          httpStatus = HttpStatus.BAD_REQUEST;
        else if (domainErr instanceof errors.UnauthenticatedError)
          httpStatus = HttpStatus.UNAUTHORIZED;
        else if (domainErr instanceof errors.PermissionDeniedError)
          httpStatus = HttpStatus.FORBIDDEN;
        break;
      }

      case 'grpc': {
        const grpcError = exception as IncomingGrpcError;
        message = grpcError.details || 'gRPC service error';

        const grpcToHttpMap: Record<number, { status: number; name: string }> = {
          [status.NOT_FOUND]: { status: HttpStatus.NOT_FOUND, name: 'NotFound' },
          [status.ALREADY_EXISTS]: { status: HttpStatus.CONFLICT, name: 'Conflict' },
          [status.INVALID_ARGUMENT]: { status: HttpStatus.BAD_REQUEST, name: 'BadRequest' },
          [status.UNAUTHENTICATED]: { status: HttpStatus.UNAUTHORIZED, name: 'Unauthorized' },
          [status.PERMISSION_DENIED]: { status: HttpStatus.FORBIDDEN, name: 'Forbidden' },
          [status.DEADLINE_EXCEEDED]: { status: HttpStatus.GATEWAY_TIMEOUT, name: 'GatewayTimeout' },
          [status.UNAVAILABLE]: { status: HttpStatus.SERVICE_UNAVAILABLE, name: 'ServiceUnavailable' },
        };

        const mapped = grpcToHttpMap[grpcError.code];
        if (mapped) {
          httpStatus = mapped.status;
          errorName = mapped.name;
        } else {
          httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
          errorName = `GrpcError(${grpcError.code})`;
        }
        break;
      }

      case 'http': {
        const httpError = exception as IncomingHttpError;
        httpStatus = (httpError as any).status || HttpStatus.INTERNAL_SERVER_ERROR;
        message = httpError.message;
        errorName = 'HttpError';
        break;
      }

      case 'system':
      default: {
        if (typeof exception.getStatus === 'function' && typeof exception.getResponse === 'function') {
          httpStatus = exception.getStatus();
          const res = exception.getResponse();
          message = typeof res === 'object' ? (res as any).message || exception.message : res;
          errorName = exception.constructor.name;
        } else if (exception instanceof Error) {
          this.logger.error('[Critical system error]:', exception);
          message = exception.message;
          errorName = exception.constructor.name;
        }
        break;
      }
    }

    response.status(httpStatus).json({
      statusCode: httpStatus,
      error: errorName,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }

  private resolveErrorType(
    exception: any,
  ): 'domain' | 'grpc' | 'http' | 'system' {
    if (!exception) return 'system';

    if (exception.type === 'domain' || exception instanceof DomainError) {
      return 'domain';
    }

    if (typeof exception.code === 'number' && ('details' in exception || 'message' in exception)) {
      return 'grpc';
    }

    if ('message' in exception && 'status' in exception) {
      return 'http';
    }

    return 'system';
  }
}
