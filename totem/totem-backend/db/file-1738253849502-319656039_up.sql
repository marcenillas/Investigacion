
          BEGIN;
    
          CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
          -- Crear la tabla migrations si no existe
          DO $$
          BEGIN
              IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'migrations') THEN
                  CREATE TABLE migrations (
                      id SERIAL PRIMARY KEY,
                      timestamp BIGINT NOT NULL,
                      name VARCHAR(255) NOT NULL
                  );
              END IF;
          END $$;
    
          -- Verificar si la migración ya existe
          DO $$
          BEGIN
              IF NOT EXISTS (SELECT 1 FROM migrations WHERE name = 'InitialMigration1738252097569') THEN
                  -- Insertar la migración en la tabla
                  INSERT INTO migrations ("timestamp", "name") VALUES (1738252097569, 'InitialMigration1738252097569');                
                  CREATE TYPE "public"."event_type_enum" AS ENUM('0', '1', '2');
CREATE TABLE "event" ("eventId" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" text NOT NULL, "description" text, "data" text, "stamp" TIMESTAMP WITH TIME ZONE NOT NULL, "type" "public"."event_type_enum" NOT NULL DEFAULT '0', "terminalId" uuid NOT NULL, "createdBy" text NOT NULL DEFAULT 'system', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" text NOT NULL DEFAULT 'system', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4ee8fd974a5681971c4eb5bb585" PRIMARY KEY ("eventId"));
CREATE TYPE "public"."transactionLog_step_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15');
CREATE TABLE "transactionLog" ("transactionLogId" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text, "data" text, "step" "public"."transactionLog_step_enum" NOT NULL DEFAULT '0', "stamp" TIMESTAMP WITH TIME ZONE NOT NULL, "transactionId" uuid NOT NULL, "operatorEmail" text, "operatorLogId" uuid, "createdBy" text NOT NULL DEFAULT 'system', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" text NOT NULL DEFAULT 'system', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_df1e02a470cc7fb9135b77abcc7" PRIMARY KEY ("transactionLogId"));
CREATE TYPE "public"."transaction_status_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7');
CREATE TABLE "transaction" ("transactionId" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text, "paymentMethod" text, "amount" numeric, "taxPercentage" numeric, "tax" numeric, "feeBorneClientCharge" boolean NOT NULL DEFAULT '0', "mpFee" numeric, "mpTax" numeric, "total" numeric, "mptotal" numeric, "mpCode" numeric, "orderRequestData" text, "orderResponseData" text, "merchantOrderData" text, "paymentData" text, "cashierData" text, "copies" integer, "stamp" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."transaction_status_enum" NOT NULL DEFAULT '0', "terminalId" uuid NOT NULL, "createdBy" text NOT NULL DEFAULT 'system', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" text NOT NULL DEFAULT 'system', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bdcf2c929b61c0935576652d9b0" PRIMARY KEY ("transactionId"));
CREATE TYPE "public"."terminal_status_enum" AS ENUM('0', '1', '2', '3');
CREATE TABLE "terminal" ("terminalId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text, "enabled" boolean NOT NULL, "modeQR" boolean NOT NULL, "modeFixed" boolean NOT NULL, "status" "public"."terminal_status_enum" NOT NULL DEFAULT '0', "printTITO" boolean NOT NULL, "printTicket" boolean NOT NULL, "printerTicketName" text, "printerTITOCom" text, "carrouselImage01" text, "carrouselImage02" text, "carrouselImage03" text, "carrouselImage04" text, "carrouselImage05" text, "definedValues" text, "storeId" text, "posId" text, "lastConnection" TIMESTAMP, "lastTransaction" TIMESTAMP, "lastEvent" TIMESTAMP, "createdBy" text NOT NULL DEFAULT 'system', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" text NOT NULL DEFAULT 'system', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "carrouselImageData01" bytea, "carrouselImageData02" bytea, "carrouselImageData03" bytea, "carrouselImageData04" bytea, "carrouselImageData05" bytea, "code" text, "useCashier" boolean NOT NULL DEFAULT '1', CONSTRAINT "UQ_da1ab6a7756f985b57468b35fbb" UNIQUE ("name"), CONSTRAINT "PK_04fcef6bdd64ee5c8e2accd8415" PRIMARY KEY ("terminalId"));
CREATE TYPE "public"."operatorLog_operatoraction_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9');
CREATE TABLE "operatorLog" ("operatorLogId" uuid NOT NULL DEFAULT uuid_generate_v4(), "operatorEmail" text NOT NULL, "terminalId" uuid NOT NULL, "operatorAction" "public"."operatorLog_operatoraction_enum" NOT NULL, "description" text, "data" text, "stamp" TIMESTAMP WITH TIME ZONE NOT NULL, "createdBy" text NOT NULL DEFAULT 'system', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" text NOT NULL DEFAULT 'system', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1cf61efbf6deb648b9a2cc65897" PRIMARY KEY ("operatorLogId"));
CREATE TYPE "public"."users_roles_enum" AS ENUM('1', '2', '3');
CREATE TABLE "users" ("userId" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" text NOT NULL, "password" text NOT NULL, "fullName" text NOT NULL, "enabled" boolean NOT NULL, "roles" "public"."users_roles_enum" array NOT NULL, "createdBy" text NOT NULL DEFAULT 'system', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" text NOT NULL DEFAULT 'system', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId"));
CREATE TABLE "configuration" ("configurationId" uuid NOT NULL DEFAULT uuid_generate_v4(), "mpAuthorizationToken" text, "mpUserId" text, "mpNotificationURL" text, "taxPercentage" numeric, "createdBy" text NOT NULL DEFAULT 'system', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" text NOT NULL DEFAULT 'system', "logoMPImage" text, "logoSielconImage" text, "logoSalaImage" text, "logoMPImageData" bytea, "logoSielconImageData" bytea, "logoSalaImageData" bytea, "TITOTitle" text, "TITOLine1" text, "TITOLine2" text, "TITOLine3" text, "currencySymbol" text, "feeBorneClientCharge" boolean NOT NULL DEFAULT '0', "salaName" text, "salaAddress" text, "takeSalaNameConfiguration" boolean NOT NULL DEFAULT '0', "printCancelTransaction" boolean NOT NULL DEFAULT '0', "mpExpirateTransaction" integer NOT NULL DEFAULT '20', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c3ca2cbbf0e38b9325fb356b82b" PRIMARY KEY ("configurationId"));
ALTER TABLE "event" ADD CONSTRAINT "FK_128120d9fd6c994c186265be4f9" FOREIGN KEY ("terminalId") REFERENCES "terminal"("terminalId") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "transactionLog" ADD CONSTRAINT "FK_1550f0cb5904e8b062859eccf3f" FOREIGN KEY ("transactionId") REFERENCES "transaction"("transactionId") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "transaction" ADD CONSTRAINT "FK_71bf4f5ef5281da71e23ede3be3" FOREIGN KEY ("terminalId") REFERENCES "terminal"("terminalId") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "operatorLog" ADD CONSTRAINT "FK_7c31c2b4fdb595ec0c60650ec2b" FOREIGN KEY ("terminalId") REFERENCES "terminal"("terminalId") ON DELETE CASCADE ON UPDATE NO ACTION;
              END IF;
          END $$;
    
          COMMIT;
          