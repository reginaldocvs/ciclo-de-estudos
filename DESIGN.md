---
name: Ciclo de Estudos
description: O ciclo de estudos lido como o edital verticalizado do concurseiro, uma tabela densa com colunas de marcação.
colors:
  primary: "#00687A"
  on-primary: "#FFFFFF"
  rail-hover: "#0B7586"
  rail-muted: "#D3EBF0"
  highlighter: "#E4F87A"
  on-highlighter: "#2A3300"
  page-ground: "#F4F6F7"
  card: "#FFFFFF"
  band-low: "#F8FAFA"
  band-high: "#EBF0F1"
  track: "#E2E8EA"
  rule: "#DCE2E4"
  tonal-wash: "#E1EDF0"
  on-tonal-wash: "#173840"
  ink: "#15191B"
  muted: "#4E585C"
  mark-empty: "#AAB4B8"
  field-outline: "#6F797C"
  error: "#BA1A1A"
  success: "#1B6D2F"
  subject-1: "#5B6CF0"
  subject-2: "#E5484D"
  subject-3: "#22A06B"
  subject-4: "#F0A43A"
  subject-5: "#8B5CF6"
  subject-6: "#1FB6C9"
  subject-7: "#E8559E"
  subject-8: "#A0562A"
  subject-9: "#8FC33A"
  subject-10: "#5F6B8A"
  subject-11: "#EE7A3A"
  subject-12: "#1D8F86"
typography:
  timer-display:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(3.4rem, 17vw, 7.5rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  panel-clock:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "4rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: "2.5rem"
    letterSpacing: "-0.01em"
  panel-subject:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  figure:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    fontFeature: "tnum"
  body:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.01em"
  table-row:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    fontFeature: "tnum"
  table-head:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.06em"
  label:
    fontFamily: "Source Sans 3, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
rounded:
  mark: "4px"
  control: "8px"
  card: "10px"
  round: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "20px"
  xl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.control}"
    padding: "8px 24px"
    height: "40px"
  button-primary-panel:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.control}"
    height: "52px"
    width: "100%"
  button-tonal:
    backgroundColor: "{colors.tonal-wash}"
    textColor: "{colors.on-tonal-wash}"
    rounded: "{rounded.control}"
    padding: "6px 16px"
    height: "32px"
  segmented:
    backgroundColor: "{colors.track}"
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "40px"
  segmented-on:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.control}"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "40px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "20px"
  table-head-band:
    backgroundColor: "{colors.band-high}"
    textColor: "{colors.muted}"
    typography: "{typography.table-head}"
    height: "44px"
  table-row:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    typography: "{typography.table-row}"
    height: "52px"
  table-row-current:
    backgroundColor: "{colors.highlighter}"
    textColor: "{colors.on-highlighter}"
  review-mark:
    backgroundColor: "transparent"
    rounded: "{rounded.mark}"
    size: "18px"
  review-mark-done:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.mark}"
    size: "18px"
  tag:
    backgroundColor: "{colors.track}"
    textColor: "{colors.on-tonal-wash}"
    rounded: "{rounded.mark}"
    padding: "2px 7px"
  nav-rail:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    width: "240px"
  nav-item:
    textColor: "{colors.rail-muted}"
    rounded: "{rounded.control}"
    height: "56px"
  session-panel:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    width: "340px"
    padding: "32px 28px"
---

# Design System: Ciclo de Estudos

## Overview

**Creative North Star: "O Edital Verticalizado"**

O app se lê como a planilha que o concurseiro monta do edital: disciplinas e tópicos numa tabela branca, densa e escaneável, com colunas de marcação para as revisões. Não há painel de cartões de mesmo peso; a tela principal é uma tabela, e o resto do app (Revisão, Questões, Histórico, Estatísticas) repete a mesma gramática: faixa de cabeçalho em caixa alta, linhas de 52px separadas por fio de 1px, números tabulares alinhados.

