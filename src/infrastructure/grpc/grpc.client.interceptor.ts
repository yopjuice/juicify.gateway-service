import { InterceptingCall } from '@grpc/grpc-js';
import { TraceContextStorage } from '../logger/logger.storage.js';

export const grpcClientInterceptor = (options: any, nextCall: any) => {

  const TIMEOUT_MS = 3000;
  const deadline = new Date(Date.now() + TIMEOUT_MS);

  const newOptions = {
    ...options,
    deadline: options.deadline ?? deadline,
  };

  return new InterceptingCall(nextCall(newOptions), {
    start: (metadata, listener, next) => {
      const correlationId = TraceContextStorage.getCorrelationId();
      if (correlationId) {
        // Inject correlation id into our request metadata
        metadata.set('x-correlation-id', correlationId);
      }
      next(metadata, listener);
    },
  });
};
