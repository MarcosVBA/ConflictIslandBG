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
| Cartas de evento e marco de pontuação | [Eventos](regras/eventos.md) |
| Regiões, conexões e cenário inicial | [Mapa](regras/mapa.md) |
| Facção e baralho dos Piratas | [Piratas](faccoes/piratas.md) |
| Facção, baralho e magias do Necromante | [Necromante](faccoes/necromante.md) |
| Facção, tecnologias, baralhos e impostos do Império | [Império — proposta](faccoes/imperio.md) |
| Facção e baralho dos Elfos | [Elfos](faccoes/elfos.md) |
| Ideias para facções futuras | [Dragões](faccoes/dragoes.md) |
| Ideias gerais em exploração ou adiadas | [Pontuação](ideias/pontuacao.md) · [Tensão pela madeira](ideias/tensao-madeira.md) · [IA para facções](ideias/ia-para-faccoes.md) |
| Referência para ilustrações | [Direção artística](arte/direcao-artistica.md) |

[Abrir o protótipo principal](mapa-fluxo-dinamico.html): quatro facções, controle manual e fluxo sem alocação prévia. Cada facção usa um baralho de 12 cartas. O jogo funciona em um único HTML local, sem servidor ou IA. Versões e decisões antigas permanecem arquivadas em `historico/`.

## Site e instalação no celular

O fluxo em `.github/workflows/pages.yml` prepara o protótipo principal para publicação no GitHub Pages quando há alteração na branch `main`. Em **Settings → Pages**, selecione **GitHub Actions** como origem. O endereço esperado é `https://marcosvba.github.io/ConflictIslandBG/`.

O site pode ser instalado pelo menu do navegador no Android ou, no iPhone, pelo Safari em **Compartilhar → Adicionar à Tela de Início**. Após a primeira visita online, o jogo pode abrir offline. A partida não é salva ao fechar ou recarregar. Trata-se de um aplicativo web instalável, sem APK ou distribuição por loja.

Para preparar uma cópia pública contendo apenas o jogo, execute `node scripts/preparar-site.cjs` e envie o conteúdo de `dist/`, inclusive a pasta oculta `.github/`, à raiz do repositório público. O arquivo `dist/index.html` é gerado a partir de `mapa-fluxo-dinamico.html`, com instalação e cache opcionais adicionados somente à cópia publicada. A cópia não inclui a documentação histórica.

## Como interpretar e alterar

- **Definido:** decisão registrada pelo usuário. Não implica automaticamente que o código já esteja correto ou completo.
- **Direção para teste:** caminho escolhido para experimentar, ainda sujeito a revisão.
- **Proposta:** hipótese que não foi aprovada como regra definitiva, ainda que o protótipo a utilize.
- **Pendente:** questão sem decisão. **Adiado:** conteúdo reservado para depois.
- O estado de implementação é informado no módulo pertinente ou na seção de limitações abaixo. Validar o protótipo não aprova automaticamente todas as hipóteses.

Antes de perguntar se uma regra existe, consulte estes módulos. Para cada mudança de mecânica: atualize o módulo responsável, identifique o impacto nas outras facções e no protótipo, implemente o que for aplicável no HTML, execute os testes pertinentes e registre diferenças ou limitações. Uma edição do Markdown não altera o HTML automaticamente; o código é uma implementação que precisa ser mantida em sincronia.

Os documentos anteriores foram preservados em `historico/`, fora das consultas e checagens de rotina. São registros, não fontes concorrentes para regras atuais. Não há precedência automática para contradições sem decisão identificável: registre-as como pendentes.

## Verificação local

O motor extraído fica em `jogo/motor/base.js`; dados de mapa e cartas ficam em `jogo/dados/`; a aplicação atual fica em `jogo/aplicacao/`; estilo e catálogo visual ficam em `jogo/apresentacao/`. Após editar esses arquivos, execute `node scripts/sincronizar-motor.cjs` para atualizar as cópias incorporadas no HTML. Use `node scripts/sincronizar-motor.cjs --verificar` para verificar a sincronização. A extração do motor ainda está em andamento: parte das regras de cartas e da orquestração de combate continua nos arquivos de aplicação.

Em `jogo/apresentacao/artes.js`, associe caminhos opcionais aos nomes de cartas ou IDs de regiões. Os caminhos locais são relativos ao HTML aberto; depois, sincronize o HTML. Sem imagem, ou se uma imagem de carta não carregar, o desenho provisório continua disponível. O preparo do site copia a pasta opcional `artes/` para a distribuição; outros caminhos locais devem ser incluídos manualmente.

### Referências de implementação e testes

O módulo de regra ou facção na tabela acima é a fonte das decisões. A implementação usa `jogo/dados/`, `jogo/motor/base.js` e `jogo/aplicacao/`; a apresentação usa `jogo/apresentacao/`. Para localizar testes por assunto:

