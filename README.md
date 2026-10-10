# Formulario de personas — Frontend

Formulario en HTML + JavaScript que realiza el CRUD de personas consumiendo
el backend **mi-servidor** (Node.js + Express + Sequelize, MySQL o SQL Server).

## Cómo ejecutarlo

1. Encender primero el backend (`npm start` en el proyecto mi-servidor).
2. Abrir `index.html` en el navegador (o con la extensión Live Server de VS Code).

El formulario consume la API en `http://localhost:3000/usuarios`.
Al escribir tipo y número de documento busca si la persona existe: si existe, carga
sus datos y habilita Actualizar y Eliminar; si no, habilita Guardar.
