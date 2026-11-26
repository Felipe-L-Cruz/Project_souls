
var database = require("../database/config");

function buscarTotalUsuarios() {
    var instrucaoSql = `
        SELECT COUNT(*) AS total
        FROM usuario;
    `;

    return database.executar(instrucaoSql);
}

function buscarTotalQuizzes() {
    var instrucaoSql = `
        SELECT COUNT(*) AS total
        FROM tentativa
        WHERE dt_fim IS NOT NULL;
    `;

    return database.executar(instrucaoSql);
}

function buscarResultadosPorFaccao() {
    var instrucaoSql = `
        SELECT
            f.nome AS faccao,
            COUNT(t.id) AS total
        FROM faccao AS f
        LEFT JOIN tentativa AS t
            ON t.fk_faccao_resultado = f.id
            AND t.dt_fim IS NOT NULL
        GROUP BY f.id, f.nome
        ORDER BY total DESC;
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    buscarTotalUsuarios,
    buscarTotalQuizzes,
    buscarResultadosPorFaccao
};
