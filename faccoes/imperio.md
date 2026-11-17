# Império da Gran' Vália

**Estado: proposta para revisão e teste; implementada parcialmente no protótipo.** Valores e efeitos abaixo não são regras finais aprovadas. O Império coleta recursos, constrói tecnologias em regiões distintas, paga impostos para pontuar e pode ganhar pontos ao destruir construções inimigas.

O cenário inicial está em [Mapa](../regras/mapa.md); as regras comuns de domínio e combate estão em [Regras gerais](../regras/regras-gerais.md) e [Combate](../regras/combate.md).

## Componentes e funcionamento propostos

- Ao coletar, receba um recurso do tipo disponível na região escolhida.
- Cada construção de tecnologia ocupa uma região controlada. Máximo de uma construção imperial por região. Efeitos de construções do mesmo tipo não se acumulam; escolha uma para cada efeito. Níveis 1 e 2 não têm cadeia de pré-requisito proposta.
- Embaralhe os impostos, revele um e permita pagá-lo uma vez na ação correspondente, entregando os recursos e removendo o soldado indicado. Pontue o valor impresso e revele o próximo; impostos pagos não retornam na partida de teste. Se esgotarem, não há novos até outra decisão.
- **Prazo em teste:** a cada rodada encerrada sem pagamento, acrescente atraso. Ao atingir três, remova uma construção imperial de maior nível, escolhida pelo jogador em caso de empate; descarte o imposto sem pontuar, revele o próximo e zere o atraso. Sem construção, descarte sem perda adicional. O imposto novo não recebe atraso nessa mesma verificação. O protótipo original mencionava três turnos; rodadas são hipótese de teste.
- Ao destruir uma construção inimiga, pontue 2 por construção, sujeito às regras comuns de combate e às pendências de destruição.

## Tecnologias propostas

| Construção | Nível | Custo | Efeito |
| --- | ---: | --- | --- |
| Serraria | 1 | 1 Madeira | Uma vez por ação de coleta, se coletar Madeira, receba mais 1 Madeira. |
| Casa da Moeda | 1 | 1 Madeira e 1 Ouro | Uma vez por ação de coleta, se coletar Ouro, receba mais 1 Ouro. |
| Quartel | 1 | 2 Madeiras | Ao usar Alistamento, adicione 1 soldado extra na região do Quartel, se controlada. |
| Fortaleza | 2 | 2 Madeiras e 1 Ouro | Na primeira rodada de cada batalha na região, ignore 1 dano às unidades imperiais. |
| Oficina de Engenharia | 2 | 1 Madeira e 2 Ouros | Ao usar O Progresso, reduza em 1 Madeira o custo da construção, até mínimo zero. |

Efeitos de coleta aplicam-se uma vez por ação e não criam recurso sem coleta válida. Fortaleza não substitui uma reação nem gasta marcador.

## Baralho principal proposto

| Carta | Cópias | Região ou condição | Efeito proposto |
| --- | ---: | --- | --- |
| Marcha Imperial | 3 | Região com inimigos, adjacente a soldados imperiais | Mova até 3 soldados de regiões adjacentes para a região selecionada e inicie uma batalha. |
| Guarda Imperial | 2 | Região onde suas unidades são atacadas | Reação proposta: consuma um marcador disponível em qualquer região e ignore até 2 danos às suas unidades na primeira rodada da batalha. |
| Tambores de Guerra | 2 | Região com inimigos, adjacente a soldados imperiais | Mova até 2 soldados adjacentes e inicie batalha; ignore 1 dano às suas unidades na primeira rodada. |
| Alistamento | 3 | Região controlada | Pague 1 Ouro e adicione 2 soldados. |
| O Progresso | 3 | Região controlada sem construção imperial | Pague o custo de uma tecnologia disponível e construa-a. |
| Assegurar Recursos para o Rei | 3 | Região com recurso disponível | Colete 1 recurso; descarte cópias adicionais da mão para coletar mais 1 do mesmo tipo por cópia. |
| Reorganizar Contingente | 2 | Região com soldados imperiais | Mova até 3 soldados para uma região adjacente. |
| Aliança com o Império | 1 | Região com outro jogador | Proponha receber até 2 recursos em troca de até 2 seus; se aceito, façam a troca. |
| Posto de Trocas | 1 | Região controlada | Troque até 2 recursos seus por igual quantidade do outro tipo. |
| Pagamento de Impostos | 2 | Região controlada | Pague o imposto ativo e pontue seu valor, se puder arcar com o custo. |
| **Total** | **22** | | |

Guarda Imperial é proposta explicitamente reativa, disponível no protótipo apenas como opção de teste. Sua inclusão e elegibilidade ainda dependem de revisão; não se pressupõe reação nas demais cartas.

## Baralho de impostos proposto

| Custo | Pontos | Cópias |
| --- | ---: | ---: |
| 1 Ouro | 2 | 1 |
| 1 Ouro e 1 Madeira | 2 | 3 |
| 2 Ouros e 1 Madeira | 3 | 2 |
| 1 Madeira e 1 soldado | 3 | 2 |
| 1 Madeira, 1 Ouro e 1 soldado | 4 | 1 |

O protótipo original menciona impostos de 2 a 5 pontos, mas lista somente 2 a 4. A proposta preserva os nove listados, sem inventar um de 5 pontos.

**Pendente:** aprovação da facção e de suas cartas, suprimento das construções, balanço dos impostos e prazo, efeito combinado de Fortaleza e Guarda, soldado removido e reposição do baralho. Os detalhes dos testes e diferenças ficam em [Estado do protótipo](../prototipo/estado-e-testes.md).
