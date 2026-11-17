// @aplicacao PONTUACAO
function optRegions(filter = () => true) {
  return definitions
    .filter(filter)
    .map((r) => `<option value="${r.id}">${r.id} · ${r.name}</option>`)
    .join("");
}
function optFactions(f) {
  return factionIds
    .filter((x) => x !== f)
    .map((x) => `<option value="${x}">${names[x]}</option>`)
    .join("");
}
function field(id, label, content) {
  return `<label style="display:block;margin:.5rem 0">${label} <select id="${id}">${content}</select></label>`;
}
function amount(id, label, max = 10) {
  return `<label style="display:block;margin:.5rem 0">${label} <input id="${id}" type="number" min="0" max="${max}" value="0" style="width:5rem"></label>`;
}
function yesno() {
  return field(
    "decision",
    "O outro jogador aceita?",
    '<option value="no">Não</option><option value="yes">Sim</option>',
  );
}
function fail(cond, msg) {
  if (!cond) throw Error(msg);
}
function countValue(id, max = Number.MAX_SAFE_INTEGER) {
  const e = $(id),
    raw = e.value,
    n = Number(raw);
  fail(
    raw !== "" && Number.isSafeInteger(n) && n >= 0 && n <= max,
    "Informe uma quantidade válida.",
  );
  return n;
}
function spend(f, w, g) {
  Object.assign(resources[f], ConflictIslandBase.pagar(resources[f], w, g));
}
function awardElfTrade(a, b) {
  if (a !== "elfos" && b !== "elfos") return;
  const other = a === "elfos" ? b : a,
    key = flow.round + ":" + other;
  if (!game.elfTrades[key]) {
    game.elfTrades[key] = true;
    addPoints("elfos", 1, "troca com " + names[other]);
  }
}
function transfer(from, to, type, n) {
  fail(resources[from][type] >= n, "Recursos insuficientes para a troca.");
  resources[from][type] -= n;
  addResource(to, type, n, "acordo");
  if (n > 0 && !game.winner) awardElfTrade(from, to);
}
function move(from, to, f, n) {
  fail(from !== to && state[from] && state[to], "Movimento inválido.");
  const result = ConflictIslandBase.calcularMovimento(
    state[from].units[f],
    state[to].units[f],
    n,
  );
  state[from].units[f] = result.origem;
  state[to].units[f] = result.destino;
}
function finishAction(f, ci, mi, discardAll, description) {
  const deck = flow.decks[f];
  consumeActionCard(f, mi, ci);
  if (discardAll && !game.winner) {
    deck.discard.push(...deck.hand.splice(0));
    drawTo(f, 5);
  }
  restoreTowerIfLost();
  flowLog(names[f] + ": " + description);
  flow.turn = (flow.turn + 1) % flow.order.length;
  refreshOwners();
  render();
  renderFlow();
  $("flowMessage").textContent = description;
}
function configureActionMap(name, id) {
  let valid = [],
    kind = "destination",
    prefix = "";
  if (name === "Reorganizar Contingente") valid = neighbors(id);
  else if (name === "Carta de Corsário") valid = [id, ...neighbors(id)];
  else if (name === "Atrás do Tesouro") valid = neighbors(id);
  else if (name === "Mercenários Piratas")
    valid = definitions.filter((x) => x.id === id || x.coast).map((x) => x.id);
  else if (name === "Serviço de Transporte Pirata") {
    const from = $("transportOrigin").value;
    valid = definitions
      .filter(
        (x) => x.id !== from && (x.coast || neighbors(from).includes(x.id)),
      )
      .map((x) => x.id);
  } else if (name === "Remanejando Mortos")
    valid = definitions
      .filter((x) => x.id !== id && devastated(state[x.id]))
      .map((x) => x.id);
  else {
    setMapChoice(null);
    return;
  }
  setMapChoice({
    kind,
    prefix,
    valid,
    origin: id,
    hint:
      kind === "destination"
        ? "Clique em uma região destacada para escolher o destino."
        : "Clique em uma região destacada e informe quantos piratas mover.",
  });
  if (kind === "destination" && $("destination"))
    $("destination").onchange = () => {
      const destination = $("destination").value;
      if (valid.includes(destination)) {
        selected = destination;
        $("mapFeedback").textContent =
          "Destino escolhido: " +
          destination +
          " · " +
          byId(destination).name +
          ". Confirme a ação no painel.";
        render();
      }
    };
}
function showRemanejamento(f, ci, mi) {
  const before = clone(state),
    draft = clone(state),
    moves = [],
    eligible = new Set(
      definitions.filter((r) => devastated(draft[r.id])).map((r) => r.id),
    );
  const preview = () => {
    const actual = state;
    try {
      state = draft;
      mapDevastationOverride = eligible;
      render();
    } finally {
      state = actual;
      mapDevastationOverride = null;
    }
  };
  function panel() {
    const origins = definitions.filter(
      (r) =>
        eligible.has(r.id) &&
        draft[r.id].units.necromante > 0 &&
        neighbors(r.id).some((x) => eligible.has(x)),
    );
    $("cardDetail").innerHTML =
      `<h3>Remanejando Mortos</h3><p>Distribua zumbis entre regiões devastadas adjacentes, quantas vezes desejar. Ao terminar, descarte a mão e compre até cinco cartas.</p>${field("remOrigin", "Origem", origins.map((r) => `<option value="${r.id}">${r.id} · ${r.name}</option>`).join(""))}${field("remDestination", "Destino", "")}${amount("remQuantity", "Zumbis a mover", Number.MAX_SAFE_INTEGER)}<button id="remMove">Mover zumbis</button> <button id="remFinish">Concluir ação</button> <button id="remCancel">Cancelar</button><p>Movimentos preparados: ${moves.length}</p><p id="actionError" role="status"></p>`;
    const update = () => {
      const origin = $("remOrigin").value;
      $("remDestination").innerHTML = optRegions(
        (r) => neighbors(origin).includes(r.id) && eligible.has(r.id),
      );
    };
    $("remOrigin").onchange = update;
    update();
    $("remMove").onclick = () => {
      try {
        const origin = $("remOrigin").value,
          destination = $("remDestination").value,
          n = countValue("remQuantity");
        fail(
          draft[origin] &&
            draft[destination] &&
            eligible.has(origin) &&
            eligible.has(destination) &&
            neighbors(origin).includes(destination) &&
            n > 0 &&
            draft[origin].units.necromante >= n,
          "Escolha regiões devastadas adjacentes e tropas disponíveis.",
        );
        const result = ConflictIslandBase.calcularMovimento(
          draft[origin].units.necromante,
          draft[destination].units.necromante,
          n,
        );
        draft[origin].units.necromante = result.origem;
        draft[destination].units.necromante = result.destino;
        moves.push({ origin, destination, n });
        selected = destination;
        preview();
        panel();
      } catch (e) {
        $("actionError").textContent = e.message;
      }
    };
    $("remCancel").onclick = () => {
      render();
      renderFlow();
    };
    $("remFinish").onclick = () => {
      if (JSON.stringify(state) !== JSON.stringify(before)) {
        $("actionError").textContent =
          "O mapa mudou durante a preparação. Cancele e prepare a ação novamente.";
        return;
      }
      state = draft;
      finishAction(
        f,
        ci,
        mi,
        true,
        "Remanejando Mortos: " + moves.length + " movimento(s).",
      );
    };
  }
  panel();
}
function showPlayableAction(f, ci, mi) {
  setMapChoice(null);
  let c = flow.decks[f].hand[ci];
  if (c && c.name === "Remanejando Mortos") {
    showRemanejamento(f, ci, mi);
    return;
  }
  const m = flow.markers[mi];
  if (!c || !m || m.used || m.f !== f) return;
  if (c.name === "Furia da Ilha") {
    showElfFury(f, ci, mi);
    return;
  }
  if (isAttackCard(f, c.name)) {
    showAttackMovement(f, ci, mi);
    return;
  }
  if (c.name === "Carta de Corsário") {
    showCorsair(f, ci, mi);
    return;
  }
  const semMapa = c.name === "Novas Comandante a Bordo";
  const id = m.region ?? selected,
    r = byId(id),
    s = state[id],
    name = c.name;
  let form = "";
  const other = () => field("other", "Outra facção", optFactions(f));
  const destination = (filter = () => true) =>
    field("destination", "Destino / região", optRegions(filter));
  if (name === "Reorganizar Contingente" || name === "Atrás do Tesouro")
    form =
      destination((x) => neighbors(id).includes(x.id)) +
      amount("quantity", "Tropas a mover", 3);
  if (name === "Mercenários Piratas")
    form = field(
      "destination",
      "Destino das novas tropas",
      `<option value="${id}">${id} · permanecer</option>` +
        optRegions((x) => x.id !== id && x.coast),
    );
  if (name === "Serviço de Transporte Pirata")
    form =
      other() +
      yesno() +
      amount("price", "Preço em Ouro", 3) +
      field("transportOrigin", "Origem das tropas", optRegions()) +
      destination() +
      amount("quantity", "Tropas transportadas", Number.MAX_SAFE_INTEGER);
  if (name === "Magia das Trevas")
    form =
      field(
        "spell",
        "Magia",
        "<option>Despertar para a Morte</option><option>Levantar dos Mortos</option><option>Devastar</option><option>Trabalhadores incansáveis</option>",
      ) + other();
  if (name === "O Progresso")
    form = field(
      "tech",
      "Tecnologia",
      Object.entries(technologies)
        .map(
          ([k, v]) =>
            `<option value="${k}">${k} — ${v.wood} Madeira, ${v.gold} Ouro${v.requires ? " · exige " + v.requires : ""}</option>`,
        )
        .join(""),
    );
  if (name === "Assegurar Recursos para o Rei")
    form = amount("extra", "Cópias adicionais a descartar", 4);
  if (name === "Aliança com o Império")
    form =
      other() +
      yesno() +
      field(
        "giveType",
        "Recurso oferecido",
        '<option value="ouro">Ouro</option><option value="madeira">Madeira</option>',
      ) +
      amount("give", "Quantidade oferecida", Number.MAX_SAFE_INTEGER) +
      field(
        "takeType",
        "Recurso pedido",
        '<option value="ouro">Ouro</option><option value="madeira">Madeira</option>',
      ) +
      amount("take", "Quantidade pedida", Number.MAX_SAFE_INTEGER);
  if (name === "Filhos da Floresta")
    form =
      field(
        "filhosCost",
        "Recurso a consumir",
        '<option value="madeira">Madeira</option><option value="ouro">Ouro</option><option value="tropas">Tropa élfica</option>',
      ) + field("filhosOrigin", "Origem, se consumir tropa", optRegions());
  if (name === "Milagre da Floresta")
    form =
      field(
        "miracleGive",
        "Entregar 3 recursos do mesmo tipo",
        '<option value="ouro">Ouro</option><option value="madeira">Madeira</option><option value="tropas">Tropas élficas</option>',
      ) +
      field(
        "miracleTake",
        "Receber 2 recursos de outro tipo",
        '<option value="madeira">Madeira</option><option value="ouro">Ouro</option><option value="tropas">Tropas élficas</option>',
      ) +
      "<details><summary>Distribuir tropas, se forem usadas na conversão</summary><p>Escolha as regiões de origem e de destino. Os destinos precisam ser dominados pelos Elfos.</p>" +
      definitions
        .map(
          (x) =>
            amount("miracleFrom-" + x.id, x.id + " · tropas cedidas", 3) +
            amount("miracleTo-" + x.id, x.id + " · tropas recebidas", 2),
        )
        .join("") +
      "</details>";
  if (name === "Harmônia")
    form =
      other() +
      yesno() +
      amount("giveGold", "Ouro cedido pelos Elfos", Number.MAX_SAFE_INTEGER) +
      amount(
        "giveWood",
        "Madeira cedida pelos Elfos",
        Number.MAX_SAFE_INTEGER,
      ) +
      amount("takeGold", "Ouro recebido pelos Elfos", Number.MAX_SAFE_INTEGER) +
      amount(
        "takeWood",
        "Madeira recebida pelos Elfos",
        Number.MAX_SAFE_INTEGER,
      ) +
      "<details><summary>Distribuir tropas para a troca</summary><p>Distribua as origens e os destinos; as quantidades cedidas e recebidas de cada lado devem ser iguais, e cada destino deve ser dominado pelo recebedor.</p>" +
      definitions
        .map(
          (x) =>
            "<fieldset><legend>" +
            x.id +
            " · " +
            x.name +
            "</legend>" +
            amount(
              "giveFrom-" + x.id,
              "Elfos cedem daqui",
              Number.MAX_SAFE_INTEGER,
            ) +
            amount(
              "giveTo-" + x.id,
              "Outro jogador recebe aqui",
              Number.MAX_SAFE_INTEGER,
            ) +
            amount(
              "takeFrom-" + x.id,
              "Outro jogador cede daqui",
              Number.MAX_SAFE_INTEGER,
            ) +
            amount(
              "takeTo-" + x.id,
              "Elfos recebem aqui",
              Number.MAX_SAFE_INTEGER,
            ) +
            "</fieldset>",
        )
        .join("") +
      "</details>";
  if (name === "Trilhas na Mata")
    form =
      field(
        "elfOrigin",
        "Origem adjacente",
        optRegions((x) => neighbors(id).includes(x.id)),
      ) + amount("quantity", "Tropas a mover", Number.MAX_SAFE_INTEGER);
  if (name === "Pagamento de Impostos")
    form = field(
      "soldierRegion",
      "Região do soldado, se exigido",
      optRegions((x) => state[x.id].units.imperio > 0),
    );
  if (
    name === "Guarda Imperial" ||
    name === "Praga Resistente" ||
    name === "Conhecimentos da Floresta" ||
    name === "Canção de paz"
  ) {
    $("cardDetail").innerHTML =
      "<p>Esta carta é usada como reação no momento indicado em seu texto. Também é possível descartá-la gastando uma ação.</p>";
    return;
  }
  const panel = semMapa ? $("dialogContent") : $("cardDetail");
  if (semMapa) $("cardDetail").innerHTML = "";
  panel.innerHTML = `<h3>${name}</h3><p>${c.text}</p>${semMapa ? "" : `<p class="muted">Região da ação: ${id} · ${r.name}. Condições e escolhas são verificadas antes do consumo.</p>`}${form}<button id="executeAction">Executar ação</button>${semMapa ? ' <button id="cancelActionDialog" type="button">Cancelar</button>' : ""}<p id="actionError" role="status"></p>`;
  if (semMapa) {
    openActionDialog(false);
    $("cancelActionDialog").onclick = closeActionDialog;
  }
  configureActionMap(name, id);
  if (name === "Serviço de Transporte Pirata")
    $("transportOrigin").onchange = () => configureActionMap(name, id);
  $("executeAction").onclick = () => {
    const before = clone(state),
      beforeResources = clone(resources),
      beforeGame = clone(game),
      beforeFlow = clone(flow);
    try {
      executeCard(f, name, id, ci);
      const activeIndex = flow.decks[f].hand.indexOf(c);
      fail(activeIndex >= 0, "Carta ativa indisponível.");
      finishAction(
        f,
        activeIndex,
        mi,
        [
          "Novas Comandante a Bordo",
          "Remanejando Mortos",
          "Monumento a Morte",
          "Filhos da Floresta",
        ].includes(name),
        semMapa ? name : name + " em " + id,
      );
    } catch (e) {
      state = before;
      resources = beforeResources;
      game = beforeGame;
      flow = beforeFlow;
      c = flow.decks[f].hand[ci];
      $("actionError").textContent = e.message;
    }
  };
}
function executeCard(f, name, id, ci) {
  const s = state[id],
    r = byId(id),
    controlled = () => calcOwner(s) === f,
    other = () => $("other").value,
    dest = () => $("destination").value;
  switch (name) {
    case "Filhos da Floresta": {
      const result = ConflictIslandBase.filhosDaFloresta(
        state,
        id,
        resources.elfos,
        $("filhosCost").value,
        $("filhosOrigin").value,
      );
      state = result.mapa;
      Object.assign(resources.elfos, result.saldo);
      break;
    }
    case "Milagre da Floresta": {
      const a = $("miracleGive").value,
        b = $("miracleTake").value,
        from = definitions.map((x) => ({
          id: x.id,
          n: countValue("miracleFrom-" + x.id, 3),
        })),
        to = definitions.map((x) => ({
          id: x.id,
          n: countValue("miracleTo-" + x.id, 2),
        }));
      const result = ConflictIslandBase.milagreDaFloresta(
        state,
        resources.elfos,
        a,
        b,
        from,
        to,
      );
      state = result.mapa;
      Object.assign(resources.elfos, result.saldo);
      break;
    }
    case "Harmônia": {
      const o = other();
      fail(
        o !== "elfos" && s.units[o] > 0,
        "Escolha um adversário com tropas na região.",
      );
      if ($("decision").value === "no") break;
      const gg = countValue("giveGold"),
        gw = countValue("giveWood"),
        tg = countValue("takeGold"),
        tw = countValue("takeWood");
      const moves = definitions.map((x) => ({
        id: x.id,
        gf: countValue("giveFrom-" + x.id),
        gt: countValue("giveTo-" + x.id),
        tf: countValue("takeFrom-" + x.id),
        tt: countValue("takeTo-" + x.id),
      }));
      const { g, t } = ConflictIslandBase.validarHarmonia(
        state,
        resources,
        id,
        o,
        { gg, gw, tg, tw },
        moves,
      );
      transfer("elfos", o, "ouro", gg);
      if (game.winner) break;
      transfer("elfos", o, "madeira", gw);
      if (game.winner) break;
      transfer(o, "elfos", "ouro", tg);
      if (game.winner) break;
      transfer(o, "elfos", "madeira", tw);
      if (game.winner) break;
      state = ConflictIslandBase.tropasHarmonia(state, o, moves);
      if (g || t) awardElfTrade("elfos", o);
      break;
    }
    case "Trilhas na Mata": {
      const from = $("elfOrigin").value,
        n = countValue("quantity"),
        result = ConflictIslandBase.movimentoDeCarta(
          name,
          f,
          state,
          edges,
          from,
          id,
          n,
        );
      state[from].units[f] = result.origem;
      state[id].units[f] = result.destino;
      break;
    }
    case "Frutos da Mata":
    case "Trabalhadores Zumbificado": {
      const resultado = ConflictIslandBase.coletaDeCartas(
        name,
        definitions,
        state,
        id,
        resources[f],
      );
      Object.assign(resources[f], resultado);
      break;
    }
    case "Pirata Aprendiz":
    case "Taverna Pirata":
    case "Projeto de Poder Maligno":
    case "Alistamento": {
      const result = ConflictIslandBase.cartaLocal(
        name,
        f,
        s,
        resources[f],
        state,
        r.resource,
      );
      Object.assign(s, result.regiao);
      Object.assign(resources[f], result.saldo);
      break;
    }
    case "Mercenários Piratas": {
      state = ConflictIslandBase.mercenariosPiratas(
        state,
        definitions,
        id,
        dest(),
      );
      break;
    }
    case "Atrás do Tesouro":
    case "Reorganizar Contingente": {
      const d = dest(),
        n = countValue("quantity", 3),
        result = ConflictIslandBase.movimentoDeCarta(
          name,
          f,
          state,
          edges,
          id,
          d,
          n,
        );
      state[id].units[f] = result.origem;
      state[d].units[f] = result.destino;
      break;
    }
    case "Novas Comandante a Bordo":
      break;
    case "Serviço de Transporte Pirata": {
      const o = other();
      fail(
        s.units[o] > 0 || buildingCount(s, o) > 0,
        "A outra facção precisa estar presente.",
      );
      if ($("decision").value === "no") break;
      const price = countValue("price", 3),
        d = dest(),
        n = countValue("quantity"),
        from = $("transportOrigin").value;
      const result = ConflictIslandBase.transportePirata(
        state,
        definitions,
        edges,
        id,
        o,
        resources[o],
        price,
        from,
        d,
        n,
      );
      transfer(o, "piratas", "ouro", price);
      if (game.winner) break;
      state[from].units[o] = result.origem;
      state[d].units[o] = result.destino;
      break;
    }

    case "Monumento a Morte": {
      const result = ConflictIslandBase.monumentoMorte(
        state,
        id,
        resources.necromante,
      );
      state = result.mapa;
      Object.assign(resources.necromante, result.saldo);
      addPoints("necromante", result.pontos, "Monumento à Morte");
      break;
    }
    case "Magia das Trevas": {
      const result = ConflictIslandBase.magiaDasTrevas(
        state,
        edges,
        id,
        r.resource,
        resources[f],
        $("spell").value,
        other(),
      );
      state = result.mapa;
      Object.assign(resources[f], result.saldo);
      break;
    }
    case "O Progresso": {
      const t = $("tech").value,
        result = ConflictIslandBase.construirTecnologia(
          state,
          id,
          resources.imperio,
          t,
          technologies,
        );
      state = result.mapa;
      Object.assign(resources.imperio, result.saldo);
      addPoints("imperio", result.pontos, "construção de " + t);
      break;
    }
    case "Assegurar Recursos para o Rei": {
      const deck = flow.decks[f],
        result = ConflictIslandBase.coletaImperial(
          s,
          r.resource,
          resources[f],
          deck,
          ci,
          countValue("extra", 4),
          state,
        );
      Object.assign(deck, result.baralho);
      Object.assign(resources[f], result.saldo);
      break;
    }
    case "Aliança com o Império": {
      const o = other();
      fail(
        s.units[o] > 0 || buildingCount(s, o) > 0,
        "Outra facção deve estar presente.",
      );
      if ($("decision").value === "no") break;
      const g = countValue("give", Number.MAX_SAFE_INTEGER),
        t = countValue("take", Number.MAX_SAFE_INTEGER),
        gt = $("giveType").value,
        tt = $("takeType").value;
      ConflictIslandBase.validarAlianca(state, id, o, resources, gt, g, tt, t);
      transfer(f, o, gt, g);
      if (game.winner) break;
      transfer(o, f, tt, t);
      break;
    }
    case "Pagamento de Impostos": {
      const result = ConflictIslandBase.pagarImposto(
        state,
        id,
        resources[f],
        game.tax,
        game.taxPaid,
        $("soldierRegion").value,
      );
      state = result.mapa;
      Object.assign(resources[f], result.saldo);
      addPoints(f, result.pontos, "imposto proposto");
      if (game.winner) break;
      replaceTax();
      game.taxPaid = true;
      game.delay = 0;
      break;
    }
    default:
      throw Error("Efeito ainda não implementado.");
  }
}
function showElfFury(f, ci, mi) {
  const origin = flow.markers[mi].region,
    s = state[origin];
  $("cardDetail").innerHTML =
    `<h3>Furia da Ilha</h3><p>Mova até 3 tropas de ${origin} para uma região adjacente. Se houver tropas inimigas, escolha o defensor e batalhe.</p>${field(
      "destination",
      "Destino",
      optRegions((x) => neighbors(origin).includes(x.id)),
    )}${amount("quantity", "Tropas a mover", 3)}${field("attackDefender", "Defensor, se houver inimigos", optFactions(f))}<button id="elfFuryGo">Confirmar movimento</button><p id="actionError" role="status"></p>`;
  setMapChoice({
    kind: "destination",
    valid: neighbors(origin),
    origin,
    hint: "Escolha uma região adjacente para Furia da Ilha.",
  });
  $("elfFuryGo").onclick = () => {
    try {
      const dest = $("destination").value,
        n = countValue("quantity", 3),
        defender = $("attackDefender").value;
      const { hasEnemy, movimento } = ConflictIslandBase.validarFuria(
        state,
        edges,
        origin,
        dest,
        n,
        defender,
      );
      const before = clone(state);
      state[origin].units.elfos = movimento.origem;
      state[dest].units.elfos = movimento.destino;
      const towerRestored = restoreTowerIfLost();
      if (
        towerRestored &&
        hasEnemy &&
        (state[dest].units[f] < 1 ||
          (state[dest].units[defender] < 1 &&
            buildingCount(state[dest], defender) < 1))
      ) {
        finishAction(
          f,
          ci,
          mi,
          false,
          "Magia da Torre interrompeu o combate antes dos dados; ação consumida.",
        );
        return;
      }
      if (!hasEnemy) {
        finishAction(
          f,
          ci,
          mi,
          false,
          "Furia da Ilha: " +
            n +
            " tropas movidas de " +
            origin +
            " para " +
            dest,
        );
        return;
      }
      battle = {
        f,
        defender,
        region: dest,
        ci,
        mi,
        card: "Furia da Ilha",
        stage: "reaction",
        beforeMove: before,
        towerRestored,
      };
      setMapChoice(null);
      for (const k of [
        "actionMarker",
        "actionRegion",
        "actionCard",
        "showCard",
        "passAction",
        "discardAction",
      ])
        $(k).disabled = true;
      render();
      renderBattle();
    } catch (e) {
      $("actionError").textContent = e.message;
    }
  };
}
function showCorsair(f, ci, mi) {
  const m = flow.markers[mi],
    id = m.region;
  const destinations = optRegions(
    (x) => x.id === id || neighbors(id).includes(x.id),
  );
  $("cardDetail").innerHTML =
    `<h3>Carta de Corsário</h3><p>Proposta de teste: o aliado pode usar os piratas para uma operação imediata, movendo-os a uma região adjacente e opcionalmente atacando ali. A aceitação e todas as escolhas são manuais.</p>${field("corsairAlly", "Facção aliada", optFactions("piratas"))}${yesno()}${amount("price", "Preço em Ouro", 3)}${field("destination", "Destino", destinations)}${amount("quantity", "Piratas a mover", Number.MAX_SAFE_INTEGER)}${field("corsairMode", "Operação", '<option value="move">Mover sem ataque</option><option value="attack">Mover e atacar</option>')}${field("attackDefender", "Defensor se houver ataque", optFactions("piratas"))}<button id="corsairGo">Resolver acordo</button><p id="actionError" role="status"></p>`;
  configureActionMap("Carta de Corsário", id);
  $("corsairGo").onclick = () => {
    const before = clone(state),
      oldResources = clone(resources),
      oldGame = clone(game);
    try {
      const ally = $("corsairAlly").value;
      fail(
        state[id].units[ally] > 0 || buildingCount(state[id], ally) > 0,
        "Aliado precisa estar presente.",
      );
      if ($("decision").value === "no") {
        finishAction(f, ci, mi, false, "Corsário recusado em " + id);
        return;
      }
      const price = countValue("price", 3),
        d = $("destination").value,
        n = countValue("quantity"),
        mode = $("corsairMode").value,
        defender = $("attackDefender").value;
      ConflictIslandBase.validarCorsario(
        state,
        edges,
        id,
        ally,
        resources[ally],
        price,
        d,
        n,
        mode,
        defender,
      );
      transfer(ally, "piratas", "ouro", price);
      if (game.winner) {
        finishAction(
          f,
          ci,
          mi,
          false,
          "Vitória durante o pagamento de Corsário.",
        );
        return;
      }
      if (n) move(id, d, "piratas", n);
      const towerRestored = restoreTowerIfLost();
      if (
        towerRestored &&
        mode === "attack" &&
        (state[d].units.piratas < 1 ||
          (state[d].units[defender] < 1 &&
            buildingCount(state[d], defender) < 1))
      ) {
        finishAction(
          f,
          ci,
          mi,
          false,
          "Magia da Torre interrompeu o combate antes dos dados; ação consumida.",
        );
        return;
      }
      if (mode === "attack") {
        battle = {
          f: "piratas",
          defender,
          region: d,
          ci,
          mi,
          card: "Carta de Corsário",
          stage: "reaction",
          beforeMove: before,
          beforePaymentResources: oldResources,
          beforePaymentGame: oldGame,
          noLoot: false,
          towerRestored,
        };
        setMapChoice(null);
        for (const k of [
          "actionMarker",
          "actionRegion",
          "actionCard",
          "showCard",
          "passAction",
          "discardAction",
        ])
          $(k).disabled = true;
        $("handArea")
          .querySelectorAll("[data-card-index]")
          .forEach((x) => (x.disabled = true));
        render();
        renderBattle();
      } else
        finishAction(
          f,
          ci,
          mi,
          false,
          "Corsário aceito: " + n + " piratas movidos de " + id + " para " + d,
        );
    } catch (e) {
      state = before;
      resources = oldResources;
      game = oldGame;
      $("actionError").textContent = e.message;
    }
  };
}
function showAttackMovement(f, ci, mi) {
  const card = flow.decks[f].hand[ci],
    marker = flow.markers[mi],
    target = marker.region,
    r = byId(target),
    s = state[target],
    name = card.name;
  const coastal = name === "Invasão Costeira",
    localOnly = [
      "Ataque a Linha de Suprimentos",
      "Trabalhe enquanto eles dormem",
    ].includes(name);
  const origins = definitions.filter(
    (x) =>
      !localOnly &&
      x.id !== target &&
      (coastal ? x.coast : neighbors(target).includes(x.id)) &&
      state[x.id].units[f] > 0,
  );
  const max =
    name === "Infestação" || name === "Tambores de Guerra"
      ? 2
      : [
            "Invasão Costeira",
            "Ataque a Linha de Suprimentos",
            "Trabalhe enquanto eles dormem",
            "Marcha Imperial",
          ].includes(name)
        ? 3
        : Number.MAX_SAFE_INTEGER;
  $("cardDetail").innerHTML =
    `<h3>${name}</h3><p>${card.text}</p><p>Alvo: ${target} · ${r.name}. Todas as tropas presentes de cada lado participarão. Escolha tropas a mover das origens permitidas; limite total ${max === Number.MAX_SAFE_INTEGER ? "sem limite" : max}.</p>${field("attackDefender", "Defensor", optFactions(f))}${origins.map((x) => amount("move-" + x.id, x.id + " · " + x.name + " (disponíveis " + state[x.id].units[f] + ")", state[x.id].units[f])).join("") || "<p>Nenhuma origem disponível; tropas já presentes ainda podem atacar.</p>"}<p class="muted">Os saques locais usam as tropas já presentes.</p><button id="prepareAttack">Confirmar ataque</button><p id="actionError" role="status"></p>`;
  setMapChoice({
    kind: "quantities",
    prefix: "move-",
    valid: origins.map((x) => x.id),
    origin: target,
    hint:
      "Clique em uma origem destacada e informe quantas tropas mover para " +
      target +
      ".",
  });
  $("prepareAttack").onclick = () => {
    try {
      const defender = $("attackDefender").value,
        moves = origins.map((x) => ({
          id: x.id,
          n: countValue("move-" + x.id, state[x.id].units[f]),
        })),
        { hasEnemy } = ConflictIslandBase.validarAtaque(
          state,
          definitions,
          edges,
          resources,
          f,
          name,
          target,
          defender,
          moves,
        );
      const beforeMove = clone(state);
      for (const x of moves) if (x.n) move(x.id, target, f, x.n);
      const towerRestored = restoreTowerIfLost();
      if (
        towerRestored &&
        (s.units[f] < 1 ||
          (s.units[defender] < 1 && buildingCount(s, defender) < 1))
      ) {
        finishAction(
          f,
          ci,
          mi,
          false,
          "Magia da Torre interrompeu o combate antes dos dados; ação consumida.",
        );
        return;
      }
      if (coastal && !hasEnemy) {
        finishAction(
          f,
          ci,
          mi,
          false,
          "Invasão Costeira em " +
            target +
            " sem inimigos: movimento realizado sem saque.",
        );
        return;
      }
      battle = {
        f,
        defender,
        region: target,
        ci,
        mi,
        card: name,
        stage: "reaction",
        beforeMove,
        towerRestored,
      };
      setMapChoice(null);
      for (const k of [
        "actionMarker",
        "actionRegion",
        "actionCard",
        "showCard",
        "passAction",
        "discardAction",
      ])
        $(k).disabled = true;
      $("handArea")
        .querySelectorAll("[data-card-index]")
        .forEach((x) => (x.disabled = true));
      render();
      renderBattle();
    } catch (e) {
      $("actionError").textContent = e.message;
    }
  };
}

