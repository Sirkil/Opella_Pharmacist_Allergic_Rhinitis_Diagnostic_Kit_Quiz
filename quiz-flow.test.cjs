const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const elements = new Map();
const startButton = {disabled:true};
const document = {getElementById(id) {
  if (!elements.has(id)) elements.set(id, {
    classList:{toggle(){}}, listeners:{}, addEventListener(type,fn){this.listeners[type]=fn;},
    querySelector(selector){return selector==='[data-action="start"]'?startButton:null;},
    innerHTML:'',textContent:''
  });
  return elements.get(id);
}};
const context = vm.createContext({document,window:{QUIZ_SUBMIT_URL:''},crypto:{randomUUID:()=> '123e4567-e89b-42d3-a456-426614174000'}});
const source = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
vm.runInContext(`${source}\nglobalThis.quiz = {questions,state,submissionPayload};`,context);
const {questions,state,submissionPayload}=context.quiz;
const screen=document.getElementById('screen');
assert(screen.innerHTML.includes('id="participant-age"'));
assert(screen.innerHTML.includes('id="participant-gender"'));
assert(screen.innerHTML.includes('حتى ٥ خطوات'));

function action(value){screen.listeners.click({target:{closest(selector){return selector==='[data-action]'?{dataset:{action:value}}:null;}}});}
function answer(value){
  assert(screen.innerHTML.includes(`data-value="${value}"`), `${value} is visible`);
  screen.listeners.click({target:{closest(selector){return selector==='[data-value]'?{dataset:{value}}:null;}}});
}
function begin(){
  action('reset');
  state.participant={age:'30',gender:'ذكر'};
  action('start');
  assert.equal(state.currentKey,'fever');
}
function run(steps,expected){
  begin();
  for(const [key,value] of steps){
    assert.equal(state.currentKey,key);
    answer(value);
    action('next');
  }
  assert.equal(state.currentKey,'result');
  assert(screen.innerHTML.includes(expected));
  assert(screen.innerHTML.includes('data-action="details"'));
  assert(!screen.innerHTML.includes('data-action="edit"'));
  const payload=submissionPayload();
  assert.equal(payload.answers.length,7,'keeps deployed submission format');
  assert.equal(payload.answersV2.length,5,'provides the five current answers for the updated script');
  assert.equal(payload.schemaVersion,2);
  assert.equal(payload.age,30);
  assert.equal(payload.gender,'ذكر');
  assert(payload.answers.some(value=>value.includes('لم يُطرح')),'skipped questions are marked');
  action('details');
  assert(screen.innerHTML.includes('الإجابات في هذا المسار'));
  assert.equal((screen.innerHTML.match(/class="detail-line"/g)||[]).length,steps.length);
}
run([['fever','yes'],['beyondNose','yes']],'إنفلونزا محتملة');
run([['fever','yes'],['beyondNose','no']],'نزلة برد محتملة');
run([['fever','no'],['discharge','thick']],'نزلة برد محتملة');
run([['fever','no'],['discharge','watery'],['allergySigns','no']],'أسباب أخرى لالتهاب الأنف');
run([['fever','no'],['discharge','watery'],['allergySigns','yes'],['air','yes']],'قد يتفاقم بتلوث الهواء');
run([['fever','no'],['discharge','watery'],['allergySigns','yes'],['air','no']],'محفزات محتملة أخرى');

begin();
answer('no');action('next');
answer('watery');action('next');
assert.equal(state.currentKey,'allergySigns');
action('back');action('back');
assert.equal(state.currentKey,'fever');
answer('yes');action('next');
assert.equal(state.currentKey,'beyondNose');
assert.equal(state.answers.discharge,null,'old branch answer is cleared');
assert.equal(state.answers.allergySigns,null,'old branch descendants are cleared');
console.log('Clicked through every result and checked backward branch changes.');
