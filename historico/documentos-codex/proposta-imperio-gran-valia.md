# Império da Gran' Vália — proposta de facção para teste

**Estado:** proposta de finalização para revisão e testes, baseada no protótipo do Império. Os novos valores e efeitos abaixo são sugestões, não regras já aprovadas. O baralho principal contém 22 cartas; o baralho de impostos é separado.

## Identidade

O Império cresce de modo metódico: coleta madeira e ouro, constrói tecnologias em regiões diferentes e decide quando desviar recursos e soldados para pagar impostos. É capaz de atacar e ganha pontos ao destruir construções, mas precisa defender seus investimentos espalhados. A negociação pode ajudar a obter recursos sem uma guerra.

## Componentes e regras propostas para a facção

- **Recursos:** ouro e madeira. Ao coletar, receba um recurso do tipo disponível na região escolhida; uma região sem o recurso indicado não permite essa coleta.
- **Construções de tecnologia:** cada construção ocupa uma região controlada e concede seu efeito enquanto permanecer nela. Máximo de uma construção imperial por região. Os efeitos de construções de mesmo tipo não se acumulam: escolha uma para aplicar a cada efeito. O controle de uma região e a destruição de construções dependem das regras comuns ainda a definir.
- **Níveis:** cada tipo de tecnologia tem nível 1 ou 2, indicado abaixo. Não há cadeia de pré-requisito proposta. Ao construir, escolha e pague o custo de uma tecnologia disponível; respeite os componentes físicos definidos no teste.
- **Tributos:** embaralhe as nove cartas de imposto listadas abaixo e revele uma. Enquanto estiver ativa, o Império pode pagá-la uma vez em sua ação de imposto, entregando os recursos e removendo do tabuleiro o soldado indicado. Pontue o valor impresso e revele a próxima; impostos pagos não retornam nesta partida de teste. Se acabarem, não há novos impostos até decidir uma regra de reposição.
- **Prazo:** ao final de cada rodada em que o imposto ativo não foi pago, coloque um marcador de atraso. Ao atingir três, remova uma construção imperial de maior nível, escolhida pelo jogador em caso de empate, e descarte o imposto sem pontuar; revele o próximo e zere o atraso. Se não houver construção, descarte o imposto sem perda adicional. O novo imposto começa com zero atraso e não recebe atraso naquela mesma verificação. Prazo em rodadas é uma hipótese para teste: o protótipo original diz três turnos.
- **Destruição:** ao destruir uma construção inimiga, pontue 2 por construção. A definição de destruição e o momento da pontuação dependem das regras comuns.

## Tecnologias propostas

| Construção | Nível | Custo | Efeito |
| --- | ---: | --- | --- |
| Serraria | 1 | 1 madeira | Uma vez por ação de coleta, se coletar madeira, receba mais 1 madeira. |
| Casa da Moeda | 1 | 1 madeira e 1 ouro | Uma vez por ação de coleta, se coletar ouro, receba mais 1 ouro. |
| Quartel | 1 | 2 madeiras | Ao usar Alistamento, adicione 1 soldado extra na região do Quartel, se controlada. |
| Fortaleza | 2 | 2 madeiras e 1 ouro | Na primeira rodada de cada batalha na região desta construção, ignore 1 dano às unidades imperiais. |
| Oficina de Engenharia | 2 | 1 madeira e 2 ouros | Ao usar O Progresso, reduza em 1 madeira o custo da construção, até um mínimo de zero madeira. |

Efeitos de coleta aplicam-se apenas uma vez por ação. Bônus de batalha não substituem uma carta de reação e não gastam marcador; testar se a Fortaleza fica forte demais. Nenhum efeito cria recurso retroativamente ou sem uma coleta válida.

## Baralho principal — 22 cartas

| Carta | Cópias | Região ou condição | Efeito proposto |
| --- | ---: | --- | --- |
| Marcha Imperial | 3 | Região com inimigos, adjacente a soldados imperiais | Mova até 3 soldados de regiões adjacentes para a região selecionada e inicie uma batalha. |
| Guarda Imperial | 2 | Região onde suas unidades são atacadas | **Reação:** consuma um marcador seu ainda disponível, em qualquer região. Ignore até 2 danos às suas unidades na primeira rodada desta batalha. |
| Tambores de Guerra | 2 | Região com inimigos, adjacente a soldados imperiais | Mova até 2 soldados de regiões adjacentes para a região selecionada e inicie uma batalha. Ignore 1 dano às suas unidades na primeira rodada. |
| Alistamento | 3 | Região controlada | Pague 1 ouro e adicione 2 soldados na região. |
| O Progresso | 3 | Região controlada sem construção imperial | Pague o custo de uma tecnologia disponível e construa-a na região. |
| Assegurar Recursos para o Rei | 3 | Região com recurso disponível | Colete 1 recurso da região. Você pode descartar cópias adicionais desta carta da mão para coletar mais 1 recurso do mesmo tipo por cópia descartada. |
| Reorganizar Contingente | 2 | Região com soldados imperiais | Mova até 3 soldados da região selecionada para uma região adjacente. |
| Aliança com o Império | 1 | Região com outro jogador | Proponha receber até 2 recursos em troca de até 2 recursos seus. Se o outro jogador aceitar, façam a troca; caso contrário, a carta não tem efeito adicional. |
| Posto de Trocas | 1 | Região controlada | Troque até 2 recursos seus por igual quantidade do outro tipo. |
| Pagamento de Impostos | 2 | Região controlada | Pague o imposto ativo e pontue seu valor, se conseguir arcar com todos os custos. |
| **Total** | **22** | | |

**Uso das cartas:** as ações usam marcadores conforme o GDD em desenvolvimento. Guarda Imperial é uma proposta explícita de reação; seu uso e limite por batalha dependem das regras comuns ainda não fechadas. Não há pressuposto de reação para as demais cartas.

## Baralho de impostos — 9 cartas propostas a partir do protótipo

| Custo | Pontos | Cópias |
| --- | ---: | ---: |
| 1 ouro | 2 | 1 |
| 1 ouro e 1 madeira | 2 | 3 |
| 2 ouros e 1 madeira | 3 | 2 |
| 1 madeira e 1 soldado | 3 | 2 |
| 1 madeira, 1 ouro e 1 soldado | 4 | 1 |

O protótipo menciona impostos entre 2 e 5 pontos, mas lista apenas valores de 2 a 4; esta proposta preserva os nove impostos listados sem inventar um de 5 pontos.

## Validação necessária

1. Testar contra a meta global de média de 3 pontos por jogador por rodada, com 1 relativamente acessível e 5 excepcional; não assumir que a proposta já atinge esses valores.
2. Verificar se somente duas cartas de Pagamento de Impostos, prazo de três rodadas e reposição da mão permitem pagar impostos com frequência suficiente, especialmente no início.
3. Definir recursos, soldados, construções e mão iniciais para o teste, além do suprimento e limite de cada construção; evitar inventar parâmetros globais.
4. Testar o poder combinado de Fortaleza e Guarda Imperial, a facilidade de pontuar por destruir construções e o efeito de várias Serrarias ou Casas da Moeda.
5. Definir como destruição e controle funcionam, se aliados podem coexistir em uma região, quando uma batalha acaba e o que ocorre se um alvo ficar inválido.
6. Decidir se um imposto deve expirar quando não houver tecnologia, se o soldado pago pode sair de qualquer região e como tratar um baralho de impostos esgotado.
7. Avaliar se o leque de 2 a 4 pontos basta ou se um imposto excepcional de 5 pontos deve ser criado após testes.
