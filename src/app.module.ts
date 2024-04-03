import { Module } from '@nestjs/common';
import { LoggerModule } from './shared/logger/logger.module';
import { TypeORMLoggerService } from './shared/logger/typeorm-logger.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerAddressModule } from './modules/customer-address/customer-address.module';
import {
  ConfigurationKeyPaths,
  getConfiguration,
} from './config/configuration';
// import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  LoggerModuleOptions,
  WinstonLogLevel,
} from './shared/logger/logger.interface';

import { LOGGER_MODULE_OPTIONS } from './shared/logger/logger.constants';
import { LoginModule } from './modules/login/login.module';
import { SharedModule } from './shared/shared.module';
import { EvaluateModule } from './modules/evaluate/evaluate.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RecordModule } from './modules/record/record.module';
import { PartnerModule } from './modules/partner/partner.module';
import { PartnerGuard } from './guards/partner.guard';
import { APP_GUARD } from '@nestjs/core';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, LoggerModule],
      name: 'base',
      useFactory: (
        configService: ConfigService<ConfigurationKeyPaths>,
        loggerOptions: LoggerModuleOptions,
      ) => ({
        autoLoadEntities: true,
        type: configService.get<any>('database.type'),
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get('database.logging'),
        timezone: configService.get('database.timezone'), // 时区
        // 自定义日志
        logger: new TypeORMLoggerService(
          configService.get('database.logging'),
          loggerOptions,
        ),
      }),
      inject: [ConfigService, LOGGER_MODULE_OPTIONS],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, LoggerModule],
      name: 'partner',
      useFactory: (
        configService: ConfigService<ConfigurationKeyPaths>,
        loggerOptions: LoggerModuleOptions,
      ) => ({
        autoLoadEntities: true,
        type: configService.get<any>('databasePartner.type'),
        host: configService.get<string>('databasePartner.host'),
        port: configService.get<number>('databasePartner.port'),
        username: configService.get<string>('databasePartner.username'),
        password: configService.get<string>('databasePartner.password'),
        database: configService.get<string>('databasePartner.database'),
        synchronize: configService.get<boolean>('databasePartner.synchronize'),
        logging: configService.get('databasePartner.logging'),
        timezone: configService.get('databasePartner.timezone'), // 时区
        // 自定义日志
        logger: new TypeORMLoggerService(
          configService.get('databasePartner.logging'),
          loggerOptions,
        ),
      }),
      inject: [ConfigService, LOGGER_MODULE_OPTIONS],
    }),
    // BullModule.forRoot({}),
    // custom logger
    LoggerModule.forRootAsync(
      {
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          return {
            level: configService.get<WinstonLogLevel>('logger.level'),
            consoleLevel: configService.get<WinstonLogLevel>(
              'logger.consoleLevel',
            ),
            timestamp: configService.get<boolean>('logger.timestamp'),
            maxFiles: configService.get<string>('logger.maxFiles'),
            maxFileSize: configService.get<string>('logger.maxFileSize'),
            disableConsoleAtProd: configService.get<boolean>(
              'logger.disableConsoleAtProd',
            ),
            dir: configService.get<string>('logger.dir'),
            errorLogName: configService.get<string>('logger.errorLogName'),
            appLogName: configService.get<string>('logger.appLogName'),
          };
        },
        inject: [ConfigService],
      },
      // global module
      true,
    ),
    LoginModule,
    SharedModule,
    CustomerAddressModule,
    EvaluateModule,
    OrdersModule,
    PartnerModule,
    // 定时任务配置
    ScheduleModule.forRoot(),
    RecordModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PartnerGuard,
    },
  ],
})
export class AppModule {}
