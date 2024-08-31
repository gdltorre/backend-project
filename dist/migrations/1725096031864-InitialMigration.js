"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1725096031864 = void 0;
class InitialMigration1725096031864 {
    constructor() {
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'InitialMigration1725096031864'
        });
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "status" character varying NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('TODO', 'IN_PROGRESS', 'DONE')`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'TODO'`);
    }
}
exports.InitialMigration1725096031864 = InitialMigration1725096031864;
//# sourceMappingURL=1725096031864-InitialMigration.js.map