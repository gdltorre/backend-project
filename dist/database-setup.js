"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function runMigrations() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    try {
        await dataSource.runMigrations();
        console.log('Migrations completed successfully');
    }
    catch (error) {
        console.error('Migration failed:', error);
    }
    finally {
        await app.close();
    }
}
runMigrations();
//# sourceMappingURL=database-setup.js.map