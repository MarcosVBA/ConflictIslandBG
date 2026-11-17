# Estado do protótipo e validações

## Escopo e uso

O [protótipo principal](../mapa-fluxo-dinamico.html) é um único HTML local para quatro facções e 11 regiões, controladas manualmente, sem IA ou servidor. O usuário validou o fluxo sem alocação prévia como sistema padrão. Isso não implica aprovação definitiva do equilíbrio, das propostas de facção ou de todas as interações.

Os marcadores de ação ficam em reserva; a região é escolhida ao preparar a carta. A preparação inclui compra, habilidades e leilão de liderança; as ações começam pelo líder e seguem em sentido anti-horário. As regras completas estão em [Regras gerais](../regras/regras-gerais.md). O [sistema anterior e os HTMLs legados](../historico/prototipos/alocacao-de-marcadores.md) estão arquivados e não serão atualizados.

A partida não é salva ao fechar ou recarregar. O cenário inicial é o de [Mapa](../regras/mapa.md); o extrator inicial é provisório e ajustável. Restaurar o cenário reinicia também rodada, placar, cartas e impostos. A [IA para facções](../ideias/ia-para-faccoes.md) permanece adiada.

## Implementação e adaptações

O baralho do [Necromante](../faccoes/necromante.md) tem 20 cartas; Monumento a Morte custa 1 Madeira e Despertar para a Morte é uma magia. A Magia da Torre e o Alistamento Obrigatório estão implementados. O imposto imperial ativo e o atraso aparecem durante a vez do Império; a mão usa cinco cartas por padrão e pode ser ajustada. Custos, propostas e demais efeitos constam nos módulos de cada facção.

Os [Elfos](../faccoes/elfos.md) começam em duas florestas, sem recursos; Canção de paz pode cancelar um combate mesmo com terceiros, e as trocas de tropas convertem unidades para a facção recebedora em regiões por ela dominadas. No mapa, R9 e R11 são costeiras e têm Ouro; R7 é montanha sem costa ou recurso.

A mesa jogável mostra o mapa, o placar lateral, a mão inferior e um resumo que muda conforme a facção, incluindo o imposto e as tecnologias do Império. As unidades usam meeples e as construções usam peças coloridas. As conexões ficam visíveis e as da região selecionada recebem destaque; as curvas tentam evitar regiões e cruzamentos. Em movimentos compatíveis, o mapa destaca e permite escolher origens ou destinos; quantidades e confirmação continuam no painel. Uma região inválida pode ser inspecionada sem alterar a escolha. O protótipo oferece tela cheia quando o navegador permite. Os arquivos opcionais de arte são configurados em `jogo/apresentacao/artes.js`. O estado e as hipóteses de pontuação estão em [Pontuação](../regras/pontuacao.md).

Após a rejeição da versão anterior da mesa jogável, o layout desktop foi ampliado para ocupar a janela, mostrar o mapa inteiro sem rolagem interna e recolher as ferramentas de teste. O painel lateral ainda rola quando suas opções excedem a altura disponível. A nova disposição e a aproximação ao conceito continuam aguardando validação visual do usuário.

As informações da região selecionada podem ser abertas em uma camada translúcida sobre o mapa, inicialmente oculta. Ela não captura cliques destinados às regiões. As conexões permanecem sempre visíveis, sem botão para exibi-las; as ligadas à seleção recebem destaque. Os cartões usam meeples e tokens maiores nas cores das facções e ícones fixos para os recursos, preservando descrições acessíveis.

Após a escolha do alvo, as decisões e os dados de combate aparecem em uma janela modal que não permite cancelar o combate declarado. A carta Novas Comandante a Bordo também usa uma janela cancelável antes da confirmação; escolhas que precisam do mapa permanecem no painel. Os resumos de pontuação, hipóteses, baralhos e registro ficam em Ferramentas. Outras ações independentes do mapa ainda podem precisar da mesma adaptação.

A distribuição do site é preparada a partir do HTML principal. A cópia publicada adiciona instalação e cache opcionais; o HTML de origem continua independente. A partida permanece em memória mesmo na versão instalada.

## Limitações

