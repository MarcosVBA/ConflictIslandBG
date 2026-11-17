# Combate

## Início e participantes

**Definido; implementado nas cartas de ataque identificadas.** O combate começa quando uma carta ou efeito determina um ataque. Todas as tropas presentes da facção atacante enfrentam todas as tropas presentes da facção defensora. O limite de tropas que uma carta permite mover não limita as tropas já presentes que participam. Uma terceira facção presente não participa.

Cada batalha consiste em uma única rodada de rolagem. Após aplicar os resultados, a batalha termina, mesmo que haja sobreviventes dos dois lados. As tropas sobreviventes permanecem na região; o domínio é recalculado pelas [regras gerais](regras-gerais.md).

## Reação defensiva

**Definido; implementado.** Antes dos dados, o defensor decide se usa até uma carta defensiva, consumindo uma das suas duas ações ainda disponíveis; a ação futura correspondente é perdida. O mesmo custo se aplica a Canção de paz.

**Definido:** somente cartas com texto explícito de reação podem ser usadas como reação; cada carta determina seu momento. Reações não têm região. Futuras cartas poderão reagir ao atacar outros jogadores. Os estados específicos de Guarda Imperial, Praga Resistente e cartas piratas pertencem aos respectivos documentos de facção.

**Definido; implementado:** após o ataque ser confirmado e sua carta e ação serem gastas, o defensor decide e, se quiser, gasta sua reação. Em seguida os Elfos decidem sobre Canção de paz; só depois ocorre a rolagem, quando não houver cancelamento. As escolhas e os gastos confirmados não são revertidos pela Canção de paz.

**Definido; implementado no protótipo principal:** após a declaração de qualquer combate e antes da rolagem, o jogador dos Elfos pode usar Canção de paz para cancelá-lo, mesmo quando os Elfos não participam. Como em uma reação, gasta uma ação disponível e descarta a carta. Resolva o combate como 0 a 0, sem dano aos lados: tropas movidas permanecem no destino, recursos gastos não voltam e cartas já declaradas e ações gastas não são recuperadas, inclusive os de uma reação defensiva declarada anteriormente. A intervenção não torna os Elfos combatentes. A carta está em [Elfos](../faccoes/elfos.md).

## Rolagem e dano

**Definido para teste; implementado.** Use as faces de [Dados](dados.md). Role um dado de ataque por tropa atacante no início da rodada e um dado de defesa para cada defensor que exceda o número de atacantes. Some espadas e cruzes; as baixas de ambos os lados são simultâneas. Cada dano aplicado elimina uma tropa.

As baixas de tropas defensoras não excedem a quantidade inicial de tropas defensoras. O dano aplicado aos atacantes é limitado tanto à quantidade inicial de defensores quanto à de atacantes. Efeitos de cartas podem ignorar dano conforme seus textos.

**Definido posteriormente; implementado para teste.** Construções da facção defensora são atingidas após suas tropas serem eliminadas. Espadas excedentes às tropas defensoras destroem construções na mesma ação, à razão de um dano por construção; não é necessária ação separada. Se houver alternativas de construções a atingir, o protótipo pede uma escolha.

**Conciliação para teste:** o limite antigo continua limitando baixas de tropas, mas não elimina o dano excedente antes de ele atingir construções. A aplicação exata dessa conciliação ao registro antigo e outros detalhes de construções permanecem em revisão. **Definido; implementado no protótipo:** construções inimigas são alvos válidos para qualquer ataque, mesmo sem tropas defensoras. Rolam-se dados normalmente e o dano atinge as construções; quando não forem todas destruídas, o defensor escolhe quais perder. Sem tropas defensoras, nenhum dado de defesa é rolado; dados de defesa dependem de tropas defensoras em quantidade superior à atacante.

## Resultado e questões abertas

**Definido; implementado.** Um ataque é bem-sucedido se o atacante causa dano ao inimigo e possui tropas atacantes remanescentes após o combate. Isso não substitui exigências adicionais de cartas específicas. Saque é uma regra dos [Piratas](../faccoes/piratas.md).

**Pendente:** demais detalhes de ataque a construções, efeitos posteriores não especificados, retirada, alvos inválidos e adaptação das cartas ao fluxo sequencial. Batalhas com três facções participantes estão adiadas e fora do protótipo.
