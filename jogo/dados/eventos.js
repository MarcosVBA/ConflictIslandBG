/* Cartas propostas para testes; as condições não limitam o acionamento manual. */
const eventos = Object.freeze([
  { id: 'morte', nome: 'Espalhar a Morte', condicao: 'Necromante não possui a maior pontuação.', efeito: 'Adicione um zumbi em cada região sem zumbis e mais dois zumbis livremente.' },
  { id: 'vinganca', nome: 'Vingança da Mata', condicao: 'Elfos não possuem a maior pontuação.', efeito: 'Remova peças de outras facções das florestas e adicione um elfo em cada floresta.' },
  { id: 'riqueza', nome: 'Riqueza Pirata', condicao: 'Piratas não possuem a maior pontuação.', efeito: 'Adicione dois Bares; eles geram pontos, não causam penalidade ao serem destruídos e o limite passa a três.' },
  { id: 'colonizacao', nome: 'Colonização', condicao: 'Império não possui a maior pontuação.', efeito: 'Construa tecnologias e adicione uma tecnologia ainda não construída gratuitamente em região controlada.' },
  { id: 'fome', nome: 'A Grande Fome', condicao: 'Necromante ausente ou com menos de cinco tropas.', efeito: 'Elimine todas as tropas exceto zumbis.' },
  { id: 'incendio', nome: 'Incêndio na Floresta', condicao: 'Elfos presentes na partida.', efeito: 'Cada jogador remove uma peça de uma floresta; escolha uma região que deixa de produzir Madeira.' },
  { id: 'escassez', nome: 'Escassez de Ouro', condicao: 'Império ausente ou em primeiro ou segundo lugar.', efeito: 'Somente R11 continua produzindo Ouro.' },
  { id: 'guerra', nome: 'O Mal da Guerra', condicao: 'Sempre.', efeito: 'Remova todas as peças das regiões com peças de mais de uma facção.' },
].map(Object.freeze));
