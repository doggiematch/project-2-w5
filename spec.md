# NO MODIFICAR EL ARCHIVO

# Especificaciones técnicas

## Resumen del proyecto

Esta aplicación se llama **What's in my fridge?**.

Es una app de recetas hecha con React. La idea es que una persona pueda buscar recetas según los ingredientes que tiene en casa.

También se pueden guardar recetas favoritas para verlas más tarde.

## Finalidad del proyecto

El objetivo principal es practicar React en un proyecto sencillo y completo.

La app permite:

- Ver una receta aleatoria en la página principal.
- Buscar recetas por ingrediente.
- Ver el detalle de una receta.
- Guardar recetas en favoritos.
- Buscar dentro de las recetas favoritas.
- Mantener los favoritos guardados aunque se recargue la página.

## Requisitos técnicos

El proyecto usa:

- React.
- React Router.
- Context para compartir datos entre páginas.
- CSS Modules para los estilos.
- LocalStorage para guardar favoritos y resultados.
- Vitest y Testing Library para los tests.
- TheMealDB API para obtener recetas.

## Páginas de la aplicación

### Home

La página principal muestra una receta aleatoria.

Desde esta página se puede:

- Pedir otra receta aleatoria.
- Ir a la página de búsqueda.
- Guardar o quitar la receta de favoritos.
- Ver la imagen más grande en escritorio.
- Ver ingredientes e instrucciones.

### Search

La página de búsqueda permite escribir uno o varios ingredientes.

Los resultados aparecen en cards:

- 1 card por fila en móvil.
- 2 cards por fila en tablet.
- 4 cards por fila en escritorio.

Se muestran 12 recetas por página y la paginación queda centrada debajo.

Cada card tiene un botón para guardar o quitar favoritos.

### Recipe detail

La página de detalle muestra una receta concreta.

Incluye:

- Nombre de la receta.
- Imagen.
- Categoría.
- País o zona.
- Ingredientes.
- Instrucciones.
- Botón para favoritos.
- Enlace al vídeo si existe.

En escritorio se puede abrir la imagen en grande.

### Favorites

La página de favoritos muestra las recetas guardadas.

Permite:

- Ver las recetas favoritas.
- Buscar dentro de favoritos.
- Quitar recetas de favoritos.

Esta página usa un custom hook llamado `useDebounce` para esperar un poco mientras la persona escribe en el buscador.

## Jerarquía de carpetas

La estructura principal del proyecto es:

```text
src
+-- components
|   +-- Footer
|   +-- Navbar
|   +-- RecipeCard
+-- context
|   +-- FavoritesContext.jsx
|   +-- FavoritesProvider.jsx
+-- hooks
|   +-- useDebounce.js
+-- pages
|   +-- FavoritesPage
|   +-- HomePage
|   +-- NotFoundPage
|   +-- RecipeDetailPage
|   +-- SearchPage
+-- __tests__
|   +-- FavoritesPage.test.jsx
|   +-- SearchPage.test.jsx
|   +-- SearchPageInput.test.jsx
+-- App.jsx
+-- index.css
+-- main.jsx
```

## UI/UX planteados

El diseño intenta ser sencillo, claro y amable.

Se usan colores relacionados con comida y cocina:

- Verde para botones principales.
- Naranja para detalles.
- Fondo claro.
- Cards blancas para separar la información.

La app intenta que las acciones importantes sean fáciles de encontrar:

- Buscar.
- Limpiar búsqueda.
- Guardar favorito.
- Ver detalle.
- Cambiar de página.

## Tests

La aplicación tiene tests sencillos para comprobar partes importantes:

- Que la página de búsqueda muestra su estado inicial.
- Que el input de búsqueda cambia al escribir.
- Que aparecen recetas después de buscar.
- Que la búsqueda con varios ingredientes funciona.
- Que la página de favoritos se renderiza.
- Que aparece un mensaje cuando no hay favoritos.

## Notas finales

Este proyecto está pensado como trabajo de bootcamp.

El código intenta ser simple y fácil de leer. La prioridad es entender bien React, las páginas, los componentes, el contexto, los favoritos y los tests básicos.
