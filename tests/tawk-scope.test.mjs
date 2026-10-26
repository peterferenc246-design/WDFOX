import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const files = ['tawk-language-loader.js', 'tawk-native-force.js', 'tawk-avatar-fix.js', 'tawk-native-bootstrap.js'];
const locales = ['sk', 'de', 'en', 'hr', 'fr', 'it', 'pl', 'es', 'sv'];
for (const locale of locales) {
  test(`avatar cleanup never paints over native chat on /${locale}/`, () => {
    const source = readFileSync(new URL('../public/tawk-avatar-fix.js', import.meta.url), 'utf8');
    let removed = false;
    const window = { location: { pathname: `/${locale}/` }, setInterval() { assert.fail('Avatar polling is forbidden'); } };
    window.self = window.top = window;
    const document = {
      getElementById(id) {
        assert.equal(id, 'wdfox-tawk-trigger-avatar-fix');
        return { remove() { removed = true; } };
      },
      createElement() { assert.fail('Manual chat avatar must never be created'); },
      querySelectorAll() { assert.fail('Chat frame geometry must not be guessed'); },
    };
    vm.runInNewContext(source, { window, document });
    assert.equal(removed, true);
  });
}
test('gallery does not inject or control chat', () => {
  const gallery = readFileSync(new URL('../public/cunderlik-gallery-runtime.js', import.meta.url), 'utf8');
  assert.doesNotMatch(gallery, /tawk|Tawk_API/i);
});
for (const file of files) {
  const source = readFileSync(new URL(`../public/${file}`, import.meta.url), 'utf8');
  for (const pathname of ['/', '/analyzer/', '/jobcenter/', '/privat/jobcenter-predproduction/', '/sk/other/', '/unknown/']) {
    test(`${file} does nothing on ${pathname}`, () => {
      const window = { location: { pathname } };
      window.self = window.top = window;
      const document = new Proxy({}, { get() { assert.fail('Forbidden page touched document'); } });
      vm.runInNewContext(source, { window, document });
      assert.equal(window.Tawk_API, undefined);
    });
  }
  for (const locale of locales) {
    test(`${file} does nothing in embedded /${locale}/`, () => {
      const window = { location: { pathname: `/${locale}/` }, top: {} };
      window.self = window;
      const document = new Proxy({}, { get() { assert.fail('Embedded page touched document'); } });
      vm.runInNewContext(source, { window, document });
      assert.equal(window.Tawk_API, undefined);
    });
    test(`${file} allows top-level /${locale}/`, () => {
      const window = { location: { pathname: `/${locale}/` } };
      window.self = window.top = window;
      if (file === 'tawk-native-bootstrap.js') {
        vm.runInNewContext(source, { window });
        assert.equal(typeof window.Tawk_API.onLoad, 'function');
      } else {
        const allowed = new Error('allowed home reached initialization');
        window.setInterval = () => { throw allowed; };
        const document = new Proxy({}, { get() { throw allowed; } });
        assert.throws(() => vm.runInNewContext(source, { window, document }), error => error === allowed);
      }
    });
  }
}

