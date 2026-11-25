var database = require("../database/config")

function autenticar(email, senha) {
    var instrucaoSql = `
    SELECT id, nome, email
    FROM usuario
    WHERE email = ? AND senha = ?;`
    return database.executar(instrucaoSql, [email, senha]);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nome, email, senha) {
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `INSERT INTO usuario (nome, email, senha) VALUES
    (?, ?, ?);`;
    return database.executar(instrucaoSql, [nome, email, senha]);
}

function verificarNome(nome) {
    var instrucaoSql = `
        SELECT id FROM usuario
        WHERE nome = ?;
    `;

    return database.executar(instrucaoSql, [nome]);
}

function verificarNome(email) {                     
    var instrucaoSql = `                           
        SELECT id FROM usuario                     
        WHERE email = ?;                            
    `;                                             
                                                   
                                                   
    return database.executar(instrucaoSql, [email]);
}

module.exports = {
    autenticar,
    cadastrar,
    verificarNome,
    verificarEmail
};