const fullscreenButton = $("fullscreen");
const exitFullscreenButton = $("exitFullscreen");
const toolsDrawer = $("toolsDrawer");
const toolsHome = toolsDrawer.parentElement;
function updateFullscreenLabel() {
  const active = !!document.fullscreenElement;
  fullscreenButton.textContent = active
    ? "⛶ Sair da tela cheia"
    : "⛶ Tela cheia";
  fullscreenButton.setAttribute(
    "aria-label",
    active ? "Sair da tela cheia" : "Entrar em tela cheia",
  );
}
fullscreenButton.onclick = async () => {
  try {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) await document.exitFullscreen();
    } else if (
      document.documentElement &&
      document.documentElement.requestFullscreen
    )
      await document.documentElement.requestFullscreen();
    else
      $("flowMessage").textContent = "Tela cheia indisponível neste navegador.";
  } catch (error) {
    $("flowMessage").textContent =
      "Não foi possível alterar a tela cheia neste navegador.";
  }
};
exitFullscreenButton.onclick = fullscreenButton.onclick;
if (document.addEventListener)
  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement && document.body)
      document.body.appendChild(toolsDrawer);
    else if (toolsHome) toolsHome.appendChild(toolsDrawer);
    updateFullscreenLabel();
    (document.fullscreenElement
      ? exitFullscreenButton
      : fullscreenButton
    ).focus();
  });
updateFullscreenLabel();
renderFlow();
