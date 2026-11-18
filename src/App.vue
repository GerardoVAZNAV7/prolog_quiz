<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { preguntas, categorias } from './data/quiz.js'
import { ejercicios, revisar } from './data/practica.js'

const pantalla = ref('menu')

/* ---------- SONIDO ---------- */
let audio
function sonar(ok) {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  audio ??= new AC()
  if (audio.state === 'suspended') audio.resume()
  const t = audio.currentTime
  const notas = ok ? [660, 990] : [240, 165]
  notas.forEach((f, n) => {
    const o = audio.createOscillator(), g = audio.createGain()
    o.type = ok ? 'sine' : 'triangle'
    o.frequency.value = f
    const t0 = t + n * 0.11
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(ok ? 0.12 : 0.1, t0 + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.1)
    o.connect(g).connect(audio.destination)
    o.start(t0); o.stop(t0 + 0.11)
  })
}

/* ---------- QUIZ ---------- */
const cat = ref('Todas')
const lista = ref([])
const i = ref(0)
const elegida = ref(null)
const puntos = ref(0)
const actual = computed(() => lista.value[i.value])
const fin = computed(() => i.value >= lista.value.length)
const cuentaCat = c => c === 'Todas' ? preguntas.length : preguntas.filter(p => p.cat === c).length

function iniciarQuiz() {
  const base = cat.value === 'Todas' ? preguntas : preguntas.filter(p => p.cat === cat.value)
  lista.value = [...base].sort(() => Math.random() - 0.5)
  i.value = 0; elegida.value = null; puntos.value = 0
  pantalla.value = 'quiz'
}
function responder(n) {
  if (elegida.value !== null) return
  elegida.value = n
  if (n === actual.value.a) puntos.value++
  sonar(n === actual.value.a)
}
function siguiente() { elegida.value = null; i.value++ }

/* ---------- PRÁCTICA ---------- */
const filtro = ref('Todos')
const temas = ['Todos', ...new Set(ejercicios.map(x => x.tema))]
const cuentaTema = t => t === 'Todos' ? ejercicios.length : ejercicios.filter(x => x.tema === t).length
const lote = ref([])
const j = ref(0)
const texto = ref('')
const estado = ref('')
const pista = ref(false)
const solucion = ref(false)
const bien = ref([])
const ej = computed(() => lote.value[j.value])
const finP = computed(() => j.value >= lote.value.length)

function iniciarPractica() {
  lote.value = ejercicios.filter(x => filtro.value === 'Todos' || x.tema === filtro.value)
  j.value = 0; bien.value = []; limpiar()
  pantalla.value = 'practica'
}
function limpiar() { texto.value = ''; estado.value = ''; pista.value = false; solucion.value = false }
function comprobar() {
  const ok = revisar(texto.value, ej.value.ok)
  estado.value = ok ? 'ok' : 'mal'
  if (ok && !bien.value.includes(j.value)) bien.value.push(j.value)
  sonar(ok)
}
function sigEj() { j.value++; limpiar() }

/* Atajos: A-D o 1-4 responden la pregunta actual. */
function atajo(e) {
  if (pantalla.value !== 'quiz' || fin.value || elegida.value !== null) return
  if (e.ctrlKey || e.metaKey || e.altKey) return
  const k = e.key.toLowerCase()
  const n = Math.max('abcd'.indexOf(k), '1234'.indexOf(k))
  if (n >= 0 && n < actual.value.o.length) { e.preventDefault(); responder(n) }
}
onMounted(() => window.addEventListener('keydown', atajo))
onUnmounted(() => window.removeEventListener('keydown', atajo))
function ir(t) {
  if (t === 'menu') pantalla.value = 'menu'
  else if (t === 'quiz' && pantalla.value !== 'quiz') iniciarQuiz()
  else if (t === 'practica' && pantalla.value !== 'practica') iniciarPractica()
}
</script>

