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
