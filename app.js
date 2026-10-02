
const $ = id => document.getElementById(id);
const clean = s => (s||"").replace(/\s+/g," ").trim();
const norm = s => clean(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const countWords = s => norm(s).split(/\s+/).filter(Boolean).length;
const esc = s => (s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const hasAny = (t, arr) => { const n=norm(t); return arr.some(x=>n.includes(norm(x))); };
const lineList = s => (s||"").split(/\n+/).map(x=>x.replace(/^\s*(?:[-•*]|\d+[.)-]?|[a-zA-Z][.)])\s*/,"").trim()).filter(Boolean);
function show(el, cls, html){el.className=`output-box ${cls}`;el.innerHTML=html;el.classList.remove("hidden");}

const verbDB = {
  identificar:{noun:"IDENTIFICACIÓN", meaning:"Reconocer, delimitar y sustentar cuáles variables, requisitos, condiciones o elementos son relevantes para el proyecto.", evidence:["criterios de identificación","fuentes técnicas","variables con unidades/rangos","tabla o matriz de elementos identificados","justificación de por qué son relevantes"], subs:["Fundamentación de la identificación","Variables o elementos identificados","Criterios de clasificación","Síntesis técnica"]},
  determinar:{noun:"DETERMINACIÓN", meaning:"Establecer un valor, condición, parámetro o decisión a partir de datos, ecuaciones o criterios.", evidence:["método de determinación","datos de entrada","ecuaciones o criterios","sustitución numérica","valor final con unidades e interpretación"], subs:["Datos y criterios","Procedimiento de determinación","Cálculos","Valor o condición determinada"]},
  seleccionar:{noun:"SELECCIÓN", meaning:"Elegir una alternativa después de compararla técnicamente con otras opciones.", evidence:["mínimo dos o más alternativas razonables","criterios comparables","datasheets/fuentes","tabla comparativa","justificación de la alternativa elegida"], subs:["Criterios de selección","Alternativas tecnológicas","Comparación técnica","Selección y justificación"]},
  elegir:{noun:"SELECCIÓN", meaning:"Elegir técnicamente entre alternativas; en ingeniería debe existir comparación y justificación.", evidence:["alternativas","criterios","comparación","justificación"], subs:["Criterios de selección","Alternativas","Comparación","Elección justificada"]},
  analizar:{noun:"ANÁLISIS", meaning:"Descomponer y examinar técnicamente el comportamiento, estructura o relación entre variables para obtener conclusiones útiles al diseño.", evidence:["variables/elementos analizados","método de análisis","datos o modelos","gráficas/tablas si corresponde","interpretación vinculada al diseño"], subs:["Criterios de análisis","Variables o elementos","Análisis técnico","Implicaciones para el diseño"]},
  caracterizar:{noun:"CARACTERIZACIÓN", meaning:"Describir cuantitativamente el comportamiento o propiedades relevantes mediante parámetros medibles.", evidence:["magnitudes y unidades","método de medición/modelado","rango o condiciones","parámetros obtenidos","representación gráfica o tabla"], subs:["Magnitudes de caracterización","Método","Parámetros","Representación e interpretación"]},
  modelar:{noun:"MODELADO", meaning:"Representar matemáticamente un componente, subsistema o proceso mediante ecuaciones defendibles.", evidence:["hipótesis","variables y unidades","ecuaciones","parámetros y origen","validación conceptual o simulada del modelo"], subs:["Hipótesis del modelo","Ecuaciones","Parámetros","Modelo obtenido","Interpretación"]},
  diseñar:{noun:"DISEÑO", meaning:"Definir y dimensionar una solución antes de construirla, sustentando decisiones mediante requisitos, cálculos, modelos, esquemas y algoritmos.", evidence:["requerimientos","selección técnica","cálculos/modelo matemático","diseño de hardware","diseño de software/algoritmos","simulación con resultados","implementación si el alcance aprobado la exige"], subs:["Requerimientos de diseño","Selección tecnológica","Modelo matemático y cálculos","Diseño de hardware","Diseño de software","Simulación","Implementación, si corresponde"]},
  desarrollar:{noun:"DESARROLLO", meaning:"Construir progresivamente una solución funcional integrando diferentes etapas de ingeniería.", evidence:["arquitectura","hardware","algoritmos","programación/firmware","simulación","integración física si corresponde","trazabilidad con requerimientos"], subs:["Arquitectura del desarrollo","Hardware","Modelo y cálculos","Algoritmos","Programación y firmware","Simulación","Integración/implementación"]},
  implementar:{noun:"IMPLEMENTACIÓN", meaning:"Materializar e integrar físicamente o desplegar una solución previamente diseñada.", evidence:["montaje real","interconexiones","firmware/software cargado","entradas y salidas identificadas","tipos y niveles de señal","mediciones de integración con instrumentos","evidencia fotográfica/técnica"], subs:["Montaje del hardware","Integración del firmware/software","Entradas y salidas","Señales e interfaces","Mediciones de integración"]},
  construir:{noun:"CONSTRUCCIÓN", meaning:"Fabricar o ensamblar físicamente un dispositivo, estructura o prototipo a partir de un diseño.", evidence:["planos/esquemas previos","materiales y componentes","proceso de ensamblaje","dimensiones","integración física","evidencia del producto construido"], subs:["Planos y materiales","Proceso constructivo","Ensamblaje","Integración"]},
  integrar:{noun:"INTEGRACIÓN", meaning:"Interconectar subsistemas para que funcionen coordinadamente como un sistema.", evidence:["interfaces entre bloques","compatibilidad eléctrica/lógica","señales","protocolo o flujo","montaje/firmware","mediciones de integración"], subs:["Interfaces","Compatibilidad","Interconexión","Integración funcional"]},
  calibrar:{noun:"CALIBRACIÓN", meaning:"Comparar la indicación del sistema contra una referencia y ajustar parámetros para reducir o conocer el error.", evidence:["patrón o referencia","procedimiento","puntos/rango de calibración","error antes/después o corrección","ecuación/coeficientes de ajuste","condiciones de calibración"], subs:["Referencia e instrumentos","Procedimiento de calibración","Cálculo del error","Ajuste","Parámetros calibrados"]},
  ajustar:{noun:"AJUSTE", meaning:"Modificar parámetros del sistema para obtener el comportamiento previsto.", evidence:["parámetro a ajustar","criterio objetivo","valor inicial","procedimiento","valor ajustado y justificación"], subs:["Parámetros","Criterio de ajuste","Procedimiento","Configuración final"]},
  simular:{noun:"SIMULACIÓN", meaning:"Representar virtualmente el sistema para observar su comportamiento ante entradas definidas.", evidence:["modelo/esquema","condiciones de entrada","parámetros","instrumentos virtuales","curvas/valores/salidas","interpretación"], subs:["Modelo de simulación","Condiciones de entrada","Configuración","Resultados simulados","Interpretación para el diseño"]},
  programar:{noun:"PROGRAMACIÓN", meaning:"Codificar algoritmos previamente diseñados en un lenguaje y plataforma concretos.", evidence:["algoritmo previo","código por módulos","explicación de variables/funciones","relación con entradas/salidas","temporización y seguridad","firmware generado"], subs:["Correspondencia algoritmo-código","Configuración","Adquisición","Procesamiento","Decisiones","Salidas y comunicación"]},
  controlar:{noun:"CONTROL", meaning:"Regular una variable o proceso mediante medición, comparación, decisión y actuación.", evidence:["variable controlada","setpoint/referencia","sensor","controlador","actuador","lazo de realimentación","estrategia y parámetros de control"], subs:["Variable y referencia","Lazo de control","Controlador","Actuación","Realimentación"]},
  monitorear:{noun:"MONITOREO", meaning:"Observar y registrar variables de manera definida en el tiempo.", evidence:["variables","sensores","frecuencia de adquisición","formato de datos","visualización/registro","rango y unidades"], subs:["Variables de monitoreo","Adquisición","Procesamiento","Registro","Visualización"]},
  medir:{noun:"MEDICIÓN", meaning:"Obtener cuantitativamente una magnitud con unidad y método definido.", evidence:["magnitud","sensor/instrumento","rango","resolución/precisión","procedimiento","valor y unidad"], subs:["Magnitud y rango","Método de medición","Instrumentación","Adquisición"]},
  optimizar:{noun:"OPTIMIZACIÓN", meaning:"Mejorar una métrica definida respecto de una condición de referencia o restricciones.", evidence:["métrica objetivo","condición inicial","variables de decisión","restricciones","método de optimización","comparación antes/después"], subs:["Métrica y restricciones","Método","Parámetros","Configuración optimizada"]},
  validar:{noun:"VALIDACIÓN", meaning:"Comprobar mediante evidencia que una solución satisface criterios previamente establecidos.", evidence:["criterios de aceptación","método de prueba","datos","comparación criterio-resultado","conclusión"], subs:["Criterios","Procedimiento","Resultados","Dictamen"] , chapter4:true},
  evaluar:{noun:"EVALUACIÓN", meaning:"Valorar el desempeño mediante criterios, indicadores y resultados.", evidence:["indicadores","criterios","pruebas","datos","comparación","conclusión"], subs:["Criterios de evaluación","Pruebas","Resultados","Análisis"], chapter4:true},
  verificar:{noun:"VERIFICACIÓN", meaning:"Comprobar que una condición, requisito o funcionamiento se cumple mediante evidencia.", evidence:["condición/requisito","procedimiento","medición o evidencia","comparación","dictamen"], subs:["Criterios","Procedimiento","Evidencia","Comprobación"], chapter4:true},
  probar:{noun:"PRUEBAS", meaning:"Someter el sistema a condiciones definidas para observar y medir su comportamiento.", evidence:["casos de prueba","entradas","instrumentación","resultados","criterios"], subs:["Plan de pruebas","Condiciones","Resultados","Análisis"], chapter4:true},
  describir:{noun:"DESCRIPCIÓN", meaning:"Exponer ordenadamente características o funcionamiento. En un Marco Práctico no sustituye diseño, cálculo o implementación si el proyecto exige ingeniería aplicada.", evidence:["objeto claramente delimitado","funcionamiento técnico","variables/relaciones","figura o esquema cuando ayude"], subs:["Descripción funcional","Variables/elementos","Relación con el sistema"], weak:true},
  explicar:{noun:"EXPLICACIÓN", meaning:"Aclarar causas, relaciones o funcionamiento. Es un verbo principalmente expositivo; debe complementarse con evidencia técnica si forma parte del diseño.", evidence:["fenómeno/relación","fundamento","ecuaciones o esquema si corresponde","aplicación al proyecto"], subs:["Fundamento","Relaciones técnicas","Aplicación al proyecto"], weak:true},
  realizar:{noun:"DESARROLLO / EJECUCIÓN", meaning:"Verbo amplio. Debe precisarse por el objeto: realizar un diseño, una selección, un cálculo o una implementación implica cumplir la acción contenida después del verbo.", evidence:["identificar la acción real contenida en el objetivo","aplicar los productos propios de esa acción"], subs:["Acción técnica principal","Desarrollo de la acción","Evidencia obtenida"], weak:true}
};
const orderedVerbs = Object.keys(verbDB).sort((a,b)=>b.length-a.length);

