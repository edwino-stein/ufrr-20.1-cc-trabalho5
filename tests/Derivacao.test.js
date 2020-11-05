const tape = require('tape');
const Gramatica = require('../src/Gramatica.js');
const Derivacao = require('../src/Derivacao.js');

tape('Verificar o construtor Derivacao', (t) => {

    t.throws(
        () => new Derivacao(),
        (e) => e === 'A entrada deve ser uma string não vazia',
        'Deve ocorrer erro por causa da falta da entrada'
    );

    t.throws(
        () => new Derivacao(''),
        (e) => e === 'A entrada deve ser uma string não vazia',
        'Deve ocorrer erro pois a entrada é uma string vazia'
    );

    t.throws(
        () => new Derivacao('L'),
        (e) => e === 'Deve uma instância Gramática',
        'Deve ocorrer erro por causa da falta da gramática'
    );

    const gram = Gramatica.criar({ 'L': ['', '0', '1', '0L0', '1L1'] });
    t.doesNotThrow(
        () => new Derivacao('L', gram),
        'Não deve ocorrer erro com todos parâmetros válidos'
    );

    t.end();
});

tape('Verificar a derivações para produção da string "1001"', (t) => {

    const gram = Gramatica.criar({ 'L': ['', '0', '1', '0L0', '1L1'] });
    const der = gram.derivar('L');

    t.ok(
        typeof(der) === 'object' && der instanceof Derivacao,
        'Deve retornar um objeto de derivação quando charmar o método Gramatica.derivar()'
    );

    t.equals(
        der.proximo('L', 4).gerado,
        '1L1',
        'O resultado da derivação da produção L -> 1L1 (índice 4) deve ser "1L1"'
    );

    t.equals(
        der.proximo('L', 3).gerado,
        '10L01',
        'O resultado da derivação da produção L -> 0L0 (índice 3) deve ser "10L01"'
    );

    t.equals(
        der.proximo('L', 0).gerado,
        '1001',
        'O resultado da derivação da produção L -> "" (índice 0) deve ser "1001"'
    );

    t.end();
});