A cor é economizada. O ciano do logo domina só a moldura (o menu lateral inteiro, ou a barra de cima e a de baixo no celular) e aparece dentro da página apenas onde há ação ou confirmação: o botão primário, a aba segmentada ativa e as marcas de revisão feitas. O marca-texto limão existe para uma única coisa, a linha da disciplina da vez. As cores das disciplinas ficam presas em quadradinhos de 10px e na barra de progresso.

A página é plana: chão cinza frio, papel branco com fio fino, sem sombras. O tema claro é o padrão; o escuro continua como opção.

**Key Characteristics:**
- Uma tabela por tela, com cabeçalho em faixa e linhas de altura fixa.
- Ciano só na moldura e na ação; limão só na linha da vez.
- Fios de 1px no lugar de sombras e de fundos coloridos.
- Algarismos tabulares em todo tempo, meta, acerto e data.
- Cantos discretos: 8px nos controles, 10px nos cartões, 4px nas marcas.

## Colors

Paleta fria e quase monocromática (cinza, branco, tinta), com um ciano de marca e um único acento limão de marca-texto.

### Primary
- **Ciano do Logo** (primary): fundo do menu lateral e das barras do celular, botão primário (Iniciar, Salvar), aba segmentada ativa, marca de revisão feita, foco dos campos e links de texto. Sobre ele, texto branco (on-primary).
- **Ciano de Passagem** (rail-hover): superfície elevada dentro do menu ciano.
- **Névoa do Menu** (rail-muted): rótulos inativos do menu sobre o ciano.

### Secondary
- **Marca-texto Limão** (highlighter): fundo da linha da disciplina da vez na tabela do Ciclo; texto em on-highlighter. No tema escuro vira um oliva escuro com texto claro.

### Tertiary
- **Cores das Disciplinas** (subject-1 a subject-12): doze matizes atribuídos às disciplinas. Aparecem só como quadradinho de 10px ao lado do nome e no preenchimento da barra de progresso.

### Neutral
- **Chão Cinza Frio** (page-ground): fundo da página.
- **Papel** (card): tabelas, cartões, painel da sessão.
- **Faixa Clara** (band-low): faixa do dia no Histórico e faixa da disciplina em Questões.
- **Faixa de Cabeçalho** (band-high): cabeçalho das tabelas (Ciclo, Revisão, Estatísticas); também o fundo dos pop-ups.
- **Trilho** (track): fundo das barras de progresso, das etiquetas e das abas segmentadas inativas.
- **Fio** (rule): toda borda de cartão e todo separador de linha.
- **Lavado Tonal** (tonal-wash / on-tonal-wash): botão secundário e item ativo de navegação fora do menu ciano.
- **Tinta** (ink): texto principal e números.
- **Tinta Apagada** (muted): rótulos, cabeçalhos de coluna, texto de apoio.
- **Marca Vazia** (mark-empty): contorno da marca de revisão ainda não feita.
- **Contorno de Campo** (field-outline): borda dos campos em repouso.
- **Atraso** (error): revisão atrasada (contorno e "!" da marca, link "atrasada"), erros.
- **Feito** (success): placar de acertos.

### Named Rules
**The Uma Linha Grifada Rule.** O limão marca só a linha da disciplina da vez. Nada mais na tela usa o marca-texto: nem destaque, nem botão, nem aviso.

**The Ciano na Moldura Rule.** Dentro da página o ciano aparece apenas em ação ou confirmação (botão primário, aba ativa, revisão feita, link). Fundos de cartão nunca são ciano.

**The Cor da Disciplina Presa Rule.** A cor de uma disciplina nunca pinta texto, fundo de linha ou cartão; fica no quadradinho e na barra.

## Typography

**Display Font:** Source Sans 3 (com system-ui, -apple-system, Segoe UI, sans-serif)
**Body Font:** Source Sans 3
**Label/Mono Font:** Source Sans 3 com algarismos tabulares

