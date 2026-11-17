# Conflict Island — Piratas do Mar Safira

## Piratas do Mar Safira

Esta é a versão final do baralho escolhida para os Piratas do Mar Safira.

### Identidade e funcionamento

- **Diretriz.** Faça ataques e saques pelo mapa. Use a mobilidade marítima para pressionar a costa e intervir nas disputas de outras facções quando houver vantagem para os piratas.
- **Tema.** Os piratas navegam pelo mar Safira, conhecido pelas águas azuis e pelas ilhas tropicais como Câlepoo, onde o jogo se passa. Buscam enriquecer e gastam seus ganhos em rum e farra. São caçados pelas outras facções, mas podem se tornar corsários quando a aliança convém aos dois lados.
- **Pontuação.** Ganhar Ouro rende pontos. Saques em batalha são a principal fonte. Bares Piratas são a única fonte passiva de Ouro e podem ser construídos até o limite de dois.
- **Economia e expansão.** A facção começa com poucos piratas e contratar tropas pode custar caro. Com mais unidades, a movimentação marítima permite pressionar várias regiões costeiras. Construir bares dá uso à Madeira obtida em saques.
- **Vulnerabilidades.** A defesa é fraca e os bares são alvos fáceis. Perder tropas em combate atrasa a reposição do exército e reduz a capacidade de continuar saqueando.

### Baralho

| Carta | Cópias | Alvo ou condição | Efeito |
| --- | ---: | --- | --- |
| Invasão Costeira | 3 | Região costeira com inimigos. | Mova até 3 unidades de uma região costeira até o alvo e faça um saque. |
| Ataque a Linha de Suprimentos | 2 | Região com inimigos. O inimigo precisa ter Ouro. | Saqueie com até 3 unidades. Em caso de sucesso, adicione 1 Ouro aos espólios. |
| Trabalhe enquanto eles dormem | 2 | Região com inimigo. | Saqueie com até 3 unidades e ignore o primeiro dano recebido em combate. |
| Carta de Corsário | 3 | Região com outro jogador presente. | Proponha um preço de 0 a 3 Ouros. Se o jogador aceitar, receba o valor combinado. Nesse turno, ele pode mover e atacar com suas unidades como se fossem dele. |
| Serviço de Transporte Pirata | 2 | Região com outro jogador presente. | Proponha um preço de 0 a 3 Ouros. Se o jogador aceitar, receba o valor combinado e deixe que ele escolha outra região costeira para levar suas tropas. |
| Pirata Aprendiz | 3 | Região sob seu controle. | Adicione 1 pirata na região. |
| Mercenários Piratas | 2 | Local com Bar Pirata. | Adicione 2 piratas. Você pode movê-los para uma região costeira que controla. |
| Explorando a Ilha | 3 | Local com piratas. | Mova até 3 piratas para regiões adjacentes. |
| Novas Comandante a Bordo | 2 | Qualquer lugar. | Descarte toda a sua mão. |
| **Total** | **22** | | |

### Probabilidades e decisões de turno

| Evento em uma mão nova | 3 cartas | 4 cartas | 5 cartas |
| --- | ---: | ---: | ---: |
| Pelo menos um saque entre as 7 cartas de saque | 70,5% | 81,3% | 88,6% |
| Pelo menos uma proposta entre as 5 cartas de acordo | 55,8% | 67,5% | 76,5% |
| Pelo menos um saque e pelo menos uma proposta de acordo | 34,1% | 51,7% | 66,1% |
| Pelo menos uma das 5 cartas de recrutamento | 55,8% | 67,5% | 76,5% |
| Pelo menos um Pirata Aprendiz | 37,1% | 47,0% | 55,8% |
| Pelo menos um Explorando a Ilha | 37,1% | 47,0% | 55,8% |
| Pelo menos uma Novas Comandante a Bordo | 26,0% | 33,8% | 41,1% |

- **Saque longe da costa.** Com um alvo local sem Ouro e sem possibilidade de Invasão Costeira, apenas as duas cópias de *Trabalhe enquanto eles dormem* oferecem um saque jogável. Em uma mão de 4 cartas, a chance cai para **33,8%**.
- **Reposição com bar.** Com uma região sob seu controle, *Pirata Aprendiz* é jogável. Um Bar Pirata também habilita *Mercenários Piratas*. Em uma mão de 4 cartas, a chance de ter recrutamento jogável passa de **47,0% sem bar** para **67,5% com bar**.
- **Negociação.** Uma carta de acordo na mão dá acesso a uma proposta se houver um alvo válido. Receber Ouro e realizar o acordo dependem da aceitação do outro jogador.


## Adaptação ao fluxo de ações

As cartas abaixo preservam os efeitos registrados; a adaptação ao fluxo sequencial e às reações defensivas ainda requer decisões e testes. Invasão Costeira, transporte e movimentação exigem definição de origem, destino e alvo vazio; acordos e efeitos que descartam a mão também precisam ser ajustados ao novo fluxo. Não há defesa reativa explicitamente definida neste baralho.

## Como reproduzir os testes

As probabilidades são exatas para mãos novas, compradas sem reposição de um baralho embaralhado de 22 cartas. Uma mesma mão pode conter cartas de vários grupos. Para uma categoria com `k` cópias e uma mão de `n` cartas, a chance de comprar pelo menos uma é `1 − C(22 − k, n) / C(22, n)`, em que `C` é o número de combinações. As chances de compra e as condições para jogar aparecem nos protótipos.

- **Fluxo usado nos dois protótipos.** A mão inicial tem 4 cartas por padrão e pode ser ajustada. Em cada turno, jogue uma carta ou passe. Ao avançar, complete a mão até o tamanho escolhido, preservando as cartas restantes. Se faltar carta na pilha de compra, reembaralhe o descarte. Cópias de uma mesma carta contam como uma opção.
- **Piratas.** Ajuste a presença de inimigos, o acesso à costa, o Ouro do alvo, as oportunidades de acordo, o controle de regiões, os bares e a movimentação. Resolva os combates e a aceitação dos acordos ao testar. O descarte da mão com *Novas Comandante a Bordo* fica fora da contagem de opções de ação.
- **Necromante.** O cenário inicial tem duas regiões devastadas e nenhum recurso. Ajuste os alvos, a quantidade de regiões devastadas, a presença de extratores e o saldo de Madeira e Ouro. O custo da magia escolhida é descontado automaticamente. Atualize o tabuleiro e os ganhos de recursos depois de resolver os efeitos. O teste exige duas regiões devastadas para *Remanejando Mortos* e conta *Magia das Trevas* como uma opção se pelo menos uma magia puder ser lançada.

### Protótipos da conversa

- [Piratas do Mar Safira](<C:/Users/marcos/.codex/visualizations/2026/11/12/01a1cd9c-73ca-7313-b311-a88d426013e9/piratas-do-mar-safira.html>)
- [Necromante da Torre Esquecida](<C:/Users/marcos/.codex/visualizations/2026/11/12/01a1cd9c-73ca-7313-b311-a88d426013e9/necromante-da-torre-esquecida.html>)
