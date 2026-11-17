# Conflict Island — Game Design Document (GDD)

**Versão:** 2.4  
**Data:** 11/11/2026  
**Escopo:** regras globais do jogo; mecânicas específicas ficam em documentos de facção.  
**Status:** pré-protótipo.

## 1. Visão do jogo

- Jogo de tabuleiro assimétrico de disputa territorial, com baralhos individuais de facção e vitória por pontos.
- Ilha com **10 regiões conectadas por trajetos**; regiões podem ser costeiras ou interiores.
- Fantasia e pirataria: Piratas do Mar Safira, Império da Gran' Valia, Elfos da Floresta, Necromante da Torre Alta e Dragões Defensores da Ilha.
- As facções têm mecanismos distintos de ação, economia e pontuação. O mapa pode mudar periodicamente por eventos (a desenvolver).
- A progressão deve estimular conflitos e alianças, sem impor a diplomacia como obrigação.

## 2. Ações e rodadas

**[CONFIRMADO]** Cada jogador coloca marcadores numerados (até 2 no modelo atual) nas regiões do mapa. No tabuleiro individual, associa secretamente uma carta a cada marcador; o efeito ocorre na região correspondente.

**[CONFIRMADO — direção atual]** A resolução das ações será **paralela**, permitindo que ações entrem em conflito, se protejam ou se anulem. As cartas são secretas até a resolução. Os pormenores de resolução simultânea ainda precisam ser validados.

**[CONFIRMADO]** Há uma **fase de pontuação após a resolução**.

**[DESCARTADO PARA O PROTÓTIPO]** Leilão de liderança. O modelo histórico de líder escolhendo ordem e resolução alternada/invertida foi substituído pela resolução paralela. Não integrar essas regras à partida de teste atual.

**[PROPOSTA OPERACIONAL]** Para testar com cartas, usar as fases: posicionamento → alocação secreta → revelação das cartas → resolução paralela → pontuação → reposição da mão. Eventuais subetapas técnicas são expedientes para arbitrar efeitos simultâneos, não turnos de jogador.

## 3. Meta global de pontuação e balanceamento

**[VISÃO DEFINIDA — META, NÃO REGRA DE PONTUAÇÃO]** Projetar e calibrar **cada facção** para gerar, em média, **3 pontos de vitória por jogador por rodada**.

- **1 ponto:** deve ser relativamente acessível mesmo em rodadas ruins, sem necessariamente ser garantido.
- **3 pontos:** desempenho típico almejado por jogador/rodada ao longo de partidas e testes.
- **5 pontos:** resultado excepcional de uma rodada muito boa; deve ser raro.
- Evitar estratégias que acumulem rotineiramente acima de 5 pontos/rodada.

**[ABERTO]** Definir se 5 é somente uma referência de balanceamento ou teto absoluto. Por enquanto **não é limite rígido**. Também não há pontuação mínima garantida.

**Medição no playtest:** anotar pontuação de cada jogador em toda rodada, média por jogador/rodada, frequência de 0, 1 e 5+ pontos, variação entre facções e origem dos pontos. A média global não basta: conferir se a facção consegue pontuar de várias maneiras sem estratégia dominante.

## 4. Estrutura de facções e documentos

Este GDD documenta **apenas regras comuns**, metas de equilíbrio, mapa, componentes comuns e decisões estruturais. Regras exclusivas (recursos, condições de pontuação, cartas, construções e combate especial) devem ficar no documento próprio de cada facção.

- **Piratas do Mar Safira:** `Conflict_Island_Piratas_v0.2.md` — economia de ouro, saque, Bar Pirata, movimento e apoio militar, baralho de 30 cartas de teste.
- **Demais facções:** arquivos independentes a criar quando desenvolvidas.

A distribuição de pontos por facção será comparada à meta global sem forçar uma condição de vitória uniforme.

## 5. Parâmetros do protótipo (não aprovados)

Para testes espelhados, a documentação da facção Piratas propõe números como mão de 5 cartas, 6 rodadas, 4 tropas iniciais e um conjunto de 30 cartas. Esses números **não são regras globais confirmadas** e ficam no arquivo da facção enquanto estiverem ligados somente ao teste espelhado.

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

- Definir regras comuns de combate simultâneo, movimentação, região contestada e desempate de efeitos.
- Definir componentes e propriedades das 10 regiões e suas conexões.
- Testar se fase de pontuação e ações simultâneas são rápidas e claras.
- Quando o núcleo estiver validado, prototipar baralho de eventos disparados por marcos de pontos e testar condições, alterações de mapa e mecânicas temporárias.
- Validar incentivos à diplomacia quando houver 3+ jogadores e facções diferentes.

## 9. Histórico e migração documental

- **v2.4:** registrada a proposta de baralho de eventos ativado por marco de pontuação X, com condições de elegibilidade, bônus, mutações do mapa e novas ações temporárias ou permanentes; sem antecipar parâmetros e sem implementar no protótipo atual.

- **v2.3:** registrada hipótese de tensão pacífica entre duas facções pela região produtora de madeira, com Elfos e Dragões como candidatos ainda não atribuídos. Nenhuma mecânica nova foi aprovada.
- **v2.2:** criada separação entre GDD e documentos de facções. Meta de pontuação de **3 em média**, **1 acessível** e **5 excepcional** registrada globalmente; as mecânicas dos Piratas foram transferidas para seu arquivo.
- **v2.1 e anteriores:** histórico integral preservado em `Conflict_Island_GDD_v2.1.md`, que contém decisões passadas, propostas já descartadas e materiais específicos de facções. Esse arquivo é **arquivo histórico**, não a fonte atual de regras.
- Regras de leilão de liderança e resolução sequencial permanecem apenas como ideias históricas e **não integram o protótipo**.
