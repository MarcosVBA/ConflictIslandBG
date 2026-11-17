# Conflict Island — plano do protótipo jogável para três facções

**Data:** 13/11/2026  
**Estado:** planejamento e registro do estado do protótipo  
**Entrega futura:** um único arquivo `.html`, contendo HTML, CSS e JavaScript  
**Finalidade:** validação individual do núcleo do jogo, com uma pessoa tomando manualmente as decisões das três facções

## 1. Objetivo e limites do protótipo

O protótipo deve permitir jogar uma partida local com **Império da Gran' Vália**, **Necromante da Torre Esquecida** e **Piratas do Mar Safira**. Não haverá IA: o sistema alterna o contexto entre as facções, mas todas as escolhas estratégicas, alvos, movimentos, acordos e reações serão feitas pela pessoa que estiver testando.

O jogo deve automatizar apenas o trabalho operacional:

- embaralhar, comprar, descartar e reciclar cartas;
- validar requisitos objetivos de cartas quando as regras forem conhecidas;
- rolar dados e aplicar resultados de combate;
- atualizar tropas, construções, recursos, controle e pontos;
- conduzir fases e rodadas, sem escolher ações pelos jogadores;
- registrar um histórico legível das alterações da partida.

Restrições técnicas e visuais:

- toda a aplicação deve existir em **um único HTML**;
- bibliotecas por CDN são permitidas, mas o núcleo deve continuar compreensível e simples;
- mapa, cartas, peças, marcadores, dados e painéis serão feitos com primitivas de HTML/CSS, texto, cores, bordas e símbolos Unicode;
- a âncora `⚓` identifica regiões costeiras;
- não produzir nem incorporar imagens geradas sem pedido expresso;
- priorizar desktop, com adaptação suficiente para telas menores e sem exigir servidor local.

**[DEFERIDO/ADIADO]** Ficam fora deste primeiro protótipo:

- mapas para 4, 5 ou possivelmente 6 jogadores;
- Elfos e Dragões;
- IA, multiplayer em rede, persistência em servidor e matchmaking;
- baralho de eventos por marcos de pontuação;
- arte final, animações elaboradas e geração de imagens;
- balanceamento definitivo ou promoção automática de propostas a regras aprovadas.

## 2. Como interpretar as decisões

Registrar todas as decisões futuras e seu estado neste planejamento, sem converter uma hipótese em regra aprovada. Registrar também as decisões expressamente adiadas e as pendências que ainda precisam de resposta. Usar estes rótulos:

Antes de perguntar se uma regra já foi definida, verificar a documentação existente do projeto e relatar o que ela registra.

- **[DECIDIDO PARA O PROTÓTIPO]** requisito que pode orientar diretamente a implementação.
- **[PROPOSTA PARA TESTE]** configuração provisória que deve ficar fácil de alterar.
- **[DEFERIDO/ADIADO]** assunto cuja implementação ou decisão foi deixada para uma etapa posterior; não pressupõe aprovação de uma regra.
- **[PENDENTE]** decisão de design ainda necessária; a implementação não deve escondê-la em uma constante arbitrária.

**Estado de implementação:** decisões de regras podem estar documentadas antes de serem implementadas no protótipo. Registrar separadamente quando isso ocorrer.

### 2.1 Decidido para o protótipo

- O mapa inicial é exclusivo para três jogadores e possui **nove regiões**.
- Três ou quatro regiões centrais formam floresta e produzem Madeira.
- Quatro ou cinco regiões são costeiras e recebem uma âncora visível.
- Há praias e montanhas; planícies podem existir, mas ainda não são obrigatórias.
- Ouro aparece principalmente em montanhas, com uma exceção: uma praia também produz Ouro.
- O Império começa controlando a praia com Ouro e uma floresta.
- O Necromante começa controlando a montanha da Torre Esquecida, afastada dos outros inícios, e uma floresta.
- Os Piratas começam controlando uma praia sem recurso.
- As outras quatro regiões começam livres.
- O Império começa com um soldado em cada uma de suas duas regiões e 1 Ouro.
- Os Piratas começam com duas tropas na sua praia e nenhum recurso.
- O Necromante começa com um zumbi na montanha da Torre e outro em sua floresta, 1 Madeira e um extrator.
- **[PROVISÓRIO]** O extrator inicial fica na floresta do Necromante para teste; sua localização ainda não foi escolhida e deve ser ajustável. A Torre permanece na montanha.
- Os baralhos documentados dos Piratas e do Necromante são as referências de conteúdo dessas facções.
- O baralho e as regras do Império são uma proposta sujeita a revisão, mesmo quando forem usados no teste.
- A pessoa controla manualmente as três facções; não existe decisão automática de IA.

