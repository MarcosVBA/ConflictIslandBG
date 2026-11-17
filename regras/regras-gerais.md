# Regras gerais

Este módulo reúne regras comuns fora de combate, dados, mapa e pontuação. Para conteúdos específicos, use os documentos ligados no [índice](../README.md).

## Rodada e ações

**Definido como sistema padrão; implementado no protótipo principal.** Não há fase de alocação prévia. Cada facção começa a rodada com dois marcadores de ação em reserva, fora do mapa. Na sua vez, escolhe uma região e um marcador disponível ao preparar a carta; verifica-se a condição da carta no estado atual do tabuleiro. Um marcador disponível também pode ser consumido para passar, descartar uma carta ou realizar uma reação permitida, perdendo-se a ação correspondente.

Depois da compra normal, resolvem-se as habilidades de preparação, incluindo o [Alistamento Obrigatório](../faccoes/imperio.md), e o leilão. O líder inicia as ações, que seguem em sentido anti-horário: Império → Necromante → Piratas → Elfos → Império. O primeiro jogador da partida é escolhido manualmente; nas rodadas seguintes, o líder anterior inicia o leilão.

A mão tem cinco cartas por padrão, ajustável de 1 a 10 no protótipo. No início da rodada, completa-se a mão, reembaralhando o descarte quando necessário. Cartas que exigem descartar toda a mão compram imediatamente até cinco cartas durante a resolução. Descartar uma carta com marcador não gera compra imediata. Ao cancelar uma preparação de combate antes dos dados, o marcador volta à reserva, salvo se a Magia da Torre já tiver sido resolvida.

O sistema anterior de alocação está preservado como [histórico](../historico/prototipos/alocacao-de-marcadores.md).

## Liderança por leilão

**Definido; implementado no protótipo principal:** no início de cada rodada há uma disputa de liderança por cartas, depois da compra e das habilidades de preparação e antes da resolução de ações. Cada carta tem valor de liderança entre 0 e 3; cartas mais versáteis tendem a valer mais e as de valor 3 devem ser raras. Os valores individuais definidos pelo usuário para teste estão nos documentos de cada facção; o balanceamento não é final.

As facções revelam cartas para disputar a liderança; um novo lance precisa superar o anterior. Cartas oferecidas permanecem abertas até o fim do leilão e não podem ser substituídas: o jogador pode acrescentar cartas ao próprio lance. O vencedor joga primeiro e descarta suas cartas comprometidas; os demais recuperam as suas. O leilão não implica compra imediata após o descarte. Após o líder, segue-se a ordem anti-horária da mesa. Se ninguém fizer um lance positivo, mantém-se o líder anterior; na primeira rodada, ele é escolhido manualmente.

O líder anterior tem a primeira oportunidade de lance; na primeira rodada, usa-se o jogador inicial escolhido manualmente. A vez de ofertar segue a ordem anti-horária da mesa, pulando quem já passou e quem detém o maior lance. Passar retira o jogador do leilão. A disputa termina quando ninguém pode ou precisa cobrir o maior lance, ou quando todos passam sem lance positivo.

## Demais questões da rodada

**Pendente:** política de reposição e tratamento de ações cujo alvo se torna inválido. O uso de cartas que envolvem múltiplas regiões ou qualquer lugar também precisa de revisão.

## Domínio e coexistência

**Definido; implementado.** A facção com mais tropas presentes domina a região. Se duas ou mais facções empatam na maior quantidade, nenhuma domina. Tropas de facções diferentes podem coexistir; a presença conjunta, por si só, não inicia combate.

Se não há tropas, construções pertencentes a uma única facção mantêm o domínio dela. Construções de facções diferentes sem tropas deixam a região sem domínio, independentemente de suas quantidades. Se há tropas, o domínio segue a maioria de tropas e as construções não a sobrepõem. Uma região sem tropas nem construções fica imediatamente sem domínio; uma unidade que entra em uma região vazia passa a dominá-la.

A condição especial de região devastada é definida em [Necromante](../faccoes/necromante.md), não é sinônimo de domínio.

**Pendente:** demais condições de movimentação, contestação, retirada e interação entre facções. O início e a resolução de ataques são tratados em [Combate](combate.md).

## Recursos e cartas

Madeira e Ouro são recursos representados no protótipo. O mapa identifica onde estão disponíveis, sem definir renda automática geral. Cada facção tem regras próprias de coleta e uso no seu documento. A composição e o efeito de cada carta pertencem ao respectivo documento de facção.

**Pendente:** regras gerais de produção, suprimentos físicos e condições de coleta que não estejam determinadas por carta ou facção.
