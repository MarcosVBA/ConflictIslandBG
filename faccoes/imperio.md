# Império da Gran' Vália


**Estado: proposta para revisão e teste; implementada parcialmente no protótipo.** Valores e efeitos abaixo não são regras finais aprovadas. O Império coleta recursos, constrói tecnologias em regiões distintas, paga impostos para pontuar e pode ganhar pontos ao destruir construções inimigas.

O cenário inicial está em [Mapa](../regras/mapa.md); as regras comuns de domínio e combate estão em [Regras gerais](../regras/regras-gerais.md) e [Combate](../regras/combate.md).

## Componentes e funcionamento propostos

- Ao coletar, receba um recurso do tipo disponível na região escolhida.
- Cada construção de tecnologia exige tropas imperiais na região ao ser construída. Máximo de uma construção imperial por região. Efeitos de construções do mesmo tipo não se acumulam; escolha uma para cada efeito. Os pré-requisitos precisam existir em outra região, mesmo que o Império não a domine.
- **Definido; implementado:** no início de cada rodada, revele um novo imposto para o Império, descarte e substitua o imposto anterior. O imposto ativo pode ser pago uma vez com a ação correspondente, entregando os recursos e removendo o soldado indicado; pontue o valor impresso. 
- **Prazo para teste; implementado:** após três rodadas consecutivas sem pagar imposto ativo, remova uma construção imperial de maior nível, escolhida pelo jogador em caso de empate, e descarte um recurso do tipo com menor quantidade. Se Ouro e Madeira estiverem empatados acima de zero, o jogador escolhe; se algum tipo estiver em zero, não descarte recurso. Descarte o imposto sem pontuar, revele outro e zere o atraso. Sem construção, não há perda adicional de recurso.
- Ao destruir uma construção inimiga, pontue 2 por construção, sujeito às regras comuns de combate e às pendências de destruição.
- Construir construções pontua 1 ponto


## Construções Imperiais

- Serraria (nível 1 - 1 madeira): Uma vez por ação de coleta, se coletar Madeira, receba mais 1 Madeira.
    - Mercado Local (nível 2 - 1 madeira e 1 ouro): Uma vez por ação de coleta, se coletar Ouro, receba mais 1 Ouro. 
        - Salão Imperial (nível 3 - 2 ouros): Durante a vez do Império, descarte 1 recurso para substituir o imposto ativo pelo próximo do baralho, sem gastar marcador; máximo 1 vez por rodada
    - Quartel (nível 2 - 2 ouros): Guarda Imperial agora ignora os 2 primeiros danos sofridos em batalha
        - Fortaleza (nível 3 - 1 ouro e 1 madeira): Marcha Imperial permite rerrolar 1 dado de ataque ou defesa após a rolagem, à escolha do Império

Efeitos de coleta aplicam-se uma vez por ação e não criam recurso sem coleta válida.

Durante a construção: Mercado Local e Quartel exigem Serraria; Salão Imperial exige Mercado Local; Fortaleza exige Quartel, em outra região.
Pontue 1 ponto sempre que construir

## Alistamento Obrigatório

Todo turno até o jogador ter 7 tropas no mapa, após a compra de carta no inicio da rodada, adicione uma tropa em qualquer região controlada.

Se não houver regiões controladas, adicione duas tropas em uma região com menos tropas inimigas, no caso de empate, o jogador decide.

**Definido para teste; implementado no protótipo principal:** ocorre uma vez por rodada, após a compra e antes do leilão. O máximo de sete vale para essa habilidade: se restar apenas uma vaga, a recuperação sem região dominada adiciona apenas uma tropa; com sete ou mais, não há alistamento. As cartas podem aumentar o total além de sete. As condições de O Progresso e Assegurar Recursos para o Rei também estão implementadas no protótipo principal.

## Baralho vigente

O baralho tem 12 cartas. A barra indica escolha de modo e cada modo consome a carta inteira.

| Carta | Cópias | Liderança | Efeito |
| --- | ---: | ---: | --- |
| **Marcha Imperial** | 3 | 2 | Escolha **Mover**, **Atacar** ou **Mover e atacar**. O destino precisa ser adjacente a uma região dominada pelo Império. Para mover, envie de 1 a 3 soldados de uma única região adjacente; mesmo com inimigos no destino, escolher só mover encerra a ação sem combate. Para atacar, exija soldados imperiais no destino após o movimento, se houver, e escolha um defensor presente com tropas ou construções. A Fortaleza permite rerrolar um dado no modo que abriu combate. |
| **Assegurar Recursos para o Rei** | 4 | 1 | Colete 1 recurso impresso em região com tropa ou construção imperial. Cada cópia extra descartada na mesma ação rende mais 1 do mesmo tipo, até três extras conforme a mão. Serraria ou Mercado Local dá o bônus atual, uma vez por ação. |
| **Ordens da Coroa** | 3 | 1 | **Construir:** pague o custo da tecnologia escolhida, respeitando seu pré-requisito em outra região, com tropas no local e limite de uma construção imperial por região. Receba 1 ponto. **Pagar imposto:** pague os custos do imposto ativo e receba os pontos indicados. Exige uma região dominada, imposto ativo e saldo suficiente. Se houver custo em soldado, escolha sua origem entre regiões com soldados imperiais. O limite é um pagamento por rodada. O imposto é substituído e o atraso penalizado conforme as regras da facção. |
| **Guarda Imperial** | 2 | 0 | Reação ao defender, antes dos dados. Gaste a carta e uma ação restante para ignorar o primeiro dano às tropas, ou os dois primeiros enquanto existir um Quartel. |

## Baralho de impostos proposto

| Custo | Pontos | Cópias |
| --- | ---: | ---: |
| 1 Ouro | 2 | 1 |
| 1 Ouro e 1 Madeira | 2 | 3 |
| 2 Ouros e 1 Madeira | 3 | 2 |
| 1 Madeira e 1 soldado | 3 | 2 |
| 1 Madeira, 1 Ouro e 1 soldado | 4 | 1 |


**Definido; implementado:** as tecnologias imperiais produzem seus efeitos enquanto a construção existir, mesmo sem domínio da região. Os pré-requisitos também exigem apenas a existência da construção em outra região. O Império mantém a penalidade de atraso e os impostos descartados são reembaralhados. O protótipo revela o próximo imposto após um pagamento, mantendo o limite confirmado de um pagamento por rodada.
