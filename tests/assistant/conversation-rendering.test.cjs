const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {runtime,DOMParser,baseUrl,payload} = require('./runtime.cjs');
const rag = require('../../docs/assets/javascripts/wcorp-assistant-rag.js');

function ui(rt, stored = new Map()) {
  const document = new DOMParser().parseFromString('<html><body><a class="md-header__button md-logo" href="'+baseUrl+'">Logo</a></body></html>','text/html');
  const window = {location:{href:baseUrl},WCorpAssistantRag:{...rag,create:()=>rt.pipeline},
    matchMedia:()=>({matches:true}),requestAnimationFrame:()=>0,setTimeout:()=>0,clearTimeout(){},addEventListener(){},
    getComputedStyle:()=>({right:'12px',bottom:'12px'}),innerWidth:1440,innerHeight:900};
  const sessionStorage = {getItem:key=>stored.get(key)||null,setItem:(key,value)=>stored.set(key,value)};
  const context=vm.createContext({document,window,sessionStorage,URL,console:{info(){},error(){}},setTimeout,clearTimeout});
  const source=fs.readFileSync('docs/assets/javascripts/wcorp-assistant.js','utf8');
  vm.runInContext(source.replace(/\}\)\(\);\s*$/,'window.testUi = {createMarkdownMessage, appendAssistantResponse, initializeAssistant};})();'),context);
  return {document,window,stored,render:window.testUi.createMarkdownMessage,
    present: result=>{const container=document.createElement('div');window.testUi.appendAssistantResponse(container,result);return container;},
    mount:()=>window.testUi.initializeAssistant(),
    async ask(question) {
      document.querySelector('.wc-assistant__input').value=question;
      document.querySelector('.wc-assistant__form').dispatchEvent(new document.defaultView.Event('submit',{cancelable:true}));
      const send=document.querySelector('.wc-assistant__send');
      for(let i=0;i<100&&send.disabled;i++)await new Promise(resolve=>setTimeout(resolve,5));
      assert.equal(send.disabled,false,'form completes');
      return [...document.querySelectorAll('.wc-assistant__message:not(.wc-assistant__message--source):not(.wc-assistant__message--followup)')].at(-1);
    }};
}

test('actual form sends casual input to Hermes and displays model-authored chat',async()=>{
  const rt=runtime({hermes:()=>({kind:'chat',message:'Tô sim. Como posso ajudar com o WCorp?'})});
  const app=ui(rt);app.mount();
  const message=await app.ask('oi ta ai?');
  assert.equal(rt.hermesCalls().length,1);
  assert.equal(message.textContent,'Tô sim. Como posso ajudar com o WCorp?');
  assert.equal(message.querySelectorAll('a').length,0);
  assert.equal(app.document.querySelectorAll('.wc-assistant__message--temporary').length,0);
});

test('actual form renders clarify and passes follow-up context after session restoration',async()=>{
  const question='quero tirar isso de uso mas não quero apagar';
  const message='Você quer que fique disponível apenas entre os desativados?';
  const rt=runtime({hermes:()=>({kind:'clarify',message})});
  const app=ui(rt);app.mount();
  assert.equal((await app.ask(question)).textContent,message);
  const saved=JSON.parse(app.stored.get('wcorpAssistantSession'));
  assert.equal(saved.history.length,2);
  assert.ok(saved.conversation.every(item=>!item.html));
  const next=runtime({hermes:body=>{
    const sent=payload(body);
    assert.equal(sent.question,'isso');
    assert.deepEqual(sent.history,[{role:'user',content:question},{role:'assistant',content:message}]);
    return {kind:'support',message:'Orientação insuficiente. Recomendo entrar em contato com o suporte.'};
  }});
  const resumed=ui(next,app.stored);resumed.mount();
  assert.match((await resumed.ask('isso')).textContent,/Recomendo entrar em contato/);
  assert.equal(next.hermesCalls().length,1);
});

test('actual form displays a grounded answer with the official title and URL',async()=>{
  const id='como-fazer/inutilizar-nfe';
  const guide=fs.readFileSync('docs/como-fazer/inutilizar-nfe.md','utf8');
  const message=guide.split('## Como fazer')[1].split('## Observação')[0].trim();
  const rt=runtime({hermes:body=>payload(body).stage==='select'?{kind:'retrieve',sourceIds:[id]}:{kind:'answer',message,sourceIds:[id]}});
  const app=ui(rt);app.mount();
  const rendered=await app.ask('preciso inutilizar uma nota, como faz?');
  assert.equal(rt.hermesCalls().length,2);
  assert.equal(rendered.querySelectorAll('ol > li').length,10);
  const expectedSteps=[...message.matchAll(/^\d+\. (.+)$/gm)].map(match=>match[1].replace(/\*\*/g,''));
  assert.deepEqual([...rendered.querySelectorAll('ol > li')].map(item=>item.textContent),expectedSteps);
  assert.equal(rendered.querySelectorAll('a').length,0);
  const recommendation=rendered.nextElementSibling;
  assert.ok(recommendation.classList.contains('wc-assistant__message--source'));
  assert.equal(recommendation.querySelector('.wc-assistant__result-type').textContent,'Guia recomendado');
  assert.equal(recommendation.querySelector('.wc-assistant__result-title').textContent,'Como inutilizar uma NF-e');
  assert.equal(recommendation.querySelectorAll('a').length,1);
  assert.equal(recommendation.querySelector('a').href,baseUrl+id+'/');
  assert.ok(recommendation.nextElementSibling.classList.contains('wc-assistant__message--followup'));
  const restored=ui(rt,app.stored);restored.mount();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(restored.document.querySelector('.wc-assistant__message--source a').href,baseUrl+id+'/');
  const twice=ui(rt,restored.stored);twice.mount();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(twice.document.querySelector('.wc-assistant__message--source a').href,baseUrl+id+'/');
  assert.equal(twice.document.querySelectorAll('.wc-assistant__message--followup').length,1);
});

