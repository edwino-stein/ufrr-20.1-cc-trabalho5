const tape = require('tape');
const Producao = require('../src/Producao.js');

tape('Verificar o construtor Producao', (t) => {

    t.throws(
        () => new Producao(),
        (e) => e === 'A cabeça da produção deve ser uma string com tamanho 1',
        'Deve ocorrer erro pela falta do símbolo não terminal'
    );

    t.throws(
        () => new Producao('S'),
        (e) => e === 'O corpo da produção deve ser uma lista de strings',
        'Deve ocorrer erro pela falta da lista de símbolos do corpo'
    );

    t.throws(
        () => new Producao('S', [ 123 ]),
        (e) => e === 'O corpo da produção deve ser uma lista de strings',
        'Deve ocorrer erro por causa da lista de símbolos do corpo com valor inváildo'
    );

    t.throws(
        () => new Producao('S', [ 'abc' ]),
        (e) => e === 'O corpo da produção deve ser uma lista de strings',
        'Deve ocorrer erro por causa da lista de símbolos do corpo com string com tamanho maior que 1'
    );

    t.doesNotThrow(
        () => new Producao('S', []),
        (e) => e === 'O corpo da produção deve ser uma lista de strings',
        'Não deve ocorrer erro por causa da lista de símbolos do corpo vazia'
    );

    t.doesNotThrow(
        () => new Producao('S', ['a', 'b', 'c']),
        'Não deve ocorrer erro com todos parâmetros válidos'
    );

    const prod = new Producao('S', ['a', 'b', 'c']);
    t.equals(prod.cabeca, 'S', 'Símbolo da cabeca deve ser o esperado');
    t.deepEqual(prod.corpo, ['a', 'b', 'c'], 'Símbolos do corpo devem ser os esperados');

    t.end();
});

tape('Verificar as aplicações das produções em posições arbitrárias', (t) => {

    const producao = new Producao('S', ['a']);

    t.equals(
        producao.aplicar('', 0),
        '',
        'Entrada vaiza deve retornar string vazia'
    );

    t.equals(
        producao.aplicar('S', 0),
        'a',
        'A entrada "a" subtituindo posição 0 deve retornar "a"'
    );

    t.equals(
        producao.aplicar('aSbb', 0),
        'aSbb',
        'A entrada "aSbb" subtituindo na posição 0 deve retornar "aSbb"'
    );

    t.equals(
        producao.aplicar('aSbb', 2),
        'aSbb',
        'A entrada "aSbb" subtituindo na posição 2 deve retornar "aSbb"'
    );

    t.equals(
        producao.aplicar('aSbb', 1),
        'aabb',
        'A entrada "aSbb" subtituindo na posição 1 deve retornar "aabb"'
    );

    t.end();
});

tape('Verificar as aplicações das produções pela esquerda', (t) => {

    const producao = new Producao('S', ['a']);

    t.equals(
        producao.aplicarPelaEsquerda(''),
        '',
        'Entrada vaiza deve retornar string vazia'
    );

    t.equals(
        producao.aplicarPelaEsquerda('S'),
        'a',
        'A entrada "S" subtituindo pela esquerda deve retornar apenas "a"'
    );

    t.equals(
        producao.aplicarPelaEsquerda('aSbb'),
        'aabb',
        'A entrada "aSbb" subtituindo pela esquerda deve retornar "aabb"'
    );

    t.equals(
        producao.aplicarPelaEsquerda('aSbS'),
        'aabS',
        'A entrada "aSbS" subtituindo pela esquerda deve retornar "aabS"'
    );

    t.equals(
        producao.aplicarPelaEsquerda('Sb'),
        'ab',
        'A entrada "Sb" subtituindo pela esquerda deve retornar "ab"'
    );

    t.equals(
        producao.aplicarPelaEsquerda('bS'),
        'ba',
        'A entrada "bS" subtituindo pela esquerda deve retornar "ba"'
    );

    t.equals(
        producao.aplicarPelaEsquerda('ab'),
        'ab',
        'A entrada "ab" subtituindo pela esquerda deve retornar "ab"'
    );

    t.end();
});

tape('Verificar as aplicações das produções pela direita', (t) => {

    const producao = new Producao('S', ['a']);

    t.equals(
        producao.aplicarPelaDireita(''),
        '',
        'Entrada vaiza deve retornar string vazia'
    );

    t.equals(
        producao.aplicarPelaDireita('S'),
        'a',
        'A entrada "S" subtituindo pela esquerda deve retornar apenas "a"'
    );

    t.equals(
        producao.aplicarPelaDireita('aSbb'),
        'aabb',
        'A entrada "aSbb" subtituindo pela esquerda deve retornar "aabb"'
    );

    t.equals(
        producao.aplicarPelaDireita('aSbS'),
        'aSba',
        'A entrada "aSbS" subtituindo pela esquerda deve retornar "aaba"'
    );

    t.equals(
        producao.aplicarPelaDireita('Sb'),
        'ab',
        'A entrada "Sb" subtituindo pela esquerda deve retornar "ab"'
    );

    t.equals(
        producao.aplicarPelaDireita('bS'),
        'ba',
        'A entrada "bS" subtituindo pela esquerda deve retornar "ba"'
    );

    t.equals(
        producao.aplicarPelaDireita('ab'),
        'ab',
        'A entrada "ab" subtituindo pela esquerda deve retornar "ab"'
    );

    t.end();
});
