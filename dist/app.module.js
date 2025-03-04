"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const tasks_module_1 = require("./tasks/tasks.module");
const user_entity_1 = require("./users/user.entity");
const task_entity_1 = require("./tasks/task.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'admin'),
                    password: configService.get('DB_PASSWORD', 'admin123'),
                    database: configService.get('DB_NAME', 'admin_database'),
                    entities: [user_entity_1.User, task_entity_1.Task],
                    synchronize: configService.get('DB_SYNCHRONIZE', false),
                    migrations: ['dist/migrations/*.js'],
                    migrationsRun: true,
                    logging: true,
                }),
                inject: [config_1.ConfigService],
            }),
            users_module_1.UsersModule,
            tasks_module_1.TasksModule,
            auth_module_1.AuthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map