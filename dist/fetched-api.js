const b = (e, n) => {
  n || ([e, n] = [{}, e]);
  for (const [a, f] of Object.entries(n))
    Object.defineProperty(e, a, { value: f });
  return e;
}, m = (e) => {
  e ||= {};
  for (const n of Object.keys(e))
    delete e[n];
  return e;
}, S = (e) => {
  const n = new FormData(), { $filename: a, ...f } = e;
  for (const t of Object.entries(f))
    a && M(t[1]) && t.push(a), n.append(...t);
  return n;
}, v = (e, n, a = "set") => {
  let f = n;
  B(f) ? f = f.entries() : Array.isArray(f) || (f = Object.entries(f));
  for (const t of f)
    e[a](...t);
  return e;
}, w = (e) => Object.prototype.toString.call(e).slice(8, -1), M = (e) => w(e) === "Blob", g = (e) => w(e) === "Request", B = (e) => w(e) === "Headers", P = (e) => w(e) === "Object", q = (e) => w(e) === "Promise";
function C(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var V = H;
function u(e) {
  return e instanceof Buffer ? Buffer.from(e) : new e.constructor(e.buffer.slice(), e.byteOffset, e.length);
}
function H(e) {
  if (e = e || {}, e.circles)
    return R(e);
  return e.proto ? f : a;
  function n(t, i) {
    for (var r = Object.keys(t), s = new Array(r.length), l = 0; l < r.length; l++) {
      var o = r[l], c = t[o];
      typeof c != "object" || c === null ? s[o] = c : c instanceof Date ? s[o] = new Date(c) : ArrayBuffer.isView(c) ? s[o] = u(c) : s[o] = i(c);
    }
    return s;
  }
  function a(t) {
    if (typeof t != "object" || t === null)
      return t;
    if (t instanceof Date)
      return new Date(t);
    if (Array.isArray(t))
      return n(t, a);
    if (t instanceof Map)
      return new Map(n(Array.from(t), a));
    if (t instanceof Set)
      return new Set(n(Array.from(t), a));
    var i = {};
    for (var r in t)
      if (Object.hasOwnProperty.call(t, r) !== !1) {
        var s = t[r];
        typeof s != "object" || s === null ? i[r] = s : s instanceof Date ? i[r] = new Date(s) : s instanceof Map ? i[r] = new Map(n(Array.from(s), a)) : s instanceof Set ? i[r] = new Set(n(Array.from(s), a)) : ArrayBuffer.isView(s) ? i[r] = u(s) : i[r] = a(s);
      }
    return i;
  }
  function f(t) {
    if (typeof t != "object" || t === null)
      return t;
    if (t instanceof Date)
      return new Date(t);
    if (Array.isArray(t))
      return n(t, f);
    if (t instanceof Map)
      return new Map(n(Array.from(t), f));
    if (t instanceof Set)
      return new Set(n(Array.from(t), f));
    var i = {};
    for (var r in t) {
      var s = t[r];
      typeof s != "object" || s === null ? i[r] = s : s instanceof Date ? i[r] = new Date(s) : s instanceof Map ? i[r] = new Map(n(Array.from(s), f)) : s instanceof Set ? i[r] = new Set(n(Array.from(s), f)) : ArrayBuffer.isView(s) ? i[r] = u(s) : i[r] = f(s);
    }
    return i;
  }
}
function R(e) {
  var n = [], a = [];
  return e.proto ? i : t;
  function f(r, s) {
    for (var l = Object.keys(r), o = new Array(l.length), c = 0; c < l.length; c++) {
      var y = l[c], p = r[y];
      if (typeof p != "object" || p === null)
        o[y] = p;
      else if (p instanceof Date)
        o[y] = new Date(p);
      else if (ArrayBuffer.isView(p))
        o[y] = u(p);
      else {
        var h = n.indexOf(p);
        h !== -1 ? o[y] = a[h] : o[y] = s(p);
      }
    }
    return o;
  }
  function t(r) {
    if (typeof r != "object" || r === null)
      return r;
    if (r instanceof Date)
      return new Date(r);
    if (Array.isArray(r))
      return f(r, t);
    if (r instanceof Map)
      return new Map(f(Array.from(r), t));
    if (r instanceof Set)
      return new Set(f(Array.from(r), t));
    var s = {};
    n.push(r), a.push(s);
    for (var l in r)
      if (Object.hasOwnProperty.call(r, l) !== !1) {
        var o = r[l];
        if (typeof o != "object" || o === null)
          s[l] = o;
        else if (o instanceof Date)
          s[l] = new Date(o);
        else if (o instanceof Map)
          s[l] = new Map(f(Array.from(o), t));
        else if (o instanceof Set)
          s[l] = new Set(f(Array.from(o), t));
        else if (ArrayBuffer.isView(o))
          s[l] = u(o);
        else {
          var c = n.indexOf(o);
          c !== -1 ? s[l] = a[c] : s[l] = t(o);
        }
      }
    return n.pop(), a.pop(), s;
  }
  function i(r) {
    if (typeof r != "object" || r === null)
      return r;
    if (r instanceof Date)
      return new Date(r);
    if (Array.isArray(r))
      return f(r, i);
    if (r instanceof Map)
      return new Map(f(Array.from(r), i));
    if (r instanceof Set)
      return new Set(f(Array.from(r), i));
    var s = {};
    n.push(r), a.push(s);
    for (var l in r) {
      var o = r[l];
      if (typeof o != "object" || o === null)
        s[l] = o;
      else if (o instanceof Date)
        s[l] = new Date(o);
      else if (o instanceof Map)
        s[l] = new Map(f(Array.from(o), i));
      else if (o instanceof Set)
        s[l] = new Set(f(Array.from(o), i));
      else if (ArrayBuffer.isView(o))
        s[l] = u(o);
      else {
        var c = n.indexOf(o);
        c !== -1 ? s[l] = a[c] : s[l] = i(o);
      }
    }
    return n.pop(), a.pop(), s;
  }
}
var _ = V();
const T = /* @__PURE__ */ C(_), $ = async (e, n, a) => {
  const { transform: f, onres: t, onError: i, ...r } = a;
  let s;
  r.method = e.toUpperCase();
  const l = { ...r, input: n }, o = await fetch(n, r).catch(
    i && ((y) => (s = y, i(y, l)))
  );
  let c = s || t?.(o, l);
  return q(c) && (c = t.await ? await c : void 0), !s && typeof c < "u" ? c : f ? o.json() : o;
}, E = (e, n) => {
  if (!n)
    return e || "";
  if (!e)
    return n || "";
  const a = g(e), f = (a ? e.url : e.toString()).trim();
  if (f.startsWith(n))
    return e;
  const t = new URL([n.replace(/[/]+$/, ""), f.replace(/^[/]+/, "")].join("/"));
  return a ? new Request(t, e) : t;
}, F = (...e) => {
  const n = e.reduce(I, { transform: !0 });
  if (!P(n.body))
    return n;
  const a = n.headers ??= new Headers(), f = n.body, t = a.get("content-type");
  return t || a.set("content-type", "application/json"), n.body = /multipart[/]form-data/i.test(t) ? (a.delete("content-type"), S(f)) : /application[/]x-www-form-urlencoded/i.test(t) ? new URLSearchParams(f) : JSON.stringify(f), n;
}, I = (e, { headers: n, appendHeaders: a, ...f } = {}) => ((n || a) && (e.headers ??= new Headers(), n && v(e.headers, n), a && v(e.headers, a, "append")), Object.assign(e, f)), d = [
  "get",
  "post",
  "put",
  "patch",
  "head",
  "options",
  "connect",
  "trace",
  "delete"
], A = (e = {}) => {
  const { defaults: n, methods: a } = O(e), f = d.reduce(j, D()), t = b(n, f);
  for (const [i, r] of a)
    Object.assign(t[i], r);
  return t;
}, j = (e, n) => (e[n] = function(a, f = {}) {
  const { baseURL: t, ...i } = F(this, this[n], f);
  return $(n, E(a, t?.trim()), i);
}, e), D = () => ({
  create: A,
  configure(e) {
    const { defaults: n, methods: a } = O(e);
    for (const [f, t] of a)
      Object.assign(this[f], t);
    return Object.assign(this, n);
  },
  set(e) {
    m(this);
    for (const n of d)
      m(this[n]);
    return this.configure(e);
  },
  with(e) {
    const n = A(this);
    return e ? n.configure(e) : n;
  }
}), O = (e = {}) => {
  const n = [], a = {};
  for (const f in e) {
    const t = f, i = e[t];
    d.includes(t) ? n.push([t, i]) : /^(configure|create|set|with)$/.test(f) || (a[t] = i);
  }
  return T({ defaults: a, methods: n });
}, N = b(d.reduce(j, D()));
export {
  N as api,
  A as initapi
};
