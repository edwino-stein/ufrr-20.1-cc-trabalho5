const tape = require('tape');
const LL1 = require('../src/LL1.js');
const Gramatica = require('../src/Gramatica.js');

tape('Verificar primerios', (t) => {

    const gram = Gramatica.criar({
        'S': ['AB'],
        'A': ['aA', 'a', 'd'],
        'B': ['bB', 'c', 'A', 'Cd'],
        'C': ['x', 'y', '#'],
        'D': ['#'],
    }, '#');

    t.deepEqual(
        LL1._primeiros('abcd', gram),
        [ 'a' ],
        'primeiros(abcd) = { a }'
    );

    t.deepEqual(
        LL1._primeiros('ABC', gram),
        [ 'a', 'd' ],
        'primeiros(ABC) = { a , d }'
    );

    t.deepEqual(
        LL1._primeiros('AxCd', gram),
        [ 'a', 'd' ],
        'primeiros(AxCd) = { a , d }'
    );

    t.deepEqual(
        LL1._primeiros('BzSB', gram),
        [ ...'bcadxy' ],
        'primeiros(BzSB) = { b, c, a, d, x, y }'
    );

    t.deepEqual(
        LL1._primeiros('CzSB', gram),
        [ ...'xyz' ],
        'primeiros(BzSB) = { x, y, z }'
    );

    t.deepEqual(
        LL1._primeiros('SABC', gram),
        [ ...'ad' ],
        'primeiros(BzSB) = { a, d }'
    );

    t.deepEqual(
        LL1._primeiros('C', gram),
        [ ...'xy#' ],
        'primeiros(C) = { x, y, # }'
    );

    t.deepEqual(
        LL1._primeiros('DAB', gram),
        [ ...'ad' ],
        'primeiros(DAB) = { a, d }'
    );

    t.deepEqual(
        LL1._primeiros('DCe', gram),
        [ ...'xye' ],
        'primeiros(DCe) = { x, y, e }'
    );

    t.deepEqual(
        LL1._primeiros('DC', gram),
        [ ...'xy#' ],
        'primeiros(DCe) = { x, y, # }'
    );

    t.deepEqual(
        LL1._primeiros('D', gram),
        [ ...'#' ],
        'primeiros(D) = { # }'
    );

    t.deepEqual(
        LL1._primeiros('#', gram),
        [ ...'#' ],
        'primeiros(D) = { # }'
    );

    t.end();
});

tape('Verificar seguidores', (t) => {
    t.deepEqual(
        LL1._seguidores('S', '$', Gramatica.criar({
            'S': ['AB'],
            'A': ['aA', 'a', 'd'],
            'B': ['bB', 'c', 'A', 'Cd'],
            'C': ['x', 'y', '#'],
            'D': ['#'],
        }, '#')),
        {
            'S': [...'$'],
            'A': [...'bcadxy$'],
            'B': [...'$'],
            'C': [...'d'],
            'D': []
        },
        'Seguidores devem casar com o esperado'
    );

    t.deepEqual(
        LL1._seguidores('E', '$', Gramatica.criar({
            'E': ['TF'],
            'F': ['+TF', '#'], //E'
            'G': ['(E)', 'i'], //F
            'T': ['GU'],
            'U': ['*GU', '#']  // T'
        }, '#')),
        {
            'E': [ '$', ')' ],
            'F': [ '$', ')' ],
            'G': [ '*', '+', '$', ')' ],
            'T': [ '+', '$', ')' ],
            'U': [ '+', '$', ')' ]
        },
        'Seguidores devem casar com o esperado'
    );

    t.deepEqual(
        LL1._seguidores('S', '$', Gramatica.criar({
            'S': ['iEtST', 'a'],
            'T': ['eS', '#'],
            'E': ['b']
        }, '#')),
        {
            'S': [ '$', 'e' ],
            'T': [ '$', 'e' ],
            'E': [ 't' ]
        },
        'Seguidores devem casar com o esperado'
    );

    t.end();
});

tape('Verificar tabela', (t) => {

    const gram = Gramatica.criar({
            'E': ['TF'],
            'F': ['+TF', '#'], //E'
            'G': ['(E)', 'i'], //F
            'T': ['GU'],
            'U': ['*GU', '#']  // T'
        },
        '#'
    );

    const tabela = LL1._criarTabela('E', '$', gram);

    t.deepEqual(
        tabela['E'],
        {
            '+': null,
            '(': gram.producao('E', 0),
            ')': null,
            'i': gram.producao('E', 0),
            '*': null,
            '$': null
        },
        'A linha E deve ser a esperada'
    );

    t.deepEqual(
        tabela['F'],
        {
            '+': gram.producao('F', 0),
            '(': null,
            ')': gram.producao('F', 1),
            'i': null,
            '*': null,
            '$': gram.producao('F', 1)
        },
        'A linha F deve ser a esperada'
    );

    t.deepEqual(
        tabela['G'],
        {
            '+': null,
            '(': gram.producao('G', 0),
            ')': null,
            'i': gram.producao('G', 1),
            '*': null,
            '$': null
        },
        'A linha G deve ser a esperada'
    );

    t.deepEqual(
        tabela['T'],
        {
            '+': null,
            '(': gram.producao('T', 0),
            ')': null,
            'i': gram.producao('T', 0),
            '*': null,
            '$': null
        },
        'A linha T deve ser a esperada'
    );

    t.deepEqual(
        tabela['U'],
        {
            '+': gram.producao('U', 1),
            '(': null,
            ')': gram.producao('U', 1),
            'i': null,
            '*': gram.producao('U', 0),
            '$': gram.producao('U', 1)
        },
        'A linha U deve ser a esperada'
    );

    t.end();
});

