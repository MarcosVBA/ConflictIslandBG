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
| Ideias gerais em exploração ou adiadas | [Pontuação](ideias/pontuacao.md) · [Eventos](ideias/eventos.md) · [Tensão pela madeira](ideias/tensao-madeira.md) · [IA para facções](ideias/ia-para-faccoes.md) |
| Estado, hipóteses, divergências e testes do jogo | [Estado do protótipo](prototipo/estado-e-testes.md) |
| Planejamento do protótipo para quatro facções | [Plano de quatro facções](prototipo/plano-quatro-faccoes.md) |
| Evolução para o jogo completo | [Plano de evolução](prototipo/plano-evolucao-jogo.md) |
| Conceito de mesa e telas | [Plano de interface](prototipo/plano-interface.md) · [Abrir demonstração visual](prototipo/mesa-conceito.html) |

[Abrir o protótipo principal](mapa-fluxo-dinamico.html): quatro facções, controle manual e fluxo sem alocação prévia. O jogo funciona em um único HTML local, sem servidor ou IA. As versões com alocação prévia estão preservadas como [legado](historico/prototipos/alocacao-de-marcadores.md), sem atualizações futuras.

## Site e instalação no celular

O fluxo em `.github/workflows/pages.yml` prepara o protótipo principal para publicação no GitHub Pages quando há alteração na branch `main`. Em **Settings → Pages**, selecione **GitHub Actions** como origem. O endereço esperado é `https://marcosvba.github.io/ConflictIslandBG/`.

O site pode ser instalado pelo menu do navegador no Android ou, no iPhone, pelo Safari em **Compartilhar → Adicionar à Tela de Início**. Após a primeira visita online, o jogo pode abrir offline. A partida não é salva ao fechar ou recarregar. Trata-se de um aplicativo web instalável, sem APK ou distribuição por loja.

Para preparar uma cópia pública contendo apenas o jogo, execute `node scripts/preparar-site.cjs` e envie o conteúdo de `dist/`, inclusive a pasta oculta `.github/`, à raiz do repositório público. O arquivo `dist/index.html` é gerado a partir de `mapa-fluxo-dinamico.html`, com instalação e cache opcionais adicionados somente à cópia publicada. A cópia não inclui a documentação histórica.

## Como interpretar e alterar

- **Definido:** decisão registrada pelo usuário. Não implica automaticamente que o código já esteja correto ou completo.
- **Direção para teste:** caminho escolhido para experimentar, ainda sujeito a revisão.
- **Proposta:** hipótese que não foi aprovada como regra definitiva, ainda que o protótipo a utilize.
- **Pendente:** questão sem decisão. **Adiado:** conteúdo reservado para depois.
- O estado de implementação é informado no módulo pertinente e, quando exige explicação do protótipo, no [estado do protótipo](prototipo/estado-e-testes.md). Validar o protótipo não aprova automaticamente todas as hipóteses.

Antes de perguntar se uma regra existe, consulte estes módulos e, quando necessário, a documentação histórica. Para cada mudança de mecânica: atualize o módulo responsável, identifique o impacto nas outras facções e no protótipo, implemente o que for aplicável no HTML, execute os testes pertinentes e registre diferenças ou limitações. Uma edição do Markdown não altera o HTML automaticamente; o código é uma implementação que precisa ser mantida em sincronia.

Os documentos anteriores foram preservados em [histórico](historico/README.md). Eles ajudam a recuperar o contexto, mas não são fontes concorrentes para regras atuais. Não há precedência automática para contradições sem decisão identificável: registre-as como pendentes.

## Verificação local

Após editar `jogo/motor/base.js`, execute `node scripts/sincronizar-motor.cjs` para atualizar a cópia incorporada no HTML. Use `node scripts/sincronizar-motor.cjs --verificar` para verificar a sincronização.

Com Node.js instalado, execute `node testes/validar-motor-base.cjs`, `node testes/validar-documentacao.cjs`, `node testes/validar-lideranca.cjs`, `node testes/validar-fluxo-dinamico.cjs`, `node testes/validar-elfos.cjs`, `node testes/validar-necromante.cjs`, `node testes/validar-novas-habilidades.cjs`, `node testes/validar-publicacao.cjs` e `node testes/validar-mesa-conceito.cjs`. Os testes verificam dados e cenários centrais do protótipo principal; não substituem uma partida real nem inspeção visual.
