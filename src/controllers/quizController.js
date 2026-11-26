
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

module.exports = {
    buscarPerguntas
};
