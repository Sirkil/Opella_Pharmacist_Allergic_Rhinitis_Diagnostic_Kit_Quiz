const questions = [
  { key:'discharge', group:'الأعراض', eyebrow:'نوع الإفرازات', title:'كيف تصف إفرازات الأنف؟', detail:'اختر وصفًا واحدًا هو الأقرب لما تلاحظه.', options:[['watery','مائية وشفافة'],['cloudy','شفافة إلى معكّرة قليلًا'],['thick','سميكة صفراء أو خضراء'],['none','لا توجد إفرازات']], insight:'نوع الإفرازات من العلامات التي تفرّق بين المسارات، لكنه لا يكفي وحده لتشخيص السبب.' },
  { key:'itch', group:'الأعراض', eyebrow:'علامة الحكّة', title:'هل تشعر بحكّة في الأنف أو العينين أو الحلق؟', detail:'يشمل ذلك الشعور بالدغدغة أو الرغبة في الفرك.', options:[['yes','نعم، توجد حكّة'],['no','لا توجد حكّة']], insight:'الحكّة مع سيلان الأنف المائي من العلامات التي قد ترجّح الحساسية.' },
  { key:'sneeze', group:'الأعراض', eyebrow:'علامة العطس', title:'كيف يحدث العطس لديك؟', detail:'اختر نوبات متتالية فقط إذا كان العطس يأتي في سلسلة واضحة.', options:[['bouts','نوبات متتالية'],['yes','يوجد عطس دون نوبات متتالية'],['no','لا يوجد عطس']], insight:'يميّز الدليل بين العطس ونوبات العطس المتتالية عند تحديد المسار.' },
  { key:'coldSigns', group:'الأعراض', eyebrow:'الاحتقان والشعور العام', title:'هل لديك احتقان في الأنف أو توعّك خفيف؟', detail:'اختر الخيار الذي يصف العلامتين معًا.', options:[['both','احتقان وتوعّك خفيف'],['blocked','احتقان فقط'],['malaise','توعّك خفيف فقط'],['none','لا توجد أي منهما']], insight:'يجمع مسار نزلة البرد بين الاحتقان والتوعّك الخفيف.' },
  { key:'warningSigns', group:'علامات تستدعي المراجعة', eyebrow:'الحمّى وألم الوجه', title:'هل لديك حمّى أو ألم أو ضغط في الوجه؟', detail:'اختر الخيار الذي يصف العلامتين معًا.', options:[['both','حمّى وألم أو ضغط في الوجه'],['fever','حمّى فقط'],['pain','ألم أو ضغط في الوجه فقط'],['none','لا توجد أي منهما']], insight:'ناقش أيًّا من هاتين العلامتين مع الصيدلي، حتى لو لم يكتمل مسار الإحالة.' },
  { key:'duration', group:'علامات تستدعي المراجعة', eyebrow:'مدة الأعراض', title:'منذ متى بدأت الأعراض؟', detail:'اختر المدة الأقرب.', options:[['short','أقل من 7 أيام'],['typical','من 7 إلى 10 أيام'],['medium','من 11 إلى 14 يومًا'],['long','أكثر من 14 يومًا'],['unknown','لا أعرف']], insight:'تساعد المدة على مطابقة المسار المحدد في الدليل. ناقش استمرار الأعراض مع الصيدلي.' },
  { key:'air', group:'الهواء والمحفزات', eyebrow:'الهواء والأعراض', title:'ما قراءة مؤشر الهواء (AQI)، وهل تسوء الأعراض مع التلوّث؟', detail:'استخدم القراءة المحلية إن عرفتها، واختر «لا أعرف» إن لم تعرف.', options:[['linked_sensitive','<bdi dir="ltr">101–150</bdi> وتسوء الأعراض'],['linked_unhealthy','<bdi dir="ltr">151+</bdi> وتسوء الأعراض'],['high_unlinked','المؤشر فوق 100 دون ارتباط واضح'],['not_high','المؤشر 100 أو أقل'],['unknown','لا أعرف القراءة أو الارتباط']], insight:'يتطلب مسار الحساسية المرتبطة بالتلوّث قراءة أعلى من 100 مع تفاقم ملحوظ للأعراض.' }
];
const state = {
  index:-1,
  answers:Object.fromEntries(questions.map(q=>[q.key,null])),
  details:false,
  participant:{age:'',gender:''},
  submissionId:'',
  saveStatus:'idle'
};
const app=document.getElementById('app');
const screen=document.getElementById('screen');
function safetyFlags(){
  const a=state.answers;
  const flags=[];
  if(['fever','both'].includes(a.warningSigns))flags.push('حمّى');
  if(a.discharge==='thick')flags.push('إفرازات سميكة صفراء أو خضراء');
  if(['pain','both'].includes(a.warningSigns))flags.push('ألم أو ضغط في الوجه');
  if(a.duration==='long')flags.push('أعراض مستمرة لأكثر من 14 يومًا');
  return flags;
}
const trackRules=[
  {type:'allergy',required:{discharge:'watery',itch:'yes',sneeze:'bouts',warningSigns:'none',air:['linked_sensitive','linked_unhealthy']}},
  {type:'cold',required:{discharge:['watery','cloudy'],sneeze:['yes','bouts'],coldSigns:'both',duration:'typical'}},
  {type:'referral',required:{discharge:'thick',warningSigns:'both',duration:'long'}}
];
function matchesTrack(rule,a){
  return Object.entries(rule.required).every(([key,value])=>Array.isArray(value)?value.includes(a[key]):a[key]===value);
}
function review(reason){
  const flags=safetyFlags();
  return {type:'review',tag:'مسار غير محدد',title:'لم يُحدَّد مسار',summary:'العلامات غير مكتملة أو تشير إلى أكثر من مسار، لذا لا يمكن تحديد مسار واحد.',evidence:flags.length?['لم تكتمل شروط أي مسار',...flags]:[reason],next:flags.length?'ذكرتَ علامة قد تستدعي التقييم. ناقشها مع الصيدلي حتى لو لم يكتمل مسار الإحالة.':'راجع إجاباتك مع الصيدلي قبل اختيار الرعاية المناسبة.',reason};
}
function classify(){
  const a=state.answers;
  if(questions.some(q=>a[q.key]===null))return review('بعض إجابات الأعراض أو علامات الإنذار أو جودة الهواء غير مكتملة.');
  const matched=trackRules.filter(rule=>matchesTrack(rule,a));
  if(matched.length!==1)return review('لا تكتمل شروط مسار واحد أو تظهر علامات من مسارات مختلفة.');
  if(matched[0].type!=='referral'&&safetyFlags().length)return review('توجد علامة تستدعي المراجعة مع إجابات مسار آخر.');
  if(matched[0].type==='referral')return {type:'referral',tag:'أنت في المسار ج',title:'عدوى (التهاب الجيوب البكتيري) · إحالة',summary:'هذا اسم المسار في الدليل، وليس تشخيصًا. تطابقت علامات الإحالة الأربع ويحتاج تحديد السبب إلى تقييم مهني.',evidence:safetyFlags(),next:'اعرض هذه العلامات على الصيدلي لتقييم الحاجة إلى الإحالة للطبيب أو الأخصائي.',reason:'اجتمعت الحمى والإفرازات السميكة وألم الوجه واستمرار الأعراض لأكثر من 14 يومًا. هذه النتيجة لا تشخّص عدوى بكتيرية.'};
  if(matched[0].type==='allergy')return {type:'allergy',tag:'أنت في المسار أ',title:'حساسية تتفاقم بسبب التلوّث',summary:'اكتملت شروط هذا المسار دون اكتمال مسار آخر أو وجود علامات إنذار.',evidence:['سيلان أنف مائي وشفاف','حكّة','نوبات عطس متتالية','مؤشر الهواء أعلى من 100','ارتباط ملحوظ بجودة الهواء'],next:'اسأل الصيدلي عن تقليل التعرض للمحفزات والعناية المناسبة للحساسية.',reason:'اجتمعت الإفرازات المائية والحكّة ونوبات العطس وعدم وجود حمّى ومؤشر هواء أعلى من 100 وارتباط الأعراض بالتلوّث. بقية الإجابات لا تغيّر المسار ما لم تكتمل شروط مسار آخر أو تظهر علامة إنذار.'};
  return {type:'cold',tag:'أنت في المسار ب',title:'نزلة برد / عدوى فيروسية',summary:'اكتملت شروط هذا المسار دون اكتمال مسار آخر أو وجود علامات إنذار.',evidence:['إفرازات شفافة إلى معكّرة قليلًا','عطس','احتقان','توعّك خفيف','مدة من 7 إلى 10 أيام'],next:'ناقش مع الصيدلي طرق تخفيف الأعراض ومتى تحتاج إلى رعاية إضافية.',reason:'اجتمعت الإفرازات الشفافة إلى المعكّرة قليلًا والعطس والاحتقان والتوعّك ومدة من 7 إلى 10 أيام. بقية الإجابات لا تغيّر المسار ما لم تكتمل شروط مسار آخر أو تظهر علامة إنذار.'};
}
function introScreen(){
  const p=state.participant;
  return `<div class="intro-screen"><div class="intro-content"><div class="intro-copy"><span class="overline">فحص صيدلي قصير · 7 أسئلة</span><h1>افهم أعراضك<br>بوضوح أكبر</h1><p>أخبرنا بما تشعر به، ثم راجع العلامات مع الصيدلي لتحديد الخطوة المناسبة.</p></div><div class="intro-bottom"><div class="participant-fields"><label>العمر<input id="participant-age" data-participant="age" type="number" inputmode="numeric" min="1" max="120" value="${escapeHtml(p.age)}" placeholder="العمر بالسنوات" required></label><label>النوع<select id="participant-gender" data-participant="gender" required><option value="">اختر النوع</option><option value="ذكر" ${p.gender==='ذكر'?'selected':''}>ذكر</option><option value="أنثى" ${p.gender==='أنثى'?'selected':''}>أنثى</option></select></label></div><p id="participant-error" class="participant-error" role="alert"></p><button class="primary-button start-button" type="button" data-action="start" ${validParticipant()?'':'disabled'}>ابدأ الفحص <span aria-hidden="true">←</span></button><p class="trust-note">ستُحفظ بياناتك وإجاباتك ونتيجة الفحص في سجل الفحص. هذا الفحص يساعدك في الحوار مع الصيدلي، والقرار المهني له.</p></div></div></div>`;
}
function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function validParticipant(){
  const p=state.participant;
  return p.age!==''&&Number.isInteger(Number(p.age))&&Number(p.age)>=1&&Number(p.age)<=120&&['ذكر','أنثى'].includes(p.gender);
}
function submissionPayload(){
  const labels=questions.map(q=>{
    const chosen=q.options.find(([value])=>value===state.answers[q.key]);
    return chosen?chosen[1].replace(/<[^>]*>/g,''):'';
  });
  return {submissionId:state.submissionId,age:Number(state.participant.age),gender:state.participant.gender,answers:labels,result:classify().title};
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
function saveMessage(){
  return {sending:'جارٍ إرسال البيانات إلى سجل الفحص…',sent:'تم إرسال البيانات إلى سجل الفحص.',error:'تعذر إرسال البيانات. تحقق من الاتصال ثم أعد المحاولة.',unconfigured:'حفظ البيانات غير متاح حاليًا. أخبر المشرف.'}[state.saveStatus]||'';
}
const iconPaths={
  drop:'<path d="M12 2.5c-2.7 3.8-6 7.4-6 11a6 6 0 0 0 12 0c0-3.6-3.3-7.2-6-11Z"/><path d="M9 15.5a3 3 0 0 0 3 3"/>',
  cloudy:'<path d="M12 2.5c-2.7 3.8-6 7.4-6 11a6 6 0 0 0 12 0c0-3.6-3.3-7.2-6-11Z"/><path d="M8 14c1.2-.8 2.3-.8 3.5 0s2.3.8 4.5-.2"/>',
  thick:'<path d="M12 2.5c-2.7 3.8-6 7.4-6 11a6 6 0 0 0 12 0c0-3.6-3.3-7.2-6-11Z"/><path d="M9 12.5h6M9 15.5h6"/>',
  eye:'<path d="M2.5 12s3.6-5 9.5-5 9.5 5 9.5 5-3.6 5-9.5 5-9.5-5-9.5-5Z"/><circle cx="12" cy="12" r="2.5"/><path d="m18 3 .5 1.5L20 5l-1.5.5L18 7l-.5-1.5L16 5l1.5-.5L18 3Z"/>',
  sneeze:'<path d="M6 17c3.5-2.5 8.5-2.5 12 0M12 3v5M5 5l3 3M19 5l-3 3M2 12h4M18 12h4"/>',
  bursts:'<path d="M6 4v5M3.5 6.5h5M18 3v5M15.5 5.5h5M12 12v7M8.5 15.5h7"/>',
  nose:'<path d="M10 3v8l-3 4a3 3 0 0 0 2.4 4.8h5.2A3 3 0 0 0 17 15l-3-4V3M9 16.5c1.8 1 4.2 1 6 0"/>',
  energy:'<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10v4M6.5 12h5"/>',
  both:'<circle cx="8" cy="10" r="4"/><circle cx="16" cy="14" r="4"/><path d="M5 20h14"/>',
  thermometer:'<path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0Z"/><path d="M12 9v7"/>',
  face:'<circle cx="12" cy="12" r="9"/><path d="M8 10h.01M16 10h.01M8.5 16c2-1.5 5-1.5 7 0"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h8M8 17h5"/>',
  calendarLong:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M12 13v4M12 19h.01"/>',
  air:'<path d="M3 8h11c3 0 3-4 0-4M2 12h17c3 0 3 4 0 4M4 17h8c3 0 3 4 0 4"/>',
  airHigh:'<path d="M3 8h11c3 0 3-4 0-4M2 13h16c3 0 3 4 0 4M5 20h10M20 20h.01"/>',
  clear:'<circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>',
  none:'<circle cx="12" cy="12" r="9"/><path d="M5.5 18.5 18.5 5.5"/>',
  unknown:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.7 2.7 0 0 1 5.1 1.3c0 1.7-2.6 2-2.6 4M12 18h.01"/>'
};
function tileIcon(key,option){
  const icons={
    discharge:{watery:'drop',cloudy:'cloudy',thick:'thick',none:'none'},
    itch:{yes:'eye',no:'none'},
    sneeze:{bouts:'bursts',yes:'sneeze',no:'none'},
    coldSigns:{both:'both',blocked:'nose',malaise:'energy',none:'none'},
    warningSigns:{both:'both',fever:'thermometer',pain:'face',none:'none'},
    duration:{short:'calendar',typical:'calendar',medium:'calendar',long:'calendarLong',unknown:'unknown'},
    air:{linked_sensitive:'air',linked_unhealthy:'airHigh',high_unlinked:'airHigh',not_high:'clear',unknown:'unknown'}
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[icons[key][option]]}</svg>`;
}
function questionScreen(){
  const q=questions[state.index];
  const value=state.answers[q.key];
  const choices=q.options.map(([option,label])=>`<button type="button" data-value="${option}" data-key="${q.key}" class="choice ${value===option?'selected':''}" aria-pressed="${value===option}"><span class="choice-icon" aria-hidden="true">${tileIcon(q.key,option)}</span><strong>${label}</strong><span class="choice-indicator" aria-hidden="true"></span></button>`).join('');
  return `<div class="question-screen"><div class="question-stage"><div class="question-copy"><span class="overline">${q.eyebrow}</span><h1>${q.title}</h1><p>${q.detail}</p></div></div><div class="answer-deck"><div class="choices ${q.options.length===5?'five':q.options.length===4?'four':q.options.length===3?'three':''}" role="group" aria-label="${q.title}">${choices}</div><div class="question-nav"><button class="text-button" type="button" data-action="back">→ ${state.index===0?'المقدمة':'السؤال السابق'}</button><button class="primary-button continue-button" type="button" data-action="next" ${value===null?'disabled':''}>${state.index===questions.length-1?'عرض الملخص':'السؤال التالي'} <span aria-hidden="true">←</span></button></div></div></div>`;
}
function resultScreen(){
  const r=classify();
  if(state.details)return detailsScreen(r);
  return `<div class="result-screen ${r.type}"><div class="result-hero"><span class="overline">نتيجة الفحص</span><span class="result-tag">${r.tag}</span><h1>${r.title}</h1><p>${r.summary}</p></div><div class="result-body"><div class="result-block next-step"><span class="block-label">الخطوة التالية</span><p>${r.next}</p></div><div class="result-disclaimer">يساعد هذا الفحص في الحوار مع الصيدلي، ولا يُعد تشخيصًا أو وصفة علاجية.</div><p class="save-status" role="status">${saveMessage()}</p><div class="result-actions"><button class="text-button" type="button" data-action="edit">→ تعديل الإجابات</button>${state.saveStatus==='error'?'<button class="text-button" type="button" data-action="retry">إعادة الإرسال</button>':''}<button class="primary-button" type="button" data-action="details">تفاصيل للصيدلي <span aria-hidden="true">←</span></button></div></div></div>`;
}
function detailsScreen(r){
  const a=state.answers;
  const duration={short:'أقل من 7 أيام',typical:'من 7 إلى 10 أيام',medium:'من 11 إلى 14 يومًا',long:'أكثر من 14 يومًا',unknown:'غير معروف'}[a.duration]||'غير معروف';
  const discharge={watery:'مائية وشفافة',cloudy:'شفافة إلى معكّرة قليلًا',thick:'سميكة صفراء أو خضراء',none:'لا توجد إفرازات'}[a.discharge]||'غير معروف';
  const sneeze={bouts:'نوبات متتالية',yes:'يوجد عطس',no:'لا يوجد عطس'}[a.sneeze]||'غير معروف';
  const coldSigns={both:'احتقان وتوعّك',blocked:'احتقان فقط',malaise:'توعّك فقط',none:'لا توجد أي منهما'}[a.coldSigns]||'غير معروف';
  const warningSigns={both:'حمّى وألم بالوجه',fever:'حمّى فقط',pain:'ألم بالوجه فقط',none:'لا توجد أي منهما'}[a.warningSigns]||'غير معروف';
  const air={linked_sensitive:'101–150 مع تفاقم الأعراض',linked_unhealthy:'151 فأكثر مع تفاقم الأعراض',high_unlinked:'أعلى من 100 دون ارتباط واضح',not_high:'100 أو أقل',unknown:'غير معروف'}[a.air]||'غير معروف';
  const line=(label,value,active)=>`<div class="detail-line ${active?'active':''}"><strong>${label}</strong><span>${value}</span></div>`;
  const answer=value=>({yes:'نعم',no:'لا'})[value]||'غير معروف';
  const counsel=r.type==='allergy'?'قيّم ملاءمة العلاج. قد يكون مضاد الهيستامين، مثل فيكسوفينادين، خيارًا بعد مراجعة العمر والنشرة المحلية وموانع الاستعمال.':r.type==='cold'?'ناقش تخفيف الأعراض والراحة وشرب السوائل والمتابعة إذا استمرت الأعراض أو ساءت.':r.type==='referral'?'قيّم الحاجة إلى الإحالة وفق التاريخ المرضي الكامل والإرشادات المحلية. المخاط الملوّن وحده لا يثبت وجود عدوى بكتيرية أو الحاجة إلى مضاد حيوي.':'وضّح الإجابات غير المؤكدة وفكّر في الأسباب الأخرى قبل اقتراح الرعاية.';
  return `<div class="details-screen"><div class="details-hero"><span class="overline">دعم قرار الصيدلي</span><h1>${r.type==='review'?'لماذا لم يُحدَّد مسار؟':'لماذا ظهر هذا المسار؟'}</h1><p>${r.reason}</p></div><div class="details-body"><div class="detail-list"><span class="block-label">مراجعة المسارات</span>${line('01 · علامات الإنذار',safetyFlags().length?safetyFlags().join(' · '):`لا توجد علامات إنذار مذكورة · ${warningSigns} · ${duration}`,r.type==='referral'||(r.type==='review'&&safetyFlags().length>0))}${line('02 · الحساسية والهواء',`الإفرازات: ${discharge} · حكّة: ${answer(a.itch)} · عطس: ${sneeze} · AQI: ${air}`,r.type==='allergy')}${line('03 · نزلة البرد',`الإفرازات: ${discharge} · عطس: ${sneeze} · ${coldSigns} · المدة: ${duration}`,r.type==='cold')}${line('04 · مسار غير محدد','شروط غير مكتملة أو علامات من مسارات مختلفة',r.type==='review')}</div><div class="counsel-card"><span class="block-label">إرشاد للصيدلي</span><p>${counsel}</p></div><div class="result-actions"><button class="text-button" type="button" data-action="summary">→ الملخص</button><button class="primary-button" type="button" data-action="reset">فحص جديد <span aria-hidden="true">↖</span></button></div></div></div>`;
}
function render(){
  const intro=state.index<0,done=state.index>=questions.length;
  app.classList.toggle('is-intro',intro);
  const section=intro?'فحص الأعراض':done?'ملخص الفحص':questions[state.index].group;
  document.getElementById('section-name').textContent=section;
  document.getElementById('progress-text').textContent=intro?'7 أسئلة قصيرة':done?'اكتمل الفحص':`السؤال ${state.index+1} من ${questions.length}`;
  document.getElementById('progress-track').innerHTML=questions.map((_,i)=>`<span class="${done||i<state.index?'complete':i===state.index?'current':''}"></span>`).join('');
  screen.innerHTML=intro?introScreen():done?resultScreen():questionScreen();
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
  if(action==='start'){
    if(!validParticipant()){
      document.getElementById('participant-error').textContent='أدخل العمر الصحيح واختر النوع للمتابعة.';
      return;
    }
    state.index=0;
    state.submissionId=crypto.randomUUID();
  }
  if(action==='next'&&state.answers[questions[state.index].key]!==null){
    state.index++;
    if(state.index===questions.length){saveResult();return;}
  }
  if(action==='back')state.index--;
  if(action==='edit'){state.index=0;state.details=false;}
  if(action==='details')state.details=true;
  if(action==='summary')state.details=false;
  if(action==='retry'){saveResult();return;}
  if(action==='reset'){state.index=-1;state.answers=Object.fromEntries(questions.map(q=>[q.key,null]));state.details=false;state.participant={age:'',gender:''};state.submissionId='';state.saveStatus='idle';}
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
