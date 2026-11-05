#!/bin/bash
# Roda os testes do Ciclo de Estudos e resume: OK ou FALHA por teste. Uso: bash todos.sh <grupo 1|2|3|4>
# Antes: o app servido em http://localhost:8765/ (na pasta do projeto: python -m http.server 8765) e `npm install` nesta pasta.
cd "$(dirname "$0")"
O=saida
F=dados/exemplo.json
mkdir -p $O/reg $O/rvf $O/aci $O/shot
r(){ n="$1"; shift; out=$(timeout 900 "$@" 2>&1); if echo "$out" | grep -qiE "FALHA|EXCEÇÃO|pageerror|Error:"; then echo "FALHA $n"; echo "$out" | grep -iE "FALHA|EXCEÇÃO|pageerror|Error:" | head -4 | cut -c1-240 | sed 's/^/      /'; else echo "OK    $n"; fi; }
case "$1" in
1) r e2e node lint/e2e.mjs $O/reg; r sweep node lint/sweep.mjs $O/reg; r fitdlg node lint/fitdlg.mjs; r sheetall node lint/sheetall.mjs; r hdrpad node lint/hdrpad.mjs ;;
2) for t in bkskip bkmove bkstale bkitems qrow rfchk backnav rvfoco rvfmeta; do r $t node lint/$t.mjs $O/rvf 390; done; r swapanim node lint/swapanim.mjs 390
   for t in noname pause onetab notetog tmd rvoff tvoff fixchk; do r $t node lint/$t.mjs dados $O/reg; done ;;
3) r cyrv node lint/cyrv.mjs $O/reg; r blk node lint/blk.mjs $O/reg; r acitem node lint/acitem.mjs $O/aci 390; r bkac node lint/bkac.mjs
   r hist2 node lint/hist2.mjs dados/data-rv2.json "$O"; r rvtags node lint/rvtags.mjs dados/data-rv2.json "$O"
   for t in cicacert cicrvac cicnotopic regantes; do r $t node lint/$t.mjs $F "$O/x.png"; done
   r seldel node lint/seldel.mjs $F; r trvstart node lint/trvstart.mjs $F; r plnome node lint/plnome.mjs $F
   for t in edscroll edhead edatrow hsrow popcel; do r $t node lint/$t.mjs dados/data-rv2.json "$O"; done
   r irpara node lint/irpara.mjs "$O/x.png"; r acalign node lint/acalign.mjs
   for t in metaguia mvsetas mvtablet cyn5; do r $t node lint/$t.mjs $F "$O" 390; done; r notif node lint/notif.mjs $F; r fmrev node lint/fmrev.mjs
   r refazer node lint/refazer.mjs $F "$O" 390; r refazerD node lint/refazer.mjs $F "$O" 1280; r paginas node lint/paginas.mjs $F "$O" 390; r paginasD node lint/paginas.mjs $F "$O" 1280; r paginas2 node lint/paginas2.mjs $F "$O" 390; r paginas2D node lint/paginas2.mjs $F "$O" 1280; r sessoes node lint/sessoes.mjs $F "$O" 390; r sessoesD node lint/sessoes.mjs $F "$O" 1280; r sessoes2 node lint/sessoes2.mjs $F "$O" 390; r sessoes2D node lint/sessoes2.mjs $F "$O" 1280
   r qolinks node lint/qolinks.mjs $F "$O"; r qonome node lint/qonome.mjs $F "$O"; r qnlong node lint/qnlong.mjs $F "$O"; r syncfix node lint/syncfix.mjs $F "$O"; r sygate node lint/sygate.mjs $F "$O"
   r tpclamp node lint/tpclamp.mjs $F "$O"; r pdaddlist node lint/pdaddlist.mjs dados/rico.json "$O"; for w in 390 1280; do r alinha1-$w node lint/alinha1.mjs dados/rico.json "$O" $w; done; r bkremind node lint/bkremind.mjs $F "$O" ;;
4) r simsync node lint/simsync.mjs $F "$O"; r simsync2 node lint/simsync2.mjs $F "$O"; r simsync3 node lint/simsync3.mjs $F "$O"; r syncidle node lint/syncidle.mjs $F "$O"; r syncwarn node lint/syncwarn.mjs $F "$O" ;;
esac
