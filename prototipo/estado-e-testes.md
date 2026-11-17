# Estado do protótipo e validações

## Escopo e uso

[Jogo em HTML único](../mapa-conflito.html): três facções controladas manualmente por uma pessoa, sem IA, imagens externas, servidor ou arquivos de execução adicionais. O tabuleiro, os marcadores, a mão, a compra e descarte, as escolhas das cartas, recursos, construções, combate, placar e encerramento possuem fluxos implementados para teste. A mão da facção selecionada também pode ser consultada durante a alocação sem jogar a carta.

As fontes de regras e conteúdo são os módulos do [índice](../README.md). Este arquivo registra o que o protótipo faz, as escolhas provisórias e suas limitações, sem substituir os textos desses módulos.

## Configuração e adaptações em teste

O cenário inicial é o descrito em [Mapa](../regras/mapa.md). O extrator inicial na floresta é provisório e ajustável. O estado inicial pode ser restaurado; a restauração também reinicia rodada, placar, cartas e impostos.

O fluxo de ações e parâmetros de mão do protótipo estão registrados em [Regras gerais](../regras/regras-gerais.md). Os critérios provisórios de pontuação e fim estão em [Pontuação](../regras/pontuacao.md). Custos, efeitos e hipóteses específicas pertencem aos documentos de cada facção.

O mesmo HTML pode ser publicado como site estático e instalado como aplicativo web no celular. Após a primeira visita online e instalação do cache, os arquivos do jogo ficam disponíveis offline; o estado da partida continua em memória e é perdido ao recarregar ou fechar o jogo. A instalação usa o navegador e não produz um APK ou aplicativo de loja.

A mão inicia com cinco cartas por padrão, mantendo o ajuste de tamanho disponível. A interface dispõe cinco cartas por linha em telas maiores e quebra em mais linhas em telas pequenas; selecione uma carta para ler o efeito completo.

O mapa representa tropas como pontos por facção, com excedente numérico acima de 12 pontos por grupo; domínio, terreno, recursos, construções e marcadores usam símbolos e rótulos acessíveis. Em cartas de movimento compatíveis, o mapa destaca destinos ou origens e permite selecioná-los; quantidades e confirmação continuam no painel. Ao confirmar a alocação, a interface passa à próxima facção pendente; na resolução destaca um marcador da facção ativa. Essas mudanças são de apresentação e não alteram as regras.

Durante uma escolha no mapa, uma região inválida ainda pode ser inspecionada: ela não altera o destino ou a quantidade da ação e uma mensagem explica a restrição. O mapa mantém as áreas clicáveis separadas no tamanho mínimo previsto e oferece retorno visual ao selecionar; a animação respeita a preferência por movimento reduzido.

## Limitações e divergências a acompanhar

- Os combates implementados exigem tropas defensoras presentes. Invasão Costeira também permite movimento para uma costa sem tropas inimigas, sem combate nem saque. O ataque a uma região com apenas construções depende de uma carta ou regra de alvo ainda não definida.
- Ataques por outros efeitos, além das cartas identificadas, precisam ser adaptados quando houver definição concreta. O fluxo não transforma presença conjunta em combate automático.
- A conciliação aplicada para dano excedente a construções está em [Combate](../regras/combate.md); ela precisa ser revisada em relação ao registro histórico.
- A capacidade temática de recuperação da Torre não possui regra operacional definida. Praga Resistente é uma reação implementada; a Guarda Imperial continua uma proposta opcional e a elegibilidade das demais cartas defensivas segue em aberto.
- Não há salvamento, semente reproduzível, exportação de relatório ou métricas automáticas de balanceamento. As ferramentas de depuração alteram o estado e não substituem as ações normais do jogo.
- O protótipo foi validado pelo usuário para continuar o desenvolvimento. As regras provisórias continuam com o estado indicado em seus módulos; validação do programa não é aprovação de todas as hipóteses de design.

## Verificações registradas

Em 16/11/2026, uma simulação local com manipuladores de interface e DOM substituto percorreu seis rodadas: preparação, alocação coletiva, ações das três facções, movimentação, ataque, reação proposta, saque, pontuação, fim e reinício. A ordem inicial das cartas e os dados foram controlados; as quatro últimas rodadas terminaram sem ações.

Outros testes locais cobriram famílias de cartas, magias, tecnologias, acordos, repetição após erro, empate de domínio, região devastada, proteção, dano excedente, desfazer e escolha de penalidade de imposto. A validação por DOM substituto verifica lógica e encadeamento sob condições simuladas: não prova apresentação visual, acessibilidade real, equilíbrio ou todas as combinações.

Após reorganizações ou mudanças, execute `node testes/validar-documentacao.cjs`. O teste confere nomes e quantidades dos baralhos documentados, mapa e dados contra o HTML e cobre invariantes centrais e o ciclo de rodada simulado. Ele não interpreta automaticamente todas as regras em prosa nem substitui testar cada alteração relevante.

Para conferir os arquivos de instalação e cache, execute `node testes/validar-publicacao.cjs`. Essa verificação simulada não substitui testar instalação e funcionamento offline em dispositivos reais.