### 2.2 Direção existente, ainda não totalmente aprovada

O GDD 2.5 aponta **ações sequenciais** e reações defensivas como direção para teste. Também confirma uma fase de pontuação após a resolução. Ordem de alocação, liderança, cartas elegíveis como defesa e outros detalhes continuam abertos; o limite de uma carta defensiva e o consumo de marcador de ação foram definidos posteriormente, na seção 2.4.

Portanto, a interface deve suportar esse fluxo de forma configurável e observável, sem apresentá-lo como regra definitiva. Toda opção provisória deve aparecer no painel de configuração ou no histórico como “regra de teste”.

### 2.3 Domínio e região devastada

- **[REGRA DEFINIDA — IMPLEMENTADA NO FLUXO DE TESTE]** A facção com o maior número de tropas domina a região.
- **[REGRA DEFINIDA — IMPLEMENTADA NO FLUXO DE TESTE]** Quando duas ou mais facções empatam na maior quantidade de tropas em uma região, nenhuma facção a domina.
- **[REGRA DEFINIDA — IMPLEMENTADA NO FLUXO DE TESTE]** Uma unidade que entra em uma região vazia passa a dominá-la.
- **[REGRA DEFINIDA — IMPLEMENTADA NO FLUXO DE TESTE]** Uma região sem nenhuma tropa nem construção fica imediatamente sem domínio de qualquer facção.
- **[REGRA DEFINIDA — IMPLEMENTADA NO FLUXO DE TESTE]** Se não houver tropas de nenhuma facção, construções de uma única facção mantêm o domínio dessa facção. Se houver construções de facções diferentes e nenhuma tropa, ninguém domina, independentemente da quantidade de construções de cada facção.
- **[REGRA DEFINIDA — IMPLEMENTADA NO FLUXO DE TESTE]** Se houver tropas, aplica-se a regra de maior quantidade de tropas e empate sem domínio; construções não sobrepõem essa regra.
- **[REGRA DEFINIDA — IMPLEMENTADA NO FLUXO DE TESTE]** Tropas de múltiplas facções podem coexistir na mesma região, e sua presença conjunta não obriga combate. Aplica-se a regra de domínio pela maior quantidade de tropas, com empate sem domínio.
- **[REGRA REGISTRADA DA FACÇÃO]** Região devastada é uma condição específica do Necromante, distinta do domínio por maioria: a definição existente exige presença de tropas ou construções do Necromante e ausência de tropas de outras facções. Uma região vazia não é devastada. Preservar a definição de que a região contém apenas tropas ou construções do Necromante; não concluir que a mera ausência de tropas inimigas, por si só, basta.
- **[PENDENTE]** Detalhar contestação e demais condições de movimentação e combate, sem inferi-las da possibilidade de coexistência.

### 2.4 Início e participação no combate

