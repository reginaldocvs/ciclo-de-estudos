---
name: Ciclo de Estudos
description: Ciclo de estudos e revisões como um app do Google em Material 3 Expressive.
colors:
  primary: "#00687A"
  on-primary: "#FFFFFF"
  primary-container: "#ACEDFF"
  on-primary-container: "#004E5C"
  secondary-container: "#CEE7EF"
  on-secondary-container: "#334A51"
  tertiary: "#4D6700"
  tertiary-container: "#D3F46F"
  on-tertiary-container: "#394F00"
  error-container: "#FFDAD6"
  on-error-container: "#93000A"
  success-container: "#B9F0BE"
  on-success-container: "#0E5223"
  surface-container-lowest: "#FFFFFF"
  surface-container-low: "#EFF5F7"
  surface-container: "#E9EFF1"
  surface-container-high: "#E3E9EB"
  surface-container-highest: "#DDE4E6"
  on-surface: "#171D1E"
  on-surface-variant: "#3F484B"
  outline: "#6F797C"
  outline-variant: "#BFC8CB"
  inverse-surface: "#2B3133"
  inverse-on-surface: "#ECF2F3"
  inverse-primary: "#84D2E7"
  success: "#1B6D2F"
  error: "#BA1A1A"
  scrim: "rgba(0,0,0,.32)"
typography:
  display:
    fontFamily: "Google Sans Flex, Google Sans, Roboto, system-ui, sans-serif"
    fontSize: "clamp(3.4rem, 17vw, 7.5rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
    fontVariation: "\"ROND\" 100"
  headline:
    fontFamily: "Google Sans Flex, Google Sans, Roboto, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: "2.5rem"
    letterSpacing: "0"
    fontVariation: "\"ROND\" 100"
  dialog-title:
    fontFamily: "Google Sans Flex, Google Sans, Roboto, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: "2rem"
  title:
    fontFamily: "Google Sans Flex, Google Sans, Roboto, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    letterSpacing: "0"
    fontVariation: "\"ROND\" 100"
  body:
    fontFamily: "Google Sans Flex, Google Sans, Roboto, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.01em"
  label:
    fontFamily: "Google Sans Flex, Google Sans, Roboto, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: "1.25rem"
    letterSpacing: "0.01em"
  nav-label:
    fontFamily: "Google Sans Flex, Google Sans, Roboto, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1rem"
  timer:
    fontFamily: "Google Sans Flex, Google Sans, Roboto, system-ui, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 600
    lineHeight: 1
    fontFeature: "tnum"
    fontVariation: "\"ROND\" 100"
  ring-value:
    fontFamily: "Google Sans Flex, Google Sans, Roboto, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    fontFeature: "tnum"
  ring-caption:
    fontFamily: "Google Sans Flex, Google Sans, Roboto, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  chart-label:
    fontFamily: "Google Sans Flex, Google Sans, Roboto, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 400
  calendar-legend-min:
    fontFamily: "Google Sans Flex, Google Sans, Roboto, system-ui, sans-serif"
    fontSize: "9px"
    fontWeight: 400
rounded:
  xs: "4px"
  s: "8px"
  m: "12px"
  l: "16px"
  xl: "20px"
  2xl: "28px"
  full: "999px"
spacing:
  xxs: "2px"
  xs: "4px"
  s: "8px"
  m: "12px"
  l: "16px"
  xl: "20px"
  2xl: "24px"
