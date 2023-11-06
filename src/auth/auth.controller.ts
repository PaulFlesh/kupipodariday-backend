import { Controller, UseGuards, Post, Request, Body } from '@nestjs/common';
import { LocalAuthGuard } from './strategies/local/local-auth.guard';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async login(@Request() req): Promise<Record<'access_token', string>> {
    return this.authService.login(req.user);
  }

  @Post('/signup')
  async register(@Body() reqBody) {
    return this.authService.register(reqBody);
  }
}