- **[REGRA DEFINIDA — IMPLEMENTADA NO FLUXO DE TESTE]** O combate só começa quando uma carta ou efeito determina um ataque.
- **[REGRA DEFINIDA — IMPLEMENTADA NO FLUXO DE TESTE]** O defensor escolhe se usa uma carta defensiva como reação antes da rolagem dos dados do combate.
- **[REGRA DEFINIDA — IMPLEMENTADA NO FLUXO DE TESTE]** O defensor pode usar no máximo uma carta defensiva por batalha, antes da rolagem. O limite de duas cartas foi considerado, mas a escolha final é uma por batalha.
- **[REGRA DEFINIDA — IMPLEMENTAÇÃO PARCIAL]** O chamado marcador de defesa é um dos dois marcadores de ação ainda não utilizados da própria facção defensora. Ele pode estar em qualquer região; ao usar uma carta defensiva, o marcador é consumido e a ação correspondente é perdida. As cartas elegíveis permanecem em aberto.
- **[PROPOSTA PARA TESTE]** Ao adaptar uma carta para defesa reativa, a orientação é preservar seu efeito e aplicá-lo à região atacada, sem exigir que um marcador tenha sido previamente alocado nessa região. O usuário descreveu o custo como um “marcador de defesa”.
- **[ESTADO DAS CARTAS]** *Guarda Imperial* é uma reação proposta no [documento do Império](proposta-imperio-gran-valia.md); *Praga Resistente* é apenas candidata a defesa reativa no [documento do Necromante](baralho-necromante.md), sem elegibilidade aprovada. O [baralho dos Piratas](baralho-piratas.md) não define defesa reativa explicitamente.
- **[REGRA DEFINIDA — IMPLEMENTADA NO FLUXO DE TESTE]** Quando há ataque, todas as tropas da facção atacante presentes no local atacam todas as tropas da facção defensora presentes no local, sempre.
- **[REGRA DEFINIDA — IMPLEMENTADA NO FLUXO DE TESTE]** Uma terceira facção presente na região não participa do combate entre atacante e defensor.
- **[REGRA DEFINIDA — IMPLEMENTADA NO FLUXO DE TESTE]** Cada batalha consiste em uma única rodada de rolagem e termina após a aplicação dos resultados, mesmo que tropas de ambos os lados sobrevivam.
- **[REGRA DEFINIDA — IMPLEMENTADA NO FLUXO DE TESTE]** Após essa rodada de batalha, as tropas sobreviventes do atacante e do defensor permanecem na mesma região; o domínio segue as regras gerais já definidas na seção 2.3.
- **[REGRA DEFINIDA — IMPLEMENTADA NO FLUXO DE TESTE]** As construções da facção defensora são atingidas após a eliminação das tropas dessa facção na região. Se o dano de ataque exceder a quantidade de tropas defensoras, o dano excedente destrói construções na mesma ação: cada construção exige 1 dano, como uma tropa. Não é necessária uma ação separada para aplicar esse dano excedente.
- **[PENDENTE]** Conciliar essa regra de dano excedente com o [registro de combate](registro-de-combate.md), que limita as baixas dos defensores ao número inicial de defensores. Definir os demais detalhes ainda abertos sobre construções e presença de outras facções, sem presumir efeitos adicionais.
- **[REGRA DEFINIDA — IMPLEMENTADA NO FLUXO DE TESTE]** Um ataque é bem-sucedido quando o atacante causa dano ao inimigo e ainda possui tropas atacantes remanescentes após o combate.
- **[REGRA DEFINIDA — IMPLEMENTADA NO FLUXO DE TESTE]** Quando essa condição é cumprida em um saque dos Piratas, eles saqueiam o inimigo.
- **[REGRA DEFINIDA — IMPLEMENTADA NO FLUXO DE TESTE]** Em um saque bem-sucedido, os Piratas pegam 1 Ouro do inimigo; se o inimigo não possuir Ouro, recebem 1 Ouro da reserva da mesa.
- **[CARTA REGISTRADA]** *Ataque a Linha de Suprimentos* exige inimigo com Ouro e, em caso de sucesso, acrescenta 1 Ouro aos espólios, conforme o [baralho dos Piratas](baralho-piratas.md).
- **[REGRA DEFINIDA — IMPLEMENTADA NO FLUXO DE TESTE]** O Ouro adicional dessa carta segue a regra do saque básico: vem do inimigo se ele ainda tiver Ouro disponível; caso contrário, vem da reserva da mesa. Se o inimigo tinha apenas 1 Ouro no total, o saque básico recebe esse Ouro e o adicional vem da reserva.
- **[ESCLARECIMENTO]** Ataque bem-sucedido não substitui o requisito específico de certas cartas do Necromante de eliminar todos os inimigos; os requisitos dessas cartas continuam aplicáveis.
- **[PENDENTE]** Definir outros detalhes de saque ainda não definidos.
- **[DEFERIDO/ADIADO]** Batalhas com três facções participantes não foram desenvolvidas e estão fora do escopo deste protótipo.
- **[ESCLARECIMENTO]** A participação de todas as tropas presentes no combate é distinta da quantidade de tropas que uma carta permite mover até o local. Não interpretar um limite de movimento como limite de participantes.
- **[PENDENTE]** Revisar a adaptação e a redação das cartas diante da distinção entre movimento e participação no combate.

## 3. Mapa inicial de nove regiões

### 3.1 Distribuição mínima já determinada

| Grupo | Quantidade | Controle inicial | Terreno/recurso obrigatório |
| --- | ---: | --- | --- |
| Império | 2 | Império | 1 praia costeira com Ouro; 1 floresta com Madeira |
| Necromante | 2 | Necromante | 1 montanha com Torre e Ouro; 1 floresta com Madeira |
| Piratas | 1 | Piratas | 1 praia costeira sem recurso |
| Livres | 4 | Nenhum | distribuição exata ainda aberta |
| **Total** | **9** |  |  |

### 3.2 Configuração candidata para o primeiro teste

