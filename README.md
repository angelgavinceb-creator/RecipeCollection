# [Recipe Collection]

Aplicación web para crear, ver, añadir favorito y valorar recetas de cocina.

## Funcionalidades

- Registro e inicio de sesión con JWT
- Crear recetas con ingredientes, cantidades y dificultad
- Valorar recetas (1-100) y dejar comentarios
- Guardar recetas favoritas
- Ver el perfil con tus propias recetas

## Tecnologías

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express, TypeScript
- **Base de datos:** PostgreSQL
- **Otros:** Docker Compose, bcrypt, JSON Web Tokens

## Estructura

El backend sigue una arquitectura hexagonal, organizada por módulos
(`users`, `recipes`, `ratings`...). Cada módulo se divide en `domain`,
`application` e `infrastructure`.

## Próximos pasos

- Categorías de recetas
- Subida de imágenes
- Tests automáticos