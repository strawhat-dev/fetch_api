import type { FetchedApi, FetchInput, FetchOptions } from '@/types/api';
import { id, isPromise } from '@/utils';

export const fetchRequest = async (input: FetchInput, config: FetchOptions) => {
  const { onres, onError, transform, ...init } = config as any;
  const res = await fetch(input, init).catch(handleError({ ...init, input }, onError));
  const callback = onres?.await || onres;
  if (!res.ok) {
    if ('error' in res) return res;
    const cause = { status: res.status, statusText: res.statusText };
    const error = Error(values(cause).filter(id).join(' '), { cause });
    return handleError(res, onError)(error);
  } else if (typeof callback === 'function') {
    const result = callback(res);
    const unawaited = isPromise(result) && !('await' in onres!);
    const resolved = unawaited ? undefined : await result;
    if (resolved !== undefined) return resolved;
  }

  return handleResponse(res, transform).catch(handleError(res, onError));
};

// prettier-ignore
const handleResponse = async (res: Response, transform?: boolean) => {
  if (!transform || !res.body || res.bodyUsed) return res;
  const type = res.headers.get('content-type')?.toLowerCase();
  if (type?.includes('application/json')) return res.json();
  const body = await res.text();
  try { return JSON.parse(body); }
  catch { return body; }
};

const handleError = (res: any, callback: FetchedApi['onError']) => {
  typeof callback === 'function' || (callback = id);
  return (error: Error) => {
    error ||= 'unknown exception while fetching' as never;
    error instanceof Error || (error = Error(error, { cause: res }));
    const errorTimeout = setTimeout(() => (
      console.error('Unhandled (in fetched-api)', error.stack || error)
    ), 10);

    return (callback(defineProperty(res, 'error', {
      enumerable: true,
      configurable: true,
      get: () => (clearTimeout(errorTimeout), error),
    })) ?? res) as never;
  };
};

const { values, defineProperty } = Object;
