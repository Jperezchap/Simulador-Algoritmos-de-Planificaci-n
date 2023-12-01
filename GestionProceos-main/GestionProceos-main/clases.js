class Proceso {

    constructor(nombre, inicio, fin, estado, restante, inicial) {
        this.nombre = nombre;
        this.inicio = inicio;
        this.fin = fin;
        this.estado = estado;
        this.restante = restante;
        this.inicial = inicial;
    }
};

class GestionProcesos {

    constructor(listaProcesos) {
        var procesosTemp = [];

        for (let i = 0; i < listaProcesos.length; i++) {
            var proceso = listaProcesos[i];
            if (proceso.t != 0) {
                proceso.estado = 'W';
                proceso.li = parseInt(proceso.li);
                proceso.t = parseInt(proceso.t);
                proceso.inicio = parseInt(proceso.inicio);
                proceso.duracion = parseInt(proceso.duracion);
                proceso.recorrido = 0;
                procesosTemp.push(proceso);
            }
        }

        this.listaProcesos = procesosTemp;
        this.procesosRR = [];
        this.tiempoRR = 0;
        this.tiempo = 0;
    }

    finalizo() {
        for (let index = 0; index < this.listaProcesos.length; index++) {
            const proceso = this.listaProcesos[index];

            if (proceso.estado != "") {
                return false;
            }
        }
        return true;
    }

    procesosActivos() {
        var activos = 0;
        for (let index = 0; index < this.listaProcesos.length; index++) {
            const proceso = this.listaProcesos[index];

            if (proceso.estado != "") {
                activos++;
            }
        }
        return activos;
    }

    ordernarLista(algoritmo) {
        switch (algoritmo) {
            case 1:
                this.listaProcesos.sort(function (a, b) {
                    if (a.li > b.li) {
                        return 1;
                    }
                    if (a.li < b.li) {
                        return -1;
                    }
                    return 0;
                })
                break;

            case 2:
                this.listaProcesos.sort(function (a, b) {
                    if (a.li == b.li) {
                        if (a.t > b.t) {
                            return 1;
                        }
                        if (a.t < b.t) {
                            return -1;
                        }
                    }
                    if (a.li > b.li) {
                        return 1;
                    }
                    if (a.li < b.li) {
                        return -1;
                    }
                    return 0;
                })
                break;

            case 3:
                this.listaProcesos.sort(function (a, b) {
                    if (a.li == b.li) {
                        if (a.t > b.t) {
                            return 1;
                        }
                        if (a.t < b.t) {
                            return -1;
                        }
                    }
                    if (a.li > b.li) {
                        return 1;
                    }
                    if (a.li < b.li) {
                        return -1;
                    }
                    return 0;
                })
                break;
            case 4:
                this.listaProcesos.sort(function (a, b) {
                    if (a.li > b.li) {
                        return 1;
                    }
                    if (a.li < b.li) {
                        return -1;
                    }
                    return 0;
                })
                break;
        }
    }