components:
  button-filled:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "8px 24px"
    height: "40px"
  button-tonal:
    backgroundColor: "{colors.secondary-container}"
    textColor: "{colors.on-secondary-container}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
    height: "32px"
  play-control:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    padding: "0 28px 0 24px"
    height: "56px"
  play-control-running:
    backgroundColor: "{colors.secondary-container}"
    textColor: "{colors.on-secondary-container}"
    rounded: "{rounded.l}"
  play-control-warn:
    backgroundColor: "{colors.tertiary-container}"
    textColor: "{colors.on-tertiary-container}"
  fab:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
    rounded: "{rounded.l}"
    size: "56px"
  icon-button-large:
    backgroundColor: "{colors.surface-container-highest}"
    textColor: "{colors.on-surface-variant}"
    rounded: "{rounded.full}"
    size: "56px"
  segmented-button:
    backgroundColor: "{colors.surface-container-highest}"
    textColor: "{colors.on-surface-variant}"
    rounded: "{rounded.s}"
    padding: "0 16px"
    height: "40px"
  segmented-button-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "20px"
  card:
    backgroundColor: "{colors.surface-container-lowest}"
    rounded: "{rounded.2xl}"
    padding: "20px"
  kpi-tile:
    backgroundColor: "{colors.surface-container-lowest}"
    rounded: "{rounded.xl}"
  list-item-selected:
    backgroundColor: "{colors.secondary-container}"
    textColor: "{colors.on-secondary-container}"
    rounded: "{rounded.xl}"
    padding: "12px"
  text-field:
    textColor: "{colors.on-surface}"
    rounded: "{rounded.s}"
    height: "40px"
  search-field:
    backgroundColor: "{colors.surface-container-high}"
    rounded: "{rounded.full}"
    height: "48px"
  nav-item-active:
    backgroundColor: "{colors.secondary-container}"
    textColor: "{colors.on-secondary-container}"
    rounded: "{rounded.full}"
    height: "56px"
  tag:
    backgroundColor: "{colors.secondary-container}"
    textColor: "{colors.on-secondary-container}"
    rounded: "{rounded.s}"
    padding: "2px 8px"
  menu:
    backgroundColor: "{colors.surface-container}"
    rounded: "{rounded.l}"
    padding: "4px"
  menu-item:
    rounded: "{rounded.m}"
    padding: "10px 12px"
    height: "44px"
  dialog:
    backgroundColor: "{colors.surface-container-high}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  snackbar:
    backgroundColor: "{colors.inverse-surface}"
    textColor: "{colors.inverse-on-surface}"
    rounded: "{rounded.s}"
    height: "48px"
---

# Design System: Ciclo de Estudos

## Overview

**Creative North Star: "O App do Google para o Ciclo"**

Ciclo de Estudos se apresenta como um aplicativo próprio do Google em Material 3 Expressive: esquema tonal gerado do ciano do logo, superfícies em degraus de surface-container, Google Sans Flex com o eixo de arredondamento ligado nos títulos e formas que respondem ao toque com mola. Nada flutua por cima do conteúdo sem motivo; o que tem sombra é o que está acima da página (menus, diálogos, FAB, snackbar e o controle de estudar).

A densidade é de ferramenta de uso diário: listas conectadas, cartões grandes de 28px, campos compactos e contornados. O momento expressivo fica concentrado em dois lugares: o anel do ciclo, com o progresso por disciplina em arco de borda lisa, e o controle de estudar, que troca de forma entre pílula e quadrado arredondado quando o cronômetro corre. Todo o resto lê como lista de app do Google.

O sistema recusa o painel SaaS anterior (barra lateral flutuante, cartões com sombra suave, bordas finas em tudo). Esse recuo é confirmado pela própria construção: os cartões perderam borda e sombra, e a navegação virou rail e barra de navegação Material.

**Key Characteristics:**
- Esquema tonal Material 3 do ciano do logo, com o verde-limão do logo como terciária; claro e escuro completos.
- Profundidade por tom, não por sombra, em toda superfície que pertence à página.
- Forma fixa ao pressionar: o retorno do toque vem da camada de cor, não da forma.
- Camadas de estado de 8% (10% nos botões de ícone) em vez de filtros de brilho.
- Anel do ciclo com progresso de borda lisa sobre trilho reto.

## Colors

Um esquema tonal Material 3 inteiro, frio e claro, gerado de uma única semente ciano, com o limão do logo reservado para avisos e o estado "meta passada".

### Primary
- **Ciano Profundo do Logo** (primary): ação principal — botão preenchido, controle de estudar em repouso, segmento selecionado, dia selecionado e contorno de "hoje" no calendário, subtítulos de data no Histórico, links e botões de texto, cursor de digitação, foco dos campos.
- **Ciano Glacial** (primary-container): FAB, ícones dos indicadores em círculo, aviso de revisão pendente, seleção de texto, dias de revisão disponíveis no calendário.

