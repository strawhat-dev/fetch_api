import type { FetchApi } from '@/types/api';

import { define } from '@/utils';
import { HTTP_METHODS, getInstanceMethods, reducer } from '@/lib';

export { initapi } from '@/lib';

export const api = define(HTTP_METHODS.reduce(reducer, getInstanceMethods())) as FetchApi;
