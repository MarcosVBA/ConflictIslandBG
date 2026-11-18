# Baralhos revisados — experimento

## Objetivo e entrega

Criar `mapa-baralhos-revisados.html`, uma segunda mesa jogável para quatro facções, com **12 cartas por facção**. O teste deve mostrar se mãos com mais escolhas reduzem passes por falta de opção e ajudam os jogadores a agir mais cedo, sem alongar a decisão de cada jogada.

Usar o protótipo principal como base para mapa, cenário inicial, interface, duas ações por rodada, compra padrão até cinco cartas, leilão, habilidades de facção e pontuação. A publicação continua usando o protótipo principal. O experimental abre diretamente pelo navegador e identifica a versão no título e no cabeçalho.

## Regras das cartas revisadas

- **Barra `/`** indica escolha de um modo. Jogar um modo gasta a carta inteira e uma ação. O outro modo fica indisponível, inclusive quando é uma reação.
- **“E/ou”** permite só mover, só atacar/saquear ou combinar movimento seguido de combate, em uma ação. A Infestação tem uma resolução própria: recrutar é consequência do combate.
- Cada cópia tem o mesmo valor de liderança em qualquer modo. A oferta no leilão compromete a carta inteira. Os valores abaixo são uma distribuição inicial para teste. Liderança 3 aparece em duas das 48 cartas.
- Ações inválidas e preparações canceladas preservam mão, ação, peças, recursos e turno. Quando um acordo válido é apresentado e recusado, aplicar o comportamento atual de Corsário, Transporte e Harmônia. A carta e a ação são gastas e a troca ou operação fica sem efeito.
- As tabelas são a lista completa dos quatro baralhos experimentais. Preservar os efeitos legados indicados, incluindo custos, limites e reposições de mão expressamente listadas.

### Império

| Carta | Cópias | Liderança | Efeito e reaproveitamento |
| --- | ---: | ---: | --- |
| **Marcha Imperial** | 3 | 2 | Escolha **Mover**, **Atacar** ou **Mover e atacar**. O destino precisa ser adjacente a uma região dominada pelo Império. Para mover, envie de 1 a 3 soldados de uma única região adjacente; mesmo com inimigos no destino, escolher só mover encerra a ação sem combate. Para atacar, exija soldados imperiais no destino após o movimento, se houver, e escolha um defensor presente com tropas ou construções. A Fortaleza permite rerrolar um dado no modo que abriu combate, como hoje. |
| **Assegurar Recursos para o Rei** | 4 | 1 | Colete 1 recurso impresso em região com tropa ou construção imperial. Cada cópia extra descartada na mesma ação rende mais 1 do mesmo tipo, até três extras conforme a mão. Serraria ou Mercado Local dá o bônus atual, uma vez por ação. |
| **Ordens da Coroa** | 3 | 1 | **Construir:** reutilize *O Progresso*, com custo, pré-requisito em outra região, tropas no local, limite de construção e 1 ponto. **Pagar imposto:** reutilize *Pagamento de Impostos*. Exige uma região dominada, imposto ativo e saldo suficiente. Se houver custo em soldado, escolha sua origem entre regiões com soldados imperiais. Preserve o limite de um pagamento por rodada, a substituição do imposto e a penalidade por atraso. |
| **Guarda Imperial** | 2 | 0 | Reação ao defender, antes dos dados. Gaste a carta e uma ação restante para ignorar o primeiro dano às tropas, ou os dois primeiros enquanto existir um Quartel. |

### Piratas

| Carta | Cópias | Liderança | Efeito e reaproveitamento |
| --- | ---: | ---: | --- |
| **Invasão Costeira** | 4 | 1 | Escolha **Mover**, **Saquear** ou **Mover e saquear**. O destino é costeiro. Se mover, envie de 1 a 3 piratas de uma única outra costa, com ou sem conexão terrestre. Só mover pode terminar junto a inimigos sem abrir combate. O saque exige piratas no destino após o eventual movimento e um defensor com tropas ou construções ali. Sucesso concede 1 Ouro pelo procedimento atual, primeiro do defensor e depois da reserva. |
| **Taverna Pirata / Pirata Aprendiz** | 3 | 1 | **Construir:** coloque um Bar em região dominada, respeitando o limite de um no mapa. **Recrutar:** adicione 1 pirata em região dominada pelos Piratas ou sem domínio. Use as duas ações locais atuais. |
| **Carta de Corsário / Serviço de Transporte Pirata** | 3 | 2 | Preserve os dois acordos atuais, com outra facção presente na região escolhida, aceite manual e negociação de 0 a 3 Ouros. **Corsário:** o contratante pode usar piratas presentes para mover para uma região adjacente e, se escolher atacar, realizar um saque. O ataque pode ocorrer no próprio local sem mover. O Ouro do saque vai para os Piratas. **Transporte:** mova tropas do contratante de uma região à escolha para outra região costeira ou adjacente à origem, conforme o validador atual. O transporte termina no movimento. Somente os Piratas gastam carta e ação pelo acordo. |
| **Vento a Favor** | 2 | 1 | Dois modos de reação dos **Piratas como atacantes em um saque**, incluindo o de Corsário. Após declarar o ataque e antes do defensor reagir, gaste a carta e mais uma ação. **Descartar dados de defesa:** a reserva de dados de defesa fica em zero; as cruzes dos dados de ataque e a Guarda continuam valendo. Ofereça esse modo quando houver pelo menos um dado de defesa a suprimir. **Recolher mais espólios:** se o saque for bem-sucedido, receba 1 Ouro extra pelo procedimento normal, totalizando 2. Saque malsucedido rende zero. Use no máximo uma cópia por combate. |