**Character:** Uma família só, de leitura de planilha: pesos fortes (700 a 800) para nomes e números, 400 para o corpo, e caixa alta espaçada apenas nos cabeçalhos de tabela.

### Hierarchy
- **Timer Display** (800, clamp(3.4rem, 17vw, 7.5rem), 1): relógio do modo foco.
- **Panel Clock** (700, 4rem, 1, -0.03em): relógio do painel da sessão.
- **Headline** (800, 2rem, 2.5rem): título da página (nome do plano + ciclo).
- **Panel Subject** (800, 1.75rem, 1.15): nome da disciplina da vez no painel; 1.5rem no celular, 1.4rem no painel de 300px.
- **Figure** (700, 1.5rem, tabular): os números Hoje, Ciclo e Total no canto do cabeçalho; os quatro números das Estatísticas usam 1.75rem.
- **Body** (400, 15px, 1.5, 0.01em): texto corrido.
- **Table Row** (400, 0.9375rem, tabular): linhas de tabela; nome da disciplina em 700, sub-linha de tópico em 0.875rem.
- **Table Head** (700, 0.75rem, 0.06em, caixa alta): faixas de cabeçalho e rótulos dos números das Estatísticas.
- **Label** (600, 0.875rem): botões, abas, rótulos de apoio.

### Named Rules
**The Algarismo Tabular Rule.** Todo tempo, meta, acerto, data e contagem usa algarismos tabulares, para que as colunas alinhem.

**The Nome Nunca Quebra Rule.** O nome de uma disciplina nunca quebra de linha, em nenhuma tela, janela ou lista: fica numa linha só, cortado com reticências, e o nome inteiro vai no title.

**The Sem Palavra Órfã Rule.** Nenhum texto termina com uma palavra sozinha na última linha (text-wrap: pretty no corpo; em colunas estreitas, dar mais largura ao texto).

**The Primeira Linha Rule.** Quando um texto ocupa duas linhas, o que fica ao lado dele (quadradinho, data, ícone, botão, etiqueta) se alinha com a primeira linha, não com o meio.

**The Caixa Alta é Cabeçalho Rule.** Caixa alta espaçada é reservada a cabeçalho de coluna e de seção curta dentro de tabela ou painel; nunca a texto corrido nem a título de página.

## Layout

Modelo de app com moldura: menu lateral ciano fixo à esquerda (240px expandido, com rótulos; recolhível a 80px pelo botão ao lado do logo ou por Ctrl+\, sem abrir ao passar o mouse, e a escolha fica guardada no aparelho) a partir de 861px; abaixo disso, barra de cima e barra de navegação de baixo, ambas ciano.

Na aba Ciclo, no computador (a partir de 1121px), a tabela ocupa o centro e o painel da sessão fica fixo na borda direita, de cima a baixo: 300px até 1359px e 340px acima disso. De 1360px em diante o app ocupa a tela toda (menu na borda esquerda); acima de 1800px tabela e painel se centralizam juntos (1456px) no espaço à direita do menu. Abaixo de 1121px o painel empilha em cima da tabela; entre 700px e 1120px ele se divide em duas colunas (sessão | revisão de hoje). As outras abas centralizam o conteúdo em até 1180px à direita do menu; Configurações fica numa coluna de leitura de 760px.

As tabelas respondem ao próprio contêiner, não à janela: no Ciclo some primeiro o Progresso (até 780px de tabela), depois Meta e Última (até 640px); as colunas de revisão ficam. Abaixo de 700px de tela a linha vira lista compacta (número, nome, feito, ações) sem cabeçalho. Revisão e Histórico só viram tabela com 720px e 660px de contêiner.

Itens do mesmo tipo ficam na mesma coluna de uma linha para a outra (etiquetas de acertos, ícones de editar e excluir, botões Iniciar e Registrar), e ações ficam junto do conteúdo, não empurradas para a borda do cartão.