<template>
  <header class="barra">
    <button class="marca" @click="ir('menu')"><span class="prompt">?-</span> Prolog quiz</button>
    <nav>
      <button :class="{ on: pantalla === 'menu' }" @click="ir('menu')">Menú</button>
      <button :class="{ on: pantalla === 'quiz' }" @click="ir('quiz')">Quiz</button>
      <button :class="{ on: pantalla === 'practica' }" @click="ir('practica')">Práctica</button>
    </nav>
  </header>

  <main class="lienzo">
    <template v-if="pantalla === 'menu'">
      <h1>Quiz de Prolog</h1>
      <p class="bajada">Elige una categoría o un tema y empieza.</p>

      <div class="rejilla">
        <div class="dos">
          <section class="card">
            <h2>Opción múltiple</h2>
            <p class="nota">Conceptos y código de los juegos.</p>
            <div class="lista-opciones">
              <button v-for="c in ['Todas', ...categorias]" :key="c"
                      :aria-pressed="cat === c" @click="cat = c">
                {{ c }} <span class="n">{{ cuentaCat(c) }}</span>
              </button>
            </div>
            <button class="pri ancho" @click="iniciarQuiz">Empezar quiz</button>
          </section>

          <section class="card">
            <h2>Práctica de código</h2>
            <p class="nota">Escribe hechos, consultas y reglas tú mismo.</p>
            <div class="lista-opciones">
              <button v-for="t in temas" :key="t"
                      :aria-pressed="filtro === t" @click="filtro = t">
                {{ t }} <span class="n">{{ cuentaTema(t) }}</span>
              </button>
            </div>
            <button class="pri ancho" @click="iniciarPractica">Empezar práctica</button>
          </section>
        </div>

        <aside class="rail">
          <h2>Contenido</h2>
          <dl class="datos">
            <div><dt>Preguntas</dt><dd>{{ preguntas.length }}</dd></div>
            <div><dt>Categorías</dt><dd>{{ categorias.length }}</dd></div>
            <div><dt>Ejercicios</dt><dd>{{ ejercicios.length }}</dd></div>
            <div><dt>Temas</dt><dd>{{ temas.length - 1 }}</dd></div>
          </dl>
          <h3>Cómo se corrige</h3>
          <pre>padrede(A,B).
padrede(X,Y).</pre>
          <p class="nota">Cuentan como el mismo código: los espacios y los nombres de variables no importan.</p>
        </aside>
      </div>
    </template>

    <template v-else-if="pantalla === 'quiz'">
      <h1>Quiz</h1>
      <p class="bajada">{{ cat === 'Todas' ? 'Todas las categorías' : cat }}</p>

      <div class="rejilla">
        <section v-if="!fin" class="card">
          <h2 class="pregunta">{{ actual.p }}</h2>
          <div class="opciones">
            <button v-for="(o, n) in actual.o" :key="n"
                    class="op"
                    :class="{ bien: elegida !== null && n === actual.a, mal: elegida === n && n !== actual.a }"
                    :disabled="elegida !== null"
                    @click="responder(n)">{{ o }}<span class="tecla" aria-hidden="true">{{ 'ABCD'[n] }}</span></button>
          </div>
          <div v-if="elegida !== null" class="veredicto" aria-live="polite">
            <p><span class="pill" :class="elegida === actual.a ? 'pos' : 'neg'">{{ elegida === actual.a ? 'Correcto' : 'Incorrecto' }}</span> {{ actual.e }}</p>
            <div class="pie"><button class="pri" @click="siguiente">Siguiente</button></div>
          </div>
        </section>

        <section v-else class="card resultado">
          <h2>Resultado</h2>
          <p class="cifra">{{ puntos }}<span> / {{ lista.length }}</span></p>
          <div class="fila">
            <button class="pri" @click="iniciarQuiz">Repetir</button>
            <button class="sec" @click="ir('menu')">Menú</button>
          </div>
        </section>

        <aside v-if="!fin" class="rail">
          <h2>Avance</h2>
          <div class="strip" aria-hidden="true">
            <span v-for="(p, n) in lista" :key="n" :class="{ hecha: n < i, actual: n === i }"></span>
          </div>
          <p class="nota">Azul: la pregunta actual. Negro: las ya contestadas.</p>
          <dl class="datos">
            <div><dt>Correctas</dt><dd>{{ puntos }} / {{ lista.length }}</dd></div>
            <div><dt>Pregunta</dt><dd>{{ i + 1 }} / {{ lista.length }}</dd></div>
            <div><dt>Restantes</dt><dd>{{ lista.length - i - 1 }}</dd></div>
            <div><dt>Categoría</dt><dd>{{ actual.cat }}</dd></div>
          </dl>
          <p class="nota">Cada acierto suma un punto. Responde con A-D o 1-4.</p>
        </aside>
      </div>
    </template>

    <template v-else>
      <h1>Práctica</h1>
      <p class="bajada">{{ filtro === 'Todos' ? 'Todos los temas' : filtro }}</p>

      <div class="rejilla">
        <section v-if="!finP" class="card">
          <h2 class="pregunta">{{ ej.enunciado }}</h2>
          <label class="etiqueta" for="codigo">Tu código</label>
          <textarea id="codigo" v-model="texto" rows="4" spellcheck="false"
                    placeholder="Escribe tu código Prolog…"></textarea>
          <div class="fila">
            <button :class="estado === 'ok' ? 'sec' : 'pri'" @click="comprobar">Comprobar</button>
            <button class="sec" @click="pista = true">Pista</button>
            <button class="tex" @click="solucion = true">Ver solución</button>
          </div>
          <p v-if="pista" class="aviso">{{ ej.pista }}</p>
          <p v-if="estado" class="aviso" aria-live="polite">
            <span class="pill" :class="estado === 'ok' ? 'pos' : 'neg'">{{ estado === 'ok' ? 'Correcto' : 'Todavía no' }}</span>
            {{ estado === 'ok' ? 'Tu consulta cumple el ejercicio.' : 'Revisa puntos, comas, comillas y mayúsculas.' }}
          </p>
          <pre v-if="solucion">{{ ej.sol }}</pre>
          <div v-if="estado || solucion" class="pie">
            <button :class="estado === 'ok' ? 'pri' : 'sec'" @click="sigEj">Siguiente</button>
          </div>
        </section>

        <section v-else class="card resultado">
          <h2>Acertaste</h2>
          <p class="cifra">{{ bien.length }}<span> / {{ lote.length }}</span></p>
          <div class="fila">
            <button class="pri" @click="iniciarPractica">Repetir</button>
            <button class="sec" @click="ir('menu')">Menú</button>
          </div>
        </section>

        <aside v-if="!finP" class="rail">
          <h2>Avance</h2>
          <dl class="datos">
            <div><dt>Correctos</dt><dd>{{ bien.length }} / {{ lote.length }}</dd></div>
            <div><dt>Ejercicio</dt><dd>{{ j + 1 }} / {{ lote.length }}</dd></div>
            <div><dt>Restantes</dt><dd>{{ lote.length - j - 1 }}</dd></div>
            <div><dt>Tema</dt><dd>{{ ej.tema }}</dd></div>
          </dl>
          <p class="nota">Los espacios y los nombres de variables no cuentan: X, Y y A, B son lo mismo.</p>
        </aside>
      </div>
    </template>
  </main>
