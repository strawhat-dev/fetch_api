import { initapi } from '@/init-api';

export type {
  FetchBody,
  FetchConfig,
  FetchHeaders,
  FetchInit,
  FetchInput,
  FetchRequest,
  FetchedApi,
} from '@/types/api';

export { initapi };
export { clone } from '@/utils';
export default /* @__PURE__ */ initapi();
