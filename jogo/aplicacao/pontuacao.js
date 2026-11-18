// Parâmetros e efeitos de teste; não alteram os documentos de regras aprovadas.
// @dados IMPERIO
function newGame() {
  return {
    score: { imperio: 0, necromante: 0, piratas: 0, elfos: 0 },
    victoryTarget: 30,
    endEventsReady: false,
    winner: null,
    taxes: shuffle(imperialTaxes.map((t) => ({ ...t }))),
    tax: null,
    taxDiscard: [],
    delay: 0,
    taxPaid: false,
    hallUsedRound: 0,
    scoreLog: [],
    scored: 0,
    elfTrades: {},
    imperialRecruitRound: 0,
  };
}
let game = newGame();
function addPoints(f, n, reason) {
  if (game.winner) return;
  const result = ConflictIslandBase.registrarPontos(game, f, n);
  Object.assign(game, result.partida);
  game.scoreLog.push(`Rodada ${flow.round}: ${names[f]} +${n} — ${reason}`);
  if (result.marco)
    flowLog("Marco de 20 pontos alcançado; eventos de fim aguardam definição.");
  if (result.venceu) {
    flow.phase = "fim";
    flowLog(names[f] + " alcançou " + game.victoryTarget + " pontos e venceu.");
  }
}
function addResource(f, type, n, reason) {
  Object.assign(
    resources[f],
    ConflictIslandBase.receber(resources[f], type, n),
  );
}
function hasTech(t) {
  return Object.values(state).some((s) => s.tech === t);
}
function replaceTax() {
  const result = ConflictIslandBase.substituirImposto(
    game.tax,
    game.taxes,
    game.taxDiscard,
    shuffle,
  );
  game.tax = result.imposto;
  game.taxes = result.compra;
  game.taxDiscard = result.descarte;
  return game.tax;
}
function taxText(t) {
  return t
    ? `${t.g} Ouro, ${t.w} Madeira e ${t.s} soldado → ${t.p} pontos`
    : "baralho esgotado";
}
function taxCard() {
  return `<div class="tax-card" aria-label="Imposto imperial proposto"><strong>Imposto imperial · proposta</strong><span>${game.tax ? taxText(game.tax) : flow.phase === "preparação" && game.taxes.length ? "Revelado ao preparar a rodada" : game.taxPaid ? "Pago nesta rodada" : "Nenhum imposto ativo"}</span><small>Atraso: ${game.delay} de 3 rodadas</small>${flow.phase === "resolução" && activeFaction() === "imperio" && hasTech("Salão Imperial") && game.tax && !game.taxPaid && (game.taxes.length || game.taxDiscard.length) && game.hallUsedRound !== flow.round ? '<label>Recurso a descartar <select id="hallResource"><option value="ouro">Ouro</option><option value="madeira">Madeira</option></select></label><button id="hallChange">Alterar imposto</button><small id="hallMessage" role="status"></small>' : ""}</div>`;
}
function gameSummary() {
  return `<div class="game-summary"><small>Vitória ao atingir ${game.victoryTarget} pontos.</small><details><summary>Origem dos pontos</summary><ol>${game.scoreLog.map((x) => "<li>" + x + "</li>").join("") || "<li>Nenhum ponto registrado.</li>"}</ol></details></div><details><summary>Hipóteses de teste</summary><p>Mão reposta na preparação; Taverna Pirata constrói Bar sem custo adicional informado; regras do Império e Guarda Imperial são propostas. A duração de Corsário é uma adaptação de teste. Eventos de fim de jogo ainda não foram definidos.</p></details>`;
}
// Cálculo separado da interface para facilitar testes e futuras automações.
function elfForestPoints(regions, position) {
  return ConflictIslandBase.pontosFlorestas(regions, position);
}
function scoreRound(penaltyRegion = null, penaltyResource = null) {
  if (game.scored === flow.round) return;
  const bars = Object.values(state).filter(
    (s) => s.bar && calcOwner(s) === "piratas",
  ).length;
  if (bars) addResource("piratas", "ouro", bars, "renda dos bares");
  const pirateGold = resources.piratas.ouro;
  resources.piratas.ouro = 0;
  if (pirateGold) addPoints("piratas", pirateGold, "Ouro devolvido à reserva");
  if (game.winner) return;
  const forestScore = elfForestPoints(definitions, state);
  if (forestScore.points)
    addPoints(
      "elfos",
      forestScore.points,
      forestScore.owned + " florestas dominadas",
    );
  if (game.winner) return;
  const { quantidade: n, pontos: p } =
    ConflictIslandBase.pontosDevastacao(state);
  if (p) addPoints("necromante", p, n + " regiões devastadas");
  if (game.winner) return;
  if (game.tax && !game.taxPaid) {
    game.delay++;
    if (game.delay >= 3) {
      const options = ConflictIslandBase.opcoesPenalidadeImposto(
        state,
        definitions,
        technologies,
        resources.imperio,
      );
      if (options.candidatas.length) {
        const chosen = options.candidatas.includes(penaltyRegion)
          ? penaltyRegion
          : options.candidatas[0];
        flowLog(
          "Atraso de imposto removeu " +
            state[chosen].tech +
            " em " +
            chosen +
            ".",
        );
        state[chosen].tech = null;
        const type =
          options.recursos.length === 1 ? options.recursos[0] : penaltyResource;
        if (options.recursos.includes(type)) {
          resources.imperio[type]--;
          flowLog("Atraso de imposto: perdeu 1 " + type + ".");
        }
      }
      replaceTax();
      game.delay = 0;
    }
  }
  game.taxPaid = false;
  game.scored = flow.round;
  flowLog(
    "Pontuação concluída: " +
      n +
      " regiões devastadas; " +
      bars +
      " bares ativos.",
  );
  refreshOwners();
}
function beginScoring() {
  const overdue = game.tax && !game.taxPaid && game.delay === 2,
    options = ConflictIslandBase.opcoesPenalidadeImposto(
      state,
      definitions,
      technologies,
      resources.imperio,
    ),
    candidates = options.candidatas.map((id) => ({ id })),
    resourceTie = overdue && options.recursos.length === 2;
  const finish = (id, type) => {
    scoreRound(id, type);
    flow.phase = game.winner ? "fim" : "pontuação";
    $("flowMessage").textContent = "";
    render();
    renderFlow();
  };
  if (overdue && (candidates.length > 1 || resourceTie)) {
    $("flowMessage").innerHTML =
      `Imposto atrasado: ${candidates.length > 1 ? 'escolha a construção a remover. <select id="penaltyTech">' + candidates.map((r) => `<option value="${r.id}">${r.id} · ${state[r.id].tech}</option>`).join("") + "</select>" : ""} ${resourceTie ? 'Escolha o recurso a descartar. <select id="penaltyResource"><option value="ouro">Ouro</option><option value="madeira">Madeira</option></select>' : ""} <button id="confirmPenalty">Confirmar pontuação</button>`;
    $("confirmPenalty").onclick = () =>
      finish(
        candidates.length > 1
          ? $("penaltyTech").value
          : candidates[0]?.id || null,
        resourceTie ? $("penaltyResource").value : null,
      );
  } else finish(candidates[0]?.id || null, null);
}
function scoreView() {
  return `<p>Pontuação da rodada aplicada. Prepare a próxima rodada.</p><button id="nextRound">Próxima rodada</button>`;
}
function endView() {
  const max = game.winner
      ? game.score[game.winner]
      : Math.max(...Object.values(game.score)),
    w = game.winner
      ? [game.winner]
      : factionIds.filter((f) => game.score[f] === max);
  return `<h3>Fim da partida de teste</h3><p>${w.length > 1 ? "Empate: " : "Vencedor: "}${w.map((f) => names[f]).join(", ")} — ${max} pontos.</p><p>Use “Restaurar cenário inicial” para jogar novamente.</p><details><summary>Origem dos pontos</summary><ul>${game.scoreLog.map((x) => "<li>" + x + "</li>").join("")}</ul></details>`;
}
function afterBattle(b, region, result, loot, skipInfestationRecruit = false) {
  const events = ConflictIslandBase.efeitosCombate(
    b,
    region,
    result,
    byId(b.region).terrain,
    loot.length,
  );
  for (const event of events) {
    if (game.winner) break;
    if (event.tipo === "pontos")
      addPoints(event.faccao, event.quantidade, event.motivo);
    else if (event.tipo === "zumbis" && !skipInfestationRecruit)
      region.units.necromante += event.quantidade;
  }
}
