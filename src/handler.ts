import type { ApiOptions, FetchConfig, FetchInput, FetchRequest } from '@/types/api';

import { isPromise } from '@/utils';

export const fetchedMethod = async (method: string, input: FetchInput, config: FetchConfig) => {
  (config as RequestInit).method ||= method.toUpperCase();
  const { onres, onError, transform, ...init } = config as FetchConfig & RequestInit;
  const req: FetchRequest = { ...init, input };
  const res: Response = await fetch(input, init).catch(handleError(req, onError));
  if ('error' in req) return res ?? req;
  if (!res.ok) {
    return handleError(res, onError)(`${res.status} ${res.statusText}`.trim());
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
    return res.clone().json().catch(() => res.text().catch(handleError(res, onError)));
  }

  return res;
};

const handleError = (target: any, callback?: ApiOptions['onError']) => {
  typeof callback === 'function' || (callback = (ret) => ret);
  return (error?: any) => {
    error ||= 'Unknown Exception While Fetching...';
    error instanceof Error || (error = new Error(error));
    const errorTimeout = setTimeout(() => {
      console.error('Unhandled (in fetched-api)', error.stack || error);
    }, 10);

    return callback!(
      Object.defineProperty(target || {}, 'error', {
        enumerable: true,
        configurable: true,
        get: () => (clearTimeout(errorTimeout), error),
      }),
    );
  };
};
