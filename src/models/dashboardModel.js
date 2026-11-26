
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

function buscarTentativasRecentes() {

    var instrucaoSql = `
        SELECT
            u.nome AS usuario,
            f.nome AS faccao,
            DATE_FORMAT(t.dt_fim, '%d/%m/%Y %H:%i') AS data
        FROM tentativa AS t
        INNER JOIN usuario AS u
            ON t.fk_usuario = u.id
        INNER JOIN faccao AS f
            ON t.fk_faccao_resultado = f.id
        WHERE t.dt_fim IS NOT NULL
        ORDER BY t.dt_fim DESC
        LIMIT 5;
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    buscarTotalUsuarios,
    buscarTotalQuizzes,
    buscarResultadosPorFaccao,
    buscarTentativasRecentes
};
