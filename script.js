const questions = [
  { key:'watery', group:'الأعراض', eyebrow:'العلامة الأولى', title:'كيف تصف إفرازات الأنف؟', detail:'اختر الوصف الأقرب، ثم أجب لاحقًا عن الإفرازات السميكة أو الملوّنة إن وجدت.', options:[['watery','مائية وشفافة'],['cloudy','شفافة إلى معكّرة قليلًا'],['none','لا توجد إفرازات من هذين النوعين']], insight:'يميّز الدليل بين الإفرازات المائية الشفافة والإفرازات التي قد تصبح معكّرة قليلًا.' },
  { key:'itch', group:'الأعراض', eyebrow:'علامة الحكّة', title:'هل تشعر بحكّة في الأنف أو العينين أو الحلق؟', detail:'يشمل ذلك الشعور بالدغدغة أو الرغبة في الفرك.', options:[['yes','نعم، توجد حكّة'],['no','لا توجد حكّة']], insight:'الحكّة مع سيلان الأنف المائي من العلامات التي قد ترجّح الحساسية.' },
  { key:'sneeze', group:'الأعراض', eyebrow:'علامة العطس', title:'كيف يحدث العطس لديك؟', detail:'اختر نوبات متتالية فقط إذا كان العطس يأتي في سلسلة واضحة.', options:[['bouts','نوبات متتالية'],['yes','يوجد عطس دون نوبات متتالية'],['no','لا يوجد عطس']], insight:'يميّز الدليل بين العطس ونوبات العطس المتتالية عند تحديد المسار.' },
  { key:'blocked', group:'الأعراض', eyebrow:'علامة الاحتقان', title:'هل تشعر بانسداد أو احتقان في الأنف؟', detail:'فكّر في مدى سهولة التنفس عبر الأنف.', options:[['yes','نعم، يوجد احتقان'],['no','لا، التنفس طبيعي']], insight:'يساعد الاحتقان على فهم نمط الأعراض، لكنه لا يحدد السبب بمفرده.' },
  { key:'malaise', group:'الأعراض', eyebrow:'الشعور العام', title:'هل تشعر بتوعّك خفيف؟', detail:'مثل تعب بسيط أو شعور عام بأنك لست على ما يرام.', options:[['yes','نعم، توعّك خفيف'],['no','لا، أشعر أنني بخير']], insight:'قد يصاحب التوعّك الخفيف نزلة البرد، لكنه علامة مساعدة وليست تشخيصًا.' },
  { key:'fever', group:'علامات تستدعي المراجعة', eyebrow:'فحص سريع', title:'هل لديك حمّى؟', detail:'وجود حرارة مرتفعة يستدعي مناقشة الأعراض مع الصيدلي.', options:[['yes','نعم، لديّ حمّى'],['no','لا توجد حمّى']], insight:'وجود حمّى يستدعي تقييمًا أقرب من الصيدلي.' },
  { key:'thick', group:'علامات تستدعي المراجعة', eyebrow:'فحص سريع', title:'هل الإفرازات سميكة وصفراء أو خضراء؟', detail:'تختلف هذه الإفرازات عن سيلان الأنف الخفيف والشفاف.', options:[['yes','نعم، سميكة أو ملوّنة'],['no','لا']], insight:'تستدعي هذه الإجابة مراجعة الأعراض كاملة، ولا تكفي وحدها لتشخيص عدوى بكتيرية.' },
  { key:'pain', group:'علامات تستدعي المراجعة', eyebrow:'فحص سريع', title:'هل تشعر بألم في الوجه أو ضغط في الجيوب الأنفية؟', detail:'مثل ألم حول الخدين أو العينين أو الجبهة.', options:[['yes','نعم، ألم أو ضغط'],['no','لا يوجد ألم']], insight:'ألم الوجه سبب لمناقشة الخطوة الأنسب مع الصيدلي.' },
  { key:'duration', group:'علامات تستدعي المراجعة', eyebrow:'مدة الأعراض', title:'منذ متى بدأت الأعراض؟', detail:'اختر المدة الأقرب.', options:[['short','أقل من 7 أيام'],['typical','من 7 إلى 10 أيام'],['medium','من 11 إلى 14 يومًا'],['long','أكثر من 14 يومًا'],['unknown','لا أعرف']], insight:'تساعد المدة على مطابقة المسار المحدد في الدليل. ناقش استمرار الأعراض مع الصيدلي.' },
  { key:'pollution', group:'الهواء والمحفزات', eyebrow:'تأثير الهواء', title:'هل تسوء الأعراض في أيام ارتفاع التلوّث؟', detail:'مثل الأيام التي يكثر فيها الضباب الدخاني أو الدخان.', options:[['yes','نعم، تسوء الأعراض'],['no','لا ألاحظ ارتباطًا'],['unsure','لست متأكدًا']], insight:'ملاحظتك مفيدة لفهم المحفزات، لكن جودة الهواء وحدها لا تشخّص الحساسية.' },
  { key:'aqi', group:'الهواء والمحفزات', eyebrow:'قراءة جودة الهواء', title:'ما نطاق مؤشر جودة الهواء المحلي اليوم (AQI)؟', detail:'اختر النطاق من تقرير جودة الهواء المحلي، أو اختر «لا أعرف».', options:[['good','<bdi dir="ltr">0–50</bdi> · جيد'],['moderate','<bdi dir="ltr">51–100</bdi> · متوسط'],['sensitive','<bdi dir="ltr">101–150</bdi> · غير صحي للفئات الحساسة'],['unhealthy','<bdi dir="ltr">151+</bdi> · غير صحي'],['unknown','لا أعرف']], insight:'المؤشر فوق 100 غير صحي أولًا للفئات الحساسة. يعتمد هذا الفحص على النطاق الذي تختاره، وليس على قراءة مباشرة.' },
  { key:'alignment', group:'الهواء والمحفزات', eyebrow:'ارتباط الهواء بالأعراض', title:'هل تتوافق قراءة الهواء اليوم مع شدة أعراضك؟', detail:'مثلًا، هل تسوء الأعراض عندما تكون جودة الهواء منخفضة؟', options:[['yes','نعم، يبدو أنها تتوافق'],['no','لا ألاحظ توافقًا'],['unsure','لست متأكدًا']], insight:'قد يساعد التوافق الصيدلي في مناقشة المحفزات، لكن قراءة يوم واحد لا تثبت سبب الأعراض.' }
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
function safetyFlags(){
  const flags=[];
  if(yes('fever'))flags.push('حمّى');
  if(yes('thick'))flags.push('إفرازات سميكة صفراء أو خضراء');
  if(yes('pain'))flags.push('ألم أو ضغط في الوجه');
  if(state.answers.duration==='long')flags.push('أعراض مستمرة لأكثر من 14 يومًا');
  return flags;
}
// Each entry fixes every answer. A separate entry is needed for each accepted AQI range.
const trackPatterns=[
  {type:'referral',answers:{watery:'none',itch:'no',sneeze:'no',blocked:'no',malaise:'no',fever:'yes',thick:'yes',pain:'yes',duration:'long',pollution:'no',aqi:'unknown',alignment:'no'}},
  {type:'allergy',answers:{watery:'watery',itch:'yes',sneeze:'bouts',blocked:'no',malaise:'no',fever:'no',thick:'no',pain:'no',duration:'unknown',pollution:'yes',aqi:'sensitive',alignment:'yes'}},
  {type:'allergy',answers:{watery:'watery',itch:'yes',sneeze:'bouts',blocked:'no',malaise:'no',fever:'no',thick:'no',pain:'no',duration:'unknown',pollution:'yes',aqi:'unhealthy',alignment:'yes'}},
  {type:'cold',answers:{watery:'cloudy',itch:'no',sneeze:'yes',blocked:'yes',malaise:'yes',fever:'no',thick:'no',pain:'no',duration:'typical',pollution:'no',aqi:'good',alignment:'no'}}
];
function exactTrack(type,answers){return trackPatterns.some(pattern=>pattern.type===type&&questions.every(q=>answers[q.key]===pattern.answers[q.key]));}
function review(reason){
  const flags=safetyFlags();
  return {type:'review',tag:'مسار غير محدد',title:'لا يوجد تطابق تام',summary:'لا تطابق إجاباتك مجموعة كاملة من الإجابات المحددة لأي مسار.',evidence:flags.length?['لم تكتمل شروط أي مسار',...flags]:[reason],next:flags.length?'ذكرتَ علامة قد تستدعي التقييم. ناقشها مع الصيدلي حتى لو لم يطابق مجموع إجاباتك مسار الإحالة المحدد.':'راجع إجاباتك مع الصيدلي قبل اختيار الرعاية المناسبة.',reason};
}
function classify(){
  const a=state.answers;
  if(questions.some(q=>a[q.key]===null))return review('بعض إجابات الأعراض أو علامات الإنذار أو جودة الهواء غير مكتملة.');
  if(exactTrack('referral',a))return {type:'referral',tag:'تقييم الإحالة',title:'تحتاج الأعراض إلى تقييم أقرب',summary:'تطابقت جميع إجاباتك مع نمط الإحالة المحدد في هذا الفحص.',evidence:safetyFlags(),next:'اعرض هذه العلامات على الصيدلي لتقييم الحاجة إلى الإحالة للطبيب أو الأخصائي.',reason:'تطابقت الإجابات الاثنتا عشرة مع نمط الإحالة المحدد، بما في ذلك الحمى والإفرازات السميكة وألم الوجه واستمرار الأعراض لأكثر من 14 يومًا. هذه النتيجة لا تشخّص عدوى بكتيرية.'};
  if(exactTrack('allergy',a))return {type:'allergy',tag:'نمط حساسية مع مؤشر هواء مرتفع',title:'تظهر عدة علامات ترجّح الحساسية',summary:'تطابقت جميع إجاباتك مع نمط الحساسية المرتبطة بتراجع جودة الهواء.',evidence:['سيلان أنف مائي وشفاف','حكّة','نوبات عطس متتالية','مؤشر الهواء أعلى من 100','ارتباط ملحوظ بجودة الهواء'],next:'اسأل الصيدلي عن تقليل التعرض للمحفزات والعناية المناسبة للحساسية.',reason:'تطابقت الإجابات الاثنتا عشرة مع أحد نمطي الحساسية المحددين؛ يختلف النمطان فقط في نطاق مؤشر جودة الهواء الأعلى من 100.'};
  if(exactTrack('cold',a))return {type:'cold',tag:'نمط قد يشير إلى نزلة برد',title:'قد تكون الأعراض نزلة برد',summary:'تطابقت جميع إجاباتك مع نمط نزلة البرد المحدد في هذا الفحص.',evidence:['إفرازات شفافة إلى معكّرة قليلًا','عطس','احتقان','توعّك خفيف','مدة من 7 إلى 10 أيام'],next:'ناقش مع الصيدلي طرق تخفيف الأعراض ومتى تحتاج إلى رعاية إضافية.',reason:'تطابقت الإجابات الاثنتا عشرة مع نمط نزلة البرد المحدد، بما في ذلك نوع الإفرازات والعطس والاحتقان والتوعّك والمدة.'};
  return review('لا تطابق الإجابات أي نمط كامل محدد لهذا الفحص.');
}
function answeredCount(){return questions.filter(q=>state.answers[q.key]!==null).length;}
function introScreen(){
  return `<div class="intro-screen"><div class="intro-visual" aria-hidden="true"><div class="visual-disc"><svg viewBox="0 0 240 200" fill="none"><path d="M22 80c34-38 62-38 96 0s62 38 100 0"/><path d="M22 118c34-38 62-38 96 0s62 38 100 0"/><path d="M22 156c34-38 62-38 96 0s62 38 100 0"/></svg></div></div><div class="intro-content"><div class="intro-copy"><span class="overline">فحص صيدلي في دقيقتين إلى 3 دقائق</span><h1>افهم أعراضك<br>بوضوح أكبر</h1><p>أخبرنا بما تشعر به، ثم راجع العلامات مع الصيدلي لتحديد الخطوة المناسبة.</p></div><div class="intro-bottom"><p class="trust-note">هذا الفحص يساعدك في الحوار مع الصيدلي، والقرار المهني له.</p><button class="primary-button start-button" type="button" data-action="start">ابدأ الفحص <span aria-hidden="true">←</span></button></div></div></div>`;
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
  return `<div class="question-screen"><div class="question-stage"><span class="question-number" aria-hidden="true">${String(state.index+1).padStart(2,'0')}</span><div class="question-copy"><span class="overline">${q.eyebrow}</span><h1>${q.title}</h1><p>${q.detail}</p></div></div><div class="answer-deck"><div class="deck-heading"><span>إجابتك</span><span><bdi>${String(state.index+1).padStart(2,'0')} / ${questions.length}</bdi></span></div><div class="choices ${q.options.length===5?'five':q.options.length===3?'three':''}" role="group" aria-label="${q.title}">${choices}</div><div class="why-note"><span class="why-label">لماذا يهم هذا؟</span><p>${q.insight}</p></div><div class="question-nav"><button class="text-button" type="button" data-action="back">→ ${state.index===0?'المقدمة':'السؤال السابق'}</button><button class="primary-button continue-button" type="button" data-action="next" ${value===null?'disabled':''}>${state.index===questions.length-1?'عرض الملخص':'السؤال التالي'} <span aria-hidden="true">←</span></button></div></div></div>`;
}
function resultScreen(){
  const r=classify();
  if(state.details)return detailsScreen(r);
  return `<div class="result-screen ${r.type}"><div class="result-hero"><span class="overline">نتيجة الفحص</span><span class="result-tag">${r.tag}</span><h1>${r.title}</h1><p>${r.summary}</p></div><div class="result-body"><div class="result-block"><span class="block-label">العلامات المهمة</span><div class="evidence-list">${r.evidence.map(x=>`<span>${x}</span>`).join('')}</div></div><div class="result-block next-step"><span class="block-label">الخطوة التالية</span><p>${r.next}</p></div><div class="result-disclaimer">يساعد هذا الفحص في الحوار مع الصيدلي، ولا يُعد تشخيصًا أو وصفة علاجية.</div><div class="result-actions"><button class="text-button" type="button" data-action="edit">→ تعديل الإجابات</button><button class="primary-button" type="button" data-action="details">تفاصيل للصيدلي <span aria-hidden="true">←</span></button></div></div></div>`;
}
function detailsScreen(r){
  const a=state.answers;
  const duration={short:'أقل من 7 أيام',typical:'من 7 إلى 10 أيام',medium:'من 11 إلى 14 يومًا',long:'أكثر من 14 يومًا',unknown:'غير معروف'}[a.duration]||'غير معروف';
  const aqi={good:'0–50',moderate:'51–100',sensitive:'101–150',unhealthy:'151 فأكثر',unknown:'غير معروف'}[a.aqi]||'غير معروف';
  const discharge={watery:'مائية وشفافة',cloudy:'شفافة إلى معكّرة قليلًا',none:'لا توجد إفرازات من هذين النوعين'}[a.watery]||'غير معروف';
  const sneeze={bouts:'نوبات متتالية',yes:'يوجد عطس',no:'لا يوجد عطس'}[a.sneeze]||'غير معروف';
  const line=(label,value,active)=>`<div class="detail-line ${active?'active':''}"><strong>${label}</strong><span>${value}</span></div>`;
  const answer=value=>({yes:'نعم',no:'لا',unsure:'غير متأكد',null:'غير معروف'})[value]||'غير معروف';
  const counsel=r.type==='allergy'?'قيّم ملاءمة العلاج. قد يكون مضاد الهيستامين، مثل فيكسوفينادين، خيارًا بعد مراجعة العمر والنشرة المحلية وموانع الاستعمال.':r.type==='cold'?'ناقش تخفيف الأعراض والراحة وشرب السوائل والمتابعة إذا استمرت الأعراض أو ساءت.':r.type==='referral'?'قيّم الحاجة إلى الإحالة وفق التاريخ المرضي الكامل والإرشادات المحلية. المخاط الملوّن وحده لا يثبت وجود عدوى بكتيرية أو الحاجة إلى مضاد حيوي.':'وضّح الإجابات غير المؤكدة وفكّر في الأسباب الأخرى قبل اقتراح الرعاية.';
  return `<div class="details-screen"><div class="details-hero"><span class="overline">دعم قرار الصيدلي</span><h1>لماذا ظهر هذا المسار؟</h1><p>${r.reason}</p></div><div class="details-body"><div class="detail-list"><span class="block-label">مراجعة المسارات بالترتيب</span>${line('01 · علامات الإنذار',safetyFlags().length?safetyFlags().join(' · '):`لا توجد علامات إنذار مذكورة · ${duration}`,r.type==='referral'||(r.type==='review'&&safetyFlags().length>0))}${line('02 · الحساسية والهواء',`الإفرازات: ${discharge} · حكّة: ${answer(a.itch)} · AQI: ${aqi} · ارتباط بالتلوّث: ${answer(a.pollution)}`,r.type==='allergy')}${line('03 · نزلة البرد',`عطس: ${sneeze} · احتقان: ${answer(a.blocked)} · توعّك: ${answer(a.malaise)} · المدة: ${duration}`,r.type==='cold')}${line('04 · مسار غير محدد','لا توجد إجابات تطابق نمطًا كاملًا',r.type==='review')}</div><div class="counsel-card"><span class="block-label">إرشاد للصيدلي</span><p>${counsel}</p></div><div class="result-actions"><button class="text-button" type="button" data-action="summary">→ الملخص</button><button class="primary-button" type="button" data-action="reset">فحص جديد <span aria-hidden="true">↖</span></button></div></div></div>`;
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
  document.getElementById('progress-text').textContent=intro?'نحو دقيقتين إلى 3 دقائق':done?'اكتمل الفحص':`السؤال ${state.index+1} من ${questions.length}`;
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