    FCFS() {
        var procesos = [];
        var ejecutable = { "idProceso": -1, "ejecutar": false };

        // Primera ejecución
        if (this.tiempo == 0) {
            this.listaProcesos[0].estado = "E";
        }

        for (let i = 0; i < this.listaProcesos.length; i++) {
            var proceso = this.listaProcesos[i];

            if (this.tiempo >= proceso.li && proceso.estado != "") {
                // Ejecución
                if (proceso.estado == "E") {
                    proceso.t -= 1;
                    proceso.recorrido += 1;

                    // Guardar tiempo inicial
                    if (proceso.recorrido == 1) {
                        proceso.inicial = this.tiempo - proceso.li;
                    }

                    procesos.push(new Proceso(proceso.nombre, this.tiempo, this.tiempo + 1, proceso.estado, proceso.t, proceso.inicial));

                    // Cuando el proceso termino su ejecución
                    if (proceso.t <= 0) {
                        proceso.estado = "";
                        proceso.tiempoFin = this.tiempo;
                        for (let j = 0; j < this.listaProcesos.length; j++) {
                            const procSig = this.listaProcesos[j];
                            if (this.tiempo >= procSig.li && procSig.estado != "" && procSig.estado != "B") {
                                ejecutable = { "idProceso": j, "ejecutar": true };
                                break;
                            }
                        }
                    }

                    // Cuando el proceso se debe bloquear
                    if (proceso.inicio == proceso.recorrido && proceso.recorrido >= 1 && proceso.duracion > 0) {
                        proceso.estado = "B";
                        for (let j = 0; j < this.listaProcesos.length; j++) {
                            const procSig = this.listaProcesos[j];
                            if (this.tiempo >= procSig.li && procSig.estado != "" && procSig.estado != "B") {
                                ejecutable = { "idProceso": j, "ejecutar": true };
                                break;
                            }
                        }
                    }
                    continue;
                }

                // Bloqueado
                if (proceso.estado == "B") {
                    procesos.push(new Proceso(proceso.nombre, this.tiempo, this.tiempo + 1, proceso.estado, proceso.t, -1));
                    proceso.duracion -= 1;

                    var siguiente = true;

                    for (let i = 0; i < this.listaProcesos.length; i++) {
                        const proceso = this.listaProcesos[i];
                        if (proceso.estado == "E") {
                            siguiente = false;
                            break;
                        }
                    }

                    if (siguiente) {
                        for (let j = 0; j < this.listaProcesos.length; j++) {
                            const procSig = this.listaProcesos[j];
                            if (this.tiempo >= procSig.li && procSig.estado != "" && procSig.estado != "B") {
                                ejecutable = { "idProceso": j, "ejecutar": true };
                                break;
                            }
                        }
                    }

                    if (proceso.duracion <= 0) {
                        proceso.estado = "W";
                    }
                    continue;
                }

                procesos.push(new Proceso(proceso.nombre, this.tiempo, this.tiempo + 1, proceso.estado, proceso.t, -1));
            }
        }

        // Ejecutar proceso en la siguiente iteración
        if (ejecutable.ejecutar) {
            this.listaProcesos[ejecutable.idProceso].estado = "E";
            ejecutable = { "idProceso": -1, "ejecutar": false };
        }

        // Finalizar la simulación
        if (this.procesosActivos() == 1) {
            for (let i = 0; i < this.listaProcesos.length; i++) {
                const proceso = this.listaProcesos[i];
                if (proceso.estado == "W" && proceso.duracion <= 0) {
                    proceso.estado = "E";
                }
            }
        }

        this.tiempo += 1;
        return procesos;
    }

