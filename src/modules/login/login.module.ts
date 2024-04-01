import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { PlatformService } from './platform/platform.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import ShjPlatformUser from 'src/entities/partner/user/shj-platform-user.entity';
import ShjMiniProgramList from 'src/entities/partner/user/shj-mini-program-list.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShjPlatformUser, ShjMiniProgramList], 'partner'),
  ],
  controllers: [LoginController],
  providers: [LoginService, PlatformService],
})
export class LoginModule {}