**[PROPOSTA PARA TESTE — não é uma definição do cenário final]** Usar esta composição permite iniciar a implementação visual sem inventar novas regras de produção. Nomes são identificadores provisórios.

| ID | Nome provisório | Terreno | Costeira | Recurso | Controle inicial | Observação |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | Praia Dourada | Praia | ⚓ | Ouro | Império | exceção de Ouro fora de montanha |
| R2 | Mata da Coroa | Floresta | — | Madeira | Império | região central |
| R3 | Torre Esquecida | Montanha | — | Ouro | Necromante | posição periférica e afastada |
| R4 | Bosque Morto | Floresta | — | Madeira | Necromante | região central |
| R5 | Enseada Safira | Praia | ⚓ | Nenhum | Piratas | início pirata |
| R6 | Floresta Antiga | Floresta | — | Madeira | Livre | região central |
| R7 | Pico Partido | Montanha | — | Ouro | Livre | segunda fonte montanhosa de Ouro |
| R8 | Praia dos Náufragos | Praia | ⚓ | Nenhum | Livre | expansão costeira |
| R9 | Baixio Aberto | Planície | ⚓ | Nenhum | Livre | planície costeira provisória |

Essa proposta resulta em três florestas centrais, quatro regiões costeiras, duas montanhas produtoras de Ouro e uma praia produtora de Ouro. Se a planície for retirada, R9 deve mudar de terreno sem alterar silenciosamente as quantidades acordadas.

### 3.3 Conexões aprovadas

**[DECIDIDO PARA O PROTÓTIPO]** A proposta de conexões foi aprovada. Representar cada conexão uma única vez nos dados, mas permitir movimento nos dois sentidos:

- R1–R2, R1–R8 e R1–R9;
- R2–R4, R2–R6 e R2–R9;
- R3–R4 e R3–R7;
- R4–R6 e R4–R7;
- R5–R6, R5–R8 e R5–R9;
- R6–R7, R6–R8 e R6–R9;
- R7–R9;
- R8–R9.

A Torre Esquecida fica numa extremidade, com duas saídas, enquanto as florestas conectam o centro. Validar durante os testes as distâncias entre inícios, os acessos e o alcance efetivo das cartas de movimento.

### 3.4 Pendências do mapa

- **[PENDENTE]** Aprovar ou substituir os nomes, a presença da planície R9 e a distribuição das quatro regiões livres.
- **[PENDENTE]** Decidir se toda montanha produz Ouro ou apenas as montanhas indicadas.
- **[PENDENTE]** Definir se “produzir recurso” nas regiões significa recurso disponível por coleta, produção automática por rodada ou apenas compatibilidade com cartas. A renda dos Bares no protótipo é uma hipótese separada, marcada como teste.
- **[PENDENTE]** Decidir se existem rotas marítimas especiais além da adjacência do mapa.
- **[PENDENTE]** Definir contestação; as regras já definidas de domínio e coexistência constam na seção 2.3.
- **[PENDENTE]** Definir se construções alteram defesa ou produção por regras gerais; seu efeito sobre domínio está registrado na seção 2.3.

## 4. Etapas de desenvolvimento

### Etapa 1 — mapa e interação

**Resultado esperado:** um tabuleiro manipulável de nove regiões, já útil para validar leitura espacial, conexões e posições iniciais, mas ainda sem rodada completa.

#### 1.1 Estrutura do arquivo único

- Criar seções internas claras para estilos, dados estáticos, estado da partida, renderização, comandos, regras e testes de integridade.
- Modelar regiões e conexões em objetos JavaScript; não codificar vizinhanças diretamente em manipuladores de clique.
- Manter um estado inicial imutável e uma cópia ativa restaurável pelo botão “Reiniciar mapa”.
- Incluir uma pequena versão textual do esquema do estado no próprio código, para facilitar futuras revisões.

#### 1.2 Composição da tela

- Cabeçalho com nome do protótipo, indicação “3 facções — teste manual” e comandos de reinício.
- Área central com o mapa; conexões ficam atrás das regiões e permanecem visíveis quando uma região é selecionada.
- Painel lateral de inspeção com terreno, costa, recurso, controle, ocupantes, construções e regiões adjacentes.
- Faixa inferior de histórico com comandos reversíveis ou, no mínimo, um botão “Desfazer” para a última alteração manual.
- Legenda permanente para facções, terreno, recurso, região livre e região costeira.

#### 1.3 Representação visual com primitivas

