// Fluxo da rodada e escolhas dos jogadores; efeitos são resolvidos pelo jogo.
const factionIds = ["imperio", "necromante", "piratas", "elfos"];
// @dados CARTAS
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
  const next = ConflictIslandBase.proximaFacção(
    flow.order,
    flow.turn,
    flow.markers,
  );
  if (!next) return null;
  flow.turn = next.indice;
  return next.faccao;
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
        `<div class="faction-status ${f} ${active === f ? "current" : ""}"><span class="faction-crest ${f}" aria-hidden="true">${factionCrests[f]}</span><div><strong>${names[f]}${active === f ? " · vez" : ""}</strong><span>◈ ${resources[f].ouro} ouro &nbsp; · &nbsp; ◇ ${resources[f].madeira} madeira</span></div><b>${game.score[f]} <small>pts</small></b></div>`,
    )
    .join("");
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
    details = `<p><strong>${bars}/2</strong> Bares Piratas construídos</p><small>Ouro recebido gera pontos na proposta atual.</small>`;
  }
  if (f === "elfos") {
    const forest = elfForestPoints(definitions, state);
    details = `<p><strong>${forest.owned}</strong> florestas dominadas · <strong>${forest.points}</strong> pontos na pontuação de rodada</p><small>Canção de paz pode ser usada antes dos dados.</small>`;
  }
  return `<aside class="faction-info" aria-label="Informações de ${names[f]}"><h3>${names[f]}</h3><p><strong>◆ ${res.ouro}</strong> ouro · <strong>♣ ${res.madeira}</strong> madeira</p><p>${troops} tropas · ${owned} regiões dominadas</p>${details}</aside>`;
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
function bindHandScroll() {
  for (const [id, direction] of [
    ["handPrev", -1],
    ["handNext", 1],
  ])
    $(id).onclick = () => {
      const reduced =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      $("handViewport").scrollBy({
        left: direction * 180,
        behavior: reduced ? "auto" : "smooth",
      });
    };
}
function rescueRegions() {
  const eligible = ConflictIslandBase.opcoesIlhaAVista(state, definitions);
  return definitions.filter((r) => eligible.includes(r.id));
}
function restoreTowerIfLost() {
  const result = ConflictIslandBase.recuperarTorre(state);
  if (!result.ativada) return false;
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
    committed = new Set(a.offers[f]);
  showAuctionHand(f, hand, committed);
  const offers = flow.order
    .map((side) => {
      const cards = a.offers[side].map((i) => flow.decks[side].hand[i]);
      return `<li><strong>${names[side]}</strong>${a.leader === side ? " · maior lance" : ""}${a.passed[side] ? " · passou" : ""}: ${cards.length ? cards.map((c) => c.name + " (" + c.leadership + ")").join(", ") : "nenhuma carta"} — ${cards.reduce((n, c) => n + c.leadership, 0)} liderança</li>`;
    })
    .join("");
  target.innerHTML = `<p><span class="phase">Rodada ${flow.round} · Leilão de liderança</span></p><h3>Vez: ${names[f]}</h3><p>Maior lance: <strong>${a.high}</strong>${a.leader ? " · " + names[a.leader] : ""}. O leilão segue no sentido anti-horário. Selecione cartas adicionais para superar esse valor ou passe para sair do leilão.</p><ul>${offers}</ul><fieldset><legend>Cartas de ${names[f]}</legend>${hand.map((c, i) => `<label><input type="checkbox" id="bid-${i}" ${committed.has(i) ? "checked disabled" : ""}> ${c.name} · liderança ${c.leadership}${committed.has(i) ? " · já oferecida" : ""}</label>`).join("") || "<p>Sem cartas na mão.</p>"}</fieldset><button id="submitBid">Dar lance</button> <button id="passBid">Passar</button><p id="auctionError" role="status"></p><p class="muted">Cartas oferecidas ficam abertas até o fim. Somente o vencedor as descarta; os demais as recuperam.</p>`;
  $("handArea")
    .querySelectorAll("[data-card-index]")
    .forEach((button) => {
      const checkbox = $("bid-" + button.dataset.cardIndex);
      if (!checkbox.disabled)
        checkbox.onchange = () => button.syncBid(checkbox.checked);
    });
  $("submitBid").onclick = () => {
    if (flow.auction !== a || flow.order[a.turn] !== f) return;
    const selected = hand
      .map((c, i) => i)
      .filter((i) => !committed.has(i) && $("bid-" + i).checked);
    let result;
    try {
      result = ConflictIslandBase.registrarLance(a, f, hand, selected);
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
  $("fullscreenPhases").innerHTML = content;
}
function renderFlow() {
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
    html += `${flow.round === 1 ? `<label>Primeiro jogador <select id="orderChoice">${factionIds.map((f) => `<option value="${f}" ${f === flow.order[0] ? "selected" : ""}>${names[f]}</option>`).join("")}</select></label>` : `<p>Primeiro no leilão: <strong>${names[flow.order[0]]}</strong> · líder anterior</p>`} <label>Tamanho da mão <input id="handSize" type="number" min="1" max="10" value="${flow.handSize}" style="width:5rem"></label> <button id="startRound">Preparar rodada</button><p class="muted">A mesa segue no sentido anti-horário: ${factionIds.map((f) => names[f]).join(" → ")} → ${names[factionIds[0]]}. Complete a mão e reembaralhe o descarte quando necessário.</p>`;
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
        `<div class="hand-content"><div class="hand-heading"><div><strong>Sua mão</strong> <small>· ${d.hand.length} ${d.hand.length === 1 ? "carta" : "cartas"}</small></div><div class="hand-tools"><button type="button" id="handPrev" aria-label="Ver cartas anteriores">‹</button><button type="button" id="handNext" aria-label="Ver próximas cartas">›</button></div></div><select id="actionCard" class="hand-select" hidden aria-label="Carta selecionada">${d.hand.map((c, i) => `<option value="${i}">${c.name}</option>`).join("")}</select><div class="hand-wrap"><div class="hand" id="handViewport" aria-label="Cartas de ${names[f]}">${d.hand.map((c, i) => handCard(f, c, i, d.hand.length)).join("") || '<p class="hand-empty">Sua mão está vazia. Você pode passar.</p>'}</div></div><small class="hand-tip">Escolha uma carta para ver o efeito completo e preparar a ação.</small></div>${factionInfo(f)}`;
      html += `<h3>Vez: ${names[f]}</h3><p><strong>Ações disponíveis: ${markers.length}</strong></p><select id="actionMarker" hidden aria-label="Ação disponível">${markers.map(({ m, i }, n) => `<option value="${i}">Ação ${n + 1}</option>`).join("")}</select> <label>Região da próxima ação <select id="actionRegion">${definitions.map((r) => `<option value="${r.id}" ${r.id === selected ? "selected" : ""}>${r.id} · ${r.name}</option>`).join("")}</select></label> <button id="showCard" class="hand-select" hidden ${d.hand.length ? "" : "disabled"}>Examinar carta selecionada</button><div id="cardDetail" class="card-detail"></div><div class="row"><button id="passAction">Passar ação</button><button id="discardAction" disabled>Descartar carta escolhida</button></div><p class="muted">Compra: ${d.draw.length} · mão: ${d.hand.length} · descarte: ${d.discard.length}. Escolha a carta somente ao chegar sua vez.</p>`;
    } else
      html +=
        '<p>Todas as ações foram resolvidas ou passadas.</p><button id="toScore">Ir à pontuação</button>';
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
      $("passAction").onclick = () => {
        let m = flow.markers[Number($("actionMarker").value)];
        m.used = true;
        flowLog(names[f] + " passou uma ação");
        flow.turn = (flow.turn + 1) % flow.order.length;
        renderFlow();
      };
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
      bindHandScroll();
      $("actionRegion").onchange = () => {
        const id = $("actionRegion").value;
        if (!byId(id)) return;
        selected = id;
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
      $("actionMarker").onchange = () => {
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
        if (!c || !m || m.used || m.f !== f || !byId(id)) return;
        for (const x of flow.markers) if (x.f === f && !x.used) x.region = null;
        if (
          ![
            "Guarda Imperial",
            "Praga Resistente",
            "Conhecimentos da Floresta",
            "Canção de paz",
            "Novas Comandante a Bordo",
          ].includes(c.name)
        ) {
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
