let empleados = [];

document.addEventListener('DOMContentLoaded', function() {
    cargarEmpleados();
});

async function cargarEmpleados() {
    try {
        const response = await fetch('/api/empleados');
        const data = await response.json();
        
        if (data.success) {
            empleados = data.data;
            mostrarEmpleados(empleados);
        } else {
            mostrarError('Error al cargar los empleados');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error de conexión con el servidor');
    }
}

async function buscar() {
    const email = document.getElementById('emailSearch').value.trim();
    const minSalary = document.getElementById('minSalary').value;
    const maxSalary = document.getElementById('maxSalary').value;
    
    const params = new URLSearchParams();
    if (email) params.append('email', email);
    if (minSalary) params.append('min', minSalary);
    if (maxSalary) params.append('max', maxSalary);
    
    try {
        const url = `/api/empleados?${params.toString()}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            mostrarEmpleados(data.data);
        } else {
            mostrarError('Error en la búsqueda');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error de conexión con el servidor');
    }
}

function limpiar() {
    document.getElementById('emailSearch').value = '';
    document.getElementById('minSalary').value = '';
    document.getElementById('maxSalary').value = '';
    cargarEmpleados();
}

function mostrarEmpleados(listaEmpleados) {
    const container = document.getElementById('lista');
    container.innerHTML = '';
    
    if (listaEmpleados.length === 0) {
        container.innerHTML = '<p class="no-results">No se encontraron empleados</p>';
        return;
    }
    
    listaEmpleados.forEach(empleado => {
        const div = document.createElement('div');
        div.className = 'empleado';
        div.onclick = () => mostrarDetalle(empleado);
        div.innerHTML = `
            <strong>${empleado.name}</strong>
            <p><strong>Email:</strong> ${empleado.email}</p>
            <p><strong>Posición:</strong> ${empleado.position}</p>
            <p><strong>Salario:</strong> $${formatearSalario(empleado.salary)}</p>
        `;
        container.appendChild(div);
    });
}

function mostrarDetalle(empleado) {
    document.getElementById('modalTitle').textContent = empleado.name;
    document.getElementById('modalContent').innerHTML = `
        <p><strong>Email:</strong> ${empleado.email}</p>
        <p><strong>Teléfono:</strong> ${empleado.phone}</p>
        <p><strong>Dirección:</strong> ${empleado.address}</p>
        <p><strong>Posición:</strong> ${empleado.position}</p>
        <p><strong>Salario:</strong> $${formatearSalario(empleado.salary)}</p>
        <p><strong>Habilidades:</strong> ${empleado.skills.join(', ')}</p>
    `;
    document.getElementById('modal').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
}

function formatearSalario(salario) {
    return salario.toLocaleString('es-CO');
}

function mostrarError(mensaje) {
    alert(`Error: ${mensaje}`);
}

document.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        cerrarModal();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarModal();
    }
});