/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 4558:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GQ": function() { return /* binding */ MinimogSettings; },
/* harmony export */   "LE": function() { return /* binding */ MinimogTheme; },
/* harmony export */   "s0": function() { return /* binding */ MinimogEvents; }
/* harmony export */ });
/* unused harmony exports MinimogStrings, MinimogLibs */
/* harmony import */ var _utils_events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8971);
/* harmony import */ var _libs_loadjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9280);
/* harmony import */ var _libs_loadjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_libs_loadjs__WEBPACK_IMPORTED_MODULE_0__);


window.MinimogEvents = window.MinimogEvents || new _utils_events__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z();
window._ThemeEvent = window.MinimogEvents;
window.MinimogLibs.loadjs = __loadjs;
const MinimogEvents = window.MinimogEvents;
const MinimogTheme = window.MinimogTheme || {};
const MinimogSettings = window.MinimogSettings || {};
const MinimogStrings = window.MinimogStrings || {};
const MinimogLibs = window.MinimogLibs || {};

/***/ }),

/***/ 9280:
/***/ (function() {

__loadjs = function () {
  var h = function () {},
    c = {},
    u = {},
    f = {};
  function o(e, n) {
    if (e) {
      var r = f[e];
      if (u[e] = n, r) for (; r.length;) r[0](e, n), r.splice(0, 1);
    }
  }
  function l(e, n) {
    e.call && (e = {
      success: e
    }), n.length ? (e.error || h)(n) : (e.success || h)(e);
  }
  function d(r, t, s, i) {
    var c,
      o,
      e = document,
      n = s.async,
      u = (s.numRetries || 0) + 1,
      f = s.before || h,
      l = r.replace(/[\?|#].*$/, ""),
      a = r.replace(/^(css|img)!/, "");
    i = i || 0, /(^css!|\.css$)/.test(l) ? ((o = e.createElement("link")).rel = "stylesheet", o.href = a, (c = "hideFocus" in o) && o.relList && (c = 0, o.rel = "preload", o.as = "style")) : /(^img!|\.(png|gif|jpg|svg|webp)$)/.test(l) ? (o = e.createElement("img")).src = a : ((o = e.createElement("script")).src = r, o.async = void 0 === n || n), !(o.onload = o.onerror = o.onbeforeload = function (e) {
      var n = e.type[0];
      if (c) try {
        o.sheet.cssText.length || (n = "e");
      } catch (e) {
        18 != e.code && (n = "e");
      }
      if ("e" == n) {
        if ((i += 1) < u) return d(r, t, s, i);
      } else if ("preload" == o.rel && "style" == o.as) return o.rel = "stylesheet";
      t(r, n, e.defaultPrevented);
    }) !== f(r, o) && e.head.appendChild(o);
  }
  function r(e, n, r) {
    var t, s;
    if (n && n.trim && (t = n), s = (t ? r : n) || {}, t) {
      if (t in c) throw "LoadJS";
      c[t] = !0;
    }
    function i(n, r) {
      !function (e, t, n) {
        var r,
          s,
          i = (e = e.push ? e : [e]).length,
          c = i,
          o = [];
        for (r = function (e, n, r) {
          if ("e" == n && o.push(e), "b" == n) {
            if (!r) return;
            o.push(e);
          }
          --i || t(o);
        }, s = 0; s < c; s++) d(e[s], r, n);
      }(e, function (e) {
        l(s, e), n && l({
          success: n,
          error: r
        }, e), o(t, e);
      }, s);
    }
    if (s.returnPromise) return new Promise(i);
    i();
  }
  return r.ready = function (e, n) {
    return function (e, r) {
      e = e.push ? e : [e];
      var n,
        t,
        s,
        i = [],
        c = e.length,
        o = c;
      for (n = function (e, n) {
        n.length && i.push(e), --o || r(i);
      }; c--;) t = e[c], (s = u[t]) ? n(t, s) : (f[t] = f[t] || []).push(n);
    }(e, function (e) {
      l(n, e);
    }), r;
  }, r.done = function (e) {
    o(e, []);
  }, r.reset = function () {
    c = {}, u = {}, f = {};
  }, r.isDefined = function (e) {
    return e in c;
  }, r;
}();

/***/ }),

/***/ 8971:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ Event; }
/* harmony export */ });
/* unused harmony export addEventDelegate */
const addEventDelegate = _ref => {
  let {
    context = document.documentElement,
    event = 'click',
    selector,
    handler,
    capture = false
  } = _ref;
  const listener = function (e) {
    // loop parent nodes from the target to the delegation node
    for (let target = e.target; target && target !== this; target = target.parentNode) {
      if (target.matches(selector)) {
        handler.call(target, e, target);
        break;
      }
    }
  };
  context.addEventListener(event, listener, capture);
  return () => {
    context.removeEventListener(event, listener, capture);
  };
};
class Event {
  constructor() {
    this.events = {};
  }
  get evts() {
    return Object.keys(this.events);
  }
  subscribe(event, handler) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(handler);
    return () => this.unSubscribe(event, handler);
  }
  unSubscribe(event, handler) {
    const handlers = this.events[event];
    if (handlers && Array.isArray(handlers)) {
      for (let i = 0; i < handlers.length; i++) {
        if (handlers[i] === handler) {
          handlers.splice(i, 1);
          break;
        }
      }
    }
  }
  emit(event) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    console.groupCollapsed(`Event emitted: ${event}`);
    console.trace();
    console.groupEnd();
    (this.events[event] || []).forEach(handler => {
      handler(...args);
    });
  }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
