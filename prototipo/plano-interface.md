# Plano de interface — mesa de Câlepoo

**Estado: conceito visual para validação.** A [demonstração navegável](mesa-conceito.html) apresenta exemplos das telas solicitadas; seus placares, mãos e resultados são ilustrativos. Ela não executa uma partida nem substitui o [protótipo jogável](../mapa-fluxo-dinamico.html). As decisões de regras continuam nos respectivos módulos e o [plano de evolução](plano-evolucao-jogo.md) orienta a implementação do motor.

## Direção artística desejada

**Intenção do usuário; referência para o desenvolvimento, ainda não arte final.** A identidade deve ser rústica, fantástica, divertida e aventureira, com clima leve. A arte imaginada é mais abstrata e pintada em aquarela, combinando formas geométricas e linhas esporádicas. Texturas de papel, pigmentos suaves e contornos artesanais podem orientar os placeholders, sem exigir que o conceito reproduza integralmente a arte final nesta etapa. A composição da mesa foi bem recebida. Uma tentativa de paleta quente foi rejeitada; o HUD deve mudar de cor conforme a facção ativa, preservando a paleta-base da mesa. A direção de acabamento permanece aberta para evolução.

Não foram geradas imagens: a demonstração usa cores, gradientes e formas locais. A identidade final, sua aplicação e a legibilidade em diferentes telas permanecem para validação.

## Direção da mesa

A mesa ocupa a área disponível e pode entrar em tela cheia quando o navegador permitir. O mapa é o elemento principal e, no desktop, deve caber por inteiro sem rolagem interna; em telas pequenas, a rolagem preserva a legibilidade. Cada unidade aparece como um meeple tradicional na cor da facção; as conexões representam apenas as ligações aprovadas, sem ligações diretas R3–R7, R9–R11, R7–R9, R1–R9 ou R6–R8 e com ligação R7–R11; construções usam tokens maiores na mesma cor e os recursos fixos usam ícones menores coloridos. À direita ficam as facções, pontuação e informações essenciais; a facção ativa recebe cartão maior, cor e recursos destacados. A mão permanece visível na parte inferior, sobre o mapa e com fundo transparente. Um botão na lateral abre informações e regras da facção atual, incluindo imposto e árvore de tecnologias para o Império. Em telas estreitas, os indicadores passam para uma faixa horizontal e a mão permite rolagem lateral.

No uso normal o HUD se mantém discreto. As ações abrem orientações contextuais: somente depois de uma escolha aparece o que é necessário decidir, seu custo e a consequência. Sempre que possível, o jogador seleciona regiões, cartas, facções e quantidades com elementos do próprio jogo. Botões de confirmação continuam previstos quando a decisão tiver custos ou consequências; a interface não exige campos de texto para fazer jogadas usuais.

A faixa de facções fica acima do mapa e permite consultar os dados de qualquer uma pelo respectivo símbolo. Logo abaixo, o indicador mostra a rodada e a sequência Preparação, Liderança, Ações e Pontuação; o alistamento integra a preparação. Em tela cheia, o cabeçalho e seus controles ficam ocultos; a tecla Esc retorna ao modo normal. Preparação e liderança são apresentadas sobre o mapa; o alistamento conserva a seleção direta de região.

## Exemplos de tela

A barra **Ver tela**, exclusiva da demonstração, permite acessar diretamente cada exemplo:

