# Sistema Web de Avaliação Atitudinal — protótipo acadêmico

Abra `index.html` no navegador. Não requer servidor ou instalação.

## Funcionalidades

- Professor: registro em três escolhas, histórico, edição posterior de contexto e devolutiva.
- Coordenação/núcleo: painel, filtros, gráficos de contagem derivados dos registros demonstrativos, alertas ilustrativos, clima e intervenções, acompanhamento e resposta de diálogo.
- Estudante: evolução, autoavaliação, histórico, devolutivas recebidas, diálogo e acompanhamento da resposta.
- Responsável: consulta ao histórico e devolutivas do estudante vinculado, diálogo e acompanhamento da resposta.

## Limites

Todos os nomes, turmas, registros e alertas são fictícios. Os gráficos por dimensão e mês usam apenas os registros demonstrativos locais; alertas e indicadores de clima ainda são cenários ilustrativos. Sem back-end, autenticação, controle de acesso real ou segurança adequada a dados de estudantes. Os dados são salvos em `localStorage`. Não usar com dados reais.

## Teste sugerido

1. Professor: faça um registro em três escolhas, entre no histórico e clique em **Adicionar contexto**.
2. Professor: envie uma devolutiva para Ana Clara.
3. Estudante: veja a devolutiva recebida e envie uma solicitação de diálogo.
4. Coordenação: abra **Solicitações de diálogo**, responda e altere a situação.
5. Estudante: volte à página de diálogo e confira a resposta.
6. Coordenação: em **Turmas e dimensões**, alterne as turmas e dimensões para ver mudanças nos registros e gráficos.
