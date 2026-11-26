var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {

    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        return res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        return res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                                    res.json({
                                        id: resultadoAutenticar[0].id,
                                        email: resultadoAutenticar[0].email,
                                        nome: resultadoAutenticar[0].nome
                                    });

                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrar (req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (nome == undefined) {
        return res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        return res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        return res.status(400).send("Sua senha está undefined!");
    } 

        usuarioModel.verificarNome(nome)
            .then(function (resultadoNome) {

                if (resultadoNome.length > 0) {
                   throw res.status(409).send("Esse nome já está cadastrado!");
            }

         return usuarioModel.verificarEmail(email);
            })

             .then(function (resultadoEmail) {

            if (resultadoEmail.length > 0) {
                throw { status: 409, mensagem: "Esse e-mail já está cadastrado!" };
            }

            return usuarioModel.cadastrar(nome, email, senha);
        })
        .then(function (resultado) {
            return res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);

            if (erro.status) {
                return res.status(erro.status).send(erro.mensagem);
            }

            if (erro.code === "ER_DUP_ENTRY") {
                return res.status(409).send("Nome ou e-mail já cadastrado!");
            }

            return res.status(500).send("Erro ao realizar o cadastro!");
        });
        
        console.log("Email recebido:", email);
        console.log("Senha recebida:", senha);

}

module.exports = {
    autenticar,   
    cadastrar     
};                