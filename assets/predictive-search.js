/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
;// CONCATENATED MODULE: ./src/js/modules/predictive-search.js

class PredictiveSearch extends HTMLElement {
  constructor() {
    super();
    _defineProperty(this, "setPopularSearchesLink", () => {
      const {
        popularSearchItems
      } = this.domNodes;
      popularSearchItems.forEach(itm => itm.href = createSearchLink(itm.dataset.psQuery));
    });
    this.selectors = {
      searchQuery: '[data-query]',
      searchMessage: '[data-message]',
      input: '[data-search-input]',
      submit: 'button[type="submit"]',
      loading: '[data-spinner]',
      clear: '[data-clear-search]',
      popularSearchItems: ['[data-ps-item]']
    };
    this.container = document.querySelector('[data-search-popup]');
    this.domNodes = queryDomNodes(this.selectors, this.container);
    this.cachedResults = {};
    this.transitionDuration = 300;
    this.input = this.querySelector('input[type="search"]');
    this.predictiveSearchResults = this.querySelector('[data-predictive-search]');
    this.popularSearches = this.querySelector('[data-popular-searches]');
    this.searchCount = this.querySelector('[data-search-count]');
    this.setupEventListeners();
    // this.setPopularSearchesLink();
  }

  setupEventListeners() {
    const {
      clear
    } = this.domNodes;
    const form = this.querySelector('form.m-search-form');
    form.addEventListener('submit', this.onFormSubmit.bind(this));
    this.input.addEventListener('input', debounce(event => {
      this.onChange(event);
    }, 300).bind(this));
    clear.addEventListener('click', this.onClearSearch.bind(this));
  }
  getQuery() {
    return this.input.value.trim();
  }
  onChange() {
    const searchTerm = this.getQuery();
    if (!searchTerm.length) {
      this.close(true);
      return;
    }
    this.getSearchResults(searchTerm);
  }
  onFormSubmit(event) {
    if (!this.getQuery().length || this.querySelector('[aria-selected="true"] a')) event.preventDefault();
  }
  onClearSearch(event) {
    event.preventDefault();
    this.input.value = '';
    this.onChange();
  }
  getSearchResults(searchTerm) {
    const queryKey = searchTerm.replace(" ", "-").toLowerCase();
    this.toggleSpinnerLoading(true);
    this.toggleClearSearch(false);
    const searchByTag = this.dataset.searchByTag === 'true';
    const searchByBody = this.dataset.searchByBody === 'true';
    const unavailableProductsOption = this.dataset.unavailableProductsOption;
    let searchFields = 'title,product_type,vendor,variants.sku,variants.title';
    if (searchByTag) searchFields += ',body';
    if (searchByBody) searchFields += ',tag';
    if (this.cachedResults[queryKey]) {
      this.renderSearchResults(this.cachedResults[queryKey]);
      return;
    }
    let searchURL = `${window.MinimogSettings.routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&resources[type]=product&resources[options][unavailable_products]=${unavailableProductsOption}&resources[options][fields]=${searchFields}&section_id=predictive-search`;
    fetch(`${searchURL}`).then(response => {
      if (!response.ok) {
        var error = new Error(response.status);
        this.close();
        throw error;
      }
      return response.text();
    }).then(text => {
      const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
      this.cachedResults[queryKey] = resultsMarkup;
      this.renderSearchResults(resultsMarkup);
    }).catch(error => {
      this.close();
      throw error;
    });
  }
  renderSearchResults(resultsMarkup) {
    this.predictiveSearchResults.innerHTML = resultsMarkup;
    this.setAttribute('results', true);
    const searchItemsWrapper = this.querySelector('[data-search-items-wrapper]');
    if (searchItemsWrapper.childElementCount > 0) {
      this.renderSearchQueryAndMessage(true);
    } else {
      this.renderSearchQueryAndMessage(false);
    }
    this.toggleSpinnerLoading(false);
    this.toggleClearSearch(true);
    this.open();
  }
  renderSearchQueryAndMessage(results) {
    const {
      input,
      searchQuery,
      searchMessage
    } = this.domNodes;
    const query = input.value;
    const {
      resultsTitle
    } = searchMessage.dataset;
    searchQuery.textContent = query;
    if (results) {
      searchMessage.textContent = resultsTitle;
    } else {
      searchMessage.textContent = searchMessage.dataset.noResults;
    }
  }
  toggleSpinnerLoading(show) {
    const {
      loading,
      submit
    } = this.domNodes;
    submit.style.visibility = show ? 'hidden' : 'visible';
    loading.style.visibility = show ? 'visible' : 'hidden';
  }
  toggleClearSearch(show) {
    const {
      clear
    } = this.domNodes;
    clear.style.visibility = show ? "visible" : "hidden";
  }
  open() {
    var _this$popularSearches;
    this.setAttribute('open', true);
    this.input.setAttribute('aria-expanded', true);
    this.isOpen = true;
    this.predictiveSearchResults.classList.remove('hidden');
    (_this$popularSearches = this.popularSearches) === null || _this$popularSearches === void 0 ? void 0 : _this$popularSearches.classList.add('hidden');
    this.searchCount.classList.remove('hidden');
  }
  close() {
    var _this$popularSearches2;
    let clearSearchTerm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (clearSearchTerm) {
      this.input.value = '';
      this.removeAttribute('results');
      this.toggleClearSearch(false);
    }
    this.removeAttribute('open');
    this.predictiveSearchResults.classList.add('hidden');
    (_this$popularSearches2 = this.popularSearches) === null || _this$popularSearches2 === void 0 ? void 0 : _this$popularSearches2.classList.remove('hidden');
    this.searchCount.classList.add('hidden');
  }
}
customElements.define('predictive-search', PredictiveSearch);
/******/ })()
;