- Região como botão ou elemento interativo de formato consistente, usando cor de terreno no interior e borda da facção controladora.
- Floresta em verde, montanha em cinza, praia em areia e planície em azul para teste; conferir contraste com as cores das facções.
- Recurso mostrado como texto curto ou símbolo acompanhado de rótulo acessível: “Madeira”, “Ouro” ou “Sem recurso”.
- Costa indicada pela âncora `⚓`, sem depender apenas de cor.
- Unidades mostradas como fichas CSS com sigla e quantidade; construções como pequenos cartões de texto, não imagens.
- Seleção, alvo válido, adjacência e erro devem ter estados visuais diferentes e também mensagens textuais.

#### 1.4 Interações do primeiro marco

1. Clicar numa região seleciona e abre seus detalhes.
2. As regiões diretamente conectadas ficam realçadas.
3. Ativar “modo de conexões” exibe a lista e destaca visualmente cada aresta.
4. Um painel de teste permite ajustar unidades e construções e limpar uma região; o controle é calculado a partir das peças.
5. Alterações manuais entram no histórico com antes/depois e podem ser desfeitas.
6. “Restaurar cenário inicial” repõe exatamente os cinco territórios controlados e as quatro regiões livres.
7. O sistema impede valores negativos e acusa IDs, conexões ou facções inexistentes.

Os controles manuais desse marco são instrumentos de validação, não regras de conquista. Eles devem aparecer como “ferramentas de teste”.

#### 1.5 Validações automáticas do mapa

Ao carregar e ao reiniciar, executar verificações e mostrar falhas num painel de diagnóstico:

- existem exatamente nove regiões e quatro começam livres;
- Império controla duas, Necromante controla duas e Piratas controlam uma;
- existem três ou quatro florestas, todas configuradas com Madeira;
- existem quatro ou cinco regiões costeiras, todas com âncora no conteúdo acessível;
- a praia imperial produz Ouro, a praia pirata não possui recurso e a Torre é montanha;
- Ouro montanhoso continua predominante em relação às exceções não montanhosas;
- nenhuma conexão aponta para região inexistente, nenhuma auto-conexão existe e o grafo inteiro é alcançável;
- a Torre não fica adjacente diretamente aos demais pontos iniciais, conforme a intenção de afastamento;
- cada região possui nome, terreno, estado de costa, recurso e controle inicial explícitos.

#### 1.6 Peças e recursos iniciais

- Império: um soldado na Praia Dourada, um na Mata da Coroa e 1 Ouro.
- Piratas: duas tropas na Enseada Safira e nenhum recurso.
- Necromante: um zumbi na Torre Esquecida, outro no Bosque Morto, 1 Madeira e um extrator.
- **[PROVISÓRIO]** O extrator está no Bosque Morto; sua localização entre as duas regiões iniciais do Necromante ainda será escolhida. O controle manual permite ajustá-la.
- A Torre permanece na montanha. Bar Pirata, tecnologias imperiais e marcadores de ação iniciais seguem pendentes.
- A restauração deve devolver tropas, recursos e extrator aos valores acima, sem automatizar coleta.

#### 1.7 Critérios de aceite da Etapa 1

- O HTML abre diretamente no navegador, sem build e sem arquivo auxiliar.
- As nove regiões, recursos, costas, controles e conexões são legíveis.
- É possível inspecionar qualquer região e entender todas as suas adjacências.
- O cenário inicial respeita a distribuição 2/2/1/4 e passa nas verificações automáticas.
- O testador consegue simular ocupação e controle manualmente, desfazer e reiniciar.
- Nenhuma regra pendente é apresentada como definitiva.
- Não há imagem externa ou gerada; a interface usa somente primitivas.

### Etapa 2 — rodadas, cartas e ações

**Resultado esperado:** conduzir uma rodada manual das três facções, com o sistema administrando baralhos e marcadores.

**Implementação de teste:** o protótipo usa ordem escolhida manualmente a cada rodada, alocação pública em qualquer ordem, até dois marcadores por facção e resolução alternada na ordem escolhida. Cada facção com marcador disponível executa uma ação ou passa; a vez seguinte avança para a próxima facção com marcador disponível. Uma facção pode alocar menos de dois. A mão começa com quatro cartas por padrão, configurável de 1 a 10, e é completada no início de cada rodada; o descarte é reembaralhado quando necessário. Essas escolhas são hipóteses, não regras aprovadas.

A alocação é coletiva: cada facção confirma que terminou, inclusive quando escolhe zero ou um marcador. A resolução só é liberada depois das três confirmações. Durante a alocação, é possível desfazer a última colocação ou confirmação; o desfazer do mapa continua separado. Nova rodada e restauração limpam as confirmações e o histórico de alocação.