Ritmo: linhas de 52px, cabeçalhos de 44px (40px nas sub-linhas e faixas), padding de cartão de 20px, painel com 32px 28px, intervalo de 16px entre blocos. No celular a sessão da vez vem primeiro, depois o que revisar, depois a faixa do ciclo.

## Elevation & Depth

A página é plana. Cartões, tabelas e o painel têm sombra nenhuma; a separação vem do fio de 1px (rule) sobre o chão cinza e das faixas tonais (band-low, band-high). Só o que flutua sobre a página tem sombra: pop-ups, menus e painéis de baixo.

### Shadow Vocabulary
- **Flutuante** (`box-shadow: 0 1px 3px rgba(0,0,0,.3), 0 4px 8px 3px rgba(0,0,0,.15)`): pop-ups e painéis sobre a página.

### Named Rules
**The Fio no Lugar da Sombra Rule.** Nada que mora na página ganha sombra; profundidade é fio de 1px ou faixa tonal.

## Shapes

Cantos pequenos e sóbrios, em três degraus por tamanho de peça: 4px nas peças miúdas (etiquetas, placar de acertos, marcas de revisão, quadradinho da disciplina, barras de progresso da tabela, grifo do nome), 8px em todo controle (botões, abas segmentadas, itens do menu, busca, filtro, campos) e 10px nos cartões, tabelas e pop-ups. Botões só de ícone continuam redondos e o interruptor continua pílula. O painel fixo da direita não tem canto: é uma coluna presa à borda com fio à esquerda.

## Components

### Buttons
- **Shape:** cantos de 8px em todos.
- **Primary:** ciano com texto branco, 40px de altura, 8px 24px. No painel da sessão, Iniciar ocupa a largura toda com 52px, 1rem, 700.
- **Hover / Focus:** o fundo clareia com 8% de branco; foco por contorno ciano.
- **Tonal:** lavado tonal com texto escuro, versão pequena de 32px (ex.: "Editar ciclo").
- **Link de texto:** ciano, 600, sem fundo; no hover ganha sublinhado (deslocamento 3px), nunca pílula. No painel, os links da revisão vão em tinta, e "atrasada" em vermelho.
- **Ícone:** botão redondo, cor apagada.

### Chips
- **Etiquetas e placar de acertos:** 0.75rem, cantos de 4px; etiqueta sobre o trilho, placar em verde a 12%.
- **Aba segmentada:** 40px, trilho com texto apagado; ativa em ciano com texto branco; 8px.

### Cards / Containers
- **Corner Style:** 10px.
- **Background:** papel branco sobre o chão cinza.
- **Shadow Strategy:** nenhuma (ver Elevation & Depth).
- **Border:** fio de 1px.
- **Internal Padding:** 20px; tabelas internas sangram até a borda (margem de -20px).

### Inputs / Fields
- **Style:** fundo transparente, contorno de 1px (field-outline), 8px, 40px de altura.
- **Focus:** contorno ciano com reforço interno de 1px; hover escurece o contorno para tinta.

### Navigation
- **Menu lateral:** coluna ciano de 240px com logo e nome no topo; itens de 56px, ícone de 20px e rótulo, cantos de 8px, rótulos em névoa; ativo com véu branco de 18% e texto branco. Recolhido (80px) mostra só ícones, com o nome no title; o botão de recolher fica menor e mais apagado.
- **Celular:** barra de cima e barra de baixo no mesmo ciano.

### Tabela do Ciclo (assinatura)
Colunas: #, Disciplina / tópico, Meta, Feito, Progresso, uma coluna por revisão (1ª, 2ª … conforme os intervalos configurados, 24px cada), Última, ações. Cabeçalho em faixa band-high de 44px; linhas de 52px com fio entre elas. Sob cada disciplina, sub-linhas de 40px com os tópicos da última sessão (recuo de 20px, aulas em apagado, até três links de aula/questões) e a marca de cada revisão. A linha da vez fica inteira em marca-texto limão.

