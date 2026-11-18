# Elfos da Floresta

Uma variante experimental de 12 cartas está descrita em [Baralhos revisados](../../../prototipo/baralhos-revisados.md); as tabelas abaixo permanecem vigentes para a mesa principal.

**Conteúdo registrado pelo usuário; implementado no protótipo de quatro facções para teste.** O baralho tem 23 cartas.

**Início definido; implementado no protótipo principal:** os Elfos dominam duas regiões de floresta, com duas unidades em cada uma, sem recursos iniciais. As regiões do cenário de teste estão em [Mapa](../../../regras/mapa.md).

## Guardiões da Floresta

Se dominar 2 regiões de floresta, ganhe 1 ponto no final da rodada. Se dominar todas as regiões de floresta, ganhe 2 pontos no total, em vez do ponto por duas florestas.
Sempre que batalhar em uma região de floresta e eliminar as tropas inimigas da região, ganhe 1 ponto.

**Definido:** basta eliminar as tropas da facção adversária da batalha, mesmo se outra facção inimiga permanecer na região.

## Vingança da Terra

Se não houver mais tropas aliadas em jogo, aloque 3 vezes uma tropa em qualquer região de floresta. **Definido; implementado:** ocorre imediatamente. O jogador escolhe uma floresta para cada tropa; pode escolher a mesma região mais de uma vez.

## Coexistência Pacifica

Sempre que trocar ao menos um recurso com um jogador, receba 1 ponto. Esse bonus se aplica a cada jogador novo, por rodada.

## Baralho

| Carta | Cópias | Região ou condição | Efeito proposto |
| --- | ---: | --- | --- |
| Furia da Ilha | 3 | Região com tropas aliadas | Mova até 3 tropas para uma região adjacente; Se houver tropas inimigas, batalhe com suas tropas |
| Conhecimentos da Floresta | 4 | Ao ser atacado ou atacar | Ignore o primeiro dano na batalha |
| Canção de paz | 1 | Qualquer combate declarado, mesmo sem os Elfos envolvidos; antes da rolagem | Os Elfos gastam uma ação disponível e descartam esta carta para cancelar o combate, como resultado 0 a 0. Movimentos e custos já realizados permanecem; cartas já declaradas e ações gastas não são recuperadas. |
| Trilhas na Mata | 2 | Qualquer região | Mova tropas aliadas de uma região adjacente para essa |
| Harmônia | 3 | Região com tropas inimigas | Após revelar a carta, troque com o jogador escolhido quantos recursos desejar, incluindo tropas, se ambos concordem |
| Frutos da Mata | 6 | Qualquer região com tropas aliadas | Recolha um recurso da região em cada região com tropas élficas, mesmo que não seja floresta; uma região sem recurso não produz. |
| Filhos da Floresta | 3 | Região de Floresta | Consuma um recurso, inclusive uma tropa élfica, e adicione 1 unidade na região do marcador; descarte todas suas cartas e compre até 5 novas cartas. |
| Milagre da Floresta | 1 | Qualquer região | Converta 3 recursos de um mesmo tipo em 2 de outro mesmo tipo; tropas élficas contam como recurso. |
| **Total** | **23** | | |

Conhecimentos da Floresta consome uma ação disponível também ao ser usada pelo atacante. Canção de paz consome uma ação disponível e não requer região.

## Liderança por carta

**Valores definidos pelo usuário para teste; o balanceamento não é final.** Cada cópia da carta usa o mesmo valor.

| Carta | Liderança |
| --- | ---: |
| Furia da Ilha | 2 |
| Conhecimentos da Floresta | 0 |
| Canção de paz | 3 |
| Trilhas na Mata | 0 |
| Harmônia | 1 |
| Frutos da Mata | 1 |
| Filhos da Floresta | 0 |
| Milagre da Floresta | 1 |

## Questões para implementação

**Troca de tropas:** o jogador escolhe as tropas que cede e onde coloca as que recebe, apenas em regiões dominadas. As tropas recebidas são convertidas para a facção recebedora.

**Adaptações do protótipo para teste:** o ponto por duas florestas aplica-se a pelo menos duas, sem acumular com os 2 pontos por todas; uma troca com movimentação de ao menos um recurso concede o ponto na primeira troca com cada outra facção em cada rodada. Tropas adquiridas em uma troca ou conversão são colocadas em regiões dominadas pelo recebedor; os jogadores escolhem as origens e os destinos permitidos. A batalha continua limitada a dois participantes pelas [regras de combate](../../../regras/combate.md); intervenção de um terceiro não estabelece participação como combatente.
