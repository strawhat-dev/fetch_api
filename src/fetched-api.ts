import { initapi } from '@/init-api';

export type {
  FetchBody,
  FetchHeaders,
  FetchInput,
  FetchOptions,
  FetchQuery,
  FetchedApi,
} from '@/types/api';

export { initapi };
export { clone } from '@/utils';
export default /* @__PURE__ */ initapi();
