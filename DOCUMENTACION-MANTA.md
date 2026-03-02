# Widget Manta — Registro Diario de Actividades (RDA-1) del MINSA Panamá

## 1. ¿Qué es la Manta?

La **"manta"** es el nombre coloquial que los médicos del Ministerio de Salud de Panamá (MINSA) le dan al formulario oficial **RDA-1 — Registro Diario de Actividades**. Es un formulario estadístico que todo funcionario de salud debe completar a diario con cada paciente atendido. Registra datos demográficos, diagnósticos CIE-10, procedimientos, programas de salud y actividades administrativas.

El **Widget Manta** es una aplicación web que digitaliza y automatiza el llenado de este formulario. Se integra visualmente como un widget flotante dentro de un escritorio simulado del sistema de información en salud del MINSA.

---

## 2. Propósito y problema que resuelve

### El problema
Los médicos del MINSA en Panamá deben llenar manualmente la manta (RDA-1) cada día. Esto implica:
- Escribir a mano (o en Excel) cada paciente atendido con 14+ campos por fila.
- Repetir datos que ya existen en la Historia Clínica Electrónica (HCE).
- Tiempo perdido en tareas administrativas en lugar de atención clínica.
- Errores de transcripción en códigos CIE-10, cédulas y datos demográficos.

### La solución
El Widget Manta automatiza la captura de datos mediante tres métodos:

1. **Dictado por voz real** — El médico dicta los datos del paciente y el sistema los reconoce usando la Web Speech API del navegador.
2. **Simulación typewriter (demo)** — Un modo de demostración que genera pacientes ficticios y los transcribe con efecto de máquina de escribir para mostrar cómo funciona el sistema.
3. **Importación desde HCE** — Importa automáticamente los pacientes ya registrados en el sistema de Historia Clínica Electrónica del día.

Al final de la jornada, el médico genera un **PDF oficial en formato RDA-1** idéntico al formulario de papel del MINSA.

---

## 3. Arquitectura técnica

### Stack tecnológico
- **100% client-side**: HTML + CSS + JavaScript puro (vanilla). Sin frameworks, sin servidor backend.
- **jsPDF 2.5.1**: Librería JavaScript para generar PDFs en el navegador, vía CDN.
- **Font Awesome 6.5.0**: Iconos, vía CDN.
- **Web Speech API**: API nativa del navegador para reconocimiento de voz (Chrome, Edge).
- **Despliegue**: Servidor Apache en Linux Debian (archivos estáticos).
- **Repositorio**: GitHub `jbarrios33/manta` (público).

### Estructura de archivos

```
manta/
├── index.html              # Página principal (561 líneas)
├── css/
│   └── styles.css          # Estilos completos (~1400 líneas)
├── js/
│   ├── data.js             # Datos simulados de Panamá (339 líneas)
│   ├── typewriter.js        # Efecto máquina de escribir (133 líneas)
│   ├── dictation.js         # Dictado por voz dual (456 líneas)
│   ├── import.js            # Importación desde HCE simulada
│   ├── app.js               # Aplicación principal (449 líneas)
│   ├── logo-minsa.js        # Logo MINSA en Base64
│   └── pdf-manta.js         # Generación de PDF RDA-1 (728 líneas)
├── img/
│   └── logo-minsa.png       # Logo oficial del MINSA
└── Registro diario de actividades - RDA-1.pdf  # Formulario oficial de referencia
```

### Patrón de diseño
La aplicación usa el **patrón módulo (IIFE)** para encapsulación. Cada archivo JS exporta un objeto con métodos públicos:

| Módulo | Objeto global | Responsabilidad |
|--------|---------------|-----------------|
| `data.js` | `DataPanama` | Generación de datos simulados realistas |
| `typewriter.js` | `Typewriter` | Animación de escritura carácter por carácter |
| `dictation.js` | `Dictation` | Dictado por voz (real y simulado) |
| `import.js` | `ImportHCE` | Importación masiva desde HCE |
| `app.js` | `App` | Controlador principal, gestión del widget |
| `pdf-manta.js` | `MantaPDF` | Generación del PDF oficial RDA-1 |
| `logo-minsa.js` | `LogoMINSA` | Logo incrustado como cadena Base64 |

---

## 4. Interfaz de usuario

### 4.1. Escritorio simulado del MINSA
La aplicación simula un escritorio completo del sistema de información en salud con una barra lateral de navegación que incluye secciones simuladas:

