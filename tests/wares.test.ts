import assert from 'node:assert';
import { describe, it } from 'node:test';
import { wares } from '../src/index';

const base = 'http://localhost:3000';

const ExNextRes = (msg: string) => ({
  next: () => new Response(msg),
});

class ExURLPattern {
  pattern!: RegExp;
  constructor(input: { pathname: string }) {
    this.pattern = new RegExp(
      `^${input.pathname
        .replace(/\/$/, '')
        .replace(/:(\w+)(\?)?(\.)?/g, '$2(?<$1>[^/]+)$2$3')
        .replace(/(\/?)\*/g, (_, p) => `(${p}.*)?`)
        .replace(/\.(?=[\w(])/, '\\.')}/*$`,
    );
  }
  test(input: { pathname: string }) {
    return this.pattern.test(input.pathname);
  }
}

class NextRequest extends Request {
  nextUrl!: URL;
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(input, init);
    this.nextUrl = new URL(input as string);
  }
}

describe('test:wares', () => {
  it('route for wares', async () => {
    const fn = wares(ExNextRes('hello'), ExURLPattern, {
      '/api/*': [
        async (req, next) => {
          const res = await next();
          res.headers.set('key1', 'api');
          return res;
        },
        async (req, next) => {
          const res = await next();
          res.headers.set('key2', 'api');
          return res;
        },
      ],
      '/api/user': async (req, next) => {
        const res = await next();
        res.headers.set('key3', 'user');
        return res;
      },
      '/api/about': (req, next) => next(),
      '*': async (req, next) => {
        const res = await next();
        res.headers.set('key4', 'all');
        return res;
      },
    });
    const res = await fn(new NextRequest(base + '/api/about'));
    assert.equal(res.headers.get('key1'), 'api');
    assert.equal(res.headers.get('key2'), 'api');
    assert.equal(res.headers.get('key3'), null);
    assert.equal(res.headers.get('key4'), 'all');

    const res2 = await fn(new NextRequest(base + '/api/user'));
    assert.equal(res2.headers.get('key1'), 'api');
    assert.equal(res2.headers.get('key2'), 'api');
    assert.equal(res2.headers.get('key3'), 'user');
    assert.equal(res2.headers.get('key4'), 'all');
  });
});
