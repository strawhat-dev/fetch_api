import { initapi } from '@/init-api';

export type { FetchBody, FetchedApi, FetchHeaders, FetchInput, FetchOptions, FetchQuery } from '@/types/api';

export { initapi };
export { clone, jsonify } from '@/utils';
export default /* @__PURE__ */ initapi();
