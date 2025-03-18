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
            RAISE NOTICE 'Tabla migrations creada';
        END IF;
    END $$;

    -- Verificar si la migración ya existe
    DO $$
    DECLARE
        migration_exists BOOLEAN;
    BEGIN
        SELECT EXISTS (SELECT 1 FROM migrations WHERE name = 'InitialData1738252097570') INTO migration_exists;
        IF NOT migration_exists THEN
            -- Insertar la migración en la tabla
            INSERT INTO migrations ("timestamp", "name") VALUES (1738252097570, 'InitialData1738252097570');
            RAISE NOTICE 'Migración insertada';

            INSERT INTO public.users (
                "email", "password", "fullName", "enabled", "roles"
            ) VALUES (
                'admin@admin.com', 
                '$2b$10$dxA.7Ln9D6lbRKaOYu.iV.W9YuV.dinmyA.RJdJIcVGNSpgWRa.r6', 
                'admin', 
                true, 
                '{1,2,3}'
            );
            RAISE NOTICE 'Usuario admin insertado';

            INSERT INTO public.configuration (
                "mpAuthorizationToken", "mpUserId", "mpNotificationURL", "taxPercentage"
            ) VALUES (
                ' ', ' ', ' ', 0
            );
            RAISE NOTICE 'Configuración insertada';
        END IF;
    END $$;

COMMIT;
