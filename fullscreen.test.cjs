const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function setup(supported = true) {
  const listeners = {};
  const button = {
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(name, handler) { this.handler = handler; }
  };
  const message = { textContent: '' };
  const document = {
    fullscreenElement: null,
    documentElement: {},
    getElementById(id) { return id === 'fullscreen-button' ? button : message; },
    addEventListener(name, handler) { listeners[name] = handler; },
    async exitFullscreen() {
      this.fullscreenElement = null;
      listeners.fullscreenchange();
    }
  };
  if (supported) {
    document.documentElement.requestFullscreen = async () => {
      document.fullscreenElement = document.documentElement;
      listeners.fullscreenchange();
    };
  }
  const source = fs.readFileSync(path.join(__dirname, 'fullscreen.js'), 'utf8');
  vm.runInNewContext(source, { document });
  return { button, message, document };
}

test('fullscreen button enters and exits fullscreen', async () => {
  const { button, document } = setup();
  assert.equal(button.attributes['aria-pressed'], 'false');
  await button.handler();
  assert.equal(document.fullscreenElement, document.documentElement);
  assert.equal(button.attributes['aria-pressed'], 'true');
  assert.equal(button.attributes['aria-label'], 'إنهاء ملء الشاشة');
  await button.handler();
  assert.equal(document.fullscreenElement, null);
  assert.equal(button.attributes['aria-pressed'], 'false');
});

test('unsupported browsers get a visible explanation', async () => {
  const { button, message } = setup(false);
  await button.handler();
  assert.match(message.textContent, /غير متاح/);
});
