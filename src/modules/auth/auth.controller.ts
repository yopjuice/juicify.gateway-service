import { Body, Controller, OnModuleInit, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthGrpc } from './auth.client.js';
import type { GrpcToPromise } from '../../shared/types/index.js';
import { AuthServiceClient, AuthTokensResponse  } from '@juice11-micro/contracts';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { UnauthenticatedError } from '../../shared/errors/domain-errors.js';


@Controller('auth')
export class AuthController implements OnModuleInit {
  private client: GrpcToPromise<AuthServiceClient>

	constructor(
    private readonly wrapper: AuthGrpc,
	) {}

  onModuleInit() {
    this.client = this.wrapper.client;
  }

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<AuthTokensResponse> {

		const { accessToken, refreshToken} = await this.client.register(dto);
    return {accessToken, refreshToken}
  }

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<AuthTokensResponse> {

		const { accessToken, refreshToken} = await this.client.login(dto);
    return {accessToken, refreshToken};
  }

	@Post('refresh')
	async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthTokensResponse> {

		const token = req.cookies.refreshToken;
    if (!token) throw new UnauthenticatedError();

		const { accessToken, refreshToken} = await this.client.refreshTokens({ refreshToken: token });

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60 * 1000
		})

		return { accessToken, refreshToken };
	}

	@Post('logout')
	public logout(@Res({ passthrough: true }) res: Response) {
		res.cookie('refreshToken', '', {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			maxAge: 0
		});

		return { ok: true };
	}
}
