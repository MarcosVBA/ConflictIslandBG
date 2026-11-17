# Império da Gran' Vália

**Estado: proposta para revisão e teste; implementada parcialmente no protótipo.** Valores e efeitos abaixo não são regras finais aprovadas. O Império coleta recursos, constrói tecnologias em regiões distintas, paga impostos para pontuar e pode ganhar pontos ao destruir construções inimigas.

O cenário inicial está em [Mapa](../regras/mapa.md); as regras comuns de domínio e combate estão em [Regras gerais](../regras/regras-gerais.md) e [Combate](../regras/combate.md).

## Componentes e funcionamento propostos

- Ao coletar, receba um recurso do tipo disponível na região escolhida.
- Cada construção de tecnologia exige tropas imperiais na região ao ser construída. Máximo de uma construção imperial por região. Efeitos de construções do mesmo tipo não se acumulam; escolha uma para cada efeito. Os pré-requisitos precisam estar em outra região controlada.
- **Definido; implementado:** no início de cada rodada, revele um novo imposto para o Império, descarte e substitua o imposto anterior. O imposto ativo pode ser pago uma vez com a ação correspondente, entregando os recursos e removendo o soldado indicado; pontue o valor impresso. 
- **Prazo para teste; implementado:** após três rodadas consecutivas sem pagar imposto ativo, remova uma construção imperial de maior nível, escolhida pelo jogador em caso de empate, e descarte um recurso do tipo com menor quantidade. Se Ouro e Madeira estiverem empatados acima de zero, o jogador escolhe; se algum tipo estiver em zero, não descarte recurso. Descarte o imposto sem pontuar e zere o atraso; o próximo será revelado no início da rodada seguinte. Sem construção, não há perda adicional de recurso.
- Ao destruir uma construção inimiga, pontue 2 por construção, sujeito às regras comuns de combate e às pendências de destruição.
- Construir construções pontua 1 ponto


## Construções Imperiais

- Serraria (nível 1 - 1 madeira): Uma vez por ação de coleta, se coletar Madeira, receba mais 1 Madeira.
    - Mercado Local (nível 2 - 1 madeira e 1 ouro): Uma vez por ação de coleta, se coletar Ouro, receba mais 1 Ouro. 
        - Salão Imperial (nível 3 - 2 ouros): Durante a vez do Império, descarte 1 recurso para substituir o imposto ativo pelo próximo do baralho, sem gastar marcador; máximo 1 vez por rodada
    - Quartel (nível 2 - 2 ouros): Guarda Imperial agora ignora os 2 primeiros danos sofridos em batalha
        - Fortaleza (nível 3 - 1 ouro e 1 madeira): Marcha Imperial permite rerrolar 1 dado de ataque ou defesa após a rolagem, à escolha do Império

Efeitos de coleta aplicam-se uma vez por ação e não criam recurso sem coleta válida.

Durante a construção: Mercado Local e Quartel exigem Serraria; Salão Imperial exige Mercado Local; Fortaleza exige Quartel, em outra região controlada.
Pontue 1 ponto sempre que construir

## Alistamento Obrigatório

Todo turno até o jogador ter 7 tropas no mapa, após a compra de carta no inicio da rodada, adicione uma tropa em qualquer região controlada.

Se não houver regiões controladas, adicione duas tropas em uma região com menos tropas inimigas, no caso de empate, o jogador decide.

**Definido para teste; implementado no protótipo principal:** ocorre uma vez por rodada, após a compra e antes do leilão. O máximo de sete vale para essa habilidade: se restar apenas uma vaga, a recuperação sem região dominada adiciona apenas uma tropa; com sete ou mais, não há alistamento. As cartas podem aumentar o total além de sete. As condições de O Progresso e Assegurar Recursos para o Rei também estão implementadas no protótipo principal.

## Baralho principal proposto

| Carta | Cópias | Região ou condição | Efeito proposto |
| --- | ---: | --- | --- |
| Marcha Imperial | 3 | Região adjacente a uma que você domina | Mova até 3 soldados de uma região adjacente para a região selecionada; Inicie uma batalha na região. |
| Guarda Imperial | 2 | Ao ser atacado | Ignore até 1 danos às suas unidades nessa batalha. |
| Tambores de Guerra | 2 | Região qualquer | Mova até 2 soldados adjacentes; Inicie batalha na região; ignore 1 dano às suas unidades na batalha. |
| Alistamento | 2 | Região controlada | Pague 1 Ouro e adicione 2 soldados. |
| O Progresso | 3 | Região com tropas aliadas e sem construção imperial | Pague o custo de uma tecnologia disponível e construa-a. |
| Assegurar Recursos para o Rei | 5 | Região com recurso disponível e tropas/construção aliada | Colete 1 recurso; descarte cópias adicionais da mão para coletar mais 1 do mesmo tipo por cópia. |
| Reorganizar Contingente | 2 | Região com soldados imperiais | Mova até 3 soldados para uma região adjacente. |
| Aliança com o Império | 1 | Região com outro jogador | Façam uma troca imediata de recursos sem limite, desde que ambos concordem |
| Pagamento de Impostos | 3 | Região controlada | Pague o imposto ativo e pontue seu valor se puder arcar com o custo. |
| **Total** | **23** | | |


## Liderança por carta

**Valores definidos pelo usuário para teste; o balanceamento não é final.** Cada cópia da carta usa o mesmo valor.

| Carta | Liderança |
| --- | ---: |
| Marcha Imperial | 1 |
| Guarda Imperial | 1 |
| Tambores de Guerra | 2 |
| Alistamento | 0 |
| O Progresso | 1 |
| Assegurar Recursos para o Rei | 1 |
| Reorganizar Contingente | 1 |
| Aliança com o Império | 0 |
| Pagamento de Impostos | 1 |

## Baralho de impostos proposto

| Custo | Pontos | Cópias |
| --- | ---: | ---: |
| 1 Ouro | 2 | 1 |
| 1 Ouro e 1 Madeira | 2 | 3 |
| 2 Ouros e 1 Madeira | 3 | 2 |
| 1 Madeira e 1 soldado | 3 | 2 |
| 1 Madeira, 1 Ouro e 1 soldado | 4 | 1 |


**Adaptações de teste:** os efeitos das construções dependem de controle; Guarda Imperial usa um marcador defensivo disponível, conforme Combate. Ataques continuam exigindo tropas defensoras, conforme a limitação comum. O baralho de impostos descartados não é reposto durante a partida de teste.
