# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Uso pessoal: uma única pessoa (o próprio autor) que estuda por ciclos e organiza com o app o tempo, os tópicos e as revisões do próprio estudo. Não há outros perfis de usuário, contas compartilhadas nem papéis.

## Product Purpose

Organizar o estudo pelo método de **ciclo de estudos** e garantir a **revisão** do que foi estudado. O app cronometra cada sessão por disciplina, acompanha as metas de tempo do ciclo, registra o que foi estudado (tópicos, aulas, links, questões) e forma grupos de revisão a partir dos dias de estudo.

Sucesso: abrir o app, saber na hora qual é a próxima disciplina, estudar com o cronômetro, registrar a sessão com o mínimo de atrito e revisar cada grupo no tempo certo, sem perder nada de vista.

## Positioning

Não é um cronômetro genérico nem um planner com grade de horários. Combina quatro coisas que o próprio usuário apontou como diferenciais:

- **Ciclo de estudos:** disciplinas com metas de tempo que giram em ciclos e rodadas, sem horários fixos.
- **Revisão por dias de estudo:** a cada N dias com estudo (com tópico e aula registrados) forma-se um grupo, que fica disponível após W dias corridos; os grupos são revisados em ordem, um de cada vez.
- **Registro de aulas:** cada sessão guarda tópicos, aulas, links, anotações e questões (acertos/total).
- **Simplicidade:** um arquivo só, sem cadastro e sem instalação.

## Operating Context

- Usado no notebook/computador, aberto ao lado do material de estudo (videoaulas, PDFs), e no celular, principalmente para iniciar/pausar o cronômetro e consultar.
- Rotina: escolher a próxima disciplina do ciclo → estudar com o cronômetro → registrar tópico/aula → concluir metas e fechar ciclos/rodadas → revisar grupos quando ficam disponíveis.
- Idioma da interface: português do Brasil.

## Capabilities and Constraints

- **Arquivo único:** todo o app (HTML, CSS e JS) vive em `Ciclo de Estudos.html`; sem framework, sem build, sem dependências além da fonte do Google Fonts.
- **Dados:** salvos no `localStorage` do navegador; quando publicado como artifact do claude.ai, sincronizam com a conta pelo runtime (`window.claude`, coleção `db`).
- **Abas:** Ciclo, Revisão, Planos, Histórico, Estatísticas, Configurações.
- **Ciclo:** cronômetro por disciplina, metas de tempo, blocos duplicados, reordenação, registro manual, desfazer/refazer, atalho de Espaço para iniciar/pausar.
- **Planos:** vários planos, cada um com disciplinas, tópicos e rodadas; edição de disciplina com rascunho (Salvar/Cancelar).
- **Revisão:** grupos de N dias válidos de estudo, disponíveis após W dias corridos (ambos configuráveis, 1–60), revisados em ordem, um grupo por vez; calendário de revisões.
- **Histórico:** lista com busca e filtro por datas (a visualização em calendário foi removida).
- **Terminologia fixa:** ciclo, rodada, plano, disciplina, tópico, aula, sessão, grupo de revisão, dias válidos de estudo, dias corridos.
- **Em aberto:** forma de distribuição principal (artifact publicado no claude.ai ou arquivo local aberto no navegador) não foi decidida.

## Brand Commitments

- Nome: **Ciclo de Estudos**.
- Logo: `Icone/ciclo-de-estudos-icone.svg` (já aplicada no app e como ícone da aba).
- Voz: português do Brasil, direta e curta; textos explicativos ficam em pop-ups de informação (ícone ⓘ), não no corpo dos cartões.

## Evidence on Hand

- Logo em `Icone/ciclo-de-estudos-icone.svg`.
- Não há depoimentos, usuários externos, métricas de uso nem material de divulgação; nada disso deve ser inventado.

## Product Principles

1. **Atrito mínimo para estudar:** iniciar o cronômetro e registrar a sessão precisam ser imediatos, inclusive no celular.
2. **A revisão é parte do método, não um extra:** o app conduz o usuário a revisar cada grupo no tempo e na ordem certos.
3. **Sem perda de dados:** toda ação destrutiva tem desfazer ou confirmação; mudanças em lote passam por rascunho com Salvar/Cancelar.
4. **Interface enxuta:** o essencial fica visível; explicações e configurações raras ficam um toque atrás (ícone ⓘ, engrenagem, pop-ups).
5. **Funciona sozinho:** um arquivo, sem conta obrigatória e sem dependência de servidor próprio.
