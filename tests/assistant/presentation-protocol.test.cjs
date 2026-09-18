const {test} = require('node:test');
const assert = require('node:assert/strict');
const {runtime,payload} = require('./runtime.cjs');

test('ANSWER and its JSON repair keep internal IDs out of message via the system protocol', async () => {
  const id = 'como-fazer/inutilizar-nfe';
  const prompts = [];
  const rt = runtime({hermes(body) {
    if (payload(body).stage === 'select') return {kind:'retrieve',sourceIds:[id]};
    prompts.push(body.messages[0].content);
    return prompts.length === 1 ? 'invalid JSON' : {kind:'answer',message:'Resposta oficial.',sourceIds:[id]};
  }});
  const result = await rt.pipeline.ask('Como inutilizar uma NF-e?');
  assert.equal(result.message, 'Resposta oficial.');
  assert.deepEqual(result.sourceIds, [id]);
  assert.equal(prompts.length, 2);
  for (const prompt of prompts) {
    assert.match(prompt, /Nunca escreva Fonte:/);
    assert.match(prompt, /Nunca escreva sourceId/);
    assert.match(prompt, /identificadores internos como como-fazer\//);
    assert.match(prompt, /somente no campo sourceIds/);
    assert.match(prompt, /frontend é responsável por renderizar Guia\/Manual recomendado/);
  }
});

for(const leak of ['Fonte: como-fazer/cadastrar-material','Fontes: documentação','**Fonte:** exemplo',
  'Use sourceId para a consulta.','sourceIds: []','como-fazer/cadastrar-material','manual/cadastro',
  'Consulte financeiro/boleto','https://suportewcorp.github.io/erp-docs/financeiro/boleto/',
  '[WCORP_RAG_CONTEXT]', '{"kind":"answer"}']) {
  test(`message contract rejects and repairs internal references: ${leak}`,async()=>{
    const id='como-fazer/cadastrar-material';let attempts=0;
    const rt=runtime({hermes:body=>payload(body).stage==='select'?{kind:'retrieve',sourceIds:[id]}:
      {kind:'answer',message:++attempts===1?'Faça isso...\n\n'+leak:'Resposta destinada ao usuário.',sourceIds:[id]}});
    assert.equal((await rt.pipeline.ask('pergunta')).message,'Resposta destinada ao usuário.');
    assert.equal(rt.hermesCalls().length,3);
  });
}
test('message validation preserves legitimate procedural text',async()=>{
  const rt=runtime();await rt.pipeline.initialize();
  for(const text of ['Consulte o manual e confira os dados.','Escolha a fonte do relatório.',
    'Digite entrada/saída no campo indicado.','O campo Tipo identifica o documento.'])assert.doesNotThrow(()=>rt.pipeline.validateMessage(text));
});
test('an ANSWER leak cannot obtain a second repair after SELECT was repaired',async()=>{
  const id='como-fazer/cadastrar-material';
  const rt=runtime({hermes:(_body,index)=>index===0?'bad JSON':index===1?{kind:'retrieve',sourceIds:[id]}:
    {kind:'answer',message:'Fonte: '+id,sourceIds:[id]}});
  await assert.rejects(rt.pipeline.ask('pergunta'),/Internal reference/);
  assert.equal(rt.hermesCalls().length,3);
});