function detectVerb(obj){
  const n = norm(obj).replace(/^[^a-záéíóúñ]+/i,"");
  const first = n.split(/\s+/).slice(0,8);
  for(const v of orderedVerbs){
    if(first.some(w => w===v || w.startsWith(v))) return v;
  }
  const inf = first.find(w=>/(ar|er|ir)$/.test(w));
  return inf || "no identificado";
}
function objectAfterVerb(obj,verb){
  let text = clean(obj).replace(/^[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/,"");
  const rx = new RegExp("^"+verb+"\\s+","i");
  text = text.replace(rx,"");
  text = text.replace(/^(el|la|los|las|un|una|unos|unas)\s+/i,"");
  return text.replace(/[.;:]$/,"").trim();
}
function headingFor(obj,verb){
  const db=verbDB[verb];
  const rest=objectAfterVerb(obj,verb);
  if(!db) return clean(obj).toUpperCase();
  let noun=db.noun;
  if(verb==="realizar"){
    const nv=detectVerb(rest);
    if(verbDB[nv]) noun=verbDB[nv].noun;
  }
  return `${noun} ${rest ? "DE "+rest.replace(/^(de|del|de la|de los|de las)\s+/i,"") : ""}`.trim().toUpperCase();
}
function detectArea(){
  const selected=$("projectArea").value;if(selected!=="auto")return selected;
  const t=[$("projectTitle").value,$("generalObjective").value,$("specificObjectives").value].join(" ");
  if(hasAny(t,["telecom","red de telecom","fibra óptica","fibra optica","radioenlace","cobertura","antena","lte","5g","microondas"]))return"telecom";
  if(hasAny(t,["electromedic","biomed","paciente","ecg","spo2","oximetr","señal fisiológica","senal fisiologica"]))return"electromed";
  if(hasAny(t,["robot","mecatr","servomotor","locomoc","manipulador"]))return"robotics";
  if(hasAny(t,["control","automat","pid","actuador","plc"]))return"control";
  if(hasAny(t,["instrument","medición","medicion","adquisición","adquisicion"]))return"instrumentation";
  if(hasAny(t,["esp32","arduino","microcontrolador","sistema embebido","iot"]))return"embedded";
  return"generic";
}
function inferScope(){
  const s=$("implementationScope").value;if(s!=="auto")return s;
  if(detectArea()==="telecom")return"network";
  const og=norm($("generalObjective").value);
  if(hasAny(og,["implementar","construir","desarrollar prototipo","desarrollar un prototipo","fabricar"]))return"prototype";
  return"design";
}
function areaName(a){return({control:"Control y automatización",electromed:"Electromedicina / Biomédica",instrumentation:"Instrumentación electrónica",robotics:"Robótica / Mecatrónica",embedded:"Sistema embebido / IoT aplicado",telecom:"Telecomunicaciones",generic:"Electrónica general"})[a]||a;}
function scopeName(s){return({design:"Diseño / simulación",prototype:"Diseño e implementación de prototipo",network:"Diseño de red"})[s]||s;}

function renderVerbCards(objs){
  $("verbCards").innerHTML = objs.map((o,i)=>{
    const v=detectVerb(o),db=verbDB[v];
    if(!db) return `<article class="verb-card"><span class="verb-chip">OE ${i+1} · ${esc(v)}</span><h4>Verbo no catalogado</h4><div class="heading-suggestion">${esc(o.toUpperCase())}</div><p>Revisa manualmente qué acción técnica exige el verbo y qué evidencia la demuestra.</p></article>`;
    const warn = db.chapter4 ? `<p class="status-warn">⚠ Este verbo suele requerir pruebas/evaluación formal. Comprueba si su desarrollo principal corresponde al Capítulo IV. En el Capítulo III solo documenta lo necesario para diseño, ajuste o integración.</p>` : "";
    const weak = db.weak ? `<p class="status-warn">⚠ Verbo principalmente expositivo o amplio. No debe sustituir evidencia de ingeniería si el objeto exige diseño o implementación.</p>` : "";
    return `<article class="verb-card">
      <span class="verb-chip">OE ${i+1} · ${esc(v.toUpperCase())}</span>
      <h4>${esc(db.meaning)}</h4>
      <div class="heading-suggestion">Subtítulo sugerido: ${esc(headingFor(o,v))}</div>
      ${warn}${weak}
      <p><b>Debe evidenciar:</b></p><ul>${db.evidence.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
      <p><b>Posibles subniveles:</b></p><ul>${db.subs.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
    </article>`;
  }).join("");
}

$("analyzeObjectivesBtn").addEventListener("click",()=>{
  const og=clean($("generalObjective").value), objs=lineList($("specificObjectives").value), area=detectArea(),scope=inferScope();
  if(!og || !objs.length){show($("objectiveAnalysisOutput"),"bad","<h4>🔵 FALTA INFORMACIÓN</h4><p>Ingresa el Objetivo General y por lo menos un Objetivo Específico.</p>");return;}
  renderVerbCards(objs);
  const chapter4=objs.filter(o=>verbDB[detectVerb(o)]?.chapter4);
  const weak=objs.filter(o=>verbDB[detectVerb(o)]?.weak);
  const headings=objs.map((o,i)=>`<li><b>3.X ${esc(headingFor(o,detectVerb(o)))}</b><br><span class="small">${esc(o)}</span></li>`).join("");
  show($("objectiveAnalysisOutput"),chapter4.length||weak.length?"warn":"ok",`
    <h4>Ruta detectada</h4>
    <p><b>Área:</b> ${areaName(area)} · <b>Alcance:</b> ${scopeName(scope)} · <b>Objetivos específicos:</b> ${objs.length}</p>
    <p><b>Propuesta de subtítulos derivados de los objetivos:</b></p><ol>${headings}</ol>
    ${weak.length?`<p class="status-warn">Se detectaron ${weak.length} objetivo(s) con verbo amplio/expositivo. El estudiante debe demostrar la acción técnica real contenida en el objeto del objetivo.</p>`:""}
    ${chapter4.length?`<p class="status-warn">Se detectaron ${chapter4.length} objetivo(s) con verbos de validación/evaluación/prueba. Su evidencia final debe separarse cuidadosamente del Capítulo III y reservarse para el Capítulo IV cuando corresponda.</p>`:""}
    ${area==="telecom"?`<p class="status-warn">Para telecomunicaciones este chatbot se limita a la organización general. No exige implementación física de la red.</p>`:""}
  `);
  document.getElementById("verbos").scrollIntoView({behavior:"smooth"});
});

/* Review helpers */
function resultList(checks, extra=""){
  const bad=checks.filter(x=>x[0]==="bad").length,warn=checks.filter(x=>x[0]==="warn").length;
  const cls=bad?"bad":warn?"warn":"ok",title=bad?"🔴 REQUIERE CORRECCIÓN":warn?"🟡 CUMPLE PARCIALMENTE":"🟢 CUMPLE";
  return [cls,`<h4>${title}</h4><ul>${checks.map(x=>`<li class="status-${x[0]}">${x[1]}</li>`).join("")}</ul>${extra}`];
}
$("reviewSelectionBtn").addEventListener("click",()=>{
  const t=clean($("selectionText").value);if(!t){show($("selectionOutput"),"bad","<h4>Falta información</h4>");return;}
  const c=[
    [hasAny(t,["compar","alternativa","opción","opcion"])?"good":"bad","Debe existir comparación entre alternativas."],
    [hasAny(t,["precisión","precision","rango","resolución","resolucion","interfaz","consumo","costo","compatibilidad","disponibilidad"])?"good":"warn","Se deben declarar criterios técnicos comparables."],
    [hasAny(t,["datasheet","hoja de datos","fabricante","manual","norma"])?"good":"warn","Conviene sustentar especificaciones con fuentes técnicas primarias."],
    [hasAny(t,["seleccion","elig","optó","opto","determinó","determino"])?"good":"bad","Debe existir una decisión final explícita."],
    [hasAny(t,["debido","porque","por tanto","por consiguiente","justifica"])?"good":"warn","La alternativa seleccionada debe justificarse, no solo nombrarse."]
  ];const [cl,h]=resultList(c,"<p>La descripción extensa de cada componente pertenece al Marco Teórico. Aquí interesa la <b>decisión de ingeniería</b>.</p>");show($("selectionOutput"),cl,h);
});
$("reviewMathBtn").addEventListener("click",()=>{
  const t=$("mathText").value;if(!clean(t)){show($("mathOutput"),"bad","<h4>Falta información</h4>");return;}
  const c=[
    [/[=+\-*/^]|sqrt|exp|sin|cos|log|∑|Σ|Δ|τ|ω|sigma|sigma|kp|ki|kd/i.test(t)?"good":"bad","Deben existir ecuaciones o cálculos concretos."],
    [/\b(V|mV|A|mA|W|Hz|kHz|MHz|°C|C|%|ohm|Ω|s|ms|N|Nm|kg|m\/s|ppm|lux)\b/i.test(t)?"good":"warn","Los parámetros y resultados deben llevar unidades cuando corresponda."],
    [/\d/.test(t)?"good":"warn","Debe existir sustitución numérica si el modelo lo permite."],
    [hasAny(t,["donde","siendo","representa","corresponde","significa"])?"good":"warn","Define las variables y su significado físico."],
    [hasAny(t,["por tanto","resultado","se selecciona","se obtiene","implica","permite"])?"good":"warn","Interpreta el resultado y vincúlalo con una decisión de diseño."]
  ];const [cl,h]=resultList(c,"<p>No copies fórmulas genéricas sin parámetros del proyecto. Cada ecuación debe responder a una necesidad concreta de diseño.</p>");show($("mathOutput"),cl,h);
});
$("reviewHardwareBtn").addEventListener("click",()=>{
  const t=clean($("hardwareText").value);if(!t){show($("hardwareOutput"),"bad","<h4>Falta información</h4>");return;}
  const c=[
    [hasAny(t,["entrada","sensor","señal","senal","variable"])?"good":"warn","Identifica entradas y variables físicas/señales."],
    [hasAny(t,["volt","corriente","nivel lógico","nivel logico","3.3","5 v","12 v","24 v","220"])?"good":"warn","Indica niveles eléctricos reales."],
    [hasAny(t,["i2c","uart","spi","pwm","adc","dac","digital","analóg","analog"])?"good":"warn","Identifica tipo de señal o interfaz."],
    [hasAny(t,["resistencia","capacitor","filtro","mosfet","transistor","relé","rele","driver","opto","aisla"])?"good":"warn","Explica acondicionamiento, potencia o interfaz cuando corresponda."],
    [hasAny(t,["fusible","protección","proteccion","diodo","tierra","tvS","snubber"])?"good":"warn","Revisa protecciones eléctricas."],
    [hasAny(t,["cálculo","calculo","ecuación","ecuacion","corriente total","potencia"])?"good":"warn","El hardware debe estar dimensionado con cálculos, no solo conectado."]
  ];const [cl,h]=resultList(c);show($("hardwareOutput"),cl,h);
});
$("reviewSimulationBtn").addEventListener("click",()=>{
  const t=clean($("simulationText").value);if(!t){show($("simulationOutput"),"bad","<h4>Falta información</h4>");return;}
  const c=[
    [hasAny(t,["entrada","estímulo","estimulo","aplicó","aplico","condición","condicion"])?"good":"bad","Indica qué entrada o condición se aplicó a la simulación."],
    [hasAny(t,["osciloscopio","multímetro","multimetro","analizador","gráfica","grafica","plot","scope","instrumento"])?"good":"warn","Debe existir un instrumento o medio para observar la salida."],
    [/\d/.test(t)?"good":"warn","Incluye valores o magnitudes, no solo descripción visual."],
    [hasAny(t,["curva","forma de onda","voltaje","corriente","frecuencia","tiempo","high","low","salida"])?"good":"bad","Muestra el resultado de comportamiento, no solo el esquema armado."],
    [hasAny(t,["demuestra","indica","permite","observa","por tanto","implica"])?"good":"warn","Interpreta qué aporta el resultado al diseño."]
  ];const [cl,h]=resultList(c,"<p>Los resultados simulados pertenecen al proceso de diseño. La validación experimental final y la evaluación técnica formal se reservan para el Capítulo IV.</p>");show($("simulationOutput"),cl,h);
});

/* Flowchart */
let flowInfo=null;
$("flowchartImage").addEventListener("change",()=>{
  const f=$("flowchartImage").files[0];if(!f){flowInfo=null;$("flowchartPreviewWrap").classList.add("hidden");return;}
  const u=URL.createObjectURL(f);$("flowchartPreview").src=u;$("flowchartPreviewWrap").classList.remove("hidden");
  const im=new Image();im.onload=()=>{flowInfo={name:f.name,w:im.width,h:im.height,size:f.size};$("flowchartMeta").textContent=`${f.name} · ${im.width}×${im.height}px · ${(f.size/1024).toFixed(1)} KB`;};im.src=u;
});
$("reviewFlowchartBtn").addEventListener("click",()=>{
  if(!flowInfo){show($("flowchartOutput"),"bad","<h4>Selecciona una imagen del flujograma.</h4>");return;}
  const checked=[...document.querySelectorAll(".flow-check:checked")].map(x=>x.value),desc=clean($("flowchartDescription").value);
  const c=[
    [flowInfo.w>=700?"good":"warn","La resolución debe permitir leer condiciones y variables en el documento."],
    [checked.includes("inicio")?"good":"warn","Debe existir inicio y fin/retorno claramente definido."],
    [checked.includes("io")?"good":"warn","Las entradas/salidas deben representarse correctamente."],
    [checked.includes("decision")?"good":"warn","Cada decisión debe mostrar sus rutas."],
    [checked.includes("loop")?"good":"warn","El lazo debe retornar a la etapa correcta."],
    [checked.includes("variables")?"good":"warn","Las variables y condiciones deben ser legibles."],
    [checked.includes("coherence")?"good":"warn","El algoritmo debe coincidir con el hardware y el objetivo."],
    [desc.length>50?"good":"warn","Incluye una explicación breve de la lógica del algoritmo."]
  ];const [cl,h]=resultList(c,"<p class='small'>La revisión local no interpreta automáticamente cada símbolo de la imagen. Usa el prompt de revisión visual para un análisis detallado en ChatGPT.</p>");show($("flowchartOutput"),cl,h);
});
function flowPrompt(){return `ACTÚA COMO EXPERTO EN METODOLOGÍA DE PROYECTOS DE GRADO DE INGENIERÍA ELECTRÓNICA Y EN DISEÑO DE ALGORITMOS.

TÍTULO:
${$("projectTitle").value.trim()||"[NO INGRESADO]"}

OBJETIVO GENERAL:
${$("generalObjective").value.trim()||"[NO INGRESADO]"}

OBJETIVOS ESPECÍFICOS:
${$("specificObjectives").value.trim()||"[NO INGRESADOS]"}

DESCRIPCIÓN DEL ALGORITMO:
${$("flowchartDescription").value.trim()||"[NO INGRESADA]"}

REVISA LA IMAGEN ADJUNTA DEL DIAGRAMA DE FLUJO.
1. Comprueba uso lógico de Inicio/Fin, Entrada/Salida, Proceso, Decisión, Subproceso y conectores.
2. Comprueba que cada rombo tenga rutas claramente identificadas.
3. Detecta bucles abiertos, rutas sin retorno, pasos imposibles o decisiones contradictorias.
4. Verifica que las variables de entrada, cálculos, decisiones y salidas correspondan al hardware y al objetivo.
5. Indica si faltan inicialización, validación de datos, manejo de error, temporización, seguridad o comunicación.
6. No programes todavía. Primero corrige el ALGORITMO.
7. Devuelve: CUMPLE / CUMPLE PARCIALMENTE / REQUIERE REFORMULACIÓN; fortalezas; errores; correcciones concretas; y una secuencia lógica mejorada en texto para que el estudiante redibuje el flujograma.`;}
$("copyFlowPromptBtn").addEventListener("click",async()=>{await navigator.clipboard.writeText(flowPrompt());alert("Prompt copiado. Adjunta el flujograma en ChatGPT junto con este texto.");});

/* Code */
$("reviewCodeBtn").addEventListener("click",()=>{
  const t=$("codeText").value;if(!clean(t)){show($("codeOutput"),"bad","<h4>Falta código.</h4>");return;}
  const c=[
    [/[{};]/.test(t)?"good":"warn","Se detecta estructura de lenguaje de programación."],
    [hasAny(t,["setup","main","init","begin","config"])?"good":"warn","Identifica inicialización/configuración."],
    [hasAny(t,["read","analogread","digitalread","sensor","input","receive"])?"good":"warn","Debe reconocerse la adquisición/entrada."],
    [hasAny(t,["if","else","switch","case","while","for"])?"good":"warn","Debe existir la lógica definida por el algoritmo cuando corresponda."],
    [hasAny(t,["digitalwrite","analogwrite","print","send","transmit","output","write"])?"good":"warn","Debe reconocerse salida, actuación o comunicación."],
    [hasAny(t,["millis","delay","timer","dt","sample","period"])?"good":"warn","Revisa temporización y frecuencia de ejecución/muestreo."],
    [hasAny(t,["error","invalid","fail","alarm","watchdog","estop","safe"])?"good":"warn","Considera manejo de errores o seguridad si el proyecto lo requiere."]
  ];const [cl,h]=resultList(c,"<p>La explicación del código debe relacionar cada bloque con el flujograma, las variables físicas y el hardware. Evita explicar trivialidades sintácticas sin función ingenieril.</p>");show($("codeOutput"),cl,h);
});
function codePrompt(){return `ACTÚA COMO INGENIERO ELECTRÓNICO Y REVISOR DE PROYECTO DE GRADO.

OBJETIVO GENERAL:
${$("generalObjective").value.trim()||"[NO INGRESADO]"}

OBJETIVOS ESPECÍFICOS:
${$("specificObjectives").value.trim()||"[NO INGRESADOS]"}

CÓDIGO:
${$("codeText").value.trim()||"[NO INGRESADO]"}

TAREA:
1. Explica el código por bloques funcionales y, cuando sea útil, línea por línea.
2. Para cada bloque indica: qué recibe, qué calcula/procesa, qué decisión ejecuta y qué salida produce.
3. Relaciona variables de software con magnitudes físicas y unidades.
4. Relaciona funciones y pines/interfaces con el hardware.
5. Comprueba que el código corresponda al algoritmo diseñado; si falta el flujograma, indícalo.
6. Detecta conflictos lógicos, temporización bloqueante, saturación, falta de validación, errores de rango, problemas de seguridad o inconsistencias de pines.
7. No inventes librerías, pines ni especificaciones no aportadas.
8. Separa claramente: software (algoritmo/código) y firmware (programa cargado e integrado con el hardware).
9. Devuelve CUMPLE / CUMPLE PARCIALMENTE / REQUIERE CORRECCIÓN y recomendaciones concretas.`;}
$("copyCodePromptBtn").addEventListener("click",async()=>{await navigator.clipboard.writeText(codePrompt());alert("Prompt de revisión del programa copiado.");});

$("reviewImplementationBtn").addEventListener("click",()=>{
  const t=clean($("implementationText").value);if(!t){show($("implementationOutput"),"bad","<h4>Falta información</h4>");return;}
  const c=[
    [hasAny(t,["protoboard","pcb","tarjeta","placa","montaje","ensambl"])?"good":"bad","La implementación debe mostrar materialización física."],
    [hasAny(t,["entrada","sensor","variable"])?"good":"warn","Identifica entradas reales."],
    [hasAny(t,["salida","actuador","display","motor","relé","rele","señal"])?"good":"warn","Identifica salidas reales."],
    [hasAny(t,["analógica","analogica","digital","pwm","uart","i2c","spi","frecuencia"])?"good":"warn","Indica tipo de señal o interfaz."],
    [/\d/.test(t)?"good":"warn","Incluye magnitudes/valores de integración."],
    [hasAny(t,["multímetro","multimetro","osciloscopio","analizador","fuente","generador"])?"good":"warn","Documenta instrumentos usados para observar señales."],
    [hasAny(t,["estadística","desviación estándar","desviacion estandar","error porcentual final","criterio de aceptación","criterio de aceptacion"])?"warn":"good","Evita trasladar aquí la evaluación formal propia del Capítulo IV."]
  ];const [cl,h]=resultList(c);show($("implementationOutput"),cl,h);
});
$("reviewMechanicalBtn").addEventListener("click",()=>{
  const t=clean($("mechanicalText").value);if(!t){show($("mechanicalOutput"),"warn","<h4>Sin contenido</h4><p>Si tu proyecto no posee elementos mecánicos, esta sección puede no aplicar.</p>");return;}
  const c=[
    [/\d/.test(t)?"good":"warn","El diseño mecánico debe contener dimensiones o valores."],
    [hasAny(t,["kg","masa","peso","newton","n ","fuerza","torque","par","rpm","m/s","velocidad","aceleración","aceleracion","esfuerzo","tensión","tension"])?"good":"warn","Incluye magnitudes mecánicas pertinentes."],
    [/[=+\-*/^]|f=|τ|sigma|σ|p=/i.test(t)?"good":"warn","Incluye ecuaciones aplicadas, no solo geometría CAD."],
    [hasAny(t,["material","aluminio","acero","abs","pla","petg","acrílico","acrilico"])?"good":"warn","Justifica el material cuando soporta cargas."],
    [hasAny(t,["seguridad","factor de seguridad","carga máxima","carga maxima","esfuerzo admisible"])?"good":"warn","Considera seguridad/reserva estructural cuando corresponda."]
  ];const [cl,h]=resultList(c);show($("mechanicalOutput"),cl,h);
});
$("reviewChassisBtn").addEventListener("click",()=>{
  const t=clean($("chassisText").value);if(!t){show($("chassisOutput"),"bad","<h4>Falta información</h4>");return;}
  const c=[
    [hasAny(t,["mm","cm","dimensión","dimension","ancho","alto","profundidad"])?"good":"bad","Define dimensiones del gabinete."],
    [hasAny(t,["material","acrílico","acrilico","aluminio","abs","acero","pla","petg"])?"good":"warn","Justifica material."],
    [hasAny(t,["ventil","térmico","termico","temperatura","disip"])?"good":"warn","Revisa disipación térmica."],
    [hasAny(t,["ip54","ip65","ip ","polvo","humedad","agua","sellado"])?"good":"warn","Evalúa protección ambiental según el entorno, sin asignar un IP arbitrario."],
    [hasAny(t,["fusible","tierra","aisla","ac/dc","seguridad","protección","proteccion"])?"good":"warn","Incluye seguridad eléctrica."],
    [hasAny(t,["conector","bornera","usb","panel","led","interruptor","sensor","actuador"])?"good":"warn","Distribuye conectores, interfaces y paneles."],
    [hasAny(t,["cad","dxf","cnc","láser","laser","impresión 3d","impresion 3d","mecanizado"])?"good":"warn","Indica método de fabricación o adaptación."]
  ];const [cl,h]=resultList(c,"<p>Si se declara un grado IP, debe sustentarse con el diseño real del gabinete y la norma correspondiente.</p>");show($("chassisOutput"),cl,h);
});

/* Full review */
function row(name,status,detail){const cls=status==="CUMPLE"?"good":status==="NO CUMPLE"?"bad":"warn";return `<tr><td>${name}</td><td class="status-${cls}">${status}</td><td>${detail}</td></tr>`;}
$("runFullReviewBtn").addEventListener("click",()=>{
  const objs=lineList($("specificObjectives").value), area=detectArea(), scope=inferScope();
  const rows=[];
  rows.push(row("Objetivos cargados",objs.length?"CUMPLE":"NO CUMPLE",objs.length?`${objs.length} objetivos disponibles.`:"Faltan Objetivos Específicos."));
  rows.push(row("Selección tecnológica",clean($("selectionText").value)?"CUMPLE":"CUMPLE PARCIALMENTE",clean($("selectionText").value)?"Existe documentación de selección.":"Puede ser necesaria según los verbos."));
  rows.push(row("Modelo matemático / cálculos",clean($("mathText").value)?"CUMPLE":"CUMPLE PARCIALMENTE",clean($("mathText").value)?"Existe evidencia matemática.":"Comprueba si el diseño requiere dimensionamiento/modelado."));
  rows.push(row("Diseño de hardware",clean($("hardwareText").value)?"CUMPLE":"CUMPLE PARCIALMENTE",area==="telecom"?"No se exige hardware físico en este módulo de telecomunicaciones.":clean($("hardwareText").value)?"Existe sección de hardware.":"Revisar según objetivo."));
  rows.push(row("Simulación",clean($("simulationText").value)?"CUMPLE":"CUMPLE PARCIALMENTE",clean($("simulationText").value)?"Existe documentación de simulación.":"Debe incluirse cuando sea técnicamente pertinente."));
  rows.push(row("Diseño de software / algoritmo",flowInfo?"CUMPLE":"CUMPLE PARCIALMENTE",flowInfo?"Se cargó flujograma.":"Cargar flujograma si el sistema incorpora software."));
  rows.push(row("Programación / firmware",clean($("codeText").value)?"CUMPLE":"CUMPLE PARCIALMENTE",clean($("codeText").value)?"Existe código para revisar.":"Solo aplica cuando el sistema incorpora programación."));
  const implRequired=scope==="prototype" && area!=="telecom";
  rows.push(row("Implementación",clean($("implementationText").value)?"CUMPLE":implRequired?"NO CUMPLE":"CUMPLE PARCIALMENTE",clean($("implementationText").value)?"Existe evidencia de integración.":implRequired?"El alcance indica prototipo; falta implementación.":"No se obliga si el alcance aprobado es solo diseño."));
  rows.push(row("Diseño mecánico",clean($("mechanicalText").value)?"CUMPLE":area==="robotics"?"NO CUMPLE":"CUMPLE PARCIALMENTE",clean($("mechanicalText").value)?"Existe diseño mecánico.":area==="robotics"?"En robótica/mecatrónica normalmente debe justificarse la mecánica.":"Puede no aplicar."));
  rows.push(row("Chasis / gabinete",clean($("chassisText").value)?"CUMPLE":"CUMPLE PARCIALMENTE",clean($("chassisText").value)?"Existe diseño de gabinete.":"Añadir si el prototipo requiere alojar electrónica."));
  const fail=rows.filter(x=>x.includes("NO CUMPLE")).length;
  show($("fullReviewOutput"),fail?"warn":"ok",`<h4>${fail?"🟡 DESARROLLO AÚN INCOMPLETO":"🟢 RUTA TÉCNICA DOCUMENTADA"}</h4><table class="review-table"><thead><tr><th>Criterio</th><th>Dictamen</th><th>Observación</th></tr></thead><tbody>${rows.join("")}</tbody></table><p><b>Recordatorio:</b> este dictamen no sustituye el Capítulo IV. Aquí se revisa que el diseño e implementación estén documentados; la evaluación técnica final se hará en el siguiente chatbot.</p>`);
});

/* Deep prompt */
function deepPrompt(){
 return `ACTÚA COMO DOCTOR EN METODOLOGÍA DE LA INVESTIGACIÓN APLICADA A INGENIERÍA ELECTRÓNICA Y COMO INGENIERO ELECTRÓNICO REVISOR DE PROYECTOS DE GRADO.

TÍTULO:
${$("projectTitle").value.trim()||"[NO INGRESADO]"}

OBJETIVO GENERAL:
${$("generalObjective").value.trim()||"[NO INGRESADO]"}

OBJETIVOS ESPECÍFICOS:
${$("specificObjectives").value.trim()||"[NO INGRESADOS]"}

TIPO DE PROYECTO: ${areaName(detectArea())}
ALCANCE: ${scopeName(inferScope())}

SELECCIÓN TECNOLÓGICA:
${$("selectionText").value.trim()||"[NO INGRESADA]"}

MODELO MATEMÁTICO / CÁLCULOS:
${$("mathText").value.trim()||"[NO INGRESADOS]"}

DISEÑO DE HARDWARE:
${$("hardwareText").value.trim()||"[NO INGRESADO]"}

SIMULACIÓN:
${$("simulationText").value.trim()||"[NO INGRESADA]"}

DESCRIPCIÓN DEL ALGORITMO:
${$("flowchartDescription").value.trim()||"[NO INGRESADA]"}

CÓDIGO:
${$("codeText").value.trim()||"[NO INGRESADO]"}

IMPLEMENTACIÓN:
${$("implementationText").value.trim()||"[NO INGRESADA]"}

DISEÑO MECÁNICO:
${$("mechanicalText").value.trim()||"[NO INGRESADO / NO APLICA]"}

CHASIS:
${$("chassisText").value.trim()||"[NO INGRESADO]"}

INSTRUCCIONES DE REVISIÓN:
1. Extrae el verbo en infinitivo de cada Objetivo Específico y explica qué evidencia exige realmente ese verbo.
2. No nombres los subtítulos “Objetivo Específico 1/2/...”. Propón subtítulos nominalizados relacionados con la acción: Identificación, Selección, Diseño, Implementación, Calibración, etc.
3. Respeta la jerarquía institucional: Capítulo 16 pt; subtítulo principal 14 pt; niveles posteriores 12 pt, Times New Roman y negrilla según el esquema.
4. Verifica que el estudiante HAGA lo que promete el verbo. Señala contradicciones entre verbo y evidencia.
5. Distingue Marco Teórico de Ingeniería del Proyecto: evita descripciones generales de componentes; exige selección, cálculo, dimensionamiento, modelo, esquema, algoritmo o implementación aplicada.
6. Para selección tecnológica exige alternativas, criterios comunes, fuentes/datasheets y justificación.
7. Para diseño exige requerimientos, cálculos/modelo matemático, hardware, algoritmos, simulación y, solo si el alcance lo exige, implementación.
8. Revisa que cada ecuación tenga variables definidas, unidades, parámetros sustentados, sustitución numérica e interpretación física.
9. En hardware revisa entradas, salidas, niveles, interfaces, acondicionamiento, potencia, alimentación y protecciones.
10. En simulación exige ENTRADAS + MODELO/CIRCUITO + INSTRUMENTO + RESULTADO observable + interpretación. Una captura del circuito sola NO basta.
11. El diseño de software es el ALGORITMO; la programación viene después. Si se adjunta flujograma, revísalo visualmente.
12. Cada algoritmo debe corresponder con un programa/código. Explica el código por bloques o líneas significativas y vincúlalo al hardware.
13. Implementación: revisar montaje, firmware, señales analógicas/digitales, magnitudes, instrumentos y valores de integración.
14. NO trasladar al Capítulo III las pruebas formales, evaluación técnica, análisis estadístico o dictamen de desempeño del Capítulo IV.
15. Si existe mecánica, exigir cálculos de masa/peso, fuerza, torque, velocidad, potencia, esfuerzo o resistencia de materiales según corresponda; no forzar fórmulas irrelevantes.
16. Para chasis revisar dimensiones, material, térmica, seguridad eléctrica, distribución interna, conectores, acceso, ambiente y fabricación.
17. Para telecomunicaciones no exigir implementación física de red en este chatbot; limitarse a advertir que el diseño especializado será revisado en otro módulo.
18. No inventes datos, componentes, referencias, valores de datasheet ni resultados.
19. Si falta información, indícalo explícitamente.

FORMATO DE RESPUESTA:
A. DICTAMEN GENERAL.
B. MATRIZ OBJETIVO → VERBO → SIGNIFICADO → EVIDENCIA EXIGIDA → CUMPLIMIENTO.
C. SUBTÍTULOS PROPUESTOS PARA EL CAPÍTULO III.
D. VACÍOS TÉCNICOS.
E. REVISIÓN DE CÁLCULOS/MODELO.
F. REVISIÓN DE HARDWARE.
G. REVISIÓN DE SIMULACIÓN.
H. REVISIÓN DE ALGORITMOS.
I. REVISIÓN DE PROGRAMACIÓN/FIRMWARE.
J. REVISIÓN DE IMPLEMENTACIÓN.
K. REVISIÓN MECÁNICA, SI APLICA.
L. REVISIÓN DEL CHASIS.
M. QUÉ DEBE TRASLADARSE AL CAPÍTULO IV.
N. RECOMENDACIONES CONCRETAS Y ORDEN DE CORRECCIÓN.`;
}
$("copyDeepPromptBtn").addEventListener("click",async()=>{await navigator.clipboard.writeText(deepPrompt());$("deepPromptStatus").textContent="Prompt completo copiado.";});
