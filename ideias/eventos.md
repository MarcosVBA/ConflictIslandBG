# Eventos por marco de pontuação

**Direção para teste, implementada no protótipo:** após calcular os pontos da rodada, se alguma facção tiver pelo menos 20 pontos e o evento automático ainda não tiver ocorrido, embaralhe as oito cartas e revele até encontrar uma que cumpra sua condição. A verificação ocorre uma vez por etapa de pontuação, considerando o placar atual; atingir 20 durante as ações não dispara o evento se a pontuação cair antes dessa etapa. O empate pela maior pontuação conta como estar na liderança; para primeiro ou segundo lugar, contam-se as facções com pontuação estritamente maior. O evento é apresentado na etapa de pontuação. A vitória aos 30 pontos continua imediata. As quatro facções participam do protótipo.

O botão **Testar evento**, no modal de pontuação, permite escolher qualquer carta sem cumprir condição ou marco; não consome o baralho normal nem substitui o sorteio do marco. Se houver ação ou combate em andamento, a execução aguarda sua conclusão. Eventos manuais podem ser repetidos. O registro mostra as cartas reveladas e aplicadas, e os efeitos permanentes aparecem nas informações da partida.

| Carta | Condição | Efeito em teste |
| --- | --- | --- |
| Espalhar a Morte | Necromante não está empatado na maior pontuação | Adicione um zumbi em cada região sem zumbis e escolha regiões para mais dois. |
| Vingança da Mata | Elfos não estão empatados na maior pontuação | Remova peças de outras facções das florestas e adicione um elfo em cada uma. |
| Riqueza Pirata | Piratas não estão empatados na maior pontuação | Escolha regiões para até dois Bares adicionais, respeitando o limite de três. O limite passa a três e sua destruição deixa de gerar penalidade; Bares controlados continuam gerando um Ouro, convertido em ponto na pontuação. |
| Colonização | Império não está empatado na maior pontuação | Escolha tecnologias ainda não construídas e regiões dominadas distintas, sem construção imperial, para construí-las gratuitamente. Custos, pré-requisitos e pontos de construção não são aplicados neste evento. |
| A Grande Fome | Necromante ausente ou com menos de cinco zumbis | Elimine todas as tropas exceto zumbis. |
| Incêndio na Floresta | Elfos participam | Cada facção com peça em floresta escolhe uma peça própria para remover. Escolha uma região de Madeira que deixa de produzi-la. |
| Escassez de Ouro | Império ausente ou em primeiro ou segundo lugar | Somente R11 continua produzindo Ouro. |
| O Mal da Guerra | Sempre | Remova todas as peças das regiões ocupadas por mais de uma facção. |

**Hipóteses de implementação:** os efeitos que alteram produção e limite permanecem até o reinício; repetições acumulam regiões sem Madeira e não duplicam Bares na mesma região. Onde não houver opções suficientes, Riqueza Pirata adiciona apenas as possíveis e cada facção sem peça em floresta não remove peça no Incêndio. Remoções de Bar aplicam a penalidade pirata, salvo após Riqueza Pirata. A recuperação da Torre ocorre após a aplicação completa do evento.

**Pendente:** aprovação das cartas e suas condições, efeitos e duração; desempates de posição; escolhas de Colonização e limites de componentes; consequências quando eventos eliminam peças essenciais; interação com ações suspensas e fim de jogo; fluxo caso nenhuma carta seja elegível. O baralho e os efeitos são uma adaptação para teste, não decisões definitivas.
