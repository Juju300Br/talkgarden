# Como continuar o TalkGarden no notebook

Este guia explica como deixar o projeto funcionando no seu notebook e como trabalhar nos dois
computadores (empresa e casa) sem perder nada.

> **Resumo rápido:** instale o Git e o XAMPP → baixe o projeto do GitHub para dentro de
> `C:\xampp\htdocs` → ligue o Apache e o MySQL → importe o `banco/banco.sql` → abra
> `http://localhost/talkgarden`.

---

## 1. O que precisa instalar

| Programa | Para que serve | Onde baixar |
|---|---|---|
| **Git** | Baixar e enviar o projeto para o GitHub | https://git-scm.com/download/win |
| **XAMPP 8.2** | Apache (servidor), PHP e MySQL (banco de dados) | https://www.apachefriends.org (versão **8.2**, a mesma do outro computador) |
| **Navegador** | Abrir o site (Chrome, Edge ou Firefox) | Já vem no Windows |
| **VS Code** *(opcional)* | Editar o código com cores e atalhos | https://code.visualstudio.com |
| **Claude Code** *(opcional)* | Continuar o projeto com o Claude. Ele lê o `CLAUDE.md` sozinho | https://claude.com/claude-code |

**Dicas na instalação:**
- **Git:** pode clicar em "Next" em tudo. As opções padrão servem.
- **XAMPP:** instale em `C:\xampp`, que é o padrão. Se o Windows perguntar sobre o firewall, clique em **Permitir**.

---

## 2. Configurar o Git (só na primeira vez)

Abra o **Git Bash** (procure no menu Iniciar) e digite, trocando pelos seus dados:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

Use o mesmo e-mail da sua conta do GitHub, para os commits aparecerem no seu nome.

---

## 3. Baixar o projeto

O projeto precisa ficar **dentro da pasta `htdocs` do XAMPP**, porque é de lá que o Apache lê os sites.

No **Git Bash**:

```bash
cd /c/xampp/htdocs
git clone https://github.com/Juju300Br/talkgarden.git
```

- O repositório é **privado**, então vai abrir uma janela pedindo para entrar no GitHub. Faça login com a sua conta.
- No final, o projeto vai estar em `C:\xampp\htdocs\talkgarden`.

> No computador da empresa, o projeto fica em `C:\users\user\talkgarden`, e existe um "atalho"
> (junction) em `htdocs` apontando para lá. No notebook não precisa disso: é só clonar direto no `htdocs`.

---

## 4. Ligar o servidor e criar o banco

1. Abra o **XAMPP Control Panel** (`C:\xampp\xampp-control.exe`).
2. Clique em **Start** no **Apache** e no **MySQL**. Os dois devem ficar verdes.
3. Abra http://localhost/phpmyadmin no navegador.
4. Clique na aba **Importar** → **Escolher arquivo** → selecione
   `C:\xampp\htdocs\talkgarden\banco\banco.sql` → clique em **Importar** (lá embaixo).
5. Na lista da esquerda, deve aparecer o banco **talkgarden** com 5 tabelas.

### ⚠️ Importante: o banco de dados NÃO vai pelo Git

O Git leva só o **código**. As contas, as atividades, as moedas e as medalhas ficam no MySQL **de cada
computador**. Então:

- No notebook, o banco começa **vazio**. É só criar uma conta nova pela tela de cadastro.
- O que você jogar no notebook não aparece no computador da empresa, e vice-versa. Isso é normal.

**Se quiser levar os dados de um computador para o outro** *(opcional)*:
1. No computador de origem: phpMyAdmin → clique no banco `talkgarden` → aba **Exportar** → **Executar**. Vai baixar um arquivo `.sql`.
2. No outro computador: phpMyAdmin → aba **Importar** → escolha esse arquivo.
3. **Não coloque esse arquivo no Git.** Ele tem e-mails e dados das contas.

---

## 5. Testar

1. Abra http://localhost/talkgarden/teste_conexao.php.
   Deve aparecer **"✔ Conexão com o banco funcionando!"** e as 4 medalhas.
2. Abra http://localhost/talkgarden e crie uma conta.

---

## 6. Trabalhando nos dois computadores (rotina do dia a dia)

A regra de ouro: **sempre `pull` ao começar e `push` ao terminar.**

Abra o Git Bash dentro da pasta do projeto (no notebook: `cd /c/xampp/htdocs/talkgarden`).

**Ao começar a trabalhar**, para pegar o que foi feito no outro computador:

```bash
git pull
```

**Ao terminar**, para mandar o que você fez para o GitHub:

```bash
git add -A
git commit -m "Descreva aqui o que você fez"
git push
```

Dicas:
- Se esquecer o `pull` e editar o mesmo arquivo nos dois computadores, o Git pode avisar de **conflito**.
  Se isso acontecer, não apague nada e peça ajuda (ou peça ao Claude Code para resolver).
- Para ver se tem algo que ainda não foi enviado: `git status`.

### E se o banco mudar numa etapa futura?

Se alguma etapa mudar o `banco/banco.sql` (por exemplo, uma tabela nova), o aviso vai estar na
mensagem do commit. Nesse caso, depois do `git pull`, importe o `banco.sql` de novo no phpMyAdmin.

---

## 7. Problemas comuns

| Problema | O que fazer |
|---|---|
| **Apache não fica verde** | Outro programa está usando a porta 80 (Skype, IIS, outro servidor). Feche esse programa e tente de novo. No XAMPP, o botão **Logs** mostra o erro. |
| **MySQL não fica verde** | Provavelmente já existe outro MySQL instalado usando a porta 3306. Pare esse outro MySQL em *Serviços do Windows* ou desinstale. |
| **"Erro ao conectar com o banco de dados"** | O MySQL está desligado ou o `banco.sql` não foi importado. Veja os passos 4 e 5. |
| **"Not Found" / página não encontrada** | A pasta não está em `C:\xampp\htdocs\talkgarden`. Confira o nome e o lugar da pasta. |
| **Acentos estranhos (ex.: "SequÃªncia")** | O banco foi importado com uma versão antiga do script. Apague o banco `talkgarden` no phpMyAdmin (aba **Operações** → **Remover o banco**) e importe o `banco.sql` de novo. |
| **`git push` pede login ou dá erro de permissão** | Faça login com a conta do GitHub dona do repositório (`Juju300Br`). |
| **"Esqueceu a senha?", Perfil ou outra página dá "Not Found"** | Algumas páginas ainda vão ser feitas nas próximas etapas (veja a seção 8 do `CLAUDE.md`). |

---

## 8. Ao parar de usar o computador da empresa

Como o computador da empresa não é seu:

- **Login do GitHub:** o Windows guardou o seu login. Para remover, abra o menu Iniciar →
  **Gerenciador de Credenciais** → **Credenciais do Windows** → apague a que tem `git:https://github.com`.
- **XAMPP:** se não for mais usar lá, desinstale pelo *Painel de Controle → Programas*.
- **Pasta do projeto:** antes de apagar `C:\users\user\talkgarden`, confira que está tudo enviado
  (`git status` deve dizer *"nothing to commit, working tree clean"*, e `git push` deve dizer *"Everything up-to-date"*).
