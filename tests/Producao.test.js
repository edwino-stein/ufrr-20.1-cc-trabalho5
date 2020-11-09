const tape = require('tape');
const Producao = require('../src/Producao.js');

tape('Verificar o construtor Producao', (t) => {

    t.throws(
        () => new Producao(),
        (e) => e === 'A cabeça da produção deve ser uma string não vazia',
        'Deve ocorrer erro pela falta do símbolo não terminal'
    );

    t.throws(
        () => new Producao('S'),
        (e) => e === 'O corpo da produção deve ser uma lista de strings',
        'Deve ocorrer erro pela falta da lista de símbolos do corpo'
    );

    t.throws(
        () => new Producao('S', [ 123 ]),
        (e) => e === 'O corpo da produção deve ser uma lista de strings não vazia',
        'Deve ocorrer erro por causa da lista de símbolos do corpo com valor inváildo'
    );

    t.throws(
        () => new Producao('S', []),
        (e) => e === 'O corpo da produção deve ser uma lista de strings não vazia',
        'Deve ocorrer erro por causa da lista vazia de símbolos do corpo'
    );

    t.throws(
        () => new Producao('S', [ 'a' ]),
        (e) => e === 'O símbolo vazio deve ser uma string não vazia de tamanho 1',
        'Deve ocorrer erro pela falta do símbolo vazio'
    );

    t.throws(
        () => new Producao('S', [ 'a' ], 'bc'),
        (e) => e === 'O símbolo vazio deve ser uma string não vazia de tamanho 1',
        'Deve ocorrer erro por causa do símbolo vazio inválido'
    );

    t.doesNotThrow(
        () => new Producao('S1', ['a', 'b', 'cd'], 'e'),
        'Não deve ocorrer erro com todos parâmetros válidos'
    );

    const prod = new Producao('S1', ['a', 'b', 'cd'], 'e');
    t.equals(prod.cabeca, 'S1', 'Símbolo da cabeca deve ser o esperado');
    t.deepEqual(prod.corpo, ['a', 'b', 'cd'], 'Símbolos do corpo devem ser os esperados');
    t.equals(prod.corpoStr, 'abcd', 'String concatenada do corpo deve ser como esperado');
    t.equals(prod.comoString, 'S1 -> abcd', 'A string completa deve ser como esperado');

    t.end();
});

tape('Verificar as aplicações das produções em posições arbitrárias com não terminal de tamanho 1', (t) => {

    const producao = new Producao('S', ['a'], 'e');

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

tape('Verificar as aplicações das produções em posições arbitrárias com não terminal de tamanho maior que 1', (t) => {

    const producao = new Producao('SENT', ['a'], 'e');

    t.equals(
        producao.aplicar('', 0),
        '',
        'Entrada vaiza deve retornar string vazia'
    );

    t.equals(
        producao.aplicar('SENT', 0),
        'a',
        'A entrada "a" subtituindo posição 0 deve retornar "a"'
    );

    t.equals(
        producao.aplicar('aSENTbb', 0),
        'aSENTbb',
        'A entrada "aSENTbb" subtituindo na posição 0 deve retornar "aSENTbb"'
    );

    t.equals(
        producao.aplicar('aSENTbb', 2),
        'aSENTbb',
        'A entrada "aSENTbb" subtituindo na posição 2 deve retornar "aSENTbb"'
    );

    t.equals(
        producao.aplicar('aSENTbb', 1),
        'aabb',
        'A entrada "aSENTbb" subtituindo na posição 1 deve retornar "aabb"'
    );

    t.end();
});

tape('Verificar as aplicações das produções pela esquerda com não terminal de tamanho 1', (t) => {

    const producao = new Producao('S', ['a'], 'e');

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

tape('Verificar as aplicações das produções pela esquerda com não terminal de tamanho maior que 1', (t) => {

    const producao = new Producao('SENT', ['a'], 'e');

    t.equals(
        producao.aplicarPelaEsquerda(''),
        '',
        'Entrada vaiza deve retornar string vazia'
    );

    t.equals(
        producao.aplicarPelaEsquerda('SENT'),
        'a',
        'A entrada "SENT" subtituindo pela esquerda deve retornar apenas "a"'
    );

    t.equals(
        producao.aplicarPelaEsquerda('aSENTbb'),
        'aabb',
        'A entrada "aSENTbb" subtituindo pela esquerda deve retornar "aabb"'
    );

    t.equals(
        producao.aplicarPelaEsquerda('aSENTbSENT'),
        'aabSENT',
        'A entrada "aSENTbSENT" subtituindo pela esquerda deve retornar "aabSENT"'
    );

    t.equals(
        producao.aplicarPelaEsquerda('SENTb'),
        'ab',
        'A entrada "SENTb" subtituindo pela esquerda deve retornar "ab"'
    );

    t.equals(
        producao.aplicarPelaEsquerda('bSENT'),
        'ba',
        'A entrada "bSENT" subtituindo pela esquerda deve retornar "ba"'
    );

    t.equals(
        producao.aplicarPelaEsquerda('ab'),
        'ab',
        'A entrada "ab" subtituindo pela esquerda deve retornar "ab"'
    );

    t.end();
});

tape('Verificar as aplicações das produções pela direita com não terminal de tamanho 1', (t) => {

    const producao = new Producao('S', ['a'], 'e');

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

tape('Verificar as aplicações das produções pela direita com não terminal de tamanho maior que 1', (t) => {

    const producao = new Producao('SENT', ['a'], 'e');

    t.equals(
        producao.aplicarPelaDireita(''),
        '',
        'Entrada vaiza deve retornar string vazia'
    );

    t.equals(
        producao.aplicarPelaDireita('SENT'),
        'a',
        'A entrada "SENT" subtituindo pela esquerda deve retornar apenas "a"'
    );

    t.equals(
        producao.aplicarPelaDireita('aSENTbb'),
        'aabb',
        'A entrada "aSENTbb" subtituindo pela esquerda deve retornar "aabb"'
    );

    t.equals(
        producao.aplicarPelaDireita('aSENTbSENT'),
        'aSENTba',
        'A entrada "aSENTbSENT" subtituindo pela esquerda deve retornar "aSENTba"'
    );

    t.equals(
        producao.aplicarPelaDireita('SENTb'),
        'ab',
        'A entrada "SENTb" subtituindo pela esquerda deve retornar "ab"'
    );

    t.equals(
        producao.aplicarPelaDireita('bSENT'),
        'ba',
        'A entrada "bSENT" subtituindo pela esquerda deve retornar "ba"'
    );

    t.equals(
        producao.aplicarPelaDireita('ab'),
        'ab',
        'A entrada "ab" subtituindo pela esquerda deve retornar "ab"'
    );

    t.end();
});
