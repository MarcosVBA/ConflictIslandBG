/* Dados do protótipo; incorporados ao HTML pelo script de sincronização. */
const definitions=Object.freeze([
{id:'R1',name:'Praia Dourada',terrain:'praia',coast:true,resource:'Ouro',owner:'imperio',x:12,y:17},
{id:'R2',name:'Mata da Coroa',terrain:'floresta',coast:false,resource:'Madeira',owner:'imperio',x:37,y:17},
{id:'R3',name:'Torre Esquecida',terrain:'montanha',coast:false,resource:'Ouro',owner:'necromante',x:87,y:17},
{id:'R4',name:'Bosque Morto',terrain:'floresta',coast:true,resource:'Madeira',owner:'necromante',x:87,y:50},
{id:'R5',name:'Enseada Safira',terrain:'praia',coast:true,resource:'Sem recurso',owner:'piratas',x:37,y:83},
{id:'R6',name:'Floresta Antiga',terrain:'floresta',coast:false,resource:'Madeira',owner:'elfos',x:62,y:50},
{id:'R7',name:'Pico Desolado',terrain:'montanha',coast:false,resource:'Sem recurso',owner:'livre',x:87,y:83},
{id:'R8',name:'Praia dos Náufragos',terrain:'praia',coast:true,resource:'Sem recurso',owner:'livre',x:12,y:50},
{id:'R10',name:'Bosque Élfico',terrain:'floresta',coast:false,resource:'Madeira',owner:'elfos',x:37,y:50},
{id:'R11',name:'Costa do Ouro Perdido',terrain:'praia',coast:true,resource:'Ouro',owner:'livre',x:62,y:83}
].map(Object.freeze));
const edges=[['R1','R2'],['R1','R8'],['R2','R4'],['R2','R10'],['R3','R4'],['R4','R6'],['R4','R7'],['R5','R6'],['R7','R11'],['R8','R5'],['R10','R6'],['R10','R8'],['R10','R11'],['R11','R5'],['R11','R8']];
