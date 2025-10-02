const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Cargar los empleados desde el archivo JSON al iniciar el servidor
let empleados = [];
try {
  const data = fs.readFileSync('empleados.json', 'utf8');
  empleados = JSON.parse(data);
  // Cargamos los empleados y mostramos cuántos hay en consola
  console.log(`✅ Cargados ${empleados.length} empleados desde empleados.json`);
} catch (error) {
  // Si hay error leyendo el archivo, lo mostramos y seguimos con lista vacía
  console.error('❌ Error al cargar los datos:', error.message);
  empleados = [];
}

// obtener empleados, con filtros opcionales
app.get('/api/empleados', (req, res) => {
  try {
    const { min, max, email } = req.query;
    let empleadosFiltrados = [...empleados];

    // Filtrar por salario mínimo y/o máximo si se pasan por parámetros
    if (min !== undefined || max !== undefined) {
      empleadosFiltrados = empleadosFiltrados.filter(emp => {
        if (emp.salary === undefined) return false;
        if (min !== undefined && emp.salary < Number(min)) return false;
        if (max !== undefined && emp.salary > Number(max)) return false;
        return true;
      });
    }

    // Filtrar por email si se pasa por parámetro (búsqueda parcial)
    if (email) {
      empleadosFiltrados = empleadosFiltrados.filter(emp =>
        emp.email && emp.email.toLowerCase().includes(email.toLowerCase())
      );
    }

    // Respondemos con los empleados filtrados y el total
    res.json({
      success: true,
      data: empleadosFiltrados,
      total: empleadosFiltrados.length
    });
  } catch (error) {
    // Si algo sale mal, devolvemos error 500
    res.status(500).json({ success: false, error: 'Error al filtrar empleados' });
  }
});

//  para obtener un empleado específico por su ID
app.get('/api/empleados/:id', (req, res) => {
  try {
    const empleado = empleados.find(emp => emp.id == req.params.id);
    if (!empleado) {
      // Si no existe, devolvemos 404
      return res.status(404).json({ success: false, error: 'Empleado no encontrado' });
    }
    res.json({ success: true, data: empleado });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al buscar empleado' });
  }
});

// para estadísticas de salarios (mínimo, máximo, promedio, total)
app.get('/api/empleados/stats', (req, res) => {
  try {
    const salarios = empleados.filter(e => e.salary !== undefined).map(e => e.salary);
    const total = salarios.length;
    const min = Math.min(...salarios);
    const max = Math.max(...salarios);
    const avg = salarios.reduce((a, b) => a + b, 0) / (total || 1);
    res.json({
      success: true,
      stats: { total, min, max, avg: Math.round(avg * 100) / 100 }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al calcular estadísticas' });
  }
});

// Servimos el frontend (index.html) cuando acceden a la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//  404 en formato JSON
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado'
  });
});

// Arrancamos el servidor y mostramos info útil en consola
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api/empleados`);
  console.log(`🔍 Ejemplo de filtrado: http://localhost:${PORT}/api/empleados?min=1000&max=1500`);
});

module.exports = app;

