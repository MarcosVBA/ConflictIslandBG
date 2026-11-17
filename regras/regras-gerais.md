# Regras gerais

Este módulo reúne regras comuns fora de combate, dados, mapa e pontuação. Para conteúdos específicos, use os documentos ligados no [índice](../README.md).

## Rodada e ações

**Direção para teste; implementada como hipótese no protótipo.** Cada facção aloca até dois marcadores em regiões. A alocação é coletiva e, no protótipo, cada facção confirma quando termina, mesmo que use menos de dois. As ações são resolvidas sequencialmente; ao chegar sua vez, a facção escolhe uma carta compatível com um marcador disponível e o estado atual do tabuleiro.

O protótipo usa marcadores públicos, ordem escolhida manualmente e alternância entre facções com marcadores disponíveis. A configuração padrão da mão é cinco cartas, ajustável de 1 a 10; no início de cada rodada, o jogo completa a mão e reembaralha o descarte se necessário. Passar consome o marcador escolhido. Consultar uma carta durante a alocação não a joga.

**Definido; implementado:** a compra normal de cartas ocorre antes da fase de alocação de marcadores. Como exceção, as cartas que mandam descartar toda a mão também compram imediatamente até ter cinco cartas, mesmo durante a resolução. Durante a resolução, o jogador pode descartar uma carta da mão usando um marcador disponível, inclusive quando não puder jogar nenhuma carta. O descarte de uma carta com marcador não gera compra imediata.

**Pendente:** procedimento de liderança, passagem de liderança, ordem definitiva de alocação e resolução, visibilidade dos marcadores, quantidade e política de reposição, passe e tratamento de ações cujo alvo se torna inválido. O uso de cartas que envolvem múltiplas regiões ou qualquer lugar também precisa de revisão.

## Domínio e coexistência

**Definido; implementado.** A facção com mais tropas presentes domina a região. Se duas ou mais facções empatam na maior quantidade, nenhuma domina. Tropas de facções diferentes podem coexistir; a presença conjunta, por si só, não inicia combate.

Se não há tropas, construções pertencentes a uma única facção mantêm o domínio dela. Construções de facções diferentes sem tropas deixam a região sem domínio, independentemente de suas quantidades. Se há tropas, o domínio segue a maioria de tropas e as construções não a sobrepõem. Uma região sem tropas nem construções fica imediatamente sem domínio; uma unidade que entra em uma região vazia passa a dominá-la.

A condição especial de região devastada é definida em [Necromante](../faccoes/necromante.md), não é sinônimo de domínio.

**Pendente:** demais condições de movimentação, contestação, retirada e interação entre facções. O início e a resolução de ataques são tratados em [Combate](combate.md).

## Recursos e cartas

Madeira e Ouro são recursos representados no protótipo. O mapa identifica onde estão disponíveis, sem definir renda automática geral. Cada facção tem regras próprias de coleta e uso no seu documento. A composição e o efeito de cada carta pertencem ao respectivo documento de facção.

**Pendente:** regras gerais de produção, suprimentos físicos e condições de coleta que não estejam determinadas por carta ou facção.
