# Estado do protótipo e validações

## Escopo e uso

[Jogo em HTML único](../mapa-conflito.html): três facções controladas manualmente por uma pessoa, sem IA, imagens externas, servidor ou arquivos de execução adicionais. O tabuleiro, os marcadores, a mão, a compra e descarte, as escolhas das cartas, recursos, construções, combate, placar e encerramento possuem fluxos implementados para teste. A mão da facção selecionada também pode ser consultada durante a alocação sem jogar a carta.

As fontes de regras e conteúdo são os módulos do [índice](../README.md). Este arquivo registra o que o protótipo faz, as escolhas provisórias e suas limitações, sem substituir os textos desses módulos.

## Configuração e adaptações em teste

O cenário inicial é o descrito em [Mapa](../regras/mapa.md). O extrator inicial na floresta é provisório e ajustável. O estado inicial pode ser restaurado; a restauração também reinicia rodada, placar, cartas e impostos.

O fluxo de ações e parâmetros de mão do protótipo estão registrados em [Regras gerais](../regras/regras-gerais.md). Os critérios provisórios de pontuação e fim estão em [Pontuação](../regras/pontuacao.md). Custos, efeitos e hipóteses específicas pertencem aos documentos de cada facção. As construções imperiais e suas habilidades usam as adaptações registradas no módulo do Império.

Ambos os protótipos têm leilão de liderança antes da alocação. A pessoa escolhe o primeiro jogador da partida; nas demais rodadas, o líder anterior começa os lances. O leilão e as ações seguem o sentido anti-horário a partir do líder, usando a sequência fixa de facções registrada em [Regras gerais](../regras/regras-gerais.md). As cartas oferecidas ficam visíveis e só as do vencedor são descartadas; a mão não é recomposta após o leilão. Os valores nas cartas foram definidos pelo usuário para teste e estão registrados em cada módulo de facção; o balanceamento não é final.

Na alocação, o próximo jogador após o líder começa; cada facção coloca um marcador por vez, no sentido anti-horário, até completar duas voltas. O líder é o último em cada volta. A interface permite desfazer o último marcador antes da resolução, que continua começando pelo líder.

O mesmo HTML pode ser publicado como site estático e instalado como aplicativo web no celular. Após a primeira visita online e instalação do cache, os arquivos do jogo ficam disponíveis offline; o estado da partida continua em memória e é perdido ao recarregar ou fechar o jogo. A instalação usa o navegador e não produz um APK ou aplicativo de loja.

O [novo protótipo de quatro facções](../mapa-quatro-faccoes.html) é outro HTML local independente, com 11 regiões e os Elfos; não depende de servidor ou arquivos adicionais. O cenário anterior permanece preservado. O novo usa as duas cópias de Alistamento documentadas para o Império e implementa o Alistamento Obrigatório uma vez por rodada, durante a alocação, como adaptação de teste; o HTML anterior mantém três cópias e não inclui essa habilidade. As regras do Império continuam propostas, não aprovadas como finais.

No mapa de quatro facções, R5–R8, R9–R2 e R2–R6 não são adjacentes; R2 liga-se a R10. O cenário de três facções mantém suas conexões originais.

No novo protótipo, Canção de paz, as cartas élficas e suas pontuações estão implementadas para teste. A seção [Elfos](../faccoes/elfos.md) registra as decisões e adaptações; o [plano](plano-quatro-faccoes.md) e o [mapa](../regras/mapa.md) descrevem o escopo e o cenário. As trocas de tropas usam regiões dominadas pelo recebedor e convertem as unidades para sua facção. A versão nova não está ligada à publicação ou instalação da versão anterior.

O imposto imperial ativo e seu atraso aparecem em um quadro compacto no painel de jogo durante a seleção do Império na alocação e sua vez na resolução. Ao preparar cada rodada, um novo imposto substitui o anterior não pago; após pagamento, o próximo só é revelado na rodada seguinte. As três cartas que descartam toda a mão compram imediatamente até cinco cartas, independentemente do tamanho configurado; se necessário, o descarte é reembaralhado, inclusive a carta jogada. Se não houver cartas suficientes, compra-se o que houver. A mão inicia com cinco cartas por padrão, mantendo o ajuste de tamanho disponível. A interface dispõe cinco cartas por linha em telas maiores e quebra em mais linhas em telas pequenas; selecione uma carta para ler o efeito completo.

