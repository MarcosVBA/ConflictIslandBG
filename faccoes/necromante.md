# Necromante da Torre Esquecida


## Identidade e região devastada

Facção de domínio territorial, zumbis, extratores e magias. Seu cenário inicial está em [Mapa](../regras/mapa.md). A recuperação da Torre segue a Magia da Torre abaixo.

**Condição registrada; implementada.** Uma região devastada contém apenas tropas ou construções do Necromante: exige presença de ao menos uma de suas peças e ausência de peças de outras facções. Uma região vazia não é devastada. Essa condição é distinta de domínio por maioria, definido em [Regras gerais](../regras/regras-gerais.md).

## Magia da Torre

**Definida; implementada no protótipo principal.** Se a Torre for a única região dominada pelo Necromante, após a compra normal de cartas adicione um zumbi ali, até cinco zumbis na região.

Ao perder o domínio da Torre, inclusive por empate, remova imediatamente todas as tropas e construções da sua região e todas as tropas e construções do Necromante no mapa; a própria Torre permanece e recebe dois zumbis. Se a perda ocorrer na movimentação anterior a um combate e eliminar um dos combatentes, a ação é consumida sem rolagem. Uma preparação de combate que já acionou a magia não pode ser cancelada.

## Pontuação territorial

**Registrada; implementada na fase de pontuação.**

| Regiões devastadas | Pontos |
| ---: | ---: |
| 0–1 | 0 |
| 2–3 | 1 |
| 4 | 2 |
| 5 | 3 |
| 6 ou mais | 4 |

## Baralho vigente

O baralho tem 12 cartas. A barra indica escolha de modo e cada modo consome a carta inteira.

| Carta | Cópias | Liderança | Efeito |
| --- | ---: | ---: | --- |
| **Infestação** | 3 | 1 | Escolha um defensor com tropas ou construções e ataque com os zumbis presentes e/ou mova até 2 zumbis de regiões adjacentes. Em região sem defensor, mova até 2 zumbis sem combate nem recrutamento. Após aplicar o combate, adicione 1 zumbi na região, inclusive com resultado natural de 0 a 0 ou sem sobreviventes. Se a Magia da Torre impedir a batalha antes da rolagem ou recuperar a Torre após as baixas, omita o recrutamento. |
| **Extratores da Torre** | 4 | 1 | **Construir:** construa um extrator em região com zumbi, recurso impresso e sem extrator. **Colher:** havendo extrator no mapa, receba 1 recurso impresso de cada região do mapa com extrator. |
| **Magia das Trevas / Monumento à Morte** | 2 | 2 | **Magia:** escolha uma das quatro magias atuais, com seus custos e alvos. **Monumento:** gaste 1 Madeira em região devastada sem monumento, desde que algum oponente domine uma região no mapa. Pontue 2 por região com monumento, incluindo o novo. Depois, descarte a mão restante e compre até cinco cartas, salvo se a partida tiver terminado. A reposição pertence ao modo Monumento. |
| **Remanejando Mortos** | 3 | 0 | Reutilize o remanejamento atual. As regiões elegíveis são as devastadas ao começar a ação e continuam elegíveis até concluir. Permita mover quantos zumbis quiser, quantas vezes quiser, entre regiões elegíveis ligadas diretamente. Preserve a possibilidade de concluir com zero deslocamentos. Ao concluir, descarte a mão restante e compre até cinco. Cancelar desfaz a prévia inteira. |

## Magias das Trevas

| Magia | Custo | Alvo e efeito |
| --- | --- | --- |
| Despertar para a Morte | 1 Madeira | Converta 1 unidade inimiga em uma região adjacente a uma região devastada. |
| Levantar dos Mortos | 1 Madeira e 1 Ouro | Adicione 3 unidades em qualquer região devastada. |
| Devastar | 1 Madeira e 2 Ouros | Elimine todas as tropas inimigas em uma região com pelo menos uma unidade aliada e remova 1 zumbi da região. |
| Trabalhadores incansáveis | 3 Madeiras | Adicione 1 extrator em uma região com recursos e colete 1 recurso imediatamente. |

Despertar para a Morte continua disponível como magia escolhida pela carta Magia das Trevas; não integra o baralho como carta independente.

**Praga Resistente implementada:** ao receber um ataque, o Necromante pode usar a carta antes dos dados, consumindo um de seus marcadores ainda disponíveis; a proteção vale para esse combate.

**Definido; implementado para teste:** Remanejando Mortos permite distribuir qualquer quantidade de zumbis entre regiões devastadas adjacentes, com quantos movimentos desejar. As regiões elegíveis são as devastadas ao iniciar o efeito; mesmo que uma delas fique vazia durante os movimentos, permanece elegível até a resolução terminar. Cada movimento usa uma ligação direta entre regiões elegíveis. Permanecem em revisão as demais interações das cartas.
