import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFullTextSearch1778059495135 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX idx_alert_message_search
      ON alerts
      USING gin(
        to_tsvector('english', message)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX idx_alert_message_search;
    `);
  }
}
