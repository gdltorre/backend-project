import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1724740121031 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if users table exists
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

        // Check if tasks table exists
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

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "tasks"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    }
}