CREATE TABLE IF NOT EXISTS turmas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    serie VARCHAR(50),
    ano INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    matricula VARCHAR(50),
    turma_id INTEGER NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS disciplinas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conteudos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    disciplina_id INTEGER NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS habilidades (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50),
    descricao TEXT NOT NULL,
    conteudo_id INTEGER NOT NULL REFERENCES conteudos(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS avaliacoes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    data_aplicacao DATE NOT NULL,
    turma_id INTEGER NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
    disciplina_id INTEGER NOT NULL REFERENCES disciplinas(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questoes (
    id SERIAL PRIMARY KEY,
    numero INTEGER NOT NULL,
    valor NUMERIC(8,2) NOT NULL DEFAULT 1,
    avaliacao_id INTEGER NOT NULL REFERENCES avaliacoes(id) ON DELETE CASCADE,
    conteudo_id INTEGER NOT NULL REFERENCES conteudos(id) ON DELETE CASCADE,
    habilidade_id INTEGER REFERENCES habilidades(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resultados (
    id SERIAL PRIMARY KEY,
    aluno_id INTEGER NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
    questao_id INTEGER NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
    acertou BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(aluno_id, questao_id)
);

CREATE INDEX IF NOT EXISTS idx_alunos_turma ON alunos(turma_id);
CREATE INDEX IF NOT EXISTS idx_conteudos_disciplina ON conteudos(disciplina_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_turma ON avaliacoes(turma_id);
CREATE INDEX IF NOT EXISTS idx_questoes_avaliacao ON questoes(avaliacao_id);
CREATE INDEX IF NOT EXISTS idx_resultados_aluno ON resultados(aluno_id);
