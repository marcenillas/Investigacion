# sielcon_pay

docker-compose up -d

npm run start:dev
ng serve
electron .  

En la terminal, luego de npm install  / npm update, la versión exacta a utilizar de electron-pos-printer es "electron-pos-printer": "^1.3.6",

"email": "nuevo@email.com",
"password": "Admin123#"

https://www.electronjs.org/docs/latest/tutorial/debugging-vscode

---
# Sielcon.Pay.Terminal 
    1.Instalador
    1.1Documentación
        Empaquetador
            https://www.youtube.com/watch?v=KDVahubc_54&t=336s
        Instalador
            https://www.youtube.com/watch?v=TnXz_nnQZrw

    2.Pasos
        1.correr SielconPayTerminal Setup 1.0.0.exe
        2.Al terminar de instalar copiar en la carpeta de instalación la carpeta SielconPayTerminal-win32-x64
        3.generar un acceso directo de SielconPayTerminal.exe con el parámetro --config=config/config.development.json
---
# Sielcon.Pay.Terminal.backend
    1.Migración
    1.1.Documentación
        https://orkhan.gitbook.io/typeorm/docs/using-cli
        https://medium.com/@ryanmambou/how-to-generate-and-run-a-migration-using-typeorm-in-nestjs-e0e078baf128
        https://stackoverflow.com/questions/73469474/nestjs-postgres-typeorm-database-migration

    1.2.Borrado de Base
        DROP SCHEMA public CASCADE;
        CREATE SCHEMA public;
        Función especial
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    1.3.Pasos para Migración
        1.Generar ts-node ./node_modules/typeorm/cli.js migration:generate -d src/data-source.ts src/migrations/InitialMigration
        2.Axtualizar ts-node ./node_modules/typeorm/cli.js migration:run -d src/data-source.ts

    1.4.Pasos para generar sql
        1.Npm Run
        2.Seed ProcessMigration Elegir Archivo Ts
        3.Genera un archivo SQL, se genera en DB

    1.5.Instalar Nest en Iss
        https://medium.com/@sujan.dumaru.official/deploy-nestjs-on-iis-ada2e33f46f9
        https://github.com/Azure/iisnode
        Instalar antes URL rewrite module for IIS
        Agregar la variable de Sistema c:\Program Files\node.js
        Darle permisos al Node.exe al IUSR IIS_IUSRS
        copiar el .env  al dist y configurar el puerto
        Falta algo que redirija

    1.6.Pasos Iniciales
        Prerrequisitos tener instalado el Postgress
        Correr SQL
            1. Initial 
            2. InitialData
            3. Entrar a la Web 
        1.	Carga Inicial de Configuración
        2.	Carga de terminal
        4. Arrancar Sielcon.Pay.Terminal
    
instalar 
	nginx - Windows
	https://www.youtube.com/watch?v=DKXdkXCgtCQ
	despues 
	copiar la carpeta dist en donde quieras
	configurar ngingx
	location / {
            root   C:\nginx\sielconPay\dist; # Cambia esto a la ruta de tu carpeta de bienvenida
            index  index.html;
        }

		location /sielconPay/api {
            proxy_pass http://localhost:3090/api; # Asegúrate de que esta es la dirección correcta de tu aplicación Nest.js
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

    

