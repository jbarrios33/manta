/* ============================================
   dictation.js - Simulación de dictado por voz
   ============================================ */

const Dictation = (() => {

    let isRecording = false;
    let currentPatient = null;
    let onDictationComplete = null;

    const elements = {};

    function init(callback) {
        onDictationComplete = callback;
        elements.btnDictate = document.getElementById('btn-dictate');
        elements.btnAdd = document.getElementById('btn-add-dictation');
        elements.transcript = document.getElementById('dictation-transcript');
        elements.micWaves = document.getElementById('mic-waves');
        elements.micLabel = document.querySelector('.mic-label');

        elements.fields = {
            cedula: document.getElementById('dict-cedula'),
            sexo: document.getElementById('dict-sexo'),
            edad: document.getElementById('dict-edad'),
            atencion: document.getElementById('dict-atencion'),
            diagnostico: document.getElementById('dict-diagnostico'),
            procedimiento: document.getElementById('dict-procedimiento')
        };

        elements.statuses = {
            cedula: document.getElementById('status-cedula'),
            sexo: document.getElementById('status-sexo'),
            edad: document.getElementById('status-edad'),
            atencion: document.getElementById('status-atencion'),
            diagnostico: document.getElementById('status-diagnostico'),
            procedimiento: document.getElementById('status-procedimiento')
        };

        elements.btnDictate.addEventListener('click', toggleRecording);
        elements.btnAdd.addEventListener('click', addToReport);
    }

    async function toggleRecording() {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }

    async function startRecording() {
        isRecording = true;
        elements.btnDictate.classList.add('recording');
        elements.micWaves.classList.add('active');
        elements.micLabel.textContent = 'Escuchando...';
        
        // Limpiar campos anteriores
        clearFields();

        // Generar paciente simulado
        currentPatient = DataPanama.generarPaciente();

        // Simular dictado (generar texto y escribirlo)
        const texto = DataPanama.generarDictadoTexto(currentPatient);

        // Esperar un momento para simular que escucha
        await Typewriter.wait(800);

        // Escribir transcript
        await Typewriter.typeTranscript(elements.transcript, texto, 30);

        // Esperar un momento
        await Typewriter.wait(500);

        // Llenar los campos reconocidos uno por uno
        await fillFieldsFromDictation(currentPatient);

        // Detener grabación
        stopRecording();
        
        // Habilitar botón de agregar
        elements.btnAdd.disabled = false;

        // Actualizar estado del widget
        App.updateStatus('✓ Dictado completado - Campos reconocidos exitosamente');
    }

    function stopRecording() {
        isRecording = false;
        elements.btnDictate.classList.remove('recording');
        elements.micWaves.classList.remove('active');
        elements.micLabel.textContent = 'Pulse para dictar';
    }

    async function fillFieldsFromDictation(patient) {
        const fieldData = [
            { key: 'cedula', value: patient.cedula },
            { key: 'sexo', value: patient.sexo === 'M' ? 'Masculino' : 'Femenino' },
            { key: 'edad', value: patient.edadTexto },
            { key: 'atencion', value: patient.atencion },
            { key: 'diagnostico', value: `${patient.diagnosticoCodigo} - ${patient.diagnosticoDesc}` },
            { key: 'procedimiento', value: patient.procedimiento },
        ];

        for (const field of fieldData) {
            await Typewriter.typeInput(elements.fields[field.key], field.value, 25);
            elements.statuses[field.key].classList.add('ok');
            await Typewriter.wait(300);
        }
    }

    function clearFields() {
        Object.values(elements.fields).forEach(f => {
            f.value = '';
            f.classList.remove('filled');
        });
        Object.values(elements.statuses).forEach(s => {
            s.classList.remove('ok');
        });
        elements.btnAdd.disabled = true;
        elements.transcript.innerHTML = '<p class="placeholder-text">El texto dictado aparecerá aquí...</p>';
    }

    function addToReport() {
        if (!currentPatient) return;

        if (onDictationComplete) {
            onDictationComplete(currentPatient);
        }

        // Limpiar para el siguiente
        clearFields();
        currentPatient = null;

        App.updateStatus('✓ Registro agregado al informe desde dictado');
    }

    return {
        init,
        clearFields
    };

})();