for(const options of [{hermesError:true},{hermes:()=> 'invalid JSON'},{hermes:()=>({kind:'retrieve',sourceIds:['como-fazer/cancelar-pedido']})}]) {
  test('actual form renders only a technical error on network, protocol or authorization failure',async()=>{
    const rt=runtime(options),app=ui(rt);app.mount();
    const message=await app.ask('quem mexeu?');
    assert.equal(message.textContent,rag.TECHNICAL_ERROR);
    assert.equal(message.querySelectorAll('a').length,0);
    assert.equal(app.document.querySelectorAll('.wc-assistant__message--source,.wc-assistant__message--followup').length,0);
    assert.equal(rt.documentCalls().length,0);
    assert.equal(JSON.parse(app.stored.get('wcorpAssistantSession')).history.length,0);
  });
}

test('Markdown cannot create model-provided links, executable HTML or hidden recommendations',async()=>{
  const rt=runtime();await rt.pipeline.initialize();
  const source=rt.pipeline.references(['financeiro/boleto']);
  const message=ui(rt).present({kind:'answer',message:'[Oculta](como-fazer/cancelar-pedido/) [Externo](https://evil.test) '+
    '[Script](javascript:alert(1)) <img src=x onerror=alert(1)> <script>alert(1)</script>',sources:source});
  assert.equal(message.querySelectorAll('a').length,1);
  assert.equal(message.querySelector('a').href,baseUrl+'financeiro/boleto/');
  assert.equal(message.querySelector('a').textContent,source[0].title);
  assert.equal(message.querySelectorAll('script,img').length,0);
  assert.match(message.textContent,/Manual recomendado/);
});

test('stored references are reauthorized and stored HTML is never restored as markup',async()=>{
  const rt=runtime();
  const stored=new Map([['wcorpAssistantSession',JSON.stringify({version:2,history:[],conversation:[{
    type:'assistant',text:'Texto salvo <script>bad()</script>',sourceIds:['como-fazer/cancelar-pedido'],html:'<img src=x onerror=bad()>'
  }]})]]);
  const app=ui(rt,stored);app.mount();
  await new Promise(resolve=>setImmediate(resolve));
  const message=app.document.querySelector('.wc-assistant__message');
  assert.equal(message.querySelectorAll('a,script,img').length,0);
  assert.equal(rt.documentCalls().length,0);
});

test('numbered steps and intervening notes retain list continuation',()=>{
  const message=ui(runtime()).render('1. Primeiro\n\n2) Segundo\n\n**Observação**\n\nNota oficial.\n\n3. Terceiro\n4) Quarto');
  assert.deepEqual([...message.querySelectorAll('ol')].map(list=>list.getAttribute('start')),['1','3']);
  assert.deepEqual([...message.querySelectorAll('li')].map(item=>item.textContent),['Primeiro','Segundo','Terceiro','Quarto']);
  assert.equal(message.querySelector('strong').textContent,'Observação');
});

test('nested lists retain their hierarchy',()=>{
  const message=ui(runtime()).render('1. Principal\n  - Subetapa\n2. Próximo');
  assert.equal(message.querySelectorAll('ol > li').length,2);
  assert.equal(message.querySelector('ol > li > ul > li').textContent,'Subetapa');
});

const allowedFollowUps=['Ficou alguma dúvida?','Posso ajudar com mais alguma coisa?',
  'Precisa de mais alguma informação?','Tem mais alguma dúvida sobre isso?'];
