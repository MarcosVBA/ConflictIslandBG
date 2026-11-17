/* Regras sem dependências de interface. A cópia no HTML é gerada por scripts/sincronizar-motor.cjs. */
(function (root) {
  'use strict';
  const faccoes = Object.freeze(['imperio', 'necromante', 'piratas', 'elfos']);
  function construcoes(s, f) {
    return s.buildings[f] + (f === 'necromante' ? Number(s.tower) + Number(s.extractor) + Number(s.monument) : f === 'imperio' ? Number(!!s.tech) : f === 'piratas' ? Number(s.bar) : 0);
  }
  function dominio(s) {
    const max = Math.max(...faccoes.map(f => s.units[f]));
    if (max > 0) {
      const leaders = faccoes.filter(f => s.units[f] === max);
      return leaders.length === 1 ? leaders[0] : 'livre';
    }
    const owners = faccoes.filter(f => construcoes(s, f) > 0);
    return owners.length === 1 ? owners[0] : 'livre';
  }
  function devastada(s) {
    return (s.units.necromante > 0 || construcoes(s, 'necromante') > 0) && faccoes.filter(f => f !== 'necromante').every(f => s.units[f] === 0 && construcoes(s, f) === 0);
  }
  function vizinhos(ligacoes, id) {
    return ligacoes.flatMap(([a,b]) => a === id ? [b] : b === id ? [a] : []);
  }
  function pagar(saldo, madeira, ouro) {
    if (saldo.madeira < madeira || saldo.ouro < ouro) throw Error('Recursos insuficientes.');
    return { ...saldo, madeira: saldo.madeira - madeira, ouro: saldo.ouro - ouro };
  }
  function receber(saldo, tipo, quantidade) {
    return { ...saldo, [tipo]: saldo[tipo] + quantidade };
  }
  function proximaFacção(ordem, vez, marcadores) {
    for (let i = 0; i < ordem.length; i++) {
      const indice = (vez + i) % ordem.length, faccao = ordem[indice];
      if (marcadores.some(m => m.f === faccao && !m.used)) return { faccao, indice };
    }
    return null;
  }
  function comprarAte(baralho, alvo, embaralhar) {
    const next = { ...baralho, draw: [...baralho.draw], hand: [...baralho.hand], discard: [...baralho.discard] };
    while (next.hand.length < alvo) {
      if (!next.draw.length) {
        if (!next.discard.length) break;
        next.draw = embaralhar(next.discard); next.discard = [];
      }
      next.hand.push(next.draw.pop());
    }
    return next;
  }
  function calcularDano(atacantes, defensores, dadosAtaque, dadosDefesa, protecaoAtaque = 0, protecaoDefesa = 0) {
    const dados = dadosAtaque.concat(dadosDefesa);
    const swords = dados.reduce((n, face) => n + face[0], 0), crosses = dados.reduce((n, face) => n + face[1], 0);
    const attackDamage = Math.max(0, swords - Math.min(protecaoDefesa, defensores, swords));
    return { swords, crosses, attackDamage, attProtected: Math.min(crosses, protecaoAtaque), defProtected: Math.min(protecaoDefesa, defensores, swords), defenderLoss: Math.min(defensores, attackDamage), attackerLoss: Math.min(atacantes, defensores, Math.max(0, crosses - protecaoAtaque)), overflow: Math.max(0, attackDamage - defensores) };
  }
  function proximoLance(leilao, ordem) {
    for (let step = 1; step <= ordem.length; step++) {
      const indice = (leilao.turn + step) % ordem.length, f = ordem[indice];
      if (!leilao.passed[f] && f !== leilao.leader) return indice;
    }
    return null;
  }
  function registrarLance(leilao, faccao, mao, selecionadas) {
    const atuais = leilao.offers[faccao];
    if (!atuais || !Array.isArray(selecionadas) || !selecionadas.length || new Set(selecionadas).size !== selecionadas.length || selecionadas.some(i => !Number.isInteger(i) || i < 0 || i >= mao.length || atuais.includes(i))) throw Error('Acrescente cartas para superar o maior lance de ' + leilao.high + '.');
    const ofertas = atuais.concat(selecionadas), total = ofertas.reduce((n,i) => n + mao[i].leadership, 0);
    if (!Number.isSafeInteger(total) || total <= leilao.high) throw Error('Acrescente cartas para superar o maior lance de ' + leilao.high + '.');
    return { ...leilao, leader:faccao, high:total, offers:{...leilao.offers,[faccao]:ofertas} };
  }
  const api = Object.freeze({ faccoes, construcoes, dominio, devastada, vizinhos, pagar, receber, proximaFacção, comprarAte, calcularDano, proximoLance, registrarLance });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ConflictIslandBase = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
