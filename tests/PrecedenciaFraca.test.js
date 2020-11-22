const tape = require('tape');
const PrecedenciaFraca = require('../src/PrecedenciaFraca.js');
const Gramatica = require('../src/Gramatica.js');

const F = Gramatica.criar(
    {
        'S': ['aSb', 'Xc'],
        'X': ['d', 'e']
    },
    '#'
);

const G = Gramatica.criar(
    {
        'E': ['E+M', 'M'],
        'M': ['MxP', 'P'],
        'P': ['(E)', 'v']
    },
    '#'
);

tape('Verificar conjuntos ESQ e DIR da gramática F', (t) => {

    t.deepEqual(
        PrecedenciaFraca._esq(F),
        { S: [ 'a', 'X', 'd', 'e' ], X: [ 'd', 'e' ] },
        'O conjuto ESQ dos símbolos não terminais deve ser o esperado'
    );

    t.deepEqual(
        PrecedenciaFraca._dir(F),
        { S: [ 'b', 'c' ], X: [ 'd', 'e' ] },
        'O conjuto DIR dos símbolos não terminais deve ser o esperado'
    );


    t.end();
});

tape('Verificar conjuntos ESQ e DIR da gramática G', (t) => {

    t.deepEqual(
        PrecedenciaFraca._esq(G),
        { E: [ 'M', 'P', '(', 'v' ], M: [ 'P', '(', 'v' ], P: [ '(', 'v' ] },
        'O conjuto ESQ dos símbolos não terminais deve ser o esperado'
    );

    t.deepEqual(
        PrecedenciaFraca._dir(G),
        { E: [ 'M', 'P', ')', 'v' ], M: [ 'P', ')', 'v' ], P: [ ')', 'v' ] },
        'O conjuto DIR dos símbolos não terminais deve ser o esperado'
    );

    t.end();
});

tape('Verificar as relações Wirth-Weber', (t) => {

    t.deepEqual(
        PrecedenciaFraca._calcularRegrasWirthWeber(F),
        [
            'S=b', 'X=c', 'a=S',
            'b>b', 'c>b', 'd>c',
            'e>c', 'a<a', 'a<X',
            'a<d', 'a<e'
        ],
        'O conjuto de regras da gramática F deve ser o esperado'
    );

    t.deepEqual(
        PrecedenciaFraca._calcularRegrasWirthWeber(G),
        [
            'E=+', 'E=)', 'M=x', '+=M',
            'x=P', '(=E', 'M>+', 'P>+',
            ')>+', 'v>+', 'M>)', 'P>)',
            ')>)', 'v>)', 'P>x', ')>x',
            'v>x', '+<P', '+<(', '+<v',
            'x<(', 'x<v', '(<M', '(<P',
            '(<(', '(<v'
        ],
        'O conjuto de regras da gramática G deve ser o esperado'
    );

    t.deepEqual(
        PrecedenciaFraca._calcularRegrasWirthWeberComFdc(F, 'S', '$'),
        [
            'S=b', 'X=c', 'a=S',
            'b>b', 'c>b', 'd>c',
            'e>c', 'a<a', 'a<X',
            'a<d', 'a<e', '$<a',
            '$<X', '$<d', '$<e',
            'b>$', 'c>$'
        ],
        'O conjuto de regras com símbolo de fim de cadadeia da gramática F deve ser o esperado'
    );

    t.deepEqual(
        PrecedenciaFraca._calcularRegrasWirthWeberComFdc(G, 'E', '$'),
        [
            'E=+', 'E=)', 'M=x', '+=M', 'x=P',
            '(=E', 'M>+', 'P>+', ')>+', 'v>+',
            'M>)', 'P>)', ')>)', 'v>)', 'P>x',
            ')>x', 'v>x', '+<P', '+<(', '+<v',
            'x<(', 'x<v', '(<M', '(<P', '(<(',
            '(<v', '$<M', '$<P', '$<(', '$<v',
            'M>$', 'P>$', ')>$', 'v>$'
        ],
        'O conjuto de regras com símbolo de fim de cadadeia da gramática G deve ser o esperado'
    );

    t.end();
});

