import { Body, Controller, Post } from '@nestjs/common';
import { AuthPayloadDto } from './dtos/auth-payload.dto';
import { AuthService } from './auth.service';
import { TokenResponseDto } from './dtos/token-response.dto';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('tokens')
  @ApiOperation({ summary: 'Create a JWT access token' })
  @ApiCreatedResponse({ type: TokenResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  async login(@Body() body: AuthPayloadDto): Promise<TokenResponseDto> {
    return await this.authService.login(body);
  }
}
