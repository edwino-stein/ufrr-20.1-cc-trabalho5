const tape = require('tape');
const Gramatica = require('../src/Gramatica.js');

tape('Verificar o construtor de Gramatica', (t) => {

    t.throws(
        () => Gramatica.criar(),
        (e) => e === 'As produções devem ser um objeto chave valor não vazio',
        'Deve ocorrer erro pela falta das produções'
    );

    t.throws(
        () => Gramatica.criar({}),
        (e) => e === 'As produções devem ser um objeto chave valor não vazio',
        'Deve ocorrer erro por causa das produções vazias'
    );

    t.throws(
        () => Gramatica.criar({'S': 123}),
        (e) => e === 'As produções deve uma string ou uma lista não vaiza de strings',
        'Deve ocorrer erro por causa de uma produção inválida (para número)'
    );

    t.throws(
        () => Gramatica.criar({'S': [ 123 ]}),
        (e) => e === 'As produções deve uma string ou uma lista não vaiza de strings',
        'Deve ocorrer erro por causa de uma produção inválida (lista com número)'
    );

    t.throws(
        () => Gramatica.criar({'S': []}),
        (e) => e === 'As produções deve uma string ou uma lista não vaiza de strings',
        'Deve ocorrer erro por causa de uma produção inválida (lista vazia)'
    );

    t.doesNotThrow(
        () => Gramatica.criar({'S': 'a'}),
        'Não deve ocorrer erro com todos parâmetros válidos (string direta)'
    );

    t.doesNotThrow(
        () => Gramatica.criar({'S': [ 'a' ]}),
        'Não deve ocorrer erro com todos parâmetros válidos (lista de string)'
    );

    const gram = Gramatica.criar({ 'L': ['', '0', '1', '0L0', '1L1'] });

    t.deepEqual(
        gram._naoTerminais,
        [ 'L' ],
        'Deve ter o símbolo não terminal esperado'
    );

    t.deepEqual(
        gram._terminais,
        [ '0', '1' ],
        'Deve ter o símbolo terminais esperados'
    );

    t.equals(
        gram._buscarProducoesPorNaoTerminal('L').length,
        5,
        'O símbolo não terminal ter cinco produções definidas'
    );

    t.deepEqual(
        gram.producao('L', 0).corpo,
        [ ],
        'A primeira produção do não terminal deve ser vazio'
    );

    t.deepEqual(
        gram.producao('L', 4).corpo,
        [ ...'1L1' ],
        'A última produção do não terminal deve ser "1L1"'
    );

    t.throws(
        () => gram.producao('L', 5),
        (e) => e === 'Produção é inválida',
        'Deve ocorrer erro ao tentar recurar uma produção inexistente'
    );

    t.end();
});

tape('Verificar testes em strings de entrada', (t) => {

    const gram = Gramatica.criar({ 'L': ['', '0', '1', '0L0', '1L1'] });

    t.deepEqual(
        gram._ocorrenciasDeNaoTermiais('L1L1L'),
        { 'L': [ 0, 2, 4 ] },
        'Deve informar que existe terminais nas posições 0, 2 e 4'
    );

    t.ok(
        gram.existeNaoTerminal('L1L1L'),
        'Deve informar que existem terminais na string'
    );

    t.ok(
        gram.existeNaoTerminal('L1L1L'),
        'Deve informar que existem terminais na string'
    );

    t.notOk(
        gram.existeNaoTerminal('111000'),
        'Deve informar que não existem terminais na string'
    );

    t.end();
});
