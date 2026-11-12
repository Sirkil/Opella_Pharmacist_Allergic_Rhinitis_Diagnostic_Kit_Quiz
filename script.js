const questions = [
  {key:'fever', group:'تقييم الحمى', eyebrow:'الخطوة ١ · الحمى', title:'هل تعاني من حمى؟', detail:'اختر الإجابة الأقرب لحالتك الآن.', options:[['yes','نعم'],['no','لا']], routes:{yes:'beyondNose',no:'discharge'}},
  {key:'beyondNose', group:'تقييم البرد أو الإنفلونزا', eyebrow:'الخطوة ٢ · نطاق الأعراض', title:'هل تمتد أعراضك إلى ما هو أبعد من الأنف والحلق؟', detail:'مثل آلام الجسم أو الإرهاق العام.', options:[['yes','نعم'],['no','لا']], routes:{yes:'flu',no:'cold'}},
  {key:'discharge', group:'تقييم إفرازات الأنف', eyebrow:'الخطوة ٣ · إفرازات الأنف', title:'كيف تصف إفرازات الأنف؟', detail:'اختر الوصف الأقرب لما تلاحظه.', options:[['thick','سميكة أو مائلة إلى الصفرة'],['watery','خفيفة وشفافة ومائية']], routes:{thick:'cold',watery:'allergySigns'}},
  {key:'allergySigns', group:'تقييم التهاب الأنف التحسسي', eyebrow:'الخطوة ٤ · أعراض الحساسية', title:'هل تعاني أيضًا من عطس أو حكة في الأنف أو حكة أو دموع في العينين؟', detail:'تكفي واحدة من هذه العلامات لاختيار «نعم».', options:[['yes','نعم'],['no','لا']], routes:{yes:'air',no:'otherRhinitis'}},
  {key:'air', group:'تقييم تلوث الهواء', eyebrow:'الخطوة ٥ · تلوث الهواء', title:'هل مستويات تلوث الهواء مرتفعة حاليًا؟', detail:'اعتمد على معلومات جودة الهواء المتاحة لاحظ الAQI متاح علي الشاشه.', options:[['yes','نعم'],['no','لا']], routes:{yes:'pollutionAllergy',no:'otherAllergy'}}
];
const questionByKey = Object.fromEntries(questions.map(q=>[q.key,q]));
const results = {
  flu:{type:'flu',tag:'إنفلونزا محتملة',title:'إنفلونزا محتملة',summary:'تشير إجاباتك إلى مسار الإنفلونزا، ويحتاج تحديد السبب إلى تقييم مهني.',next:'استشر مختصًا صحيًا لمزيد من التقييم. اطلب المشورة الطبية سريعًا إذا كانت الأعراض شديدة أو كنت أكثر عرضة للمضاعفات.',reason:'ذكرت وجود حمى وأن الأعراض تمتد إلى ما هو أبعد من الأنف والحلق.',counsel:'قيّم شدة الأعراض وعوامل خطر المضاعفات، وحدد الحاجة إلى رعاية طبية عاجلة.'},
  cold:{type:'cold',tag:'نزلة برد محتملة',title:'نزلة برد محتملة',summary:'تشير إجاباتك إلى مسار نزلة البرد الشائعة.',next:'اسأل الصيدلي عن تخفيف الأعراض المناسب لك. راقب الأعراض واطلب المشورة الطبية إذا ساءت أو استمرت.',reason:'وصلت إجاباتك إلى مسار نزلة البرد، إما مع حمى دون أعراض تتجاوز الأنف والحلق، أو دون حمى مع إفرازات أنفية سميكة أو مائلة إلى الصفرة.',counsel:'ناقش تخفيف الأعراض المناسب ومتى يلزم التقييم الطبي. لون الإفرازات وحده لا يثبت سبب العدوى.'},
  pollutionAllergy:{type:'pollutionAllergy',tag:'التهاب أنف تحسسي · تلوث الهواء',title:'التهاب أنف تحسسي متفاقم بتلوث الهواء',summary:'تشير إجاباتك إلى أعراض التهاب الأنف التحسسي مع ارتفاع تلوث الهواء حاليًا .',next:'قلل التعرض لملوثات الهواء الخارجية قدر الإمكان، واسأل الصيدلي عن مضاد هيستامين مناسب. توجد أدلة سريرية على فاعلية فيكسوفينادين لأعراض التهاب الأنف التحسسي التي تفاقمت بتلوث الهواء.',reason:'لا توجد حمى، والإفرازات خفيفة ومائية، مع عطس أو حكة، وذكرت أن تلوث الهواء مرتفع حاليًا.',counsel:'راجع ملاءمة مضاد الهيستامين للحالة والعمر والتاريخ المرضي، واتبع النشرة المحلية عند اختيار العلاج.'},
  otherAllergy:{type:'otherAllergy',tag:'التهاب أنف تحسسي · محفزات أخرى',title:'التهاب أنف تحسسي · محفزات محتملة أخرى',summary:'تشير إجاباتك إلى أعراض التهاب الأنف التحسسي دون ارتفاع معروف في تلوث الهواء حاليًا.',next:'ناقش المحفزات المحتملة وخيارات تخفيف الأعراض مع الصيدلي.',reason:'لا توجد حمى، والإفرازات خفيفة ومائية، مع عطس أو حكة، ولم تذكر ارتفاع تلوث الهواء حاليًا.',counsel:'استكشف المحفزات المحتملة وقيّم العلاج الملائم بعد مراجعة التاريخ المرضي.'},
  otherRhinitis:{type:'otherRhinitis',tag:'تقييم إضافي',title:'أسباب أخرى لالتهاب الأنف · يلزم تقييم إضافي',summary:'لا تكفي الإجابات الحالية لترجيح مسار التهاب الأنف التحسسي في هذا الفحص.',next:'راجع الصيدلي أو مختصًا صحيًا لتقييم الأعراض والسبب المحتمل.',reason:'لا توجد حمى والإفرازات خفيفة ومائية، دون عطس أو حكة في الأنف أو العينين.',counsel:'قيّم أسباب التهاب الأنف الأخرى وفق التاريخ المرضي والأعراض المصاحبة.'}
};
const state = {
  currentKey:null, history:[], answers:Object.fromEntries(questions.map(q=>[q.key,null])),
  details:false, participant:{age:'',gender:''}, submissionId:'', saveStatus:'idle'
};
const screen=document.getElementById('screen');
function classify(){
  let key=questions[0].key;
  const visited=new Set();
  while(questionByKey[key]){
    if(visited.has(key))return null;
    visited.add(key);
    const answer=state.answers[key];
    if(!answer)return null;
    key=questionByKey[key].routes[answer];
    if(!key)return null;
  }
  return results[key]||null;
}
function routeFrom(key){return questionByKey[key]?.routes[state.answers[key]]||null;}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function validParticipant(){const p=state.participant;return p.age!==''&&Number.isInteger(Number(p.age))&&Number(p.age)>=1&&Number(p.age)<=120&&['ذكر','أنثى'].includes(p.gender);}
function introScreen(){
  const p=state.participant;
  return `<div class="intro-screen"><div class="intro-content"><div class="intro-copy"><span class="overline">فحص صيدلي تفاعلي · حتى ٥ خطوات</span><h1>نزلة برد، إنفلونزا<br>أم التهاب أنف تحسسي؟</h1><p>أجب عن الأسئلة التي تظهر في مسارك، ثم راجع النتيجة مع الصيدلي.</p></div><div class="intro-bottom"><div class="participant-fields"><label>العمر<input id="participant-age" data-participant="age" type="number" inputmode="numeric" min="1" max="120" value="${escapeHtml(p.age)}" placeholder="العمر بالسنوات" required></label><label>النوع<select id="participant-gender" data-participant="gender" required><option value="">اختر النوع</option><option value="ذكر" ${p.gender==='ذكر'?'selected':''}>ذكر</option><option value="أنثى" ${p.gender==='أنثى'?'selected':''}>أنثى</option></select></label></div><p id="participant-error" class="participant-error" role="alert"></p><button class="primary-button start-button" type="button" data-action="start" ${validParticipant()?'':'disabled'}>ابدأ الفحص <span aria-hidden="true">←</span></button><p class="trust-note">ستُحفظ بياناتك وإجاباتك ونتيجة الفحص في سجل الفحص. هذا الفحص يساعدك في الحوار مع الصيدلي، والقرار المهني له.</p></div></div></div>`;
}
function submissionPayload(){
  // The deployed Apps Script currently accepts seven non-empty answer cells.
  const answersV2=questions.map(q=>q.options.find(([value])=>value===state.answers[q.key])?.[1]||'لم يُطرح');
  const legacyAnswers=questions.map((q,index)=>`س${index+1} ${q.title}: ${answersV2[index]}`);
  return {schemaVersion:2,submissionId:state.submissionId,age:Number(state.participant.age),gender:state.participant.gender,answersV2,answers:[...legacyAnswers,'غير مستخدم ١','غير مستخدم ٢'],result:classify()?.title||''};
}
async function saveResult(){
  const url=window.QUIZ_SUBMIT_URL;
  if(!url){state.saveStatus='unconfigured';render();return;}
  state.saveStatus='sending';render();
  try{
    await fetch(url,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(submissionPayload())});
    state.saveStatus='sent';
  }catch(error){state.saveStatus='error';}
  render();
}
function saveMessage(){return {sending:'جارٍ إرسال البيانات إلى سجل الفحص…',sent:'أُرسل الطلب إلى سجل الفحص.',error:'تعذر إرسال البيانات. تحقق من الاتصال ثم أعد المحاولة.',unconfigured:'حفظ البيانات غير متاح حاليًا. أخبر المشرف.'}[state.saveStatus]||'';}
const iconPaths={
  yes:'<path d="m5 12 4 4L19 6"/>',no:'<path d="M5 5l14 14M19 5 5 19"/>',
  thick:'<path d="M12 2.5c-2.7 3.8-6 7.4-6 11a6 6 0 0 0 12 0c0-3.6-3.3-7.2-6-11Z"/><path d="M9 12.5h6M9 15.5h6"/>',
  watery:'<path d="M12 2.5c-2.7 3.8-6 7.4-6 11a6 6 0 0 0 12 0c0-3.6-3.3-7.2-6-11Z"/><path d="M9 15.5a3 3 0 0 0 3 3"/>'
};
function tileIcon(option){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[option]}</svg>`;}
function questionScreen(){
  const q=questionByKey[state.currentKey],value=state.answers[q.key];
  const choices=q.options.map(([option,label])=>`<button type="button" data-value="${option}" data-key="${q.key}" class="choice ${value===option?'selected':''}" aria-pressed="${value===option}"><span class="choice-icon" aria-hidden="true">${tileIcon(option)}</span><strong>${label}</strong><span class="choice-indicator" aria-hidden="true"></span></button>`).join('');
  const next=routeFrom(q.key);
  return `<div class="question-screen"><div class="question-stage"><div class="question-copy"><span class="overline">${q.eyebrow}</span><h1>${q.title}</h1><p>${q.detail}</p></div></div><div class="answer-deck"><div class="choices" role="group" aria-label="${q.title}">${choices}</div><div class="question-nav"><button class="text-button" type="button" data-action="back">→ ${state.history.length?'السؤال السابق':'المقدمة'}</button><button class="primary-button continue-button" type="button" data-action="next" ${value===null?'disabled':''}>${next&&results[next]?'عرض النتيجة':'السؤال التالي'} <span aria-hidden="true">←</span></button></div></div></div>`;
}
function resultScreen(){
  const r=classify();
  if(!r)return '';
  if(state.details)return detailsScreen(r);
  return `<div class="result-screen ${r.type}"><div class="result-hero"><span class="overline">نتيجة الفحص</span><span class="result-tag">${r.tag}</span><h1>${r.title}</h1><p>${r.summary}</p></div><div class="result-body"><div class="result-block next-step"><span class="block-label">التوصية</span><p>${r.next}</p></div><div class="result-disclaimer">هذه نتيجة إرشادية تساعد في الحوار مع الصيدلي، وليست تشخيصًا أو وصفة علاجية.</div><p class="save-status" role="status">${saveMessage()}</p><div class="result-actions">${state.saveStatus==='error'?'<button class="text-button" type="button" data-action="retry">إعادة الإرسال</button>':''}<button class="primary-button" type="button" data-action="details">تفاصيل للصيدلي <span aria-hidden="true">←</span></button></div></div></div>`;
}
function detailsScreen(r){
  const lines=questions.filter(q=>state.answers[q.key]!==null).map(q=>`<div class="detail-line"><strong>${q.eyebrow}</strong><span>${q.options.find(([value])=>value===state.answers[q.key])?.[1]||''}</span></div>`).join('');
  return `<div class="details-screen"><div class="details-hero"><span class="overline">دعم قرار الصيدلي</span><h1>لماذا ظهر هذا المسار؟</h1><p>${r.reason}</p></div><div class="details-body"><div class="detail-list"><span class="block-label">الإجابات في هذا المسار</span>${lines}</div><div class="counsel-card"><span class="block-label">إرشاد للصيدلي</span><p>${r.counsel}</p></div><div class="result-actions"><button class="text-button" type="button" data-action="summary">→ الملخص</button><button class="primary-button" type="button" data-action="reset">فحص جديد <span aria-hidden="true">↖</span></button></div></div></div>`;
}
function render(){
  const intro=state.currentKey===null,done=state.currentKey==='result';
  screen.innerHTML=intro?introScreen():done?resultScreen():questionScreen();
}
screen.addEventListener('click',event=>{
  const option=event.target.closest('[data-value]');
  if(option&&questionByKey[state.currentKey]){state.answers[state.currentKey]=option.dataset.value;render();return;}
  const action=event.target.closest('[data-action]')?.dataset.action;
  if(!action)return;
  if(action==='start'){
    if(!validParticipant()){document.getElementById('participant-error').textContent='أدخل العمر الصحيح واختر النوع للمتابعة.';return;}
    state.currentKey=questions[0].key;
    state.submissionId=crypto.randomUUID();
  }
  if(action==='next'&&questionByKey[state.currentKey]){
    const next=routeFrom(state.currentKey);
    if(next){
      state.history.push(state.currentKey);
      state.currentKey=results[next]?'result':next;
      const active=new Set(state.history);
      if(state.currentKey!=='result')active.add(state.currentKey);
      for(const q of questions)if(!active.has(q.key))state.answers[q.key]=null;
      if(state.currentKey==='result'){saveResult();return;}
    }
  }
  if(action==='back')state.currentKey=state.history.pop()||null;
  if(action==='details')state.details=true;
  if(action==='summary')state.details=false;
  if(action==='retry'){saveResult();return;}
  if(action==='reset'){
    state.currentKey=null;state.history=[];state.answers=Object.fromEntries(questions.map(q=>[q.key,null]));
    state.details=false;state.participant={age:'',gender:''};state.submissionId='';state.saveStatus='idle';
  }
  render();
});
function updateParticipant(event){
  const field=event.target.dataset.participant;
  if(!field)return;
  state.participant[field]=event.target.value;
  document.getElementById('participant-error').textContent='';
  screen.querySelector('[data-action="start"]').disabled=!validParticipant();
}
screen.addEventListener('input',updateParticipant);
screen.addEventListener('change',updateParticipant);
render();
