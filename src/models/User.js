const mongoose = require('mongoose');

// Definindo os esquemas
const DiagnosticoSchema = new mongoose.Schema({
    titulo: { type: String, required: false },
    conteudo: { type: String, required: false }
});

const DescricaoSchema = new mongoose.Schema({
    titulo: { type: String, required: false },
    conteudo: { type: String, required: false }
});

const RespostasSalvasSchema = new mongoose.Schema({
    id: { type: Number, required: false },
    resposta: { type: String, required: false },
    resultado: { type: String, required: false }
});

const AtividadeEmAndamentoSchema = new mongoose.Schema({
    id: { type: Number, required: false },
    idDaAtividade: { type: Number, required: false },
    respostasSalvas: [{ type: RespostasSalvasSchema, required: false }],
    pontuacaoSalva: { type: Number, required: false },
    dataInicio: { type: String, required: false }
});

const AtividadeFinalizadaSchema = new mongoose.Schema({
    idAtividade: { type: String, required: false },
    dataInicio: { type: String, required: false },
    dataFinalizada: { type: String, required: false },
    pontuacao: { type: Number, required: false }
});

const QuestaoSchema = new mongoose.Schema({
    resposta: { type: String, required: false },
    resultado: { type: Boolean, required: false }
});

const ExerciciosSchema = new mongoose.Schema({
    enunciado: { type: String, required: false },
    questoes: [{ type: QuestaoSchema, required: false }] // Nota que coloquei colchetes aqui
});

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    nome: { type: String, required: true },
    telefone: { type: Number, required: true },
    dataDeNascimento: { type: String, required: true },
    senha: { type: String, required: true },
    tipoDeConta: { type: String, required: true },
    profissional: { type: [String], required: true },
    foto: { type: String, required: true },
    acesso: { type: [String], required: false },
    diagnostico: [{ type: DiagnosticoSchema, required: false }],
    descricao: [{ type: DescricaoSchema, required: false }],
    atividadeEmAndamento: { type: AtividadeEmAndamentoSchema, required: false }, // Modificação feita aqui
    atividadeFinalizada: [{ type: AtividadeFinalizadaSchema, required: false }],
    pacientes: { type: [String], required: false },
    atividadesCriadas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AtividadeCriada', required: false }]
});

const AtividadeCriadasSchema = new mongoose.Schema({
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Usando referência e tornando obrigatório
    grupo: { type: [String], required: false },
    titulo: { type: String, required: false },
    descricao: { type: String, required: false },
    icone: { type: String, required: false },
    exercicios: [{ type: ExerciciosSchema, required: false }]
});

// Modelos
const User = mongoose.model('User', UserSchema);
const AtividadeCriada = mongoose.model('AtividadeCriada', AtividadeCriadasSchema);

module.exports = { User, AtividadeCriada };
