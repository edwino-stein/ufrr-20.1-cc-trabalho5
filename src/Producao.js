// Verifica se está rodando pelo Node.js
const isNode = typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined';

/**
 * Classe responsável por representar uma produção em uma gramática
 */
class Producao {

    /**
     * Construtor da classe
     * @param {string} cabeca Símbolo não terminal que corresponde a cabeça da produção
     * @param {[string]} corpo  Lista de símbolos que correspondem ao corpo da produção
     */
    constructor(cabeca, corpo) {

        if(typeof(cabeca) !== 'string' || cabeca.length == 0) {
            throw 'A cabeça da produção deve ser uma string com tamanho 1';
        }

        if(typeof(corpo) !== 'object' || !(corpo instanceof Array)) {
            throw 'O corpo da produção deve ser uma lista de strings'
        }

        if(!corpo.every(i => typeof(i) === 'string' && i.length <= 1)) {
            throw 'O corpo da produção deve ser uma lista de strings'
        }

        this._cabeca = cabeca;
        this._corpo = corpo;
    }

    /**
     * Retorna o símbolo da cabeça
     * @return {string}
     */
    get cabeca() { return this._cabeca; }

    /**
     * Retorna a lista de símbolos do corpo
     * @return {[string]}
     */
    get corpo() { return this._corpo; }

    /**
     * Aplica a produção na string de entrada pela esquerda na primeira ocorrência
     * encontradoda símbolo da cabeça, no caso de não ser encontrado, apenas
     * retorna a stirng de entrada
     * @param  {string} entrada String de entrada para produção
     * @return {strng}
     */
    aplicarPelaEsquerda (entrada) {
        return this.aplicar(entrada, entrada.indexOf(this.cabeca));
    }

    /**
     * Aplica a produção na string de entrada pela direita na primeira ocorrência
     * encontradoda símbolo da cabeça, no caso de não ser encontrado, apenas
     * retorna a stirng de entrada
     * @param  {string} entrada String de entrada para produção
     * @return {strng}
     */
    aplicarPelaDireita (entrada) {
        return this.aplicar(entrada, entrada.lastIndexOf(this.cabeca));
    }

    /**
     * Aplica a produção na string de entrada em uma posição válida que corresponde
     * ao símbolo da cabeça, caso a posição não seja válida, apenas retorna a
     * string de entrada
     * @param  {string} entrada String de entrada para produção
     * @param  {integer} posicao Posição válida correspondente ao símbolo da cabeça
     * @return {string}
     */
    aplicar(entrada, posicao) {
        if(posicao < 0 || posicao >= entrada.length) return entrada;
        if(entrada[posicao] !== this.cabeca) return entrada;
        return this._aplicar(entrada, posicao);
    }

    /**
     * Aplica a produção em uma posição qualquer na string de entrada
     * @param  {string} entrada String de entrada para produção
     * @param  {integer} posicao Posição em que será aplicada a produção
     * @return {string}
     */
    _aplicar(entrada, posicao) {
        entrada = [ ...entrada ];
        return [
            ...entrada.slice(0, posicao),
            ...this.corpo,
            ...entrada.slice(posicao + 1),
        ].join('');
    }
}

if(isNode) module.exports = Producao;
