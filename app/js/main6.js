
function prodTpl (prod) {
    return prod !== null ? prod.cabeca + ' &#8594 ' + prod.corpoStr : '';
}

function renderTabelaSintatica() {
    const $tabelaTpl = $($.parseHTML(
        `<table class="ui definition celled small compact table center aligned monospaced">
            <thead><tr><th></th></tr></thead>
            <tbody></tbody>
        </table>`
    )[0]);

    const $thead = $tabelaTpl.find('thead > tr');
    const colunas = Object.keys(analisadorPF._tabelaDR[analisadorPF._inicial]);

    for (const s of colunas) {
        $thead.append(`<th>${s}</th>`);
    }

    const linhas = Object.keys(analisadorPF._tabelaDR);
    const $tbody = $tabelaTpl.find('tbody');
    for (const snt of linhas) {

        const $tr = $($.parseHTML(
            `<tr>
                <td>${snt}</td>
            </tr>`
        )[0]);

        for (const st of colunas) {
            const acao = analisadorPF._tabelaDR[snt][st];
            $tr.append(
                `<td>${ acao === null || acao === undefined ? '' : acao }</td>`
            );
        }

        $tbody.append($tr);
    }

    $('#tabela-sintatica').append($tabelaTpl);
}

function renderGramatica() {
    const $defGram = $('#def-gramatica');

    $defGram.find('.nao-terminais').html(gramaticaPF._naoTerminais.join(', '));
    $defGram.find('.terminais').html(
        gramaticaPF._terminais.filter((s => !gramaticaPF.simboloEhVazio(s))).join(', ')
    );
    $defGram.find('.producoes').html('Pg');
    $defGram.find('.sentencial').html(analisadorPF._inicial);

    const $producoes = $('#producoes');
    $producoes.find('.producoes').html('Pg');

    const prodLista = $producoes.find('.ui.list');
    prodLista.html('');

    for (const prod of gramaticaPF.producoes) {
        prodLista.append(
            `<div class="item">${prodTpl(prod)}</div>`
        );
    }
}

function _renderArvore(no) {
    const config = { label: no.simbolo };
    if(no.nos.length === 0) return config;

    config['children'] = [];

    for (const n of no.nos) {
        config['children'].push(_renderArvore(n));
    }

    return config;
}

function renderArvore(arvore) {
    const config = _renderArvore(arvore);
    const $arvore = $('#arvore');
    $arvore.html(
        `<label class="label">Árvore Sintática</label>
        <div class="svg"><div></div></div>`
    );

    const render = new TreeDrawer($arvore.find('.svg > div')[0], config);
    render.draw();
}

function renderErro(entrada, erro) {
    const $erroTpl = $($.parseHTML(
        `<div>
            <p class="expressao monospaced"></p>
            <p class="expressao-marca monospaced"></p>
            <p>
                O símbolo "<span class="encontrado"></span>" não era esperado na
                posição <span class="posicao"></span>
            </p>
        </div>`
    )[0]);

    $erroTpl.find('.expressao').html(entrada);

    const marca = ['^'];
    for (let i = 0; i < erro.posicao; i++) marca.unshift('-');
    $erroTpl.find('.expressao-marca').html(marca.join(''));

    $erroTpl.find('.posicao').html('<b>' + erro.posicao + '</b>');

    if(erro.encontrado !== analisadorPF._fdc){
        $erroTpl.find('.encontrado').html('<b>'+ erro.encontrado +'</b>');
    }
    else {
        $erroTpl.find('.encontrado').html('<b>fim de cadeia</b>');
    }

    return $erroTpl;
}

function analisar(exp) {
    const prods = analisadorPF.analisar(exp);
    return ArvoreSintatica.parsearProducoes(prods, gramaticaPF, 'd');
}

$(document).ready(() => {
    console.log('ready');
    renderGramatica();
    renderTabelaSintatica();

    $("#run").click((e) => {

        const $message = $("#message");
        const $arvore = $("#arvore");
        const entrada = $('#source-code').val();

        $message.hide();
        $arvore.hide();

        try {
            const arvore = analisar(entrada);
            $arvore.show();
            renderArvore(arvore);
        }
        catch(erro) {
            $message.addClass("error");
            $message.find('.header').html('Erro sintático na expressão');
            $message.find('.body').html(renderErro(entrada, erro));
            $message.show();
            return;
        }
    });
});
