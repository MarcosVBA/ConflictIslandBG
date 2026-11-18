// Fluxo da rodada e escolhas dos jogadores; efeitos são resolvidos pelo jogo.
const factionIds = ["imperio", "necromante", "piratas", "elfos"];
// @dados CARTAS
const revisedModes =
  typeof experimentalModes === "undefined" ? null : experimentalModes;
let preparedMode = null;
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function newFlow() {
  return ConflictIslandBase.fluxoInicial(
    factionIds,
    cardDefs,
    leadershipValues,
    shuffle,
  );
}
let flow = newFlow();
const flowPanel = document.createElement("section");
flowPanel.className = "panel flow-panel";
flowPanel.innerHTML =
  '<h2>Sua vez de jogar</h2><p class="muted">Controle as quatro facções e escolha cada ação.</p><div id="flow"></div><p id="flowMessage" class="flow-message" role="status"></p>';
$("flowSlot").appendChild(flowPanel);
const handHome = $("handArea").parentElement;
function syncPhaseDialog(phase) {
  const dialog = $("phaseDialog");
  if (typeof dialog.showModal !== "function") return;
  const inDialog = ["preparação", "leilão", "pontuação"].includes(phase);
  if (inDialog) {
    ensureMinimizeButton(dialog, phase === "leilão" ? "liderança" : phase);
    $("phaseDialogPanel").appendChild(flowPanel);
    if (phase === "leilão") $("phaseDialogCards").appendChild($("handArea"));
    else if (handHome) handHome.appendChild($("handArea"));
    dialog.setAttribute(
      "aria-label",
      phase === "leilão"
        ? "Leilão de liderança"
        : phase === "pontuação"
          ? "Pontuação da rodada"
          : "Preparação da rodada",
    );
    dialog.oncancel = (event) => event.preventDefault();
    if (!dialog.open && minimizedDialog !== dialog) dialog.showModal();
  } else {
    if (dialog.open) dialog.close();
    $("flowSlot").appendChild(flowPanel);
    if (handHome) handHome.appendChild($("handArea"));
  }
}
function drawTo(f, target) {
  const d = flow.decks[f];
  Object.assign(d, ConflictIslandBase.comprarAte(d, target, shuffle));
}
function refill(f) {
  if (flow.phase !== "preparação")
    throw Error("A reposição normal ocorre na preparação da rodada.");
  drawTo(f, flow.handSize);
}
function flowLog(s) {
  flow.log.push("Rodada " + flow.round + ": " + s);
}
function activeFaction() {
  while (true) {
    const next = ConflictIslandBase.proximaFacção(
      flow.order,
      flow.turn,
      flow.markers,
    );
    if (!next) return null;
    flow.turn = next.indice;
    if (flow.decks[next.faccao].hand.length) return next.faccao;
    for (const marker of flow.markers)
      if (marker.f === next.faccao && !marker.used) marker.used = true;
    flowLog(names[next.faccao] + " encerrou a vez por estar sem cartas.");
    flow.turn = (flow.turn + 1) % flow.order.length;
  }
}
const factionCrests = {
  imperio: "♜",
  necromante: "☽",
  piratas:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4" r="2"/><path d="M12 6v14M7 9h10M3.5 15c.8 4.2 4.4 6.5 8.5 6.5s7.7-2.3 8.5-6.5M2 16l1.5-3 3 2M22 16l-1.5-3-3 2"/></svg>',
  elfos: "✧",
};
function renderFactionStatus(active) {
  const rgb = {
    imperio: "224,179,87",
    necromante: "181,147,210",
    piratas: "216,128,115",
    elfos: "124,201,174",
  };
  if (document.documentElement?.style?.setProperty)
    document.documentElement.style.setProperty(
      "--mesa-accent-rgb",
      rgb[active] || "214,170,86",
    );
  $("statusBar").innerHTML = factionIds
    .map(
      (f) =>
        `<div class="faction-status ${f} ${active === f ? "current" : ""}"><button type="button" class="faction-crest ${f}" data-faction-info="${f}" aria-label="Informações: ${names[f]}" aria-haspopup="dialog">${factionCrests[f]}</button><div><strong>${names[f]}${active === f ? " · vez" : ""}</strong><span>◈ ${resources[f].ouro} ouro &nbsp; · &nbsp; ◇ ${resources[f].madeira} madeira</span></div><b>${game.score[f]} <small>pts</small></b></div>`,
    )
    .join("");
  $("statusBar")
    .querySelectorAll("[data-faction-info]")
    .forEach((button) => {
      button.onclick = () => showFactionInfo(button.dataset.factionInfo);
    });
}
function factionInfo(f) {
  const owned = definitions.filter((r) => calcOwner(state[r.id]) === f).length,
    troops = definitions.reduce((sum, r) => sum + state[r.id].units[f], 0),
    res = resources[f];
  let details = "";
  if (f === "imperio") {
    const techs = definitions
      .filter((r) => state[r.id].tech)
      .map((r) => state[r.id].tech + " · " + r.id);
    details = `<p><strong>Imposto ${game.taxPaid ? "· pago nesta rodada" : ""}</strong><br>${game.tax ? taxText(game.tax) : "Será revelado na preparação"} · atraso ${game.delay}/3</p><p><strong>Tecnologias</strong><br>${techs.join(" · ") || "Nenhuma construída"}</p><small>Serraria → Mercado Local → Salão Imperial<br>Serraria → Quartel → Fortaleza</small>`;
  }
  if (f === "necromante") {
    const devastatedCount = Object.values(state).filter(devastated).length,
      extractors = Object.values(state).filter((s) => s.extractor).length,
      monuments = Object.values(state).filter((s) => s.monument).length;
    details = `<p><strong>${devastatedCount}</strong> regiões devastadas · <strong>${extractors}</strong> extratores · <strong>${monuments}</strong> monumentos</p><small>Torre Esquecida: ${state.R3.tower ? "presente" : "ausente"}</small>`;
  }
  if (f === "piratas") {
    const bars = Object.values(state).filter((s) => s.bar).length;
    details = `<p><strong>${bars}/${game.eventFlags.pirateWealth ? 3 : 1}</strong> Bar Pirata construído</p><small>O Ouro restante gera pontos na pontuação da rodada.</small>`;
  }
  if (f === "elfos") {
    const forest = elfForestPoints(definitions, state);
    details = `<p><strong>${forest.owned}</strong> florestas dominadas · <strong>${forest.points}</strong> pontos na pontuação de rodada</p><small>${revisedModes ? "Defesa Global pode proteger um lado antes dos dados." : "Canção de paz pode ser usada antes dos dados."}</small>`;
  }
  const rules = {
    imperio: `<p><strong>Alistamento obrigatório:</strong> após comprar cartas, adicione 1 soldado em região dominada até o limite de 7; sem domínio, adicione até 2 em região com menos inimigos.</p><p><strong>Impostos:</strong> pague o imposto ativo no máximo uma vez por rodada. Após três rodadas sem pagamento, aplica-se a penalidade de atraso.</p><p><strong>Tecnologias:</strong> seus bônus e pré-requisitos dependem de a construção existir. A construção concede 1 ponto. Valores e efeitos imperiais permanecem em teste.</p>`,
    necromante: `<p><strong>Devastação:</strong> uma região é devastada quando há peças do Necromante e nenhuma peça adversária. No fim da rodada, 2–3 regiões rendem 1 ponto; 4 rendem 2; 5 rendem 3; 6 ou mais rendem 4.</p><p><strong>Magia da Torre:</strong> ao perder seu domínio, remova as peças indicadas pela magia; a Torre permanece e recebe 2 zumbis. Se for sua única região dominada, após comprar cartas adicione 1 zumbi nela, até 5.</p>`,
    piratas: `<p><strong>Ouro:</strong> no fim da rodada, após a renda do Bar, devolva todo o Ouro à reserva e pontue 1 por Ouro. Até então, ele pode ser trocado. Um Bar controlado gera 1 Ouro por rodada; há limite de 1 Bar no mapa. Se o Bar for destruído, perca todo o Ouro e 1 ponto.</p><p><strong>Saque:</strong> em saque bem-sucedido, receba 1 Ouro do inimigo ou da reserva se ele não tiver Ouro.</p><p><strong>Ilha à Vista:</strong> sem piratas no mapa, coloque 1 em uma costa com a menor quantidade de tropas, escolhendo em caso de empate.</p>`,
    elfos: `<p><strong>Guardiões da Floresta:</strong> ao fim da rodada, 2 florestas dominadas rendem 1 ponto; com pelo menos 2 dominadas e tropas em todas, rendem 2 no total. Eliminar as tropas da facção adversária da batalha em floresta rende 1 ponto.</p><p><strong>Coexistência Pacífica:</strong> a primeira troca de recursos nos dois sentidos com cada outro jogador em cada rodada rende 1 ponto.</p><p><strong>Canção de paz:</strong> antes dos dados, gaste a carta e uma ação para cancelar qualquer combate como 0 a 0; movimentos e custos permanecem.</p>`,
  };
  if (revisedModes)
    rules.elfos = rules.elfos.replace(
      "<p><strong>Canção de paz:</strong> antes dos dados, gaste a carta e uma ação para cancelar qualquer combate como 0 a 0; movimentos e custos permanecem.</p>",
      "<p><strong>Defesa Global:</strong> antes dos dados, gaste a carta para proteger um dos lados com tropas.</p>",
    );
  const deck = flow.decks[f];
  return `<div class="faction-info" aria-label="Informações de ${names[f]}"><h2>${names[f]}</h2><p><strong>${game.score[f]} pontos</strong> · ◆ ${res.ouro} ouro · ♣ ${res.madeira} madeira</p><p>${troops} tropas · ${owned} regiões dominadas</p><p>Baralho: ${deck.draw.length} · mão: ${deck.hand.length} · descarte: ${deck.discard.length}</p>${details}<h3>Regras da facção</h3>${rules[f]}</div>`;
}
function showFactionInfo(f) {
  if (!factionIds.includes(f)) return;
  $("factionInfoContent").innerHTML = factionInfo(f);
  const dialog = $("factionDialog");
  ensureMinimizeButton(dialog, "informações da facção");
  if (typeof dialog.showModal === "function" && !dialog.open)
    dialog.showModal();
}
function cardMeta(f, name) {
  if (isAttackCard(f, name)) return { kind: "Ataque", symbol: "⚔" };
  if (["Guarda Imperial", "Praga Resistente"].includes(name))
    return { kind: "Defesa", symbol: "✣" };
  if (["Pirata Aprendiz", "Mercenários Piratas", "Alistamento"].includes(name))
    return { kind: "Reforço", symbol: "♟" };
  if (
    [
      "Atrás do Tesouro",
      "Reorganizar Contingente",
      "Remanejando Mortos",
      "Serviço de Transporte Pirata",
    ].includes(name)
  )
    return { kind: "Movimento", symbol: "➜" };
  if (
    [
      "Assegurar Recursos para o Rei",
      "Trabalhadores Zumbificado",
      "Pagamento de Impostos",
    ].includes(name)
  )
    return { kind: "Recursos", symbol: "◈" };
  if (
    [
      "O Progresso",
      "Projeto de Poder Maligno",
      "Monumento a Morte",
      "Taverna Pirata",
    ].includes(name)
  )
    return { kind: "Construção", symbol: "♜" };
  return { kind: "Especial", symbol: "✦" };
}
function handCard(f, c, i, total, preview = false) {
  const meta = cardMeta(f, c.name),
    tilt = Math.max(-4, Math.min(4, (i - (total - 1) / 2) * 1.2)),
    image = visualAssets.cartas[c.name],
    art =
      typeof image === "string" && image
        ? `<img class="card-art-image" src="${escapeAttribute(image)}" alt="" onerror="this.hidden=true">`
        : "";
  return `<button type="button" class="hand-card" data-faction="${f}" data-${preview ? "preview" : "card"}-index="${i}" style="--tilt:${tilt}deg" aria-pressed="false" aria-label="${c.name}. Liderança ${c.leadership}. ${c.text}"><span class="card-top"><span>${meta.kind}</span><span class="card-number" title="Liderança">${c.leadership}</span></span><span class="card-art" aria-hidden="true"><span>${meta.symbol}</span>${art}</span><strong>${c.name}</strong><span class="card-effect">${c.text}</span><span class="card-bottom">Liderança ${c.leadership} · ${meta.kind}</span></button>`;
}
function rescueRegions() {
  const eligible = ConflictIslandBase.opcoesIlhaAVista(state, definitions);
  return definitions.filter((r) => eligible.includes(r.id));
}
function restoreTowerIfLost() {
  const result = ConflictIslandBase.recuperarTorre(state);
  if (!result.ativada) return false;
  if (state.R3.bar && !result.mapa.R3.bar) penalidadeBar();
  for (const id of Object.keys(state))
    Object.assign(state[id], result.mapa[id]);
  flowLog("Magia da Torre: peças removidas e 2 zumbis retornam à Torre.");
  return true;
}
function towerRoundReinforcement() {
  const result = ConflictIslandBase.reforcarTorre(state, definitions);
  if (result.ativada) {
    Object.assign(state.R3, result.mapa.R3);
    flowLog("Magia da Torre: 1 zumbi adicionado em R3.");
  }
}
function startLeadershipAuction() {
  flow.auction = ConflictIslandBase.iniciarLeilao(flow.order);
  flow.phase = "leilão";
}
function finishLeadershipAuction() {
  const a = flow.auction,
    result = ConflictIslandBase.encerrarLeilao(a, flow.order, flow.decks),
    winner = result.vencedor;
  flow.order = result.ordem;
  flow.decks = result.baralhos;
  if (a.leader)
    flowLog(
      names[winner] +
        " venceu a liderança com " +
        a.high +
        " e descartou " +
        result.quantidade +
        " carta(s).",
    );
  else
    flowLog("Sem lances positivos; " + names[winner] + " mantém a liderança.");
  flow.auction = null;
  flow.markers = factionIds.flatMap((f) => [
    { f, region: null, used: false },
    { f, region: null, used: false },
  ]);
  flow.phase = "resolução";
  flow.turn = 0;
  $("flowMessage").textContent =
    names[winner] +
    " é líder e inicia as ações; cada facção tem duas ações disponíveis.";
  renderFlow();
}
function advanceLeadershipAuction() {
  const next = ConflictIslandBase.proximoLance(flow.auction, flow.order);
  if (next !== null) {
    flow.auction.turn = next;
    renderFlow();
    return;
  }
  finishLeadershipAuction();
}
function renderLeadershipAuction(target) {
  const a = flow.auction,
    f = flow.order[a.turn],
    hand = flow.decks[f].hand,
    committed = new Set(a.offers[f]),
    selected = new Set();
  const offers = flow.order
    .map((side) => {
      const cards = a.offers[side].map((i) => flow.decks[side].hand[i]);
      return `<li><strong>${names[side]}</strong>${a.leader === side ? " · maior lance" : ""}${a.passed[side] ? " · passou" : ""}: ${cards.length ? cards.map((c) => c.name + " (" + c.leadership + ")").join(", ") : "nenhuma carta"} — ${cards.reduce((n, c) => n + c.leadership, 0)} liderança</li>`;
    })
    .join("");
  target.innerHTML = `<p><span class="phase">Rodada ${flow.round} · Leilão de liderança</span></p><h3>Vez: ${names[f]}</h3><p>Maior lance: <strong>${a.high}</strong>${a.leader ? " · " + names[a.leader] : ""}. O leilão segue no sentido anti-horário. Selecione cartas adicionais para superar esse valor ou passe para sair do leilão.</p><ul>${offers}</ul><p>Total do seu lance: <strong id="bidTotal">0</strong> liderança</p><button id="submitBid">Dar lance</button> <button id="passBid">Passar</button> ${!a.leader ? '<button id="skipAuction">Pular leilão</button>' : ""}<p id="auctionError" role="status"></p><p class="muted">Cartas oferecidas ficam abertas até o fim. Somente o vencedor as descarta; os demais as recuperam.</p>`;
  const updateTotal = () => {
    $("bidTotal").textContent = [...committed, ...selected].reduce(
      (sum, i) => sum + hand[i].leadership,
      0,
    );
  };
  showAuctionHand(f, hand, committed, selected, updateTotal);
  updateTotal();
  if ($("skipAuction"))
    $("skipAuction").onclick = () => {
      if (flow.auction !== a || a.leader) return;
      finishLeadershipAuction();
    };
  $("submitBid").onclick = () => {
    if (flow.auction !== a || flow.order[a.turn] !== f) return;
    const chosen = [...selected];
    let result;
    try {
      result = ConflictIslandBase.registrarLance(a, f, hand, chosen);
    } catch (e) {
      $("auctionError").textContent = e.message;
      return;
    }
    Object.assign(a, result);
    flowLog(
      names[f] +
        " ofereceu liderança " +
        a.high +
        ": " +
        a.offers[f].map((i) => hand[i].name).join(", ") +
        ".",
    );
    advanceLeadershipAuction();
  };
  $("passBid").onclick = () => {
    if (flow.auction !== a || flow.order[a.turn] !== f) return;
    Object.assign(a, ConflictIslandBase.passarLeilao(a, flow.order, f));
    flowLog(names[f] + " passou no leilão.");
    advanceLeadershipAuction();
  };
}
function renderRoundPhases(phase) {
  const current = phase === "alistamento" ? "preparação" : phase;
  const steps = [
    ["preparação", "Preparação"],
    ["leilão", "Liderança"],
    ["resolução", "Ações"],
    ["pontuação", "Pontuação"],
  ];
  if (phase === "fim") steps.push(["fim", "Fim"]);
  const content = `<span class="round-count">Rodada ${flow.round}</span>${steps
    .map(
      ([key, label]) =>
        `<span class="round-step${key === current ? " current" : ""}"${key === current ? ' aria-current="step"' : ""}>${label}</span>`,
    )
    .join('<span class="round-separator" aria-hidden="true">›</span>')}`;
  $("headerPhases").innerHTML = content;
}
function renderFlow() {
  preparedMode = null;
  if (!battle) closeActionDialog();
  $("handArea").innerHTML = "";
  $("handArea").hidden = true;
  if (game.winner) flow.phase = "fim";
  mapChoice = null;
  if (flow.phase === "resolução" && !battle)
    for (const m of flow.markers) if (!m.used) m.region = null;
  const feedback = $("mapFeedback");
  if (feedback) feedback.textContent = "Selecione uma região para inspecionar.";
  const target = $("flow"),
    phase = flow.phase;
  syncPhaseDialog(phase);
  iniciarEventoPendente();
  renderRoundPhases(phase);
  $("gameTools").innerHTML =
    gameSummary() +
    "<details><summary>Resumo dos baralhos e mãos</summary>" +
    flow.order
      .map((f) => {
        let d = flow.decks[f];
        return `<p><strong>${names[f]}${f === "imperio" ? " (proposta)" : ""}:</strong> compra ${d.draw.length} · descarte ${d.discard.length} · mão ${d.hand.length}: ${d.hand.map((c) => c.name).join(", ") || "vazia"}</p>`;
      })
      .join("") +
    "</details><details><summary>Registro da rodada</summary><ol>" +
    flow.log.map((x) => "<li>" + x + "</li>").join("") +
    "</ol></details>";
  if (
    phase !== "fim" &&
    !battle &&
    definitions.every((r) => state[r.id].units.elfos === 0)
  ) {
    const florestas = definitions.filter((r) => r.terrain === "floresta");
    const options = florestas
      .map((r) => `<option value="${r.id}">${r.id} · ${r.name}</option>`)
      .join("");
    target.innerHTML = `<h3>Vingança da Terra</h3><p>Os Elfos ficaram sem tropas. Escolha uma floresta para cada uma das três tropas.</p>${[1, 2, 3].map((i) => `<label>Tropa ${i} <select id="elfRevive${i}">${options}</select></label>`).join("")}<button id="confirmElfRevive">Adicionar tropas</button>`;
    $("confirmElfRevive").onclick = () => {
      const ids = [1, 2, 3].map((i) => $("elfRevive" + i).value);
      if (
        definitions.some((r) => state[r.id].units.elfos > 0) ||
        ids.some((id) => !florestas.some((r) => r.id === id))
      )
        return;
      for (const id of ids) state[id].units.elfos++;
      flowLog(
        "Vingança da Terra: tropas adicionadas em " + ids.join(", ") + ".",
      );
      refreshOwners();
      render();
      renderFlow();
    };
    return;
  }
  if (
    phase !== "fim" &&
    definitions.every((r) => state[r.id].units.piratas === 0)
  ) {
    const candidates = rescueRegions();
    target.innerHTML = `<h3>Ilha à Vista</h3><p>Não há piratas no mapa. Escolha uma região costeira com a menor quantidade de tropas para adicionar um pirata.</p><label>Região <select id="rescueRegion">${candidates.map((r) => `<option value="${r.id}">${r.id} · ${r.name}</option>`).join("")}</select></label><button id="rescuePirate">Adicionar pirata</button>`;
    setMapChoice({
      kind: "rescue",
      valid: candidates.map((r) => r.id),
      origin: null,
      hint: "Escolha uma região costeira destacada para Ilha à Vista.",
    });
    $("rescuePirate").onclick = () => {
      const id = $("rescueRegion").value;
      if (
        !rescueRegions().some((r) => r.id === id) ||
        definitions.some((r) => state[r.id].units.piratas > 0)
      )
        return;
      state = ConflictIslandBase.aplicarIlhaAVista(state, definitions, id);
      flowLog("Ilha à Vista: pirata adicionado em " + id);
      selected = id;
      mapChoice = null;
      refreshOwners();
      render();
      renderFlow();
    };
    return;
  }
  if (phase === "alistamento" && game.imperialRecruitRound !== flow.round) {
    const recruitment = ConflictIslandBase.opcoesAlistamento(
      state,
      definitions,
    );
    if (!recruitment.quantidade) {
      game.imperialRecruitRound = flow.round;
      flowLog("Alistamento obrigatório: limite de 7 tropas atingido.");
      startLeadershipAuction();
      renderFlow();
      return;
    }
    const choices = definitions.filter((r) =>
      recruitment.opcoes.includes(r.id),
    );
    target.innerHTML = `<p><span class="phase">Rodada ${flow.round} · Alistamento obrigatório</span></p><h3>Reforço imperial</h3><p>${recruitment.controladas ? "Escolha uma região dominada para adicionar 1 soldado." : "Sem região dominada: escolha uma região com menos tropas inimigas para adicionar até 2 soldados, respeitando o limite de 7."}</p><label>Região <select id="imperialRecruit">${choices.map((r) => `<option value="${r.id}">${r.id} · ${r.name}</option>`).join("")}</select></label><button id="confirmImperialRecruit">Adicionar tropas</button>`;
    $("confirmImperialRecruit").onclick = () => {
      const id = $("imperialRecruit").value;
      if (
        !choices.some((r) => r.id === id) ||
        game.imperialRecruitRound === flow.round
      )
        return;
      state = ConflictIslandBase.aplicarAlistamento(state, definitions, id);
      game.imperialRecruitRound = flow.round;
      selected = id;
      flowLog("Alistamento obrigatório em " + id);
      startLeadershipAuction();
      render();
      renderFlow();
    };
    setMapChoice({
      kind: "recruit",
      valid: choices.map((r) => r.id),
      origin: null,
      hint: "Selecione no mapa uma região destacada para o alistamento imperial.",
    });
    return;
  }
  if (phase === "leilão") {
    renderLeadershipAuction(target);
    return;
  }
  let html = `<p><span class="phase">Rodada ${flow.round} · ${phase}</span></p>`;
  if (phase === "resolução" && activeFaction() === "imperio") html += taxCard();
  if (phase === "preparação") {
    html += `${flow.round === 1 ? `<label>Primeiro jogador <select id="orderChoice">${factionIds.map((f) => `<option value="${f}" ${f === flow.order[0] ? "selected" : ""}>${names[f]}</option>`).join("")}</select></label>` : `<p>Primeiro no leilão: <strong>${names[flow.order[0]]}</strong> · líder anterior</p>`} <label>Tamanho da mão <input id="handSize" type="number" min="1" max="10" oninput="if(this.value!=='') this.value=Math.max(Number(this.min),Math.min(Number(this.max),Math.floor(Number(this.value)||0)))" value="${flow.handSize}" style="width:5rem"></label> <button id="startRound">Preparar rodada</button><p class="muted">A mesa segue no sentido anti-horário: ${factionIds.map((f) => names[f]).join(" → ")} → ${names[factionIds[0]]}. Complete a mão e reembaralhe o descarte quando necessário.</p>`;
  }

  if (phase === "resolução")
    html +=
      "<p><strong>Ações restantes:</strong> " +
      flow.order
        .map(
          (f) =>
            names[f] +
            ": " +
            flow.markers.filter((m) => m.f === f && !m.used).length,
        )
        .join(" · ") +
      "</p>";
  if (phase === "resolução") {
    const f = activeFaction();
    if (f) {
      const markers = flow.markers
        .map((m, i) => ({ m, i }))
        .filter((x) => x.m.f === f && !x.m.used);
      const d = flow.decks[f];
      $("handArea").hidden = false;
      $("handArea").setAttribute("data-faction", f);
      $("handArea").innerHTML =
        `<div class="hand-content"><div class="hand-heading"><div><strong>Sua mão</strong> <small>· ${d.hand.length} ${d.hand.length === 1 ? "carta" : "cartas"}</small></div></div><select id="actionCard" class="hand-select" hidden aria-label="Carta selecionada">${d.hand.map((c, i) => `<option value="${i}">${c.name}</option>`).join("")}</select><div class="hand-wrap"><div class="hand" id="handViewport" tabindex="0" role="region" aria-label="Cartas de ${names[f]}">${d.hand.map((c, i) => handCard(f, c, i, d.hand.length)).join("") || '<p class="hand-empty">Sua mão está vazia.</p>'}</div></div><small class="hand-tip">Escolha uma carta para ver o efeito completo e preparar a ação.</small></div>`;
      html += `<h3>Vez: ${names[f]}</h3><p><strong>Ações disponíveis: ${markers.length}</strong></p><select id="actionMarker" hidden aria-label="Ação disponível">${markers.map(({ m, i }, n) => `<option value="${i}">Ação ${n + 1}</option>`).join("")}</select> <label>Região da próxima ação <select id="actionRegion"><option value="" disabled ${selected === null ? "selected" : ""}>Selecione uma região</option>${definitions.map((r) => `<option value="${r.id}" ${r.id === selected ? "selected" : ""}>${r.id} · ${r.name}</option>`).join("")}</select></label> <button id="showCard" class="hand-select" hidden ${d.hand.length ? "" : "disabled"}>Examinar carta selecionada</button><div id="cardDetail" class="card-detail"></div><div class="row"><button id="passAction" hidden>Passar ação</button><button id="discardAction" disabled>Descartar carta escolhida</button></div><p class="muted">Compra: ${d.draw.length} · mão: ${d.hand.length} · descarte: ${d.discard.length}. Escolha a carta somente ao chegar sua vez.</p>`;
    } else
      html +=
        '<p>Todas as ações foram resolvidas.</p><button id="toScore">Ir à pontuação</button>';
  }

  if (phase === "pontuação") html += scoreView();
  if (phase === "fim") html += endView();
  target.innerHTML = html;
  visualMarkers = flow.markers;
  render();
  const active = phase === "resolução" ? activeFaction() : null;
  renderFactionStatus(active);
  if (
    phase === "resolução" &&
    activeFaction() === "imperio" &&
    hasTech("Salão Imperial") &&
    game.tax &&
    !game.taxPaid &&
    (game.taxes.length || game.taxDiscard.length) &&
    game.hallUsedRound !== flow.round
  )
    $("hallChange").onclick = () => {
      const type = $("hallResource").value;
      if (
        battle ||
        activeFaction() !== "imperio" ||
        !hasTech("Salão Imperial") ||
        !game.tax ||
        (!game.taxes.length && !game.taxDiscard.length) ||
        game.hallUsedRound === flow.round ||
        !["ouro", "madeira"].includes(type) ||
        resources.imperio[type] < 1
      ) {
        $("hallMessage").textContent =
          "Habilidade indisponível ou recurso insuficiente.";
        return;
      }
      resources.imperio[type]--;
      replaceTax();
      game.hallUsedRound = flow.round;
      flowLog("Salão Imperial: imposto alterado por 1 " + type + ".");
      renderFlow();
    };
  if (phase === "preparação")
    $("startRound").onclick = () => {
      let n = Number($("handSize").value);
      if (!Number.isInteger(n) || n < 1 || n > 10) {
        $("flowMessage").textContent = "Escolha uma mão entre 1 e 10 cartas.";
        return;
      }
      flow.handSize = n;
      if (flow.round === 1) {
        const first = $("orderChoice").value,
          index = factionIds.indexOf(first);
        if (index < 0) {
          $("flowMessage").textContent = "Escolha o primeiro jogador.";
          return;
        }
        flow.order = factionIds.slice(index).concat(factionIds.slice(0, index));
      }
      factionIds.forEach(refill);
      towerRoundReinforcement();
      replaceTax();
      flowLog("Novo imposto imperial revelado: " + taxText(game.tax));
      flow.phase = "alistamento";
      flowLog("Mãos preparadas; escolha o alistamento obrigatório do Império.");
      renderFlow();
    };

  if (phase === "resolução") {
    let f = activeFaction();
    if (f) {
      $("discardAction").onclick = () => {
        const mi = Number($("actionMarker").value),
          ci = Number($("actionCard").value),
          m = flow.markers[mi],
          d = flow.decks[f];
        if (
          $("discardAction").disabled ||
          !m ||
          m.used ||
          m.f !== f ||
          !d.hand[ci]
        )
          return;
        const c = d.hand[ci];
        consumeActionCard(f, mi, ci, c.name);
        flowLog(names[f] + " descartou " + c.name + " usando uma ação");
        flow.turn = (flow.turn + 1) % flow.order.length;
        renderFlow();
        $("flowMessage").textContent =
          "Carta descartada; a ação foi consumida. Esse descarte não compra cartas.";
      };
      $("actionRegion").onchange = () => {
        const id = $("actionRegion").value;
        if (!byId(id)) return;
        selected = id;
        for (const m of flow.markers) if (m.f === f && !m.used) m.region = null;
        setMapChoice(null);
        if (preparedMode && preparedMode.f === f) {
          flow.markers[preparedMode.mi].region = id;
          showPlayableAction(
            f,
            preparedMode.ci,
            preparedMode.mi,
            preparedMode.mode,
          );
          return;
        }
        $("discardAction").disabled = true;
        $("cardDetail").innerHTML = "";
        $("handArea")
          .querySelectorAll("[data-card-index]")
          .forEach((x) => {
            x.classList.remove("chosen");
            x.setAttribute("aria-pressed", "false");
          });
      };
      $("actionMarker").onchange = () => {
        preparedMode = null;
        for (const m of flow.markers) if (m.f === f && !m.used) m.region = null;
        setMapChoice(null);
        $("discardAction").disabled = true;
        $("cardDetail").innerHTML = "";
        $("handArea")
          .querySelectorAll("[data-card-index]")
          .forEach((x) => {
            x.classList.remove("chosen");
            x.setAttribute("aria-pressed", "false");
          });
      };
      $("handArea")
        .querySelectorAll("[data-card-index]")
        .forEach((btn) => {
          btn.onclick = () => {
            if ($("showCard").disabled) return;
            if ($("actionDialog").open) {
              closeActionDialog();
              render();
            }
            preparedMode = null;
            setMapChoice(null);
            for (const marker of flow.markers)
              if (marker.f === f && !marker.used) marker.region = null;
            $("handArea")
              .querySelectorAll("[data-card-index]")
              .forEach((x) => {
                x.classList.remove("chosen");
                x.setAttribute("aria-pressed", "false");
              });
            btn.classList.add("chosen");
            btn.setAttribute("aria-pressed", "true");
            $("actionCard").value = btn.dataset.cardIndex;
            $("discardAction").disabled = false;
            $("showCard").onclick();
          };
        });
      $("showCard").onclick = () => {
        let ci = Number($("actionCard").value),
          mi = Number($("actionMarker").value),
          c = flow.decks[f].hand[ci],
          m = flow.markers[mi],
          id = $("actionRegion").value;
        if (!c || !m || m.used || m.f !== f) return;
        if (revisedModes) {
          const modes = revisedModes[c.name] || [];
          $("cardDetail").innerHTML =
            `<h3>${c.name}</h3><p>${experimentalConditions[c.name]}</p>${modes.map((mode, i) => (mode.window === "reação" ? `<p>${mode.label}: disponível como reação na janela indicada.</p>` : `<button type="button" data-mode="${i}">${mode.label}</button>`)).join("")}`;
          $("cardDetail")
            .querySelectorAll("[data-mode]")
            .forEach((button) => {
              button.onclick = () => {
                const mode = modes[Number(button.dataset.mode)];
                preparedMode = { f, ci, mi, mode };
                if (
                  mode.window === "modal" ||
                  [
                    "Frutos da Mata",
                    "Trabalhadores Zumbificado",
                    "Harmônia",
                    "Serviço de Transporte Pirata",
                    "Carta de Corsário",
                    "Pagamento de Impostos",
                    "Remanejando Mortos",
                  ].includes(mode.effect)
                )
                  showPlayableAction(f, ci, mi, mode);
                else {
                  selected = null;
                  m.region = null;
                  $("actionRegion").value = "";
                  $("cardDetail").innerHTML =
                    `<h3>${c.name} · ${mode.label}</h3><p>${experimentalConditions[c.name]}</p><p>Selecione a região no mapa para preparar este modo.</p>`;
                  render();
                }
              };
            });
          return;
        }
        const semRegiao = [
          "Guarda Imperial",
          "Praga Resistente",
          "Conhecimentos da Floresta",
          "Canção de paz",
          "Novas Comandante a Bordo",
        ].includes(c.name);
        if (!semRegiao && !byId(id)) {
          $("cardDetail").innerHTML =
            "<p>Selecione uma região no mapa antes de preparar esta ação.</p>";
          return;
        }
        for (const x of flow.markers) if (x.f === f && !x.used) x.region = null;
        if (!semRegiao) {
          m.region = id;
          selected = id;
        }
        render();
        showPlayableAction(f, ci, mi);
      };
    } else
      $("toScore").onclick = () => {
        beginScoring();
      };
  }

  if (phase === "pontuação")
    $("nextRound").onclick = () => {
      if (game.winner) {
        flow.phase = "fim";
        renderFlow();
        return;
      }
      for (const f of factionIds) {
        if ($("discardRemaining-" + f)?.checked) {
          const deck = flow.decks[f];
          deck.discard.push(...deck.hand.splice(0));
          flowLog(names[f] + " descartou a mão ao fim da rodada.");
        }
      }
      flow.round++;
      flow.markers = [];
      flow.phase = "preparação";
      flow.turn = 0;
      flowLog("Nova rodada.");
      renderFlow();
    };
}
const priorReset = $("reset").onclick;
$("reset").onclick = () => {
  priorReset();
  flow = newFlow();
  battle = null;
  game = newGame();
  $("flowMessage").textContent =
    "Rodada e baralhos restaurados e embaralhados.";
  renderFlow();
};
