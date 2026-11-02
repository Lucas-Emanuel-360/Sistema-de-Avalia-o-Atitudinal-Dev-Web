# Sistema Web de Avaliação Atitudinal — protótipo acadêmico

Abra `index.html` no navegador. Não há instalação, back-end ou dependências externas.

## Escopo incluído

- Professor: registro rápido, histórico e devolutivas.
- Coordenação e núcleo pedagógico: dashboard, alertas precoces, análise por turma/aluno/dimensão, clima escolar e intervenções.
- Estudante: evolução individual, autoavaliação, evidências e diálogo.
- Responsável: acompanhamento individual, evidências, devolutivas e diálogo.
- Documentos: mapa de navegação com permissões e wireframes para mobile e desktop.

## Dados de demonstração

O enunciado **não forneceu** nomes de alunos, turmas, estatísticas, registros, alertas ou valores de gráficos. Todos os exemplos dessas categorias foram criados apenas para simular as jornadas e identificados como fictícios. O uso de uma turma 7º A não limita o público-alvo do projeto; é apenas exemplo visual.

## Limitações

A troca de perfil não é autenticação ou controle de acesso real. Os registros são salvos no `localStorage` do navegador, sem sincronização, e os indicadores e alertas visuais são cenários fixos, não cálculos derivados de dados reais. Não usar com dados reais de estudantes. O registro rápido exige três escolhas (aluno, dimensão e tipo); a terceira escolha confirma automaticamente e dispensa clique extra, podendo ser revisto em testes de usabilidade.

## Estrutura

`index.html` contém as telas e seus conteúdos; `style.css` reúne layout e responsividade; `script.js` contém somente navegação e interações;