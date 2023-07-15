import type { FetchInit, FetchedApi } from './types';

export declare const api: FetchedApi;
export declare const initapi: (config?: FetchInit) => FetchedApi;
export type { FetchConfig, FetchInit, FetchInput, FetchRequest, FetchedApi } from './types';
