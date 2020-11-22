const tape = require('tape');
const Gramatica = require('../src/Gramatica.js');
const ArvoreSintatica = require('../src/ArvoreSintatica.js');

tape('Verificar o construtor de ArvoreSintatica', (t) => {

    t.throws(
        () => new ArvoreSintatica(),
        (e) => e === 'O símbolo deve ser uma string não vazia',
        'Deve ocorrer erro pela falta do símbolo'
    );

    t.throws(
        () => new ArvoreSintatica(''),
        (e) => e === 'O símbolo deve ser uma string não vazia',
        'Deve ocorrer por causa que o símbolo é uma string vazia'
    );

    t.doesNotThrow(
        () => new ArvoreSintatica('S'),
        'Não deve ocorrer erro com todos parâmetros válidos'
    );

    t.end();
});

tape('Verificar o parsear lista de produções criando pela esquerda', (t) => {

    const gram = Gramatica.criar({
            'E': ['TF'],
            'F': ['+TF', 'e'], //E'
            'G': ['(E)', 'i'], //F
            'T': ['GU'],
            'U': ['*GU', 'e']  // T'
        },
        'e'
    );

    // Produz i+i
    const prods = [
        gram.producao('E', 0),
        gram.producao('T', 0),
        gram.producao('G', 1),
        gram.producao('U', 1),
        gram.producao('F', 0),
        gram.producao('T', 0),
        gram.producao('G', 1),
        gram.producao('U', 1),
        gram.producao('F', 1)
    ];

    const arvore = ArvoreSintatica.parsearProducoes(prods, gram);
    const simbolosPreOrdem = [];
    arvore.preOrdem((no) => simbolosPreOrdem.push(no.simbolo));

    t.deepEqual(
        simbolosPreOrdem,
        [ ...'ETGiUeF+TGiUeFe' ],
        'Os símbolos devem estar na ordem esperada quando a arvore é percorrida em pré ordem'
    );

    t.end();
});

tape('Verificar o parsear lista de produções criando pela direita', (t) => {

    const gram = Gramatica.criar(
        {
            'E': ['E+M', 'M'],
            'M': ['MxP', 'P'],
            'P': ['(E)', 'v']
        },
        '#'
    );

    // Produz v+v
    const prods = [
        gram.producao('E', 0),
        gram.producao('M', 1),
        gram.producao('P', 1),
        gram.producao('E', 1),
        gram.producao('M', 1),
        gram.producao('P', 1)
    ];

    const arvore = ArvoreSintatica.parsearProducoes(prods, gram, 'd');
    const simbolosPosOrdem = [];

    // console.log(arvore);
    arvore.posOrdem((no) => simbolosPosOrdem.push(no.simbolo));

    t.deepEqual(
        simbolosPosOrdem,
        [ ...'EMPv+EMPv' ],
        'Os símbolos devem estar na ordem esperada quando a arvore é percorrida em pos ordem'
    );

    t.end();
});