tape('Verificar tabela DR da gramática F', (t) => {

    const tabelaDRF = PrecedenciaFraca._criarTabelaDR(F, 'S', '$');

    t.deepEqual(
        tabelaDRF['S'],
        { 'a': null, 'b': 'D', 'c': null, 'd': null, 'e': null, '$': null},
        'A linha do símbolo "S" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRF['X'],
        { 'a': null, 'b': null, 'c': 'D', 'd': null, 'e': null, '$': null},
        'A linha do símbolo "X" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRF['a'],
        { 'a': 'D', 'b': null, 'c': null, 'd': 'D', 'e': 'D', '$': null},
        'A linha do símbolo "a" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRF['b'],
        { 'a': null, 'b': 'R', 'c': null, 'd': null, 'e': null, '$': 'R'},
        'A linha do símbolo "b" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRF['c'],
        { 'a': null, 'b': 'R', 'c': null, 'd': null, 'e': null, '$': 'R'},
        'A linha do símbolo "c" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRF['d'],
        { 'a': null, 'b': null, 'c': 'R', 'd': null, 'e': null, '$': null},
        'A linha do símbolo "d" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRF['e'],
        { 'a': null, 'b': null, 'c': 'R', 'd': null, 'e': null, '$': null},
        'A linha do símbolo "e" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRF['$'],
        { 'a': 'D', 'b': null, 'c': null, 'd': 'D', 'e': 'D', '$': null},
        'A linha do símbolo "$" deve ser a esperada'
    );

    t.end();
});

tape('Verificar tabela DR da gramática G', (t) => {

    const tabelaDRG = PrecedenciaFraca._criarTabelaDR(G, 'E', '$');

    t.deepEqual(
        tabelaDRG['E'],
        { '+': 'D', 'x': null, '(': null, ')': 'D', 'v': null , '$': null },
        'A linha do símbolo "E" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRG['M'],
        { '+': 'R', 'x': 'D', '(': null, ')': 'R', 'v': null , '$': 'R' },
        'A linha do símbolo "M" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRG['P'],
        { '+': 'R', 'x': 'R', '(': null, ')': 'R', 'v': null , '$': 'R' },
        'A linha do símbolo "P" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRG['+'],
        { '+': null, 'x': null, '(': 'D', ')': null, 'v': 'D' , '$': null },
        'A linha do símbolo "+" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRG['x'],
        { '+': null, 'x': null, '(': 'D', ')': null, 'v': 'D' , '$': null },
        'A linha do símbolo "x" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRG['('],
        { '+': null, 'x': null, '(': 'D', ')': null, 'v': 'D' , '$': null },
        'A linha do símbolo "(" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRG[')'],
        { '+': 'R', 'x': 'R', '(': null, ')': 'R', 'v': null , '$': 'R' },
        'A linha do símbolo ")" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRG['v'],
        { '+': 'R', 'x': 'R', '(': null, ')': 'R', 'v': null , '$': 'R' },
        'A linha do símbolo "v" deve ser a esperada'
    );

    t.deepEqual(
        tabelaDRG['$'],
        { '+': null, 'x': null, '(': 'D', ')': null, 'v': 'D' , '$': null },
        'A linha do símbolo "$" deve ser a esperada'
    );

    t.end();
});

