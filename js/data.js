/* ============================================
   data.js - Datos simulados para Panamá
   Incluye: pacientes, diagnósticos CIE-10,
   geografía, procedimientos, programas
   ============================================ */

const DataPanama = (() => {

    // Provincias, Distritos, Corregimientos de Panamá
    const geografia = [
        { provincia: "Panamá", distrito: "Panamá", corregimiento: "Betania", zona: "Urbana" },
        { provincia: "Panamá", distrito: "Panamá", corregimiento: "Bella Vista", zona: "Urbana" },
        { provincia: "Panamá", distrito: "Panamá", corregimiento: "Calidonia", zona: "Urbana" },
        { provincia: "Panamá", distrito: "Panamá", corregimiento: "San Francisco", zona: "Urbana" },
        { provincia: "Panamá", distrito: "Panamá", corregimiento: "Pueblo Nuevo", zona: "Urbana" },
        { provincia: "Panamá", distrito: "Panamá", corregimiento: "Parque Lefevre", zona: "Urbana" },
        { provincia: "Panamá", distrito: "Panamá", corregimiento: "Río Abajo", zona: "Urbana" },
        { provincia: "Panamá", distrito: "Panamá", corregimiento: "Juan Díaz", zona: "Urbana" },
        { provincia: "Panamá", distrito: "Panamá", corregimiento: "Pedregal", zona: "Urbana" },
        { provincia: "Panamá", distrito: "Panamá", corregimiento: "Tocumen", zona: "Urbana" },
        { provincia: "Panamá", distrito: "San Miguelito", corregimiento: "Amelia Denis de Icaza", zona: "Urbana" },
        { provincia: "Panamá", distrito: "San Miguelito", corregimiento: "Belisario Porras", zona: "Urbana" },
        { provincia: "Panamá", distrito: "San Miguelito", corregimiento: "José Domingo Espinar", zona: "Urbana" },
        { provincia: "Panamá", distrito: "San Miguelito", corregimiento: "Mateo Iturralde", zona: "Urbana" },
        { provincia: "Panamá Oeste", distrito: "Arraiján", corregimiento: "Arraiján Cabecera", zona: "Urbana" },
        { provincia: "Panamá Oeste", distrito: "La Chorrera", corregimiento: "Barrio Balboa", zona: "Urbana" },
        { provincia: "Panamá Oeste", distrito: "La Chorrera", corregimiento: "Barrio Colón", zona: "Urbana" },
        { provincia: "Colón", distrito: "Colón", corregimiento: "Barrio Norte", zona: "Urbana" },
        { provincia: "Colón", distrito: "Colón", corregimiento: "Barrio Sur", zona: "Urbana" },
        { provincia: "Chiriquí", distrito: "David", corregimiento: "David Cabecera", zona: "Urbana" },
        { provincia: "Chiriquí", distrito: "David", corregimiento: "San Pablo Viejo", zona: "Rural" },
        { provincia: "Veraguas", distrito: "Santiago", corregimiento: "Santiago Cabecera", zona: "Urbana" },
        { provincia: "Herrera", distrito: "Chitré", corregimiento: "Chitré Cabecera", zona: "Urbana" },
        { provincia: "Los Santos", distrito: "Las Tablas", corregimiento: "Las Tablas Cabecera", zona: "Urbana" },
        { provincia: "Coclé", distrito: "Penonomé", corregimiento: "Penonomé Cabecera", zona: "Urbana" },
        { provincia: "Bocas del Toro", distrito: "Changuinola", corregimiento: "Changuinola", zona: "Urbana" },
        { provincia: "Darién", distrito: "Chepigana", corregimiento: "La Palma", zona: "Rural" },
        { provincia: "Comarca Ngäbe-Buglé", distrito: "Besikó", corregimiento: "Soloy", zona: "Rural" },
    ];

    // Diagnósticos CIE-10 comunes en atención primaria
    const diagnosticos = [
        { codigo: "J06.9", descripcion: "Infección aguda de las vías respiratorias superiores" },
        { codigo: "J02.9", descripcion: "Faringitis aguda, no especificada" },
        { codigo: "J00", descripcion: "Rinofaringitis aguda (resfriado común)" },
        { codigo: "J20.9", descripcion: "Bronquitis aguda, no especificada" },
        { codigo: "A09", descripcion: "Diarrea y gastroenteritis de presunto origen infeccioso" },
        { codigo: "I10", descripcion: "Hipertensión esencial (primaria)" },
        { codigo: "E11.9", descripcion: "Diabetes mellitus tipo 2, sin complicaciones" },
        { codigo: "E78.0", descripcion: "Hipercolesterolemia pura" },
        { codigo: "M54.5", descripcion: "Lumbago no especificado" },
        { codigo: "K29.7", descripcion: "Gastritis, no especificada" },
        { codigo: "N39.0", descripcion: "Infección de vías urinarias, sitio no especificado" },
        { codigo: "L30.9", descripcion: "Dermatitis, no especificada" },
        { codigo: "B35.3", descripcion: "Tiña del pie" },
        { codigo: "K30", descripcion: "Dispepsia funcional" },
        { codigo: "R51", descripcion: "Cefalea" },
        { codigo: "J45.9", descripcion: "Asma, no especificada" },
        { codigo: "E66.9", descripcion: "Obesidad, no especificada" },
        { codigo: "F32.9", descripcion: "Episodio depresivo, no especificado" },
        { codigo: "F41.1", descripcion: "Trastorno de ansiedad generalizada" },
        { codigo: "Z00.0", descripcion: "Examen médico general" },
        { codigo: "Z01.4", descripcion: "Examen ginecológico (general)(de rutina)" },
        { codigo: "Z23", descripcion: "Necesidad de inmunización contra enfermedad bacteriana" },
        { codigo: "Z30.0", descripcion: "Consejo y asesoramiento general sobre anticoncepción" },
        { codigo: "Z34.9", descripcion: "Supervisión de embarazo normal, no especificado" },
        { codigo: "R10.4", descripcion: "Otros dolores abdominales y los no especificados" },
        { codigo: "H10.9", descripcion: "Conjuntivitis, no especificada" },
        { codigo: "B82.9", descripcion: "Parasitosis intestinal, sin otra especificación" },
        { codigo: "J03.9", descripcion: "Amigdalitis aguda, no especificada" },
        { codigo: "R50.9", descripcion: "Fiebre, no especificada" },
        { codigo: "G43.9", descripcion: "Migraña, no especificada" },
    ];

    // Procedimientos comunes
    const procedimientos = [
        "Consulta médica general",
        "Control prenatal",
        "Toma de presión arterial",
        "Glucometría capilar",
        "Electrocardiograma",
        "Curación de herida",
        "Nebulización",
        "Inyección intramuscular",
        "Retiro de puntos",
        "Examen físico completo",
        "Consejería nutricional",
        "Orientación en planificación familiar",
        "Referencia a especialista",
        "Certificado de salud",
        "PAP (Papanicolaou)",
        "Prueba rápida VIH",
        "Prueba rápida de embarazo",
        "Vacunación",
        "Control de crecimiento y desarrollo",
        "Tamizaje visual",
    ];

    // Programas de salud
    const programas = [
        "—",
        "Escolar",
        "Adolescencia",
        "Materno Infantil",
        "Adulto Mayor",
        "Salud Mental",
        "PCNT (Tuberculosis)",
        "VIH/SIDA",
        "ETV (Vectores)",
        "Inmunización",
    ];

    // Nombres panameños comunes
    const nombres = {
        masculinos: [
            "Carlos", "José", "Luis", "Miguel", "Juan", "Pedro", "Ricardo", "Roberto",
            "Fernando", "Antonio", "Alejandro", "Eduardo", "Daniel", "Andrés", "David",
            "Gabriel", "Francisco", "Héctor", "Tomás", "Rafael"
        ],
        femeninos: [
            "María", "Ana", "Carmen", "Rosa", "Luisa", "Patricia", "Sandra", "Diana",
            "Gabriela", "Adriana", "Claudia", "Isabel", "Teresa", "Sofía", "Laura",
            "Elena", "Marta", "Lucía", "Valentina", "Carolina"
        ]
    };

    const apellidos = [
        "González", "Rodríguez", "Martínez", "García", "López", "Hernández",
        "Pérez", "Sánchez", "Ramírez", "Torres", "Flores", "Rivera",
        "Gómez", "Díaz", "Cruz", "Morales", "Reyes", "Jiménez",
        "Castillo", "Vargas", "Ortega", "Romero", "Herrera", "Mendoza",
        "Ruiz", "Delgado", "Castro", "Ortiz", "Ríos", "Vega"
    ];

    // Motivos de consulta para la agenda
    const motivosConsulta = [
        "Control de hipertensión", "Dolor abdominal", "Resfriado común",
        "Control prenatal", "Control de diabetes", "Dolor de espalda",
        "Examen general", "Certificado de salud", "Dolor de cabeza",
        "Infección urinaria", "Diarrea", "Dolor de garganta",
        "Control de peso", "Erupción cutánea", "Vacunación",
        "Ansiedad", "Tos persistente", "Dolor articular",
        "Revisión de laboratorios", "Planificación familiar"
    ];

    // Etnias indígenas de Panamá (según formulario RDA-1)
    const etnias = [
        "—", "Kuna", "Emberá", "Wounaan", "Ngöbe", "Buglé",
        "Naso (Teribe)", "Bokota", "Bri Bri"
    ];

    // Tipos de atención (columna 9 del RDA-1)
    const tiposAtencion = [
        { codigo: "C", descripcion: "Consulta" },
        { codigo: "I", descripcion: "Interconsulta" },
        { codigo: "E", descripcion: "Emergencia" },
        { codigo: "V", descripcion: "Visita domiciliaria" },
    ];

    // Opciones de referendo (columnas 19-21 del RDA-1)
    const referendoOpciones = [
        "—", "RP", "RHI", "RHN"
    ];

    // Actividades administrativas simuladas
    const actividadesAdmin = [
        { tipo: "Reunión administrativa", descripcion: "Reunión de coordinación del equipo de salud", duracion: 1.5 },
        { tipo: "Docencia", descripcion: "Capacitación sobre manejo de hipertensión arterial", duracion: 2 },
        { tipo: "Comité", descripcion: "Comité de morbimortalidad del establecimiento", duracion: 1 },
        { tipo: "Supervisión", descripcion: "Supervisión de programa de inmunización", duracion: 1.5 },
        { tipo: "Informe", descripcion: "Elaboración de informe mensual de actividades", duracion: 1 },
        { tipo: "Investigación", descripcion: "Revisión de casos para estudio epidemiológico", duracion: 2 },
        { tipo: "Gira", descripcion: "Gira de salud a comunidad de San Isidro", duracion: 4 },
        { tipo: "Docencia", descripcion: "Charla educativa sobre prevención de dengue", duracion: 1 },
    ];

    // Utilidades
    function random(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Generar cédula panameña realista
    function generarCedula() {
        const prefijos = ["8", "PE", "N", "E", "1", "2", "3", "4", "5", "6", "7", "9", "10", "12", "13"];
        const pesos = [50, 5, 3, 3, 5, 5, 5, 5, 3, 3, 3, 3, 2, 2, 2];
        const totalPeso = pesos.reduce((a, b) => a + b, 0);
        let r = Math.random() * totalPeso;
        let prefijo = prefijos[0];
        for (let i = 0; i < prefijos.length; i++) {
            r -= pesos[i];
            if (r <= 0) { prefijo = prefijos[i]; break; }
        }
        const tomo = randomInt(1, 999);
        const asiento = randomInt(1, 99999);
        return `${prefijo}-${tomo}-${asiento}`;
    }

    // Generar paciente simulado
    function generarPaciente() {
        const sexo = Math.random() > 0.45 ? "F" : "M";
        const nombre = sexo === "F" ? random(nombres.femeninos) : random(nombres.masculinos);
        const apellido1 = random(apellidos);
        const apellido2 = random(apellidos);
        const edad = randomInt(0, 85);
        const geo = random(geografia);
        const dx = random(diagnosticos);
        const proc = random(procedimientos);
        const esPrimeraVez = Math.random() > 0.6;
        const programa = Math.random() > 0.7 ? random(programas.slice(1)) : "—";
        const tipoAten = random(tiposAtencion);

        // Edad: separar en días y años según el formulario RDA-1
        let edadDias = "";
        let edadAnos = "";
        let edadTexto;
        if (edad < 1) {
            const dias = randomInt(1, 364);
            edadDias = dias.toString();
            edadTexto = dias <= 30 ? `${dias}d` : `${Math.floor(dias / 30)}m`;
        } else {
            edadAnos = edad.toString();
            edadTexto = `${edad}a`;
        }

        // PAP: solo para mujeres ≥15 años, 10% probabilidad
        const pap = (sexo === "F" && edad >= 15 && Math.random() > 0.9) ? "✓" : "";

        // Referendo: 15% probabilidad
        const referendo = Math.random() > 0.85 ? random(referendoOpciones.slice(1)) : "—";

        // Servicio referido (si hay referendo)
        const servicioReferido = referendo !== "—" ? random(["Cardiología", "Ginecología", "Ortopedia", "Oftalmología", "Dermatología", "Psiquiatría", "Cirugía", "Pediatría", "Medicina Interna"]) : "";

        // Etnia: 5% probabilidad de ser indígena
        const etnia = Math.random() > 0.95 ? random(etnias.slice(1)) : "—";

        // Diagnóstico nuevo/reincidente/ingreso/crónico
        const dxTipo = random(["1N", "2R", "1N", "1N"]); // mayoría nuevos
        const esCronico = ["I10", "E11.9", "E78.0", "J45.9", "E66.9"].includes(dx.codigo);

        return {
            cedula: generarCedula(),
            nombre: `${nombre} ${apellido1} ${apellido2}`,
            sexo: sexo,
            edad: edad,
            edadDias: edadDias,
            edadAnos: edadAnos,
            edadTexto: edadTexto,
            atencion: esPrimeraVez ? "1ra vez" : "Subsec.",
            atencionCod: esPrimeraVez ? "1" : "2",
            residencia: `${geo.corregimiento}, ${geo.distrito}`,
            residenciaCompleta: `${geo.provincia} / ${geo.distrito} / ${geo.corregimiento} (${geo.zona})`,
            zona: geo.zona,
            tipoAtencion: tipoAten.codigo,
            tipoAtencionDesc: tipoAten.descripcion,
            pap: pap,
            referendo: referendo,
            servicioReferido: servicioReferido,
            diagnostico: `${dx.codigo} - ${dx.descripcion}`,
            diagnosticoCodigo: dx.codigo,
            diagnosticoDesc: dx.descripcion,
            dxTipo: dxTipo,
            esCronico: esCronico,
            procedimiento: proc,
            programa: programa,
            etnia: etnia
        };
    }

    // Generar lista de pacientes para la agenda del día
    function generarAgendaDia(cantidad = 15) {
        const pacientes = [];
        let hora = 7;
        let minuto = 0;

        for (let i = 0; i < cantidad; i++) {
            const p = generarPaciente();
            const horaStr = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
            
            // Los primeros son atendidos, los siguientes en espera, el resto pendientes
            let estado;
            if (i < cantidad * 0.5) {
                estado = "Atendido";
            } else if (i < cantidad * 0.7) {
                estado = "En espera";
            } else {
                estado = "Pendiente";
            }

            pacientes.push({
                ...p,
                hora: horaStr,
                motivo: random(motivosConsulta),
                estado: estado
            });

            minuto += 20;
            if (minuto >= 60) {
                hora++;
                minuto = minuto - 60;
            }
        }
        return pacientes;
    }

    // Generar texto de dictado simulado
    function generarDictadoTexto(paciente) {
        const templates = [
            `Paciente con cédula ${paciente.cedula}, sexo ${paciente.sexo === 'M' ? 'masculino' : 'femenino'}, edad ${paciente.edad} años. Atención de ${paciente.atencion === '1ra vez' ? 'primera vez' : 'subsecuente'}. Diagnóstico: ${paciente.diagnosticoDesc}. Se realizó ${paciente.procedimiento.toLowerCase()}.`,
            `Cédula ${paciente.cedula}. Paciente ${paciente.sexo === 'M' ? 'masculino' : 'femenino'} de ${paciente.edad} años. Consulta ${paciente.atencion === '1ra vez' ? 'de primera vez' : 'subsecuente'}. Impresión diagnóstica: ${paciente.diagnosticoDesc}, código CIE-10 ${paciente.diagnosticoCodigo}. Procedimiento: ${paciente.procedimiento.toLowerCase()}.`,
            `Atención a paciente cédula ${paciente.cedula}, ${paciente.sexo === 'M' ? 'varón' : 'mujer'}, ${paciente.edad} años de edad. Tipo de atención: ${paciente.atencion === '1ra vez' ? 'primera vez' : 'control subsecuente'}. Se diagnostica ${paciente.diagnosticoDesc} con código ${paciente.diagnosticoCodigo}. Se le realiza ${paciente.procedimiento.toLowerCase()}.`
        ];
        return random(templates);
    }

    return {
        geografia,
        diagnosticos,
        procedimientos,
        programas,
        motivosConsulta,
        actividadesAdmin,
        etnias,
        tiposAtencion,
        referendoOpciones,
        generarCedula,
        generarPaciente,
        generarAgendaDia,
        generarDictadoTexto,
        random,
        randomInt
    };

})();
