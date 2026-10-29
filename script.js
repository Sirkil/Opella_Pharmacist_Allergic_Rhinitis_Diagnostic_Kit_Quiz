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
  motion:true
};
const app=document.getElementById('app');
const screen=document.getElementById('screen');
const rail=document.getElementById('insight-rail');
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
function answeredCount(){return questions.filter(q=>state.answers[q.key]!==null).length;}
function introScreen(){
  return `<div class="intro-screen"><div class="intro-visual" aria-hidden="true"><div class="visual-disc"><svg viewBox="0 0 240 200" fill="none"><path d="M22 80c34-38 62-38 96 0s62 38 100 0"/><path d="M22 118c34-38 62-38 96 0s62 38 100 0"/><path d="M22 156c34-38 62-38 96 0s62 38 100 0"/></svg></div></div><div class="intro-content"><div class="intro-copy"><span class="overline">فحص صيدلي قصير</span><h1>افهم أعراضك<br>بوضوح أكبر</h1><p>أخبرنا بما تشعر به، ثم راجع العلامات مع الصيدلي لتحديد الخطوة المناسبة.</p></div><div class="intro-bottom"><p class="trust-note">هذا الفحص يساعدك في الحوار مع الصيدلي، والقرار المهني له.</p><button class="primary-button start-button" type="button" data-action="start">ابدأ الفحص <span aria-hidden="true">←</span></button></div></div></div>`;
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
const questionTones={discharge:'aqua',itch:'lilac',sneeze:'peach',coldSigns:'mint',warningSigns:'coral',duration:'aqua',air:'lilac'};
function tileIcon(key,option){
  const icons={
    discharge:{watery:'watery',cloudy:'watery',thick:'thick',none:'well'},
    itch:{yes:'itch',no:'itch'},
    sneeze:{bouts:'sneeze',yes:'sneeze',no:'sneeze'},
    coldSigns:{both:'blocked',blocked:'blocked',malaise:'malaise',none:'well'},
    warningSigns:{both:'fever',fever:'fever',pain:'pain',none:'well'},
    duration:{short:'duration',typical:'calendar',medium:'calendar',long:'calendarLong',unknown:'unknown'},
    air:{linked_sensitive:'sensitive',linked_unhealthy:'unhealthy',high_unlinked:'moderate',not_high:'sun',unknown:'unknown'}
  };
  const icon=icons[key][option];
  const crossed=option==='no';
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[icon]}${crossed?'<path class="icon-strike" d="M4 20 20 4"/>':''}</svg>`;
}
function tileTone(key,option,index){
  return key==='air'?['peach','coral','aqua','mint','lilac'][index]:key==='warningSigns'&&option==='none'?'mint':questionTones[key];
}
function questionScreen(){
  const q=questions[state.index];
  const value=state.answers[q.key];
  const choices=q.options.map(([option,label],index)=>`<button type="button" data-value="${option}" data-key="${q.key}" data-tone="${tileTone(q.key,option,index)}" class="choice ${value===option?'selected':''}" aria-pressed="${value===option}"><span class="choice-icon" aria-hidden="true">${tileIcon(q.key,option)}</span><strong>${label}</strong></button>`).join('');
  return `<div class="question-screen"><div class="question-stage"><span class="question-number" aria-hidden="true">${String(state.index+1).padStart(2,'0')}</span><div class="question-copy"><span class="overline">${q.eyebrow}</span><h1>${q.title}</h1><p>${q.detail}</p></div></div><div class="answer-deck"><div class="deck-heading"><span>إجابتك</span><span><bdi>${String(state.index+1).padStart(2,'0')} / ${questions.length}</bdi></span></div><div class="choices ${q.options.length===5?'five':q.options.length===4?'four':q.options.length===3?'three':''}" role="group" aria-label="${q.title}">${choices}</div><div class="why-note"><span class="why-label">لماذا يهم هذا؟</span><p>${q.insight}</p></div><div class="question-nav"><button class="text-button" type="button" data-action="back">→ ${state.index===0?'المقدمة':'السؤال السابق'}</button><button class="primary-button continue-button" type="button" data-action="next" ${value===null?'disabled':''}>${state.index===questions.length-1?'عرض الملخص':'السؤال التالي'} <span aria-hidden="true">←</span></button></div></div></div>`;
}
function resultScreen(){
  const r=classify();
  if(state.details)return detailsScreen(r);
  return `<div class="result-screen ${r.type}"><div class="result-hero"><span class="overline">نتيجة الفحص</span><span class="result-tag">${r.tag}</span><h1>${r.title}</h1><p>${r.summary}</p></div><div class="result-body"><div class="result-block next-step"><span class="block-label">الخطوة التالية</span><p>${r.next}</p></div><div class="result-disclaimer">يساعد هذا الفحص في الحوار مع الصيدلي، ولا يُعد تشخيصًا أو وصفة علاجية.</div><div class="result-actions"><button class="text-button" type="button" data-action="edit">→ تعديل الإجابات</button><button class="primary-button" type="button" data-action="details">تفاصيل للصيدلي <span aria-hidden="true">←</span></button></div></div></div>`;
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
function renderRail(){
  const count=answeredCount();
  const flags=safetyFlags();
  const phase=state.index<0?'ابدأ بوصف ما تشعر به':state.index>=questions.length?'الخطوة التالية':questions[state.index].group;
  return `<span class="rail-kicker">بإرشاد الصيدلي</span><div class="rail-wave" aria-hidden="true"><svg viewBox="0 0 240 160" fill="none"><path d="M12 55c36-38 66-38 102 0s66 38 114 0"/><path d="M12 103c36-38 66-38 102 0s66 38 114 0"/></svg></div><h2>علامة بعد أخرى<br><em>لصورة أوضح</em></h2><p>أجب عمّا تعرفه. تساعد الأعراض وعلامات الإنذار وجودة الهواء الصيدلي في إرشادك.</p><div class="rail-meter"><div><span>تقدّمك</span><strong><bdi>${count} / ${questions.length}</bdi></strong></div><div class="rail-bar"><span style="width:${count/questions.length*100}%"></span></div></div><div class="rail-current"><span>المرحلة الحالية</span><strong>${phase}</strong></div><div class="rail-status ${flags.length?'alert':''}">${flags.length?`علامات تستدعي المراجعة: ${flags.length}`:'يشمل الفحص علامات الإنذار'}</div><div class="rail-footer">لدعم الحوار مع الصيدلي، وليس للتشخيص الآلي.</div>`;
}
function render(){
  const intro=state.index<0,done=state.index>=questions.length;
  app.classList.toggle('is-intro',intro);
  const section=intro?'فحص الأعراض':done?'ملخص الفحص':questions[state.index].group;
  document.getElementById('section-name').textContent=section;
  document.getElementById('progress-text').textContent=intro?'7 أسئلة قصيرة':done?'اكتمل الفحص':`السؤال ${state.index+1} من ${questions.length}`;
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
  button.querySelector('span:last-child').textContent=state.motion?'الحركة مفعّلة':'الحركة متوقفة';
  button.setAttribute('aria-pressed',String(!state.motion));
  button.setAttribute('aria-label',state.motion?'إيقاف الحركة':'تشغيل الحركة');
});
render();
