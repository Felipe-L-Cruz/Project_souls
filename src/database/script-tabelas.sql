-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/

CREATE DATABASE Project_Souls;
USE Project_Souls;



-- USUÁRIO

CREATE TABLE usuario (
id INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR (100) UNIQUE,
email VARCHAR (65) UNIQUE,
senha VARCHAR(20)
);

-- FACÇÃO

CREATE TABLE faccao (
id INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR (60) NOT NULL UNIQUE,
descricao VARCHAR(100),
ativo TINYINT DEFAULT 1,
CHECK (ativo IN(0,1))
);

-- PERGUNTAS QUIZ

CREATE TABLE pergunta_personalidade (
id INT PRIMARY KEY AUTO_INCREMENT,
enunciado VARCHAR(100) NOT NULL,
ordem INT NOT NULL UNIQUE,
ativo TINYINT DEFAULT 1,
CHECK (ativo IN(0,1))
);

-- ALTERNATIVAS DAS PERGUNTAS

CREATE TABLE alt_personalidade (
id INT PRIMARY KEY AUTO_INCREMENT,
texto VARCHAR(255) NOT NULL,
ORDEM INT NOT NULL,
fk_pergunta INT NOT NULL,
CONSTRAINT fk_alt_pergunta
	FOREIGN KEY (fk_pergunta)
		REFERENCES pergunta_personalidade(id),
        
UNIQUE (fk_pergunta, ordem),
UNIQUE (id, fk_pergunta)
);

-- PONTUAÇÃO

CREATE TABLE pontuacao (
fk_alternativa INT NOT NULL,
fk_faccao INT NOT NULL,
peso DECIMAL (5,2) NOT NULL DEFAULT 1.00,

PRIMARY KEY (fk_alternativa, fk_faccao),

CONSTRAINT fk_pontuacao_alternativa
	FOREIGN KEY (fk_alternativa)
		REFERENCES alt_personalidade(id),
        
CONSTRAINT fk_pontuacao_faccao
	FOREIGN KEY (fk_faccao)
		REFERENCES faccao(id),
        
CHECK (peso > 0)
);

-- TENTATIVAS QUIZ

CREATE TABLE tentativa (
id INT PRIMARY KEY AUTO_INCREMENT,
dt_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
dt_fim DATETIME NULL,
fk_usuario INT NOT NULL,
fk_faccao_resultado INT NULL,

CONSTRAINT fk_tentativa_usuario
	FOREIGN KEY (fk_usuario)
		REFERENCES usuario(id),

CONSTRAINT fk_tentativa_resultado
	FOREIGN KEY (fk_faccao_resultado)
		REFERENCES faccao(id)
);

-- RESPOSTAS QUIZ

CREATE TABLE resp_personalidade (
fk_tentativa INT NOT NULL,
fk_pergunta INT NOT NULL,
fk_alternativa INT NOT NULL,

PRIMARY KEY (fk_tentativa, fk_pergunta),

CONSTRAINT fk_resp_tentativa
	FOREIGN KEY (fk_tentativa)
		REFERENCES tentativa(id),
        
CONSTRAINT fk_resp_pergunta
	FOREIGN KEY (fk_pergunta)
		REFERENCES pergunta_personalidade(id),

CONSTRAINT fk_resp_alternativa_pergunta
	FOREIGN KEY (fk_alternativa, fk_pergunta)
		REFERENCES alt_personalidade(id, fk_pergunta)
);

-- INSERTS
USE Project_Souls;

INSERT INTO faccao (id, nome, descricao, ativo) VALUES
(1, 'Shinigamis', 'Representa disciplina, responsabilidade, justiça e compromisso com o dever.', 1),
(2, 'Hollows/Arrancars', 'Representa sobrevivência, força, independência e superação.', 1),
(3, 'Quincys', 'Representa estratégia, determinação, disciplina e busca pela excelência.', 1),
(4, 'Visoreds', 'Representa equilíbrio, adaptação, aceitação e controle da própria natureza.', 1),
(5, 'Fullbringers', 'Representa individualidade, liberdade, conexão e valorização das próprias experiências.',1);

INSERT INTO pergunta_personalidade (id, enunciado, ordem, ativo) VALUES
(1, 'Diante de uma situação difícil, qual costuma ser sua primeira atitude?', 1, 1),

(2, 'O que você mais valoriza em uma equipe?', 2, 1),

(3, 'Quando alguém desafia suas capacidades, como você reage?', 3, 1),

(4, 'Qual característica considera mais importante em uma pessoa?', 4, 1),

(5, 'Se precisasse tomar uma decisão difícil, o que pesaria mais?', 5, 1),

(6, 'Como você costuma lidar com suas próprias limitações?', 6, 1),

(7, 'O que mais motiva você a continuar seguindo em frente?', 7, 1),

(8, 'Qual dessas frases mais representa sua maneira de enxergar a vida?', 8, 1);


INSERT INTO alt_personalidade
(id, fk_pergunta, texto, ordem) VALUES

