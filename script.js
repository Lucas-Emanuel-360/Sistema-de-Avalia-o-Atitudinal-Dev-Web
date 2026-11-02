// Apenas navegação e simulação de interações. O HTML contém as telas e seus textos.
const $ = (seletor) => document.querySelector(seletor);
const $$ = (seletor) => [...document.querySelectorAll(seletor)];
const nomes = { ana: "Ana Clara", gabriel: "Gabriel", mariana: "Mariana" };
const dadosIniciais = {
  registros: [
    {
      aluno: "ana",
      dimensao: "Colaboração",
      tipo: "Potencialidade",
      descricao: "Apoiou colegas na atividade coletiva.",
    },
    {
      aluno: "gabriel",
      dimensao: "Autonomia",
      tipo: "Necessita de apoio",
      descricao: "Precisou de orientação para iniciar uma atividade.",
    },
    {
      aluno: "mariana",
      dimensao: "Participação",
      tipo: "Potencialidade",
      descricao: "Compartilhou ideias durante uma discussão.",
    },
  ],
  devolutivas: [],
  autoavaliacoes: [],
  dialogos: [],
  intervencoes: [],
};
const chave = "avaliacao-atitudinal-prototipo";
let dados;
try {
  dados = {
    ...structuredClone(dadosIniciais),
    ...JSON.parse(localStorage.getItem(chave) || "{}"),
  };
} catch {
  dados = structuredClone(dadosIniciais);
}
let perfil = "professor";
let pagina = "prof-inicio";
let registro = { aluno: null, dimensao: null };
const menus = {
  professor: [
    "prof-inicio",
    "prof-registro",
    "prof-historico",
    "prof-devolutiva",
  ],
  gestao: [
    "gestao-inicio",
    "gestao-alertas",
    "gestao-turmas",
    "gestao-intervencoes",
    "gestao-clima",
  ],
  estudante: ["est-inicio", "est-auto", "est-historico", "est-dialogo"],
  responsavel: [
    "resp-inicio",
    "resp-historico",
    "resp-devolutivas",
    "resp-dialogo",
  ],
};
const texto = (valor) =>
  String(valor ?? "").replace(
    /[&<>"']/g,
    (caractere) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        caractere
      ],
  );
