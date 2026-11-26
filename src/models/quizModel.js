
var database = require("../database/config");

function buscarPerguntas() {
    var instrucaoSql = `
        SELECT
            p.id AS pergunta_id,
            p.enunciado,
            p.ordem AS pergunta_ordem,
            a.id AS alternativa_id,
            a.texto AS alternativa_texto,
            a.ordem AS alternativa_ordem
        FROM pergunta_personalidade AS p
        JOIN alt_personalidade AS a
            ON p.id = a.fk_pergunta
        WHERE p.ativo = 1
        ORDER BY p.ordem, a.ordem;
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    buscarPerguntas
};
