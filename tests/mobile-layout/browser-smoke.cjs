// Run after `mkdocs build --strict`: node tests/mobile-layout/browser-smoke.cjs
// Real Chromium with touch/phone viewports, not an iOS Safari engine.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {spawn, execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const assets = ['assets/javascripts/wcorp-nav.js', 'extra.css',
  'assets/stylesheets/header.css', 'assets/stylesheets/assistant.css'];
let baseline = false;
const originals = new Map(assets.map(asset => [asset,
  execFileSync('git', ['show', `HEAD:docs/${asset}`], {cwd: root})]));
const mime = {'.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css',
  '.json':'application/json', '.xml':'application/xml', '.svg':'image/svg+xml',
  '.png':'image/png', '.woff2':'font/woff2'};
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep)) {res.writeHead(403).end(); return;}
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) {res.writeHead(404).end(); return;}
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-store');
  const asset = path.relative(path.join(root, 'site'), file).split(path.sep).join('/');
  if (baseline && originals.has(asset)) {res.end(originals.get(asset)); return;}
  if (asset === 'sitemap.xml') {
    // Without a local sitemap, a full reload can masquerade as instant navigation.
    res.end(fs.readFileSync(file, 'utf8').replaceAll('https://suportewcorp.github.io/erp-docs/', `http://${req.headers.host}/site/`));
    return;
  }
  fs.createReadStream(file).pipe(res);
});
async function until(fn, label) {
  for (let i = 0; i < 200; i++) {if (await fn()) return; await sleep(50);}
  throw Error(`Timed out: ${label}`);
}