</template>

<style>
:root {
  --ground: #f2f4f7;
  --surface: #ffffff;
  --raised: #eeeeee;
  --border: #e6e6e6;
  --rule: #f0f0f0;
  --control: #d4d4d4;
  --text: #0a0a0a;
  --muted: #5f6368;
  --accent: #141414;
  --data: #1d5fbf;
  --pos-bg: #dcfae5; --pos-ink: #04250e; --pos-line: #a7e6c0;
  --neg-bg: #ffedea; --neg-ink: #831c1e; --neg-line: #ffc9c2;
  --r-card: 8px;
  --r-control: 6px;
  --gap: 24px;
  --pad: 24px;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--ground);
  color: var(--text);
  font: 14px/1.45 "Geist", Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
/* Columna 1080: contenido 736 + hueco 24 + barra lateral 320 = 1080. */
.barra, .lienzo { max-width: 1128px; margin: 0 auto; padding: 0 24px; }
.barra { height: 48px; display: flex; align-items: center; justify-content: space-between; }
.lienzo { padding-top: 32px; padding-bottom: 64px; }

button {
  font: inherit; color: inherit; background: none;
  border: 0; padding: 0; cursor: pointer; text-align: left;
}
:focus-visible { outline: 2px solid var(--text); outline-offset: 2px; }

.marca { font-size: 15px; font-weight: 500; }
.prompt { font-family: "Geist Mono", ui-monospace, monospace; color: var(--muted); margin-right: 2px; }
nav { display: flex; gap: 20px; }
nav button {
  font-size: 14px; font-weight: 500; color: var(--muted);
  padding: 14px 0; border-bottom: 2px solid transparent;
}
nav button:hover { color: var(--text); }
nav button.on { color: var(--text); border-bottom-color: var(--text); }

h1 { margin: 0; font-size: 24px; font-weight: 500; letter-spacing: -0.01em; }
.bajada { margin: 6px 0 0; color: var(--muted); font-size: 14px; }
h2 { margin: 0; font-size: 16px; font-weight: 500; }
h2.pregunta { font-size: 26px; line-height: 1.25; letter-spacing: -0.015em; }
.nota { margin: 6px 0 0; color: var(--muted); font-size: 12px; line-height: 1.5; }

.rejilla {
  margin-top: var(--gap);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: var(--gap);
  align-items: start;
}
.dos { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gap); }
.rail { padding-top: var(--pad); }
.rail > .datos { margin-top: 16px; }
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  padding: var(--pad);
}
.card > h2 + .nota { margin-bottom: 16px; }
.rejilla > .resultado {
  grid-column: 1 / -1;
  justify-self: center;
  width: 100%;
  max-width: 560px;
}

