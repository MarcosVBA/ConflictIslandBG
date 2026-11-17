# Instruções do projeto

- Consulte [README.md](README.md) para localizar o módulo responsável antes de alterar uma regra ou perguntar se ela já foi definida.
- Registre cada decisão no seu módulo, distinguindo regra definida, proposta, pendência e conteúdo adiado. Mantenha separado o estado de implementação. Não transforme hipóteses de teste em regras aprovadas.
- Ao mudar uma mecânica que se aplique ao protótipo, atualize o módulo responsável, o HTML e os testes no mesmo trabalho, salvo se o usuário pedir apenas planejamento ou documentação. Não implemente propostas como aprovadas nem decida lacunas materiais sem autorização.
- Mantenha o protótipo jogável em um único HTML local, com controle manual das facções, sem IA e sem gerar imagens sem pedido expresso.
- Preserve os documentos em `historico/` como registros, não como fontes concorrentes. Não apague conteúdo histórico para resolver duplicação.
- Execute `node testes/validar-documentacao.cjs` após mudanças pertinentes e acrescente verificações proporcionais. O teste não interpreta toda a prosa nem substitui conferir comportamento e interface; registre limitações reais em `prototipo/estado-e-testes.md`.
