/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 4558:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "gM": function() { return /* binding */ MinimogLibs; }
/* harmony export */ });
/* unused harmony exports MinimogEvents, MinimogTheme, MinimogSettings, MinimogStrings */
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/* provided dependency */ var MinimogLibs = __webpack_require__(4558)["gM"];
if (!customElements.get("media-gallery")) {
  customElements.define("media-gallery", class MediaGallery extends HTMLElement {
    constructor() {
      super();
      this.selectors = {
        container: ".sf-product-wrapper",
        slider: ".swiper-container",
        sliderPagination: ".swiper-pagination",
        sliderPrevEl: ".swiper-button-prev",
        sliderNextEl: ".swiper-button-next",
        navSlider: ".nav-swiper-container",
        medias: [".sf-prod-media-item"],
        mediaWrapper: ".sf-prod-media__wrapper",
        mediaZoomIns: [".sf-prod-media__zoom-in"],
        videos: [".media-video"],
        productBlock: ".sf-prod__block",
        variantIdNode: '.main-product-form [name="id"]',
        featuredImage: '.sf-prod-media'
      };
    }
    connectedCallback() {
      this.container = this.closest(this.selectors.container);
      this.domNodes = queryDomNodes(this.selectors, this);
      this.enableVideoAutoplay = this.dataset.enableVideoAutoplay === "true";
      this.enableImageZoom = this.dataset.enableImageZoom === "true";
      this.enableVariantGroupImages = this.dataset.enableVariantGroupImages === "true";
      this.onlyMedia = this.dataset.onlyMedia === "true";
      if (this.closest(".sf-prod__block")) {
        this.view = this.closest(".sf-prod__block").dataset.view || "product-template";
      }
      this.section = this.closest(`[data-section-id="${this.sectionId}"]`);
      this.layout = this.dataset.layout;
      this.setupData();
    }
    async setupData() {
      this.productHandle = this.dataset.productHandle;
      this.productUrl = this.dataset.productUrl;
      this.productData = await this.getProductJson(this.productUrl);
      const {
        productData,
        productData: {
          variants
        } = {}
      } = this;
      const variantIdNode = this.container.querySelector(this.selectors.variantIdNode);
      if (productData && variantIdNode) {
        let currentVariantId = Number(variantIdNode.value);
        if (!currentVariantId) {
          currentVariantId = productData.selected_or_first_available_variant.id;
        }
        const currentVariant = variants.find(v => v.id === currentVariantId) || variants[0];
        this.productData.initialVariant = currentVariant;
        if (!this.productData.selected_variant && variantIdNode.dataset.selectedVariant) {
          this.productData.selected_variant = variants.find(v => v.id === Number(variantIdNode.dataset.selectedVariant));
        }
      }
      this.init();
    }
    init() {
      const variantPicker = this.container.querySelector("variant-picker");
      switch (this.view) {
        case "product-template":
          this.handlePhotoswipe();
          this.initPhotoswipe();
          this.initSlider();
          if (this.mediaMode !== "slider") {
            this.mediaMode = "gallery";
          }
          break;
        case "featured-product":
          this.initSlider();
          break;
        case "card":
          this.mediaMode = "featured-image";
          break;
        case "sticky-atc":
          this.mediaMode = "featured-image";
          break;
        case "quick-view":
          this.mediaMode = "featured-image";
          this.initSlider();
          break;
        default:
          console.warn("Unknown product view: ", this, this.view);
          break;
      }

      // Handle autoplay video when video item order first
      this.handleAutoplayVideo();

      // Fix when variant-picker block not add, but enable variant group images
      if (!variantPicker) {
        this.initPhotoswipe();
        this.handleSlideChange();
        this.removeAttribute("data-media-loading");
        this.firstElementChild.style.opacity = 1;
      }
    }
    initSlider() {
      if (!this.domNodes.slider) return;
      this.mediaMode = "slider";
      const {
        domNodes: {
          slider,
          sliderPagination,
          navSlider,
          sliderNextEl: nextEl,
          sliderPrevEl: prevEl
        }
      } = this;
      let initialSlide = 0,
        configNav = {},
        config = {};
      if (this.productData.initialVariant && this.productData.selected_variant) {
        var _this$productData$ini, _this$productData$ini2;
        initialSlide = ((_this$productData$ini = this.productData.initialVariant) === null || _this$productData$ini === void 0 ? void 0 : (_this$productData$ini2 = _this$productData$ini.featured_media) === null || _this$productData$ini2 === void 0 ? void 0 : _this$productData$ini2.position) - 1 || 0;
      }
      configNav = {
        loop: false,
        initialSlide,
        slidesPerView: 5,
        freeMode: true,
        spaceBetween: 10,
        threshold: 2,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        direction: this.layout === "layout-6" ? "vertical" : "horizontal",
        on: {
          init: () => navSlider.style.opacity = 1
        }
      };
      this.navSlider = navSlider ? new MinimogLibs.Swiper(navSlider, configNav) : null;
      const thumbs = this.navSlider ? {
        thumbs: {
          swiper: this.navSlider
        }
      } : {};
      config = Object.assign({}, getProductSliderConfig(this.layout), {
        initialSlide,
        autoHeight: true,
        navigation: {
          nextEl,
          prevEl
        },
        threshold: 2,
        loop: this.enableVariantGroupImages ? false : true,
        pagination: {
          el: sliderPagination,
          clickable: true,
          type: "bullets"
        },
        ...thumbs,
        on: {
          init: () => {
            slider.style.opacity = 1;
            this.domNodes = queryDomNodes(this.selectors, this.container);
          }
        }
      });
      this.slider = new MinimogLibs.Swiper(slider, config);
      if (!this.enableVariantGroupImages) this.handleSlideChange();
    }
    handleSlideChange() {
      if (!this.slider) return;
      let draggable = true,
        mediaType = "",
        visibleSlides = [];
      this.slider.on("slideChange", swiper => {
        window.pauseAllMedia();
        try {
          const {
            slides,
            activeIndex
          } = swiper;
          if (slides[activeIndex]) this.playActiveMedia(slides[activeIndex]);
          visibleSlides = [activeIndex];
          if (this.layout === "layout-5" || this.layout === "layout-7") {
            visibleSlides.push(activeIndex + 1);
          }
          for (let index of visibleSlides) {
            const currSlide = slides[index];
            mediaType = currSlide === null || currSlide === void 0 ? void 0 : currSlide.dataset.mediaType;
            if (mediaType === "model") break;
          }

          // Change touchMove state, for making the model inside slide draggable
          if (mediaType === "model") {
            this.slider.allowTouchMove = false;
            draggable = false;
          } else {
            if (!draggable) this.slider.allowTouchMove = true;
            draggable = true;
          }
        } catch (error) {
          console.error("Failed to execute slideChange event.", error);
        }
      });
    }
    handleAutoplayVideo() {
      if (this.mediaMode === "slider") {
        const {
          slides,
          activeIndex
        } = this.slider;
        const slideActive = slides[activeIndex];
        const firstElmMediaType = slideActive === null || slideActive === void 0 ? void 0 : slideActive.dataset.mediaType;
        if (firstElmMediaType === "video" || firstElmMediaType == "external_video") {
          const deferredMedia = slideActive.querySelector("deferred-media");
          const autoplay = deferredMedia.dataset.autoPlay === "true";
          if (deferredMedia && autoplay) deferredMedia.loadContent(false);
        }
      } else {
        const allMedia = this.querySelectorAll(".sf-prod-media-item");
        if (allMedia) {
          allMedia.forEach(media => {
            const mediaType = media.dataset.mediaType;
            if (mediaType === "video" || mediaType === "external_video") {
              const deferredMedia = media.querySelector("deferred-media");
              const autoplay = deferredMedia.dataset.autoPlay === "true";
              if (deferredMedia && autoplay) deferredMedia.loadContent(false);
            }
          });
        }
      }
    }
    playActiveMedia(selected) {
      const deferredMedia = selected.querySelector("deferred-media");
      if (!deferredMedia) return;
      const autoplay = deferredMedia.dataset.autoPlay === "true";
      if (!autoplay) return;
      if (!deferredMedia.getAttribute("loaded")) {
        deferredMedia.loadContent(false);
      } else {
        const deferredElement = deferredMedia.querySelector("video, model-viewer, iframe");
        if (deferredElement.classList.contains('js-youtube')) {
          const symbol = deferredElement.src.indexOf("?") > -1 ? "&" : "?";
          deferredElement.src += symbol + "autoplay=1&mute=1";
        } else if (deferredElement.classList.contains('js-vimeo')) {
          const symbol = deferredElement.src.indexOf("?") > -1 ? "&" : "?";
          deferredElement.src += symbol + "autoplay=1&muted=1";
        } else {
          deferredElement.play();
        }
      }
    }
    handlePhotoswipe() {
      let customData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      if (!this.enableImageZoom) return;
      const data = [];
      const medias = this.querySelectorAll(".sf-prod-media-item:not(.swiper-slide-duplicate)");
      if (medias) {
        medias.forEach((media, index) => {
          if (media.dataset.mediaType === "image") {
            const mediaDataItem = media.querySelector(".sf-prod-media");
            const mediaData = mediaDataItem.dataset;
            data.push({
              src: mediaData.mediaSrc,
              width: parseInt(mediaData.mediaWidth),
              height: parseInt(mediaData.mediaHeight),
              alt: mediaData.mediaAlt,
              id: media.dataset.index
            });
          } else {
            data.push({
              html: `<div class="pswp__${media.dataset.mediaType}">${media.innerHTML}</div>`,
              type: media.dataset.mediaType,
              id: media.dataset.index
            });
          }
        });
      }
      this.lightbox = new MinimogLibs.PhotoSwipeLightbox({
        dataSource: customData.length > 0 ? customData : data,
        bgOpacity: 1,
        close: false,
        zoom: false,
        arrowNext: false,
        arrowPrev: false,
        counter: false,
        preloader: false,
        pswpModule: MinimogLibs.PhotoSwipeLightbox.PhotoSwipe
      });
      this.lightbox.addFilter("thumbEl", (thumbEl, data, index) => {
        const el = this.querySelector('[data-index="' + data.id + '"]:not(.swiper-slide-duplicate) img');
        if (el) {
          return el;
        }
        return thumbEl;
      });
      this.lightbox.addFilter("placeholderSrc", (placeholderSrc, slide) => {
        const el = this.querySelector('[data-index="' + slide.data.id + '"]:not(.swiper-slide-duplicate) img');
        if (el) {
          return el.src;
        }
        return placeholderSrc;
      });
      this.lightbox.on("change", () => {
        window.pauseAllMedia();
        if (this.slider) {
          const currIndex = this.lightbox.pswp.currIndex;
          if (this.enableVariantGroupImages) {
            this.slider.slideTo(currIndex, 100, false);
          } else {
            this.slider.slideToLoop(currIndex, 100, false);
          }
        }
      });
      this.lightbox.on("pointerDown", e => {
        const currSlide = this.lightbox.pswp.currSlide.data;
        if (currSlide.type === "model") {
          e.preventDefault();
        }
      });

      // Adding UI elements
      const closeBtn = {
        name: "m-close",
        order: 11,
        isButton: true,
        html: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
        onClick: (event, el, pswp) => {
          pswp.close();
        }
      };
      const arrowNext = {
        name: "m-arrowNext",
        className: "sf-pswp-button--arrow-next",
        order: 12,
        isButton: true,
        html: '<svg fill="currentColor" width="14px" height="14px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M218.101 38.101L198.302 57.9c-4.686 4.686-4.686 12.284 0 16.971L353.432 230H12c-6.627 0-12 5.373-12 12v28c0 6.627 5.373 12 12 12h341.432l-155.13 155.13c-4.686 4.686-4.686 12.284 0 16.971l19.799 19.799c4.686 4.686 12.284 4.686 16.971 0l209.414-209.414c4.686-4.686 4.686-12.284 0-16.971L235.071 38.101c-4.686-4.687-12.284-4.687-16.97 0z"></path></svg>',
        onClick: (event, el, pswp) => {
          pswp.next();
        }
      };
      const arrowPrev = {
        name: "m-arrowPrev",
        className: "sf-pswp-button--arrow-prev",
        order: 10,
        isButton: true,
        html: '<svg width="14px" height="14px" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M229.9 473.899l19.799-19.799c4.686-4.686 4.686-12.284 0-16.971L94.569 282H436c6.627 0 12-5.373 12-12v-28c0-6.627-5.373-12-12-12H94.569l155.13-155.13c4.686-4.686 4.686-12.284 0-16.971L229.9 38.101c-4.686-4.686-12.284-4.686-16.971 0L3.515 247.515c-4.686 4.686-4.686 12.284 0 16.971L212.929 473.9c4.686 4.686 12.284 4.686 16.971-.001z"></path></svg>',
        onClick: (event, el, pswp) => {
          pswp.prev();
        }
      };
      this.lightbox.on("uiRegister", () => {
        this.lightbox.pswp.ui.registerElement(closeBtn);
        if (!this.onlyMedia) {
          this.lightbox.pswp.ui.registerElement(arrowPrev);
          this.lightbox.pswp.ui.registerElement(arrowNext);
        }
      });
    }
    initPhotoswipe() {
      if (!this.enableImageZoom) return;
      this.lightbox.init();
      addEventDelegate({
        selector: this.selectors.medias[0],
        context: this,
        handler: (e, media) => {
          e.preventDefault();
          const isImage = media.classList.contains("media-type-image");
          const isZoomButton = e.target.closest(this.selectors.mediaZoomIns[0]);
          if (isImage || isZoomButton) {
            const index = Number(media.dataset.index) || 0;
            this.lightbox.loadAndOpen(index);
          }
        }
      });
    }
    setActiveMedia(variant) {
      if (!variant) return;
      if (this.mediaMode === "slider") {
        if (variant.featured_media) {
          const slideIndex = variant.featured_media.position || 0;
          if (this.slider && this.slider.wrapperEl) {
            this.slider.slideToLoop(slideIndex - 1);
          }
        }
      } else if (this.mediaMode === "featured-image") {
        if (variant.featured_image) {
          const src = variant.featured_image.src;
          const {
            featuredImage
          } = this.domNodes;
          const img = featuredImage.querySelector("img");
          if (img && src) img.src = src;
        }
      } else {
        // handle change image in gallery mode
        if (variant.featured_media) {
          const selectedMedia = this.querySelector(`[data-media-id="${variant.featured_media.id}"]`);
          if (selectedMedia) {
            this.scrollIntoView(selectedMedia);
          }
        }
      }
    }
    scrollIntoView(selectedMedia) {
      selectedMedia.scrollIntoView({
        behavior: "smooth"
      });
    }
    getProductJson(productUrl) {
      return fetch(productUrl + ".js").then(function (response) {
        return response.json();
      });
    }
  });
}
}();
/******/ })()
;