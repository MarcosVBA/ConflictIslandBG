# IA para controlar facções

**Direção apreciada pelo usuário; conteúdo adiado e não implementado.** A ideia é permitir, futuramente, que cada facção seja controlada por uma pessoa ou por uma IA. Isso abriria espaço para uma pessoa jogar contra outras facções automatizadas, acompanhar uma partida entre IAs ou misturar participantes humanos e automatizados. A implementação não faz parte do trabalho atual.

## Direção para uma primeira versão

Começar com uma IA baseada em regras e prioridades específicas de cada facção, sem depender de um modelo de linguagem ou de uma conexão de rede. A direção preserva o objetivo de um protótipo local em um único HTML. Uma primeira versão poderia ser previsível e não precisa ser competitiva desde o início.

Exemplos de prioridades a explorar, não regras aprovadas: Piratas buscarem costas e saques; Necromante expandir regiões devastadas; Império considerar recursos, construções e impostos; Elfos valorizarem florestas e trocas. Essas prioridades precisariam ser avaliadas em partidas, levando em conta riscos, oportunidades de pontuação e condições das cartas.

## Etapas futuras

1. Separar melhor a lógica do jogo dos controles de interface, oferecendo uma forma comum de verificar e executar ações para pessoas e IA.
2. Criar uma primeira IA para cada facção, capaz de participar do leilão, alocar marcadores, usar cartas e concluir a partida respeitando as regras.
3. Acrescentar decisões sobre combate, reações, ofertas e negociação, incluindo intervenções como Defesa Global, e melhorar as escolhas com base em partidas de teste.

A IA deve utilizar apenas as informações que sua facção poderia conhecer, sem consultar indevidamente as mãos dos adversários. Os testes devem verificar legalidade das ações, avanço e conclusão da partida, escolhas de reações e situações sem ações válidas; partidas observadas serão necessárias para avaliar qualidade e equilíbrio.

**Pendências para quando o trabalho for retomado:** detalhar as informações disponíveis em cada fase, como negociar com jogadores humanos ou outras IAs, o grau de explicação das decisões, níveis de dificuldade e quais regras ainda provisórias precisam ser resolvidas. Nenhuma dessas escolhas ou prioridades foi implementada.
