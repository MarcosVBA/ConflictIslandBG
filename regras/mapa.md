# Mapa e cenário inicial para três facções

**Definido para o protótipo; implementado.** O cenário usa nove regiões. Três ou quatro regiões centrais são florestas com Madeira; quatro ou cinco são costeiras e marcadas por âncora. Há praias e montanhas; planícies são opcionais. Ouro está principalmente nas montanhas, com uma praia como exceção.

**Distribuição de teste:** nomes, planície e distribuição das regiões livres continuam sujeitos a revisão. A localização inicial do extrator é provisória.

| ID | Região de teste | Terreno | Costa | Recurso | Início |
| --- | --- | --- | --- | --- | --- |
| R1 | Praia Dourada | Praia | Sim | Ouro | Império: 2 soldados |
| R2 | Mata da Coroa | Floresta | Não | Madeira | Império: 1 soldado |
| R3 | Torre Esquecida | Montanha | Não | Ouro | Necromante: 2 zumbis e Torre |
| R4 | Bosque Morto | Floresta | Não | Madeira | Necromante: 1 zumbi e extrator provisório |
| R5 | Enseada Safira | Praia | Sim | Nenhum | Piratas: 1 tropa |
| R6 | Floresta Antiga | Floresta | Não | Madeira | Livre |
| R7 | Pico Partido | Montanha | Sim | Ouro | Livre |
| R8 | Praia dos Náufragos | Praia | Sim | Nenhum | Livre |
| R9 | Baixio Aberto | Planície | Não | Nenhum | Livre |

O Império começa com 1 Ouro; o Necromante com 1 Madeira; Piratas começam sem recursos. A posição do extrator entre as regiões iniciais do Necromante permanece pendente e o protótipo usa a floresta como hipótese ajustável. A Torre começa na montanha.

## Conexões aprovadas

Cada ligação é bidirecional e está listada uma única vez:

R1-R2, R1-R8, R1-R9, R2-R4, R2-R6, R2-R9, R3-R4, R3-R7, R4-R6, R4-R7, R5-R6, R5-R8, R5-R9, R6-R7, R6-R8, R6-R9, R7-R9, R8-R9.

**Pendente:** nomes e distribuição definitiva das regiões livres, uso da planície, se toda montanha tem Ouro, rotas marítimas especiais e localização definitiva do extrator. Mapas para cinco ou possivelmente seis jogadores ficam para depois.

## Proposta para quatro facções e 11 regiões

**Cenário de teste; implementado no novo protótipo:** Império, Necromante, Piratas e Elfos jogam em 11 regiões, preservando florestas, montanhas com a Torre Esquecida e costas. O cenário de nove regiões acima continua no HTML anterior.

**Definido e implementado no novo cenário:** os Elfos começam dominando duas florestas, com duas unidades em uma e uma unidade na outra.

**Distribuição para teste:** manter R1–R9, seus terrenos, recursos e posições iniciais, exceto que R6 passa de livre a inicial dos Elfos, com uma unidade. No mapa de quatro facções, removem-se as ligações R5–R8 e R9–R2 e substitui-se R2–R6 por R2–R10. Acrescentam-se as duas regiões seguintes; nomes e distribuição estão sujeitos a revisão.

| ID | Região proposta | Terreno | Costa | Recurso | Início proposto |
| --- | --- | --- | --- | --- | --- |
| R10 | Bosque Élfico | Floresta | Não | Madeira | Elfos: 2 unidades |
| R11 | Costa das Brumas | Praia | Sim | Nenhum | Livre |

**Conexões adicionais de teste, bidirecionais:** R2–R10, R10–R6, R10–R8, R10–R11, R11–R5 e R11–R8. Junto às conexões do cenário anterior, exceto as removidas ou substituídas acima, o mapa tem quatro florestas, cinco costas, duas montanhas e 21 ligações. A Torre Esquecida permanece em R3. A legibilidade da disposição precisa ser validada em navegador e em partida.

**Definido:** os Elfos começam sem recursos.

**Pendente de validação:** distribuição e topologia para além deste teste, posição visual e distâncias efetivas entre facções; adequação das fontes de Madeira e Ouro e da mobilidade costeira ao equilíbrio de quatro jogadores. A composição não presume que controle de todas as florestas, negociação ou combate estejam balanceados. O [plano](../prototipo/plano-quatro-faccoes.md) registra implementação e testes.
