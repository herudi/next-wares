# next-wares

Tiny middleware-helper for nextjs (app-router).

[![CI](https://github.com/herudi/next-wares/workflows/ci/badge.svg)](https://github.com/herudi/next-wares)
[![npm version](https://badge.fury.io/js/next-wares.svg)](https://badge.fury.io/js/next-wares)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/next-wares)
[![codecov](https://codecov.io/gh/herudi/next-wares/graph/badge.svg?token=ETMNO1V5D6)](https://codecov.io/gh/herudi/next-wares)

## Features
- Design for Simple and easy to use.
- Global middleware support (via `middleware.(ts|js)`).
- Inline middleware support.
- Esm/cjs support.

## Install
```bash
npm i next-wares
```

## Usage
### Global Middlewares
Nextjs use global middlware via `middleware.(ts|js)`.
see => https://nextjs.org/docs/app/building-your-application/routing/middleware

```ts
// middleware.ts

import { NextResponse, URLPattern } from "next/server";
import type { NextRequest } from "next/server";
import { wares } from "next-wares";

export default wares<NextRequest>(NextResponse, URLPattern, {

  // match all startsWith /api
  "/api/*": async (req, next) => {
    const res = await next();
    res.headers.set("api-header", "foobar");
    return res;
  },

  // match for file /blog/[...slug]/page.ts
  "/blog/:slug*": (req, next) => {
    // some code
    return next();
  },

  // match for /api/about with multiple wares.
  "/api/about": [
    (req, next) => {
      // some code
      return next();
    },
    (req, next) => {
      // some code
      return next();
    }
  ]
})
```

### Inline Middlewares
> Support only `route-handlers`. see => https://nextjs.org/docs/app/building-your-application/routing/route-handlers

```ts
import { handler } from "next-wares";
import type { Handler } from "next-wares";

const validate: Handler = (req, next) => {
  // some code validate body.

  return next();
}

// example for POST methods with validate.
export const POST = handler(
  validate,
  (req) => {
    return Response.json({ name: "john" })
  }
)

// example GET with pass params.
export const GET = handler(
  (req, next, { params }: { params: Promise<{ slug: string }> }) => {
    const slug = (await params).slug;
    return Response.json({ slug })
  }
)
```
