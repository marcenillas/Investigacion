import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1738252097569 implements MigrationInterface {
    name = 'InitialMigration1738252097569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."event_type_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "event" ("eventId" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" text NOT NULL, "description" text, "data" text, "stamp" TIMESTAMP WITH TIME ZONE NOT NULL, "type" "public"."event_type_enum" NOT NULL DEFAULT '0', "terminalId" uuid NOT NULL, "createdBy" text NOT NULL DEFAULT 'system', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" text NOT NULL DEFAULT 'system', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4ee8fd974a5681971c4eb5bb585" PRIMARY KEY ("eventId"))`);
        await queryRunner.query(`CREATE TYPE "public"."transactionLog_step_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15')`);
        await queryRunner.query(`CREATE TABLE "transactionLog" ("transactionLogId" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text, "data" text, "step" "public"."transactionLog_step_enum" NOT NULL DEFAULT '0', "stamp" TIMESTAMP WITH TIME ZONE NOT NULL, "transactionId" uuid NOT NULL, "operatorEmail" text, "operatorLogId" uuid, "createdBy" text NOT NULL DEFAULT 'system', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" text NOT NULL DEFAULT 'system', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_df1e02a470cc7fb9135b77abcc7" PRIMARY KEY ("transactionLogId"))`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_status_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`CREATE TABLE "transaction" ("transactionId" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text, "paymentMethod" text, "amount" numeric, "taxPercentage" numeric, "tax" numeric, "feeBorneClientCharge" boolean NOT NULL DEFAULT '0', "mpFee" numeric, "mpTax" numeric, "total" numeric, "mptotal" numeric, "mpCode" numeric, "orderRequestData" text, "orderResponseData" text, "merchantOrderData" text, "paymentData" text, "cashData" text, "copies" integer, "stamp" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."transaction_status_enum" NOT NULL DEFAULT '0', "terminalId" uuid NOT NULL, "createdBy" text NOT NULL DEFAULT 'system', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" text NOT NULL DEFAULT 'system', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bdcf2c929b61c0935576652d9b0" PRIMARY KEY ("transactionId"))`);
        await queryRunner.query(`CREATE TYPE "public"."terminal_status_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "terminal" ("terminalId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text, "enabled" boolean NOT NULL, "modeQR" boolean NOT NULL, "modeFixed" boolean NOT NULL, "status" "public"."terminal_status_enum" NOT NULL DEFAULT '0', "print" boolean NOT NULL, "printTicket" boolean NOT NULL, "printerTicketName" text, "printerVoucherCom" text, "carrouselImage01" text, "carrouselImage02" text, "carrouselImage03" text, "carrouselImage04" text, "carrouselImage05" text, "definedValues" text, "storeId" text, "posId" text, "lastConnection" TIMESTAMP, "lastTransaction" TIMESTAMP, "lastEvent" TIMESTAMP, "createdBy" text NOT NULL DEFAULT 'system', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" text NOT NULL DEFAULT 'system', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "carrouselImageData01" bytea, "carrouselImageData02" bytea, "carrouselImageData03" bytea, "carrouselImageData04" bytea, "carrouselImageData05" bytea, "code" text, "useCash" boolean NOT NULL DEFAULT '1', CONSTRAINT "UQ_da1ab6a7756f985b57468b35fbb" UNIQUE ("name"), CONSTRAINT "PK_04fcef6bdd64ee5c8e2accd8415" PRIMARY KEY ("terminalId"))`);
        await queryRunner.query(`CREATE TYPE "public"."operatorLog_operatoraction_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9')`);
        await queryRunner.query(`CREATE TABLE "operatorLog" ("operatorLogId" uuid NOT NULL DEFAULT uuid_generate_v4(), "operatorEmail" text NOT NULL, "terminalId" uuid NOT NULL, "operatorAction" "public"."operatorLog_operatoraction_enum" NOT NULL, "description" text, "data" text, "stamp" TIMESTAMP WITH TIME ZONE NOT NULL, "createdBy" text NOT NULL DEFAULT 'system', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" text NOT NULL DEFAULT 'system', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1cf61efbf6deb648b9a2cc65897" PRIMARY KEY ("operatorLogId"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_roles_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "users" ("userId" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" text NOT NULL, "password" text NOT NULL, "fullName" text NOT NULL, "enabled" boolean NOT NULL, "roles" "public"."users_roles_enum" array NOT NULL, "createdBy" text NOT NULL DEFAULT 'system', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" text NOT NULL DEFAULT 'system', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TABLE "configuration" ("configurationId" uuid NOT NULL DEFAULT uuid_generate_v4(), "mpAuthorizationToken" text, "mpUserId" text, "mpNotificationURL" text, "taxPercentage" numeric, "createdBy" text NOT NULL DEFAULT 'system', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" text NOT NULL DEFAULT 'system', "logoMPImage" text, "logoCompanyImage" text, "logoBranchImage" text, "logoMPImageData" bytea, "logoCompanyImageData" bytea, "logoBranchImageData" bytea, "VoucherTitle" text, "VoucherLine1" text, "VoucherLine2" text, "VoucherLine3" text, "currencySymbol" text, "feeBorneClientCharge" boolean NOT NULL DEFAULT '0', "branchName" text, "branchAddress" text, "takeBranchNameConfiguration" boolean NOT NULL DEFAULT '0', "printCancelTransaction" boolean NOT NULL DEFAULT '0', "mpExpirateTransaction" integer NOT NULL DEFAULT '20', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c3ca2cbbf0e38b9325fb356b82b" PRIMARY KEY ("configurationId"))`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_128120d9fd6c994c186265be4f9" FOREIGN KEY ("terminalId") REFERENCES "terminal"("terminalId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactionLog" ADD CONSTRAINT "FK_1550f0cb5904e8b062859eccf3f" FOREIGN KEY ("transactionId") REFERENCES "transaction"("transactionId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_71bf4f5ef5281da71e23ede3be3" FOREIGN KEY ("terminalId") REFERENCES "terminal"("terminalId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operatorLog" ADD CONSTRAINT "FK_7c31c2b4fdb595ec0c60650ec2b" FOREIGN KEY ("terminalId") REFERENCES "terminal"("terminalId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operatorLog" DROP CONSTRAINT "FK_7c31c2b4fdb595ec0c60650ec2b"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_71bf4f5ef5281da71e23ede3be3"`);
        await queryRunner.query(`ALTER TABLE "transactionLog" DROP CONSTRAINT "FK_1550f0cb5904e8b062859eccf3f"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_128120d9fd6c994c186265be4f9"`);
        await queryRunner.query(`DROP TABLE "configuration"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
        await queryRunner.query(`DROP TABLE "operatorLog"`);
        await queryRunner.query(`DROP TYPE "public"."operatorLog_operatoraction_enum"`);
        await queryRunner.query(`DROP TABLE "terminal"`);
        await queryRunner.query(`DROP TYPE "public"."terminal_status_enum"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_status_enum"`);
        await queryRunner.query(`DROP TABLE "transactionLog"`);
        await queryRunner.query(`DROP TYPE "public"."transactionLog_step_enum"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TYPE "public"."event_type_enum"`);
    }

}
