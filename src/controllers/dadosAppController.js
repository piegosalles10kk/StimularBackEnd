const multer = require('multer');
const { User, DadosApp } = require('../models/User'); // Certifique-se de que ambos os modelos estejam importados corretamente
const upload = multer();

const formatDate = () => {
    const date = new Date();
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();

    return `${dia}/${mes}/${ano}`; // Retorna a data no formato dd/mm/yyyy
};

const sendDadosApp = async (req, res) => {
    try {
        const taxa = 0.85;
        const precoAssinatura = 99.99;

        // Obtém a data atual
        const dataAtual = formatDate();
        const dataAtualParts = dataAtual.split('/'); 
        const dataAtualISO = new Date(`${dataAtualParts[2]}-${dataAtualParts[1]}-${dataAtualParts[0]}`); // Converte para o formato ISO

        // Busca todos os usuários
        const usuarios = await User.find();

        // Contador de usuários pagantes
        let usuariosPagantes = 0;

        // Verifica a validade de cada usuário
        usuarios.forEach(user => {
        if(user.ativo === true){                 
            if(user.tipoDeConta === 'Paciente'){   
                if (user.validade) {
                    const validadeParts = user.validade.split('/'); // Divide a string pela '/'
                    const validade = new Date(`${validadeParts[2]}-${validadeParts[1]}-${validadeParts[0]}`); // Converte para o formato ISO
                    // Se a data de validade for maior que a data atual, conta como pagante
                    if (validade > dataAtualISO) {
                        usuariosPagantes++;
                        //console.log(usuariosPagantes);
                        
                    }
                }
            }
        }
        });

        // Contagem total de usuários cadastrados
        let usuariosCadastrados = 0;

        usuarios.forEach(user => {
        if(user.ativo === true){ 
            if(user.tipoDeConta === 'Paciente'){
                usuariosCadastrados++;
            }
            
        }
        });

        // Calcula a receita estimada
        const receitaEstimadaConta = usuariosPagantes * precoAssinatura * taxa;
        const receitaEstimada = receitaEstimadaConta.toFixed(2);

        // Cria um novo documento em DadosApp
        const novoDadosApp = new DadosApp({
            usuariosCadastrados,
            usuariosPagantes,
            receitaEstimada,
            dataCriacao: new Date() // data de criação como agora
        });

        // Salva o documento no banco de dados
        await novoDadosApp.save();

        // Retorna a resposta
        return res.status(201).json({
            message: "Dados do app registrados com sucesso.",
            data: novoDadosApp
        });
    } catch (error) {
        console.error("Erro ao registrar os dados do app:", error);
        return res.status(500).json({
            message: "Erro ao registrar os dados do app.",
            error: error.message
        });
    }
};

const getDadosApp = async (req, res) => {
    try {
        const dadosApp = await DadosApp.find();
        return res.status(200).json({ dadosApp });
        
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar dados do app.", error: error.message });
    }
};

module.exports = { sendDadosApp, getDadosApp };
