// Cargar la biblioteca de Google Charts con el paquete de 'timeline'
google.charts.load('current', { 'packages': ['timeline'] });

// Función para agregar un retraso usando Promises
const delay = (n) => new Promise(r => setTimeout(r, n * 1000));

// Lista de procesos con sus atributos
var procesos = [{
    "nombre": "A",
    "li": "0",
    "t": "6",
    "inicio": "3",
    "duracion": "2"
},{
    "nombre": "B",
    "li": "1",
    "t": "8",
    "inicio": "1",
    "duracion": "3"
}, {
    "nombre": "C",
    "li": "2",
    "t": "7",
    "inicio": "5",
    "duracion": "1"
}, {
    "nombre": "D",
    "li": "4",
    "t": "3",
    "inicio": "0",
    "duracion": "0"
}, {
    "nombre": "E",
    "li": "6",
    "t": "9",
    "inicio": "2",
    "duracion": "4"
}, {
    "nombre": "F",
    "li": "6",
    "t": "2",
    "inicio": "0",
    "duracion": "0"
}];

// Lista temporal de procesos
var procesosTemp = [];

// Variable para almacenar la instancia del gestor de procesos
var gestor;

// Variable para almacenar la selección del algoritmo
var selecAlgoritmo = 0;

// Listas para procesos bloqueados, en espera y finalizados
var procesosBloqueados = [];
var procesosEspera = [];
var procesosFinalizados = [];

// Función para dibujar el diagrama de Gantt
function dibujarGantt(filas) {
    // Obtener el contenedor donde se dibujará el gráfico de Gantt
    var container = document.getElementById('timeline');

    // Crear una instancia del gráfico de línea de tiempo de Google
    var chart = new google.visualization.Timeline(container);

    // Crear un DataTable que almacenará los datos para el gráfico de línea de tiempo
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'string', id: 'Role' });
    dataTable.addColumn({ type: 'string', id: 'dummy bar label' });
    dataTable.addColumn({ type: 'string', id: 'style', role: 'style' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });

    // Llenar el DataTable con las filas proporcionadas
    filas.forEach(fila => {
        var color = '#FFF';

        // Asignar colores según el estado del proceso
        if (fila.estado == "W") color = '#BFBFBF'; // Espera
        if (fila.estado == "B") color = '#FF0000'; // Bloqueado
        if (fila.estado == "E") color = '#00B050'; // Ejecución
        if (fila.estado == "D") color = '#00B0F0'; // Despachador

        // Agregar la fila al DataTable
        if (color != '#FFF') {
            dataTable.addRows([[fila.nombre, '', color, new Date(0, 0, 0, 0, 0, fila.inicio, 0), new Date(0, 0, 0, 0, 0, fila.fin, 0)]]);
        }
    });

    // Opciones del gráfico
    var options = {
        tooltip: { trigger: 'none' },
    }

    // Dibujar el gráfico de línea de tiempo con el DataTable y las opciones proporcionadas
    chart.draw(dataTable, options);
}

// Función para agregar listeners a los botones
function agregarListener() {
    var btnIniciar = document.getElementById("iniciar");

    // Acción para iniciar el programa
    btnIniciar.addEventListener("click", function () {
        var algoritmo = document.getElementById("select");

        if (algoritmo.value == "Selecciona un algoritmo") {
            alert("Seleccione un algoritmo para continuar");
        } else {
            switch (algoritmo.value) {
                // Asignar el valor del algoritmo seleccionado a la variable selecAlgoritmo
                case "1":
                    selecAlgoritmo = 1;
                    break;
                case "2":
                    selecAlgoritmo = 2;
                    break;
                case "3":
                    selecAlgoritmo = 3;
                    break;
                case "4":
                    var q = document.getElementById("quantum").value;

                    if (q.length == 0) {
                        alert("Tiene que llenar el valor de q");
                    } else {
                        selecAlgoritmo = 4;
                    }
                    break;
            }

            if (selecAlgoritmo != 0) {
                llenarTablaProcesos();
                $("#btnDatos").show();
                $("#timeline").empty();
            }
        }
    });

    var btnInsertar = document.getElementById("btnDatos");

    // Acción para insertar los datos del proceso
    btnInsertar.addEventListener("click", function () {
        bloquearCampos();
        llenarGantt();
    });
}

// Función para bloquear los inputs de la tabla de procesos
function bloquearCampos() {
    for (let i = 0; i < this.procesos.length; i++) {
        // Obtener elementos de la interfaz
        var li = document.getElementById('li' + i);
        var t = document.getElementById('t' + i);
        var inicio = document.getElementById('inicio' + i);
        var duracion = document.getElementById('duracion' + i);

        // Validar campos llenos
        if (li.value == "" || t.value == "") {
            li.value = "0";
            t.value = "0";
            inicio.value = "0";
            duracion.value = "0";
        }

        inicio.value = inicio.value == "" ? "0" : inicio.value;
        duracion.value = duracion.value == "" ? "0" : duracion.value;

        // Guardar valores en el array de procesos
        this.procesos[i] = {
            "nombre": this.procesos[i].nombre,
            "li": li.value,
            "t": t.value,
            "inicio": inicio.value,
            "duracion": duracion.value
        };

        // Deshabilitar campos
        li.disabled = true;
        t.disabled = true;
        inicio.disabled = true;
        duracion.disabled = true;
    }

    // Crear una nueva instancia del gestor de procesos
    gestor = new GestionProcesos(JSON.parse(JSON.stringify(this.procesos)));
    gestor.ordernarLista(selecAlgoritmo);
}

