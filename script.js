const questions = [
  { key:'watery', group:'SYMPTOMS', eyebrow:'THE FIRST CLUE', title:'Is your nose running clear and watery?', detail:'Think thin, clear discharge rather than thick mucus.', options:[['yes','Yes, clear and watery'],['no','No, not really']], insight:'A watery nose can occur with allergies and colds. The other answers help separate them.' },
  { key:'itch', group:'SYMPTOMS', eyebrow:'THE ITCH CLUE', title:'Does your nose, eyes or throat feel itchy?', detail:'A tickle or urge to rub counts.', options:[['yes','Yes, itchy'],['no','No itching']], insight:'Itching is a useful allergy clue when it appears alongside a watery nose.' },
  { key:'sneeze', group:'SYMPTOMS', eyebrow:'THE SNEEZE CLUE', title:'Have you been sneezing a lot?', detail:'Especially repeated sneezes or clusters.', options:[['yes','Yes, often'],['no','No, not often']], insight:'Sneezing can happen with both allergies and a cold, so the full pattern matters.' },
  { key:'blocked', group:'SYMPTOMS', eyebrow:'THE CONGESTION CLUE', title:'Does your nose feel blocked or stuffy?', detail:'Notice whether breathing through your nose feels harder.', options:[['yes','Yes, blocked'],['no','No, clear']], insight:'Congestion helps build the symptom picture, but it does not identify the cause alone.' },
  { key:'malaise', group:'SYMPTOMS', eyebrow:'THE EVERYDAY CLUE', title:'Do you feel a little unwell overall?', detail:'For example, mild tiredness or a generally under-the-weather feeling.', options:[['yes','Yes, a little unwell'],['no','No, otherwise well']], insight:'Mild malaise can accompany a common cold. It is a supporting clue, not a diagnosis.' },
  { key:'fever', group:'SAFETY', eyebrow:'A QUICK SAFETY CHECK', title:'Do you have a fever?', detail:'A high temperature changes what your pharmacist may need to check.', options:[['yes','Yes, fever'],['no','No fever']], insight:'A reported fever prompts a closer discussion with your pharmacist.' },
  { key:'thick', group:'SAFETY', eyebrow:'A QUICK SAFETY CHECK', title:'Is the discharge thick, yellow or green?', detail:'This is different from a thin, clear runny nose.', options:[['yes','Yes, thick or coloured'],['no','No, not that']], insight:'This answer is a prompt to review the full history, not a diagnosis by itself.' },
  { key:'pain', group:'SAFETY', eyebrow:'A QUICK SAFETY CHECK', title:'Do you feel facial pain or sinus pressure?', detail:'For example around the cheeks, eyes or forehead.', options:[['yes','Yes, pain or pressure'],['no','No pain']], insight:'Facial pain is one reason to pause and discuss the safest next step.' },
  { key:'duration', group:'SAFETY', eyebrow:'THE TIMELINE', title:'How long have symptoms been around?', detail:'Choose the closest range.', options:[['short','Up to 7 days'],['medium','8–14 days'],['long','Over 14 days']], insight:'Symptoms lasting more than 14 days prompt a closer pharmacist review.' },
  { key:'pollution', group:'AIR & TRIGGERS', eyebrow:'THE AIR CLUE', title:'Are symptoms worse on polluted days?', detail:'Think of days with haze, smoke or visibly poor air.', options:[['yes','Yes, they feel worse'],['no','No clear link'],['unsure','I’m not sure']], insight:'Your own observation is useful context. Air quality alone cannot diagnose allergy.' },
  { key:'aqi', group:'AIR & TRIGGERS', eyebrow:'THE AIR READING', title:'Do you know today’s local AQI?', detail:'Enter the range from your local air-quality report, or choose “Not sure”.', options:[['good','0–50 · Good'],['moderate','51–100 · Moderate'],['sensitive','101–150 · Sensitive groups'],['unhealthy','151+ · Unhealthy or worse'],['unknown','Not sure']], insight:'AQI above 100 is unhealthy at first for sensitive groups. This check uses your selected range, not a live reading.' },
  { key:'alignment', group:'AIR & TRIGGERS', eyebrow:'THE AIR CONNECTION', title:'Does today’s air reading match how you feel?', detail:'For example, are symptoms worse while the air quality is poor?', options:[['yes','Yes, it seems to match'],['no','No clear match'],['unsure','I’m not sure']], insight:'A match can help the pharmacist discuss triggers, but one day’s AQI cannot prove the cause of symptoms.' }
];
const state = {
  index:-1,
  answers:Object.fromEntries(questions.map(q=>[q.key,null])),
  details:false,
  motion:true
};
const app=document.getElementById('app');
const screen=document.getElementById('screen');
const rail=document.getElementById('insight-rail');
function yes(key){return state.answers[key]==='yes';}
function isHighAqi(){return ['sensitive','unhealthy'].includes(state.answers.aqi);}
function safetyFlags(){
  const flags=[];
  if(yes('fever'))flags.push('Fever');
  if(yes('thick'))flags.push('Thick coloured discharge');
  if(yes('pain'))flags.push('Facial pain or pressure');
  if(state.answers.duration==='long')flags.push('Symptoms over 14 days');
  return flags;
}
function review(reason){return {type:'review',tag:'MORE TO EXPLORE',title:'Let’s review this together.',summary:'The answers do not point clearly to one pattern. A pharmacist can help make sense of them.',evidence:[reason],next:'Share the uncertain answers with your pharmacist before deciding on care.',reason};}
function classify(){
  const a=state.answers;
  const flags=safetyFlags();
  if(flags.length)return {type:'referral',tag:'REFERRAL ASSESSMENT',title:'A closer look comes first.',summary:'A safety answer needs prompt pharmacist assessment before choosing a self-care path.',evidence:flags,next:'Share these findings with your pharmacist for physician or specialist referral assessment.',reason:'A listed safety indicator takes priority over symptom patterns. It prompts referral assessment but does not diagnose bacterial infection.'};
  if(questions.some(q=>a[q.key]===null))return review('Some symptom, safety or air answers are still unknown.');
  if(yes('watery')&&yes('itch')&&isHighAqi()){
    const reportedLink=a.pollution==='yes'&&a.alignment==='yes';
    return {type:'allergy',tag:'POSSIBLE ALLERGY + AIR PATTERN',title:'Allergy clues are adding up.',summary:reportedLink?'Your answers fit an allergy-like pattern, and you noticed symptoms alongside poor air quality.':'Your answers fit an allergy-like pattern while the selected AQI is above 100.',evidence:['Clear watery nose','Itching','AQI above 100',reportedLink?'Reported air-quality link':'Air link not confirmed'],next:'Ask your pharmacist about trigger reduction and suitable allergy care.',reason:`Watery discharge, itching and selected AQI above 100 meet the allergy-and-air rule. ${reportedLink?'You also reported that symptoms track poor air quality.':'A pollution link was not confirmed; the AQI alone does not establish the cause.'}`};
  }
  if(yes('watery')&&yes('sneeze')&&yes('blocked')&&!yes('itch')&&a.pollution!=='yes')return {type:'cold',tag:'POSSIBLE COLD PATTERN',title:'This may be a common cold.',summary:'A runny nose, sneezing and congestion can fit a viral cold pattern.',evidence:['Runny nose','Sneezing','Congestion',yes('malaise')?'Mild malaise':'No listed safety flags'],next:'Talk with your pharmacist about relief options and when to seek more care.',reason:'Watery discharge, sneezing and congestion were reported without itching, a listed safety indicator or reported pollution worsening. Mild malaise and a shorter duration can support this pattern but are not required.'};
  return review('The clues are mixed or do not clearly fit one pathway.');
}
function answeredCount(){return questions.filter(q=>state.answers[q.key]!==null).length;}
function introScreen(){
  return `<div class="intro-screen"><div class="intro-visual" aria-hidden="true"><div class="visual-disc"><svg viewBox="0 0 240 200" fill="none"><path d="M22 80c34-38 62-38 96 0s62 38 100 0"/><path d="M22 118c34-38 62-38 96 0s62 38 100 0"/><path d="M22 156c34-38 62-38 96 0s62 38 100 0"/></svg></div></div><div class="intro-content"><div class="intro-copy"><span class="overline">A 2–3 MINUTE PHARMACY CHECK</span><h1>Let’s clear<br>the air.</h1><p>Tell us what you’re feeling. We’ll bring the clues together for a better conversation with your pharmacist.</p></div><div class="intro-bottom"><p class="trust-note">Guidance for your conversation, with your pharmacist in charge.</p><button class="primary-button start-button" type="button" data-action="start">Start my check <span aria-hidden="true">→</span></button></div></div></div>`;
}
const iconPaths={
  watery:'<path d="M12 2.5C9.3 6.2 5.5 10.2 5.5 14a6.5 6.5 0 0 0 13 0c0-3.8-3.8-7.8-6.5-11.5Z"/><path d="M9 15c.2 1.4 1.1 2.3 2.3 2.6"/>',
  itch:'<path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19"/><circle cx="12" cy="12" r="2"/>',
  sneeze:'<path d="M12 3v4M4.5 6.5l2.8 2.8M2 14h4M18 14h4M16.7 9.3l2.8-2.8M7 18c3-2 7-2 10 0"/>',
  blocked:'<path d="M10 3v8l-3 4a2.8 2.8 0 0 0 2.2 4.5h5.6A2.8 2.8 0 0 0 17 15l-3-4V3M9 16h6"/>',
  malaise:'<rect x="2.5" y="7" width="17" height="10" rx="2"/><path d="M22 10v4M6 12h5"/>',
  well:'<rect x="2.5" y="7" width="17" height="10" rx="2"/><path d="M22 10v4M6 12h10M9 9v6M13 9v6"/>',
  fever:'<path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0Z"/><path d="M12 9v8"/>',
  thick:'<path d="M12 3C9 7 5 10 5 14a7 7 0 0 0 14 0c0-4-4-7-7-11Z"/><path d="M8 15c2-2 6-2 8 0"/>',
  pain:'<circle cx="12" cy="12" r="9"/><path d="M8 9.5h.01M16 9.5h.01M9 16c2-1 4-1 6 0M4 4l2 2M20 4l-2 2"/>',
  duration:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h3M8 17h7"/>',
  calendarLong:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M12 13v4m0 2h.01"/>',
  pollution:'<path d="M5 16h13a3 3 0 0 0 .2-6A6 6 0 0 0 7 8a4 4 0 0 0-2 8ZM3 19h14M8 22h13"/>',
  alignment:'<path d="M3 8c3-3 6-3 9 0s6 3 9 0M3 16c3-3 6-3 9 0s6 3 9 0"/>',
  mismatch:'<path d="M3 6c3 0 5 2 8 4s6 2 10-1M3 18c3 0 5-2 8-4s6-2 10 1"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
  moderate:'<path d="M8 5a4 4 0 0 1 7 3M4 16h15a3 3 0 0 0-.2-6 5 5 0 0 0-9.6-1A3.5 3.5 0 0 0 4 16Z"/>',
  sensitive:'<path d="M3 8h10c3 0 3-4 0-4M2 12h17c3 0 3 4 0 4M4 17h8c3 0 3 4 0 4"/>',
  unhealthy:'<path d="M5 16h13a3 3 0 0 0 .2-6A6 6 0 0 0 7 8a4 4 0 0 0-2 8ZM4 20h16M12 11v3m0 2h.01"/>',
  unknown:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.7 2.7 0 0 1 5.1 1.3c0 1.7-2.6 2-2.6 4M12 18h.01"/>'
};
const questionTones={watery:'aqua',itch:'lilac',sneeze:'peach',blocked:'mint',malaise:'lilac',fever:'coral',thick:'peach',pain:'coral',duration:'aqua',pollution:'lilac',alignment:'mint'};
function tileIcon(key,option){
  const icon=key==='aqi'?({good:'sun',moderate:'moderate',sensitive:'sensitive',unhealthy:'unhealthy',unknown:'unknown'}[option]):option==='unsure'?'unknown':key==='pollution'&&option==='no'?'sun':key==='malaise'&&option==='no'?'well':key==='alignment'&&option==='no'?'mismatch':key==='duration'&&option==='medium'?'calendar':key==='duration'&&option==='long'?'calendarLong':key;
  const crossed=option==='no'&&!['malaise','duration','pollution','alignment'].includes(key);
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[icon]}${crossed?'<path class="icon-strike" d="M4 20 20 4"/>':''}</svg>`;
}
function tileTone(key,option,index){
  return key==='aqi'?['mint','aqua','peach','coral','lilac'][index]:option==='unsure'?'lilac':questionTones[key];
}
function questionScreen(){
  const q=questions[state.index];
  const value=state.answers[q.key];
  const choices=q.options.map(([option,label],index)=>`<button type="button" data-value="${option}" data-key="${q.key}" data-tone="${tileTone(q.key,option,index)}" class="choice ${value===option?'selected':''}" aria-pressed="${value===option}"><span class="choice-icon" aria-hidden="true">${tileIcon(q.key,option)}</span><strong>${label}</strong></button>`).join('');
  return `<div class="question-screen"><div class="question-stage"><span class="question-number" aria-hidden="true">${String(state.index+1).padStart(2,'0')}</span><div class="question-copy"><span class="overline">${q.eyebrow}</span><h1>${q.title}</h1><p>${q.detail}</p></div></div><div class="answer-deck"><div class="deck-heading"><span>YOUR ANSWER</span><span>${String(state.index+1).padStart(2,'0')} / ${questions.length}</span></div><div class="choices ${q.options.length===5?'five':q.options.length===3?'three':''}" role="group" aria-label="${q.title}">${choices}</div><div class="why-note"><span class="why-label">WHY THIS MATTERS</span><p>${q.insight}</p></div><div class="question-nav"><button class="text-button" type="button" data-action="back">← ${state.index===0?'Intro':'Previous'}</button><button class="primary-button continue-button" type="button" data-action="next" ${value===null?'disabled':''}>${state.index===questions.length-1?'See my summary':'Next question'} <span aria-hidden="true">→</span></button></div></div></div>`;
}
function resultScreen(){
  const r=classify();
  if(state.details)return detailsScreen(r);
  return `<div class="result-screen ${r.type}"><div class="result-hero"><span class="overline">YOUR CHECK-IN RESULT</span><span class="result-tag">${r.tag}</span><h1>${r.title}</h1><p>${r.summary}</p></div><div class="result-body"><div class="result-block"><span class="block-label">CLUES THAT MATTERED</span><div class="evidence-list">${r.evidence.map(x=>`<span>${x}</span>`).join('')}</div></div><div class="result-block next-step"><span class="block-label">YOUR NEXT STEP</span><p>${r.next}</p></div><div class="result-disclaimer">This supports a pharmacy conversation. It is not a diagnosis or prescription.</div><div class="result-actions"><button class="text-button" type="button" data-action="edit">← Edit answers</button><button class="primary-button" type="button" data-action="details">Pharmacist details <span aria-hidden="true">→</span></button></div></div></div>`;
}
function detailsScreen(r){
  const a=state.answers;
  const duration={short:'Up to 7 days',medium:'8–14 days',long:'Over 14 days'}[a.duration]||'Unknown';
  const aqi={good:'0–50',moderate:'51–100',sensitive:'101–150',unhealthy:'151+',unknown:'Not sure'}[a.aqi]||'Unknown';
  const line=(label,value,active)=>`<div class="detail-line ${active?'active':''}"><strong>${label}</strong><span>${value}</span></div>`;
  const counsel=r.type==='allergy'?'Assess treatment suitability. An antihistamine such as fexofenadine may be an option after checking age, local labeling and contraindications.':r.type==='cold'?'Discuss suitable symptom relief, rest, fluids and follow-up if symptoms persist or worsen.':r.type==='referral'?'Assess referral using the full history and local guidance. Coloured mucus alone does not establish bacterial infection or a need for antibiotics.':'Clarify uncertain findings and consider other causes before suggesting care.';
  return `<div class="details-screen"><div class="details-hero"><span class="overline">PHARMACIST DECISION SUPPORT</span><h1>Why this pathway?</h1><p>${r.reason}</p></div><div class="details-body"><div class="detail-list"><span class="block-label">FIRST-MATCH CHECK</span>${line('01 · Safety',safetyFlags().length?safetyFlags().join(' · '):`No listed flags · ${duration}`,r.type==='referral')}${line('02 · Allergy + air',`Watery ${a.watery||'unknown'} · Itch ${a.itch||'unknown'} · AQI ${aqi} · Air link ${a.pollution||'unknown'}`,r.type==='allergy')}${line('03 · Cold',`Sneezing ${a.sneeze||'unknown'} · Congestion ${a.blocked||'unknown'} · Malaise ${a.malaise||'unknown'}`,r.type==='cold')}${line('04 · Further review','Missing or mixed findings',r.type==='review')}</div><div class="counsel-card"><span class="block-label">COUNSELING PROMPT</span><p>${counsel}</p></div><div class="result-actions"><button class="text-button" type="button" data-action="summary">← Summary</button><button class="primary-button" type="button" data-action="reset">New check <span aria-hidden="true">↗</span></button></div></div></div>`;
}
function renderRail(){
  const count=answeredCount();
  const flags=safetyFlags();
  const phase=state.index<0?'Start with what you feel.':state.index>=questions.length?'Your next step':questions[state.index].group;
  return `<span class="rail-kicker">PHARMACIST GUIDED</span><div class="rail-wave" aria-hidden="true"><svg viewBox="0 0 240 160" fill="none"><path d="M12 55c36-38 66-38 102 0s66 38 114 0"/><path d="M12 103c36-38 66-38 102 0s66 38 114 0"/></svg></div><h2>One clue at a time.<br><em>A clearer picture.</em></h2><p>Answer what you know. Your pharmacist can use the pattern, safety signs and air context to guide the conversation.</p><div class="rail-meter"><div><span>YOUR PROGRESS</span><strong>${count} <small>/ ${questions.length}</small></strong></div><div class="rail-bar"><span style="width:${count/questions.length*100}%"></span></div></div><div class="rail-current"><span>RIGHT NOW</span><strong>${phase}</strong></div><div class="rail-status ${flags.length?'alert':''}">${flags.length?`${flags.length} safety review ${flags.length===1?'flag':'flags'}`:'Safety is part of every check'}</div><div class="rail-footer">For informed conversations, not automated diagnosis.</div>`;
}
function render(){
  const intro=state.index<0,done=state.index>=questions.length;
  app.classList.toggle('is-intro',intro);
  const section=intro?'YOUR CHECK-IN':done?'YOUR SUMMARY':questions[state.index].group;
  document.getElementById('section-name').textContent=section;
  document.getElementById('progress-text').textContent=intro?'About 2–3 minutes':done?'Check complete':`Question ${state.index+1} of ${questions.length}`;
  document.getElementById('progress-track').innerHTML=questions.map((_,i)=>`<span class="${done||i<state.index?'complete':i===state.index?'current':''}"></span>`).join('');
  screen.innerHTML=intro?introScreen():done?resultScreen():questionScreen();
  rail.innerHTML=renderRail();
}
screen.addEventListener('click',event=>{
  const option=event.target.closest('[data-value]');
  if(option&&state.index>=0&&state.index<questions.length){
    state.answers[questions[state.index].key]=option.dataset.value;
    render();
    return;
  }
  const action=event.target.closest('[data-action]')?.dataset.action;
  if(!action)return;
  if(action==='start')state.index=0;
  if(action==='next'&&state.answers[questions[state.index].key]!==null)state.index++;
  if(action==='back')state.index--;
  if(action==='edit'){state.index=0;state.details=false;}
  if(action==='details')state.details=true;
  if(action==='summary')state.details=false;
  if(action==='reset'){state.index=-1;state.answers=Object.fromEntries(questions.map(q=>[q.key,null]));state.details=false;}
  render();
});
document.getElementById('motion-toggle').addEventListener('click',()=>{
  state.motion=!state.motion;
  app.classList.toggle('motion-off',!state.motion);
  const button=document.getElementById('motion-toggle');
  button.querySelector('span:last-child').textContent=state.motion?'Motion on':'Motion off';
  button.setAttribute('aria-pressed',String(!state.motion));
  button.setAttribute('aria-label',state.motion?'Turn animations off':'Turn animations on');
});
render();
