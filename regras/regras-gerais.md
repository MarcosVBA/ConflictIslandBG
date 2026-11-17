# Regras gerais

Este módulo reúne regras comuns fora de combate, dados, mapa e pontuação. Para conteúdos específicos, use os documentos ligados no [índice](../README.md).

## Rodada e ações

**Definido; implementado nos dois protótipos.** Cada facção coloca exatamente dois marcadores em regiões, um por vez. A primeira colocação cabe ao próximo jogador após o líder no sentido anti-horário; os demais seguem nesse sentido, com o líder por último. Repete-se a mesma volta para o segundo marcador. A resolução começa após todos colocarem seus dois marcadores.

**Direção para teste; implementada como hipótese no protótipo.** As ações são resolvidas sequencialmente; ao chegar sua vez, a facção escolhe uma carta compatível com um marcador disponível e o estado atual do tabuleiro.

O protótipo usa marcadores públicos e alternância entre facções com marcadores disponíveis, começando pelo líder da rodada e seguindo sempre o sentido anti-horário da mesa. A pessoa escolhe apenas o primeiro jogador da partida; a sequência fixa de assentos é Império → Necromante → Piratas → Elfos → Império no protótipo de quatro facções e Império → Necromante → Piratas → Império no de três. A configuração padrão da mão é cinco cartas, ajustável de 1 a 10; no início de cada rodada, o jogo completa a mão e reembaralha o descarte se necessário. Passar uma ação consome o marcador escolhido. Consultar uma carta durante a alocação não a joga.

**Definido; implementado:** a compra normal de cartas ocorre antes da fase de alocação de marcadores. Como exceção, as cartas que mandam descartar toda a mão também compram imediatamente até ter cinco cartas, mesmo durante a resolução. Durante a resolução, o jogador pode descartar uma carta da mão usando um marcador disponível, inclusive quando não puder jogar nenhuma carta. O descarte de uma carta com marcador não gera compra imediata.

## Variante de fluxo dinâmico

**Direção solicitada para teste; implementada em protótipo separado.** A fase de alocação prévia é dispensada. Cada facção mantém dois marcadores de ação fora do mapa; na sua vez de resolução, escolhe uma região e coloca um marcador disponível ao preparar a carta. A condição da carta é verificada normalmente. Depois do leilão, o líder inicia a resolução, seguida em sentido anti-horário, como no cenário anterior.

Um marcador ainda disponível também pode ser consumido para passar, descartar uma carta ou fazer uma reação permitida. Para reagir não é necessário tê-lo colocado em uma região: o custo continua sendo uma ação futura. Se a preparação de um combate for cancelada antes da rolagem, o marcador volta à reserva. A compra normal ocorre no início da rodada; no novo protótipo o [Alistamento Obrigatório](../faccoes/imperio.md) é resolvido nessa preparação, após completar as mãos e antes do leilão.

Essa variante é para comparação em partida; não substitui automaticamente a regra de alocação dos dois protótipos anteriores. Comparar ritmo, antecipação das jogadas e uso de reações antes de decidir a direção definitiva.

## Liderança por leilão

**Definido; implementado nos protótipos:** no início de cada rodada há uma disputa de liderança por cartas, depois da compra e antes da alocação ou, na variante dinâmica, antes da resolução de ações. Cada carta tem valor de liderança entre 0 e 3; cartas mais versáteis tendem a valer mais e as de valor 3 devem ser raras. Os valores individuais definidos pelo usuário para teste estão nos documentos de cada facção; o balanceamento não é final.

As facções revelam cartas para disputar a liderança; um novo lance precisa superar o anterior. Cartas oferecidas permanecem abertas até o fim do leilão e não podem ser substituídas: o jogador pode acrescentar cartas ao próprio lance. O vencedor joga primeiro e descarta suas cartas comprometidas; os demais recuperam as suas. O leilão não implica compra imediata após o descarte. Após o líder, segue-se a ordem anti-horária da mesa. Se ninguém fizer um lance positivo, mantém-se o líder anterior; na primeira rodada, ele é escolhido manualmente.

O líder anterior tem a primeira oportunidade de lance; na primeira rodada, usa-se o jogador inicial escolhido manualmente. A vez de ofertar segue a ordem anti-horária da mesa, pulando quem já passou e quem detém o maior lance. Passar retira o jogador do leilão. A disputa termina quando ninguém pode ou precisa cobrir o maior lance, ou quando todos passam sem lance positivo.

## Demais questões da rodada

**Pendente:** visibilidade dos marcadores, política de reposição, passe em ações e tratamento de ações cujo alvo se torna inválido. O uso de cartas que envolvem múltiplas regiões ou qualquer lugar também precisa de revisão.

## Domínio e coexistência

**Definido; implementado.** A facção com mais tropas presentes domina a região. Se duas ou mais facções empatam na maior quantidade, nenhuma domina. Tropas de facções diferentes podem coexistir; a presença conjunta, por si só, não inicia combate.

Se não há tropas, construções pertencentes a uma única facção mantêm o domínio dela. Construções de facções diferentes sem tropas deixam a região sem domínio, independentemente de suas quantidades. Se há tropas, o domínio segue a maioria de tropas e as construções não a sobrepõem. Uma região sem tropas nem construções fica imediatamente sem domínio; uma unidade que entra em uma região vazia passa a dominá-la.

A condição especial de região devastada é definida em [Necromante](../faccoes/necromante.md), não é sinônimo de domínio.

**Pendente:** demais condições de movimentação, contestação, retirada e interação entre facções. O início e a resolução de ataques são tratados em [Combate](combate.md).

## Recursos e cartas

Madeira e Ouro são recursos representados no protótipo. O mapa identifica onde estão disponíveis, sem definir renda automática geral. Cada facção tem regras próprias de coleta e uso no seu documento. A composição e o efeito de cada carta pertencem ao respectivo documento de facção.

**Pendente:** regras gerais de produção, suprimentos físicos e condições de coleta que não estejam determinadas por carta ou facção.
