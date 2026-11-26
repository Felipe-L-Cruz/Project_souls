
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

function registrarRespostas(usuarioId, respostas) {

    var instrucaoSql = `
        INSERT INTO tentativa (fk_usuario)
        VALUES (?);
    `;

    return database.executar(instrucaoSql, [usuarioId])

        .then(function (resultado) {

            var tentativaId = resultado.insertId;

            var consultas = Promise.resolve();

            // Salva cada resposta da tentativa
            respostas.forEach(function (resposta) {

                consultas = consultas.then(function () {

                    var instrucaoResposta = `
                        INSERT INTO resp_personalidade
                        (fk_tentativa, fk_pergunta, fk_alternativa)
                        VALUES (?, ?, ?);
                    `;

                    return database.executar(instrucaoResposta, [
                        tentativaId,
                        resposta.pergunta,
                        resposta.alternativa
                    ]);

                });

            });

            return consultas.then(function () {

                // Calcula a pontuação de cada facção
                var instrucaoPontuacao = `
                    SELECT
                        f.id,
                        f.nome,
                        f.descricao,
                        SUM(p.peso) AS pontos
                    FROM resp_personalidade AS r
                    JOIN pontuacao AS p
                        ON r.fk_alternativa = p.fk_alternativa
                    JOIN faccao AS f
                        ON p.fk_faccao = f.id
                    WHERE r.fk_tentativa = ?
                    GROUP BY f.id, f.nome, f.descricao
                    ORDER BY pontos DESC;
                `;

                return database.executar(instrucaoPontuacao, [tentativaId]);

            }).then(function (resultado) {

                var maiorPontuacao = resultado[0].pontos;

                var empatadas = resultado.filter(function (faccao) {
                    return faccao.pontos == maiorPontuacao;
                });

                // Escolhe aleatoriamente entre as facções empatadas
                var indiceSorteado = Math.floor(Math.random() * empatadas.length);

                var faccaoEscolhida = empatadas[indiceSorteado];

                // Finaliza a tentativa e registra o resultado
                var instrucaoFinalizar = `
                    UPDATE tentativa
                    SET dt_fim = CURRENT_TIMESTAMP,
                        fk_faccao_resultado = ?
                    WHERE id = ?;
                `;

                return database.executar(instrucaoFinalizar, [
                    faccaoEscolhida.id,
                    tentativaId
                ]).then(function () {

                    return faccaoEscolhida;

                });

            });

        });

}

module.exports = {
    buscarPerguntas,
    registrarRespostas
};
