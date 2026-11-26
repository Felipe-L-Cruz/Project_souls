
var dashboardModel = require("../models/dashboardModel");

function buscarIndicadores(req, res) {
    Promise.all([
        dashboardModel.buscarTotalUsuarios(),
        dashboardModel.buscarTotalQuizzes(),
        dashboardModel.buscarResultadosPorFaccao(),
        dashboardModel.buscarTentativasRecentes()
    ])
    .then(function (resultados) {
        var distribuicao = resultados[2];

        res.status(200).json({
            totalUsuarios: resultados[0][0].total,
            totalQuizzes: resultados[1][0].total,
            resultadosPorFaccao: distribuicao,
            faccaoMaisFrequente: distribuicao.length > 0 ? distribuicao[0] : null,
            tentativasRecentes: resultados[3]
        });
    })
    .catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro);
    });
}

module.exports = {
    buscarIndicadores
};
