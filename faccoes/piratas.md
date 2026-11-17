# Piratas do Mar Safira

## Identidade e componentes

Facção voltada a ataques, saques, mobilidade costeira e acordos. Seu crescimento pode ser prejudicado por perdas e por defesa fraca. Ganhar Ouro gera pontos; Bares são sua única fonte passiva de Ouro, com limite de dois.

O cenário inicial está em [Mapa](../regras/mapa.md). Regras gerais de batalha e sucesso estão em [Combate](../regras/combate.md).

## Ilha à Vista

Habilidade pirata: se não houver mais piratas no mapa, adicione um pirata em uma região costeira com a menor quantidade de tropas, se empatar, o jogador escolhe.

## Saque

**Definido; implementado.** Em saque bem-sucedido, os Piratas pegam 1 Ouro do inimigo; se ele não possuir Ouro, recebem 1 Ouro da reserva. *Ataque a Linha de Suprimentos* acrescenta 1 Ouro aos espólios, obtido pela mesma regra após o primeiro: do inimigo se ainda tiver Ouro, senão da reserva.

## Pontuação

**Definido:** cada Ouro recebido rende 1 ponto; Cada Bar controlado gera 1 Ouro por rodada (No máximo 2 bares). O acordo de Corsário concede uma operação imediata de movimento.

## Baralho registrado

**Conteúdo registrado; implementado com adaptações de teste.** Novas Comandante a Bordo recompõe a mão até cinco cartas após descartá-la. Os textos preservam os efeitos documentados; os limites de movimento não substituem a regra de participação no combate.

| Carta | Cópias | Alvo ou condição | Efeito |
| --- | ---: | --- | --- |
| Invasão Costeira | 3 | Região costeira | Mova até 3 unidades de uma região costeira, se houver alvos, faça um saque. |
| Ataque a Linha de Suprimentos | 2 | Região com inimigos e tropas aliadas; O inimigo precisa ter ouro | Saqueie um inimigo. Em caso de sucesso, adicione 1 Ouro aos espólios. |
| Trabalhe enquanto eles dormem | 1 | Região com inimigo e tropas aliadas | Saqueie; Ignore o primeiro dano recebido em combate. |
| Carta de Corsário | 2 | Região com outro jogador presente | Proponha um preço de 0 a 3 Ouros. Se aceitar, receba o valor; O jogador que pagou a oferta pode mover piratas para areas adjacentes e realizar um saque (ouro vai para os piratas). |
| Serviço de Transporte Pirata | 2 | Região com outro jogador presente | Proponha um preço de 0 a 3 Ouros. Se aceitar, receba o valor; O jogador que pagou a oferta pode mover unidades de uma região qualqer para outra costeira ou adjacente |
| Pirata Aprendiz | 3 | Região sob seu controle ou sem dominio | Adicione 1 pirata na região. |
| Mercenários Piratas | 2 | Local com Bar Pirata | Adicione 2 piratas. Você pode movê-los para uma região costeira. |
| Atrás do Tesouro | 3 | Local com piratas | Mova até 3 piratas dessa região para outra adjacente. |
| Novas Comandante a Bordo | 2 | Qualquer lugar | Descarte toda a mão e compre até ter 5 cartas. |
| Taverna Pirata | 3 | Região sobre seu controle | Adicione um bar pirata na região |
| **Total** | **23** | | |

## Liderança por carta

**Valores definidos pelo usuário para teste; o balanceamento não é final.** Cada cópia da carta usa o mesmo valor.

| Carta | Liderança |
| --- | ---: |
| Invasão Costeira | 2 |
| Ataque a Linha de Suprimentos | 1 |
| Trabalhe enquanto eles dormem | 1 |
| Carta de Corsário | 0 |
| Serviço de Transporte Pirata | 0 |
| Pirata Aprendiz | 1 |
| Mercenários Piratas | 2 |
| Atrás do Tesouro | 0 |
| Novas Comandante a Bordo | 0 |
| Taverna Pirata | 1 |
