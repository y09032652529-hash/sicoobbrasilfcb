# Copia local do site original

Esta versao voltou a carregar o app compilado original do site, com os mesmos bundles, CSS, imagens, rotas e comportamento de frontend.

## Rodar

```bash
python3 server.py
```

Acesse:

```text
http://127.0.0.1:4173/
```

## Observacoes

- As rotas tambem existem como pastas com `index.html`, para evitar 404 em hospedagem estatica.
- Tambem existem atalhos visuais numerados:
  - `01` a `29` para as paginas principais do fluxo.
  - `upsells/01` a `upsells/06` somente para as paginas de upsell.
- Os links de checkout externo foram convertidos para rotas locais equivalentes, para o fluxo continuar dentro do projeto.
- Scripts de tracking externos ficam bloqueados por `local-guard.js`.
- O frontend original ainda e um app compilado. Para ficar 100% igual ao site original, esta e a forma correta; reescrever tudo nativamente exigiria reconstruir cada tela e regra manualmente.

## Atalhos numerados

```text
01 -> /
02 -> /resultado
03 -> /validar
04 -> /confirmacao
05 -> /sucesso
06 -> /consulta-valores
07 -> /valores-disponiveis
08 -> /simulacao-credito
09 -> /verificacao-facial
10 -> /analisando-credito
11 -> /erro-verificacao
12 -> /emprestimo-aprovado
13 -> /detalhes-emprestimo
14 -> /selecionar-parcelas
15 -> /escolha-vencimento
16 -> /termos-emprestimo
17 -> /selecionar-chave-pix
18 -> /chat-atendente
19 -> /chat-gerente
20 -> /configurando-conta
21 -> /conta-digital
22 -> /saque
23 -> /transferencias
24 -> /penultima
25 -> /seguro-prestamista
26 -> /pagamento-iof
27 -> /sucesso-final
28 -> /politica-privacidade
29 -> /termos-de-uso
```

## Upsells

```text
upsells/01 -> /upsell
upsells/02 -> /upsell3
upsells/03 -> /upsell4
upsells/04 -> /upsell5
upsells/05 -> /upsell6
upsells/06 -> /upsell7
```
