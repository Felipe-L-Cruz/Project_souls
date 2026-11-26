
var quizModel = require("../models/quizModel");

function buscarPerguntas(req, res) {
    quizModel.buscarPerguntas()
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function registrarRespostas(req, res) {

    var usuarioId = req.body.usuarioId;
    var respostas = req.body.respostas;

    if (usuarioId == undefined || respostas == undefined || respostas.length != 8) {
        return res.status(400).json({
            mensagem: "Dados inválidos ou respostas incompletas."
        });
    }

    quizModel.registrarRespostas(usuarioId, respostas)

        .then(function (resultado) {

            res.status(200).json({
                faccao: resultado
            });

        })

        .catch(function (erro) {

            console.log(erro);

            res.status(500).json({
                mensagem: "Erro ao registrar as respostas do quiz."
            });

        });

}

module.exports = { 
    buscarPerguntas,
    registrarRespostas
};                 
                   
                   