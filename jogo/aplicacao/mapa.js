// Estado: regiões por ID com controle e contadores; seleção e histórico são locais à sessão.
// @dados MAPA
// @artes
const names = {
  livre: "Livre",
  imperio: "Império",
  necromante: "Necromante",
  piratas: "Piratas",
  elfos: "Elfos",
};
const terrains = {
  praia: "Praia",
  floresta: "Floresta",
  montanha: "Montanha",
  planicie: "Planície",
};
const byId = (id) => definitions.find((r) => r.id === id);
const neighbors = (id) => ConflictIslandBase.vizinhos(edges, id);
const sides = ["imperio", "necromante", "piratas", "elfos"];
function escapeAttribute(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function buildingCount(s, f) {
  return ConflictIslandBase.construcoes(s, f);
}
function calcOwner(s) {
  return ConflictIslandBase.dominio(s);
}
function devastated(s) {
  return ConflictIslandBase.devastada(s);
}
function refreshOwners() {
  for (const s of Object.values(state)) s.owner = calcOwner(s);
}
const initial = () => ConflictIslandBase.cenarioInicial(definitions);
const initialResources = () => ConflictIslandBase.recursosIniciais();
let resources = initialResources();
let state = initial(),
  selected = "R1",
  history = [],
  visualMarkers = [],
  mapChoice = null,
  regionPulse = null,
  mapDevastationOverride = null;
const $ = (id) => document.getElementById(id);
const clone = (x) => JSON.parse(JSON.stringify(x));
function diagnostics() {
  let failures = [];
  const check = (v, s) => {
    if (!v) failures.push(s);
  };
  const ids = definitions.map((r) => r.id);
  check(
    ids.length === 11 && new Set(ids).size === 11,
    "Devem existir onze IDs únicos.",
  );
  for (const [owner, n] of Object.entries({
    livre: 4,
    imperio: 2,
    necromante: 2,
    piratas: 1,
    elfos: 2,
  }))
    check(
      definitions.filter((r) => r.owner === owner).length === n,
      "Distribuição inicial de " + owner,
    );
  const forests = definitions.filter((r) => r.terrain === "floresta");
  check(
    [3, 4].includes(forests.length) &&
      forests.every((r) => r.resource === "Madeira"),
    "Florestas e madeira",
  );
  check(
    [4, 5].includes(definitions.filter((r) => r.coast).length),
    "Quantidade de costas",
  );
  check(
    byId("R1").resource === "Ouro" &&
      byId("R1").coast &&
      byId("R5").resource === "Sem recurso" &&
      byId("R5").coast &&
      byId("R3").terrain === "montanha",
    "Praias e Torre",
  );
  check(
    !byId("R7").coast &&
      byId("R7").resource === "Sem recurso" &&
      ["R9", "R11"].every(
        (id) => byId(id).coast && byId(id).resource === "Ouro",
      ),
    "Costa e recursos de R7, R9 e R11",
  );
  check(
    edges.every(([a, b]) => ids.includes(a) && ids.includes(b) && a !== b),
    "Conexão inválida",
  );
  check(
    new Set(edges.map((e) => [...e].sort().join("-"))).size === edges.length,
    "Conexão duplicada",
  );
  check(
    !neighbors("R3").includes("R7") &&
      !neighbors("R9").includes("R11") &&
      !neighbors("R9").includes("R7") &&
      !neighbors("R9").includes("R1") &&
      !neighbors("R6").includes("R8") &&
      neighbors("R7").includes("R11"),
    "Conexões aprovadas e removidas",
  );
  let reached = new Set([ids[0]]),
    queue = [ids[0]];
  while (queue.length) {
    for (const n of neighbors(queue.shift()))
      if (!reached.has(n)) {
        reached.add(n);
        queue.push(n);
      }
  }
  check(reached.size === 11, "Mapa desconectado");
  check(
    !neighbors("R3").some((id) => ["R1", "R2", "R5"].includes(id)),
    "Torre próxima de outro início",
  );
  check(
    definitions.every(
      (r) =>
        r.name &&
        terrains[r.terrain] &&
        typeof r.coast === "boolean" &&
        r.resource &&
        names[r.owner],
    ),
    "Dados de região incompletos",
  );
  $("diagnostics").innerHTML = failures.length
    ? failures.map((x) => '<li class="error">' + x + "</li>").join("")
    : '<li class="ok">Verificações aprovadas: regiões, controles, recursos, costa e conexões.</li>';
}
const meepleIcon =
  '<svg viewBox="0 0 24 26" aria-hidden="true"><path d="M12 1.5c-2.2 0-3.8 1.6-3.8 3.7 0 1.2.5 2.2 1.4 2.9l-2.5 1L2 11.5l1.3 4.1 4-1.2-.9 5.2-2 3.9h5.9l1.7-3.9 1.7 3.9h5.9l-2-3.9-.9-5.2 4 1.2 1.3-4.1-5.1-2.4-2.5-1c.9-.7 1.4-1.7 1.4-2.9 0-2.1-1.6-3.7-3.8-3.7Z"/></svg>';
function troopDots(s) {
  return sides
    .map((f) => {
      const n = s.units[f];
      if (!n) return "";
      const pieces = Array.from(
        { length: Math.min(n, 12) },
        () => '<i class="troop-meeple">' + meepleIcon + "</i>",
      ).join("");
      return `<span class="troop-group ${f}" title="${names[f]}: ${n}" aria-label="${names[f]}: ${n} tropas">${pieces}${n > 12 ? "<em>+" + (n - 12) + "</em>" : ""}</span>`;
    })
    .join("");
}
function buildingDescription(s) {
  const items = [
    s.tower ? "Torre" : null,
    s.extractor ? "Extrator" : null,
    s.monument ? "Monumento" : null,
    s.tech ? "Tecnologia " + s.tech : null,
    s.bar ? "Bar Pirata" : null,
    ...sides
      .filter((f) => s.buildings[f])
      .map((f) => names[f] + ": " + s.buildings[f] + " construções"),
  ].filter(Boolean);
  return items.join(", ") || "nenhuma";
}
function buildingIcons(s) {
  return [
    s.tower ? ["♜", "Torre", "necromante"] : null,
    s.extractor ? ["⚙", "Extrator", "necromante"] : null,
    s.monument ? ["✝", "Monumento", "necromante"] : null,
    s.tech ? ["⚒", s.tech, "imperio"] : null,
    s.bar ? ["♨", "Bar Pirata", "piratas"] : null,
    ...sides
      .filter((f) => s.buildings[f])
      .map((f) => [
        "▣" + (s.buildings[f] > 1 ? s.buildings[f] : ""),
        names[f] + ": " + s.buildings[f] + " construções",
        f,
      ]),
  ]
    .filter(Boolean)
    .map(
      ([icon, label, f]) =>
        `<span class="building-icon ${f}" title="${label} · ${names[f]}" aria-label="${label} · ${names[f]}">${icon}</span>`,
    )
    .join("");
}
function resourceIcon(resource) {
  if (resource === "Ouro")
    return '<span class="resource-token gold" title="Ouro" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M10 1 18 9.5 10 19 2 9.5z"/></svg></span>';
  if (resource === "Madeira")
    return '<span class="resource-token wood" title="Madeira" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M10 1 16 9h-3l4 5H12v5H8v-5H3l4-5H4z"/></svg></span>';
  return "";
}
function setMapChoice(choice) {
  mapChoice = choice;
  const feedback = $("mapFeedback");
  if (feedback)
    feedback.textContent = choice
      ? choice.hint
      : "Selecione uma região para inspecionar.";
  render();
}
function focusMapRegion(id) {
  const map = $("map"),
    button = map.querySelector?.('[data-region="' + id + '"]');
  if (button && button.focus) button.focus({ preventScroll: true });
}
function chooseMapRegion(id, returnFocus = false) {
  if (!mapChoice) return false;
  if (!mapChoice.valid.includes(id)) {
    selected = id;
    regionPulse = id;
    render();
    if (returnFocus) focusMapRegion(id);
    const msg = $("mapFeedback");
    if (msg)
      msg.textContent =
        "Região inspecionada; ela não é válida para esta ação. " +
        mapChoice.hint;
    return true;
  }
  selected = id;
  regionPulse = id;
  if (mapChoice.kind === "recruit") {
    $("imperialRecruit").value = id;
    $("mapFeedback").textContent =
      "Região escolhida para alistamento: " +
      id +
      " · " +
      byId(id).name +
      ". Confirme no painel.";
  } else if (mapChoice.kind === "rescue") {
    $("rescueRegion").value = id;
    $("mapFeedback").textContent =
      "Região escolhida: " +
      id +
      " · " +
      byId(id).name +
      ". Confirme no painel.";
  } else if (mapChoice.kind === "destination") {
    $("destination").value = id;
    $("mapFeedback").textContent =
      "Destino escolhido: " +
      id +
      " · " +
      byId(id).name +
      ". Confirme a ação no painel.";
  } else {
    const input = $(mapChoice.prefix + id);
    if (input && input.focus) input.focus();
    $("mapFeedback").textContent =
      "Região " + id + " selecionada. Informe a quantidade no painel.";
  }
  render();
  if (
    returnFocus &&
    ["destination", "rescue", "recruit"].includes(mapChoice.kind)
  )
    focusMapRegion(id);
  return true;
}
function render() {
  refreshOwners();
  const map = $("map");
  map.querySelectorAll(".region").forEach((e) => e.remove());
  const adj = neighbors(selected);
  for (const r of definitions) {
    let s = state[r.id],
      b = document.createElement("button");
    b.className = `region ${r.terrain} ${s.owner} ${r.id === selected ? "selected" : ""} ${adj.includes(r.id) ? "adj" : ""} ${mapChoice ? (mapChoice.valid.includes(r.id) ? "map-valid" : "map-invalid") : ""} ${mapChoice && mapChoice.origin === r.id ? "map-origin" : ""} ${regionPulse === r.id ? "region-pop" : ""}`;
    b.style.left = r.x + "%";
    b.style.top = r.y + "%";
    const art = visualAssets.regioes[r.id];
    if (typeof art === "string" && art) {
      b.style.backgroundImage =
        "linear-gradient(#142a2088,#142a20cc),url(" + JSON.stringify(art) + ")";
      b.style.backgroundSize = "cover";
      b.style.backgroundPosition = "center";
    }
    b.setAttribute("data-region", r.id);
    b.setAttribute("aria-pressed", r.id === selected);
    b.setAttribute(
      "aria-label",
      `${r.id}, ${r.name}, ${terrains[r.terrain]}, ${r.coast ? "costeira, " : ""}${r.resource}, controle ${names[s.owner]}, tropas: ${sides.map((f) => names[f] + " " + s.units[f]).join(", ")}, construções: ${buildingDescription(s)}`,
    );
    b.innerHTML = `<span class="region-id">${r.id}${r.coast ? " · ⚓" : ""}</span><span class="region-top"><strong>${r.name}</strong></span><span class="region-meta">${terrains[r.terrain]}</span><span class="region-pieces"><span class="troops">${troopDots(s)}</span><span class="region-buildings">${buildingIcons(s)}${devastated(s) || mapDevastationOverride?.has(r.id) ? '<span class="devastated-icon" title="Região devastada">☠</span>' : ""}</span>${resourceIcon(r.resource)}</span>`;
    b.onclick = () => {
      const returnFocus = document.activeElement === b;
      if (mapChoice && chooseMapRegion(r.id, returnFocus)) return;
      selected = r.id;
      regionPulse = r.id;
      render();
      const actionRegion = $("actionRegion");
      if (
        actionRegion &&
        !actionRegion.disabled &&
        actionRegion.value !== r.id
      ) {
        actionRegion.value = r.id;
        if (actionRegion.onchange) actionRegion.onchange();
      }
      if (returnFocus) focusMapRegion(r.id);
    };
    map.appendChild(b);
  }
  drawMapConnections();
  regionPulse = null;
  const r = byId(selected),
    s = state[selected];
  $("details").innerHTML =
    `<h3>${r.id} · ${r.name}</h3><dl><dt>Terreno</dt><dd>${terrains[r.terrain]}</dd><dt>Costa</dt><dd>${r.coast ? "⚓ Sim" : "Não"}</dd><dt>Recurso</dt><dd>${r.resource}</dd><dt>Controle</dt><dd>${names[s.owner]}</dd><dt>Ocupantes</dt><dd>Soldados ${s.units.imperio} · Zumbis ${s.units.necromante} · Piratas ${s.units.piratas} · Elfos ${s.units.elfos}</dd><dt>Construções</dt><dd>${[s.tower ? "Torre Esquecida" : "", s.extractor ? "Extrator do Necromante" : "", s.monument ? "Monumento à Morte" : "", s.tech ? "Tecnologia: " + s.tech : "", s.bar ? "Bar Pirata" : "", ...sides.filter((f) => s.buildings[f]).map((f) => names[f] + ": " + s.buildings[f])].filter(Boolean).join(" · ") || "Nenhuma"}</dd><dt>Devastada</dt><dd>${devastated(s) || mapDevastationOverride?.has(r.id) ? "Sim" : "Não"}</dd><dt>Adjacentes</dt><dd>${adj.map((id) => id + " " + byId(id).name).join(", ")}</dd></dl>`;
  $("tower").checked = s.tower;
  $("extractor").checked = s.extractor;
  for (const f of sides) $("build-" + f).value = s.buildings[f];
  for (const f of ["imperio", "necromante", "piratas", "elfos"])
    $(f).value = s.units[f];
  $("resources").innerHTML = ["imperio", "necromante", "piratas", "elfos"]
    .map(
      (f) =>
        `<p><strong>${names[f]}</strong> · Ouro <input type="number" min="0" step="1" id="${f}-ouro" value="${resources[f].ouro}" aria-label="Ouro: ${names[f]}" style="width:5rem"> · Madeira <input type="number" min="0" step="1" id="${f}-madeira" value="${resources[f].madeira}" aria-label="Madeira: ${names[f]}" style="width:5rem"></p>`,
    )
    .join("");
  $("history").innerHTML = history.length
    ? [...history]
        .reverse()
        .map((h) => "<li>" + h.description + "</li>")
        .join("")
    : "<li>Nenhuma alteração manual.</li>";
  $("undo").disabled = !history.length;
}
function drawMapConnections() {
  const map = $("map"),
    rect =
      typeof map.getBoundingClientRect === "function"
        ? map.getBoundingClientRect()
        : null;
  const cards = Array.from(map.querySelectorAll(".region"));
  const boxes =
    rect && rect.width && rect.height
      ? cards.map((el) => {
          const r = el.getBoundingClientRect();
          return {
            id: el.getAttribute("data-region"),
            left: ((r.left - rect.left) / rect.width) * 100 - 1,
            right: ((r.right - rect.left) / rect.width) * 100 + 1,
            top: ((r.top - rect.top) / rect.height) * 100 - 1,
            bottom: ((r.bottom - rect.top) / rect.height) * 100 + 1,
          };
        })
      : [];
  const drawn = [],
    paths = [],
    orient = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x),
    crosses = (a, b, c, d) =>
      orient(a, b, c) * orient(a, b, d) < 0 &&
      orient(c, d, a) * orient(c, d, b) < 0;
  for (const [a, b] of edges) {
    const from = byId(a),
      to = byId(b),
      dx = to.x - from.x,
      dy = to.y - from.y,
      length = Math.hypot(dx, dy) || 1;
    let best = null;
    for (const bend of [
      0, 8, -8, 16, -16, 25, -25, 36, -36, 48, -48, 65, -65,
    ]) {
      const cx = (from.x + to.x) / 2 - (dy / length) * bend,
        cy = (from.y + to.y) / 2 + (dx / length) * bend,
        points = [];
      let penalty = Math.abs(bend) * 0.02;
      for (let i = 0; i <= 30; i++) {
        const t = i / 30,
          x = (1 - t) ** 2 * from.x + 2 * (1 - t) * t * cx + t * t * to.x,
          y = (1 - t) ** 2 * from.y + 2 * (1 - t) * t * cy + t * t * to.y;
        points.push({ x, y });
        if (x < 0 || x > 100 || y < 0 || y > 100) penalty += 1000;
        if (
          boxes.some(
            (r) =>
              r.id !== a &&
              r.id !== b &&
              x >= r.left &&
              x <= r.right &&
              y >= r.top &&
              y <= r.bottom,
          )
        )
          penalty += 100;
      }
      for (const prior of drawn) {
        if ([prior.a, prior.b].includes(a) || [prior.a, prior.b].includes(b))
          continue;
        for (let i = 1; i < points.length; i++)
          for (let j = 1; j < prior.points.length; j++)
            if (
              crosses(
                points[i - 1],
                points[i],
                prior.points[j - 1],
                prior.points[j],
              )
            )
              penalty += 200;
      }
      if (!best || penalty < best.penalty) best = { cx, cy, points, penalty };
    }
    drawn.push({ a, b, points: best.points });
    const active = a === selected || b === selected;
    paths.push({
      active,
      html: `<path data-edge="${a}-${b}" class="${active ? "selected-connection" : ""}" d="M ${from.x} ${from.y} Q ${best.cx} ${best.cy} ${to.x} ${to.y}"></path>`,
    });
  }
  $("lines").innerHTML = paths
    .sort((x, y) => Number(x.active) - Number(y.active))
    .map((p) => p.html)
    .join("");
}
if (typeof window !== "undefined" && window.addEventListener)
  window.addEventListener("resize", drawMapConnections);