-- Pergunta 1
(1, 1, 'Analiso minhas responsabilidades e procuro fazer o que é correto.', 1),
(2, 1, 'Confio nos meus instintos e enfrento o problema diretamente.', 2),
(3, 1, 'Elaboro uma estratégia antes de tomar qualquer atitude.', 3),
(4, 1, 'Procuro compreender a situação e encontrar equilíbrio.', 4),
(5, 1, 'Busco uma solução que respeite minha individualidade.', 5),

-- Pergunta 2
(6, 2, 'Lealdade e comprometimento com um objetivo em comum.', 1),
(7, 2, 'Força e capacidade de proteger uns aos outros.', 2),
(8, 2, 'Competência e dedicação para alcançar resultados.', 3),
(9, 2, 'Aceitação das diferenças e confiança mútua.', 4),
(10, 2, 'Liberdade para que cada pessoa seja quem realmente é.', 5),

-- Pergunta 3
(11, 3, 'Mantenho a postura e procuro provar meu valor.', 1),
(12, 3, 'Aceito o desafio e dou tudo de mim para superar o adversário.', 2),
(13, 3, 'Uso minhas habilidades e preparo para demonstrar minha capacidade.', 3),
(14, 3, 'Procuro controlar minhas emoções antes de reagir.', 4),
(15, 3, 'Não deixo que a opinião dos outros defina meu valor.', 5),

-- Pergunta 4
(16, 4, 'Senso de justiça e responsabilidade.', 1),
(17, 4, 'Coragem e capacidade de resistência.', 2),
(18, 4, 'Disciplina e determinação.', 3),
(19, 4, 'Autoconhecimento e equilíbrio emocional.', 4),
(20, 4, 'Autenticidade e liberdade.', 5),

-- Pergunta 5
(21, 5, 'O impacto da decisão sobre as pessoas pelas quais sou responsável.', 1),
(22, 5, 'A possibilidade de sobreviver e proteger aquilo que importa.', 2),
(23, 5, 'A alternativa mais eficiente para alcançar meu objetivo.', 3),
(24, 5, 'A necessidade de conciliar diferentes interesses.', 4),
(25, 5, 'Aquilo que considero verdadeiro e importante para mim.', 5),

-- Pergunta 6
(26, 6, 'Encaro minhas limitações como responsabilidades que devo superar.', 1),
(27, 6, 'Transformo minhas dificuldades em motivação para ficar mais forte.', 2),
(28, 6, 'Estudo meus erros e trabalho para aperfeiçoar minhas habilidades.', 3),
(29, 6, 'Procuro aceitar minhas contradições e aprender a conviver com elas.', 4),
(30, 6, 'Entendo que minhas limitações fazem parte da minha identidade.', 5),

-- Pergunta 7
(31, 7, 'Cumprir meus deveres e honrar meus compromissos.', 1),
(32, 7, 'A vontade de me tornar mais forte e superar obstáculos.', 2),
(33, 7, 'Alcançar meus objetivos e provar minha capacidade.', 3),
(34, 7, 'Encontrar equilíbrio e compreender melhor a mim mesmo.', 4),
(35, 7, 'Construir meu próprio caminho e viver minhas experiências.', 5),

-- Pergunta 8
(36, 8, 'A força de alguém também está naquilo que protege.', 1),
(37, 8, 'Sobreviver e evoluir exige força para enfrentar a realidade.', 2),
(38, 8, 'A preparação e a determinação são fundamentais para vencer.', 3),
(39, 8, 'Conhecer a si mesmo é essencial para encontrar equilíbrio.', 4),
(40, 8, 'Cada pessoa deve ter liberdade para construir sua própria história.', 5);

INSERT INTO pontuacao (fk_alternativa, fk_faccao, peso) VALUES

-- Alternativas dos Shinigamis
(1, 1, 1.00),
(6, 1, 1.00),
(11, 1, 1.00),
(16, 1, 1.00),
(21, 1, 1.00),
(26, 1, 1.00),
(31, 1, 1.00),
(36, 1, 1.00),

-- Alternativas dos Hollows/Arrancars
(2, 2, 1.00),
(7, 2, 1.00),
(12, 2, 1.00),
(17, 2, 1.00),
(22, 2, 1.00),
(27, 2, 1.00),
(32, 2, 1.00),
(37, 2, 1.00),

-- Alternativas dos Quincys
(3, 3, 1.00),
(8, 3, 1.00),
(13, 3, 1.00),
(18, 3, 1.00),
(23, 3, 1.00),
(28, 3, 1.00),
(33, 3, 1.00),
(38, 3, 1.00),

-- Alternativas dos Visoreds
(4, 4, 1.00),
(9, 4, 1.00),
(14, 4, 1.00),
(19, 4, 1.00),
(24, 4, 1.00),
(29, 4, 1.00),
(34, 4, 1.00),
(39, 4, 1.00),

-- Alternativas dos Fullbringers
(5, 5, 1.00),
(10, 5, 1.00),
(15, 5, 1.00),
(20, 5, 1.00),
(25, 5, 1.00),
(30, 5, 1.00),
(35, 5, 1.00),
(40, 5, 1.00);
