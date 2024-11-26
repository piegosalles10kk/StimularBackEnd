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
        tipoDeMidia: { type: String, required: true },
        url: { type: String, required: true }
    },
    enunciado: { type: String, required: true },
    exercicio: { type: String, required: false },
    alternativas: [{ type: AlternativasSchema, required: true }],
    pontuacao: { type: Number, required: true }
});

// Esquema para Atividades
const AtividadesSchema = new mongoose.Schema({
    nomdeDaAtividade: { type: String, required: true },
    fotoDaAtividade: { type: String, required: false },
    tipoDeAtividade: { type: String, required: true },
    exercicios: [ExerciciosSchema],
    pontuacaoTotalAtividade: { type: Number, required: true }
});

// Esquema para Grupo de Atividades
const GrupoAtividadesSchema = new mongoose.Schema({
    nomeGrupo: { type: String, required: true },
    imagem: { type: String, required: true },
    nivelDaAtividade: { type: Number, required: true },
    descricao: { type: String, required: true },
    criador: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        nome: { type: String, required: true }
    },
    dominio: [{ type: String, required: true }],
    atividades: [AtividadesSchema],
    pontuacaoTotalDoGrupo: { type: Number, required: true }
});

// Esquema para Respostas
const respostasSalvasSchema = new mongoose.Schema({
    exercicioId: { type: mongoose.Schema.Types.ObjectId, required: true },
    atividade_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    isCorreta: { type: Boolean, required: true },
    pontuacao: { type: Number, required: true }
});

// Esquema para Grupos de Atividades Em Andamento
const GruposDeAtividadesEmAndamentoSchema = new mongoose.Schema({
    grupoAtividadesId: { type: mongoose.Schema.Types.ObjectId, ref: 'GrupoAtividades', required: true },
    dataInicio: { type: Date, required: true },
    pontuacaoPossivel: { type: Number, required: true },
    respostas: [respostasSalvasSchema]
});

// Esquema para Grupos de Atividades Finalizadas
const GruposDeAtividadesFinalizadasSchema = new mongoose.Schema({
    grupoAtividadesId: { type: mongoose.Schema.Types.ObjectId, ref: 'GrupoAtividades', required: true },
    dataInicio: { type: Date, required: true },
    dataFinalizada: { type: Date, required: true },
    respostasFinais: [
        {
            exercicioId: { type: mongoose.Schema.Types.ObjectId, required: true },
            isCorreta: { type: Boolean, required: true },
            pontuacao: { type: Number, required: true },
        }
    ],
    pontuacaoPossivel: { type: Number, required: true },
    pontuacaoFinal: { type: Number, required: true },
    porcentagem: { type: Number, required: true }
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
    idDoProfissional: { type: String, required: true },
    nome: { type: String, required: true } // Adicionado o nome do profissional
});
// Esquema para Pacientes
const PacientesSchema = new mongoose.Schema({
    idDoPaciente: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nome: { type: String, required: true } // Adicionado o nome do paciente
});
// Esquema para Conquistas
const ConquistasSchema = new mongoose.Schema({
    idDaConquista: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    nome: { type: String, required: false },
    imagem: { type: String, required: false },
    descricao: { type: String, required: false },
});

// Esquema para Usuários
const UserSchema = new mongoose.Schema({
    tipoDeConta: { type: String, required: true },
    conquistas: [ConquistasSchema],
    validade: { type: String, required: false },
    moeda: { 
        valor: { type: String, required: false },
        dataDeCriacao : { type: String, required: false }
     },
    nivel: { type: Number, required: false },
    nome: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },
    dataDeNascimento: { type: String, required: true },
    senha: { type: String, required: true },
    recuperarSenha: { type: String, required: false },
    foto: { type: String, required: true },
    profissional: [ProfissionalSchema],
    diagnostico: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Diagnostico' }],
    grupo: [{ type: String, required: false }],
    gruposDeAtividadesEmAndamento: [GruposDeAtividadesEmAndamentoSchema],
    gruposDeAtividadesFinalizadas: [GruposDeAtividadesFinalizadasSchema],
    descricao: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Descricao' }],
    pacientes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pacientes' }],
    gruposDeAtividadesCriadas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GrupoAtividades', required: false }],
    recupararSenha: { type: Boolean, required: false },
    codigoRecuperarSenha: { type: String, required: false }
});

// Modelos
const User = mongoose.model('User', UserSchema);
const GrupoAtividades = mongoose.model('GrupoAtividades', GrupoAtividadesSchema);
const GruposDeAtividadesEmAndamento = mongoose.model('GruposDeAtividadesEmAndamento', GruposDeAtividadesEmAndamentoSchema);
const GruposDeAtividadesFinalizadas = mongoose.model('GruposDeAtividadesFinalizadas', GruposDeAtividadesFinalizadasSchema);
const Atividades = mongoose.model('Atividades', AtividadesSchema);
const Exercicios = mongoose.model('Exercicios', ExerciciosSchema);
const Alternativas = mongoose.model('Alternativas', AlternativasSchema);
const Conquistas = mongoose.model('Conquistas', ConquistasSchema);
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
    Conquistas,
    Profissional,
    Pacientes,
    Alternativas
};
