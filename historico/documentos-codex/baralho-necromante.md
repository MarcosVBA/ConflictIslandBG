# Conflict Island — Necromante da Torre Esquecida

## Necromante da Torre Esquecida

### Identidade e funcionamento

- **Diretriz.** Controle regiões por meio da força militar. Busque posições enfraquecidas para expandir o domínio e considere a capacidade de defender as regiões conquistadas.
- **Tema.** Um necromante ancião e sem nome vive na Torre Esquecida de Câlepoo. Ele pretende dominar a ilha com seu exército de zumbis e usa feitiços para espalhar a morte e reforçar suas tropas.
- **Economia e expansão.** Trabalhadores zumbificados extraem recursos em posições estratégicas do mapa. Os recursos financiam rituais para criar zumbis ou alterar o campo de batalha. Algumas vitórias permitem converter tropas inimigas em reforços, e a expansão abre acesso a mais recursos e pontos.
- **Vulnerabilidades.** Os zumbis são difíceis de eliminar, mas o exército pode demorar a se recompor depois de perder muitas unidades. A expansão gera atrito com todas as facções. Se perder a torre, o Necromante recorre ao *renascer das trevas*, sacrificando zumbis aliados para ganhar força, retomar a torre e voltar a expandir.

### Pontuação territorial

Uma região devastada contém apenas tropas ou construções do Necromante.

| Regiões devastadas | Pontos |
| ---: | ---: |
| 0–1 | 0 |
| 2–3 | 1 |
| 4 | 2 |
| 5 | 3 |
| 6 ou mais | 4 |

### Baralho

| Carta | Cópias | Alvo ou condição | Efeito |
| --- | ---: | --- | --- |
| Ataque Zumbi | 2 | Região com unidades inimigas. | Mova quantas unidades quiser de regiões adjacentes até o alvo e realize uma batalha. Se eliminar todos os inimigos e ainda tiver tropas, converta metade das tropas eliminadas, arredondando para cima. |
| Infestação | 2 | Região com unidades inimigas. | Mova até 2 unidades de regiões adjacentes até o alvo e realize uma batalha. No fim da batalha, adicione 1 zumbi no local. |
| Horda interminável | 2 | Região com unidades inimigas. | Mova quantas unidades quiser de regiões adjacentes até o alvo e realize uma batalha. Ignore o primeiro dano às suas unidades. Se eliminar todos os inimigos e ainda tiver tropas, converta metade das tropas eliminadas, arredondando para cima. |
| Praga Resistente | 2 | Região com unidades inimigas. | Ignore o primeiro dano às suas unidades nas batalhas no local selecionado. |
| Magia das Trevas | 3 | Qualquer região, conforme a magia escolhida. | Escolha uma magia, pague seu custo e execute o efeito. |
| Trabalhadores Zumbificado | 3 | Região com extrator. | Colete 1 recurso por extrator colocado no mapa. |
| Projeto de Poder Maligno | 3 | Região com suas unidades e algum recurso. | Adicione 1 extrator na região, respeitando o limite de 1 por região. |
| Despertar para a Morte | 1 | Região com pelo menos uma unidade inimiga. | Converta 1 unidade inimiga em zumbi. |
| Remanejando Mortos | 3 | Qualquer lugar. A troca ocorre entre regiões devastadas. | Descarte toda a mão e troque a posição de suas tropas nas regiões devastadas. |
| Monumento a Morte | 1 | Região devastada, com ao menos uma região dominada por oponentes. | Construa um monumento à morte, pontue 2 por região com monumento e descarte toda a mão. |
| **Total** | **22** | | |

### Magias das Trevas

| Magia | Custo | Alvo e efeito |
| --- | --- | --- |
| Despertar para a Morte | 1 Madeira | Converta 1 unidade inimiga em uma região adjacente a uma região devastada. |
| Levantar dos Mortos | 1 Madeira e 1 Ouro | Adicione 3 unidades em qualquer região devastada. |
| Devastar | 1 Madeira e 2 Ouros | Elimine todas as tropas inimigas em uma região com pelo menos uma unidade aliada e remova 1 zumbi da região. |
| Trabalhadores incansáveis | 3 Madeiras | Adicione 1 extrator em uma região com recursos e colete 1 recurso imediatamente. |

