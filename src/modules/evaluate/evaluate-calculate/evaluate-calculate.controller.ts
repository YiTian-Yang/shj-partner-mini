import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { EvaluateCalculateService } from './evaluate-calculate.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuestionDto } from './evaluate-calculate.dto';
import { AuthGuard } from '../../../guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
@ApiTags('计算估价模块')
@UseGuards(AuthGuard)
@Controller('evaluate-calculate')
export class EvaluateCalculateController {
  constructor(
    private readonly evaluateGoodService: EvaluateCalculateService,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: '计算回收价' })
  @Post('calculatePrice')
  async calculatePrice(@Headers() headers, @Body() dto: QuestionDto) {
    const user = this.jwtService.verify(headers['token']).uid;
    const recoveryPrice = await this.evaluateGoodService.calculatePrice(
      dto,
      user,
    );
    return {
      recoveryPrice: parseInt(String(recoveryPrice)),
    };
  }
}