### Secondary
- **Névoa Azul-Petróleo** (secondary-container): o indicador ativo — pílula atrás do item atual do rail e da barra de navegação, disciplina atual na lista do ciclo, botão tonal, controle de estudar enquanto o cronômetro corre, item atual dos menus, rótulos (tags). Também é o trilho do anel do ciclo.

### Tertiary
- **Limão do Logo** (tertiary-container / tertiary): avisos — controle de estudar quando a meta da disciplina já passou e botões de ícone em estado de alerta. Nunca decoração.

### Neutral
- **Superfícies em degraus** (surface-container-lowest até surface-container-highest): fundo da página em surface-container; cartões e indicadores em surface-container-lowest; diálogos em surface-container-high; edição de plano em surface-container-low; busca e balões de questão em surface-container-high; botões de ícone grandes, segmentos e trilhos de barra em surface-container-highest. No escuro, o fundo desce para #0E1416 e os cartões sobem para surface-container.
- **Tinta** (on-surface) e **Tinta Secundária** (on-surface-variant): texto principal e texto de apoio, ícones em repouso.
- **Contorno** (outline): borda dos campos de texto. **Contorno Suave** (outline-variant): divisórias de lista, caixas agrupadoras, chips de filtro.
- **Superfície Invertida** (inverse-surface / inverse-on-surface / inverse-primary): snackbar de desfazer, tooltip e notas flutuantes; a ação do snackbar usa inverse-primary.
- **Estados semânticos**: success e success-container para metas concluídas e acertos; error e error-container para exclusão e campos inválidos.