As cartas documentadas são embaralhadas e exibidas com condições e efeitos resumidos; o Império continua identificado como proposta. A interface oferece escolhas para movimentos, acordos, magias, recursos, construções e impostos e valida os requisitos implementados. As cartas de ataque identificadas abrem o fluxo de combate descrito abaixo. A pontuação é calculada e a partida termina ao fim de seis rodadas de teste. Restaurar reinicia o cenário, o fluxo, os pontos e os baralhos.

- Implementar máquina de estados explícita: preparação, alocação, resolução sequencial, pontuação e encerramento.
- Usar até dois marcadores por facção; o protótipo atual fixa esse limite em dois e permite confirmar com menos.
- Permitir que a pessoa escolha a ordem e a facção ativa; liderança e sua passagem devem ficar identificadas como pendentes.
- Exibir mão, pilha de compra e descarte; automatizar embaralhamento, compra e reciclagem.
- Carregar os 22 cards documentados de Piratas e os 22 do Necromante.
- Carregar o conjunto proposto de 22 cartas do Império com selo visual “proposta em revisão”.
- Ao resolver uma ação, pedir todas as decisões ao testador e validar somente restrições documentadas.
- Integrar a reação defensiva ao combate: pausar o ataque, oferecer cartas elegíveis quando definidas, consumir um marcador de ação não usado e registrar a origem do marcador.
- Manter configuráveis tamanho de mão, reposição, ordem de alocação, visibilidade dos marcadores e destino de ações inválidas.

**Pendências que bloqueiam o fechamento desta etapa:** procedimento de liderança, ordem de alocação, cartas defensivas elegíveis, interação de cartas com mais de uma região, alvo que deixa de ser válido e fluxo exato de reposição da mão.

### Estado da implementação das regras de domínio e combate

O HTML calcula domínio pelas tropas e, na ausência delas, pelas construções. Torre e extrator são peças removíveis; contadores genéricos permitem testar outras construções. A condição de região devastada exige presença do Necromante e ausência de peças de outras facções. A convivência não inicia combate automaticamente.

O combate é iniciado pelas cartas de ataque identificadas, após escolha das origens e quantidades na interface. A rolagem usa todas as tropas presentes do atacante e defensor, com uma única rodada e baixas simultâneas; a terceira facção não participa. Para conciliar provisoriamente os registros, as baixas de tropas defensoras continuam limitadas às tropas iniciais, mas as espadas excedentes não são descartadas antes de atingir construções defensoras; o limite antigo de dano aos atacantes é preservado. Se houver escolha entre construções, o usuário escolhe as destruídas. Essa conciliação técnica deve ser revisada no registro de combate.

O saque básico e o Ouro adicional de *Ataque a Linha de Suprimentos* são aplicados quando o ataque atende à condição de sucesso. A reação ocorre antes dos dados e admite no máximo uma carta por batalha, consumindo um marcador não usado do defensor. Como nenhuma carta defensiva foi aprovada, apenas a **Guarda Imperial proposta** pode ser habilitada expressamente como teste; *Praga Resistente* não foi aprovada como reação. Conversão de baixas e reforço de Infestação são aplicados após o combate. O resultado do combate e o estado de cartas, marcadores, pontos e movimento podem ser desfeitos juntos antes de o fluxo avançar.

### Estado atual da partida e hipóteses reversíveis

**[IMPLEMENTADO PARA TESTE]** O HTML único permite alocação coletiva, resolução alternada, mãos e descarte, efeitos das cartas, custos, tropas, extratores, monumento, tecnologias imperiais propostas, impostos, acordos com escolha de aceitação, combate e pontuação. A mão é completada no início de cada rodada. Os controles manuais de peças e recursos permanecem para depuração e não são exigidos para as ações testadas.

**[PROPOSTAS PARA TESTE — NÃO SÃO REGRAS APROVADAS]** A partida dura seis rodadas; vence quem tiver mais pontos ao fim, com empate compartilhado. Piratas recebem 1 ponto por Ouro recebido. Uma ação e 2 Madeiras constroem um Bar Pirata em região controlada, até dois; cada Bar controlado gera 1 Ouro por rodada. O Império usa o baralho, as tecnologias, os impostos e a Guarda Imperial propostos. O atraso do imposto é medido em rodadas e o jogador escolhe qual tecnologia de maior nível remover em caso de empate.

