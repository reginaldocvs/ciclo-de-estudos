# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Uso pessoal: hoje, só o próprio autor, um concurseiro que estuda por ciclos e organiza com o app o tempo, os tópicos e as revisões do próprio estudo. O app já permite liberar outras pessoas (cada uma com a própria conta Google e os próprios dados, que ninguém mais vê), mas ninguém mais usa; não há papéis, contas compartilhadas nem administração dentro do app.

## Product Purpose

Organizar o estudo pelo método de **ciclo de estudos** e garantir a **revisão** do que foi estudado. O app cronometra cada sessão por disciplina, acompanha as metas de tempo do ciclo, registra o que foi estudado (tópicos, videoaulas, leituras, links, questões) e agenda as revisões pelos sistemas que o usuário ligar.

Sucesso: abrir o app, saber na hora qual é a próxima disciplina, estudar com o cronômetro, registrar a sessão com o mínimo de atrito e fazer cada revisão no dia certo, sem perder nada de vista.

## Positioning

Não é um cronômetro genérico nem um planner com grade de horários. Combina quatro coisas que o próprio usuário apontou como diferenciais:

- **Ciclo de estudos:** disciplinas com metas de tempo que giram em ciclos e rodadas, sem horários fixos.
- **Revisão como parte do método:** vários sistemas que podem ser ligados juntos: por ciclos, por questões, por grupos de dias de estudo, por tópico (intervalos espaçados), por sessões, de consolidação (questões já vistas, com filtros) e de bloco. Num app novo, vêm ligadas a por ciclos e a por questões.
- **Registro do estudo:** cada sessão guarda tópicos, videoaulas, leituras (com páginas), links, anotações e questões (acertos/total).
- **Simplicidade:** um app web instalável, sem cadastro obrigatório.

## Operating Context

- Usado no notebook/computador, aberto ao lado do material de estudo (videoaulas, PDFs), e no celular, principalmente para iniciar/pausar o cronômetro e consultar.
- Rotina: escolher a próxima disciplina do ciclo → estudar com o cronômetro → registrar tópico, videoaula ou leitura e questões → concluir metas e fechar ciclos/rodadas → revisar o que vence hoje.
- Idioma da interface: português do Brasil.

## Capabilities and Constraints

- **Arquivo principal único:** todo o app (HTML, CSS e JS) vive em `index.html`, com `sw.js` (funciona sem internet), `manifest.json` e `icons/` para instalar como app; sem framework e sem build. Dependências externas: a fonte do Google Fonts e o SDK do Firebase.
- **Dados:** salvos no `localStorage` do navegador e, com login, sincronizados pelo Firebase; backup em arquivo `.json` (salvar e restaurar) e histórico de versões.
- **Abas:** Ciclo, Revisão, Questões, Histórico, Estatísticas, Configurações. Os planos se trocam pelo nome do plano no alto da página.
- **Ciclo:** cronômetro por disciplina, modo foco em tela cheia, metas de tempo, blocos duplicados, reordenação, registro manual e desfazer/refazer.
- **Planos:** vários planos, cada um com disciplinas, tópicos e rodadas; edição de disciplina com rascunho (Salvar/Cancelar).
- **Revisão:** os sistemas ligados em Ajustes de revisão (por ciclos, por questões, por grupos de N dias válidos disponíveis após W dias corridos, por tópico, por sessões), mais a revisão de consolidação e a de bloco; visão de hoje e calendário de revisões.
- **Questões:** cadernos de questões importados, resolvidos no app, com acertos por tópico.
- **Histórico:** duas visões, Registros (lista por dia, com busca e filtros) e Ciclos (o que foi estudado em cada ciclo).
- **Terminologia fixa:** ciclo, rodada, plano, disciplina, tópico, videoaula, leitura, questões, sessão, grupo de revisão, dias válidos de estudo, dias corridos.
- **Distribuição (decidido):** o app precisa ser acessível de qualquer computador e **de graça** (hospedagem estática gratuita). Os dados de estudo devem acompanhar o usuário entre computadores e celular.
- **Hospedagem (decidido):** GitHub Pages, publicado a partir do repositório git do projeto.
- **Sincronização (decidido):** login com conta Google e dados na nuvem pelo Firebase (Authentication + Firestore, plano gratuito). Só sincronizam as contas liberadas nas regras do Firestore; quem não está liberado pode pedir acesso, e o dono recebe um e-mail. O app continua funcionando sem login, só com os dados do navegador.

## Brand Commitments

- Nome: **Ciclo de Estudos**.
- Logo: `Icone/ciclo-de-estudos-icone.svg` (já aplicada no app e como ícone da aba).
- Voz: português do Brasil, direta e curta; textos explicativos ficam em pop-ups de informação (ícone ⓘ), não no corpo dos cartões.

## Evidence on Hand

- Logo em `Icone/ciclo-de-estudos-icone.svg`.
- Não há depoimentos, outros usuários, métricas de uso nem material de divulgação; nada disso deve ser inventado.

## Product Principles

1. **Atrito mínimo para estudar:** iniciar o cronômetro e registrar a sessão precisam ser imediatos, inclusive no celular.
2. **A revisão é parte do método, não um extra:** o app conduz o usuário a fazer cada revisão no tempo e na ordem certos, seja qual for o sistema ligado.
3. **Sem perda de dados:** toda ação destrutiva tem desfazer ou confirmação; mudanças em lote passam por rascunho com Salvar/Cancelar.
4. **Interface enxuta:** o essencial fica visível; explicações e configurações raras ficam um toque atrás (ícone ⓘ, engrenagem, pop-ups).
5. **Funciona sozinho:** sem conta obrigatória, sem servidor próprio e sem internet depois de instalado.

## Accessibility & Inclusion

Nenhuma exigência específica do usuário. Vale o piso geral: contraste legível nos dois temas, foco visível, tudo alcançável pelo teclado e textos que não quebram nomes nem deixam palavra sozinha (ver DESIGN.md).
