// Inicialización de datos
let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
let citas = JSON.parse(localStorage.getItem('citas')) || [];

document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById('clientesTable')) cargarClientes();
    if (document.getElementById('citasTable')) cargarCitas();
    if (document.getElementById('formCliente')) {
        document.getElementById('formCliente').addEventListener('submit', agregarCliente);
    }
    if (document.getElementById('formCita')) {
        document.getElementById('formCita').addEventListener('submit', agregarCita);
    }
    if (document.getElementById('searchCliente')) {
        document.getElementById('searchCliente').addEventListener('keyup', function (event) {
            if (event.key === 'Enter') buscarCliente();
        });
    }
});

// Función para cargar los clientes
function cargarClientes() {
    const clientesTable = document.getElementById('clientesTable').getElementsByTagName('tbody')[0];
    clientesTable.innerHTML = '';
    clientes.forEach(cliente => {
        const row = clientesTable.insertRow();
        row.innerHTML = `
            <td>${cliente.nombre}</td>
            <td>${cliente.apellidos}</td>
            <td>${cliente.dni}</td>
            <td>${cliente.direccion}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.email}</td>
            <td>
                <button onclick="modificarCliente('${cliente.dni}')">Modificar</button>
                <button onclick="eliminarCliente('${cliente.dni}')">Eliminar</button>
            </td>
        `;
    });
}

// Función para agregar un cliente
function agregarCliente(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const dni = document.getElementById('dni').value;
    const direccion = document.getElementById('direccion').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;

    const nuevoCliente = { nombre, apellidos, dni, direccion, telefono, email };
    clientes.push(nuevoCliente);
    localStorage.setItem('clientes', JSON.stringify(clientes));
    alert('Cliente agregado correctamente.');
    window.location.href = 'ConsultarClientes.html';
}

// Función para buscar clientes
function buscarCliente() {
    const searchInput = document.getElementById('searchCliente').value.toLowerCase().trim();
    if (!searchInput) {
        alert('Por favor, introduce un texto para buscar.');
        return;
    }

    const clienteEncontrado = clientes.find(cliente =>
        Object.values(cliente).some(value => value.toString().toLowerCase().includes(searchInput))
    );

    if (clienteEncontrado) {
        const accion = prompt(`Cliente encontrado:
Nombre: ${clienteEncontrado.nombre}
Apellidos: ${clienteEncontrado.apellidos}
DNI: ${clienteEncontrado.dni}
Teléfono: ${clienteEncontrado.telefono}
¿Qué deseas hacer?
1. Modificar
2. Eliminar
3. Cancelar`);

        if (accion === '1') {
            modificarCliente(clienteEncontrado.dni);
        } else if (accion === '2') {
            eliminarCliente(clienteEncontrado.dni);
        } else {
            alert('Operación cancelada.');
        }
    } else {
        alert('Cliente no encontrado.');
    }
}

// Función para modificar un cliente
function modificarCliente(dni) {
    const cliente = clientes.find(c => c.dni === dni);
    if (!cliente) return alert('Cliente no encontrado.');

    cliente.nombre = prompt('Nuevo nombre:', cliente.nombre) || cliente.nombre;
    cliente.apellidos = prompt('Nuevos apellidos:', cliente.apellidos) || cliente.apellidos;
    cliente.dni = prompt('Nuevo DNI:', cliente.dni) || cliente.dni;
    cliente.direccion = prompt('Nueva dirección:', cliente.direccion) || cliente.direccion;
    cliente.telefono = prompt('Nuevo teléfono:', cliente.telefono) || cliente.telefono;
    cliente.email = prompt('Nuevo email:', cliente.email) || cliente.email;

    localStorage.setItem('clientes', JSON.stringify(clientes));
    cargarClientes();
}

// Función para eliminar un cliente
function eliminarCliente(dni) {
    clientes = clientes.filter(cliente => cliente.dni !== dni);
    localStorage.setItem('clientes', JSON.stringify(clientes));
    cargarClientes();
}

// Función para cargar citas
function cargarCitas() {
    const citasTable = document.getElementById('citasTable').getElementsByTagName('tbody')[0];
    citasTable.innerHTML = '';

    if (citas.length === 0) {
        citasTable.innerHTML = `<tr><td colspan="5">No hay citas registradas</td></tr>`;
    } else {
        citas.forEach((cita, index) => {
            citasTable.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${cita.fecha}</td>
                    <td>${cita.cliente.nombre}</td>
                    <td>${cita.observaciones}</td>
                    <td>
                        <button onclick="modificarCita('${cita.fecha}')">Modificar</button>
                        <button onclick="eliminarCita('${cita.fecha}')">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    }
}

// Función para añadir una cita
function agregarCita(event) {
    event.preventDefault();
    const fecha = document.getElementById('fecha').value;
    const clienteSeleccionado = document.getElementById('clienteCita').value;
    const cliente = clientes.find(c => c.dni === clienteSeleccionado);
    const observaciones = document.getElementById('observaciones').value;

    if (!fecha || !cliente || !observaciones) return alert('Completa todos los campos.');

    const nuevaCita = { fecha, cliente, observaciones };
    citas.push(nuevaCita);
    localStorage.setItem('citas', JSON.stringify(citas));
    alert('Cita guardada correctamente.');
    window.location.href = 'ConsultarCitas.html';
}

// Función para eliminar una cita
function eliminarCita(fecha) {
    citas = citas.filter(c => c.fecha !== fecha);
    localStorage.setItem('citas', JSON.stringify(citas));
    cargarCitas();
}

// Función para modificar una cita
function modificarCita(fecha) {
    const cita = citas.find(c => c.fecha === fecha);
    if (!cita) return alert('Cita no encontrada.');

    document.getElementById('fecha').value = cita.fecha;
    document.getElementById('observaciones').value = cita.observaciones;
    document.getElementById('clienteCita').value = cita.cliente.telefono;
}
