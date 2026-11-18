# Piratas do Mar Safira


## Identidade e componentes

Facção voltada a ataques, saques, mobilidade costeira e acordos. Seu crescimento pode ser prejudicado por perdas e por defesa fraca. O Ouro acumulado pode gerar pontos no fim da rodada; Bares são sua única fonte passiva de Ouro, com limite de um Bar no mapa.

O cenário inicial está em [Mapa](../regras/mapa.md). Regras gerais de batalha e sucesso estão em [Combate](../regras/combate.md).

## Ilha à Vista

Habilidade pirata: se não houver mais piratas no mapa, adicione um pirata em uma região costeira com a menor quantidade de tropas, se empatar, o jogador escolhe.

## Saque

**Definido; implementado.** Em saque bem-sucedido, os Piratas pegam 1 Ouro do inimigo; se ele não possuir Ouro, recebem 1 Ouro da reserva. *Ataque a Linha de Suprimentos* acrescenta 1 Ouro aos espólios, obtido pela mesma regra após o primeiro: do inimigo se ainda tiver Ouro, senão da reserva.

## Pontuação

**Definido:** na fase de pontuação, após receber a renda do Bar, os Piratas devolvem à reserva todo o Ouro que possuem e recebem 1 ponto por Ouro devolvido. Durante a rodada, podem trocar o Ouro recebido antes da pontuação. Um Bar gera 1 Ouro por rodada; os Piratas podem ter no máximo um Bar no mapa. O acordo de Corsário concede uma operação imediata de movimento.
**Definido:** quando um Bar é destruído, os Piratas perdem todo o Ouro que possuem e 1 ponto de vitória. Isso inclui a remoção do Bar pela recuperação da Torre.

**Pendente:** definir se a pontuação pode ficar negativa. No protótipo, a penalidade é aplicada integralmente, inclusive abaixo de zero, como hipótese de teste.

## Baralho vigente

O baralho tem 12 cartas. A barra indica escolha de modo e cada modo consome a carta inteira.

| Carta | Cópias | Liderança | Efeito |
| --- | ---: | ---: | --- |
| **Invasão Costeira** | 4 | 1 | Escolha **Mover**, **Saquear** ou **Mover e saquear**. Para mover e saquear, o destino é costeiro e o movimento leva de 1 a 3 piratas de outra costa. Apenas mover permite deslocar qualquer quantidade positiva de uma única região adjacente, ou de outra costa para costa. Só mover pode terminar junto a inimigos sem abrir combate. O saque exige piratas no destino após o eventual movimento e um defensor com tropas ou construções ali, a região não precisa ser costeira. Sucesso concede 1 Ouro primeiro do defensor e depois da reserva. |
| **Taverna Pirata / Pirata Aprendiz** | 3 | 1 | **Construir:** coloque um Bar em região dominada, respeitando o limite de um no mapa. **Recrutar:** adicione 1 pirata em região dominada pelos Piratas ou sem domínio, ou 2 se houver Bar. |
| **Carta de Corsário / Serviço de Transporte Pirata** | 3 | 2 | Proponha um acordo a outra facção, aceite manual e negociação de 0 a 3 Ouros. **Corsário:** o contratante pode usar piratas presentes para mover para uma região adjacente e, se escolher atacar, realizar um saque. O ataque pode ocorrer no próprio local sem mover. O Ouro do saque vai para os Piratas. **Transporte:** mova tropas do contratante de uma região à escolha para outra região costeira ou adjacente à origem. O transporte termina no movimento. Somente os Piratas gastam carta e ação pelo acordo. |
| **Vento a Favor** | 2 | 1 | Dois modos de reação dos **Piratas como atacantes em um saque**, incluindo o de Corsário. Após declarar o ataque e antes do defensor reagir, gaste a carta sem consumir ação. **Descartar dados de defesa:** a reserva de dados de defesa fica em zero; as cruzes dos dados de ataque e a Guarda continuam valendo. Ofereça esse modo quando houver pelo menos um dado de defesa a suprimir. **Recolher mais espólios:** se o saque for bem-sucedido, receba 1 Ouro extra pelo procedimento normal, totalizando 2. Saque malsucedido rende zero. Use no máximo uma cópia por combate. |
