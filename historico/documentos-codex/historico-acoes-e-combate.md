# Conflict Island — Histórico de decisões sobre ações e combate

## Direção atual para teste

- Cada jogador aloca dois marcadores em regiões. A carta de ação é escolhida quando chega sua vez, respeitando a região marcada e o estado atual do tabuleiro.
- Um líder começa e os demais jogadores seguem em ordem. A forma de escolher o líder e a passagem da liderança ainda estão em discussão.
- Ao ser atacado, um jogador pode jogar uma carta de defesa como reação, consumindo um marcador seu ainda não utilizado. Pode retirar qualquer um desses marcadores, mesmo que esteja longe da região atacada; perde a ação correspondente. Sem marcador disponível, essa reação não está disponível.
- As cartas de defesa precisarão receber indicação adequada. A adaptação das cartas existentes aguarda planejamento e aprovação.

## Ideias em discussão: liderança

Uma proposta anterior, retomada na conversa, usa pontos de liderança em cartas: jogadores revelam cartas para disputar a liderança, e o líder abre mão das cartas comprometidas, ficando com menos opções na mão. A disputa ocorre por leilão: um novo lance precisa superar o lance anterior, evitando empate entre lances. Os demais detalhes do procedimento, o descarte ou outro destino das cartas e o tratamento das ofertas dos demais jogadores permanecem abertos.

## Histórico: resolução simultânea (não é a direção atual)

- Se tropas deixam uma região antes de um ataque ser resolvido, cancelar o movimento desperdiça a carta atacante e pode tornar a evasão uma defesa forte demais. Alternativa considerada: o movimento continua até a região, mas não ocorre batalha nem recompensa dependente dela se estiver vazia.
- Escolher a quantidade, origem ou destino após revelar ações pode favorecer quem decide depois. Fixar quantidades nas cartas resolve apenas a quantidade, não a escolha de origem e destino. Invasão Costeira e a troca entre regiões de Remanejando Mortos exemplificam o problema.
- Registrar escolhas secretas por escrito foi considerado; o usuário prefere evitar escrita. Marcadores de origem e destino podem aumentar componentes, revelar que a ação envolve movimento e enfraquecer o blefe entre ataque e efeito. Usar dois marcadores para todas as ações, incluindo um marcador de blefe, foi considerado, mas não agradou como solução.
- Outras possibilidades levantadas, ainda sem solução completa: interceptar tropas antes da saída ou resolver encontros entre movimentos opostos. Ambas exigem definir conflitos e interações adicionais.

## Histórico: ordem de resolução

- Ações sequenciais facilitam a escolha de destino com o tabuleiro atualizado, mas um jogador pode sofrer ataques antes de poder agir. Inverter a ordem entre duas fases distribui a prioridade, mas não garante reação antes de cada ataque, inclusive para jogadores intermediários.
- A reação defensiva que consome um marcador ainda disponível foi escolhida como direção de teste para tratar essa preocupação. Ainda é necessário avaliar o efeito da ordem e os casos em que o jogador já não possui marcador.

## Pontos ainda abertos

- Procedimento completo de liderança e frequência de sua escolha.
- Ordem de alocação de marcadores e se sua localização é pública; detalhes de resolução das duas ações e de marcadores consumidos por reação.
- Cartas elegíveis como defesa, momento de reação, limites por batalha e como adaptar seus textos.
- Tratamento de ações cujo alvo deixa de ser válido, inclusive chegada a uma região vazia, e tratamento das cartas com múltiplas regiões.
- Conciliação com limite fixo de unidades por carta: foi considerado para o modelo simultâneo, mas não está confirmado como regra do modelo sequencial.


## Referência das versões e decisão posterior

- O GDD v2.4 registrava resolução paralela e leilão de liderança como descartado para aquele protótipo. A conversa posterior retomou ações em ordem e a possibilidade do leilão; a direção em teste mudou.
- A referência antiga a 30 cartas dos Piratas foi substituída pelo padrão de 22 cartas por baralho, confirmado pelo usuário. Os documentos de facção locais registram 22 cartas cada.
- Histórico do GDD v2.4: v2.4 registrou eventos por marcos de pontuação como ideia futura; v2.3 registrou a hipótese de tensão pacífica pela madeira; v2.2 separou o GDD dos documentos de facção e registrou metas de pontuação. O GDD v2.4 cita o arquivo v2.1 como histórico anterior, ainda não disponível nesta sessão.
