# Eventos por marco de pontuação

**Definido; implementado:** após calcular os pontos da rodada, se alguma facção tiver pelo menos 10 pontos e o evento automático ainda não tiver ocorrido, embaralhe as oito cartas e revele até encontrar uma que cumpra sua condição. A verificação ocorre uma vez por etapa de pontuação, considerando o placar atual; atingir 10 durante as ações não dispara o evento se a pontuação cair antes dessa etapa. O empate pela maior pontuação conta como estar na liderança; para primeiro ou segundo lugar, contam-se as facções com pontuação estritamente maior. O evento é apresentado na etapa de pontuação. A vitória aos 20 pontos continua imediata. As quatro facções participam do protótipo.

O botão **Testar evento**, no modal de pontuação, permite escolher qualquer carta sem cumprir condição ou marco; não consome o baralho normal nem substitui o sorteio do marco. Se houver ação ou combate em andamento, a execução aguarda sua conclusão. Eventos manuais podem ser repetidos. O registro mostra as cartas reveladas e aplicadas, e os efeitos permanentes aparecem nas informações da partida.

| Carta | Condição | Efeito |
| --- | --- | --- |
| Espalhar a Morte | Necromante não está empatado na maior pontuação | Adicione um zumbi em cada região sem zumbis e escolha regiões para mais dois. |
| Vingança da Mata | Elfos não estão empatados na maior pontuação | Remova peças de outras facções das florestas e adicione um elfo em cada uma. |
| Riqueza Pirata | Piratas não estão empatados na maior pontuação | Escolha regiões para até dois Bares adicionais, respeitando o limite de três. O limite passa a três e sua destruição deixa de gerar penalidade; Bares continuam gerando um Ouro, convertido em ponto na pontuação. |
| Colonização | Império não está empatado na maior pontuação | Escolha tecnologias ainda não construídas e regiões dominadas distintas, sem construção imperial, para construí-las gratuitamente. Custos, pré-requisitos e pontos de construção não são aplicados neste evento. |
| A Grande Fome | Necromante ausente ou com menos de cinco zumbis | Elimine todas as tropas exceto zumbis. |
| Incêndio na Floresta | Elfos participam | Cada facção com peça em floresta escolhe uma peça própria para remover. Escolha uma região de Madeira que deixa de produzi-la. |
| Escassez de Ouro | Império ausente ou em primeiro ou segundo lugar | Somente R11 continua produzindo Ouro. |
| O Mal da Guerra | Sempre | Remova todas as peças das regiões ocupadas por mais de uma facção. |

**Definido; implementado:** os efeitos que alteram produção e limite permanecem até o reinício; repetições acumulam regiões sem Madeira e não duplicam Bares na mesma região. Onde não houver opções suficientes, Riqueza Pirata adiciona apenas as possíveis e cada facção sem peça em floresta não remove peça no Incêndio. Remoções de Bar aplicam a penalidade pirata, salvo após Riqueza Pirata. A recuperação da Torre ocorre após a aplicação completa do evento.

**Pendente:** limites de componentes e consequências não especificadas quando eventos eliminam peças essenciais. O protótipo usa as escolhas e a duração descritas acima; a vitória imediata encerra a partida antes de evento pendente. O fluxo sem carta elegível permanece pendente; Guerra é sempre elegível no baralho atual.
