// setupTests loaded early by Jest
/* eslint-disable no-console */
console.log('setupTests.js: running setup before tests');

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// jsdom doesn't implement window.scrollTo; provide a noop for tests
Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true });

// Ensure matchMedia is available for components that check it
try {
	// eslint-disable-next-line global-require
	require('jest-matchmedia-mock');
} catch (e) {
	// no-op if the package isn't installed yet
}

// Polyfill fetch / Response for tests (jsdom doesn't include fetch by default)
try {
	// prefer ESM-style import if available via bundler; require is fine in Node tests
	require('whatwg-fetch');
} catch (e) {
	// ignore if not installed; npm install will add it
}

// If Response is still missing (some polyfills don't attach it in this environment), provide a tiny shim
if (typeof global.Response === 'undefined') {
	/* A minimal Response shim used only for tests where Response is constructed with a JSON string
		 and where only .json() or .text() are called. This avoids adding heavyweight polyfills. */
	global.Response = class Response {
		constructor(body = '', init = {}) {
			this._body = body;
			this.status = init.status || 200;
			this.headers = init.headers || {};
		}
		json() {
			try {
				return Promise.resolve(JSON.parse(this._body));
			} catch (e) {
				return Promise.reject(e);
			}
		}
		text() {
			return Promise.resolve(this._body);
		}
		get ok() {
			return this.status >= 200 && this.status < 300;
		}
	};
}

// Provide a lightweight helper available in tests to create response-like objects
if (typeof global.makeResp === 'undefined') {
	global.makeResp = function makeResp(payload, status = 200) {
		return {
			status,
			headers: { 'Content-type': 'application/json' },
			ok: status >= 200 && status < 300,
			json: () => Promise.resolve(payload),
			text: () => Promise.resolve(typeof payload === 'string' ? payload : JSON.stringify(payload)),
		};
	};
}

// Ensure Jest mocks are cleared between tests to avoid call-count leakage
afterEach(() => {
	try {
		jest.clearAllMocks();
	} catch (e) {
		// jest may not be available in some environments; ignore
	}
});
