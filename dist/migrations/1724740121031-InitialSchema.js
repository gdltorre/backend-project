"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1724740121031 = void 0;
class InitialSchema1724740121031 {
    async up(queryRunner) {
        const usersTableExists = await queryRunner.hasTable("users");
        if (!usersTableExists) {
            await queryRunner.query(`
                CREATE TABLE "users" (
                    "id" SERIAL PRIMARY KEY,
                    "username" VARCHAR NOT NULL UNIQUE,
                    "password" VARCHAR NOT NULL,
                    "name" VARCHAR NOT NULL,
                    "email" VARCHAR NOT NULL
                )
            `);
        }
        const tasksTableExists = await queryRunner.hasTable("tasks");
        if (!tasksTableExists) {
            await queryRunner.query(`
                CREATE TABLE "tasks" (
                    "id" SERIAL PRIMARY KEY,
                    "title" VARCHAR NOT NULL,
                    "description" VARCHAR,
                    "status" VARCHAR NOT NULL,
                    "userId" INTEGER,
                    FOREIGN KEY ("userId") REFERENCES "users" ("id")
                )
            `);
        }
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "tasks"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    }
}
exports.InitialSchema1724740121031 = InitialSchema1724740121031;
//# sourceMappingURL=1724740121031-InitialSchema.js.map