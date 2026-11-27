/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
var formFactor = "Large";

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const FORM_FACTOR_PHONE = 'Small';
function shouldDispatchToApp(target, formFactor) {
  const isMobile = formFactor === FORM_FACTOR_PHONE;
  return !target || target === '_self' || isMobile && target === '_blank' || target === '_top' && window.top === window || target === '_parent' && window.parent === window;
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const GET_LINK_INFO_EVENT = 'lightningroutingservicegetlinkinfo';
const LINK_PROVIDERS = new WeakMap();
const urlTypes = {
  standard: 'standard_webPage'
};
class LinkInfo {
  constructor(url, dispatcher) {
    this.url = void 0;
    this.dispatcher = void 0;
    this.url = url;
    this.dispatcher = dispatcher;
    Object.freeze(this);
  }
}
function hasLinkProvider(element) {
  let {
    parentNode
  } = element;
  while (parentNode) {
    if (LINK_PROVIDERS.has(parentNode)) {
      return true;
    }
    parentNode = parentNode.parentNode;
  }
  return false;
}
function isLinkProvider(element) {
  return LINK_PROVIDERS.has(element);
}
function registerLinkProvider(element, providerFn) {
  let listeners = LINK_PROVIDERS.get(element);
  if (listeners === undefined) {
    listeners = new Set();
    LINK_PROVIDERS.set(element, listeners);
  }
  listeners.add(providerFn);
  element.addEventListener(GET_LINK_INFO_EVENT, providerFn);
}
function unregisterLinkProvider(element, providerFn) {
  const listeners = LINK_PROVIDERS.get(element);
  if (listeners) {
    listeners.delete(providerFn);
    if (!listeners.size) {
      LINK_PROVIDERS.delete(element);
    }
  }
  element.removeEventListener(GET_LINK_INFO_EVENT, providerFn);
}
function getLinkInfo(element, stateRef) {
  return new Promise((resolve, reject) => {
    const getLinkInfoEvent = new CustomEvent(GET_LINK_INFO_EVENT, {
      detail: {
        stateRef,
        callback: (err, linkInfo) => {
          if (err) {
            reject(err);
          } else {
            resolve(linkInfo);
          }
        }
      },
      bubbles: true,
      composed: true,
      cancelable: true
    });
    element.dispatchEvent(getLinkInfoEvent);
  });
}
function updateRawLinkInfo(element, {
  url,
  target
}) {
  if (url === null || url === undefined) {
    console.error('url must be specified');
  }
  if (!import.meta.env.SSR && shouldDispatchToApp(target, formFactor)) {
    return getLinkInfo(element, {
      stateType: urlTypes.standard,
      attributes: {
        url,
        target
      }
    });
  }
  return new Promise(resolve => {
    resolve(new LinkInfo(url, () => {}));
  });
}

export { LinkInfo, getLinkInfo, hasLinkProvider, isLinkProvider, registerLinkProvider, unregisterLinkProvider, updateRawLinkInfo, urlTypes };