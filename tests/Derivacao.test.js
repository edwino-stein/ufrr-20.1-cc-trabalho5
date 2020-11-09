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

    const gram = Gramatica.criar({ 'L': ['e', '0', '1', '0L0', '1L1'] }, 'e');
    t.doesNotThrow(
        () => new Derivacao('L', gram),
        'Não deve ocorrer erro com todos parâmetros válidos'
    );

    t.end();
});

tape('Verificar a derivações para produção da string "1001"', (t) => {

    const gram = Gramatica.criar({ 'L': ['e', '0', '1', '0L0', '1L1'] }, 'e');
    const der = gram.derivar('L');

    t.ok(
        typeof(der) === 'object' && der instanceof Derivacao,
        'Deve retornar um objeto de derivação quando charmar o método Gramatica.derivar("L")'
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
        'O resultado da derivação da produção L -> "e" (índice 0) deve ser "1001"'
    );

    t.end();
});

tape('Verificar a derivações para produção da string "(a+b)*c"', (t) => {

    const gram = Gramatica.criar(
        {
            'EXP': ['VAR', 'EXP+EXP', 'EXP*EXP', '(EXP)'],
            'VAR': ['a', 'b', 'c']
        },
        'e'
    );

    const der = gram.derivar('EXP');

    t.ok(
        typeof(der) === 'object' && der instanceof Derivacao,
        'Deve retornar um objeto de derivação quando charmar o método Gramatica.derivar("EXP")'
    );

    t.equals(
        der.proximo('EXP', 2).gerado,
        'EXP*EXP',
        'O resultado da derivação da produção EXP -> EXP*EXP (índice 2) deve ser "EXP*EXP"'
    );

    t.equals(
        der.proximo('EXP', 3).gerado,
        '(EXP)*EXP',
        'O resultado da derivação da produção EXP -> (EXP) (índice 3) deve ser "(EXP)*EXP"'
    );

    t.equals(
        der.proximo('EXP', 1).gerado,
        '(EXP+EXP)*EXP',
        'O resultado da derivação da produção EXP -> EXP+EXP (índice 1) deve ser "(EXP+EXP)*EXP"'
    );

    t.equals(
        der.proximo('EXP', 0).gerado,
        '(VAR+EXP)*EXP',
        'O resultado da derivação da produção EXP -> VAR (índice 0) deve ser "(VAR+EXP)*EXP"'
    );

    t.equals(
        der.proximo('VAR', 0).gerado,
        '(a+EXP)*EXP',
        'O resultado da derivação da produção VAR -> a (índice 0) deve ser "(a+EXP)*EXP"'
    );

    t.equals(
        der.proximo('EXP', 0).gerado,
        '(a+VAR)*EXP',
        'O resultado da derivação da produção EXP -> VAR (índice 0) deve ser "(a+VAR)*EXP"'
    );

    t.equals(
        der.proximo('VAR', 1).gerado,
        '(a+b)*EXP',
        'O resultado da derivação da produção VAR -> b (índice 1) deve ser "(a+b)*EXP"'
    );

    t.equals(
        der.proximo('EXP', 0).gerado,
        '(a+b)*VAR',
        'O resultado da derivação da produção EXP -> VAR (índice 0) deve ser "(a+b)*VAR"'
    );

    t.equals(
        der.proximo('VAR', 2).gerado,
        '(a+b)*c',
        'O resultado da derivação da produção VAR -> c (índice 2) deve ser "(a+b)*c"'
    );

    t.end();
});
