/* Catálogo experimental: cada tupla representa uma carta física. */
const cardDefs = {
  imperio: [
    ['Marcha Imperial', 3, 'Mova e/ou ataque em região adjacente ao seu domínio.'],
    ['Assegurar Recursos para o Rei', 4, 'Colete recurso impresso e descarte cópias adicionais para coletar mais.'],
    ['Ordens da Coroa', 3, 'Construa uma tecnologia ou pague o imposto ativo.'],
    ['Guarda Imperial', 2, 'Reação defensiva: ignore dano às tropas.'],
  ],
  piratas: [
    ['Invasão Costeira', 4, 'Mova tropas pela ilha ou saqueie na costa.'],
    ['Taverna Pirata / Pirata Aprendiz', 3, 'Construa um Bar ou recrute um pirata.'],
    ['Carta de Corsário / Serviço de Transporte Pirata', 3, 'Proponha um acordo de Corsário ou Transporte.'],
    ['Vento a Favor', 2, 'Reação em saque: suprima dados de defesa ou receba Ouro extra em caso de sucesso.'],
  ],
  necromante: [
    ['Infestação', 3, 'Ataque com zumbis presentes e/ou até dois de regiões adjacentes; depois recrute um.'],
    ['Extratores da Torre', 4, 'Construa um extrator ou colha recursos dos extratores.'],
    ['Magia das Trevas / Monumento à Morte', 2, 'Use uma magia ou construa um monumento e reponha a mão.'],
    ['Remanejando Mortos', 3, 'Mova zumbis entre regiões devastadas adjacentes e reponha a mão.'],
  ],
  elfos: [
    ['Fúria da Ilha / Harmônia', 3, 'Mova e ataque ou proponha uma troca.'],
    ['Trilhas na Mata / Defesa Global', 2, 'Mova tropas ou proteja um dos lados de uma batalha.'],
    ['Frutos da Mata / Filhos da Floresta', 5, 'Colha recursos ou recrute um elfo e reponha a mão.'],
    ['Milagre da Floresta', 2, 'Converta três recursos de um tipo em dois de outro.'],
  ],
};
const leadershipValues = Object.freeze({
  'Marcha Imperial': 2, 'Assegurar Recursos para o Rei': 1, 'Ordens da Coroa': 1, 'Guarda Imperial': 0,
  'Invasão Costeira': 1, 'Taverna Pirata / Pirata Aprendiz': 1, 'Carta de Corsário / Serviço de Transporte Pirata': 2, 'Vento a Favor': 1,
  'Infestação': 1, 'Extratores da Torre': 1, 'Magia das Trevas / Monumento à Morte': 2, 'Remanejando Mortos': 0,
  'Fúria da Ilha / Harmônia': 1, 'Trilhas na Mata / Defesa Global': 3, 'Frutos da Mata / Filhos da Floresta': 1, 'Milagre da Floresta': 0,
});
const experimentalConditions = Object.freeze({
  'Marcha Imperial': 'Destino adjacente a domínio imperial; mova 1 a 3 soldados de uma origem adjacente. Ataque exige soldados e defensor presente; Fortaleza permite rerrolar um dado.',
  'Assegurar Recursos para o Rei': 'Região com recurso e tropa ou construção imperial. Cada cópia extra descartada rende mais um recurso, até três; Serraria ou Mercado Local dá bônus uma vez.',
  'Ordens da Coroa': 'Construir exige soldados, região sem construção imperial, custo e pré-requisito; rende 1 ponto. Imposto exige região dominada, imposto ativo e pagamento; escolha a origem do soldado quando exigido.',
  'Guarda Imperial': 'Ao defender, antes dos dados, gaste carta para ignorar 1 dano às tropas, ou 2 com Quartel.',
  'Invasão Costeira': 'Saquear exige costa e permite mover 1 a 3 piratas de outra costa. Só mover permite qualquer quantidade de uma origem adjacente ou de outra costa para costa. Para saquear, tenha piratas e escolha defensor com tropas ou construções.',
  'Taverna Pirata / Pirata Aprendiz': 'Construir Bar exige região dominada e não pode haver outro Bar. Recrutar exige região dominada pelos Piratas ou sem domínio e adiciona dois piratas em região com Bar.',
  'Carta de Corsário / Serviço de Transporte Pirata': 'Outra facção aceita ou recusa preço de 0 a 3 Ouros. Corsário move piratas para região adjacente e pode saquear; Transporte move tropas do contratante para costa ou região adjacente à origem.',
  'Vento a Favor': 'Piratas atacantes em saque: após declaração e antes da reação defensiva, gaste carta. Suprima dados de defesa existentes ou ganhe 1 Ouro extra em saque bem-sucedido. Uma cópia por combate.',
  'Infestação': 'Ataque defensor presente e/ou mova até 2 zumbis adjacentes. Sem defensor, o movimento termina sem combate ou recrutamento. Recrute 1 após combate, salvo interrupção ou recuperação da Torre.',
  'Extratores da Torre': 'Construir exige zumbi, recurso impresso e região sem extrator. Colher exige extrator no mapa e rende 1 recurso impresso por extrator no mapa.',
  'Magia das Trevas / Monumento à Morte': 'Magia exige custos e alvos da magia escolhida. Monumento exige região devastada sem monumento, 1 Madeira e domínio de algum oponente; pontue 2 por monumento e reponha a mão.',
  'Remanejando Mortos': 'Mova quantos zumbis quiser, inclusive zero movimentos, entre regiões inicialmente devastadas ligadas diretamente. Ao concluir, descarte a mão e compre até cinco.',
  'Fúria da Ilha / Harmônia': 'Atacar exige defensor presente e permite atacar no local ou mover 1 a 3 elfos para região adjacente e atacar. Trocar exige outra facção e aceite; primeira troca efetiva por facção rende 1 ponto na rodada.',
  'Trilhas na Mata / Defesa Global': 'Mover leva quantidade positiva de elfos de uma origem adjacente. Defesa Global: após reação defensiva e antes dos dados, gaste carta para proteger um lado com tropas, inclusive em combate de terceiros.',
  'Frutos da Mata / Filhos da Floresta': 'Colher exige tropas élficas no mapa e rende um recurso impresso por região com elfos. Recrutar exige floresta não devastada e 1 Ouro, Madeira ou tropa élfica; depois reponha a mão.',
  'Milagre da Floresta': 'Converta 3 unidades de um tipo em 2 de outro: Ouro, Madeira ou tropas élficas. Tropas recebidas vão a regiões dominadas pelos Elfos.',
});
// janela: mapa, modal ou reação; o efeito identifica a regra utilizada.
const experimentalModes = Object.freeze({
  'Marcha Imperial': [{label:'Mover', effect:'Marcha Imperial', window:'mapa', operation:'move'}, {label:'Atacar', effect:'Marcha Imperial', window:'mapa', operation:'attack'}, {label:'Mover e atacar', effect:'Marcha Imperial', window:'mapa', operation:'both'}],
  'Assegurar Recursos para o Rei': [{label:'Coletar', effect:'Assegurar Recursos para o Rei', window:'mapa'}],
  'Ordens da Coroa': [{label:'Construir', effect:'O Progresso', window:'mapa'}, {label:'Pagar imposto', effect:'Pagamento de Impostos', window:'mapa'}],
  'Guarda Imperial': [{label:'Defender', effect:'Guarda Imperial', window:'reação'}],
  'Invasão Costeira': [{label:'Mover', effect:'Invasão Costeira', window:'mapa', operation:'move'}, {label:'Saquear', effect:'Invasão Costeira', window:'mapa', operation:'attack'}, {label:'Mover e saquear', effect:'Invasão Costeira', window:'mapa', operation:'both'}],
  'Taverna Pirata / Pirata Aprendiz': [{label:'Construir', effect:'Taverna Pirata', window:'mapa'}, {label:'Recrutar', effect:'Pirata Aprendiz', window:'mapa'}],
  'Carta de Corsário / Serviço de Transporte Pirata': [{label:'Corsário', effect:'Carta de Corsário', window:'mapa'}, {label:'Transporte', effect:'Serviço de Transporte Pirata', window:'mapa'}],
  'Vento a Favor': [{label:'Descartar dados de defesa', effect:'Vento a Favor', window:'reação'}, {label:'Recolher mais espólios', effect:'Vento a Favor', window:'reação'}],
  'Infestação': [{label:'Atacar', effect:'Infestação', window:'mapa'}],
  'Extratores da Torre': [{label:'Construir', effect:'Projeto de Poder Maligno', window:'mapa'}, {label:'Colher', effect:'Trabalhadores Zumbificado', window:'mapa'}],
  'Magia das Trevas / Monumento à Morte': [{label:'Magia', effect:'Magia das Trevas', window:'mapa'}, {label:'Monumento', effect:'Monumento a Morte', window:'mapa'}],
  'Remanejando Mortos': [{label:'Remanejar', effect:'Remanejando Mortos', window:'mapa'}],
  'Fúria da Ilha / Harmônia': [{label:'Atacar', effect:'Furia da Ilha', window:'mapa'}, {label:'Trocar', effect:'Harmônia', window:'mapa'}],
  'Trilhas na Mata / Defesa Global': [{label:'Mover', effect:'Trilhas na Mata', window:'mapa'}, {label:'Defesa Global', effect:'Defesa Global', window:'reação'}],
  'Frutos da Mata / Filhos da Floresta': [{label:'Colher', effect:'Frutos da Mata', window:'mapa'}, {label:'Recrutar', effect:'Filhos da Floresta', window:'mapa'}],
  'Milagre da Floresta': [{label:'Converter', effect:'Milagre da Floresta', window:'modal'}],
});
