# Plano de evolução para o jogo completo

**Estado: implementação em andamento.** Este documento orienta a evolução do [protótipo principal](../mapa-fluxo-dinamico.html), preservando seu fluxo aprovado. Não aprova regras pendentes nem transforma os valores provisórios em regras finais. As decisões de jogo continuam nos módulos do [índice](../README.md), e o estado efetivamente entregue permanece em [Estado e testes](estado-e-testes.md).

## Objetivos e limites

- Separar mecânicas, dados, orquestração e apresentação, permitindo testar regras sem navegador e modificar a interface sem alterar seus resultados.
- Automatizar o processamento de uma partida completa: fases, validação, movimentos, custos, efeitos, combate, pontuação e encerramento, sempre respeitando as escolhas humanas.
- Criar uma interface clara e agradável, com linguagem visual de jogo de tabuleiro e cartas, animações que comuniquem acontecimentos e boa experiência em computador e celular.
- Utilizar placeholders substituíveis por ilustrações finais sem reescrever as regras, com alternativas funcionais quando uma imagem não estiver disponível.
- Tornar as regras e opções compreensíveis e fáceis de usar, com documentação, orientação contextual e decisões do jogador claramente apresentadas.
- Manter o produto como site estático em HTML, CSS e JavaScript. Bibliotecas ou CDN são opcionais e deverão ter justificativa; o funcionamento essencial não deve depender de CDN.

**Fora do escopo atual:** inteligência artificial, servidor, contas, partidas online, geração de imagens e aprovação automática de regras ainda abertas. Jogadores humanos continuam controlando as facções. Automação significa o jogo executar e conferir regras, não tomar decisões estratégicas ou aceitar acordos no lugar dos jogadores.

A autorização para organizar a nova versão em múltiplos arquivos prevalece para essa evolução. Durante a migração, manter o HTML atual como referência jogável. A distribuição deve funcionar em hospedagem estática; para conservar o uso local sem servidor, planejar uma compilação que gere também um HTML autossuficiente, com código e estilos incorporados. O caminho de execução local deve ser verificado em navegador real; módulos ES carregados diretamente de `file://` não devem ser presumidos funcionais. Se assets finais forem separados, definir uma embalagem local compatível ou incorporá-los na versão autossuficiente.

## Diagnóstico da base atual

O protótipo contém no mesmo arquivo dados de regiões, cartas e tecnologias; estado de rodada e recursos; cálculo de domínio e dano; manipulação de DOM, ações e telas. Algumas rotinas de regras já estão isoladas, mas `executeCard`, fluxo de rodada e combate também leem controles da interface e alteram estado diretamente. Isso dificulta validar todas as combinações, reproduzir uma jogada e evoluir a apresentação sem riscos.

Os testes existentes verificam partes significativas por DOM substituto, incluindo leilão, ações, Elfos, Necromante e seis rodadas; não comprovam apresentação, acessibilidade real ou todas as interações. O [mapa](../regras/mapa.md), as regras de [combate](../regras/combate.md), [pontuação](../regras/pontuacao.md) e as quatro facções são a referência para levantar os comportamentos. Os protótipos em `historico/` são registros legados e não serão atualizados.

## Arquitetura proposta

Estrutura inicial sugerida, ajustável durante a implementação:

```text
jogo/
  index.html                 entrada da aplicação
  dados/                     facções, cartas, mapa, textos e referências visuais
  motor/                     estado, regras, comandos, eventos e validações
    rodada/                  preparação, leilão, ações e pontuação
    combate/                 declaração, reação, dados, baixas e efeitos
    faccoes/                 habilidades e efeitos próprios de cada facção
  aplicacao/                 sessão local, controle de escolhas e persistência
  interface/                 telas, componentes, interações e animações
  estilos/                   tokens, layout, cartas, tabuleiro e responsividade
  assets/                    placeholders e futuros recursos finais
scripts/                     compilação estática e preparação da distribuição
testes/                      motor, integração, interface e distribuição
```

Essa árvore é proposta, não uma descrição de arquivos já existentes. Evitar duplicar textos ou dados de regras entre interface e motor; usar identificadores estáveis para facções, regiões, tipos de efeito e cartas, mantendo nome e texto como apresentação. As fontes de design continuam nos documentos de regras; verificações devem apontar divergências entre elas e os dados implementados.

### Contrato do motor

