import type { Merge } from 'type-fest';
import type {
  FetchApi,
  FetchConfig,
  FetchHandlers,
  FetchInput,
  FetchMethod,
  FetchRequest,
} from './types/api.js';

import { isPromise } from './utils.js';
import { resolveConfig, resolveInput } from './resolvers.js';

export const methods = [
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'head',
  'connect',
  'trace',
] as const;

export const reducer = (handlers: FetchHandlers, method: FetchMethod) => {
  handlers[method] = function (this: FetchApi, input, config) {
    const { baseURL, ...rest } = resolveConfig(this, this[method], config);
    return handleMethod(method, resolveInput(input, baseURL?.trim()), rest);
  };

  return handlers;
};

const handleMethod = async (method: FetchMethod, input: FetchInput, config: FetchConfig) => {
  const { transform, onres, onError, ...init } = config as Merge<
    Pick<FetchConfig, 'transform' | 'onres' | 'onError'>,
    RequestInit
  >;

  init.method = method.toUpperCase();
  const request = { ...init, input } as FetchRequest;
  const response = await fetch(input, init).catch(
    typeof onError === 'function' ? (error) => onError(error, request) : undefined,
  );

  let resolved = onres?.(response, request);
  if (isPromise(resolved)) resolved = onres!.await ? await resolved : undefined;
  if (typeof resolved !== 'undefined') return resolved;
  return transform ? response.json() : response;
};
