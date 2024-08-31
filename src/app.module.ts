import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from "./tasks/tasks.module";
import { User } from "./users/user.entity";
import { Task } from "./tasks/task.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'admin'),
        password: configService.get('DB_PASSWORD', 'admin123'),
        database: configService.get('DB_NAME', 'admin_database'),
        entities: [User, Task],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
        migrations: ['dist/migrations/*.js'],
        migrationsRun: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}