/* ============================================
   import.js - Importar desde HCE simulado
   ============================================ */

const ImportHCE = (() => {

    let isImporting = false;
    let onImportRow = null;

    const elements = {};

    let onResetReport = null;

    function init(callback, resetCallback) {
        onImportRow = callback;
        onResetReport = resetCallback;
        elements.btnImport = document.getElementById('btn-import');
        elements.btnReset = document.getElementById('btn-reset-import');
        elements.progressFill = document.getElementById('progress-fill');
        elements.progressText = document.getElementById('progress-text');
        elements.preview = document.getElementById('import-preview');

        elements.btnImport.addEventListener('click', startImport);
        elements.btnReset.addEventListener('click', resetAndImport);
    }

    function resetAndImport() {
        if (isImporting) return;
        // Limpiar informe y preview
        if (onResetReport) onResetReport();
        elements.preview.innerHTML = '';
        elements.progressFill.style.width = '0%';
        elements.progressText.textContent = 'Listo para importar';
        elements.btnReset.style.display = 'none';
        App.updateStatus('🗑 Informe reiniciado — listo para nueva importación');
        // Iniciar nueva importación automáticamente
        startImport();
    }

    async function startImport() {
        if (isImporting) return;
        isImporting = true;

        elements.btnImport.classList.add('importing');
        elements.btnImport.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Importando...';
        elements.preview.innerHTML = '';

        // Generar entre 5 y 10 pacientes para importar
        const cantidad = DataPanama.randomInt(5, 10);
        const pacientes = [];
        for (let i = 0; i < cantidad; i++) {
            pacientes.push(DataPanama.generarPaciente());
        }

        App.updateStatus(`⟳ Conectando con sistema HCE... Importando ${cantidad} registros`);

        // Simular progreso de importación
        elements.progressText.textContent = 'Conectando con el sistema HCE...';
        await animateProgress(0, 15, 600);

        elements.progressText.textContent = 'Autenticando credenciales...';
        await animateProgress(15, 25, 400);

        elements.progressText.textContent = 'Consultando historias clínicas del día...';
        await animateProgress(25, 40, 800);

        // Importar cada paciente con efecto
        for (let i = 0; i < pacientes.length; i++) {
            const paciente = pacientes[i];
            const progress = 40 + (i / pacientes.length) * 55;

            elements.progressText.textContent = `Importando registro ${i + 1} de ${cantidad}...`;
            await animateProgress(progress, progress + 5, 200);

            // Mostrar preview
            addPreviewItem(paciente);

            // Agregar al informe con efecto typewriter
            if (onImportRow) {
                await onImportRow(paciente);
            }

            await Typewriter.wait(300);
        }

        // Completar
        elements.progressText.textContent = `✓ Importación completa - ${cantidad} registros procesados`;
        await animateProgress(95, 100, 300);

        elements.btnImport.classList.remove('importing');
        elements.btnImport.innerHTML = '<i class="fas fa-cloud-download-alt"></i> Importar del Sistema HCE';
        elements.btnReset.style.display = 'flex';
        isImporting = false;

        App.updateStatus(`✓ Importación completada: ${cantidad} registros del sistema HCE`);
    }

    function animateProgress(from, to, duration) {
        return new Promise((resolve) => {
            const start = performance.now();
            function frame(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const current = from + (to - from) * progress;
                elements.progressFill.style.width = current + '%';

                if (progress < 1) {
                    requestAnimationFrame(frame);
                } else {
                    resolve();
                }
            }
            requestAnimationFrame(frame);
        });
    }

    function addPreviewItem(paciente) {
        const div = document.createElement('div');
        div.className = 'preview-item';
        div.innerHTML = `
            <span class="preview-cedula">${paciente.cedula}</span> - 
            ${paciente.sexo} ${paciente.edadTexto} - 
            <span class="preview-dx">${paciente.diagnosticoCodigo} ${paciente.diagnosticoDesc}</span>
        `;
        elements.preview.appendChild(div);
        elements.preview.scrollTop = elements.preview.scrollHeight;
    }

    return {
        init
    };

})();
