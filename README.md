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
| Experimento de baralhos de 12 cartas | [Baralhos revisados](prototipo/baralhos-revisados.md) |
| Estado, hipóteses, divergências e testes do jogo | [Estado do protótipo](prototipo/estado-e-testes.md) |
| Índice de decisões, implementação e testes | [Matriz de rastreabilidade](prototipo/rastreabilidade.md) |
| Planejamento do protótipo para quatro facções | [Plano de quatro facções](prototipo/plano-quatro-faccoes.md) |
| Evolução para o jogo completo | [Plano de evolução](prototipo/plano-evolucao-jogo.md) |
| Conceito de mesa e telas | [Plano de interface](prototipo/plano-interface.md) · [Abrir demonstração visual](prototipo/mesa-conceito.html) |
| Partidas e revisão de interface | [Roteiro de validação humana](prototipo/roteiro-validacao.md) |

[Abrir o protótipo principal](mapa-fluxo-dinamico.html): quatro facções, controle manual e fluxo sem alocação prévia. [Abrir a mesa experimental de baralhos revisados](mapa-baralhos-revisados.html), com 12 cartas por facção; suas regras e roteiro comparativo estão no documento do experimento. O jogo funciona em um único HTML local, sem servidor ou IA. As versões com alocação prévia estão preservadas como [legado](historico/prototipos/alocacao-de-marcadores.md), sem atualizações futuras.

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

O motor extraído fica em `jogo/motor/base.js`; dados de mapa e cartas ficam em `jogo/dados/`; a aplicação atual fica em `jogo/aplicacao/`; estilo e catálogo visual ficam em `jogo/apresentacao/`. Após editar esses arquivos, execute `node scripts/sincronizar-motor.cjs` para atualizar as cópias incorporadas no HTML. Use `node scripts/sincronizar-motor.cjs --verificar` para verificar a sincronização. A extração do motor ainda está em andamento: parte das regras de cartas e da orquestração de combate continua nos arquivos de aplicação.

Em `jogo/apresentacao/artes.js`, associe caminhos opcionais aos nomes de cartas ou IDs de regiões. Os caminhos locais são relativos ao HTML aberto; depois, sincronize o HTML. Sem imagem, ou se uma imagem de carta não carregar, o desenho provisório continua disponível. O preparo do site copia a pasta opcional `artes/` para a distribuição; outros caminhos locais devem ser incluídos manualmente.

Com Node.js e dependências de desenvolvimento instaladas, `npm run check:rapido` verifica a sincronização, a matriz, a formatação, a documentação e o motor; `npm run check:completo` acrescenta as demais suítes e o navegador. Ambos mostram o tempo de cada etapa. Para mudanças localizadas, use também `npm run test:combate`, `npm run test:elfos` ou `npm run test:mapa`. `npm run format:verificar` confere a formatação dos arquivos de aplicação; `npm run format:aplicacao` a aplica, após o que é necessário sincronizar o HTML. A coordenação da pontuação e dos impostos fica em `jogo/aplicacao/pontuacao.js`, incorporado junto das ações ao gerar o HTML.

A [matriz](prototipo/rastreabilidade.md) é gerada a partir de `prototipo/rastreabilidade.json` por `node scripts/validar-rastreabilidade.cjs --atualizar`. Seu verificador confere estrutura, referências e sincronização da tabela, mas não interpreta prosa nem garante a cobertura de cada regra. A fonte de cada decisão continua sendo seu módulo de regras ou facção.

Com Node.js instalado, execute `node testes/validar-motor-base.cjs`, `node testes/validar-documentacao.cjs`, `node testes/validar-lideranca.cjs`, `node testes/validar-fluxo-dinamico.cjs`, `node testes/validar-partida.cjs`, `node testes/validar-elfos.cjs`, `node testes/validar-necromante.cjs`, `node testes/validar-novas-habilidades.cjs`, `node testes/validar-publicacao.cjs` e `node testes/validar-mesa-conceito.cjs`. Os testes verificam dados e cenários centrais do protótipo principal; não substituem uma partida real nem inspeção visual.

### Testes em navegador

Para preparar a ferramenta de desenvolvimento, execute `npm ci` e `npx playwright install chromium --only-shell` (em Linux, podem ser necessárias dependências do sistema, instaláveis com `npx playwright install-deps chromium`). Depois execute `npm run test:navegador`. Os testes da mesa abrem o HTML por `file://`, bloqueiam requisições HTTP e exercitam o jogo em Chromium nas configurações de desktop e celular. Um teste separado usa um servidor local temporário apenas para conferir a instalação e o cache offline da distribuição em `dist/`; esse servidor não é necessário para jogar. A aleatoriedade é fixada apenas no navegador de teste; cenários reutilizáveis ajustam a mão ou pontuação para alcançar o trecho a verificar.

As capturas ficam em `test-results/`; falhas também incluem captura e rastreamento. Na integração contínua, esses arquivos e o relatório HTML são anexados à execução. As capturas são evidências, não uma aprovação visual. Para criar referências candidatas, execute `VISUAL_CHECK=1 npx playwright test --update-snapshots`, compare-as com o conceito aprovado e revise-as antes de adicioná-las ao projeto. Após aprovar referências para o mesmo ambiente, `npm run test:visual` compara as imagens sem gerar referências ausentes. Diferenças entre sistemas, fontes e versões de navegador podem exigir revisão; comparação automática não substitui validação humana nem comprova a aparência em todos os dispositivos.
