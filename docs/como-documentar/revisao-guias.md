# Revisão dos Guias

## Estado atual

O projeto possui 26 Guias de procedimento, além da página de visão geral.

Os 26 Guias utilizam o mesmo esqueleto editorial. A revisão operacional de cada procedimento continua dependendo de quem conhece a tela no WCorp.

## Estrutura adotada

### Seções essenciais

1. Título.
2. Pré-requisitos.
3. Avisos, quando aplicáveis.
4. Permissões.
5. Caminho.
6. Print do caminho, quando existir.
7. Como fazer.
8. Demonstração em vídeo, quando existir.
9. Outra opção e sua demonstração, quando existirem.
10. Quando utilizar.
11. Veja também.

### Seções opcionais

- O que conferir antes de salvar ou enviar.
- Impactos no Sistema.
- Dicas de suporte.

Uma seção opcional só deve existir quando houver conteúdo útil. Não devem ser publicados títulos vazios ou textos provisórios para completar o modelo.

## Como replicar

1. Use `docs/shared/modelos/guia-processo.md` como ponto de partida.
2. Preserve os passos, caminhos, imagens, vídeos e links úteis do Guia atual.
3. Mova cada informação para a seção correspondente sem reescrever regras operacionais por suposição.
4. Use as caixas definidas em `docs/como-documentar/caixas-de-aviso.md`.
5. Registre erros confirmados em `docs/assets/data/erros-comuns.json` e faça o Guia apontar para o identificador correspondente.
6. Valide o procedimento e os assets com alguém que conheça a tela antes da publicação.
