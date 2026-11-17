# Conflict Island

Este é o índice dos documentos atuais de design e do protótipo jogável. Cada assunto tem um documento responsável; referências em outros módulos apontam para ele em vez de repetir suas regras.

Conflict Island é um jogo de tabuleiro assimétrico de fantasia e pirataria, ambientado na ilha de Câlepoo. As facções disputam território e pontos com economias e baralhos próprios. Conflitos, negociação e alianças são desejados, sem tornar a diplomacia obrigatória.

## Documentos atuais

| Assunto | Fonte de verdade |
| --- | --- |
| Fluxo geral, ações, domínio e recursos | [Regras gerais](regras/regras-gerais.md) |
| Ataque, reação e resolução da batalha | [Combate](regras/combate.md) |
| Faces e significado dos dados | [Dados](regras/dados.md) |
| Princípios globais de pontuação e encerramento | [Pontuação](regras/pontuacao.md) |
| Regiões, conexões e cenário inicial | [Mapa](regras/mapa.md) |
| Facção e baralho dos Piratas | [Piratas](faccoes/piratas.md) |
| Facção, baralho e magias do Necromante | [Necromante](faccoes/necromante.md) |
| Facção, tecnologias, baralhos e impostos do Império | [Império — proposta](faccoes/imperio.md) |
| Facção e baralho dos Elfos | [Elfos](faccoes/elfos.md) |
| Ideias para facções futuras | [Dragões](faccoes/dragoes.md) |
| Ideias gerais em exploração | [Pontuação](ideias/pontuacao.md) · [Eventos](ideias/eventos.md) · [Tensão pela madeira](ideias/tensao-madeira.md) |
| Estado, hipóteses, divergências e testes do jogo | [Estado do protótipo](prototipo/estado-e-testes.md) |
| Planejamento do protótipo para quatro facções | [Plano de quatro facções](prototipo/plano-quatro-faccoes.md) |

[Abrir o protótipo de quatro facções](mapa-quatro-faccoes.html) · [Abrir o protótipo anterior de três facções](mapa-conflito.html). As facções são controladas manualmente, sem IA. Cada jogo está em um único HTML que pode ser aberto localmente sem servidor; a nova versão não depende dos arquivos de instalação da anterior.

## Site e instalação no celular

O fluxo em `.github/workflows/pages.yml` publica a versão anterior de três facções no GitHub Pages quando há alteração na branch `main`; o novo protótipo de quatro facções ainda não faz parte da publicação. Em **Settings → Pages**, selecione **GitHub Actions** como origem. O endereço esperado é `https://marcosvba.github.io/ConflictIslandBG/`.

O site pode ser instalado pelo menu do navegador no Android ou, no iPhone, pelo Safari em **Compartilhar → Adicionar à Tela de Início**. Após a primeira visita online, o jogo pode abrir offline. A partida não é salva ao fechar ou recarregar. Trata-se de um aplicativo web instalável, sem APK ou distribuição por loja.

Para preparar uma cópia pública contendo apenas o jogo, execute `node scripts/preparar-site.cjs` e envie o conteúdo de `dist/`, inclusive a pasta oculta `.github/`, à raiz do repositório público. O arquivo `dist/index.html` é gerado a partir de `mapa-conflito.html`, que continua sendo a fonte do jogo. A cópia não inclui a documentação histórica.

## Como interpretar e alterar

- **Definido:** decisão registrada pelo usuário. Não implica automaticamente que o código já esteja correto ou completo.
- **Direção para teste:** caminho escolhido para experimentar, ainda sujeito a revisão.
- **Proposta:** hipótese que não foi aprovada como regra definitiva, ainda que o protótipo a utilize.
- **Pendente:** questão sem decisão. **Adiado:** conteúdo reservado para depois.
- O estado de implementação é informado no módulo pertinente e, quando exige explicação do protótipo, no [estado do protótipo](prototipo/estado-e-testes.md). Validar o protótipo não aprova automaticamente todas as hipóteses.

Antes de perguntar se uma regra existe, consulte estes módulos e, quando necessário, a documentação histórica. Para cada mudança de mecânica: atualize o módulo responsável, identifique o impacto nas outras facções e no protótipo, implemente o que for aplicável no HTML, execute os testes pertinentes e registre diferenças ou limitações. Uma edição do Markdown não altera o HTML automaticamente; o código é uma implementação que precisa ser mantida em sincronia.

Os documentos anteriores foram preservados em [histórico](historico/README.md). Eles ajudam a recuperar o contexto, mas não são fontes concorrentes para regras atuais. Não há precedência automática para contradições sem decisão identificável: registre-as como pendentes.

## Verificação local

Com Node.js instalado, execute `node testes/validar-documentacao.cjs`, `node testes/validar-quatro-faccoes.cjs`, `node testes/validar-lideranca.cjs` e `node testes/validar-alocacao.cjs`. Os testes verificam dados e cenários centrais das duas versões; não substituem uma partida real nem inspeção visual.
