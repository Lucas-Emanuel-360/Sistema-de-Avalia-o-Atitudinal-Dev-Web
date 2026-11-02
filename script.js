// Apenas navegação e simulação de interações. O HTML contém as telas e seus textos.
const $ = seletor => document.querySelector(seletor);
const $$ = seletor => [...document.querySelectorAll(seletor)];
const nomes = { ana: 'Ana Clara', gabriel: 'Gabriel', mariana: 'Mariana', bruna: 'Bruna', pedro: 'Pedro' };
const dadosIniciais = {
  registros: [
    { aluno:'ana', turma:'7º A', data:'2026-10-14', dimensao:'Colaboração', tipo:'Potencialidade', descricao:'Apoiou colegas na atividade coletiva.' },
    { aluno:'gabriel', turma:'7º A', data:'2026-10-22', dimensao:'Autonomia', tipo:'Necessita de apoio', descricao:'Precisou de orientação para iniciar uma atividade.' },
    { aluno:'mariana', turma:'7º A', data:'2026-11-02', dimensao:'Participação', tipo:'Potencialidade', descricao:'Compartilhou ideias durante uma discussão.' },
    { aluno:'bruna', turma:'1º A', data:'2026-10-18', dimensao:'Responsabilidade', tipo:'Potencialidade', descricao:'Organizou materiais coletivos.' },
    { aluno:'pedro', turma:'1º A', data:'2026-11-01', dimensao:'Colaboração', tipo:'Contexto', descricao:'Participou de uma atividade em grupo.' }
  ], devolutivas:[], autoavaliacoes:[], dialogos:[], intervencoes:[]
};
const chave = 'avaliacao-atitudinal-prototipo-v2';
let dados;
try { dados = { ...structuredClone(dadosIniciais), ...JSON.parse(localStorage.getItem(chave) || '{}') }; }
catch { dados = structuredClone(dadosIniciais); }
let perfil = 'professor';
let pagina = 'prof-inicio';
let registro = { aluno: null, dimensao: null };
let indiceContexto=null;
const menus = {
  professor: ['prof-inicio','prof-registro','prof-historico','prof-devolutiva'],
  gestao: ['gestao-inicio','gestao-alertas','gestao-turmas','gestao-intervencoes','gestao-clima','gestao-dialogos'],
  estudante: ['est-inicio','est-auto','est-historico','est-dialogo'],
  responsavel: ['resp-inicio','resp-historico','resp-devolutivas','resp-dialogo']
};
const texto = valor => String(valor ?? '').replace(/[&<>"']/g, caractere => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[caractere]));
function salvar() { localStorage.setItem(chave, JSON.stringify(dados)); atualizar(); }
function aviso(mensagem) { $('#toast').textContent = mensagem; $('#toast').classList.add('show'); setTimeout(()=>$('#toast').classList.remove('show'), 2700); }
function navegar(destino) { if(!menus[perfil].includes(destino)) return; pagina=destino; $$('.pagina').forEach(p=>p.classList.toggle('active',p.id===pagina)); montarMenu(); window.scrollTo(0,0); atualizar(); }
function montarMenu() { $('#menu').innerHTML=menus[perfil].map(id=>{const p=document.getElementById(id);return `<button class="${id===pagina?'active':''}" data-go="${id}">${texto(p.dataset.title)}</button>`;}).join(''); }
function trocarPerfil(novo) { perfil=novo; navegar(menus[perfil][0]); }
function selecionar(botao,grupo) { $$(grupo+' button').forEach(b=>b.classList.toggle('selected',b===botao)); }
function itens(lista,formatar) { return lista.length?lista.map(formatar).join(''):'<p class="helper">Nenhum registro nesta demonstração.</p>'; }
function evidencia(r, editar=false) { const i=dados.registros.indexOf(r); return `<div class="item"><h3>${texto(nomes[r.aluno])} · ${texto(r.dimensao)}</h3><small>${texto(r.turma||turmaAluno(r.aluno))} · ${texto(r.data||'Sem data')} · ${texto(r.tipo)}</small><p>${texto(r.descricao||'Registro sem descrição adicional.')}</p>${editar?`<button data-editar-contexto="${i}">Adicionar contexto</button>`:''}</div>`; }
function turmaAluno(id) {return ['bruna','pedro'].includes(id)?'1º A':'7º A';}
function barras(id, itens) { const el=$(id); if(!el)return;const max=Math.max(1,...itens.map(i=>i[1]));el.innerHTML=itens.length?itens.map(([nome,valor])=>`<div><span>${texto(nome)}</span><i style="--w:${Math.max(2,100*valor/max)}%"></i><small>${valor}</small></div>`).join(''):'<p class="helper">Sem registros para este filtro.</p>';}
function agrupar(registros, campo) {let m=new Map();registros.forEach(r=>m.set(campo(r),(m.get(campo(r))||0)+1));return [...m.entries()].sort((a,b)=>a[0].localeCompare(b[0],'pt-BR'));}
function mostrarDialogo(r) {let i=dados.dialogos.indexOf(r);return `<div class="item"><h3>${r.origem==='est'?'Estudante':'Responsável'} · ${texto(r.status||'Em análise')}</h3><p>${texto(r.mensagem)}</p>${r.resposta?`<p><strong>Resposta da escola:</strong> ${texto(r.resposta)}</p>`:''}${perfil==='gestao'?`<form class="form form-resposta" data-indice="${i}"><label>Resposta ou encaminhamento<textarea name="resposta" required>${texto(r.resposta||'')}</textarea></label><label>Situação<select name="status"><option ${r.status==='Em análise'?'selected':''}>Em análise</option><option ${r.status==='Respondida'?'selected':''}>Respondida</option><option ${r.status==='Concluída'?'selected':''}>Concluída</option></select></label><button class="primary">Salvar resposta</button></form>`:''}</div>`;}

function atualizar() {
  $('#contador-registros').textContent=dados.registros.length;
  $('#recentes').innerHTML=itens([...dados.registros].slice(-3).reverse(),r=>evidencia(r,true));
  $('#historico-prof').innerHTML=itens(dados.registros.filter(r=>$('#filtro-historico').value==='todos'||r.aluno===$('#filtro-historico').value).reverse(),evidencia);
  $('#historico-est').innerHTML=itens(dados.registros.filter(r=>r.aluno==='ana'),evidencia);
  $('#historico-resp').innerHTML=itens(dados.registros.filter(r=>r.aluno==='ana'),evidencia);
  const dimensao=$('#f-dimensao').value,aluno=$('#f-aluno').value,turma=$('#f-turma').value;
  $('#resultado-filtros').innerHTML=itens(dados.registros.filter(r=>(turma==='todas'||(r.turma||turmaAluno(r.aluno))===turma)&&(dimensao==='todas'||r.dimensao===dimensao)&&(aluno==='todos'||r.aluno===aluno)),evidencia);
  const filtrados=dados.registros.filter(r=>(turma==='todas'||(r.turma||turmaAluno(r.aluno))===turma)&&(dimensao==='todas'||r.dimensao===dimensao)&&(aluno==='todos'||r.aluno===aluno));
  barras('#grafico-gestao',agrupar(dados.registros,r=>r.dimensao));
  barras('#grafico-filtrado',agrupar(filtrados,r=>r.dimensao));
  barras('#grafico-evolucao',agrupar(filtrados,r=>(r.data||'2026-11-02').slice(0,7)));
  $('#lista-devolutivas').innerHTML=itens(dados.devolutivas,r=>`<div class="item"><h3>${texto(nomes[r.aluno])}</h3><p>${texto(r.texto)}</p></div>`);
  ['#devolutivas-est','#devolutivas-est-historico'].forEach(id=>$(id).innerHTML=itens(dados.devolutivas.filter(r=>r.aluno==='ana'),r=>`<div class="item"><p>${texto(r.texto)}</p></div>`));
  $('#devolutivas-resp').innerHTML=itens(dados.devolutivas.filter(r=>r.aluno==='ana'),r=>`<div class="item"><p>${texto(r.texto)}</p></div>`);
  $('#lista-auto').innerHTML=itens(dados.autoavaliacoes,r=>`<div class="item"><h3>${texto(r.dimensao)} · ${texto(r.nivel)}</h3><p>${texto(r.texto)}</p></div>`);
  $('#lista-intervencoes').innerHTML=itens(dados.intervencoes,r=>`<div class="item"><h3>${texto(r.titulo)}</h3><p>${texto(r.descricao)}</p></div>`);
  ['est','resp'].forEach(origem=>$('#dialogos-'+origem).innerHTML=itens(dados.dialogos.filter(r=>r.origem===origem),mostrarDialogo));
  $('#dialogos-gestao').innerHTML=itens(dados.dialogos,mostrarDialogo);
}
document.addEventListener('click',event=>{
  const botao=event.target.closest('button');if(!botao)return;
  if(botao.dataset.go) navegar(botao.dataset.go);
  if(botao.dataset.aluno){ registro.aluno=botao.dataset.aluno;selecionar(botao,'#alunos-registro'); }
  if(botao.dataset.dim){ registro.dimensao=botao.dataset.dim;selecionar(botao,'#dimensoes-registro'); }
  if(botao.dataset.editarContexto !== undefined) {
    indiceContexto=Number(botao.dataset.editarContexto);
    const r=dados.registros[indiceContexto];
    if(!r)return;
    $('#contexto-identificacao').textContent=`${nomes[r.aluno]} · ${r.dimensao}`;
    $('#contexto-texto').value=r.descricao||'';
    $('#form-contexto').hidden=false;
    $('#form-contexto').scrollIntoView({behavior:'smooth',block:'center'});
  }
  if(botao.id==='cancelar-contexto'){$('#form-contexto').hidden=true;indiceContexto=null;}
  if(botao.dataset.tipo){
    if(!registro.aluno||!registro.dimensao){aviso('Escolha primeiro o estudante e a dimensão.');return;}
    dados.registros.push({aluno:registro.aluno,turma:turmaAluno(registro.aluno),data:new Date().toISOString().slice(0,10),dimensao:registro.dimensao,tipo:botao.dataset.tipo,descricao:''});
    salvar(); registro={aluno:null,dimensao:null};$$('.choices button').forEach(b=>b.classList.remove('selected'));
    aviso('Registro demonstrativo salvo.'); navegar('prof-historico');
  }
});
$('#perfil').addEventListener('change',event=>trocarPerfil(event.target.value));
['#filtro-historico','#f-turma','#f-aluno','#f-dimensao'].forEach(id=>$(id).addEventListener('change',atualizar));
$('#form-contexto').addEventListener('submit',event=>{event.preventDefault();if(indiceContexto===null)return;dados.registros[indiceContexto].descricao=$('#contexto-texto').value.trim();$('#form-contexto').hidden=true;indiceContexto=null;salvar();aviso('Contexto salvo.');});
document.addEventListener('submit',event=>{const form=event.target.closest('.form-resposta');if(!form)return;event.preventDefault();const r=dados.dialogos[Number(form.dataset.indice)];if(!r)return;r.resposta=form.elements.resposta.value.trim();r.status=form.elements.status.value;salvar();aviso('Resposta atualizada.');});
function formulario(id,executar){$(id).addEventListener('submit',evento=>{evento.preventDefault();executar(evento.target);salvar();evento.target.reset();aviso('Informação registrada nesta demonstração.');});}
formulario('#form-devolutiva',()=>dados.devolutivas.push({aluno:$('#dev-aluno').value,texto:$('#dev-texto').value.trim()}));
formulario('#form-auto',()=>dados.autoavaliacoes.push({dimensao:$('#auto-dim').value,nivel:$('#auto-nivel').value,texto:$('#auto-texto').value.trim()}));
formulario('#form-intervencao',()=>dados.intervencoes.push({titulo:$('#intervencao-titulo').value.trim(),descricao:$('#intervencao-descricao').value.trim()}));
['est','resp'].forEach(origem=>formulario('#form-dialogo-'+origem,form=>dados.dialogos.push({origem,mensagem:form.elements.mensagem.value.trim(),status:'Em análise',resposta:''})));
trocarPerfil('professor');