1. **Estado serializável:** rodada, fase, ordem, jogador ativo, regiões, unidades, construções, recursos, pontuação, baralhos, mãos, descartes, ações disponíveis, leilão, combate e escolha pendente. Distinguir estado público e informação privada, sem prometer sigilo em um único dispositivo compartilhado.
2. **Comandos explícitos:** por exemplo iniciar rodada, ofertar liderança, passar, escolher carta/região, responder a reação e confirmar movimento. Cada comando identifica ator e dados da escolha, sem carregar elementos do DOM.
3. **Validação central:** verificar fase, jogador, posse de carta e ação, custos, alvo, limites e estado atual. Resposta inválida deve fornecer motivo legível e preservar integralmente o estado. A interface usa as mesmas validações para mostrar possibilidades, mas o motor não confia apenas nela.
4. **Transição e eventos:** o processamento recebe estado, comando e fonte de aleatoriedade controlável e retorna novo estado e eventos estruturados, ou erro sem alterações. Eventos como recurso recebido, movimento, carta descartada, reação, resultado de dados e pontuação alimentam interface, histórico e animações; efeitos não dependem de callbacks visuais.
5. **Escolhas pendentes:** quando uma regra exigir seleção de região, oponente, tropas, reação, construção ou acordo, o motor interrompe a resolução com opções válidas e aguarda a decisão autorizada. Não presumir aceitação ou escolher automaticamente um resultado estratégico; considerar efeitos que invalidem as opções.
6. **Aleatoriedade e reprodutibilidade:** embaralhamento e dados recebem uma fonte injetável; testes usam sequência conhecida. Guardar os resultados necessários no estado e histórico, sem depender de animações nem repetir uma rolagem por redesenho da tela.
7. **Ordem e atomicidade:** definir fronteiras explícitas de declaração, pagamento, movimentação, reações, dados, efeitos e conclusão. Resolver transições automáticas até a próxima escolha, aplicando cada efeito uma vez; cancelar só quando a regra permitir e com as consequências já definidas. Preservar ações e custos de Canção de paz e a interrupção da Magia da Torre conforme a documentação.

A implementação pode usar funções puras ou outra técnica equivalente, desde que o motor não dependa de `document`, elementos visuais, áudio, relógio ou armazenamento. A aplicação coordena sessão e persistência; a interface apresenta o estado e emite comandos. O contrato também deve permitir futuramente um controlador automatizado, sem implementar IA agora.

## Fluxo de partida a automatizar

1. **Nova partida:** escolher o primeiro jogador; montar cenário e baralhos das quatro facções e apresentar resumo das regras usadas.
2. **Preparação:** completar mãos, revelar imposto, processar reforço da Torre e Alistamento Obrigatório na ordem documentada, solicitando escolhas quando houver. Registrar efeitos obrigatórios e prevenir aplicação dupla.
3. **Liderança:** conduzir oportunidades em sentido anti-horário, ofertas crescentes e cartas comprometidas; descartar apenas as cartas do vencedor, devolver as demais e manter o líder anterior se todos passarem.
4. **Ações:** apresentar a facção ativa, duas ações em reserva e opções compatíveis. Escolher região e carta na hora, executar efeitos e alternar até esgotar as ações. Passar, descartar e reagir consomem ação conforme as regras.
5. **Combate e reações:** orientar movimentação, escolha de defensor, custos e reações; permitir Canção de paz de terceiro; rolar e aplicar dados, proteção, baixas, dano excedente, efeitos posteriores e pontuação na ordem autorizada. Explicar os resultados e pedir ao jogador escolhas obrigatórias.
6. **Pontuação e fim:** aplicar pontuação e manutenção da rodada uma vez, mostrar origem dos pontos e avançar. A duração de seis rodadas e o empate compartilhado são hipóteses atuais de teste, não decisões finais.
7. **Retomada:** planejar salvamento local de estado versionado e recuperação após interrupção, incluindo escolhas pendentes, sem repetir ações. Informar claramente quando uma versão de dados não puder ser restaurada; o usuário deve poder iniciar outra partida. Detalhar limites de privacidade de mãos e armazenamento compartilhado.

### Casos de maior risco

- Carta inválida, custo insuficiente ou troca recusada não devem consumir recursos, carta ou ação indevidamente.
- Reação defensiva seguida de Canção de paz preserva movimento e custos já realizados, com os marcadores e cartas declarados gastos; batalha termina 0 a 0.
- Perda de controle da Torre pode ocorrer durante uma movimentação ou combate; aplicar a recuperação no momento definido e impedir a continuação de um combate sem participantes válidos.
- O limite de sete do Alistamento Obrigatório aplica-se à habilidade, inclusive quando há seis tropas e nenhuma região dominada; outras fontes podem superar sete.
- Habilidades obrigatórias, renda, pontuação e penalidades não podem ser aplicadas duas vezes ao renderizar, retornar de uma tela ou restaurar a partida.
- Pontuação élfica por eliminar o adversário da batalha continua válida se houver terceira facção; trocas de tropas respeitam regiões dominadas e conversão de facção.
- Desempates e escolhas de destruição, transferência e acordos permanecem escolhas humanas. O protótipo não deve inventar resultados para regras pendentes.

