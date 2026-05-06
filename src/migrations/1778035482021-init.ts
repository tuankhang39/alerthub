import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778035482021 implements MigrationInterface {
    name = 'Init1778035482021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."alerts_severity_enum" AS ENUM('low', 'medium', 'high', 'critical')`);
        await queryRunner.query(`CREATE TABLE "alerts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "severity" "public"."alerts_severity_enum" NOT NULL DEFAULT 'low', "message" text NOT NULL, "deviceId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_60f895662df096bfcdfab7f4b96" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f206618be4e26b7c883e9899ba" ON "alerts" ("severity") `);
        await queryRunner.query(`CREATE INDEX "IDX_5d22320f28413682893a73ce9e" ON "alerts" ("deviceId", "createdAt") `);
        await queryRunner.query(`CREATE TYPE "public"."devices_status_enum" AS ENUM('active', 'inactive', 'error')`);
        await queryRunner.query(`CREATE TABLE "devices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "status" "public"."devices_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b1514758245c12daf43486dd1f0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_25a895dfc7796eab1da289796f" ON "devices" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_c37da3607f7214c3dda1803d09" ON "devices" ("status") `);
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "message" text NOT NULL, "deviceId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cead1ac4b9b029a88836fbac48" ON "events" ("deviceId", "type", "createdAt") `);
        await queryRunner.query(`ALTER TABLE "alerts" ADD CONSTRAINT "FK_2b3651f3fd95470304fabc1f02a" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_408f9385c497f3c4de8630c77d1" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_408f9385c497f3c4de8630c77d1"`);
        await queryRunner.query(`ALTER TABLE "alerts" DROP CONSTRAINT "FK_2b3651f3fd95470304fabc1f02a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cead1ac4b9b029a88836fbac48"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c37da3607f7214c3dda1803d09"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_25a895dfc7796eab1da289796f"`);
        await queryRunner.query(`DROP TABLE "devices"`);
        await queryRunner.query(`DROP TYPE "public"."devices_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5d22320f28413682893a73ce9e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f206618be4e26b7c883e9899ba"`);
        await queryRunner.query(`DROP TABLE "alerts"`);
        await queryRunner.query(`DROP TYPE "public"."alerts_severity_enum"`);
    }

}