tape('Verificar o construtor de LL1', (t) => {

    t.throws(
        () => LL1.criar(),
        (e) => e === 'A gramática deve ser uma instância de Gramatica',
        'Deve ocorrer erro pela falta da gramática'
    );

    const gram = Gramatica.criar({
            'E': ['TF'],
            'F': ['+TF', '#'], //E'
            'G': ['(E)', 'i'], //F
            'T': ['GU'],
            'U': ['*GU', '#']  // T'
        },
        '#'
    );

    t.throws(
        () => LL1.criar(gram),
        (e) => e === 'O símbolo inicial deve ser uma string não vazia',
        'Deve ocorrer erro pela falta do símbolo inicial'
    );

    t.throws(
        () => LL1.criar(gram, 'a'),
        (e) => e === 'O símbolo inicial deve ser um símbolo não terminal da gramática',
        'Deve ocorrer erro pois o símbolo inicial não é um símbolo não terminal'
    );

    t.throws(
        () => LL1.criar(gram, 'E'),
        (e) => e === 'O símbolo de fim de cadeia deve ser uma string não vazia',
        'Deve ocorrer erro pela falta do símbolo de fim de cadeia'
    );

    t.throws(
        () => LL1.criar(gram, 'E', 'F'),
        (e) => e === 'O símbolo de fim de cadeia não pode ser um símbolo não terminal da gramática',
        'Deve ocorrer erro pois o símbolo de fim de cadeia é um símbolo não terminal'
    );

    t.throws(
        () => LL1.criar(gram, 'E', '#'),
        (e) => e === 'O símbolo de fim de cadeia não pode ser um símbolo terminal conhecido da gramática',
        'Deve ocorrer erro pois o símbolo de fim de cadeia é um símbolo terminal conhecido'
    );

    t.doesNotThrow(
        () => LL1.criar(gram, 'E', '$'),
        'Não deve ocorrer erro com todos parâmetros válidos'
    );


    const ll1 = LL1.criar(gram, 'E', '$');
    t.equals(ll1._inicial, 'E', 'O símbolo inicial deve ser o esperado');
    t.equals(ll1._fdc, '$', 'O símbolo de fim de cadeia deve ser o esperado');
    t.equals(ll1._gramatica, gram, 'A gramática deve ser a esperada');
    t.deepEqual(
        ll1._tabela,
        LL1._criarTabela('E', '$', gram),
        'A tabela sintática deve ser a esperada'
    );

    t.end();
});

tape('Verificar análise', (t) => {

    const gram = Gramatica.criar({
            'E': ['TF'],
            'F': ['+TF', 'e'], //E'
            'G': ['(E)', 'i'], //F
            'T': ['GU'],
            'U': ['*GU', 'e']  // T'
        },
        'e'
    );

    const ll1 = LL1.criar(gram, 'E', '$');

    t.doesNotThrow(
        () => ll1.analisar('i'),
        'Deve reconhecer a entrada "i"'
    );

    t.doesNotThrow(
        () => ll1.analisar('(i)'),
        'Deve reconhecer a entrada "(i)"'
    );

    t.doesNotThrow(
        () => ll1.analisar('i+i'),
        'Deve reconhecer a entrada "i+i"'
    );

    t.doesNotThrow(
        () => ll1.analisar('i*i'),
        'Deve reconhecer a entrada "i*i"'
    );

    t.doesNotThrow(
        () => ll1.analisar('(i)+i'),
        'Deve reconhecer a entrada "(i)+i"'
    );

    t.doesNotThrow(
        () => ll1.analisar('(i)*i'),
        'Deve reconhecer a entrada "(i)*i"'
    );

    t.doesNotThrow(
        () => ll1.analisar('(i+i)*i'),
        'Deve reconhecer a entrada "(i+i)*i"'
    );

    t.doesNotThrow(
        () => ll1.analisar('i+i*i'),
        'Deve reconhecer a entrada "i+i*i"'
    );

    t.throws(
        () => ll1.analisar(''),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada ""'
    );

    t.throws(
        () => ll1.analisar('i+'),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada "i+"'
    );

    t.throws(
        () => ll1.analisar('i*'),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada "i*"'
    );

    t.throws(
        () => ll1.analisar('i+*'),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada "i+*"'
    );

    t.throws(
        () => ll1.analisar('()'),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada "()"'
    );

    t.throws(
        () => ll1.analisar('i+a'),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada "i+a"'
    );

    t.throws(
        () => ll1.analisar('(i+i)*(i'),
        (e) => typeof(e) === 'object',
        'Não deve reconhecer a entrada "(i+i)*(i"'
    );

    t.end();
});

tape('Verificar se as produções retornadas da análise realmente gera a entrada', (t) => {

    const gram = Gramatica.criar({
            'E': ['TF'],
            'F': ['+TF', 'e'], //E'
            'G': ['(E)', 'i'], //F
            'T': ['GU'],
            'U': ['*GU', 'e']  // T'
        },
        'e'
    );

    const ll1 = LL1.criar(gram, 'E', '$');
    const entradas = ['i', '(i)', '(i)+i', '(i)*i', 'i*i+i', 'i+i*i','(i+i)*i'];

    for (const e of entradas) {
        const prods = ll1.analisar(e);
        let resultado = 'E';
        for (const p of prods) resultado = p.aplicarPelaEsquerda(resultado);

        t.equals(
            resultado,
            e,
            'O resultado das produções deve ser igual a entrada "'+e+'"'
        );
    }

    t.end();
});
