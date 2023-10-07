import type { FetchedApi, FetchInput, FetchOptions } from '@/types/api';

import { isPromise } from '@/utils';
import { HTTP_CODES } from '@/constants';

export const fetchedRequest = async (method: string, input: FetchInput, opts: FetchOptions) => {
  (opts as RequestInit).method ||= method.toUpperCase();
  const { onres, onError, transform, ...init } = opts as FetchOptions & RequestInit;
  const req = { ...init, input };
  const res = await fetch(input, init).catch(handleError(req, onError));

  if ('error' in req) return res;
  if (res.status in HTTP_CODES) res.code = HTTP_CODES[res.status];
  if (!res.ok) {
    const { status = '', code = 'UnsuccessfulResponse' } = res;
    const error = new Error(`${status} ${code}`.trim(), { cause: { status, code } });
    return handleError(res, onError)(error);
  }

  const callback = onres?.['await' as never] || onres;
  if (typeof callback === 'function') {
    const ret = callback(res, req);
    const unawaited = isPromise(ret) && !('await' in onres!);
    const resolved = unawaited ? undefined : await ret;
    if (typeof resolved !== 'undefined') return resolved;
  }

  // prettier-ignore
  if (transform && res.body && !res.bodyUsed) {
    return res.json().catch((error: Error) =>
      error instanceof SyntaxError
        ? error.message.match(/"(.*)" is not valid JSON$/)?.pop()
        : handleError(res, onError)(error)
    );
  }

  return res;
};

const handleError = (target: any, callback?: FetchedApi['onError']) => {
  typeof callback === 'function' || (callback = (ret) => ret);
  return (error?: Error) => {
    error ||= 'Unknown Exception While Fetching...' as never;
    error instanceof Error || (error = new Error(error));
    const errorTimeout = setTimeout(() => {
      console.error('Unhandled (in fetched-api)', error!.stack || error);
    }, 10);

    return callback!(
      Object.defineProperty(target, 'error', {
        enumerable: true,
        configurable: true,
        get: () => (clearTimeout(errorTimeout), error),
      }) ?? target
    );
  };
};
