import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEventToAlert1778037074161 implements MigrationInterface {
    name = 'AddEventToAlert1778037074161'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alerts" ADD "eventId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alerts" DROP COLUMN "eventId"`);
    }

}
