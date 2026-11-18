# Regras gerais

Este módulo reúne regras comuns fora de combate, dados, mapa e pontuação. Para conteúdos específicos, use os documentos ligados no [índice](../README.md).

## Rodada e ações

**Definido; parcialmente implementado.** Não há alocação prévia nem marcadores físicos. Cada facção tem duas ações por rodada; na sua vez, escolhe carta e, quando o efeito exige, região. Descartar uma carta consome uma ação; reações gastam a carta sem consumir ação. A escolha é validada antes de confirmar e gastar a carta, custos e ação. O protótipo ainda usa marcadores virtuais internamente.

Depois da compra normal, resolvem-se as habilidades de preparação, incluindo o [Alistamento Obrigatório](../faccoes/imperio.md), e o leilão. O líder inicia as ações, que seguem em sentido anti-horário: Império → Necromante → Piratas → Elfos → Império. O primeiro jogador da partida é escolhido manualmente; nas rodadas seguintes, o líder anterior inicia o leilão.

A mão tem cinco cartas por padrão, ajustável de 1 a 10 no protótipo. No início da rodada, completa-se a mão, reembaralhando o descarte quando necessário. Descartar uma carta usando uma ação não gera compra imediata. Antes de confirmar o uso da carta, o jogador pode alterar suas escolhas. Depois da confirmação, a ação não pode ser cancelada; no protótipo, confirmar o ataque inicia a resolução sem opção de cancelamento.

O sistema anterior de alocação está preservado como [histórico](../historico/prototipos/alocacao-de-marcadores.md).

## Liderança por leilão

**Definido; implementado no protótipo principal:** no início de cada rodada há uma disputa de liderança por cartas, depois da compra e das habilidades de preparação e antes da resolução de ações. Cada carta tem valor de liderança entre 0 e 3; cartas mais versáteis tendem a valer mais e as de valor 3 devem ser raras. Os valores individuais definidos pelo usuário para teste estão nos documentos de cada facção; o balanceamento não é final.

As facções revelam cartas para disputar a liderança; um novo lance precisa superar o anterior. Cartas oferecidas permanecem abertas até o fim do leilão e não podem ser substituídas: o jogador pode acrescentar cartas ao próprio lance. O vencedor joga primeiro e descarta suas cartas comprometidas; os demais recuperam as suas. O leilão não implica compra imediata após o descarte. Após o líder, segue-se a ordem anti-horária da mesa. Se ninguém fizer um lance positivo, mantém-se o líder anterior; na primeira rodada, ele é escolhido manualmente.

O líder anterior tem a primeira oportunidade de lance; na primeira rodada, usa-se o jogador inicial escolhido manualmente. A vez de ofertar segue a ordem anti-horária da mesa, pulando quem já passou e quem detém o maior lance. Passar retira o jogador do leilão. A disputa termina quando ninguém pode ou precisa cobrir o maior lance, ou quando todos passam sem lance positivo.

## Decisão sobre ações e componentes

**Definido; parcialmente implementado:** a carta é usada e seu efeito é aplicado no mesmo momento, sem etapa separada de alocação de marcadores. Cada facção mantém duas ações por rodada; reações não consomem essas ações. O protótipo atual ainda representa essas ações com marcadores virtuais. Por enquanto não há limite digital de peças; futuramente haverá limite a definir. Se uma peça física necessária não estiver disponível, a ação é pulada. A representação dessa disponibilidade no jogo digital ainda precisa ser definida.

## Demais questões da rodada

**Pendente:** situações de reposição não cobertas acima e tratamento de ações cujo alvo se torna inválido. O uso de cartas que envolvem múltiplas regiões ou qualquer lugar também precisa de revisão.

## Domínio e coexistência

**Definido; implementado.** A facção com mais tropas presentes domina a região. Se duas ou mais facções empatam na maior quantidade, nenhuma domina. Tropas de facções diferentes podem coexistir; a presença conjunta, por si só, não inicia combate.

Se não há tropas, construções pertencentes a uma única facção mantêm o domínio dela. Construções de facções diferentes sem tropas deixam a região sem domínio, independentemente de suas quantidades. Se há tropas, o domínio segue a maioria de tropas e as construções não a sobrepõem. Uma região sem tropas nem construções fica imediatamente sem domínio; uma unidade que entra em uma região vazia passa a dominá-la.

A condição especial de região devastada é definida em [Necromante](../faccoes/necromante.md), não é sinônimo de domínio.

**Pendente:** demais condições de movimentação, contestação, retirada e interação entre facções. O início e a resolução de ataques são tratados em [Combate](combate.md).

## Recursos e cartas

Madeira e Ouro são recursos representados no protótipo. O mapa identifica onde estão disponíveis, sem definir renda automática geral. Cada facção tem regras próprias de coleta e uso no seu documento. A composição e o efeito de cada carta pertencem ao respectivo documento de facção.

**Pendente:** regras gerais de produção, suprimentos físicos e condições de coleta que não estejam determinadas por carta ou facção.

## Modos das cartas

**Definido.** Uma barra indica escolha de um modo. Jogar um modo de ação gasta a carta inteira e uma ação; uma reação gasta a carta inteira sem consumir ação. A oferta no leilão compromete a carta inteira e usa a liderança impressa. Uma ação descrita como mover e/ou atacar permite apenas mover, apenas atacar ou mover e então combater em uma ação. A Infestação possui resolução própria descrita no módulo do Necromante. Preparações canceladas e ações inválidas preservam os recursos e o turno. Acordos válidos recusados gastam carta e ação conforme as regras de Corsário, Transporte e Harmonia.

Ao fim das ações, uma facção sem cartas encerra automaticamente sua vez. Nas ações restantes, o jogador joga ou descarta uma carta para gastar uma ação. Na pontuação, cada facção pode descartar toda a mão restante. A compra até o limite ocorre na preparação da próxima rodada. Passar continua disponível no leilão.

No leilão, antes de qualquer lance, a mesa pode pular a fase quando ninguém pretende ofertar. Sem lances, mantém-se o líder anterior ou o primeiro da ordem inicial, sem descarte de cartas.
