/* ============================================
   typewriter.js - Efecto máquina de escribir
   para llenar campos del informe
   ============================================ */

const Typewriter = (() => {

    const CHAR_DELAY = 30;       // ms entre caracteres
    const FIELD_DELAY = 200;     // ms entre campos
    const ROW_DELAY = 400;       // ms entre filas

    /**
     * Escribe texto carácter por carácter en un elemento TD
     */
    function typeText(element, text, delay = CHAR_DELAY) {
        return new Promise((resolve) => {
            element.textContent = '';
            element.classList.add('cell-typing');
            let i = 0;

            function typeChar() {
                if (i < text.length) {
                    element.textContent += text[i];
                    i++;
                    setTimeout(typeChar, delay);
                } else {
                    element.classList.remove('cell-typing');
                    resolve();
                }
            }
            typeChar();
        });
    }

    /**
     * Llena una fila completa del informe con efecto typewriter
     */
    async function typeRow(rowElement, data, onComplete) {
        const cells = rowElement.querySelectorAll('td');
        const values = [
            data.num.toString(),
            data.cedula,
            data.edadTexto,
            data.sexo,
            data.atencionCod || (data.atencion === '1ra vez' ? '1' : '2'),
            data.residencia,
            data.tipoAtencion || 'C',
            data.diagnosticoDesc,
            data.diagnosticoCodigo,
            data.procedimiento,
            data.referendo || '—',
            data.programa
        ];

        rowElement.classList.add('row-entering');
        rowElement.classList.add('row-highlight');

        for (let i = 0; i < cells.length && i < values.length; i++) {
            await typeText(cells[i], values[i]);
            await wait(FIELD_DELAY);
        }

        // Quitar highlight después de un momento
        setTimeout(() => {
            rowElement.classList.remove('row-highlight');
        }, 2000);

        if (onComplete) onComplete();
    }

    /**
     * Escribe texto en un input con efecto typewriter
     */
    function typeInput(inputElement, text, delay = 40) {
        return new Promise((resolve) => {
            inputElement.value = '';
            let i = 0;

            function typeChar() {
                if (i < text.length) {
                    inputElement.value += text[i];
                    i++;
                    setTimeout(typeChar, delay);
                } else {
                    inputElement.classList.add('filled');
                    resolve();
                }
            }
            typeChar();
        });
    }

    /**
     * Escribe en el transcript de dictado
     */
    function typeTranscript(element, text, delay = 35) {
        return new Promise((resolve) => {
            element.innerHTML = '<span class="transcript-text"></span>';
            const span = element.querySelector('.transcript-text');
            let i = 0;

            function typeChar() {
                if (i < text.length) {
                    span.textContent += text[i];
                    i++;
                    // Auto-scroll
                    element.scrollTop = element.scrollHeight;
                    setTimeout(typeChar, delay);
                } else {
                    resolve();
                }
            }
            typeChar();
        });
    }

    /**
     * Espera un tiempo determinado
     */
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    return {
        typeText,
        typeRow,
        typeInput,
        typeTranscript,
        wait,
        CHAR_DELAY,
        FIELD_DELAY,
        ROW_DELAY
    };

})();