## Experiência e direção visual

**Princípios propostos para validação:** o jogador deve saber quem age, em que fase está, quantas ações restam, o que pode fazer e por que uma opção é inválida. A interface deve priorizar a partida, revelando detalhes quando necessários.

- **Mesa:** mapa legível e navegável, regiões com identidade visual, domínio, tropas, recursos e construções; destacar origens e destinos possíveis sem depender apenas de cor. Permitir inspeção sem executar ação.
- **Mão de cartas:** cartas com hierarquia clara para nome, tipo, liderança, condição, custo e efeito; ampliar detalhes por clique ou toque e indicar jogabilidade e motivos de bloqueio. Manter alvos, consequências e confirmação compreensíveis antes do compromisso.
- **Turno e liderança:** área de estado com facção ativa, ações restantes, rodada, recursos e imposto; leilão com ofertas visíveis e sequência de oportunidades. Como há um único dispositivo, oferecer passagem de controle e ocultação voluntária de mãos; isso não garante sigilo contra acesso ao arquivo ou ao armazenamento.
- **Resolução:** painel contextual ou modal para escolhas, reações e acordos, com confirmação e explicação de custos. Exibir dados e efeitos passo a passo sem exigir que a pessoa faça cálculos manuais; manter histórico consultável.
- **Animação:** definir transições para compra e descarte, movimento, mudança de domínio, recursos, dados, dano e pontos. Eventos do motor conduzem a apresentação; não bloquear a aplicação lógica nem alterar resultados por duração ou interrupção. Prever pular animações e respeitar movimento reduzido.
- **Acessibilidade:** navegação por teclado, foco visível e restaurado, rótulos e mensagens de estado para tecnologias assistivas, contraste, tamanho de toque, texto legível e alternativas a cor, som e movimento. Verificar também orientações de tela, zoom e áreas pequenas.
- **Proteção contra erros:** escolhas válidas destacadas, mensagens específicas, ações destrutivas confirmadas quando necessário e revisão de consequências. Desfazer somente em situações em que regras e informação revelada o permitam; não prometer reversão irrestrita de dados ou cartas reveladas.

## Recursos visuais e áudio

Separar identidade lógica do endereço de imagem: um catálogo relaciona identificadores estáveis a retratos, fundos, arte de cartas, ícones, texturas, tabuleiro e sons opcionais. Começar com CSS, formas e textos locais; usar fallback acessível para recurso ausente. Especificar proporções, recorte, resolução, compressão, transparência, nomes e créditos antes de receber arquivos finais. Imagens decorativas não substituem informações textuais.

Carregar recursos sob demanda quando houver benefício; evitar dependências remotas necessárias à partida. Caso sons sejam adicionados depois, oferecer controle de volume e iniciar áudio apenas após interação. Não gerar ou adquirir imagens nesta etapa.

## Regras a resolver antes de declarar a automação completa

O motor deve distinguir regra definida, proposta em teste e pendência; marcar explicitamente qualquer hipótese já usada pelo protótipo. Investigar e apresentar opções para aprovação do usuário antes de fechar lacunas materiais, entre elas:

- vitória imediata aos 30 pontos e marco de 20 pontos estão definidos; o conteúdo e funcionamento dos futuros eventos de fim de jogo permanecem adiados;
- ataques a regiões somente com construções e dano excedente têm comportamento definido para teste; efeitos posteriores e retirada ainda podem exigir decisão;
- elegibilidade de outras reações defensivas e detalhes de alvos que se tornam inválidos;
- Remanejando Mortos já permite movimentos sucessivos entre regiões devastadas adjacentes; demais interações de cartas ainda podem exigir decisão;
- posição definitiva do extrator inicial e equilíbrio de mapa, facções, custos e liderança;
- reposição, limites de componentes físicos e situações sem opções legais, onde ainda não estiverem decididos.

Consultar os módulos responsáveis antes de abrir cada questão. Registrar decisões no módulo da regra e atualizar implementação e testes juntos. Enquanto não houver resposta, manter o comportamento já documentado como hipótese de teste quando aplicável e não apresentá-lo como regra aprovada. Caso uma lacuna impeça a partida, explicar a limitação e não escolher uma regra definitiva por conta própria.

## Etapas de implementação

### 1. Inventário e especificação executável

- Mapear cartas, habilidades, dados, fases, escolhas, estados e eventos do HTML atual para os módulos de regra; classificar cada item como definido, proposta, pendente ou adiado.
- Registrar pré-condições, custos, alterações, ordem e mensagens de erro; identificar acesso ao DOM dentro de regras e efeitos com cancelamento ou múltiplas escolhas.
- Construir cenários de referência e comparar resultados com o protótipo atual, distinguindo comportamento existente de correções aprovadas.

