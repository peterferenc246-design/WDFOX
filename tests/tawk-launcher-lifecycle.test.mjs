import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../public/tawk-native-force.js', import.meta.url), 'utf8');

function setup() {
  const elements = new Map();
  const intervals = [];
  let hidden = false;
  let maximized = false;
  let hideCalls = 0;
  const classes = new Set();
  const document = {
    hidden: false, readyState: 'complete',
    documentElement: { lang: 'en', classList: {
      add: x => classes.add(x), remove: x => classes.delete(x),
    } },
    getElementById: id => elements.get(id), querySelector: () => null,
    createElement: () => ({
      style: { setProperty(key, value) { this[key] = value; } },
      setAttribute() {}, addEventListener() {},
    }),
    head: { appendChild: el => elements.set(el.id, el) },
    body: { contains: el => elements.has(el.id), appendChild: el => elements.set(el.id, el) },
    addEventListener() {},
  };
  const window = {
    location: { pathname: '/en/' },
    setInterval: fn => { intervals.push(fn); return intervals.length; },
    clearInterval: () => assert.fail('Page-lifetime guard must not expire'),
    setTimeout() {}, addEventListener() {},
    Tawk_API: {
      isChatHidden: () => hidden, isChatMaximized: () => maximized,
      isChatMinimized: () => !maximized,
      hideWidget() { hideCalls++; hidden = true; window.Tawk_API.onChatHidden(); },
    },
  };
  window.self = window.top = window;
  vm.runInNewContext(source, { window, document });
  return { elements, intervals, classes,
    get hideCalls() { return hideCalls; },
    restoreNative() { hidden = false; },
    maximize() { maximized = true; hidden = false; window.Tawk_API.onChatMaximized(); },
  };
}

test('late native launcher restoration is concealed after more than two minutes', () => {
  const s = setup();
  for (let i = 0; i < 500; i++) s.intervals.forEach(fn => fn());
  const before = s.hideCalls;
  s.restoreNative();
  s.intervals.forEach(fn => fn());
  assert.equal(s.hideCalls, before + 1);
  assert.equal(s.classes.has('fox-tawk-concealed'), true);
  assert.equal(s.elements.get('fox-tawk-launcher').style.display, 'block');
});

test('hidden callback does not recursively hide an already hidden widget', () => {
  const s = setup();
  assert.equal(s.hideCalls, 1);
  s.intervals.forEach(fn => fn());
  assert.equal(s.hideCalls, 1);
});

test('lifetime guard leaves an open conversation visible', () => {
  const s = setup();
  s.maximize();
  const before = s.hideCalls;
  for (let i = 0; i < 500; i++) s.intervals.forEach(fn => fn());
  assert.equal(s.hideCalls, before);
  assert.equal(s.classes.has('fox-tawk-concealed'), false);
  assert.equal(s.elements.get('fox-tawk-launcher').style.display, 'none');
});