    SJF() {
        var procesos = [];
        var ejecutable = { "idProceso": -1, "ejecutar": false };

        //Primera ejecución
        if (this.tiempo == 0) {
            for (let i = 0; i < this.listaProcesos.length; i++) {
                this.listaProcesos[i].tiempoTotal = this.listaProcesos[i].t;
                if (this.listaProcesos[i].li == 0) {
                    this.listaProcesos[i].estado = "E";
                    for (let j = 0; j < this.listaProcesos.length; j++) {
                        if (this.listaProcesos[j].li == 0) {
                            if (this.listaProcesos[j].t < this.listaProcesos[i].t) {
                                this.listaProcesos[j].estado = "E";
                                this.listaProcesos[i].estado = "W";
                            }
                        }
                    }
                }
            }
        }

        for (let i = 0; i < this.listaProcesos.length; i++) {
            var proceso = this.listaProcesos[i];

            if (this.tiempo >= proceso.li && proceso.estado != "") {
                //Ejecucion
                if (proceso.estado == "E") {
                    proceso.recorrido += 1;
                    proceso.t -= 1;

                    // Guardar tiempo inicial
                    if (proceso.recorrido == 1) {
                        proceso.inicial = this.tiempo - proceso.li;
                    }

                    procesos.push(new Proceso(proceso.nombre, this.tiempo, this.tiempo + 1, proceso.estado, proceso.t, proceso.inicial));

                    //Proceso termino su ejecucion
                    if (proceso.t <= 0) {
                        proceso.estado = "";
                        for (let j = 0; j < this.listaProcesos.length; j++) {
                            const procSig = this.listaProcesos[j];
                            var encontrado = false;
                            if (this.tiempo >= procSig.li && procSig.estado != "" && procSig.estado != "B") {
                                for (let k = 0; k < this.listaProcesos.length; k++) {
                                    if (this.tiempo >= this.listaProcesos[k].li && this.listaProcesos[k].estado != "" && this.listaProcesos[k].estado != "B") {
                                        if (j == k) {
                                            let filtro = this.listaProcesos.filter(element => element.estado == "E");

                                            if (!ejecutable.ejecutar && filtro <= 0) {
                                                for (let m = 0; m < this.listaProcesos.length; m++) {
                                                    if (this.tiempo >= this.listaProcesos[m].li && this.listaProcesos[m].estado != "" && this.listaProcesos[m].estado != "B") {
                                                        ejecutable = { "idProceso": m, "ejecutar": true };
                                                    }
                                                }
                                            }

                                            continue;
                                        }

                                        if (this.listaProcesos[j].tiempoTotal < this.listaProcesos[k].tiempoTotal) {
                                            encontrado = true;
                                        } else {
                                            encontrado = false;
                                            break;
                                        }
                                    }
                                }
                            }

                            if (encontrado) {
                                ejecutable = { "idProceso": j, "ejecutar": true };
                                break;
                            }
                        }
                    }

                    //Proceso se debe bloquear
                    if (proceso.inicio == proceso.recorrido && proceso.recorrido >= 1 && proceso.duracion > 0) {
                        proceso.estado = "B";
                        for (let j = 0; j < this.listaProcesos.length; j++) {
                            const procSig = this.listaProcesos[j];
                            var encontrado = false;

                            if (this.tiempo >= procSig.li && procSig.estado != "" && procSig.estado != "B") {
                                for (let k = 0; k < this.listaProcesos.length; k++) {
                                    if (this.tiempo >= this.listaProcesos[k].li && this.listaProcesos[k].estado != "" && this.listaProcesos[k].estado != "B") {

                                        if (j == k) {
                                            let filtro = this.listaProcesos.filter(element => element.estado != "");

                                            if (filtro.length == 2) {
                                                for (let m = 0; m < this.listaProcesos.length; m++) {
                                                    if (this.tiempo >= this.listaProcesos[m].li && this.listaProcesos[m].estado != "" && this.listaProcesos[m].estado != "B") {
                                                        encontrado = true;
                                                        j = m;
                                                        break;
                                                    }
                                                }
                                            }

                                            continue;
                                        }

                                        if (this.listaProcesos[j].tiempoTotal < this.listaProcesos[k].tiempoTotal) {
                                            encontrado = true;
                                        } else {
                                            encontrado = false;
                                            break;
                                        }
                                    }
                                }
                            }

                            if (encontrado) {
                                ejecutable = { "idProceso": j, "ejecutar": true };
                                break;
                            }
                        }
                    }
                    continue;
                }

                // Bloqueado
                if (proceso.estado == "B") {
                    procesos.push(new Proceso(proceso.nombre, this.tiempo, this.tiempo + 1, proceso.estado, proceso.t, -1));
                    proceso.duracion -= 1;

                    if (proceso.duracion <= 0) {
                        proceso.estado = "W"
                    }

                    let filtro = this.listaProcesos.filter(element => element.estado == "E");

                    if (!ejecutable.ejecutar && filtro <= 0) {
                        for (let m = 0; m < this.listaProcesos.length; m++) {
                            if (this.tiempo >= this.listaProcesos[m].li && this.listaProcesos[m].estado != "" && this.listaProcesos[m].estado != "B") {
                                ejecutable = { "idProceso": m, "ejecutar": true };
                            }
                        }
                    }

                    continue;
                }

                procesos.push(new Proceso(proceso.nombre, this.tiempo, this.tiempo + 1, proceso.estado, proceso.t, -1));
            }
        }

        // Ejecutar proceso en la siguiente iteración
        if (ejecutable.ejecutar) {
            this.listaProcesos[ejecutable.idProceso].estado = "E";
            ejecutable = { "idProceso": -1, "ejecutar": false };
        }

        // Finalizar la simulación
        if (this.procesosActivos() == 1) {
            for (let i = 0; i < this.listaProcesos.length; i++) {
                const proceso = this.listaProcesos[i];
                if (proceso.estado == "W" && proceso.duracion <= 0) {
                    proceso.estado = "E";
                }
            }
        }

        this.tiempo += 1;
        return procesos;
    }

