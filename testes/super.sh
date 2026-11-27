#!/bin/bash
# Super check: bateria inteira + simulações + explorador + auditoria (dados sintéticos)
# + simulação de Questões (simqz) e, com a cópia do backup mais recente, simreal ciclos/grupos e simqz com os dados reais (desde 2026-11-26)
# PLANOS=2 entra só depois de perguntar ao usuário; para deixar de fora: SEMPLANOS=1 bash super.sh
cd "$(dirname "$0")"
D=dados/rico.json;O=saida/super;mkdir -p $O/rq $O/srv $O/p2 $O/fc $O/fg $O/z $O/explo $O/aud
for g in 1 2 3 4; do out=$(bash todos.sh $g 2>&1); echo "bateria $g: $(echo "$out" | grep -c '^OK') OK, $(echo "$out" | grep -c '^FALHA') falhas"; echo "$out" | grep -A3 '^FALHA'; done
s(){ n="$1"; shift; out=$(timeout 1500 env "$@" 2>&1); rc=$?; echo "$n rc=$rc ok=$(echo "$out" | grep -c '^OK') falhas=$(echo "$out" | grep -c 'FALHA')"; echo "$out" | grep 'FALHA' | head -5 | cut -c1-220; }
s "simreal RQ ciclos" RQ=1 node lint/simreal.mjs $D $O/rq ciclos
s "simreal SRV grupos" SRV=1 node lint/simreal.mjs $D $O/srv grupos
[ -z "$SEMPLANOS" ] && s "simreal PLANOS=2" PLANOS=2 CYN=2 node lint/simreal.mjs $D $O/p2 ciclos
s "simqz (Questões)" node lint/simqz.mjs $D 14 390
B=$(ls -t ../backups/ciclo-de-estudos-backup-*.json 2>/dev/null | head -1)
if [ -n "$B" ]; then cp "$B" $O/real.json;mkdir -p $O/rc $O/rg;echo "== com os dados reais ($B)"
 s "simreal ciclos (reais)" node lint/simreal.mjs $O/real.json $O/rc ciclos
 s "simreal grupos (reais)" node lint/simreal.mjs $O/real.json $O/rg grupos
 s "simqz (reais)" node lint/simqz.mjs $O/real.json 14 390
fi
s "simfoco ciclos" X=1 node lint/simfoco.mjs $D $O/fc ciclos
s "simfoco grupos" X=1 node lint/simfoco.mjs $D $O/fg grupos
s "simzero REP" REP=1 node lint/simzero.mjs $O/z
echo "== explorador"; timeout 2400 node lint/explorador.mjs $D 300 1,2 $O/explo 2>&1 | grep -E "PROBLEMAS|^- |primeira vez|últimos passos" | head -20
echo "== auditoria"; timeout 1500 node lint/auditoria.mjs $D $O/aud 2>&1 | tail -3
