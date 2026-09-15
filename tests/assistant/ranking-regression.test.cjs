const {test, before} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const base = process.env.ASSISTANT_TEST_URL || 'http://127.0.0.1:8000/erp-docs/';
let api, docs;
before(async () => {
  const response = await fetch(new URL('search/search_index.json', base));
  assert.ok(response.ok, 'MkDocs search index available');
  docs = (await response.json()).docs;
  const paths = [...fs.readFileSync('mkdocs.yml', 'utf8').matchAll(/:\s+([^\s]+\.md)\s*$/gm)]
    .map((match) => match[1].replace(/\.md$/, '').replace(/(?:^|\/)index$/, ''));
  const links = paths.map((path) => ({href: new URL(path + '/', base).href}));
  const context = vm.createContext({URL, console: {info(){}, error(){}}, fetch,
    window: {location: {href: base}},
    document: {querySelector: () => ({href: base}), querySelectorAll: () => links,
      addEventListener(){}}, sessionStorage: {getItem(){return null;},setItem(){}}});
  vm.runInContext(fs.readFileSync('docs/assets/javascripts/wcorp-search-utils.js', 'utf8'), context);
  let source = fs.readFileSync('docs/assets/javascripts/wcorp-assistant.js', 'utf8');
  source = source.replace(/\}\)\(\);\s*$/, `window.testApi = {
    loadAssistantGlossary, loadAssistantPublishedGuidePaths, getAssistantResults,
    getAssistantCategory, assistantCasualDirectAnswer, analyzeAssistantQuery,
    isAssistantPublishedNavigationDoc, assistantRagDirectManualFallback,
    setGlossary(value) { assistantGlossary = value; }
  };})();`);
  vm.runInContext(source, context);
  api = context.window.testApi;
  // Exercise the real runtime loader and MkDocs base path.
  await api.loadAssistantGlossary();
  await api.loadAssistantPublishedGuidePaths();
  docs = docs.filter(api.isAssistantPublishedNavigationDoc);
});
const cases = [
 ['como desativo uma nota fiscal?', 'como-fazer/desativar-componentes'],
 ['como cancelo um pedido?', 'comercial/pedidos'],
 ['como vejo o estoque de um produto?', 'como-fazer/consultar-estoque'],
 ['como cadastrar um material?', 'como-fazer/cadastrar-material'],
 ['como dou entrada em um material?', 'como-fazer/registrar-entrada-material'],
 ['como altero o NCM de um material?', 'como-fazer/alterar-ncm-material'],
 ['como ajusto o inventário?', 'como-fazer/ajustar-estoque'],
 ['como cancelo uma nota fiscal?', 'como-fazer/cancelar-nfe'],
 ['como vejo uma nota rejeitada?', 'como-fazer/consultar-nfe-rejeitada'],
 ['preciso corrigir uma nota, como faço?', 'como-fazer/emitir-carta-correcao'],
 ['como faço um pedido?', 'como-fazer/fazer-pedido-venda'],
 ['como faço um pedido de compra?', 'compras/pedido-compra'],
 ['como gero um boleto?', 'financeiro/boleto'],
 ['como dou entrada em uma nota fiscal?', 'faturamento/entrada-nota-fiscal'],
 ['como faço uma devolução?', 'comercial/devolucao'],
 ['como cadastro um fornecedor?', 'fornecedores/fornecedores'],
 ['como lançar contas a pagar?', 'financeiro/contas-a-pagar'],
 ['onde vejo os fornecedores?', 'fornecedores/fornecedores'],
 ['o que encontro na tela de fornecedores?', 'fornecedores/fornecedores'],
 ['como emitir uma nfe', 'como-fazer/faturar-nota'],
 ['como cadastrar cliente', 'como-fazer/cadastrar-cliente']
];
for (const [query, path] of cases) test(query, () => {
  const result = api.getAssistantResults(docs, query);
  assert.equal(result.primary?.pageKey, path);
  const category = path.startsWith('como-fazer/') ? 'Guia' : 'Manual';
  assert.equal(api.getAssistantCategory(result.primary.doc), category);
  if (query === 'como cancelo um pedido?') {
    assert.match(api.assistantRagDirectManualFallback(result, [{category}]), /Não encontrei/);
  }
});
for (const query of ['ta ai?', 'oi, ta ai?', 'bom dia, ta ai?']) test(query, () => {
  assert.ok(api.assistantCasualDirectAnswer(query));
});
test('objects use only aliases actually present in the query', () => {
  assert.equal(api.analyzeAssistantQuery('como vejo o estoque de um produto?').semantic.object, 'estoque');
  assert.equal(api.analyzeAssistantQuery('como faço um pedido de compra?').semantic.object, 'pedido de compra');
});
test('a glossary route cannot promote a hidden guide', () => {
  const glossary = JSON.parse(fs.readFileSync('docs/assets/data/assistant-glossary.json', 'utf8'));
  try {
    api.setGlossary({...glossary, routes: [{action:'cancelar', object:'pedido', path:'como-fazer/cancelar-pedido', score:99999}]});
    const result = api.getAssistantResults([...docs, {title:'Como cancelar pedido',
      location:'como-fazer/cancelar-pedido/', text:'Cancelar pedido'}], 'como cancelo um pedido?');
    assert.notEqual(result.primary?.pageKey, 'como-fazer/cancelar-pedido');
  } finally {api.setGlossary(glossary);}
});
