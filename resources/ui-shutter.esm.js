(function(){"use strict";try{if(typeof document<"u"){var t=document.createElement("style");t.appendChild(document.createTextNode(".nrdb-ui-shutter[data-v-2cf99a28]{display:flex;flex-direction:column;gap:8px;width:100%;min-width:0;box-sizing:border-box}.nrdb-ui-shutter--disabled[data-v-2cf99a28]{opacity:.5}.nrdb-ui-shutter-label[data-v-2cf99a28]{display:block;width:100%;box-sizing:border-box;font-size:1rem;font-weight:500}.nrdb-ui-shutter-body[data-v-2cf99a28]{display:flex;flex-direction:row;flex-wrap:wrap;align-items:stretch;gap:12px;width:100%;min-width:0}.nrdb-ui-shutter-window[data-v-2cf99a28]{flex:0 0 auto;position:relative;width:64px;height:90px;background-color:var(--sky-color);border:2px solid var(--red-ui-form-input-border-color, #888);box-sizing:border-box;overflow:hidden}.nrdb-ui-shutter-cover[data-v-2cf99a28]{position:absolute;top:0;left:0;right:0;background-color:var(--cover-color);transition:height .4s ease;box-sizing:border-box;border-bottom:3px solid rgba(0,0,0,.35);overflow:hidden}.nrdb-ui-shutter-panels[data-v-2cf99a28]{width:100%;height:100%;background-image:repeating-linear-gradient(to bottom,rgba(0,0,0,.25) 0,rgba(0,0,0,.25) 1px,transparent 1px,transparent 10px)}.nrdb-ui-shutter-slats[data-v-2cf99a28]{width:100%;height:100%;display:flex;flex-direction:column;padding-top:1px;box-sizing:border-box}.nrdb-ui-shutter-slat[data-v-2cf99a28]{width:100%;background-color:#0000004d;flex-shrink:0}.nrdb-ui-shutter-controls[data-v-2cf99a28]{flex:1 1 140px;min-width:0;display:flex;flex-direction:column;gap:6px;justify-content:center}.nrdb-ui-shutter-position-text[data-v-2cf99a28]{font-size:.9rem;text-align:center}.nrdb-ui-shutter-slider-row[data-v-2cf99a28]{display:flex;flex-direction:row;align-items:center;gap:6px;width:100%;min-width:0}.nrdb-ui-shutter-slider-icon[data-v-2cf99a28]{flex:0 0 auto;width:14px;height:14px;fill:currentColor;opacity:.6}.nrdb-ui-shutter-slider[data-v-2cf99a28]{flex:1 1 auto;min-width:0;width:100%}.nrdb-ui-shutter-buttons[data-v-2cf99a28]{display:flex;flex-direction:row;gap:8px;width:100%}.nrdb-ui-shutter-button[data-v-2cf99a28]{flex:1 1 0;min-width:0;display:flex;align-items:center;justify-content:center;height:44px;border:none;border-radius:8px;background-color:color-mix(in srgb,var(--button-color, #607d8b) 16%,transparent);color:var(--button-color, #607d8b);cursor:pointer;transition:background-color .15s ease}.nrdb-ui-shutter-button[data-v-2cf99a28]:hover:not(:disabled){background-color:color-mix(in srgb,var(--button-color, #607d8b) 28%,transparent)}.nrdb-ui-shutter-button[data-v-2cf99a28]:active:not(:disabled){background-color:color-mix(in srgb,var(--button-color, #607d8b) 40%,transparent)}.nrdb-ui-shutter-button[data-v-2cf99a28]:disabled{cursor:not-allowed}.nrdb-ui-shutter-icon[data-v-2cf99a28]{width:24px;height:24px;fill:currentColor}.nrdb-ui-shutter-icon--stroke[data-v-2cf99a28]{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}")),document.head.appendChild(t)}}catch(r){console.error("vite-plugin-css-injected-by-js",r)}})();
import { watch as B, effectScope as Z, computed as $, reactive as tt, openBlock as m, createElementBlock as p, normalizeStyle as C, normalizeClass as I, toDisplayString as L, createCommentVNode as y, createElementVNode as h, Fragment as et, renderList as it } from "vue";
function rt() {
  return U().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function U() {
  return typeof navigator < "u" && typeof window < "u" ? window : typeof globalThis < "u" ? globalThis : {};
}
const nt = typeof Proxy == "function", st = "devtools-plugin:setup", ot = "plugin:settings:set";
let S, E;
function at() {
  var e;
  return S !== void 0 || (typeof window < "u" && window.performance ? (S = !0, E = window.performance) : typeof globalThis < "u" && (!((e = globalThis.perf_hooks) === null || e === void 0) && e.performance) ? (S = !0, E = globalThis.perf_hooks.performance) : S = !1), S;
}
function ut() {
  return at() ? E.now() : Date.now();
}
class lt {
  constructor(t, i) {
    this.target = null, this.targetQueue = [], this.onQueue = [], this.plugin = t, this.hook = i;
    const r = {};
    if (t.settings)
      for (const o in t.settings) {
        const a = t.settings[o];
        r[o] = a.defaultValue;
      }
    const s = `__vue-devtools-plugin-settings__${t.id}`;
    let n = Object.assign({}, r);
    try {
      const o = localStorage.getItem(s), a = JSON.parse(o);
      Object.assign(n, a);
    } catch {
    }
    this.fallbacks = {
      getSettings() {
        return n;
      },
      setSettings(o) {
        try {
          localStorage.setItem(s, JSON.stringify(o));
        } catch {
        }
        n = o;
      },
      now() {
        return ut();
      }
    }, i && i.on(ot, (o, a) => {
      o === this.plugin.id && this.fallbacks.setSettings(a);
    }), this.proxiedOn = new Proxy({}, {
      get: (o, a) => this.target ? this.target.on[a] : (...l) => {
        this.onQueue.push({
          method: a,
          args: l
        });
      }
    }), this.proxiedTarget = new Proxy({}, {
      get: (o, a) => this.target ? this.target[a] : a === "on" ? this.proxiedOn : Object.keys(this.fallbacks).includes(a) ? (...l) => (this.targetQueue.push({
        method: a,
        args: l,
        resolve: () => {
        }
      }), this.fallbacks[a](...l)) : (...l) => new Promise((d) => {
        this.targetQueue.push({
          method: a,
          args: l,
          resolve: d
        });
      })
    });
  }
  async setRealTarget(t) {
    this.target = t;
    for (const i of this.onQueue)
      this.target.on[i.method](...i.args);
    for (const i of this.targetQueue)
      i.resolve(await this.target[i.method](...i.args));
  }
}
function ct(e, t) {
  const i = e, r = U(), s = rt(), n = nt && i.enableEarlyProxy;
  if (s && (r.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !n))
    s.emit(st, e, t);
  else {
    const o = n ? new lt(i, s) : null;
    (r.__VUE_DEVTOOLS_PLUGINS__ = r.__VUE_DEVTOOLS_PLUGINS__ || []).push({
      pluginDescriptor: i,
      setupFn: t,
      proxy: o
    }), o && t(o.proxiedTarget);
  }
}
/*!
 * vuex v4.1.0
 * (c) 2022 Evan You
 * @license MIT
 */
var dt = "store";
function x(e, t) {
  Object.keys(e).forEach(function(i) {
    return t(e[i], i);
  });
}
function H(e) {
  return e !== null && typeof e == "object";
}
function ht(e) {
  return e && typeof e.then == "function";
}
function ft(e, t) {
  return function() {
    return e(t);
  };
}
function R(e, t, i) {
  return t.indexOf(e) < 0 && (i && i.prepend ? t.unshift(e) : t.push(e)), function() {
    var r = t.indexOf(e);
    r > -1 && t.splice(r, 1);
  };
}
function z(e, t) {
  e._actions = /* @__PURE__ */ Object.create(null), e._mutations = /* @__PURE__ */ Object.create(null), e._wrappedGetters = /* @__PURE__ */ Object.create(null), e._modulesNamespaceMap = /* @__PURE__ */ Object.create(null);
  var i = e.state;
  T(e, i, [], e._modules.root, !0), M(e, i, t);
}
function M(e, t, i) {
  var r = e._state, s = e._scope;
  e.getters = {}, e._makeLocalGettersCache = /* @__PURE__ */ Object.create(null);
  var n = e._wrappedGetters, o = {}, a = {}, l = Z(!0);
  l.run(function() {
    x(n, function(d, u) {
      o[u] = ft(d, e), a[u] = $(function() {
        return o[u]();
      }), Object.defineProperty(e.getters, u, {
        get: function() {
          return a[u].value;
        },
        enumerable: !0
        // for local getters
      });
    });
  }), e._state = tt({
    data: t
  }), e._scope = l, e.strict && bt(e), r && i && e._withCommit(function() {
    r.data = null;
  }), s && s.stop();
}
function T(e, t, i, r, s) {
  var n = !i.length, o = e._modules.getNamespace(i);
  if (r.namespaced && (e._modulesNamespaceMap[o], e._modulesNamespaceMap[o] = r), !n && !s) {
    var a = k(t, i.slice(0, -1)), l = i[i.length - 1];
    e._withCommit(function() {
      a[l] = r.state;
    });
  }
  var d = r.context = vt(e, o, i);
  r.forEachMutation(function(u, c) {
    var v = o + c;
    mt(e, v, u, d);
  }), r.forEachAction(function(u, c) {
    var v = u.root ? c : o + c, f = u.handler || u;
    pt(e, v, f, d);
  }), r.forEachGetter(function(u, c) {
    var v = o + c;
    gt(e, v, u, d);
  }), r.forEachChild(function(u, c) {
    T(e, t, i.concat(c), u, s);
  });
}
function vt(e, t, i) {
  var r = t === "", s = {
    dispatch: r ? e.dispatch : function(n, o, a) {
      var l = O(n, o, a), d = l.payload, u = l.options, c = l.type;
      return (!u || !u.root) && (c = t + c), e.dispatch(c, d);
    },
    commit: r ? e.commit : function(n, o, a) {
      var l = O(n, o, a), d = l.payload, u = l.options, c = l.type;
      (!u || !u.root) && (c = t + c), e.commit(c, d, u);
    }
  };
  return Object.defineProperties(s, {
    getters: {
      get: r ? function() {
        return e.getters;
      } : function() {
        return F(e, t);
      }
    },
    state: {
      get: function() {
        return k(e.state, i);
      }
    }
  }), s;
}
function F(e, t) {
  if (!e._makeLocalGettersCache[t]) {
    var i = {}, r = t.length;
    Object.keys(e.getters).forEach(function(s) {
      if (s.slice(0, r) === t) {
        var n = s.slice(r);
        Object.defineProperty(i, n, {
          get: function() {
            return e.getters[s];
          },
          enumerable: !0
        });
      }
    }), e._makeLocalGettersCache[t] = i;
  }
  return e._makeLocalGettersCache[t];
}
function mt(e, t, i, r) {
  var s = e._mutations[t] || (e._mutations[t] = []);
  s.push(function(o) {
    i.call(e, r.state, o);
  });
}
function pt(e, t, i, r) {
  var s = e._actions[t] || (e._actions[t] = []);
  s.push(function(o) {
    var a = i.call(e, {
      dispatch: r.dispatch,
      commit: r.commit,
      getters: r.getters,
      state: r.state,
      rootGetters: e.getters,
      rootState: e.state
    }, o);
    return ht(a) || (a = Promise.resolve(a)), e._devtoolHook ? a.catch(function(l) {
      throw e._devtoolHook.emit("vuex:error", l), l;
    }) : a;
  });
}
function gt(e, t, i, r) {
  e._wrappedGetters[t] || (e._wrappedGetters[t] = function(n) {
    return i(
      r.state,
      // local state
      r.getters,
      // local getters
      n.state,
      // root state
      n.getters
      // root getters
    );
  });
}
function bt(e) {
  B(function() {
    return e._state.data;
  }, function() {
  }, { deep: !0, flush: "sync" });
}
function k(e, t) {
  return t.reduce(function(i, r) {
    return i[r];
  }, e);
}
function O(e, t, i) {
  return H(e) && e.type && (i = t, t = e, e = e.type), { type: e, payload: t, options: i };
}
var _t = "vuex bindings", N = "vuex:mutations", P = "vuex:actions", w = "vuex", yt = 0;
function St(e, t) {
  ct(
    {
      id: "org.vuejs.vuex",
      app: e,
      label: "Vuex",
      homepage: "https://next.vuex.vuejs.org/",
      logo: "https://vuejs.org/images/icons/favicon-96x96.png",
      packageName: "vuex",
      componentStateTypes: [_t]
    },
    function(i) {
      i.addTimelineLayer({
        id: N,
        label: "Vuex Mutations",
        color: G
      }), i.addTimelineLayer({
        id: P,
        label: "Vuex Actions",
        color: G
      }), i.addInspector({
        id: w,
        label: "Vuex",
        icon: "storage",
        treeFilterPlaceholder: "Filter stores..."
      }), i.on.getInspectorTree(function(r) {
        if (r.app === e && r.inspectorId === w)
          if (r.filter) {
            var s = [];
            J(s, t._modules.root, r.filter, ""), r.rootNodes = s;
          } else
            r.rootNodes = [
              W(t._modules.root, "")
            ];
      }), i.on.getInspectorState(function(r) {
        if (r.app === e && r.inspectorId === w) {
          var s = r.nodeId;
          F(t, s), r.state = Ct(
            Tt(t._modules, s),
            s === "root" ? t.getters : t._makeLocalGettersCache,
            s
          );
        }
      }), i.on.editInspectorState(function(r) {
        if (r.app === e && r.inspectorId === w) {
          var s = r.nodeId, n = r.path;
          s !== "root" && (n = s.split("/").filter(Boolean).concat(n)), t._withCommit(function() {
            r.set(t._state.data, n, r.state.value);
          });
        }
      }), t.subscribe(function(r, s) {
        var n = {};
        r.payload && (n.payload = r.payload), n.state = s, i.notifyComponentUpdate(), i.sendInspectorTree(w), i.sendInspectorState(w), i.addTimelineEvent({
          layerId: N,
          event: {
            time: Date.now(),
            title: r.type,
            data: n
          }
        });
      }), t.subscribeAction({
        before: function(r, s) {
          var n = {};
          r.payload && (n.payload = r.payload), r._id = yt++, r._time = Date.now(), n.state = s, i.addTimelineEvent({
            layerId: P,
            event: {
              time: r._time,
              title: r.type,
              groupId: r._id,
              subtitle: "start",
              data: n
            }
          });
        },
        after: function(r, s) {
          var n = {}, o = Date.now() - r._time;
          n.duration = {
            _custom: {
              type: "duration",
              display: o + "ms",
              tooltip: "Action duration",
              value: o
            }
          }, r.payload && (n.payload = r.payload), n.state = s, i.addTimelineEvent({
            layerId: P,
            event: {
              time: Date.now(),
              title: r.type,
              groupId: r._id,
              subtitle: "end",
              data: n
            }
          });
        }
      });
    }
  );
}
var G = 8702998, wt = 6710886, xt = 16777215, Q = {
  label: "namespaced",
  textColor: xt,
  backgroundColor: wt
};
function K(e) {
  return e && e !== "root" ? e.split("/").slice(-2, -1)[0] : "Root";
}
function W(e, t) {
  return {
    id: t || "root",
    // all modules end with a `/`, we want the last segment only
    // cart/ -> cart
    // nested/cart/ -> cart
    label: K(t),
    tags: e.namespaced ? [Q] : [],
    children: Object.keys(e._children).map(
      function(i) {
        return W(
          e._children[i],
          t + i + "/"
        );
      }
    )
  };
}
function J(e, t, i, r) {
  r.includes(i) && e.push({
    id: r || "root",
    label: r.endsWith("/") ? r.slice(0, r.length - 1) : r || "Root",
    tags: t.namespaced ? [Q] : []
  }), Object.keys(t._children).forEach(function(s) {
    J(e, t._children[s], i, r + s + "/");
  });
}
function Ct(e, t, i) {
  t = i === "root" ? t : t[i];
  var r = Object.keys(t), s = {
    state: Object.keys(e.state).map(function(o) {
      return {
        key: o,
        editable: !0,
        value: e.state[o]
      };
    })
  };
  if (r.length) {
    var n = Ot(t);
    s.getters = Object.keys(n).map(function(o) {
      return {
        key: o.endsWith("/") ? K(o) : o,
        editable: !1,
        value: A(function() {
          return n[o];
        })
      };
    });
  }
  return s;
}
function Ot(e) {
  var t = {};
  return Object.keys(e).forEach(function(i) {
    var r = i.split("/");
    if (r.length > 1) {
      var s = t, n = r.pop();
      r.forEach(function(o) {
        s[o] || (s[o] = {
          _custom: {
            value: {},
            display: o,
            tooltip: "Module",
            abstract: !0
          }
        }), s = s[o]._custom.value;
      }), s[n] = A(function() {
        return e[i];
      });
    } else
      t[i] = A(function() {
        return e[i];
      });
  }), t;
}
function Tt(e, t) {
  var i = t.split("/").filter(function(r) {
    return r;
  });
  return i.reduce(
    function(r, s, n) {
      var o = r[s];
      if (!o)
        throw new Error('Missing module "' + s + '" for path "' + t + '".');
      return n === i.length - 1 ? o : o._children;
    },
    t === "root" ? e : e.root._children
  );
}
function A(e) {
  try {
    return e();
  } catch (t) {
    return t;
  }
}
var b = function(t, i) {
  this.runtime = i, this._children = /* @__PURE__ */ Object.create(null), this._rawModule = t;
  var r = t.state;
  this.state = (typeof r == "function" ? r() : r) || {};
}, Y = { namespaced: { configurable: !0 } };
Y.namespaced.get = function() {
  return !!this._rawModule.namespaced;
};
b.prototype.addChild = function(t, i) {
  this._children[t] = i;
};
b.prototype.removeChild = function(t) {
  delete this._children[t];
};
b.prototype.getChild = function(t) {
  return this._children[t];
};
b.prototype.hasChild = function(t) {
  return t in this._children;
};
b.prototype.update = function(t) {
  this._rawModule.namespaced = t.namespaced, t.actions && (this._rawModule.actions = t.actions), t.mutations && (this._rawModule.mutations = t.mutations), t.getters && (this._rawModule.getters = t.getters);
};
b.prototype.forEachChild = function(t) {
  x(this._children, t);
};
b.prototype.forEachGetter = function(t) {
  this._rawModule.getters && x(this._rawModule.getters, t);
};
b.prototype.forEachAction = function(t) {
  this._rawModule.actions && x(this._rawModule.actions, t);
};
b.prototype.forEachMutation = function(t) {
  this._rawModule.mutations && x(this._rawModule.mutations, t);
};
Object.defineProperties(b.prototype, Y);
var _ = function(t) {
  this.register([], t, !1);
};
_.prototype.get = function(t) {
  return t.reduce(function(i, r) {
    return i.getChild(r);
  }, this.root);
};
_.prototype.getNamespace = function(t) {
  var i = this.root;
  return t.reduce(function(r, s) {
    return i = i.getChild(s), r + (i.namespaced ? s + "/" : "");
  }, "");
};
_.prototype.update = function(t) {
  q([], this.root, t);
};
_.prototype.register = function(t, i, r) {
  var s = this;
  r === void 0 && (r = !0);
  var n = new b(i, r);
  if (t.length === 0)
    this.root = n;
  else {
    var o = this.get(t.slice(0, -1));
    o.addChild(t[t.length - 1], n);
  }
  i.modules && x(i.modules, function(a, l) {
    s.register(t.concat(l), a, r);
  });
};
_.prototype.unregister = function(t) {
  var i = this.get(t.slice(0, -1)), r = t[t.length - 1], s = i.getChild(r);
  s && s.runtime && i.removeChild(r);
};
_.prototype.isRegistered = function(t) {
  var i = this.get(t.slice(0, -1)), r = t[t.length - 1];
  return i ? i.hasChild(r) : !1;
};
function q(e, t, i) {
  if (t.update(i), i.modules)
    for (var r in i.modules) {
      if (!t.getChild(r))
        return;
      q(
        e.concat(r),
        t.getChild(r),
        i.modules[r]
      );
    }
}
var g = function(t) {
  var i = this;
  t === void 0 && (t = {});
  var r = t.plugins;
  r === void 0 && (r = []);
  var s = t.strict;
  s === void 0 && (s = !1);
  var n = t.devtools;
  this._committing = !1, this._actions = /* @__PURE__ */ Object.create(null), this._actionSubscribers = [], this._mutations = /* @__PURE__ */ Object.create(null), this._wrappedGetters = /* @__PURE__ */ Object.create(null), this._modules = new _(t), this._modulesNamespaceMap = /* @__PURE__ */ Object.create(null), this._subscribers = [], this._makeLocalGettersCache = /* @__PURE__ */ Object.create(null), this._scope = null, this._devtools = n;
  var o = this, a = this, l = a.dispatch, d = a.commit;
  this.dispatch = function(v, f) {
    return l.call(o, v, f);
  }, this.commit = function(v, f, X) {
    return d.call(o, v, f, X);
  }, this.strict = s;
  var u = this._modules.root.state;
  T(this, u, [], this._modules.root), M(this, u), r.forEach(function(c) {
    return c(i);
  });
}, j = { state: { configurable: !0 } };
g.prototype.install = function(t, i) {
  t.provide(i || dt, this), t.config.globalProperties.$store = this;
  var r = this._devtools !== void 0 ? this._devtools : !1;
  r && St(t, this);
};
j.state.get = function() {
  return this._state.data;
};
j.state.set = function(e) {
};
g.prototype.commit = function(t, i, r) {
  var s = this, n = O(t, i, r), o = n.type, a = n.payload, l = { type: o, payload: a }, d = this._mutations[o];
  d && (this._withCommit(function() {
    d.forEach(function(c) {
      c(a);
    });
  }), this._subscribers.slice().forEach(function(u) {
    return u(l, s.state);
  }));
};
g.prototype.dispatch = function(t, i) {
  var r = this, s = O(t, i), n = s.type, o = s.payload, a = { type: n, payload: o }, l = this._actions[n];
  if (l) {
    try {
      this._actionSubscribers.slice().filter(function(u) {
        return u.before;
      }).forEach(function(u) {
        return u.before(a, r.state);
      });
    } catch {
    }
    var d = l.length > 1 ? Promise.all(l.map(function(u) {
      return u(o);
    })) : l[0](o);
    return new Promise(function(u, c) {
      d.then(function(v) {
        try {
          r._actionSubscribers.filter(function(f) {
            return f.after;
          }).forEach(function(f) {
            return f.after(a, r.state);
          });
        } catch {
        }
        u(v);
      }, function(v) {
        try {
          r._actionSubscribers.filter(function(f) {
            return f.error;
          }).forEach(function(f) {
            return f.error(a, r.state, v);
          });
        } catch {
        }
        c(v);
      });
    });
  }
};
g.prototype.subscribe = function(t, i) {
  return R(t, this._subscribers, i);
};
g.prototype.subscribeAction = function(t, i) {
  var r = typeof t == "function" ? { before: t } : t;
  return R(r, this._actionSubscribers, i);
};
g.prototype.watch = function(t, i, r) {
  var s = this;
  return B(function() {
    return t(s.state, s.getters);
  }, i, Object.assign({}, r));
};
g.prototype.replaceState = function(t) {
  var i = this;
  this._withCommit(function() {
    i._state.data = t;
  });
};
g.prototype.registerModule = function(t, i, r) {
  r === void 0 && (r = {}), typeof t == "string" && (t = [t]), this._modules.register(t, i), T(this, this.state, t, this._modules.get(t), r.preserveState), M(this, this.state);
};
g.prototype.unregisterModule = function(t) {
  var i = this;
  typeof t == "string" && (t = [t]), this._modules.unregister(t), this._withCommit(function() {
    var r = k(i.state, t.slice(0, -1));
    delete r[t[t.length - 1]];
  }), z(this);
};
g.prototype.hasModule = function(t) {
  return typeof t == "string" && (t = [t]), this._modules.isRegistered(t);
};
g.prototype.hotUpdate = function(t) {
  this._modules.update(t), z(this, !0);
};
g.prototype._withCommit = function(t) {
  var i = this._committing;
  this._committing = !0, t(), this._committing = i;
};
Object.defineProperties(g.prototype, j);
var It = At(function(e, t) {
  var i = {};
  return Pt(t).forEach(function(r) {
    var s = r.key, n = r.val;
    i[s] = function() {
      var a = this.$store.state, l = this.$store.getters;
      if (e) {
        var d = Mt(this.$store, "mapState", e);
        if (!d)
          return;
        a = d.context.state, l = d.context.getters;
      }
      return typeof n == "function" ? n.call(this, a, l) : a[n];
    }, i[s].vuex = !0;
  }), i;
});
function Pt(e) {
  return Et(e) ? Array.isArray(e) ? e.map(function(t) {
    return { key: t, val: t };
  }) : Object.keys(e).map(function(t) {
    return { key: t, val: e[t] };
  }) : [];
}
function Et(e) {
  return Array.isArray(e) || H(e);
}
function At(e) {
  return function(t, i) {
    return typeof t != "string" ? (i = t, t = "") : t.charAt(t.length - 1) !== "/" && (t += "/"), e(t, i);
  };
}
function Mt(e, t, i) {
  var r = e._modulesNamespaceMap[i];
  return r;
}
const kt = (e, t) => {
  const i = e.__vccOpts || e;
  for (const [r, s] of t)
    i[r] = s;
  return i;
}, D = 1e4, jt = 10, V = {
  arrow: { mode: "fill", up: "M12 4l8 9h-5v7H9v-7H4z", down: "M12 20l-8-9h5V4h6v7h5z" },
  triangle: { mode: "fill", up: "M12 5l7 7H5z", down: "M12 19l-7-7h14z" },
  chevron: { mode: "stroke", up: "M5 15l7-7 7 7", down: "M5 9l7 7 7-7" }
}, Lt = {
  name: "UIShutter",
  inject: ["$socket"],
  props: {
    id: { type: String, required: !0 },
    props: { type: Object, default: () => ({}) },
    state: { type: Object, default: () => ({ enabled: !0, visible: !0 }) }
  },
  data() {
    return {
      localPosition: null,
      localSlats: null,
      revertTimer: null,
      revertTimerSlats: null,
      slatCount: jt
    };
  },
  computed: {
    ...It("data", ["messages"]),
    msg() {
      return this.messages[this.id];
    },
    hasPosition() {
      return this.msg !== void 0 && this.msg !== null && this.msg.position !== void 0 && this.msg.position !== null;
    },
    hasSlats() {
      return this.msg !== void 0 && this.msg !== null && this.msg.slats !== void 0 && this.msg.slats !== null;
    },
    isBlind() {
      return this.props.shutterType === "blind";
    },
    displayPosition() {
      return this.localPosition !== null ? this.localPosition : this.hasPosition ? this.msg.position : 0;
    },
    displaySlats() {
      return this.localSlats !== null ? this.localSlats : this.hasSlats ? this.msg.slats : 0;
    },
    closedAt100() {
      return this.props.zeroMeans !== "closed";
    },
    closedFraction() {
      const e = this.displayPosition;
      return this.closedAt100 ? e / 100 : 1 - e / 100;
    },
    coverHeightPct() {
      return Math.min(100, Math.max(0, this.closedFraction * 100));
    },
    slatClosedFraction() {
      const e = this.displaySlats;
      return Math.min(1, Math.max(0, e / 100));
    },
    slatPitchPx() {
      return 9;
    },
    slatHeightPx() {
      const t = this.slatPitchPx - 1;
      return 2 + this.slatClosedFraction * (t - 2);
    },
    slatGapPx() {
      return Math.max(1, this.slatPitchPx - this.slatHeightPx);
    },
    positionText() {
      if (!this.hasPosition && this.localPosition === null)
        return "–";
      const e = this.displayPosition, t = this.closedAt100 ? 0 : 100, i = this.closedAt100 ? 100 : 0;
      return e === t ? this.props.textOpen || "Open" : e === i ? this.props.textClosed || "Closed" : `${Math.round(e)} %`;
    },
    color() {
      return this.props.color || "var(--v-theme-primary, #607d8b)";
    },
    skyColor() {
      return this.props.skyColor || "#bbdefb";
    },
    buttonColor() {
      return this.props.buttonColor || this.color;
    },
    buttonIcons() {
      return V[this.props.buttonIconStyle] || V.arrow;
    },
    showLabel() {
      return this.props.showLabel !== !1;
    },
    labelAlignment() {
      return this.props.labelAlignment || "left";
    }
  },
  mounted() {
    var e, t, i;
    (e = this.$socket) == null || e.on("widget-load:" + this.id, this.onLoad), (t = this.$socket) == null || t.on("msg-input:" + this.id, this.onMsgInput), (i = this.$socket) == null || i.emit("widget-load", this.id);
  },
  unmounted() {
    var e, t;
    (e = this.$socket) == null || e.off("widget-load:" + this.id, this.onLoad), (t = this.$socket) == null || t.off("msg-input:" + this.id, this.onMsgInput), clearTimeout(this.revertTimer), clearTimeout(this.revertTimerSlats);
  },
  methods: {
    onLoad(e) {
      this.$store.commit("data/bind", { widgetId: this.id, msg: e });
    },
    onMsgInput(e) {
      this.$store.commit("data/bind", { widgetId: this.id, msg: e }), clearTimeout(this.revertTimer), clearTimeout(this.revertTimerSlats), this.localPosition = null, this.localSlats = null;
    },
    sendAction(e) {
      this.state.enabled && this.$socket.emit("widget-action", this.id, { shutterAction: e });
    },
    onPositionInput(e) {
      this.localPosition = Number(e.target.value);
    },
    onPositionChange(e) {
      const t = Number(e.target.value);
      this.localPosition = t, this.$socket.emit("widget-action", this.id, { shutterAction: "position", value: t }), clearTimeout(this.revertTimer), this.revertTimer = setTimeout(() => {
        this.localPosition = null;
      }, D);
    },
    onSlatsInput(e) {
      this.localSlats = Number(e.target.value);
    },
    onSlatsChange(e) {
      const t = Number(e.target.value);
      this.localSlats = t, this.$socket.emit("widget-action", this.id, { shutterAction: "slats", value: t }), clearTimeout(this.revertTimerSlats), this.revertTimerSlats = setTimeout(() => {
        this.localSlats = null;
      }, D);
    }
  }
}, Nt = { class: "nrdb-ui-shutter-body" }, Gt = {
  key: 0,
  class: "nrdb-ui-shutter-window"
}, Dt = {
  key: 0,
  class: "nrdb-ui-shutter-panels"
}, Vt = {
  key: 1,
  class: "nrdb-ui-shutter-slats"
}, Bt = { class: "nrdb-ui-shutter-controls" }, Ut = {
  key: 0,
  class: "nrdb-ui-shutter-position-text"
}, Ht = {
  key: 1,
  class: "nrdb-ui-shutter-slider-row"
}, Rt = ["value", "disabled"], zt = {
  key: 2,
  class: "nrdb-ui-shutter-slider-row"
}, Ft = ["value", "disabled"], Qt = {
  key: 3,
  class: "nrdb-ui-shutter-buttons"
}, Kt = ["disabled"], Wt = ["d"], Jt = ["disabled"], Yt = ["disabled"], qt = ["d"];
function Xt(e, t, i, r, s, n) {
  return m(), p("div", {
    class: I(["nrdb-ui-shutter", { "nrdb-ui-shutter--disabled": !i.state.enabled }]),
    style: C({ "--sky-color": n.skyColor, "--cover-color": n.color, "--button-color": n.buttonColor })
  }, [
    n.showLabel && i.props.label ? (m(), p("label", {
      key: 0,
      class: "nrdb-ui-shutter-label",
      style: C({ textAlign: n.labelAlignment })
    }, L(i.props.label), 5)) : y("", !0),
    h("div", Nt, [
      i.props.showGraphic ? (m(), p("div", Gt, [
        h("div", {
          class: "nrdb-ui-shutter-cover",
          style: C({ height: n.coverHeightPct + "%" })
        }, [
          n.isBlind ? (m(), p("div", Vt, [
            (m(!0), p(et, null, it(s.slatCount, (o) => (m(), p("div", {
              key: o,
              class: "nrdb-ui-shutter-slat",
              style: C({ height: n.slatHeightPx + "px", marginBottom: n.slatGapPx + "px" })
            }, null, 4))), 128))
          ])) : (m(), p("div", Dt))
        ], 4)
      ])) : y("", !0),
      h("div", Bt, [
        i.props.showPositionText ? (m(), p("div", Ut, L(n.positionText), 1)) : y("", !0),
        i.props.showSlider ? (m(), p("div", Ht, [
          t[7] || (t[7] = h("svg", {
            class: "nrdb-ui-shutter-slider-icon",
            viewBox: "0 0 24 24"
          }, [
            h("path", { d: "M12 7l-8 8h16z" })
          ], -1)),
          h("input", {
            type: "range",
            class: "nrdb-ui-shutter-slider",
            min: "0",
            max: "100",
            step: "1",
            value: n.displayPosition,
            disabled: !i.state.enabled,
            onInput: t[0] || (t[0] = (...o) => n.onPositionInput && n.onPositionInput(...o)),
            onChange: t[1] || (t[1] = (...o) => n.onPositionChange && n.onPositionChange(...o))
          }, null, 40, Rt),
          t[8] || (t[8] = h("svg", {
            class: "nrdb-ui-shutter-slider-icon",
            viewBox: "0 0 24 24"
          }, [
            h("path", { d: "M12 17l8-8H4z" })
          ], -1))
        ])) : y("", !0),
        i.props.showSlider && n.isBlind ? (m(), p("div", zt, [
          t[9] || (t[9] = h("svg", {
            class: "nrdb-ui-shutter-slider-icon",
            viewBox: "0 0 24 24"
          }, [
            h("rect", {
              x: "4",
              y: "11",
              width: "16",
              height: "2"
            })
          ], -1)),
          h("input", {
            type: "range",
            class: "nrdb-ui-shutter-slider",
            min: "0",
            max: "100",
            step: "1",
            value: n.displaySlats,
            disabled: !i.state.enabled,
            onInput: t[2] || (t[2] = (...o) => n.onSlatsInput && n.onSlatsInput(...o)),
            onChange: t[3] || (t[3] = (...o) => n.onSlatsChange && n.onSlatsChange(...o))
          }, null, 40, Ft),
          t[10] || (t[10] = h("svg", {
            class: "nrdb-ui-shutter-slider-icon",
            viewBox: "0 0 24 24"
          }, [
            h("rect", {
              x: "4",
              y: "4",
              width: "16",
              height: "16"
            })
          ], -1))
        ])) : y("", !0),
        i.props.showButtons ? (m(), p("div", Qt, [
          h("button", {
            type: "button",
            class: "nrdb-ui-shutter-button",
            disabled: !i.state.enabled,
            "aria-label": "Up",
            title: "Up",
            onClick: t[4] || (t[4] = (o) => n.sendAction("up"))
          }, [
            (m(), p("svg", {
              class: I(["nrdb-ui-shutter-icon", { "nrdb-ui-shutter-icon--stroke": n.buttonIcons.mode === "stroke" }]),
              viewBox: "0 0 24 24"
            }, [
              h("path", {
                d: n.buttonIcons.up
              }, null, 8, Wt)
            ], 2))
          ], 8, Kt),
          h("button", {
            type: "button",
            class: "nrdb-ui-shutter-button",
            disabled: !i.state.enabled,
            "aria-label": "Stop",
            title: "Stop",
            onClick: t[5] || (t[5] = (o) => n.sendAction("stop"))
          }, [...t[11] || (t[11] = [
            h("svg", {
              class: "nrdb-ui-shutter-icon",
              viewBox: "0 0 24 24"
            }, [
              h("rect", {
                x: "5",
                y: "5",
                width: "14",
                height: "14",
                rx: "1.5"
              })
            ], -1)
          ])], 8, Jt),
          h("button", {
            type: "button",
            class: "nrdb-ui-shutter-button",
            disabled: !i.state.enabled,
            "aria-label": "Down",
            title: "Down",
            onClick: t[6] || (t[6] = (o) => n.sendAction("down"))
          }, [
            (m(), p("svg", {
              class: I(["nrdb-ui-shutter-icon", { "nrdb-ui-shutter-icon--stroke": n.buttonIcons.mode === "stroke" }]),
              viewBox: "0 0 24 24"
            }, [
              h("path", {
                d: n.buttonIcons.down
              }, null, 8, qt)
            ], 2))
          ], 8, Yt)
        ])) : y("", !0)
      ])
    ])
  ], 6);
}
const $t = /* @__PURE__ */ kt(Lt, [["render", Xt], ["__scopeId", "data-v-2cf99a28"]]);
export {
  $t as UIShutter
};
