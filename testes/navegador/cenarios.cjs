'use strict';
// Estado reproduzível apenas para testes; ações continuam sendo feitas pela interface.
async function configurarCenario(page, nome) {
  const cenarios = {
    rodada: { imperio: 'Alistamento', necromante: 'Trabalhadores Zumbificado', piratas: 'Pirata Aprendiz', elfos: 'Frutos da Mata' },
    combate: { imperio: 'Marcha Imperial', necromante: 'Praga Resistente', elfos: 'Canção de paz' },
    paz: { imperio: 'Marcha Imperial', elfos: 'Canção de paz' },
  };
  if (!cenarios[nome]) throw Error(`Cenário desconhecido: ${nome}`);
  await page.evaluate(cartas => {
    for (const [f, name] of Object.entries(cartas)) flow.decks[f].hand = [{ name, text: 'Cenário de teste', leadership: 1 }];
    renderFlow();
  }, cenarios[nome]);
}
module.exports = { configurarCenario };
