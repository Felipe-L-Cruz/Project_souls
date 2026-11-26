

var perguntas = [];
var indiceAtual = 0;
var respostasSelecionadas = [];

var btn_comecar = document.getElementById("btn_comecar");
var quiz_conteudo = document.getElementById("quiz_conteudo");

btn_comecar.onclick = buscarPerguntas;

// Busca as perguntas no backend
function buscarPerguntas() {

    fetch("/quiz/perguntas")
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (dados) {

            organizarPerguntas(dados);

            indiceAtual = 0;
            respostasSelecionadas = [];

            btn_comecar.style.display = "none";

            renderizarPergunta();

        })
        .catch(function (erro) {
            console.log(erro);
        });
}

// Agrupa as alternativas de cada pergunta
function organizarPerguntas(dados) {

    perguntas = [];

    for (var i = 0; i < dados.length; i++) {

        if (i == 0 || dados[i].pergunta_id != dados[i - 1].pergunta_id) {

            perguntas.push({
                id: dados[i].pergunta_id,
                enunciado: dados[i].enunciado,
                ordem: dados[i].pergunta_ordem,
                alternativas: []
            });

        }

        perguntas[perguntas.length - 1].alternativas.push({
            id: dados[i].alternativa_id,
            texto: dados[i].alternativa_texto
        });

    }
}

// Exibe uma pergunta por vez
function renderizarPergunta() {

    var perguntaAtual = perguntas[indiceAtual];

    var html = "";

    var progresso = ((indiceAtual + 1) / perguntas.length) * 100;

    html += `
        <div class="progresso">
            <p>Pergunta ${indiceAtual + 1} de ${perguntas.length}</p>
            <div class="barra-progresso">
                <div style="width: ${progresso}%"></div>
            </div>
        </div>

        <div class="pergunta">
            <h3>${perguntaAtual.ordem}. ${perguntaAtual.enunciado}</h3>
    `;

    for (var i = 0; i < perguntaAtual.alternativas.length; i++) {

        var alternativa = perguntaAtual.alternativas[i];

        html += `
            <label>
                <input type="radio"
                    name="pergunta_${perguntaAtual.id}"
                    value="${alternativa.id}">
                ${alternativa.texto}
            </label>
            <br>
        `;

    }

    html += `
        </div>

        <button class="botao" id="btn_proxima">
            ${indiceAtual == perguntas.length - 1 ? "Concluir" : "Próxima pergunta"}
        </button>
    `;

    quiz_conteudo.innerHTML = html;

    document.getElementById("btn_proxima").onclick = proximaPergunta;
}

// Avança para a próxima pergunta
function proximaPergunta() {

    var perguntaAtual = perguntas[indiceAtual];

    var selecionada = document.querySelector(
        'input[name="pergunta_' + perguntaAtual.id + '"]:checked'
    );

    if (selecionada == null) {
        alert("Selecione uma alternativa antes de continuar.");
        return;
    }

    respostasSelecionadas.push({
        pergunta: perguntaAtual.id,
        alternativa: Number(selecionada.value)
    });

    if (indiceAtual < perguntas.length - 1) {

        indiceAtual++;

        renderizarPergunta();

    } else {

        registrarRespostas();

        console.log(respostasSelecionadas);

    }
}

function registrarRespostas() {

    var usuarioId = sessionStorage.getItem("ID_USUARIO");

    if (usuarioId == null) {
        alert("Não foi possível identificar o usuário. Faça login novamente.");
        return;
    }

    fetch("/quiz/responder", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuarioId: Number(usuarioId),
            respostas: respostasSelecionadas
        })
    })

    .then(function (resposta) {

        if (!resposta.ok) {
            throw new Error("Erro ao registrar as respostas.");
        }

        return resposta.json();

    })

    .then(function (dados) {

        mostrarResultado(dados.faccao);

    })

    .catch(function (erro) {

        console.log(erro);
        alert("Ocorreu um erro ao finalizar o quiz.");

    });

}

function mostrarResultado(faccao) {

    var imagem = ""


    if (faccao.nome == "Shinigamis") {
        imagem = "/assets/faccoes /shinigamis.jpg";

    } else if (faccao.nome == "Hollows/Arrancars") {
        imagem="/assets/faccoes /arrancars.jpg";

    } else if (faccao.nome == "Quincys") {
        imagem = "/assets/faccoes /quincys.jpg";

    } else if (faccao.nome == "Visoreds") {
        imagem = "/assets/faccoes /visoreds.jpg";

    } else if (faccao.nome == "Fullbringers") {
        imagem = "/assets/faccoes /fullbringers.jpg";
    }

    quiz_conteudo.innerHTML = `
        <div class="resultado">
            <h2>Seu resultado!</h2>

            <h3>${faccao.nome}</h3>

            <img src="${imagem}" alt="${faccao.nome}"
                style="max-width: 300px; width: 100%;">

            <p>${faccao.descricao}</p>

            <p>Pontuação: ${faccao.pontos}</p>
        </div>
    `;

}
