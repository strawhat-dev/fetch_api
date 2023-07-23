const METHOD_DESCRIPTOR = {
  configurable: false,
  enumerable: false,
  writable: false,
} as const;

export const DESCRIPTOR_MAP = {
  create: METHOD_DESCRIPTOR,
  with: METHOD_DESCRIPTOR,
  set: METHOD_DESCRIPTOR,
  configure: METHOD_DESCRIPTOR,
  get: METHOD_DESCRIPTOR,
  post: METHOD_DESCRIPTOR,
  put: METHOD_DESCRIPTOR,
  patch: METHOD_DESCRIPTOR,
  delete: METHOD_DESCRIPTOR,
  options: METHOD_DESCRIPTOR,
  head: METHOD_DESCRIPTOR,
  trace: METHOD_DESCRIPTOR,
  connect: METHOD_DESCRIPTOR,
} as const;

export const HTTP_METHODS = new Set([
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'options',
  'head',
  'trace',
  'connect',
] as const);

export const BODY_TYPES = new Set([
  'URLSearchParams',
  'ReadableStream',
  'FormData',
  'ArrayBuffer',
  'SharedArrayBuffer',
]);

export const SELF_CONSTRUCTABLE_TYPES = new Set([
  'Date',
  'Error',
  'Headers',
  'RegExp',
  'Request',
  'Response',
  'URL',
  'URLSearchParams',
]);

export const STRUCTURED_CLONABLE_TYPES = new Set([
  'ArrayBuffer',
  'AudioData',
  'Blob',
  'CropTarget',
  'CryptoKey',
  'DOMException',
  'DOMMatrix',
  'DOMMatrixReadOnly',
  'DOMPoint',
  'DOMPointReadOnly',
  'DOMQuad',
  'DOMRect',
  'DOMRectReadOnly',
  'File',
  'FileList',
  'FileSystemDirectoryHandle',
  'FileSystemFileHandle',
  'FileSystemHandle',
  'GPUCompilationInfo',
  'GPUCompilationMessage',
  'ImageBitmap',
  'ImageData',
  'RTCCertificate',
  'SharedArrayBuffer',
  'VideoFrame',
]);