**[PROPOSTAS PARA TESTE — ADAPTAÇÕES DE CARTAS]** Saques locais podem mobilizar até três tropas adjacentes; Invasão Costeira usa uma única origem costeira. *Praga Resistente*, como ação comum, dura até o fim da rodada, sem aprová-la como reação. *Remanejando Mortos* troca todas as tropas do Necromante entre duas regiões devastadas. *Carta de Corsário* permite uma operação imediata de movimento e eventual ataque usando piratas, após aceitação; sua duração e extensão reais continuam abertas. *Devastar* elimina as tropas inimigas presentes na região. Essas escolhas devem ser revisadas com os textos das cartas.

**[LIMITAÇÕES]** A Guarda Imperial só aparece como opção explicitamente proposta; não há outra defesa reativa aprovada. As cartas de ataque implementadas exigem tropas defensoras presentes: o ataque a uma região que contenha apenas construções ainda depende de uma carta ou regra que permita esse alvo. A capacidade temática de recuperar a Torre após perdê-la não tem regra operacional definida e não foi inventada. Não há semente reproduzível, exportação de relatório, métricas automáticas de balanceamento nem salvamento de partida. As ferramentas de depuração permitem alterar o estado e não substituem validação de regras. A interface visual e a acessibilidade em navegador ainda não foram verificadas.

**[VALIDAÇÃO LOCAL — 16/11/2026]** Uma simulação por manipuladores de interface e DOM substituto percorreu seis rodadas: preparação, alocação e confirmação das três facções, cartas das três facções, movimentação, ataque, Guarda Imperial proposta, saque, pontuação, encerramento e reinício. A ordem inicial do baralho e os dados foram controlados; as quatro últimas rodadas foram encerradas sem ações. Outros testes cobriram famílias de cartas, magias, tecnologias, acordos, erro e nova tentativa, desempate de domínio, devastação, proteção, dano excedente, desfazer e escolha de penalidade de imposto. Uma verificação de rotas confirmou que os nomes dos três baralhos têm tratamento correspondente; isso não garante a correção de todos os efeitos. Os testes verificam lógica e encadeamento de eventos sob condições simuladas, não comprovam aparência, uso real no navegador, balanceamento ou todas as combinações possíveis.

### Etapa 3 — facções e combate

**Resultado esperado:** resolver ações características, economia e batalhas das três facções sem intervenção aritmética externa.

- Implementar os dados de ataque e defesa registrados para teste, exibindo cada face e os totais de espadas e cruzes.
- Aplicar baixas simultâneas; revisar no registro de combate a conciliação provisória implementada para dano excedente a construções.
- Oferecer modo de confirmação antes de aplicar resultados, útil para auditoria do teste.
- Piratas: saques, mobilidade costeira, recrutamento, acordos e Bar Pirata; escolhas e aceitação de acordos continuam manuais.
- Necromante: regiões devastadas, extratores, magias, conversão, monumento e pontuação territorial.
- Império: tecnologias, recursos, impostos, atraso e reação da Guarda Imperial, sempre sinalizados como conteúdo proposto.
- Registrar efeitos temporários por batalha/rodada para evitar que bônus sejam esquecidos ou durem além do texto.

**Pendências que bloqueiam o fechamento desta etapa:** regras gerais de movimento e conquista, confirmação da conciliação do dano excedente com o registro antigo, outros detalhes de construções e saque ainda abertos, localização definitiva do extrator, elegibilidade defensiva e adaptação completa das cartas.

### Etapa 4 — pontuação e partida completa

**Resultado esperado:** jogar do cenário inicial até um encerramento registrado, com decomposição da pontuação por origem.

- Executar a fase de pontuação confirmada após a resolução.
- Mostrar placar total e pontos ganhos na rodada por categoria e por facção.
- Medir média por facção/rodada e frequência de 0, 1 e 5+ pontos, conforme o objetivo de balanceamento do GDD.
- Tratar a média de 3 pontos por facção/rodada como meta de calibração, não como pontos automáticos.
- Permitir encerrar manualmente enquanto duração da partida e condição de vitória estiverem abertas.
- Exportar ou copiar um resumo textual do teste, incluindo semente, parâmetros, rodadas, combates e pontuação.

**[PENDENTE]** Número de rodadas, limiar de vitória, desempate, teto de 5 pontos e qualquer evento por marco de pontuação. Eventos permanecem fora deste protótipo até o núcleo estar validado.

### Etapa 5 — validação e ajustes

**Resultado esperado:** reduzir ambiguidade, identificar gargalos e preparar decisões de design antes de expandir o mapa.

