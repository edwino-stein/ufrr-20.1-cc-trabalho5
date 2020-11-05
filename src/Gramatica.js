// Verifica se está rodando pelo Node.js
const isNode = typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined';

if(isNode){
    var Producao = require('./Producao.js');
}

/**
 * Classe responsável por representar uma gramática
 */
class Gramatica {

    /**
     * Construtor da classe
     */
    constructor () {
        this._terminais = [];
        this._naoTerminais = [];
        this._producoes = {};
    }

    /**
     * Busca por todas produções de um determinado símbolo não terminal
     * @param  {string} snt Símbolo não terminal
     * @return {Array}
     */
    _buscarProducoesPorNaoTerminal (snt) {

        // Verifica se o símbolo não terminal existe na gramática
        if (typeof(this._producoes[snt]) === 'undefined') {
            throw 'O símbolo não terminai não foi definido'
        }

        // Se existir, retorna suas produções
        return this._producoes[snt];
    }

    /**
     * Verifica uma string e procura todas ocorrencias de símbolos não terminais
     * da gramática
     * @param  {string}  entrada String de entrada
     * @return {object} Objeto chave-valor com listas das posições de cada
     *                  ocorrência de cada símbolo não terminal
     */
    _ocorrenciasDeNaoTermiais (entrada) {

        // Conver a string para uma lista de caracteres
        entrada = [ ...entrada ];

        // Cria um objeto vazio
        const ocorrencias = {};

        for (const i in entrada) {

            // Para cada símbolo da entrada
            const s = entrada[i];

            // Se não for não terminal, ignora-o
            if(!this._naoTerminais.includes(s)) continue;

            // Se for não terminal termina, adiciona a posição na lista
            // correspondente a chave do símbolo no objeto de retorno
            if(typeof(ocorrencias[s]) === 'undefined') ocorrencias[s] = [];
            ocorrencias[s].push(parseInt(i));
        }

        return ocorrencias;
    }

    /**
     * Verifica se em uma string existe a ocorrencia de algum símbolo não
     * terminal da gramáitica
     * @param  {string} entrada String de entrada
     * @return {boolean}
     */
    existeNaoTerminal (entrada) {
        return Object.keys(this._ocorrenciasDeNaoTermiais(entrada)).length > 0;
    }

    /**
     * Retorna uma produção de um símbolo não terminal válido na gramática
     * @param  {string} snt    Símbolo não terminal
     * @param  {integer} indice Índice da produção respectivo símbolo não terminal
     * @return {Producao}
     */
    producao (snt, indice) {

        if(typeof(indice) !== 'number') indice = 0;

        const producoes = this._buscarProducoesPorNaoTerminal(snt);
        if(indice < 0 || indice >= producoes.length) {
            throw 'Produção é inválida';
        }

        return producoes[indice];
    }

    /**
     * Cria e inicializa uma instância de Gramatica
     * @param  {object} producoes   Objeto chave-valor contendo os símbolos não
     *                              terminais e suas respectivas dereivações
     * @return {Gramatica}
     */
    static criar (producoes) {

        if(typeof(producoes) !== 'object') {
            throw 'As produções devem ser um objeto chave valor não vazio';
        }

        // Cria a instância de Gramatica e define os símbolos não terminais
        const gram = new Gramatica();
        gram._naoTerminais = Object.keys(producoes);

        if(gram._naoTerminais.length === 0){
            throw 'As produções devem ser um objeto chave valor não vazio';
        }

        // Para cada símbolo não terminal...
        let terminais = [];
        for (const snt of gram._naoTerminais) {

            gram._producoes[snt] = [];

            // Valida e cria as produções
            const prods = typeof(producoes[snt]) === 'string' ? [producoes[snt]] : producoes[snt];

            if(typeof(prods) !== 'object' || !(prods instanceof Array)) {
                throw 'As produções deve uma string ou uma lista não vaiza de strings';
            }

            if(prods.length === 0 || !prods.every(i => typeof(i) === 'string')) {
                throw 'As produções deve uma string ou uma lista não vaiza de strings';
            }

            // Para cada símbolo terminal referente as prpduções do símbolo não
            // termial atual...
            for (let st of prods) {

                // Cria uma instância de Produção e adiciona a gramática
                st = [ ...st ];
                gram._producoes[snt].push(new Producao(snt, st));

                // Guarda todos os símbolos terminais em uma lista
                terminais = [
                    ...terminais,
                    ...st.filter((i, p) => !gram._naoTerminais.includes(i))
                ];
            }
        }

        // Ao terminar de criar todas as produções, remove ocorrências repetidas
        // de símbolos terminais
        gram._terminais = terminais.filter((i, p) => terminais.indexOf(i) === p);

        // Retorna a instância de Gramatica
        return gram;
    }
}

if(isNode) module.exports = Gramatica;