### Cores de disciplina
As disciplinas recebem cores de uma paleta de dados à parte (12 matizes saturados, de #5B6CF0 a #1D8F86). Elas pintam apenas o que é da disciplina: ponto, arco e onda do anel, barra de progresso, nome no diálogo de edição. Não são tokens de interface.

### Named Rules
**The Seed Rule.** Toda cor de interface sai do esquema tonal (`--m-*`); as variáveis antigas (`--bg`, `--card`, `--ac`, `--ink`...) são apelidos desses papéis, não cores novas.

**The Tinted Selection Rule.** "Atual" e "selecionado" em navegação, listas e menus é secondary-container, não primary. Primary preenchido fica para a ação e para a escolha num grupo segmentado.

## Typography

**Display Font:** Google Sans Flex (com Google Sans, Roboto, system-ui)
**Body Font:** Google Sans Flex (mesma família, eixo óptico automático)

**Character:** Uma família só, variável, com o eixo ROND do Expressive no máximo (100) em títulos, números grandes e marca, e sem arredondamento no corpo. A voz vem do eixo, não de uma segunda fonte.

### Hierarchy
- **Display** (500, clamp(3.4rem, 17vw, 7.5rem), 1): o cronômetro do modo foco; a variante de registro usa clamp(2.2rem, 9vw, 3.4rem). Números tabulares.
- **Headline** (600, 2rem/2.5rem; 1.75rem/2.25rem até 860px): título da página.
- **Dialog title** (500, 1.5rem/2rem): título de diálogos; cabeçalhos de folha de edição em 1.375rem.
- **Title** (600, 1.125rem): títulos de cartão, nome da marca no rail e na barra superior. Números de indicadores em 600 com ROND 100.
- **Body** (400, 15px/1.5, 0.01em): todo o texto corrido; subtítulo da página em 1rem na cor secundária.
- **Label** (600, 0.875rem/1.25rem, 0.01em): botões, segmentos, subtítulos de data; 0.8125rem nos botões pequenos.
- **Nav label** (500, 0.75rem/1rem; 700 quando ativo): rótulos do rail recolhido e da barra de navegação; 0.9375rem no rail expandido.

### Named Rules
**The Rounded Numbers Rule.** Títulos, números de indicador, cronômetros e marca levam `font-variation-settings: "ROND" 100`; texto corrido nunca.

**The Tabular Time Rule.** Todo tempo e contagem que muda na tela usa `font-variant-numeric: tabular-nums`.

## Layout

No computador (acima de 860px), um rail de navegação fixo de 240px ao lado do conteúdo (grade de duas colunas, 16px de vão, largura máxima de 1400px), recolhível para um rail de 96px com rótulos sob os ícones. Até 860px, barra superior de 64px, conteúdo, e barra de navegação fixa no rodapé com área segura do iOS respeitada.

A tela do ciclo usa uma grade própria: acima de 1120px, indicadores e lista à esquerda e o cartão "agora" (anel + controle de estudar) numa coluna de 320–380px à direita; entre 600 e 1120px, indicadores empilhados ao lado do cartão "agora", que encolhe o anel por unidades de contêiner (cqi) para nunca quebrar; abaixo de 600px, o cartão "agora" sobe para o topo.

Ritmo de espaçamento observado: 2px entre itens conectados (lista de disciplinas, segmentos, rail), 8–12px dentro de componentes, 16px entre colunas, 20px de respiro interno nos cartões (16px no celular), 24px nos diálogos.

## Elevation & Depth

Híbrido com hierarquia clara: o que pertence à página é plano e separado por tom; o que fica acima da página ganha sombra Material de dois componentes. Cartões, indicadores, rail e barra de navegação não têm sombra nem borda.

### Shadow Vocabulary
- **Nível 1** (`box-shadow: 0 1px 2px rgba(0,0,0,.3), 0 1px 3px 1px rgba(0,0,0,.15)`): controle de estudar em repouso; botão preenchido ao passar o mouse.
- **Nível 2** (`box-shadow: 0 1px 2px rgba(0,0,0,.3), 0 2px 6px 2px rgba(0,0,0,.15)`): menus; controle de estudar ao passar o mouse.
- **Nível 3** (`box-shadow: 0 1px 3px rgba(0,0,0,.3), 0 4px 8px 3px rgba(0,0,0,.15)`): diálogos, folhas inferiores, FAB, snackbar.
- **Véu** (`rgba(0,0,0,.32)`): fundo atrás de diálogos.

### Named Rules
**The Tonal Container Rule.** Superfície da página nunca leva sombra; ela se separa pelo degrau de surface-container.

**The Above-The-Page Rule.** Sombra só para o que flutua sobre a página (menu, diálogo, FAB, snackbar) ou para a ação principal em repouso; o controle de estudar perde a sombra quando o cronômetro corre.

## Shapes

Escala de cantos Material: 8px (campos, chips, rótulos, snackbar, tooltip, segmentos internos), 12px (itens de menu, balões), 16px (menus, caixas agrupadoras, FAB, item de lista), 20px (indicadores, item selecionado, faixa de meta concluída), 28px (cartões, diálogos, topo das folhas inferiores; 24px nos cartões do celular) e pílula (botões, navegação, busca, barras de progresso, dias do calendário).

Bordas regulares por escolha do usuário: ícones dos indicadores em círculo; anel do ciclo com progresso em arco liso (raio 87) sobre trilho reto; barras de progresso de 8px em pílula. Folhas inferiores no celular têm alça de 32×4px.

**The Fixed-Shape Rule.** Botões não mudam de forma ao pressionar (decisão do usuário); o retorno vem da camada de cor do hover/pressionado. O item selecionado da lista vai de 16 para 20px, com a mola.

## Components

### Buttons
Pílulas firmes que se achatam no toque.
- **Shape:** pílula (999px), igual ao pressionar.
- **Filled:** primary sobre on-primary, 40px de altura, 8px 24px; ao passar o mouse, camada de 8% de on-primary e Nível 1.
- **Tonal / pequeno:** secondary-container, 32px, 6px 16px, 0.8125rem.
- **Texto:** primary em pílula transparente, camada de 8% de primary no hover.
- **Ícone:** círculo transparente na cor secundária, camada de 10% no hover; estados "ligado" em primary, "aviso" em tertiary.
- **Disabled:** 12% de tinta no fundo, 38% no texto.
- **Motion:** cor e sombra em `.2s cubic-bezier(.2,0,0,1)`; forma em `.35s cubic-bezier(.42,1.67,.21,.9)`. Sem transição com `prefers-reduced-motion`.

### Controle de estudar (assinatura)
Botão estendido de 56px, primary com ícone de 22px e Nível 1. Correndo: secondary-container, quadrado de 16px, sem sombra. Meta passada: tertiary-container. No modo foco, os botões crescem para 56px em pílula; os botões de ícone grandes têm 56px e fundo surface-container-highest.

### Segmented buttons
Grupo conectado com 2px de vão, segmentos de 40px em surface-container-highest com cantos internos de 8px e externos de 20px; o selecionado vira pílula inteira em primary.

### Chips e rótulos
- **Rótulo:** 8px de canto, secondary-container; exclusão em error-container; questão em surface-container-highest; concluído em success-container.
- **Chip de filtro:** 32px, contorno outline-variant, fundo transparente, 8px de canto.

### Cards / Containers
- **Corner Style:** 28px (24px no celular); indicadores e blocos de estatística 20px.
- **Background:** surface-container-lowest sobre a página surface-container; no escuro, surface-container sobre #0E1416.
- **Shadow Strategy:** nenhuma (ver The Tonal Container Rule).
- **Border:** nenhuma; caixas agrupadoras internas usam 1px outline-variant e 16px.
- **Internal Padding:** 20px (16px no celular).

### Listas
Itens conectados com 2px de vão e 16px de canto; o item atual vira secondary-container com 20px. Subtítulos de data em primary, 0.875rem/600, sem faixa de fundo. Divisórias em outline-variant.

### Inputs / Fields
- **Style:** contornados, 1px outline, 8px de canto, fundo transparente, 40px de altura mínima.
- **Hover / Focus:** borda em tinta no hover; no foco, borda primary com 1px interno extra (2px no total), sem outline externo.
- **Error:** borda e anel interno em error.
- **Busca:** a exceção preenchida — pílula de 48px em surface-container-high, sem borda, foco com anel interno de 2px primary.

### Menus
surface-container, 16px de canto, Nível 2, 4px de respiro; itens de 44px com 12px de canto, camada de 8% no hover, item atual em secondary-container.

### Dialogs / Bottom sheets
surface-container-high, 28px, Nível 3, 24px de respiro, véu de 32%. Até 600px os diálogos maiores viram folhas inferiores encostadas no rodapé, com só os cantos de cima arredondados e alça.

### Navigation
- **Rail expandido (240px):** itens de 56px em pílula, ícone de 24px, 0.9375rem/500; ativo em secondary-container com 600.
- **Rail recolhido (96px) e barra de navegação:** indicador em pílula de 56×32 atrás do ícone (secondary-container); rótulo de 0.75rem abaixo, 700 em tinta quando ativo. Barra do celular em surface-container, sem sombra.

### Snackbar e tooltip
Superfície invertida, 8px de canto; snackbar de 48px com Nível 3 e ação em inverse-primary.

### Anel do ciclo (assinatura)
SVG com dois anéis: interno de segmentos por disciplina (os não atuais a 32% da cor) e externo com trilho reto em secondary-container e progresso em arco liso na cor da disciplina, ponta arredondada. Centro com estado, tempo em 20px/700 tabular e meta.

## Do's and Don'ts

### Do:
- **Do** tirar toda cor de interface dos papéis `--m-*` e manter claro e escuro em par.
- **Do** separar superfícies da página por degrau de surface-container, sem sombra e sem borda.
- **Do** marcar o atual com secondary-container em pílula (navegação) ou 20px (lista).
- **Do** usar camada de estado por `color-mix` de 8% (10% em botões de ícone) para hover.
- **Do** animar forma com `cubic-bezier(.42,1.67,.21,.9)` em .35s e cor com `cubic-bezier(.2,0,0,1)` em .2s, e desligar ambas com `prefers-reduced-motion`.
- **Do** ligar ROND 100 em títulos e números grandes e tabular-nums em tempos.

### Don't:
- **Don't** pôr sombra ou borda em cartões, indicadores, rail ou barra de navegação.
- **Don't** usar `filter: brightness` ou transform de "levantar" para hover; o estado é tonal.
- **Don't** usar cores de disciplina em botões, navegação ou superfícies.
- **Don't** usar campos preenchidos fora da busca; campos são contornados de 8px.
- **Don't** usar o limão (tertiary) como decoração; ele é aviso.
