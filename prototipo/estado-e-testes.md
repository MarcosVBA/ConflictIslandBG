# Estado do protótipo e validações

## Escopo e uso

O [protótipo principal](../mapa-fluxo-dinamico.html) é um único HTML local para quatro facções e 11 regiões, controladas manualmente, sem IA ou servidor. O usuário validou o fluxo sem alocação prévia como sistema padrão. Isso não implica aprovação definitiva do equilíbrio, das propostas de facção ou de todas as interações.

Os marcadores de ação ficam em reserva; a região é escolhida ao preparar a carta. A preparação inclui compra, habilidades e leilão de liderança; as ações começam pelo líder e seguem em sentido anti-horário. As regras completas estão em [Regras gerais](../regras/regras-gerais.md). O [sistema anterior e os HTMLs legados](../historico/prototipos/alocacao-de-marcadores.md) estão arquivados e não serão atualizados.

A partida não é salva ao fechar ou recarregar. O cenário inicial é o de [Mapa](../regras/mapa.md); o extrator inicial é provisório e ajustável. Restaurar o cenário reinicia também rodada, placar, cartas e impostos. A [IA para facções](../ideias/ia-para-faccoes.md) permanece adiada.

## Implementação e adaptações

O baralho do [Necromante](../faccoes/necromante.md) tem 20 cartas; Monumento a Morte custa 1 Madeira e Despertar para a Morte é uma magia. A Magia da Torre e o Alistamento Obrigatório estão implementados. O imposto imperial ativo e o atraso aparecem durante a vez do Império; a mão usa cinco cartas por padrão e pode ser ajustada. Custos, propostas e demais efeitos constam nos módulos de cada facção.

Os [Elfos](../faccoes/elfos.md) começam em duas florestas, sem recursos; Canção de paz pode cancelar um combate mesmo com terceiros, e as trocas de tropas convertem unidades para a facção recebedora em regiões por ela dominadas. No mapa, R9 e R11 são costeiras e têm Ouro; R7 é montanha sem costa ou recurso.

A interface mostra tropas, domínio, recursos, construções e ações com símbolos e rótulos. Em movimentos compatíveis, o mapa destaca e permite escolher origens ou destinos; quantidades e confirmação continuam no painel. Uma região inválida pode ser inspecionada sem alterar a escolha. O estado e as hipóteses de pontuação estão em [Pontuação](../regras/pontuacao.md).

A distribuição do site é preparada a partir do HTML principal. A cópia publicada adiciona instalação e cache opcionais; o HTML de origem continua independente. A partida permanece em memória mesmo na versão instalada.

## Limitações

- Combates exigem tropas defensoras; Invasão Costeira permite movimento sem saque para costa sem inimigos. Ataque a região apenas com construções ainda depende de definição.
- A conciliação de dano excedente está em [Combate](../regras/combate.md). As demais cartas defensivas continuam pendentes; Guarda Imperial é uma adaptação de teste.
- Ajustes manuais de depuração podem criar estados intermediários e não simulam automaticamente a perda da Torre.
- Não há salvamento, semente reproduzível, exportação de relatório ou métricas automáticas de equilíbrio.
- Os testes usam DOM substituto e dados controlados; não comprovam acessibilidade real, instalação em dispositivos ou todas as combinações. O fluxo foi validado pelo usuário; o equilíbrio e outras interações continuam sujeitos a partidas e revisão.

## Verificações

Execute `node testes/validar-documentacao.cjs`, `node testes/validar-lideranca.cjs`, `node testes/validar-fluxo-dinamico.cjs`, `node testes/validar-elfos.cjs`, `node testes/validar-necromante.cjs`, `node testes/validar-novas-habilidades.cjs` e `node testes/validar-publicacao.cjs`. Eles verificam dados documentados, regras centrais, leilão, reserva de ações, cenários de combate, seis rodadas simuladas e a preparação da versão publicável. Os testes não interpretam toda a prosa nem substituem verificações específicas de cada alteração.

O [conceito de mesa e telas](mesa-conceito.html) é uma demonstração separada, com dados ilustrativos, descrita no [plano de interface](plano-interface.md). `node testes/validar-mesa-conceito.cjs` verifica os componentes e exemplos com DOM substituto. O acesso automatizado a navegador não estava disponível nesta execução; tela cheia, aparência, foco e responsividade ainda precisam ser conferidos visualmente em navegadores e dispositivos reais.

## Separação inicial do motor

Domínio, contagem de construções, devastação, vizinhança, operações de recursos, compra, escolha da próxima facção, validação de lances, próximo ofertante e cálculo de dano foram extraídos para `jogo/motor/base.js`, independentes do DOM e usados pelo HTML jogável. `node scripts/sincronizar-motor.cjs` incorpora o módulo ao HTML local; `node scripts/sincronizar-motor.cjs --verificar` detecta divergências. O estado, cartas, transições completas de rodada, combate e apresentação ainda estão acoplados e precisam ser migrados. A mesa conceitual ainda não está ligada ao motor. Os testes `node testes/validar-motor-base.cjs` e a suíte existente verificam a extração; não comprovam todas as interações nem substituem teste visual.

O [inventário inicial](inventario-motor.md) relaciona responsabilidades, cobertura e trabalho restante.

## Decisões recentes e limitações

O protótipo encerra a partida aos 30 pontos e registra o marco de 20 pontos; as cartas de evento ainda não foram definidas. Ataques aceitam construções sem tropas, sem dados de defesa nesse caso. Remanejando Mortos permite movimentos sucessivos entre regiões devastadas adjacentes, com regiões inicialmente devastadas permanecendo elegíveis até o fim do efeito. Tecnologias concedem bônus enquanto existirem e impostos são reembaralhados. O pagamento permanece limitado a uma vez por rodada, conforme confirmado. O protótipo mantém dois contadores virtuais de ação e ainda exibe referências a marcadores; a reformulação completa da interface para apresentar apenas ações ainda permanece pendente. A disponibilidade de peças físicas não é simulada por um estoque digital.