(async () => {
  fs.mkdirSync(path.join(root, '.tools'), {recursive: true});
  const profile = fs.mkdtempSync(path.join(root, '.tools/mobile-regression-'));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = spawn(process.env.MOBILE_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
      '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'],
    {windowsHide: true, stdio: 'ignore'});
  let socket, launchError;
  browser.on('error', error => {launchError = error;});
  try {
    const portFile = path.join(profile, 'DevToolsActivePort');
    await until(() => {if (launchError) throw launchError; return fs.existsSync(portFile);}, 'browser startup');
    const port = fs.readFileSync(portFile, 'utf8').split('\n')[0];
    const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    socket = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {socket.onopen = resolve; socket.onerror = reject;});
    let id = 0;
    const pending = new Map(), exceptions = [], hermesRequests = [];
    socket.onmessage = event => {
      const message = JSON.parse(event.data), entry = pending.get(message.id);
      if (entry) {pending.delete(message.id); message.error ? entry.reject(message.error) : entry.resolve(message.result);}
      if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
      if (message.method === 'Network.requestWillBeSent' && message.params.request.url.includes('wcorp-hermes-proxy')) hermesRequests.push(message.params.request.url);
    };
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const next = ++id; pending.set(next, {resolve, reject}); socket.send(JSON.stringify({id: next, method, params}));
    });
    async function evaluate(expression) {
      const result = await send('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true});
      assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
      return result.result?.value;
    }
    const ready = () => until(() => evaluate('!!document.querySelector(".wc-context-sidebar-host") && document.documentElement.classList.contains("wcorp-ready")'), 'UI ready');
    async function tap(selector) {
      const point = await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)return null;const r=e.getBoundingClientRect();const x=e.matches('.md-overlay')?r.right-20:r.left+r.width/2,y=r.top+r.height/2;return {x,y,hit:e.contains(document.elementFromPoint(x,y))};})()`);
      assert.ok(point?.hit, `Not tappable: ${selector}: ${JSON.stringify(point)}`);
      await send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x: point.x, y: point.y}]});
      await send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
      await sleep(300); // Allow the existing visual transitions to finish, tests only.
    }
    async function layout(label) {
      const state = await evaluate(`(()=>{
        const box=s=>{const e=document.querySelector(s),r=e.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,transform:getComputedStyle(e).transform};};
        return {width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,x:scrollX,
          drawer:document.querySelector('#__drawer').checked,hosts:document.querySelectorAll('.wc-context-sidebar-host').length,
          loading:document.documentElement.matches('.wc-ui-loading,.wcorp-preparing,.wc-route-transition'),
          boxes:['.md-header','.md-logo','.md-logo img','.wc-header-actions','.md-content','.md-container','.md-main'].map(box)};
      })()`);
      assert.ok(state.scrollWidth <= state.width, `${label}: document overflow ${JSON.stringify(state)}`);
      assert.equal(state.x, 0, `${label}: horizontal scroll`);
      assert.equal(state.hosts, 1, `${label}: sidebar count`);
      assert.equal(state.loading, false, `${label}: stale loading`);
      for (const box of state.boxes) {
        assert.ok(box.left >= -1 && box.right <= state.width + 1, `${label}: clipped element ${JSON.stringify(box)}`);
        assert.equal(box.transform, 'none', `${label}: content transform`);
      }
      return {label, width: state.width, scrollWidth: state.scrollWidth};
    }
    await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
    await send('Network.setCacheDisabled', {cacheDisabled: true});
    // The tutorial is a separate feature; dismiss it as a returning visitor.
    await send('Page.addScriptToEvaluateOnNewDocument', {source: 'localStorage.setItem("wcorpHelpTourCompleted","true");'});
    const results = [];
    for (const [width, height] of [[390,844], [320,568], [375,812], [430,932], [768,1024], [844,390]]) {
      await send('Emulation.setDeviceMetricsOverride', {width,height,deviceScaleFactor:1,mobile:true});
      await send('Emulation.setTouchEmulationEnabled', {enabled:true});
      await send('Page.navigate', {url: origin + '/site/'}); await ready(); await sleep(300);
      await evaluate('window.__mobileInstantSentinel=true');
      results.push(await layout(`${width}: home`));
      const navigate = async route => {
        await tap('.md-header label[for="__drawer"]');
        assert.equal(await evaluate('document.querySelector("#__drawer").checked'), true);
        await tap(`.wc-global-nav a[href="${origin}/site/${route}"]`);
        await until(() => evaluate(`location.pathname === '/site/${route}' && !document.documentElement.classList.contains('wc-ui-loading')`), route);
        assert.equal(await evaluate('document.querySelector("#__drawer").checked'), false, 'drawer must close');
        assert.equal(await evaluate('window.__mobileInstantSentinel'), true, 'must not reload');
        results.push(await layout(`${width}: ${route}`));
      };
      await navigate('como-fazer/');
      for (const route of ['manual/','como-fazer/','referencia/','ferramentas/','como-fazer/']) await navigate(route);
      await navigate('como-fazer/'); // Same-page link is consumed by the capture listener.
      await tap('.md-header label[for="__drawer"]'); await tap('.md-overlay');
      assert.equal(await evaluate('document.querySelector("#__drawer").checked'), false);
      await evaluate('history.back()'); await until(() => evaluate('location.pathname.endsWith("/ferramentas/")'), 'back'); await ready(); await sleep(300);
      results.push(await layout(`${width}: back`));
      await evaluate('history.forward()'); await until(() => evaluate('location.pathname.endsWith("/como-fazer/")'), 'forward'); await ready(); await sleep(300);
      results.push(await layout(`${width}: forward`));
      await tap('label[for="__search"]');
      assert.equal(await evaluate('document.querySelector("#__search").checked'), true);
      const overlay = await evaluate('document.querySelector(".md-search__overlay").getBoundingClientRect().toJSON()');
      assert.equal(overlay.left, 0); assert.equal(overlay.width, width);
      await tap('.md-search__input');
      await send('Input.insertText', {text: 'nota fiscal'});
      await send('Input.dispatchKeyEvent', {type:'keyUp',key:'l',code:'KeyL'});
      try {
        await until(() => evaluate('document.querySelectorAll(".md-search-result__item").length > 0'), 'search results');
      } catch (error) {
        console.error(await evaluate('({focus:document.activeElement?.className,value:document.querySelector(".md-search__input").value,output:document.querySelector(".md-search__output").innerHTML})'), exceptions);
        throw error;
      }
      await tap('.md-search__icon[for="__search"]');
      assert.equal(await evaluate('document.querySelector("#__search").checked'), false);
      results.push(await layout(`${width}: search closed`));
      await tap('.wc-assistant__button');
      const panel = await evaluate('document.querySelector(".wc-assistant__panel").getBoundingClientRect().toJSON()');
      assert.ok(panel.left >= 0 && panel.right <= width && panel.top >= 0 && panel.bottom <= height, `Panel clipped: ${JSON.stringify(panel)}`);
      await tap('.wc-assistant__close');
      results.push(await layout(`${width}: assistant closed`));
      await evaluate('window.scrollTo(0,1200)'); await sleep(250);
      await evaluate('window.scrollBy(0,-150)'); await sleep(400);
      const top = await evaluate('(()=>{const e=document.querySelector(".md-top");return {rect:e.getBoundingClientRect().toJSON(),top:getComputedStyle(e).top,inline:e.style.top,hidden:e.hidden};})()');
      assert.equal(top.top, top.inline, 'mobile top must follow Material inline position');
      assert.equal(top.hidden, false);
      await tap('.md-top'); await until(() => evaluate('scrollY===0'), 'back to top');
      results.push(await layout(`${width}: top`));
      const idempotent = await evaluate(`(()=>{const host=document.querySelector('.wc-context-sidebar-host'),breadcrumb=document.querySelector('.wc-breadcrumb'),trigger=host.querySelector('.wc-context-nav__trigger');trigger.click();window.document$.next(document);return {same:host===document.querySelector('.wc-context-sidebar-host'),breadcrumb:breadcrumb===document.querySelector('.wc-breadcrumb'),expanded:trigger.getAttribute('aria-expanded')};})()`);
      assert.deepEqual(idempotent, {same:true,breadcrumb:true,expanded:'true'});
      fs.writeFileSync(path.join(root, `.tools/mobile-${width}.png`), Buffer.from((await send('Page.captureScreenshot', {format:'png'})).data, 'base64'));
      console.log(`PASS ${width}x${height}: touch, instant x5, history, drawer, search, assistant, top, geometry`);
    }
    // Exercise actual env() values, without modifying application CSS/JS.
    await send('Emulation.setDeviceMetricsOverride', {width:390,height:844,deviceScaleFactor:1,mobile:true});
    await send('Emulation.setSafeAreaInsetsOverride', {insets:{top:0,left:0,right:20,bottom:34}});
    await sleep(300);
    const launcher = await evaluate('document.querySelector(".wc-assistant__button").getBoundingClientRect().toJSON()');
    assert.ok(launcher.right <= 390-20-16 && launcher.bottom <= 844-34-16);
    await tap('.wc-assistant__button');
    const safePanel = await evaluate('document.querySelector(".wc-assistant__panel").getBoundingClientRect().toJSON()');
    assert.ok(safePanel.right <= 390-20 && safePanel.bottom <= 844-34);
    await tap('.wc-assistant__close');
    await send('Emulation.setSafeAreaInsetsOverride', {insets:{top:0,left:0,right:0,bottom:0}});

    // Compare desktop geometry against these same four files from HEAD.
    await send('Emulation.setDeviceMetricsOverride', {width:1440,height:1000,deviceScaleFactor:1,mobile:false});
    await send('Emulation.setTouchEmulationEnabled', {enabled:false});
    async function desktopGeometry() {
      await send('Page.navigate', {url:origin+'/site/como-fazer/'}); await ready(); await sleep(500);
      return evaluate(`['.md-header','.md-logo','.md-logo img','.md-search','.md-content','.md-sidebar--primary','.wc-context-sidebar-host','.wc-assistant','.md-top'].map(selector=>{const e=document.querySelector(selector),r=e.getBoundingClientRect(),s=getComputedStyle(e);return {selector,x:r.x,y:r.y,width:r.width,height:r.height,font:s.font,color:s.color,transform:s.transform};})`);
    }
    baseline = true; const before = await desktopGeometry();
    baseline = false; const after = await desktopGeometry();
    assert.deepEqual(after, before, 'desktop geometry/styles changed');
    if (process.env.ASSISTANT_VISUAL === '1') {
      await require('../assistant/visual-scenarios.cjs')({send,evaluate,origin,until,sleep,root});
    }
    assert.deepEqual(exceptions, [], 'browser exceptions');
    assert.deepEqual(hermesRequests, [], 'layout tests must not invoke Hermes');
    const report = {browser:'Edge/Chromium touch emulation (not native Safari)',results,
      safeArea:'PASS (bottom 34px, right 20px)',desktop:'PASS against HEAD',exceptions,hermesRequests};
    fs.writeFileSync(path.join(root,'.tools/mobile-layout-results.json'),JSON.stringify(report,null,2));
    console.log('PASS safe area and unchanged desktop; report: .tools/mobile-layout-results.json');
    await send('Browser.close');
  } finally {socket?.close();browser.kill();server.closeAllConnections();server.close();}
})().catch(error => {console.error(error);process.exitCode=1;});