- **Agenda del Día**: Lista de 15 pacientes con hora, nombre, cédula, motivo y estado (Atendido / En espera / Pendiente).
- **Historias Clínicas**: Tabla de HCE con último diagnóstico y fecha de visita.
- **Recetas Médicas**: Medicamentos dispensados con dosis y duración.
- **Laboratorio**: Órdenes con estado de resultados (Normal/Anormal).
- **Imágenes Diagnósticas**: Radiografías, ultrasonidos, tomografías, mamografías.
- **Manta Diaria (Widget)**: Botón destacado que abre el widget flotante.

Todos los datos de estas secciones se generan aleatoriamente al cargar la página usando `DataPanama.generarAgendaDia()`.

### 4.2. Widget flotante
El widget se abre como una ventana flotante sobre el escritorio con dos columnas:

**Columna izquierda — El informe (la manta)**:
- Encabezado con logo MINSA, datos del establecimiento, médico, fecha, servicio e idoneidad.
- Tabla de 12 columnas visibles: #, Ident. Paciente, Edad, Sexo, Nvo/Sub, Residencia, Tipo, Diagnóstico CIE-X, Cód., Procedimiento, Ref., Prog.
- Sección de actividades administrativas y docentes.
- Resumen: Total atenciones, Primera vez, Subsecuentes.
- Botones: "Generar PDF de la Manta" y "Recuperar Mantas Anteriores".

**Columna derecha — Controles (3 pestañas)**:
1. **Dictado** — Sistema de captura por voz.
2. **Importar HCE** — Importación masiva desde sistema electrónico.
3. **Administrativo** — Registro de actividades no asistenciales.

---

## 5. Sistema de dictado dual

### 5.1. Micrófono real (rojo) — Web Speech API
- Usa la API `SpeechRecognition` (o `webkitSpeechRecognition`) del navegador.
- Configurado con `lang: 'es-PA'` (español de Panamá), modo continuo e interim results.
- Al activarse, muestra una **guía visual** con el formato exacto que el médico debe decir:

> *"Cédula **8-123-4567**, **masculino**, **45** años, **primera vez**, residente de **Betania**, diagnóstico **hipertensión arterial**, procedimiento **consulta general**"*

- El texto reconocido se muestra en tiempo real (texto final en negro, interim en gris itálica).
- Un **parser NLP** con expresiones regulares extrae los campos del texto hablado:
  - **Cédula**: Busca patrón `cédula X-XXX-XXXX` o secuencias numéricas tipo cédula panameña.
  - **Sexo**: Detecta "masculino", "femenino", "varón", "mujer", "hombre".
  - **Edad**: Detecta patrón `N años` o `edad N`.
  - **Tipo de atención**: "primera vez" → 1ra vez; "subsecuente", "control" → Subsec.
  - **Residencia**: Busca "residente de [lugar]" o "residencia en [lugar]".
  - **Diagnóstico**: Busca "diagnóstico: [texto]" y opcionalmente "código CIE [código]". Si no se dice el código, busca coincidencia aproximada en la base de datos de 30 diagnósticos CIE-10.
  - **Procedimiento**: Busca "procedimiento: [texto]" o "se realizó [texto]".

- Los campos reconocidos por voz se marcan con **✓ verde**. Los que no se reconocieron se completan automáticamente con datos generados y se marcan con **~ naranja** ("Completado automáticamente").

- Manejo de errores: sin micrófono, permiso denegado, sin voz detectada, navegador incompatible.

### 5.2. Micrófono simulado (azul) — Typewriter demo
- Al presionar, genera un paciente aleatorio con `DataPanama.generarPaciente()`.
- Genera un texto de dictado con `DataPanama.generarDictadoTexto()` usando una de 3 plantillas aleatorias.
- Transcribe el texto carácter por carácter con efecto typewriter en la zona de transcripción.
- Llena los 7 campos reconocidos uno por uno con animación.
- Propósito: Demostrar el funcionamiento del sistema sin requerir micrófono real.

### 5.3. Campos reconocidos (7 campos)
1. **Cédula** — Identificación del paciente (formato panameño: prefijo-tomo-asiento).
2. **Sexo** — Masculino (M) / Femenino (F).
3. **Edad** — En años (o días/meses para menores de 1 año).
4. **Atención** — 1ra vez / Subsecuente.
5. **Residencia** — Corregimiento y distrito.
6. **Diagnóstico** — Código CIE-10 + descripción.
7. **Procedimiento** — Acción médica realizada.

Una vez completados los campos, el médico presiona **"Agregar al Informe"** y la fila se añade a la tabla con animación typewriter.

---

## 6. Importación desde HCE

