## Development
Pasos para levantar la app en desarrollo


1. Levantar la base de datos
```
podman-compose up
```

2. Crear una copia del .env.template y llamarlo .env
3. Reemplazar las variables de entorno
4. Ejecutar el comando para instalar dependencias
```
npm install
```
5. Ejecutar el comando para levantar/correr el proyecto
```
npm run dev
```
6. Ejecutar estos comandos de prisma para conectar con la db
```
npx prisma migrate dev
npx prisma generate
```
7. Ejecutar el SEED para [crear la base de datos local](http://localhost:3000/api/seed)



# Prisma commands

```
npx prisma init
npx prisma migrate dev
npx prisma generate
```