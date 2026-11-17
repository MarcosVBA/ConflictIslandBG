# Conflict Island — Proposta de atualização para revisão

Esta é uma proposta baseada no GDD v2.4 e na conversa posterior. Ela não altera as regras existentes. A aplicação aos documentos definitivos e aos baralhos depende de aprovação das mudanças específicas.

## Organização proposta

- O GDD resume as regras comuns e referencia os documentos detalhados.
- `registro-de-combate.md` permanece como detalhamento dos dados e da resolução de uma rodada; o GDD referenciará esse arquivo.
- Criar um arquivo separado para o baralho dos Piratas e outro para o do Necromante, a partir do `registro-das-faccoes.md`. O GDD citará os dois arquivos. Preservar as versões e identificar que o GDD v2.4 menciona um baralho dos Piratas de 30 cartas de teste, enquanto o registro local contém 22: não presumir que sejam a mesma versão nem substituir um pelo outro.
- Manter decisões e alternativas anteriores no `historico-acoes-e-combate.md`, fora do GDD. Retirar do GDD o histórico da liderança e demais histórico de decisões, preservando-o em arquivo histórico; a mecânica de liderança não será descrita no GDD conforme solicitado. Não alterar os arquivos em `sources/`.

## Texto proposto para o GDD: ações e defesa

**Direção para teste:** cada jogador aloca até dois marcadores em regiões. As ações são resolvidas em ordem. Quando chega sua vez, o jogador escolhe uma carta compatível com a região de um marcador ainda disponível e resolve seu efeito segundo o estado do tabuleiro. A ordem exata de alocação e resolução permanece a definir.

**Reação defensiva proposta:** ao ser atacado, um jogador pode usar uma carta que permita defesa como reação e consumir um de seus marcadores ainda não utilizados, mesmo que esteja em outra região. O marcador consumido não gera outra ação. Sem marcador disponível, essa reação não pode ser utilizada. O momento preciso da reação e o número de reações por batalha ainda precisam de decisão.

**Pontuação:** preservar a fase após a resolução, conforme o GDD v2.4. Os demais elementos globais não relacionados a esta revisão permanecem como estão.

## Texto proposto para o GDD: combate

Cada unidade atacante presente no início de uma rodada de combate gera um dado de ataque; cada defensor que exceda o número de atacantes gera um dado de defesa. Espadas causam dano aos defensores e cruzes aos atacantes; as baixas são simultâneas e os danos seguem os limites descritos no [registro de combate](registro-de-combate.md). O registro detalha as faces e a resolução de uma rodada. A duração ou o encerramento de uma batalha ainda precisa ser definido.

## Revisão proposta das cartas

O registro local contém dois baralhos de 22 cartas. Não alterar números de cópias, efeitos ou probabilidades sem decisão. As probabilidades existentes consideram mãos novas e continuam sendo apresentadas com essa ressalva; o novo fluxo de ações e reações exige testes próprios.

### Piratas do Mar Safira

- Invasão Costeira: esclarecer escolha da região costeira de origem, destino associado ao marcador e destino vazio antes da ação; manter provisoriamente o limite atual de até três unidades.
- Ataque a Linha de Suprimentos e Trabalhe enquanto eles dormem: esclarecer alvo válido no momento de agir e consequência de alvo inválido; esta última protege o atacante e não é automaticamente uma defesa reativa.
- Carta de Corsário e Serviço de Transporte Pirata: esclarecer quando a proposta é feita, quem escolhe destino e como a ação do outro jogador se encaixa na ordem.
- Pirata Aprendiz e Mercenários Piratas: conferir a região do marcador, presença de controle ou bar e momento de movimentação após recrutamento.
- Explorando a Ilha: esclarecer se um marcador identifica origem ou destino e como distribuir até três piratas.
- Novas Comandante a Bordo: definir como uma carta utilizável em qualquer lugar se relaciona com um marcador e com o descarte da mão.
- Não há no registro uma carta pirata explicitamente identificada como reação defensiva; propor novas capacidades ou cartas defensivas apenas após escolha de design.

### Necromante da Torre Esquecida

- Ataque Zumbi, Infestação e Horda interminável: esclarecer origem, alvo, mobilização e efeitos de fim de batalha. Não fixar quantidade nas cartas que dizem “quantas unidades quiser” sem nova decisão; a fixação foi considerada no contexto simultâneo.
- Praga Resistente: candidata a reação defensiva, pois ignora dano em batalhas no local selecionado. Exige decisão sobre duração, alvo e se também pode ser usada como ação normal; não alterar seu efeito automaticamente.
- Magia das Trevas: esclarecer o vínculo entre região marcada, região devastada adjacente e alvo de cada magia, bem como momento do pagamento.
- Trabalhadores Zumbificado e Projeto de Poder Maligno: esclarecer se o marcador identifica uma região habilitadora enquanto a coleta pode abranger todos os extratores, e como verificar recursos e limites.
- Despertar para a Morte: verificar alvo e conversão no momento de agir.
- Remanejando Mortos: definir como o marcador se relaciona às duas regiões devastadas trocadas, incluindo escolha da segunda região no momento da ação e distribuição das tropas.
- Monumento a Morte: esclarecer pontuação e efeito de descartar a mão sobre ações marcadas ainda disponíveis.

## Decisões para fechar antes da aplicação

1. Ordem de alocação de marcadores, se são públicos e ordem de resolução dos dois marcadores; procedimento e frequência do leilão em documento separado.
2. Momento, quantidade e elegibilidade das reações, incluindo se Praga Resistente pode ser usada defensivamente; definir se são necessárias novas cartas de defesa.
3. O que acontece se uma carta ficar sem alvo válido, inclusive se uma invasão pode chegar a uma região vazia sem saque.
4. Relação entre marcador e cartas que afetam várias regiões ou são jogáveis em qualquer lugar; se marcadores não utilizados sobrevivem ao descarte da mão.
5. Como conciliar o baralho local de 22 Piratas com o documento de 30 cartas citado no GDD, que ainda não foi fornecido.
6. Limites de mão, reposição e encerramento das batalhas no novo fluxo; manter separados os parâmetros não aprovados do protótipo espelhado.
