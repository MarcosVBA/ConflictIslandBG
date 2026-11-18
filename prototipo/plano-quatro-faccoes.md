# Plano do protótipo para quatro facções

**Implementado e validado pelo usuário para continuar o desenvolvimento.** O [protótipo principal](../mapa-fluxo-dinamico.html) é um único HTML local, com Império, Necromante, Piratas e Elfos controlados manualmente, sem IA, em um mapa de 11 regiões. O usuário aprovou o fluxo sem alocação prévia; os protótipos anteriores estão no [histórico](../historico/prototipos/alocacao-de-marcadores.md). A validação do fluxo não aprova automaticamente o equilíbrio de todas as regras.

## Base de design

- O [mapa](../regras/mapa.md) registra o cenário implementado com as nove regiões anteriores, uma nova floresta e uma nova costa; as ligações R5–R8 e R9–R2 foram removidas, e R2–R6 foi substituída por R2–R10. Os Elfos começam com duas unidades em R6 e duas em R10, sem recursos. A disposição e o equilíbrio aguardam validação.
- Preservar as regras existentes e o conteúdo élfico registrado em seus módulos. O protótipo principal incorpora para teste o [Império](../faccoes/imperio.md) com duas cartas de Alistamento e a habilidade de alistamento obrigatório. Propostas não se tornam regras finais por estarem implementadas.
- As definições recebidas para os [Elfos](../faccoes/elfos.md), comércio, tropas como recurso, coleta, reações e condições iniciais estão registradas no módulo.
- A coexistência de quatro facções não altera, por si, a regra de dois combatentes. Canção de paz pode cancelar qualquer combate antes dos dados, inclusive como intervenção de um terceiro; seus custos e consequências estão definidos nos módulos de [Elfos](../faccoes/elfos.md) e [Combate](../regras/combate.md), implementados no protótipo principal.

## Etapas de execução e validação

As etapas de construção abaixo foram executadas para teste. Permanecem a avaliação de equilíbrio e a verificação de combinações de regras; os testes simulados e suas limitações estão em [Estado e testes](estado-e-testes.md).

1. Validar a proposta de mapa e registrar as decisões sobre R10 e R11, suas conexões, a localização das duas florestas élficas e os recursos iniciais. Comparar acesso a recursos, distâncias e pontos de estrangulamento.
2. Definir as pendências operacionais das cartas e habilidades élficas e seu estado de aprovação; revisar efeitos sobre as outras facções, ações, marcadores e pontuação.
3. Criar o novo HTML local a partir do atual, preservando o cenário anterior. Adaptar dados de regiões, interface e visualização do mapa, cores e marcadores; incluir a quarta facção no estado inicial, baralho, mão, turnos, placar, acordos, combate, fim e reinício. Reavaliar espaço e legibilidade em telas pequenas.
4. Implementar as regras decididas para os Elfos e sincronizar os demais ajustes autorizados. Atualizar os módulos responsáveis e registrar diferenças de implementação neste diretório.
5. Acrescentar validações de topologia, contagem e conteúdo do baralho, estado inicial, pontuação e efeitos de cada família de cartas, trocas e tropas, reações, escolha de oponente, ciclo de quatro facções e reinício. Conferir que o cenário anterior continua funcionando.
6. Testar visualmente e jogar cenários completos, inclusive casos sem acordo, combate com terceiro presente, disponibilidade de recursos e empates de domínio. Registrar por facção os pontos por rodada e sua origem, acesso a florestas e Ouro, duração e dificuldades de interface; os testes automáticos não provam equilíbrio.

## Critérios para validação pelo usuário

O novo arquivo abre localmente e permite concluir e reiniciar uma partida manual com quatro facções e 11 regiões; regras pendentes usadas no teste estão explicitadas; mapa, documentação e código concordam; verificações automáticas passam e limitações de partidas e apresentação são registradas. A preparação do site usa o protótipo principal; instalação e cache precisam de validação em dispositivos reais.