1. **Mesa:** mapa de 11 regiões, painel de facções e mão. Todas as conexões permanecem visíveis; ao selecionar uma região, suas ligações e seus vizinhos diretos são destacados e listados. As curvas procuram contornar outras regiões e minimizar cruzamentos; a lista esclarece a adjacência mesmo quando o espaço não permite evitar todos os cruzamentos. Selecionar uma facção troca a cor do destaque e a mão; selecionar uma carta ilustra a interação direta.
2. **Início:** escolha do primeiro jogador, seguida da preparação. As quatro facções são controladas manualmente.
3. **Liderança:** orientação para selecionar cartas e acompanhar o maior lance. O leilão real respeitará os valores, a ordem e os destinos das cartas documentados.
4. **Ação:** detalhe da carta, condição, região escolhida e entrada para seleção no mapa. Uma confirmação real só será habilitada quando o motor validar a escolha.
5. **Reação:** janela antes dos dados para decisões de defesa e Canção de paz, sem ocultar que uma reação consome ação.
6. **Dados:** apresentação dos símbolos e opção de repetir a animação ilustrativa. Na implementação jogável, o resultado virá do motor e a apresentação nunca o alterará.
7. **Pontuação:** resumo por facção e origem dos pontos antes de avançar.
8. **Fim:** exemplo de classificação e opções de retorno; duração e empate definitivos permanecem conforme o estado das regras.

A preparação obrigatória, acordos, seleção de tropas e escolhas de construção também precisarão de painéis contextuais próprios na implementação. A demonstração não pretende representar todas as combinações ou aprovar regras pendentes.

## Componentes e interações futuras

- **Mapa:** posições e conexões vindas dos dados do jogo; seleção por clique, toque e teclado; destaques distintos para origem, destino, região inválida e inspeção. Mostrar tropas, recursos e construções sem depender só de cor.
- **HUD das facções:** dados do estado real, com resumo público para todos e cartão ampliado apenas para a facção ativa. Cor combinada com nome, símbolo e texto. Em aparelho compartilhado, prever passagem de controle e ocultação voluntária da mão.
- **Mão:** cartas geradas por dados e identificadores estáveis, com nome, tipo, liderança, condição, custo e efeito; seleção não consome uma ação. Explicar por que uma carta ou região está indisponível.
- **Camada contextual:** representar cada escolha pedida pelo motor, com foco controlado, retorno de foco, opção de cancelar apenas quando permitido e informações de consequências. Não deixar um diálogo impedir indefinidamente uma escolha que precisa ser feita no mapa.
- **Dados e animação:** receber eventos e resultados já calculados do motor, animar rolagem, movimento e pontuação, permitir aceleração e respeitar movimento reduzido. Resultados não podem mudar em redesenho ou ao reproduzir a animação.
- **Acessibilidade e telas pequenas:** testar leitores de tela, foco preso em diálogos quando aplicável, teclado, contraste, zoom, alvos de toque e orientação retrato/paisagem. A disposição responsiva do conceito precisa ser verificada em dispositivos reais.
- **Tela cheia:** o botão usa a API do navegador; a saída ocorre pelo mecanismo do navegador, como Esc no desktop. Não pressupor suporte em todos os navegadores ou em abertura local.

## Artes finais e separação técnica

Os ícones provisórios de meeple, construção e recurso são reunidos no catálogo `pieceIcons`. O conceito mantém também um pequeno catálogo `art` no próprio HTML: `art.cards` e `art.regions` aceitam caminhos de imagens locais por nome de carta ou ID de região. Valores ausentes usam as formas e cores atuais, preservando texto e controles. Isso permite experimentar a troca visual sem depender de imagens externas.

Na implementação definitiva, migrar esse catálogo para arquivos de dados com IDs estáveis, independentes dos textos traduzíveis e da lógica. Definir formatos, proporções, recortes, densidades, fallback, licenças e versões para mapa, regiões, cartas, retratos, ícones e efeitos. O motor deve emitir estado e eventos; a camada visual decide como representá-los, conforme o [contrato proposto](plano-evolucao-jogo.md).

## Critérios para validação

- Mapa continua sendo a área dominante, com mão acessível e facção ativa facilmente identificável.
- Ações começam por seleção direta e são acompanhadas de orientação no momento necessário.
- Dados exibem símbolos, resultados e explicação coerentes com o motor.
- Tela cheia, interface responsiva e movimento reduzido não bloqueiam ações nem escondem informação importante.
- A substituição de arte não altera mecânicas e falhas de carregamento mantêm a mesa utilizável.
- Verificar visualmente e em navegador real: o conceito foi produzido com recursos locais e seus exemplos não substituem testes de interface ou partidas.
