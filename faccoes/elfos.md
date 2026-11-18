# Elfos da Floresta


**Conteúdo registrado pelo usuário; implementado no protótipo de quatro facções para teste.** O baralho tem 12 cartas.

**Início definido; implementado no protótipo principal:** os Elfos dominam duas regiões de floresta, com duas unidades em cada uma, sem recursos iniciais. As regiões do cenário de teste estão em [Mapa](../regras/mapa.md).

## Guardiões da Floresta

Se dominar pelo menos 2 regiões de floresta, ganhe 1 ponto no final da rodada. Se dominar pelo menos 2 regiões de floresta e tiver tropas em todas as florestas, ganhe 2 pontos no total, em vez do ponto por domínio.
Sempre que batalhar em uma região de floresta e eliminar as tropas inimigas da região, ganhe 1 ponto.

**Definido:** basta eliminar as tropas da facção adversária da batalha, mesmo se outra facção inimiga permanecer na região.

## Vingança da Terra

Se não houver mais tropas aliadas em jogo, aloque 3 vezes uma tropa em qualquer região de floresta. **Definido; implementado:** ocorre imediatamente. O jogador escolhe uma floresta para cada tropa; pode escolher a mesma região mais de uma vez.

## Coexistência Pacifica

Sempre que trocar ao menos um recurso por outro com um jogador, receba 1 ponto. Ambas as facções devem entregar recursos; Ouro, Madeira e tropas contam como recursos. O bônus se aplica uma vez por outro jogador em cada rodada. Pagamentos por serviços e transferências unilaterais não contam.

## Baralho vigente

O baralho tem 12 cartas. A barra indica escolha de modo e cada modo consome a carta inteira.

| Carta | Cópias | Liderança | Efeito |
| --- | ---: | ---: | --- |
| **Fúria da Ilha / Harmônia** | 3 | 1 | **Atacar:** ataque com elfos presentes em uma região ou mova 1 a 3 elfos para região adjacente e ataque um defensor com tropas ou construções. **Trocar:** proponha uma troca de Ouro, Madeira ou tropas com outra facção, mediante aceite. Tropas recebidas passam à facção recebedora e vão a regiões dominadas por ela. Receba um ponto pela primeira troca de recursos nos dois sentidos com cada facção na rodada. |
| **Trilhas na Mata / Defesa Global** | 2 | 3 | **Mover:** escolha o destino e uma origem adjacente e mova qualquer quantidade positiva de tropas élficas disponíveis, sem abrir combate. **Defesa Global:** após a reação do defensor e antes dos dados, os Elfos podem gastar a carta para escolher um dos dois lados com tropas. O lado escolhido ignora 1 dano às tropas nessa batalha, cumulativo com Guarda se aplicável. Funciona inclusive quando os Elfos são terceiros. A batalha segue para a rolagem. |
| **Frutos da Mata / Filhos da Floresta** | 5 | 1 | **Colher:** deve haver tropas élficas no mapa. Receba 1 recurso impresso por região com tropas élficas no mapa, incluindo regiões contestadas e outros terrenos; regiões sem recurso dão zero. **Recrutar:** escolha uma floresta não devastada, gaste 1 Ouro, 1 Madeira ou 1 tropa élfica de uma origem escolhida e adicione 1 elfo na floresta. É permitido gastar uma tropa da própria região. |
| **Milagre da Floresta** | 2 | 0 | Em modal, converta 3 recursos de um mesmo tipo em 2 de outro mesmo tipo. Ouro, Madeira e tropas élficas são opções. Escolha as origens das tropas gastas e as regiões dominadas que recebem tropas. A conversão de Ouro em Madeira ou vice-versa dispensa seleção de região. |

## Questões para implementação

**Troca de tropas:** o jogador escolhe as tropas que cede e onde coloca as que recebe, apenas em regiões dominadas. As tropas recebidas são convertidas para a facção recebedora.

**Adaptações do protótipo para teste:** o ponto por duas florestas aplica-se a pelo menos duas, sem acumular com os 2 pontos por todas; uma troca com movimentação de ao menos um recurso concede o ponto na primeira troca com cada outra facção em cada rodada. Tropas adquiridas em uma troca ou conversão são colocadas em regiões dominadas pelo recebedor; os jogadores escolhem as origens e os destinos permitidos. A batalha continua limitada a dois participantes pelas [regras de combate](../regras/combate.md); intervenção de um terceiro não estabelece participação como combatente.
