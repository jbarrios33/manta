/* ============================================
   dictation.js - Dictado por voz (Real + Simulado)
   
   Mic 1 (Real): Web Speech API - reconoce voz real
   Mic 2 (Simulado): Typewriter demo con datos generados
   ============================================ */

const Dictation = (() => {

    let isRecording = false;
    let isRealRecording = false;
    let currentPatient = null;
    let onDictationComplete = null;
    let recognition = null;
    let speechSupported = false;

    const elements = {};

    function init(callback) {
        onDictationComplete = callback;

        // Elementos comunes
        elements.btnAdd = document.getElementById('btn-add-dictation');
        elements.transcript = document.getElementById('dictation-transcript');
        elements.speechStatus = document.getElementById('speech-status');
        elements.guide = document.getElementById('dictation-guide');

        // Mic simulado (demo)
        elements.btnDictate = document.getElementById('btn-dictate');
        elements.micWaves = document.getElementById('mic-waves');

        // Mic real (Web Speech API)
        elements.btnDictateReal = document.getElementById('btn-dictate-real');
        elements.micWavesReal = document.getElementById('mic-waves-real');

        // Campos reconocidos
        elements.fields = {
            cedula: document.getElementById('dict-cedula'),
            sexo: document.getElementById('dict-sexo'),
            edad: document.getElementById('dict-edad'),
            atencion: document.getElementById('dict-atencion'),
            residencia: document.getElementById('dict-residencia'),
            diagnostico: document.getElementById('dict-diagnostico'),
            procedimiento: document.getElementById('dict-procedimiento')
        };

        elements.statuses = {
            cedula: document.getElementById('status-cedula'),
            sexo: document.getElementById('status-sexo'),
            edad: document.getElementById('status-edad'),
            atencion: document.getElementById('status-atencion'),
            residencia: document.getElementById('status-residencia'),
            diagnostico: document.getElementById('status-diagnostico'),
            procedimiento: document.getElementById('status-procedimiento')
        };

        // Listeners
        elements.btnDictate.addEventListener('click', toggleSimulatedRecording);
        elements.btnDictateReal.addEventListener('click', toggleRealRecording);
        elements.btnAdd.addEventListener('click', addToReport);

        // Inicializar Web Speech API
        initSpeechRecognition();
    }

    // ============================================
    //  WEB SPEECH API - INICIALIZACION
    // ============================================
    function initSpeechRecognition() {
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            speechSupported = false;
            elements.btnDictateReal.title = 'Tu navegador no soporta reconocimiento de voz';
            elements.btnDictateReal.style.opacity = '0.5';
            updateSpeechStatus('⚠ Navegador sin soporte de voz', 'warning');
            return;
        }

        speechSupported = true;
        recognition = new SpeechRecognition();
        recognition.lang = 'es-PA';
        recognition.interimResults = true;
        recognition.continuous = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = function() {
            isRealRecording = true;
            elements.btnDictateReal.classList.add('recording');
            elements.micWavesReal.classList.add('active');
            updateSpeechStatus('��� Escuchando... Hable ahora', 'recording');
            elements.guide.classList.add('guide-active');
        };

        recognition.onresult = function(event) {
            var finalTranscript = '';
            var interimTranscript = '';

            for (var i = event.resultIndex; i < event.results.length; i++) {
                var transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            // Mostrar transcripcion en tiempo real
            var displayText = '';
            if (finalTranscript) {
                displayText = '<span class="transcript-text">' + finalTranscript + '</span>';
            }
            if (interimTranscript) {
                displayText += '<span class="transcript-interim">' + interimTranscript + '</span>';
            }
            if (displayText) {
                elements.transcript.innerHTML = displayText;
            }

            // Parsear cuando hay texto final
            if (finalTranscript && finalTranscript.length > 15) {
                parseRealDictation(finalTranscript);
            }
        };

        recognition.onerror = function(event) {
            var msg = 'Error: ';
            switch (event.error) {
                case 'no-speech':
                    msg = '⚠ No se detectó voz. Intente de nuevo.';
                    break;
                case 'audio-capture':
                    msg = '⚠ No se encontró micrófono. Verifique su dispositivo.';
                    break;
                case 'not-allowed':
                    msg = '⚠ Permiso de micrófono denegado. Habilítelo en su navegador.';
                    break;
                default:
                    msg += event.error;
            }
            updateSpeechStatus(msg, 'error');
            stopRealRecording();
        };

        recognition.onend = function() {
            if (isRealRecording) {
                // Si el usuario no lo detuvo manualmente, parar
                stopRealRecording();
            }
        };
    }

    // ============================================
    //  MIC REAL - CONTROL
    // ============================================
    function toggleRealRecording() {
        if (!speechSupported) {
            updateSpeechStatus('⚠ Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.', 'error');
            return;
        }
        if (isRecording) return; // No permitir si el simulado esta activo

        if (isRealRecording) {
            stopRealRecording();
        } else {
            startRealRecording();
        }
    }

    function startRealRecording() {
        clearFields();
        currentPatient = null;
        isRealRecording = true;

        try {
            recognition.start();
        } catch (e) {
            updateSpeechStatus('⚠ Error al iniciar: ' + e.message, 'error');
            isRealRecording = false;
        }
    }

    function stopRealRecording() {
        isRealRecording = false;
        elements.btnDictateReal.classList.remove('recording');
        elements.micWavesReal.classList.remove('active');
        elements.guide.classList.remove('guide-active');

        try {
            recognition.stop();
        } catch (e) { /* ya detenido */ }

        if (currentPatient) {
            updateSpeechStatus('✓ Dictado capturado. Revise los campos y agregue al informe.', 'success');
        } else {
            updateSpeechStatus('Dictado detenido.', '');
        }
    }

    // ============================================
    //  PARSEO DE TEXTO REAL DICTADO
    // ============================================
    function parseRealDictation(text) {
        var t = text.toLowerCase().trim();
        var parsed = {};

        // --- CEDULA: buscar patron X-XXX-XXXX o "cedula" seguido de numeros ---
        var cedulaMatch = t.match(/c[eé]dula\s*(\d[\d\s\-]+\d)/);
        if (cedulaMatch) {
            parsed.cedula = cedulaMatch[1].replace(/\s+/g, '-').replace(/--+/g, '-');
        } else {
            // Buscar cualquier patron numerico tipo cedula
            var numMatch = t.match(/(\d{1,2}[\s\-]\d{2,4}[\s\-]\d{2,6})/);
            if (numMatch) {
                parsed.cedula = numMatch[1].replace(/\s+/g, '-');
            }
        }

        // --- SEXO ---
        if (t.match(/masculino|var[oó]n|hombre|sexo masculino/)) {
            parsed.sexo = 'Masculino';
            parsed.sexoCode = 'M';
        } else if (t.match(/femenin[oa]|mujer|sexo femenino/)) {
            parsed.sexo = 'Femenino';
            parsed.sexoCode = 'F';
        }

        // --- EDAD ---
        var edadMatch = t.match(/(\d{1,3})\s*a[ñn]os/);
        if (edadMatch) {
            parsed.edad = parseInt(edadMatch[1]);
            parsed.edadTexto = edadMatch[1] + 'a';
        } else {
            var edadMatch2 = t.match(/edad\s*(\d{1,3})/);
            if (edadMatch2) {
                parsed.edad = parseInt(edadMatch2[1]);
                parsed.edadTexto = edadMatch2[1] + 'a';
            }
        }

        // --- ATENCION ---
        if (t.match(/primera\s*vez|nuevo|nueva|1ra\s*vez/)) {
            parsed.atencion = '1ra vez';
            parsed.atencionCod = '1';
        } else if (t.match(/subsecuente|control|seguimiento|sub/)) {
            parsed.atencion = 'Subsec.';
            parsed.atencionCod = '2';
        }

        // --- RESIDENCIA ---
        var resMatch = t.match(/residen(?:te|cia)\s*(?:de|en)\s+([a-záéíóúñü\s]+?)(?:,|\.|diagn|proced|$)/);
        if (resMatch) {
            parsed.residencia = capitalize(resMatch[1].trim());
        }

        // --- DIAGNOSTICO ---
        var dxMatch = t.match(/diagn[oó]stic[oa]?\s*[:.]?\s*([a-záéíóúñü\s]+?)(?:,|\.|proced|c[oó]digo|$)/);
        if (dxMatch) {
            parsed.diagnosticoDesc = capitalize(dxMatch[1].trim());
            // Intentar buscar codigo CIE
            var cieMatch = t.match(/c[oó]digo\s*(?:cie)?[\s\-]*(?:10|x)?\s*([a-z]\d{2}(?:\.\d{1,2})?)/i);
            if (cieMatch) {
                parsed.diagnosticoCodigo = cieMatch[1].toUpperCase();
            } else {
                // Buscar match aproximado en base de datos
                parsed.diagnosticoCodigo = buscarCIEAproximado(parsed.diagnosticoDesc);
            }
        }

        // --- PROCEDIMIENTO ---
        var procMatch = t.match(/procedimiento\s*[:.]?\s*([a-záéíóúñü\s]+?)(?:,|\.|$)/);
        if (procMatch) {
            parsed.procedimiento = capitalize(procMatch[1].trim());
        } else {
            // Buscar "se realizo" o "se le realiza"
            var procMatch2 = t.match(/se\s*(?:le\s*)?realiz[oóa]\s+([a-záéíóúñü\s]+?)(?:,|\.|$)/);
            if (procMatch2) {
                parsed.procedimiento = capitalize(procMatch2[1].trim());
            }
        }

        // --- Construir paciente desde lo parseado ---
        buildPatientFromParsed(parsed);
    }

    function capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function buscarCIEAproximado(desc) {
        if (!desc) return 'R69';
        var d = desc.toLowerCase();
        // Buscar en la base de diagnosticos
        for (var i = 0; i < DataPanama.diagnosticos.length; i++) {
            var dx = DataPanama.diagnosticos[i];
            if (dx.desc.toLowerCase().indexOf(d) >= 0 || d.indexOf(dx.desc.toLowerCase().split(' ')[0]) >= 0) {
                return dx.codigo;
            }
        }
        return 'R69'; // No especificado
    }

    function buildPatientFromParsed(parsed) {
        // Usar datos parseados + completar faltantes con generador
        var base = DataPanama.generarPaciente();

        currentPatient = {
            cedula: parsed.cedula || base.cedula,
            sexo: parsed.sexoCode || base.sexo,
            edad: parsed.edad || base.edad,
            edadTexto: parsed.edadTexto || base.edadTexto,
            atencion: parsed.atencion || base.atencion,
            atencionCod: parsed.atencionCod || base.atencionCod,
            residencia: parsed.residencia || base.residencia,
            diagnosticoDesc: parsed.diagnosticoDesc || base.diagnosticoDesc,
            diagnosticoCodigo: parsed.diagnosticoCodigo || base.diagnosticoCodigo,
            procedimiento: parsed.procedimiento || base.procedimiento,
            programa: base.programa,
            tipoAtencion: base.tipoAtencion,
            referendo: base.referendo || '',
            dxTipo: base.dxTipo || '1N',
        };

        // Llenar los campos en la UI
        fillFieldsFromParsed(parsed);
        elements.btnAdd.disabled = false;
    }

    function fillFieldsFromParsed(parsed) {
        var fields = [
            { key: 'cedula', value: currentPatient.cedula, ok: !!parsed.cedula },
            { key: 'sexo', value: currentPatient.sexo === 'M' ? 'Masculino' : 'Femenino', ok: !!parsed.sexoCode },
            { key: 'edad', value: currentPatient.edadTexto, ok: !!parsed.edadTexto },
            { key: 'atencion', value: currentPatient.atencion, ok: !!parsed.atencion },
            { key: 'residencia', value: currentPatient.residencia, ok: !!parsed.residencia },
            { key: 'diagnostico', value: currentPatient.diagnosticoCodigo + ' - ' + currentPatient.diagnosticoDesc, ok: !!parsed.diagnosticoDesc },
            { key: 'procedimiento', value: currentPatient.procedimiento, ok: !!parsed.procedimiento },
        ];

        fields.forEach(function(f) {
            elements.fields[f.key].value = f.value;
            if (f.ok) {
                elements.statuses[f.key].classList.add('ok');
                elements.statuses[f.key].title = 'Reconocido por voz';
            } else {
                elements.statuses[f.key].classList.add('partial');
                elements.statuses[f.key].title = 'Completado automáticamente';
            }
        });
    }

    // ============================================
    //  MIC SIMULADO (DEMO) - TYPEWRITER
    // ============================================
    function toggleSimulatedRecording() {
        if (isRealRecording) return; // No permitir si el real esta activo

        if (isRecording) {
            stopSimulatedRecording();
        } else {
            startSimulatedRecording();
        }
    }

    async function startSimulatedRecording() {
        isRecording = true;
        elements.btnDictate.classList.add('recording');
        elements.micWaves.classList.add('active');
        updateSpeechStatus('��� Simulando dictado...', 'recording');

        clearFields();
        currentPatient = DataPanama.generarPaciente();

        var texto = DataPanama.generarDictadoTexto(currentPatient);

        await Typewriter.wait(800);
        await Typewriter.typeTranscript(elements.transcript, texto, 30);
        await Typewriter.wait(500);
        await fillFieldsAnimated(currentPatient);

        stopSimulatedRecording();
        elements.btnAdd.disabled = false;
        App.updateStatus('✓ Dictado simulado completado - Campos reconocidos');
    }

    function stopSimulatedRecording() {
        isRecording = false;
        elements.btnDictate.classList.remove('recording');
        elements.micWaves.classList.remove('active');
        updateSpeechStatus('', '');
    }

    async function fillFieldsAnimated(patient) {
        var fieldData = [
            { key: 'cedula', value: patient.cedula },
            { key: 'sexo', value: patient.sexo === 'M' ? 'Masculino' : 'Femenino' },
            { key: 'edad', value: patient.edadTexto },
            { key: 'atencion', value: patient.atencion },
            { key: 'residencia', value: patient.residencia },
            { key: 'diagnostico', value: patient.diagnosticoCodigo + ' - ' + patient.diagnosticoDesc },
            { key: 'procedimiento', value: patient.procedimiento },
        ];

        for (var i = 0; i < fieldData.length; i++) {
            var f = fieldData[i];
            await Typewriter.typeInput(elements.fields[f.key], f.value, 25);
            elements.statuses[f.key].classList.add('ok');
            await Typewriter.wait(300);
        }
    }

    // ============================================
    //  FUNCIONES COMUNES
    // ============================================
    function updateSpeechStatus(msg, type) {
        if (!elements.speechStatus) return;
        elements.speechStatus.textContent = msg;
        elements.speechStatus.className = 'speech-status';
        if (type) {
            elements.speechStatus.classList.add('speech-status-' + type);
        }
    }

    function clearFields() {
        Object.values(elements.fields).forEach(function(f) {
            f.value = '';
            f.classList.remove('filled');
        });
        Object.values(elements.statuses).forEach(function(s) {
            s.classList.remove('ok', 'partial');
            s.title = '';
        });
        elements.btnAdd.disabled = true;
        elements.transcript.innerHTML = '<p class="placeholder-text">El texto dictado aparecerá aquí...</p>';
        updateSpeechStatus('', '');
    }

    function addToReport() {
        if (!currentPatient) return;

        if (onDictationComplete) {
            onDictationComplete(currentPatient);
        }

        clearFields();
        currentPatient = null;
        App.updateStatus('✓ Registro agregado al informe desde dictado');
    }

    return {
        init: init,
        clearFields: clearFields
    };

})();
