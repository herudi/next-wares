import assert from 'node:assert';
import { describe, it } from 'node:test';
import { handler } from '../src/index';

const base = 'http://localhost:3000';

describe('test:handler', () => {
  it('single handler', async () => {
    const res = await handler(() => {
      return new Response('hello');
    })(new Request(base + '/hello'));
    assert.equal(res.status, 200);
  });

  it('multi handler', async () => {
    const res = await handler(
      (req, next) => {
        return next();
      },
      () => {
        return new Response('hello');
      },
    )(new Request(base + '/hello'));
    assert.equal(res.status, 200);
  });

  it('multi handler sub array and flat', async () => {
    const res = await handler(
      [
        (req, next) => {
          return next();
        },
        (req, next) => {
          return next();
        },
      ],
      () => {
        return new Response('hello');
      },
    )(new Request(base + '/hello'));
    assert.equal(res.status, 200);
  });

  it('handler is undefined', async () => {
    const res = await handler(() => void 0)(new Request(base + '/hello'));
    assert.equal(res, undefined);
  });

  it('handler with params', async () => {
    const res = await handler((req, next, { params }) => {
      return Response.json(params);
    })(new Request(base + '/hello'), { params: { id: '1' } });
    assert.equal((await res.json()).id, '1');
  });
});