- Simula la conexión al sistema de Historia Clínica Electrónica.
- Opciones configurables: importar consultas médicas, procedimientos, programas.
- Barra de progreso animada mientras "importa" registros.
- Genera entre 5 y 12 pacientes aleatorios y los añade secuencialmente a la tabla con efecto typewriter.
- Botón de "Reiniciar e Importar de Nuevo" para limpiar la tabla y volver a importar.

---

## 7. Actividades administrativas

Pestaña para registrar actividades no asistenciales que el médico realizó durante la jornada:

- **Tipos**: Reunión administrativa, Docencia/Capacitación, Supervisión, Comité institucional, Elaboración de informes, Investigación, Gira de salud comunitaria.
- **Campos**: Tipo, Descripción (textarea), Duración en horas.
- **Simulación**: Botón que genera 2-4 actividades aleatorias de una base de datos predefinida.
- Se muestran en la sección inferior del informe.

---

## 8. Generación de PDF (formato RDA-1)

El módulo `pdf-manta.js` genera un PDF que reproduce fielmente el formulario oficial RDA-1 del MINSA:

### Estructura del PDF (una página tamaño carta)

1. **Encabezado oficial**:
   - Logo del MINSA (incrustado como imagen Base64 con `doc.addImage()`).
   - Textos: "MINISTERIO DE SALUD", "SISTEMA ESTADÍSTICO DE SALUD", "REGISTRO DIARIO DE ACTIVIDADES".
   - Formulario: 10-12/005 | 2015.

2. **Metadatos (2 filas de campos)**:
   - Fila 1: Instalación, Código, Centro de Producción, Fecha (a 6pt comprimido).
   - Fila 2: Servicio, Funcionario, Idoneidad, Horas a consulta.

3. **Tipo de jornada** (checkboxes):
   - 1. Horario Normal, 2. Extensión, 3. Extensión 2, 4. Extensión 3, 6. Gira, 7. Jornada.

4. **Tabla principal de 14 columnas**:
   | # | Cédula | Edad Días | Edad Años | Sexo | Nvo/Sub | Residencia | Tipo Atenc. | Diagnóstico CIE-X | Cód. CIE-X | Tipo Dx | Procedimiento | Ref. | Prog. |

5. **Sección administrativa**:
   - Lista de actividades administrativas y docentes.

6. **Sección de firmas**:
   - Firma del Funcionario y Firma del Supervisor, con líneas punteadas.

7. **Pie de página**:
   - "MINSA — Formulario RDA-1 — Sistema Estadístico de Salud".

### Características técnicas del PDF
- Tamaño: Carta (Letter) en orientación horizontal (landscape).
- Fuente: Helvetica.
- Márgenes comprimidos para aprovechar espacio.
- Alternancia de color en filas de la tabla (blanco/gris claro).
- El logo se carga desde una cadena Base64 almacenada en `logo-minsa.js`.
- Se genera 100% en el navegador con jsPDF, sin servidor.

---

## 9. Datos simulados de Panamá

El módulo `data.js` contiene datos realistas del sistema de salud panameño:

### Geografía (28 localidades)
- Provincias: Panamá, Panamá Oeste, Colón, Chiriquí, Veraguas, Herrera, Los Santos, Coclé, Bocas del Toro, Darién, Comarca Ngäbe-Buglé.
- Distritos y corregimientos reales.
- Clasificación zona urbana/rural.

### Diagnósticos CIE-10 (30 diagnósticos)
Los más comunes en atención primaria panameña:
- Respiratorios: J06.9, J02.9, J00, J20.9, J45.9, J03.9.
- Crónicos: I10 (hipertensión), E11.9 (diabetes tipo 2), E78.0 (hipercolesterolemia), E66.9 (obesidad).
- Gastrointestinales: A09, K29.7, K30, R10.4.
- Salud mental: F32.9 (depresión), F41.1 (ansiedad).
- Preventivos: Z00.0, Z01.4, Z23, Z30.0, Z34.9.
- Otros: N39.0, L30.9, B35.3, R51, H10.9, B82.9, R50.9, G43.9.

### Procedimientos (20 tipos)
Consulta general, control prenatal, toma de presión, glucometría, ECG, curación, nebulización, inyección, retiro de puntos, examen físico, consejería nutricional, planificación familiar, referencia a especialista, certificado de salud, PAP, prueba VIH, prueba embarazo, vacunación, control de crecimiento, tamizaje visual.

### Programas de salud (10)
Escolar, Adolescencia, Materno Infantil, Adulto Mayor, Salud Mental, PCNT (Tuberculosis), VIH/SIDA, ETV (Vectores), Inmunización.