function describe(s) {
  return `${names[s.owner]}; soldados ${s.units.imperio}, zumbis ${s.units.necromante}, piratas ${s.units.piratas}; torre ${s.tower ? "sim" : "não"}, extrator ${s.extractor ? "sim" : "não"}, construções ${sides.map((f) => names[f] + " " + s.buildings[f]).join(", ")}`;
}
function change(next) {
  const before = clone(state[selected]);
  if (JSON.stringify(before) === JSON.stringify(next)) {
    $("message").textContent = "Nenhuma alteração.";
    return;
  }
  history.push({
    id: selected,
    before,
    description: `${selected}: ${describe(before)} → ${describe(next)}`,
  });
  state[selected] = next;
  $("message").textContent = "Alteração aplicada.";
  render();
}
$("apply").onclick = () => {
  const units = {};
  for (const f of ["imperio", "necromante", "piratas", "elfos"]) {
    const raw = $(f).value,
      n = Number(raw);
    if (raw.trim() === "" || !Number.isSafeInteger(n) || n < 0) {
      $("message").textContent =
        "Informe quantidades inteiras e não negativas.";
      return;
    }
    units[f] = n;
  }
  const buildings = {};
  for (const f of sides) {
    const raw = $("build-" + f).value,
      n = Number(raw);
    if (raw.trim() === "" || !Number.isSafeInteger(n) || n < 0 || n > 50) {
      $("message").textContent = "Informe construções inteiras de 0 a 50.";
      return;
    }
    buildings[f] = n;
  }
  change({
    ...state[selected],
    owner: "livre",
    units,
    extractor: $("extractor").checked,
    tower: $("tower").checked,
    buildings,
  });
};
$("clear").onclick = () =>
  change({
    owner: "livre",
    units: { imperio: 0, necromante: 0, piratas: 0, elfos: 0 },
    extractor: false,
    tower: false,
    monument: false,
    tech: null,
    bar: false,
    buildings: { imperio: 0, necromante: 0, piratas: 0, elfos: 0 },
  });
