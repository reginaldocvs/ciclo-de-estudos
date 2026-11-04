# Testes do Ciclo de Estudos

Testes automáticos que abrem o app num Chrome sem janela (puppeteer), fazem o que uma pessoa faria e conferem o resultado. Os dados em `dados/` são de exemplo; nenhum dado pessoal fica aqui.

## Preparar (uma vez)

```
cd testes
npm install
```

Precisa do Google Chrome instalado em `C:/Program Files/Google/Chrome/Application/chrome.exe`.

## Rodar

1. Na pasta do projeto, sirva o app: `python -m http.server 8765`
2. Na pasta `testes`, rode um grupo (ou os quatro em paralelo):

```
bash todos.sh 1   # simulação completa, varredura de telas, janelas
bash todos.sh 2   # revisões de bloco, foco, pausas, registro
bash todos.sh 3   # histórico, acertos, questões, setinhas, meta, alinhamento, sincronização (1 aparelho)
bash todos.sh 4   # sincronização com dois aparelhos (demora alguns minutos)
```

Cada linha sai `OK` ou `FALHA` com o motivo. Prints e arquivos de saída vão para `saida/` (fora do git).

## Outras ferramentas

- `node lint/explorador.mjs dados/rico.json 300 1,2 saida/explorador`: ações aleatórias com regras de coerência a cada passo.
- `node lint/simreal.mjs <dados> saida/sim ciclos|grupos [dias] [largura]`: uso realista por semanas.
- `node lint/simfoco.mjs <dados> saida/foco ciclos|grupos [dias] [largura]`: o mesmo, tudo pelo modo foco.
- `node lint/deadcode.mjs ../index.html`, `deadcss.mjs`, `deadact.mjs`: código, classes e ações sem uso.