// Función para llenar la tabla de procesos con los datos proporcionados
function llenarTablaProcesos() {
    document.getElementById("procesos").replaceChildren();
    for (let i = 0; i < procesos.length; i++) {
        const proceso = procesos[i];

        var fila = "<tr><td>" + proceso.nombre + "</td><td> <input  value = " + proceso.li + " type = 'text' id = 'li" + i + "'> </td>" +
            "<td> <input value = " + proceso.t + "  type = 'text' id = 't" + i + "'> </td>" +
            "<td> <input value = " + proceso.inicio + "  type = 'text' id = 'inicio" + i + "'> </td>" +
            "<td> <input value = " + proceso.duracion + "  type = 'text' id = 'duracion" + i + "'> </td>"
            + "</tr>";

        var tr = document.createElement("TR");
        tr.innerHTML = fila;
        document.getElementById("procesos").appendChild(tr);
    }
}

// Función asincrónica para llenar el diagrama de Gantt
async function llenarGantt() {
    switch (selecAlgoritmo) {
        // Algoritmo FCFS
        case 1:
            while (!gestor.finalizo()) {
                await delay(1);
                var procesoEstado = gestor.FCFS()
                procesosTemp.push(...procesoEstado)
                google.charts.setOnLoadCallback(dibujarGantt(procesosTemp));
                llenarTablas(procesoEstado);
            }
            break;

        // Algoritmo SJF
        case 2:
            while (!gestor.finalizo()) {
                await delay(1);
                var procesoEstado = gestor.SJF();
                procesosTemp.push(...procesoEstado)
                google.charts.setOnLoadCallback(dibujarGantt(procesosTemp));
                llenarTablas(procesoEstado);
            }
            break;

        // Algoritmo SRTF
        case 3:
            while (!gestor.finalizo()) {
                await delay(1);
                var procesoEstado = gestor.SRTF();
                procesosTemp.push(...procesoEstado)
                google.charts.setOnLoadCallback(dibujarGantt(procesosTemp));
                llenarTablas(procesoEstado);
            }
            break;

        // Algoritmo RR
        case 4:
            while (!gestor.finalizo()) {
                await delay(1);
                var procesoEstado = gestor.RR(document.getElementById("quantum").value);
                procesosTemp.push(...procesoEstado)
                google.charts.setOnLoadCallback(dibujarGantt(procesosTemp));
                llenarTablas(procesoEstado);
            }
            break;
    }
}

// Función para llenar las tablas de procesos bloqueados, en espera y finalizados
function llenarTablas(procesoEstado) {
    procesosBloqueados = [];
    procesosEspera = [];

    procesoEstado.forEach(proceso => {
        // Clasificar procesos según su estado
        if (proceso.estado == 'B') {
            procesosBloqueados.push(proceso);
        }
        if (proceso.estado == 'W') {
            procesosEspera.push(proceso);
        }

        // Procesar procesos finalizados
        if (proceso.restante == 0) {
            this.procesos.forEach(procesInicial => {
                if (procesInicial.nombre == proceso.nombre) {
                    // Crear un objeto temporal para almacenar información detallada del proceso finalizado
                    var procesoTemp = {
                        "nombre": procesInicial.nombre,
                        "t": parseInt(procesInicial.t),
                        "Bloqueo": parseInt(procesInicial.duracion),
                        "li": parseInt(procesInicial.li),
                        "lf": proceso.fin
                    }

                    procesoTemp.T = procesoTemp.lf - procesoTemp.li;
                    procesoTemp.Espera = procesoTemp.T - (procesoTemp.Bloqueo + procesoTemp.t);
                    procesoTemp.TiempoPerdido = procesoTemp.T - procesoTemp.t;
                    procesoTemp.lp = (procesoTemp.T / procesoTemp.t).toFixed(2);
                    procesoTemp.Tr = proceso.inicial;

                    // Agregar el proceso finalizado a la lista
                    procesosFinalizados.push(procesoTemp);
                }
            });
        }
    });

    // Procesos en espera
    document.getElementById("procesosEnEspera").replaceChildren();
    for (let i = 0; i < procesosEspera.length; i++) {
        const proceso = procesosEspera[i];

        var fila = "<tr><td>" + (i + 1) + "</td><td>" + proceso.nombre + "</td></tr>";
        var tr = document.createElement("TR");
        tr.innerHTML = fila;
        document.getElementById("procesosEnEspera").appendChild(tr);
    }

    // Procesos Bloqueados
    document.getElementById("procesosBloqueados").replaceChildren();
    for (let i = 0; i < procesosBloqueados.length; i++) {
        const proceso = procesosBloqueados[i];

        var fila = "<tr><td>" + (i + 1) + "</td><td>" + proceso.nombre + "</td></tr>";
        var tr = document.createElement("TR");
        tr.innerHTML = fila;
        document.getElementById("procesosBloqueados").appendChild(tr);
    }

    // Resultado de procesos
    document.getElementById("resultadoProceso").replaceChildren();
    for (let i = 0; i < procesosFinalizados.length; i++) {
        const proceso = procesosFinalizados[i];

        var fila = "<tr><td>" + proceso.nombre +
            "</td><td>" + proceso.t +
            "</td><td>" + proceso.Espera +
            "</td><td>" + proceso.Bloqueo +
            "</td><td>" + proceso.lf +
            "</td><td>" + proceso.T +
            "</td><td>" + proceso.TiempoPerdido +
            "</td><td>" + proceso.lp +
            "</td><td>" + proceso.Tr + "</td></tr>";

        var tr = document.createElement("TR");
        tr.innerHTML = fila;
        document.getElementById("resultadoProceso").appendChild(tr);
    }
}

// Función de inicialización
function init() {
    agregarListener();
    $("#btnDatos").hide();
}

// Iniciar la inicialización al cargar la página
init();
