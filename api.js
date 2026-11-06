const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  if (!response.ok) {
    let message = `Erro HTTP ${response.status}`;
    try {
      const data = await response.json();
      if (data.error) message = data.error;
    } catch {
      // Algumas respostas, como HTTP 204, não possuem corpo JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function getHealth() {
  return request("/health");
}

export function getTurmas() {
  return request("/turmas");
}

export function createTurma(turma) {
  return request("/turmas", { method: "POST", body: JSON.stringify(turma) });
}

export function updateTurma(id, turma) {
  return request(`/turmas/${id}`, { method: "PUT", body: JSON.stringify(turma) });
}

export function deleteTurma(id) {
  return request(`/turmas/${id}`, { method: "DELETE" });
}
