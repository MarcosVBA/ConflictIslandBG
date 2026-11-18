// Batalhas: apenas cartas que explicitamente determinam ataque/saque abrem o fluxo.
const attackNames = {
  elfos: ["Furia da Ilha"],
  piratas: [
    "Invasão Costeira",
    "Ataque a Linha de Suprimentos",
    "Trabalhe enquanto eles dormem",
  ],
  necromante: ["Ataque Zumbi", "Infestação", "Horda interminável"],
  imperio: ["Marcha Imperial", "Tambores de Guerra"],
};
function isAttackCard(f, n) {
  return (attackNames[f] || []).includes(n);
}
let battle = null;
let minimizedDialog = null;
let selectionBeforeMinimize = null;
const resumeModalButton = document.createElement("button");
resumeModalButton.type = "button";
resumeModalButton.id = "resumeModal";
resumeModalButton.hidden = true;
document.body.appendChild(resumeModalButton);
function minimizeDialog(dialog, label) {
  if (!dialog.open) return;
  selectionBeforeMinimize = selected;
  minimizedDialog = dialog;
  resumeModalButton.textContent = "Retomar " + label;
  resumeModalButton.hidden = false;
  dialog.close();
  resumeModalButton.focus();
}
resumeModalButton.onclick = () => {
  if (!minimizedDialog) return;
  const dialog = minimizedDialog;
  selected = selectionBeforeMinimize;
  render();
  dialog.showModal();
  minimizedDialog = null;
  resumeModalButton.hidden = true;
  dialog.focus();
};
for (const eventName of ["click", "keydown", "input", "change"]) {
  document.addEventListener(
    eventName,
    (event) => {
      if (!minimizedDialog) return;
      const target = event.target;
      if (
        target === resumeModalButton ||
        target.closest?.("#mapArea, #toggleRegionInfo")
      )
        return;
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    true,
  );
}
function ensureMinimizeButton(dialog, label) {
  let button = dialog.querySelector(".minimize-modal");
  if (!button) {
    button = document.createElement("button");
    button.type = "button";
    button.className = "minimize-modal";
    button.textContent = "Minimizar";
    dialog.prepend(button);
  }
  button.onclick = () => minimizeDialog(dialog, label);
}

function openActionDialog(required, nonModal = false) {
  const dialog = $("actionDialog");
  const panel = $("dialogContent");
  if (!panel.numericLimits && typeof panel.addEventListener === "function") {
    panel.addEventListener(
      "input",
      (event) => {
        const input = event.target;
        if (input.type !== "number" || input.value === "") return;
        const min = Number(input.min || 0);
        const max = Number(input.max || Number.MAX_SAFE_INTEGER);
        input.value = Math.max(
          min,
          Math.min(max, Math.floor(Number(input.value) || 0)),
        );
      },
      true,
    );
    panel.numericLimits = true;
  }
  if (dialog.open && dialog.classList.contains("nonmodal") !== nonModal)
    dialog.close();
  dialog.classList.toggle("nonmodal", nonModal);
  if (!required) dialog.querySelector(".minimize-modal")?.remove();
  dialog.oncancel = (event) => {
    if (required) event.preventDefault();
  };
  dialog.onclose = () => {
    if (!dialog.open && minimizedDialog !== dialog) {
      $("dialogContent").innerHTML = "";
      if (!battle) {
        if (dialog.classList.contains("nonmodal")) render();
        preparedMode = null;
        setMapChoice(null);
        for (const marker of flow.markers)
          if (!marker.used) marker.region = null;
      }
    }
  };
  if (!dialog.open) {
    if (nonModal && typeof dialog.show === "function") dialog.show();
    else if (typeof dialog.showModal === "function") dialog.showModal();
  }
}
function closeActionDialog() {
  const dialog = $("actionDialog");
  if (dialog.open && typeof dialog.close === "function") dialog.close();
  $("dialogContent").innerHTML = "";
}
const attackFaces = [
  [0, 0],
  [0, 0],
  [0, 0],
  [1, 0],
  [1, 1],
  [2, 1],
];
const defenseFaces = [
  [0, 0],
  [1, 0],
  [0, 1],
  [0, 1],
  [0, 2],
  [1, 1],
];
function rollDice(count, faces, random = Math.random) {
  return ConflictIslandBase.rolarDados(count, faces, random);
}
function battleDamage(
  a,
  d,
  attRoll,
  defRoll,
  attProtection = 0,
  defProtection = 0,
) {
  return ConflictIslandBase.calcularDano(
    a,
    d,
    attRoll,
    defRoll,
    attProtection,
    defProtection,
  );
}
function diceRow(label, dice) {
  if (!dice.length)
    return `<div class="dice-row"><strong>${label}</strong><p>Nenhum dado de defesa.</p></div>`;
  return `<div class="dice-row"><strong>${label}</strong><div class="dice-tray">${dice.map(([swords, crosses]) => `<span class="game-die" role="img" aria-label="${swords} espadas, ${crosses} cruzes">${"⚔".repeat(swords)}${"✚".repeat(crosses)}${!swords && !crosses ? "—" : ""}</span>`).join("")}</div></div>`;
}
function buildingPieces(s, f) {
  const list = [];
  if (f === "necromante" && s.tower)
    list.push({ key: "tower", label: "Torre Esquecida" });
  if (f === "necromante" && s.extractor)
    list.push({ key: "extractor", label: "Extrator" });
  if (f === "necromante" && s.monument)
    list.push({ key: "monument", label: "Monumento à Morte" });
  if (f === "imperio" && s.tech) list.push({ key: "tech", label: s.tech });
  if (f === "piratas" && s.bar) list.push({ key: "bar", label: "Bar Pirata" });
  for (let i = 0; i < s.buildings[f]; i++)
    list.push({
      key: "generic",
      label: "Construção " + names[f] + " " + (i + 1),
    });
  return list;
}
function lootGold(res, defender, amount) {
  const result = ConflictIslandBase.saquear(res, defender, amount);
  Object.assign(res[defender], result.recursos[defender]);
  Object.assign(res.piratas, result.recursos.piratas);
  return result.origens;
}
function showAuctionHand(f, hand, committed, selected, updateTotal) {
  const area = $("handArea");
  area.hidden = false;
  area.setAttribute("data-faction", f);
  area.innerHTML = `<div class="hand-content"><div class="hand-heading"><strong>Lance de ${names[f]} · selecione cartas para acrescentar</strong></div><div class="hand-wrap"><div class="hand" aria-label="Cartas de ${names[f]} para o leilão">${hand.map((c, i) => handCard(f, c, i, hand.length)).join("") || '<p class="hand-empty">Nenhuma carta na mão.</p>'}</div></div></div>`;
  renderFactionStatus(f);
  area.querySelectorAll("[data-card-index]").forEach((button) => {
    const i = Number(button.dataset.cardIndex);
    if (committed.has(i)) {
      button.disabled = true;
      button.classList.add("bid-selected");
      button.setAttribute("aria-pressed", "true");
      return;
    }
    button.setAttribute("aria-pressed", "false");
    button.onclick = () => {
      if (selected.has(i)) selected.delete(i);
      else selected.add(i);
      button.classList.toggle("bid-selected", selected.has(i));
      button.setAttribute("aria-pressed", String(selected.has(i)));
      updateTotal();
    };
  });
}
function showBattleHand(f) {
  const d = flow.decks[f],
    area = $("handArea");
  area.hidden = false;
  area.setAttribute("data-faction", f);
  area.innerHTML = `<div class="hand-content"><div class="hand-heading"><div><strong>Mão de ${names[f]}</strong> <small>· ${d.hand.length} cartas</small></div></div><div class="hand-wrap"><div class="hand" aria-label="Cartas de ${names[f]}">${d.hand.map((c, i) => handCard(f, c, i, d.hand.length).replace('<button type="button"', '<button type="button" disabled')).join("") || '<p class="hand-empty">Nenhuma carta na mão.</p>'}</div></div></div>`;
  renderFactionStatus(f);
}
function consumeActionCard(f, markerIndex, cardIndex, expected) {
  const deck = flow.decks[f],
    result = ConflictIslandBase.consumirCarta(
      flow.markers,
      deck,
      f,
      markerIndex,
      cardIndex,
      expected,
    );
  Object.assign(flow.markers[markerIndex], result.marcadores[markerIndex]);
  Object.assign(deck, result.baralho);
}
function commitBattleCard(f, markerIndex, cardIndex, expected) {
  consumeActionCard(f, markerIndex, cardIndex, expected);
}
function commitReactionCard(f, markerIndex, cardIndex, expected) {
  const deck = flow.decks[f];
  const card = deck.hand[cardIndex];
  if (!card || card.name !== expected) throw Error("Carta indisponível.");
  deck.discard.push(deck.hand.splice(cardIndex, 1)[0]);
}
function renderBattle() {
  if (!battle) return;
  const b = battle,
    s = state[b.region],
    panel = $("dialogContent");
  openActionDialog(true);
  ensureMinimizeButton($("actionDialog"), "combate");
  if (b.stage === "reaction" && !b.attackCommitted) {
    try {
      commitBattleCard(b.f, b.mi, b.ci, b.physicalCard || b.card);
      b.attackCommitted = true;
      flowLog(
        names[b.f] +
          " declarou " +
          (b.physicalCard || b.card) +
          (b.modeLabel ? " · " + b.modeLabel : "") +
          " em " +
          b.region +
          ".",
      );
    } catch (e) {
      panel.innerHTML =
        '<p role="alert">' +
        e.message +
        " Restaure o cenário para continuar.</p>";
      return;
    }
  }
  if (
    revisedModes &&
    b.stage === "reaction" &&
    b.f === "piratas" &&
    !b.windDecided
  ) {
    const available = ConflictIslandBase.reacaoDisponivel(
      flow.markers,
      flow.decks.piratas,
      "piratas",
      "Vento a Favor",
    );
    if (available) {
      showBattleHand("piratas");
      const defenseCount = Math.max(0, s.units[b.defender] - s.units.piratas);
      panel.innerHTML = `<h3>Vento a Favor</h3><p>Descarte a carta para usar um dos modos.</p>${defenseCount ? '<button id="suppressDefense">Descartar dados de defesa</button>' : ""}<button id="extraLoot">Recolher mais espólios</button><button id="skipWind">Não usar</button>`;
      const choose = (kind) => {
        commitReactionCard(
          "piratas",
          available.acao,
          available.carta,
          "Vento a Favor",
        );
        b.suppressDefense = kind === "defesa";
        b.extraLoot = kind === "ouro";
        b.windDecided = true;
        flowLog(
          "Piratas usaram Vento a Favor: " +
            (b.suppressDefense
              ? "dados de defesa suprimidos."
              : "Ouro extra em caso de sucesso."),
        );
        renderBattle();
      };
      if (defenseCount) $("suppressDefense").onclick = () => choose("defesa");
      $("extraLoot").onclick = () => choose("ouro");
      $("skipWind").onclick = () => {
        b.windDecided = true;
        renderBattle();
      };
      return;
    }
    b.windDecided = true;
  }
  if (
    !revisedModes &&
    b.stage === "reaction" &&
    b.f === "elfos" &&
    !b.attackerReactionDecided
  ) {
    const available = ConflictIslandBase.reacaoDisponivel(
      flow.markers,
      flow.decks.elfos,
      "elfos",
      "Conhecimentos da Floresta",
    );
    if (available) {
      showBattleHand("elfos");
      panel.innerHTML = `<h3>Reação do atacante</h3><p>Gaste outra ação para ignorar o primeiro dano neste combate.</p><button id="useAttackDefense">Usar Conhecimentos da Floresta</button><button id="skipAttackDefense">Não usar</button>`;
      $("useAttackDefense").onclick = () => {
        commitReactionCard(
          "elfos",
          available.acao,
          available.carta,
          "Conhecimentos da Floresta",
        );
        b.attackerReactionProtection = 1;
        b.attackerReactionDecided = true;
        flowLog("Elfos usaram Conhecimentos da Floresta no ataque.");
        renderBattle();
      };
      $("skipAttackDefense").onclick = () => {
        b.attackerReactionDecided = true;
        renderBattle();
      };
      return;
    }
    b.attackerReactionDecided = true;
  }
  if (b.stage === "reaction") {
    showBattleHand(b.defender);
    const defenseName =
      b.defender === "imperio"
        ? "Guarda Imperial"
        : !revisedModes && b.defender === "necromante"
          ? "Praga Resistente"
          : !revisedModes && b.defender === "elfos"
            ? "Conhecimentos da Floresta"
            : null;
    const available = ConflictIslandBase.reacaoDisponivel(
        flow.markers,
        flow.decks[b.defender],
        b.defender,
        defenseName,
      ),
      cardIndex = available?.carta,
      markerIndex = available?.acao;
    const canReact = !!available;
    if (revisedModes && !canReact) {
      Object.assign(b, ConflictIslandBase.decidirReacao(b, "passar"));
      renderBattle();
      return;
    }
    panel.innerHTML = `<h3>Combate em ${b.region}</h3><p>${names[b.f]} enfrenta ${names[b.defender]}. O ataque e sua ação já foram gastos.</p><p>${names[b.defender]} decide se usa uma reação defensiva antes de os Elfos decidirem sobre ${revisedModes ? "Defesa Global" : "Canção de paz"}.</p>${canReact ? `<button id="useDefense">Usar ${defenseName}</button>` : "<p>Nenhuma reação defensiva disponível.</p>"}<button id="skipDefense">Não reagir</button><p id="battleError" role="status"></p>`;
    if (canReact)
      $("useDefense").onclick = () => {
        if (battle !== b || b.stage !== "reaction") return;
        try {
          commitReactionCard(b.defender, markerIndex, cardIndex, defenseName);
          Object.assign(
            b,
            ConflictIslandBase.decidirReacao(b, "defesa", {
              marker: markerIndex,
              name: defenseName,
              protecao: b.defender === "imperio" && hasTech("Quartel") ? 2 : 1,
            }),
          );
          flowLog(names[b.defender] + " usou " + defenseName + ".");
          renderBattle();
        } catch (e) {
          $("battleError").textContent = e.message;
        }
      };
    $("skipDefense").onclick = () => {
      if (battle !== b || b.stage !== "reaction") return;
      Object.assign(b, ConflictIslandBase.decidirReacao(b, "passar"));
      renderBattle();
    };
    return;
  }
  if (b.stage === "peace") {
    if (revisedModes) {
      const available = ConflictIslandBase.reacaoDisponivel(
        flow.markers,
        flow.decks.elfos,
        "elfos",
        "Trilhas na Mata / Defesa Global",
      );
      if (!available || (!s.units[b.f] && !s.units[b.defender])) {
        Object.assign(b, ConflictIslandBase.decidirReacao(b, "passar"));
        renderBattle();
        return;
      }
      showBattleHand("elfos");
      panel.innerHTML = `<h3>Defesa Global</h3><p>Os Elfos podem descartar a carta para proteger um lado com tropas.</p>${s.units[b.f] ? `<button id="protectAttacker">Proteger ${names[b.f]}</button>` : ""}${s.units[b.defender] ? `<button id="protectDefender">Proteger ${names[b.defender]}</button>` : ""}<button id="skipGlobal">Não usar</button>`;
      const protect = (side) => {
        commitReactionCard(
          "elfos",
          available.acao,
          available.carta,
          "Trilhas na Mata / Defesa Global",
        );
        if (side === "attacker")
          b.attackerReactionProtection =
            (b.attackerReactionProtection || 0) + 1;
        else b.defProtection = (b.defProtection || 0) + 1;
        flowLog(
          "Elfos usaram Trilhas na Mata / Defesa Global · Defesa Global para proteger " +
            names[side === "attacker" ? b.f : b.defender] +
            ".",
        );
        Object.assign(b, ConflictIslandBase.decidirReacao(b, "passar"));
        renderBattle();
      };
      if (s.units[b.f])
        $("protectAttacker").onclick = () => protect("attacker");
      if (s.units[b.defender])
        $("protectDefender").onclick = () => protect("defender");
      $("skipGlobal").onclick = () => {
        Object.assign(b, ConflictIslandBase.decidirReacao(b, "passar"));
        renderBattle();
      };
      return;
    }
    showBattleHand("elfos");
    const available = ConflictIslandBase.reacaoDisponivel(
        flow.markers,
        flow.decks.elfos,
        "elfos",
        "Canção de paz",
      ),
      markerIndex = available?.acao,
      cardIndex = available?.carta,
      canPeace = !!available;
    panel.innerHTML = `<h3>Canção de paz</h3><p>${b.reaction ? names[b.defender] + " usou " + b.reaction.name + "." : "O defensor não usou reação."} Os Elfos decidem se cancelam este combate antes dos dados.</p>${canPeace ? '<button id="usePeace">Usar Canção de paz</button>' : "<p>Os Elfos não têm a carta e uma ação disponíveis.</p>"}<button id="skipPeace">${canPeace ? "Não usar Canção de paz" : "Continuar"}</button><p id="battleError" role="status"></p>`;
    if (canPeace)
      $("usePeace").onclick = () => {
        if (battle !== b || b.stage !== "peace") return;
        try {
          commitReactionCard("elfos", markerIndex, cardIndex, "Canção de paz");
          Object.assign(
            b,
            ConflictIslandBase.decidirReacao(b, "paz", { marker: markerIndex }),
          );
          flowLog("Elfos usaram Canção de paz: combate 0 a 0.");
          renderBattle();
        } catch (e) {
          $("battleError").textContent = e.message;
        }
      };
    $("skipPeace").onclick = () => {
      if (battle !== b || b.stage !== "peace") return;
      Object.assign(b, ConflictIslandBase.decidirReacao(b, "passar"));
      renderBattle();
    };
    return;
  }
  if (b.stage === "roll") {
    showBattleHand(b.f);
    panel.innerHTML = `<h3>${b.peace ? "Paz garantida" : "Tudo pronto para a batalha"}</h3><p>${b.peace ? "O combate será resolvido como 0 a 0. As cartas e ações já declaradas permanecem gastas." : "As reações foram resolvidas. Role os dados para conhecer o resultado."}</p><button id="rollBattle">${b.peace ? "Concluir resultado 0 a 0" : "Rolar dados"}</button><p id="battleError" role="status"></p>`;
    $("rollBattle").onclick = () => {
      if (battle !== b || b.stage !== "roll") return;
      const current = state[b.region];
      if (
        current.units[b.f] < 1 ||
        (current.units[b.defender] < 1 &&
          buildingCount(current, b.defender) < 1)
      ) {
        $("battleError").textContent =
          "O estado do combate mudou. Restaure as peças para continuar.";
        return;
      }
      b.before = clone(current);
      b.beforeResources = clone(resources);
      b.attackerCount = current.units[b.f];
      b.defenderCount = current.units[b.defender];
      b.attackDice = b.peace ? [] : rollDice(b.attackerCount, attackFaces);
      b.defenseDice =
        b.peace || b.suppressDefense
          ? []
          : rollDice(
              Math.max(0, b.defenderCount - b.attackerCount),
              defenseFaces,
            );
      b.attProtection = [
        "Trabalhe enquanto eles dormem",
        "Horda interminável",
        "Tambores de Guerra",
      ].includes(b.card)
        ? 1
        : 0;
      b.attProtection += b.attackerReactionProtection || 0;
      b.result = battleDamage(
        b.attackerCount,
        b.defenderCount,
        b.attackDice,
        b.defenseDice,
        b.attProtection,
        b.defProtection,
      );
      b.pieces = buildingPieces(current, b.defender);
      b.destroy = Math.min(b.result.overflow, b.pieces.length);
      b.stage = "result";
      renderBattle();
    };
    return;
  }
  const result = b.result,
    face = (x) => `⚔ ${x[0]} / ✚ ${x[1]}`;
  panel.innerHTML = `<div class="battle-result-heading"><small>COMBATE · RESULTADO</small><h3>O destino foi lançado</h3></div>${b.peace ? "<p>Canção de paz: combate cancelado com resultado 0 a 0. Movimentos e custos já realizados permanecem.</p>" : ""}${b.peace ? "" : diceRow("Dados de ataque", b.attackDice) + diceRow("Dados de defesa", b.defenseDice)}<div class="battle-result-summary"><p><strong>${result.swords} espadas · ${result.crosses} cruzes</strong></p><p>Dano ignorado pelo atacante: ${result.attProtected}; pelo defensor: ${result.defProtected}.</p><p>Baixas simultâneas: ${result.attackerLoss} de ${names[b.f]} e ${result.defenderLoss} de ${names[b.defender]}; dano excedente: ${result.overflow}. Destruir ${b.destroy} construção(ões) do defensor.</p></div>${b.destroy ? "<fieldset><legend>Escolha exatamente " + b.destroy + " construção(ões) atingidas</legend>" + b.pieces.map((x, i) => `<label style="display:block"><input type="checkbox" class="destroyBuilding" value="${i}" ${b.destroy === b.pieces.length ? "checked" : ""}> ${x.label}</label>`).join("") + "</fieldset>" : ""}${b.card === "Marcha Imperial" && hasTech("Fortaleza") && !b.rerolled && !b.peace ? '<label>Dado para rerrolar <select id="rerollDie">' + b.attackDice.map((x, i) => `<option value="a${i}">Ataque ${i + 1}: ${face(x)}</option>`).join("") + b.defenseDice.map((x, i) => `<option value="d${i}">Defesa ${i + 1}: ${face(x)}</option>`).join("") + '</select></label><button id="rerollBattle">Rerrolar um dado</button>' : ""}<p class="notice">A rolagem já foi feita. Aplique o resultado antes de continuar; escolha as construções se houver alternativas.</p><button id="applyBattle">Aplicar resultado e concluir ação</button><p id="battleError" role="status"></p>`;
  if (
    b.card === "Marcha Imperial" &&
    hasTech("Fortaleza") &&
    !b.rerolled &&
    !b.peace
  )
    $("rerollBattle").onclick = () => {
      const value = $("rerollDie").value,
        kind = value[0],
        index = Number(value.slice(1)),
        dice =
          kind === "a" ? b.attackDice : kind === "d" ? b.defenseDice : null;
      if (
        !dice ||
        !Number.isInteger(index) ||
        index < 0 ||
        index >= dice.length
      )
        return;
      dice[index] = rollDice(1, kind === "a" ? attackFaces : defenseFaces)[0];
      b.rerolled = true;
      b.result = battleDamage(
        b.attackerCount,
        b.defenderCount,
        b.attackDice,
        b.defenseDice,
        b.attProtection,
        b.defProtection,
      );
      b.destroy = Math.min(b.result.overflow, b.pieces.length);
      renderBattle();
    };
  if (b.destroy) {
    const choices = Array.from(panel.querySelectorAll(".destroyBuilding"));
    const updateChoices = () => {
      const selected = choices.filter((choice) => choice.checked).length;
      for (const choice of choices)
        choice.disabled = !choice.checked && selected >= b.destroy;
      $("applyBattle").disabled = selected !== b.destroy;
    };
    for (const choice of choices) choice.onchange = updateChoices;
    updateChoices();
  }
  $("applyBattle").onclick = () => {
    if (battle !== b || b.stage !== "result") return;
    if (
      JSON.stringify(state[b.region]) !== JSON.stringify(b.before) ||
      JSON.stringify(resources) !== JSON.stringify(b.beforeResources)
    ) {
      $("battleError").textContent =
        "O mapa ou recursos mudaram após a rolagem. Restaure-os aos valores anteriores para aplicar este resultado, ou restaure o cenário inteiro.";
      return;
    }
    const chosen = Array.from(
      panel.querySelectorAll(".destroyBuilding:checked"),
    ).map((x) => Number(x.value));
    if (
      chosen.length !== b.destroy ||
      new Set(chosen).size !== chosen.length ||
      chosen.some((i) => !b.pieces[i])
    ) {
      $("battleError").textContent =
        "Escolha exatamente " + b.destroy + " construção(ões).";
      return;
    }
    const region = state[b.region];
    let resolved;
    try {
      resolved = ConflictIslandBase.aplicarBaixas(
        region,
        b.f,
        b.defender,
        result,
        b.pieces,
        chosen,
        b.destroy,
      );
    } catch (e) {
      $("battleError").textContent = e.message;
      return;
    }
    Object.assign(region, resolved);
    const success = result.attackDamage > 0 && region.units[b.f] > 0;
    let loot = [];
    if (success && b.f === "piratas" && !b.noLoot)
      loot = lootGold(
        resources,
        b.defender,
        b.card === "Ataque a Linha de Suprimentos" || b.extraLoot ? 2 : 1,
      );
    flow.turn = (flow.turn + 1) % flow.order.length;
    const towerRestoredAfter = restoreTowerIfLost();
    afterBattle(
      b,
      region,
      result,
      loot,
      !!(revisedModes && b.card === "Infestação" && towerRestoredAfter),
    );
    const note = `${b.physicalCard || b.card}${b.modeLabel ? " · " + b.modeLabel : ""} em ${b.region}: ${result.defenderLoss} defensores e ${result.attackerLoss} atacantes eliminados; ${b.destroy} construções destruídas; ataque ${success ? "bem-sucedido" : "sem sucesso"}${loot.length ? "; Ouro: " + loot.join(" e ") : ""}${b.reaction ? "; " + b.reaction.name + " consumiu uma ação" : ""}. Efeitos de combate aplicados.`;
    flowLog(note);
    battle = null;
    selected = b.region;
    render();
    renderFlow();
    $("flowMessage").textContent = note;
  };
}
