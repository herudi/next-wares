type Result<S> = S | Promise<S>;
export type NextFunc<S = Response> = (opts?: any) => Result<S>;
export type Handler<R = Request, S = Response> = (
  req: R,
  next: NextFunc<S>,
  ...args: any[]
) => Result<S>;
export type Handlers<R = Request, S = Response> =
  | Handler<R, S>
  | Handler<R, S>[];

export function handler<R = Request, S = Response>(
  ...handlers: Array<Handlers<R, S>>
) {
  const fns = handlers.flat();
  return (req: R, ...args: any[]) => {
    let i = 0;
    const next = () => fns[i++]?.(req, next, ...args);
    return next();
  };
}

export function wares<R = Request, S = Response>(
  nextRes: any,
  urlPattern: any,
  route: Record<string, Handlers<R, S>>,
) {
  const arr = [] as {
    fns: Handler<R, S>[];
    up: any;
  }[];
  for (const k in route) {
    const fns = route[k];
    arr.push({
      fns: Array.isArray(fns) ? fns : [fns],
      up: new urlPattern({ pathname: k }),
    });
  }
  return (req: R, ...args: any[]) => {
    let i = 0;
    const fns = arr
      .filter((el) => el.up.test({ pathname: (<any>req).nextUrl.pathname }))
      .map((el) => el.fns)
      .flat();
    const len = fns.length;
    const next = () =>
      fns[i++]?.(req, i === len ? nextRes.next : next, ...args);
    return next();
  };
}
