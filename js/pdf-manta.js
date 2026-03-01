/* ============================================
   pdf-manta.js - Generacion de PDF formato RDA-1
   Registro Diario de Actividades - MINSA Panama
   Formato oficial del Sistema Estadistico de Salud
   ============================================ */

const MantaPDF = (() => {

    function init() {
        document.getElementById('btn-generar-pdf').addEventListener('click', generarPDF);
        document.getElementById('btn-historial').addEventListener('click', abrirHistorial);
        document.getElementById('btn-cerrar-historial').addEventListener('click', cerrarHistorial);
        document.getElementById('historial-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'historial-overlay') cerrarHistorial();
        });
    }

    // ============================================
    //  CONSTANTES DEL FORMATO RDA-1
    // ============================================
    const RDA = {
        headers: [
            '#',
            'Ident. del\nPaciente\n(Cedula)',
            'Edad\nDias',
            'Edad\nAnos',
            'Sexo',
            'Nvo\nSub',
            'Residencia del\nPaciente',
            'Tipo\nAtenc.',
            'Diagnostico CIE-X',
            'Cod.\nCIE-X',
            'Tipo\nDx',
            'Procedimiento',
            'Ref.',
            'Prog.',
        ],
        colWidths: [
            7,    // #
            24,   // Cedula
            9,    // Edad Dias
            9,    // Edad Anos
            7,    // Sexo
            8,    // Nvo/Sub
            32,   // Residencia
            9,    // Tipo Atencion
            50,   // Diagnostico
            13,   // Cod CIE-X
            8,    // Tipo Dx
            38,   // Procedimiento
            8,    // Referendo
            18,   // Programa
        ],
        tiposJornada: [
            '1. Horario Normal',
            '2. Extension',
            '3. Extension 2',
            '4. Extension 3',
            '6. Gira',
            '7. Jornada',
            '8. Feria de Salud',
            '10. Red Oportunid.',
        ],
    };

    // ============================================
    //  GENERACION DE PDF - FORMATO RDA-1
    // ============================================
    function generarPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' });

        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const marginL = 8;
        const marginR = 8;
        const contentW = pageW - marginL - marginR;

        const meta = recopilarMetadatos();
        const rows = recopilarFilas();
        const adminEntries = recopilarAdmin();

        let y = drawRDAHeader(doc, pageW, pageH, marginL, contentW, meta);
        y = drawTableHeaders(doc, marginL, y);
        y = drawDataRows(doc, rows, pageW, pageH, marginL, contentW, meta, y);
        y = drawAdminSection(doc, adminEntries, pageW, pageH, marginL, contentW, y);
        y = drawTotalesSection(doc, meta, marginL, contentW, y, pageH);
        drawSignatures(doc, marginL, contentW, pageW, pageH, y);
        drawRDAFooter(doc, pageW, pageH, marginL);

        const nombreArchivo = 'RDA-1_' + meta.fecha.replace(/\//g, '-') + '.pdf';
        doc.save(nombreArchivo);
        App.updateStatus('\u2713 PDF RDA-1 generado: ' + nombreArchivo);
    }

    function recopilarMetadatos() {
        return {
            instalacion: document.getElementById('rpt-establecimiento').textContent,
            codigo: (document.getElementById('rpt-codigo') || {}).textContent || 'CS-BET-001',
            centroProduccion: (document.getElementById('rpt-centro-produccion') || {}).textContent || 'Consulta Externa',
            fecha: document.getElementById('rpt-fecha').textContent,
            funcionario: document.getElementById('rpt-medico').textContent,
            horasConsulta: (document.getElementById('rpt-horas-consulta') || {}).textContent || '8',
            servicio: document.getElementById('rpt-servicio').textContent,
            idoneidad: (document.getElementById('rpt-idoneidad') || {}).textContent || 'MED-12345',
            totalAtenciones: document.getElementById('total-atenciones').textContent,
            totalPrimera: document.getElementById('total-primera').textContent,
            totalSubsecuente: document.getElementById('total-subsecuente').textContent,
        };
    }

    function recopilarFilas() {
        const rows = [];
        const trs = document.getElementById('report-body').querySelectorAll('tr');
        trs.forEach(function(tr) {
            const tds = tr.querySelectorAll('td');
            if (tds.length >= 12) {
                rows.push({
                    num: tds[0].textContent.trim(),
                    cedula: tds[1].textContent.trim(),
                    edadTexto: tds[2].textContent.trim(),
                    sexo: tds[3].textContent.trim(),
                    atencion: tds[4].textContent.trim(),
                    residencia: tds[5].textContent.trim(),
                    tipoAtencion: tds[6].textContent.trim(),
                    diagnosticoDesc: tds[7].textContent.trim(),
                    diagnosticoCodigo: tds[8].textContent.trim(),
                    procedimiento: tds[9].textContent.trim(),
                    referendo: tds[10].textContent.trim(),
                    programa: tds[11].textContent.trim(),
                    dxTipo: tr.dataset.dxtipo || '1N',
                });
            }
        });
        return rows;
    }

    function recopilarAdmin() {
        const entries = [];
        document.querySelectorAll('#admin-activities .admin-entry').forEach(function(entry) {
            entries.push(entry.textContent.trim());
        });
        return entries;
    }

    // ============================================
    //  ENCABEZADO RDA-1 OFICIAL
    // ============================================
    function drawRDAHeader(doc, pageW, pageH, marginL, contentW, meta) {
        var marginR = pageW - marginL - contentW;

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);

        // Logo MINSA (imagen real PNG)
        if (typeof LOGO_MINSA !== 'undefined') {
            doc.addImage(LOGO_MINSA, 'PNG', marginL + 2, 4, 18, 20);
            // Logo derecho (mismo logo MINSA)
            doc.addImage(LOGO_MINSA, 'PNG', pageW - marginR - 20, 4, 18, 20);
        } else {
            // Fallback: circulos simulados si no carga el logo
            doc.setFillColor(0, 90, 156);
            doc.circle(marginL + 10, 14, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(6);
            doc.setFont('helvetica', 'bold');
            doc.text('MINSA', marginL + 10, 13, { align: 'center' });
            doc.setFillColor(0, 90, 156);
            doc.circle(pageW - marginR - 10, 14, 8, 'F');
            doc.text('MINSA', pageW - marginR - 10, 13, { align: 'center' });
        }

        // Titulos institucionales
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('MINISTERIO DE SALUD', pageW / 2, 9, { align: 'center' });
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Sistema Estadistico de Salud', pageW / 2, 14, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('Registro Diario de Actividades', pageW / 2, 20, { align: 'center' });

        // Linea separadora
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(marginL, 23, pageW - marginR, 23);

        // === METADATOS ===
        var my = 25;
        doc.setFontSize(7);
        doc.setTextColor(0, 0, 0);
        doc.setLineWidth(0.2);

        // Fila 1
        doc.setFont('helvetica', 'bold');
        doc.text('INSTALACION:', marginL + 1, my + 3.5);
        doc.setFont('helvetica', 'normal');
        doc.text(meta.instalacion, marginL + 25, my + 3.5);

        doc.setFont('helvetica', 'bold');
        doc.text('CODIGO:', marginL + 75, my + 3.5);
        doc.setFont('helvetica', 'normal');
        doc.text(meta.codigo, marginL + 90, my + 3.5);

        doc.setFont('helvetica', 'bold');
        doc.text('CENTRO DE PRODUCCION:', marginL + 110, my + 3.5);
        doc.setFont('helvetica', 'normal');
        doc.text(meta.centroProduccion, marginL + 150, my + 3.5);

        doc.setFont('helvetica', 'bold');
        doc.text('FECHA:', marginL + 185, my + 3.5);
        doc.setFont('helvetica', 'normal');
        doc.text(meta.fecha, marginL + 197, my + 3.5);

        // Casillas tipo jornada
        var jornadaX = marginL + 215;
        doc.setFontSize(5.5);
        for (var i = 0; i < 4; i++) {
            var jx = jornadaX + (i * 17);
            doc.rect(jx, my, 3, 3, 'S');
            if (i === 0) {
                doc.setFont('helvetica', 'bold');
                doc.text('X', jx + 0.8, my + 2.5);
                doc.setFont('helvetica', 'normal');
            }
            doc.text(RDA.tiposJornada[i], jx + 4, my + 2.5);
        }
        for (var i2 = 4; i2 < Math.min(8, RDA.tiposJornada.length); i2++) {
            var jx2 = jornadaX + ((i2 - 4) * 17);
            doc.rect(jx2, my + 4, 3, 3, 'S');
            doc.text(RDA.tiposJornada[i2], jx2 + 4, my + 6.5);
        }

        my += 6;
        doc.setLineWidth(0.1);
        doc.setDrawColor(180, 180, 180);
        doc.line(marginL, my, pageW - marginR, my);

        my += 1;
        doc.setFontSize(7);
        doc.setDrawColor(0, 0, 0);

        // Fila 2
        doc.setFont('helvetica', 'bold');
        doc.text('FUNCIONARIO:', marginL + 1, my + 3.5);
        doc.setFont('helvetica', 'normal');
        doc.text(meta.funcionario, marginL + 27, my + 3.5);

        doc.setFont('helvetica', 'bold');
        doc.text('HORAS A CONSULTA:', marginL + 90, my + 3.5);
        doc.setFont('helvetica', 'normal');
        doc.text(meta.horasConsulta, marginL + 123, my + 3.5);

        doc.setFont('helvetica', 'bold');
        doc.text('SERVICIO:', marginL + 135, my + 3.5);
        doc.setFont('helvetica', 'normal');
        doc.text(meta.servicio, marginL + 153, my + 3.5);

        doc.setFont('helvetica', 'bold');
        doc.text('IDONEIDAD:', marginL + 195, my + 3.5);
        doc.setFont('helvetica', 'normal');
        doc.text(meta.idoneidad, marginL + 215, my + 3.5);

        my += 6;

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.4);
        doc.line(marginL, my, pageW - marginR, my);

        return my + 1;
    }

    // ============================================
    //  ENCABEZADOS DE TABLA RDA-1
    // ============================================
    function drawTableHeaders(doc, marginL, y) {
        var headerH = 12;
        var totalW = RDA.colWidths.reduce(function(a, b) { return a + b; }, 0);

        doc.setFillColor(230, 235, 240);
        doc.rect(marginL, y, totalW, headerH, 'F');

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.rect(marginL, y, totalW, headerH, 'S');

        doc.setFontSize(5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);

        var x = marginL;
        RDA.headers.forEach(function(h, i) {
            if (i > 0) {
                doc.line(x, y, x, y + headerH);
            }
            var lines = h.split('\n');
            var lineH = 3;
            var startY = y + (headerH - lines.length * lineH) / 2 + lineH - 0.5;
            lines.forEach(function(line, li) {
                doc.text(line, x + RDA.colWidths[i] / 2, startY + li * lineH, { align: 'center' });
            });
            x += RDA.colWidths[i];
        });

        return y + headerH;
    }

    // ============================================
    //  FILAS DE DATOS
    // ============================================
    function drawDataRows(doc, rows, pageW, pageH, marginL, contentW, meta, y) {
        var totalW = RDA.colWidths.reduce(function(a, b) { return a + b; }, 0);
        var rowH = 5.5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.5);

        var dataRows = rows.length > 0 ? rows : [];
        var totalFilas = Math.max(dataRows.length, 18);

        for (var idx = 0; idx < totalFilas; idx++) {
            if (y + rowH > pageH - 40) {
                doc.addPage();
                y = drawRDAHeader(doc, pageW, pageH, marginL, contentW, meta);
                y = drawTableHeaders(doc, marginL, y);
            }

            var fc = idx % 2 === 0 ? [255, 255, 255] : [245, 247, 250];
            doc.setFillColor(fc[0], fc[1], fc[2]);
            doc.rect(marginL, y, totalW, rowH, 'F');

            doc.setDrawColor(180, 180, 180);
            doc.setLineWidth(0.15);
            doc.rect(marginL, y, totalW, rowH, 'S');

            var cx = marginL;
            RDA.colWidths.forEach(function(w, i) {
                if (i > 0) doc.line(cx, y, cx, y + rowH);
                cx += w;
            });

            if (idx < dataRows.length) {
                var row = dataRows[idx];
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(5.5);

                var values = rowToArray(row, idx);
                var rx = marginL;
                values.forEach(function(cell, ci) {
                    var cellW = RDA.colWidths[ci] - 1;
                    var txt = doc.splitTextToSize(cell, cellW);
                    doc.text(txt, rx + 0.5, y + 3.5, { maxWidth: cellW });
                    rx += RDA.colWidths[ci];
                });
            } else {
                doc.setTextColor(200, 200, 200);
                doc.text((idx + 1).toString(), marginL + 0.5, y + 3.5);
            }

            y += rowH;
        }

        return y;
    }

    function rowToArray(row, idx) {
        var edadDias = '', edadAnos = '';
        var edadTxt = row.edadTexto || '';
        if (edadTxt.indexOf('d') >= 0 || edadTxt.indexOf('m') >= 0) {
            edadDias = edadTxt;
        } else {
            edadAnos = edadTxt.replace('a', '');
        }

        return [
            row.num || (idx + 1).toString(),
            row.cedula || '',
            edadDias,
            edadAnos,
            row.sexo || '',
            row.atencion || '',
            row.residencia || '',
            row.tipoAtencion || 'C',
            row.diagnosticoDesc || '',
            row.diagnosticoCodigo || '',
            row.dxTipo || '1N',
            row.procedimiento || '',
            row.referendo || '',
            row.programa || '',
        ];
    }

    // ============================================
    //  SECCION DE ACTIVIDADES ADMINISTRATIVAS
    // ============================================
    function drawAdminSection(doc, adminEntries, pageW, pageH, marginL, contentW, y) {
        y += 2;
        if (y > pageH - 45) {
            doc.addPage();
            y = 15;
        }

        var totalW = RDA.colWidths.reduce(function(a, b) { return a + b; }, 0);

        doc.setFillColor(230, 235, 240);
        doc.rect(marginL, y, totalW, 5, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.rect(marginL, y, totalW, 5, 'S');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('ACTIVIDADES ADMINISTRATIVAS', marginL + totalW / 2, y + 3.5, { align: 'center' });

        y += 5;

        doc.setFillColor(245, 247, 250);
        doc.rect(marginL, y, totalW * 0.75, 5, 'F');
        doc.rect(marginL + totalW * 0.75, y, totalW * 0.25, 5, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.2);
        doc.rect(marginL, y, totalW * 0.75, 5, 'S');
        doc.rect(marginL + totalW * 0.75, y, totalW * 0.25, 5, 'S');
        doc.setFontSize(6);
        doc.setFont('helvetica', 'bold');
        doc.text('ACTIVIDAD', marginL + 2, y + 3.5);
        doc.text('TIEMPO UTILIZADO', marginL + totalW * 0.75 + 2, y + 3.5);
        y += 5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.5);

        var maxAdmin = Math.max(adminEntries.length, 3);
        for (var i = 0; i < maxAdmin; i++) {
            doc.setDrawColor(180, 180, 180);
            doc.setLineWidth(0.15);
            doc.rect(marginL, y, totalW * 0.75, 5, 'S');
            doc.rect(marginL + totalW * 0.75, y, totalW * 0.25, 5, 'S');

            if (i < adminEntries.length) {
                doc.setTextColor(0, 0, 0);
                doc.text(adminEntries[i], marginL + 1, y + 3.5, { maxWidth: totalW * 0.73 });
            }
            y += 5;
        }

        return y;
    }

    // ============================================
    //  TOTALES Y FIRMAS
    // ============================================
    function drawTotalesSection(doc, meta, marginL, contentW, y, pageH) {
        y += 3;
        if (y > pageH - 30) {
            doc.addPage();
            y = 15;
        }

        var totalW = RDA.colWidths.reduce(function(a, b) { return a + b; }, 0);

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.setFillColor(232, 240, 248);
        doc.rect(marginL, y, totalW, 8, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);

        doc.text('TOTAL ATENCIONES: ' + meta.totalAtenciones, marginL + 10, y + 5.5);
        doc.text('PRIMERA VEZ (Nvo): ' + meta.totalPrimera, marginL + 80, y + 5.5);
        doc.text('SUBSECUENTES (Sub): ' + meta.totalSubsecuente, marginL + 155, y + 5.5);

        return y + 8;
    }

    function drawSignatures(doc, marginL, contentW, pageW, pageH, y) {
        y += 8;
        if (y > pageH - 20) {
            doc.addPage();
            y = 20;
        }

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(0, 0, 0);

        var firmaX1 = marginL + 25;
        doc.line(firmaX1, y, firmaX1 + 55, y);
        doc.text('Firma del Funcionario', firmaX1 + 10, y + 4);

        var firmaX2 = pageW - marginL - contentW / 2 + 20;
        doc.line(firmaX2, y, firmaX2 + 55, y);
        doc.text('Firma del Director / Jefe de Servicio', firmaX2 + 2, y + 4);
        doc.text('Vo.Bo.', firmaX2 + 22, y + 8);
    }

    // ============================================
    //  PIE DE PAGINA
    // ============================================
    function drawRDAFooter(doc, pageW, pageH, marginL) {
        var totalPages = doc.internal.getNumberOfPages();
        for (var i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.3);
            doc.line(marginL, pageH - 8, pageW - marginL, pageH - 8);
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(6);
            doc.setFont('helvetica', 'normal');
            doc.text('MINSA - Sistema Estadistico de Salud | Registro Diario de Actividades (RDA-1)', marginL + 2, pageH - 4);
            doc.text('Pagina ' + i + ' de ' + totalPages, pageW - marginL - 2, pageH - 4, { align: 'right' });
        }
    }

    // ============================================
    //  HISTORIAL DE MANTAS ANTERIORES
    // ============================================
    function abrirHistorial() {
        var overlay = document.getElementById('historial-overlay');
        overlay.classList.add('historial-visible');
        generarListaHistorial();
    }

    function cerrarHistorial() {
        var overlay = document.getElementById('historial-overlay');
        overlay.classList.remove('historial-visible');
    }

    function generarListaHistorial() {
        var tbody = document.getElementById('historial-body');
        tbody.innerHTML = '';

        var hoy = new Date();
        var entries = [];

        var dia = new Date(hoy);
        dia.setDate(dia.getDate() - 1);

        for (var i = 0; i < 40; i++) {
            while (dia.getDay() === 0 || dia.getDay() === 6) {
                dia.setDate(dia.getDate() - 1);
            }

            var totalAten = DataPanama.randomInt(8, 22);
            var primera = DataPanama.randomInt(2, Math.floor(totalAten * 0.5));
            var subsec = totalAten - primera;
            var adminCount = DataPanama.randomInt(0, 3);

            entries.push({
                fecha: new Date(dia),
                totalAtenciones: totalAten,
                primeraVez: primera,
                subsecuente: subsec,
                adminActividades: adminCount,
            });

            dia.setDate(dia.getDate() - 1);
        }

        entries.forEach(function(entry, idx) {
            var fechaStr = entry.fecha.toLocaleDateString('es-PA', {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
            });

            var tr = document.createElement('tr');
            tr.innerHTML = '<td>' + fechaStr + '</td>' +
                '<td>' + entry.totalAtenciones + '</td>' +
                '<td>' + entry.primeraVez + '</td>' +
                '<td>' + entry.subsecuente + '</td>' +
                '<td>' + entry.adminActividades + '</td>' +
                '<td>' +
                    '<button class="badge-action view btn-ver-manta" data-idx="' + idx + '">' +
                        '<i class="fas fa-eye"></i> Ver' +
                    '</button>' +
                    '<button class="badge-action view btn-pdf-manta" data-idx="' + idx + '" style="margin-left:4px; background:#d4edda; color:#155724;">' +
                        '<i class="fas fa-file-pdf"></i> PDF' +
                    '</button>' +
                '</td>';
            tbody.appendChild(tr);
        });

        document.querySelectorAll('.btn-pdf-manta').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var idx = parseInt(btn.dataset.idx);
                generarPDFHistorico(entries[idx]);
            });
        });

        document.querySelectorAll('.btn-ver-manta').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var idx = parseInt(btn.dataset.idx);
                cargarMantaHistorica(entries[idx]);
            });
        });
    }

    // ============================================
    //  PDF HISTORICO (misma estructura RDA-1)
    // ============================================
    function generarPDFHistorico(entry) {
        var jsPDFLib = window.jspdf;
        var doc = new jsPDFLib.jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' });

        var pageW = doc.internal.pageSize.getWidth();
        var pageH = doc.internal.pageSize.getHeight();
        var marginL = 8;
        var marginR = 8;
        var contentW = pageW - marginL - marginR;

        var meta = {
            instalacion: 'Centro de Salud de Betania',
            codigo: 'CS-BET-001',
            centroProduccion: 'Consulta Externa',
            fecha: entry.fecha.toLocaleDateString('es-PA'),
            funcionario: 'Dr. Carlos Martinez',
            horasConsulta: '8',
            servicio: 'Medicina General',
            idoneidad: 'MED-12345',
            totalAtenciones: entry.totalAtenciones.toString(),
            totalPrimera: entry.primeraVez.toString(),
            totalSubsecuente: entry.subsecuente.toString(),
        };

        var y = drawRDAHeader(doc, pageW, pageH, marginL, contentW, meta);
        y = drawTableHeaders(doc, marginL, y);

        var totalRows = entry.totalAtenciones;
        var primeraCount = 0;
        var subsecCount = 0;
        var rows = [];

        for (var i = 0; i < totalRows; i++) {
            var paciente = DataPanama.generarPaciente();

            if (primeraCount < entry.primeraVez && (subsecCount >= entry.subsecuente || Math.random() > 0.5)) {
                paciente.atencion = '1ra vez';
                paciente.atencionCod = '1';
                primeraCount++;
            } else {
                paciente.atencion = 'Subsec.';
                paciente.atencionCod = '2';
                subsecCount++;
            }

            rows.push({
                num: (i + 1).toString(),
                cedula: paciente.cedula,
                edadTexto: paciente.edadTexto,
                sexo: paciente.sexo,
                atencion: paciente.atencionCod || (paciente.atencion === '1ra vez' ? '1' : '2'),
                residencia: paciente.residencia,
                tipoAtencion: paciente.tipoAtencion || 'C',
                diagnosticoDesc: paciente.diagnosticoDesc,
                diagnosticoCodigo: paciente.diagnosticoCodigo,
                procedimiento: paciente.procedimiento,
                referendo: paciente.referendo || '',
                programa: paciente.programa,
            });
        }

        y = drawDataRows(doc, rows, pageW, pageH, marginL, contentW, meta, y);

        var adminEntries = [];
        for (var j = 0; j < entry.adminActividades; j++) {
            var act = DataPanama.random(DataPanama.actividadesAdmin);
            adminEntries.push(act.tipo + ': ' + act.descripcion + ' (' + act.duracion + 'h)');
        }

        y = drawAdminSection(doc, adminEntries, pageW, pageH, marginL, contentW, y);
        y = drawTotalesSection(doc, meta, marginL, contentW, y, pageH);
        drawSignatures(doc, marginL, contentW, pageW, pageH, y);
        drawRDAFooter(doc, pageW, pageH, marginL);

        var nombreArchivo = 'RDA-1_' + meta.fecha.replace(/\//g, '-') + '.pdf';
        doc.save(nombreArchivo);
        App.updateStatus('\u2713 PDF RDA-1 historico generado: ' + nombreArchivo);
    }

    // ============================================
    //  CARGAR MANTA HISTORICA EN EL WIDGET
    // ============================================
    async function cargarMantaHistorica(entry) {
        cerrarHistorial();

        var reportBody = document.getElementById('report-body');
        reportBody.innerHTML = '';

        var fecha = entry.fecha.toLocaleDateString('es-PA');
        document.getElementById('rpt-fecha').textContent = fecha;
        document.getElementById('admin-activities').innerHTML = '';

        App.resetCounters();
        App.updateStatus('\u21BB Cargando manta del ' + fecha + '...');

        var primeraCount = 0;
        var subsecCount = 0;

        for (var i = 0; i < entry.totalAtenciones; i++) {
            var paciente = DataPanama.generarPaciente();

            if (primeraCount < entry.primeraVez && (subsecCount >= entry.subsecuente || Math.random() > 0.5)) {
                paciente.atencion = '1ra vez';
                paciente.atencionCod = '1';
                primeraCount++;
            } else {
                paciente.atencion = 'Subsec.';
                paciente.atencionCod = '2';
                subsecCount++;
            }

            await App.addRowToReportAsync(paciente);
            await Typewriter.wait(150);
        }

        for (var j = 0; j < entry.adminActividades; j++) {
            var act = DataPanama.random(DataPanama.actividadesAdmin);
            App.addAdminEntryPublic(act.tipo, act.descripcion, act.duracion);
            await Typewriter.wait(300);
        }

        App.updateStatus('\u2713 Manta del ' + fecha + ' cargada: ' + entry.totalAtenciones + ' atenciones');
    }

    return { init: init };

})();
