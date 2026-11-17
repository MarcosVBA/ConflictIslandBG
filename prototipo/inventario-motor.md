# Inventário inicial para separação do motor

**Estado: primeira extração implementada; migração em andamento.** As regras de design e suas pendências continuam nos módulos de [regras](../regras/regras-gerais.md), [combate](../regras/combate.md), [mapa](../regras/mapa.md) e facções. Implementação atual não aprova hipóteses de teste.

| Responsabilidade | Situação atual | Referência de comportamento |
| --- | --- | --- |
| Vizinhança e domínio | Funções extraídas para `jogo/motor/base.js`; dados do mapa continuam no HTML | `testes/validar-motor-base.cjs`, `testes/validar-documentacao.cjs` |
| Construções e devastação | Contagem e condição extraídas; mutações e habilidades permanecem no HTML | `testes/validar-motor-base.cjs`, `testes/validar-novas-habilidades.cjs` |
| Recursos | Cálculo de recebimento e pagamento extraído; pontos piratas e acordos continuam na orquestração atual | `testes/validar-motor-base.cjs`, `testes/validar-necromante.cjs` |
| Mão e alternância | Cálculo de compra e próxima facção disponível extraídos; a preparação e a ordem de fases continuam no HTML | `testes/validar-motor-base.cjs`, `testes/validar-fluxo-dinamico.cjs` |
| Liderança | Validação de lance e escolha do próximo ofertante extraídas; encerramento e interface permanecem no HTML | `testes/validar-lideranca.cjs` |
| Cartas, escolhas e habilidades de facção | Regras, leitura de controles e alterações de estado ainda misturadas | `testes/validar-elfos.cjs`, `testes/validar-necromante.cjs`, `testes/validar-novas-habilidades.cjs` |
| Combate e reações | Cálculo de dano extraído; rolagem e aplicação continuam no HTML; Canção de paz e reações têm cobertura simulada | `testes/validar-fluxo-dinamico.cjs` |
| Pontuação e encerramento | Implementação ainda no HTML; seis rodadas e empate compartilhado continuam hipótese de teste | `testes/validar-fluxo-dinamico.cjs`, `testes/validar-elfos.cjs` |
| Interface aprovada | Demonstração separada, ainda com dados ilustrativos e sem ligação ao motor | `testes/validar-mesa-conceito.cjs` |

A cópia do módulo incorporada ao HTML é gerada por `node scripts/sincronizar-motor.cjs`; a verificação de sincronização roda na CI. A cópia existe para preservar a abertura local do jogo sem servidor. As funções extraídas que calculam saldo ou compra retornam cópias; os adaptadores do HTML aplicam o resultado ao estado existente. Embaralhamento é passado como dependência para a compra, permitindo testes determinísticos.

As validações usam Node e DOM substituto; não provam apresentação visual, todas as escolhas, ordem completa dos efeitos ou uma partida real. O próximo incremento deve extrair estado e transições de fases e de leilão com escolhas explícitas; depois cartas e combate, conforme o [plano de evolução](plano-evolucao-jogo.md). Não alterar protótipos legados.