function salvar() {
  localStorage.setItem(chave, JSON.stringify(dados));
  atualizar();
}
function aviso(mensagem) {
  $("#toast").textContent = mensagem;
  $("#toast").classList.add("show");
  setTimeout(() => $("#toast").classList.remove("show"), 2700);
}
function navegar(destino) {
  if (!menus[perfil].includes(destino)) return;
  pagina = destino;
  $$(".pagina").forEach((p) => p.classList.toggle("active", p.id === pagina));
  montarMenu();
  window.scrollTo(0, 0);
  atualizar();
}
function montarMenu() {
  $("#menu").innerHTML = menus[perfil]
    .map((id) => {
      const p = document.getElementById(id);
      return `<button class="${id === pagina ? "active" : ""}" data-go="${id}">${texto(p.dataset.title)}</button>`;
    })
    .join("");
}
function trocarPerfil(novo) {
  perfil = novo;
  navegar(menus[perfil][0]);
}
function selecionar(botao, grupo) {
  $$(grupo + " button").forEach((b) =>
    b.classList.toggle("selected", b === botao),
  );
}
function itens(lista, formatar) {
  return lista.length
    ? lista.map(formatar).join("")
    : '<p class="helper">Nenhum registro nesta demonstração.</p>';
}
function evidencia(r) {
  return `<div class="item"><h3>${texto(nomes[r.aluno])} · ${texto(r.dimensao)}</h3><small>${texto(r.tipo)}</small><p>${texto(r.descricao || "Registro sem descrição adicional.")}</p></div>`;
}
function atualizar() {
  $("#contador-registros").textContent = dados.registros.length;
  $("#recentes").innerHTML = itens(
    [...dados.registros].slice(-3).reverse(),
    evidencia,
  );
  $("#historico-prof").innerHTML = itens(
    dados.registros
      .filter(
        (r) =>
          $("#filtro-historico").value === "todos" ||
          r.aluno === $("#filtro-historico").value,
      )
      .reverse(),
    evidencia,
  );
  $("#historico-est").innerHTML = itens(
    dados.registros.filter((r) => r.aluno === "ana"),
    evidencia,
  );
  $("#historico-resp").innerHTML = itens(
    dados.registros.filter((r) => r.aluno === "ana"),
    evidencia,
  );
  const dimensao = $("#f-dimensao").value,
    aluno = $("#f-aluno").value;
  $("#resultado-filtros").innerHTML = itens(
    dados.registros.filter(
      (r) =>
        (dimensao === "todas" || r.dimensao === dimensao) &&
        (aluno === "todos" || r.aluno === aluno),
    ),
    evidencia,
  );
  $("#lista-devolutivas").innerHTML = itens(
    dados.devolutivas,
    (r) =>
      `<div class="item"><h3>${texto(nomes[r.aluno])}</h3><p>${texto(r.texto)}</p></div>`,
  );
  $("#devolutivas-resp").innerHTML = itens(
    dados.devolutivas.filter((r) => r.aluno === "ana"),
    (r) => `<div class="item"><p>${texto(r.texto)}</p></div>`,
  );
  $("#lista-auto").innerHTML = itens(
    dados.autoavaliacoes,
    (r) =>
      `<div class="item"><h3>${texto(r.dimensao)} · ${texto(r.nivel)}</h3><p>${texto(r.texto)}</p></div>`,
  );
  $("#lista-intervencoes").innerHTML = itens(
    dados.intervencoes,
    (r) =>
      `<div class="item"><h3>${texto(r.titulo)}</h3><p>${texto(r.descricao)}</p></div>`,
  );
  ["est", "resp"].forEach(
    (origem) =>
      ($("#dialogos-" + origem).innerHTML = itens(
        dados.dialogos.filter((r) => r.origem === origem),
        (r) =>
          `<div class="item"><h3>Solicitação recebida · Em análise</h3><p>${texto(r.mensagem)}</p></div>`,
      )),
  );
}
document.addEventListener("click", (event) => {
  const botao = event.target.closest("button");
  if (!botao) return;
  if (botao.dataset.go) navegar(botao.dataset.go);
  if (botao.dataset.aluno) {
    registro.aluno = botao.dataset.aluno;
    selecionar(botao, "#alunos-registro");
  }
  if (botao.dataset.dim) {
    registro.dimensao = botao.dataset.dim;
    selecionar(botao, "#dimensoes-registro");
  }
  if (botao.dataset.tipo) {
    if (!registro.aluno || !registro.dimensao) {
      aviso("Escolha primeiro o estudante e a dimensão.");
      return;
    }
    dados.registros.push({
      aluno: registro.aluno,
      dimensao: registro.dimensao,
      tipo: botao.dataset.tipo,
      descricao: "",
    });
    salvar();
    registro = { aluno: null, dimensao: null };
    $$(".choices button").forEach((b) => b.classList.remove("selected"));
    aviso("Registro demonstrativo salvo.");
    navegar("prof-historico");
  }
});
$("#perfil").addEventListener("change", (event) =>
  trocarPerfil(event.target.value),
);
["#filtro-historico", "#f-aluno", "#f-dimensao"].forEach((id) =>
  $(id).addEventListener("change", atualizar),
);
function formulario(id, executar) {
  $(id).addEventListener("submit", (evento) => {
    evento.preventDefault();
    executar(evento.target);
    salvar();
    evento.target.reset();
    aviso("Informação registrada nesta demonstração.");
  });
}
formulario("#form-devolutiva", () =>
  dados.devolutivas.push({
    aluno: $("#dev-aluno").value,
    texto: $("#dev-texto").value.trim(),
  }),
);
formulario("#form-auto", () =>
  dados.autoavaliacoes.push({
    dimensao: $("#auto-dim").value,
    nivel: $("#auto-nivel").value,
    texto: $("#auto-texto").value.trim(),
  }),
);
formulario("#form-intervencao", () =>
  dados.intervencoes.push({
    titulo: $("#intervencao-titulo").value.trim(),
    descricao: $("#intervencao-descricao").value.trim(),
  }),
);
["est", "resp"].forEach((origem) =>
  formulario("#form-dialogo-" + origem, (form) =>
    dados.dialogos.push({
      origem,
      mensagem: form.elements.mensagem.value.trim(),
    }),
  ),
);
trocarPerfil("professor");