### Necromante

| Carta | Cópias | Liderança | Efeito e reaproveitamento |
| --- | ---: | ---: | --- |
| **Infestação** | 3 | 1 | Escolha um defensor com tropas ou construções. Ataque com os zumbis já presentes e/ou mova até 2 zumbis no total de regiões adjacentes. Após aplicar o combate, adicione 1 zumbi na região, inclusive com resultado natural de 0 a 0 ou sem sobreviventes. Se a Magia da Torre impedir a batalha antes da rolagem ou recuperar a Torre após as baixas, omita o recrutamento. |
| **Extratores da Torre** | 4 | 1 | **Construir:** use *Projeto de Poder Maligno* em região com zumbi, recurso impresso e sem extrator. **Colher:** escolha uma região com extrator e receba 1 recurso impresso de cada região do mapa com extrator, pelo procedimento atual. |
| **Magia das Trevas / Monumento à Morte** | 2 | 2 | **Magia:** escolha uma das quatro magias atuais, com seus custos e alvos. **Monumento:** gaste 1 Madeira em região devastada sem monumento, desde que algum oponente domine uma região no mapa. Pontue 2 por região com monumento, incluindo o novo. Depois, descarte a mão restante e compre até cinco cartas, salvo se a partida tiver terminado. A reposição pertence ao modo Monumento. |
| **Remanejando Mortos** | 3 | 0 | Reutilize o remanejamento atual. As regiões elegíveis são as devastadas ao começar a ação e continuam elegíveis até concluir. Permita mover quantos zumbis quiser, quantas vezes quiser, entre regiões elegíveis ligadas diretamente. Preserve a possibilidade de concluir com zero deslocamentos. Ao concluir, descarte a mão restante e compre até cinco. Cancelar desfaz a prévia inteira. |

### Elfos

| Carta | Cópias | Liderança | Efeito e reaproveitamento |
| --- | ---: | ---: | --- |
| **Fúria da Ilha / Harmônia** | 3 | 1 | **Atacar:** reutilize *Furia da Ilha*, movendo de 1 a 3 elfos de uma origem para um destino adjacente. Se houver tropas ou construções inimigas, escolha um defensor e batalhe. **Trocar:** reutilize *Harmônia*, com aceite, outra facção com tropas na região, Ouro, Madeira e tropas conforme o fluxo atual. Tropas recebidas passam à facção recebedora e vão a regiões dominadas por ela. Preserve o ponto pela primeira troca efetiva com cada facção na rodada. |
| **Trilhas na Mata / Defesa Global** | 2 | 3 | **Mover:** escolha o destino e uma origem adjacente e mova qualquer quantidade positiva de tropas élficas disponíveis, sem abrir combate. **Defesa Global:** após a reação do defensor e antes dos dados, os Elfos podem gastar a carta e uma ação para escolher um dos dois lados com tropas. O lado escolhido ignora 1 dano às tropas nessa batalha, cumulativo com Guarda se aplicável. Funciona inclusive quando os Elfos são terceiros. A batalha segue para a rolagem. |
| **Frutos da Mata / Filhos da Floresta** | 5 | 1 | **Colher:** a região escolhida deve ser dominada pelos Elfos e ter tropas élficas. Receba 1 recurso impresso por região com tropas élficas no mapa, incluindo regiões contestadas e outros terrenos; regiões sem recurso dão zero. **Recrutar:** escolha uma floresta dominada pelos Elfos, gaste 1 Ouro, 1 Madeira ou 1 tropa élfica de uma origem escolhida e adicione 1 elfo na floresta. É permitido gastar uma tropa da própria região. Descarte a mão restante e compre até cinco somente no modo Recrutar. |
| **Milagre da Floresta** | 2 | 0 | Em modal, converta 3 recursos de um mesmo tipo em 2 de outro mesmo tipo. Ouro, Madeira e tropas élficas são opções. Escolha as origens das tropas gastas e as regiões dominadas que recebem tropas. Reuse o validador atual. A conversão de Ouro em Madeira ou vice-versa dispensa seleção de região. |

## Roteiro comparativo de playtest

Jogue pelo menos cinco rodadas de cada versão com o mesmo grupo, cenário e mão padrão de cinco. Se repetir, alterne a ordem das versões. Registre tempo por turno, passes e descartes por falta de opção útil, modos escolhidos, saques, reações e primeira pontuação de cada facção. Menos turnos sem opção útil sem aumento da mediana do tempo de decisão é um sinal favorável; a avaliação humana decide o balanceamento e identifica cartas que travam ou dominam a mão.

## Estado do experimento

As tabelas acima são decisões para teste e não substituem as regras vigentes das facções. A mesa experimental está em [mapa-baralhos-revisados.html](mapa-baralhos-revisados-experimento.html), gerada a partir das mesmas fontes da mesa principal com o catálogo experimental.

A suíte de regras verifica catálogo e distribuição, compra, reciclagem, liderança, ações, economia, acordos e casos de combate, incluindo reações e recuperação da Torre. Os testes de navegador exercitam a variante em desktop e celular, sem rede. A checagem completa passou no marco de implementação; essas verificações não medem equilíbrio nem duração de decisões.

Nenhuma partida comparativa humana foi registrada. Permanecem pendentes as cinco rodadas por versão e a avaliação humana dos resultados.
