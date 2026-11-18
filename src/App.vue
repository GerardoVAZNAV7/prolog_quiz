<script setup>
import { ref, computed } from 'vue'
import { preguntas, categorias } from './data/quiz.js'
import { ejercicios, revisar } from './data/practica.js'

const pantalla = ref('menu')

/* ---------- QUIZ ---------- */
const cat = ref('Todas')
const lista = ref([])
const i = ref(0)
const elegida = ref(null)
const puntos = ref(0)
const actual = computed(() => lista.value[i.value])
const fin = computed(() => i.value >= lista.value.length)

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
}
function siguiente() { elegida.value = null; i.value++ }

/* ---------- PRÁCTICA ---------- */
const filtro = ref('Todos')
const temas = ['Todos', ...new Set(ejercicios.map(x => x.tema))]
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
  if (revisar(texto.value, ej.value.ok)) {
    estado.value = 'ok'
    if (!bien.value.includes(j.value)) bien.value.push(j.value)
  } else estado.value = 'mal'
}
function sigEj() { j.value++; limpiar() }
</script>

<template>
  <main>
    <h1>🧠 Quiz de Prolog</h1>

    <!-- MENÚ -->
    <section v-if="pantalla === 'menu'" class="card">
      <h2>Quiz de opción múltiple</h2>
      <p>Conceptos de Prolog y código de los juegos.</p>
      <select v-model="cat">
        <option>Todas</option>
        <option v-for="c in categorias" :key="c">{{ c }}</option>
      </select>
      <button class="main" @click="iniciarQuiz">Empezar quiz</button>

      <h2>Práctica de código</h2>
      <p>Escribe hechos, consultas y reglas tú mismo.</p>
      <select v-model="filtro">
        <option v-for="t in temas" :key="t">{{ t }}</option>
      </select>
      <button class="main" @click="iniciarPractica">Empezar práctica</button>
    </section>

    <!-- QUIZ -->
    <section v-else-if="pantalla === 'quiz'" class="card">
      <template v-if="!fin">
        <small>{{ actual.cat }} · Pregunta {{ i + 1 }} de {{ lista.length }} · Puntos: {{ puntos }}</small>
        <h2>{{ actual.p }}</h2>
        <button
          v-for="(o, n) in actual.o" :key="n"
          class="op"
          :class="{ bien: elegida !== null && n === actual.a, mal: elegida === n && n !== actual.a }"
          @click="responder(n)"
        >{{ o }}</button>
        <div v-if="elegida !== null" class="exp">
          <b>{{ elegida === actual.a ? '✅ Correcto' : '❌ Incorrecto' }}.</b> {{ actual.e }}
          <button class="main" @click="siguiente">Siguiente →</button>
        </div>
      </template>
      <template v-else>
        <h2>Resultado: {{ puntos }} / {{ lista.length }}</h2>
        <button class="main" @click="iniciarQuiz">Repetir</button>
        <button @click="pantalla = 'menu'">Menú</button>
      </template>
    </section>

    <!-- PRÁCTICA -->
    <section v-else class="card">
      <template v-if="!finP">
        <small>{{ ej.tema }} · Ejercicio {{ j + 1 }} de {{ lote.length }} · Aciertos: {{ bien.length }}</small>
        <h2>{{ ej.enunciado }}</h2>
        <textarea v-model="texto" rows="4" spellcheck="false" placeholder="Escribe tu código Prolog…"></textarea>
        <div class="fila">
          <button class="main" @click="comprobar">Comprobar</button>
          <button @click="pista = true">Pista</button>
          <button @click="solucion = true">Ver solución</button>
        </div>
        <p v-if="pista" class="exp">💡 {{ ej.pista }}</p>
        <p v-if="estado === 'ok'" class="exp bien">✅ ¡Correcto!</p>
        <p v-if="estado === 'mal'" class="exp mal">❌ Todavía no. Revisa puntos, comas, comillas y mayúsculas.</p>
        <pre v-if="solucion">{{ ej.sol }}</pre>
        <button @click="sigEj">Siguiente →</button>
      </template>
      <template v-else>
        <h2>Acertaste {{ bien.length }} de {{ lote.length }}</h2>
        <button class="main" @click="iniciarPractica">Repetir</button>
        <button @click="pantalla = 'menu'">Menú</button>
      </template>
    </section>

    <button v-if="pantalla !== 'menu'" class="link" @click="pantalla = 'menu'">← Volver al menú</button>
  </main>
</template>

<style>
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0; }
main { max-width: 720px; margin: 0 auto; padding: 24px 16px; }
h1 { text-align: center; }
.card { background: #1e293b; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
h2 { margin: 8px 0 0; font-size: 1.15rem; }
small, p { color: #94a3b8; margin: 0; }
button, select, textarea { font: inherit; border-radius: 10px; border: 1px solid #334155; background: #0f172a; color: inherit; padding: 10px 14px; }
button { cursor: pointer; text-align: left; }
button:hover { border-color: #38bdf8; }
button.main { background: #0284c7; border-color: #0284c7; text-align: center; font-weight: 600; }
button.link { background: none; border: none; color: #38bdf8; margin-top: 12px; }
.op.bien { background: #14532d; border-color: #22c55e; }
.op.mal { background: #7f1d1d; border-color: #ef4444; }
.exp { background: #0f172a; border-radius: 10px; padding: 12px; color: #e2e8f0; display: flex; flex-direction: column; gap: 10px; }
.exp.bien { border: 1px solid #22c55e; }
.exp.mal { border: 1px solid #ef4444; }
textarea { font-family: ui-monospace, Menlo, monospace; resize: vertical; }
pre { background: #0f172a; padding: 12px; border-radius: 10px; overflow-x: auto; margin: 0; color: #86efac; }
.fila { display: flex; gap: 8px; flex-wrap: wrap; }
</style>
