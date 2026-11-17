# Combate

## Início e participantes

**Definido; implementado nas cartas de ataque identificadas.** O combate começa quando uma carta ou efeito determina um ataque. Todas as tropas presentes da facção atacante enfrentam todas as tropas presentes da facção defensora. O limite de tropas que uma carta permite mover não limita as tropas já presentes que participam. Uma terceira facção presente não participa.

Cada batalha consiste em uma única rodada de rolagem. Após aplicar os resultados, a batalha termina, mesmo que haja sobreviventes dos dois lados. As tropas sobreviventes permanecem na região; o domínio é recalculado pelas [regras gerais](regras-gerais.md).

## Reação defensiva

**Definido; implementado.** Antes dos dados, o defensor decide se usa até uma carta defensiva, consumindo um dos seus marcadores de ação ainda disponíveis na reserva; a ação futura correspondente é perdida. O mesmo custo se aplica a Canção de paz.

**Proposta:** ao adaptar outras cartas para defesa reativa, preservar seu efeito e aplicá-lo à região atacada. A elegibilidade das demais cartas permanece pendente. Os estados específicos de Guarda Imperial, Praga Resistente e cartas piratas pertencem aos respectivos documentos de facção.

**Definido; implementado no protótipo principal:** após a declaração de qualquer combate e antes da rolagem, o jogador dos Elfos pode usar Canção de paz para cancelá-lo, mesmo quando os Elfos não participam. Como em uma reação, gasta um marcador de ação disponível e descarta a carta. Resolva o combate como 0 a 0, sem dano aos lados: tropas movidas permanecem no destino, recursos gastos não voltam e cartas já declaradas e marcadores gastos não são recuperados, inclusive os de uma reação defensiva declarada anteriormente. A intervenção não torna os Elfos combatentes. A carta está em [Elfos](../faccoes/elfos.md).

## Rolagem e dano

**Definido para teste; implementado.** Use as faces de [Dados](dados.md). Role um dado de ataque por tropa atacante no início da rodada e um dado de defesa para cada defensor que exceda o número de atacantes. Some espadas e cruzes; as baixas de ambos os lados são simultâneas. Cada dano aplicado elimina uma tropa.

As baixas de tropas defensoras não excedem a quantidade inicial de tropas defensoras. O dano aplicado aos atacantes é limitado tanto à quantidade inicial de defensores quanto à de atacantes. Efeitos de cartas podem ignorar dano conforme seus textos.

**Definido posteriormente; implementado para teste.** Construções da facção defensora são atingidas após suas tropas serem eliminadas. Espadas excedentes às tropas defensoras destroem construções na mesma ação, à razão de um dano por construção; não é necessária ação separada. Se houver alternativas de construções a atingir, o protótipo pede uma escolha.

**Conciliação para teste:** o limite antigo continua limitando baixas de tropas, mas não elimina o dano excedente antes de ele atingir construções. A aplicação exata dessa conciliação ao registro antigo e outros detalhes de construções permanecem em revisão. No protótipo atual, as cartas de ataque exigem tropas defensoras presentes; o alvo com somente construções ainda precisa de regra ou carta que o permita.

## Resultado e questões abertas

**Definido; implementado.** Um ataque é bem-sucedido se o atacante causa dano ao inimigo e possui tropas atacantes remanescentes após o combate. Isso não substitui exigências adicionais de cartas específicas. Saque é uma regra dos [Piratas](../faccoes/piratas.md).

**Pendente:** demais detalhes de ataque a construções, efeitos posteriores não especificados, retirada, alvos inválidos e adaptação das cartas ao fluxo sequencial. Batalhas com três facções participantes estão adiadas e fora do protótipo.
