
function carregarIndicadores() {

    fetch("/dashboard/indicadores")
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (dados) {

            document.getElementById("total_usuarios").innerHTML =
                dados.totalUsuarios;

            document.getElementById("total_quizzes").innerHTML =
                dados.totalQuizzes;

            document.getElementById("faccao_frequente").innerHTML =
                dados.faccaoMaisFrequente.faccao;

            console.log(dados);

        })
        .catch(function (erro) {
            console.log("Erro ao carregar indicadores:", erro);
        });
}

carregarIndicadores();
