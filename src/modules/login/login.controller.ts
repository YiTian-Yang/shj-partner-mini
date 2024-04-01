import { Controller, Post, Body, Get, Req, Headers } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto, LoginWithPhoneDto } from './login-dto';
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('')
  login(@Headers() headers, @Body() loginDto: LoginDto) {
    return this.loginService.login(headers.channel, loginDto);
  }

  @Post('loginWithPhone')
  loginWithPhone(@Body() loginWithPhoneDto: LoginWithPhoneDto) {
    return this.loginService.loginWithPhone(loginWithPhoneDto);
  }

  @Post('logOut')
  logOut(@Headers() Headers) {
    return this.loginService.logOut(Headers);
  }

  @Post('getWxTokenOnline')
  getWxTokenOnline() {
    return this.loginService.getWxTokenOnline();
  }
}
