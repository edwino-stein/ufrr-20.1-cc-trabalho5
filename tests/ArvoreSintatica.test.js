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

tape('Verificar o parsear lista de produções', (t) => {

    const gram = Gramatica.criar({
            'E': ['TF'],
            'F': ['+TF', 'e'], //E'
            'G': ['(E)', 'i'], //F
            'T': ['GU'],
            'U': ['*GU', 'e']  // T'
        },
        'e'
    );

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
