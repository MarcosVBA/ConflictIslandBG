# Mapa e cenário inicial

**Cenário principal implementado; distribuição em teste.** Império, Necromante, Piratas e Elfos jogam em 11 regiões. Há quatro florestas com Madeira, cinco regiões costeiras, duas montanhas e quatro regiões com Ouro. A posição inicial do extrator permanece provisória.

| ID | Região | Terreno | Costa | Recurso | Início |
| --- | --- | --- | --- | --- | --- |
| R1 | Praia Dourada | Praia | Sim | Ouro | Império: 2 soldados |
| R2 | Mata da Coroa | Floresta | Não | Madeira | Império: 1 soldado |
| R3 | Torre Esquecida | Montanha | Não | Ouro | Necromante: 2 zumbis e Torre |
| R4 | Bosque Morto | Floresta | Não | Madeira | Necromante: 1 zumbi e extrator provisório |
| R5 | Enseada Safira | Praia | Sim | Nenhum | Piratas: 1 tropa |
| R6 | Floresta Antiga | Floresta | Não | Madeira | Elfos: 1 unidade |
| R7 | Pico Desolado | Montanha | Não | Nenhum | Livre |
| R8 | Praia dos Náufragos | Praia | Sim | Nenhum | Livre |
| R9 | Baixio dos Garimpeiros | Planície | Sim | Ouro | Livre |
| R10 | Bosque Élfico | Floresta | Não | Madeira | Elfos: 2 unidades |
| R11 | Costa do Ouro Perdido | Praia | Sim | Ouro | Livre |

O Império começa com 1 Ouro; o Necromante com 1 Madeira; Piratas e Elfos começam sem recursos. Os Elfos dominam inicialmente duas florestas. A Torre começa na montanha R3.

## Conexões

Cada ligação é bidirecional e aparece uma vez:

R1-R2, R1-R8, R1-R9, R2-R4, R2-R10, R3-R4, R3-R7, R4-R6, R4-R7, R5-R6, R5-R9, R6-R7, R6-R8, R6-R9, R7-R9, R8-R9, R10-R6, R10-R8, R10-R11, R11-R5, R11-R8.

**Pendente de validação:** equilíbrio da distribuição, topologia, posição visual, distâncias efetivas, fontes de recursos e mobilidade costeira. Mapas para cinco ou possivelmente seis jogadores ficam para depois. O cenário anterior de nove regiões está nos [protótipos legados](../historico/prototipos/alocacao-de-marcadores.md).
