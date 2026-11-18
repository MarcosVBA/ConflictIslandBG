// As escolhas dos eventos são aplicadas de uma só vez.
let eventoAtual = null;
function recursoEvento(r) {
  if (game.eventFlags.goldScarce && r.resource === "Ouro" && r.id !== "R11")
    return "Sem recurso";
  if (game.eventFlags.noWood.includes(r.id) && r.resource === "Madeira")
    return "Sem recurso";
  return r.resource;
}
function regioesComRecursos() {
  return definitions.map((r) => ({ ...r, resource: recursoEvento(r) }));
}
function opcoesRegiao(lista = definitions, vazio = false) {
  return (
    (vazio ? '<option value="">Nenhuma</option>' : "") +
    lista
      .map((r) => `<option value="${r.id}">${r.id} · ${r.name}</option>`)
      .join("")
  );
}
function abrirEvento(id, manual = true) {
  const carta = eventos.find((e) => e.id === id);
  if (!carta) throw Error("Evento desconhecido.");
  if (battle || $("actionDialog").open) {
    game.queuedEvent = { id, manual };
    flowLog("Evento " + carta.nome + " aguardará a conclusão da ação.");
    return;
  }
  eventoAtual = { id, manual };
  const florestas = definitions.filter((r) => r.terrain === "floresta");
  const areas = definitions.filter(
    (r) =>
      calcOwner(state[r.id]) === "imperio" &&
      !state[r.id].tech &&
      !state[r.id].buildings.imperio,
  );
  let campos = "";
  if (id === "morte")
    campos = [1, 2]
      .map(
        (i) =>
          `<label>Zumbi extra ${i} <select id="evento-zumbi-${i}">${opcoesRegiao()}</select></label>`,
      )
      .join("");
  if (id === "riqueza")
    campos = [1, 2]
      .map(
        (i) =>
          `<label>Bar ${i} <select id="evento-bar-${i}">${opcoesRegiao(
            definitions.filter((r) => !state[r.id].bar),
            true,
          )}</select></label>`,
      )
      .join("");
  if (id === "colonizacao")
    campos = Object.keys(technologies)
      .filter((t) => !hasTech(t))
      .map(
        (t, i) =>
          `<label>${t} <select id="evento-tech-${i}" data-tech="${t}">${opcoesRegiao(areas, true)}</select></label>`,
      )
      .join("");
  if (id === "incendio") {
    campos =
      factionIds
        .map((f) => {
          const escolhas = [];
          for (const r of florestas) {
            const s = state[r.id];
            if (s.units[f]) escolhas.push([r.id + ":unit", r.id + " · tropa"]);
            if (s.buildings[f])
              escolhas.push([r.id + ":generic", r.id + " · construção"]);
            for (const [dono, chave, label] of [
              ["necromante", "tower", "Torre"],
              ["necromante", "extractor", "Extrator"],
              ["necromante", "monument", "Monumento"],
              ["piratas", "bar", "Bar"],
              ["imperio", "tech", "Tecnologia"],
            ])
              if (f === dono && s[chave])
                escolhas.push([r.id + ":" + chave, r.id + " · " + label]);
          }
          return `<label>${names[f]} <select id="evento-peca-${f}">${escolhas.length ? escolhas.map(([v, l]) => `<option value="${v}">${l}</option>`).join("") : '<option value="">Sem peça na floresta</option>'}</select></label>`;
        })
        .join("") +
      `<label>Região sem produção de Madeira <select id="evento-madeira">${opcoesRegiao(definitions.filter((r) => r.resource === "Madeira"))}</select></label>`;
  }
  $("eventoConteudo").innerHTML =
    `<h2>${carta.nome}</h2><p><strong>Condição:</strong> ${carta.condicao}</p><p>${carta.efeito}</p>${manual ? "<p>Execução manual: a condição foi ignorada.</p>" : ""}${campos}<p id="eventoErro" role="status"></p><button id="aplicarEvento" type="button">Aplicar evento</button>${manual ? '<button id="cancelarEvento" type="button">Cancelar</button>' : ""}`;
  $("aplicarEvento").onclick = aplicarEventoAtual;
  if (manual)
    $("cancelarEvento").onclick = () => {
      eventoAtual = null;
      $("eventoDialog").close();
    };
  ensureMinimizeButton($("eventoDialog"), "evento");
  if (
    typeof $("eventoDialog").showModal === "function" &&
    !$("eventoDialog").open
  )
    $("eventoDialog").showModal();
}
function removerPecaEvento(s, f, key) {
  if (key === "unit") s.units[f]--;
  else if (key === "generic") s.buildings[f]--;
  else {
    if (key === "bar") penalidadeBar();
    s[key] = key === "tech" ? null : false;
  }
}
function limparFaccaoEvento(s, f) {
  s.units[f] = 0;
  s.buildings[f] = 0;
  if (f === "imperio") s.tech = null;
  if (f === "piratas" && s.bar) {
    penalidadeBar();
    s.bar = false;
  }
  if (f === "necromante") {
    s.tower = false;
    s.extractor = false;
    s.monument = false;
  }
}
function aplicarEventoAtual() {
  if (!eventoAtual) return;
  const { id, manual } = eventoAtual;
  const get = (id) => $(id).value;
  if (id === "riqueza") {
    const ids = [get("evento-bar-1"), get("evento-bar-2")].filter(Boolean);
    const existentes = Object.values(state).filter((s) => s.bar).length;
    const necessarios = Math.min(
      2,
      3 - existentes,
      definitions.length - existentes,
    );
    if (
      ids.length !== necessarios ||
      new Set(ids).size !== ids.length ||
      ids.some((x) => !state[x] || state[x].bar)
    ) {
      $("eventoErro").textContent =
        `Escolha ${necessarios} região(ões) distintas sem Bar, respeitando o limite de três.`;
      return;
    }
    game.eventFlags.pirateWealth = true;
    for (const x of ids) state[x].bar = true;
  }
  if (id === "colonizacao") {
    const techs = Object.keys(technologies).filter((t) => !hasTech(t));
    const escolhas = techs
      .map((t, i) => [t, get("evento-tech-" + i)])
      .filter(([, r]) => r);
    if (
      new Set(escolhas.map((x) => x[1])).size !== escolhas.length ||
      escolhas.some(
        ([, r]) =>
          !state[r] ||
          calcOwner(state[r]) !== "imperio" ||
          state[r].tech ||
          state[r].buildings.imperio,
      )
    ) {
      $("eventoErro").textContent =
        "Escolha regiões dominadas distintas e sem construção imperial.";
      return;
    }
    for (const [t, r] of escolhas) state[r].tech = t;
  }
  if (id === "morte") {
    for (const s of Object.values(state))
      if (!s.units.necromante) s.units.necromante++;
    for (const i of [1, 2]) state[get("evento-zumbi-" + i)].units.necromante++;
  }
  if (id === "vinganca")
    for (const r of definitions.filter((r) => r.terrain === "floresta")) {
      for (const f of factionIds.filter((f) => f !== "elfos"))
        limparFaccaoEvento(state[r.id], f);
      state[r.id].units.elfos++;
    }
  if (id === "fome")
    for (const s of Object.values(state))
      for (const f of factionIds.filter((f) => f !== "necromante"))
        s.units[f] = 0;
  if (id === "incendio") {
    for (const f of factionIds) {
      const valor = get("evento-peca-" + f);
      if (valor) {
        const [r, key] = valor.split(":");
        removerPecaEvento(state[r], f, key);
      }
    }
    const r = get("evento-madeira");
    if (!game.eventFlags.noWood.includes(r)) game.eventFlags.noWood.push(r);
  }
  if (id === "escassez") game.eventFlags.goldScarce = true;
  if (id === "guerra")
    for (const s of Object.values(state))
      if (
        factionIds.filter((f) => s.units[f] || buildingCount(s, f)).length > 1
      )
        for (const f of factionIds) limparFaccaoEvento(s, f);
  flowLog(
    "Evento " +
      eventos.find((e) => e.id === id).nome +
      (manual ? " aplicado manualmente." : " aplicado."),
  );
  eventoAtual = null;
  if ($("eventoDialog").open) $("eventoDialog").close();
  restoreTowerIfLost();
  refreshOwners();
  render();
  renderFlow();
}
function iniciarEventoPendente() {
  if (eventoAtual || battle || $("actionDialog").open || game.winner) return;
  if (game.queuedEvent) {
    const item = game.queuedEvent;
    game.queuedEvent = null;
    abrirEvento(item.id, item.manual);
    return;
  }
  if (flow.phase !== "pontuação" || !game.eventPending) return;
  game.eventPending = false;
  if (!game.eventDeck.length)
    game.eventDeck = shuffle(eventos.map((e) => e.id));
  while (game.eventDeck.length) {
    const id = game.eventDeck.shift();
    game.eventDiscard.push(id);
    const carta = eventos.find((e) => e.id === id);
    flowLog("Evento revelado: " + carta.nome + ".");
    if (ConflictIslandBase.condicaoEvento(id, game.score, state, factionIds)) {
      abrirEvento(id, false);
      return;
    }
  }
}
function abrirSeletorEventos() {
  ensureMinimizeButton($("eventoEscolhaDialog"), "seleção de evento");
  $("eventoEscolhaDialog").showModal();
}
function instalarEventos() {
  $("executarEvento").onclick = () => {
    const id = $("eventoEscolha").value;
    $("eventoEscolhaDialog").close();
    abrirEvento(id, true);
  };
  $("fecharEventos").onclick = () => $("eventoEscolhaDialog").close();
  $("eventoEscolha").innerHTML = eventos
    .map((e) => `<option value="${e.id}">${e.nome}</option>`)
    .join("");
  $("eventoDialog").oncancel = (e) => e.preventDefault();
}
