#!/bin/bash
# roda testes da bateria pelo nome, com os mesmos argumentos do todos.sh
cd "$(dirname "$0")"
O=saida;F=dados/exemplo.json
for n in "$@"; do
 c=$(grep -oE "r $n [^;]*" todos.sh | head -1 | sed "s/^r $n //")
 if [ -z "$c" ]; then
  case " bkskip bkmove bkstale bkitems qrow rfchk backnav rvfoco rvfmeta " in *" $n "*) c="node lint/$n.mjs $O/rvf 390";; esac
  case " noname pause onetab notetog tmd rvoff tvoff fixchk " in *" $n "*) c="node lint/$n.mjs dados $O/reg";; esac
  case " cicacert cicrvac cicnotopic regantes " in *" $n "*) c="node lint/$n.mjs $F $O/x.png";; esac
  case " edscroll edhead edatrow hsrow popcel " in *" $n "*) c="node lint/$n.mjs dados/data-rv2.json $O";; esac
  case " metaguia mvsetas mvtablet cyn5 " in *" $n "*) c="node lint/$n.mjs $F $O 390";; esac
 fi
 [ -z "$c" ] && { echo "?? $n"; continue; }
 out=$(eval "timeout 600 $c" 2>&1); rc=$?
 if [ $rc -ne 0 ] || echo "$out" | grep -qiE "^FALHA|EXCEÇÃO|pageerror|TypeError|ReferenceError"; then echo "FALHA $n"; echo "$out" | grep -iE "^FALHA|EXCEÇÃO|TypeError|ReferenceError" | head -3 | cut -c1-230 | sed 's/^/      /'; else echo "OK    $n"; fi
done
