import { NestFactory, Reflector } from '@nestjs/core';
import { setupSwagger } from './setup-swagger';
import { AppModule } from './app.module';
import {
  HttpStatus,
  Logger,
  ValidationError,
  ValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { LoggerService } from './shared/logger/logger.service';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { ApiTransformInterceptor } from './common/interceptors/api-transform.interceptor';
const SERVER_PORT = process.env.SERVER_PORT;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      bufferLogs: true,
    },
  );
  app.enableCors();
  app.useLogger(app.get(LoggerService));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(
          errors
            .filter((item) => !!item.constraints)
            .flatMap((item) => Object.values(item.constraints))
            .join('; '),
        );
      },
    }),
  );
  // execption
  app.useGlobalFilters(new ApiExceptionFilter(app.get(LoggerService)));
  // api interceptor
  app.useGlobalInterceptors(new ApiTransformInterceptor(new Reflector()));
  // swagger
  setupSwagger(app);
  await app.listen(SERVER_PORT, '0.0.0.0');
  const serverUrl = await app.getUrl();
  Logger.log(`api服务已经启动,请访问: ${serverUrl}`);
  Logger.log(`API文档已生成,请访问: ${serverUrl}/${process.env.SWAGGER_PATH}/`);
}
bootstrap();