### Cédulas panameñas
Generación realista con prefijos ponderados:
- Mayoría: 8 (Panamá provincia, 50% probabilidad).
- Otros: PE (panameño extranjero), N (naturalizado), E (extranjero), 1-13 (otras provincias).
- Formato: `prefijo-tomo-asiento`.

### Etnias indígenas
Kuna, Emberá, Wounaan, Ngöbe, Buglé, Naso (Teribe), Bokota, Bri Bri. Con 5% de probabilidad de asignación.

### Tipos de atención
C (Consulta), I (Interconsulta), E (Emergencia), V (Visita domiciliaria).

### Referendo
RP (Referencia Primaria), RHI (Referencia Hospitalaria Interinstitucional), RHN (Referencia Hospitalaria Nacional). Con 15% de probabilidad.

### Tipo de diagnóstico (dxTipo)
1N (Nuevo, mayoría), 2R (Reincidente).

---

## 10. Historial de mantas anteriores

- Modal que muestra un historial de mantas generadas en días anteriores.
- Filtros: Médico, Establecimiento, Mes.
- Tabla con: Fecha, Total Atenciones, 1ra Vez, Subsecuentes, Actividades Admin., Acciones.
- Funcionalidad de recuperación de mantas pasadas.

---

## 11. Flujo de uso típico

1. El médico abre el sistema MINSA y ve su escritorio con la agenda del día.
2. Hace clic en **"Manta Diaria (Widget)"** en la barra lateral.
3. El widget flotante se abre sobre el escritorio.
4. Para cada paciente atendido, el médico puede:
   - **Opción A**: Presionar el micrófono rojo, dictar los datos del paciente y presionar "Agregar al Informe".
   - **Opción B**: Ir a la pestaña "Importar HCE" y traer automáticamente los pacientes ya registrados.
   - **Opción C**: (Demo) Presionar el micrófono azul para ver una simulación.
5. Al final de la jornada, registra actividades administrativas en la pestaña correspondiente.
6. Presiona **"Generar PDF de la Manta"** y descarga el PDF en formato RDA-1 oficial.
7. Entrega el PDF (digital o impreso) como su registro diario de actividades.

---

## 12. Información del proyecto

| Campo | Valor |
|-------|-------|
| **Nombre** | Widget Manta |
| **País** | Panamá |
| **Institución** | Ministerio de Salud (MINSA) |
| **Formulario** | RDA-1 — Registro Diario de Actividades |
| **Tipo** | Aplicación web estática (SPA) |
| **Tecnologías** | HTML5, CSS3, JavaScript ES6+, jsPDF, Web Speech API |
| **Navegadores** | Chrome (recomendado), Edge (dictado real). Firefox y Safari (sin dictado real). |
| **Servidor** | Apache en Linux Debian (archivos estáticos) |
| **Repositorio** | github.com/jbarrios33/manta |
| **Autor** | Juan Barrios |
| **Licencia** | Uso institucional MINSA |

---

## 13. Glosario

| Término | Significado |
|---------|-------------|
| **Manta** | Nombre coloquial del formulario RDA-1 que el médico llena diariamente |
| **RDA-1** | Registro Diario de Actividades — formulario estadístico oficial del MINSA |
| **CIE-10 / CIE-X** | Clasificación Internacional de Enfermedades, 10ª revisión. Codificación de diagnósticos |
| **HCE** | Historia Clínica Electrónica |
| **MINSA** | Ministerio de Salud de la República de Panamá |
| **1ra vez / Subsec.** | Si el paciente es atendido por primera vez o es una consulta de seguimiento |
| **Referendo** | Referencia del paciente a otro nivel de atención (RP, RHI, RHN) |
| **Nvo/Sub** | Abreviatura de Nuevo/Subsecuente |
| **Tipo Dx** | Tipo de diagnóstico: 1N (nuevo), 2R (reincidente) |
| **Tipo Atenc.** | Tipo de atención: C (consulta), I (interconsulta), E (emergencia), V (visita domiciliaria) |
| **Idoneidad** | Número de registro profesional del médico |
| **Centro de Producción** | Área funcional del establecimiento (ej: Consulta Externa) |
| **Corregimiento** | División administrativa menor de Panamá (subdivisión del distrito) |
| **PAP** | Papanicolaou — prueba de tamizaje cervicouterino |
| **Widget** | Componente flotante de interfaz que se superpone al escritorio principal |
| **Typewriter** | Efecto visual de escritura carácter por carácter para simular actividad en tiempo real |
| **Web Speech API** | API nativa de navegadores modernos para reconocimiento de voz sin servicios externos |
