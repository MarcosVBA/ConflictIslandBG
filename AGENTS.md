# Instruções do projeto

- Consulte [README.md](README.md) para localizar o módulo responsável antes de alterar uma regra ou perguntar se ela já foi definida.
- Registre cada decisão no seu módulo, distinguindo regra definida, proposta, pendência e conteúdo adiado. Mantenha separado o estado de implementação. Não transforme hipóteses de teste em regras aprovadas.
- Ao mudar uma mecânica que se aplique ao protótipo, atualize o módulo responsável, o HTML e os testes no mesmo trabalho, salvo se o usuário pedir apenas planejamento ou documentação. Não implemente propostas como aprovadas nem decida lacunas materiais sem autorização.
- Mantenha o protótipo jogável em um único HTML local, com controle manual das facções, sem IA e sem gerar imagens sem pedido expresso.
- Preserve `historico/` como arquivo: não o inclua nas buscas, checagens ou mudanças de rotina. Consulte ou altere seu conteúdo apenas a pedido explícito. Não apague registros para resolver duplicação.
- Ao concluir um lote, execute as verificações proporcionais ao impacto, incluindo `node testes/validar-documentacao.cjs` para mudanças pertinentes. O teste não interpreta toda a prosa nem substitui conferir comportamento e interface; registre limitações no README ou no módulo responsável.

## Atalhos de trabalho

- Consulte o índice do [README](README.md) para localizar a regra, sua implementação e os testes pertinentes. Registre as decisões no módulo responsável.
- Fontes: dados em `jogo/dados/`, motor em `jogo/motor/`, aplicação em `jogo/aplicacao/` e apresentação em `jogo/apresentacao/`. Após editá-las, execute `node scripts/sincronizar-motor.cjs`; o HTML principal é a entrega local gerada.
- Agrupe alterações relacionadas e faça testes e revisão ao final do lote. Para alterações localizadas, escolha `check:rapido` e/ou os testes direcionados (`test:combate`, `test:elfos`, `test:mapa`); para mudanças amplas ou com risco de integração, use `check:completo` quando o navegador estiver disponível. Após correções, repita somente as verificações afetadas e informe limites ou testes não executados.
- Capturas são evidências, não aprovação visual. Para alterações visuais, use referências aprovadas conforme o README e peça avaliação humana; não aprove imagens em nome do usuário.