O mapa representa tropas como pontos por facção, com excedente numérico acima de 12 pontos por grupo; domínio, terreno, recursos, construções e marcadores usam símbolos e rótulos acessíveis. As construções têm ícones ampliados e contrastantes no mapa. Em cartas de movimento compatíveis, o mapa destaca destinos ou origens e permite selecioná-los; quantidades e confirmação continuam no painel. Ao colocar um marcador, a interface passa à próxima facção na ordem; na resolução destaca um marcador da facção ativa.

Durante uma escolha no mapa, uma região inválida ainda pode ser inspecionada: ela não altera o destino ou a quantidade da ação e uma mensagem explica a restrição. O mapa mantém as áreas clicáveis separadas no tamanho mínimo previsto e oferece retorno visual ao selecionar; a animação respeita a preferência por movimento reduzido.

## Limitações e divergências a acompanhar

- Os combates implementados exigem tropas defensoras presentes. Invasão Costeira também permite movimento para uma costa sem tropas inimigas, sem combate nem saque. O ataque a uma região com apenas construções depende de uma carta ou regra de alvo ainda não definida.
- Ataques por outros efeitos, além das cartas identificadas, precisam ser adaptados quando houver definição concreta. O fluxo não transforma presença conjunta em combate automático.
- A conciliação aplicada para dano excedente a construções está em [Combate](../regras/combate.md); ela precisa ser revisada em relação ao registro histórico.
- A capacidade temática de recuperação da Torre não possui regra operacional definida. Praga Resistente é uma reação implementada; a Guarda Imperial permanece uma reação de teste (1 dano, ou 2 com Quartel controlado); a elegibilidade das demais cartas defensivas segue em aberto.
- Não há salvamento, semente reproduzível, exportação de relatório ou métricas automáticas de balanceamento. As ferramentas de depuração alteram o estado e não substituem as ações normais do jogo.
- O protótipo foi validado pelo usuário para continuar o desenvolvimento. As regras provisórias continuam com o estado indicado em seus módulos; validação do programa não é aprovação de todas as hipóteses de design.

## Verificações registradas

Em 16/11/2026, uma simulação local com manipuladores de interface e DOM substituto percorreu seis rodadas: preparação, alocação coletiva, ações das três facções, movimentação, ataque, reação proposta, saque, pontuação, fim e reinício. A ordem inicial das cartas e os dados foram controlados; as quatro últimas rodadas terminaram sem ações.

Outros testes locais cobriram famílias de cartas, magias, tecnologias, acordos, repetição após erro, empate de domínio, região devastada, proteção, dano excedente, desfazer e escolha de penalidade de imposto. A validação por DOM substituto verifica lógica e encadeamento sob condições simuladas: não prova apresentação visual, acessibilidade real, equilíbrio ou todas as combinações.

Após reorganizações ou mudanças, execute `node testes/validar-documentacao.cjs`. O teste confere nomes e quantidades dos baralhos documentados, mapa e dados contra o HTML e cobre invariantes centrais e o ciclo de rodada simulado. Ele não interpreta automaticamente todas as regras em prosa nem substitui testar cada alteração relevante.

Para conferir os arquivos de instalação e cache, execute `node testes/validar-publicacao.cjs`. Essa verificação simulada não substitui testar instalação e funcionamento offline em dispositivos reais.

Para o novo cenário, execute também `node testes/validar-quatro-faccoes.cjs`. Ele verifica baralhos, arquivo único, estado inicial, pontuação e coleta élficas, conversão e troca de tropas, Canção de paz com reações e terceiro presente, movimento de Furia da Ilha e um ciclo de seis rodadas sem ações, além do reinício. Usa DOM substituto; não verifica o layout, acessibilidade real, desempenho em celular, equilíbrio ou uma partida completa com todas as cartas. Nesta implementação o navegador de teste não estava disponível; a interface precisa de validação visual pelo usuário.

Execute `node testes/validar-lideranca.cjs` para conferir os valores documentados nas duas versões e os cenários de leilão com aumento de lance, lance inválido, passagem, cartas retornadas e descarte do vencedor. Essa simulação também usa DOM substituto e não valida a apresentação visual ou o balanceamento dos valores.

Execute `node testes/validar-alocacao.cjs` para conferir as duas voltas de marcadores, o líder por último e a possibilidade de desfazer, em ambas as versões e com cada facção como líder. O teste usa DOM substituto e não valida a apresentação visual.