- Invasão Costeira permite movimento sem saque para costa sem inimigos. Ataques também podem atingir construções sem tropas defensoras, conforme [Combate](../regras/combate.md).
- A conciliação de dano excedente está em [Combate](../regras/combate.md). As demais cartas defensivas continuam pendentes; Guarda Imperial é uma adaptação de teste.
- A declaração do ataque, a defesa e Canção de paz são apresentadas em etapas sucessivas e gastam a carta e a ação na confirmação. Validação, transições, disponibilidade e consumo das reações, rolagem, baixas, saque e cálculo dos efeitos posteriores estão no motor; a apresentação e a orquestração continuam na aplicação.
- Ajustes manuais de depuração podem criar estados intermediários e não simulam automaticamente a perda da Torre.
- Não há salvamento, semente reproduzível, exportação de relatório ou métricas automáticas de equilíbrio.
- Os testes incluem DOM substituto e Chromium automatizado com dados controlados; não comprovam acessibilidade completa, instalação em dispositivos físicos ou todas as combinações. O fluxo foi validado pelo usuário; o equilíbrio e outras interações continuam sujeitos a partidas e revisão.

## Verificações

Execute `node testes/validar-documentacao.cjs`, `node testes/validar-lideranca.cjs`, `node testes/validar-fluxo-dinamico.cjs`, `node testes/validar-elfos.cjs`, `node testes/validar-necromante.cjs`, `node testes/validar-novas-habilidades.cjs` e `node testes/validar-publicacao.cjs`. Eles verificam dados documentados, regras centrais, leilão, reserva de ações, cenários de combate, seis rodadas simuladas e a preparação da versão publicável. Os testes não interpretam toda a prosa nem substituem verificações específicas de cada alteração.

O [conceito de mesa e telas](mesa-conceito.html) é uma demonstração separada, com dados ilustrativos, descrita no [plano de interface](plano-interface.md). `node testes/validar-mesa-conceito.cjs` verifica seus componentes com DOM substituto. A suíte `npm run test:navegador` abre o HTML principal via `file://` em Chromium, testa interações em desktop e celular e registra capturas; instruções e limites estão no [README](../README.md). As imagens ainda não constituem referências visuais aprovadas, e a comparação com o conceito e a validação em dispositivos físicos continuam pendentes.

## Separação inicial do motor

Domínio, recursos, pontuação, preparação, leilão, vários efeitos de cartas e cálculos de combate foram extraídos para `jogo/motor/base.js`, independentes do DOM e usados pelo HTML jogável. `node scripts/sincronizar-motor.cjs` incorpora o módulo, os dados e a apresentação ao HTML local; `node scripts/sincronizar-motor.cjs --verificar` detecta divergências. A aplicação ainda coordena o estado, várias escolhas, as transições completas da rodada e o combate; a separação não está concluída. A mesa conceitual original continua separada; sua composição foi parcialmente trazida para o protótipo jogável. Os testes `node testes/validar-motor-base.cjs` e a suíte existente verificam a extração; não comprovam todas as interações nem substituem teste visual.

O [inventário inicial](inventario-motor.md) relaciona responsabilidades, cobertura e trabalho restante.

`node testes/validar-partida.cjs` percorre uma rodada com ações das quatro facções, pontuação e abertura da rodada seguinte; também simula uma partida até 30 pontos passando todas as ações e verifica o reinício. É uma simulação com DOM substituto e não representa todas as cartas nem uma partida disputada por pessoas.

## Decisões recentes e limitações

O protótipo encerra a partida aos 30 pontos e registra o marco de 20 pontos; as cartas de evento ainda não foram definidas. Ataques aceitam construções sem tropas, sem dados de defesa nesse caso. Remanejando Mortos permite movimentos sucessivos entre regiões devastadas adjacentes, com regiões inicialmente devastadas permanecendo elegíveis até o fim do efeito. Tecnologias concedem bônus enquanto existirem e impostos são reembaralhados, inclusive ao substituir pelo Salão Imperial com o monte vazio. O pagamento permanece limitado a uma vez por rodada, conforme confirmado. A interface apresenta ações disponíveis; internamente ainda usa dois registros virtuais por facção, que serão substituídos na migração do motor. A disponibilidade de peças físicas não é simulada por um estoque digital.

Os movimentos de Remanejando Mortos são preparados em uma cópia do mapa e só alteram o estado da partida ao concluir a carta. Se o jogador cancelar ou escolher outra carta, os movimentos preparados são descartados.
