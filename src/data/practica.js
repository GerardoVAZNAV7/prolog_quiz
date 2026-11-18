// Normaliza: renombra variables por orden de aparición, quita espacios y compara.
function canon(t) {
  return t.split(/\.(?=\s|$)/).map(c => c.trim()).filter(Boolean).map(c => {
    const m = {}; let n = 0
    return c.replace(/"/g, "'").split(/('[^']*')/).map(p =>
      p.startsWith("'") ? p : p.replace(/\b[A-Z_][A-Za-z0-9_]*\b/g, v => v === '_' ? v : (m[v] ??= 'V' + (n++)))
    ).join('').replace(/\s+/g, '')
  }).join('.')
}
export const revisar = (texto, oks) => oks.some(o => canon(o) === canon(texto))

const e = (tema, enunciado, pista, ok) => ({ tema, enunciado, pista, ok, sol: ok[0] })

export const ejercicios = [
  e('Árbol', "Escribe el HECHO: Ana es madre de Luis.", 'madrede(Madre, Hijo).',
    ["madrede('Ana','Luis').", 'madrede(ana,luis).']),
  e('Árbol', "Escribe la CONSULTA: ¿de quién es padre Pablo? (usa una variable)", 'Variable en mayúscula, sin comillas.',
    ["padrede('Pablo',X).", "progenitorde('Pablo',X)."]),
  e('Árbol', 'Escribe la regla hijode(A,B): A es hijo de B (A es hombre).', 'Usa hombre(A) y progenitorde(B,A).',
    ['hijode(A,B) :- hombre(A), progenitorde(B,A).', 'hijode(A,B) :- progenitorde(B,A), hombre(A).']),
  e('Árbol', 'Escribe la regla abuelade(X,Y) usando progenitorde y mujer.', 'X es progenitor de Z, Z es progenitor de Y.',
    ['abuelade(X,Y) :- mujer(X), progenitorde(X,Z), progenitorde(Z,Y).', 'abuelade(X,Y) :- progenitorde(X,Z), progenitorde(Z,Y), mujer(X).']),
  e('Árbol', 'Escribe hermanode(X,Y) (X hombre, comparten progenitor, X distinto de Y).', 'No olvides \\== al final.',
    ['hermanode(X,Y) :- hombre(X), progenitorde(Z,X), progenitorde(Z,Y), X \\== Y.', 'hermanode(X,Y) :- progenitorde(Z,X), progenitorde(Z,Y), hombre(X), X \\== Y.']),
  e('Árbol', 'Escribe la regla recursiva antepasadode(X,Y) (dos cláusulas).', 'Caso base: progenitorde(X,Y). Recursivo: pasa por Z.',
    ['antepasadode(X,Y) :- progenitorde(X,Y).\nantepasadode(X,Y) :- progenitorde(X,Z), antepasadode(Z,Y).']),
  e('Árbol', "Escribe la consulta que imprime todos los abuelos: 'X es abuelo de Y'.", "forall + format con ~w y ~n.",
    ["forall(abuelode(X,Y), format('~w es abuelo de ~w~n', [X,Y]))."]),
  e('Jarras', 'Jarras de 3 y 5, estado j(A,B): escribe la meta (4 litros en la de 5).', 'La jarra de 3 no importa: usa _.',
    ['meta(j(_,4)).']),
  e('Jarras', 'Escribe el movimiento llenar la jarra de 5: mover(Estado, Nuevo, llenar5).', 'Solo si B < 5.',
    ['mover(j(A,B), j(A,5), llenar5) :- B < 5.']),
  e('Jarras', 'Escribe el vertido de 5 en 3 cuando NO cabe todo (nombre verter5en3).', 'Condición A+B > 3. B2 is A+B-3.',
    ['mover(j(A,B), j(3,B2), verter5en3) :- B > 0, A < 3, A + B > 3, B2 is A + B - 3.']),
  e('Jarras', 'Escribe la consulta que pide una solución al problema (predicado solucion/1).', 'Variable C para el camino.',
    ['solucion(C).']),
  e('Misioneros', 'Escribe el estado inicial: 3 misioneros, 3 caníbales y la barca a la izquierda.', 'Usa e(MI,CI,Barca) y el hecho inicial(...).',
    ['inicial(e(3,3,izq)).']),
  e('Misioneros', 'Escribe la meta: todos en la orilla derecha.', 'meta(e(...)).',
    ['meta(e(0,0,der)).']),
  e('8 Reinas', 'Usa permutation para generar una lista P con las filas 1 a 8 en distinto orden.', 'permutation([1,2,...], P).',
    ['permutation([1,2,3,4,5,6,7,8], P).']),
  e('Sudoku', 'Declara que la variable X toma valores del 1 al 9 (clpfd).', 'X in ...',
    ['X in 1..9.']),
  e('Sudoku', 'Impón que A, B y C sean todos distintos.', 'all_different([...]).',
    ['all_different([A,B,C]).']),
  e('Ajedrez', "Escribe el hecho: rey blanco en la columna e, fila 1 (pieza/4).", 'pieza(Tipo,Color,Col,Fila).',
    ['pieza(rey,blanco,e,1).']),
  e('Ajedrez', 'Consulta: ¿dónde están las piezas negras? (variables para tipo, columna y fila)', 'pieza(T,negro,C,F).',
    ['pieza(T,negro,C,F).'])
]
