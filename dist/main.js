"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeorm_1 = require("typeorm");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    try {
        const connection = (0, typeorm_1.getConnection)();
        await connection.synchronize(true);
        console.log('Database synchronized successfully');
    }
    catch (error) {
        console.error('Failed to synchronize database:', error);
    }
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map