| Área | Testes principais |
| --- | --- |
| Mapa, dados e baralhos | `testes/validar-documentacao.cjs`, `testes/validar-baralhos-revisados.cjs` |
| Liderança, ações e partida | `testes/validar-lideranca.cjs`, `testes/validar-fluxo-dinamico.cjs`, `testes/validar-partida.cjs` |
| Combate e reações | `testes/validar-fluxo-dinamico.cjs`, `testes/navegador/mesa.spec.cjs` |
| Facções e habilidades | `testes/validar-elfos.cjs`, `testes/validar-necromante.cjs`, `testes/validar-novas-habilidades.cjs` |
| Interface e distribuição | `testes/navegador/mesa.spec.cjs`, `testes/validar-publicacao.cjs`, `testes/navegador/distribuicao.spec.cjs` |

Com Node.js e dependências instaladas, use `npm run check:rapido` para sincronização, formatação, documentação e motor; `npm run check:completo` inclui as demais suítes e navegador. Para mudanças localizadas, escolha `npm run test:combate`, `npm run test:elfos` ou `npm run test:mapa` conforme o impacto. Cada comando mostra um resumo e, em caso de falha, os detalhes; `CHECK_VERBOSE=1` mostra toda a saída. Agrupe mudanças e faça testes e revisão ao final do lote. `npm run format:verificar` confere a formatação e `npm run format:aplicacao` a aplica; depois sincronize o HTML.

### Limitações e pendências

- **Direção visual:** a [referência artística](arte/direcao-artistica.md) descreve aquarela expressiva e nanquim para as ilustrações. Uma tentativa de paleta quente da interface foi rejeitada; a paleta das ilustrações não define automaticamente a da interface. O HUD deve mudar de cor com a facção ativa preservando a paleta-base da mesa. O acabamento continua aberto à evolução e à avaliação visual.
- O fluxo principal foi validado pelo usuário, mas equilíbrio, acessibilidade e aparência em desktop e celular aguardam mais partidas e avaliação humana. A posição do extrator inicial e o equilíbrio do mapa, facções, custos e liderança permanecem em teste.
- As melhorias de 18 de novembro foram verificadas; a avaliação visual de domínio, ícones, campos e modais permanece pendente. Os cliques nos botões de quantidade e todos os modos sem região não têm cobertura específica.
- A partida não é salva ao fechar ou recarregar; não há semente reproduzível, relatório ou métricas automáticas de equilíbrio. Ajustes manuais de depuração podem criar estados intermediários e não simulam automaticamente a perda da Torre. O estoque de peças físicas não é simulado.
- No teste de navegador a reação de combate parte de um estado preparado, sem percorrer toda a declaração pela interface. A proteção do atacante por Defesa Global e o saque sem movimento da Invasão não têm cenário automatizado específico. Outras cartas defensivas e detalhes de alvos que se tornam inválidos ainda precisam de definição; Guarda Imperial é uma adaptação de teste.
- O motor foi parcialmente extraído: apresentação, orquestração do combate, algumas escolhas e transições ainda ficam na aplicação. A disponibilidade de ações ainda usa dois registros virtuais por facção.
- Os testes usam DOM substituto e Chromium com dados controlados; não interpretam toda a prosa nem comprovam todas as combinações, a instalação em dispositivos físicos ou uma partida real. IA permanece adiada; reposição, limites de componentes e casos sem opções legais dependem de definição onde não documentados.

### Testes em navegador

Para preparar a ferramenta de desenvolvimento, execute `npm ci` e `npx playwright install chromium --only-shell` (em Linux, podem ser necessárias dependências do sistema, instaláveis com `npx playwright install-deps chromium`). Depois execute `npm run test:navegador`. Os testes da mesa abrem o HTML por `file://`, bloqueiam requisições HTTP e exercitam o jogo em Chromium nas configurações de desktop e celular. Um teste separado usa um servidor local temporário apenas para conferir a instalação e o cache offline da distribuição em `dist/`; esse servidor não é necessário para jogar. A aleatoriedade é fixada apenas no navegador de teste; cenários reutilizáveis ajustam a mão ou pontuação para alcançar o trecho a verificar.

Falhas incluem captura e rastreamento em `test-results/`. Para capturas adicionais de sucesso, use `CAPTURAS=1 npm run test:navegador`. Na integração contínua, esses arquivos e o relatório HTML são anexados à execução. As capturas são evidências, não uma aprovação visual. Para criar referências candidatas, execute `VISUAL_CHECK=1 npx playwright test --update-snapshots`, revise-as com o usuário antes de adicioná-las ao projeto. Após aprovar referências para o mesmo ambiente, `npm run test:visual` compara as imagens sem gerar referências ausentes. Diferenças entre sistemas, fontes e versões de navegador podem exigir revisão; comparação automática não substitui validação humana nem comprova a aparência em todos os dispositivos.
