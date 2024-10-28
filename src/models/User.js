const mongoose = require('mongoose');

const AlternativasSchema = new mongoose.Schema({
    alternativa: { type: String, required: true },
    resultadoAlternativa: { type: Boolean, required: true }
});

const ExerciciosSchema = new mongoose.Schema({
    exercicioId: { type: mongoose.Schema.Types.ObjectId, required: true, default: () => new mongoose.Types.ObjectId() }, // ID único para cada exercício
    midia: { type: String, required: true },
    enunciado: { type: String, required: true },
    exercicio: { type: String, required: false },
    alternativas: [{ type: AlternativasSchema, required: true }],
    pontuacao: { type: Number, required: true }
});

const AtividadesSchema = new mongoose.Schema({
    fotoDaAtividade: { type: String, required: false },
    tipoDeAtividade: { type: String, required: true },
    exercicios: [ExerciciosSchema], // Array de exercícios
    pontuacaoTotalAtividade: { type: Number, required: true }
});

const GrupoAtividadesSchema = new mongoose.Schema({
    numeroAtividade: { type: Number, required: true },
    criador: { 
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        nome: { type: String, required: true }
    },
    dominio: [{ type: String, required: true }],
    atividades: [AtividadesSchema], // Salvando os objetos completos das atividades
    pontuacaoTotalDoGrupo: { type: Number, required: true }
});

// Esquema para Grupos de Atividades em Andamento
const GruposDeAtividadesEmAndamentoSchema = new mongoose.Schema({
    grupoAtividadesId: { type: mongoose.Schema.Types.ObjectId, ref: 'GrupoAtividades', required: true },
    dataInicio: { type: Date, required: true },
    respostas: [
        {
            exercicioId: { type: mongoose.Schema.Types.ObjectId, required: true },
            isCorreta: { type: Boolean, required: true }
        }
    ]
});

// Esquema para Grupos de Atividades Finalizadas
const GruposDeAtividadesFinalizadasSchema = new mongoose.Schema({
    grupoAtividadesId: { type: mongoose.Schema.Types.ObjectId, ref: 'GrupoAtividades', required: true },
    dataInicio: { type: Date, required: true },
    dataFinalizada: { type: Date, required: true },
    respostasFinais: { type: Number, required: true },
    pontuacaoFinal: { type: Number, required: true }
});

// Esquema para Diagnóstico
const DiagnosticoSchema = new mongoose.Schema({
    titulo: { type: String, required: false },
    conteudo: { type: String, required: false }
});

// Esquema para Descrição
const DescricaoSchema = new mongoose.Schema({
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nomeAutor: { type: String, required: true }, // Adicionado o nome do autor
    comentario: { type: String, required: true }
});

// Esquema para Profissional
const ProfissionalSchema = new mongoose.Schema({
    idDoProfissional: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nome: { type: String, required: true } // Adicionado o nome do profissional
});

// Esquema para Pacientes
const PacientesSchema = new mongoose.Schema({
    idDoPaciente: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nome: { type: String, required: true } // Adicionado o nome do paciente
});

// Esquema para Usuários
const UserSchema = new mongoose.Schema({
    tipoDeConta: { type: String, required: true },
    conquistas: [{ type: String, required: false }],
    validade: { type: String, required: false },
    moeda: { type: Number, required: false },
    nivel: { type: Number, required: false },
    nome: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },
    dataDeNascimento: { type: String, required: true },
    senha: { type: String, required: true },
    recuperarSenha: { type: String, required: false },
    foto: { type: String, required: false },
    profissional: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profissional', required: false }],
    diagnostico: { type: mongoose.Schema.Types.ObjectId, ref: 'Diagnostico', required: false },
    grupo: [{ type: String, required: false }],
    gruposDeAtividadesEmAndamento: [GruposDeAtividadesEmAndamentoSchema],
    gruposDeAtividadesFinalizadas: [GruposDeAtividadesFinalizadasSchema],
    descricao: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Descricao', required: false }],
    pacientes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pacientes', required: false }],
    gruposDeAtividadesCriadas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GrupoAtividades', required: false }],
    pontuacoesPorGrupo: [
        {
            grupoId: { type: mongoose.Schema.Types.ObjectId, ref: 'GrupoAtividades', required: false },
            pontuacao: { type: Number, required: false }
        }
    ]
});

// Modelos
const User = mongoose.model('User', UserSchema);
const GrupoAtividades = mongoose.model('GrupoAtividades', GrupoAtividadesSchema);
const GruposDeAtividadesEmAndamento = mongoose.model('GruposDeAtividadesEmAndamento', GruposDeAtividadesEmAndamentoSchema);
const GruposDeAtividadesFinalizadas = mongoose.model('GruposDeAtividadesFinalizadas', GruposDeAtividadesFinalizadasSchema);
const Atividades = mongoose.model('Atividades', AtividadesSchema);
const Exercicios = mongoose.model('Exercicios', ExerciciosSchema);
const Alternativas = mongoose.model('Alternativas', AlternativasSchema);
const Profissional = mongoose.model('Profissional', ProfissionalSchema);
const Pacientes = mongoose.model('Pacientes', PacientesSchema);

// Exportação dos Modelos
module.exports = {
    User,
    GrupoAtividades,
    GruposDeAtividadesEmAndamento,
    GruposDeAtividadesFinalizadas,
    Atividades,
    Exercicios,
    Alternativas,
    Profissional,
    Pacientes
};
