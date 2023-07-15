const b = (e, t) => {
  t || ([e, t] = [{}, e]);
  for (const [n, s] of Object.entries(t))
    Object.defineProperty(e, n, { value: s });
  return e;
}, p = (e) => {
  e ||= {};
  for (const t of Object.keys(e))
    delete e[t];
  return e;
}, g = (e) => {
  const t = new FormData(), { $filename: n, ...s } = e;
  for (const o of Object.entries(s))
    n && v(o[1]) && o.push(n), t.append(...o);
  return t;
}, m = (e, t, n = "set") => {
  let s = t;
  H(s) ? s = s.entries() : Array.isArray(s) || (s = Object.entries(s));
  for (const o of s)
    e[n](...o);
  return e;
}, i = (e) => Object.prototype.toString.call(e).slice(8, -1), v = (e) => i(e) === "Blob", q = (e) => i(e) === "Request", H = (e) => i(e) === "Headers", P = (e) => i(e) === "Object", R = (e) => i(e) === "Promise", S = async (e, t, n) => {
  const { transform: s, onres: o, onError: r, ...f } = n;
  let u;
  f.method = e.toUpperCase();
  const l = { ...f, input: t }, d = await fetch(t, f).catch(
    r && ((h) => (u = h, r(h, l)))
  );
  let c = u || o?.(d, l);
  return o?.await && R(c) && (c = await c), !u && typeof c < "u" ? c : s ? d.json() : d;
}, C = (e, t) => {
  if (!t)
    return e || "";
  if (!e)
    return t || "";
  const n = q(e), s = (n ? e.url : e.toString()).trim();
  if (s.startsWith(t))
    return e;
  const o = new URL([t.replace(/[/]+$/, ""), s.replace(/^[/]+/, "")].join("/"));
  return n ? new Request(o, e) : o;
}, T = (...e) => {
  const t = e.reduce(k, { transform: !0 });
  if (!P(t.body))
    return t;
  const n = t.headers ??= new Headers(), s = t.body, o = n.get("content-type");
  return o || n.set("content-type", "application/json"), t.body = /multipart[/]form-data/i.test(o) ? (n.delete("content-type"), g(s)) : /application[/]x-www-form-urlencoded/i.test(o) ? new URLSearchParams(s) : JSON.stringify(s), t;
}, k = (e, { headers: t, appendHeaders: n, ...s } = {}) => ((t || n) && (e.headers ??= new Headers(), t && m(e.headers, t), n && m(e.headers, n, "append")), Object.assign(e, s)), a = [
  "get",
  "post",
  "put",
  "patch",
  "head",
  "options",
  "connect",
  "trace",
  "delete"
], y = (e = {}) => {
  const { defaults: t, methods: n } = O(e), s = b(t, a.reduce(j, w()));
  for (const [o, r] of n)
    Object.assign(s[o], r);
  return s;
}, j = (e, t) => (e[t] = function(n, s = {}) {
  const { baseURL: o, ...r } = T(this, this[t], s);
  return S(t, C(n, o?.trim()), r);
}, e), w = () => ({
  create: y,
  configure(e) {
    const { defaults: t, methods: n } = O(e);
    for (const [s, o] of n)
      Object.assign(this[s], o);
    return Object.assign(this, t);
  },
  set(e) {
    p(this);
    for (const t of a)
      p(this[t]);
    return this.configure(e);
  },
  with(e) {
    const t = y(this);
    return e ? t.configure(e) : t;
  }
}), O = (e = {}) => {
  const t = [], n = {};
  for (const s in e) {
    const o = s, r = e[o];
    a.includes(o) ? t.push([o, r]) : /^(configure|create|set|with)$/.test(s) || (n[o] = r);
  }
  return { defaults: n, methods: t };
}, D = b(a.reduce(j, w()));
export {
  D as api,
  y as initapi
};
