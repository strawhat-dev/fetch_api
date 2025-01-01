import type { FetchedApi, FetchInput, FetchRequestInit } from '@/types/api';
import { isPromise } from '@/utils';

const { values, defineProperty } = Object;

export const fetchRequest = async (input: FetchInput, options: FetchRequestInit) => {
  const { transform, onreq, onres, onError, ...init } = options;
  const req = { input, ...init };
  typeof onreq === 'function' && onreq(req);
  const res = await fetch(input, init).catch(handleError(req, onError));
  const callback = onres?.['await' as never] || onres;
  if (!res.ok) {
    if ('error' in res) return res;
    const cause = { status: res.status, statusText: res.statusText };
    const error = Error(values(cause).filter(Boolean).join(' '), { cause });
    return handleError(res, onError)(error);
  } else if (typeof callback === 'function') {
    const result = callback(req, res);
    const unawaited = isPromise(result) && !('await' in onres!);
    const resolved = unawaited ? undefined : await result;
    if (resolved !== undefined) return resolved;
  }

  return handleResponse(res, transform).catch(handleError(res, onError));
};

// prettier-ignore
const handleResponse = async (res: Response, transform?: boolean) => {
  if (!transform || !res.body || res.bodyUsed) return res;
  const ctype = res.headers.get('content-type')?.toLowerCase();
  if (ctype?.includes('application/json')) return res.json();
  const body = await res.text();
  try { return JSON.parse(body); } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    return body;
  }
};

const handleError = (cause: any, callback: FetchedApi['onError']) => {
  typeof callback === 'function' || (callback = (x) => x);
  return (error: any) => {
    error ||= 'Unknown exception while fetching...';
    error instanceof Error || (error = Error(error, { cause }));
    const timeout = setTimeout(() => (
      console.error('Unhandled (in fetched-api)', error.stack || error)
    ), 10);

    return (callback(defineProperty(cause, 'error', {
      enumerable: true,
      configurable: true,
      get: () => (clearTimeout(timeout), error),
    })) ?? cause) as never;
  };
};
