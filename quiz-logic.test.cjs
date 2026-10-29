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
vm.runInContext(`${source}\nglobalThis.quizLogic = { questions, state, trackPatterns, classify };`, context);
const { questions, state, trackPatterns, classify } = context.quizLogic;
const questionKeys = questions.map(question => question.key);

function classifyAnswers(answers) {
  state.answers = { ...answers };
  return classify();
}

for (const pattern of trackPatterns) {
  assert.deepEqual(Object.keys(pattern.answers).sort(), [...questionKeys].sort(), `${pattern.type} must fix all 12 answers`);
  for (const question of questions) {
    assert(question.options.some(([value]) => value === pattern.answers[question.key]), `${pattern.type} has an unavailable choice for ${question.key}`);
  }
  assert.equal(classifyAnswers(pattern.answers).type, pattern.type, `${pattern.type} exact match`);

  for (const question of questions) {
    for (const [alternative] of question.options) {
      if (alternative === pattern.answers[question.key]) continue;
      const changed = { ...pattern.answers, [question.key]: alternative };
      const permitted = trackPatterns.find(candidate => questionKeys.every(key => changed[key] === candidate.answers[key]));
      assert.equal(classifyAnswers(changed).type, permitted?.type ?? 'review', `${pattern.type} with ${question.key}=${alternative}`);
    }
  }
}

const referral = trackPatterns.find(pattern => pattern.type === 'referral').answers;
for (const key of ['fever', 'thick', 'pain']) {
  const changed = { ...referral, [key]: 'no' };
  assert.equal(classifyAnswers(changed).type, 'review', `partial referral without ${key}`);
}
assert.equal(classifyAnswers({ ...referral, duration: 'medium' }).type, 'review', 'partial referral without long duration');
assert.equal(classifyAnswers({ ...referral, itch: null }).type, 'review', 'incomplete answers');

console.log(`Checked ${trackPatterns.length} complete patterns and every one-answer variation.`);
