// URL del backend en Node.js + Express (proyecto mi-servidor)
const API_URL = "http://localhost:3000/usuarios";

// Lee la respuesta del backend y, si trae error, lanza el mensaje que envió el servidor
async function procesarRespuesta(response) {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.mensaje || "Error en el servidor");
    return data;
}

let tipoDoc = document.getElementById("tipoDoc");
tipoDoc.addEventListener("focus", function () { tipoDoc.style.background = "blue"; });
tipoDoc.addEventListener("blur", function () { tipoDoc.style.background = "white"; });

let numDoc = document.getElementById("numDoc");
numDoc.addEventListener("focus", function () { numDoc.style.background = "blue"; });
numDoc.addEventListener("blur", function () { numDoc.style.background = "white"; });

let nombres = document.getElementById("nombres");
nombres.addEventListener("focus", function () { nombres.style.background = "lightgreen"; });
nombres.addEventListener("blur", function () { nombres.style.background = "white"; });

let apellidos = document.getElementById("apellidos");
apellidos.addEventListener("focus", function () { apellidos.style.background = "lightgreen"; });
apellidos.addEventListener("blur", function () { apellidos.style.background = "white"; });

let direccion = document.getElementById("direccion");
direccion.addEventListener("focus", function () { direccion.style.background = "violet"; });
direccion.addEventListener("blur", function () { direccion.style.background = "white"; });

let ciudad = document.getElementById("ciudad");
ciudad.addEventListener("focus", function () { ciudad.style.background = "violet"; });
ciudad.addEventListener("blur", function () { ciudad.style.background = "white"; });

let fechaNac = document.getElementById("fechaNac");
fechaNac.addEventListener("focus", function () { fechaNac.style.background = "turquoise"; });
fechaNac.addEventListener("blur", function () { fechaNac.style.background = "white"; });

let correo = document.getElementById("correo");
correo.addEventListener("focus", function () { correo.style.background = "turquoise"; });
correo.addEventListener("blur", function () { correo.style.background = "white"; });

// --- VARIABLES PRINCIPALES ---
let personas = [];
let tabla = document.getElementById("tablaPersonas");

let botonGuardar = document.getElementById("btnGuardar");
let botonActualizar = document.getElementById("btnActualizar");
let botonEliminar = document.getElementById("btnEliminar");

// --- CARGAR DATOS DESDE EL BACKEND ---
function cargarDatosDesdeAPI() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error("Servidor no responde");
            return response.json();
        })
        .then(data => {
            personas = data;
            mostrarPersonas(); 
        })
        .catch(error => {
            console.error("Error al cargar la API:", error);
            alert("No se pudo conectar con el servidor. Verifica que el backend (npm start) esté encendido.");
        });
}

cargarDatosDesdeAPI();

// --- LÓGICA DE VALIDACIÓN (Habilita los botones Actualizar/Eliminar) ---
function validarExistencia() {
    let tipo = tipoDoc.value;
    let numero = numDoc.value;

    if (tipo !== "" && numero !== "") {
        let existe = personas.find(p => p.tipoDoc === tipo && p.numDoc === numero);

        if (existe) {
            nombres.value = existe.nombres;
            apellidos.value = existe.apellidos;
            direccion.value = existe.direccion;
            ciudad.value = existe.ciudad;
            fechaNac.value = existe.fechaNac;
            correo.value = existe.correo;

            botonGuardar.disabled = true;
            botonActualizar.disabled = false;
            botonEliminar.disabled = false;
        } else {
            nombres.value = "";
            apellidos.value = "";
            direccion.value = "";
            ciudad.value = "";
            fechaNac.value = "";
            correo.value = "";
            
            botonGuardar.disabled = false;
            botonActualizar.disabled = true;
            botonEliminar.disabled = true;
        }
    } else {
        botonGuardar.disabled = false;
        botonActualizar.disabled = true;
        botonEliminar.disabled = true;
    }
}
tipoDoc.addEventListener("change", validarExistencia);
numDoc.addEventListener("input", validarExistencia);

// --- POST (GUARDAR) ---
botonGuardar.addEventListener("click", function () {
    let persona = {
        tipoDoc: tipoDoc.value,
        numDoc: numDoc.value,
        nombres: nombres.value,
        apellidos: apellidos.value,
        direccion: direccion.value,
        ciudad: ciudad.value,
        fechaNac: fechaNac.value,
        correo: correo.value
    };

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(persona)
    })
    .then(procesarRespuesta)
    .then(data => {
        alert("Datos guardados correctamente");
        document.querySelector("form").reset(); 
        validarExistencia(); 
        cargarDatosDesdeAPI(); 
    })
    .catch(error => alert(error.message));
});

// --- PUT (ACTUALIZAR - Cuadro 1) ---
botonActualizar.addEventListener("click", function () {
    let existe = personas.find(p => p.tipoDoc === tipoDoc.value && p.numDoc === numDoc.value);
    
    if (existe) {
        let personaActualizada = {
            tipoDoc: tipoDoc.value,
            numDoc: numDoc.value,
            nombres: nombres.value,
            apellidos: apellidos.value,
            direccion: direccion.value,
            ciudad: ciudad.value,
            fechaNac: fechaNac.value,
            correo: correo.value
        };

        fetch(`${API_URL}/${existe.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(personaActualizada)
        })
        .then(procesarRespuesta)
        .then(() => {
            alert("Datos actualizados correctamente.");
            document.querySelector("form").reset();
            validarExistencia();
            cargarDatosDesdeAPI(); 
        })
        .catch(error => alert(error.message));
    }
});

// --- DELETE (ELIMINAR - Cuadro 1) ---
botonEliminar.addEventListener("click", function () {
    let existe = personas.find(p => p.tipoDoc === tipoDoc.value && p.numDoc === numDoc.value);
    
    if (existe) {
        if (confirm("¿Realmente desea eliminar este registro?")) {
            fetch(`${API_URL}/${existe.id}`, {
                method: 'DELETE'
            })
            .then(procesarRespuesta)
            .then(() => {
                alert("Registro eliminado.");
                document.querySelector("form").reset();
                validarExistencia(); 
                cargarDatosDesdeAPI(); 
            })
            .catch(error => alert(error.message));
        }
    }
});

// --- MOSTRAR GRILLA (Sin cuadro 2) ---
function mostrarPersonas() {
    tabla.innerHTML = "";
    let encabezado = tabla.insertRow();
    
    // Lista de títulos original, sin la columna de "Acciones"
    let titulos = ["Tipo Doc", "Num Doc", "Nombres", "Apellidos", "Dirección", "Ciudad", "Fecha Nac", "Correo"];
    titulos.forEach(titulo => {
        let th = document.createElement("th");
        th.textContent = titulo;
        encabezado.appendChild(th);
    });

    personas.forEach(persona => {
        let fila = tabla.insertRow();
        
        fila.insertCell().textContent = persona.tipoDoc;
        fila.insertCell().textContent = persona.numDoc;
        fila.insertCell().textContent = persona.nombres;
        fila.insertCell().textContent = persona.apellidos;
        fila.insertCell().textContent = persona.direccion;
        fila.insertCell().textContent = persona.ciudad;
        fila.insertCell().textContent = persona.fechaNac;
        fila.insertCell().textContent = persona.correo;
    });
}