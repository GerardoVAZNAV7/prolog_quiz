const q = (cat, p, o, a, e) => ({ cat, p, o, a, e })

export const categorias = ['Básico', 'Jarras', 'Misioneros', '8 Reinas', 'Sudoku', 'Ajedrez']

export const preguntas = [
  // ---------- BÁSICO ----------
  q('Básico', '¿Qué es un predicado en Prolog?',
    ['Una relación con nombre y argumentos', 'Una variable que guarda un número', 'Un comentario dentro del programa', 'Un tipo de ciclo que se repite'], 0,
    'Un predicado es el nombre de una relación con sus argumentos. Se define con hechos y reglas.'),
  q('Básico', '¿Qué significa :- en una regla?',
    ['"Y": todas las condiciones deben cumplirse', '"Si": la cabeza es verdad si el cuerpo se cumple', '"O": basta con que una condición se cumpla', '"No": la cabeza es falsa si el cuerpo se cumple'], 1,
    'abuelode(X,Y) :- ... se lee "X es abuelo de Y SI ...".'),
  q('Básico', 'En el cuerpo de una regla, ¿qué significa la coma?',
    ['O: basta con una sola condición', 'Y: todas las condiciones deben cumplirse', 'Negación de la condición siguiente', 'Un comentario de una sola línea'], 1,
    'La coma es conjunción (Y). Para "O" usas ; o varias reglas con el mismo nombre.'),
  q('Básico', '¿Cuál de estos es una variable?',
    ['juan', 'X', "'x'", '3'], 1,
    'Las variables empiezan con Mayúscula o _. Los átomos empiezan con minúscula o van entre comillas.'),
  q('Básico', "En ?- hombre(X). ¿qué pasa si escribes 'X' con comillas?",
    ['Sigue siendo una variable', 'Se vuelve un átomo fijo', 'Da un error de sintaxis', 'Imprime todos los hombres'], 1,
    "Con comillas simples es un átomo. Las variables NUNCA llevan comillas."),
  q('Básico', '¿Qué hace \\+ ?',
    ['Suma dos números enteros', 'Negación por fallo', 'Compara dos términos', 'Imprime un resultado'], 1,
    '\\+ member(X,L) significa "X no está en L".'),
  q('Básico', '¿Diferencia entre is y = ?',
    ['No hay ninguna diferencia real', 'is calcula, = solo unifica', '= calcula, is solo compara', 'is es exclusivo para listas'], 1,
    'N is M+1 calcula. N = M+1 solo compara la forma, no suma.'),
  q('Básico', '¿Qué significa X \\== Y?',
    ['Que X y Y son idénticos', 'Que X y Y no son idénticos', 'Que X resulta mayor que Y', 'Que Y pasa a valer X'], 1,
    'Se usa en hermanode para que alguien no sea hermano de sí mismo.'),
  q('Básico', '¿Qué es el backtracking?',
    ['Retroceder y probar otras opciones', 'Borrar hechos del programa', 'Compilar el programa entero', 'Imprimir todos los resultados'], 0,
    'Prolog regresa al último punto con alternativas y prueba la siguiente.'),
  q('Básico', '¿Cómo imprimes todos los resultados de una consulta?',
    ['Con forall(Consulta, format(...))', 'Con write en cada solución', 'Con is y una variable nueva', 'Con member sobre la lista'], 0,
    "forall(abuelode(X,Y), format('~w es abuelo de ~w~n',[X,Y]))."),
  q('Básico', 'Una recursión correcta necesita…',
    ['Solo la regla recursiva, sin más', 'Un caso base y un caso recursivo', 'Solo hechos, sin ninguna regla', 'Un bucle for con un contador'], 1,
    'El caso base detiene la recursión; el recursivo se acerca a él.'),

  // ---------- JARRAS ----------
  q('Jarras', 'En el código de las jarras, ¿qué representa j(A,B)?',
    ['Un movimiento entre jarras', 'Un estado: litros en cada jarra', 'La meta que hay que alcanzar', 'La capacidad de las jarras'], 1,
    'Un estado es una "foto" de cuánta agua tiene cada jarra.'),
  q('Jarras', '¿Por qué meta(j(_,4)) usa un guion bajo?',
    ['Porque es un error de sintaxis', 'Porque ese valor no importa', 'Porque significa cero litros', 'Porque es un comentario corto'], 1,
    '_ es la variable anónima: "no me importa el valor".'),
  q('Jarras', '¿Por qué hay dos reglas para verter una jarra en otra?',
    ['Para duplicar el código y probar', 'Porque todo puede caber o sobrar', 'Porque una sirve para vaciar', 'Para que el programa sea rápido'], 1,
    'Caso 1: A+B =< capacidad. Caso 2: A+B > capacidad, la destino queda llena.'),
  q('Jarras', '¿Para qué sirve \\+ member(Nuevo, Visitados)?',
    ['Para contar los estados visitados', 'Para evitar ciclos infinitos', 'Para imprimir el camino final', 'Para vaciar las dos jarras'], 1,
    'Sin ella Prolog llenaría y vaciaría la misma jarra para siempre.'),
  q('Jarras', 'Verter la de 5 en la de 3 desde j(0,5). ¿Qué estado resulta?',
    ['j(3,2)', 'j(2,3)', 'j(0,2)', 'j(3,5)'], 0,
    'Caben 3 litros: la de 3 queda llena y a la de 5 le sobran 2.'),

  // ---------- MISIONEROS ----------
  q('Misioneros', 'Un estado típico es e(MI,CI,Barca). ¿Qué guarda?',
    ['Los de la izquierda y el lado de la barca', 'Solo el lado en el que está la barca', 'El número de pasos ya realizados', 'La meta final que hay que alcanzar'], 0,
    'La orilla derecha se calcula restando: 3-MI y 3-CI.'),
  q('Misioneros', '¿Cuándo es SEGURO un estado?',
    ['Cuando hay más caníbales que misioneros', 'Cuando en ninguna orilla sobran caníbales', 'Cuando la barca está en la orilla derecha', 'Cuando todos están en la orilla izquierda'], 1,
    'Si hay misioneros y menos que caníbales, se los comen.'),
  q('Misioneros', '¿Cuántas personas pueden ir en la barca?',
    ['Una o dos personas', 'Hasta tres personas', 'Siempre dos personas', 'Las que hagan falta'], 0,
    'Movimientos: 1M, 2M, 1C, 2C o 1M+1C.'),
  q('Misioneros', '¿Cuál es el estado inicial y la meta?',
    ['e(3,3,izq) y e(0,0,der)', 'e(0,0,izq) y e(3,3,der)', 'e(3,3,der) y e(3,3,izq)', 'e(1,1,izq) y e(0,0,der)'], 0,
    'Todos empiezan a la izquierda con la barca y todos terminan a la derecha.'),

  // ---------- 8 REINAS ----------
  q('8 Reinas', 'Si el tablero se representa como lista [F1,...,F8], ¿qué significa cada elemento?',
    ['La fila de la reina de esa columna', 'La columna en que está la reina', 'El número de ataques que recibe', 'El color de la casilla ocupada'], 0,
    'Cada columna tiene una reina; el valor es su fila. Así nunca coinciden en columna.'),
  q('8 Reinas', '¿Cómo detectas que dos reinas están en la misma diagonal?',
    ['Con F1 =:= F2 en el código', 'Con abs(F1-F2) =:= Dcolumnas', 'Con F1 + F2 =:= 8 en la lista', 'Con F1 \\== F2 en la consulta'], 1,
    'Si la diferencia de filas es igual a la diferencia de columnas, comparten diagonal.'),
  q('8 Reinas', '¿Qué hace permutation(L, P) al generar soluciones?',
    ['Ordena la lista de menor a mayor', 'Genera todas las ordenaciones', 'Borra los elementos repetidos', 'Cuenta las reinas colocadas'], 1,
    'Con permutaciones de [1..8] ya no se repiten filas; solo falta revisar diagonales.'),
  q('8 Reinas', '¿Cuántas soluciones tiene el problema de las 8 reinas?',
    ['8', '64', '92', '1000'], 2, '92 soluciones (12 distintas si se cuentan rotaciones y reflejos como iguales).'),

  // ---------- SUDOKU ----------
  q('Sudoku', '¿Qué librería se usa para el sudoku en Prolog?',
    ['library(clpfd)', 'library(lists)', 'library(sudoku)', 'ninguna librería'], 0,
    ':- use_module(library(clpfd)). permite restricciones sobre enteros.'),
  q('Sudoku', '¿Qué hace X in 1..9?',
    ['Suma los números del 1 al 9', 'Fija el dominio 1..9 de X', 'Crea una lista con 9 valores', 'Imprime X nueve veces'], 1,
    'Es el dominio de la variable.'),
  q('Sudoku', '¿Para qué sirve all_different([A,B,C]) y label/1?',
    ['all_different impone distintos; label busca', 'all_different busca valores; label impone', 'Ambos solo imprimen los valores hallados', 'Ambos hacen lo mismo, no hay diferencia'], 0,
    'Se usa all_different en filas, columnas y bloques; luego label prueba valores.'),

  // ---------- AJEDREZ ----------
  q('Ajedrez', 'Para el caballo, con DC y DF las diferencias absolutas de columna y fila, ¿cuándo es un movimiento válido?',
    ['DC =:= DF', 'DC*DF =:= 2', 'DC + DF =:= 1', 'DC =:= 0'], 1,
    'El caballo se mueve en L: (1,2) o (2,1), y 1*2 = 2*1 = 2.'),
  q('Ajedrez', '¿Cuándo una torre ataca otra casilla (sin piezas en medio)?',
    ['Si comparten la diagonal', 'Si comparten fila o columna', 'Solo si comparten la fila', 'Solo si están a distancia 2'], 1,
    'La torre se mueve en línea recta.'),
  q('Ajedrez', "Con el hecho pieza(rey,blanco,e,1), ¿qué consulta pregunta dónde están los reyes?",
    ['pieza(rey,C,F,_).', "pieza('rey',C,F).", 'pieza(rey,C).', 'pieza(rey).'], 0,
    'Dejas variables en lo que quieres saber.')
]

// El largo de cada opción no debe delatar la respuesta: 10 caracteres de diferencia como tope.
preguntas.forEach(p => {
  const largos = p.o.map(o => o.length)
  console.assert(Math.max(...largos) - Math.min(...largos) <= 10, 'Opciones de largo desigual:', p.p, largos)
})
