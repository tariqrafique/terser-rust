import locale from '@salesforce/i18n/locale';

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function assert(condition, message) {}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

class EventEmitter {
  constructor() {
    this.registry = {};
  }
  on(name, listener) {
    this.registry[name] = this.registry[name] || [];
    this.registry[name].push(listener);
    return this;
  }
  once(name, listener) {
    const doOnce = function () {
      listener.apply(null, arguments);
      this.removeListener(name, doOnce);
    }.bind(this);
    this.on(name, doOnce);
    return this;
  }
  emit(name) {
    const args = Array.prototype.slice.call(arguments, 1);
    const listeners = this.registry[name];
    let count = 0;
    if (listeners) {
      listeners.forEach(listener => {
        count += 1;
        listener.apply(null, args);
      });
    }
    return count > 0;
  }
  removeListener(name, listener) {
    const listeners = this.registry[name];
    if (listeners) {
      for (let i = 0, len = listeners.length; i < len; i += 1) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1);
          return this;
        }
      }
    }
    return this;
  }
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const NA_PHONE_NUMBER = '($1) $2-$3';
const IS_TEN_DIGITS = /^\d{10}$/;
const TEN_TO_NA = /(\d{3})(\d{3})(\d{4})/;
const IS_ELEVEN_DIGITS = /^1\d{10}/;
const ELEVEN_TO_NA = /1(\d{3})(\d{3})(\d{4})$/;
function toNorthAmericanPhoneNumber(value, userLocale) {
  if (!isNorthAmericanCountry(userLocale || locale)) {
    return value;
  }
  if (IS_TEN_DIGITS.test(value)) {
    return value.replace(TEN_TO_NA, NA_PHONE_NUMBER);
  } else if (IS_ELEVEN_DIGITS.test(value)) {
    return value.replace(ELEVEN_TO_NA, NA_PHONE_NUMBER);
  }
  return value || '';
}
function isNorthAmericanCountry(userLocale) {
  const localeCountry = getLocaleCountry(userLocale);
  if (localeCountry === 'US' || localeCountry === 'CA') {
    return true;
  }
  return false;
}
function getLocaleCountry(userLocale) {
  if (!userLocale) {
    return null;
  }
  const [, country] = userLocale.split('-');
  return country;
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const urlRegexString = "((?:(?:https?|ftp):\\/\\/(?:[\\w\\-\\|=%~#\\/+*@\\.,;:\\?!']|&){0,2047}(?:[\\(\\)\\.\\w=\\/+#-]*)[^\\s()\\.<>,;\\[\\]`'\"])|(?:\\b(?:[a-z0-9](?:[-a-z0-9]{0,62}[a-z0-9])?\\.)+(?:AC|AD|AE|AERO|AF|AG|AI|AL|AM|AN|AO|AQ|AR|ARPA|AS|ASIA|AT|AU|AW|AX|AZ|BA|BB|BD|BE|BF|BG|BH|BI|BIZ|BJ|BM|BN|BO|BR|BS|BT|BV|BW|BY|BZ|CA|CAT|CC|CD|CF|CG|CH|CI|CK|CL|CM|CN|CO|COM|COOP|CR|CU|CV|CX|CY|CZ|DE|DJ|DK|DM|DO|DZ|EC|EDU|EE|EG|ER|ES|ET|EU|FI|FJ|FK|FM|FO|FR|GA|GB|GD|GE|GF|GG|GH|GI|GL|GM|GN|GOV|GP|GQ|GR|GS|GT|GU|GW|GY|HK|HM|HN|HR|HT|HU|ID|IE|IL|IM|IN|INFO|INT|IO|IQ|IR|IS|IT|JE|JM|JO|JOBS|JP|KE|KG|KH|KI|KM|KN|KP|KR|KW|KY|KZ|LA|LB|LC|LI|LK|LR|LS|LT|LU|LV|LY|MA|MC|MD|ME|MG|MH|MIL|MK|ML|MM|MN|MO|MOBI|MP|MQ|MR|MS|MT|MU|MUSEUM|MV|MW|MX|MY|MZ|NA|NAME|NC|NE|NET|NF|NG|NI|NL|NO|NP|NR|NU|NZ|OM|ORG|PA|PE|PF|PG|PH|PK|PL|PM|PN|PR|PRO|PS|PT|PW|PY|QA|RE|RO|RS|RU|RW|SA|SB|SC|SD|SE|SG|SH|SI|SJ|SK|SL|SM|SN|SO|SR|ST|SU|SV|SY|SZ|TC|TD|TEL|TF|TG|TH|TJ|TK|TL|TM|TN|TO|TP|TR|TRAVEL|TT|TV|TW|TZ|UA|UG|UK|US|UY|UZ|VA|VC|VE|VG|VI|VN|VU|WF|WS|XN--0ZWM56D|XN--11B5BS3A9AJ6G|XN--80AKHBYKNJ4F|XN--9T4B11YI5A|XN--DEBA0AD|XN--FIQS8S|XN--FIQZ9S|XN--G6W251D|XN--HGBK6AJ7F53BBA|XN--HLCJ6AYA9ESC7A|XN--J6W193G|XN--JXALPDLP|XN--KGBECHTV|XN--KPRW13D|XN--KPRY57D|XN--MGBAAM7A8H|XN--MGBERP4A5D4AR|XN--P1AI|XN--WGBH1C|XN--ZCKZAH|YE|YT|ZA|ZM|ZW)(?!@(?:[a-z0-9](?:[-a-z0-9]{0,62}[a-z0-9])?\\.)+(?:AC|AD|AE|AERO|AF|AG|AI|AL|AM|AN|AO|AQ|AR|ARPA|AS|ASIA|AT|AU|AW|AX|AZ|BA|BB|BD|BE|BF|BG|BH|BI|BIZ|BJ|BM|BN|BO|BR|BS|BT|BV|BW|BY|BZ|CA|CAT|CC|CD|CF|CG|CH|CI|CK|CL|CM|CN|CO|COM|COOP|CR|CU|CV|CX|CY|CZ|DE|DJ|DK|DM|DO|DZ|EC|EDU|EE|EG|ER|ES|ET|EU|FI|FJ|FK|FM|FO|FR|GA|GB|GD|GE|GF|GG|GH|GI|GL|GM|GN|GOV|GP|GQ|GR|GS|GT|GU|GW|GY|HK|HM|HN|HR|HT|HU|ID|IE|IL|IM|IN|INFO|INT|IO|IQ|IR|IS|IT|JE|JM|JO|JOBS|JP|KE|KG|KH|KI|KM|KN|KP|KR|KW|KY|KZ|LA|LB|LC|LI|LK|LR|LS|LT|LU|LV|LY|MA|MC|MD|ME|MG|MH|MIL|MK|ML|MM|MN|MO|MOBI|MP|MQ|MR|MS|MT|MU|MUSEUM|MV|MW|MX|MY|MZ|NA|NAME|NC|NE|NET|NF|NG|NI|NL|NO|NP|NR|NU|NZ|OM|ORG|PA|PE|PF|PG|PH|PK|PL|PM|PN|PR|PRO|PS|PT|PW|PY|QA|RE|RO|RS|RU|RW|SA|SB|SC|SD|SE|SG|SH|SI|SJ|SK|SL|SM|SN|SO|SR|ST|SU|SV|SY|SZ|TC|TD|TEL|TF|TG|TH|TJ|TK|TL|TM|TN|TO|TP|TR|TRAVEL|TT|TV|TW|TZ|UA|UG|UK|US|UY|UZ|VA|VC|VE|VG|VI|VN|VU|WF|WS|XN--0ZWM56D|XN--11B5BS3A9AJ6G|XN--80AKHBYKNJ4F|XN--9T4B11YI5A|XN--DEBA0AD|XN--FIQS8S|XN--FIQZ9S|XN--G6W251D|XN--HGBK6AJ7F53BBA|XN--HLCJ6AYA9ESC7A|XN--J6W193G|XN--JXALPDLP|XN--KGBECHTV|XN--KPRW13D|XN--KPRY57D|XN--MGBAAM7A8H|XN--MGBERP4A5D4AR|XN--P1AI|XN--WGBH1C|XN--ZCKZAH|YE|YT|ZA|ZM|ZW))(?:/[\\w\\-=?/.&;:%~,+@#*]{0,2048}(?:[\\w=/+#-]|\\([^\\s()]*\\)))?(?:$|(?=\\.$)|(?=\\.\\s)|(?=[^\\w\\.]))))";
const emailRegexString = '([\\w-\\.\\+_]{1,64}@(?:[\\w-]){1,255}(?:\\.[\\w-]{1,255}){1,10})';
const newLineRegexString = '(\r\n|\r|\n)';
const tagRegexString = '(<a[\\s]+[^>]+[^/]>[\\s\\S]*?</a>|<a[\\s]+[^>]+/>|' + '<i?frame[\\s]+[^>]+[^/]>[\\s\\S]*?</i?frame>|<i?frame[\\s]+[^>]+/>|' + '<area[\\s]+[^>]+[^/]>[\\s\\S]*?</area>|<area[\\s]+[^>]+/>|' + '<link[\\s]+[^>]+[^/]>[\\s\\S]*?</link>|<link[\\s]+[^>]+/>|' + '<img[\\s]+[^>]+[^/]>[\\s\\S]*?</img>|<img[\\s]+[^>]+>|' + '<form[\\s]+[^>]+[^/]>[\\s\\S]*?</form>|<form[\\s]+[^>]+/>|' + '<body[\\s]+[^>]+[^/]>[\\s\\S]*?</body>|<body[\\s]+[^>]+/>|' + '<head[\\s]+[^>]+[^/]>[\\s\\S]*?</head>|<head[\\s]+[^>]+/>|' + '<input[\\s]+[^>]+[^/]>[\\s\\S]*?</input>|<input[\\s]+[^>]+/>|' + '<button[\\s]+[^>]+[^/]>[\\s\\S]*?</button>|<button[\\s]+[^>]+/>|' + '<blockquote[\\s]+[^>]+[^/]>[\\s\\S]*?</blockquote>|<blockquote[\\s]+[^>]+/>|' + '<q[\\s]+[^>]+[^/]>[\\s\\S]*?</q>|<q[\\s]+[^>]+/>|' + '<del[\\s]+[^>]+[^/]>[\\s\\S]*?</del>|<del[\\s]+[^>]+/>|' + '<ins[\\s]+[^>]+[^/]>[\\s\\S]*?</ins>|<ins[\\s]+[^>]+/>)';
const createHttpHref = function (url) {
  let href = url;
  if (url.toLowerCase().lastIndexOf('http', 0) !== 0 && url.toLowerCase().lastIndexOf('ftp', 0) !== 0) {
    href = `http://${href}`;
  }
  return href;
};
const createEmailHref = function (email) {
  return `mailto:${email}`;
};

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function deepCopy(obj) {
  if (Object(obj) !== obj) {
    return obj;
  }
  if (obj instanceof Set) {
    return new Set(obj);
  }
  if (obj instanceof Date) {
    return new Date(obj);
  }
  if (typeof obj === 'function') {
    return obj.bind({});
  }
  if (Array.isArray(obj)) {
    const obj2 = [];
    const len = obj.length;
    for (let i = 0; i < len; i++) {
      obj2.push(deepCopy(obj[i]));
    }
    return obj2;
  }
  const result = Object.create({});
  let keys = Object.keys(obj);
  if (obj instanceof Error) {
    keys = Object.getOwnPropertyNames(obj);
  }
  const len = keys.length;
  for (let i = 0; i < len; i++) {
    const key = keys[i];
    result[key] = deepCopy(obj[key]);
  }
  return result;
}
function arraysEqual(array1, array2) {
  if (!array1 || !array2) {
    return false;
  }
  if (array1.length !== array2.length) {
    return false;
  }
  for (let index = 0; index < array1.length; index++) {
    if (array1[index] instanceof Array && array2[index] instanceof Array) {
      if (!arraysEqual(array1[index], array2[index])) {
        return false;
      }
    } else if (array1[index] !== array2[index]) {
      return false;
    }
  }
  return true;
}
const ArraySlice = Array.prototype.slice;

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function classListMutation(classList, config) {
  Object.keys(config).forEach(key => {
    if (typeof key === 'string' && key.length) {
      if (config[key]) {
        classList.add(key);
      } else {
        classList.remove(key);
      }
    }
  });
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function normalizeString(value, config = {}) {
  const {
    fallbackValue = '',
    validValues,
    toLowerCase = true
  } = config;
  let normalized = typeof value === 'string' && value.trim() || '';
  normalized = toLowerCase ? normalized.toLowerCase() : normalized;
  if (validValues && validValues.indexOf(normalized) === -1) {
    normalized = fallbackValue;
  }
  return normalized;
}
function normalizeBoolean(value) {
  return typeof value === 'string' || !!value;
}
function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  return [];
}
function normalizeAriaAttribute(value) {
  let arias = Array.isArray(value) ? value : [value];
  arias = arias.map(ariaValue => {
    if (typeof ariaValue === 'string') {
      return ariaValue.replace(/\s+/g, ' ').trim();
    }
    return '';
  }).filter(ariaValue => !!ariaValue);
  return arias.length > 0 ? arias.join(' ') : null;
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const keyCodes = {
  tab: 9,
  backspace: 8,
  enter: 13,
  escape: 27,
  space: 32,
  pageup: 33,
  pagedown: 34,
  end: 35,
  home: 36,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  delete: 46,
  shift: 16
};
function normalizeKeyValue(value) {
  switch (value) {
    case 'Spacebar':
      return ' ';
    case 'Esc':
      return 'Escape';
    case 'Del':
      return 'Delete';
    case 'Left':
      return 'ArrowLeft';
    case 'Right':
      return 'ArrowRight';
    case 'Down':
      return 'ArrowDown';
    case 'Up':
      return 'ArrowUp';
    default:
      return value;
  }
}
const buffer = {};
function isShiftMetaOrControlKey(event) {
  return event.shiftKey || event.metaKey || event.ctrlKey;
}
function runActionOnBufferedTypedCharacters(event, action) {
  const letter = event.key;
  if (letter.length > 1) {
    return;
  }
  if (buffer._clearBufferId) {
    clearTimeout(buffer._clearBufferId);
  }
  buffer._keyBuffer = buffer._keyBuffer || [];
  buffer._keyBuffer.push(letter);
  const matchText = buffer._keyBuffer.join('').toLowerCase();
  action(matchText);

  // eslint-disable-next-line @lwc/lwc/no-async-operation
  buffer._clearBufferId = setTimeout(() => {
    buffer._keyBuffer = [];
  }, 700);
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function raf(fn) {
  let ticking = false;
  return function (event) {
    if (!ticking) {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      requestAnimationFrame(() => {
        fn.call(this, event);
        ticking = false;
      });
    }
    ticking = true;
  };
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const isIE11 = isIE11Test(navigator);
const isChrome = isChromeTest(navigator);
const isSafari = isSafariTest(navigator);
function isIE11Test(navigator) {
  return /Trident.*rv[ :]*11\./.test(navigator.userAgent);
}
function isChromeTest(navigator) {
  return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}
function isSafariTest(navigator) {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function smartSetAttribute(element, attribute, value) {
  if (element.tagName.match(/^C/i)) {
    attribute = attribute.replace(/-\w/g, m => m[1].toUpperCase());
    element[attribute] = value ? value : null;
  } else if (value) {
    element.setAttribute(attribute, value);
  } else {
    element.removeAttribute(attribute);
  }
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const CONTENT_SEPARATOR = '\n';
function getAttr(elm, attr) {
  if (elm.tagName.match(/lightning/i)) {
    return elm[attr];
  }
  return elm.getAttribute(attr);
}
function extractElements(root, selector) {
  if (typeof selector !== 'string' || selector === '') {
    return [];
  }
  return [].slice.call(root.querySelectorAll(selector));
}
function extractContent(elements) {
  return elements.map(element => element.textContent).filter(text => text.length).join(CONTENT_SEPARATOR);
}
function splitIds(ids) {
  return (ids + '').trim().split(/\s+/);
}
function hashIds(ids) {
  return (ids + '').trim().split(/\s+/).reduce((r, v) => {
    r[v] = 1;
    return r;
  }, {});
}
function addAriaRefWhenNeeded(elm, attrName, computedIds) {
  const newIds = splitIds(computedIds);
  const oldIds = getAttr(elm, attrName) || '';
  const oldIdsHash = hashIds(oldIds);
  const suffix = [];
  for (let i = 0; i < newIds.length; i += 1) {
    if (!oldIdsHash[newIds[i]]) {
      suffix.push(newIds[i]);
    }
  }
  if (suffix.length !== 0) {
    smartSetAttribute(elm, attrName, oldIds + (oldIds.length === 0 ? '' : ' ') + suffix.join(' '));
  }
}
function removeAriaRefWhenPossible(elm, attrName, computedIds) {
  const newIds = splitIds(computedIds);
  const oldIds = getAttr(elm, attrName) || '';
  const oldIdsHash = hashIds(oldIds);
  const newValues = [];
  for (let i = 0; i < newIds.length; i += 1) {
    if (!oldIdsHash[newIds[i]]) {
      newValues.push(newIds[i]);
    }
  }
  smartSetAttribute(elm, attrName, newValues.join(' '));
}
class ContentMutation {
  constructor(component) {
    this.component = component;
    this.template = component.template;
    this.isNative = this.template.constructor.toString().match(/\[native code\]/);
    this.state = {};
    this.liveIds = {};
    this.guid = guid();
  }
  connectLiveIdRef(refs, callback) {
    const selector = (refs + '').trim().split(/\s+/).map(ref => `[id*="${ref}"]`).join(',');
    const liveId = {
      selector,
      callback
    };
    this.liveIds[refs] = liveId;
  }
  link(innerSelector, attrName, ids, placeholderContainerSelector) {
    let attrState = this.state[attrName];
    if (attrState) {
      if (!this.isNative) {
        const elm = this.template.querySelector(innerSelector);
        if (elm) {
          removeAriaRefWhenPossible(elm, attrName, attrState.ids);
        }
        attrState.ids = ids;
      }
    } else {
      attrState = this.state[attrName] = {
        ids,
        innerSelector,
        placeholderContainerSelector
      };
    }
    if (this.isNative) {
      attrState.outerSelector = (ids + '').trim().split(/\s+/).map(ref => `#${ref}`).join(',');
      attrState.placeholder = document.createElement('span');
      attrState.placeholder.id = `auto-link-${attrName}-${this.guid}`;
    }
    if (this.component.isConnected) {
      this.privateUpdate(attrName);
    }
  }
  sync() {
    if (!this.component.isConnected) {
      throw new Error(`Invalid sync invocation. It can only be invoked during renderedCallback().`);
    }
    if (this.isNative && !this.mo) {
      this.privateConnect();
    }
    for (const attrName in this.state) {
      if (Object.prototype.hasOwnProperty.call(this.state, attrName)) {
        this.privateUpdate(attrName);
      }
    }
    if (!this.isNative) {
      this.privateUpdateLiveIds();
    }
  }
  privateExtractIds(elements) {
    return elements.map(el => {
      return el.getAttribute('id');
    }).join(' ');
  }
  privateUpdateLiveIds() {
    const root = this.template.host.getRootNode();
    if (!root) {
      return;
    }
    for (const liveId in this.liveIds) {
      if (Object.prototype.hasOwnProperty.call(this.liveIds, liveId)) {
        const thisId = this.liveIds[liveId];
        if (!thisId.elements) {
          thisId.elements = Array.prototype.slice.call(root.querySelectorAll(thisId.selector));
        }
        const newIds = this.privateExtractIds(thisId.elements);
        if (newIds !== thisId.ids) {
          thisId.callback(newIds);
          thisId.ids = newIds;
        }
      }
    }
  }
  privateUpdate(attrName) {
    const {
      innerSelector
    } = this.state[attrName];
    const elm = this.template.querySelector(innerSelector);
    if (!elm) {
      return;
    }
    let computedIds;
    if (this.isNative) {
      const {
        outerSelector,
        content,
        placeholder,
        placeholderContainerSelector
      } = this.state[attrName];
      const newContent = extractContent(extractElements(this.root, outerSelector));
      if (content !== newContent) {
        this.state[attrName].content = placeholder.textContent = newContent;
      }
      if (!placeholder.parentNode) {
        const container = this.template.querySelector(placeholderContainerSelector);
        if (container) {
          container.appendChild(placeholder);
        }
      }
      computedIds = placeholder.id;
    } else {
      computedIds = this.state[attrName].ids;
    }
    addAriaRefWhenNeeded(elm, attrName, computedIds);
  }
  privateConnect() {
    this.root = this.template.host.getRootNode();
    const mo = new MutationObserver(() => {
      if (!this.component.isConnected) {
        return;
      }
      this.sync();
    });
    mo.observe(this.root, {
      characterData: true,
      childList: true,
      subtree: true
    });
  }
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const POSITION_CHANGE_THRESHOLD = 5;
function observePosition(target, threshold = POSITION_CHANGE_THRESHOLD, originalRect, callback) {
  const newBoundingRect = target.getBoundingClientRect();
  const newLeft = newBoundingRect.left;
  const newTop = newBoundingRect.top;
  const oldLeft = originalRect.left;
  const oldTop = originalRect.top;
  const horizontalShiftDelta = Math.abs(newLeft - oldLeft);
  const verticalShiftDelta = Math.abs(newTop - oldTop);
  if (horizontalShiftDelta >= threshold || verticalShiftDelta >= threshold) {
    callback();
  }
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const ALLOWED_DOMAINS = new Set(['www.youtube.com', 'player.vimeo.com', 'play.vidyard.com', 'players.brightcove.net', 'bcove.video', 'player.cloudinary.com', 'fast.wistia.net', 'i1.adis.ws', 's1.adis.ws', 'scormanywhere.secure.force.com', 'appiniummastertrial.secure.force.com']);
function hasOnlyAllowedVideoIframes(htmlString) {
  if (htmlString && htmlString.indexOf('<iframe') > -1) {
    const parsedHtml = new DOMParser().parseFromString(htmlString, 'text/html');
    const iframesList = Array.prototype.slice.call(parsedHtml.querySelectorAll('iframe'));
    return iframesList.length > 0 && !iframesList.some(iframe => !isUrlAllowed(iframe.src));
  }
  return false;
}
function isUrlAllowed(url) {
  const anchor = document.createElement('a');
  anchor.href = url;
  return anchor.protocol === 'https:' && ALLOWED_DOMAINS.has(anchor.hostname);
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const linkRegex = new RegExp(`(${newLineRegexString})|${urlRegexString}|${emailRegexString}`, 'gi');
const linkRegexNoNewLine = new RegExp(`${urlRegexString}|${emailRegexString}`, 'gi');
const emailRegex = new RegExp(emailRegexString, 'gi');
const newLineRegex = new RegExp(newLineRegexString, 'gi');
function getTextPart(text) {
  return {
    isText: true,
    value: text
  };
}
function getUrlPart(url, index) {
  return {
    isLink: true,
    value: url,
    href: createHttpHref(url),
    key: `${url}-${index}`
  };
}
function getEmailPart(email, index) {
  return {
    isLink: true,
    value: email,
    href: createEmailHref(email),
    key: `${email}-${index}`
  };
}
function getNewlinePart(index) {
  return {
    isNewline: true,
    key: index
  };
}
function getLinkPart(link, index, ignoreNewLines) {
  if (!ignoreNewLines && link.match(newLineRegex)) {
    return getNewlinePart(index);
  } else if (link.match(emailRegex)) {
    return getEmailPart(link, index);
  }
  return getUrlPart(link, index);
}
function parseToFormattedLinkifiedParts(text, ignoreNewLines = false) {
  const parts = [];
  const re = ignoreNewLines ? linkRegexNoNewLine : linkRegex;
  let match;
  let index = 0;
  while ((match = re.exec(text)) !== null) {
    let link = match[0];
    const endsWithQuote = link && link.endsWith('&quot');
    if (match.index > 0) {
      parts.push(getTextPart(text.slice(0, match.index)));
    }
    if (endsWithQuote) {
      link = link.slice(0, link.lastIndexOf('&quot'));
    }
    parts.push(getLinkPart(link, index, ignoreNewLines));
    if (endsWithQuote) {
      parts.push(getTextPart('&quot'));
    }
    text = text.substring(re.lastIndex);
    re.lastIndex = 0;
    index = index + 1;
  }
  if (text != null && text !== '') {
    parts.push(getTextPart(text));
  }
  return parts;
}
function parseToFormattedParts(text) {
  return text.split(newLineRegex).map((part, index) => {
    return index % 2 === 0 ? getTextPart(part) : getNewlinePart();
  });
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function synchronizeAttrs(element, values) {
  if (!element) {
    return;
  }
  const attributes = Object.keys(values);
  attributes.forEach(attribute => {
    smartSetAttribute(element, attribute, values[attribute]);
  });
}
function getRealDOMId(el) {
  if (el && typeof el === 'string') {
    return el;
  } else if (el) {
    return el.getAttribute('id');
  }
  return null;
}
const URL_CHECK_REGEX = /^(\/+|\.+|ftp|http(s?):\/\/)/i;
function isAbsoluteUrl(url) {
  return URL_CHECK_REGEX.test(url);
}
function getShadowActiveElement() {
  let activeElement = document.activeElement;
  while (activeElement.shadowRoot && activeElement.shadowRoot.activeElement) {
    activeElement = activeElement.shadowRoot.activeElement;
  }
  return activeElement;
}
function getShadowActiveElements() {
  let activeElement = document.activeElement;
  const shadowActiveElements = [];
  while (activeElement && activeElement.shadowRoot && activeElement.shadowRoot.activeElement) {
    shadowActiveElements.push(activeElement);
    activeElement = activeElement.shadowRoot.activeElement;
  }
  if (activeElement) {
    shadowActiveElements.push(activeElement);
  }
  return shadowActiveElements;
}
function isRTL() {
  return document.dir === 'rtl';
}
function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}
function isNotUndefinedOrNull(value) {
  return !isUndefinedOrNull(value);
}
const DEFAULT_ZINDEX_BASELINE = 9000;
function getZIndexBaseline() {
  const value = (window.getComputedStyle(document.documentElement) || document.documentElement.style).getPropertyValue('--lwc-zIndexModal');
  const base = parseInt(value, 10);
  return isNaN(base) ? DEFAULT_ZINDEX_BASELINE : base;
}
function timeout(interval) {
  return new Promise(resolve => {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(resolve, interval);
  });
}
function animationFrame() {
  return new Promise(resolve => {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    window.requestAnimationFrame(resolve);
  });
}
function decorateInputForDragon(element) {}
function setDecoratedDragonInputValueWithoutEvent(element, value) {
  element.value = value;
  return value;
}
function escapeHTML(html) {
  return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export { ArraySlice, ContentMutation, EventEmitter, animationFrame, arraysEqual, assert, classListMutation, createEmailHref, createHttpHref, decorateInputForDragon, deepCopy, emailRegexString, escapeHTML, getRealDOMId, getShadowActiveElement, getShadowActiveElements, getZIndexBaseline, guid, hasOnlyAllowedVideoIframes, isAbsoluteUrl, isChrome, isIE11, isNotUndefinedOrNull, isRTL, isSafari, isShiftMetaOrControlKey, isUndefinedOrNull, keyCodes, newLineRegexString, normalizeAriaAttribute, normalizeArray, normalizeBoolean, normalizeKeyValue, normalizeString, observePosition, parseToFormattedLinkifiedParts, parseToFormattedParts, raf, runActionOnBufferedTypedCharacters, setDecoratedDragonInputValueWithoutEvent, synchronizeAttrs, tagRegexString, timeout, toNorthAmericanPhoneNumber, urlRegexString };