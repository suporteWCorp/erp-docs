# Caixas de aviso

Use sempre o tipo semântico correspondente. A cor é definida globalmente em `docs/assets/stylesheets/alerts.css`.

| Tipo | Quando usar |
| --- | --- |
| `prerequisite` | Dependências obrigatórias antes de iniciar |
| `requirement` | Permissões, configurações e exigências do procedimento |
| `fiscal` | Validações técnicas ou fiscais importantes |
| `caution` | Risco de erro ou impacto no processo |
| `information` | Explicação complementar e neutra |
| `success` | Confirmação, caminho correto ou dica positiva |

## Exemplos

```md
!!! prerequisite "Antes de começar"
    - Cliente cadastrado.
    - Material cadastrado.

!!! requirement "Permissão de acesso"
    Seu usuário deve possuir permissão para executar esta operação.

!!! fiscal "Validação fiscal"
    Confirme as regras fiscais com o responsável da empresa.

!!! caution "Atenção"
    Confira os dados antes de confirmar a operação.

!!! information "Informação"
    Esta informação complementa o procedimento.

!!! success "Resultado confirmado"
    O registro foi salvo e está disponível para uso.
```

Quando o mesmo texto for utilizado em vários Guias, crie um snippet em `docs/shared/avisos/` e referencie-o com `--8<--`.
