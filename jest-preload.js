// Minimal preload to ensure `Response` exists for tests that construct it at module load time.
if (typeof global.Response === 'undefined') {
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
