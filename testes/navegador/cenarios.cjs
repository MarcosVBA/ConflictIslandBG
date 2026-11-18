'use strict';
// Estado reproduzível apenas para testes; ações continuam sendo feitas pela interface.
async function configurarCenario(page, nome) {
  const cenarios = {
    rodada: { imperio: 'Assegurar Recursos para o Rei', necromante: 'Extratores da Torre', piratas: 'Taverna Pirata / Pirata Aprendiz', elfos: 'Frutos da Mata / Filhos da Floresta' },
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
