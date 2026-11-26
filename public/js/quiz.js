console.log("JavaScript do quiz conectado!");

var perguntas = [];

var btn_comecar = document.getElementById("btn_comecar");
var quiz_conteudo = document.getElementById("quiz_conteudo");

btn_comecar.onclick = buscarPerguntas;

function buscarPerguntas() {

    fetch("/quiz/perguntas")
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (dados) {

            perguntas = dados;

            console.log(perguntas);

        })
        .catch(function (erro) {
            console.log(erro);
        });

}