// extracted by mini-css-extract-plugin

}();
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
!function() {
/* provided dependency */ var MinimogSettings = __webpack_require__(4558)["GQ"];
/* provided dependency */ var MinimogTheme = __webpack_require__(4558)["LE"];
/* provided dependency */ var MinimogEvents = __webpack_require__(4558)["s0"];
class GiftWrappingComponent extends HTMLElement {
  constructor() {
    super();
    this.cartDrawer = document.getElementById("cart-drawer-container");
    this.giftWrapId = this.dataset.giftWrapId;
    this.giftWrapping = this.dataset.giftWrapping;
    this.cartItemsSize = parseInt(this.getAttribute('cart-items-size'));
    this.giftWrapsInCart = parseInt(this.getAttribute('gift-wraps-in-cart'));
    this.itemsInCart = parseInt(this.getAttribute('items-in-cart'));
    this.loadingIcon = this.querySelector(".sf-gift-wrapping--loading");

    // When the gift-wrapping checkbox is checked or unchecked.
    this.querySelector('[name="attributes[gift-wrapping]"]').addEventListener("change", event => {
      event.target.checked ? this.setGiftWrapping() : this.removeGiftWrapping();
    });
    if (this.cartDrawer) return;

    // If we have nothing but gift-wrap items in the cart.
    if (this.cartItemsSize == 1 && this.giftWrapsInCart > 0) {
      this.removeGiftWrapping();
    }
    // If we don't have the right amount of gift-wrap items in the cart.
    else if (this.giftWrapsInCart > 0 & this.giftWrapsInCart != this.itemsInCart) {
      this.setGiftWrapping();
    }
    // If we have a gift-wrap item in the cart but our gift-wrapping cart attribute has not been set.
    else if (this.giftWrapsInCart > 0 && this.giftWrapping.length == 0) {
      this.setGiftWrapping();
    }
    // If we have no gift-wrap item in the cart but our gift-wrapping cart attribute has been set.
    else if (this.giftWrapsInCart == 0 && this.giftWrapping.length > 0) {
      this.setGiftWrapping();
    }
  }
  setGiftWrapping() {
    this.loadingIcon.classList.add("show");
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const config = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        updates: {
          [this.giftWrapId]: this.itemsInCart
        },
        attributes: {
          'gift-wrapping': true
        }
      })
    };
    this.updateCart(config);
  }
  removeGiftWrapping() {
    this.loadingIcon.classList.add("show");
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const config = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        updates: {
          [this.giftWrapId]: 0
        },
        attributes: {
          'gift-wrapping': '',
          'gift-note': ''
        }
      })
    };
    this.updateCart(config);
  }
  updateCart(request) {
    return fetch(`${MinimogSettings.routes.cart_update_url}`, request).then(response => response.json()).then(response => {
      this.loadingIcon.classList.remove("show");
      if (document.body.classList.contains('template-cart')) {
        window.location.href = MinimogSettings.routes.cart;
        return;
      }
      if (MinimogTheme.Cart) {
        MinimogTheme.Cart.renderNewCart();
        MinimogEvents.emit('ON_CART_UPDATE', response);
      }
    }).catch(e => {
      console.error(e);
    });
  }
}
customElements.define('m-gift-wrapping-component', GiftWrappingComponent);
class GiftNoteComponent extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', debounce(event => {
      const headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });
      let request = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          attributes: {
            'gift-note': event.target.value
          }
        })
      };
      fetch(`${MinimogSettings.routes.cart_update_url}`, request);
    }, 300));
  }
}
customElements.define('m-gift-note-component', GiftNoteComponent);
class GiftWrappingQuantityInput extends HTMLElement {
  constructor() {
    super();
    this.init();
  }
  init() {
    this.input = this.querySelector("input");
    this.changeEvent = new Event("change", {
      bubbles: true
    });
    this.productId = this.dataset.productId;
    this.input.addEventListener("change", () => {
      window.MinimogTheme.Cart.changeItemQty({
        id: this.input.dataset.id,
        quantity: parseInt(this.input.value)
      });
    });
    this.giftWrapping = MinimogTheme.Cart.giftWrapping;
    if (this.giftWrapping) {
      this.cartItemsSize = parseInt(this.getAttribute('cart-items-size'));
      this.giftWrapsInCart = parseInt(this.getAttribute('gift-wraps-in-cart'));
      this.itemsInCart = parseInt(this.getAttribute('items-in-cart'));

      // If we have nothing but gift-wrap items in the cart.
      if (this.cartItemsSize == 1 && this.giftWrapsInCart > 0) {
        window.MinimogTheme.Cart.changeItemQty({
          id: this.input.dataset.id,
          quantity: 0
        });
        const headers = new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        });
        const config = {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            attributes: {
              'gift-wrapping': '',
              'gift-note': ''
            }
          })
        };
        fetch(`${MinimogSettings.routes.cart_update_url}`, config);
        MinimogTheme.Cart.renderNewCart();
      }
      // If we don't have the right amount of gift-wrap items in the cart.
      else if (this.giftWrapsInCart > 0 & this.giftWrapsInCart != this.itemsInCart) {
        this.update();
      }
      // If we have a gift-wrap item in the cart but our gift-wrapping cart attribute has not been set.
      else if (this.giftWrapsInCart > 0 && this.giftWrapping.length == 0) {
        this.update();
      }
      // If we have no gift-wrap item in the cart but our gift-wrapping cart attribute has been set.
      else if (this.giftWrapsInCart == 0 && this.giftWrapping.length > 0) {
        this.update();
      }
    }
  }
  update() {
    this.input.value = this.itemsInCart;
    this.input.dispatchEvent(this.changeEvent);
  }
}
customElements.define('m-gift-wrapping-input', GiftWrappingQuantityInput);
}();
/******/ })()
;