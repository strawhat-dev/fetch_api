import type { FetchedApi, FetchInput, FetchOptions } from '@/types/api';
import { identity, isPromise } from '@/utils';

const { values, defineProperty } = Object;

export const fetchRequest = async (input: FetchInput, config: FetchOptions) => {
  const { onres, onError, transform, ...init } = config;
  const res = await fetch(input, init as {}).catch(handleError({ ...init, input }, onError));
  const callback = onres?.['await' as never] || onres;
  if (!res.ok) {
    if ('error' in res) return res;
    const cause = { status: res.status, statusText: res.statusText };
    const error = Error(values(cause).filter(Boolean).join(' '), { cause });
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

const handleError = (cause: any, callback: FetchedApi['onError']) => {
  typeof callback === 'function' || (callback = identity);
  return (error: Error) => {
    error ||= 'unknown exception while fetching' as never;
    error instanceof Error || (error = Error(error, { cause }));
    const errorTimeout = setTimeout(() => (
      console.error('Unhandled (in fetched-api)', error.stack || error)
    ), 10);

    return (callback(defineProperty(cause, 'error', {
      enumerable: true,
      configurable: true,
      get() {
        clearTimeout(errorTimeout);
        return error;
      },
    })) ?? cause) as never;
  };
};
