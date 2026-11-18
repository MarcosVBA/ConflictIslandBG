# Necromante da Torre Esquecida

Uma variante experimental de 12 cartas está descrita em [Baralhos revisados](../../../prototipo/baralhos-revisados.md); as tabelas abaixo permanecem vigentes para a mesa principal.

## Identidade e região devastada

Facção de domínio territorial, zumbis, extratores e magias. Seu cenário inicial está em [Mapa](../../../regras/mapa.md). A recuperação da Torre segue a Magia da Torre abaixo.

**Condição registrada; implementada.** Uma região devastada contém apenas tropas ou construções do Necromante: exige presença de ao menos uma de suas peças e ausência de peças de outras facções. Uma região vazia não é devastada. Essa condição é distinta de domínio por maioria, definido em [Regras gerais](../../../regras/regras-gerais.md).

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

## Baralho registrado

**Definido; implementado:** Remanejando Mortos e Monumento a Morte recompõem a mão até cinco cartas após descartá-la.


| Carta | Cópias | Alvo ou condição | Efeito |
| --- | ---: | --- | --- |
| Ataque Zumbi | 2 | Região com unidades inimigas | Mova quantas unidades quiser de regiões adjacentes e batalhe. Se eliminar todos os inimigos e restarem tropas, converta metade das tropas eliminadas, arredondando para cima. |
| Infestação | 2 | Região com unidades inimigas | Mova até 2 unidades de regiões adjacentes e batalhe. Ao fim da batalha, adicione 1 zumbi no local. |
| Horda interminável | 2 | Região com unidades inimigas | Mova quantas unidades quiser de regiões adjacentes e batalhe. Ignore o primeiro dano às suas unidades. Se eliminar todos os inimigos e restarem tropas, converta metade das tropas eliminadas, arredondando para cima. |
| Praga Resistente | 2 | Ao receber um ataque | Ignore o primeiro dano às suas unidades |
| Magia das Trevas | 3 | Qualquer região, conforme a magia | Escolha uma magia, pague seu custo e execute o efeito. |
| Trabalhadores Zumbificado | 3 | Região com extrator | Colete 1 recurso por extrator colocado no mapa. |
| Projeto de Poder Maligno | 3 | Região com suas unidades e algum recurso | Adicione 1 extrator, no limite de 1 por região. |
| Remanejando Mortos | 2 | Qualquer região | Descarte a mão e distribua zumbis entre regiões devastadas conectadas, movendo quantas tropas e quantas vezes desejar; compre até ter 5 cartas. |
| Monumento a Morte | 1 | Região devastada, com ao menos uma região dominada por oponentes | Construa um monumento por 1 madeira, pontue 2 por região com monumento, descarte toda a mão e compre até ter 5 cartas. |
| **Total** | **20** | | |

**Implementado no protótipo principal:** Monumento a Morte exige e consome 1 Madeira. Sem o recurso, a ação não é realizada e a carta e o marcador permanecem disponíveis.

## Liderança por carta

**Valores definidos pelo usuário para teste; o balanceamento não é final.** Cada cópia da carta usa o mesmo valor.

| Carta | Liderança |
| --- | ---: |
| Ataque Zumbi | 1 |
| Infestação | 1 |
| Horda interminável | 3 |
| Praga Resistente | 0 |
| Magia das Trevas | 1 |
| Trabalhadores Zumbificado | 0 |
| Projeto de Poder Maligno | 1 |
| Remanejando Mortos | 0 |
| Monumento a Morte | 1 |

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
