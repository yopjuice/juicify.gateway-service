import { AuthServiceClient } from "@juice11-micro/contracts";
import { createClientMock } from "../../src/shared/utils/client.mock.js";

export const authGrpcMock = createClientMock<AuthServiceClient>([
    'register',
    'login',
    'refreshTokens',
    'logout',
    'getMyInfo',
]);
