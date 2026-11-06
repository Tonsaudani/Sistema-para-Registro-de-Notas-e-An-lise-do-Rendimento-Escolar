import { useEffect, useState } from "react";
import {
  getHealth,
  getTurmas,
  createTurma,
  updateTurma,
  deleteTurma
} from "./services/api.js";

const formularioInicial = { nome: "", serie: "", ano: String(new Date().getFullYear()) };

function App() {
  const [apiStatus, setApiStatus] = useState("verificando...");
  const [turmas, setTurmas] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [turmaEmEdicao, setTurmaEmEdicao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function carregarTurmas() {
    setCarregando(true);
    try {
      const dados = await getTurmas();
      setTurmas(dados);
      setApiStatus("conectada");
      setErro("");
    } catch (error) {
      setApiStatus("indisponível");
      setErro(error.message || "Não foi possível carregar as turmas.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    getHealth()
      .then(() => setApiStatus("conectada"))
      .catch(() => setApiStatus("indisponível"));
    carregarTurmas();
  }, []);

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  function iniciarEdicao(turma) {
    setTurmaEmEdicao(turma.id);
    setFormulario({
      nome: turma.nome,
      serie: turma.serie || "",
      ano: String(turma.ano)
    });
    setMensagem("");
    setErro("");
    document.getElementById("nome-turma")?.focus();
  }

  function cancelarEdicao() {
    setTurmaEmEdicao(null);
    setFormulario(formularioInicial);
    setErro("");
  }

  async function salvarTurma(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");

    if (!formulario.nome.trim()) {
      setErro("Informe o nome da turma.");
      return;
    }

    setSalvando(true);
    const dados = {
      nome: formulario.nome.trim(),
      serie: formulario.serie.trim(),
      ano: Number(formulario.ano)
    };

    try {
      if (turmaEmEdicao) {
        await updateTurma(turmaEmEdicao, dados);
        setMensagem("Turma atualizada com sucesso.");
      } else {
        await createTurma(dados);
        setMensagem("Turma cadastrada com sucesso.");
      }
      cancelarEdicao();
      await carregarTurmas();
    } catch (error) {
      setErro(error.message || "Não foi possível salvar a turma.");
    } finally {
      setSalvando(false);
    }
  }

  async function removerTurma(turma) {
    const confirmou = window.confirm(
      `Deseja realmente excluir a turma "${turma.nome}"? Alunos vinculados também serão excluídos.`
    );
    if (!confirmou) return;

    setErro("");
    setMensagem("");
    try {
      await deleteTurma(turma.id);
      if (turmaEmEdicao === turma.id) cancelarEdicao();
      setMensagem("Turma excluída com sucesso.");
      await carregarTurmas();
    } catch (error) {
      setErro(error.message || "Não foi possível excluir a turma.");
    }
  }

  return (
    <main className="container">
      <header className="header">
        <div>
          <p className="eyebrow">PROJETO INTEGRADOR</p>
          <h1>Sistema de Desempenho Escolar</h1>
          <p>Registro, acompanhamento e análise do rendimento dos estudantes.</p>
        </div>
        <div className="status" role="status" aria-live="polite">
          API: <strong>{apiStatus}</strong>
        </div>
      </header>

      <section className="cards" aria-label="Resumo do sistema">
        <article className="card"><span>Turmas cadastradas</span><strong>{turmas.length}</strong></article>
        <article className="card"><span>Alunos</span><strong>—</strong></article>
        <article className="card"><span>Aproveitamento</span><strong>—</strong></article>
      </section>

      <section className="panel" aria-labelledby="titulo-gerenciar-turmas">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CADASTROS</p>
            <h2 id="titulo-gerenciar-turmas">Gerenciamento de turmas</h2>
            <p className="muted">Cadastre e mantenha as turmas que serão utilizadas nos registros escolares.</p>
          </div>
        </div>

        {mensagem && <p className="notice success" role="status">{mensagem}</p>}
        {erro && <p className="notice error" role="alert">{erro}</p>}

        <form className="turma-form" onSubmit={salvarTurma}>
          <div className="field">
            <label htmlFor="nome-turma">Nome da turma *</label>
            <input id="nome-turma" name="nome" value={formulario.nome} onChange={atualizarCampo} placeholder="Ex.: 6º Ano A" maxLength={100} required />
          </div>
          <div className="field">
            <label htmlFor="serie-turma">Série / etapa</label>
            <input id="serie-turma" name="serie" value={formulario.serie} onChange={atualizarCampo} placeholder="Ex.: Ensino Fundamental II" maxLength={50} />
          </div>
          <div className="field year-field">
            <label htmlFor="ano-turma">Ano letivo *</label>
            <input id="ano-turma" name="ano" type="number" min="2000" max="2100" value={formulario.ano} onChange={atualizarCampo} required />
          </div>
          <div className="form-actions">
            <button type="submit" disabled={salvando}>{salvando ? "Salvando..." : turmaEmEdicao ? "Salvar alterações" : "Cadastrar turma"}</button>
            {turmaEmEdicao && <button type="button" className="button-secondary" onClick={cancelarEdicao}>Cancelar</button>}
          </div>
        </form>

        <div className="table-heading">
          <h3>Turmas cadastradas</h3>
          <button type="button" className="button-secondary refresh-button" onClick={carregarTurmas} disabled={carregando}>
            {carregando ? "Atualizando..." : "Atualizar lista"}
          </button>
        </div>

        {carregando ? (
          <p className="muted">Carregando turmas...</p>
        ) : turmas.length === 0 ? (
          <p className="empty-state">Nenhuma turma cadastrada até o momento.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th scope="col">Turma</th><th scope="col">Série / etapa</th><th scope="col">Ano</th><th scope="col">Ações</th></tr>
              </thead>
              <tbody>
                {turmas.map((turma) => (
                  <tr key={turma.id}>
                    <td data-label="Turma">{turma.nome}</td>
                    <td data-label="Série / etapa">{turma.serie || "—"}</td>
                    <td data-label="Ano">{turma.ano}</td>
                    <td data-label="Ações">
                      <div className="row-actions">
                        <button type="button" className="button-small button-secondary" onClick={() => iniciarEdicao(turma)} aria-label={`Editar ${turma.nome}`}>Editar</button>
                        <button type="button" className="button-small button-danger" onClick={() => removerTurma(turma)} aria-label={`Excluir ${turma.nome}`}>Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <footer className="footer">Sistema de Desempenho Escolar · Projeto Integrador</footer>
    </main>
  );
}

export default App;
