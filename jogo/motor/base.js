/* Regras sem dependências de interface. A cópia no HTML é gerada por scripts/sincronizar-motor.cjs. */
(function (root) {
  'use strict';
  const faccoes = Object.freeze(['imperio', 'necromante', 'piratas', 'elfos']);
  function cenarioInicial(regioes) {
    return Object.fromEntries(regioes.map(r => [r.id, { owner:r.owner, units:{imperio:r.id==='R1'?2:r.id==='R2'?1:0,necromante:r.id==='R3'?2:r.id==='R4'?1:0,piratas:r.id==='R5'?1:0,elfos:r.id==='R10'||r.id==='R6'?2:0}, extractor:r.id==='R4', tower:r.id==='R3', monument:false, tech:null, bar:false, buildings:{imperio:0,necromante:0,piratas:0,elfos:0} }]));
  }
  function recursosIniciais() {
    return {imperio:{ouro:1,madeira:0},necromante:{ouro:0,madeira:1},piratas:{ouro:0,madeira:0},elfos:{ouro:0,madeira:0}};
  }
  function fluxoInicial(ids, cartas, valores, embaralhar) {
    const decks={};
    for(const f of ids){const draw=[];for(const [name,count,text] of cartas[f])for(let i=0;i<count;i++)draw.push({name,text,leadership:valores[name]});decks[f]={draw:embaralhar(draw),hand:[],discard:[]}}
    return {round:1,phase:'preparação',order:[...ids],handSize:5,decks,markers:[],turn:0,log:[]};
  }
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
  function pontosFlorestas(regioes, estado) {
    const florestas = regioes.filter(r => r.terrain === 'floresta');
    const dominadas = florestas.filter(r => dominio(estado[r.id]) === 'elfos').length;
    return { owned: dominadas, points: florestas.length && dominadas === florestas.length ? 2 : dominadas >= 2 ? 1 : 0 };
  }
  function pontosDevastacao(estado) {
    const quantidade = Object.values(estado).filter(devastada).length;
    return { quantidade, pontos: quantidade >= 6 ? 4 : quantidade >= 5 ? 3 : quantidade >= 4 ? 2 : quantidade >= 2 ? 1 : 0 };
  }
  function registrarPontos(partida, faccao, quantidade) {
    if (partida.winner) return { partida, marco: false, venceu: false };
    const pontos = partida.score[faccao] + quantidade;
    const marco = pontos >= 20 && !partida.endEventsReady;
    const venceu = pontos >= partida.victoryTarget;
    return { partida:{ ...partida, score:{...partida.score,[faccao]:pontos}, endEventsReady:partida.endEventsReady || marco, winner:venceu ? faccao : null }, marco, venceu };
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
  function calcularMovimento(origem, destino, quantidade) {
    if (!Number.isSafeInteger(quantidade) || quantidade < 0 || origem < quantidade) throw Error('Movimento inválido.');
    return { origem: origem - quantidade, destino: destino + quantidade };
  }
  function cartaLocal(nome, faccao, regiao, saldo, mapa, recurso) {
    const expected = {'Pirata Aprendiz':'piratas','Taverna Pirata':'piratas','Projeto de Poder Maligno':'necromante','Alistamento':'imperio'};
    if (expected[nome] !== faccao || !regiao || !saldo || !mapa) throw Error('Carta ou facção inválida.');
    const next = {...regiao, units:{...regiao.units}, buildings:{...regiao.buildings}};
    let recursos = {...saldo};
    if (nome === 'Pirata Aprendiz') {
      if (!['piratas','livre'].includes(dominio(regiao))) throw Error('A região deve estar sob seu controle ou sem domínio.');
      next.units.piratas++;
    } else if (nome === 'Taverna Pirata') {
      if (dominio(regiao) !== 'piratas' || regiao.bar) throw Error('Exige região controlada sem Bar.');
      if (Object.values(mapa).filter(item => item.bar).length >= 1) throw Error('Limite de um Bar Pirata no mapa.');
      next.bar = true;
    } else if (nome === 'Projeto de Poder Maligno') {
      if (regiao.units.necromante < 1 || recurso === 'Sem recurso' || regiao.extractor) throw Error('Precisa de zumbi, recurso e região sem extrator.');
      next.extractor = true;
    } else {
      if (dominio(regiao) !== 'imperio') throw Error('Região deve ser controlada.');
      recursos = pagar(saldo, 0, 1);
      next.units.imperio += 2;
    }
    return {regiao:next, saldo:recursos};
  }
  function coletaDeCartas(nome, regioes, mapa, id, saldo) {
    const local = mapa[id];
    if (!local || !saldo) throw Error('Região inválida.');
    if (nome === 'Frutos da Mata' && local.units.elfos < 1) throw Error('A região escolhida precisa ter tropas élficas.');
    if (nome === 'Trabalhadores Zumbificado' && !local.extractor) throw Error('A região escolhida precisa ter extrator.');
    if (!['Frutos da Mata','Trabalhadores Zumbificado'].includes(nome)) throw Error('Carta de coleta inválida.');
    const resultado = {...saldo};
    for (const regiao of regioes) {
      const casa = mapa[regiao.id];
      const presente = nome === 'Frutos da Mata' ? casa.units.elfos > 0 : casa.extractor;
      if (presente && regiao.resource !== 'Sem recurso') resultado[regiao.resource === 'Ouro' ? 'ouro' : 'madeira']++;
    }
    return resultado;
  }
  function movimentoDeCarta(nome, faccao, mapa, ligacoes, origem, destino, quantidade) {
    const dono = {'Trilhas na Mata':'elfos','Atrás do Tesouro':'piratas','Reorganizar Contingente':'imperio'};
    if (dono[nome] !== faccao || !mapa[origem] || !mapa[destino] || origem === destino || !vizinhos(ligacoes, origem).includes(destino)) throw Error('Escolha tropas disponíveis e uma região adjacente.');
    if (!Number.isSafeInteger(quantidade) || quantidade < 0 || (nome !== 'Trilhas na Mata' && quantidade > 3) || (nome !== 'Atrás do Tesouro' && quantidade === 0) || (nome === 'Atrás do Tesouro' && mapa[origem].units[faccao] < 1)) throw Error('Escolha tropas disponíveis e uma região adjacente.');
    return calcularMovimento(mapa[origem].units[faccao], mapa[destino].units[faccao], quantidade);
  }
  function filhosDaFloresta(mapa, id, saldo, custo, origem, terreno) {
    const regiao = mapa[id];
    if (!regiao || terreno !== 'floresta') throw Error('Exige região de floresta.');
    const recursos = {...saldo}, next = {...mapa};
    next[id] = {...regiao, units:{...regiao.units}};
    if (custo === 'tropas') {
      if (!mapa[origem] || mapa[origem].units.elfos < 1) throw Error('Escolha uma tropa élfica disponível.');
      if (origem !== id) next[origem] = {...mapa[origem], units:{...mapa[origem].units}};
      next[origem].units.elfos--;
    } else {
      if (!['ouro','madeira'].includes(custo) || recursos[custo] < 1) throw Error('Recurso insuficiente.');
      recursos[custo]--;
    }
    next[id].units.elfos++;
    return {mapa:next, saldo:recursos};
  }
  function milagreDaFloresta(mapa, saldo, entregar, receberTipo, origens, destinos) {
    if (!['ouro','madeira','tropas'].includes(entregar) || !['ouro','madeira','tropas'].includes(receberTipo) || entregar === receberTipo) throw Error('Escolha dois tipos diferentes.');
    const validas = (itens, max) => Array.isArray(itens) && new Set(itens.map(x=>x.id)).size === itens.length && itens.every(x=>mapa[x.id] && Number.isSafeInteger(x.n) && x.n>=0 && x.n<=max);
    if (!validas(origens,3) || !validas(destinos,2)) throw Error('Informe quantidades válidas.');
    if (entregar === 'tropas') {
      if (origens.reduce((n,x)=>n+x.n,0)!==3 || origens.some(x=>mapa[x.id].units.elfos<x.n)) throw Error('Escolha três tropas élficas disponíveis.');
    } else if (saldo[entregar] < 3) throw Error('Recursos insuficientes.');
    if (receberTipo === 'tropas' && (destinos.reduce((n,x)=>n+x.n,0)!==2 || destinos.some(x=>x.n && dominio(mapa[x.id])!=='elfos'))) throw Error('Coloque as duas tropas em regiões dominadas.');
    const next = {...mapa}, recursos={...saldo};
    const alterar = (item, delta) => { if (!item.n) return; if (next[item.id] === mapa[item.id]) next[item.id]={...mapa[item.id],units:{...mapa[item.id].units}}; next[item.id].units.elfos += delta*item.n; };
    if (entregar === 'tropas') origens.forEach(x=>alterar(x,-1)); else recursos[entregar]-=3;
    if (receberTipo === 'tropas') destinos.forEach(x=>alterar(x,1)); else recursos[receberTipo]+=2;
    return {mapa:next,saldo:recursos};
  }
  function mercenariosPiratas(mapa, regioes, origem, destino) {
    if (!mapa[origem]?.bar) throw Error('É necessário um Bar Pirata.');
    if (!mapa[destino] || (destino !== origem && !regioes.find(r=>r.id===destino)?.coast)) throw Error('Destino deve ser uma região costeira.');
    return {...mapa, [destino]:{...mapa[destino],units:{...mapa[destino].units,piratas:mapa[destino].units.piratas+2}}};
  }
  function monumentoMorte(mapa, id, saldo) {
    const local=mapa[id];
    if (!local || !devastada(local) || local.monument || !Object.values(mapa).some(x=>['piratas','imperio','elfos'].includes(dominio(x)))) throw Error('Exige região devastada sem monumento e região dominada por oponente.');
    const recursos=pagar(saldo,1,0), next={...mapa,[id]:{...local,monument:true}};
    return {mapa:next,saldo:recursos,pontos:2*Object.values(next).filter(x=>x.monument).length};
  }
  function construirTecnologia(mapa, id, saldo, nome, tecnologias) {
    const local=mapa[id], tech=tecnologias[nome];
    if (!local || local.units.imperio<1 || local.tech || local.buildings.imperio>0) throw Error('Exige soldados imperiais e ausência de construção imperial.');
    if (!tech) throw Error('Tecnologia inválida.');
    if (tech.requires && !Object.values(mapa).some(x=>x.tech===tech.requires)) throw Error('Exige '+tech.requires+' em outra região.');
    return {mapa:{...mapa,[id]:{...local,tech:nome}},saldo:pagar(saldo,tech.wood,tech.gold),pontos:1};
  }
  function coletaImperial(regiao, recurso, saldo, baralho, indice, extras, mapa) {
    if (!regiao || recurso === 'Sem recurso' || !(regiao.units.imperio>0 || construcoes(regiao,'imperio')>0)) throw Error('Exige recurso e tropas ou construção imperial.');
    const nome='Assegurar Recursos para o Rei';
    if (!Number.isInteger(indice) || baralho.hand[indice]?.name!==nome || !Number.isInteger(extras) || extras<0 || extras>4) throw Error('Carta ou quantidade inválida.');
    const copies=baralho.hand.map((card,i)=>({card,i})).filter(item=>item.i!==indice && item.card.name===nome);
    if(copies.length<extras) throw Error('Cópias extras insuficientes.');
    const mao=[...baralho.hand],descarte=[...baralho.discard];
    for(const item of copies.slice(0,extras).sort((a,b)=>b.i-a.i)) descarte.push(mao.splice(item.i,1)[0]);
    const tipo=recurso==='Ouro'?'ouro':'madeira',tech=tipo==='ouro'?'Mercado Local':'Serraria';
    const quantidade=1+extras+Number(Object.values(mapa).some(item=>item.tech===tech));
    return {baralho:{...baralho,hand:mao,discard:descarte},saldo:receber(saldo,tipo,quantidade),quantidade,tipo};
  }
  function magiaDasTrevas(mapa, ligacoes, id, recurso, saldo, magia, inimigo) {
    const local=mapa[id];
    if (!local) throw Error('Região inválida.');
    let recursos={...saldo};
    const next={...mapa,[id]:{...local,units:{...local.units}}}, alvo=next[id];
    if (magia==='Despertar para a Morte') {
      if (!faccoes.includes(inimigo) || inimigo==='necromante' || local.units[inimigo]<1 || !vizinhos(ligacoes,id).some(x=>mapa[x]&&devastada(mapa[x]))) throw Error('Exige inimigo e adjacência a região devastada.');
      recursos=pagar(saldo,1,0);alvo.units[inimigo]--;alvo.units.necromante++;
    } else if (magia==='Levantar dos Mortos') {
      if (!devastada(local)) throw Error('Região deve estar devastada.');
      recursos=pagar(saldo,1,1);alvo.units.necromante+=3;
    } else if (magia==='Devastar') {
      if (local.units.necromante<1 || !faccoes.some(f=>f!=='necromante'&&local.units[f]>0)) throw Error('Exige zumbi e tropas inimigas.');
      recursos=pagar(saldo,1,2);for(const f of faccoes)if(f!=='necromante')alvo.units[f]=0;alvo.units.necromante--;
    } else if (magia==='Trabalhadores incansáveis') {
      if (recurso==='Sem recurso' || local.extractor) throw Error('Exige recurso e ausência de extrator.');
      recursos=pagar(saldo,3,0);alvo.extractor=true;recursos=receber(recursos,recurso==='Ouro'?'ouro':'madeira',1);
    } else throw Error('Magia inválida.');
    return {mapa:next,saldo:recursos};
  }
  function pagarImposto(mapa, id, saldo, imposto, pago, origemSoldado) {
    if (!mapa[id] || dominio(mapa[id])!=='imperio' || !imposto || pago) throw Error('Exige região controlada e imposto ativo ainda não pago nesta rodada.');
    if (imposto.s && (!mapa[origemSoldado] || mapa[origemSoldado].units.imperio<1)) throw Error('Selecione região com soldado.');
    const recursos=pagar(saldo,imposto.w,imposto.g), next={...mapa};
    if (imposto.s) { const origem=mapa[origemSoldado];next[origemSoldado]={...origem,units:{...origem.units,imperio:origem.units.imperio-1}}; }
    return {mapa:next,saldo:recursos,pontos:imposto.p};
  }
  function substituirImposto(imposto, compra, descarte, embaralhar) {
    let monte=[...compra], usados=[...descarte];
    if(imposto) usados.push(imposto);
    if(!monte.length){monte=embaralhar(usados);usados=[];}
    return {imposto:monte.pop()||null,compra:monte,descarte:usados};
  }
  function opcoesPenalidadeImposto(mapa, regioes, tecnologias, saldo) {
    const construidas=regioes.filter(r=>mapa[r.id].tech);
    const nivel=Math.max(0,...construidas.map(r=>tecnologias[mapa[r.id].tech].level));
    const candidatas=construidas.filter(r=>tecnologias[mapa[r.id].tech].level===nivel).map(r=>r.id);
    const recursos=!candidatas.length || saldo.ouro<=0 || saldo.madeira<=0 ? [] : saldo.ouro===saldo.madeira ? ['ouro','madeira'] : [saldo.ouro<saldo.madeira?'ouro':'madeira'];
    return {candidatas,recursos};
  }
  function validarHarmonia(mapa, recursos, id, outro, oferta, movimentos) {
    if (!faccoes.includes(outro) || outro==='elfos' || !mapa[id] || mapa[id].units[outro]<1) throw Error('Escolha um adversário com tropas na região.');
    const {gg,gw,tg,tw}=oferta;
    if (![gg,gw,tg,tw].every(n=>Number.isSafeInteger(n)&&n>=0) || !Array.isArray(movimentos) || new Set(movimentos.map(x=>x.id)).size!==movimentos.length || movimentos.some(x=>!mapa[x.id] || ![x.gf,x.gt,x.tf,x.tt].every(n=>Number.isSafeInteger(n)&&n>=0))) throw Error('Informe quantidades válidas.');
    const soma=k=>movimentos.reduce((n,x)=>n+x[k],0),g=soma('gf'),t=soma('tf');
    if(g!==soma('gt') || t!==soma('tt')) throw Error('As tropas cedidas e recebidas devem ter quantidades iguais para cada lado.');
    if(recursos.elfos.ouro<gg || recursos.elfos.madeira<gw || recursos[outro].ouro<tg || recursos[outro].madeira<tw) throw Error('Recursos insuficientes.');
    if(movimentos.some(x=>mapa[x.id].units.elfos<x.gf || mapa[x.id].units[outro]<x.tf || (x.gt&&dominio(mapa[x.id])!==outro) || (x.tt&&dominio(mapa[x.id])!=='elfos'))) throw Error('Verifique tropas disponíveis e regiões dominadas pelos recebedores.');
    return {g,t};
  }
  function tropasHarmonia(mapa, outro, movimentos) {
    const next={...mapa};
    for(const x of movimentos) if(x.gf||x.gt||x.tf||x.tt){const local=mapa[x.id];next[x.id]={...local,units:{...local.units,elfos:local.units.elfos+x.tt-x.gf,[outro]:local.units[outro]+x.gt-x.tf}};}
    return next;
  }
  function transportePirata(mapa, regioes, ligacoes, id, outro, saldo, preco, origem, destino, quantidade) {
    if (!faccoes.includes(outro) || outro==='piratas' || !mapa[id] || !(mapa[id].units[outro]>0 || construcoes(mapa[id],outro)>0)) throw Error('A outra facção precisa estar presente.');
    if (!Number.isInteger(preco) || preco<0 || preco>3 || saldo.ouro<preco) throw Error('Preço inválido ou recursos insuficientes.');
    if (!mapa[origem] || !mapa[destino] || origem===destino || !(regioes.find(r=>r.id===destino)?.coast || vizinhos(ligacoes,origem).includes(destino))) throw Error('Escolha origem e destino costeiro ou adjacente à origem.');
    if (!Number.isSafeInteger(quantidade) || quantidade<1 || mapa[origem].units[outro]<quantidade) throw Error('Escolha tropas disponíveis na origem.');
    return calcularMovimento(mapa[origem].units[outro],mapa[destino].units[outro],quantidade);
  }
  function validarAlianca(mapa, id, outro, recursos, oferecerTipo, oferecer, receberTipo, receberValor) {
    if (!faccoes.includes(outro) || outro==='imperio' || !mapa[id] || !(mapa[id].units[outro]>0 || construcoes(mapa[id],outro)>0)) throw Error('Outra facção deve estar presente.');
    if (!['ouro','madeira'].includes(oferecerTipo) || !['ouro','madeira'].includes(receberTipo) || !Number.isSafeInteger(oferecer) || oferecer<0 || !Number.isSafeInteger(receberValor) || receberValor<0) throw Error('Informe recursos e quantidades válidos.');
    if (recursos.imperio[oferecerTipo]<oferecer || recursos[outro][receberTipo]<receberValor) throw Error('Recursos insuficientes para o acordo.');
    return {oferecerTipo,oferecer,receberTipo,receber:receberValor};
  }
  function validarCorsario(mapa, ligacoes, id, aliado, saldo, preco, destino, quantidade, modo, defensor) {
    if (!faccoes.includes(aliado) || aliado==='piratas' || !mapa[id] || !(mapa[id].units[aliado]>0 || construcoes(mapa[id],aliado)>0)) throw Error('Aliado precisa estar presente.');
    if (!Number.isInteger(preco) || preco<0 || preco>3 || !saldo || saldo.ouro<preco) throw Error('Preço inválido ou recursos insuficientes.');
    if (!mapa[destino] || (destino!==id && !vizinhos(ligacoes,id).includes(destino))) throw Error('Escolha a região atual ou um destino adjacente.');
    if (!Number.isSafeInteger(quantidade) || quantidade<0 || mapa[id].units.piratas<quantidade || (destino===id && quantidade!==0)) throw Error('Escolha uma quantidade válida de piratas.');
    if (!['move','attack'].includes(modo)) throw Error('Operação inválida.');
    if (modo==='attack' && (!faccoes.includes(defensor) || defensor===aliado || defensor==='piratas' || !(mapa[destino].units[defensor]>0 || construcoes(mapa[destino],defensor)>0) || mapa[destino].units.piratas+(destino===id?0:quantidade)<1)) throw Error('O ataque exige piratas e uma facção adversária no destino.');
    return destino===id ? null : calcularMovimento(mapa[id].units.piratas,mapa[destino].units.piratas,quantidade);
  }
  function validarAtaque(mapa, regioes, ligacoes, recursos, faccao, nome, alvo, defensor, movimentos) {
    const cartas={elfos:['Furia da Ilha'],piratas:['Invasão Costeira','Ataque a Linha de Suprimentos','Trabalhe enquanto eles dormem'],necromante:['Ataque Zumbi','Infestação','Horda interminável'],imperio:['Marcha Imperial','Tambores de Guerra']};
    const local=mapa[alvo],regiao=regioes.find(r=>r.id===alvo),costeiro=nome==='Invasão Costeira',localOnly=['Ataque a Linha de Suprimentos','Trabalhe enquanto eles dormem'].includes(nome);
    if (!cartas[faccao]?.includes(nome) || !local || !regiao || nome==='Furia da Ilha') throw Error('Carta ou região inválida.');
    const inimigos=faccoes.filter(f=>f!==faccao && (local.units[f]>0 || construcoes(local,f)>0));
    if ((!(costeiro || nome==='Marcha Imperial') || inimigos.length) && !inimigos.includes(defensor)) throw Error('Escolha defensor com tropas ou construções no local.');
    if (costeiro && !regiao.coast) throw Error('Invasão Costeira exige destino costeiro.');
    if (nome==='Ataque a Linha de Suprimentos' && (!recursos[defensor] || recursos[defensor].ouro<1)) throw Error('O inimigo precisa ter Ouro.');
    if (!Array.isArray(movimentos) || new Set(movimentos.map(m=>m.id)).size!==movimentos.length || movimentos.some(m=>!mapa[m.id] || m.id===alvo || !Number.isSafeInteger(m.n) || m.n<0 || m.n>mapa[m.id].units[faccao] || localOnly || (costeiro ? !regioes.find(r=>r.id===m.id)?.coast : !vizinhos(ligacoes,alvo).includes(m.id)))) throw Error('Escolha origens e tropas disponíveis.');
    const total=movimentos.reduce((sum,m)=>sum+m.n,0),max=['Infestação','Tambores de Guerra'].includes(nome)?2:['Invasão Costeira','Ataque a Linha de Suprimentos','Trabalhe enquanto eles dormem','Marcha Imperial'].includes(nome)?3:Number.MAX_SAFE_INTEGER;
    if(total>max) throw Error('O total de tropas movidas excede o limite da carta.');
    if(local.units[faccao]+total<1) throw Error('Envie ao menos uma tropa ou tenha tropas no local.');
    if((costeiro||nome==='Marcha Imperial') && movimentos.filter(m=>m.n>0).length>1) throw Error('Esta carta move de apenas uma região.');
    if(nome==='Marcha Imperial' && !vizinhos(ligacoes,alvo).some(x=>mapa[x]&&dominio(mapa[x])==='imperio')) throw Error('Marcha Imperial exige região adjacente a uma região dominada pelo Império.');
    return {hasEnemy:inimigos.length>0,total};
  }
  function validarFuria(mapa, ligacoes, origem, destino, quantidade, defensor) {
    if (!mapa[origem] || !mapa[destino] || !vizinhos(ligacoes,origem).includes(destino) || !Number.isSafeInteger(quantidade) || quantidade<1 || quantidade>3 || mapa[origem].units.elfos<quantidade) throw Error('Escolha tropas disponíveis e destino adjacente.');
    const inimigos=faccoes.filter(f=>f!=='elfos' && (mapa[destino].units[f]>0 || construcoes(mapa[destino],f)>0));
    if (inimigos.length && !inimigos.includes(defensor)) throw Error('Escolha um defensor presente.');
    return {hasEnemy:inimigos.length>0, movimento:calcularMovimento(mapa[origem].units.elfos,mapa[destino].units.elfos,quantidade)};
  }
  function efeitosCombate(batalha, regiao, resultado, terreno, saques) {
    const eventos=[];
    if (terreno==='floresta') {
      if (batalha.f==='elfos' && resultado.defenderLoss>0 && regiao.units[batalha.defender]===0) eventos.push({tipo:'pontos',faccao:'elfos',quantidade:1,motivo:'eliminou inimigos em floresta'});
      if (batalha.defender==='elfos' && resultado.attackerLoss>0 && regiao.units[batalha.f]===0) eventos.push({tipo:'pontos',faccao:'elfos',quantidade:1,motivo:'eliminou inimigos em floresta'});
    }
    if (batalha.f==='imperio' && batalha.destroy) eventos.push({tipo:'pontos',faccao:'imperio',quantidade:2*batalha.destroy,motivo:'construções destruídas (proposta)'});
    if (batalha.f==='necromante') {
      if (batalha.card==='Infestação') eventos.push({tipo:'zumbis',quantidade:1});
      if (['Ataque Zumbi','Horda interminável'].includes(batalha.card) && regiao.units[batalha.defender]===0 && regiao.units.necromante>0) eventos.push({tipo:'zumbis',quantidade:Math.ceil(resultado.defenderLoss/2)});
    }
    return eventos;
  }
  function opcoesAlistamento(mapa, regioes) {
    const total=regioes.reduce((n,r)=>n+mapa[r.id].units.imperio,0);
    if(total>=7) return {total,quantidade:0,opcoes:[],controladas:false};
    const controladas=regioes.filter(r=>dominio(mapa[r.id])==='imperio');
    const inimigos=r=>faccoes.filter(f=>f!=='imperio').reduce((n,f)=>n+mapa[r.id].units[f],0);
    const minimo=Math.min(...regioes.map(inimigos));
    const elegiveis=controladas.length?controladas:regioes.filter(r=>inimigos(r)===minimo);
    return {total,quantidade:Math.min(7-total,controladas.length?1:2),opcoes:elegiveis.map(r=>r.id),controladas:controladas.length>0};
  }
  function aplicarAlistamento(mapa, regioes, id) {
    const opcoes=opcoesAlistamento(mapa,regioes);
    if(!opcoes.opcoes.includes(id)) throw Error('Região indisponível para alistamento.');
    const local=mapa[id];
    return {...mapa,[id]:{...local,units:{...local.units,imperio:local.units.imperio+opcoes.quantidade}}};
  }
  function recuperarTorre(mapa) {
    const torre=mapa.R3;
    if(!torre) throw Error('Região da Torre ausente.');
    if(dominio(torre)==='necromante' && torre.tower) return {mapa,ativada:false};
    const next=Object.fromEntries(Object.entries(mapa).map(([id,local])=>[id,{...local,units:{...local.units,necromante:0},buildings:{...local.buildings,necromante:0},extractor:false,monument:false,tower:false}]));
    for(const f of faccoes){next.R3.units[f]=0;next.R3.buildings[f]=0;}
    next.R3.tech=null;next.R3.bar=false;next.R3.tower=true;next.R3.units.necromante=2;
    return {mapa:next,ativada:true};
  }
  function reforcarTorre(mapa, regioes) {
    const torre=mapa.R3,controladas=regioes.filter(r=>dominio(mapa[r.id])==='necromante');
    if(!torre || !torre.tower || controladas.length!==1 || controladas[0].id!=='R3' || torre.units.necromante>=5) return {mapa,ativada:false};
    return {mapa:{...mapa,R3:{...torre,units:{...torre.units,necromante:torre.units.necromante+1}}},ativada:true};
  }
  function opcoesIlhaAVista(mapa, regioes) {
    if(regioes.some(r=>mapa[r.id].units.piratas>0)) return [];
    const costas=regioes.filter(r=>r.coast),total=r=>faccoes.reduce((n,f)=>n+mapa[r.id].units[f],0),minimo=Math.min(...costas.map(total));
    return costas.filter(r=>total(r)===minimo).map(r=>r.id);
  }
  function aplicarIlhaAVista(mapa, regioes, id) {
    if(!opcoesIlhaAVista(mapa,regioes).includes(id)) throw Error('Região indisponível para Ilha à Vista.');
    const local=mapa[id];return {...mapa,[id]:{...local,units:{...local.units,piratas:local.units.piratas+1}}};
  }
  function saquear(recursos, defensor, quantidade) {
    if (!faccoes.includes(defensor) || defensor==='piratas' || !Number.isSafeInteger(quantidade) || quantidade<0 || !recursos[defensor] || !recursos.piratas) throw Error('Saque inválido.');
    const next={...recursos,[defensor]:{...recursos[defensor]},piratas:{...recursos.piratas}},origens=[];
    for(let i=0;i<quantidade;i++){if(next[defensor].ouro>0){next[defensor].ouro--;origens.push('inimigo')}else origens.push('reserva');next.piratas.ouro++;}
    return {recursos:next,origens};
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
  function consumirCarta(marcadores, baralho, faccao, indiceAcao, indiceCarta, nomeEsperado) {
    const acao = marcadores[indiceAcao], carta = baralho && baralho.hand[indiceCarta];
    if (!acao || acao.f !== faccao || acao.used || !carta || (nomeEsperado && carta.name !== nomeEsperado)) throw Error('Carta ou ação indisponível.');
    const acoes = marcadores.map((item, i) => i === indiceAcao ? { ...item, used: true } : item);
    const mao = [...baralho.hand], descarte = [...baralho.discard];
    descarte.push(mao.splice(indiceCarta, 1)[0]);
    return { marcadores: acoes, baralho: { ...baralho, hand: mao, discard: descarte } };
  }
  function reacaoDisponivel(marcadores, baralho, faccao, nome) {
    if (!nome || !baralho) return null;
    const acao = marcadores.findIndex(item => item.f === faccao && !item.used);
    const carta = baralho.hand.findIndex(item => item.name === nome);
    return acao < 0 || carta < 0 ? null : { acao, carta };
  }
  function calcularDano(atacantes, defensores, dadosAtaque, dadosDefesa, protecaoAtaque = 0, protecaoDefesa = 0) {
    const dados = dadosAtaque.concat(dadosDefesa);
    const swords = dados.reduce((n, face) => n + face[0], 0), crosses = dados.reduce((n, face) => n + face[1], 0);
    const attackDamage = Math.max(0, swords - Math.min(protecaoDefesa, defensores, swords));
    return { swords, crosses, attackDamage, attProtected: Math.min(crosses, protecaoAtaque), defProtected: Math.min(protecaoDefesa, defensores, swords), defenderLoss: Math.min(defensores, attackDamage), attackerLoss: Math.min(atacantes, defensores, Math.max(0, crosses - protecaoAtaque)), overflow: Math.max(0, attackDamage - defensores) };
  }
  function rolarDados(quantidade, faces, aleatorio) {
    if (!Number.isSafeInteger(quantidade) || quantidade < 0 || !faces.length || typeof aleatorio !== 'function') throw Error('Rolagem inválida.');
    return Array.from({length:quantidade}, () => {
      const numero = aleatorio();
      if (numero < 0 || numero >= 1 || !Number.isFinite(numero)) throw Error('Fonte aleatória inválida.');
      return [...faces[Math.floor(numero * faces.length)]];
    });
  }
  function aplicarBaixas(regiao, atacante, defensor, resultado, pecas, escolhidas, quantidade) {
    if (!regiao || atacante === defensor || !regiao.units || !regiao.buildings || !Array.isArray(pecas) || !Array.isArray(escolhidas) || escolhidas.length !== quantidade || new Set(escolhidas).size !== escolhidas.length || escolhidas.some(i => !Number.isInteger(i) || !pecas[i]) || !Number.isSafeInteger(resultado.attackerLoss) || resultado.attackerLoss < 0 || resultado.attackerLoss > regiao.units[atacante] || !Number.isSafeInteger(resultado.defenderLoss) || resultado.defenderLoss < 0 || resultado.defenderLoss > regiao.units[defensor]) throw Error('Baixas ou construções inválidas.');
    const next = { ...regiao, units:{...regiao.units}, buildings:{...regiao.buildings} };
    next.units[atacante] -= resultado.attackerLoss;
    next.units[defensor] -= resultado.defenderLoss;
    const permitidas = { necromante:['tower','extractor','monument'], imperio:['tech'], piratas:['bar'], elfos:[] };
    for (const i of escolhidas) {
      const key = pecas[i].key;
      if (key === 'generic') { if (!(next.buildings[defensor] > 0)) throw Error('Construção indisponível.'); next.buildings[defensor]--; }
      else { if (!permitidas[defensor]?.includes(key) || !next[key]) throw Error('Construção indisponível.'); next[key] = key === 'tech' ? null : false; }
    }
    return next;
  }
  function decidirReacao(combate, tipo, detalhes = null) {
    if (combate.stage === 'reaction' && tipo === 'defesa' && detalhes && Number.isInteger(detalhes.marker) && typeof detalhes.name === 'string' && Number.isInteger(detalhes.protecao)) return { ...combate, reaction:{marker:detalhes.marker,name:detalhes.name}, defProtection:detalhes.protecao, stage:'peace' };
    if (combate.stage === 'reaction' && tipo === 'passar') return { ...combate, defProtection:0, stage:'peace' };
    if (combate.stage === 'peace' && tipo === 'paz' && detalhes && Number.isInteger(detalhes.marker)) return { ...combate, peace:{marker:detalhes.marker}, stage:'roll' };
    if (combate.stage === 'peace' && tipo === 'passar') return { ...combate, stage:'roll' };
    throw Error('Decisão de combate indisponível nesta etapa.');
  }
  function proximoLance(leilao, ordem) {
    for (let step = 1; step <= ordem.length; step++) {
      const indice = (leilao.turn + step) % ordem.length, f = ordem[indice];
      if (!leilao.passed[f] && f !== leilao.leader) return indice;
    }
    return null;
  }
  function iniciarLeilao(ordem) {
    return { turn: 0, leader: null, high: 0, passed: {}, offers: Object.fromEntries(ordem.map(f => [f, []])) };
  }
  function passarLeilao(leilao, ordem, faccao) {
    if (ordem[leilao.turn] !== faccao || leilao.passed[faccao] || leilao.leader === faccao) throw Error('Não é a vez desta facção no leilão.');
    return { ...leilao, passed: { ...leilao.passed, [faccao]: true } };
  }
  function registrarLance(leilao, faccao, mao, selecionadas) {
    const atuais = leilao.offers[faccao];
    if (!atuais || !Array.isArray(selecionadas) || !selecionadas.length || new Set(selecionadas).size !== selecionadas.length || selecionadas.some(i => !Number.isInteger(i) || i < 0 || i >= mao.length || atuais.includes(i))) throw Error('Acrescente cartas para superar o maior lance de ' + leilao.high + '.');
    const ofertas = atuais.concat(selecionadas), total = ofertas.reduce((n,i) => n + mao[i].leadership, 0);
    if (!Number.isSafeInteger(total) || total <= leilao.high) throw Error('Acrescente cartas para superar o maior lance de ' + leilao.high + '.');
    return { ...leilao, leader:faccao, high:total, offers:{...leilao.offers,[faccao]:ofertas} };
  }
  function encerrarLeilao(leilao, ordem, baralhos) {
    const vencedor = leilao.leader || ordem[0];
    const indice = ordem.indexOf(vencedor);
    if (indice < 0 || !baralhos[vencedor]) throw Error('Líder inválido.');
    const escolhidas = leilao.leader ? leilao.offers[vencedor] : [];
    const original = baralhos[vencedor];
    if (!Array.isArray(escolhidas) || new Set(escolhidas).size !== escolhidas.length || escolhidas.some(i => !Number.isInteger(i) || i < 0 || i >= original.hand.length)) throw Error('Oferta inválida.');
    const mao = [...original.hand], descarte = [...original.discard];
    for (const i of [...escolhidas].sort((a, b) => b - a)) descarte.push(mao.splice(i, 1)[0]);
    return { vencedor, quantidade: escolhidas.length, ordem: ordem.slice(indice).concat(ordem.slice(0, indice)), baralhos: { ...baralhos, [vencedor]: { ...original, hand: mao, discard: descarte } } };
  }
  const api = Object.freeze({ faccoes, cenarioInicial, recursosIniciais, fluxoInicial, construcoes, dominio, devastada, pontosFlorestas, pontosDevastacao, registrarPontos, vizinhos, pagar, receber, calcularMovimento, cartaLocal, coletaDeCartas, movimentoDeCarta, filhosDaFloresta, milagreDaFloresta, mercenariosPiratas, monumentoMorte, construirTecnologia, coletaImperial, magiaDasTrevas, pagarImposto, substituirImposto, opcoesPenalidadeImposto, validarHarmonia, tropasHarmonia, transportePirata, validarAlianca, validarCorsario, validarAtaque, validarFuria, efeitosCombate, saquear, opcoesAlistamento, aplicarAlistamento, recuperarTorre, reforcarTorre, opcoesIlhaAVista, aplicarIlhaAVista, proximaFacção, comprarAte, consumirCarta, reacaoDisponivel, calcularDano, rolarDados, aplicarBaixas, decidirReacao, iniciarLeilao, passarLeilao, proximoLance, registrarLance, encerrarLeilao });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ConflictIslandBase = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