tape('Verificar o construtor de PrecedenciaFraca', (t) => {

    t.throws(
        () => PrecedenciaFraca.criar(),
        (e) => e === 'A gramática deve ser uma instância de Gramatica',
        'Deve ocorrer erro pela falta da gramática'
    );

    t.throws(
        () => PrecedenciaFraca.criar(F),
        (e) => e === 'O símbolo inicial deve ser uma string não vazia',
        'Deve ocorrer erro pela falta do símbolo inicial'
    );

    t.throws(
        () => PrecedenciaFraca.criar(F, 'a'),
        (e) => e === 'O símbolo inicial deve ser um símbolo não terminal da gramática',
        'Deve ocorrer erro pois o símbolo inicial não é um símbolo não terminal'
    );

    t.throws(
        () => PrecedenciaFraca.criar(F, 'S'),
        (e) => e === 'O símbolo de fim de cadeia deve ser uma string não vazia',
        'Deve ocorrer erro pela falta do símbolo de fim de cadeia'
    );

    t.throws(
        () => PrecedenciaFraca.criar(F, 'S', 'X'),
        (e) => e === 'O símbolo de fim de cadeia não pode ser um símbolo não terminal da gramática',
        'Deve ocorrer erro pois o símbolo de fim de cadeia é um símbolo não terminal'
    );

    t.throws(
        () => PrecedenciaFraca.criar(F, 'S', '#'),
        (e) => e === 'O símbolo de fim de cadeia não pode ser um símbolo terminal conhecido da gramática',
        'Deve ocorrer erro pois o símbolo de fim de cadeia é um símbolo terminal conhecido'
    );

    t.doesNotThrow(
        () => PrecedenciaFraca.criar(F, 'S', '$'),
        'Não deve ocorrer erro com todos parâmetros válidos'
    );


    const precedenciaFraca = PrecedenciaFraca.criar(F, 'S', '$');
    t.equals(precedenciaFraca._inicial, 'S', 'O símbolo inicial deve ser o esperado');
    t.equals(precedenciaFraca._fdc, '$', 'O símbolo de fim de cadeia deve ser o esperado');
    t.equals(precedenciaFraca._gramatica, F, 'A gramática deve ser a esperada');

    t.deepEqual(
        precedenciaFraca._tabelaDR,
        PrecedenciaFraca._criarTabelaDR(F, 'S', '$'),
        'A tabela DR deve ser a esperada'
    );

    t.end();
});

tape('Verificar análise com a gramática F', (t) => {

    const precedenciaFraca = PrecedenciaFraca.criar(F, 'S', '$');

    t.doesNotThrow(
        () => precedenciaFraca.analisar('aadcbb'),
        'Deve reconhecer a entrada "aadcbb"'
    );

    t.end();
});

tape('Verificar análise com a gramática G', (t) => {

    const precedenciaFraca = PrecedenciaFraca.criar(G, 'E', '$');

    t.doesNotThrow(
        () => precedenciaFraca.analisar('v'),
        'Deve reconhecer a entrada "v"'
    );

    t.doesNotThrow(
        () => precedenciaFraca.analisar('(v)'),
        'Deve reconhecer a entrada "(v)"'
    );

    t.doesNotThrow(
        () => precedenciaFraca.analisar('v+v'),
        'Deve reconhecer a entrada "v+v"'
    );

    t.doesNotThrow(
        () => precedenciaFraca.analisar('vxv'),
        'Deve reconhecer a entrada "vxv"'
    );

    t.doesNotThrow(
        () => precedenciaFraca.analisar('(v)+v'),
        'Deve reconhecer a entrada "(v)+v"'
    );

    t.doesNotThrow(
        () => precedenciaFraca.analisar('(v)xv'),
        'Deve reconhecer a entrada "(v)xv"'
    );

    t.doesNotThrow(
        () => precedenciaFraca.analisar('(v+v)xv'),
        'Deve reconhecer a entrada "(v+v)xv"'
    );

    t.doesNotThrow(
        () => precedenciaFraca.analisar('v+vxv'),
        'Deve reconhecer a entrada "v+vxv"'
    );

    t.throws(
        () => precedenciaFraca.analisar(''),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada ""'
    );

    t.throws(
        () => precedenciaFraca.analisar('v+'),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada "v+"'
    );

    t.throws(
        () => precedenciaFraca.analisar('vx'),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada "vx"'
    );

    t.throws(
        () => precedenciaFraca.analisar('v+x'),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada "v+x"'
    );

    t.throws(
        () => precedenciaFraca.analisar('()'),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada "()"'
    );

    t.throws(
        () => precedenciaFraca.analisar('v+a'),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada "v+a"'
    );

    t.throws(
        () => precedenciaFraca.analisar('(v+v)x(v'),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada "(v+v)x(v"'
    );

    t.end();
});

tape('Verificar se as produções retornadas da análise realmente gera a entrada com a gramática G', (t) => {

    const precedenciaFraca = PrecedenciaFraca.criar(G, 'E', '$');
    const entradas = ['v', '(v)', '(v)+v', '(v)xv', 'vxv+v', 'v+vxv','(v+v)xv'];

    for (const e of entradas) {
        const prods = precedenciaFraca.analisar(e);
        let resultado = 'E';
        for (const p of prods) resultado = p.aplicarPelaDireita(resultado);

        t.equals(
            resultado,
            e,
            'O resultado das produções deve ser igual a entrada "'+e+'"'
        );
    }

    t.end();
});
