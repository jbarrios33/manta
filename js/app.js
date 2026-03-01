/* ============================================
   app.js - Aplicación principal del Widget Manta
   ============================================ */

const App = (() => {

    let rowCounter = 0;
    let totalPrimera = 0;
    let totalSubsecuente = 0;

    const elements = {};

    // ---- Inicialización ----
    function init() {
        cacheElements();
        setupDate();
        generateAgenda();
        setupEventListeners();
        setupTabs();

        // Inicializar módulos
        Dictation.init(addRowToReport);
        ImportHCE.init(addRowToReportAsync, resetReport);
        MantaPDF.init();

        // Mostrar widget al cargar (con delay para efecto)
        setTimeout(() => {
            openWidget();
        }, 1500);
    }

    function cacheElements() {
        elements.widget = document.getElementById('manta-widget');
        elements.minimized = document.getElementById('manta-minimized');
        elements.btnOpen = document.getElementById('btn-open-manta');
        elements.btnClose = document.getElementById('btn-close');
        elements.btnMinimize = document.getElementById('btn-minimize');
        elements.reportBody = document.getElementById('report-body');
        elements.adminActivities = document.getElementById('admin-activities');
        elements.statusText = document.getElementById('widget-status-text');
        elements.totalAtenciones = document.getElementById('total-atenciones');
        elements.totalPrimera = document.getElementById('total-primera');
        elements.totalSubsecuente = document.getElementById('total-subsecuente');
        elements.rptFecha = document.getElementById('rpt-fecha');
        elements.desktopDate = document.getElementById('desktop-date');
        elements.agendaBody = document.getElementById('agenda-body');
    }

    function setupDate() {
        const hoy = new Date();
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fechaStr = hoy.toLocaleDateString('es-PA', opciones);
        const fechaCorta = hoy.toLocaleDateString('es-PA');

        elements.rptFecha.textContent = fechaCorta;
        elements.desktopDate.textContent = fechaStr.charAt(0).toUpperCase() + fechaStr.slice(1);
    }

    function generateAgenda() {
        const pacientes = DataPanama.generarAgendaDia(15);
        elements.agendaBody.innerHTML = '';

        pacientes.forEach(p => {
            const tr = document.createElement('tr');
            const statusClass = p.estado === 'Atendido' ? 'status-atendido' :
                                p.estado === 'En espera' ? 'status-espera' : 'status-pendiente';
            
            tr.innerHTML = `
                <td>${p.hora}</td>
                <td>${p.nombre}</td>
                <td>${p.cedula}</td>
                <td>${p.motivo}</td>
                <td><span class="status-badge ${statusClass}">${p.estado}</span></td>
            `;
            elements.agendaBody.appendChild(tr);
        });
    }

    // ---- Event Listeners ----
    function setupEventListeners() {
        elements.btnOpen.addEventListener('click', openWidget);
        elements.btnClose.addEventListener('click', closeWidget);
        elements.btnMinimize.addEventListener('click', minimizeWidget);
        elements.minimized.addEventListener('click', openWidget);

        // Admin buttons
        document.getElementById('btn-add-admin').addEventListener('click', addAdminActivity);
        document.getElementById('btn-simulate-admin').addEventListener('click', simulateAdminActivities);

        // Sidebar navigation
        setupSidebarNavigation();
    }

    function setupSidebarNavigation() {
        const sidebarItems = document.querySelectorAll('.sidebar-item[data-section]');
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                // Update active sidebar item
                document.querySelectorAll('.sidebar-item').forEach(si => si.classList.remove('active'));
                item.classList.add('active');

                // Show the corresponding section
                const sectionId = 'section-' + item.dataset.section;
                document.querySelectorAll('.desktop-section').forEach(s => s.classList.remove('active'));
                const target = document.getElementById(sectionId);
                if (target) {
                    target.classList.add('active');
                }
            });
        });

        // Generate content for all sections
        generateHistorias();
        generateRecetas();
        generateLaboratorio();
        generateImagenes();
    }

    // ---- Simulated Section Data ----
    function generateHistorias() {
        const tbody = document.getElementById('historias-body');
        const pacientes = DataPanama.generarAgendaDia(12);
        tbody.innerHTML = '';
        pacientes.forEach(p => {
            const diasAtras = DataPanama.randomInt(0, 60);
            const fecha = new Date();
            fecha.setDate(fecha.getDate() - diasAtras);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.cedula}</td>
                <td>${p.nombre}</td>
                <td>${p.edadTexto}</td>
                <td>${p.sexo}</td>
                <td><small>${p.diagnosticoCodigo}</small> ${p.diagnosticoDesc}</td>
                <td>${fecha.toLocaleDateString('es-PA')}</td>
                <td><button class="badge-action view" onclick="alert('Vista de historia clínica simulada para ${p.nombre}.')"><i class="fas fa-eye"></i> Ver</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    function generateRecetas() {
        const tbody = document.getElementById('recetas-body');
        const medicamentos = [
            { nombre: 'Amoxicilina 500mg', dosis: '1 cap c/8h', duracion: '7 días' },
            { nombre: 'Losartán 50mg', dosis: '1 tab c/24h', duracion: 'Continuo' },
            { nombre: 'Metformina 850mg', dosis: '1 tab c/12h', duracion: 'Continuo' },
            { nombre: 'Omeprazol 20mg', dosis: '1 cap c/24h', duracion: '14 días' },
            { nombre: 'Ibuprofeno 400mg', dosis: '1 tab c/8h', duracion: '5 días' },
            { nombre: 'Acetaminofén 500mg', dosis: '1-2 tab c/6h', duracion: '3 días' },
            { nombre: 'Loratadina 10mg', dosis: '1 tab c/24h', duracion: '10 días' },
            { nombre: 'Atorvastatina 20mg', dosis: '1 tab c/24h', duracion: 'Continuo' },
            { nombre: 'Salbutamol inhalador', dosis: '2 puff c/6h PRN', duracion: '30 días' },
            { nombre: 'Diclofenaco 50mg', dosis: '1 tab c/12h', duracion: '5 días' },
            { nombre: 'Ciprofloxacina 500mg', dosis: '1 tab c/12h', duracion: '7 días' },
            { nombre: 'Amlodipino 5mg', dosis: '1 tab c/24h', duracion: 'Continuo' },
        ];
        const pacientes = DataPanama.generarAgendaDia(10);
        tbody.innerHTML = '';
        pacientes.forEach(p => {
            const med = DataPanama.random(medicamentos);
            const estados = ['Dispensada', 'Dispensada', 'Pendiente', 'Dispensada'];
            const estado = DataPanama.random(estados);
            const statusClass = estado === 'Dispensada' ? 'status-atendido' : 'status-espera';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.hora}</td>
                <td>${p.nombre}</td>
                <td>${p.cedula}</td>
                <td>${med.nombre}</td>
                <td>${med.dosis}</td>
                <td>${med.duracion}</td>
                <td><span class="status-badge ${statusClass}">${estado}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    function generateLaboratorio() {
        const tbody = document.getElementById('laboratorio-body');
        const examenes = [
            'Hemograma completo', 'Glucosa en ayunas', 'Perfil lipídico', 'Creatinina sérica',
            'Examen general de orina', 'HbA1c (hemoglobina glicosilada)', 'TSH (tiroides)',
            'Ácido úrico', 'Transaminasas (TGO/TGP)', 'Prueba de embarazo', 'VDRL',
            'HIV (prueba rápida)', 'Heces por parásitos', 'Urocultivo', 'BHC'
        ];
        const prioridades = ['Rutina', 'Rutina', 'Rutina', 'Urgente'];
        const pacientes = DataPanama.generarAgendaDia(10);
        tbody.innerHTML = '';
        pacientes.forEach(p => {
            const examen = DataPanama.random(examenes);
            const prioridad = DataPanama.random(prioridades);
            const estadosLab = ['Resultado disponible', 'Resultado disponible', 'En proceso', 'Pendiente muestra'];
            const estado = DataPanama.random(estadosLab);
            const esNormal = Math.random() > 0.25;
            let resultadoHTML;
            if (estado === 'Resultado disponible') {
                resultadoHTML = esNormal 
                    ? '<span class="badge-result badge-normal">Normal</span>'
                    : '<span class="badge-result badge-anormal">Anormal</span>';
            } else {
                resultadoHTML = '<span class="badge-result badge-pendiente-lab">—</span>';
            }
            const statusClass = estado === 'Resultado disponible' ? 'status-atendido' :
                                estado === 'En proceso' ? 'status-espera' : 'status-pendiente';
            const fecha = new Date();
            fecha.setDate(fecha.getDate() - DataPanama.randomInt(0, 5));
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${fecha.toLocaleDateString('es-PA')}</td>
                <td>${p.nombre}</td>
                <td>${p.cedula}</td>
                <td>${examen}</td>
                <td><span class="status-badge ${prioridad === 'Urgente' ? 'status-espera' : 'status-atendido'}">${prioridad}</span></td>
                <td><span class="status-badge ${statusClass}">${estado}</span></td>
                <td>${resultadoHTML}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function generateImagenes() {
        const tbody = document.getElementById('imagenes-body');
        const estudios = [
            { tipo: 'Radiografía', regiones: ['Tórax PA', 'Columna lumbar', 'Rodilla', 'Mano', 'Tobillo', 'Tórax lateral'] },
            { tipo: 'Ultrasonido', regiones: ['Abdomen completo', 'Pélvico', 'Obstétrico', 'Renal', 'Tiroides', 'Mama'] },
            { tipo: 'Tomografía', regiones: ['Cráneo simple', 'Tórax', 'Abdomen y pelvis', 'Columna'] },
            { tipo: 'Mamografía', regiones: ['Bilateral', 'Unilateral derecha', 'Unilateral izquierda'] },
        ];
        const pacientes = DataPanama.generarAgendaDia(8);
        tbody.innerHTML = '';
        pacientes.forEach(p => {
            const estudio = DataPanama.random(estudios);
            const region = DataPanama.random(estudio.regiones);
            const estadosImg = ['Informe listo', 'Informe listo', 'Pendiente informe', 'Programado'];
            const estado = DataPanama.random(estadosImg);
            const statusClass = estado === 'Informe listo' ? 'status-atendido' :
                                estado === 'Pendiente informe' ? 'status-espera' : 'status-pendiente';
            const fecha = new Date();
            fecha.setDate(fecha.getDate() - DataPanama.randomInt(0, 7));
            const verBtn = estado === 'Informe listo' 
                ? `<button class="badge-action view" onclick="alert('Visualizador DICOM simulado: ${estudio.tipo} - ${region} de ${p.nombre}')"><i class="fas fa-eye"></i> Ver</button>`
                : '<span style="color:#aaa">—</span>';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${fecha.toLocaleDateString('es-PA')}</td>
                <td>${p.nombre}</td>
                <td>${p.cedula}</td>
                <td>${estudio.tipo}</td>
                <td>${region}</td>
                <td><span class="status-badge ${statusClass}">${estado}</span></td>
                <td>${verBtn}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Deactivate all
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                // Activate clicked
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab).classList.add('active');
            });
        });
    }

    // ---- Widget Control ----
    function openWidget() {
        elements.widget.classList.remove('widget-hidden');
        elements.widget.classList.add('widget-visible');
        elements.minimized.classList.remove('minimized-visible');
        elements.minimized.classList.add('minimized-hidden');
    }

    function closeWidget() {
        elements.widget.classList.remove('widget-visible');
        elements.widget.classList.add('widget-hidden');
        elements.minimized.classList.remove('minimized-hidden');
        elements.minimized.classList.add('minimized-visible');
    }

    function minimizeWidget() {
        closeWidget();
    }

    // ---- Report Management ----
    function addRowToReport(patient) {
        rowCounter++;
        const isFirst = patient.atencion === '1ra vez';
        if (isFirst) totalPrimera++;
        else totalSubsecuente++;

        const tr = createReportRow();
        tr.dataset.dxtipo = patient.dxTipo || '1N';
        elements.reportBody.appendChild(tr);

        // Scroll to new row
        const container = document.querySelector('.report-table-container');
        container.scrollTop = container.scrollHeight;

        // Type the row (fire and forget for dictation mode)
        const data = { ...patient, num: rowCounter };
        Typewriter.typeRow(tr, data, () => {
            updateTotals();
        });
    }

    async function addRowToReportAsync(patient) {
        rowCounter++;
        const isFirst = patient.atencion === '1ra vez';
        if (isFirst) totalPrimera++;
        else totalSubsecuente++;

        const tr = createReportRow();
        tr.dataset.dxtipo = patient.dxTipo || '1N';
        elements.reportBody.appendChild(tr);

        // Scroll to new row
        const container = document.querySelector('.report-table-container');
        container.scrollTop = container.scrollHeight;

        const data = { ...patient, num: rowCounter };
        await Typewriter.typeRow(tr, data);
        updateTotals();
    }

    function createReportRow() {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        `;
        return tr;
    }

    function updateTotals() {
        const total = totalPrimera + totalSubsecuente;
        elements.totalAtenciones.textContent = total;
        elements.totalPrimera.textContent = totalPrimera;
        elements.totalSubsecuente.textContent = totalSubsecuente;
    }

    function resetReport() {
        // Limpiar todas las filas del informe
        elements.reportBody.innerHTML = '';
        rowCounter = 0;
        totalPrimera = 0;
        totalSubsecuente = 0;
        updateTotals();
    }

    // ---- Admin Activities ----
    function addAdminActivity() {
        const tipo = document.getElementById('admin-tipo');
        const desc = document.getElementById('admin-descripcion');
        const dur = document.getElementById('admin-duracion');

        if (!tipo.value || !desc.value) {
            updateStatus('⚠ Complete el tipo y descripción de la actividad');
            return;
        }

        createAdminEntry(tipo.value, desc.value, parseFloat(dur.value));

        // Clear form
        tipo.value = '';
        desc.value = '';
        dur.value = '1';

        updateStatus('✓ Actividad administrativa agregada al informe');
    }

    async function simulateAdminActivities() {
        const actividades = DataPanama.actividadesAdmin;
        const cantidad = DataPanama.randomInt(2, 4);
        const seleccionadas = [];

        // Seleccionar actividades aleatorias sin repetir
        const indices = new Set();
        while (indices.size < cantidad && indices.size < actividades.length) {
            indices.add(DataPanama.randomInt(0, actividades.length - 1));
        }

        updateStatus('⟳ Simulando actividades administrativas...');

        for (const idx of indices) {
            const act = actividades[idx];
            createAdminEntry(act.tipo, act.descripcion, act.duracion);
            await Typewriter.wait(600);
        }

        updateStatus(`✓ ${indices.size} actividades administrativas simuladas`);
    }

    function createAdminEntry(tipo, descripcion, duracion) {
        const div = document.createElement('div');
        div.className = 'admin-entry';
        div.innerHTML = `
            <span class="admin-type">${tipo}:</span> ${descripcion}
            <span class="admin-dur">(${duracion}h)</span>
        `;
        elements.adminActivities.appendChild(div);
    }

    // ---- Status ----
    function updateStatus(message) {
        elements.statusText.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    }

    function resetCounters() {
        rowCounter = 0;
        totalPrimera = 0;
        totalSubsecuente = 0;
        updateTotals();
    }

    function addAdminEntryPublic(tipo, descripcion, duracion) {
        createAdminEntry(tipo, descripcion, duracion);
    }

    // ---- Public API ----
    return {
        init,
        updateStatus,
        addRowToReport,
        addRowToReportAsync,
        resetCounters,
        addAdminEntryPublic
    };

})();

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', App.init);
