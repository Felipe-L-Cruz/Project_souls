
function carregarIndicadores() {

    fetch("/dashboard/indicadores")
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (dados) {

            // INDICADORES

            document.getElementById("total_usuarios").innerHTML =
                dados.totalUsuarios;

            document.getElementById("total_quizzes").innerHTML =
                dados.totalQuizzes;

            document.getElementById("faccao_frequente").innerHTML =
                dados.faccaoMaisFrequente.faccao;

            // TENTATIVAS RECENTES

            var tentativas = dados.tentativasRecentes;
            var tabela = "";

            for (var i = 0; i < tentativas.length; i++) {

                tabela += `
        <tr>
            <td>${tentativas[i].usuario}</td>
            <td>${tentativas[i].faccao}</td>
            <td>${tentativas[i].data}</td>
        </tr>
    `;
            }

            document.getElementById("tabela_tentativas").innerHTML =
                tentativas.length > 0 ? tabela :
                    "<tr><td colspan='3'>Nenhuma tentativa registrada</td></tr>";


            // CORES DAS FACÇÕES

            var cores = {
                "Hollows/Arrancars": "#d40d09",
                "Quincys": "#55aaf0",
                "Fullbringers": "#1b911f",
                "Visoreds": "#f8be29",
                "Shinigamis": "#FFFFFF"
            };


            // DADOS DO GRÁFICO

            var resultados = dados.resultadosPorFaccao

            var total = 0;

            for (var i = 0; i < resultados.length; i++) {
                total += resultados[i].total;
            }


            // EXIBIR TOTAL NO CENTRO

            document.getElementById("total_resultados").innerHTML = total;


            // CALCULAR AS FATIAS DO GRÁFICO

            var anguloAtual = 0;
            var fatias = [];
            var legenda = "";

            for (var i = 0; i < resultados.length; i++) {

                var faccao = resultados[i].faccao;
                var quantidade = resultados[i].total;
                var porcentagem = total > 0 ? (quantidade / total) * 100 : 0;
                var angulo = (porcentagem / 100) * 360;

                var cor = cores[faccao] || "#888888";

                fatias.push(
                    cor + " " + anguloAtual + "deg " + (anguloAtual + angulo) + "deg"
                );

                anguloAtual += angulo;


                // MONTAR LEGENDA

                legenda += `
                    <div class="item-legenda">
                        <div class="cor-legenda" style="background-color: ${cor}"></div>

                        <div class="info-legenda">
                            <span class="nome-faccao">${faccao}</span>
                            <span class="quantidade-faccao">
                                ${quantidade} resultados (${porcentagem.toFixed(1)}%)
                            </span>
                        </div>
                    </div>
                `;
            }


            // APLICAR AS CORES NO GRÁFICO

            var grafico = document.getElementById("grafico_faccoes");

            if (total > 0) {
                grafico.style.backgroundImage =
                    "conic-gradient(" + fatias.join(", ") + ")";
            } else {
                grafico.style.background = "#383838";
            }
            console.log("Gradiente aplicado:", grafico.style.background);
            console.log("Gradiente exibido:", getComputedStyle(grafico).backgroundImage);

            // EXIBIR LEGENDA

            document.getElementById("distribuicao_faccoes").innerHTML =
                total > 0 ? legenda : "Nenhum resultado registrado";

        })
        .catch(function (erro) {
            console.log("Erro ao carregar indicadores:", erro);
        });
}

carregarIndicadores();

setInterval(carregarIndicadores, 10000);