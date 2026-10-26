(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const root=document.getElementById('extended-player');
  const exercise=window.__EXERCISE__||{};
  const preview=!!window.__PREVIEW__;
  const lang=(exercise.opzioni&&exercise.opzioni.linguaComandi)||'it';
  const strings={
    it:{verify:'Verifica',next:'Continua',prev:'Indietro',reset:'Azzera',correct:'Risposta corretta!',wrong:'Risposta errata!',complete:'Esercizio completato',step:'Step'},
    en:{verify:'Check',next:'Continue',prev:'Back',reset:'Reset',correct:'Correct answer!',wrong:'Wrong answer!',complete:'Exercise completed',step:'Step'},
    fr:{verify:'Vérifier',next:'Continuer',prev:'Retour',reset:'Réinitialiser',correct:'Bonne réponse !',wrong:'Réponse incorrecte !',complete:'Exercice terminé',step:'Étape'},
    es:{verify:'Verificar',next:'Continuar',prev:'Atrás',reset:'Reiniciar',correct:'¡Respuesta correcta!',wrong:'Respuesta incorrecta',complete:'Ejercicio completado',step:'Paso'},
    de:{verify:'Prüfen',next:'Weiter',prev:'Zurück',reset:'Zurücksetzen',correct:'Richtige Antwort!',wrong:'Falsche Antwort!',complete:'Übung abgeschlossen',step:'Schritt'}
  };
  const t=strings[lang]||strings.it;
  const shellHeader='<header class="xp-native-top"><span></span><span class="xp-credits">Credits</span></header>';
  const gear='<button class="xp-gear" type="button" aria-label="Impostazioni" title="Impostazioni">⚙</button>';
  function footerControls(step, all=false){
    const count=(exercise.steps||[]).length;
    const navigation=count>1&&!all?`<div class="xp-step-navigation"><button class="xp-nav" id="xp-prev" ${current===0?'disabled':''} aria-label="${t.prev}" title="${t.prev}">‹</button><button class="xp-nav" id="xp-next" ${current===count-1?'disabled':''} aria-label="${t.next}" title="${t.next}">›</button></div>`:'';
    return `<div class="xp-tile-tray" id="xp-tile-tray"></div><div class="xp-footer xp-native-footer"><div class="xp-footer-left">${gear}</div><div class="xp-footer-center">${(all || current===count-1) && (exercise.steps||[]).some(x=>!x.isExample)?`<button class="xp-btn primary" id="xp-verify">${t.verify}</button>`:''}</div><div class="xp-footer-right">${navigation}</div></div>`;
  }
  function placeTileTray(scope){const tray=$('#xp-tile-tray',scope),tiles=$('.xp-tiles',scope);if(tray&&tiles){tray.appendChild(tiles);tray.hidden=false}else if(tray){tray.hidden=true}}
  function wireGear(){ $$('.xp-gear').forEach(b=>b.onclick=()=>{const ok=window.confirm('Vuoi azzerare le risposte di questo esercizio?');if(ok){state.steps={};state.exerciseVerified=false;persist();render()}}) };
  let current=0, state={steps:{},currentStep:0};
  let api=null, initialized=false, saveTimer=null;
  function findAPI(win){let tries=0;while(win&&tries<20){if(win.API)return win.API;tries++;if(win.parent&&win.parent!==win)win=win.parent;else break;}try{return window.opener?findAPI(window.opener):null}catch(e){return null}}
  function scormInit(){if(preview)return;api=findAPI(window);if(!api)return;try{var r=api.LMSInitialize('');initialized=(r==='true'||r===true)}catch(e){}try{const raw=api.LMSGetValue('cmi.suspend_data');if(raw){const s=JSON.parse(raw);if(s&&s.extendedState)state=s.extendedState;current=Number(state.currentStep||0)}}catch(e){}}
  function calcScore(){const steps=exercise.steps||[];let done=0,correct=0;steps.forEach((st,i)=>{if(st.isExample)return;const s=state.steps[i];if(s&&s.verified){done++;if(s.correct)correct++;}});return {done,correct,total:steps.filter(st=>!st.isExample).length,score:steps.some(st=>!st.isExample)?Math.round(correct*100/steps.filter(st=>!st.isExample).length):100}}
  function persist(){state.currentStep=current;if(preview)return;clearTimeout(saveTimer);saveTimer=setTimeout(()=>{if(!api)return;try{const q=calcScore(),threshold=Number((exercise.metadata||{}).passThreshold||60);const status=state.exerciseVerified?(q.score>=threshold?'passed':'failed'):'incomplete';api.LMSSetValue('cmi.core.lesson_location',String(current));api.LMSSetValue('cmi.suspend_data',JSON.stringify({v:2,extendedState:state,score:q.score,status}));api.LMSSetValue('cmi.core.score.raw',String(q.score));api.LMSSetValue('cmi.core.lesson_status',status);api.LMSSetValue('cmi.core.exit','suspend');api.LMSCommit('')}catch(e){}},650)}
  function finish(){if(!api||!initialized)return;try{api.LMSSetValue('cmi.core.exit','suspend');api.LMSCommit('');setTimeout(()=>{try{api.LMSFinish('')}catch(e){}},750)}catch(e){}}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function assetSrc(obj){return obj&&obj.previewSrc?obj.previewSrc:(obj&&obj.src?obj.src:'')}
  function mediaHtml(item, compact=false){if(!item)return '';if(item.type==='image')return `<img src="${esc(assetSrc(item))}" alt="${esc(item.alt||item.label||'')}"/>`;if(item.type==='audio')return `<span class="xp-audio"><button type="button" data-audio-src="${esc(assetSrc(item))}" aria-label="play">▶</button><span>${esc(item.label||'Audio')}</span></span>`;return `<span>${esc(item.text||item.label||'')}</span>`}
  function wireAudio(){$$('[data-audio-src]').forEach(btn=>{btn.onclick=e=>{e.stopPropagation();const a=new Audio(btn.dataset.audioSrc);a.play().catch(()=>{})}})}
  function ensureStep(i){const ss=state.steps[i]||(state.steps[i]={});const st=(exercise.steps||[])[i];if(st&&st.isExample){ss.verified=true;ss.correct=true;if(st.builderMode==='mediaTiles'){ss.assigned=Object.fromEntries((st.mediaSegments||[]).filter(x=>x.type==='slot').map(x=>[x.id,x.answer]))}else if(st.builderMode==='mediaChoice'){ss.selected=st.correctChoiceId}else if(st.builderMode==='match'){ss.matches=Object.fromEntries((st.matchPairs||[]).map(p=>[p.left.id,p.right.id]))}else{ss.assigned=Object.fromEntries((st.builderSegments||[]).filter(x=>x.type==='slot').map(x=>[x.id,x.answer]))}}return ss}
  function attachmentsHtml(items){if(!items||!items.length)return '';return `<div class="xp-attachments">${items.map((a,i)=>{const src=esc(assetSrc(a)),label=esc(a.label||a.filename||`Allegato ${i+1}`);let player='';if(a.type==='audio')player=`<audio controls preload="none" src="${src}"></audio>`;else if(a.type==='video')player=`<video controls preload="none" src="${src}"></video>`;else if(a.type==='image')player=`<img src="${src}" alt="${label}">`;else if(a.type==='pdf')player=`<iframe title="${label}" src="${src}"></iframe>`;else player=`<a href="${src}" download>Apri allegato</a>`;return `<details class="xp-attachment"><summary>${label}</summary><div class="xp-attachment-content">${player}</div></details>`}).join('')}</div>`}
  function stepAudioHtml(step){const a=step.stepAudio;return a?`<div class="xp-media-main xp-step-audio"><audio controls preload="metadata" src="${esc(assetSrc(a))}"></audio></div>`:''}
  function feedbackHtml(i){const ss=state.steps[i];if(!state.exerciseVerified||!ss||!(exercise.steps||[])[i]||exercise.steps[i].isExample)return '';return `<div class="xp-feedback ${ss.correct?'ok':'bad'}">${ss.correct?t.correct:t.wrong}</div>`}
  function renderAll(){const steps=exercise.steps||[];root.innerHTML=`<div class="xp-shell">${shellHeader}<div class="xp-body">${exercise.consegna||exercise.attachments?.length?`<div class="xp-card xp-intro">${exercise.consegna||''}${attachmentsHtml(exercise.attachments)}</div>`:''}<div id="xp-all"></div></div>${footerControls(steps[0]||{},true)}</div>`;const host=$('#xp-all');steps.forEach((step,i)=>{const ss=ensureStep(i),card=document.createElement('section');card.className='xp-card xp-all-step';card.dataset.stepIndex=i;card.innerHTML=`<div class="xp-instruction">${step.consegna||''}</div>${attachmentsHtml(step.attachments)}${stepAudioHtml(step)}<div class="xp-content"></div>${feedbackHtml(i)}`;host.appendChild(card);card.addEventListener('click',()=>{current=i},true);renderStep(step,ss,card.querySelector('.xp-content'))});const verifyButton=$('#xp-verify');if(verifyButton)verifyButton.onclick=verifyExercise;wireAudio();wireGear()}
  function render(){if((exercise.metadata||{}).showAllSteps){renderAll();return}const steps=exercise.steps||[];if(!steps.length){root.innerHTML='<div class="xp-shell"><div class="xp-body"><div class="xp-card">Nessuno step.</div></div></div>';return}current=Math.max(0,Math.min(current,steps.length-1));const step=steps[current], ss=ensureStep(current);root.innerHTML=`<div class="xp-shell">${shellHeader}<div class="xp-body">${exercise.consegna||exercise.attachments?.length?`<div class="xp-card xp-intro">${exercise.consegna||''}${attachmentsHtml(exercise.attachments)}</div>`:''}<div class="xp-card"><div class="xp-instruction">${step.consegna||''}</div>${attachmentsHtml(step.attachments)}${stepAudioHtml(step)}${step.suggerimento?`<div class="xp-hint">${step.suggerimento}</div>`:''}<div id="xp-content"></div>${feedbackHtml(current)}</div></div>${footerControls(step)}</div>`;
    renderStep(step,ss);
    placeTileTray(root);
    const prev=$('#xp-prev');if(prev)prev.onclick=()=>{current--;persist();render()};
    const next=$('#xp-next');if(next)next.onclick=()=>{current++;persist();render()};
    const verifyButton=$('#xp-verify');if(verifyButton)verifyButton.onclick=verifyExercise;
    const reset=$('#xp-reset');if(reset)reset.onclick=()=>{state.steps[current]={};persist();render()};
    wireAudio();wireGear();
  }
  function renderStep(step,ss,host=$('#xp-content')){if(step.isExample)host.classList.add('xp-example');switch(step.builderMode){case 'mediaTiles':renderMediaTiles(step,ss,host);break;case 'mediaChoice':renderMediaChoice(step,ss,host);break;case 'match':renderMatch(step,ss,host);break;default:renderTextTiles(step,ss,host)}}
  // Each physical tile has its own identity, even when two tiles share the same text.
  function assignTile(index,slotId,kind,id){
    const step=(exercise.steps||[])[index];if(!step||step.isExample)return;
    const ss=ensureStep(index);ss.assigned=ss.assigned||{};ss.tileIds=ss.tileIds||{};
    const tiles=kind==='text'?(step.builderTiles||[]):(step.mediaTiles||[]);
    const key=String(id);const value=kind==='text'?tiles[Number(id)]:key;
    if(kind==='text'&&value===undefined)return;
    if(kind==='media'&&!tiles.some(t=>String(t.id)===key))return;
    // A tile may occupy only one slot; replacing a tile returns the displaced tile to the tray.
    Object.keys(ss.tileIds).forEach(k=>{if(ss.tileIds[k]===key&&k!==slotId){delete ss.tileIds[k];delete ss.assigned[k]}});
    ss.assigned[slotId]=value;ss.tileIds[slotId]=key;
    ss.selectedTile=null;ss.selectedMedia=null;invalidateVerification();ss.verified=false;persist();render();
  }
  function clearSlot(index,slotId){const ss=ensureStep(index);if(ss.lockedSlots?.[slotId])return;delete (ss.assigned||{})[slotId];delete (ss.tileIds||{})[slotId];invalidateVerification();persist();render()}
  function renderTextTiles(step,ss,host){
    const tiles=step.builderTiles||[],assigned=ss.assigned||{},used=new Set(Object.values(ss.tileIds||{}).map(String));
    const parsed=step.builderSegments||[];
    host.innerHTML=`<div class="xp-text">${parsed.map(seg=>seg.type==='text'?seg.html:`<span class="xp-slot ${assigned[seg.id]?'filled':''}" data-slot="${esc(seg.id)}">${assigned[seg.id]?esc(assigned[seg.id]):'&nbsp;'}</span>`).join('')}</div><div class="xp-tiles">${tiles.map((v,i)=>used.has(String(i))?'':`<button type="button" class="xp-tile" data-tile-index="${i}">${esc(v)}</button>`).join('')}</div>`;
    $$('[data-tile-index]',host).forEach(btn=>btn.onclick=()=>{if(step.isExample)return;ss.selectedTile=Number(btn.dataset.tileIndex);$$('.xp-tile',host).forEach(x=>x.classList.remove('selected'));btn.classList.add('selected')});
    $$('[data-slot]',host).forEach(slot=>slot.onclick=()=>{if(step.isExample)return;const idx=Number(host.closest('[data-step-index]')?.dataset.stepIndex??current);if(ss.selectedTile!=null)assignTile(idx,slot.dataset.slot,'text',ss.selectedTile);else clearSlot(idx,slot.dataset.slot)});
  }
  function renderMediaTiles(step,ss,host){
    const tiles=step.mediaTiles||[],assigned=ss.assigned||{},used=new Set(Object.values(ss.tileIds||{}).map(String));
    host.innerHTML=`<div class="xp-text">${(step.mediaSegments||[]).map(seg=>seg.type==='text'?seg.html:`<span class="xp-slot ${assigned[seg.id]?'filled':''}" data-slot="${esc(seg.id)}">${assigned[seg.id]?mediaHtml(tiles.find(x=>x.id===assigned[seg.id]),true):'&nbsp;'}</span>`).join('')}</div><div class="xp-tiles">${tiles.map(it=>used.has(String(it.id))?'':`<button type="button" class="xp-tile" data-media-id="${esc(it.id)}">${mediaHtml(it)}</button>`).join('')}</div>`;
    $$('[data-media-id]',host).forEach(btn=>btn.onclick=e=>{if(e.target.closest('[data-audio-src]')||step.isExample)return;ss.selectedMedia=btn.dataset.mediaId;$$('.xp-tile',host).forEach(x=>x.classList.remove('selected'));btn.classList.add('selected')});
    $$('[data-slot]',host).forEach(slot=>slot.onclick=e=>{if(e.target.closest('[data-audio-src]')||step.isExample)return;const idx=Number(host.closest('[data-step-index]')?.dataset.stepIndex??current);if(ss.selectedMedia)assignTile(idx,slot.dataset.slot,'media',ss.selectedMedia);else clearSlot(idx,slot.dataset.slot)});wireAudio();
  }
  function renderMediaChoice(step,ss,host){const m=step.mainMedia||null;const choices=step.choiceTiles||[];host.innerHTML=`${m?`<div class="xp-media-main">${m.type==='video'?`<video src="${esc(assetSrc(m))}" controls></video>`:`<audio src="${esc(assetSrc(m))}" controls></audio>`}</div>`:''}<div class="xp-choice-grid xp-tiles">${choices.map(it=>`<button class="xp-choice xp-tile ${ss.selected===it.id?'selected':''}" data-choice="${esc(it.id)}">${mediaHtml(it)}</button>`).join('')}</div>`;$$('[data-choice]',host).forEach(btn=>btn.onclick=e=>{if(e.target.closest('[data-audio-src]'))return;if(step.isExample)return;ss.selected=btn.dataset.choice;invalidateVerification();ss.verified=false;persist();render()});wireAudio()}
  function renderMatch(step,ss,host){const pairs=step.matchPairs||[], right=(step.rightOrder||pairs.map(p=>p.right.id)).map(id=>pairs.map(p=>p.right).find(x=>x.id===id)).filter(Boolean);const matches=ss.matches||{};host.innerHTML=`<div class="xp-match-wrap"><svg class="xp-lines"></svg><div class="xp-col xp-left">${pairs.map(p=>`<button class="xp-match-item" data-left="${esc(p.left.id)}">${mediaHtml(p.left)}</button>`).join('')}</div><div class="xp-col xp-right">${right.map(it=>`<button class="xp-match-item" data-right="${esc(it.id)}">${mediaHtml(it)}</button>`).join('')}</div></div>`;let active=ss.activeLeft||null;function sync(){$$('[data-left]',host).forEach(b=>{b.classList.toggle('active',b.dataset.left===active);b.classList.toggle('matched',!!matches[b.dataset.left])});$$('[data-right]',host).forEach(b=>b.classList.toggle('matched',Object.values(matches).includes(b.dataset.right)));drawLines(host,matches)}$$('[data-left]',host).forEach(btn=>btn.onclick=e=>{if(e.target.closest('[data-audio-src]'))return;if(step.isExample)return;active=btn.dataset.left;ss.activeLeft=active;sync()});$$('[data-right]',host).forEach(btn=>btn.onclick=e=>{if(e.target.closest('[data-audio-src]')||!active)return;if(step.isExample)return;matches[active]=btn.dataset.right;ss.matches=matches;ss.verified=false;ss.activeLeft=null;active=null;persist();sync()});sync();wireAudio();window.addEventListener('resize',()=>drawLines(host,matches),{once:true})}
  function drawLines(host,matches){const svg=$('.xp-lines',host),wrap=$('.xp-match-wrap',host);if(!svg||!wrap)return;const wr=wrap.getBoundingClientRect();svg.setAttribute('width',wr.width);svg.setAttribute('height',wr.height);svg.innerHTML='';Object.entries(matches).forEach(([l,r])=>{const a=$(`[data-left="${CSS.escape(l)}"]`,host),b=$(`[data-right="${CSS.escape(r)}"]`,host);if(!a||!b)return;const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect(),x1=ar.right-wr.left,y1=ar.top+ar.height/2-wr.top,x2=br.left-wr.left,y2=br.top+br.height/2-wr.top;svg.innerHTML+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#17a2b8" stroke-width="3"/>`})}
  function verify(step,ss,scope=document){let ok=false;if(step.builderMode==='mediaTiles'){const expected={};(step.mediaSegments||[]).filter(x=>x.type==='slot').forEach(x=>expected[x.id]=x.answer);ok=Object.keys(expected).length>0&&Object.keys(expected).every(k=>ss.assigned&&ss.assigned[k]===expected[k])}else if(step.builderMode==='mediaChoice'){ok=!!ss.selected&&ss.selected===step.correctChoiceId}else if(step.builderMode==='match'){ok=(step.matchPairs||[]).length>0&&(step.matchPairs||[]).every(p=>ss.matches&&ss.matches[p.left.id]===p.right.id)}else{const expected={};(step.builderSegments||[]).filter(x=>x.type==='slot').forEach(x=>expected[x.id]=x.answer);ok=Object.keys(expected).length>0&&Object.keys(expected).every(k=>ss.assigned&&(ss.assigned[k]===expected[k]||(step.builderAlternatives?.[k]||[]).includes(ss.assigned[k])))}ss.verified=true;ss.correct=ok;return ok}
  function verifyExercise(){const steps=exercise.steps||[];steps.forEach((step,i)=>{if(step.isExample)return;verify(step,ensureStep(i))});state.exerciseVerified=true;persist();render()}
  function invalidateVerification(){if(!state.exerciseVerified)return;state.exerciseVerified=false;Object.values(state.steps).forEach(ss=>{ss.verified=false;delete ss.correct})}
  // Unified pointer-based dragging for mouse, pen and touch. Avoid native HTML5 DnD,
  // which is inconsistent inside previews and for buttons containing audio controls.
  let activeDrag=null;
  const tileSelector='.xp-tile[data-tile-index],.xp-tile[data-media-id]';
  function tilePayload(tile){const card=tile.closest('[data-step-index]');return {kind:tile.hasAttribute('data-tile-index')?'text':'media',id:tile.hasAttribute('data-tile-index')?tile.dataset.tileIndex:tile.dataset.mediaId,index:card?Number(card.dataset.stepIndex):current}}
  function slotIndex(slot){const card=slot.closest('[data-step-index]');return card?Number(card.dataset.stepIndex):current}
  function targetSlot(x,y){const el=document.elementFromPoint(x,y);return el&&el.closest('.xp-slot')}
  function clearDrag(){const d=activeDrag;activeDrag=null;if(!d)return;if(d.ghost)d.ghost.remove();if(d.tile&&d.tile.isConnected)d.tile.style.opacity='';$$('.xp-drop-target',root).forEach(x=>x.classList.remove('xp-drop-target'));}
  root.addEventListener('dragstart',e=>{if(e.target.closest(tileSelector))e.preventDefault()});
  root.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    const tile=e.target.closest(tileSelector);
    if(!tile||e.target.closest('[data-audio-src]'))return;
    const payload=tilePayload(tile);
    if(exercise.steps?.[payload.index]?.isExample)return;
    activeDrag={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,payload,tile,ghost:null};
    try{tile.setPointerCapture(e.pointerId)}catch(_){}
  });
  root.addEventListener('pointermove',e=>{
    const d=activeDrag;if(!d||e.pointerId!==d.pointerId)return;
    d.x=e.clientX;d.y=e.clientY;
    if(!d.ghost&&Math.hypot(e.clientX-d.startX,e.clientY-d.startY)<6)return;
    if(!d.ghost){d.ghost=d.tile.cloneNode(true);d.ghost.removeAttribute('id');d.ghost.classList.add('xp-drag-ghost');d.ghost.style.width=d.tile.getBoundingClientRect().width+'px';document.body.appendChild(d.ghost);d.tile.style.opacity='.25'}
    e.preventDefault();d.ghost.style.left=e.clientX+'px';d.ghost.style.top=e.clientY+'px';
    const slot=targetSlot(e.clientX,e.clientY);
    $$('.xp-slot',root).forEach(x=>x.classList.toggle('xp-drop-target',x===slot&&slotIndex(x)===d.payload.index));
  },{passive:false});
  root.addEventListener('pointerup',e=>{
    const d=activeDrag;if(!d||e.pointerId!==d.pointerId)return;
    const slot=d.ghost?targetSlot(e.clientX,e.clientY):null;
    const valid=slot&&root.contains(slot)&&slotIndex(slot)===d.payload.index;
    clearDrag();
    if(valid){e.preventDefault();assignTile(d.payload.index,slot.dataset.slot,d.payload.kind,d.payload.id)}
  });
  root.addEventListener('pointercancel',clearDrag);
  scormInit();render();window.addEventListener('beforeunload',finish);
})();