- Executar partidas controlando as três facções e registrar duração de rodada, ações inválidas, dúvidas e cliques corretivos.
- Comparar mobilidade inicial, acesso a Madeira/Ouro e pressão territorial a partir da topologia.
- Testar se a distância da Torre realmente cria isolamento sem bloquear o Necromante.
- Avaliar se Piratas sem recurso inicial conseguem entrar no ciclo econômico sem ficar passivos.
- Medir frequência e custo de reações defensivas e situações em que a ordem sequencial pune quem age depois.
- Separar defeitos de interface, lacunas de regra e problemas de balanceamento no relatório.
- Ajustar primeiro constantes declarativas e textos; refatorar regras apenas após identificar repetição ou conflito real.
- Só depois validar um mapa para quatro jogadores; cinco e possivelmente seis jogadores ficam em marcos posteriores.

## 5. Arquitetura sugerida do HTML único

**[PROPOSTA TÉCNICA]** Manter o arquivo simples, sem framework obrigatório:

1. `<style>` com variáveis de cor, grade responsiva, fichas e estados de interação.
2. `<body>` com cabeçalho, mapa, painéis de facção/região, mão de cartas, controles de fase e histórico.
3. Um único `<script type="module">` com:
   - `DEFINITIONS`: regiões, conexões, facções, cartas, dados e configurações de teste;
   - `createInitialState()`: estado restaurável;
   - `validateDefinitions()` e `validateState()`;
   - redutor ou conjunto central de comandos para alterar o estado;
   - renderizadores puros para mapa, painel, cartas, combate, placar e histórico;
   - regras por facção isoladas por namespace/objeto;
   - gerador pseudoaleatório com semente para reproduzir compras e dados.
4. Eventos de interface chamam comandos; não devem editar elementos e estado em paralelo.

Se uma CDN for usada, prever mensagem clara de indisponibilidade e evitar dependência externa para funções básicas. O protótipo precisa continuar abrindo localmente sempre que possível.

## 6. Lista consolidada de decisões ainda necessárias

### Mapa e cenário

- revisar nomes e distribuição das quatro regiões livres; as conexões foram aprovadas;
- confirmar três ou quatro florestas e quatro ou cinco costas na versão inicial;
- confirmar ou retirar planícies;
- definir produção/coleta de recursos e rotas marítimas;
- definir a localização definitiva do extrator e as demais construções e marcadores iniciais.

### Rodada e ações

- definir líder, ordem de alocação/resolução e passagem de liderança;
- definir se marcadores são públicos e como são consumidos;
- definir tamanho da mão, compra, reposição, passe e reembaralhamento;
- definir alvos inválidos e ações que envolvem origem/destino diferentes.

### Combate e controle

- adaptar as cartas, distinguindo limite de movimento de participação no combate;
- definir retirada, contestação e demais condições de movimentação e combate; as regras de domínio e coexistência constam na seção 2.3;
- definir cartas defensivas elegíveis; o momento da escolha, o limite de uma carta por batalha e o consumo do marcador de ação estão definidos na seção 2.4;
- conciliar dano excedente a construções com o limite antigo de baixas e definir os demais detalhes de construções, saque e efeitos posteriores ao combate ainda em aberto.

### Facções e pontuação

- revisar e aprovar o Império antes de tratá-lo como baralho final;
- adaptar cartas de Piratas e Necromante ao fluxo sequencial;
- definir Bar Pirata, extratores, tecnologias e suprimentos de componentes;
- definir duração, vitória, desempate e eventual teto de pontuação.

## 7. Ordem recomendada de aprovação

1. Aprovar o mapa candidato e seus parâmetros iniciais.
2. Fechar o ciclo mínimo de rodada e reposição de cartas.
3. Fechar combate, controle e conquista.
4. Revisar cartas para ações sequenciais e reações.
5. Aprovar ou revisar a proposta do Império.
6. Fixar pontuação final e condição de encerramento.
7. Só então ampliar para mais jogadores, eventos e novas facções.

## 8. Referências do projeto

- [GDD 2.5](Conflict_Island_GDD_v2.5.md)
- [Histórico de ações e combate](historico-acoes-e-combate.md)
- [Registro de combate](registro-de-combate.md)
- [Piratas do Mar Safira](baralho-piratas.md)
- [Necromante da Torre Esquecida](baralho-necromante.md)
- [Proposta do Império da Gran' Vália](proposta-imperio-gran-valia.md)

O GDD 2.5 ainda menciona dez regiões na visão geral. Para esta entrega, o mapa de nove regiões para três jogadores é o requisito mais recente do protótipo; o GDD não deve ser alterado silenciosamente como parte desta tarefa.