$("undo").onclick = () => {
  const h = history[history.length - 1];
  if (h && h.kind === "battle" && JSON.stringify(flow) !== h.afterFlow) {
    $("message").textContent =
      "O fluxo avançou após o combate; não é possível desfazê-lo isoladamente.";
    return;
  }
  history.pop();
  if (h) {
    if (h.kind === "battle") {
      if (h.beforeState) state = clone(h.beforeState);
      else state[h.id] = h.before;
      resources = h.resources;
      selected = h.id;
      flow = clone(h.beforeFlow);
      game = clone(h.beforeGame);
      battle = null;
      renderFlow();
    } else if (h.kind === "resources") {
      resources = h.before;
    } else {
      state[h.id] = h.before;
      selected = h.id;
    }
    $("message").textContent = "Última alteração desfeita.";
    render();
  }
};
$("reset").onclick = () => {
  state = initial();
  resources = initialResources();
  history = [];
  selected = "R1";
  $("message").textContent = "Cenário inicial restaurado.";
  diagnostics();
  render();
};
$("applyResources").onclick = () => {
  const next = {};
  for (const f of ["imperio", "necromante", "piratas", "elfos"]) {
    next[f] = {};
    for (const k of ["ouro", "madeira"]) {
      const raw = $(f + "-" + k).value,
        n = Number(raw);
      if (raw.trim() === "" || !Number.isSafeInteger(n) || n < 0) {
        $("resourceMessage").textContent =
          "Informe quantidades inteiras e não negativas.";
        return;
      }
      next[f][k] = n;
    }
  }
  if (JSON.stringify(next) === JSON.stringify(resources)) {
    $("resourceMessage").textContent = "Nenhuma alteração.";
    return;
  }
  const before = clone(resources);
  const describeResources = (x) =>
    Object.entries(x)
      .map(
        ([f, v]) =>
          names[f] + ": " + v.ouro + " ouro, " + v.madeira + " madeira",
      )
      .join("; ");
  history.push({
    kind: "resources",
    before,
    description:
      "Recursos: " +
      describeResources(before) +
      " → " +
      describeResources(next),
  });
  resources = next;
  $("resourceMessage").textContent = "Recursos atualizados.";
  render();
};
$("toggleRegionInfo").onclick = () => {
  const info = $("regionInfo");
  info.hidden = !info.hidden;
  const visible = !info.hidden;
  $("toggleRegionInfo").setAttribute("aria-pressed", String(visible));
  $("toggleRegionInfo").textContent = visible
    ? "Ocultar informações das regiões"
    : "Mostrar informações das regiões";
};
diagnostics();
render();