    SRTF() {
        var procesos = [];
        var ejecutable = { "idProceso": -1, "ejecutar": false, "restante": -1 };

        // Primera ejecución
        if (this.tiempo == 0) {
            this.listaProcesos[0].estado = "E";
        }

        for (let i = 0; i < this.listaProcesos.length; i++) {
            const proceso = this.listaProcesos[i];

            if (this.tiempo >= proceso.li && proceso.estado != "") {
                // Ejecución
                if (proceso.estado == "E") {
                    proceso.t -= 1;
                    proceso.recorrido += 1;

                    // Guardar tiempo inicial
                    if (proceso.recorrido == 1) {
                        proceso.inicial = this.tiempo - proceso.li;
                    }

                    procesos.push(new Proceso(proceso.nombre, this.tiempo, this.tiempo + 1, proceso.estado, proceso.t, proceso.inicial));

                    // Cuando el proceso termino su ejecución
                    if (proceso.t <= 0) {
                        proceso.estado = "";

                        for (let j = 0; j < this.listaProcesos.length; j++) {
                            const procSig = this.listaProcesos[j];
                            if (procSig.t > 0 && procSig.li <= this.tiempo && i != j && procSig.estado != "B") {
                                ejecutable = { "idProceso": j, "ejecutar": true, "restante": procSig.t };
                                break;
                            }
                        }

                        for (let j = 0; j < this.listaProcesos.length; j++) {
                            const procSig = this.listaProcesos[j];
                            if (procSig.t < ejecutable.restante && procSig.t > 0 && procSig.li <= this.tiempo && i != j && procSig.estado != "B") {
                                ejecutable = { "idProceso": j, "ejecutar": true, "restante": procSig.t };
                            }
                        }
                    }

                    // Cuando el proceso se debe bloquear
                    if (proceso.inicio == proceso.recorrido && proceso.recorrido >= 1 && proceso.duracion > 0) {
                        proceso.estado = "B";
                        for (let j = 0; j < this.listaProcesos.length; j++) {
                            const procSig = this.listaProcesos[j];
                            if (procSig.t > 0 && procSig.li <= this.tiempo && i != j && procSig.estado != "B") {
                                ejecutable = { "idProceso": j, "ejecutar": true, "restante": procSig.t };
                                break;
                            }
                        }

                        for (let j = 0; j < this.listaProcesos.length; j++) {
                            const procSig = this.listaProcesos[j];
                            if (procSig.t < ejecutable.restante && procSig.t > 0 && procSig.li <= this.tiempo && i != j && procSig.estado != "B") {
                                ejecutable = { "idProceso": j, "ejecutar": true, "restante": procSig.t };
                            }
                        }
                    }
                    continue;
                }

                // Bloqueado
                if (proceso.estado == "B") {
                    procesos.push(new Proceso(proceso.nombre, this.tiempo, this.tiempo + 1, proceso.estado, proceso.t, -1));
                    proceso.duracion -= 1;
                    debugger
                    var siguiente = true;

                    for (let i = 0; i < this.listaProcesos.length; i++) {
                        const proceso = this.listaProcesos[i];
                        if (proceso.estado == "E") {
                            siguiente = false;
                            break;
                        }
                    }

                    if (siguiente) {
                        for (let j = 0; j < this.listaProcesos.length; j++) {
                            const procSig = this.listaProcesos[j];
                            if (procSig.t > 0 && procSig.li <= this.tiempo && i != j && procSig.estado != "B") {
                                ejecutable = { "idProceso": j, "ejecutar": true, "restante": procSig.t };
                                break;
                            }
                        }

                        for (let j = 0; j < this.listaProcesos.length; j++) {
                            const procSig = this.listaProcesos[j];
                            if (procSig.t < ejecutable.restante && procSig.t > 0 && procSig.li <= this.tiempo && i != j && procSig.estado != "B") {
                                ejecutable = { "idProceso": j, "ejecutar": true, "restante": procSig.t };
                            }
                        }

                    }

                    if (proceso.duracion <= 0) {
                        proceso.estado = "W";
                    }
                    continue;
                }

                procesos.push(new Proceso(proceso.nombre, this.tiempo, this.tiempo + 1, proceso.estado, proceso.t, -1));
            }
        }

        // Ejecutar proceso en la siguiente iteración
        if (ejecutable.ejecutar) {
            this.listaProcesos[ejecutable.idProceso].estado = "E";
            ejecutable = { "idProceso": -1, "ejecutar": false };
        }
        // Finalizar la simulación
        if (this.procesosActivos() == 1) {
            for (let i = 0; i < this.listaProcesos.length; i++) {
                const proceso = this.listaProcesos[i];
                if (proceso.estado == "W" && proceso.duracion <= 0) {
                    proceso.estado = "E";
                }
            }
        }
        this.tiempo += 1;
        return procesos;
    }

