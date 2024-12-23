const mongoose = require('mongoose');

// Esquema para Alternativas
const AlternativasSchema = new mongoose.Schema({
    alternativa: { type: String, required: true },
    resultadoAlternativa: { type: Boolean, required: true }
});

// Esquema para Exercícios
const ExerciciosSchema = new mongoose.Schema({
    exercicioId: { type: mongoose.Schema.Types.ObjectId, required: true, default: () => new mongoose.Types.ObjectId() },
    midia: {
        tipoDeMidia: { type: String, required: false },
        url: { type: String, required: false }
    },
    enunciado: { type: String, required: true },
    exercicio: { type: String, required: false },
    alternativas: [AlternativasSchema], // Usando o schema de alternativas
    pontuacao: { type: Number, required: true }
});

// Esquema para Atividades
const AtividadesAppSchema = new mongoose.Schema({
    criador: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        nome: { type: String, required: true }
    },
    idade: { type: Number, required: true },
    marco: { type: String, required: true },
    nomdeDaAtividade: { type: String, required: true },
    descicaoDaAtividade: { type: String, required: false },
    fotoDaAtividade: { type: String, required: false },
    tipoDeAtividade: { type: String, required: true },
    exercicios: [ExerciciosSchema],
    pontuacaoTotalDoGrupo: { type: Number, required: true, default: 0 }
});

// O modelo
const AtividadesApp = mongoose.model('ListaAtividades', AtividadesAppSchema);

module.exports = AtividadesApp;
