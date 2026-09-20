import { vi, type Mock } from 'vitest';

export type MockedClient<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? Mock<T[K]> : T[K];
};

export type MockedGrpcProvider<T> = {
  onModuleInit: Mock<() => void>;
  client: MockedClient<T>;
};

export const createClientMock = <T>(methods: Array<keyof T>): MockedGrpcProvider<T> => {
  const clientMock = {} as any;

  methods.forEach((method) => {
    clientMock[method] = vi.fn();
  });

  return {
    onModuleInit: vi.fn(),
    client: clientMock,
  };
};
