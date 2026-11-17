# Conflict Island — Game Design Document (GDD)

**Versão:** 2.5 — direção para teste  
**Data:** 11/11/2026  
**Escopo:** regras globais do jogo; mecânicas específicas ficam em documentos de facção.  
**Status:** pré-protótipo.

## 1. Visão do jogo

- Jogo de tabuleiro assimétrico de disputa territorial, com baralhos individuais de facção e vitória por pontos.
- Ilha com **10 regiões conectadas por trajetos**; regiões podem ser costeiras ou interiores.
- Fantasia e pirataria: Piratas do Mar Safira, Império da Gran' Valia, Elfos da Floresta, Necromante da Torre Alta e Dragões Defensores da Ilha.
- As facções têm mecanismos distintos de ação, economia e pontuação. O mapa pode mudar periodicamente por eventos (a desenvolver).
- A progressão deve estimular conflitos e alianças, sem impor a diplomacia como obrigação.

## 2. Ações, rodadas e combate

**[DIREÇÃO PARA TESTE]** Cada jogador aloca até dois marcadores em regiões. As ações são resolvidas em ordem. Quando chega sua vez, o jogador escolhe uma carta compatível com a região de um marcador ainda disponível e resolve seu efeito conforme o estado do tabuleiro. A ordem de alocação e os detalhes de resolução dos marcadores ainda precisam ser definidos.

**[DIREÇÃO PARA TESTE]** Ao ser atacado, um jogador pode usar uma carta que permita defesa como reação e consumir um de seus marcadores ainda não utilizados, inclusive em outra região. O marcador consumido não gera outra ação. Sem marcador disponível, essa reação não pode ser utilizada. O momento da reação, os limites por batalha e as cartas elegíveis permanecem em aberto.

**[CONFIRMADO]** Há uma fase de pontuação após a resolução. Reposição da mão e outras etapas do novo fluxo ainda precisam ser definidas.

### Combate

Cada unidade atacante presente no início da rodada de combate gera um dado de ataque. Cada defensor que exceda o número de atacantes gera um dado de defesa. Espadas causam dano aos defensores e cruzes aos atacantes; as baixas são simultâneas e os danos seguem os limites do [registro detalhado de combate](registro-de-combate.md). As faces dos dados estão nesse registro. A duração e o encerramento de uma batalha ainda precisam ser definidos.

## 3. Meta global de pontuação e balanceamento

**[VISÃO DEFINIDA — META, NÃO REGRA DE PONTUAÇÃO]** Projetar e calibrar **cada facção** para gerar, em média, **3 pontos de vitória por jogador por rodada**.

- **1 ponto:** deve ser relativamente acessível mesmo em rodadas ruins, sem necessariamente ser garantido.
- **3 pontos:** desempenho típico almejado por jogador/rodada ao longo de partidas e testes.
- **5 pontos:** resultado excepcional de uma rodada muito boa; deve ser raro.
- Evitar estratégias que acumulem rotineiramente acima de 5 pontos/rodada.

**[ABERTO]** Definir se 5 é somente uma referência de balanceamento ou teto absoluto. Por enquanto **não é limite rígido**. Também não há pontuação mínima garantida.

**Medição no playtest:** anotar pontuação de cada jogador em toda rodada, média por jogador/rodada, frequência de 0, 1 e 5+ pontos, variação entre facções e origem dos pontos. A média global não basta: conferir se a facção consegue pontuar de várias maneiras sem estratégia dominante.

## 4. Estrutura de facções e documentos

Este GDD reúne regras comuns e referencia os detalhes das facções e do combate. O padrão é **22 cartas por baralho de facção**.

- [Piratas do Mar Safira](baralho-piratas.md): identidade, economia, pontuação e baralho de 22 cartas.
- [Necromante da Torre Esquecida](baralho-necromante.md): identidade, pontuação, magias e baralho de 22 cartas.
- [Combate detalhado](registro-de-combate.md): dados e resolução de uma rodada.

As cartas são as versões registradas anteriormente e ainda precisam ser revisadas e testadas para o novo fluxo de ações e reações. A distribuição de pontos por facção será comparada à meta global sem impor uma condição uniforme.

## 5. Parâmetros de teste

Tamanho de mão, quantidade de rodadas, tropas iniciais e demais parâmetros de teste ainda não são regras globais confirmadas.

## 6. Ideias de dinâmica entre facções (não atribuídas e não aprovadas)

### Tensão pacífica pela madeira — conceito em exploração

