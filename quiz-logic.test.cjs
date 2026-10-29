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

assert.equal(classifyAnswers({ ...allergy, coldSigns:'blocked', duration:'medium', air:'linked_unhealthy' }).type, 'allergy', 'allergy ignores unrelated congestion and duration');
assert.equal(classifyAnswers({ ...cold, air:'high_unlinked' }).type, 'cold', 'cold ignores unrelated air answers');
assert.equal(classifyAnswers({ ...cold, discharge:'watery', sneeze:'bouts' }).type, 'cold', 'cold accepts clear discharge and either sneezing choice');
assert.equal(classifyAnswers({ ...cold, itch:'yes' }).type, 'cold', 'cold does not fail on an isolated unrelated answer');
assert.equal(classifyAnswers({ ...referral, coldSigns:'both', itch:'yes', air:'linked_sensitive' }).type, 'referral', 'referral ignores unrelated symptoms and air answers');

for (const [label, answers] of [
  ['complete allergy and cold tracks', { ...allergy, coldSigns:'both', duration:'typical' }],
  ['allergy plus facial pain', { ...allergy, warningSigns:'pain' }],
  ['cold plus fever', { ...cold, warningSigns:'fever' }],
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

console.log('Checked three track rules, unrelated answers, mixed signs, incomplete answers, and result heroes.');
