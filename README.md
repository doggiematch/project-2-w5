# Project 2 - What's in my fridge?

## Features

- Aplicación de recetas hecha con React.
- Página Home con una receta aleatoria.
- Navegación entre páginas funcional.
- Página Search para buscar recetas por ingrediente.
- Búsqueda con uno o varios ingredientes separados por coma.
- Resultados en cards con layout responsive.
- Paginación de resultados con 12 recetas por página.
- Página de detalle para cada receta.
- Página Favorites para guardar recetas favoritas.
- Opción para añadir y quitar recetas de favoritos.
- Búsqueda dentro de favoritos.
- Favoritos guardados en `localStorage`.
- Popup para ver la imagen de la receta más grande en escritorio.
- Página 404 básica creada.
- Tests básicos creados.

## Configuration

- Proyecto creado con React y Vite.
- La aplicación consume datos externos desde TheMealDB API.
- Los favoritos se guardan en el navegador con `localStorage`.

### API used

- [TheMealDB API](https://www.themealdb.com/api.php)

### Repository

- [GitHub Repository](https://github.com/doggiematch/project-2-w5)

### Deployment

- [Deployed on Netlify](https://whatsinmyfridge2w5.netlify.app/)
- [Deployed on Vercel](https://project-2-w5.vercel.app/)

## Technical Specifications

### Project technologies

- React
- Vite
- React Router
- CSS Modules
- Context
- LocalStorage
- Vitest
- Testing Library

### React

- Uso de componentes separados.
- Uso de rutas para navegar entre páginas.
- Uso de `useState`, `useEffect` y `useContext`.
- Uso de `useCallback` y `useMemo` en el provider.
- Uso de un custom hook llamado `useDebounce`.
- Context usado para compartir recetas, favoritos, carga y errores.

### CSS

- Diseño responsive.
- Uso de CSS general en `index.css`.
- Uso de CSS Modules.
- Uso de un estilo inline sencillo en la página Search.
- Uso de Flexbox en los resultados de búsqueda.
- Cards para mostrar recetas.
- Estilo visual claro y coherente entre las páginas.
- Popup de imagen disponible en escritorio.

### JavaScript

- Uso de Fetch API para consumir datos externos.
- Lógica para buscar recetas por ingrediente.
- Lógica para cargar recetas aleatorias.
- Lógica para mostrar el detalle de una receta.
- Lógica para añadir y quitar favoritos.
- Uso de `localStorage` para mantener favoritos guardados.

### Tests

- Tests con Vitest y Testing Library.
- Test del estado inicial de la página Search.
- Test del input de búsqueda.
- Test de renderizado de resultados.
- Test de búsqueda con varios ingredientes.
- Test de renderizado de Favorites.
- Test del mensaje cuando no hay favoritos.

### Project structure

- `/src/components` -> componentes reutilizables.
- `/src/context` -> contexto de recetas y favoritos.
- `/src/hooks` -> custom hooks.
- `/src/pages` -> páginas principales.
- `/src/__tests__` -> tests.
- Archivos principales:
  - `App.jsx`
  - `main.jsx`
  - `index.css`
  - `spec.md`
  - `README.md`

### Resources used during development

- React desarrollado con apuntes del bootcamp y práctica propia.
- CSS desarrollado con apuntes propios y ajustes durante el proyecto.
- Uso de documentación y ejemplos para React Router, Context y tests.
- Uso de TheMealDB API para obtener recetas.
- Se utilizó apoyo de IA para revisar errores y entender algunos fallos durante el desarrollo.
- También se usó IA para mejorar estilos, ordenar partes del código y revisar que el README estuviera completo.
- Las decisiones principales del proyecto, la estructura y la adaptación final se hicieron revisando el código y las necesidades de la app.

## Backlog

- Mejorar algunos textos de la interfaz.
- Añadir más tests.
- Mejorar la página 404.
- Revisar nombres de archivos de tests para que sean más claros.
- Mejorar mensajes de error.
- Seguir limpiando componentes para que el código sea más fácil de leer.