### Marca de revisão
Quadrado de 18px, cantos de 4px. Vazia: contorno de 1.5px cinza (mark-empty). Feita: cheia de ciano com visto branco em SVG. Para hoje: contorno e "!" ciano. Atrasada: contorno e "!" vermelho.

### Painel da sessão
Linha de situação em caixa alta pequena (Agora · 2 de 7, Estudando agora, Estudo em pausa), nome da disciplina em 1.75rem/800, relógio em 4rem com "de [meta]" ao lado, Iniciar largo, a disciplina seguinte ("Depois:") com seu quadradinho, e a seção "Revisão de hoje" separada por fio, com até duas revisões de tópico e um "+ N".

### Números do cabeçalho
Hoje, Ciclo e Total no canto superior direito do título: rótulo apagado em 500 sobre o número em 1.5rem/700 tabular, sem caixa e sem fundo, 28px entre eles.

### Janelas
- **Cabem na tela:** nenhuma janela passa da altura da tela; o conteúdo rola por dentro, e o título fica fixo no alto enquanto os botões rolam junto.
- **Celular:** até 600px toda janela é um painel que sobe de baixo, de ponta a ponta, com alça e arrastar para fechar (só as boas-vindas e o modo foco ficam de fora).
- **Uma dentro da outra:** janela aberta a partir de outra tem seta ← no título e Cancelar ao lado de Salvar, e volta para a anterior; X, Esc, toque fora e arrastar fecham tudo. Trocar de uma janela para outra não anima.
- **Listas de escolha:** abrem em lista própria, mais larga que o campo quando o nome pede, com o nome numa linha só.

### Listas longas
Toda lista que cresce mostra 6 itens e um "Mostrar mais N" (e "Mostrar menos"), no celular e no computador. A exceção é a lista com caixinha de marcar, que mostra tudo: não dá para marcar o que não se vê.

### Linhas do registro
Cada tópico registrado tem linhas de **Videoaula** (ícone de câmera), **Leitura** (ícone de livro, com as páginas "p. 12–30" ao lado do título) e **Questões** (acertos de total, com a porcentagem). Os ícones ficam no começo da linha, em tinta apagada; os botões "Videoaula +", "Leitura +" e "Questões +" cabem numa linha só até em 320px.

### Modo foco
Tela cheia sobre o chão: disciplina, relógio grande (Timer Display), barra de progresso, ações centralizadas; antes de começar mostra as escolhas e uma contagem de 5 segundos.

## Do's and Don'ts

### Do:
- **Do** montar toda lista de dados nova como linhas de tabela: faixa de cabeçalho band-high em 0.75rem/700 caixa alta, linhas de 52px com fio de 1px.
- **Do** usar algarismos tabulares em todo número.
- **Do** esconder colunas por container query, da menos para a mais essencial, mantendo nome e ações.
- **Do** usar 8px em controles, 10px em cartões e 4px em peças miúdas.
- **Do** cortar em 6 itens, com "Mostrar mais", toda lista que pode crescer (menos as de marcar).
- **Do** pôr o nome de disciplina numa linha só, com reticências e title.
- **Do** marcar revisão com o quadrado de 18px (vazio em cinza, feito cheio de ciano com visto em SVG, contorno ciano para hoje, contorno vermelho para atrasada).

### Don't:
- **Don't** usar o limão em nada além da linha da vez.
- **Don't** pintar texto, fundo ou cartão com a cor da disciplina; ela fica no quadradinho e na barra.
- **Don't** pôr sombra em cartão, tabela, painel ou botão que mora na página.
- **Don't** voltar às pílulas: botão, aba, busca e filtro têm 8px; só botão de ícone e interruptor são redondos.
- **Don't** dar fundo de pílula a link de texto no hover; o estado é sublinhado.
- **Don't** montar painel de cartões de mesmo peso onde cabe uma tabela.
- **Don't** deixar janela passar da altura da tela nem abrir janela no celular que não seja painel de baixo.
