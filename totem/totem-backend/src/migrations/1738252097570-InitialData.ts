import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialData1738252097570 implements MigrationInterface {
    name = 'InitialData1738252097570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO public.users (
                email, password, "fullName", enabled, roles
            ) VALUES (
                'admin1@admin.com', 
                '$2b$10$dxA.7Ln9D6lbRKaOYu.iV.W9YuV.dinmyA.RJdJIcVGNSpgWRa.r6', 
                'admin', 
                true, 
                '{1,2,3}'
            );
        `);

        await queryRunner.query(`
            INSERT INTO public.configuration (
                "mpAuthorizationToken", "mpUserId", "mpNotificationURL", "taxPercentage"
            ) VALUES (
                ' ', ' ', ' ', 0
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM public.configuration WHERE "mpAuthorizationToken" = ' ' AND "mpUserId" = ' ';
        `);

        await queryRunner.query(`
            DELETE FROM public.users WHERE email = 'admin1@admin.com';
        `);
    }
    

}
