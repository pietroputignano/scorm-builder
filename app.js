(() => {
  const STATIC_ASSETS=["player/fonts/KaTeX_AMS-Regular.ttf", "player/fonts/KaTeX_AMS-Regular.woff", "player/fonts/KaTeX_AMS-Regular.woff2", "player/fonts/KaTeX_Caligraphic-Bold.ttf", "player/fonts/KaTeX_Caligraphic-Bold.woff", "player/fonts/KaTeX_Caligraphic-Bold.woff2", "player/fonts/KaTeX_Caligraphic-Regular.ttf", "player/fonts/KaTeX_Caligraphic-Regular.woff", "player/fonts/KaTeX_Caligraphic-Regular.woff2", "player/fonts/KaTeX_Fraktur-Bold.ttf", "player/fonts/KaTeX_Fraktur-Bold.woff", "player/fonts/KaTeX_Fraktur-Bold.woff2", "player/fonts/KaTeX_Fraktur-Regular.ttf", "player/fonts/KaTeX_Fraktur-Regular.woff", "player/fonts/KaTeX_Fraktur-Regular.woff2", "player/fonts/KaTeX_Main-Bold.ttf", "player/fonts/KaTeX_Main-Bold.woff", "player/fonts/KaTeX_Main-Bold.woff2", "player/fonts/KaTeX_Main-BoldItalic.ttf", "player/fonts/KaTeX_Main-BoldItalic.woff", "player/fonts/KaTeX_Main-BoldItalic.woff2", "player/fonts/KaTeX_Main-Italic.ttf", "player/fonts/KaTeX_Main-Italic.woff", "player/fonts/KaTeX_Main-Italic.woff2", "player/fonts/KaTeX_Main-Regular.ttf", "player/fonts/KaTeX_Main-Regular.woff", "player/fonts/KaTeX_Main-Regular.woff2", "player/fonts/KaTeX_Math-BoldItalic.ttf", "player/fonts/KaTeX_Math-BoldItalic.woff", "player/fonts/KaTeX_Math-BoldItalic.woff2", "player/fonts/KaTeX_Math-Italic.ttf", "player/fonts/KaTeX_Math-Italic.woff", "player/fonts/KaTeX_Math-Italic.woff2", "player/fonts/KaTeX_SansSerif-Bold.ttf", "player/fonts/KaTeX_SansSerif-Bold.woff", "player/fonts/KaTeX_SansSerif-Bold.woff2", "player/fonts/KaTeX_SansSerif-Italic.ttf", "player/fonts/KaTeX_SansSerif-Italic.woff", "player/fonts/KaTeX_SansSerif-Italic.woff2", "player/fonts/KaTeX_SansSerif-Regular.ttf", "player/fonts/KaTeX_SansSerif-Regular.woff", "player/fonts/KaTeX_SansSerif-Regular.woff2", "player/fonts/KaTeX_Script-Regular.ttf", "player/fonts/KaTeX_Script-Regular.woff", "player/fonts/KaTeX_Script-Regular.woff2", "player/fonts/KaTeX_Size1-Regular.ttf", "player/fonts/KaTeX_Size1-Regular.woff", "player/fonts/KaTeX_Size1-Regular.woff2", "player/fonts/KaTeX_Size2-Regular.ttf", "player/fonts/KaTeX_Size2-Regular.woff", "player/fonts/KaTeX_Size2-Regular.woff2", "player/fonts/KaTeX_Size3-Regular.ttf", "player/fonts/KaTeX_Size3-Regular.woff", "player/fonts/KaTeX_Size3-Regular.woff2", "player/fonts/KaTeX_Size4-Regular.ttf", "player/fonts/KaTeX_Size4-Regular.woff", "player/fonts/KaTeX_Size4-Regular.woff2", "player/fonts/KaTeX_Typewriter-Regular.ttf", "player/fonts/KaTeX_Typewriter-Regular.woff", "player/fonts/KaTeX_Typewriter-Regular.woff2", "player/fonts/MaterialIcons-Regular.eot", "player/fonts/MaterialIcons-Regular.ttf", "player/fonts/MaterialIcons-Regular.woff", "player/fonts/MaterialIcons-Regular.woff2", "player/fonts/Muli/muli-bold-webfont.eot", "player/fonts/Muli/muli-bold-webfont.svg", "player/fonts/Muli/muli-bold-webfont.ttf", "player/fonts/Muli/muli-bold-webfont.woff", "player/fonts/Muli/muli-bold-webfont.woff2", "player/fonts/Muli/muli_italic-webfont.eot", "player/fonts/Muli/muli_italic-webfont.svg", "player/fonts/Muli/muli_italic-webfont.ttf", "player/fonts/Muli/muli_italic-webfont.woff", "player/fonts/Muli/muli_italic-webfont.woff2", "player/fonts/Muli/muli_regular-webfont.eot", "player/fonts/Muli/muli_regular-webfont.svg", "player/fonts/Muli/muli_regular-webfont.ttf", "player/fonts/Muli/muli_regular-webfont.woff", "player/fonts/Muli/muli_regular-webfont.woff2", "images/alternative.svg", "images/audio.svg", "images/calcolatrice.svg", "images/corretto.svg", "images/errato.svg", "images/esempio.svg", "images/gomma.svg", "images/gomma_selezionata.svg", "images/img.svg", "images/soluzioni.svg", "images/soluzioni_a_step.svg", "images/tue_risposte.svg", "images/txt.svg", "images/video.svg"];
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const stepsEl = $('#steps');
  const tpl = $('#stepTemplate');
  let renderSeq = 1;

  function uuid() {
    return (crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  }

  function htmlEscape(s='') {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function baseEntityOptions() {
    return {esempio:false,valutazione:'NORMALE',mostraContatore:'NO',allineamento:'SINISTRA',inizialeMaiuscola:false,valutaSpazi:true,valutaSpaziExtra:false,valutaPunteggiatura:false,valutaLettere:false,campoScriviPiccolo:false,soloNumeri:false,soloLettere:false,totaleCaratteri:0,totaleParole:0};
  }

  function baseStepOptions() {
    return {testoCentrato:false,testoFissoRiscrivi:true,quizRispostaMultipla:false,quizVeroFalso:false,separaApostrofo:'NO',esempio:false,valutazione:'NORMALE',mostraContatore:'NO',allineamento:'SINISTRA',inizialeMaiuscola:false,valutaSpazi:true,valutaSpaziExtra:false,valutaPunteggiatura:false,valutaLettere:false,campoScriviPiccolo:false,soloNumeri:false,soloLettere:false,totaleCaratteri:0,totaleParole:0};
  }

  function addStep(preset={}) {
    const node = tpl.content.firstElementChild.cloneNode(true);
    stepsEl.appendChild(node);
    if (preset.mode) $('.step-mode',node).value=preset.mode;
    if (preset.instruction) $('.step-instruction',node).value=preset.instruction;
    if (preset.content) $('.step-content',node).value=preset.content;
    if (preset.order) $('.step-order',node).value=preset.order;
    if (preset.distractors!==undefined) $('.step-distractors',node).value=preset.distractors;
    if (preset.hint) $('.step-hint',node).value=preset.hint;
    $('.step-mode',node).addEventListener('change',()=>{syncStepMode(node); refreshParsed(node);});
    $$('.step-content,.step-order,.step-distractors',node).forEach(el=>el.addEventListener('input',()=>refreshParsed(node)));
    $('.remove-step',node).addEventListener('click',()=>{node.remove();renumber();schedulePreview();});
    node.addEventListener('input',schedulePreview);
    node.addEventListener('change',schedulePreview);
    syncStepMode(node); refreshParsed(node); renumber();
  }

  function renumber(){ $$('.step-card').forEach((el,i)=>$('.step-number',el).textContent=String(i+1)); }
  function syncStepMode(node){
    const mode=$('.step-mode',node).value;
    $('.completion-field',node).classList.toggle('hidden',mode!=='completion');
    $('.order-field',node).classList.toggle('hidden',mode!=='order');
  }

  function parseCompletion(text) {
    text=text.replace(/\r?\n/g,'<br/>');
    const entities=[]; const tiles=[]; const re=/\[([^\[\]]+)\]/g; let m;
    while((m=re.exec(text))){
      const answer=m[1].trim(); if(!answer) continue;
      entities.push({answer,start:m.index,end:m.index+m[0].length}); tiles.push(answer);
    }
    return {svolgimento:text, entities, tiles};
  }

  function parseOrder(text) {
    const lines=text.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    let svolgimento=''; const entities=[]; const tiles=[];
    lines.forEach((line,li)=>{
      const parts=line.split('|').map(s=>s.trim()).filter(Boolean);
      parts.forEach((p,pi)=>{
        if(pi>0) svolgimento+=' ';
        const token=`[${p}]`; const start=svolgimento.length;
        svolgimento+=token; const end=svolgimento.length;
        entities.push({answer:p,start,end}); tiles.push(p);
      });
      if(li<lines.length-1) svolgimento+='<br/>';
    });
    return {svolgimento,entities,tiles};
  }

  function buildStep(node,index) {
    const mode=$('.step-mode',node).value;
    const parsed=mode==='order' ? parseOrder($('.step-order',node).value) : parseCompletion($('.step-content',node).value);
    const distractors=$('.step-distractors',node).value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    const id=uuid();
    const entities=parsed.entities.map((e,i)=>({answers:[e.answer],id:uuid(),start:e.start,end:e.end,opzioni:baseEntityOptions(),refEntities:[],refType:null,options:[],alternatives:[]}));
    return {
      step:{tipologia:'INSERISCI',consegna:htmlEscape($('.step-instruction',node).value),svolgimento:parsed.svolgimento,opzioni:baseStepOptions(),_svolgimento:null,suggerimento:htmlEscape($('.step-hint',node).value),allegatiColonna:[],allegati:[],audioAlCheckColonna:null,audioAlCheck:null,immagine:null,id,grouped:false,alternateSteps:[],entitiesOptions:[...parsed.tiles,...distractors],entities,status:null,count:0},
      tiles:[...parsed.tiles,...distractors]
    };
  }

  function buildExercise() {
    const built=$$('.step-card').map(buildStep);
    const allTiles=built.flatMap(x=>x.tiles);
    return {
      titolo:$('#title').value.trim()||'Esercizio',
      consegna:'',testoFisso:'',hint:'',metadata:{passThreshold:Number($('#passThreshold').value||60),showHelp:$('#showHelp').checked,showTitle:$('#showTitle').checked},
      opzioni:{calcolatrice:false,fonetica:false,tastierino:null,linguaComandi:$('#language').value,tentativi:Number($('#attempts').value||0),valutaStep:$('#evaluateStep').checked,mostraSoluzioni:$('#showSolutions').checked,soluzioniAStep:$('#solutionsByStep').checked,mostraReset:$('#showReset').checked,inserisciConTessere:true,mostraTuttiStep:false},
      avvisi:{valutaSpazi:null,valutaSpaziExtra:null,valutaPunteggiatura:null,valutaLettere:null,soloNumeri:null,soloLettere:null,totaleCaratteri:null,totaleParole:null},
      allegatiColonna:[],allegati:[],audioAlCheckColonna:null,audioAlCheck:null,entitiesOptions:allTiles,colori:[],immagine:null,steps:built.map(x=>x.step),optionsByType:{}
    };
  }

  function refreshParsed(node){
    const mode=$('.step-mode',node).value;
    const p=mode==='order'?parseOrder($('.step-order',node).value):parseCompletion($('.step-content',node).value);
    const extras=$('.step-distractors',node).value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    $('.parsed-tiles',node).innerHTML=[...p.tiles,...extras].map(t=>`<span class="tile-preview">${htmlEscape(t)}</span>`).join(' ')||'<em>nessuna tessera</em>';
  }

  function renderPreview(){
    try{
      const exercise=buildExercise();
      const resource={id:`preview-${renderSeq++}`,title:exercise.titolo,resource_code:'BSMART_SCORM_BUILDER',assets:[{filename:'content.json'}]};
      const fetchAsset=(asset,cb)=>{ if(asset.filename.endsWith('content.json')) cb(null,exercise); else cb(new Error(`Asset non trovato: ${asset.filename}`)); };
      window.bSmartUi.renderExercisesPlayer('exercises-player',{resource,fetchAsset,showTitle:$('#showTitle').checked,showHelp:$('#showHelp').checked,showSolutions:$('#showSolutions').checked,defaultLang:$('#language').value,onVerify:()=>{}});
      $('#saveState').textContent='Anteprima aggiornata';
    }catch(err){ console.error(err); $('#saveState').textContent=`Errore: ${err.message}`; }
  }

  let previewTimer=null;
  function schedulePreview(){ clearTimeout(previewTimer); previewTimer=setTimeout(renderPreview,450); }

  function scormManifest(title){
    const safe=title.replace(/[<>&]/g,'');
    const assetFiles=STATIC_ASSETS.map(path=>`<file href="${path}"/>`).join('');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<manifest identifier="bsmart-scorm" version="1.2" xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2">\n  <organizations default="ORG-1"><organization identifier="ORG-1"><title>${safe}</title><item identifier="ITEM-1" identifierref="SCO-1"><title>${safe}</title></item></organization></organizations>\n  <resources><resource identifier="SCO-1" type="webcontent" adlcp:scormtype="sco" href="index.html"><file href="index.html"/><file href="content.json"/><file href="player/exercises-player.runtime.js"/><file href="player/exercises-player.min.css"/><file href="scorm.js"/><file href="bootstrap.js"/>${assetFiles}</resource></resources>\n</manifest>`;
  }

  function scormIndex(title){return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${htmlEscape(title)}</title><link rel="stylesheet" href="player/exercises-player.min.css"><style>html,body,#exercises-player{height:100%;margin:0}body{overflow:hidden}</style></head><body><div id="exercises-player"><p>loading...</p></div><script src="player/exercises-player.runtime.js"></script><script src="scorm.js"></script><script src="bootstrap.js"></script></body></html>`;}

  const scormJs=`(function(){\n  function findAPI(win){var tries=0;while(win&&tries<20){if(win.API)return win.API;tries++;if(win.parent&&win.parent!==win)win=win.parent;else break;}try{if(window.opener)return findAPI(window.opener);}catch(e){}return null;}\n  var api=findAPI(window), initialized=false, lastSet=0;\n  function init(){if(!api)return false;try{var r=api.LMSInitialize(\"\");initialized=(r===\"true\"||r===true);}catch(e){}return initialized;}\n  function get(k){try{return api&&api.LMSGetValue(k)||\"\";}catch(e){return \"\";}}\n  function set(k,v){try{if(api){api.LMSSetValue(k,String(v));lastSet=Date.now();}}catch(e){}}\n  function commit(){try{api&&api.LMSCommit(\"\");}catch(e){}}\n  function restore(){var raw=get('cmi.suspend_data');if(!raw)return null;try{var x=JSON.parse(raw);return x.playerState||x;}catch(e){return null;}}\n  function persist(summary, threshold){if(!summary)return;var c=summary.ExeCorrectAnswers||0,w=summary.ExeWrongAnswers||0,total=c+w,score=total?Math.round(c*100/total):0;var ps=summary.ExeResponses||{},keys=Object.keys(ps).filter(function(k){return k!=='currentStep'&&k!=='lastReset';}),done=keys.length>0&&keys.every(function(k){var st=ps[k]&&ps[k].status;return st&&st!=='INCOMPLETE';});var status=done?(score>=threshold?'passed':'failed'):'incomplete';set('cmi.core.lesson_location',(summary.ExeResponses&&summary.ExeResponses.currentStep)||0);set('cmi.suspend_data',JSON.stringify({v:1,playerState:summary.ExeResponses||{},score:score,status:status}));set('cmi.core.score.raw',score);set('cmi.core.lesson_status',status);set('cmi.core.exit','suspend');commit();}\n  function finish(){if(!api||!initialized)return;try{set('cmi.core.exit','suspend');commit();api.LMSFinish(\"\");}catch(e){}}\n  window.BSMART_SCORM={init:init,restore:restore,persist:persist,finish:finish};window.addEventListener('beforeunload',finish);\n})();`;

  function makeBootstrapJs(exercise){
    const embedded=JSON.stringify(exercise).replace(/</g,'\\u003c');
    return `(function(){\n  function esc(s){return String(s==null?'':s).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}\n  function showError(message,detail){var el=document.getElementById('exercises-player');if(!el)return;el.innerHTML='<div style="font-family:Arial,sans-serif;padding:24px;color:#7a1c1c;background:#fff7f7;height:100%;box-sizing:border-box"><h2 style="margin-top:0">Impossibile avviare l\\'esercizio</h2><p>'+esc(message||'Errore sconosciuto')+'</p>'+(detail?'<pre style="white-space:pre-wrap;background:#fff;padding:12px;border:1px solid #efcaca">'+esc(detail)+'</pre>':'')+'</div>';}\n  try{\n    if(!window.bSmartUi||typeof window.bSmartUi.renderExercisesPlayer!=='function')throw new Error('Il player bSmart non è stato caricato.');\n    var exercise=${embedded};\n    try{if(window.BSMART_SCORM)BSMART_SCORM.init();}catch(e){console.warn('SCORM API non disponibile',e);}\n    var saved=null;try{saved=window.BSMART_SCORM?BSMART_SCORM.restore():null;}catch(e){console.warn('Ripristino SCORM non disponibile',e);}\n    var resource={id:'bsmart-scorm-1',title:exercise.titolo||'Esercizio',resource_code:'BSMART_SCORM',assets:[{filename:'content.json'}]};\n    function fetchAsset(asset,cb){setTimeout(function(){try{if(asset&&asset.filename&&asset.filename.endsWith('content.json'))cb(null,exercise);else cb(new Error('Asset non trovato: '+(asset&&asset.filename?asset.filename:'sconosciuto')));}catch(err){cb(err);}},0);}\n    function save(err,summary){if(err){console.error(err);return;}if(summary&&window.BSMART_SCORM){try{BSMART_SCORM.persist(summary,Number((exercise.metadata||{}).passThreshold||60));}catch(e){console.error(e);}}}\n    bSmartUi.renderExercisesPlayer('exercises-player',{resource:resource,fetchAsset:fetchAsset,userData:saved?{id:'scorm-user',content:saved}:null,showTitle:(exercise.metadata||{}).showTitle!==false,showHelp:(exercise.metadata||{}).showHelp!==false,defaultLang:(exercise.opzioni||{}).linguaComandi||'it',onVerify:save,onUnmount:save});\n    window.__BSMART_SCORM_BOOTSTRAP__={started:true,protocol:location.protocol};\n  }catch(err){console.error(err);window.__BSMART_SCORM_BOOTSTRAP__={started:false,error:String(err&&err.stack||err)};showError(err&&err.message||err,err&&err.stack||'');}\n})();`;
  }

  // Minimal ZIP writer (STORE, no compression) so GitHub Pages can export without dependencies.
  const crcTable=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
  function crc32(bytes){let c=0xffffffff;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
  function u16(n){return new Uint8Array([n&255,(n>>>8)&255]);} function u32(n){return new Uint8Array([n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255]);}
  function concat(parts){const len=parts.reduce((a,b)=>a+b.length,0),out=new Uint8Array(len);let o=0;for(const p of parts){out.set(p,o);o+=p.length;}return out;}
  function zipStore(files){const enc=new TextEncoder(),locals=[],centrals=[];let offset=0;for(const f of files){const name=enc.encode(f.name),data=f.data instanceof Uint8Array?f.data:enc.encode(f.data),crc=crc32(data);const local=concat([u32(0x04034b50),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(data.length),u32(data.length),u16(name.length),u16(0),name,data]);locals.push(local);const central=concat([u32(0x02014b50),u16(20),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(data.length),u32(data.length),u16(name.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset),name]);centrals.push(central);offset+=local.length;}const cd=concat(centrals),body=concat(locals);const end=concat([u32(0x06054b50),u16(0),u16(0),u16(files.length),u16(files.length),u32(cd.length),u32(body.length),u16(0)]);return concat([body,cd,end]);}

  async function exportScorm(){
    $('#exportBtn').disabled=true; $('#exportBtn').textContent='Creazione ZIP…';
    try{
      const exercise=buildExercise();
      const [runtime,css,...assetBuffers]=await Promise.all([
        fetch('player/exercises-player.runtime.js').then(r=>r.arrayBuffer()),
        fetch('player/exercises-player.min.css').then(r=>r.arrayBuffer()),
        ...STATIC_ASSETS.map(path=>fetch(path).then(r=>{if(!r.ok)throw new Error(`Asset mancante: ${path}`);return r.arrayBuffer();}))
      ]);
      const files=[
        {name:'imsmanifest.xml',data:scormManifest(exercise.titolo)},
        {name:'index.html',data:scormIndex(exercise.titolo)},
        {name:'content.json',data:JSON.stringify(exercise,null,2)},
        {name:'scorm.js',data:scormJs},{name:'bootstrap.js',data:makeBootstrapJs(exercise)},
        {name:'player/exercises-player.runtime.js',data:new Uint8Array(runtime)},
        {name:'player/exercises-player.min.css',data:new Uint8Array(css)},
        ...STATIC_ASSETS.map((path,i)=>({name:path,data:new Uint8Array(assetBuffers[i])}))
      ];
      const zip=zipStore(files),blob=new Blob([zip],{type:'application/zip'}),url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url;a.download=(exercise.titolo||'bsmart-scorm').replace(/[^a-z0-9_-]+/gi,'-').toLowerCase()+'.zip';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
    }catch(err){alert('Errore durante l’esportazione: '+err.message);console.error(err);}finally{$('#exportBtn').disabled=false;$('#exportBtn').textContent='Esporta SCORM';}
  }

  $('#addStepBtn').addEventListener('click',()=>{addStep({content:'Il fait [beau] aujourd’hui.',distractors:'froid\nchaud'});schedulePreview();});
  $('#previewBtn').addEventListener('click',renderPreview); $('#exportBtn').addEventListener('click',exportScorm);
  $$('.section-card input,.section-card select').forEach(el=>{el.addEventListener('input',schedulePreview);el.addEventListener('change',schedulePreview);});

  addStep();
  addStep({mode:'order',instruction:'Remets les mots dans le bon ordre.',order:'Nous | allons | au cinéma',distractors:''});
  setTimeout(renderPreview,150);
})();