/* Botones */
.pri, .sec, .tex {
  height: 36px; padding: 0 14px; border-radius: var(--r-control);
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 500;
}
.pri { background: var(--accent); color: #fff; }
.pri:hover { background: #2b2b2b; }
.sec { background: var(--surface); border: 1px solid var(--control); }
.sec:hover { background: var(--rule); }
.tex { color: var(--muted); padding: 0 6px; }
.tex:hover { color: var(--text); }
.ancho { width: 100%; margin-top: auto; }
.fila { display: flex; flex-wrap: wrap; gap: 8px; }
.pie { display: flex; justify-content: flex-end; margin-top: 16px; }

/* Selector de categoría / tema */
.lista-opciones { margin: 0 0 16px; display: flex; flex-direction: column; gap: 2px; }
.lista-opciones button {
  display: flex; justify-content: space-between; align-items: center;
  height: 34px; padding: 0 10px; border-radius: var(--r-control); font-size: 14px;
}
.lista-opciones button:hover { background: var(--rule); }
.lista-opciones button[aria-pressed="true"] { background: var(--raised); font-weight: 500; }
.lista-opciones .n { color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; }
.lista-opciones button[aria-pressed="true"] .n { color: var(--text); }

/* Opciones del quiz */
.opciones { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
.op {
  min-height: 56px; padding: 14px 16px;
  border: 1px solid var(--border); border-radius: var(--r-control);
  display: flex; align-items: center; font-size: 15px; line-height: 1.4;
}
.op:hover:not(:disabled) { border-color: var(--control); }
.op:disabled { cursor: default; border-color: var(--border); }
.tecla { margin-left: auto; padding-left: 12px; color: var(--muted); font-size: 12px; }
.op.bien { background: var(--pos-bg); border-color: var(--pos-line); color: var(--pos-ink); }
.op.mal { background: var(--neg-bg); border-color: var(--neg-line); color: var(--neg-ink); }
.op.bien .tecla, .op.mal .tecla { color: inherit; }

/* Avisos y veredicto */
.veredicto { margin-top: 16px; border-top: 1px solid var(--rule); padding-top: 16px; }
.veredicto p { margin: 0; }
.aviso {
  margin: 16px 0 0; padding: 12px 14px; background: var(--ground);
  border-radius: var(--r-control); font-size: 14px;
}
.pill {
  display: inline-flex; align-items: center; height: 20px; padding: 0 7px;
  border-radius: 4px; font-size: 12px; font-weight: 500; margin-right: 6px;
}
.pill.pos { background: var(--pos-bg); color: var(--pos-ink); }
.pill.neg { background: var(--neg-bg); color: var(--neg-ink); }

/* Formulario de práctica */
.etiqueta { display: block; font-size: 12px; font-weight: 500; margin: 16px 0 8px; }
textarea {
  width: 100%; min-height: 112px; padding: 12px; resize: vertical;
  border: 1px solid var(--control); border-radius: var(--r-control);
  background: var(--surface); color: var(--text);
  font: 13px/1.6 "Geist Mono", ui-monospace, SFMono-Regular, monospace;
}
textarea + .fila { margin-top: 12px; }
pre {
  margin: 16px 0 0; padding: 12px 14px; overflow-x: auto;
  background: var(--raised); border-radius: var(--r-control);
  font: 13px/1.6 "Geist Mono", ui-monospace, SFMono-Regular, monospace;
}

/* Barra lateral de sesión */
h3 {
  margin: 20px 0 0; padding-top: 16px; border-top: 1px solid var(--rule);
  font-size: 16px; font-weight: 500;
}
h3 + pre { margin-top: 12px; }
.strip { display: flex; flex-wrap: wrap; gap: 4px; margin: 12px 0 8px; }
.strip span { width: 12px; height: 10px; border-radius: 2px; background: var(--raised); }
.strip span.hecha { background: var(--text); }
.strip span.actual { background: var(--data); }
.datos { margin: 12px 0 0; display: flex; flex-direction: column; }
.datos div {
  display: flex; justify-content: space-between; align-items: center; gap: 12px;
  height: 32px; border-top: 1px solid var(--rule);
}
.datos div:first-child { border-top: 0; }
.datos dt { color: var(--muted); font-size: 13px; }
.datos dd { margin: 0; font-size: 13px; font-variant-numeric: tabular-nums; }

/* Resultado */
.cifra {
  margin: 12px 0 16px; font-size: 30px;
  font-variant-numeric: tabular-nums; letter-spacing: -0.02em;
}
.cifra span { color: var(--muted); }

@media (max-width: 900px) {
  .rejilla { grid-template-columns: minmax(0, 1fr); }
  .dos { grid-template-columns: 1fr; }
  .datos div { height: 30px; }
}
@media (max-width: 560px) {
  .barra, .lienzo { padding-left: 16px; padding-right: 16px; }
  nav { gap: 16px; }
  h1 { font-size: 22px; }
  h2.pregunta { font-size: 20px; }
  .card { padding: 16px; }
}
</style>