### Probabilidades e decisões de turno

| Evento em uma mão nova | 3 cartas | 4 cartas | 5 cartas |
| --- | ---: | ---: | ---: |
| Pelo menos uma das 6 cartas que iniciam batalha | 63,6% | 75,1% | 83,4% |
| Pelo menos uma Magia das Trevas | 37,1% | 47,0% | 55,8% |
| Pelo menos um Projeto de Poder Maligno | 37,1% | 47,0% | 55,8% |
| Pelo menos um Trabalhadores Zumbificado | 37,1% | 47,0% | 55,8% |
| Pelo menos um Projeto de Poder Maligno e um Trabalhadores Zumbificado | 10,5% | 18,9% | 28,3% |
| Pelo menos uma das 4 cartas que descartam a mão | 47,0% | 58,2% | 67,5% |

- **Escolha de ataque.** *Horda interminável* oferece o mesmo movimento e a mesma conversão que *Ataque Zumbi* e ainda ignora o primeiro dano. Na mesma mão, a escolha imediata tende a favorecer a Horda. *Infestação* tem mobilização limitada a duas unidades e adiciona um zumbi ao fim da batalha sem exigir a eliminação completa dos inimigos.
- **Arranque da economia.** Sem extrator, *Trabalhadores Zumbificado* fica esperando. *Projeto de Poder Maligno* permite preparar a coleta. A chance de comprar *Magia das Trevas* mede acesso à carta. Para lançá-la, ainda é preciso ter recursos e alvo para pelo menos uma magia.
- **Pressão territorial.** A terceira região devastada mantém a pontuação em 1. A quarta, a quinta e a sexta rendem 1 ponto adicional cada. O teto de 4 pontos territoriais é atingido na sexta região.


## Adaptação ao fluxo de ações

As cartas abaixo preservam os efeitos registrados; a adaptação ao fluxo sequencial e às reações defensivas ainda requer decisões e testes. Ataques, magias e Remanejando Mortos exigem esclarecimento da relação entre marcadores e regiões envolvidas. Praga Resistente é candidata a defesa reativa, mas sua elegibilidade e duração ainda não foram decididas.

## Como reproduzir os testes

As probabilidades são exatas para mãos novas, compradas sem reposição de um baralho embaralhado de 22 cartas. Uma mesma mão pode conter cartas de vários grupos. Para uma categoria com `k` cópias e uma mão de `n` cartas, a chance de comprar pelo menos uma é `1 − C(22 − k, n) / C(22, n)`, em que `C` é o número de combinações. As chances de compra e as condições para jogar aparecem nos protótipos.

- **Fluxo usado nos dois protótipos.** A mão inicial tem 4 cartas por padrão e pode ser ajustada. Em cada turno, jogue uma carta ou passe. Ao avançar, complete a mão até o tamanho escolhido, preservando as cartas restantes. Se faltar carta na pilha de compra, reembaralhe o descarte. Cópias de uma mesma carta contam como uma opção.
- **Piratas.** Ajuste a presença de inimigos, o acesso à costa, o Ouro do alvo, as oportunidades de acordo, o controle de regiões, os bares e a movimentação. Resolva os combates e a aceitação dos acordos ao testar. O descarte da mão com *Novas Comandante a Bordo* fica fora da contagem de opções de ação.
- **Necromante.** O cenário inicial tem duas regiões devastadas e nenhum recurso. Ajuste os alvos, a quantidade de regiões devastadas, a presença de extratores e o saldo de Madeira e Ouro. O custo da magia escolhida é descontado automaticamente. Atualize o tabuleiro e os ganhos de recursos depois de resolver os efeitos. O teste exige duas regiões devastadas para *Remanejando Mortos* e conta *Magia das Trevas* como uma opção se pelo menos uma magia puder ser lançada.

### Protótipos da conversa

- [Piratas do Mar Safira](<C:/Users/marcos/.codex/visualizations/2026/11/12/01a1cd9c-73ca-7313-b311-a88d426013e9/piratas-do-mar-safira.html>)
- [Necromante da Torre Esquecida](<C:/Users/marcos/.codex/visualizations/2026/11/12/01a1cd9c-73ca-7313-b311-a88d426013e9/necromante-da-torre-esquecida.html>)