for (const ids of [[],['financeiro/boleto'],['como-fazer/inutilizar-nfe','financeiro/boleto']]) {
  test(`answer presentation groups sources without polluting history: ${ids.join(',')||'no sources'}`,async()=>{
    const rt=runtime();await rt.pipeline.initialize();
    const result={kind:'answer',message:'Resposta real do Hermes.',sources:rt.pipeline.references(ids)};
    let calls=0,receivedHistory;
    // Exercise the defensive UI path without relaxing the RAG's source-ID contract.
    rt.pipeline.ask=async(_question,history)=>{calls++;receivedHistory=history;return result;};
    const app=ui(rt);app.mount();
    const main=await app.ask('pergunta');
    assert.equal(main.textContent,result.message);
    const sources=app.document.querySelectorAll('.wc-assistant__message--source');
    assert.equal(sources.length,ids.length?1:0);
    assert.equal(app.document.querySelectorAll('.wc-assistant__message--source a').length,ids.length);
    if(ids.length)assert.equal(sources[0].querySelector('a').href,result.sources[0].url);
    const followup=app.document.querySelector('.wc-assistant__message--followup');
    assert.ok(allowedFollowUps.includes(followup.textContent));
    assert.equal(calls,1);
    const saved=JSON.parse(app.stored.get('wcorpAssistantSession'));
    assert.deepEqual(saved.history,[{role:'user',content:'pergunta'},{role:'assistant',content:result.message}]);
    assert.ok(!saved.conversation.some(item=>allowedFollowUps.includes(item.text)||/recomendad[oa]/.test(item.text)));
    assert.equal(saved.conversation.filter(item=>item.kind==='answer').length,1);
    const resumed=ui(rt,app.stored);resumed.mount();await new Promise(resolve=>setImmediate(resolve));
    await resumed.ask('continuação');
    assert.deepEqual(JSON.parse(JSON.stringify(receivedHistory)),saved.history);
    assert.equal(calls,2);
  });
}
for(const kind of ['chat','clarify','support']) {
  test(`${kind}, initial greeting and typing never receive a follow-up`,async()=>{
    const rt=runtime({hermes:()=>({kind,message:'Resposta breve.'})});const app=ui(rt);app.mount();
    assert.equal(app.document.querySelectorAll('.wc-assistant__message--followup').length,0);
    await app.ask('pergunta');
    assert.equal(app.document.querySelectorAll('.wc-assistant__message--followup,.wc-assistant__message--source').length,0);
    assert.equal(rt.hermesCalls().length,1);
  });
}
test('leaked source ID is repaired before UI and never appears as chat text',async()=>{
  const id='como-fazer/cadastrar-material';let answers=0;
  const rt=runtime({hermes:body=>payload(body).stage==='select'?{kind:'retrieve',sourceIds:[id]}:
    {kind:'answer',message:++answers===1?'Faça isso...\n\nFonte: '+id:'Confira os campos e salve o material.',sourceIds:[id]}});
  const app=ui(rt);app.mount();await app.ask('Como cadastrar um material?');
  assert.equal(rt.hermesCalls().length,3);
  assert.ok(!app.document.querySelector('.wc-assistant__messages').textContent.includes(id));
  assert.equal(app.document.querySelector('.wc-assistant__message--source a').href,baseUrl+id+'/');
});
test('repeated leaks fail closed without recommendations or follow-ups',async()=>{
  const id='como-fazer/cadastrar-material';
  const rt=runtime({hermes:body=>payload(body).stage==='select'?{kind:'retrieve',sourceIds:[id]}:
    {kind:'answer',message:'Fonte: '+id,sourceIds:[id]}});
  const app=ui(rt);app.mount();assert.equal((await app.ask('pergunta')).textContent,rag.TECHNICAL_ERROR);
  assert.equal(rt.hermesCalls().length,3);
  assert.equal(app.document.querySelectorAll('.wc-assistant__message--followup,.wc-assistant__message--source').length,0);
  assert.equal(JSON.parse(app.stored.get('wcorpAssistantSession')).history.length,0);
});
test('restoration blocks old model leaks but preserves the user text verbatim',()=>{
  const text='Fonte: como-fazer/cadastrar-material';
  const saved=new Map([['wcorpAssistantSession',JSON.stringify({version:2,history:[],conversation:[
    {type:'user',text},{type:'assistant',text,sourceIds:['como-fazer/cadastrar-material']}
  ]})]]);
  const app=ui(runtime(),saved);app.mount();
  assert.equal(app.document.querySelector('.wc-assistant__message--user').textContent,text);
  assert.equal(app.document.querySelector('.wc-assistant__message:not(.wc-assistant__message--user)').textContent,rag.TECHNICAL_ERROR);
});

test('typing and timeout do not create presentation messages or semantic history',async()=>{
  const rt=runtime({pipelineOptions:{hermesTimeoutMs:30},delay:async(url,init)=>{
    if(url.includes('wcorp-hermes-proxy'))await new Promise((_,reject)=>init.signal.addEventListener('abort',()=>reject(new Error('Timeout')),{once:true}));
  }});
  const app=ui(rt);app.mount();const answer=app.ask('pergunta');
  assert.equal(app.document.querySelectorAll('.wc-assistant__typing').length,1);
  assert.equal(app.document.querySelectorAll('.wc-assistant__message--source,.wc-assistant__message--followup').length,0);
  assert.equal((await answer).textContent,rag.TECHNICAL_ERROR);
  assert.equal(app.document.querySelectorAll('.wc-assistant__message--source,.wc-assistant__message--followup').length,0);
  assert.equal(rt.hermesCalls().length,1);
  assert.equal(JSON.parse(app.stored.get('wcorpAssistantSession')).history.length,0);
});
