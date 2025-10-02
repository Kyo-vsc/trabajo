# Sistema de Gestión de Empleados

Este es un proyecto sencillo hecho para practicar Node.js y Express en la universidad. Permite consultar y filtrar empleados desde una página web básica.

## ¿Qué hace la app?

- Muestra una lista de empleados en pantalla.
- Puedes buscar empleados por email.
- Puedes filtrar empleados por salario mínimo y máximo.
- Si das clic en un empleado, puedes ver más detalles.
- Hay una sección de estadísticas de salarios.

## ¿Cómo se usa?

1. Instala las dependencias con:
   ```
   npm install
   ```

2. Inicia el servidor con:
   ```
   npm start
   ```

3. Abre tu navegador y entra a:
   ```
   http://localhost:3001
   ```

## ¿Qué archivos hay?

- `server.js`: El backend hecho con Express.
- `empleados.json`: Los datos de los empleados.
- `public/index.html`: La página principal (frontend).
- `public/script.js`: Código JS para que la página sea interactiva.
- `public/styles.css`: Unos estilos básicos para que se vea mejor.

## Endpoints principales

- `GET /api/empleados`  
  Devuelve la lista de empleados (puedes filtrar con `?min=`, `?max=`, `?email=`).

- `GET /api/empleados/:id`  
  Devuelve los datos de un empleado específico.

- `GET /api/empleados/stats`  
  Devuelve estadísticas de salarios.

---



