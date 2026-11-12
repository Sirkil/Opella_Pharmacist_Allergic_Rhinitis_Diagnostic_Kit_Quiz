const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const elements = new Map();
const document = { getElementById(id) {
  if (!elements.has(id)) elements.set(id, {classList:{toggle(){}},addEventListener(){},innerHTML:'',textContent:''});
  return elements.get(id);
}};
const source = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
const context = vm.createContext({document});
vm.runInContext(`${source}\nglobalThis.quiz = {questions, state, results, classify};`, context);
const {questions, state, results, classify} = context.quiz;

assert.equal(questions.length, 5);
assert.deepEqual(Array.from(questions, q=>q.key), ['fever','beyondNose','discharge','allergySigns','air']);
for (const question of questions) {
  assert.equal(question.options.length, 2);
  for (const [value] of question.options) {
    assert(question.routes[value], `${question.key}/${value} has a route`);
    assert(questions.some(q=>q.key===question.routes[value]) || results[question.routes[value]], `${question.key}/${value} points to a valid step or result`);
  }
}

const cases = [
  [{fever:'yes',beyondNose:'yes'},'flu'],
  [{fever:'yes',beyondNose:'no'},'cold'],
  [{fever:'no',discharge:'thick'},'cold'],
  [{fever:'no',discharge:'watery',allergySigns:'no'},'otherRhinitis'],
  [{fever:'no',discharge:'watery',allergySigns:'yes',air:'yes'},'pollutionAllergy'],
  [{fever:'no',discharge:'watery',allergySigns:'yes',air:'no'},'otherAllergy']
];
for (const [answers, expected] of cases) {
  state.answers = Object.assign(Object.fromEntries(questions.map(q=>[q.key,null])), answers);
  assert.equal(classify().type, expected, JSON.stringify(answers));
}
state.answers = {fever:'no',beyondNose:null,discharge:'watery',allergySigns:'yes',air:null};
assert.equal(classify(), null, 'an incomplete route has no result');
console.log('Checked every branch and incomplete routes.');
