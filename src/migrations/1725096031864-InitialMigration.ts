import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1725096031864 implements MigrationInterface {
    name = 'InitialMigration1725096031864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN IF EXISTS "status"`);
        const enumExists = await queryRunner.query(
            `SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tasks_status_enum')`
        );
        if (enumExists[0].exists) {
            await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
        }
        await queryRunner.query(`ALTER TABLE "tasks" ADD "status" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('TODO', 'IN_PROGRESS', 'DONE')`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'TODO'`);
    }

}
