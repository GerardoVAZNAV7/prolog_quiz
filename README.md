# Quiz de Prolog (Vue 3 + Vite)

## Local
    npm install
    npm run dev

## Vercel
1. Sube la carpeta a un repo de GitHub.
2. En vercel.com: New Project -> importa el repo.
3. Vercel detecta Vite solo (build: `npm run build`, salida: `dist`). Deploy.

## Agregar contenido
- Preguntas: `src/data/quiz.js` (función q(categoría, pregunta, opciones, índiceCorrecto, explicación)).
- Ejercicios: `src/data/practica.js` (función e(tema, enunciado, pista, [respuestas válidas])).
  El comparador ignora espacios y nombres de variables (X,Y,Z = A,B,C).
