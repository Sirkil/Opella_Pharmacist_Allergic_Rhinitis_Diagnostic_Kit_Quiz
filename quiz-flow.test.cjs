const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const elements = new Map();
const document = {
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, {
      classList: { toggle() {} },
      listeners: {},
      addEventListener(type, handler) { this.listeners[type] = handler; },
      innerHTML: '',
      textContent: ''
    });
    return elements.get(id);
  }
};
const context = vm.createContext({ document });
const source = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
vm.runInContext(`${source}\nglobalThis.quizFlow = { questions, state };`, context);
const { questions, state } = context.quizFlow;
const screen = document.getElementById('screen');

function clickAction(action) {
  screen.listeners.click({ target: { closest(selector) {
    return selector === '[data-action]' ? { dataset: { action } } : null;
  } } });
}

function clickAnswer(value) {
  assert(screen.innerHTML.includes(`data-value="${value}"`), `choice ${value} is visible`);
  screen.listeners.click({ target: { closest(selector) {
    return selector === '[data-value]' ? { dataset: { value } } : null;
  } } });
}

function completeQuiz(answers) {
  clickAction('reset');
  clickAction('start');
  questions.forEach((question, index) => {
    assert.equal(state.index, index, `question ${index + 1} is active`);
    clickAnswer(answers[question.key]);
    clickAction('next');
  });
  assert.equal(state.index, questions.length, 'result screen is active');
  return screen.innerHTML;
}

const base = { discharge:'none', itch:'no', sneeze:'no', coldSigns:'none', warningSigns:'none', duration:'short', air:'not_high' };
const cases = [
  ['Track A with unrelated congestion and duration', { ...base, discharge:'watery', itch:'yes', sneeze:'bouts', coldSigns:'blocked', duration:'medium', air:'linked_sensitive' }, 'أنت في المسار أ'],
  ['Track B with repeated sneezing and high AQI', { ...base, discharge:'cloudy', sneeze:'bouts', coldSigns:'both', duration:'typical', air:'high_unlinked' }, 'أنت في المسار ب'],
  ['Track C with congestion', { ...base, discharge:'thick', coldSigns:'blocked', warningSigns:'both', duration:'long', air:'unknown' }, 'أنت في المسار ج'],
  ['complete Track A and B mix', { ...base, discharge:'watery', itch:'yes', sneeze:'bouts', coldSigns:'both', duration:'typical', air:'linked_sensitive' }, 'مسار غير محدد'],
  ['Track B with a warning sign', { ...base, discharge:'cloudy', sneeze:'yes', coldSigns:'both', warningSigns:'fever', duration:'typical' }, 'مسار غير محدد']
];

for (const [label, answers, expected] of cases) {
  const html = completeQuiz(answers);
  assert(html.includes(expected), `${label} should show ${expected}`);
}

console.log('Clicked through all seven questions for Tracks A, B, C, and two undefined cases.');
