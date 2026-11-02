# Mapa de navegação e permissões

```mermaid
flowchart TD
  A[Selecionar perfil ilustrativo] --> P[Professor]
  A --> C[Coordenação / Núcleo pedagógico]
  A --> E[Estudante]
  A --> R[Responsável]
  P --> P1[Registro rápido: aluno, dimensão, tipo]
  P --> P2[Histórico de evidências]
  P --> P3[Devolutiva individual]
  C --> C1[Dashboard analítico]
  C --> C2[Alertas: atitude + frequência + desempenho]
  C --> C3[Turma, aluno e dimensão]
  C --> C4[Clima escolar / intervenções]
  E --> E1[Evolução individual]
  E --> E2[Autoavaliação]
  E --> E3[Evidências / diálogo]
  R --> R1[Acompanhamento individual]
  R --> R2[Devolutivas / diálogo]
```

| Recurso | Professor | Coordenação / núcleo | Estudante | Responsável |
|---|---|---|---|---|
| Registrar observação | Turmas vinculadas | Não por padrão | Não | Não |
| Consultar histórico | Turmas vinculadas | Escopo institucional autorizado | Apenas o próprio | Apenas vinculado |
| Devolutiva | Registrar | Acompanhar | Receber | Consultar |
| Autoavaliação | Consultar | Consultar | Enviar | Não |
| Alertas / clima / intervenções | Não por padrão | Sim | Não | Não |
| Contestação / diálogo | Participar | Acompanhar | Solicitar | Solicitar |

**Nota:** permissões são o desenho pretendido, não segurança implementada. O protótipo não tem back-end.
