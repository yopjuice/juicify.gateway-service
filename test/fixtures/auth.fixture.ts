import { AuthTokensResponse } from "@juice11-micro/contracts"
import { LoginDto } from "../../src/modules/auth/dto/login.dto.js"
import { LogoutDto } from "../../src/modules/auth/dto/logout.dto.js"
import { RefreshDto } from "../../src/modules/auth/dto/refresh.dto.js"
import { RegisterDto } from "../../src/modules/auth/dto/register.dto.js"

const dtoData = {
  name: 'test-name',
  password: 'test-password',
  email: 'test@email.com',
  accessToken: 'sdfjfaksdf;asdflsaj',
  refreshToken: 'sdfjfaksdf;asdflsaj',
}

export const AuthFixtures = {
  registerDto: (overrides?: Partial<RegisterDto>): RegisterDto => ({
    name: dtoData.name,
    email: dtoData.email,
    password: dtoData.password,
    ...overrides,
  }),

  loginDto: (overrides?: Partial<LoginDto>): LoginDto => ({
    email: dtoData.email,
    password: dtoData.password,
    ...overrides,
  }),

  refreshDto: (overrides?: Partial<RefreshDto>): RefreshDto => ({
    refreshToken: dtoData.refreshToken,
    ...overrides,
  }),

  logoutDto: (overrides?: Partial<LogoutDto>): LogoutDto => ({
    refreshToken: dtoData.refreshToken,
    ...overrides,
  }),

  authTokens: (overrides?: Partial<AuthTokensResponse>): AuthTokensResponse => ({
    accessToken: dtoData.accessToken,
    refreshToken: dtoData.refreshToken,
    ...overrides,
  })
}
