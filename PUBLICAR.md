# Como publicar o Ciclo de Estudos

Objetivo: abrir o app em qualquer computador ou celular, fora do claude.ai, de graça, com os dados sincronizados pela sua conta Google.

- **Hospedagem:** GitHub Pages (grátis).
- **Dados:** Firebase, com login Google e banco Firestore (plano gratuito "Spark").

O código já está pronto. Faltam as contas e algumas configurações, que só você pode fazer.

---

## Parte 1: Firebase (login e banco de dados)

1. Acesse **https://console.firebase.google.com** com sua conta Google.
2. Clique em **Criar um projeto** (ou "Adicionar projeto"), dê o nome `ciclo-de-estudos` e avance. O Google Analytics pode ser desativado.
3. **Login com Google:**
   - No menu, abra **Criação → Authentication → Vamos começar**.
   - Em **Método de login**, escolha **Google**, clique em **Ativar**, escolha o e-mail de suporte e clique em **Salvar**.
4. **Banco de dados:**
   - Abra **Criação → Firestore Database → Criar banco de dados**.
   - Local: **southamerica-east1 (São Paulo)**.
   - Modo: **produção**.
5. **Regras de segurança:**
   - No Firestore, abra a aba **Regras**.
   - Apague o conteúdo e cole o do arquivo [`firestore.rules`](firestore.rules) deste projeto.
   - Clique em **Publicar**. Assim cada conta só enxerga os próprios dados.
6. **Configuração do app:**
   - Clique na engrenagem → **Configurações do projeto** → em **Seus apps**, clique no ícone **Web** (`</>`).
   - Dê um apelido (ex.: `ciclo-web`) e clique em **Registrar app**. Não precisa marcar o Firebase Hosting.
   - Aparece um bloco `const firebaseConfig = { apiKey: "...", authDomain: "...", projectId: "...", ... }`. **Copie esse bloco e me envie.** Esses dados não são senha: são públicos por natureza, e quem protege seus dados são as regras do passo 5.

## Parte 2: GitHub (hospedagem)

1. Crie uma conta em **https://github.com** (se ainda não tiver).
2. Clique em **New repository**:
   - Nome: `ciclo-de-estudos`.
   - Visibilidade: **Public**. No plano gratuito, o GitHub Pages só funciona com repositórios públicos. O código fica visível, mas **os seus dados de estudo não**: eles ficam no Firebase, protegidos pelas regras.
   - Não marque "Add a README".
   - Clique em **Create repository** e **me envie o endereço** (ex.: `https://github.com/seu-usuario/ciclo-de-estudos`).
3. Eu conecto o projeto ao repositório e envio os arquivos. No primeiro envio, o Windows abre uma janela de login do GitHub: **o login é feito por você**.
4. No repositório, abra **Settings → Pages**:
   - **Source:** Deploy from a branch.
   - **Branch:** `main` e pasta `/ (root)`.
   - Clique em **Save**.
   - Em cerca de 1 minuto, o app fica em `https://seu-usuario.github.io/ciclo-de-estudos/`.

## Parte 3: Liberar o endereço no Firebase

1. No Firebase, abra **Authentication → Configurações → Domínios autorizados → Adicionar domínio**.
2. Adicione `seu-usuario.github.io` (só o domínio, sem `https://` e sem `/ciclo-de-estudos`).

## Pronto

Abra o endereço do GitHub Pages, vá em **Configurações → Seus dados → Entrar com Google**. Faça o mesmo em cada computador ou celular. A primeira vez que você entrar, os dados deste navegador sobem para a nuvem. Nos outros aparelhos, eles descem sozinhos.