**[IDEIA REGISTRADA — NÃO É REGRA CONFIRMADA]** Duas facções tendem a se comportar pacificamente, mas possuem interesses conflitantes sobre a mesma região produtora de madeira.

- **Facção A:** controla a maior parte das regiões produtoras de madeira da ilha e possui domínio amplo da produção desse recurso.
- **Facção B:** controla apenas uma região produtora de madeira, importante para seus próprios interesses.
- A disputa de controle dessa região específica cria uma tensão recorrente entre as duas, mesmo que ambas tenham incentivos para evitar guerras abertas.
- **Possível associação temática:** Elfos da Floresta e Dragões Defensores da Ilha. Não foi decidido qual facção assume cada papel e nenhuma regra foi adicionada aos documentos de facção.

**Oportunidade de design:** incentivar pressão territorial, negociação, defesa, ameaças e acordos sem obrigar confronto militar. Uma guerra pelo território deveria ser uma possibilidade, não um resultado inevitável.

**Pontos a validar mais tarde:**
1. Por que a região singular é valiosa para ambas, mesmo havendo outras fontes de madeira?
2. O que cada facção ganha com controle, acesso ou preservação do local?
3. Que alternativas pacíficas existem (permissão de exploração, acordo de passagem, partilha ou cessão)?
4. O que impede a facção que já domina a madeira de simplesmente ignorar ou esmagar a outra?
5. Como esse conflito contribui para o objetivo global de alianças e tensões emergentes, sem criar uma disputa predeterminada em todas as partidas?

**Estado:** ideia em incubação; manter no GDD geral até virar uma mecânica concreta e uma atribuição explícita a facções.

## 7. Eventos por marcos de pontuação — ideia para fases posteriores

**[IDEIA REGISTRADA — NÃO INTEGRAR AO PROTÓTIPO ATUAL]** Quando um jogador atingir um marco de pontuação **X** (valor ainda indefinido), será puxada uma carta de um baralho de eventos. A intenção é que o jogo mude de estado conforme progride, especialmente nas fases mais avançadas da partida.

### Estrutura conceitual das cartas de evento

Uma carta de evento pode conter **condições de ativação**, por exemplo:
- Uma facção específica estar presente na partida.
- Essa facção **não ser a de maior pontuação**.
- Outras condições de estado da ilha, pontuação ou presença de facções, ainda a desenvolver.

Tipos de efeitos desejados:
1. **Bônus para um jogador:** uma vantagem pontual ou auxílio, potencialmente condicionado à posição na disputa.
2. **Mudança no mapa:** alterar regiões, conexões, possibilidades de exploração ou outros elementos territoriais, criando novas estratégias.
3. **Nova mecânica disponível:** adicionar uma opção que antes não existia, por exemplo "gaste um recurso para executar X" ou "aloque um marcador nesta carta para obter Y". Essa última opção pode competir com ações nas regiões do mapa.

**Objetivo de design:** gerar reavaliação das estratégias, alianças e prioridades territoriais; dar à partida uma evolução perceptível sem anular as decisões anteriores dos jogadores.

**Não definido (evitar resolver antecipadamente):**
- Valor de **X**; se há marcos sucessivos e se cada marco dispara um evento apenas uma vez.
- Se o gatilho considera pontos acumulados, quem atinge o marco primeiro, ou outro critério.
- Como selecionar eventos quando suas condições não são satisfeitas (ignorar, descartar, comprar outro ou usar fallback).
- Quando exatamente o evento entra em vigor em relação à pontuação e à próxima rodada.
- Duração de modificações do mapa e de mecânicas novas.
- Limites de mudanças para evitar interrupções e excesso de regras simultâneas.

**Atenção de balanceamento:** cartas que só beneficiem quem está atrás podem criar recuperação artificial; cartas que reforcem quem lidera podem aumentar disparidades. Testar distribuição de vantagens sem presumir que qualquer tipo de bônus seja sempre desejável.

**Prioridade:** implementação posterior, após validação do núcleo do jogo e das primeiras facções.

## 8. Pendências gerais

- Definir duração do combate, movimentação, região contestada e interações entre ações e reações.
- Definir componentes e propriedades das 10 regiões e suas conexões.
- Testar se a fase de pontuação e as ações em ordem são rápidas e claras.
- Quando o núcleo estiver validado, prototipar baralho de eventos disparados por marcos de pontos e testar condições, alterações de mapa e mecânicas temporárias.
- Validar incentivos à diplomacia quando houver 3+ jogadores e facções diferentes.

