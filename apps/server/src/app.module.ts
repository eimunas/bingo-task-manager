import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabasesModule } from './databases/databases.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabasesModule,
    UsersModule,
  ],
})
export class AppModule {}