    RR(quantum) {
        quantum = parseInt(quantum) + 1;
        var procesos = [];
        var ejecutable = { "idProceso": -1, "ejecutar": false };
        var bloqueable = { "idProceso": -1, "bloquear": false };

        for (let i = 0; i < this.listaProcesos.length; i++) {
            var proceso = this.listaProcesos[i];

            if (proceso.li == this.tiempo) {
                if (this.tiempo == 0) {
                    ejecutable = { "idProceso": 0, "ejecutar": true };
                }
                this.procesosRR.push(proceso);
            }
        }

        if (this.tiempoRR % quantum == 0) {
            procesos.push(new Proceso("Despachador", this.tiempo, this.tiempo + 1, "D", -1, -1));
            for (let i = 0; i < this.procesosRR.length; i++) {
                var proceso = this.procesosRR[i];

                if (proceso.t > 0){
                    bloqueable = { "idProceso": 0, "bloquear": true };
                    ejecutable = { "idProceso": 0, "ejecutar": true };
    
                    if (proceso.estado == "E") {
                        proceso.estado = "W";
                        procesos.push(new Proceso(proceso.nombre, this.tiempo, this.tiempo + 1, "W", proceso.t, -1));
                        continue;
                    }
    
                    if (proceso.estado == "B") {
                        proceso.duracion -= 1;
                        if (proceso.duracion <= 0) {
                            proceso.estado = "W";
                        }
                    }
                    procesos.push(new Proceso(proceso.nombre, this.tiempo, this.tiempo + 1, proceso.estado, proceso.t, -1));
                }

            }

        } else {
            for (let i = 0; i < this.procesosRR.length; i++) {
                var proceso = this.procesosRR[i];

                if (this.tiempo >= proceso.li && proceso.estado != "") {
                    // Ejecución
                    if (proceso.estado == "E") {
                        proceso.t -= 1;
                        proceso.recorrido += 1;

                        // Guardar tiempo inicial
                        if (proceso.recorrido == 1) {
                            proceso.inicial = this.tiempo - proceso.li;
                        }

                        procesos.push(new Proceso(proceso.nombre, this.tiempo, this.tiempo + 1, proceso.estado, proceso.t, proceso.inicial));

                        // Cuando el proceso termino su ejecución
                        if (proceso.t <= 0) {
                            proceso.estado = "";
                            proceso.tiempoFin = this.tiempo;
                            this.tiempoRR = -1;
                        }

                        // Cuando el proceso se debe bloquear
                        if (proceso.inicio == proceso.recorrido && proceso.recorrido >= 1 && proceso.duracion > 0) {
                            proceso.estado = "B";
                            this.tiempoRR = -1;
                        }
                        continue;
                    }

                    // Bloqueado
                    if (proceso.estado == "B" && proceso.duracion >= 0) {
                        procesos.push(new Proceso(proceso.nombre, this.tiempo, this.tiempo + 1, proceso.estado, proceso.t, -1));
                        proceso.duracion -= 1;

                        if (proceso.duracion <= 0) {
                            proceso.estado = "W";
                        }
                        continue
                    }

                    procesos.push(new Proceso(proceso.nombre, this.tiempo, this.tiempo + 1, proceso.estado, proceso.t, -1));

                }

            }
        }

        if (bloqueable.bloquear) {
            const procFinal = this.procesosRR.shift();
            if (procFinal.t > 0) {
                this.procesosRR.push(procFinal);
            }
        }

        // Ejecutar proceso en la siguiente iteración
        if (ejecutable.ejecutar) {
            this.procesosRR[ejecutable.idProceso].estado = "E";
            ejecutable = { "idProceso": -1, "ejecutar": false };
        }

        // Finalizar la simulación
        if (this.procesosActivos() == 1) {
            for (let i = 0; i < this.procesosRR.length; i++) {
                const proceso = this.procesosRR[i];
                if (proceso.estado == "W" && proceso.duracion <= 0) {
                    proceso.estado = "E";
                }
            }
        }

        this.tiempo += 1;
        this.tiempoRR += 1;
        return procesos;
    }
};