**Saída:** matriz de cobertura e lista de decisões pendentes, com fontes e cenários verificáveis.

### 2. Separação e migração do motor

- Criar estado, dados e contratos de comandos/eventos; extrair progressivamente domínio, recursos, baralhos, fases, liderança, combate e pontuação.
- Migrar uma família de efeitos por vez e substituir leituras de controles por escolhas explícitas; manter versão atual jogável durante o trabalho.
- Provar paridade para cenários definidos e identificar divergências, incluindo regras já documentadas mas não implementadas.

**Saída:** motor testável sem DOM e fluxo de partida equivalente nos cenários cobertos, sem mudança silenciosa de regras.

### 3. Fluxo automatizado de ponta a ponta

- Implementar escolhas pendentes, transações, reações, tratamento de estados inválidos e retomada segura; integrar as quatro facções.
- Verificar partida completa de preparação a encerramento, com leilão, combate, negociação, pontuação, falhas e opções obrigatórias.
- Desativar ferramentas de edição manual no fluxo normal; mantê-las somente como depuração claramente identificada, se necessárias.

**Saída:** partida local completa sem edição manual de tropas ou recursos, salvo decisões próprias dos jogadores.

### 4. Interface, componentes e feedback

- Definir direção visual e tokens de tipografia, cor, espaçamento, tamanhos e estados; criar mesa, cartas, painel de turno, escolha contextual e histórico.
- Integrar o motor por comandos e eventos; implementar estados de carregamento, erro e ação indisponível, com responsividade e acessibilidade desde o início.
- Adicionar animações progressivamente, com alternativa reduzida e sem afetar a resolução.

**Saída:** interface utilizável em computador e celular, testada com teclado e movimento reduzido.

### 5. Artes substituíveis e acabamento

- Criar catálogo e placeholders; testar substituição de exemplos por arquivos locais sem alteração do motor, com fallback em caso de ausência.
- Ajustar hierarquia visual, clareza de cartas, feedback de combate, resumo da rodada e desempenho com diferentes tamanhos de tela.

**Saída:** identidade consistente e caminho documentado para incorporar arte final posteriormente.

### 6. Distribuição e validação final

- Preparar saída estática com caminhos relativos, atualização de cache e instalação opcional; gerar distribuição local autossuficiente e conferir que não exige servidor nem rede.
- Automatizar verificações em CI, testar hospedagem em subdiretório e atualização do service worker. Não publicar automaticamente como parte deste planejamento.
- Validar partidas completas e usabilidade com jogadores; registrar pendências de equilíbrio e corrigir divergências aprovadas.

**Saída:** versão candidata à validação do usuário, com instruções de uso, limitações e critérios abaixo atendidos.

## Estratégia de testes e critérios de aceite

- **Motor:** testes independentes do navegador para legalidade, transições, custos, regras por carta, combate, pontuação e casos de risco. Cobrir tanto sucesso quanto falha sem mutação parcial, e usar aleatoriedade controlada.
- **Integração:** jogos simulados com escolhas reais, reações, trocas e múltiplas rodadas; testes de persistência e recuperação em cada fase crítica. Comparar referências do protótipo antes de substituí-lo.
- **Interface:** testes em navegador para teclado, foco, seletores, cartas, escolhas e viewport móvel/desktop; verificar mensagens, acessibilidade, movimento reduzido e alternativas sem imagem.
- **Distribuição:** testar build, abertura do artefato local, site em caminho relativo e instalação/offline após carregamento, inclusive atualização de cache. CDN indisponível não deve bloquear o jogo.
- **Regras e documentação:** comparar baralhos, liderança, mapa e configurações com seus módulos; rodar `node testes/validar-documentacao.cjs` e a suíte pertinente, adaptando-os à nova arquitetura sem perder os cenários relevantes.
- **Aceite funcional:** quatro pessoas podem concluir e reiniciar uma partida local, sem edição manual de estado, com histórico inteligível; todas as escolhas dependentes de jogadores são respeitadas e falhas não corrompem a partida.
- **Aceite de produto:** usuário valida o fluxo e a apresentação em telas representativas; pendências de regras, equilíbrio, testes visuais e compatibilidade são registradas de forma explícita. A conclusão técnica não equivale à aprovação definitiva do design.

## Entrega e ordem de trabalho

Começar pelo inventário e pelos cenários de referência; em seguida, separar o motor antes de substituir a interface. Entregar incrementos jogáveis e verificáveis ao final de cada etapa, mantendo o protótipo existente disponível até a nova versão atingir paridade. Resolver dúvidas de regras quando elas bloquearem a etapa correspondente e continuar o trabalho independente em paralelo. Não iniciar desenvolvimento de IA ou conteúdo final de arte como parte deste plano.
