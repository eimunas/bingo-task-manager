import {
  INestApplication,
  ModuleMetadata,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App } from 'supertest/types';

export async function createTestServer(
  imports: ModuleMetadata['imports'] = undefined,
  controllers: ModuleMetadata['controllers'] = undefined,
  providers: ModuleMetadata['providers'] = undefined,
): Promise<INestApplication<App>> {
  const typeorm = TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    synchronize: true,
    entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
  });

  const defaultImports = [
    typeorm,
    await ConfigModule.forRoot({ isGlobal: true }),
  ];

  const module: TestingModule = await Test.createTestingModule({
    imports: imports ? [...imports, ...defaultImports] : defaultImports,
    controllers,
    providers,
  }).compile();

  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.init();

  return app;
}
