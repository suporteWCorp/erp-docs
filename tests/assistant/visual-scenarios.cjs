const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

module.exports = async function ({send,evaluate,origin,until,sleep,root}) {
  // Mock only the remote model; exercise the real UI, registry, SELECT/ANSWER,
  // source authorization, Markdown renderer and history restoration.
  await send('Page.addScriptToEvaluateOnNewDocument', {source: `(()=>{
    sessionStorage.removeItem('wcorpAssistantSession');
    const original=window.fetch.bind(window);
    window.__visualCalls=[];
    window.fetch=async(url,init)=>{
      if(String(url)!=='https://wcorp-hermes-proxy.waveconcept.workers.dev/chat')return original(url,init);
      const body=JSON.parse(init.body),payload=JSON.parse(body.messages[1].content),fixture=window.__visualCase;
      window.__visualCalls.push(payload.stage);
      const result=fixture.sourceIds
        ? (payload.stage==='select'?{kind:'retrieve',sourceIds:fixture.sourceIds}:{kind:'answer',...fixture})
        : fixture;
      return new Response(JSON.stringify({choices:[{message:{content:JSON.stringify(result)},finish_reason:'stop'}]}),{status:200});
    };
  })()`});
  const cases = [
    {name:'simple',value:{kind:'chat',message:'Olá! Como posso ajudar com o WCorp?'}},
    {name:'long',value:{sourceIds:['como-fazer/inutilizar-nfe'],message:('Parágrafo longo para verificar leitura, quebra de texto e rolagem dentro da conversa.\n\n').repeat(12)+'Identificador longo de teste: '+ 'abcdefghij'.repeat(12)}},
    {name:'numbered',value:{kind:'chat',message:'1. Confira os dados.\n2. Revise os campos.\n3. Confirme a operação.'}},
    {name:'bullets',value:{kind:'chat',message:'Confira:\n\n- Primeiro ponto\n- Segundo ponto\n  - Observação adicional'}},
    {name:'clarify',value:{kind:'clarify',message:'Você está falando de uma nota autorizada ou ainda em edição?'}},
    {name:'support',value:{kind:'support',message:'A documentação disponível não esclarece este caso. Entre em contato com o suporte.'}},
    {name:'guide',value:{message:'1. Confira a documentação oficial.\n2. Revise os dados antes de continuar.',sourceIds:['como-fazer/inutilizar-nfe']},label:'Guia recomendado'},
    {name:'manual',value:{message:'Consulte os campos e as opções na referência oficial.',sourceIds:['financeiro/boleto']},label:'Manual recomendado'},
    {name:'multiple',value:{message:'Confira as referências oficiais disponíveis.',sourceIds:['como-fazer/inutilizar-nfe','financeiro/boleto']},label:'Guia recomendado'}
  ];
  const results=[];
  async function loadPage() {
    await evaluate('window.__visualPreviousDocument=true');
    await send('Page.navigate',{url:origin+'/site/como-fazer/'});
    await until(async()=>{
      try {
        return await evaluate('!window.__visualPreviousDocument && document.readyState==="complete" && !!document.querySelector(".wc-assistant__button")');
      } catch(error) {
        if(/navigated|context.*destroyed/i.test(error.message||''))return false;
        throw error;
      }
    },'fresh assistant document');
  }
  async function checkPanel(label) {
    const state=await evaluate(`(()=>{
      const panel=document.querySelector('.wc-assistant__panel'),messages=document.querySelector('.wc-assistant__messages'),form=document.querySelector('.wc-assistant__form');
      return {width:innerWidth,height:innerHeight,docWidth:document.documentElement.clientWidth,docScroll:document.documentElement.scrollWidth,
        rect:panel.getBoundingClientRect().toJSON(),messagesWidth:messages.clientWidth,messagesScroll:messages.scrollWidth,
        formPadding:getComputedStyle(form).paddingBottom,inputFont:getComputedStyle(document.querySelector('.wc-assistant__input')).fontSize,
        messageOverflow:[...messages.querySelectorAll('.wc-assistant__message')].some(e=>e.scrollWidth>e.clientWidth+1)};
    })()`);
    assert.ok(state.docScroll<=state.docWidth, `${label}: page overflow`);
    assert.ok(state.messagesScroll<=state.messagesWidth+1, `${label}: messages overflow`);
    assert.equal(state.messageOverflow,false, `${label}: bubble overflow`);
    assert.ok(state.rect.left>=0&&state.rect.right<=state.width+1&&state.rect.top>=0&&state.rect.bottom<=state.height+1, `${label}: panel clipped ${JSON.stringify(state)}`);
    if(state.width<=704)assert.equal(state.inputFont,'16px');
    return state;
  }
  for(const [width,height] of [[1440,1000],[320,568],[375,812],[390,844],[430,932]]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<800});
    await loadPage();
    assert.equal(await evaluate('document.querySelector(".wc-assistant__panel").hidden'),true);
    await evaluate('document.querySelector(".wc-assistant__button").click()');await sleep(250);
    for(const fixture of cases) {
      await evaluate(`window.__visualCase=${JSON.stringify(fixture.value)};document.querySelector('.wc-assistant__input').value=${JSON.stringify('Teste '+fixture.name)};document.querySelector('.wc-assistant__form').requestSubmit();`);
      await until(()=>evaluate('!document.querySelector(".wc-assistant__send").disabled'),'answer');await sleep(200);
      const response=await evaluate(`(()=>{const e=[...document.querySelectorAll('.wc-assistant__message:not(.wc-assistant__message--source):not(.wc-assistant__message--followup)')].at(-1);const source=e.nextElementSibling?.matches('.wc-assistant__message--source')?e.nextElementSibling:null;const followup=source?source.nextElementSibling:e.nextElementSibling;return {text:e.textContent,ordered:e.querySelectorAll('ol > li').length,bullets:e.querySelectorAll('ul li').length,label:source?.querySelector('.wc-assistant__result-type')?.textContent,link:source?.querySelector('.wc-assistant__result-title')?.getAttribute('href'),title:source?.querySelector('.wc-assistant__result-title')?.textContent,count:source?.querySelectorAll('a').length||0,followup:!!followup?.matches('.wc-assistant__message--followup'),mainLinks:e.querySelectorAll('a').length};})()`);
      assert.equal(response.mainLinks,0);
      assert.equal(response.count,fixture.value.sourceIds?.length||0);
      assert.equal(response.followup,!!fixture.value.sourceIds);
      assert.ok(response.text.includes(fixture.value.message.split('\n')[0].replace(/^1\. /,'')),fixture.name);
      if(fixture.name==='numbered')assert.equal(response.ordered,3);
      if(fixture.name==='bullets')assert.equal(response.bullets,3);
      if(fixture.label){assert.equal(response.label,fixture.label);assert.equal(response.link,origin+'/site/'+fixture.value.sourceIds[0]+'/');assert.ok(response.title);}
      await checkPanel(`${width}: ${fixture.name}`);
      if(['guide','manual'].includes(fixture.name))fs.writeFileSync(path.join(root,`.tools/assistant-${width}-${fixture.name}.png`),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
    }
    if(width<800) {
      // Reduced usable height while the focused mobile input is receiving text.
      await send('Emulation.setDeviceMetricsOverride',{width,height:Math.max(320,height-300),deviceScaleFactor:1,mobile:true});
      await evaluate('document.querySelector(".wc-assistant__input").focus()');
      await send('Input.insertText',{text:'Mensagem com teclado mobile'});await sleep(300);
      await checkPanel(`${width}: keyboard viewport`);
      assert.equal(await evaluate('document.querySelector(".wc-assistant__input").value'),'Mensagem com teclado mobile');
      await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});
    }
    await evaluate('document.querySelector(".wc-assistant__close").click()');await sleep(250);
    assert.equal(await evaluate('document.querySelector(".wc-assistant__panel").hidden'),true);
    await evaluate('document.querySelector(".wc-assistant__button").click()');await sleep(250);
    assert.equal(await evaluate('document.querySelectorAll(".wc-assistant__result").length'),5,'reopen preserves sources/history');
    assert.equal(await evaluate('document.querySelectorAll(".wc-assistant__message--source").length'),4);
    assert.equal(await evaluate('document.querySelectorAll(".wc-assistant__message--followup").length'),4);
    await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    assert.equal(await evaluate('getComputedStyle(document.querySelector(".wc-assistant__message")).animationName'),'none');
    await send('Emulation.setEmulatedMedia',{features:[]});
    results.push({width,cases:cases.map(c=>c.name),keyboard:width<800?'simulated':'not applicable'});
    console.log(`PASS assistant ${width}px: all message types, sources, overflow, open/close, reduced motion`);
  }
  await evaluate('document.querySelector(".wc-assistant__close").click()');await sleep(250);
  await send('Emulation.setSafeAreaInsetsOverride',{insets:{top:20,left:10,right:20,bottom:34}});
  await evaluate('document.querySelector(".wc-assistant__button").click()');await sleep(250);
  const safe=await checkPanel('safe area');
  assert.ok(safe.rect.right<=safe.width-20&&safe.rect.bottom<=safe.height-34);
  assert.equal(safe.formPadding,'12px','safe area must not be counted inside form');
  await send('Emulation.setSafeAreaInsetsOverride',{insets:{top:0,left:0,right:0,bottom:0}});
  fs.writeFileSync(path.join(root,'.tools/assistant-visual-results.json'),JSON.stringify({results,safeArea:'PASS',model:'mocked; real rendering and authorization'},null,2));
};
