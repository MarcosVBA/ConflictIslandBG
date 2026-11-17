/* Custos e valores imperiais para teste de balanceamento. */
const technologies={'Serraria':{wood:1,gold:0,level:1},'Mercado Local':{wood:1,gold:1,level:2,requires:'Serraria'},'Salão Imperial':{wood:0,gold:2,level:3,requires:'Mercado Local'},'Quartel':{wood:0,gold:2,level:2,requires:'Serraria'},'Fortaleza':{wood:1,gold:1,level:3,requires:'Quartel'}};
const imperialTaxes=Object.freeze([{g:1,w:0,s:0,p:2},{g:1,w:1,s:0,p:2},{g:1,w:1,s:0,p:2},{g:1,w:1,s:0,p:2},{g:2,w:1,s:0,p:3},{g:2,w:1,s:0,p:3},{g:0,w:1,s:1,p:3},{g:0,w:1,s:1,p:3},{g:1,w:1,s:1,p:4}].map(Object.freeze));
