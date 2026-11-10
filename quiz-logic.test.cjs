const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const elements = new Map();
const document = {
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, {
      classList: { toggle() {} },
      addEventListener() {},
      innerHTML: '',
      textContent: ''
    });
    return elements.get(id);
  }
};
const context = vm.createContext({ document });
const source = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
vm.runInContext(`${source}\nglobalThis.quizLogic = { questions, state, trackRules, classify, resultScreen };`, context);
const { questions, state, trackRules, classify, resultScreen } = context.quizLogic;
const questionKeys = questions.map(question => question.key);

function classifyAnswers(answers) {
  state.answers = { ...answers };
  return classify();
}

for (const rule of trackRules) {
  for (const [key, accepted] of Object.entries(rule.required)) {
    const question = questions.find(item => item.key === key);
    assert(question, `${rule.type} references a real question: ${key}`);
    for (const value of Array.isArray(accepted) ? accepted : [accepted]) {
      assert(question.options.some(([option]) => option === value), `${rule.type} has an available choice for ${key}=${value}`);
    }
  }
}
assert.equal(questionKeys.length, 7);

const base = { discharge:'none', itch:'no', sneeze:'no', coldSigns:'none', warningSigns:'none', duration:'short', air:'not_high' };
const allergy = { ...base, discharge:'watery', itch:'yes', sneeze:'bouts', air:'linked_sensitive' };
const cold = { ...base, discharge:'cloudy', sneeze:'yes', coldSigns:'both', duration:'typical' };
const referral = { ...base, discharge:'thick', warningSigns:'both', duration:'long' };

for (const [type, answers, hero] of [
  ['allergy', allergy, 'حساسية تتفاقم بسبب التلوّث'],
  ['cold', cold, 'نزلة برد / عدوى فيروسية'],
  ['referral', referral, 'عدوى (التهاب الجيوب البكتيري) · إحالة']
]) {
  assert.equal(classifyAnswers(answers).type, type, `${type} defining signs`);
  const summary = resultScreen();
  assert(summary.includes(hero), `${type} name appears in the hero`);
  assert(!summary.includes('evidence-list'), `${type} summary has no symptom chips`);
  assert(summary.includes('data-action="details"'), `${type} keeps pharmacist details`);
}

assert.equal(classifyAnswers({ ...allergy, duration:'medium', air:'linked_unhealthy' }).type, 'allergy', 'allergy allows an unspecified non-warning duration');
assert.equal(classifyAnswers({ ...cold, air:'high_unlinked' }).type, 'cold', 'cold allows high AQI without a symptom link');
assert.equal(classifyAnswers({ ...referral, air:'linked_sensitive' }).type, 'referral', 'referral still matches when air quality is linked to symptoms');

for (const [label, answers] of [
  ['allergy plus congestion', { ...allergy, coldSigns:'blocked' }],
  ['allergy plus mild malaise', { ...allergy, coldSigns:'malaise' }],
  ['allergy plus facial pain', { ...allergy, warningSigns:'pain' }],
  ['cold with watery rather than cloudy discharge', { ...cold, discharge:'watery' }],
  ['cold with repeated sneezing bouts', { ...cold, sneeze:'bouts' }],
  ['cold plus itching', { ...cold, itch:'yes' }],
  ['cold with pollution-linked symptoms', { ...cold, air:'linked_sensitive' }],
  ['cold plus fever', { ...cold, warningSigns:'fever' }],
  ['referral plus itching', { ...referral, itch:'yes' }],
  ['referral plus sneezing', { ...referral, sneeze:'yes' }],
  ['referral plus congestion', { ...referral, coldSigns:'blocked' }],
  ['incomplete allergy', { ...allergy, air:'high_unlinked' }],
  ['incomplete cold', { ...cold, coldSigns:'blocked' }],
  ['incomplete referral', { ...referral, warningSigns:'fever' }],
  ['unanswered question', { ...allergy, air:null }]
]) {
  assert.equal(classifyAnswers(answers).type, 'review', label);
}

const undefinedSummary = resultScreen();
assert(undefinedSummary.includes('لم يُحدَّد مسار'), 'undefined title appears in the hero');
assert(!undefinedSummary.includes('evidence-list'), 'undefined summary has no symptom chips');
assert(undefinedSummary.includes('data-action="details"'), 'undefined summary keeps pharmacist details');

console.log('Checked three exact symptom patterns, mixed signs, incomplete answers, and result heroes.');
