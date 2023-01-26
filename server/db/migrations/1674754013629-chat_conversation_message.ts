import { MigrationInterface, QueryRunner } from "typeorm";

export class chatConversationMessage1674754013629 implements MigrationInterface {
    name = 'chatConversationMessage1674754013629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "message" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "conversationId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "conversation" ("id" SERIAL NOT NULL, "last_update" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "active_conversation" ("id" SERIAL NOT NULL, "socketId" character varying NOT NULL, "userId" integer NOT NULL, "conversationId" integer NOT NULL, CONSTRAINT "PK_6f97b383c8aae028538526304ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "conversation_users_user" ("conversationId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_39cd0ac92f269976929656be1d7" PRIMARY KEY ("conversationId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7835ccf192c47ae47cd5c250d5" ON "conversation_users_user" ("conversationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b4d7dfd81d3b743bcfd1682abe" ON "conversation_users_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversation_users_user" ADD CONSTRAINT "FK_7835ccf192c47ae47cd5c250d5a" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "conversation_users_user" ADD CONSTRAINT "FK_b4d7dfd81d3b743bcfd1682abeb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation_users_user" DROP CONSTRAINT "FK_b4d7dfd81d3b743bcfd1682abeb"`);
        await queryRunner.query(`ALTER TABLE "conversation_users_user" DROP CONSTRAINT "FK_7835ccf192c47ae47cd5c250d5a"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b4d7dfd81d3b743bcfd1682abe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7835ccf192c47ae47cd5c250d5"`);
        await queryRunner.query(`DROP TABLE "conversation_users_user"`);
        await queryRunner.query(`DROP TABLE "active_conversation"`);
        await queryRunner.query(`DROP TABLE "conversation"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
