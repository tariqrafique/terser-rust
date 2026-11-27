var _tmpl = void 0;

/**
 * Copyright (c) 2026 Salesforce, Inc.
 */
/**
 * Copyright (c) 2026 Salesforce, Inc.
 */
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 *
 * @param value
 * @param msg
 */
function invariant(value, msg) {
  if (!value) {
    throw new Error(`Invariant Violation: ${msg}`);
  }
}
/**
 *
 * @param value
 * @param msg
 */
function isTrue$1(value, msg) {
  if (!value) {
    throw new Error(`Assert Violation: ${msg}`);
  }
}
/**
 *
 * @param value
 * @param msg
 */
function isFalse$1(value, msg) {
  if (value) {
    throw new Error(`Assert Violation: ${msg}`);
  }
}
/**
 *
 * @param msg
 */
function fail(msg) {
  throw new Error(msg);
}
var assert = /*#__PURE__*/Object.freeze({
  __proto__: null,
  fail: fail,
  invariant: invariant,
  isFalse: isFalse$1,
  isTrue: isTrue$1
});

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const {
  /** Detached {@linkcode Object.assign}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign MDN Reference}. */
  assign,
  /** Detached {@linkcode Object.create}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create MDN Reference}. */
  create,
  /** Detached {@linkcode Object.defineProperties}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties MDN Reference}. */
  defineProperties,
  /** Detached {@linkcode Object.defineProperty}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty MDN Reference}. */
  defineProperty,
  /** Detached {@linkcode Object.entries}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries MDN Reference}. */
  entries,
  /** Detached {@linkcode Object.freeze}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze MDN Reference}. */
  freeze,
  /** Detached {@linkcode Object.getOwnPropertyDescriptor}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor MDN Reference}. */
  getOwnPropertyDescriptor: getOwnPropertyDescriptor$1,
  /** Detached {@linkcode Object.getOwnPropertyDescriptors}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors MDN Reference}. */
  getOwnPropertyDescriptors,
  /** Detached {@linkcode Object.getOwnPropertyNames}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames MDN Reference}. */
  getOwnPropertyNames: getOwnPropertyNames$1,
  /** Detached {@linkcode Object.getPrototypeOf}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf MDN Reference}. */
  getPrototypeOf: getPrototypeOf$1,
  /** Detached {@linkcode Object.hasOwnProperty}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty MDN Reference}. */
  hasOwnProperty: hasOwnProperty$1,
  /** Detached {@linkcode Object.isFrozen}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen MDN Reference}. */
  isFrozen,
  /** Detached {@linkcode Object.keys}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys MDN Reference}. */
  keys,
  /** Detached {@linkcode Object.seal}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal MDN Reference}. */
  seal,
  /** Detached {@linkcode Object.setPrototypeOf}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf MDN Reference}. */
  setPrototypeOf
} = Object;
const {
  /** Detached {@linkcode Array.isArray}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray MDN Reference}. */
  isArray: isArray$1,
  /** Detached {@linkcode Array.from}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from MDN Reference}. */
  from: ArrayFrom
} = Array;
// For some reason, JSDoc don't get picked up for multiple renamed destructured constants (even
// though it works fine for one, e.g. isArray), so comments for these are added to the export
// statement, rather than this declaration.
const {
  copyWithin: ArrayCopyWithin,
  fill: ArrayFill,
  filter: ArrayFilter,
  indexOf: ArrayIndexOf,
  join: ArrayJoin,
  map: ArrayMap,
  pop: ArrayPop,
  push: ArrayPush$1,
  reverse: ArrayReverse,
  shift: ArrayShift,
  slice: ArraySlice,
  some: ArraySome,
  sort: ArraySort,
  splice: ArraySplice,
  unshift: ArrayUnshift,
  forEach // Weird anomaly!
} = Array.prototype;
/** Detached {@linkcode String.fromCharCode}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode MDN Reference}. */
const {
  fromCharCode: StringFromCharCode
} = String;
// No JSDocs here - see comment for Array.prototype
const {
  charAt: StringCharAt,
  charCodeAt: StringCharCodeAt,
  replace: StringReplace,
  split: StringSplit,
  slice: StringSlice,
  toLowerCase: StringToLowerCase,
  trim: StringTrim
} = String.prototype;
/**
 * Determines whether the argument is `undefined`.
 * @param obj Value to test
 * @returns `true` if the value is `undefined`.
 */
function isUndefined$1(obj) {
  return obj === undefined;
}
/**
 * Determines whether the argument is `null`.
 * @param obj Value to test
 * @returns `true` if the value is `null`.
 */
function isNull(obj) {
  return obj === null;
}
/**
 * Determines whether the argument is `true`.
 * @param obj Value to test
 * @returns `true` if the value is `true`.
 */
function isTrue(obj) {
  return obj === true;
}
/**
 * Determines whether the argument is `false`.
 * @param obj Value to test
 * @returns `true` if the value is `false`.
 */
function isFalse(obj) {
  return obj === false;
}
/**
 * Determines whether the argument is a function.
 * @param obj Value to test
 * @returns `true` if the value is a function.
 */
// Replacing `Function` with a narrower type that works for all our use cases is tricky...
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function isFunction$1(obj) {
  return typeof obj === 'function';
}
/**
 * Determines whether the argument is an object or null.
 * @param obj Value to test
 * @returns `true` if the value is an object or null.
 */
function isObject(obj) {
  return typeof obj === 'object';
}
/**
 * Determines whether the argument is a string.
 * @param obj Value to test
 * @returns `true` if the value is a string.
 */
function isString(obj) {
  return typeof obj === 'string';
}
/**
 * Determines whether the argument is a number.
 * @param obj Value to test
 * @returns `true` if the value is a number.
 */
function isNumber(obj) {
  return typeof obj === 'number';
}
/** Does nothing! 🚀 */
function noop() {
  /* Do nothing */
}
const OtS = {}.toString;
/**
 * Converts the argument to a string, safely accounting for objects with "null" prototype.
 * Note that `toString(null)` returns `"[object Null]"` rather than `"null"`.
 * @param obj Value to convert to a string.
 * @returns String representation of the value.
 */
function toString(obj) {
  if (obj?.toString) {
    // Arrays might hold objects with "null" prototype So using
    // Array.prototype.toString directly will cause an error Iterate through
    // all the items and handle individually.
    if (isArray$1(obj)) {
      // This behavior is slightly different from Array#toString:
      // 1. Array#toString calls `this.join`, rather than Array#join
      // Ex: arr = []; arr.join = () => 1; arr.toString() === 1; toString(arr) === ''
      // 2. Array#toString delegates to Object#toString if `this.join` is not a function
      // Ex: arr = []; arr.join = 'no'; arr.toString() === '[object Array]; toString(arr) = ''
      // 3. Array#toString converts null/undefined to ''
      // Ex: arr = [null, undefined]; arr.toString() === ','; toString(arr) === '[object Null],undefined'
      // 4. Array#toString converts recursive references to arrays to ''
      // Ex: arr = [1]; arr.push(arr, 2); arr.toString() === '1,,2'; toString(arr) throws
      // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString
      return ArrayJoin.call(ArrayMap.call(obj, toString), ',');
    }
    return obj.toString();
  } else if (typeof obj === 'object') {
    // This catches null and returns "[object Null]". Weird, but kept for backwards compatibility.
    return OtS.call(obj);
  } else {
    return String(obj);
  }
}
/**
 * Gets the property descriptor for the given object and property key. Similar to
 * {@linkcode Object.getOwnPropertyDescriptor}, but looks up the prototype chain.
 * @param o Value to get the property descriptor for
 * @param p Property key to get the descriptor for
 * @returns The property descriptor for the given object and property key.
 */
function getPropertyDescriptor(o, p) {
  do {
    const d = getOwnPropertyDescriptor$1(o, p);
    if (!isUndefined$1(d)) {
      return d;
    }
    o = getPrototypeOf$1(o);
  } while (o !== null);
}

/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// These must be updated when the enum is updated.
// It's a bit annoying to do have to do this manually, but this makes the file tree-shakeable,
// passing the `verify-treeshakeable.js` test.
const allVersions = [58 /* APIVersion.V58_244_SUMMER_23 */, 59 /* APIVersion.V59_246_WINTER_24 */, 60 /* APIVersion.V60_248_SPRING_24 */, 61 /* APIVersion.V61_250_SUMMER_24 */, 62 /* APIVersion.V62_252_WINTER_25 */, 63 /* APIVersion.V63_254_SPRING_25 */, 64 /* APIVersion.V64_256_SUMMER_25 */, 65 /* APIVersion.V65_258_WINTER_26 */, 66 /* APIVersion.V66_260_SPRING_26 */];
const LOWEST_API_VERSION = allVersions[0];
/**
 * @param apiVersionFeature
 */
function minApiVersion(apiVersionFeature) {
  switch (apiVersionFeature) {
    case 0 /* APIFeature.LOWERCASE_SCOPE_TOKENS */:
    case 1 /* APIFeature.TREAT_ALL_PARSE5_ERRORS_AS_ERRORS */:
      return 59 /* APIVersion.V59_246_WINTER_24 */;
    case 3 /* APIFeature.DISABLE_OBJECT_REST_SPREAD_TRANSFORMATION */:
    case 4 /* APIFeature.SKIP_UNNECESSARY_REGISTER_DECORATORS */:
    case 5 /* APIFeature.USE_COMMENTS_FOR_FRAGMENT_BOOKENDS */:
    case 2 /* APIFeature.USE_FRAGMENTS_FOR_LIGHT_DOM_SLOTS */:
      return 60 /* APIVersion.V60_248_SPRING_24 */;
    case 7 /* APIFeature.ENABLE_ELEMENT_INTERNALS_AND_FACE */:
    case 6 /* APIFeature.USE_LIGHT_DOM_SLOT_FORWARDING */:
      return 61 /* APIVersion.V61_250_SUMMER_24 */;
    case 8 /* APIFeature.ENABLE_THIS_DOT_HOST_ELEMENT */:
    case 9 /* APIFeature.ENABLE_THIS_DOT_STYLE */:
    case 10 /* APIFeature.TEMPLATE_CLASS_NAME_OBJECT_BINDING */:
      return 62 /* APIVersion.V62_252_WINTER_25 */;
    case 11 /* APIFeature.ENABLE_COMPLEX_TEMPLATE_EXPRESSIONS */:
      return 66 /* APIVersion.V66_260_SPRING_26 */;
  }
}
/**
 *
 * @param apiVersionFeature
 * @param apiVersion
 */
function isAPIFeatureEnabled(apiVersionFeature, apiVersion) {
  return apiVersion >= minApiVersion(apiVersionFeature);
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * According to the following list, there are 48 aria attributes of which two (ariaDropEffect and
 * ariaGrabbed) are deprecated:
 * https://www.w3.org/TR/wai-aria-1.1/#x6-6-definitions-of-states-and-properties-all-aria-attributes
 *
 * The above list of 46 aria attributes is consistent with the following resources:
 * https://github.com/w3c/aria/pull/708/files#diff-eacf331f0ffc35d4b482f1d15a887d3bR11060
 * https://wicg.github.io/aom/spec/aria-reflection.html
 *
 * NOTE: If you update this list, please update test files that implicitly reference this list!
 * Searching the codebase for `aria-flowto` and `ariaFlowTo` should be good enough to find all usages.
 */
const AriaPropertyNames = ['ariaActiveDescendant', 'ariaAtomic', 'ariaAutoComplete', 'ariaBusy', 'ariaChecked', 'ariaColCount', 'ariaColIndex', 'ariaColIndexText', 'ariaColSpan', 'ariaControls', 'ariaCurrent', 'ariaDescribedBy', 'ariaDescription', 'ariaDetails', 'ariaDisabled', 'ariaErrorMessage', 'ariaExpanded', 'ariaFlowTo', 'ariaHasPopup', 'ariaHidden', 'ariaInvalid', 'ariaKeyShortcuts', 'ariaLabel', 'ariaLabelledBy', 'ariaLevel', 'ariaLive', 'ariaModal', 'ariaMultiLine', 'ariaMultiSelectable', 'ariaOrientation', 'ariaOwns', 'ariaPlaceholder', 'ariaPosInSet', 'ariaPressed', 'ariaReadOnly', 'ariaRelevant', 'ariaRequired', 'ariaRoleDescription', 'ariaRowCount', 'ariaRowIndex', 'ariaRowIndexText', 'ariaRowSpan', 'ariaSelected', 'ariaSetSize', 'ariaSort', 'ariaValueMax', 'ariaValueMin', 'ariaValueNow', 'ariaValueText', 'ariaBrailleLabel', 'ariaBrailleRoleDescription', 'role'];
const {
  AriaAttrNameToPropNameMap,
  AriaPropNameToAttrNameMap
} = /*@__PURE__*/(() => {
  const AriaAttrNameToPropNameMap = create(null);
  const AriaPropNameToAttrNameMap = create(null);
  // Synthetic creation of all AOM property descriptors for Custom Elements
  forEach.call(AriaPropertyNames, propName => {
    const attrName = StringToLowerCase.call(StringReplace.call(propName, /^aria/, () => 'aria-'));
    // These type assertions are because the map types are a 1:1 mapping of ariaX to aria-x.
    // TypeScript knows we have one of ariaX | ariaY and one of aria-x | aria-y, and tries to
    // prevent us from doing ariaX: aria-y, but we that it's safe.
    AriaAttrNameToPropNameMap[attrName] = propName;
    AriaPropNameToAttrNameMap[propName] = attrName;
  });
  return {
    AriaAttrNameToPropNameMap,
    AriaPropNameToAttrNameMap
  };
})();
// These attributes take either an ID or a list of IDs as values.
// This includes aria-* attributes as well as the special non-ARIA "for" attribute
const ID_REFERENCING_ATTRIBUTES_SET = /*@__PURE__*/new Set(['aria-activedescendant', 'aria-controls', 'aria-describedby', 'aria-details', 'aria-errormessage', 'aria-flowto', 'aria-labelledby', 'aria-owns', 'for', 'popovertarget']);

/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const ContextEventName = 'lightning:context-request';
let contextKeys;
function getContextKeys() {
  return contextKeys;
}
function isTrustedContext(target) {
  {
    // The runtime didn't set a trustedContext set
    // this check should only be performed for runtimes that care about filtering context participants to track
    return true;
  }
}

/*
 * Copyright (c) 2023, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const KEY__SHADOW_RESOLVER = '$shadowResolver$';
const KEY__SHADOW_STATIC = '$shadowStaticNode$';
const KEY__SHADOW_TOKEN = '$shadowToken$';
const KEY__SYNTHETIC_MODE = '$$lwc-synthetic-mode';
const KEY__SCOPED_CSS = '$scoped$';
const KEY__NATIVE_ONLY_CSS = '$nativeOnly$';
const KEY__NATIVE_GET_ELEMENT_BY_ID = '$nativeGetElementById$';
const KEY__NATIVE_QUERY_SELECTOR_ALL = '$nativeQuerySelectorAll$';
const XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';

/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const CAMEL_REGEX = /-([a-z])/g;
// These are HTML standard prop/attribute IDL mappings, but are not predictable based on camel/kebab-case conversion
const SPECIAL_PROPERTY_ATTRIBUTE_MAPPING = /*@__PURE__@*/new Map([['accessKey', 'accesskey'], ['readOnly', 'readonly'], ['tabIndex', 'tabindex'], ['bgColor', 'bgcolor'], ['colSpan', 'colspan'], ['rowSpan', 'rowspan'], ['contentEditable', 'contenteditable'], ['crossOrigin', 'crossorigin'], ['dateTime', 'datetime'], ['formAction', 'formaction'], ['isMap', 'ismap'], ['maxLength', 'maxlength'], ['minLength', 'minlength'], ['noValidate', 'novalidate'], ['useMap', 'usemap'], ['htmlFor', 'for']]);
// Global properties that this framework currently reflects. For CSR, the native
// descriptors for these properties are added from HTMLElement.prototype to
// LightningElement.prototype. For SSR, in order to match CSR behavior, this
// list is used to determine which attributes to reflect.
const REFLECTIVE_GLOBAL_PROPERTY_SET = /*@__PURE__@*/new Set(['accessKey', 'dir', 'draggable', 'hidden', 'id', 'lang', 'spellcheck', 'tabIndex', 'title']);
/**
 * Map associating previously transformed HTML property into HTML attribute.
 */
const CACHED_PROPERTY_ATTRIBUTE_MAPPING = /*@__PURE__@*/new Map();
/**
 *
 * @param propName
 */
function htmlPropertyToAttribute(propName) {
  const ariaAttributeName = AriaPropNameToAttrNameMap[propName];
  if (!isUndefined$1(ariaAttributeName)) {
    return ariaAttributeName;
  }
  const specialAttributeName = SPECIAL_PROPERTY_ATTRIBUTE_MAPPING.get(propName);
  if (!isUndefined$1(specialAttributeName)) {
    return specialAttributeName;
  }
  const cachedAttributeName = CACHED_PROPERTY_ATTRIBUTE_MAPPING.get(propName);
  if (!isUndefined$1(cachedAttributeName)) {
    return cachedAttributeName;
  }
  let attributeName = '';
  for (let i = 0, len = propName.length; i < len; i++) {
    const code = StringCharCodeAt.call(propName, i);
    if (code >= 65 &&
    // "A"
    code <= 90 // "Z"
    ) {
      attributeName += '-' + StringFromCharCode(code + 32);
    } else {
      attributeName += StringFromCharCode(code);
    }
  }
  CACHED_PROPERTY_ATTRIBUTE_MAPPING.set(propName, attributeName);
  return attributeName;
}
/**
 * Map associating previously transformed kabab-case attributes into camel-case props.
 */
const CACHED_KEBAB_CAMEL_MAPPING = /*@__PURE__@*/new Map();
/**
 *
 * @param attrName
 */
function kebabCaseToCamelCase(attrName) {
  let result = CACHED_KEBAB_CAMEL_MAPPING.get(attrName);
  if (isUndefined$1(result)) {
    result = StringReplace.call(attrName, CAMEL_REGEX, g => g[1].toUpperCase());
    CACHED_KEBAB_CAMEL_MAPPING.set(attrName, result);
  }
  return result;
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Increment whenever the LWC template compiler changes
const LWC_VERSION = "9.5.3";
const LWC_VERSION_COMMENT_REGEX = /\/\*LWC compiler v([\d.]+)\*\/\s*}/;

/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * [ncls] - Normalize class name attribute.
 *
 * Transforms the provided class property value from an object/string into a string the diffing algo
 * can operate on.
 *
 * This implementation is borrowed from Vue:
 * https://github.com/vuejs/core/blob/e790e1bdd7df7be39e14780529db86e4da47a3db/packages/shared/src/normalizeProp.ts#L63-L82
 */
function normalizeClass(value) {
  if (isUndefined$1(value) || isNull(value)) {
    // Returning undefined here improves initial render cost, because the old vnode's class will be considered
    // undefined in the `patchClassAttribute` routine, so `oldClass === newClass` will be true so we return early
    return undefined;
  }
  let res = '';
  if (isString(value)) {
    res = value;
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + ' ';
      }
    }
  } else if (isObject(value) && !isNull(value)) {
    // Iterate own enumerable keys of the object
    const _keys = keys(value);
    for (let i = 0; i < _keys.length; i += 1) {
      const key = _keys[i];
      if (value[key]) {
        res += key + ' ';
      }
    }
  }
  return StringTrim.call(res);
}
let sanitizeHtmlContentImpl = () => {
  // locker-service patches this function during runtime to sanitize HTML content.
  throw new Error('sanitizeHtmlContent hook must be implemented.');
};
/**
 * EXPERIMENTAL: This function acts like a hook for Lightning Locker Service and other similar
 * libraries to sanitize HTML content. This hook process the content passed via the template to
 * lwc:inner-html directive.
 * It is meant to be overridden via `setHooks`; it throws an error by default.
 */
const sanitizeHtmlContent = value => {
  return sanitizeHtmlContentImpl();
};
function maybeSanitizeHtmlContent(value) {
  return value;
}
function flattenStylesheets(stylesheets) {
  const list = [];
  for (const stylesheet of stylesheets) {
    if (!isArray$1(stylesheet)) {
      list.push(stylesheet);
    } else {
      list.push(...flattenStylesheets(stylesheet));
    }
  }
  return list;
}
function isTrustedSignal(target) {
  {
    return false;
  }
}
if (!globalThis.lwcRuntimeFlags) {
  Object.defineProperty(globalThis, 'lwcRuntimeFlags', {
    value: create(null)
  });
}
/**
 * Whether reporting is enabled.
 *
 * Note that this may seem redundant, given you can just check if the currentDispatcher is undefined,
 * but it turns out that Terser only strips out unused code if we use this explicit boolean.
 */
let enabled$1 = false;
/**
 * Report to the current dispatcher, if there is one.
 * @param reportingEventId
 * @param payload data to report
 */
function report(reportingEventId, payload) {
}
/**
 * Return true if reporting is enabled
 */
function isReportingEnabled() {
  return enabled$1;
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function getComponentTag(vm) {
  return `<${StringToLowerCase.call(vm.tagName)}>`;
}
// TODO [#1695]: Unify getComponentStack and getErrorComponentStack
function getComponentStack(vm) {
  const stack = [];
  let prefix = '';
  while (!isNull(vm.owner)) {
    ArrayPush$1.call(stack, prefix + getComponentTag(vm));
    vm = vm.owner;
    prefix += '\t';
  }
  return ArrayJoin.call(stack, '\n');
}
function getErrorComponentStack(vm) {
  const wcStack = [];
  let currentVm = vm;
  while (!isNull(currentVm)) {
    ArrayPush$1.call(wcStack, getComponentTag(currentVm));
    currentVm = currentVm.owner;
  }
  return wcStack.reverse().join('\n\t');
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function addErrorComponentStack(vm, error) {
  if (!isFrozen(error) && isUndefined$1(error.wcStack)) {
    const wcStack = getErrorComponentStack(vm);
    defineProperty(error, 'wcStack', {
      get() {
        return wcStack;
      }
    });
  }
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const alreadyLoggedMessages = new Set();
// Only used in LWC's integration tests
if (process.env.NODE_ENV === 'test-lwc-integration') {
  window.__lwcResetAlreadyLoggedMessages = () => {
    alreadyLoggedMessages.clear();
  };
}
function log(method, message, vm, once) {
  let msg = `[LWC ${method}]: ${message}`;
  if (!isUndefined$1(vm)) {
    msg = `${msg}\n${getComponentStack(vm)}`;
  }
  if (once) {
    if (alreadyLoggedMessages.has(msg)) {
      return;
    }
    alreadyLoggedMessages.add(msg);
  }
  // In Vitest tests, reduce the warning and error verbosity by not printing the callstack
  if (process.env.NODE_ENV === 'test') {
    /* eslint-disable-next-line no-console */
    console[method](msg);
    return;
  }
  try {
    throw new Error(msg);
  } catch (e) {
    /* eslint-disable-next-line no-console */
    console[method](e);
  }
}
function logError(message, vm) {
  log('error', message, vm, false);
}
function logWarn(message, vm) {
  log('warn', message, vm, false);
}
function logWarnOnce(message, vm) {
  log('warn', message, vm, true);
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
let nextTickCallbackQueue = [];
const SPACE_CHAR = 32;
const EmptyObject = seal(create(null));
const EmptyArray = seal([]);
function flushCallbackQueue() {
  if (process.env.NODE_ENV !== 'production') {
    if (nextTickCallbackQueue.length === 0) {
      throw new Error(`Internal Error: If callbackQueue is scheduled, it is because there must be at least one callback on this pending queue.`);
    }
  }
  const callbacks = nextTickCallbackQueue;
  nextTickCallbackQueue = []; // reset to a new queue
  for (let i = 0, len = callbacks.length; i < len; i += 1) {
    callbacks[i]();
  }
}
function addCallbackToNextTick(callback) {
  if (process.env.NODE_ENV !== 'production') {
    if (!isFunction$1(callback)) {
      throw new Error(`Internal Error: addCallbackToNextTick() can only accept a function callback`);
    }
  }
  if (nextTickCallbackQueue.length === 0) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Promise.resolve().then(flushCallbackQueue);
  }
  ArrayPush$1.call(nextTickCallbackQueue, callback);
}
// Throw an error if we're running in prod mode. Ensures code is truly removed from prod mode.
function assertNotProd() {
  /* istanbul ignore if */
  if (process.env.NODE_ENV === 'production') {
    // this method should never leak to prod
    throw new ReferenceError();
  }
}
function shouldBeFormAssociated(Ctor) {
  const ctorFormAssociated = Boolean(Ctor.formAssociated);
  const apiVersion = getComponentAPIVersion(Ctor);
  const apiFeatureEnabled = isAPIFeatureEnabled(7 /* APIFeature.ENABLE_ELEMENT_INTERNALS_AND_FACE */, apiVersion);
  if (process.env.NODE_ENV !== 'production' && ctorFormAssociated && !apiFeatureEnabled) {
    const tagName = getComponentRegisteredName(Ctor);
    logWarnOnce(`Component <${tagName}> set static formAssociated to true, but form ` + `association is not enabled because the API version is ${apiVersion}. To enable form association, ` + `update the LWC component API version to 61 or above. https://lwc.dev/guide/versioning`);
  }
  return ctorFormAssociated && apiFeatureEnabled;
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
//
// Do additional mutation tracking for DevTools performance profiling, in dev mode only.
//
const reactiveObserversToVMs = new WeakMap();
const targetsToPropertyKeys = new WeakMap();
let mutationLogs = [];
// Create a human-readable member access notation like `obj.foo` or `arr[1]`,
// handling edge cases like `obj[Symbol("bar")]` and `obj["spaces here"]`
function toPrettyMemberNotation(parent, child) {
  if (isUndefined$1(parent)) {
    // Bare prop, just stringify the child
    return toString(child);
  } else if (!isString(child)) {
    // Symbol/number, e.g. `obj[Symbol("foo")]` or `obj[1234]`
    return `${toString(parent)}[${toString(child)}]`;
  } else if (/^\w+$/.test(child)) {
    // Dot-notation-safe string, e.g. `obj.foo`
    return `${toString(parent)}.${child}`;
  } else {
    // Bracket-notation-requiring string, e.g. `obj["prop with spaces"]`
    return `${toString(parent)}[${JSON.stringify(child)}]`;
  }
}
/**
 * Flush all the logs we've written so far and return the current logs.
 */
function getAndFlushMutationLogs() {
  assertNotProd();
  const result = mutationLogs;
  mutationLogs = [];
  return result;
}
/**
 * Log a new mutation for this reactive observer.
 * @param reactiveObserver - relevant ReactiveObserver
 * @param target - target object that is being observed
 * @param key - key (property) that was mutated
 */
function logMutation(reactiveObserver, target, key) {
  assertNotProd();
  const parentKey = targetsToPropertyKeys.get(target);
  const vm = reactiveObserversToVMs.get(reactiveObserver);
  /* istanbul ignore if */
  if (isUndefined$1(vm)) {
    // VM should only be undefined in Vitest tests, where a reactive observer is not always associated with a VM
    // because the unit tests just create Reactive Observers on-the-fly.
    // Note we could explicitly target Vitest with `process.env.NODE_ENV === 'test'`, but then that would also
    // affect our downstream consumers' Jest/Vitest tests, and we don't want to throw an error just for a logger.
    if (process.env.NODE_ENV === 'test-lwc-integration') {
      throw new Error('The VM should always be defined except possibly in unit tests');
    }
  } else {
    const prop = toPrettyMemberNotation(parentKey, key);
    ArrayPush$1.call(mutationLogs, {
      vm,
      prop
    });
  }
}
/**
 * Flush logs associated with a given VM.
 * @param vm - given VM
 */
function flushMutationLogsForVM(vm) {
  assertNotProd();
  mutationLogs = ArrayFilter.call(mutationLogs, log => log.vm !== vm);
}
/**
 * Mark this ReactiveObserver as related to this VM. This is only needed for mutation tracking in dev mode.
 * @param reactiveObserver
 * @param vm
 */
function associateReactiveObserverWithVM(reactiveObserver, vm) {
  assertNotProd();
  reactiveObserversToVMs.set(reactiveObserver, vm);
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const TargetToReactiveRecordMap = new WeakMap();
function getReactiveRecord(target) {
  let reactiveRecord = TargetToReactiveRecordMap.get(target);
  if (isUndefined$1(reactiveRecord)) {
    const newRecord = create(null);
    reactiveRecord = newRecord;
    TargetToReactiveRecordMap.set(target, newRecord);
  }
  return reactiveRecord;
}
let currentReactiveObserver = null;
function valueMutated(target, key) {
  const reactiveRecord = TargetToReactiveRecordMap.get(target);
  if (!isUndefined$1(reactiveRecord)) {
    const reactiveObservers = reactiveRecord[key];
    if (!isUndefined$1(reactiveObservers)) {
      for (let i = 0, len = reactiveObservers.length; i < len; i += 1) {
        const ro = reactiveObservers[i];
        if (process.env.NODE_ENV !== 'production') {
          logMutation(ro, target, key);
        }
        ro.notify();
      }
    }
  }
}
function valueObserved(target, key) {
  // We should determine if an active Observing Record is present to track mutations.
  if (currentReactiveObserver === null) {
    return;
  }
  const ro = currentReactiveObserver;
  const reactiveRecord = getReactiveRecord(target);
  let reactiveObservers = reactiveRecord[key];
  if (isUndefined$1(reactiveObservers)) {
    reactiveObservers = [];
    reactiveRecord[key] = reactiveObservers;
  } else if (reactiveObservers[0] === ro) {
    return; // perf optimization considering that most subscriptions will come from the same record
  }
  if (ArrayIndexOf.call(reactiveObservers, ro) === -1) {
    ro.link(reactiveObservers);
  }
}
class ReactiveObserver {
  constructor(callback) {
    this.listeners = [];
    this.callback = callback;
  }
  observe(job) {
    const inceptionReactiveRecord = currentReactiveObserver;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    currentReactiveObserver = this;
    let error;
    try {
      job();
    } catch (e) {
      error = Object(e);
    } finally {
      currentReactiveObserver = inceptionReactiveRecord;
      if (error !== undefined) {
        throw error; // eslint-disable-line no-unsafe-finally
      }
    }
  }
  /**
   * This method is responsible for disconnecting the Reactive Observer
   * from any Reactive Record that has a reference to it, to prevent future
   * notifications about previously recorded access.
   */
  reset() {
    const {
      listeners
    } = this;
    const len = listeners.length;
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        const set = listeners[i];
        const setLength = set.length;
        // The length is usually 1, so avoid doing an indexOf when we know for certain
        // that `this` is the first item in the array.
        if (setLength > 1) {
          // Swap with the last item before removal.
          // (Avoiding splice here is a perf optimization, and the order doesn't matter.)
          const index = ArrayIndexOf.call(set, this);
          set[index] = set[setLength - 1];
        }
        // Remove the last item
        ArrayPop.call(set);
      }
      listeners.length = 0;
    }
  }
  // friend methods
  notify() {
    this.callback.call(undefined, this);
  }
  link(reactiveObservers) {
    ArrayPush$1.call(reactiveObservers, this);
    // we keep track of observing records where the observing record was added to so we can do some clean up later on
    ArrayPush$1.call(this.listeners, reactiveObservers);
  }
  isObserving() {
    return currentReactiveObserver === this;
  }
}

/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * This map keeps track of objects to signals. There is an assumption that the signal is strongly referenced
 * on the object which allows the SignalTracker to be garbage collected along with the object.
 */
const TargetToSignalTrackerMap = new WeakMap();
function getSignalTracker(target) {
  let signalTracker = TargetToSignalTrackerMap.get(target);
  if (isUndefined$1(signalTracker)) {
    signalTracker = new SignalTracker();
    TargetToSignalTrackerMap.set(target, signalTracker);
  }
  return signalTracker;
}
function subscribeToSignal(target, signal, update) {
  const signalTracker = getSignalTracker(target);
  if (isFalse(signalTracker.seen(signal))) {
    signalTracker.subscribeToSignal(signal, update);
  }
}
function unsubscribeFromSignals(target) {
  if (TargetToSignalTrackerMap.has(target)) {
    const signalTracker = getSignalTracker(target);
    signalTracker.unsubscribeFromSignals();
    signalTracker.reset();
  }
}
/**
 * A normalized string representation of an error, because browsers behave differently
 */
const errorWithStack = err => {
  if (typeof err !== 'object' || err === null) {
    return String(err);
  }
  const stack = 'stack' in err ? String(err.stack) : '';
  const message = 'message' in err ? String(err.message) : '';
  const constructor = err.constructor.name;
  return stack.includes(message) ? stack : `${constructor}: ${message}\n${stack}`;
};
/**
 * This class is used to keep track of the signals associated to a given object.
 * It is used to prevent the LWC engine from subscribing duplicate callbacks multiple times
 * to the same signal. Additionally, it keeps track of all signal unsubscribe callbacks, handles invoking
 * them when necessary and discarding them.
 */
class SignalTracker {
  constructor() {
    this.signalToUnsubscribeMap = new Map();
  }
  seen(signal) {
    return this.signalToUnsubscribeMap.has(signal);
  }
  subscribeToSignal(signal, update) {
    try {
      const unsubscribe = signal.subscribe(update);
      if (isFunction$1(unsubscribe)) {
        // TODO [#3978]: Evaluate how we should handle the case when unsubscribe is not a function.
        // Long term we should throw an error or log a warning.
        this.signalToUnsubscribeMap.set(signal, unsubscribe);
      }
    } catch (err) {
      logWarnOnce(`Attempted to subscribe to an object that has the shape of a signal but received the following error: ${errorWithStack(err)}`);
    }
  }
  unsubscribeFromSignals() {
    try {
      this.signalToUnsubscribeMap.forEach(unsubscribe => unsubscribe());
    } catch (err) {
      logWarnOnce(`Attempted to call a signal's unsubscribe callback but received the following error: ${errorWithStack(err)}`);
    }
  }
  reset() {
    this.signalToUnsubscribeMap.clear();
  }
}
function componentValueMutated(vm, key) {
  // On the server side, we don't need mutation tracking. Skipping it improves performance.
  {
    valueMutated(vm.component, key);
  }
}
function componentValueObserved(vm, key, target = {}) {
  const {
    component,
    tro
  } = vm;
  // On the server side, we don't need mutation tracking. Skipping it improves performance.
  {
    valueObserved(component, key);
  }
  // The portion of reactivity that's exposed to signals is to subscribe a callback to re-render the VM (templates).
  // We check the following to ensure re-render is subscribed at the correct time.
  //  1. The template is currently being rendered (there is a template reactive observer)
  //  2. There was a call to a getter to access the signal (happens during vnode generation)
  if (lwcRuntimeFlags.ENABLE_EXPERIMENTAL_SIGNALS && isObject(target) && !isNull(target) && true &&
  // Only subscribe if a template is being rendered by the engine
  tro.isObserving()) {
    if (isTrustedSignal()) {
      // Subscribe the template reactive observer's notify method, which will mark the vm as dirty and schedule hydration.
      subscribeToSignal(component, target, tro.notify.bind(tro));
    }
  }
}
function createReactiveObserver(callback) {
  // On the server side, we don't need mutation tracking. Skipping it improves performance.
  return new ReactiveObserver(callback);
}

/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function resolveCircularModuleDependency(fn) {
  const module = fn();
  return module?.__esModule ? module.default : module;
}
function isCircularModuleDependency(obj) {
  return isFunction$1(obj) && hasOwnProperty$1.call(obj, '__circular__');
}

/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const instrumentDef = globalThis.__lwc_instrument_cmp_def ?? noop;
const instrumentInstance = globalThis.__lwc_instrument_cmp_instance ?? noop;

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// This is a temporary workaround to get the @lwc/engine-server to evaluate in node without having
// to inject at runtime.
const HTMLElementConstructor = typeof HTMLElement !== 'undefined' ? HTMLElement : function () {};
const HTMLElementPrototype = HTMLElementConstructor.prototype;

/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Apply ARIA string reflection behavior to a prototype.
// This is deliberately kept separate from @lwc/aria-reflection. @lwc/aria-reflection is a global polyfill that is
// needed for backwards compatibility in LEX, whereas this is designed to only apply to our own
// LightningElement/BaseBridgeElement prototypes.
// Note we only need to handle ARIA reflections that aren't already in Element.prototype
const ariaReflectionPolyfillDescriptors = create(null);
for (const [propName, attrName] of entries(AriaPropNameToAttrNameMap)) {
  if (isUndefined$1(getPropertyDescriptor(HTMLElementPrototype, propName))) {
    // Note that we need to call this.{get,set,has,remove}Attribute rather than dereferencing
    // from Element.prototype, because these methods are overridden in LightningElement.
    ariaReflectionPolyfillDescriptors[propName] = {
      get() {
        return this.getAttribute(attrName);
      },
      set(newValue) {
        // TODO [#3284]: According to the spec, IDL nullable type values
        // (null and undefined) should remove the attribute; however, we
        // only do so in the case of null for historical reasons.
        // See also https://github.com/w3c/aria/issues/1858
        if (isNull(newValue)) {
          this.removeAttribute(attrName);
        } else {
          this.setAttribute(attrName, newValue);
        }
      },
      // configurable and enumerable to allow it to be overridden – this mimics Safari's/Chrome's behavior
      configurable: true,
      enumerable: true
    };
  }
}
// Add descriptors for ARIA attributes
for (const [attrName, propName] of entries(AriaAttrNameToPropNameMap)) {}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * This is a descriptor map that contains
 * all standard properties that a Custom Element can support (including AOM properties), which
 * determines what kind of capabilities the Base HTML Element and
 * Base Lightning Element should support.
 */
const HTMLElementOriginalDescriptors = create(null);
forEach.call(keys(AriaPropNameToAttrNameMap), propName => {
  // Note: intentionally using our in-house getPropertyDescriptor instead of getOwnPropertyDescriptor here because
  // in IE11, some properties are on Element.prototype instead of HTMLElement, just to be sure.
  const descriptor = getPropertyDescriptor(HTMLElementPrototype, propName);
  if (!isUndefined$1(descriptor)) {
    HTMLElementOriginalDescriptors[propName] = descriptor;
  }
});
for (const propName of REFLECTIVE_GLOBAL_PROPERTY_SET) {
  // Note: intentionally using our in-house getPropertyDescriptor instead of getOwnPropertyDescriptor here because
  // in IE11, id property is on Element.prototype instead of HTMLElement, and we suspect that more will fall into
  // this category, so, better to be sure.
  const descriptor = getPropertyDescriptor(HTMLElementPrototype, propName);
  if (!isUndefined$1(descriptor)) {
    HTMLElementOriginalDescriptors[propName] = descriptor;
  }
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function generateDataDescriptor(options) {
  return assign({
    configurable: true,
    enumerable: true,
    writable: true
  }, options);
}
function generateAccessorDescriptor(options) {
  return assign({
    configurable: true,
    enumerable: true
  }, options);
}
let isDomMutationAllowed = false;
function unlockDomMutation() {
  assertNotProd(); // this method should never leak to prod
  isDomMutationAllowed = true;
}
function lockDomMutation() {
  assertNotProd(); // this method should never leak to prod
  isDomMutationAllowed = false;
}
function logMissingPortalWarn(name, type) {
  return logWarn(`The \`${name}\` ${type} is available only on elements that use the \`lwc:dom="manual"\` directive.`);
}
function patchElementWithRestrictions(elm, options) {
  assertNotProd(); // this method should never leak to prod
  const originalOuterHTMLDescriptor = getPropertyDescriptor(elm, 'outerHTML');
  const descriptors = {};
  // For consistency between dev/prod modes, only patch `outerHTML` if it exists
  // (i.e. patch it in engine-dom, not in engine-server)
  if (originalOuterHTMLDescriptor) {
    descriptors.outerHTML = generateAccessorDescriptor({
      get() {
        return originalOuterHTMLDescriptor.get.call(this);
      },
      set(value) {
        logError(`Invalid attempt to set outerHTML on Element.`);
        return originalOuterHTMLDescriptor.set.call(this, value);
      }
    });
  }
  // Apply extra restriction related to DOM manipulation if the element is not a portal.
  if (!options.isLight && options.isSynthetic && !options.isPortal) {
    const {
      appendChild,
      insertBefore,
      removeChild,
      replaceChild
    } = elm;
    const originalNodeValueDescriptor = getPropertyDescriptor(elm, 'nodeValue');
    const originalInnerHTMLDescriptor = getPropertyDescriptor(elm, 'innerHTML');
    const originalTextContentDescriptor = getPropertyDescriptor(elm, 'textContent');
    assign(descriptors, {
      appendChild: generateDataDescriptor({
        value(aChild) {
          logMissingPortalWarn('appendChild', 'method');
          return appendChild.call(this, aChild);
        }
      }),
      insertBefore: generateDataDescriptor({
        value(newNode, referenceNode) {
          if (!isDomMutationAllowed) {
            logMissingPortalWarn('insertBefore', 'method');
          }
          return insertBefore.call(this, newNode, referenceNode);
        }
      }),
      removeChild: generateDataDescriptor({
        value(aChild) {
          if (!isDomMutationAllowed) {
            logMissingPortalWarn('removeChild', 'method');
          }
          return removeChild.call(this, aChild);
        }
      }),
      replaceChild: generateDataDescriptor({
        value(newChild, oldChild) {
          logMissingPortalWarn('replaceChild', 'method');
          return replaceChild.call(this, newChild, oldChild);
        }
      }),
      nodeValue: generateAccessorDescriptor({
        get() {
          return originalNodeValueDescriptor.get.call(this);
        },
        set(value) {
          if (!isDomMutationAllowed) {
            logMissingPortalWarn('nodeValue', 'property');
          }
          originalNodeValueDescriptor.set.call(this, value);
        }
      }),
      textContent: generateAccessorDescriptor({
        get() {
          return originalTextContentDescriptor.get.call(this);
        },
        set(value) {
          logMissingPortalWarn('textContent', 'property');
          originalTextContentDescriptor.set.call(this, value);
        }
      }),
      innerHTML: generateAccessorDescriptor({
        get() {
          return originalInnerHTMLDescriptor.get.call(this);
        },
        set(value) {
          logMissingPortalWarn('innerHTML', 'property');
          return originalInnerHTMLDescriptor.set.call(this, value);
        }
      })
    });
  }
  defineProperties(elm, descriptors);
}
function getShadowRootRestrictionsDescriptors(sr) {
  assertNotProd(); // this method should never leak to prod
  // Disallowing properties in dev mode only to avoid people doing the wrong
  // thing when using the real shadow root, because if that's the case,
  // the component will not work when running with synthetic shadow.
  const originalAddEventListener = sr.addEventListener;
  const originalInnerHTMLDescriptor = getPropertyDescriptor(sr, 'innerHTML');
  const originalTextContentDescriptor = getPropertyDescriptor(sr, 'textContent');
  return {
    innerHTML: generateAccessorDescriptor({
      get() {
        return originalInnerHTMLDescriptor.get.call(this);
      },
      set(value) {
        logError(`Invalid attempt to set innerHTML on ShadowRoot.`);
        return originalInnerHTMLDescriptor.set.call(this, value);
      }
    }),
    textContent: generateAccessorDescriptor({
      get() {
        return originalTextContentDescriptor.get.call(this);
      },
      set(value) {
        logError(`Invalid attempt to set textContent on ShadowRoot.`);
        return originalTextContentDescriptor.set.call(this, value);
      }
    }),
    addEventListener: generateDataDescriptor({
      value(type, listener, options) {
        // TODO [#1824]: Potentially relax this restriction
        if (!isUndefined$1(options)) {
          logError('The `addEventListener` method on ShadowRoot does not support any options.', getAssociatedVMIfPresent(this));
        }
        // Typescript does not like it when you treat the `arguments` object as an array
        // @ts-expect-error type-mismatch
        return originalAddEventListener.apply(this, arguments);
      }
    })
  };
}
// Custom Elements Restrictions:
// -----------------------------
function getCustomElementRestrictionsDescriptors(elm) {
  assertNotProd(); // this method should never leak to prod
  const originalAddEventListener = elm.addEventListener;
  const originalInnerHTMLDescriptor = getPropertyDescriptor(elm, 'innerHTML');
  const originalOuterHTMLDescriptor = getPropertyDescriptor(elm, 'outerHTML');
  const originalTextContentDescriptor = getPropertyDescriptor(elm, 'textContent');
  return {
    innerHTML: generateAccessorDescriptor({
      get() {
        return originalInnerHTMLDescriptor.get.call(this);
      },
      set(value) {
        logError(`Invalid attempt to set innerHTML on HTMLElement.`);
        return originalInnerHTMLDescriptor.set.call(this, value);
      }
    }),
    outerHTML: generateAccessorDescriptor({
      get() {
        return originalOuterHTMLDescriptor.get.call(this);
      },
      set(value) {
        logError(`Invalid attempt to set outerHTML on HTMLElement.`);
        return originalOuterHTMLDescriptor.set.call(this, value);
      }
    }),
    textContent: generateAccessorDescriptor({
      get() {
        return originalTextContentDescriptor.get.call(this);
      },
      set(value) {
        logError(`Invalid attempt to set textContent on HTMLElement.`);
        return originalTextContentDescriptor.set.call(this, value);
      }
    }),
    addEventListener: generateDataDescriptor({
      value(type, listener, options) {
        // TODO [#1824]: Potentially relax this restriction
        if (!isUndefined$1(options)) {
          logError('The `addEventListener` method in `LightningElement` does not support any options.', getAssociatedVMIfPresent(this));
        }
        // Typescript does not like it when you treat the `arguments` object as an array
        // @ts-expect-error type-mismatch
        return originalAddEventListener.apply(this, arguments);
      }
    })
  };
}
// This routine will prevent access to certain properties on a shadow root instance to guarantee
// that all components will work fine in IE11 and other browsers without shadow dom support.
function patchShadowRootWithRestrictions(sr) {
  defineProperties(sr, getShadowRootRestrictionsDescriptors(sr));
}
function patchCustomElementWithRestrictions(elm) {
  const restrictionsDescriptors = getCustomElementRestrictionsDescriptors(elm);
  const elmProto = getPrototypeOf$1(elm);
  setPrototypeOf(elm, create(elmProto, restrictionsDescriptors));
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function updateComponentValue(vm, key, newValue) {
  const {
    cmpFields
  } = vm;
  if (newValue !== cmpFields[key]) {
    cmpFields[key] = newValue;
    componentValueMutated(vm, key);
  }
}

/**
 * Copyright (C) 2017 salesforce.com, inc.
 */
const {
  isArray
} = Array;
const {
  prototype: ObjectDotPrototype,
  getPrototypeOf,
  create: ObjectCreate,
  defineProperty: ObjectDefineProperty,
  isExtensible,
  getOwnPropertyDescriptor,
  getOwnPropertyNames,
  getOwnPropertySymbols,
  preventExtensions,
  hasOwnProperty
} = Object;
const {
  push: ArrayPush,
  concat: ArrayConcat
} = Array.prototype;
function isUndefined(obj) {
  return obj === undefined;
}
function isFunction(obj) {
  return typeof obj === 'function';
}
const proxyToValueMap = new WeakMap();
function registerProxy(proxy, value) {
  proxyToValueMap.set(proxy, value);
}
const unwrap$1 = replicaOrAny => proxyToValueMap.get(replicaOrAny) || replicaOrAny;
class BaseProxyHandler {
  constructor(membrane, value) {
    this.originalTarget = value;
    this.membrane = membrane;
  }
  // Shared utility methods
  wrapDescriptor(descriptor) {
    if (hasOwnProperty.call(descriptor, 'value')) {
      descriptor.value = this.wrapValue(descriptor.value);
    } else {
      const {
        set: originalSet,
        get: originalGet
      } = descriptor;
      if (!isUndefined(originalGet)) {
        descriptor.get = this.wrapGetter(originalGet);
      }
      if (!isUndefined(originalSet)) {
        descriptor.set = this.wrapSetter(originalSet);
      }
    }
    return descriptor;
  }
  copyDescriptorIntoShadowTarget(shadowTarget, key) {
    const {
      originalTarget
    } = this;
    // Note: a property might get defined multiple times in the shadowTarget
    //       but it will always be compatible with the previous descriptor
    //       to preserve the object invariants, which makes these lines safe.
    const originalDescriptor = getOwnPropertyDescriptor(originalTarget, key);
    // TODO: it should be impossible for the originalDescriptor to ever be undefined, this `if` can be removed
    /* istanbul ignore else */
    if (!isUndefined(originalDescriptor)) {
      const wrappedDesc = this.wrapDescriptor(originalDescriptor);
      ObjectDefineProperty(shadowTarget, key, wrappedDesc);
    }
  }
  lockShadowTarget(shadowTarget) {
    const {
      originalTarget
    } = this;
    const targetKeys = ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
    targetKeys.forEach(key => {
      this.copyDescriptorIntoShadowTarget(shadowTarget, key);
    });
    const {
      membrane: {
        tagPropertyKey
      }
    } = this;
    if (!isUndefined(tagPropertyKey) && !hasOwnProperty.call(shadowTarget, tagPropertyKey)) {
      ObjectDefineProperty(shadowTarget, tagPropertyKey, ObjectCreate(null));
    }
    preventExtensions(shadowTarget);
  }
  // Shared Traps
  // TODO: apply() is never called
  /* istanbul ignore next */
  apply(shadowTarget, thisArg, argArray) {
    /* No op */
  }
  // TODO: construct() is never called
  /* istanbul ignore next */
  construct(shadowTarget, argArray, newTarget) {
    /* No op */
  }
  get(shadowTarget, key) {
    const {
      originalTarget,
      membrane: {
        valueObserved
      }
    } = this;
    const value = originalTarget[key];
    valueObserved(originalTarget, key);
    return this.wrapValue(value);
  }
  has(shadowTarget, key) {
    const {
      originalTarget,
      membrane: {
        tagPropertyKey,
        valueObserved
      }
    } = this;
    valueObserved(originalTarget, key);
    // since key is never going to be undefined, and tagPropertyKey might be undefined
    // we can simply compare them as the second part of the condition.
    return key in originalTarget || key === tagPropertyKey;
  }
  ownKeys(shadowTarget) {
    const {
      originalTarget,
      membrane: {
        tagPropertyKey
      }
    } = this;
    // if the membrane tag key exists and it is not in the original target, we add it to the keys.
    const keys = isUndefined(tagPropertyKey) || hasOwnProperty.call(originalTarget, tagPropertyKey) ? [] : [tagPropertyKey];
    // small perf optimization using push instead of concat to avoid creating an extra array
    ArrayPush.apply(keys, getOwnPropertyNames(originalTarget));
    ArrayPush.apply(keys, getOwnPropertySymbols(originalTarget));
    return keys;
  }
  isExtensible(shadowTarget) {
    const {
      originalTarget
    } = this;
    // optimization to avoid attempting to lock down the shadowTarget multiple times
    if (!isExtensible(shadowTarget)) {
      return false; // was already locked down
    }
    if (!isExtensible(originalTarget)) {
      this.lockShadowTarget(shadowTarget);
      return false;
    }
    return true;
  }
  getPrototypeOf(shadowTarget) {
    const {
      originalTarget
    } = this;
    return getPrototypeOf(originalTarget);
  }
  getOwnPropertyDescriptor(shadowTarget, key) {
    const {
      originalTarget,
      membrane: {
        valueObserved,
        tagPropertyKey
      }
    } = this;
    // keys looked up via getOwnPropertyDescriptor need to be reactive
    valueObserved(originalTarget, key);
    let desc = getOwnPropertyDescriptor(originalTarget, key);
    if (isUndefined(desc)) {
      if (key !== tagPropertyKey) {
        return undefined;
      }
      // if the key is the membrane tag key, and is not in the original target,
      // we produce a synthetic descriptor and install it on the shadow target
      desc = {
        value: undefined,
        writable: false,
        configurable: false,
        enumerable: false
      };
      ObjectDefineProperty(shadowTarget, tagPropertyKey, desc);
      return desc;
    }
    if (desc.configurable === false) {
      // updating the descriptor to non-configurable on the shadow
      this.copyDescriptorIntoShadowTarget(shadowTarget, key);
    }
    // Note: by accessing the descriptor, the key is marked as observed
    // but access to the value, setter or getter (if available) cannot observe
    // mutations, just like regular methods, in which case we just do nothing.
    return this.wrapDescriptor(desc);
  }
}
const getterMap$1 = new WeakMap();
const setterMap$1 = new WeakMap();
const reverseGetterMap = new WeakMap();
const reverseSetterMap = new WeakMap();
class ReactiveProxyHandler extends BaseProxyHandler {
  wrapValue(value) {
    return this.membrane.getProxy(value);
  }
  wrapGetter(originalGet) {
    const wrappedGetter = getterMap$1.get(originalGet);
    if (!isUndefined(wrappedGetter)) {
      return wrappedGetter;
    }
    const handler = this;
    const get = function () {
      // invoking the original getter with the original target
      return handler.wrapValue(originalGet.call(unwrap$1(this)));
    };
    getterMap$1.set(originalGet, get);
    reverseGetterMap.set(get, originalGet);
    return get;
  }
  wrapSetter(originalSet) {
    const wrappedSetter = setterMap$1.get(originalSet);
    if (!isUndefined(wrappedSetter)) {
      return wrappedSetter;
    }
    const set = function (v) {
      // invoking the original setter with the original target
      originalSet.call(unwrap$1(this), unwrap$1(v));
    };
    setterMap$1.set(originalSet, set);
    reverseSetterMap.set(set, originalSet);
    return set;
  }
  unwrapDescriptor(descriptor) {
    if (hasOwnProperty.call(descriptor, 'value')) {
      // dealing with a data descriptor
      descriptor.value = unwrap$1(descriptor.value);
    } else {
      const {
        set,
        get
      } = descriptor;
      if (!isUndefined(get)) {
        descriptor.get = this.unwrapGetter(get);
      }
      if (!isUndefined(set)) {
        descriptor.set = this.unwrapSetter(set);
      }
    }
    return descriptor;
  }
  unwrapGetter(redGet) {
    const reverseGetter = reverseGetterMap.get(redGet);
    if (!isUndefined(reverseGetter)) {
      return reverseGetter;
    }
    const handler = this;
    const get = function () {
      // invoking the red getter with the proxy of this
      return unwrap$1(redGet.call(handler.wrapValue(this)));
    };
    getterMap$1.set(get, redGet);
    reverseGetterMap.set(redGet, get);
    return get;
  }
  unwrapSetter(redSet) {
    const reverseSetter = reverseSetterMap.get(redSet);
    if (!isUndefined(reverseSetter)) {
      return reverseSetter;
    }
    const handler = this;
    const set = function (v) {
      // invoking the red setter with the proxy of this
      redSet.call(handler.wrapValue(this), handler.wrapValue(v));
    };
    setterMap$1.set(set, redSet);
    reverseSetterMap.set(redSet, set);
    return set;
  }
  set(shadowTarget, key, value) {
    const {
      originalTarget,
      membrane: {
        valueMutated
      }
    } = this;
    const oldValue = originalTarget[key];
    if (oldValue !== value) {
      originalTarget[key] = value;
      valueMutated(originalTarget, key);
    } else if (key === 'length' && isArray(originalTarget)) {
      // fix for issue #236: push will add the new index, and by the time length
      // is updated, the internal length is already equal to the new length value
      // therefore, the oldValue is equal to the value. This is the forking logic
      // to support this use case.
      valueMutated(originalTarget, key);
    }
    return true;
  }
  deleteProperty(shadowTarget, key) {
    const {
      originalTarget,
      membrane: {
        valueMutated
      }
    } = this;
    delete originalTarget[key];
    valueMutated(originalTarget, key);
    return true;
  }
  setPrototypeOf(shadowTarget, prototype) {}
  preventExtensions(shadowTarget) {
    if (isExtensible(shadowTarget)) {
      const {
        originalTarget
      } = this;
      preventExtensions(originalTarget);
      // if the originalTarget is a proxy itself, it might reject
      // the preventExtension call, in which case we should not attempt to lock down
      // the shadow target.
      // TODO: It should not actually be possible to reach this `if` statement.
      // If a proxy rejects extensions, then calling preventExtensions will throw an error:
      // https://codepen.io/nolanlawson-the-selector/pen/QWMOjbY
      /* istanbul ignore if */
      if (isExtensible(originalTarget)) {
        return false;
      }
      this.lockShadowTarget(shadowTarget);
    }
    return true;
  }
  defineProperty(shadowTarget, key, descriptor) {
    const {
      originalTarget,
      membrane: {
        valueMutated,
        tagPropertyKey
      }
    } = this;
    if (key === tagPropertyKey && !hasOwnProperty.call(originalTarget, key)) {
      // To avoid leaking the membrane tag property into the original target, we must
      // be sure that the original target doesn't have yet.
      // NOTE: we do not return false here because Object.freeze and equivalent operations
      // will attempt to set the descriptor to the same value, and expect no to throw. This
      // is an small compromise for the sake of not having to diff the descriptors.
      return true;
    }
    ObjectDefineProperty(originalTarget, key, this.unwrapDescriptor(descriptor));
    // intentionally testing if false since it could be undefined as well
    if (descriptor.configurable === false) {
      this.copyDescriptorIntoShadowTarget(shadowTarget, key);
    }
    valueMutated(originalTarget, key);
    return true;
  }
  /*LWC compiler v9.5.3*/
}
const getterMap = new WeakMap();
const setterMap = new WeakMap();
class ReadOnlyHandler extends BaseProxyHandler {
  wrapValue(value) {
    return this.membrane.getReadOnlyProxy(value);
  }
  wrapGetter(originalGet) {
    const wrappedGetter = getterMap.get(originalGet);
    if (!isUndefined(wrappedGetter)) {
      return wrappedGetter;
    }
    const handler = this;
    const get = function () {
      // invoking the original getter with the original target
      return handler.wrapValue(originalGet.call(unwrap$1(this)));
    };
    getterMap.set(originalGet, get);
    return get;
  }
  wrapSetter(originalSet) {
    const wrappedSetter = setterMap.get(originalSet);
    if (!isUndefined(wrappedSetter)) {
      return wrappedSetter;
    }
    const set = function (v) {};
    setterMap.set(originalSet, set);
    return set;
  }
  set(shadowTarget, key, value) {
    /* istanbul ignore next */
    return false;
  }
  deleteProperty(shadowTarget, key) {
    /* istanbul ignore next */
    return false;
  }
  setPrototypeOf(shadowTarget, prototype) {}
  preventExtensions(shadowTarget) {
    /* istanbul ignore next */
    return false;
  }
  defineProperty(shadowTarget, key, descriptor) {
    /* istanbul ignore next */
    return false;
  }
  /*LWC compiler v9.5.3*/
}
function defaultValueIsObservable(value) {
  // intentionally checking for null
  if (value === null) {
    return false;
  }
  // treat all non-object types, including undefined, as non-observable values
  if (typeof value !== 'object') {
    return false;
  }
  if (isArray(value)) {
    return true;
  }
  const proto = getPrototypeOf(value);
  return proto === ObjectDotPrototype || proto === null || getPrototypeOf(proto) === null;
}
const defaultValueObserved = (obj, key) => {
  /* do nothing */
};
const defaultValueMutated = (obj, key) => {
  /* do nothing */
};
function createShadowTarget(value) {
  return isArray(value) ? [] : {};
}
class ObservableMembrane {
  constructor(options = {}) {
    this.readOnlyObjectGraph = new WeakMap();
    this.reactiveObjectGraph = new WeakMap();
    const {
      valueMutated,
      valueObserved,
      valueIsObservable,
      tagPropertyKey
    } = options;
    this.valueMutated = isFunction(valueMutated) ? valueMutated : defaultValueMutated;
    this.valueObserved = isFunction(valueObserved) ? valueObserved : defaultValueObserved;
    this.valueIsObservable = isFunction(valueIsObservable) ? valueIsObservable : defaultValueIsObservable;
    this.tagPropertyKey = tagPropertyKey;
  }
  getProxy(value) {
    const unwrappedValue = unwrap$1(value);
    if (this.valueIsObservable(unwrappedValue)) {
      // When trying to extract the writable version of a readonly we return the readonly.
      if (this.readOnlyObjectGraph.get(unwrappedValue) === value) {
        return value;
      }
      return this.getReactiveHandler(unwrappedValue);
    }
    return unwrappedValue;
  }
  getReadOnlyProxy(value) {
    value = unwrap$1(value);
    if (this.valueIsObservable(value)) {
      return this.getReadOnlyHandler(value);
    }
    return value;
  }
  unwrapProxy(p) {
    return unwrap$1(p);
  }
  getReactiveHandler(value) {
    let proxy = this.reactiveObjectGraph.get(value);
    if (isUndefined(proxy)) {
      // caching the proxy after the first time it is accessed
      const handler = new ReactiveProxyHandler(this, value);
      proxy = new Proxy(createShadowTarget(value), handler);
      registerProxy(proxy, value);
      this.reactiveObjectGraph.set(value, proxy);
    }
    return proxy;
  }
  getReadOnlyHandler(value) {
    let proxy = this.readOnlyObjectGraph.get(value);
    if (isUndefined(proxy)) {
      // caching the proxy after the first time it is accessed
      const handler = new ReadOnlyHandler(this, value);
      proxy = new Proxy(createShadowTarget(value), handler);
      registerProxy(proxy, value);
      this.readOnlyObjectGraph.set(value, proxy);
    }
    return proxy;
  }
}
/** version: 2.0.0 */

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const lockerLivePropertyKey = Symbol.for('@@lockerLiveValue');
const reactiveMembrane = new ObservableMembrane({
  valueObserved,
  valueMutated,
  tagPropertyKey: lockerLivePropertyKey
});
function getReadOnlyProxy(value) {
  // We must return a frozen wrapper around the value, so that child components cannot mutate properties passed to
  // them from their parents. This applies to both the client and server.
  return reactiveMembrane.getReadOnlyProxy(value);
}
// Making the component instance a live value when using Locker to support expandos.
function markLockerLiveObject(obj) {
  // On the server side, we don't need mutation tracking. Skipping it improves performance.
  {
    obj[lockerLivePropertyKey] = undefined;
  }
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * This module is responsible for producing the ComponentDef object that is always
 * accessible via `vm.def`. This is lazily created during the creation of the first
 * instance of a component class, and shared across all instances.
 *
 * This structure can be used to synthetically create proxies, and understand the
 * shape of a component. It is also used internally to apply extra optimizations.
 */
/**
 * This operation is called with a descriptor of an standard html property
 * that a Custom Element can support (including AOM properties), which
 * determines what kind of capabilities the Base Lightning Element should support. When producing the new descriptors
 * for the Base Lightning Element, it also include the reactivity bit, so the standard property is reactive.
 * @param propName
 * @param descriptor
 */
function createBridgeToElementDescriptor(propName, descriptor) {
  const {
    get,
    set,
    enumerable,
    configurable
  } = descriptor;
  if (!isFunction$1(get)) {
    throw new TypeError(`Detected invalid public property descriptor for HTMLElement.prototype.${propName} definition. Missing the standard getter.`);
  }
  if (!isFunction$1(set)) {
    throw new TypeError(`Detected invalid public property descriptor for HTMLElement.prototype.${propName} definition. Missing the standard setter.`);
  }
  return {
    enumerable,
    configurable,
    get() {
      const vm = getAssociatedVM(this);
      if (isBeingConstructed(vm)) {
        if (process.env.NODE_ENV !== 'production') {
          logError(`The value of property \`${propName}\` can't be read from the constructor because the owner component hasn't set the value yet. Instead, use the constructor to set a default value for the property.`, vm);
        }
        return;
      }
      componentValueObserved(vm, propName);
      return get.call(vm.elm);
    },
    set(newValue) {
      const vm = getAssociatedVM(this);
      if (process.env.NODE_ENV !== 'production') {
        const vmBeingRendered = getVMBeingRendered();
        if (isInvokingRender) {
          logError(`${vmBeingRendered}.render() method has side effects on the state of ${vm}.${propName}`);
        }
        if (isUpdatingTemplate) {
          logError(`When updating the template of ${vmBeingRendered}, one of the accessors used by the template has side effects on the state of ${vm}.${propName}`);
        }
        if (isBeingConstructed(vm)) {
          logError(`Failed to construct '${getComponentTag(vm)}': The result must not have attributes.`);
        }
        if (isObject(newValue) && !isNull(newValue)) {
          logError(`Invalid value "${newValue}" for "${propName}" of ${vm}. Value cannot be an object, must be a primitive value.`);
        }
      }
      updateComponentValue(vm, propName, newValue);
      return set.call(vm.elm, newValue);
    }
  };
}
const refsCache = new WeakMap();
/**
 * This class is the base class for any LWC element.
 * Some elements directly extends this class, others implement it via inheritance.
 */
// @ts-expect-error When exported, it will conform, but we need to build it first!
const LightningElement = function () {
  // This should be as performant as possible, while any initialization should be done lazily
  if (isNull(vmBeingConstructed)) {
    // Thrown when doing something like `new LightningElement()` or
    // `class Foo extends LightningElement {}; new Foo()`
    throw new TypeError('Illegal constructor');
  }
  // This is a no-op unless Lightning DevTools are enabled.
  instrumentInstance(this, vmBeingConstructed);
  const vm = vmBeingConstructed;
  const {
    def,
    elm
  } = vm;
  const {
    bridge
  } = def;
  if (process.env.NODE_ENV !== 'production') {
    const {
      assertInstanceOfHTMLElement
    } = vm.renderer;
    assertInstanceOfHTMLElement(vm.elm, `Component creation requires a DOM element to be associated to ${vm}.`);
  }
  setPrototypeOf(elm, bridge.prototype);
  vm.component = this;
  // Locker hooks assignment. When the LWC engine run with Locker, Locker intercepts all the new
  // component creation and passes hooks to instrument all the component interactions with the
  // engine. We are intentionally hiding this argument from the formal API of LightningElement
  // because we don't want folks to know about it just yet.
  if (arguments.length === 1) {
    const {
      callHook,
      setHook,
      getHook
    } = arguments[0];
    vm.callHook = callHook;
    vm.setHook = setHook;
    vm.getHook = getHook;
  }
  markLockerLiveObject(this);
  // Linking elm, shadow root and component with the VM.
  associateVM(this, vm);
  associateVM(elm, vm);
  if (vm.renderMode === 1 /* RenderMode.Shadow */) {
    vm.renderRoot = doAttachShadow(vm);
  } else {
    vm.renderRoot = elm;
  }
  // Adding extra guard rails in DEV mode.
  if (process.env.NODE_ENV !== 'production') {
    patchCustomElementWithRestrictions(elm);
  }
  return this;
};
function doAttachShadow(vm) {
  const {
    elm,
    mode,
    shadowMode,
    def: {
      ctor
    },
    renderer: {
      attachShadow
    }
  } = vm;
  const shadowRoot = attachShadow(elm, {
    [KEY__SYNTHETIC_MODE]: shadowMode === 1 /* ShadowMode.Synthetic */,
    delegatesFocus: Boolean(ctor.delegatesFocus),
    mode
  });
  vm.shadowRoot = shadowRoot;
  associateVM(shadowRoot, vm);
  if (process.env.NODE_ENV !== 'production') {
    patchShadowRootWithRestrictions(shadowRoot);
  }
  return shadowRoot;
}
function warnIfInvokedDuringConstruction(vm, methodOrPropName) {
  if (isBeingConstructed(vm)) {
    logError(`this.${methodOrPropName} should not be called during the construction of the custom element for ${getComponentTag(vm)} because the element is not yet in the DOM or has no children yet.`);
  }
}
// Type assertion because we need to build the prototype before it satisfies the interface.
LightningElement.prototype = {
  constructor: LightningElement,
  dispatchEvent(event) {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        dispatchEvent
      }
    } = vm;
    return dispatchEvent(elm, event);
  },
  addEventListener(type, listener, options) {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        addEventListener
      }
    } = vm;
    if (process.env.NODE_ENV !== 'production') {
      const vmBeingRendered = getVMBeingRendered();
      if (isInvokingRender) {
        logError(`${vmBeingRendered}.render() method has side effects on the state of ${vm} by adding an event listener for "${type}".`);
      }
      if (isUpdatingTemplate) {
        logError(`Updating the template of ${vmBeingRendered} has side effects on the state of ${vm} by adding an event listener for "${type}".`);
      }
      if (!isFunction$1(listener)) {
        logError(`Invalid second argument for this.addEventListener() in ${vm} for event "${type}". Expected an EventListener but received ${listener}.`);
      }
    }
    const wrappedListener = getWrappedComponentsListener(vm, listener);
    addEventListener(elm, type, wrappedListener, options);
  },
  removeEventListener(type, listener, options) {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        removeEventListener
      }
    } = vm;
    const wrappedListener = getWrappedComponentsListener(vm, listener);
    removeEventListener(elm, type, wrappedListener, options);
  },
  hasAttribute(name) {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        getAttribute
      }
    } = vm;
    return !isNull(getAttribute(elm, name));
  },
  hasAttributeNS(namespace, name) {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        getAttribute
      }
    } = vm;
    return !isNull(getAttribute(elm, name, namespace));
  },
  removeAttribute(name) {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        removeAttribute
      }
    } = vm;
    removeAttribute(elm, name);
  },
  removeAttributeNS(namespace, name) {
    const {
      elm,
      renderer: {
        removeAttribute
      }
    } = getAssociatedVM(this);
    removeAttribute(elm, name, namespace);
  },
  getAttribute(name) {
    const vm = getAssociatedVM(this);
    const {
      elm
    } = vm;
    const {
      getAttribute
    } = vm.renderer;
    return getAttribute(elm, name);
  },
  getAttributeNS(namespace, name) {
    const vm = getAssociatedVM(this);
    const {
      elm
    } = vm;
    const {
      getAttribute
    } = vm.renderer;
    return getAttribute(elm, name, namespace);
  },
  setAttribute(name, value) {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        setAttribute
      }
    } = vm;
    if (process.env.NODE_ENV !== 'production') {
      if (isBeingConstructed(vm)) {
        logError(`Failed to construct '${getComponentTag(vm)}': The result must not have attributes.`);
      }
    }
    setAttribute(elm, name, value);
  },
  setAttributeNS(namespace, name, value) {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        setAttribute
      }
    } = vm;
    if (process.env.NODE_ENV !== 'production') {
      if (isBeingConstructed(vm)) {
        logError(`Failed to construct '${getComponentTag(vm)}': The result must not have attributes.`);
      }
    }
    setAttribute(elm, name, value, namespace);
  },
  getBoundingClientRect() {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        getBoundingClientRect
      }
    } = vm;
    if (process.env.NODE_ENV !== 'production') {
      warnIfInvokedDuringConstruction(vm, 'getBoundingClientRect()');
    }
    return getBoundingClientRect(elm);
  },
  attachInternals() {
    const vm = getAssociatedVM(this);
    const {
      def: {
        ctor
      },
      elm,
      apiVersion,
      renderer: {
        attachInternals
      }
    } = vm;
    if (!isAPIFeatureEnabled(7 /* APIFeature.ENABLE_ELEMENT_INTERNALS_AND_FACE */, apiVersion)) {
      throw new Error(`The attachInternals API is only supported in API version 61 and above. ` + `The current version is ${apiVersion}. ` + `To use this API, update the LWC component API version. https://lwc.dev/guide/versioning`);
    }
    const internals = attachInternals(elm);
    if (vm.shadowMode === 1 /* ShadowMode.Synthetic */ && supportsSyntheticElementInternals(ctor)) {
      const handler = {
        get(target, prop) {
          if (prop === 'shadowRoot') {
            return vm.shadowRoot;
          }
          const value = Reflect.get(target, prop);
          if (typeof value === 'function') {
            return value.bind(target);
          }
          return value;
        },
        set(target, prop, value) {
          return Reflect.set(target, prop, value);
        }
      };
      return new Proxy(internals, handler);
    } else if (vm.shadowMode === 1 /* ShadowMode.Synthetic */) {
      throw new Error('attachInternals API is not supported in synthetic shadow.');
    }
    return internals;
  },
  get isConnected() {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        isConnected
      }
    } = vm;
    return isConnected(elm);
  },
  get classList() {
    const vm = getAssociatedVM(this);
    const {
      elm,
      renderer: {
        getClassList
      }
    } = vm;
    if (process.env.NODE_ENV !== 'production') {
      if (isBeingConstructed(vm)) {
        logError(`Failed to construct ${vm}: The result must not have attributes. Adding or tampering with classname in constructor is not allowed in a web component, use connectedCallback() instead.`);
      }
    }
    return getClassList(elm);
  },
  get template() {
    const vm = getAssociatedVM(this);
    if (process.env.NODE_ENV !== 'production') {
      if (vm.renderMode === 0 /* RenderMode.Light */) {
        logError('`this.template` returns null for light DOM components. Since there is no shadow, the rendered content can be accessed via `this` itself. e.g. instead of `this.template.querySelector`, use `this.querySelector`.');
      }
    }
    return vm.shadowRoot;
  },
  get hostElement() {
    const vm = getAssociatedVM(this);
    const apiVersion = getComponentAPIVersion(vm.def.ctor);
    if (!isAPIFeatureEnabled(8 /* APIFeature.ENABLE_THIS_DOT_HOST_ELEMENT */, apiVersion)) {
      if (process.env.NODE_ENV !== 'production') {
        logWarnOnce('The `this.hostElement` API within LightningElement is ' + 'only supported in API version 62 and above. Increase the API version to use it.');
      }
      // Simulate the old behavior for `this.hostElement` to avoid a breaking change
      return undefined;
    }
    if (process.env.NODE_ENV !== 'production') {
      assert.isTrue(vm.elm instanceof Element, `this.hostElement should be an Element, found: ${vm.elm}`);
    }
    return vm.elm;
  },
  get refs() {
    const vm = getAssociatedVM(this);
    if (isUpdatingTemplate) {
      if (process.env.NODE_ENV !== 'production') {
        logError(`this.refs should not be called while ${getComponentTag(vm)} is rendering. Use this.refs only when the DOM is stable, e.g. in renderedCallback().`);
      }
      // If the template is in the process of being updated, then we don't want to go through the normal
      // process of returning the refs and caching them, because the state of the refs is unstable.
      // This can happen if e.g. a template contains `<div class={foo}></div>` and `foo` is computed
      // based on `this.refs.bar`.
      return;
    }
    if (process.env.NODE_ENV !== 'production') {
      warnIfInvokedDuringConstruction(vm, 'refs');
    }
    const {
      refVNodes,
      cmpTemplate
    } = vm;
    // If the `cmpTemplate` is null, that means that the template has not been rendered yet. Most likely this occurs
    // if `this.refs` is called during the `connectedCallback` phase. The DOM elements have not been rendered yet,
    // so log a warning. Note we also check `isBeingConstructed()` to avoid a double warning (due to
    // `warnIfInvokedDuringConstruction` above).
    if (process.env.NODE_ENV !== 'production' && isNull(cmpTemplate) && !isBeingConstructed(vm)) {
      logError(`this.refs is undefined for ${getComponentTag(vm)}. This is either because the attached template has no "lwc:ref" directive, or this.refs was ` + `invoked before renderedCallback(). Use this.refs only when the referenced HTML elements have ` + `been rendered to the DOM, such as within renderedCallback() or disconnectedCallback().`);
    }
    // For backwards compatibility with component written before template refs
    // were introduced, we return undefined if the template has no refs defined
    // anywhere. This fixes components that may want to add an expando called `refs`
    // and are checking if it exists with `if (this.refs)`  before adding it.
    // Note we use a null refVNodes to indicate that the template has no refs defined.
    if (isNull(refVNodes)) {
      return;
    }
    // The refNodes can be cached based on the refVNodes, since the refVNodes
    // are recreated from scratch every time the template is rendered.
    // This happens with `vm.refVNodes = null` in `template.ts` in `@lwc/engine-core`.
    let refs = refsCache.get(refVNodes);
    if (isUndefined$1(refs)) {
      refs = create(null);
      for (const key of keys(refVNodes)) {
        refs[key] = refVNodes[key].elm;
      }
      freeze(refs);
      refsCache.set(refVNodes, refs);
    }
    return refs;
  },
  // For backwards compat, we allow component authors to set `refs` as an expando
  set refs(value) {
    defineProperty(this, 'refs', {
      configurable: true,
      enumerable: true,
      writable: true,
      value
    });
  },
  get shadowRoot() {
    // From within the component instance, the shadowRoot is always reported as "closed".
    // Authors should rely on this.template instead.
    return null;
  },
  get children() {
    const vm = getAssociatedVM(this);
    const renderer = vm.renderer;
    if (process.env.NODE_ENV !== 'production') {
      warnIfInvokedDuringConstruction(vm, 'children');
    }
    return renderer.getChildren(vm.elm);
  },
  get childNodes() {
    const vm = getAssociatedVM(this);
    const renderer = vm.renderer;
    if (process.env.NODE_ENV !== 'production') {
      warnIfInvokedDuringConstruction(vm, 'childNodes');
    }
    // getChildNodes returns a NodeList, which has `item(index: number): Node | null`.
    // NodeListOf<T> extends NodeList, but claims to not return null. That seems inaccurate,
    // but these are built-in types, so ultimately not our problem.
    return renderer.getChildNodes(vm.elm);
  },
  get firstChild() {
    const vm = getAssociatedVM(this);
    const renderer = vm.renderer;
    if (process.env.NODE_ENV !== 'production') {
      warnIfInvokedDuringConstruction(vm, 'firstChild');
    }
    return renderer.getFirstChild(vm.elm);
  },
  get firstElementChild() {
    const vm = getAssociatedVM(this);
    const renderer = vm.renderer;
    if (process.env.NODE_ENV !== 'production') {
      warnIfInvokedDuringConstruction(vm, 'firstElementChild');
    }
    return renderer.getFirstElementChild(vm.elm);
  },
  get lastChild() {
    const vm = getAssociatedVM(this);
    const renderer = vm.renderer;
    if (process.env.NODE_ENV !== 'production') {
      warnIfInvokedDuringConstruction(vm, 'lastChild');
    }
    return renderer.getLastChild(vm.elm);
  },
  get lastElementChild() {
    const vm = getAssociatedVM(this);
    const renderer = vm.renderer;
    if (process.env.NODE_ENV !== 'production') {
      warnIfInvokedDuringConstruction(vm, 'lastElementChild');
    }
    return renderer.getLastElementChild(vm.elm);
  },
  get ownerDocument() {
    const vm = getAssociatedVM(this);
    const renderer = vm.renderer;
    if (process.env.NODE_ENV !== 'production') {
      warnIfInvokedDuringConstruction(vm, 'ownerDocument');
    }
    return renderer.ownerDocument(vm.elm);
  },
  get tagName() {
    const {
      elm,
      renderer
    } = getAssociatedVM(this);
    return renderer.getTagName(elm);
  },
  get style() {
    const {
      elm,
      renderer,
      def
    } = getAssociatedVM(this);
    const apiVersion = getComponentAPIVersion(def.ctor);
    if (!isAPIFeatureEnabled(9 /* APIFeature.ENABLE_THIS_DOT_STYLE */, apiVersion)) {
      if (process.env.NODE_ENV !== 'production') {
        logWarnOnce('The `this.style` API within LightningElement returning the CSSStyleDeclaration is ' + 'only supported in API version 62 and above. Increase the API version to use it.');
      }
      // Simulate the old behavior for `this.style` to avoid a breaking change
      return undefined;
    }
    return renderer.getStyle(elm);
  },
  render() {
    const vm = getAssociatedVM(this);
    return vm.def.template;
  },
  toString() {
    const vm = getAssociatedVM(this);
    return `[object ${vm.def.name}]`;
  }
};
const queryAndChildGetterDescriptors = create(null);
const queryMethods = ['getElementsByClassName', 'getElementsByTagName', 'querySelector', 'querySelectorAll'];
// Generic passthrough for query APIs on HTMLElement to the relevant Renderer APIs
for (const queryMethod of queryMethods) {
  queryAndChildGetterDescriptors[queryMethod] = {
    value(arg) {
      const vm = getAssociatedVM(this);
      const {
        elm,
        renderer
      } = vm;
      if (process.env.NODE_ENV !== 'production') {
        warnIfInvokedDuringConstruction(vm, `${queryMethod}()`);
      }
      return renderer[queryMethod](elm, arg);
    },
    configurable: true,
    enumerable: true,
    writable: true
  };
}
defineProperties(LightningElement.prototype, queryAndChildGetterDescriptors);
const lightningBasedDescriptors = create(null);
for (const propName in HTMLElementOriginalDescriptors) {
  lightningBasedDescriptors[propName] = createBridgeToElementDescriptor(propName, HTMLElementOriginalDescriptors[propName]);
}
// Apply ARIA reflection to LightningElement.prototype, on both the browser and server.
// This allows `this.aria*` property accessors to work from inside a component, and to reflect `aria-*` attrs.
// Note this works regardless of whether the global ARIA reflection polyfill is applied or not.
{
  // In the browser, we use createBridgeToElementDescriptor, so we can get the normal reactivity lifecycle for
  // aria* properties
  for (const [propName, descriptor] of entries(ariaReflectionPolyfillDescriptors)) {
    lightningBasedDescriptors[propName] = createBridgeToElementDescriptor(propName, descriptor);
  }
}
defineProperties(LightningElement.prototype, lightningBasedDescriptors);
defineProperty(LightningElement, 'CustomElementConstructor', {
  get() {
    // If required, a runtime-specific implementation must be defined.
    throw new ReferenceError('The current runtime does not support CustomElementConstructor.');
  },
  configurable: true
});

/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const AdapterToTokenMap = new Map();
function createContextWatcher(vm, wireDef, callbackWhenContextIsReady) {
  const {
    adapter
  } = wireDef;
  const adapterContextToken = AdapterToTokenMap.get(adapter);
  if (isUndefined$1(adapterContextToken)) {
    return; // no provider found, nothing to be done
  }
  const {
    elm,
    context: {
      wiredConnecting,
      wiredDisconnecting
    },
    renderer: {
      registerContextConsumer
    }
  } = vm;
  // waiting for the component to be connected to formally request the context via the token
  ArrayPush$1.call(wiredConnecting, () => {
    // This will attempt to connect the current element with one of its anscestors
    // that can provide context for the given wire adapter. This relationship is
    // keyed on the secret & internal value of `adapterContextToken`, which is unique
    // to a given wire adapter.
    //
    // Depending on the runtime environment, this connection is made using either DOM
    // events (in the browser) or a custom traversal (on the server).
    registerContextConsumer(elm, adapterContextToken, {
      setNewContext(newContext) {
        // eslint-disable-next-line @lwc/lwc-internal/no-invalid-todo
        // TODO: dev-mode validation of config based on the adapter.contextSchema
        callbackWhenContextIsReady(newContext);
        // Return true as the context is always consumed here and the consumer should
        // stop bubbling.
        return true;
      },
      setDisconnectedCallback(disconnectCallback) {
        // adds this callback into the disconnect bucket so it gets disconnected from parent
        // the the element hosting the wire is disconnected
        ArrayPush$1.call(wiredDisconnecting, disconnectCallback);
      }
    });
  });
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const DeprecatedWiredElementHost = '$$DeprecatedWiredElementHostKey$$';
const DeprecatedWiredParamsMeta = '$$DeprecatedWiredParamsMetaKey$$';
const WIRE_DEBUG_ENTRY = '@wire';
const WireMetaMap = new Map();
function createFieldDataCallback(vm, name) {
  return value => {
    updateComponentValue(vm, name, value);
  };
}
function createMethodDataCallback(vm, method) {
  return value => {
    // dispatching new value into the wired method
    runWithBoundaryProtection(vm, vm.owner, noop, () => {
      // job
      method.call(vm.component, value);
    }, noop);
  };
}
function createConfigWatcher(component, configCallback, callbackWhenConfigIsReady) {
  let hasPendingConfig = false;
  // creating the reactive observer for reactive params when needed
  const ro = createReactiveObserver(() => {
    if (hasPendingConfig === false) {
      hasPendingConfig = true;
      // collect new config in the micro-task
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      Promise.resolve().then(() => {
        hasPendingConfig = false;
        // resetting current reactive params
        ro.reset();
        // dispatching a new config due to a change in the configuration
        computeConfigAndUpdate();
      });
    }
  });
  if (process.env.NODE_ENV !== 'production') {
    associateReactiveObserverWithVM(ro, getAssociatedVM(component));
  }
  const computeConfigAndUpdate = () => {
    let config;
    ro.observe(() => config = configCallback(component));
    // eslint-disable-next-line @lwc/lwc-internal/no-invalid-todo
    // TODO: dev-mode validation of config based on the adapter.configSchema
    // @ts-expect-error it is assigned in the observe() callback
    callbackWhenConfigIsReady(config);
  };
  return {
    computeConfigAndUpdate,
    ro
  };
}
function createConnector(vm, name, wireDef) {
  const {
    method,
    adapter,
    configCallback,
    dynamic
  } = wireDef;
  let debugInfo;
  if (process.env.NODE_ENV !== 'production') {
    const wiredPropOrMethod = isUndefined$1(method) ? name : method.name;
    debugInfo = create(null);
    debugInfo.wasDataProvisionedForConfig = false;
    vm.debugInfo[WIRE_DEBUG_ENTRY][wiredPropOrMethod] = debugInfo;
  }
  const fieldOrMethodCallback = isUndefined$1(method) ? createFieldDataCallback(vm, name) : createMethodDataCallback(vm, method);
  const dataCallback = value => {
    if (process.env.NODE_ENV !== 'production') {
      debugInfo.data = value;
      // Note: most of the time, the data provided is for the current config, but there may be
      // some conditions in which it does not, ex:
      // race conditions in a poor network while the adapter does not cancel a previous request.
      debugInfo.wasDataProvisionedForConfig = true;
    }
    fieldOrMethodCallback(value);
  };
  let context;
  let connector;
  // Workaround to pass the component element associated to this wire adapter instance.
  defineProperty(dataCallback, DeprecatedWiredElementHost, {
    value: vm.elm
  });
  defineProperty(dataCallback, DeprecatedWiredParamsMeta, {
    value: dynamic
  });
  runWithBoundaryProtection(vm, vm, noop, () => {
    // job
    connector = new adapter(dataCallback, {
      tagName: vm.tagName
    });
  }, noop);
  const updateConnectorConfig = config => {
    // every time the config is recomputed due to tracking,
    // this callback will be invoked with the new computed config
    runWithBoundaryProtection(vm, vm, noop, () => {
      // job
      if (process.env.NODE_ENV !== 'production') {
        debugInfo.config = config;
        debugInfo.context = context;
        debugInfo.wasDataProvisionedForConfig = false;
      }
      connector.update(config, context);
    }, noop);
  };
  // Computes the current wire config and calls the update method on the wire adapter.
  // If it has params, we will need to observe changes in the next tick.
  const {
    computeConfigAndUpdate,
    ro
  } = createConfigWatcher(vm.component, configCallback, updateConnectorConfig);
  // if the adapter needs contextualization, we need to watch for new context and push it alongside the config
  if (!isUndefined$1(adapter.contextSchema)) {
    createContextWatcher(vm, wireDef, newContext => {
      // every time the context is pushed into this component,
      // this callback will be invoked with the new computed context
      if (context !== newContext) {
        context = newContext;
        // Note: when new context arrives, the config will be recomputed and pushed along side the new
        // context, this is to preserve the identity characteristics, config should not have identity
        // (ever), while context can have identity
        if (vm.state === 1 /* VMState.connected */) {
          computeConfigAndUpdate();
        }
      }
    });
  }
  return {
    // @ts-expect-error the boundary protection executes sync, connector is always defined
    connector,
    computeConfigAndUpdate,
    resetConfigWatcher: () => ro.reset()
  };
}
function installWireAdapters(vm) {
  const {
    context,
    def: {
      wire
    }
  } = vm;
  if (process.env.NODE_ENV !== 'production') {
    vm.debugInfo[WIRE_DEBUG_ENTRY] = create(null);
  }
  const wiredConnecting = context.wiredConnecting = [];
  const wiredDisconnecting = context.wiredDisconnecting = [];
  for (const fieldNameOrMethod in wire) {
    const descriptor = wire[fieldNameOrMethod];
    const wireDef = WireMetaMap.get(descriptor);
    if (process.env.NODE_ENV !== 'production') {
      assert.invariant(wireDef, `Internal Error: invalid wire definition found.`);
    }
    if (!isUndefined$1(wireDef)) {
      const {
        connector,
        computeConfigAndUpdate,
        resetConfigWatcher
      } = createConnector(vm, fieldNameOrMethod, wireDef);
      const hasDynamicParams = wireDef.dynamic.length > 0;
      ArrayPush$1.call(wiredConnecting, () => {
        connector.connect();
        if (!lwcRuntimeFlags.ENABLE_WIRE_SYNC_EMIT) {
          if (hasDynamicParams) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            Promise.resolve().then(computeConfigAndUpdate);
            return;
          }
        }
        computeConfigAndUpdate();
      });
      ArrayPush$1.call(wiredDisconnecting, () => {
        connector.disconnect();
        resetConfigWatcher();
      });
    }
  }
}
function connectWireAdapters(vm) {
  const {
    wiredConnecting
  } = vm.context;
  for (let i = 0, len = wiredConnecting.length; i < len; i += 1) {
    wiredConnecting[i]();
  }
}
function disconnectWireAdapters(vm) {
  const {
    wiredDisconnecting
  } = vm.context;
  runWithBoundaryProtection(vm, vm, noop, () => {
    // job
    for (let i = 0, len = wiredDisconnecting.length; i < len; i += 1) {
      wiredDisconnecting[i]();
    }
  }, noop);
}
const signedDecoratorToMetaMap = new Map();
const defaultMeta = {
  apiMethods: EmptyObject,
  apiFields: EmptyObject,
  apiFieldsConfig: EmptyObject,
  wiredMethods: EmptyObject,
  wiredFields: EmptyObject,
  observedFields: EmptyObject
};
function getDecoratorsMeta(Ctor) {
  const meta = signedDecoratorToMetaMap.get(Ctor);
  return isUndefined$1(meta) ? defaultMeta : meta;
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
let warned = false;
// Only used in LWC's integration tests
if (process.env.NODE_ENV === 'test-lwc-integration') {
  window.__lwcResetWarnedOnVersionMismatch = () => {
    warned = false;
  };
}
function checkVersionMismatch(func, type) {
  const versionMatcher = func.toString().match(LWC_VERSION_COMMENT_REGEX);
  if (!isNull(versionMatcher) && !warned) {
    if (typeof process === 'object' && typeof process?.env === 'object' && process.env && process.env.SKIP_LWC_VERSION_MISMATCH_CHECK === 'true') {
      warned = true; // skip printing out version mismatch errors when env var is set
      return;
    }
    const version = versionMatcher[1];
    if (version !== LWC_VERSION) {
      warned = true; // only warn once to avoid flooding the console
      // stylesheets and templates do not have user-meaningful names, but components do
      const friendlyName = type === 'component' ? `${type} ${func.name}` : type;
      logError(`LWC WARNING: current engine is v${LWC_VERSION}, but ${friendlyName} was compiled with v${version}.\nPlease update your compiled code or LWC engine so that the versions match.\nNo further warnings will appear.`);
    }
  }
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const signedTemplateSet = new Set();
function defaultEmptyTemplate() {
  return [];
}
signedTemplateSet.add(defaultEmptyTemplate);
function isTemplateRegistered(tpl) {
  return signedTemplateSet.has(tpl);
}
/**
 * INTERNAL: This function can only be invoked by compiled code. The compiler
 * will prevent this function from being imported by userland code.
 * @param tpl
 */
function registerTemplate(tpl) {
  if (process.env.NODE_ENV !== 'production') {
    checkVersionMismatch(tpl, 'template');
  }
  signedTemplateSet.add(tpl);
  // chaining this method as a way to wrap existing
  // assignment of templates easily, without too much transformation
  return tpl;
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * This module is responsible for creating the base bridge class BaseBridgeElement
 * that represents the HTMLElement extension used for any LWC inserted in the DOM.
 */
// A bridge descriptor is a descriptor whose job is just to get the component instance
// from the element instance, and get the value or set a new value on the component.
// This means that across different elements, similar names can get the exact same
// descriptor, so we can cache them:
const cachedGetterByKey = create(null);
const cachedSetterByKey = create(null);
function assertPublicBridgeMember(vm, memberMap, memberName) {
  if (!hasOwnProperty$1.call(memberMap, memberName)) {
    throw new TypeError(`Invalid attempt to access "${memberName}" on <${vm.def.name}>. This member is not a public property or method of the component.`);
  }
}
function createGetter(key) {
  let fn = cachedGetterByKey[key];
  if (isUndefined$1(fn)) {
    fn = cachedGetterByKey[key] = function () {
      const vm = getAssociatedVM(this);
      assertPublicBridgeMember(vm, vm.def.props, key);
      const {
        getHook
      } = vm;
      return getHook(vm.component, key);
    };
  }
  return fn;
}
function createSetter(key) {
  let fn = cachedSetterByKey[key];
  if (isUndefined$1(fn)) {
    fn = cachedSetterByKey[key] = function (newValue) {
      const vm = getAssociatedVM(this);
      assertPublicBridgeMember(vm, vm.def.props, key);
      const {
        setHook
      } = vm;
      newValue = getReadOnlyProxy(newValue);
      setHook(vm.component, key, newValue);
    };
  }
  return fn;
}
function createMethodCaller(methodName) {
  return function () {
    const vm = getAssociatedVM(this);
    assertPublicBridgeMember(vm, vm.def.methods, methodName);
    const {
      callHook,
      component
    } = vm;
    const fn = component[methodName];
    return callHook(vm.component, fn, ArraySlice.call(arguments));
  };
}
function createAttributeChangedCallback(attributeToPropMap, superAttributeChangedCallback) {
  return function attributeChangedCallback(attrName, oldValue, newValue) {
    // W-17420330 & W-23590585
    if (this instanceof BaseBridgeElement || lwcRuntimeFlags.ENABLE_LEGACY_ATTRIBUTE_CHANGED_CALLBACK) {
      if (oldValue === newValue) {
        // Ignore same values.
        return;
      }
      const propName = attributeToPropMap[attrName];
      if (isUndefined$1(propName)) {
        if (!isUndefined$1(superAttributeChangedCallback)) {
          // delegate unknown attributes to the super.
          // Typescript does not like it when you treat the `arguments` object as an array
          // @ts-expect-error type-mismatch
          superAttributeChangedCallback.apply(this, arguments);
        }
        return;
      }
      // Reflect attribute change to the corresponding property when changed from outside.
      this[propName] = newValue;
    }
  };
}
function createAccessorThatWarns(propName) {
  let prop;
  return {
    get() {
      logWarn(`The property "${propName}" is not publicly accessible. Add the @api annotation to the property declaration or getter/setter in the component to make it accessible.`);
      return prop;
    },
    set(value) {
      logWarn(`The property "${propName}" is not publicly accessible. Add the @api annotation to the property declaration or getter/setter in the component to make it accessible.`);
      prop = value;
    },
    enumerable: true,
    configurable: true
  };
}
function HTMLBridgeElementFactory(SuperClass, publicProperties, methods, observedFields, proto, hasCustomSuperClass) {
  const HTMLBridgeElement = class extends SuperClass {
    /*LWC compiler v9.5.3*/
  };
  // generating the hash table for attributes to avoid duplicate fields and facilitate validation
  // and false positives in case of inheritance.
  const attributeToPropMap = create(null);
  const {
    attributeChangedCallback: superAttributeChangedCallback
  } = SuperClass.prototype;
  const {
    observedAttributes: superObservedAttributes = []
  } = SuperClass;
  const descriptors = create(null);
  // present a hint message so that developers are aware that they have not decorated property with @api
  // Note that we also don't do this in SSR because we cannot sniff for what props are declared on
  // HTMLElementPrototype, and it seems not worth it to have these dev-only warnings there, since
  // an `in` check could mistakenly assume that a prop is declared on a LightningElement prototype.
  if (process.env.NODE_ENV !== 'production' && true) {
    // TODO [#3761]: enable for components that don't extend from LightningElement
    if (!isUndefined$1(proto) && !isNull(proto) && !hasCustomSuperClass) {
      const nonPublicPropertiesToWarnOn = new Set([
      // getters, setters, and methods
      ...keys(getOwnPropertyDescriptors(proto)),
      // class properties
      ...observedFields]
      // we don't want to override HTMLElement props because these are meaningful in other ways,
      // and can break tooling that expects it to be iterable or defined, e.g. Jest:
      // https://github.com/jestjs/jest/blob/b4c9587/packages/pretty-format/src/plugins/DOMElement.ts#L95
      // It also doesn't make sense to override e.g. "constructor".
      .filter(propName => !(propName in HTMLElementPrototype) && !(propName in ariaReflectionPolyfillDescriptors)));
      for (const propName of nonPublicPropertiesToWarnOn) {
        if (ArrayIndexOf.call(publicProperties, propName) === -1) {
          descriptors[propName] = createAccessorThatWarns(propName);
        }
      }
    }
  }
  // expose getters and setters for each public props on the new Element Bridge
  for (let i = 0, len = publicProperties.length; i < len; i += 1) {
    const propName = publicProperties[i];
    attributeToPropMap[htmlPropertyToAttribute(propName)] = propName;
    descriptors[propName] = {
      get: createGetter(propName),
      set: createSetter(propName),
      enumerable: true,
      configurable: true
    };
  }
  // expose public methods as props on the new Element Bridge
  for (let i = 0, len = methods.length; i < len; i += 1) {
    const methodName = methods[i];
    descriptors[methodName] = {
      value: createMethodCaller(methodName),
      writable: true,
      configurable: true
    };
  }
  // creating a new attributeChangedCallback per bridge because they are bound to the corresponding
  // map of attributes to props. We do this after all other props and methods to avoid the possibility
  // of getting overrule by a class declaration in user-land, and we make it non-writable, non-configurable
  // to preserve this definition.
  descriptors.attributeChangedCallback = {
    value: createAttributeChangedCallback(attributeToPropMap, superAttributeChangedCallback)
  };
  // To avoid leaking private component details, accessing internals from outside a component is not allowed.
  descriptors.attachInternals = {
    set() {
      if (process.env.NODE_ENV !== 'production') {
        logWarn('attachInternals cannot be accessed outside of a component. Use this.attachInternals instead.');
      }
    },
    get() {
      if (process.env.NODE_ENV !== 'production') {
        logWarn('attachInternals cannot be accessed outside of a component. Use this.attachInternals instead.');
      }
    }
  };
  descriptors.formAssociated = {
    set() {
      if (process.env.NODE_ENV !== 'production') {
        logWarn('formAssociated cannot be accessed outside of a component. Set the value within the component class.');
      }
    },
    get() {
      if (process.env.NODE_ENV !== 'production') {
        logWarn('formAssociated cannot be accessed outside of a component. Set the value within the component class.');
      }
    }
  };
  // Specify attributes for which we want to reflect changes back to their corresponding
  // properties via attributeChangedCallback.
  defineProperty(HTMLBridgeElement, 'observedAttributes', {
    get() {
      return [...superObservedAttributes, ...keys(attributeToPropMap)];
    }
  });
  defineProperties(HTMLBridgeElement.prototype, descriptors);
  return HTMLBridgeElement;
}
// We do some special handling of non-standard ARIA props like ariaLabelledBy as well as props without (as of this
// writing) broad cross-browser support like ariaBrailleLabel. This is so the reflection works correctly and preserves
// backwards compatibility with the previous global polyfill approach.
//
// The goal here is to expose `elm.aria*` property accessors to work from outside a component, and to reflect `aria-*`
// attrs. This is especially important because the template compiler compiles aria-* attrs on components to aria* props.
// Note this works regardless of whether the global ARIA reflection polyfill is applied or not.
//
// Also note this ARIA reflection only really makes sense in the browser. On the server, there is no
// `renderedCallback()`, so you cannot do e.g. `this.template.querySelector('x-child').ariaBusy = 'true'`. So we don't
// need to expose ARIA props outside the LightningElement
const basePublicProperties = [...getOwnPropertyNames$1(HTMLElementOriginalDescriptors), ...getOwnPropertyNames$1(ariaReflectionPolyfillDescriptors)];
const BaseBridgeElement = HTMLBridgeElementFactory(HTMLElementConstructor, basePublicProperties, [], [], null, false);
freeze(BaseBridgeElement);
seal(BaseBridgeElement.prototype);

/*
 * Copyright (c) 2025, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const VALID_SCOPE_TOKEN_REGEX = /^[a-zA-Z0-9\-_]+$/;
// These are only used for HMR in dev mode
// The "pure" annotations are so that Rollup knows for sure it can remove these from prod mode
let stylesheetsToCssContent = /*@__PURE__@*/new WeakMap();
let cssContentToAbortControllers = /*@__PURE__@*/new Map();
// Only used in LWC's integration tests
if (process.env.NODE_ENV === 'test-lwc-integration') {
  // Used to reset the global state between test runs
  window.__lwcResetStylesheetCache = () => {
    stylesheetsToCssContent = new WeakMap();
    cssContentToAbortControllers = new Map();
  };
}
function linkStylesheetToCssContentInDevMode(stylesheet, cssContent) {
  // Should never leak to prod; only used for HMR
  assertNotProd();
  let cssContents = stylesheetsToCssContent.get(stylesheet);
  if (isUndefined$1(cssContents)) {
    cssContents = new Set();
    stylesheetsToCssContent.set(stylesheet, cssContents);
  }
  cssContents.add(cssContent);
}
function getOrCreateAbortControllerInDevMode(cssContent) {
  // Should never leak to prod; only used for HMR
  assertNotProd();
  let abortController = cssContentToAbortControllers.get(cssContent);
  if (isUndefined$1(abortController)) {
    abortController = new AbortController();
    cssContentToAbortControllers.set(cssContent, abortController);
  }
  return abortController;
}
function getOrCreateAbortSignal(cssContent) {
  // abort controller/signal is only used for HMR in development
  if (process.env.NODE_ENV !== 'production') {
    return getOrCreateAbortControllerInDevMode(cssContent).signal;
  }
  return undefined;
}
function makeHostToken(token) {
  // Note: if this ever changes, update the `cssScopeTokens` returned by `@lwc/compiler`
  return `${token}-host`;
}
function createInlineStyleVNode(content) {
  return api.h('style', {
    key: 'style',
    // special key
    attrs: {
      type: 'text/css'
    }
  }, [api.t(content)]);
}
function updateStylesheetToken(vm, template) {
  const {
    elm,
    context,
    renderMode,
    shadowMode,
    renderer: {
      getClassList,
      removeAttribute,
      setAttribute
    }
  } = vm;
  const {
    stylesheets: newStylesheets
  } = template;
  const newStylesheetToken = template.stylesheetToken;
  const {
    stylesheets: newVmStylesheets
  } = vm;
  const isSyntheticShadow = renderMode === 1 /* RenderMode.Shadow */ && shadowMode === 1 /* ShadowMode.Synthetic */;
  const {
    hasScopedStyles
  } = context;
  let newToken;
  let newHasTokenInClass;
  let newHasTokenInAttribute;
  // Reset the styling token applied to the host element.
  const oldToken = context.stylesheetToken;
  const oldHasTokenInClass = context.hasTokenInClass;
  const oldHasTokenInAttribute = context.hasTokenInAttribute;
  if (!isUndefined$1(oldToken)) {
    if (oldHasTokenInClass) {
      getClassList(elm).remove(makeHostToken(oldToken));
    }
    if (oldHasTokenInAttribute) {
      removeAttribute(elm, makeHostToken(oldToken));
    }
  }
  // Apply the new template styling token to the host element, if the new template has any
  // associated stylesheets. In the case of light DOM, also ensure there is at least one scoped stylesheet.
  const hasNewStylesheets = hasStyles(newStylesheets);
  const hasNewVmStylesheets = hasStyles(newVmStylesheets);
  if (hasNewStylesheets || hasNewVmStylesheets) {
    newToken = newStylesheetToken;
  }
  // Set the new styling token on the host element
  if (!isUndefined$1(newToken)) {
    if (hasScopedStyles) {
      const hostScopeTokenClass = makeHostToken(newToken);
      getClassList(elm).add(hostScopeTokenClass);
      newHasTokenInClass = true;
    }
    if (isSyntheticShadow) {
      setAttribute(elm, makeHostToken(newToken), '');
      newHasTokenInAttribute = true;
    }
  }
  // Update the styling tokens present on the context object.
  context.stylesheetToken = newToken;
  context.hasTokenInClass = newHasTokenInClass;
  context.hasTokenInAttribute = newHasTokenInAttribute;
}
function evaluateStylesheetsContent(stylesheets, stylesheetToken, vm) {
  const content = [];
  let root;
  for (let i = 0; i < stylesheets.length; i++) {
    let stylesheet = stylesheets[i];
    if (isArray$1(stylesheet)) {
      ArrayPush$1.apply(content, evaluateStylesheetsContent(stylesheet, stylesheetToken, vm));
    } else {
      if (process.env.NODE_ENV !== 'production') {
        // Check for compiler version mismatch in dev mode only
        checkVersionMismatch(stylesheet, 'stylesheet');
        // in dev-mode, we support hot swapping of stylesheet, which means that
        // the component instance might be attempting to use an old version of
        // the stylesheet, while internally, we have a replacement for it.
        stylesheet = getStyleOrSwappedStyle(stylesheet);
      }
      const isScopedCss = isTrue(stylesheet[KEY__SCOPED_CSS]);
      const isNativeOnlyCss = isTrue(stylesheet[KEY__NATIVE_ONLY_CSS]);
      const {
        renderMode,
        shadowMode
      } = vm;
      if (lwcRuntimeFlags.DISABLE_LIGHT_DOM_UNSCOPED_CSS && !isScopedCss && renderMode === 0 /* RenderMode.Light */) {
        logError('Unscoped CSS is not supported in Light DOM in this environment. Please use scoped CSS ' + '(*.scoped.css) instead of unscoped CSS (*.css). See also: https://sfdc.co/scoped-styles-light-dom');
        continue;
      }
      // Apply the scope token only if the stylesheet itself is scoped, or if we're rendering synthetic shadow.
      const scopeToken = isScopedCss || shadowMode === 1 /* ShadowMode.Synthetic */ && renderMode === 1 /* RenderMode.Shadow */ ? stylesheetToken : undefined;
      // Use the actual `:host` selector if we're rendering global CSS for light DOM, or if we're rendering
      // native shadow DOM. Synthetic shadow DOM never uses `:host`.
      const useActualHostSelector = renderMode === 0 /* RenderMode.Light */ ? !isScopedCss : shadowMode === 0 /* ShadowMode.Native */;
      // Use the native :dir() pseudoclass only in native shadow DOM. Otherwise, in synthetic shadow,
      // we use an attribute selector on the host to simulate :dir().
      let useNativeDirPseudoclass;
      if (renderMode === 1 /* RenderMode.Shadow */) {
        useNativeDirPseudoclass = shadowMode === 0 /* ShadowMode.Native */;
      } else {
        // Light DOM components should only render `[dir]` if they're inside of a synthetic shadow root.
        // At the top level (root is null) or inside of a native shadow root, they should use `:dir()`.
        if (isUndefined$1(root)) {
          // Only calculate the root once as necessary
          root = getNearestShadowComponent(vm);
        }
        useNativeDirPseudoclass = isNull(root) || root.shadowMode === 0 /* ShadowMode.Native */;
      }
      let cssContent;
      if (isNativeOnlyCss && renderMode === 1 /* RenderMode.Shadow */ && shadowMode === 1 /* ShadowMode.Synthetic */) {
        // Native-only (i.e. disableSyntheticShadowSupport) CSS should be ignored entirely
        // in synthetic shadow. It's fine to use in either native shadow or light DOM, but in
        // synthetic shadow it wouldn't be scoped properly and so should be ignored.
        cssContent = '/* ignored native-only CSS */';
      } else {
        cssContent = stylesheet(scopeToken, useActualHostSelector, useNativeDirPseudoclass);
      }
      if (process.env.NODE_ENV !== 'production') {
        linkStylesheetToCssContentInDevMode(stylesheet, cssContent);
      }
      ArrayPush$1.call(content, cssContent);
    }
  }
  return content;
}
function getStylesheetsContent(vm, template) {
  const {
    stylesheets,
    stylesheetToken
  } = template;
  const {
    stylesheets: vmStylesheets
  } = vm;
  if (!isUndefined$1(stylesheetToken) && !isValidScopeToken(stylesheetToken)) {
    throw new Error('stylesheet token must be a valid string');
  }
  const hasTemplateStyles = hasStyles(stylesheets);
  const hasVmStyles = hasStyles(vmStylesheets);
  if (hasTemplateStyles) {
    const content = evaluateStylesheetsContent(stylesheets, stylesheetToken, vm);
    if (hasVmStyles) {
      // Slow path – merge the template styles and vm styles
      ArrayPush$1.apply(content, evaluateStylesheetsContent(vmStylesheets, stylesheetToken, vm));
    }
    return content;
  }
  if (hasVmStyles) {
    // No template styles, so return vm styles directly
    return evaluateStylesheetsContent(vmStylesheets, stylesheetToken, vm);
  }
  // Fastest path - no styles, so return an empty array
  return EmptyArray;
}
// It might be worth caching this to avoid doing the lookup repeatedly, but
// perf testing has not shown it to be a huge improvement yet:
// https://github.com/salesforce/lwc/pull/2460#discussion_r691208892
function getNearestShadowComponent(vm) {
  let owner = vm;
  while (!isNull(owner)) {
    if (owner.renderMode === 1 /* RenderMode.Shadow */) {
      return owner;
    }
    owner = owner.owner;
  }
  return owner;
}
/**
 * If the component that is currently being rendered uses scoped styles,
 * this returns the unique token for that scoped stylesheet. Otherwise
 * it returns null.
 * @param owner
 */
function getScopeTokenClass(owner) {
  const {
    cmpTemplate,
    context
  } = owner;
  return context.hasScopedStyles && cmpTemplate?.stylesheetToken || null;
}
function getNearestNativeShadowComponent(vm) {
  const owner = getNearestShadowComponent(vm);
  if (!isNull(owner) && owner.shadowMode === 1 /* ShadowMode.Synthetic */) {
    // Synthetic-within-native is impossible. So if the nearest shadow component is
    // synthetic, we know we won't find a native component if we go any further.
    return null;
  }
  return owner;
}
function createStylesheet(vm, stylesheets) {
  const {
    renderMode,
    shadowMode,
    renderer: {
      insertStylesheet
    }
  } = vm;
  if (renderMode === 1 /* RenderMode.Shadow */ && shadowMode === 1 /* ShadowMode.Synthetic */) {
    for (let i = 0; i < stylesheets.length; i++) {
      const stylesheet = stylesheets[i];
      insertStylesheet(stylesheet, undefined, getOrCreateAbortSignal(stylesheet));
    }
  } else if (vm.hydrated) {
    // Note: We need to ensure that during hydration, the stylesheets method is the same as those in ssr.
    //       This works in the client, because the stylesheets are created, and cached in the VM
    //       the first time the VM renders.
    // native shadow or light DOM, SSR
    return ArrayMap.call(stylesheets, createInlineStyleVNode);
  } else {
    // native shadow or light DOM, DOM renderer
    const root = getNearestNativeShadowComponent(vm);
    // null root means a global style
    const target = isNull(root) ? undefined : root.shadowRoot;
    for (let i = 0; i < stylesheets.length; i++) {
      const stylesheet = stylesheets[i];
      insertStylesheet(stylesheet, target, getOrCreateAbortSignal(stylesheet));
    }
  }
  return null;
}
function isValidScopeToken(token) {
  if (!isString(token)) {
    return false;
  }
  // See W-16614556
  return VALID_SCOPE_TOKEN_REGEX.test(token);
}

/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * A map where the keys are weakly held and the values are a Set that are also each weakly held.
 * The goal is to avoid leaking the values, which is what would happen with a WeakMap<K, Set<V>>.
 *
 * Note that this is currently only intended to be used in dev/PRODDEBUG environments.
 *
 * This implementation relies on WeakRefs and FinalizationRegistry.
 * For some background, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef
 */
class WeakMultiMap {
  constructor() {
    this._map = new WeakMap();
    this._registry = new FinalizationRegistry(weakRefs => {
      // This should be considered an optional cleanup method to remove GC'ed values from their respective arrays.
      // JS VMs are not obligated to call FinalizationRegistry callbacks.
      // Work backwards, removing stale VMs
      for (let i = weakRefs.length - 1; i >= 0; i--) {
        const vm = weakRefs[i].deref();
        if (isUndefined$1(vm)) {
          ArraySplice.call(weakRefs, i, 1); // remove
        }
      }
    });
  }
  _getWeakRefs(key) {
    let weakRefs = this._map.get(key);
    if (isUndefined$1(weakRefs)) {
      weakRefs = [];
      this._map.set(key, weakRefs);
    }
    return weakRefs;
  }
  get(key) {
    const weakRefs = this._getWeakRefs(key);
    const result = new Set();
    for (const weakRef of weakRefs) {
      const vm = weakRef.deref();
      if (!isUndefined$1(vm)) {
        result.add(vm);
      }
    }
    return result;
  }
  add(key, value) {
    const weakRefs = this._getWeakRefs(key);
    // Skip adding if already present
    for (const weakRef of weakRefs) {
      if (weakRef.deref() === value) {
        return;
      }
    }
    ArrayPush$1.call(weakRefs, new WeakRef(value));
    // It's important here not to leak the second argument, which is the "held value." The FinalizationRegistry
    // effectively creates a strong reference between the first argument (the "target") and the held value. When
    // the target is GC'ed, the callback is called, and then the held value is GC'ed.
    // Putting the key here would mean the key is not GC'ed until the value is GC'ed, which defeats the purpose
    // of the WeakMap. Whereas putting the weakRefs array here is fine, because it doesn't have a strong reference
    // to anything. See also this example:
    // https://gist.github.com/nolanlawson/79a3d36e8e6cc25c5048bb17c1795aea
    this._registry.register(value, weakRefs);
  }
  delete(key) {
    this._map.delete(key);
  }
}

/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
let swappedTemplateMap = /*@__PURE__@*/new WeakMap();
let swappedComponentMap = /*@__PURE__@*/new WeakMap();
let swappedStyleMap = /*@__PURE__@*/new WeakMap();
// The important thing here is the weak values – VMs are transient (one per component instance) and should be GC'ed,
// so we don't want to create strong references to them.
// The weak keys are kind of useless, because Templates, LightningElementConstructors, and Stylesheets are
// never GC'ed. But maybe they will be someday, so we may as well use weak keys too.
// The "pure" annotations are so that Rollup knows for sure it can remove these from prod mode
let activeTemplates = /*@__PURE__@*/new WeakMultiMap();
let activeComponents = /*@__PURE__@*/new WeakMultiMap();
let activeStyles = /*@__PURE__@*/new WeakMultiMap();
// Only used in LWC's integration tests
if (process.env.NODE_ENV === 'test-lwc-integration') {
  // Used to reset the global state between test runs
  window.__lwcResetHotSwaps = () => {
    swappedTemplateMap = new WeakMap();
    swappedComponentMap = new WeakMap();
    swappedStyleMap = new WeakMap();
    activeTemplates = new WeakMultiMap();
    activeComponents = new WeakMultiMap();
    activeStyles = new WeakMultiMap();
  };
}
function getTemplateOrSwappedTemplate(tpl) {
  assertNotProd(); // this method should never leak to prod
  // TODO [#4154]: shows stale content when swapping content back and forth multiple times
  const visited = new Set();
  while (swappedTemplateMap.has(tpl) && !visited.has(tpl)) {
    visited.add(tpl);
    tpl = swappedTemplateMap.get(tpl);
  }
  return tpl;
}
function getComponentOrSwappedComponent(Ctor) {
  assertNotProd(); // this method should never leak to prod
  // TODO [#4154]: shows stale content when swapping content back and forth multiple times
  const visited = new Set();
  while (swappedComponentMap.has(Ctor) && !visited.has(Ctor)) {
    visited.add(Ctor);
    Ctor = swappedComponentMap.get(Ctor);
  }
  return Ctor;
}
function getStyleOrSwappedStyle(style) {
  assertNotProd(); // this method should never leak to prod
  // TODO [#4154]: shows stale content when swapping content back and forth multiple times
  const visited = new Set();
  while (swappedStyleMap.has(style) && !visited.has(style)) {
    visited.add(style);
    style = swappedStyleMap.get(style);
  }
  return style;
}
function addActiveStylesheets(stylesheets, vm) {
  if (isUndefined$1(stylesheets) || isNull(stylesheets)) {
    // Ignore non-existent stylesheets
    return;
  }
  for (const stylesheet of flattenStylesheets(stylesheets)) {
    // this is necessary because we don't hold the list of styles
    // in the vm, we only hold the selected (already swapped template)
    // but the styles attached to the template might not be the actual
    // active ones, but the swapped versions of those.
    const swappedStylesheet = getStyleOrSwappedStyle(stylesheet);
    // this will allow us to keep track of the stylesheet that are
    // being used by a hot component
    activeStyles.add(swappedStylesheet, vm);
  }
}
function setActiveVM(vm) {
  assertNotProd(); // this method should never leak to prod
  // tracking active component
  const Ctor = vm.def.ctor;
  // this will allow us to keep track of the hot components
  activeComponents.add(Ctor, vm);
  // tracking active template
  const template = vm.cmpTemplate;
  if (!isNull(template)) {
    // this will allow us to keep track of the templates that are
    // being used by a hot component
    activeTemplates.add(template, vm);
    // Tracking active styles from the template or the VM. `template.stylesheets` are implicitly associated
    // (e.g. `foo.css` associated with `foo.html`), whereas `vm.stylesheets` are from `static stylesheets`.
    addActiveStylesheets(template.stylesheets, vm);
    addActiveStylesheets(vm.stylesheets, vm);
  }
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * This module is responsible for producing the ComponentDef object that is always
 * accessible via `vm.def`. This is lazily created during the creation of the first
 * instance of a component class, and shared across all instances.
 *
 * This structure can be used to synthetically create proxies, and understand the
 * shape of a component. It is also used internally to apply extra optimizations.
 */
const CtorToDefMap = new WeakMap();
function getCtorProto(Ctor) {
  let proto = getPrototypeOf$1(Ctor);
  if (isNull(proto)) {
    throw new ReferenceError(`Invalid prototype chain for ${Ctor.name}, you must extend LightningElement.`);
  }
  // covering the cases where the ref is circular in AMD
  if (isCircularModuleDependency(proto)) {
    const p = resolveCircularModuleDependency(proto);
    if (process.env.NODE_ENV !== 'production') {
      if (isNull(p)) {
        throw new ReferenceError(`Circular module dependency for ${Ctor.name}, must resolve to a constructor that extends LightningElement.`);
      }
    }
    // escape hatch for Locker and other abstractions to provide their own base class instead
    // of our Base class without having to leak it to user-land. If the circular function returns
    // itself, that's the signal that we have hit the end of the proto chain, which must always
    // be base.
    proto = p === proto ? LightningElement : p;
  }
  return proto;
}
function createComponentDef(Ctor) {
  // Enforce component-level feature flag if provided at compile time
  if (!isComponentFeatureEnabled(Ctor)) {
    const metadata = getComponentMetadata(Ctor);
    const componentName = Ctor.name || metadata?.sel || 'Unknown';
    const componentFeatureFlagPath = metadata?.componentFeatureFlag?.path || 'Unknown';
    throw new Error(`Component ${componentName} is disabled by the feature flag at ${componentFeatureFlagPath}.`);
  }
  const {
    shadowSupportMode: ctorShadowSupportMode,
    renderMode: ctorRenderMode,
    formAssociated: ctorFormAssociated
  } = Ctor;
  if (process.env.NODE_ENV !== 'production') {
    const ctorName = Ctor.name;
    // Removing the following assert until https://bugs.webkit.org/show_bug.cgi?id=190140 is fixed.
    // assert.isTrue(ctorName && isString(ctorName), `${toString(Ctor)} should have a "name" property with string value, but found ${ctorName}.`);
    if (!Ctor.constructor) {
      // This error seems impossible to hit, due to an earlier check in `isComponentConstructor()`.
      // But we keep it here just in case.
      logError(`Missing ${ctorName}.constructor, ${ctorName} should have a "constructor" property.`);
    }
    if (!isUndefined$1(ctorShadowSupportMode) && ctorShadowSupportMode !== 'any' && ctorShadowSupportMode !== 'reset' && ctorShadowSupportMode !== 'native') {
      logError(`Invalid value for static property shadowSupportMode: '${ctorShadowSupportMode}'`);
    }
    // TODO [#3971]: Completely remove shadowSupportMode "any"
    if (ctorShadowSupportMode === 'any') {
      logWarn(`Invalid value 'any' for static property shadowSupportMode. 'any' is deprecated and will be removed in a future release--use 'native' instead.`);
    }
    if (!isUndefined$1(ctorRenderMode) && ctorRenderMode !== 'light' && ctorRenderMode !== 'shadow') {
      logError(`Invalid value for static property renderMode: '${ctorRenderMode}'. renderMode must be either 'light' or 'shadow'.`);
    }
  }
  const decoratorsMeta = getDecoratorsMeta(Ctor);
  const {
    apiFields,
    apiFieldsConfig,
    apiMethods,
    wiredFields,
    wiredMethods,
    observedFields
  } = decoratorsMeta;
  const proto = Ctor.prototype;
  let {
    connectedCallback,
    disconnectedCallback,
    renderedCallback,
    errorCallback,
    formAssociatedCallback,
    formResetCallback,
    formDisabledCallback,
    formStateRestoreCallback,
    render
  } = proto;
  const superProto = getCtorProto(Ctor);
  const hasCustomSuperClass = superProto !== LightningElement;
  const superDef = hasCustomSuperClass ? getComponentInternalDef(superProto) : lightingElementDef;
  const bridge = HTMLBridgeElementFactory(superDef.bridge, keys(apiFields), keys(apiMethods), keys(observedFields), proto, hasCustomSuperClass);
  const props = assign(create(null), superDef.props, apiFields);
  const propsConfig = assign(create(null), superDef.propsConfig, apiFieldsConfig);
  const methods = assign(create(null), superDef.methods, apiMethods);
  const wire = assign(create(null), superDef.wire, wiredFields, wiredMethods);
  connectedCallback = connectedCallback || superDef.connectedCallback;
  disconnectedCallback = disconnectedCallback || superDef.disconnectedCallback;
  renderedCallback = renderedCallback || superDef.renderedCallback;
  errorCallback = errorCallback || superDef.errorCallback;
  formAssociatedCallback = formAssociatedCallback || superDef.formAssociatedCallback;
  formResetCallback = formResetCallback || superDef.formResetCallback;
  formDisabledCallback = formDisabledCallback || superDef.formDisabledCallback;
  formStateRestoreCallback = formStateRestoreCallback || superDef.formStateRestoreCallback;
  render = render || superDef.render;
  let shadowSupportMode = superDef.shadowSupportMode;
  if (!isUndefined$1(ctorShadowSupportMode)) {
    shadowSupportMode = ctorShadowSupportMode;
  }
  let renderMode = superDef.renderMode;
  if (!isUndefined$1(ctorRenderMode)) {
    renderMode = ctorRenderMode === 'light' ? 0 /* RenderMode.Light */ : 1 /* RenderMode.Shadow */;
  }
  let formAssociated = superDef.formAssociated;
  if (!isUndefined$1(ctorFormAssociated)) {
    formAssociated = ctorFormAssociated;
  }
  const template = getComponentRegisteredTemplate(Ctor) || superDef.template;
  const name = Ctor.name || superDef.name;
  // installing observed fields into the prototype.
  defineProperties(proto, observedFields);
  const def = {
    ctor: Ctor,
    name,
    wire,
    props,
    propsConfig,
    methods,
    bridge,
    template,
    renderMode,
    shadowSupportMode,
    formAssociated,
    connectedCallback,
    disconnectedCallback,
    errorCallback,
    formAssociatedCallback,
    formDisabledCallback,
    formResetCallback,
    formStateRestoreCallback,
    renderedCallback,
    render
  };
  // This is a no-op unless Lightning DevTools are enabled.
  instrumentDef(def);
  if (process.env.NODE_ENV !== 'production') {
    freeze(Ctor.prototype);
  }
  return def;
}
/**
 * EXPERIMENTAL: This function allows for the identification of LWC constructors. This API is
 * subject to change or being removed.
 * @param ctor
 */
function isComponentConstructor(ctor) {
  if (!isFunction$1(ctor)) {
    return false;
  }
  // Fast path: LightningElement is part of the prototype chain of the constructor.
  if (ctor.prototype instanceof LightningElement) {
    return true;
  }
  // Slow path: LightningElement is not part of the prototype chain of the constructor, we need
  // climb up the constructor prototype chain to check in case there are circular dependencies
  // to resolve.
  let current = ctor;
  do {
    if (isCircularModuleDependency(current)) {
      const circularResolved = resolveCircularModuleDependency(current);
      // If the circular function returns itself, that's the signal that we have hit the end
      // of the proto chain, which must always be a valid base constructor.
      if (circularResolved === current) {
        return true;
      }
      current = circularResolved;
    }
    if (current === LightningElement) {
      return true;
    }
  } while (!isNull(current) && (current = getPrototypeOf$1(current)));
  // Finally return false if the LightningElement is not part of the prototype chain.
  return false;
}
function getComponentInternalDef(Ctor) {
  if (process.env.NODE_ENV !== 'production') {
    Ctor = getComponentOrSwappedComponent(Ctor);
  }
  let def = CtorToDefMap.get(Ctor);
  if (isUndefined$1(def)) {
    if (isCircularModuleDependency(Ctor)) {
      const resolvedCtor = resolveCircularModuleDependency(Ctor);
      def = getComponentInternalDef(resolvedCtor);
      // Cache the unresolved component ctor too. The next time if the same unresolved ctor is used,
      // look up the definition in cache instead of re-resolving and recreating the def.
      CtorToDefMap.set(Ctor, def);
      return def;
    }
    if (!isComponentConstructor(Ctor)) {
      throw new TypeError(`${Ctor} is not a valid component, or does not extends LightningElement from "lwc". You probably forgot to add the extend clause on the class declaration.`);
    }
    def = createComponentDef(Ctor);
    CtorToDefMap.set(Ctor, def);
  }
  return def;
}
function getComponentHtmlPrototype(Ctor) {
  const def = getComponentInternalDef(Ctor);
  return def.bridge;
}
const lightingElementDef = {
  name: LightningElement.name,
  props: lightningBasedDescriptors,
  propsConfig: EmptyObject,
  methods: EmptyObject,
  renderMode: 1 /* RenderMode.Shadow */,
  shadowSupportMode: 'reset',
  formAssociated: undefined,
  wire: EmptyObject,
  bridge: BaseBridgeElement,
  template: defaultEmptyTemplate,
  render: LightningElement.prototype.render
};

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function isVBaseElement(vnode) {
  const {
    type
  } = vnode;
  return type === 2 /* VNodeType.Element */ || type === 3 /* VNodeType.CustomElement */;
}
function isSameVnode(vnode1, vnode2) {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
function isVCustomElement(vnode) {
  return vnode.type === 3 /* VNodeType.CustomElement */;
}
function isVFragment(vnode) {
  return vnode.type === 5 /* VNodeType.Fragment */;
}
function isVScopedSlotFragment(vnode) {
  return vnode.type === 6 /* VNodeType.ScopedSlotFragment */;
}
function isVStatic(vnode) {
  return vnode.type === 4 /* VNodeType.Static */;
}
function isVStaticPartElement(vnode) {
  return vnode.type === 1 /* VStaticPartType.Element */;
}
function isVStaticPartText(vnode) {
  return vnode.type === 0 /* VStaticPartType.Text */;
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const sanitizedHtmlContentSymbol = Symbol('lwc-get-sanitized-html-content');
// W-23680734: brand "trusted sanitized HTML" objects by IDENTITY, not by a structural
// property/symbol. The previous brand check (`sanitizedHtmlContentSymbol in value`) and read
// (`value[sanitizedHtmlContentSymbol]`) resolve through `value`'s own property semantics, so an
// object with caller-controlled property behavior can report the brand and yield markup it does
// not legitimately hold — trust based on shape rather than provenance.
//
// A WeakMap keyed on the wrapper's identity closes that gap: `WeakMap.prototype.has`/`get`
// perform an internal-slot identity lookup that does not consult the object's property handlers,
// and only wrappers we created were ever registered — so any other object is `false` regardless
// of its shape. This mirrors the existing identity-based trust sets for signals/context in
// `@lwc/shared` (`isTrustedSignal`, `isTrustedContext`).
const sanitizedContentToString = new WeakMap();
function isSanitizedHtmlContent(object) {
  if (!isObject(object) || isNull(object)) {
    return false;
  }
  // Kill-switch: when the flag is set, fall back to the legacy structural symbol brand.
  // Present so the hardening can be disabled at runtime if it regresses a legit integration;
  // the default (flag unset) is the safe, identity-based check.
  if (lwcRuntimeFlags.DISABLE_SANITIZED_HTML_CONTENT_IDENTITY_CHECK) {
    return sanitizedHtmlContentSymbol in object;
  }
  // Identity check — only wrappers we created are members, independent of `object`'s shape.
  return sanitizedContentToString.has(object);
}
function getSanitizedContent(object) {
  if (lwcRuntimeFlags.DISABLE_SANITIZED_HTML_CONTENT_IDENTITY_CHECK) {
    return object[sanitizedHtmlContentSymbol];
  }
  // Read the sanitized string from OUR map by identity, never from a property access on
  // `object` (whose semantics may be caller-controlled).
  return sanitizedContentToString.get(object);
}
/**
 * Wrap a pre-sanitized string designated for `.innerHTML` via `lwc:inner-html`
 * as an object branded by identity in a module-private WeakMap that only we have access to.
 * @param sanitizedString
 * @returns SanitizedHtmlContent
 */
function createSanitizedHtmlContent(sanitizedString) {
  // The wrapper keeps the non-enumerable symbol property so the legacy kill-switch path and
  // any structural consumers still work; the authoritative brand is WeakMap membership.
  const wrapper = create(null, {
    [sanitizedHtmlContentSymbol]: {
      value: sanitizedString,
      configurable: false,
      writable: false
    }
  });
  sanitizedContentToString.set(wrapper, sanitizedString);
  return wrapper;
}
/**
 * Safely call setProperty on an Element while handling any SanitizedHtmlContent objects correctly
 *
 * @param setProperty - renderer.setProperty
 * @param elm - Element
 * @param key - key to set
 * @param value -  value to set
 */
function safelySetProperty(setProperty, elm, key, value) {
  // See W-16614337
  // we support setting innerHTML to `undefined` because it's inherently safe
  if ((key === 'innerHTML' || key === 'outerHTML') && !isUndefined$1(value)) {
    if (isSanitizedHtmlContent(value)) {
      // it's a SanitizedHtmlContent object
      setProperty(elm, key, getSanitizedContent(value));
    } else {
      // not a SanitizedHtmlContent object
      if (process.env.NODE_ENV !== 'production') {
        logWarn(`Cannot set property "${key}". Instead, use lwc:inner-html or lwc:dom-manual.`);
      }
    }
  } else {
    setProperty(elm, key, value);
  }
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const ColonCharCode = 58;
function patchAttributes(oldVnode, vnode, renderer) {
  const {
    data,
    elm
  } = vnode;
  const {
    attrs
  } = data;
  if (isUndefined$1(attrs)) {
    return;
  }
  const oldAttrs = isNull(oldVnode) ? EmptyObject : oldVnode.data.attrs;
  // Attrs may be the same due to the static content optimization, so we can skip diffing
  if (oldAttrs === attrs) {
    return;
  }
  // Note VStaticPartData does not contain the external property so it will always default to false.
  const external = 'external' in data ? data.external : false;
  const {
    setAttribute,
    removeAttribute,
    setProperty
  } = renderer;
  for (const key in attrs) {
    const cur = attrs[key];
    const old = oldAttrs[key];
    if (old !== cur) {
      let propName;
      // For external custom elements, sniff to see if the attr should be considered a prop.
      // Use kebabCaseToCamelCase directly because we don't want to set props like `ariaLabel` or `tabIndex`
      // on a custom element versus just using the more reliable attribute format.
      if (external && (propName = kebabCaseToCamelCase(key)) in elm) {
        safelySetProperty(setProperty, elm, propName, cur);
      } else if (StringCharCodeAt.call(key, 3) === ColonCharCode) {
        // Assume xml namespace
        setAttribute(elm, key, cur, XML_NAMESPACE);
      } else if (StringCharCodeAt.call(key, 5) === ColonCharCode) {
        // Assume xlink namespace
        setAttribute(elm, key, cur, XLINK_NAMESPACE);
      } else if (isNull(cur) || isUndefined$1(cur)) {
        removeAttribute(elm, key);
      } else {
        setAttribute(elm, key, cur);
      }
    }
  }
}
function patchSlotAssignment(oldVnode, vnode, renderer) {
  const {
    slotAssignment
  } = vnode;
  if (oldVnode?.slotAssignment === slotAssignment) {
    return;
  }
  const {
    elm
  } = vnode;
  const {
    setAttribute,
    removeAttribute
  } = renderer;
  if (isUndefined$1(slotAssignment) || isNull(slotAssignment)) {
    removeAttribute(elm, 'slot');
  } else {
    setAttribute(elm, 'slot', slotAssignment);
  }
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function isLiveBindingProp(sel, key) {
  // For properties with live bindings, we read values from the DOM element
  // instead of relying on internally tracked values.
  return sel === 'input' && (key === 'value' || key === 'checked');
}
function patchProps(oldVnode, vnode, renderer) {
  const {
    props
  } = vnode.data;
  if (isUndefined$1(props)) {
    return;
  }
  let oldProps;
  if (!isNull(oldVnode)) {
    oldProps = oldVnode.data.props;
    // Props may be the same due to the static content optimization, so we can skip diffing
    if (oldProps === props) {
      return;
    }
    if (isUndefined$1(oldProps)) {
      oldProps = EmptyObject;
    }
  }
  const isFirstPatch = isNull(oldVnode);
  const {
    elm,
    sel
  } = vnode;
  const {
    getProperty,
    setProperty
  } = renderer;
  for (const key in props) {
    const cur = props[key];
    // Set the property if it's the first time is is patched or if the previous property is
    // different than the one previously set.
    if (isFirstPatch || cur !== (isLiveBindingProp(sel, key) ? getProperty(elm, key) : oldProps[key]) || !(key in oldProps) // this is required because the above case will pass when `cur` is `undefined` and key is missing in `oldProps`
    ) {
      // Additional verification if properties are supported by the element
      // Validation relies on html properties and public properties being defined on the element,
      // SSR has its own custom validation.
      if (process.env.NODE_ENV !== 'production') {
        if (!(key in elm)) {
          logWarn(`Unknown public property "${key}" of element <${elm.tagName.toLowerCase()}>. This is either a typo on the corresponding attribute "${htmlPropertyToAttribute(key)}", or the attribute does not exist in this browser or DOM implementation.`);
        }
      }
      safelySetProperty(setProperty, elm, key, cur);
    }
  }
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const classNameToClassMap = create(null);
function getMapFromClassName(className) {
  if (isUndefined$1(className) || isNull(className) || className === '') {
    return EmptyObject;
  }
  // computed class names must be string
  // This will throw if className is a symbol or null-prototype object
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  className = isString(className) ? className : className + '';
  let map = classNameToClassMap[className];
  if (map) {
    return map;
  }
  map = create(null);
  let start = 0;
  let o;
  const len = className.length;
  for (o = 0; o < len; o++) {
    if (StringCharCodeAt.call(className, o) === SPACE_CHAR) {
      if (o > start) {
        map[StringSlice.call(className, start, o)] = true;
      }
      start = o + 1;
    }
  }
  if (o > start) {
    map[StringSlice.call(className, start, o)] = true;
  }
  classNameToClassMap[className] = map;
  if (process.env.NODE_ENV !== 'production') {
    // just to make sure that this object never changes as part of the diffing algo
    freeze(map);
  }
  return map;
}
function patchClassAttribute(oldVnode, vnode, renderer) {
  const {
    elm,
    data: {
      className: newClass
    }
  } = vnode;
  const oldClass = isNull(oldVnode) ? undefined : oldVnode.data.className;
  if (oldClass === newClass) {
    return;
  }
  const newClassMap = getMapFromClassName(newClass);
  const oldClassMap = getMapFromClassName(oldClass);
  if (oldClassMap === newClassMap) {
    // These objects are cached by className string (`classNameToClassMap`), so we can only get here if there is
    // a key collision due to types, e.g. oldClass is `undefined` and newClass is `""` (empty string), or oldClass
    // is `1` (number) and newClass is `"1"` (string).
    return;
  }
  const {
    getClassList
  } = renderer;
  const classList = getClassList(elm);
  let name;
  for (name in oldClassMap) {
    // remove only if it is not in the new class collection and it is not set from within the instance
    if (isUndefined$1(newClassMap[name])) {
      classList.remove(name);
    }
  }
  for (name in newClassMap) {
    if (isUndefined$1(oldClassMap[name])) {
      classList.add(name);
    }
  }
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// The style property is a string when defined via an expression in the template.
function patchStyleAttribute(oldVnode, vnode, renderer, owner) {
  const {
    elm,
    data: {
      style: newStyle
    }
  } = vnode;
  if (process.env.NODE_ENV !== 'production') {
    if (!isNull(newStyle) && !isUndefined$1(newStyle) && !isString(newStyle)) {
      logError(`Invalid 'style' attribute passed to <${elm.tagName.toLowerCase()}> is ignored. This attribute must be a string value.`, owner);
    }
  }
  const oldStyle = isNull(oldVnode) ? undefined : oldVnode.data.style;
  if (oldStyle === newStyle) {
    return;
  }
  const {
    setAttribute,
    removeAttribute
  } = renderer;
  if (!isString(newStyle) || newStyle === '') {
    removeAttribute(elm, 'style');
  } else {
    setAttribute(elm, 'style', newStyle);
  }
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function applyEventListeners(vnode, renderer) {
  const {
    elm,
    data
  } = vnode;
  const {
    on
  } = data;
  if (isUndefined$1(on)) {
    return;
  }
  const {
    addEventListener
  } = renderer;
  for (const name in on) {
    const handler = on[name];
    addEventListener(elm, name, handler);
  }
}

/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function patchDynamicEventListeners(oldVnode, vnode, renderer, owner) {
  const {
    elm,
    data: {
      dynamicOn,
      dynamicOnRaw
    },
    sel
  } = vnode;
  // dynamicOn : A cloned version of the object passed to lwc:on, with null prototype and only its own enumerable properties.
  const oldDynamicOn = oldVnode?.data?.dynamicOn ?? EmptyObject;
  const newDynamicOn = dynamicOn ?? EmptyObject;
  // dynamicOnRaw : object passed to lwc:on
  // Compare dynamicOnRaw to check if same object is passed to lwc:on
  const isObjectSame = oldVnode?.data?.dynamicOnRaw === dynamicOnRaw;
  const {
    addEventListener,
    removeEventListener
  } = renderer;
  const attachedEventListeners = getAttachedEventListeners(owner, elm);
  // Properties that are present in 'oldDynamicOn' but not in 'newDynamicOn'
  for (const eventType in oldDynamicOn) {
    if (!(eventType in newDynamicOn)) {
      // log error if same object is passed
      if (isObjectSame && process.env.NODE_ENV !== 'production') {
        logError(`Detected mutation of property '${eventType}' in the object passed to lwc:on for <${sel}>. Reusing the same object with modified properties is prohibited. Please pass a new object instead.`, owner);
      }
      // Remove listeners that were attached previously but don't have a corresponding property in `newDynamicOn`
      const attachedEventListener = attachedEventListeners[eventType];
      removeEventListener(elm, eventType, attachedEventListener);
      attachedEventListeners[eventType] = undefined;
    }
  }
  // Ensure that the event listeners that are attached match what is present in `newDynamicOn`
  for (const eventType in newDynamicOn) {
    const typeExistsInOld = eventType in oldDynamicOn;
    const newCallback = newDynamicOn[eventType];
    // Skip if callback hasn't changed
    if (typeExistsInOld && oldDynamicOn[eventType] === newCallback) {
      continue;
    }
    // log error if same object is passed
    if (isObjectSame && process.env.NODE_ENV !== 'production') {
      logError(`Detected mutation of property '${eventType}' in the object passed to lwc:on for <${sel}>. Reusing the same object with modified properties is prohibited. Please pass a new object instead.`, owner);
    }
    // Remove listener that was attached previously
    if (typeExistsInOld) {
      const attachedEventListener = attachedEventListeners[eventType];
      removeEventListener(elm, eventType, attachedEventListener);
    }
    // Bind new callback to owner component and add it as listener to element
    const newBoundEventListener = bindEventListener(owner, newCallback);
    addEventListener(elm, eventType, newBoundEventListener);
    // Store the newly added eventListener
    attachedEventListeners[eventType] = newBoundEventListener;
  }
}
function getAttachedEventListeners(vm, elm) {
  let attachedEventListeners = vm.attachedEventListeners.get(elm);
  if (isUndefined$1(attachedEventListeners)) {
    attachedEventListeners = {};
    vm.attachedEventListeners.set(elm, attachedEventListeners);
  }
  return attachedEventListeners;
}
function bindEventListener(vm, fn) {
  return function (event) {
    invokeEventListener(vm, fn, vm.component, event);
  };
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// The HTML class property becomes the vnode.data.classMap object when defined as a string in the template.
// The compiler takes care of transforming the inline classnames into an object. It's faster to set the
// different classnames properties individually instead of via a string.
function applyStaticClassAttribute(vnode, renderer) {
  const {
    elm,
    data: {
      classMap
    }
  } = vnode;
  if (isUndefined$1(classMap)) {
    return;
  }
  const {
    getClassList
  } = renderer;
  const classList = getClassList(elm);
  for (const name in classMap) {
    classList.add(name);
  }
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// The HTML style property becomes the vnode.data.styleDecls object when defined as a string in the template.
// The compiler takes care of transforming the inline style into an object. It's faster to set the
// different style properties individually instead of via a string.
function applyStaticStyleAttribute(vnode, renderer) {
  const {
    elm,
    data: {
      styleDecls
    }
  } = vnode;
  if (isUndefined$1(styleDecls)) {
    return;
  }
  const {
    setCSSStyleProperty
  } = renderer;
  for (let i = 0; i < styleDecls.length; i++) {
    const [prop, value, important] = styleDecls[i];
    setCSSStyleProperty(elm, prop, value, important);
  }
}

/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Set a ref (lwc:ref) on a VM, from a template API
function applyRefs(vnode, owner) {
  const {
    data
  } = vnode;
  const {
    ref
  } = data;
  if (isUndefined$1(ref)) {
    return;
  }
  if (process.env.NODE_ENV !== 'production' && isUndefined$1(owner.refVNodes)) {
    throw new Error('refVNodes must be defined when setting a ref');
  }
  // If this method is called, then vm.refVNodes is set as the template has refs.
  // If not, then something went wrong and we threw an error above.
  const refVNodes = owner.refVNodes;
  // In cases of conflict (two elements with the same ref), prefer the last one,
  // in depth-first traversal order. This happens automatically due to how we render
  refVNodes[ref] = vnode;
}

/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function patchTextVNode(n1, n2, renderer) {
  n2.elm = n1.elm;
  if (n2.text !== n1.text) {
    updateTextContent$1(n2, renderer);
  }
}
function patchTextVStaticPart(n1, n2, renderer) {
  if (isNull(n1) || n2.text !== n1.text) {
    updateTextContent$1(n2, renderer);
  }
}
function updateTextContent$1(vnode, renderer) {
  const {
    elm,
    text
  } = vnode;
  const {
    setText
  } = renderer;
  if (process.env.NODE_ENV !== 'production') {
    unlockDomMutation();
  }
  setText(elm, text);
  if (process.env.NODE_ENV !== 'production') {
    lockDomMutation();
  }
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * Given an array of static parts, mounts the DOM element to the part based on the staticPartId
 * @param root the root element
 * @param parts an array of VStaticParts
 * @param renderer the renderer to use
 */
function traverseAndSetElements(root, parts, renderer) {
  const numParts = parts.length;
  // Optimization given that, in most cases, there will be one part, and it's just the root
  if (numParts === 1) {
    const firstPart = parts[0];
    if (firstPart.partId === 0) {
      // 0 means the root node
      firstPart.elm = root;
      return;
    }
  }
  const partIdsToParts = new Map();
  for (const staticPart of parts) {
    partIdsToParts.set(staticPart.partId, staticPart);
  }
  // Note that we traverse using `*Child`/`*Sibling` rather than `children` because the browser uses a linked
  // list under the hood to represent the DOM tree, so it's faster to do this than to create an underlying array
  // by calling `children`.
  const {
    nextSibling,
    getFirstChild,
    getParentNode
  } = renderer;
  let numFoundParts = 0;
  let partId = -1;
  // We should never traverse up to the root. We should exit early due to numFoundParts === numParts.
  // This is just a sanity check, in case the static parts generated by @lwc/template-compiler are wrong.
  function assertNotRoot(node) {
    if (process.env.NODE_ENV !== 'production') {
      assert.isFalse(node === root, `Reached the root without finding all parts. Found ${numFoundParts}, needed ${numParts}.`);
    }
  }
  // Depth-first traversal. We assign a partId to each element, which is an integer based on traversal order.
  // This function is very hot, which is why it's micro-optimized. Note we don't use a stack at all; we traverse
  // using an algorithm that relies on the parentNode getter: https://stackoverflow.com/a/5285417
  // This is very slightly faster than a TreeWalker (~0.5% on js-framework-benchmark create-10k), but basically
  // the same idea.
  let node = root;
  while (!isNull(node)) {
    // visit node
    partId++;
    const part = partIdsToParts.get(partId);
    if (!isUndefined$1(part)) {
      part.elm = node;
      numFoundParts++;
      if (numFoundParts === numParts) {
        return; // perf optimization - stop traversing once we've found everything we need
      }
    }
    const child = getFirstChild(node);
    if (!isNull(child)) {
      // walk down
      node = child;
    } else {
      let sibling;
      while (isNull(sibling = nextSibling(node))) {
        // we never want to walk up from the root
        assertNotRoot(node);
        // walk up
        node = getParentNode(node);
      }
      // we never want to walk right from the root
      assertNotRoot(node);
      // walk right
      node = sibling;
    }
  }
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production') {
    assert.isTrue(numFoundParts === numParts, `Should have found all parts by now. Found ${numFoundParts}, needed ${numParts}.`);
  }
}
/**
 * Given an array of static parts, do all the mounting required for these parts.
 * @param root the root element
 * @param vnode the parent VStatic
 * @param renderer the renderer to use
 */
function mountStaticParts(root, vnode, renderer) {
  const {
    parts,
    owner
  } = vnode;
  if (isUndefined$1(parts)) {
    return;
  }
  // This adds `part.elm` to each `part`. We have to do this on every mount because the `parts`
  // array is recreated from scratch every time, so each `part.elm` is now undefined.
  traverseAndSetElements(root, parts, renderer);
  // Currently only event listeners and refs are supported for static vnodes
  for (const part of parts) {
    if (isVStaticPartElement(part)) {
      // Event listeners only need to be applied once when mounting
      applyEventListeners(part, renderer);
      // Refs must be updated after every render due to refVNodes getting reset before every render
      applyRefs(part, owner);
      patchAttributes(null, part, renderer);
      patchClassAttribute(null, part, renderer);
      patchStyleAttribute(null, part, renderer, owner);
    } else {
      if (process.env.NODE_ENV !== 'production' && !isVStaticPartText(part)) {
        throw new Error(`LWC internal error, encountered unknown static part type: ${part.type}`);
      }
      patchTextVStaticPart(null, part, renderer);
    }
  }
}
/**
 * Updates the static elements based on the content of the VStaticParts
 * @param n1 the previous VStatic vnode
 * @param n2 the current VStatic vnode
 * @param renderer the renderer to use
 */
function patchStaticParts(n1, n2, renderer) {
  const {
    parts: currParts,
    owner: currPartsOwner
  } = n2;
  if (isUndefined$1(currParts)) {
    return;
  }
  const {
    parts: prevParts
  } = n1;
  if (process.env.NODE_ENV !== 'production') {
    assert.isTrue(currParts.length === prevParts?.length, 'Expected static parts to be the same for the same element. This is an error with the LWC framework itself.');
  }
  for (let i = 0; i < currParts.length; i++) {
    const prevPart = prevParts[i];
    const part = currParts[i];
    // Patch only occurs if the vnode is newly generated, which means the part.elm is always undefined
    // Since the vnode and elements are the same we can safely assume that prevParts[i].elm is defined.
    part.elm = prevPart.elm;
    if (process.env.NODE_ENV !== 'production' && prevPart.type !== part.type) {
      throw new Error(`LWC internal error, static part types do not match. Previous type was ${prevPart.type} and current type is ${part.type}`);
    }
    if (isVStaticPartElement(part)) {
      // Refs must be updated after every render due to refVNodes getting reset before every render
      applyRefs(part, currPartsOwner);
      patchAttributes(prevPart, part, renderer);
      patchClassAttribute(prevPart, part, renderer);
      patchStyleAttribute(prevPart, part, renderer, currPartsOwner);
    } else {
      patchTextVStaticPart(null, part, renderer);
    }
  }
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function patchChildren(c1, c2, parent, renderer) {
  if (hasDynamicChildren(c2)) {
    updateDynamicChildren(c1, c2, parent, renderer);
  } else {
    updateStaticChildren(c1, c2, parent, renderer);
  }
}
function patch(n1, n2, parent, renderer) {
  if (n1 === n2) {
    return;
  }
  if (process.env.NODE_ENV !== 'production') {
    if (!isSameVnode(n1, n2) &&
    // Currently the only scenario when patch does not receive the same vnodes are for
    // dynamic components. When a dynamic component's constructor changes, the value of its
    // tag name (sel) will be different. The engine will unmount the previous element
    // and mount the new one using the new constructor in patchCustomElement.
    !(isVCustomElement(n1) && isVCustomElement(n2))) {
      throw new Error('Expected these VNodes to be the same: ' + JSON.stringify({
        sel: n1.sel,
        key: n1.key
      }) + ', ' + JSON.stringify({
        sel: n2.sel,
        key: n2.key
      }));
    }
  }
  switch (n2.type) {
    case 0 /* VNodeType.Text */:
      // VText has no special capability, fallback to the owner's renderer
      patchTextVNode(n1, n2, renderer);
      break;
    case 1 /* VNodeType.Comment */:
      // VComment has no special capability, fallback to the owner's renderer
      patchComment(n1, n2, renderer);
      break;
    case 4 /* VNodeType.Static */:
      patchStatic(n1, n2, renderer);
      break;
    case 5 /* VNodeType.Fragment */:
      patchFragment(n1, n2, parent, renderer);
      break;
    case 2 /* VNodeType.Element */:
      patchElement(n1, n2, n2.data.renderer ?? renderer);
      break;
    case 3 /* VNodeType.CustomElement */:
      patchCustomElement(n1, n2, parent, n2.data.renderer ?? renderer);
      break;
  }
}
function mount(node, parent, renderer, anchor) {
  switch (node.type) {
    case 0 /* VNodeType.Text */:
      // VText has no special capability, fallback to the owner's renderer
      mountText(node, parent, anchor, renderer);
      break;
    case 1 /* VNodeType.Comment */:
      // VComment has no special capability, fallback to the owner's renderer
      mountComment(node, parent, anchor, renderer);
      break;
    case 4 /* VNodeType.Static */:
      // VStatic cannot have a custom renderer associated to them, using owner's renderer
      mountStatic(node, parent, anchor, renderer);
      break;
    case 5 /* VNodeType.Fragment */:
      mountFragment(node, parent, anchor, renderer);
      break;
    case 2 /* VNodeType.Element */:
      // If the vnode data has a renderer override use it, else fallback to owner's renderer
      mountElement(node, parent, anchor, node.data.renderer ?? renderer);
      break;
    case 3 /* VNodeType.CustomElement */:
      // If the vnode data has a renderer override use it, else fallback to owner's renderer
      mountCustomElement(node, parent, anchor, node.data.renderer ?? renderer);
      break;
  }
}
function mountText(vnode, parent, anchor, renderer) {
  const {
    owner
  } = vnode;
  const {
    createText
  } = renderer;
  const textNode = vnode.elm = createText(vnode.text);
  linkNodeToShadow(textNode, owner, renderer);
  insertNode(textNode, parent, anchor, renderer);
}
function patchComment(n1, n2, renderer) {
  n2.elm = n1.elm;
  // FIXME: Comment nodes should be static, we shouldn't need to diff them together. However
  // it is the case today.
  if (n2.text !== n1.text) {
    updateTextContent$1(n2, renderer);
  }
}
function mountComment(vnode, parent, anchor, renderer) {
  const {
    owner
  } = vnode;
  const {
    createComment
  } = renderer;
  const commentNode = vnode.elm = createComment(vnode.text);
  linkNodeToShadow(commentNode, owner, renderer);
  insertNode(commentNode, parent, anchor, renderer);
}
function mountFragment(vnode, parent, anchor, renderer) {
  const {
    children
  } = vnode;
  mountVNodes(children, parent, renderer, anchor);
  vnode.elm = vnode.leading.elm;
}
function patchFragment(n1, n2, parent, renderer) {
  const {
    children,
    stable
  } = n2;
  if (stable) {
    updateStaticChildren(n1.children, children, parent, renderer);
  } else {
    updateDynamicChildren(n1.children, children, parent, renderer);
  }
  // Note: not reusing n1.elm, because during patching, it may be patched with another text node.
  n2.elm = n2.leading.elm;
}
function mountElement(vnode, parent, anchor, renderer) {
  const {
    sel,
    owner,
    data: {
      svg
    }
  } = vnode;
  const {
    createElement
  } = renderer;
  const namespace = isTrue(svg) ? SVG_NAMESPACE : undefined;
  const elm = vnode.elm = createElement(sel, namespace);
  linkNodeToShadow(elm, owner, renderer);
  applyStyleScoping(elm, owner, renderer);
  applyDomManual(elm, vnode);
  applyElementRestrictions(elm, vnode);
  patchElementPropsAndAttrsAndRefs$1(null, vnode, renderer);
  insertNode(elm, parent, anchor, renderer);
  mountVNodes(vnode.children, elm, renderer, null);
}
function patchStatic(n1, n2, renderer) {
  n2.elm = n1.elm;
  // slotAssignments can only apply to the top level element, never to a static part.
  patchSlotAssignment(n1, n2, renderer);
  // The `refs` object is blown away in every re-render, so we always need to re-apply them
  patchStaticParts(n1, n2, renderer);
}
function patchElement(n1, n2, renderer) {
  const elm = n2.elm = n1.elm;
  patchElementPropsAndAttrsAndRefs$1(n1, n2, renderer);
  patchChildren(n1.children, n2.children, elm, renderer);
}
function mountStatic(vnode, parent, anchor, renderer) {
  const {
    owner
  } = vnode;
  const {
    cloneNode,
    isSyntheticShadowDefined
  } = renderer;
  const elm = vnode.elm = cloneNode(vnode.fragment, true);
  // Define the root node shadow resolver
  linkNodeToShadow(elm, owner, renderer);
  applyElementRestrictions(elm, vnode);
  const {
    renderMode,
    shadowMode
  } = owner;
  if (isSyntheticShadowDefined) {
    // Marks this node as Static to propagate the shadow resolver. must happen after elm is assigned to the proper shadow
    if (shadowMode === 1 /* ShadowMode.Synthetic */ || renderMode === 0 /* RenderMode.Light */) {
      elm[KEY__SHADOW_STATIC] = true;
    }
  }
  // slotAssignments can only apply to the top level element, never to a static part.
  patchSlotAssignment(null, vnode, renderer);
  mountStaticParts(elm, vnode, renderer);
  insertNode(elm, parent, anchor, renderer);
}
function mountCustomElement(vnode, parent, anchor, renderer) {
  const {
    sel,
    owner,
    ctor
  } = vnode;
  const {
    createCustomElement
  } = renderer;
  /**
   * Note: if the upgradable constructor does not expect, or throw when we new it
   * with a callback as the first argument, we could implement a more advanced
   * mechanism that only passes that argument if the constructor is known to be
   * an upgradable custom element.
   */
  let vm;
  const upgradeCallback = elm => {
    // the custom element from the registry is expecting an upgrade callback
    vm = createViewModelHook(elm, vnode, renderer);
  };
  // Should never get a tag with upper case letter at this point; the compiler
  // should produce only tags with lowercase letters. However, the Java
  // compiler may generate tagnames with uppercase letters so - for backwards
  // compatibility, we lower case the tagname here.
  const normalizedTagname = sel.toLowerCase();
  const useNativeLifecycle = !lwcRuntimeFlags.DISABLE_NATIVE_CUSTOM_ELEMENT_LIFECYCLE;
  const isFormAssociated = shouldBeFormAssociated(ctor);
  const elm = createCustomElement(normalizedTagname, upgradeCallback, useNativeLifecycle, isFormAssociated);
  vnode.elm = elm;
  vnode.vm = vm;
  linkNodeToShadow(elm, owner, renderer);
  applyStyleScoping(elm, owner, renderer);
  if (vm) {
    allocateChildren(vnode, vm);
  }
  patchElementPropsAndAttrsAndRefs$1(null, vnode, renderer);
  insertNode(elm, parent, anchor, renderer);
  if (vm) {
    {
      if (!useNativeLifecycle) {
        if (process.env.NODE_ENV !== 'production') {
          // With synthetic lifecycle callbacks, it's possible for elements to be removed without the engine
          // noticing it (e.g. `appendChild` the same host element twice). This test ensures we don't regress.
          assert.isTrue(vm.state === 0 /* VMState.created */, `${vm} cannot be recycled.`);
        }
        runConnectedCallback(vm);
      }
    }
  }
  mountVNodes(vnode.children, elm, renderer, null);
  if (vm) {
    appendVM(vm);
  }
}
function patchCustomElement(n1, n2, parent, renderer) {
  // TODO [#3331]: This if branch should be removed in 246 with lwc:dynamic
  if (n1.ctor !== n2.ctor) {
    // If the constructor differs, unmount the current component and mount a new one using the new
    // constructor.
    const anchor = renderer.nextSibling(n1.elm);
    unmount(n1, parent, renderer, true);
    mountCustomElement(n2, parent, anchor, renderer);
  } else {
    // Otherwise patch the existing component with new props/attrs/etc.
    const elm = n2.elm = n1.elm;
    const vm = n2.vm = n1.vm;
    patchElementPropsAndAttrsAndRefs$1(n1, n2, renderer);
    if (!isUndefined$1(vm)) {
      // in fallback mode, the allocation will always set children to
      // empty and delegate the real allocation to the slot elements
      allocateChildren(n2, vm);
      // Solves an edge case with slotted VFragments in native shadow mode.
      //
      // During allocation, in native shadow, slotted VFragment nodes are flattened and their text delimiters are removed
      // to avoid interfering with native slot behavior. When this happens, if any of the fragments
      // were not stable, the children must go through the dynamic diffing algo.
      //
      // If the new children (n2.children) contain no VFragments, but the previous children (n1.children) were dynamic,
      // the new nodes must be marked dynamic so that all nodes are properly updated. The only indicator that the new
      // nodes need to be dynamic comes from the previous children, so we check that to determine whether we need to
      // mark the new children dynamic.
      //
      // Example:
      // n1.children: [div, VFragment('', div, null, ''), div] => [div, div, null, div]; // marked dynamic
      // n2.children: [div, null, div] => [div, null, div] // marked ???
      const {
        shadowMode,
        renderMode
      } = vm;
      if (shadowMode == 0 /* ShadowMode.Native */ && renderMode !== 0 /* RenderMode.Light */ && hasDynamicChildren(n1.children)) {
        // No-op if children has already been marked dynamic by 'allocateChildren()'.
        markAsDynamicChildren(n2.children);
      }
    }
    // in fallback mode, the children will be always empty, so, nothing
    // will happen, but in native, it does allocate the light dom
    patchChildren(n1.children, n2.children, elm, renderer);
    if (!isUndefined$1(vm)) {
      // this will probably update the shadowRoot, but only if the vm is in a dirty state
      // this is important to preserve the top to bottom synchronous rendering phase.
      rerenderVM(vm);
    }
  }
}
function mountVNodes(vnodes, parent, renderer, anchor, start = 0, end = vnodes.length) {
  for (; start < end; ++start) {
    const vnode = vnodes[start];
    if (isVNode(vnode)) {
      mount(vnode, parent, renderer, anchor);
    }
  }
}
function unmount(vnode, parent, renderer, doRemove = false) {
  const {
    type,
    elm,
    sel
  } = vnode;
  // When unmounting a VNode subtree not all the elements have to removed from the DOM. The
  // subtree root, is the only element worth unmounting from the subtree.
  if (doRemove && type !== 5 /* VNodeType.Fragment */) {
    // The vnode might or might not have a data.renderer associated to it
    // but the removal used here is from the owner instead.
    removeNode(elm, parent, renderer);
  }
  switch (type) {
    case 5 /* VNodeType.Fragment */:
      {
        unmountVNodes(vnode.children, parent, renderer, doRemove);
        break;
      }
    case 2 /* VNodeType.Element */:
      {
        // Slot content is removed to trigger slotchange event when removing slot.
        // Only required for synthetic shadow.
        const shouldRemoveChildren = sel === 'slot' && vnode.owner.shadowMode === 1 /* ShadowMode.Synthetic */;
        unmountVNodes(vnode.children, elm, renderer, shouldRemoveChildren);
        break;
      }
    case 3 /* VNodeType.CustomElement */:
      {
        const {
          vm
        } = vnode;
        // No need to unmount the children here, `removeVM` will take care of removing the
        // children.
        if (!isUndefined$1(vm)) {
          removeVM(vm);
        }
      }
  }
}
function unmountVNodes(vnodes, parent, renderer, doRemove = false, start = 0, end = vnodes.length) {
  for (; start < end; ++start) {
    const ch = vnodes[start];
    if (isVNode(ch)) {
      unmount(ch, parent, renderer, doRemove);
    }
  }
}
function isVNode(vnode) {
  return vnode != null;
}
function linkNodeToShadow(elm, owner, renderer) {
  const {
    renderRoot,
    renderMode,
    shadowMode
  } = owner;
  const {
    isSyntheticShadowDefined
  } = renderer;
  // TODO [#1164]: this should eventually be done by the polyfill directly
  if (isSyntheticShadowDefined) {
    if (shadowMode === 1 /* ShadowMode.Synthetic */ || renderMode === 0 /* RenderMode.Light */) {
      elm[KEY__SHADOW_RESOLVER] = renderRoot[KEY__SHADOW_RESOLVER];
    }
  }
}
function insertFragmentOrNode(vnode, parent, anchor, renderer) {
  if (process.env.NODE_ENV !== 'production') {
    unlockDomMutation();
  }
  if (isVFragment(vnode)) {
    const children = vnode.children;
    for (let i = 0; i < children.length; i += 1) {
      const child = children[i];
      if (!isNull(child)) {
        renderer.insert(child.elm, parent, anchor);
      }
    }
  } else {
    renderer.insert(vnode.elm, parent, anchor);
  }
  if (process.env.NODE_ENV !== 'production') {
    lockDomMutation();
  }
}
function insertNode(node, parent, anchor, renderer) {
  if (process.env.NODE_ENV !== 'production') {
    unlockDomMutation();
  }
  renderer.insert(node, parent, anchor);
  if (process.env.NODE_ENV !== 'production') {
    lockDomMutation();
  }
}
function removeNode(node, parent, renderer) {
  if (process.env.NODE_ENV !== 'production') {
    unlockDomMutation();
  }
  renderer.remove(node, parent);
  if (process.env.NODE_ENV !== 'production') {
    lockDomMutation();
  }
}
function patchElementPropsAndAttrsAndRefs$1(oldVnode, vnode, renderer) {
  if (isNull(oldVnode)) {
    applyEventListeners(vnode, renderer);
    applyStaticClassAttribute(vnode, renderer);
    applyStaticStyleAttribute(vnode, renderer);
  }
  const {
    owner
  } = vnode;
  patchDynamicEventListeners(oldVnode, vnode, renderer, owner);
  // Attrs need to be applied to element before props IE11 will wipe out value on radio inputs if
  // value is set before type=radio.
  patchClassAttribute(oldVnode, vnode, renderer);
  patchStyleAttribute(oldVnode, vnode, renderer, owner);
  patchAttributes(oldVnode, vnode, renderer);
  patchProps(oldVnode, vnode, renderer);
  patchSlotAssignment(oldVnode, vnode, renderer);
  // The `refs` object is blown away in every re-render, so we always need to re-apply them
  applyRefs(vnode, owner);
}
function applyStyleScoping(elm, owner, renderer) {
  const {
    getClassList
  } = renderer;
  // Set the class name for `*.scoped.css` style scoping.
  const scopeToken = getScopeTokenClass(owner);
  if (!isNull(scopeToken)) {
    if (!isValidScopeToken(scopeToken)) {
      // See W-16614556
      throw new Error('stylesheet token must be a valid string');
    }
    // TODO [#2762]: this dot notation with add is probably problematic
    // probably we should have a renderer api for just the add operation
    getClassList(elm).add(scopeToken);
  }
  // Set property element for synthetic shadow DOM style scoping.
  const {
    stylesheetToken: syntheticToken
  } = owner.context;
  if (owner.shadowMode === 1 /* ShadowMode.Synthetic */) {
    if (!isUndefined$1(syntheticToken)) {
      elm.$shadowToken$ = syntheticToken;
    }
  }
}
function applyDomManual(elm, vnode) {
  const {
    owner,
    data: {
      context
    }
  } = vnode;
  if (owner.shadowMode === 1 /* ShadowMode.Synthetic */ && context?.lwc?.dom === 'manual') {
    elm.$domManual$ = true;
  }
}
function applyElementRestrictions(elm, vnode) {
  if (process.env.NODE_ENV !== 'production') {
    const isSynthetic = vnode.owner.shadowMode === 1 /* ShadowMode.Synthetic */;
    const isPortal = vnode.type === 2 /* VNodeType.Element */ && vnode.data.context?.lwc?.dom === 'manual';
    const isLight = vnode.owner.renderMode === 0 /* RenderMode.Light */;
    patchElementWithRestrictions(elm, {
      isPortal,
      isLight,
      isSynthetic
    });
  }
}
function allocateChildren(vnode, vm) {
  // A component with slots will re-render because:
  // 1- There is a change of the internal state.
  // 2- There is a change on the external api (ex: slots)
  //
  // In case #1, the vnodes in the cmpSlots will be reused since they didn't changed. This routine emptied the
  // slotted children when those VCustomElement were rendered and therefore in subsequent calls to allocate children
  // in a reused VCustomElement, there won't be any slotted children.
  // For those cases, we will use the reference for allocated children stored when rendering the fresh VCustomElement.
  //
  // In case #2, we will always get a fresh VCustomElement.
  const children = vnode.aChildren || vnode.children;
  const {
    renderMode,
    shadowMode
  } = vm;
  if (process.env.NODE_ENV !== 'production') {
    // If any of the children being allocated is a scoped slot fragment, make sure the receiving
    // component is a light DOM component. This is mainly to validate light dom parent running
    // in native shadow mode.
    if (renderMode !== 0 /* RenderMode.Light */ && ArraySome.call(children, child => !isNull(child) && isVScopedSlotFragment(child))) {
      logError(`Invalid usage of 'lwc:slot-data' on ${getComponentTag(vm)} tag. Scoped slot content can only be passed to a light dom child.`);
    }
  }
  // If any of the children being allocated are VFragments, we remove the text delimiters and flatten all immediate
  // children VFragments to avoid them interfering with default slot behavior.
  const allocatedChildren = flattenFragmentsInChildren(children);
  vnode.children = allocatedChildren;
  vm.aChildren = allocatedChildren;
  if (shadowMode === 1 /* ShadowMode.Synthetic */ || renderMode === 0 /* RenderMode.Light */) {
    // slow path
    allocateInSlot(vm, allocatedChildren, vnode.owner);
    // save the allocated children in case this vnode is reused.
    vnode.aChildren = allocatedChildren;
    // every child vnode is now allocated, and the host should receive none directly, it receives them via the shadow!
    vnode.children = EmptyArray;
  }
}
/**
 * Flattens the contents of all VFragments in an array of VNodes, removes the text delimiters on those VFragments, and
 * marks the resulting children array as dynamic. Uses a stack (array) to iteratively traverse the nested VFragments
 * and avoid the perf overhead of creating/destroying throwaway arrays/objects in a recursive approach.
 *
 * With the delimiters removed, the contents are marked dynamic so they are diffed correctly.
 *
 * This function is used for slotted VFragments to avoid the text delimiters interfering with slotting functionality.
 * @param children
 */
function flattenFragmentsInChildren(children) {
  const flattenedChildren = [];
  // Initialize our stack with the direct children of the custom component and check whether we have a VFragment.
  // If no VFragment is found in children, we don't need to traverse anything or mark the children dynamic and can return early.
  const nodeStack = [];
  let fragmentFound = false;
  for (let i = children.length - 1; i > -1; i -= 1) {
    const child = children[i];
    ArrayPush$1.call(nodeStack, child);
    fragmentFound = fragmentFound || !!(child && isVFragment(child));
  }
  if (!fragmentFound) {
    return children;
  }
  let currentNode;
  while (!isUndefined$1(currentNode = ArrayPop.call(nodeStack))) {
    if (!isNull(currentNode) && isVFragment(currentNode)) {
      const fChildren = currentNode.children;
      // Ignore the start and end text node delimiters
      for (let i = fChildren.length - 2; i > 0; i -= 1) {
        ArrayPush$1.call(nodeStack, fChildren[i]);
      }
    } else {
      ArrayPush$1.call(flattenedChildren, currentNode);
    }
  }
  // We always mark the children as dynamic because nothing generates stable VFragments yet.
  // If/when stable VFragments are generated by the compiler, this code should be updated to
  // not mark dynamic if all flattened VFragments were stable.
  markAsDynamicChildren(flattenedChildren);
  return flattenedChildren;
}
function createViewModelHook(elm, vnode, renderer) {
  let vm = getAssociatedVMIfPresent(elm);
  // There is a possibility that a custom element is registered under tagName, in which case, the
  // initialization is already carry on, and there is nothing else to do here since this hook is
  // called right after invoking `document.createElement`.
  if (!isUndefined$1(vm)) {
    return vm;
  }
  const {
    sel,
    mode,
    ctor,
    owner
  } = vnode;
  vm = createVM(elm, ctor, renderer, {
    mode,
    owner,
    tagName: sel
  });
  if (process.env.NODE_ENV !== 'production') {
    assert.isTrue(isArray$1(vnode.children), `Invalid vnode for a custom element, it must have children defined.`);
  }
  return vm;
}
function allocateInSlot(vm, children, owner) {
  const {
    cmpSlots: {
      slotAssignments: oldSlotsMapping
    }
  } = vm;
  const cmpSlotsMapping = create(null);
  // Collect all slots into cmpSlotsMapping
  for (let i = 0, len = children.length; i < len; i += 1) {
    const vnode = children[i];
    if (isNull(vnode)) {
      continue;
    }
    let slotName = '';
    if (isVBaseElement(vnode) || isVStatic(vnode)) {
      slotName = vnode.slotAssignment ?? '';
    } else if (isVScopedSlotFragment(vnode)) {
      slotName = vnode.slotName;
    }
    // Can't use toString here because Symbol(1).toString() is 'Symbol(1)'
    // but elm.setAttribute('slot', Symbol(1)) is an error.
    // the following line also throws same error for symbols
    // Similar for Object.create(null)
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const normalizedSlotName = '' + slotName;
    const vnodes = cmpSlotsMapping[normalizedSlotName] = cmpSlotsMapping[normalizedSlotName] || [];
    ArrayPush$1.call(vnodes, vnode);
  }
  vm.cmpSlots = {
    owner,
    slotAssignments: cmpSlotsMapping
  };
  if (isFalse(vm.isDirty)) {
    // We need to determine if the old allocation is really different from the new one
    // and mark the vm as dirty
    const oldKeys = keys(oldSlotsMapping);
    if (oldKeys.length !== keys(cmpSlotsMapping).length) {
      markComponentAsDirty(vm);
      return;
    }
    for (let i = 0, len = oldKeys.length; i < len; i += 1) {
      const key = oldKeys[i];
      if (isUndefined$1(cmpSlotsMapping[key]) || oldSlotsMapping[key].length !== cmpSlotsMapping[key].length) {
        markComponentAsDirty(vm);
        return;
      }
      const oldVNodes = oldSlotsMapping[key];
      const vnodes = cmpSlotsMapping[key];
      for (let j = 0, a = cmpSlotsMapping[key].length; j < a; j += 1) {
        if (oldVNodes[j] !== vnodes[j]) {
          markComponentAsDirty(vm);
          return;
        }
      }
    }
  }
}
const DynamicChildren = new WeakSet();
// dynamic children means it was either generated by an iteration in a template
// or part of an unstable fragment, and will require a more complex diffing algo.
function markAsDynamicChildren(children) {
  DynamicChildren.add(children);
}
function hasDynamicChildren(children) {
  return DynamicChildren.has(children);
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
  const map = {};
  for (let j = beginIdx; j <= endIdx; ++j) {
    const ch = children[j];
    if (isVNode(ch)) {
      const {
        key
      } = ch;
      if (key !== undefined) {
        map[key] = j;
      }
    }
  }
  return map;
}
function updateDynamicChildren(oldCh, newCh, parent, renderer) {
  let oldStartIdx = 0;
  let newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  const newChEnd = newCh.length - 1;
  let newEndIdx = newChEnd;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let oldKeyToIdx;
  let idxInOld;
  let elmToMove;
  let before;
  let clonedOldCh = false;
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (!isVNode(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
    } else if (!isVNode(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (!isVNode(newStartVnode)) {
      newStartVnode = newCh[++newStartIdx];
    } else if (!isVNode(newEndVnode)) {
      newEndVnode = newCh[--newEndIdx];
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode, parent, renderer);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode, parent, renderer);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // Vnode moved right
      patch(oldStartVnode, newEndVnode, parent, renderer);
      // In the case of fragments, the `elm` property of a vfragment points to the leading
      // anchor. To determine the next sibling of the whole fragment, we need to use the
      // trailing anchor as the argument to nextSibling():
      // [..., [leading, ...content, trailing], nextSibling, ...]
      let anchor;
      if (isVFragment(oldEndVnode)) {
        anchor = renderer.nextSibling(oldEndVnode.trailing.elm);
      } else {
        anchor = renderer.nextSibling(oldEndVnode.elm);
      }
      insertFragmentOrNode(oldStartVnode, parent, anchor, renderer);
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // Vnode moved left
      patch(oldEndVnode, newStartVnode, parent, renderer);
      insertFragmentOrNode(newStartVnode, parent, oldStartVnode.elm, renderer);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      if (oldKeyToIdx === undefined) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      }
      idxInOld = oldKeyToIdx[newStartVnode.key];
      if (isUndefined$1(idxInOld)) {
        // New element
        mount(newStartVnode, parent, renderer, oldStartVnode.elm);
        newStartVnode = newCh[++newStartIdx];
      } else {
        elmToMove = oldCh[idxInOld];
        if (isVNode(elmToMove)) {
          if (elmToMove.sel !== newStartVnode.sel) {
            // New element
            mount(newStartVnode, parent, renderer, oldStartVnode.elm);
          } else {
            patch(elmToMove, newStartVnode, parent, renderer);
            // Delete the old child, but copy the array since it is read-only.
            // The `oldCh` will be GC'ed after `updateDynamicChildren` is complete,
            // so we only care about the `oldCh` object inside this function.
            // To avoid cloning over and over again, we check `clonedOldCh`
            // and only clone once.
            if (!clonedOldCh) {
              clonedOldCh = true;
              oldCh = [...oldCh];
            }
            // We've already cloned at least once, so it's no longer read-only
            oldCh[idxInOld] = undefined;
            insertFragmentOrNode(elmToMove, parent, oldStartVnode.elm, renderer);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
  }
  if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
    if (oldStartIdx > oldEndIdx) {
      // There's some cases in which the sub array of vnodes to be inserted is followed by null(s) and an
      // already processed vnode, in such cases the vnodes to be inserted should be before that processed vnode.
      let i = newEndIdx;
      let n;
      do {
        n = newCh[++i];
      } while (!isVNode(n) && i < newChEnd);
      before = isVNode(n) ? n.elm : null;
      mountVNodes(newCh, parent, renderer, before, newStartIdx, newEndIdx + 1);
    } else {
      unmountVNodes(oldCh, parent, renderer, true, oldStartIdx, oldEndIdx + 1);
    }
  }
}
function updateStaticChildren(c1, c2, parent, renderer) {
  const c1Length = c1.length;
  const c2Length = c2.length;
  if (c1Length === 0) {
    // the old list is empty, we can directly insert anything new
    mountVNodes(c2, parent, renderer, null);
    return;
  }
  if (c2Length === 0) {
    // the old list is nonempty and the new list is empty so we can directly remove all old nodes
    // this is the case in which the dynamic children of an if-directive should be removed
    unmountVNodes(c1, parent, renderer, true);
    return;
  }
  // if the old list is not empty, the new list MUST have the same
  // amount of nodes, that's why we call this static children
  let anchor = null;
  for (let i = c2Length - 1; i >= 0; i -= 1) {
    const n1 = c1[i];
    const n2 = c2[i];
    if (n2 !== n1) {
      if (isVNode(n1)) {
        if (isVNode(n2)) {
          if (isSameVnode(n1, n2)) {
            // both vnodes are equivalent, and we just need to patch them
            patch(n1, n2, parent, renderer);
            anchor = n2.elm;
          } else {
            // removing the old vnode since the new one is different
            unmount(n1, parent, renderer, true);
            mount(n2, parent, renderer, anchor);
            anchor = n2.elm;
          }
        } else {
          // removing the old vnode since the new one is null
          unmount(n1, parent, renderer, true);
        }
      } else if (isVNode(n2)) {
        mount(n2, parent, renderer, anchor);
        anchor = n2.elm;
      }
    }
  }
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const SymbolIterator = Symbol.iterator;
function addVNodeToChildLWC(vnode) {
  ArrayPush$1.call(getVMBeingRendered().velements, vnode);
}
// [s]tatic [p]art
function sp(partId, data, text) {
  // Static part will always have either text or data, it's guaranteed by the compiler.
  const type = isNull(text) ? 1 /* VStaticPartType.Element */ : 0 /* VStaticPartType.Text */;
  return {
    type,
    partId,
    data,
    text,
    elm: undefined // elm is defined later
  };
}
// [s]coped [s]lot [f]actory
function ssf(slotName, factory) {
  return {
    type: 6 /* VNodeType.ScopedSlotFragment */,
    factory,
    owner: getVMBeingRendered(),
    elm: undefined,
    sel: '__scoped_slot_fragment__',
    key: undefined,
    slotName
  };
}
// [st]atic node
function st(fragmentFactory, key, parts) {
  const owner = getVMBeingRendered();
  const fragment = fragmentFactory(parts);
  const vnode = {
    type: 4 /* VNodeType.Static */,
    sel: '__static__',
    key,
    elm: undefined,
    fragment,
    owner,
    parts,
    slotAssignment: undefined
  };
  return vnode;
}
// [fr]agment node
function fr(key, children, stable) {
  const owner = getVMBeingRendered();
  const useCommentNodes = isAPIFeatureEnabled(5 /* APIFeature.USE_COMMENTS_FOR_FRAGMENT_BOOKENDS */, owner.apiVersion);
  const leading = useCommentNodes ? co('') : t('');
  const trailing = useCommentNodes ? co('') : t('');
  return {
    type: 5 /* VNodeType.Fragment */,
    sel: '__fragment__',
    key,
    elm: undefined,
    children: [leading, ...children, trailing],
    stable,
    owner,
    leading,
    trailing
  };
}
// [h]tml node
function h(sel, data, children = EmptyArray) {
  const vmBeingRendered = getVMBeingRendered();
  if (process.env.NODE_ENV !== 'production') {
    assert.isTrue(isString(sel), `h() 1st argument sel must be a string.`);
    assert.isTrue(isObject(data), `h() 2nd argument data must be an object.`);
    assert.isTrue(isArray$1(children), `h() 3rd argument children must be an array.`);
    assert.isTrue('key' in data, ` <${sel}> "key" attribute is invalid or missing for ${vmBeingRendered}. Key inside iterator is either undefined or null.`);
    // checking reserved internal data properties
    assert.isFalse(data.className && data.classMap, `vnode.data.className and vnode.data.classMap ambiguous declaration.`);
    assert.isFalse(data.styleDecls && data.style, `vnode.data.styleDecls and vnode.data.style ambiguous declaration.`);
    forEach.call(children, childVnode => {
      if (childVnode != null) {
        assert.isTrue('type' in childVnode && 'sel' in childVnode && 'elm' in childVnode && 'key' in childVnode, `${childVnode} is not a vnode.`);
      }
    });
  }
  const {
    key,
    slotAssignment
  } = data;
  const vnode = {
    type: 2 /* VNodeType.Element */,
    sel,
    data,
    children,
    elm: undefined,
    key,
    owner: vmBeingRendered,
    slotAssignment
  };
  return vnode;
}
// [t]ab[i]ndex function
function ti(value) {
  // if value is greater than 0, we normalize to 0
  // If value is an invalid tabIndex value (null, undefined, string, etc), we let that value pass through
  // If value is less than -1, we don't care
  const shouldNormalize = value > 0 && !(isTrue(value) || isFalse(value));
  if (process.env.NODE_ENV !== 'production') {
    const vmBeingRendered = getVMBeingRendered();
    if (shouldNormalize) {
      logError(`Invalid tabindex value \`${toString(value)}\` in template for ${vmBeingRendered}. This attribute must be set to 0 or -1.`, vmBeingRendered);
    }
  }
  return shouldNormalize ? 0 : value;
}
// [s]lot element node
function s(slotName, data, children, slotset) {
  if (process.env.NODE_ENV !== 'production') {
    assert.isTrue(isString(slotName), `s() 1st argument slotName must be a string.`);
    assert.isTrue(isObject(data), `s() 2nd argument data must be an object.`);
    assert.isTrue(isArray$1(children), `h() 3rd argument children must be an array.`);
  }
  const vmBeingRendered = getVMBeingRendered();
  const {
    renderMode,
    apiVersion
  } = vmBeingRendered;
  if (!isUndefined$1(slotset) && !isUndefined$1(slotset.slotAssignments) && !isUndefined$1(slotset.slotAssignments[slotName]) && slotset.slotAssignments[slotName].length !== 0) {
    const newChildren = [];
    const slotAssignments = slotset.slotAssignments[slotName];
    for (let i = 0; i < slotAssignments.length; i++) {
      const vnode = slotAssignments[i];
      if (!isNull(vnode)) {
        const assignedNodeIsScopedSlot = isVScopedSlotFragment(vnode);
        // The only sniff test for a scoped <slot> element is the presence of `slotData`
        const isScopedSlotElement = !isUndefined$1(data.slotData);
        // Check if slot types of parent and child are matching
        if (assignedNodeIsScopedSlot !== isScopedSlotElement) {
          if (process.env.NODE_ENV !== 'production') {
            logError(`Mismatched slot types for ${slotName === '' ? '(default)' : slotName} slot. Both parent and child component must use standard type or scoped type for a given slot.`, slotset.owner);
          }
          // Ignore slot content from parent
          continue;
        }
        // If the passed slot content is factory, evaluate it and add the produced vnodes
        if (assignedNodeIsScopedSlot) {
          // Evaluate in the scope of the slot content's owner
          // if a slotset is provided, there will always be an owner. The only case where owner is
          // undefined is for root components, but root components cannot accept slotted content
          setVMBeingRendered(slotset.owner);
          try {
            // The factory function is a template snippet from the slot set owner's template,
            // hence switch over to the slot set owner's template reactive observer
            const {
              tro
            } = slotset.owner;
            tro.observe(() => {
              ArrayPush$1.call(newChildren, vnode.factory(data.slotData, data.key));
            });
          } finally {
            setVMBeingRendered(vmBeingRendered);
          }
        } else {
          // This block is for standard slots (non-scoped slots)
          let clonedVNode;
          if (renderMode === 0 /* RenderMode.Light */ && isAPIFeatureEnabled(6 /* APIFeature.USE_LIGHT_DOM_SLOT_FORWARDING */, apiVersion) && (isVBaseElement(vnode) || isVStatic(vnode)) && vnode.slotAssignment !== data.slotAssignment) {
            // When the light DOM slot assignment (slot attribute) changes, we can't use the same reference
            // to the vnode because the current way the diffing algo works, it will replace the original
            // reference to the host element with a new one. This means the new element will be mounted and
            // immediately unmounted. Creating a copy of the vnode preserves a reference to the previous
            // host element.
            clonedVNode = {
              ...vnode,
              slotAssignment: data.slotAssignment
            };
            // For disconnectedCallback to work correctly in synthetic lifecycle mode, we need to link the
            // current VM's velements to the clone, so that when the VM unmounts, the clone also unmounts.
            // Note this only applies to VCustomElements, since those are the elements that we manually need
            // to call disconnectedCallback for, when running in synthetic lifecycle mode.
            //
            // You might think it would make more sense to add the clonedVNode to the same velements array
            // as the original vnode's VM (i.e. `vnode.owner.velements`) rather than the current VM (i.e.
            // `vmBeingRendered.velements`), but this actually might not trigger disconnectedCallback
            // in synthetic lifecycle mode. The reason for this is that a reactivity change may cause
            // the slottable component to unmount, but _not_ the slotter component (see issue #4446).
            //
            // If this occurs, then the slottable component (i.e .this component we are rendering right
            // now) is the one that needs to own the clone. Whereas if a reactivity change higher in the
            // tree causes the slotter to unmount, then the slottable will also unmount. So using the
            // current VM works either way.
            if (isVCustomElement(vnode)) {
              addVNodeToChildLWC(clonedVNode);
            }
          }
          // If the slot content is standard type, the content is static, no additional
          // processing needed on the vnode
          ArrayPush$1.call(newChildren, clonedVNode ?? vnode);
        }
      }
    }
    children = newChildren;
  }
  const {
    shadowMode
  } = vmBeingRendered;
  if (renderMode === 0 /* RenderMode.Light */) {
    // light DOM slots - backwards-compatible behavior uses flattening, new behavior uses fragments
    if (isAPIFeatureEnabled(2 /* APIFeature.USE_FRAGMENTS_FOR_LIGHT_DOM_SLOTS */, apiVersion)) {
      return fr(data.key, children, 0);
    } else {
      sc(children);
      return children;
    }
  }
  if (shadowMode === 1 /* ShadowMode.Synthetic */) {
    // TODO [#1276]: compiler should give us some sort of indicator when a vnodes collection is dynamic
    sc(children);
  }
  return h('slot', data, children);
}
// [c]ustom element node
function c(sel, Ctor, data, children = EmptyArray) {
  const vmBeingRendered = getVMBeingRendered();
  if (process.env.NODE_ENV !== 'production') {
    assert.isTrue(isString(sel), `c() 1st argument sel must be a string.`);
    assert.isTrue(isFunction$1(Ctor), `c() 2nd argument Ctor must be a function.`);
    assert.isTrue(isObject(data), `c() 3nd argument data must be an object.`);
    assert.isTrue(arguments.length === 3 || isArray$1(children), `c() 4nd argument data must be an array.`);
    // checking reserved internal data properties
    assert.isFalse(data.className && data.classMap, `vnode.data.className and vnode.data.classMap ambiguous declaration.`);
    assert.isFalse(data.styleDecls && data.style, `vnode.data.styleDecls and vnode.data.style ambiguous declaration.`);
    if (data.style && !isString(data.style)) {
      logError(`Invalid 'style' attribute passed to <${sel}> is ignored. This attribute must be a string value.`, vmBeingRendered);
    }
    if (arguments.length === 4) {
      forEach.call(children, childVnode => {
        if (childVnode != null) {
          assert.isTrue('type' in childVnode && 'sel' in childVnode && 'elm' in childVnode && 'key' in childVnode, `${childVnode} is not a vnode.`);
        }
      });
    }
  }
  const {
    key,
    slotAssignment
  } = data;
  const vnode = {
    type: 3 /* VNodeType.CustomElement */,
    sel,
    data,
    children,
    elm: undefined,
    key,
    slotAssignment,
    ctor: Ctor,
    owner: vmBeingRendered,
    mode: 'open',
    // TODO [#1294]: this should be defined in Ctor
    aChildren: undefined,
    vm: undefined
  };
  addVNodeToChildLWC(vnode);
  return vnode;
}
// [i]terable node
function i(iterable, factory) {
  const list = [];
  // TODO [#1276]: compiler should give us some sort of indicator when a vnodes collection is dynamic
  sc(list);
  const vmBeingRendered = getVMBeingRendered();
  if (isUndefined$1(iterable) || isNull(iterable)) {
    if (process.env.NODE_ENV !== 'production') {
      logError(`Invalid template iteration for value \`${toString(iterable)}\` in ${vmBeingRendered}. It must be an array-like object.`, vmBeingRendered);
    }
    return list;
  }
  if (process.env.NODE_ENV !== 'production') {
    assert.isFalse(isUndefined$1(iterable[SymbolIterator]), `Invalid template iteration for value \`${toString(iterable)}\` in ${vmBeingRendered}. It must be an array-like object.`);
  }
  const iterator = iterable[SymbolIterator]();
  if (process.env.NODE_ENV !== 'production') {
    assert.isTrue(iterator && isFunction$1(iterator.next), `Invalid iterator function for "${toString(iterable)}" in ${vmBeingRendered}.`);
  }
  let next = iterator.next();
  let j = 0;
  let {
    value,
    done: last
  } = next;
  let keyMap;
  let iterationError;
  if (process.env.NODE_ENV !== 'production') {
    keyMap = create(null);
  }
  while (last === false) {
    // implementing a look-back-approach because we need to know if the element is the last
    next = iterator.next();
    last = next.done;
    // template factory logic based on the previous collected value
    const vnode = factory(value, j, j === 0, last === true);
    if (isArray$1(vnode)) {
      ArrayPush$1.apply(list, vnode);
    } else {
      // `isArray` doesn't narrow this block properly...
      ArrayPush$1.call(list, vnode);
    }
    if (process.env.NODE_ENV !== 'production') {
      const vnodes = isArray$1(vnode) ? vnode : [vnode];
      forEach.call(vnodes, childVnode => {
        // Check that the child vnode is either an element or VStatic
        if (!isNull(childVnode) && (isVBaseElement(childVnode) || isVStatic(childVnode))) {
          const {
            key
          } = childVnode;
          // In @lwc/engine-server the fragment doesn't have a tagName, default to the VM's tagName.
          const {
            tagName
          } = vmBeingRendered;
          if (isString(key) || isNumber(key)) {
            if (keyMap[key] === 1 && isUndefined$1(iterationError)) {
              iterationError = `Duplicated "key" attribute value in "<${tagName}>" for item number ${j}. A key with value "${key}" appears more than once in the iteration. Key values must be unique numbers or strings.`;
            }
            keyMap[key] = 1;
          } else if (isUndefined$1(iterationError)) {
            iterationError = `Invalid "key" attribute value in "<${tagName}>" for item number ${j}. Set a unique "key" value on all iterated child elements.`;
          }
        }
      });
    }
    // preparing next value
    j += 1;
    value = next.value;
  }
  if (process.env.NODE_ENV !== 'production') {
    if (!isUndefined$1(iterationError)) {
      logError(iterationError, vmBeingRendered);
    }
  }
  return list;
}
/**
 * [f]lattening
 * @param items
 */
function f(items) {
  if (process.env.NODE_ENV !== 'production') {
    assert.isTrue(isArray$1(items), 'flattening api can only work with arrays.');
  }
  const len = items.length;
  const flattened = [];
  // TODO [#1276]: compiler should give us some sort of indicator when a vnodes collection is dynamic
  sc(flattened);
  for (let j = 0; j < len; j += 1) {
    const item = items[j];
    if (isArray$1(item)) {
      ArrayPush$1.apply(flattened, item);
    } else {
      // `isArray` doesn't narrow this block properly...
      ArrayPush$1.call(flattened, item);
    }
  }
  return flattened;
}
// [t]ext node
function t(text) {
  return {
    type: 0 /* VNodeType.Text */,
    sel: '__text__',
    text,
    elm: undefined,
    key: undefined,
    owner: getVMBeingRendered()
  };
}
// [co]mment node
function co(text) {
  return {
    type: 1 /* VNodeType.Comment */,
    sel: '__comment__',
    text,
    elm: undefined,
    key: undefined,
    owner: getVMBeingRendered()
  };
}
// [d]ynamic text
function d(value) {
  return value == null ? '' : String(value);
}
// [b]ind function
function b(fn) {
  const vmBeingRendered = getVMBeingRendered();
  if (isNull(vmBeingRendered)) {
    throw new Error();
  }
  const vm = vmBeingRendered;
  return function (event) {
    invokeEventListener(vm, fn, vm.component, event);
  };
}
// [k]ey function
function k(compilerKey, obj) {
  switch (typeof obj) {
    case 'number':
    case 'string':
      return compilerKey + ':' + obj;
    case 'object':
      if (process.env.NODE_ENV !== 'production') {
        logError(`Invalid key value "${obj}" in ${getVMBeingRendered()}. Key must be a string or number.`);
      }
  }
}
// [g]lobal [id] function
function gid(id) {
  const vmBeingRendered = getVMBeingRendered();
  if (isUndefined$1(id) || id === '') {
    return id;
  }
  // We remove attributes when they are assigned a value of null
  if (isNull(id)) {
    return null;
  }
  const {
    idx,
    shadowMode
  } = vmBeingRendered;
  if (shadowMode === 1 /* ShadowMode.Synthetic */) {
    return StringReplace.call(id, /\S+/g, id => `${id}-${idx}`);
  }
  return id;
}
// [f]ragment [id] function
function fid(url) {
  const vmBeingRendered = getVMBeingRendered();
  if (isUndefined$1(url) || url === '') {
    return url;
  }
  // We remove attributes when they are assigned a value of null
  if (isNull(url)) {
    return null;
  }
  const {
    idx,
    shadowMode
  } = vmBeingRendered;
  // Apply transformation only for fragment-only-urls, and only in shadow DOM
  if (shadowMode === 1 /* ShadowMode.Synthetic */ && /^#/.test(url)) {
    return `${url}-${idx}`;
  }
  return url;
}
/**
 * [ddc] - create a (deprecated) dynamic component via `<x-foo lwc:dynamic={Ctor}>`
 *
 * TODO [#3331]: remove usage of lwc:dynamic in 246
 * @param sel
 * @param Ctor
 * @param data
 * @param children
 */
function ddc(sel, Ctor, data, children = EmptyArray) {
  if (process.env.NODE_ENV !== 'production') {
    assert.isTrue(isString(sel), `dc() 1st argument sel must be a string.`);
    assert.isTrue(isObject(data), `dc() 3nd argument data must be an object.`);
    assert.isTrue(arguments.length === 3 || isArray$1(children), `dc() 4nd argument data must be an array.`);
  }
  // null or undefined values should produce a null value in the VNodes
  if (isNull(Ctor) || isUndefined$1(Ctor)) {
    return null;
  }
  if (!isComponentConstructor(Ctor)) {
    throw new Error(`Invalid LWC Constructor ${toString(Ctor)} for custom element <${sel}>.`);
  }
  return c(sel, Ctor, data, children);
}
/**
 * [dc] - create a dynamic component via `<lwc:component lwc:is={Ctor}>`
 * @param Ctor
 * @param data
 * @param children
 */
function dc(Ctor, data, children = EmptyArray) {
  if (process.env.NODE_ENV !== 'production') {
    assert.isTrue(isObject(data), `dc() 2nd argument data must be an object.`);
    assert.isTrue(arguments.length === 3 || isArray$1(children), `dc() 3rd argument data must be an array.`);
  }
  // Null or undefined values should produce a null value in the VNodes.
  // This is the only value at compile time as the constructor will not be known.
  if (isNull(Ctor) || isUndefined$1(Ctor)) {
    return null;
  }
  if (!isComponentConstructor(Ctor)) {
    throw new Error(`Invalid constructor: "${toString(Ctor)}" is not a LightningElement constructor.`);
  }
  // Look up the dynamic component's name at runtime once the constructor is available.
  // This information is only known at runtime and is stored as part of registerComponent.
  const sel = getComponentRegisteredName(Ctor);
  if (isUndefined$1(sel) || sel === '') {
    throw new Error(`Invalid LWC constructor ${toString(Ctor)} does not have a registered name`);
  }
  return c(sel, Ctor, data, children);
}
/**
 * slow children collection marking mechanism. this API allows the compiler to signal
 * to the engine that a particular collection of children must be diffed using the slow
 * algo based on keys due to the nature of the list. E.g.:
 *
 * - slot element's children: the content of the slot has to be dynamic when in synthetic
 * shadow mode because the `vnode.children` might be the slotted
 * content vs default content, in which case the size and the
 * keys are not matching.
 * - children that contain dynamic components
 * - children that are produced by iteration
 * @param vnodes
 */
function sc(vnodes) {
  if (process.env.NODE_ENV !== 'production') {
    assert.isTrue(isArray$1(vnodes), 'sc() api can only work with arrays.');
  }
  // We have to mark the vnodes collection as dynamic so we can later on
  // choose to use the snabbdom virtual dom diffing algo instead of our
  // static dummy algo.
  markAsDynamicChildren(vnodes);
  return vnodes;
}
// [s]anitize [h]tml [c]ontent
function shc(content) {
  const sanitizedString = sanitizeHtmlContent();
  return createSanitizedHtmlContent(sanitizedString);
}
const ncls = normalizeClass;
const api = freeze({
  s,
  h,
  c,
  i,
  f,
  t,
  d,
  b,
  k,
  co,
  dc,
  fr,
  ti,
  st,
  gid,
  fid,
  shc,
  ssf,
  ddc,
  sp,
  ncls
});

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const operationIdNameMapping = ['constructor', 'render', 'patch', 'connectedCallback', 'renderedCallback', 'disconnectedCallback', 'errorCallback', 'lwc-render', 'lwc-rerender', 'lwc-ssr-hydrate'];
const operationTooltipMapping = [
// constructor
'component constructor()',
// render
'component render() and virtual DOM rendered',
// patch
'component DOM rendered',
// connectedCallback
'component connectedCallback()',
// renderedCallback
'component renderedCallback()',
// disconnectedCallback
'component disconnectedCallback()',
// errorCallback
'component errorCallback()',
// lwc-render
'component first rendered',
// lwc-rerender
'component re-rendered',
// lwc-ssr-hydrate
'component hydrated from server-rendered HTML'];
// Even if all the browser the engine supports implements the UserTiming API, we need to guard the measure APIs.
// JSDom (used in Jest) for example doesn't implement the UserTiming APIs.
const isUserTimingSupported = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';
const start = !isUserTimingSupported ? noop : markName => {
  performance.mark(markName);
};
const end = !isUserTimingSupported ? noop : (measureName, markName, devtools) => {
  performance.measure(measureName, {
    start: markName,
    detail: {
      devtools: {
        dataType: 'track-entry',
        track: '⚡️ Lightning Web Components',
        ...devtools
      }
    }
  });
  // Clear the created marks and measure to avoid filling the performance entries buffer.
  // Note: Even if the entries get deleted, existing PerformanceObservers preserve a copy of those entries.
  performance.clearMarks(markName);
  performance.clearMeasures(measureName);
};
function getOperationName(opId) {
  return operationIdNameMapping[opId];
}
function getMeasureName(opId, vm) {
  return `${getComponentTag(vm)} - ${getOperationName(opId)}`;
}
function getMarkName(opId, vm) {
  // Adding the VM idx to the mark name creates a unique mark name component instance. This is necessary to produce
  // the right measures for components that are recursive.
  return `${getMeasureName(opId, vm)} - ${vm.idx}`;
}
function getProperties(vm) {
  return [['Tag Name', vm.tagName], ['Component ID', String(vm.idx)], ['Render Mode', vm.renderMode === 0 /* RenderMode.Light */ ? 'light DOM' : 'shadow DOM'], ['Shadow Mode', vm.shadowMode === 0 /* ShadowMode.Native */ ? 'native' : 'synthetic']];
}
function getColor(opId) {
  // As of Sept 2024: primary (dark blue), secondary (light blue), tertiary (green)
  switch (opId) {
    // GlobalSsrHydrate, GlobalRender, and Constructor tend to occur at the top level
    case 7 /* OperationId.GlobalRender */:
    case 9 /* OperationId.GlobalSsrHydrate */:
    case 0 /* OperationId.Constructor */:
      return 'primary';
    // GlobalRerender also occurs at the top level, but we want to use tertiary (green) because it's easier to
    // distinguish from primary, and at a glance you should be able to easily tell re-renders from first renders.
    case 8 /* OperationId.GlobalRerender */:
      return 'tertiary';
    // Everything else (patch/render/callbacks)
    default:
      return 'secondary';
  }
}
// Create a list of tag names to the properties that were mutated, to help answer the question of
// "why did this component re-render?"
function getMutationProperties(mutationLogs) {
  // `mutationLogs` should never have length 0, but bail out if it does for whatever reason
  if (isUndefined$1(mutationLogs)) {
    return EmptyArray;
  }
  if (!mutationLogs.length) {
    // Currently this only occurs for experimental signals, because those mutations are not triggered by accessors
    // TODO [#4546]: support signals in mutation logging
    return EmptyArray;
  }
  // Keep track of unique IDs per tag name so we can just report a raw count at the end, e.g.
  // `<x-foo> (x2)` to indicate that two instances of `<x-foo>` were rendered.
  const tagNamesToIdsAndProps = new Map();
  for (const {
    vm: {
      tagName,
      idx
    },
    prop
  } of mutationLogs) {
    let idsAndProps = tagNamesToIdsAndProps.get(tagName);
    if (isUndefined$1(idsAndProps)) {
      idsAndProps = {
        ids: new Set(),
        keys: new Set()
      };
      tagNamesToIdsAndProps.set(tagName, idsAndProps);
    }
    idsAndProps.ids.add(idx);
    idsAndProps.keys.add(prop);
  }
  // Sort by tag name
  const entries = ArraySort.call([...tagNamesToIdsAndProps], (a, b) => a[0].localeCompare(b[0]));
  const tagNames = ArrayMap.call(entries, item => item[0]);
  // Show e.g. `<x-foo>` for one instance, or `<x-foo> (x2)` for two instances. (\u00D7 is multiplication symbol)
  const tagNamesToDisplayTagNames = new Map();
  for (const tagName of tagNames) {
    const {
      ids
    } = tagNamesToIdsAndProps.get(tagName);
    const displayTagName = `<${tagName}>${ids.size > 1 ? ` (\u00D7${ids.size})` : ''}`;
    tagNamesToDisplayTagNames.set(tagName, displayTagName);
  }
  // Summary row
  const usePlural = tagNames.length > 1 || tagNamesToIdsAndProps.get(tagNames[0]).ids.size > 1;
  const result = [[`Component${usePlural ? 's' : ''}`, ArrayJoin.call(ArrayMap.call(tagNames, _ => tagNamesToDisplayTagNames.get(_)), ', ')]];
  // Detail rows
  for (const [prettyTagName, {
    keys
  }] of entries) {
    const displayTagName = tagNamesToDisplayTagNames.get(prettyTagName);
    ArrayPush$1.call(result, [displayTagName, ArrayJoin.call(ArraySort.call([...keys]), ', ')]);
  }
  return result;
}
function getTooltipText(measureName, opId) {
  return `${measureName} - ${operationTooltipMapping[opId]}`;
}
/** Indicates if operations should be logged via the User Timing API. */
const isMeasureEnabled = process.env.NODE_ENV !== 'production';
function logOperationStart(opId, vm) {
  if (isMeasureEnabled) {
    const markName = getMarkName(opId, vm);
    start(markName);
  }
}
function logOperationEnd(opId, vm) {
  if (isMeasureEnabled) {
    const markName = getMarkName(opId, vm);
    const measureName = getMeasureName(opId, vm);
    end(measureName, markName, {
      color: getColor(opId),
      tooltipText: getTooltipText(measureName, opId),
      properties: getProperties(vm)
    });
  }
}
function logGlobalOperationStart(opId) {
  if (isMeasureEnabled) {
    const markName = getOperationName(opId);
    start(markName);
  }
}
function logGlobalOperationStartWithVM(opId, vm) {
  if (isMeasureEnabled) {
    const markName = getMarkName(opId, vm);
    start(markName);
  }
}
function logGlobalOperationEnd(opId, mutationLogs) {
  if (isMeasureEnabled) {
    const opName = getOperationName(opId);
    const markName = opName;
    end(opName, markName, {
      color: getColor(opId),
      tooltipText: getTooltipText(opName, opId),
      properties: getMutationProperties(mutationLogs)
    });
  }
}
function logGlobalOperationEndWithVM(opId, vm) {
  if (isMeasureEnabled) {
    const opName = getOperationName(opId);
    const markName = getMarkName(opId, vm);
    end(opName, markName, {
      color: getColor(opId),
      tooltipText: getTooltipText(opName, opId),
      properties: getProperties(vm)
    });
  }
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// HAS_SCOPED_STYLE | SHADOW_MODE_SYNTHETIC = 3
const MAX_CACHE_KEY = 3;
// Mapping of cacheKeys to `string[]` (assumed to come from a tagged template literal) to an Element.
// Note that every unique tagged template literal will have a unique `string[]`. So by using `string[]`
// as the WeakMap key, we effectively associate each Element with a unique tagged template literal.
// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates
// Also note that this array only needs to be large enough to account for the maximum possible cache key
const fragmentCache = ArrayFrom({
  length: MAX_CACHE_KEY + 1
}, () => new WeakMap());
// Only used in LWC's integration tests
if (process.env.NODE_ENV === 'test-lwc-integration') {
  window.__lwcResetFragmentCache = () => {
    for (let i = 0; i < fragmentCache.length; i++) {
      fragmentCache[i] = new WeakMap();
    }
  };
}
function getFromFragmentCache(cacheKey, strings) {
  return fragmentCache[cacheKey].get(strings);
}
function setInFragmentCache(cacheKey, strings, element) {
  fragmentCache[cacheKey].set(strings, element);
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
let isUpdatingTemplate = false;
let vmBeingRendered = null;
function getVMBeingRendered() {
  return vmBeingRendered;
}
function setVMBeingRendered(vm) {
  vmBeingRendered = vm;
}
function validateSlots(vm) {
  assertNotProd(); // this method should never leak to prod
  const {
    cmpSlots
  } = vm;
  for (const slotName in cmpSlots.slotAssignments) {
    assert.isTrue(isArray$1(cmpSlots.slotAssignments[slotName]), `Slots can only be set to an array, instead received ${toString(cmpSlots.slotAssignments[slotName])} for slot "${slotName}" in ${vm}.`);
  }
}
function checkHasMatchingRenderMode(template, vm) {
  // don't validate in prod environments where reporting is disabled
  if (process.env.NODE_ENV === 'production' && true) {
    return;
  }
  // don't validate the default empty template - it is not inherently light or shadow
  if (template === defaultEmptyTemplate) {
    return;
  }
  // TODO [#4663]: `renderMode` mismatch between template and component causes `console.error` but no error
  // Note that `undefined` means shadow in this case, because shadow is the default.
  const vmIsLight = vm.renderMode === 0 /* RenderMode.Light */;
  const templateIsLight = template.renderMode === 'light';
  if (vmIsLight !== templateIsLight) {
    report("RenderModeMismatch" /* ReportingEventId.RenderModeMismatch */, {
      tagName: vm.tagName,
      mode: vm.renderMode
    });
    if (process.env.NODE_ENV !== 'production') {
      const tagName = getComponentTag(vm);
      const message = vmIsLight ? `Light DOM components can't render shadow DOM templates. Add an 'lwc:render-mode="light"' directive to the root template tag of ${tagName}.` : `Shadow DOM components template can't render light DOM templates. Either remove the 'lwc:render-mode' directive from ${tagName} or set it to 'lwc:render-mode="shadow"`;
      logError(message);
    }
  }
}
const browserExpressionSerializer = (partToken, classAttrToken) => {
  // This will insert the scoped style token as a static class attribute in the fragment
  // bypassing the need to call applyStyleScoping when mounting static parts.
  const type = StringCharAt.call(partToken, 0);
  switch (type) {
    case "c" /* STATIC_PART_TOKEN_ID.CLASS */:
      return classAttrToken;
    case "t" /* STATIC_PART_TOKEN_ID.TEXT */:
      // Using a single space here gives us a single empty text node
      return ' ';
    default:
      return '';
  }
};
// This function serializes the expressions generated by static content optimization.
// Currently this is only needed for SSR.
// TODO [#4078]: Split the implementation between @lwc/engine-dom and @lwc/engine-server
function buildSerializeExpressionFn(parts) {
  {
    return browserExpressionSerializer;
  }
}
function buildParseFragmentFn(createFragmentFn) {
  return function parseFragment(strings, ...keys) {
    return function applyFragmentParts(parts) {
      const {
        context: {
          hasScopedStyles,
          stylesheetToken
        },
        shadowMode,
        renderer
      } = getVMBeingRendered();
      const hasStyleToken = !isUndefined$1(stylesheetToken);
      const isSyntheticShadow = shadowMode === 1 /* ShadowMode.Synthetic */;
      let cacheKey = 0;
      if (hasStyleToken && hasScopedStyles) {
        cacheKey |= 1 /* FragmentCacheKey.HAS_SCOPED_STYLE */;
      }
      if (hasStyleToken && isSyntheticShadow) {
        cacheKey |= 2 /* FragmentCacheKey.SHADOW_MODE_SYNTHETIC */;
      }
      // Cache is only here to prevent calling innerHTML multiple times which doesn't happen on the server.
      {
        // Disable this on the server to prevent cache poisoning when expressions are used.
        const cached = getFromFragmentCache(cacheKey, strings);
        if (!isUndefined$1(cached)) {
          return cached;
        }
      }
      // See W-16614556
      // TODO [#2826]: freeze the template object
      if (hasStyleToken && !isValidScopeToken(stylesheetToken)) {
        throw new Error('stylesheet token must be a valid string');
      }
      const classToken = hasScopedStyles && hasStyleToken ? ' ' + stylesheetToken : '';
      const classAttrToken = hasScopedStyles && hasStyleToken ? ` class="${stylesheetToken}"` : '';
      const attrToken = hasStyleToken && isSyntheticShadow ? ' ' + stylesheetToken : '';
      // In the browser, we provide the entire class attribute as a perf optimization to avoid applying it on mount.
      // The remaining class expression will be applied when the static parts are mounted.
      // In SSR, the entire class attribute (expression included) is assembled along with the fragment.
      // This is why in the browser we provide the entire class attribute and in SSR we only provide the class token.
      const exprClassToken = classAttrToken;
      // TODO [#3624]: The implementation of this function should be specific to @lwc/engine-dom and @lwc/engine-server.
      // Find a way to split this in a future refactor.
      const serializeExpression = buildSerializeExpressionFn();
      let htmlFragment = '';
      for (let i = 0, n = keys.length; i < n; i++) {
        switch (keys[i]) {
          case 0:
            // styleToken in existing class attr
            htmlFragment += strings[i] + classToken;
            break;
          case 1:
            // styleToken for added class attr
            htmlFragment += strings[i] + classAttrToken;
            break;
          case 2:
            // styleToken as attr
            htmlFragment += strings[i] + attrToken;
            break;
          case 3:
            // ${1}${2}
            htmlFragment += strings[i] + classAttrToken + attrToken;
            break;
          default:
            // expressions ${partId:attributeName/textId}
            htmlFragment += strings[i] + serializeExpression(keys[i], exprClassToken);
            break;
        }
      }
      htmlFragment += strings[strings.length - 1];
      const element = createFragmentFn(htmlFragment, renderer);
      // Cache is only here to prevent calling innerHTML multiple times which doesn't happen on the server.
      {
        setInFragmentCache(cacheKey, strings, element);
      }
      return element;
    };
  };
}
// Note: at the moment this code executes, we don't have a renderer yet.
const parseFragment = buildParseFragmentFn((html, renderer) => {
  const {
    createFragment
  } = renderer;
  return createFragment(maybeSanitizeHtmlContent(html));
});
function evaluateTemplate(vm, html) {
  if (process.env.NODE_ENV !== 'production') {
    // in dev-mode, we support hot swapping of templates, which means that
    // the component instance might be attempting to use an old version of
    // the template, while internally, we have a replacement for it.
    html = getTemplateOrSwappedTemplate(html);
  }
  const isUpdatingTemplateInception = isUpdatingTemplate;
  const vmOfTemplateBeingUpdatedInception = vmBeingRendered;
  let vnodes = [];
  runWithBoundaryProtection(vm, vm.owner, () => {
    // pre
    vmBeingRendered = vm;
    logOperationStart(1 /* OperationId.Render */, vm);
  }, () => {
    // job
    const {
      component,
      context,
      cmpSlots,
      cmpTemplate,
      tro
    } = vm;
    tro.observe(() => {
      // Reset the cache memoizer for template when needed.
      if (html !== cmpTemplate) {
        // Check that the template was built by the compiler.
        if (!isTemplateRegistered(html)) {
          throw new TypeError(`Invalid template returned by the render() method on ${vm.tagName}. It must return an imported template (e.g.: \`import html from "./${vm.def.name}.html"\`), instead, it has returned: ${toString(html)}.`);
        }
        checkHasMatchingRenderMode(html, vm);
        // Perf opt: do not reset the shadow root during the first rendering (there is
        // nothing to reset).
        if (!isNull(cmpTemplate)) {
          // It is important to reset the content to avoid reusing similar elements
          // generated from a different template, because they could have similar IDs,
          // and snabbdom just rely on the IDs.
          resetComponentRoot(vm);
        }
        vm.cmpTemplate = html;
        // Create a brand new template cache for the swapped templated.
        context.tplCache = create(null);
        // Set the computeHasScopedStyles property in the context, to avoid recomputing it repeatedly.
        context.hasScopedStyles = computeHasScopedStyles(html, vm);
        // Update the scoping token on the host element.
        updateStylesheetToken(vm, html);
        // Evaluate, create stylesheet and cache the produced VNode for future
        // re-rendering.
        const stylesheetsContent = getStylesheetsContent(vm, html);
        context.styleVNodes = stylesheetsContent.length === 0 ? null : createStylesheet(vm, stylesheetsContent);
      }
      if (process.env.NODE_ENV !== 'production') {
        // validating slots in every rendering since the allocated content might change over time
        validateSlots(vm);
        // add the VM to the list of host VMs that can be re-rendered if html is swapped
        setActiveVM(vm);
      }
      // right before producing the vnodes, we clear up all internal references
      // to custom elements from the template.
      vm.velements = [];
      // Set the global flag that template is being updated
      isUpdatingTemplate = true;
      vnodes = Reflect.apply(html, undefined, [api, component, cmpSlots, context.tplCache]);
      const {
        styleVNodes
      } = context;
      if (!isNull(styleVNodes)) {
        // It's important here not to mutate the underlying `vnodes` returned from the template invocation.
        // The reason for this is because, due to the static content optimization, the vnodes array
        // may be a static array shared across multiple component instances. E.g. this occurs in the
        // case of an empty `<template></template>` in a `component.html` file, due to the underlying
        // children being `[]` (no children). If we append the `<style>` vnode to this array, then the same
        // array will be reused for every component instance, i.e. whenever `tmpl()` is called.
        vnodes = [...styleVNodes, ...vnodes];
      }
    });
  }, () => {
    // post
    isUpdatingTemplate = isUpdatingTemplateInception;
    vmBeingRendered = vmOfTemplateBeingUpdatedInception;
    logOperationEnd(1 /* OperationId.Render */, vm);
  });
  if (process.env.NODE_ENV !== 'production') {
    if (!isArray$1(vnodes)) {
      logError(`Compiler should produce html functions that always return an array.`);
    }
  }
  return vnodes;
}
function computeHasScopedStylesInStylesheets(stylesheets) {
  if (hasStyles(stylesheets)) {
    for (let i = 0; i < stylesheets.length; i++) {
      if (isTrue(stylesheets[i][KEY__SCOPED_CSS])) {
        return true;
      }
    }
  }
  return false;
}
function computeHasScopedStyles(template, vm) {
  const {
    stylesheets
  } = template;
  const vmStylesheets = !isUndefined$1(vm) ? vm.stylesheets : null;
  return computeHasScopedStylesInStylesheets(stylesheets) || computeHasScopedStylesInStylesheets(vmStylesheets);
}
function hasStyles(stylesheets) {
  return !isUndefined$1(stylesheets) && !isNull(stylesheets) && stylesheets.length > 0;
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
let isInvokingRender = false;
let vmBeingConstructed = null;
function isBeingConstructed(vm) {
  return vmBeingConstructed === vm;
}
function invokeComponentCallback(vm, fn, args) {
  const {
    component,
    callHook,
    owner
  } = vm;
  runWithBoundaryProtection(vm, owner, noop, () => {
    callHook(component, fn, args);
  }, noop);
}
function invokeComponentConstructor(vm, Ctor) {
  const vmBeingConstructedInception = vmBeingConstructed;
  let error;
  logOperationStart(0 /* OperationId.Constructor */, vm);
  vmBeingConstructed = vm;
  /**
   * Constructors don't need to be wrapped with a boundary because for root elements
   * it should throw, while elements from template are already wrapped by a boundary
   * associated to the diffing algo.
   */
  try {
    // job
    const result = new Ctor();
    // When strict, reject when the constructor returns a *native* HTMLElement — that is,
    // result instanceof HTMLElement.
    const useStrictValidation = !lwcRuntimeFlags.DISABLE_STRICT_VALIDATION && true;
    const isMismatchedConstructor = vmBeingConstructed.component !== result;
    const isInvalidConstructor = isMismatchedConstructor || useStrictValidation && result instanceof HTMLElement;
    if (isInvalidConstructor) {
      throw new TypeError('Invalid component constructor, the class should extend LightningElement.');
    }
  } catch (e) {
    error = Object(e);
  } finally {
    logOperationEnd(0 /* OperationId.Constructor */, vm);
    vmBeingConstructed = vmBeingConstructedInception;
    if (!isUndefined$1(error)) {
      addErrorComponentStack(vm, error);
      // re-throwing the original error annotated after restoring the context
      throw error; // eslint-disable-line no-unsafe-finally
    }
  }
}
function invokeComponentRenderMethod(vm) {
  const {
    def: {
      render
    },
    callHook,
    component,
    owner
  } = vm;
  const isRenderBeingInvokedInception = isInvokingRender;
  const vmBeingRenderedInception = getVMBeingRendered();
  let html;
  let renderInvocationSuccessful = false;
  runWithBoundaryProtection(vm, owner, () => {
    // pre
    isInvokingRender = true;
    setVMBeingRendered(vm);
  }, () => {
    // job
    vm.tro.observe(() => {
      html = callHook(component, render);
      renderInvocationSuccessful = true;
    });
  }, () => {
    // post
    isInvokingRender = isRenderBeingInvokedInception;
    setVMBeingRendered(vmBeingRenderedInception);
  });
  // If render() invocation failed, process errorCallback in boundary and return an empty template
  return renderInvocationSuccessful ? evaluateTemplate(vm, html) : [];
}
function invokeEventListener(vm, fn, thisValue, event) {
  const {
    callHook,
    owner
  } = vm;
  runWithBoundaryProtection(vm, owner, noop, () => {
    // job
    if (process.env.NODE_ENV !== 'production') {
      assert.isTrue(isFunction$1(fn), `Invalid event handler for event '${event.type}' on ${vm}.`);
    }
    callHook(thisValue, fn, [event]);
  }, noop);
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const registeredComponentMap = new Map();
/**
 * INTERNAL: This function can only be invoked by compiled code. The compiler
 * will prevent this function from being imported by userland code.
 * @param Ctor
 * @param metadata
 */
function registerComponent(
// We typically expect a LightningElementConstructor, but technically you can call this with anything
Ctor, metadata) {
  if (isFunction$1(Ctor)) {
    if (process.env.NODE_ENV !== 'production') {
      // There is no point in running this in production, because the version mismatch check relies
      // on code comments which are stripped out in production by minifiers
      checkVersionMismatch(Ctor, 'component');
    }
    // TODO [#3331]: add validation to check the value of metadata.sel is not an empty string.
    registeredComponentMap.set(Ctor, metadata);
  }
  // chaining this method as a way to wrap existing assignment of component constructor easily,
  // without too much transformation
  return Ctor;
}
function getComponentRegisteredTemplate(Ctor) {
  return registeredComponentMap.get(Ctor)?.tmpl;
}
function getComponentRegisteredName(Ctor) {
  return registeredComponentMap.get(Ctor)?.sel;
}
function getComponentAPIVersion(Ctor) {
  const metadata = registeredComponentMap.get(Ctor);
  const apiVersion = metadata?.apiVersion;
  if (isUndefined$1(apiVersion)) {
    // This should only occur in our integration tests; in practice every component
    // is registered, and so this code path should not get hit. But to be safe,
    // return the lowest possible version.
    return LOWEST_API_VERSION;
  }
  return apiVersion;
}
function supportsSyntheticElementInternals(Ctor) {
  return registeredComponentMap.get(Ctor)?.enableSyntheticElementInternals || false;
}
function isComponentFeatureEnabled(Ctor) {
  const flag = registeredComponentMap.get(Ctor)?.componentFeatureFlag;
  // Default to true if not provided
  return flag?.value !== false;
}
function getComponentMetadata(Ctor) {
  return registeredComponentMap.get(Ctor);
}
function getTemplateReactiveObserver(vm) {
  const reactiveObserver = createReactiveObserver(() => {
    const {
      isDirty
    } = vm;
    if (isFalse(isDirty)) {
      markComponentAsDirty(vm);
      scheduleRehydration(vm);
    }
  });
  if (process.env.NODE_ENV !== 'production') {
    associateReactiveObserverWithVM(reactiveObserver, vm);
  }
  return reactiveObserver;
}
function resetTemplateObserverAndUnsubscribe(vm) {
  const {
    tro,
    component
  } = vm;
  tro.reset();
  // Unsubscribe every time the template reactive observer is reset.
  if (lwcRuntimeFlags.ENABLE_EXPERIMENTAL_SIGNALS) {
    unsubscribeFromSignals(component);
  }
}
function renderComponent(vm) {
  if (process.env.NODE_ENV !== 'production') {
    assert.invariant(vm.isDirty, `${vm} is not dirty.`);
  }
  // The engine should only hold a subscription to a signal if it is rendered in the template.
  // Because of the potential presence of conditional rendering logic, we unsubscribe on each render
  // in the scenario where it is present in one condition but not the other.
  // For example:
  // 1. There is an lwc:if=true conditional where the signal is present on the template.
  // 2. The lwc:if changes to false and the signal is no longer present on the template.
  // If the signal is still subscribed to, the template will re-render when it receives a notification
  // from the signal, even though we won't be using the new value.
  resetTemplateObserverAndUnsubscribe(vm);
  const vnodes = invokeComponentRenderMethod(vm);
  vm.isDirty = false;
  vm.isScheduled = false;
  return vnodes;
}
function markComponentAsDirty(vm) {
  if (process.env.NODE_ENV !== 'production') {
    const vmBeingRendered = getVMBeingRendered();
    assert.isFalse(vm.isDirty, `markComponentAsDirty() for ${vm} should not be called when the component is already dirty.`);
    assert.isFalse(isInvokingRender, `markComponentAsDirty() for ${vm} cannot be called during rendering of ${vmBeingRendered}.`);
    assert.isFalse(isUpdatingTemplate, `markComponentAsDirty() for ${vm} cannot be called while updating template of ${vmBeingRendered}.`);
  }
  vm.isDirty = true;
}
const cmpEventListenerMap = new WeakMap();
function getWrappedComponentsListener(vm, listener) {
  if (!isFunction$1(listener)) {
    throw new TypeError('Expected an EventListener but received ' + typeof listener); // avoiding problems with non-valid listeners
  }
  let wrappedListener = cmpEventListenerMap.get(listener);
  if (isUndefined$1(wrappedListener)) {
    wrappedListener = function (event) {
      invokeEventListener(vm, listener, undefined, event);
    };
    cmpEventListenerMap.set(listener, wrappedListener);
  }
  return wrappedListener;
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (typeof state === "function" ? receiver !== state || true : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return state.set(receiver, value), value;
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
var _ContextBinding_renderer, _ContextBinding_providedContextVarieties, _ContextBinding_elm;
// Provider-listener teardowns per VM, registered on connect and invoked on disconnect. Without this
// the listener closures retain the detached component after every mount/unmount.
const contextProviderUnregisters = new WeakMap();
class ContextBinding {
  constructor(vm, component, providedContextVarieties) {
    _ContextBinding_renderer.set(this, void 0);
    _ContextBinding_providedContextVarieties.set(this, void 0);
    _ContextBinding_elm.set(this, void 0);
    this.component = component;
    __classPrivateFieldSet(this, _ContextBinding_renderer, vm.renderer);
    __classPrivateFieldSet(this, _ContextBinding_elm, vm.elm);
    __classPrivateFieldSet(this, _ContextBinding_providedContextVarieties, providedContextVarieties);
    // Register the component as a context provider.
    const unregister = __classPrivateFieldGet(this, _ContextBinding_renderer, "f").registerContextProvider(__classPrivateFieldGet(this, _ContextBinding_elm, "f"), ContextEventName, contextConsumer => {
      // This callback is invoked when the provided context is consumed somewhere down
      // in the component's subtree.
      return contextConsumer.setNewContext(__classPrivateFieldGet(this, _ContextBinding_providedContextVarieties, "f"));
    });
    // deprecated engine-server doesn't provide `unregister`
    if (unregister) {
      const unregisters = contextProviderUnregisters.get(vm);
      if (isUndefined$1(unregisters)) {
        contextProviderUnregisters.set(vm, [unregister]);
      } else {
        ArrayPush$1.call(unregisters, unregister);
      }
    }
  }
  provideContext(contextVariety, providedContextSignal) {
    if (__classPrivateFieldGet(this, _ContextBinding_providedContextVarieties, "f").has(contextVariety)) {
      logWarnOnce('Multiple contexts of the same variety were provided. Only the first context will be used.');
      return;
    }
    __classPrivateFieldGet(this, _ContextBinding_providedContextVarieties, "f").set(contextVariety, providedContextSignal);
  }
  consumeContext(contextVariety, contextProvidedCallback) {
    __classPrivateFieldGet(this, _ContextBinding_renderer, "f").registerContextConsumer(__classPrivateFieldGet(this, _ContextBinding_elm, "f"), ContextEventName, {
      setNewContext: providerContextVarieties => {
        // If the provider has the specified context variety, then it is consumed
        // and true is returned to stop bubbling.
        if (providerContextVarieties.has(contextVariety)) {
          contextProvidedCallback(providerContextVarieties.get(contextVariety));
          return true;
        }
        // Return false as context has not been found/consumed
        // and the consumer should continue traversing the context tree
        return false;
      }
    });
  }
}
_ContextBinding_renderer = new WeakMap(), _ContextBinding_providedContextVarieties = new WeakMap(), _ContextBinding_elm = new WeakMap();
function connectContext(vm) {
  // Non-decorated objects
  connect(vm, keys(vm.cmpFields), vm.cmpFields);
  // Decorated objects like @api context
  connect(vm, keys(vm.cmpProps), vm.cmpProps);
}
function disconnectContext(vm) {
  // Non-decorated objects
  disconnect(vm, keys(vm.cmpFields), vm.cmpFields);
  // Decorated objects like @api context
  disconnect(vm, keys(vm.cmpProps), vm.cmpProps);
  // Remove the provider listeners registered on connect.
  const unregisters = contextProviderUnregisters.get(vm);
  if (!isUndefined$1(unregisters)) {
    for (let i = 0; i < unregisters.length; i++) {
      unregisters[i]();
    }
    contextProviderUnregisters.delete(vm);
  }
}
function connect(vm, enumerableKeys, contextContainer) {
  const contextKeys = getContextKeys();
  if (isUndefined$1(contextKeys)) {
    return;
  }
  const {
    connectContext
  } = contextKeys;
  const {
    component
  } = vm;
  const contextfulKeys = ArrayFilter.call(enumerableKeys, enumerableKey => isTrustedContext(contextContainer[enumerableKey]));
  if (contextfulKeys.length === 0) {
    return;
  }
  const providedContextVarieties = new Map();
  try {
    for (let i = 0; i < contextfulKeys.length; i++) {
      contextContainer[contextfulKeys[i]][connectContext](new ContextBinding(vm, component, providedContextVarieties));
    }
  } catch (err) {
    logWarnOnce(`Attempted to connect to trusted context but received the following error: ${err.message}`);
  }
}
function disconnect(vm, enumerableKeys, contextContainer) {
  {
    return;
  }
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
let idx = 0;
/** The internal slot used to associate different objects the engine manipulates with the VM */
const ViewModelReflection = new WeakMap();
function callHook(cmp, fn, args = []) {
  return fn.apply(cmp, args);
}
function setHook(cmp, prop, newValue) {
  cmp[prop] = newValue;
}
function getHook(cmp, prop) {
  return cmp[prop];
}
function rerenderVM(vm) {
  rehydrate(vm);
}
function connectRootElement(elm) {
  const vm = getAssociatedVM(elm);
  if (process.env.NODE_ENV !== 'production') {
    // Flush any logs for this VM so that the initial properties from the constructor don't "count"
    // in subsequent re-renders (lwc-rerender). Right now we're at the first render (lwc-hydrate).
    flushMutationLogsForVM(vm);
  }
  logGlobalOperationStartWithVM(7 /* OperationId.GlobalRender */, vm);
  // Usually means moving the element from one place to another, which is observable via
  // life-cycle hooks.
  if (vm.state === 1 /* VMState.connected */) {
    disconnectRootElement(elm);
  }
  runConnectedCallback(vm);
  rehydrate(vm);
  logGlobalOperationEndWithVM(7 /* OperationId.GlobalRender */, vm);
}
function disconnectRootElement(elm) {
  const vm = getAssociatedVM(elm);
  resetComponentStateWhenRemoved(vm);
}
function appendVM(vm) {
  rehydrate(vm);
}
// just in case the component comes back, with this we guarantee re-rendering it
// while preventing any attempt to rehydration until after reinsertion.
function resetComponentStateWhenRemoved(vm) {
  const {
    state
  } = vm;
  if (state !== 2 /* VMState.disconnected */) {
    // Making sure that any observing record will not trigger the rehydrated on this vm
    resetTemplateObserverAndUnsubscribe(vm);
    runDisconnectedCallback(vm);
    // Spec: https://dom.spec.whatwg.org/#concept-node-remove (step 14-15)
    runChildNodesDisconnectedCallback(vm);
    runLightChildNodesDisconnectedCallback(vm);
  }
}
// this method is triggered by the diffing algo only when a vnode from the
// old vnode.children is removed from the DOM.
function removeVM(vm) {
  if (process.env.NODE_ENV !== 'production') {
    if (lwcRuntimeFlags.DISABLE_NATIVE_CUSTOM_ELEMENT_LIFECYCLE) {
      // With native lifecycle, we cannot be certain that connectedCallback was called before a component
      // was removed from the VDOM. If the component is disconnected, then connectedCallback will not fire
      // in native mode, although it will fire in synthetic mode due to appendChild triggering it.
      // See: W-14037619 for details
      assert.isTrue(vm.state === 1 /* VMState.connected */ || vm.state === 2 /* VMState.disconnected */, `${vm} must have been connected.`);
    }
  }
  resetComponentStateWhenRemoved(vm);
}
function getNearestShadowAncestor(owner) {
  let ancestor = owner;
  while (!isNull(ancestor) && ancestor.renderMode === 0 /* RenderMode.Light */) {
    ancestor = ancestor.owner;
  }
  return ancestor;
}
function createVM(elm, ctor, renderer, options) {
  const {
    mode,
    owner,
    tagName,
    hydrated
  } = options;
  const def = getComponentInternalDef(ctor);
  const apiVersion = getComponentAPIVersion(ctor);
  const vm = {
    elm,
    def,
    idx: idx++,
    state: 0 /* VMState.created */,
    isScheduled: false,
    isDirty: true,
    tagName,
    mode,
    owner,
    refVNodes: null,
    attachedEventListeners: new WeakMap(),
    children: EmptyArray,
    aChildren: EmptyArray,
    velements: EmptyArray,
    cmpProps: create(null),
    cmpFields: create(null),
    cmpSlots: {
      slotAssignments: create(null)
    },
    cmpTemplate: null,
    hydrated: Boolean(hydrated),
    renderMode: def.renderMode,
    context: {
      stylesheetToken: undefined,
      hasTokenInClass: undefined,
      hasTokenInAttribute: undefined,
      hasScopedStyles: undefined,
      styleVNodes: null,
      tplCache: EmptyObject,
      wiredConnecting: EmptyArray,
      wiredDisconnecting: EmptyArray
    },
    // Properties set right after VM creation.
    tro: null,
    shadowMode: null,
    stylesheets: null,
    // Properties set by the LightningElement constructor.
    component: null,
    shadowRoot: null,
    renderRoot: null,
    callHook,
    setHook,
    getHook,
    renderer,
    apiVersion
  };
  if (process.env.NODE_ENV !== 'production') {
    vm.debugInfo = create(null);
  }
  vm.stylesheets = computeStylesheets(vm, def.ctor);
  vm.shadowMode = computeShadowMode(def, vm.owner, renderer, hydrated);
  vm.tro = getTemplateReactiveObserver(vm);
  if (process.env.NODE_ENV !== 'production') {
    vm.toString = () => {
      return `[object:vm ${def.name} (${vm.idx})]`;
    };
  }
  // Create component instance associated to the vm and the element.
  invokeComponentConstructor(vm, def.ctor);
  // Initializing the wire decorator per instance only when really needed
  if (hasWireAdapters(vm)) {
    installWireAdapters(vm);
  }
  return vm;
}
function validateComponentStylesheets(vm, stylesheets) {
  let valid = true;
  const validate = arrayOrStylesheet => {
    if (isArray$1(arrayOrStylesheet)) {
      for (let i = 0; i < arrayOrStylesheet.length; i++) {
        validate(arrayOrStylesheet[i]);
      }
    } else if (!isFunction$1(arrayOrStylesheet)) {
      // function assumed to be a stylesheet factory
      valid = false;
    }
  };
  if (!isArray$1(stylesheets)) {
    valid = false;
  } else {
    validate(stylesheets);
  }
  return valid;
}
// Validate and flatten any stylesheets defined as `static stylesheets`
function computeStylesheets(vm, ctor) {
  warnOnStylesheetsMutation(ctor);
  const {
    stylesheets
  } = ctor;
  if (!isUndefined$1(stylesheets)) {
    const valid = validateComponentStylesheets(vm, stylesheets);
    if (valid) {
      return flattenStylesheets(stylesheets);
    } else if (process.env.NODE_ENV !== 'production') {
      logError(`static stylesheets must be an array of CSS stylesheets. Found invalid stylesheets on <${vm.tagName}>`, vm);
    }
  }
  return null;
}
function warnOnStylesheetsMutation(ctor) {
  if (process.env.NODE_ENV !== 'production') {
    let {
      stylesheets
    } = ctor;
    defineProperty(ctor, 'stylesheets', {
      enumerable: true,
      configurable: true,
      get() {
        return stylesheets;
      },
      set(newValue) {
        logWarnOnce(`Dynamically setting the "stylesheets" static property on ${ctor.name} ` + 'will not affect the stylesheets injected.');
        stylesheets = newValue;
      }
    });
  }
}
// Compute the shadowMode/renderMode without creating a VM. This is used in some scenarios like hydration.
function computeShadowAndRenderMode(Ctor, renderer) {
  const def = getComponentInternalDef(Ctor);
  const {
    renderMode
  } = def;
  // Assume null `owner` - this is what happens in hydration cases anyway
  // Also assume we are not in hydration mode for this exported API
  const shadowMode = computeShadowMode(def, /* owner */null, renderer, false);
  return {
    renderMode,
    shadowMode
  };
}
function computeShadowMode(def, owner, renderer, hydrated) {
  if (
  // Force the shadow mode to always be native. Used for running tests with synthetic shadow patches
  // on, but components running in actual native shadow mode
  process.env.NODE_ENV === 'test-lwc-integration' && process.env.FORCE_NATIVE_SHADOW_MODE_FOR_TEST ||
  // If synthetic shadow is explicitly disabled, use pure-native
  lwcRuntimeFlags.DISABLE_SYNTHETIC_SHADOW ||
  // hydration only supports native shadow
  isTrue(hydrated)) {
    return 0 /* ShadowMode.Native */;
  }
  const {
    isSyntheticShadowDefined
  } = renderer;
  let shadowMode;
  if (isSyntheticShadowDefined) {
    if (def.renderMode === 0 /* RenderMode.Light */) {
      // ShadowMode.Native implies "not synthetic shadow" which is consistent with how
      // everything defaults to native when the synthetic shadow polyfill is unavailable.
      shadowMode = 0 /* ShadowMode.Native */;
    } else if (def.shadowSupportMode === 'native') {
      shadowMode = 0 /* ShadowMode.Native */;
    } else {
      const shadowAncestor = getNearestShadowAncestor(owner);
      if (!isNull(shadowAncestor) && shadowAncestor.shadowMode === 0 /* ShadowMode.Native */) {
        // Transitive support for native Shadow DOM. A component in native mode
        // transitively opts all of its descendants into native.
        shadowMode = 0 /* ShadowMode.Native */;
      } else {
        // Synthetic if neither this component nor any of its ancestors are configured
        // to be native.
        shadowMode = 1 /* ShadowMode.Synthetic */;
      }
    }
  } else {
    // Native if the synthetic shadow polyfill is unavailable.
    shadowMode = 0 /* ShadowMode.Native */;
  }
  return shadowMode;
}
function assertIsVM(obj) {
  if (!isObject(obj) || isNull(obj) || !('renderRoot' in obj)) {
    throw new TypeError(`${obj} is not a VM.`);
  }
}
function associateVM(obj, vm) {
  ViewModelReflection.set(obj, vm);
}
function getAssociatedVM(obj) {
  const vm = ViewModelReflection.get(obj);
  if (process.env.NODE_ENV !== 'production') {
    assertIsVM(vm);
  }
  return vm;
}
function getAssociatedVMIfPresent(obj) {
  const maybeVm = ViewModelReflection.get(obj);
  if (process.env.NODE_ENV !== 'production') {
    if (!isUndefined$1(maybeVm)) {
      assertIsVM(maybeVm);
    }
  }
  return maybeVm;
}
function rehydrate(vm) {
  if (isTrue(vm.isDirty)) {
    const children = renderComponent(vm);
    patchShadowRoot(vm, children);
  }
}
function patchShadowRoot(vm, newCh) {
  const {
    renderRoot,
    children: oldCh,
    renderer
  } = vm;
  // reset the refs; they will be set during `patchChildren`
  resetRefVNodes(vm);
  // caching the new children collection
  vm.children = newCh;
  if (newCh.length > 0 || oldCh.length > 0) {
    // patch function mutates vnodes by adding the element reference,
    // however, if patching fails it contains partial changes.
    if (oldCh !== newCh) {
      runWithBoundaryProtection(vm, vm, () => {
        // pre
        logOperationStart(2 /* OperationId.Patch */, vm);
      }, () => {
        // job
        patchChildren(oldCh, newCh, renderRoot, renderer);
      }, () => {
        // post
        logOperationEnd(2 /* OperationId.Patch */, vm);
      });
    }
  }
  if (vm.state === 1 /* VMState.connected */) {
    // If the element is connected, that means connectedCallback was already issued, and
    // any successive rendering should finish with the call to renderedCallback, otherwise
    // the connectedCallback will take care of calling it in the right order at the end of
    // the current rehydration process.
    runRenderedCallback(vm);
  }
}
function runRenderedCallback(vm) {
  const {
    def: {
      renderedCallback
    }
  } = vm;
  if (!isUndefined$1(renderedCallback)) {
    logOperationStart(4 /* OperationId.RenderedCallback */, vm);
    invokeComponentCallback(vm, renderedCallback);
    logOperationEnd(4 /* OperationId.RenderedCallback */, vm);
  }
}
let rehydrateQueue = [];
function flushRehydrationQueue() {
  // Gather the logs before rehydration starts so they can be reported at the end of rehydration.
  // Note that we also clear all existing logs at this point so that subsequent re-renders start from a clean slate.
  const mutationLogs = process.env.NODE_ENV === 'production' ? undefined : getAndFlushMutationLogs();
  logGlobalOperationStart(8 /* OperationId.GlobalRerender */);
  if (process.env.NODE_ENV !== 'production') {
    assert.invariant(rehydrateQueue.length, `If rehydrateQueue was scheduled, it is because there must be at least one VM on this pending queue instead of ${rehydrateQueue}.`);
  }
  const vms = rehydrateQueue.sort((a, b) => a.idx - b.idx);
  rehydrateQueue = []; // reset to a new queue
  for (let i = 0, len = vms.length; i < len; i += 1) {
    const vm = vms[i];
    try {
      // We want to prevent rehydration from occurring when nodes are detached from the DOM as this can trigger
      // unintended side effects, like lifecycle methods being called multiple times.
      if (vm.state === 1 /* VMState.connected */) {
        rehydrate(vm);
      }
    } catch (error) {
      if (i + 1 < len) {
        // pieces of the queue are still pending to be rehydrated, those should have priority
        if (rehydrateQueue.length === 0) {
          addCallbackToNextTick(flushRehydrationQueue);
        }
        ArrayUnshift.apply(rehydrateQueue, ArraySlice.call(vms, i + 1));
      }
      // we need to end the measure before throwing.
      logGlobalOperationEnd(8 /* OperationId.GlobalRerender */, mutationLogs);
      // re-throwing the original error will break the current tick, but since the next tick is
      // already scheduled, it should continue patching the rest.
      throw error;
    }
  }
  logGlobalOperationEnd(8 /* OperationId.GlobalRerender */, mutationLogs);
}
function runConnectedCallback(vm) {
  const {
    state
  } = vm;
  if (state === 1 /* VMState.connected */) {
    return; // nothing to do since it was already connected
  }
  vm.state = 1 /* VMState.connected */;
  if (hasWireAdapters(vm)) {
    connectWireAdapters(vm);
  }
  if (lwcRuntimeFlags.ENABLE_EXPERIMENTAL_SIGNALS) {
    // Setup context before connected callback is executed
    connectContext(vm);
  }
  const {
    connectedCallback
  } = vm.def;
  if (!isUndefined$1(connectedCallback)) {
    logOperationStart(3 /* OperationId.ConnectedCallback */, vm);
    invokeComponentCallback(vm, connectedCallback);
    logOperationEnd(3 /* OperationId.ConnectedCallback */, vm);
  }
  // This test only makes sense in the browser, with synthetic lifecycle, and when reporting is enabled or
  // we're in dev mode. This is to detect a particular issue with synthetic lifecycle.
  if (lwcRuntimeFlags.DISABLE_NATIVE_CUSTOM_ELEMENT_LIFECYCLE && (process.env.NODE_ENV !== 'production' || isReportingEnabled())) {
    if (!vm.renderer.isConnected(vm.elm)) {
      if (process.env.NODE_ENV !== 'production') {
        logWarnOnce(`Element <${vm.tagName}> ` + `fired a \`connectedCallback\` and rendered, but was not connected to the DOM. ` + `Please ensure all components are actually connected to the DOM, e.g. using ` + `\`document.body.appendChild(element)\`. This will not be supported in future versions of ` + `LWC and could cause component errors. For details, see: https://sfdc.co/synthetic-lifecycle`);
      }
      report("ConnectedCallbackWhileDisconnected" /* ReportingEventId.ConnectedCallbackWhileDisconnected */, {
        tagName: vm.tagName
      });
    }
  }
}
function hasWireAdapters(vm) {
  return getOwnPropertyNames$1(vm.def.wire).length > 0;
}
function runDisconnectedCallback(vm) {
  if (process.env.NODE_ENV !== 'production') {
    assert.isTrue(vm.state !== 2 /* VMState.disconnected */, `${vm} must be inserted.`);
  }
  if (lwcRuntimeFlags.ENABLE_EXPERIMENTAL_SIGNALS) {
    disconnectContext(vm);
  }
  if (isFalse(vm.isDirty)) {
    // this guarantees that if the component is reused/reinserted,
    // it will be re-rendered because we are disconnecting the reactivity
    // linking, so mutations are not automatically reflected on the state
    // of disconnected components.
    vm.isDirty = true;
  }
  vm.state = 2 /* VMState.disconnected */;
  if (hasWireAdapters(vm)) {
    disconnectWireAdapters(vm);
  }
  const {
    disconnectedCallback
  } = vm.def;
  if (!isUndefined$1(disconnectedCallback)) {
    logOperationStart(5 /* OperationId.DisconnectedCallback */, vm);
    invokeComponentCallback(vm, disconnectedCallback);
    logOperationEnd(5 /* OperationId.DisconnectedCallback */, vm);
  }
}
function runChildNodesDisconnectedCallback(vm) {
  const {
    velements: vCustomElementCollection
  } = vm;
  // Reporting disconnection for every child in inverse order since they are
  // inserted in reserved order.
  for (let i = vCustomElementCollection.length - 1; i >= 0; i -= 1) {
    const {
      elm
    } = vCustomElementCollection[i];
    // There are two cases where the element could be undefined:
    // * when there is an error during the construction phase, and an error
    //   boundary picks it, there is a possibility that the VCustomElement
    //   is not properly initialized, and therefore is should be ignored.
    // * when slotted custom element is not used by the element where it is
    //   slotted into it, as  a result, the custom element was never
    //   initialized.
    if (!isUndefined$1(elm)) {
      const childVM = getAssociatedVMIfPresent(elm);
      // The VM associated with the element might be associated undefined
      // in the case where the VM failed in the middle of its creation,
      // eg: constructor throwing before invoking super().
      if (!isUndefined$1(childVM)) {
        resetComponentStateWhenRemoved(childVM);
      }
    }
  }
}
function runLightChildNodesDisconnectedCallback(vm) {
  const {
    aChildren: adoptedChildren
  } = vm;
  recursivelyDisconnectChildren(adoptedChildren);
}
/**
 * The recursion doesn't need to be a complete traversal of the vnode graph,
 * instead it can be partial, when a custom element vnode is found, we don't
 * need to continue into its children because by attempting to disconnect the
 * custom element itself will trigger the removal of anything slotted or anything
 * defined on its shadow.
 * @param vnodes
 */
function recursivelyDisconnectChildren(vnodes) {
  for (let i = 0, len = vnodes.length; i < len; i += 1) {
    const vnode = vnodes[i];
    if (!isNull(vnode) && !isUndefined$1(vnode.elm)) {
      switch (vnode.type) {
        case 2 /* VNodeType.Element */:
          recursivelyDisconnectChildren(vnode.children);
          break;
        case 3 /* VNodeType.CustomElement */:
          {
            const vm = getAssociatedVM(vnode.elm);
            resetComponentStateWhenRemoved(vm);
            break;
          }
      }
    }
  }
}
// This is a super optimized mechanism to remove the content of the root node (shadow root
// for shadow DOM components and the root element itself for light DOM) without having to go
// into snabbdom. Especially useful when the reset is a consequence of an error, in which case the
// children VNodes might not be representing the current state of the DOM.
function resetComponentRoot(vm) {
  recursivelyRemoveChildren(vm.children, vm);
  vm.children = EmptyArray;
  runChildNodesDisconnectedCallback(vm);
  vm.velements = EmptyArray;
}
// Helper function to remove all children of the root node.
// If the set of children includes VFragment nodes, we need to remove the children of those nodes too.
// Since VFragments can contain other VFragments, we need to traverse the entire of tree of VFragments.
// If the set contains no VFragment nodes, no traversal is needed.
function recursivelyRemoveChildren(vnodes, vm) {
  const {
    renderRoot,
    renderer: {
      remove
    }
  } = vm;
  for (let i = 0, len = vnodes.length; i < len; i += 1) {
    const vnode = vnodes[i];
    if (!isNull(vnode)) {
      // VFragments are special; their .elm property does not point to the root element since they have no single root.
      if (isVFragment(vnode)) {
        recursivelyRemoveChildren(vnode.children, vm);
      } else if (!isUndefined$1(vnode.elm)) {
        remove(vnode.elm, renderRoot);
      }
    }
  }
}
function scheduleRehydration(vm) {
  if (isTrue(vm.isScheduled)) {
    return;
  }
  vm.isScheduled = true;
  if (rehydrateQueue.length === 0) {
    addCallbackToNextTick(flushRehydrationQueue);
  }
  ArrayPush$1.call(rehydrateQueue, vm);
}
function getErrorBoundaryVM(vm) {
  let currentVm = vm;
  while (!isNull(currentVm)) {
    if (!isUndefined$1(currentVm.def.errorCallback)) {
      return currentVm;
    }
    currentVm = currentVm.owner;
  }
}
function runWithBoundaryProtection(vm, owner, pre, job, post) {
  let error;
  pre();
  try {
    job();
  } catch (e) {
    error = Object(e);
  } finally {
    post();
    if (!isUndefined$1(error)) {
      addErrorComponentStack(vm, error);
      const errorBoundaryVm = isNull(owner) ? undefined : getErrorBoundaryVM(owner);
      // Error boundaries are not in effect when server-side rendering. `errorCallback`
      // is intended to allow recovery from errors - changing the state of a component
      // and instigating a re-render. That is at odds with the single-pass, synchronous
      // nature of SSR. For that reason, all errors bubble up to the `renderComponent`
      // call site.
      if (isUndefined$1(errorBoundaryVm)) {
        throw error; // eslint-disable-line no-unsafe-finally
      }
      resetComponentRoot(vm); // remove offenders
      logOperationStart(6 /* OperationId.ErrorCallback */, vm);
      // error boundaries must have an ErrorCallback
      const errorCallback = errorBoundaryVm.def.errorCallback;
      invokeComponentCallback(errorBoundaryVm, errorCallback, [error, error.wcStack]);
      logOperationEnd(6 /* OperationId.ErrorCallback */, vm);
    }
  }
}
function runFormAssociatedCustomElementCallback(vm, faceCb, args) {
  const {
    renderMode,
    shadowMode,
    def: {
      ctor
    }
  } = vm;
  if (shadowMode === 1 /* ShadowMode.Synthetic */ && renderMode !== 0 /* RenderMode.Light */ && !supportsSyntheticElementInternals(ctor)) {
    throw new Error('Form associated lifecycle methods are not available in synthetic shadow. Please use native shadow or light DOM.');
  }
  invokeComponentCallback(vm, faceCb, args);
}
function runFormAssociatedCallback(elm, form) {
  const vm = getAssociatedVM(elm);
  const {
    formAssociatedCallback
  } = vm.def;
  if (!isUndefined$1(formAssociatedCallback)) {
    runFormAssociatedCustomElementCallback(vm, formAssociatedCallback, [form]);
  }
}
function runFormDisabledCallback(elm, disabled) {
  const vm = getAssociatedVM(elm);
  const {
    formDisabledCallback
  } = vm.def;
  if (!isUndefined$1(formDisabledCallback)) {
    runFormAssociatedCustomElementCallback(vm, formDisabledCallback, [disabled]);
  }
}
function runFormResetCallback(elm) {
  const vm = getAssociatedVM(elm);
  const {
    formResetCallback
  } = vm.def;
  if (!isUndefined$1(formResetCallback)) {
    runFormAssociatedCustomElementCallback(vm, formResetCallback);
  }
}
function runFormStateRestoreCallback(elm, state, reason) {
  const vm = getAssociatedVM(elm);
  const {
    formStateRestoreCallback
  } = vm.def;
  if (!isUndefined$1(formStateRestoreCallback)) {
    runFormAssociatedCustomElementCallback(vm, formStateRestoreCallback, [state, reason]);
  }
}
function resetRefVNodes(vm) {
  const {
    cmpTemplate
  } = vm;
  vm.refVNodes = !isNull(cmpTemplate) && cmpTemplate.hasRefs ? create(null) : null;
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
//
// The goal of this code is to detect invalid cross-root ARIA references in synthetic shadow DOM.
// These invalid references should be fixed before the offending components can be migrated to native shadow DOM.
// When invalid usage is detected, we warn in dev mode and call the reporting API if enabled.
// See: https://sfdc.co/synthetic-aria
//
// Use the unpatched native getElementById/querySelectorAll rather than the synthetic one
const getElementById = globalThis[KEY__NATIVE_GET_ELEMENT_BY_ID];
const querySelectorAll = globalThis[KEY__NATIVE_QUERY_SELECTOR_ALL];
// This is a "handoff" from synthetic-shadow to engine-core – we want to clean up after ourselves
// so nobody else can misuse these global APIs.
delete globalThis[KEY__NATIVE_GET_ELEMENT_BY_ID];
delete globalThis[KEY__NATIVE_QUERY_SELECTOR_ALL];
function isSyntheticShadowRootInstance(rootNode) {
  return rootNode !== document && isTrue(rootNode.synthetic);
}
function reportViolation$1(source, target, attrName) {
  // The vm is either for the source, the target, or both. Either one or both must be using synthetic
  // shadow for a violation to be detected.
  let vm = getAssociatedVMIfPresent(source.getRootNode().host);
  if (isUndefined$1(vm)) {
    vm = getAssociatedVMIfPresent(target.getRootNode().host);
  }
  if (isUndefined$1(vm)) {
    // vm should never be undefined here, but just to be safe, bail out and don't report
    return;
  }
  report("CrossRootAriaInSyntheticShadow" /* ReportingEventId.CrossRootAriaInSyntheticShadow */, {
    tagName: vm.tagName});
  if (process.env.NODE_ENV !== 'production') {
    // Avoid excessively logging to the console in the case of duplicates.
    logWarnOnce(`Element <${source.tagName.toLowerCase()}> uses attribute "${attrName}" to reference element ` + `<${target.tagName.toLowerCase()}>, which is not in the same shadow root. This will break in native shadow DOM. ` + `For details, see: https://sfdc.co/synthetic-aria`, vm);
  }
}
function parseIdRefAttributeValue(attrValue) {
  // split on whitespace and skip empty strings after splitting
  return isString(attrValue) ? ArrayFilter.call(StringSplit.call(attrValue, /\s+/), Boolean) : [];
}
function detectSyntheticCrossRootAria(elm, attrName, attrValue) {
  const root = elm.getRootNode();
  if (!isSyntheticShadowRootInstance(root)) {
    return;
  }
  if (attrName === 'id') {
    // elm is the target, find the source
    if (!isString(attrValue) || attrValue.length === 0) {
      // if our id is null or empty, nobody can reference us
      return;
    }
    for (const idRefAttrName of ID_REFERENCING_ATTRIBUTES_SET) {
      // Query all global elements with this attribute. The attribute selector syntax `~=` is for values
      // that reference multiple IDs, separated by whitespace.
      const query = `[${idRefAttrName}~="${CSS.escape(attrValue)}"]`;
      const sourceElements = querySelectorAll.call(document, query);
      for (let i = 0; i < sourceElements.length; i++) {
        const sourceElement = sourceElements[i];
        const sourceRoot = sourceElement.getRootNode();
        if (sourceRoot !== root) {
          reportViolation$1(sourceElement, elm, idRefAttrName);
          break;
        }
      }
    }
  } else {
    // elm is the source, find the target
    const ids = parseIdRefAttributeValue(attrValue);
    for (const id of ids) {
      const target = getElementById.call(document, id);
      if (!isNull(target)) {
        const targetRoot = target.getRootNode();
        if (targetRoot !== root) {
          // target element's shadow root is not the same as ours
          reportViolation$1(elm, target, attrName);
        }
      }
    }
  }
}
let enabled = false;
// We want to avoid patching globals whenever possible, so this should be tree-shaken out in prod-mode and if
// reporting is not enabled. It should also only run once
function enableDetection$1() {
  if (enabled) {
    return; // don't double-apply the patches
  }
  enabled = true;
  const {
    setAttribute
  } = Element.prototype;
  // Detect calling `setAttribute` to set an idref or an id
  assign(Element.prototype, {
    setAttribute(attrName, attrValue) {
      setAttribute.call(this, attrName, attrValue);
      if (attrName === 'id' || ID_REFERENCING_ATTRIBUTES_SET.has(attrName)) {
        detectSyntheticCrossRootAria(this, attrName, attrValue);
      }
    }
  });
  // Detect `elm.id = 'foo'`
  const idDescriptor = getOwnPropertyDescriptor$1(Element.prototype, 'id');
  if (!isUndefined$1(idDescriptor)) {
    const {
      get,
      set
    } = idDescriptor;
    // These should always be a getter and a setter, but if someone is monkeying with the global descriptor, ignore it
    if (isFunction$1(get) && isFunction$1(set)) {
      defineProperty(Element.prototype, 'id', {
        get() {
          return get.call(this);
        },
        set(value) {
          set.call(this, value);
          detectSyntheticCrossRootAria(this, 'id', value);
        },
        // On the default descriptor for 'id', enumerable and configurable are true
        enumerable: true,
        configurable: true
      });
    }
  }
}
// Our detection logic relies on some modern browser features. We can just skip reporting the data
// for unsupported browsers
function supportsCssEscape() {
  return typeof CSS !== 'undefined' && isFunction$1(CSS.escape);
}
// If this page is not using synthetic shadow, then we don't need to install detection. Note
// that we are assuming synthetic shadow is loaded before LWC.
function isSyntheticShadowLoaded() {
  // We should probably be calling `renderer.isSyntheticShadowDefined`, but 1) we don't have access to the renderer,
  // and 2) this code needs to run in @lwc/engine-core, so it can access `logWarn()` and `report()`.
  return hasOwnProperty$1.call(Element.prototype, KEY__SHADOW_TOKEN);
}
// Detecting cross-root ARIA in synthetic shadow only makes sense for the browser
if (supportsCssEscape() && isSyntheticShadowLoaded()) {
  // Always run detection in dev mode, so we can at least print to the console
  if (process.env.NODE_ENV !== 'production') {
    enableDetection$1();
  }
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
//
// The goal of this code is to detect usages of non-standard reflected ARIA properties. These are caused by
// legacy non-standard Element.prototype extensions added by the @lwc/aria-reflection package.
//
// See the README for @lwc/aria-reflection
const NON_STANDARD_ARIA_PROPS = ['ariaActiveDescendant', 'ariaControls', 'ariaDescribedBy', 'ariaDetails', 'ariaErrorMessage', 'ariaFlowTo', 'ariaLabelledBy', 'ariaOwns'];
function isGlobalAriaPolyfillLoaded() {
  // Sniff for the legacy polyfill being loaded. The reason this works is because ariaActiveDescendant is a
  // non-standard ARIA property reflection that is only supported in our legacy polyfill. See
  // @lwc/aria-reflection/README.md for details.
  return !isUndefined$1(getOwnPropertyDescriptor$1(Element.prototype, 'ariaActiveDescendant'));
}
function findVM(elm) {
  // If it's a shadow DOM component, then it has a host
  const {
    host
  } = elm.getRootNode();
  const vm = isUndefined$1(host) ? undefined : getAssociatedVMIfPresent(host);
  if (!isUndefined$1(vm)) {
    return vm;
  }
  // Else it might be a light DOM component. Walk up the tree trying to find the owner
  let parentElement = elm;
  while (!isNull(parentElement = parentElement.parentElement)) {
    if (parentElement instanceof BaseBridgeElement) {
      // parentElement is an LWC component
      const vm = getAssociatedVMIfPresent(parentElement);
      if (!isUndefined$1(vm)) {
        return vm;
      }
    }
  }
  // If we return undefined, it's because the element was rendered wholly outside a LightningElement
}
function checkAndReportViolation(elm, prop, isSetter, setValue) {
  const vm = findVM(elm);
  if (process.env.NODE_ENV !== 'production') {
    logWarnOnce(`Element <${elm.tagName.toLowerCase()}> ` + (isUndefined$1(vm) ? '' : `owned by <${vm.elm.tagName.toLowerCase()}> `) + `uses non-standard property "${prop}". This will be removed in a future version of LWC. ` + `See https://sfdc.co/deprecated-aria`);
  }
  report("NonStandardAriaReflection" /* ReportingEventId.NonStandardAriaReflection */, {
    tagName: vm?.tagName});
}
function enableDetection() {
  const {
    prototype
  } = Element;
  for (const prop of NON_STANDARD_ARIA_PROPS) {
    const descriptor = getOwnPropertyDescriptor$1(prototype, prop);
    // The descriptor should exist because the @lwc/aria-reflection polyfill has run by now.
    // This happens automatically because of the ordering of imports.
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if (isUndefined$1(descriptor) || isUndefined$1(descriptor.get) || isUndefined$1(descriptor.set)) {
        // should never happen
        throw new Error('detect-non-standard-aria.ts loaded before @lwc/aria-reflection');
      }
    }
    const {
      get,
      set
    } = descriptor;
    // It's important for this defineProperty call to happen _after_ ARIA accessors are applied to the
    // BaseBridgeElement and LightningElement prototypes. Otherwise, we will log/report for access of non-standard
    // props on these prototypes, which we actually don't want. We only care about access on generic HTMLElements.
    defineProperty(prototype, prop, {
      get() {
        checkAndReportViolation(this, prop);
        return get.call(this);
      },
      set(val) {
        checkAndReportViolation(this, prop);
        return set.call(this, val);
      },
      configurable: true,
      enumerable: true
    });
  }
}
// No point in running this code if we're not in a browser, or if the global polyfill is not loaded
if (isGlobalAriaPolyfillLoaded()) {
  // Always run detection in dev mode, so we can at least print to the console
  if (process.env.NODE_ENV !== 'production') {
    enableDetection();
  }
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// See @lwc/engine-core/src/framework/template.ts
const TEMPLATE_PROPS = ['slots', 'stylesheetToken', 'stylesheets', 'renderMode'];
// Expandos that may be placed on a stylesheet factory function, and which are meaningful to LWC at runtime
const STYLESHEET_PROPS = [KEY__SCOPED_CSS, KEY__NATIVE_ONLY_CSS];
// Via https://www.npmjs.com/package/object-observer
const ARRAY_MUTATION_METHODS = ['pop', 'push', 'shift', 'unshift', 'reverse', 'sort', 'fill', 'splice', 'copyWithin'];
let mutationTrackingDisabled = false;
function getOriginalArrayMethod(prop) {
  switch (prop) {
    case 'pop':
      return ArrayPop;
    case 'push':
      return ArrayPush$1;
    case 'shift':
      return ArrayShift;
    case 'unshift':
      return ArrayUnshift;
    case 'reverse':
      return ArrayReverse;
    case 'sort':
      return ArraySort;
    case 'fill':
      return ArrayFill;
    case 'splice':
      return ArraySplice;
    case 'copyWithin':
      return ArrayCopyWithin;
  }
}
function reportViolation(type, eventId, prop) {
  if (process.env.NODE_ENV !== 'production') {
    logWarnOnce(`Mutating the "${prop}" property on a ${type} ` + `is deprecated and will be removed in a future version of LWC. ` + `See: https://sfdc.co/template-mutation`);
  }
}
function reportTemplateViolation(prop) {
  reportViolation('template', "TemplateMutation" /* ReportingEventId.TemplateMutation */, prop);
}
function reportStylesheetViolation(prop) {
  reportViolation('stylesheet', "StylesheetMutation" /* ReportingEventId.StylesheetMutation */, prop);
}
// Warn if the user tries to mutate a stylesheets array, e.g.:
// `tmpl.stylesheets.push(someStylesheetFunction)`
function warnOnArrayMutation(stylesheets) {
  // We can't handle users calling Array.prototype.slice.call(tmpl.stylesheets), but
  // we can at least warn when they use the most common mutation methods.
  for (const prop of ARRAY_MUTATION_METHODS) {
    const originalArrayMethod = getOriginalArrayMethod(prop);
    // Assertions used here because TypeScript can't handle mapping over our types
    stylesheets[prop] = function arrayMutationWarningWrapper() {
      reportTemplateViolation('stylesheets');
      return originalArrayMethod.apply(this, arguments);
    };
  }
}
// Warn if the user tries to mutate a stylesheet factory function, e.g.:
// `stylesheet.$scoped$ = true`
function warnOnStylesheetFunctionMutation(stylesheet) {
  for (const prop of STYLESHEET_PROPS) {
    let value = stylesheet[prop];
    defineProperty(stylesheet, prop, {
      enumerable: true,
      configurable: true,
      get() {
        return value;
      },
      set(newValue) {
        reportStylesheetViolation(prop);
        value = newValue;
      }
    });
  }
}
// Warn on either array or stylesheet (function) mutation, in a deeply-nested array
function trackStylesheetsMutation(stylesheets) {
  traverseStylesheets(stylesheets, subStylesheets => {
    if (isArray$1(subStylesheets)) {
      warnOnArrayMutation(subStylesheets);
    } else {
      warnOnStylesheetFunctionMutation(subStylesheets);
    }
  });
}
// Deeply freeze the entire array (of arrays) of stylesheet factory functions
function deepFreeze(stylesheets) {
  traverseStylesheets(stylesheets, subStylesheets => {
    freeze(subStylesheets);
  });
}
// Deep-traverse an array (of arrays) of stylesheet factory functions, and call the callback for every array/function
function traverseStylesheets(stylesheets, callback) {
  callback(stylesheets);
  for (let i = 0; i < stylesheets.length; i++) {
    const stylesheet = stylesheets[i];
    if (isArray$1(stylesheet)) {
      traverseStylesheets(stylesheet, callback);
    } else {
      callback(stylesheet);
    }
  }
}
function trackMutations(tmpl) {
  if (!isUndefined$1(tmpl.stylesheets)) {
    trackStylesheetsMutation(tmpl.stylesheets);
  }
  for (const prop of TEMPLATE_PROPS) {
    let value = tmpl[prop];
    defineProperty(tmpl, prop, {
      enumerable: true,
      configurable: true,
      get() {
        return value;
      },
      set(newValue) {
        if (!mutationTrackingDisabled) {
          reportTemplateViolation(prop);
        }
        value = newValue;
      }
    });
  }
  const originalDescriptor = getOwnPropertyDescriptor$1(tmpl, 'stylesheetTokens');
  defineProperty(tmpl, 'stylesheetTokens', {
    enumerable: true,
    configurable: true,
    get: originalDescriptor.get,
    set(value) {
      reportTemplateViolation('stylesheetTokens');
      // Avoid logging/reporting twice (for both stylesheetToken and stylesheetTokens)
      mutationTrackingDisabled = true;
      originalDescriptor.set.call(this, value);
      mutationTrackingDisabled = false;
    }
  });
}
function addLegacyStylesheetTokensShim(tmpl) {
  // When ENABLE_FROZEN_TEMPLATE is false, then we shim stylesheetTokens on top of stylesheetToken for anyone who
  // is accessing the old internal API (backwards compat). Details: W-14210169
  defineProperty(tmpl, 'stylesheetTokens', {
    enumerable: true,
    configurable: true,
    get() {
      const {
        stylesheetToken
      } = this;
      if (isUndefined$1(stylesheetToken)) {
        return stylesheetToken;
      }
      // Shim for the old `stylesheetTokens` property
      // See https://github.com/salesforce/lwc/pull/2332/files#diff-7901555acef29969adaa6583185b3e9bce475cdc6f23e799a54e0018cb18abaa
      return {
        hostAttribute: `${stylesheetToken}-host`,
        shadowAttribute: stylesheetToken
      };
    },
    set(value) {
      // If the value is null or some other exotic object, you would be broken anyway in the past
      // because the engine would try to access hostAttribute/shadowAttribute, which would throw an error.
      // However it may be undefined in newer versions of LWC, so we need to guard against that case.
      this.stylesheetToken = isUndefined$1(value) ? undefined : value.shadowAttribute;
    }
  });
}
function freezeTemplate(tmpl) {
  // TODO [#2782]: remove this flag and delete the legacy behavior
  if (lwcRuntimeFlags.ENABLE_FROZEN_TEMPLATE) {
    // Deep freeze the template
    freeze(tmpl);
    if (!isUndefined$1(tmpl.stylesheets)) {
      deepFreeze(tmpl.stylesheets);
    }
  } else {
    // template is not frozen - shim, report, and warn
    // this shim should be applied in both dev and prod
    addLegacyStylesheetTokensShim(tmpl);
    // When ENABLE_FROZEN_TEMPLATE is false, we want to warn in dev mode whenever someone is mutating the template
    if (process.env.NODE_ENV !== 'production') {
      trackMutations(tmpl);
    }
  }
}
/** version: 9.5.3 */

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * Displays the header for a custom element.
 * @param ce The custom element to get the header for.
 * @param componentInstance component instance associated with the custom element.
 */
function getHeaderForCustomElement(ce, componentInstance) {
  // [element]
  // LWC component instance: [vm.component]
  return ['div', {}, ['object', {
    object: ce,
    config: {
      skip: true
    }
  }], ['div', {}, ['span', {
    style: 'margin: 0 5px; color: red'
  }, 'LWC:'], ['object', {
    object: componentInstance
  }]]];
}
function getHeaderForComponentInstance(componentInstance, debugInfo) {
  if (keys(debugInfo).length === 0) {
    // there is no debug information, no need to customize this component instance
    return null;
  }
  // [component]
  // Debug information: [vm.debugInfo]
  return ['div', {}, ['object', {
    object: componentInstance,
    config: {
      skip: true
    }
  }], ['div', {}, ['span', {
    style: 'margin: 0 5px; color: red'
  }, 'Debug:'], ['object', {
    object: debugInfo
  }]]];
}
const LightningElementFormatter = {
  name: 'LightningElementFormatter',
  header(obj, config) {
    const vm = getAssociatedVMIfPresent(obj);
    if (!isUndefined$1(vm) && (isUndefined$1(config) || !config.skip)) {
      if (obj instanceof HTMLElement) {
        return getHeaderForCustomElement(obj, vm.component);
      } else {
        return getHeaderForComponentInstance(obj, vm.debugInfo);
      }
    }
    return null;
  },
  hasBody() {
    return false;
  }
};

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function init() {
  const devtoolsFormatters = globalThis.devtoolsFormatters || [];
  ArrayPush$1.call(devtoolsFormatters, LightningElementFormatter);
  globalThis.devtoolsFormatters = devtoolsFormatters;
}
if (process.env.NODE_ENV !== 'production') {
  init();
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
//
// Feature detection
//
// This check for constructable style sheets is similar to Fast's:
// https://github.com/microsoft/fast/blob/d49d1ec/packages/web-components/fast-element/src/dom.ts#L51-L53
// See also: https://github.com/whatwg/webidl/issues/1027#issuecomment-934510070
const supportsConstructableStylesheets = isFunction$1(CSSStyleSheet.prototype.replaceSync) && isArray$1(document.adoptedStyleSheets);
const stylesheetCache = new Map();
//
// Test utilities
//
// Only used in LWC's integration tests
if (process.env.NODE_ENV === 'test-lwc-integration') {
  window.__lwcResetGlobalStylesheets = () => {
    stylesheetCache.clear();
  };
}
function createFreshStyleElement(content) {
  const elm = document.createElement('style');
  elm.type = 'text/css';
  elm.textContent = content;
  // Add an attribute to distinguish global styles added by LWC as opposed to other frameworks/libraries on the page
  elm.setAttribute('data-rendered-by-lwc', '');
  return elm;
}
function createStyleElement(content, cacheData) {
  const {
    element,
    usedElement
  } = cacheData;
  // If the <style> was already used, then we should clone it. We cannot insert
  // the same <style> in two places in the DOM.
  if (usedElement) {
    // This `<style>` may be repeated multiple times in the DOM, so cache it. It's a bit
    // faster to call `cloneNode()` on an existing node than to recreate it every time.
    return element.cloneNode(true);
  }
  // We don't clone every time, because that would be a perf tax on the first time
  cacheData.usedElement = true;
  return element;
}
function createConstructableStylesheet(content) {
  const stylesheet = new CSSStyleSheet();
  stylesheet.replaceSync(content);
  return stylesheet;
}
function insertConstructableStylesheet(content, target, cacheData, signal) {
  const {
    adoptedStyleSheets
  } = target;
  const {
    stylesheet
  } = cacheData;
  // The reason we prefer .push() rather than reassignment is for perf: https://github.com/salesforce/lwc/pull/2683
  adoptedStyleSheets.push(stylesheet);
  if (process.env.NODE_ENV !== 'production') {
    /* istanbul ignore if */
    if (isUndefined$1(signal)) {
      throw new Error('Expected AbortSignal to be defined in dev mode');
    }
    // TODO [#4155]: unrendering should account for stylesheet content collisions
    signal.addEventListener('abort', () => {
      adoptedStyleSheets.splice(adoptedStyleSheets.indexOf(stylesheet), 1);
      stylesheetCache.delete(content);
    });
  }
}
function insertStyleElement(content, target, cacheData, signal) {
  const elm = createStyleElement(content, cacheData);
  target.appendChild(elm);
  if (process.env.NODE_ENV !== 'production') {
    /* istanbul ignore if */
    if (isUndefined$1(signal)) {
      throw new Error('Expected AbortSignal to be defined in dev mode');
    }
    // TODO [#4155]: unrendering should account for stylesheet content collisions
    signal.addEventListener('abort', () => {
      target.removeChild(elm);
      stylesheetCache.delete(content);
    });
  }
}
function getCacheData(content, useConstructableStylesheet) {
  let cacheData = stylesheetCache.get(content);
  if (isUndefined$1(cacheData)) {
    cacheData = {
      stylesheet: undefined,
      element: undefined,
      roots: undefined,
      global: false,
      usedElement: false
    };
    stylesheetCache.set(content, cacheData);
  }
  // Create <style> elements or CSSStyleSheets on-demand, as needed
  if (useConstructableStylesheet && isUndefined$1(cacheData.stylesheet)) {
    cacheData.stylesheet = createConstructableStylesheet(content);
  } else if (!useConstructableStylesheet && isUndefined$1(cacheData.element)) {
    cacheData.element = createFreshStyleElement(content);
  }
  return cacheData;
}
function insertGlobalStylesheet(content, signal) {
  // Force a <style> element for global stylesheets. See comment below.
  const cacheData = getCacheData(content, false);
  if (cacheData.global) {
    // already inserted
    return;
  }
  cacheData.global = true; // mark inserted
  // TODO [#2922]: use document.adoptedStyleSheets in supported browsers. Currently we can't, due to backwards compat.
  insertStyleElement(content, document.head, cacheData, signal);
}
function insertLocalStylesheet(content, target, signal) {
  const cacheData = getCacheData(content, supportsConstructableStylesheets);
  let {
    roots
  } = cacheData;
  if (isUndefined$1(roots)) {
    roots = cacheData.roots = new WeakSet(); // lazily initialize (not needed for global styles)
  } else if (roots.has(target)) {
    // already inserted
    return;
  }
  roots.add(target); // mark inserted
  // Constructable stylesheets are only supported in certain browsers:
  // https://caniuse.com/mdn-api_document_adoptedstylesheets
  // The reason we use it is for perf: https://github.com/salesforce/lwc/pull/2460
  if (supportsConstructableStylesheets) {
    insertConstructableStylesheet(content, target, cacheData, signal);
  } else {
    // Fall back to <style> element
    insertStyleElement(content, target, cacheData, signal);
  }
}
/**
 * Injects a stylesheet into the global (document) level or inside a shadow root.
 * @param content CSS content to insert
 * @param target ShadowRoot to insert into, or undefined if global (document) level
 * @param signal AbortSignal for aborting the stylesheet render. Used in dev mode for HMR to unrender stylesheets.
 */
function insertStylesheet(content, target, signal) {
  if (isUndefined$1(target)) {
    // global
    insertGlobalStylesheet(content, signal);
  } else {
    // local
    insertLocalStylesheet(content, target, signal);
  }
}

/*
 * Copyright (c) 2023, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const cachedConstructors = new Map();
const nativeLifecycleElementsToUpgradedByLWC = new WeakMap();
let elementBeingUpgradedByLWC = false;
let BaseUpgradableConstructor;
let BaseHTMLElement;
function createBaseUpgradableConstructor() {
  // Creates a constructor that is intended to be used directly as a custom element, except that the upgradeCallback is
  // passed in to the constructor so LWC can reuse the same custom element constructor for multiple components.
  // Another benefit is that only LWC can create components that actually do anything – if you do
  // `customElements.define('x-foo')`, then you don't have access to the upgradeCallback, so it's a dummy custom element.
  // This class should be created once per tag name.
  // TODO [#2972]: this class should expose observedAttributes as necessary
  BaseUpgradableConstructor = class TheBaseUpgradableConstructor extends HTMLElement {
    constructor(upgradeCallback, useNativeLifecycle) {
      super();
      if (useNativeLifecycle) {
        // When in native lifecycle mode, we need to keep track of instances that were created outside LWC
        // (i.e. not created by `lwc.createElement()`). If the element uses synthetic lifecycle, then we don't
        // need to track this.
        nativeLifecycleElementsToUpgradedByLWC.set(this, elementBeingUpgradedByLWC);
      }
      // If the element is not created using lwc.createElement(), e.g. `document.createElement('x-foo')`,
      // then elementBeingUpgradedByLWC will be false
      if (elementBeingUpgradedByLWC) {
        upgradeCallback(this);
      }
      // TODO [#2970]: LWC elements cannot be upgraded via new Ctor()
      // Do we want to support this? Throw an error? Currently for backwards compat it's a no-op.
    }
    connectedCallback() {
      // native `connectedCallback`/`disconnectedCallback` are only enabled in native lifecycle mode
      if (isTrue(nativeLifecycleElementsToUpgradedByLWC.get(this))) {
        connectRootElement(this);
      }
    }
    disconnectedCallback() {
      // native `connectedCallback`/`disconnectedCallback` are only enabled in native lifecycle mode
      if (isTrue(nativeLifecycleElementsToUpgradedByLWC.get(this))) {
        disconnectRootElement(this);
      }
    }
    formAssociatedCallback(form) {
      runFormAssociatedCallback(this, form);
    }
    formDisabledCallback(disabled) {
      runFormDisabledCallback(this, disabled);
    }
    formResetCallback() {
      runFormResetCallback(this);
    }
    formStateRestoreCallback(state, reason) {
      runFormStateRestoreCallback(this, state, reason);
    }
    /*LWC compiler v9.5.3*/
  };
  BaseHTMLElement = HTMLElement; // cache to track if it changes
}
const createUpgradableConstructor = isFormAssociated => {
  if (HTMLElement !== BaseHTMLElement) {
    // If the global HTMLElement changes out from under our feet, then we need to create a new
    // BaseUpgradableConstructor from scratch (since it extends from HTMLElement). This can occur if
    // polyfills are in play, e.g. a polyfill for scoped custom element registries.
    // This workaround can potentially be removed when W-15361244 is resolved.
    createBaseUpgradableConstructor();
  }
  // Using a BaseUpgradableConstructor superclass here is a perf optimization to avoid
  // re-defining the same logic (connectedCallback, disconnectedCallback, etc.) over and over.
  class UpgradableConstructor extends BaseUpgradableConstructor {
    /*LWC compiler v9.5.3*/
  }
  if (isFormAssociated) {
    // Perf optimization - the vast majority of components have formAssociated=false,
    // so we can skip the setter in those cases, since undefined works the same as false.
    UpgradableConstructor.formAssociated = isFormAssociated;
  }
  return UpgradableConstructor;
};
function getUpgradableConstructor(tagName, isFormAssociated) {
  let UpgradableConstructor = cachedConstructors.get(tagName);
  if (isUndefined$1(UpgradableConstructor)) {
    if (!isUndefined$1(customElements.get(tagName))) {
      throw new Error(`Unexpected tag name "${tagName}". This name is a registered custom element, preventing LWC to upgrade the element.`);
    }
    UpgradableConstructor = createUpgradableConstructor(isFormAssociated);
    customElements.define(tagName, UpgradableConstructor);
    cachedConstructors.set(tagName, UpgradableConstructor);
  }
  return UpgradableConstructor;
}
const createCustomElement = (tagName, upgradeCallback, useNativeLifecycle, isFormAssociated) => {
  const UpgradableConstructor = getUpgradableConstructor(tagName, isFormAssociated);
  if (Boolean(UpgradableConstructor.formAssociated) !== isFormAssociated) {
    throw new Error(`<${tagName}> was already registered with formAssociated=${UpgradableConstructor.formAssociated}. It cannot be re-registered with formAssociated=${isFormAssociated}. Please rename your component to have a different name than <${tagName}>`);
  }
  elementBeingUpgradedByLWC = true;
  try {
    return new UpgradableConstructor(upgradeCallback, useNativeLifecycle);
  } finally {
    elementBeingUpgradedByLWC = false;
  }
};

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * A factory function that produces a renderer.
 * Renderer encapsulates operations that are required to render an LWC component into the underlying
 * runtime environment. In the case of @lwc/enigne-dom, it is meant to be used in a DOM environment.
 * @param baseRenderer Either null or the base renderer imported from 'lwc'.
 * @returns The created renderer
 * @example
 * import { renderer, rendererFactory } from 'lwc';
 * const customRenderer = rendererFactory(renderer);
 */
function rendererFactory(baseRenderer) {
  // Type assertion because this is replaced by rollup with an object, not a string.
  // See `injectInlineRenderer` in /scripts/rollup/rollup.config.js
  const renderer = function (exports) {
    /**
     * Copyright (c) 2026 Salesforce, Inc.
     */
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    /**
     *
     * @param value
     * @param msg
     */
    function invariant(value, msg) {
      if (!value) {
        throw new Error(`Invariant Violation: ${msg}`);
      }
    }
    /**
     *
     * @param value
     * @param msg
     */
    function isTrue$1(value, msg) {
      if (!value) {
        throw new Error(`Assert Violation: ${msg}`);
      }
    }
    /**
     *
     * @param value
     * @param msg
     */
    function isFalse$1(value, msg) {
      if (value) {
        throw new Error(`Assert Violation: ${msg}`);
      }
    }
    /**
     *
     * @param msg
     */
    function fail(msg) {
      throw new Error(msg);
    }
    var assert = /*#__PURE__*/Object.freeze({
      __proto__: null,
      fail: fail,
      invariant: invariant,
      isFalse: isFalse$1,
      isTrue: isTrue$1
    });

    /*
     * Copyright (c) 2024, Salesforce, Inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const {
      /** Detached {@linkcode Object.getOwnPropertyDescriptors}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors MDN Reference}. */
      getOwnPropertyDescriptors
    } = Object;
    /**
     * Determines whether the argument is `undefined`.
     * @param obj Value to test
     * @returns `true` if the value is `undefined`.
     */
    function isUndefined(obj) {
      return obj === undefined;
    }
    /**
     * Determines whether the argument is `null`.
     * @param obj Value to test
     * @returns `true` if the value is `null`.
     */
    function isNull(obj) {
      return obj === null;
    }
    /** version: 9.5.3 */

    /*
     * Copyright (c) 2024, Salesforce, Inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // Like @lwc/shared, but for DOM APIs
    const ElementDescriptors = getOwnPropertyDescriptors(Element.prototype);
    const ElementAttachShadow = ElementDescriptors.attachShadow.value;
    const ElementShadowRootGetter = ElementDescriptors.shadowRoot.get;

    /*
     * Copyright (c) 2023, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    class WireContextSubscriptionEvent extends CustomEvent {
      constructor(adapterToken, {
        setNewContext,
        setDisconnectedCallback
      }) {
        super(adapterToken, {
          bubbles: true,
          composed: true
        });
        this.setNewContext = setNewContext;
        this.setDisconnectedCallback = setDisconnectedCallback;
      }
      /*LWC compiler v9.5.3*/
    }
    function registerContextConsumer(elm, adapterContextToken, subscriptionPayload) {
      dispatchEvent(elm, new WireContextSubscriptionEvent(adapterContextToken, subscriptionPayload));
    }
    function registerContextProvider(elm, adapterContextToken, onContextSubscription) {
      const listener = evt => {
        const {
          setNewContext,
          setDisconnectedCallback
        } = evt;
        // If context subscription is successful, stop event propagation
        if (onContextSubscription({
          setNewContext,
          setDisconnectedCallback
        })) {
          evt.stopImmediatePropagation();
        }
      };
      addEventListener(elm, adapterContextToken, listener);
      // Caller removes the listener on disconnect; otherwise its closure retains the detached element.
      return () => removeEventListener(elm, adapterContextToken, listener);
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function cloneNode(node, deep) {
      return node.cloneNode(deep);
    }
    function createElement(tagName, namespace) {
      return isUndefined(namespace) ? document.createElement(tagName) : document.createElementNS(namespace, tagName);
    }
    function createText(content) {
      return document.createTextNode(content);
    }
    function createComment(content) {
      return document.createComment(content);
    }
    // Parse the fragment HTML string into DOM
    function createFragment(html) {
      const template = document.createElement('template');
      template.innerHTML = html;
      return template.content.firstChild;
    }
    function insert(node, parent, anchor) {
      parent.insertBefore(node, anchor);
    }
    function remove(node, parent) {
      parent.removeChild(node);
    }
    function nextSibling(node) {
      return node.nextSibling;
    }
    function previousSibling(node) {
      return node.previousSibling;
    }
    function getParentNode(node) {
      return node.parentNode;
    }
    function attachShadow(element, options) {
      // `shadowRoot` will be non-null in two cases:
      //   1. upon initial load with an SSR-generated DOM, while in Shadow render mode
      //   2. when a webapp author places <c-app> in their static HTML and mounts their
      //      root component with customElement.define('c-app', Ctor)
      // see W-17441501
      const shadowRoot = ElementShadowRootGetter.call(element);
      if (!isNull(shadowRoot)) {
        return shadowRoot;
      }
      return ElementAttachShadow.call(element, options);
    }
    function setText(node, content) {
      node.nodeValue = content;
    }
    function getProperty(node, key) {
      return node[key];
    }
    function setProperty(node, key, value) {
      node[key] = value;
    }
    function getAttribute(element, name, namespace) {
      return isUndefined(namespace) ? element.getAttribute(name) : element.getAttributeNS(namespace, name);
    }
    function setAttribute(element, name, value, namespace) {
      return isUndefined(namespace) ? element.setAttribute(name, value) : element.setAttributeNS(namespace, name, value);
    }
    function removeAttribute(element, name, namespace) {
      if (isUndefined(namespace)) {
        element.removeAttribute(name);
      } else {
        element.removeAttributeNS(namespace, name);
      }
    }
    function addEventListener(target, type, callback, options) {
      target.addEventListener(type, callback, options);
    }
    function removeEventListener(target, type, callback, options) {
      target.removeEventListener(type, callback, options);
    }
    function dispatchEvent(target, event) {
      return target.dispatchEvent(event);
    }
    function getClassList(element) {
      return element.classList;
    }
    function setCSSStyleProperty(element, name, value, important) {
      // TODO [#0]: How to avoid this type casting? Shall we use a different type interface to
      // represent elements in the engine?
      element.style.setProperty(name, value, important ? 'important' : '');
    }
    function getBoundingClientRect(element) {
      return element.getBoundingClientRect();
    }
    function querySelector(element, selectors) {
      return element.querySelector(selectors);
    }
    function querySelectorAll(element, selectors) {
      return element.querySelectorAll(selectors);
    }
    function getElementsByTagName(element, tagNameOrWildCard) {
      return element.getElementsByTagName(tagNameOrWildCard);
    }
    function getElementsByClassName(element, names) {
      return element.getElementsByClassName(names);
    }
    function getChildren(element) {
      return element.children;
    }
    function getChildNodes(element) {
      return element.childNodes;
    }
    function getFirstChild(element) {
      return element.firstChild;
    }
    function getFirstElementChild(element) {
      return element.firstElementChild;
    }
    function getLastChild(element) {
      return element.lastChild;
    }
    function getLastElementChild(element) {
      return element.lastElementChild;
    }
    function isConnected(node) {
      return node.isConnected;
    }
    function assertInstanceOfHTMLElement(elm, msg) {
      assert.invariant(elm instanceof HTMLElement, msg);
    }
    function ownerDocument(element) {
      return element.ownerDocument;
    }
    function getTagName(elm) {
      return elm.tagName;
    }
    function getStyle(elm) {
      return elm.style;
    }
    function attachInternals(elm) {
      return attachInternalsFunc.call(elm);
    }
    // Use the attachInternals method from HTMLElement.prototype because access to it is removed
    // in HTMLBridgeElement, ie: elm.attachInternals is undefined.
    // Additionally, cache the attachInternals method to protect against 3rd party monkey-patching.
    const attachInternalsFunc = typeof ElementInternals !== 'undefined' ? HTMLElement.prototype.attachInternals : () => {
      throw new Error('attachInternals API is not supported in this browser environment.');
    };
    exports.addEventListener = addEventListener;
    exports.assertInstanceOfHTMLElement = assertInstanceOfHTMLElement;
    exports.attachInternals = attachInternals;
    exports.attachShadow = attachShadow;
    exports.cloneNode = cloneNode;
    exports.createComment = createComment;
    exports.createElement = createElement;
    exports.createFragment = createFragment;
    exports.createText = createText;
    exports.dispatchEvent = dispatchEvent;
    exports.getAttribute = getAttribute;
    exports.getBoundingClientRect = getBoundingClientRect;
    exports.getChildNodes = getChildNodes;
    exports.getChildren = getChildren;
    exports.getClassList = getClassList;
    exports.getElementsByClassName = getElementsByClassName;
    exports.getElementsByTagName = getElementsByTagName;
    exports.getFirstChild = getFirstChild;
    exports.getFirstElementChild = getFirstElementChild;
    exports.getLastChild = getLastChild;
    exports.getLastElementChild = getLastElementChild;
    exports.getParentNode = getParentNode;
    exports.getProperty = getProperty;
    exports.getStyle = getStyle;
    exports.getTagName = getTagName;
    exports.insert = insert;
    exports.isConnected = isConnected;
    exports.nextSibling = nextSibling;
    exports.ownerDocument = ownerDocument;
    exports.previousSibling = previousSibling;
    exports.querySelector = querySelector;
    exports.querySelectorAll = querySelectorAll;
    exports.registerContextConsumer = registerContextConsumer;
    exports.registerContextProvider = registerContextProvider;
    exports.remove = remove;
    exports.removeAttribute = removeAttribute;
    exports.removeEventListener = removeEventListener;
    exports.setAttribute = setAttribute;
    exports.setCSSStyleProperty = setCSSStyleProperty;
    exports.setProperty = setProperty;
    exports.setText = setText;
    return exports;
  }({});
  // Meant to inherit any properties passed via the base renderer as the argument to the factory.
  Object.setPrototypeOf(renderer, baseRenderer);
  return renderer;
}

/*
 * Copyright (c) 2023, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Host element mutation tracking is for SSR only
const startTrackingMutations = noop;
const stopTrackingMutations = noop;
/**
 * The base renderer that will be used by engine-core.
 * This will be used for DOM operations when lwc is running in a browser environment.
 */
const renderer = assign(
// The base renderer will invoke the factory with null and assign additional properties that are
// shared across renderers
rendererFactory(null),
// Properties that are either not required to be sandboxed or rely on a globally shared information
{
  // insertStyleSheet implementation shares a global cache of stylesheet data
  insertStylesheet,
  // relies on a shared global cache
  createCustomElement,
  defineCustomElement: getUpgradableConstructor,
  isSyntheticShadowDefined: hasOwnProperty$1.call(Element.prototype, KEY__SHADOW_TOKEN),
  startTrackingMutations,
  stopTrackingMutations
});

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Like @lwc/shared, but for DOM APIs
const ElementDescriptors = getOwnPropertyDescriptors(Element.prototype);
ElementDescriptors.attachShadow.value;
ElementDescriptors.shadowRoot.get;
function clearNode(node) {
  const childNodes = renderer.getChildNodes(node);
  for (let i = childNodes.length - 1; i >= 0; i--) {
    renderer.remove(childNodes[i], node);
  }
}
/**
 * The real `buildCustomElementConstructor`. Should not be accessible to external users!
 * @internal
 * @param Ctor LWC constructor to build
 * @returns A Web Component class
 * @see {@linkcode deprecatedBuildCustomElementConstructor}
 */
function buildCustomElementConstructor(Ctor) {
  var _a;
  const HtmlPrototype = getComponentHtmlPrototype(Ctor);
  const {
    observedAttributes
  } = HtmlPrototype;
  const {
    attributeChangedCallback
  } = HtmlPrototype.prototype;
  return _a = class extends HTMLElement {
    constructor() {
      super();
      if (!isNull(this.shadowRoot)) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn(`Found an existing shadow root for the custom element "${Ctor.name}". Call \`hydrateComponent\` instead.`);
        }
        clearNode(this.shadowRoot);
      }
      // Compute renderMode/shadowMode in advance. This must be done before `createVM` because `createVM` may
      // mutate the element.
      const {
        shadowMode,
        renderMode
      } = computeShadowAndRenderMode(Ctor, renderer);
      // Native shadow components are allowed to have pre-existing `childNodes` before upgrade. This supports
      // use cases where a custom element has declaratively-defined slotted content, e.g.:
      // https://github.com/salesforce/lwc/issues/3639
      const isNativeShadow = renderMode === 1 /* RenderMode.Shadow */ && shadowMode === 0 /* ShadowMode.Native */;
      if (!isNativeShadow && this.childNodes.length > 0) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.warn(`Light DOM and synthetic shadow custom elements cannot have child nodes. ` + `Ensure the element is empty, including whitespace.`);
        }
        clearNode(this);
      }
      createVM(this, Ctor, renderer, {
        mode: 'open',
        owner: null,
        tagName: this.tagName
      });
    }
    connectedCallback() {
      connectRootElement(this);
    }
    disconnectedCallback() {
      disconnectRootElement(this);
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (!lwcRuntimeFlags.ENABLE_LEGACY_ATTRIBUTE_CHANGED_CALLBACK || this instanceof BaseBridgeElement) {
        // W-17420330
        attributeChangedCallback.call(this, name, oldValue, newValue);
      }
    }
    formAssociatedCallback(form) {
      runFormAssociatedCallback(this, form);
    }
    formDisabledCallback(disabled) {
      runFormDisabledCallback(this, disabled);
    }
    formResetCallback() {
      runFormResetCallback(this);
    }
    formStateRestoreCallback(state, reason) {
      runFormStateRestoreCallback(this, state, reason);
    }
    /*LWC compiler v9.5.3*/
  }, _a.observedAttributes = observedAttributes,
  // Note CustomElementConstructor is not upgraded by LWC and inherits directly from HTMLElement which means it calls the native
  // attachInternals API.
  _a.formAssociated = Boolean(Ctor.formAssociated), _a;
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// TODO [#2472]: Remove this workaround when appropriate.
// eslint-disable-next-line @lwc/lwc-internal/no-global-node
const _Node$1 = Node;
const ConnectingSlot = new WeakMap();
const DisconnectingSlot = new WeakMap();
function callNodeSlot(node, slot) {
  if (process.env.NODE_ENV !== 'production') {
    assert.isTrue(node, `callNodeSlot() should not be called for a non-object`);
  }
  const fn = slot.get(node);
  if (!isUndefined$1(fn)) {
    fn(node);
  }
  return node; // for convenience
}
let monkeyPatched = false;
function monkeyPatchDomAPIs() {
  if (monkeyPatched) {
    // don't double-patch
    return;
  }
  monkeyPatched = true;
  // Monkey patching Node methods to be able to detect the insertions and removal of root elements
  // created via createElement.
  const {
    appendChild,
    insertBefore,
    removeChild,
    replaceChild
  } = _Node$1.prototype;
  assign(_Node$1.prototype, {
    appendChild(newChild) {
      const appendedNode = appendChild.call(this, newChild);
      return callNodeSlot(appendedNode, ConnectingSlot);
    },
    insertBefore(newChild, referenceNode) {
      if (process.env.NODE_ENV !== 'production' && arguments.length < 2) {
        // eslint-disable-next-line no-console
        console.warn('insertBefore should be called with 2 arguments. Calling with only 1 argument is not supported.');
      }
      const insertedNode = insertBefore.call(this, newChild, referenceNode);
      return callNodeSlot(insertedNode, ConnectingSlot);
    },
    removeChild(oldChild) {
      const removedNode = removeChild.call(this, oldChild);
      return callNodeSlot(removedNode, DisconnectingSlot);
    },
    replaceChild(newChild, oldChild) {
      const replacedNode = replaceChild.call(this, newChild, oldChild);
      callNodeSlot(replacedNode, DisconnectingSlot);
      callNodeSlot(newChild, ConnectingSlot);
      return replacedNode;
    }
  });
}
if (process.env.NODE_ENV !== 'production') {
  // In dev mode, we must eagerly patch these DOM APIs because `restrictions.ts` in `@lwc/engine-core` does
  // its own monkey-patching, and the assumption is that its monkey patches will apply on top of our own.
  // If we _don't_ eagerly monkey-patch, then APIs like `element.appendChild` could end up calling through
  // directly to the native DOM APIs instead, which would bypass synthetic custom element lifecycle
  // and cause rendering/`connectedCallback`/`disconnectedCallback` not to fire.
  // In prod mode, we avoid global patching as a slight perf optimization and because it's good practice
  // in general to avoid global patching.
  // See issue #4242 for details.
  monkeyPatchDomAPIs();
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const ComponentConstructorToCustomElementConstructorMap = new Map();
function getCustomElementConstructor(Ctor) {
  if (Ctor === LightningElement) {
    throw new TypeError(`Invalid Constructor. LightningElement base class can't be claimed as a custom element.`);
  }
  let ce = ComponentConstructorToCustomElementConstructorMap.get(Ctor);
  if (isUndefined$1(ce)) {
    ce = buildCustomElementConstructor(Ctor);
    ComponentConstructorToCustomElementConstructorMap.set(Ctor, ce);
  }
  return ce;
}
/**
 * This static getter builds a Web Component class from a LWC constructor so it can be registered
 * as a new element via customElements.define() at any given time.
 * @example
 * import Foo from 'ns/foo';
 * customElements.define('x-foo', Foo.CustomElementConstructor);
 * const elm = document.createElement('x-foo');
 */
defineProperty(LightningElement, 'CustomElementConstructor', {
  get() {
    return getCustomElementConstructor(this);
  }
});
freeze(LightningElement);
seal(LightningElement.prototype);
/** version: 9.5.3 */

const $fragment1$2W = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M460 90H60c-27 0-50 22-50 50v240c0 27 23 50 50 50h400c28 0 50-22 50-50V140c0-28-22-50-50-50M248 372H104c-16 0-28-17-28-34 1-25 27-40 54-52 19-8 22-16 22-24s-5-16-12-22a55 55 0 01-17-41c0-32 19-58 52-58s52 27 52 58c0 17-6 32-17 41-7 6-12 13-12 22 0 8 2 16 22 23 27 12 53 28 54 53 3 17-10 34-26 34m195-58c0 9-8 17-17 17h-75c-9 0-17-7-17-17v-25c0-9 8-17 17-17h75c9 0 17 7 17 17zm0-91c0 9-8 17-17 17H302c-9 0-17-7-17-17v-25c0-9 8-17 17-17h125c9 0 17 7 17 17v25z"${3}/></g></svg>`;
function tmpl$2W($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2W, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_add_contact = registerTemplate(tmpl$2W);
tmpl$2W.stylesheets = [];
tmpl$2W.stylesheetToken = "lwc-6kdl98ad9te";
freezeTemplate(tmpl$2W);

const $fragment1$2V = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M97 361V113c-26 0-47 21-47 46v294c0 26 21 47 47 47h233c26 0 47-21 47-46H190c-51 0-93 0-93-93m357-202h-78c-26 0-47-21-47-46V35c1-8-6-15-15-15H190c-26 0-47 21-47 46v294c0 26 21 46 47 46h233c26 0 47-21 47-46V175c0-9-7-16-16-16m13-65l-72-71c-2-2-4-3-7-3-6 0-11 5-11 11v51c0 17 14 31 31 31h51c6 0 11-5 11-11 0-3-1-5-3-8"${3}/></g></svg>`;
function tmpl$2V($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2V, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_add_file = registerTemplate(tmpl$2V);
tmpl$2V.stylesheets = [];
tmpl$2V.stylesheetToken = "lwc-53epro1bb1m";
freezeTemplate(tmpl$2V);

const $fragment1$2U = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M260 200c-44 0-80 36-80 80s36 80 80 80 80-36 80-80-36-80-80-80m200-60h-52c-14 0-26-7-34-18l-23-35c-7-17-24-27-42-27h-98c-18 0-35 10-43 27l-23 35c-7 11-20 18-34 18H60c-22 0-40 18-40 40v240c0 22 18 40 40 40h400c22 0 40-18 40-40V180c0-22-18-40-40-40M260 400c-66 0-120-54-120-120s54-120 120-120 120 54 120 120-54 120-120 120"${3}/></g></svg>`;
function tmpl$2U($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2U, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_add_photo_video = registerTemplate(tmpl$2U);
tmpl$2U.stylesheets = [];
tmpl$2U.stylesheetToken = "lwc-7c5913o8fho";
freezeTemplate(tmpl$2U);

const $fragment1$2T = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 52 52" part="icon"${2}><g${3}><path d="M36 20a4 4 0 00-4-4H6a4 4 0 00-4 4v26a4 4 0 004 4h26a4 4 0 004-4zm-8 14c0 .5-.5 1-1 1h-6v6c0 .5-.5 1-1 1h-2a1 1 0 01-1-1v-6h-6a1 1 0 01-1-1v-2c0-.5.5-1 1-1h6v-6c0-.5.5-1 1-1h2c.5 0 1 .5 1 1v6h6c.5 0 1 .5 1 1zm15 8h-3v-6h3c.6 0 1-.4 1-1V9c0-.6-.4-1-1-1H17c-.6 0-1 .4-1 1v3h-6V9a7 7 0 017-7h26a7 7 0 017 7v26a7 7 0 01-7 7"${3}/></g></svg>`;
function tmpl$2T($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2T, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_add_relationship = registerTemplate(tmpl$2T);
tmpl$2T.stylesheets = [];
tmpl$2T.stylesheetToken = "lwc-539uqtn6m9f";
freezeTemplate(tmpl$2T);

const $fragment1$2S = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M230 149a66 66 0 11-65 66 65 65 0 0165-66m207 157a6 6 0 000-8l-41-41a6 6 0 00-4-2 6 6 0 00-4 2L274 371l-17 57a8 8 0 008 10 6 6 0 002 0l57-17zm-15-78l42 42a6 6 0 004 2 6 6 0 004-2l21-19a20 20 0 000-29l-22-22a20 20 0 00-14-5 23 23 0 00-15 5s-13 13-19 20a6 6 0 000 9zM401 83H60a40 40 0 00-39 40v191a40 40 0 0039 39h188l40-39H105a45 45 0 00-45-46v-99a45 45 0 0046-46h250a45 45 0 0046 46v30l39-40v-36a40 40 0 00-39-40z"${3}/></g></svg>`;
function tmpl$2S($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2S, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_adjust_value = registerTemplate(tmpl$2S);
tmpl$2S.stylesheets = [];
tmpl$2S.stylesheetToken = "lwc-1ivpd1068do";
freezeTemplate(tmpl$2S);

const $fragment1$2R = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M227 454l-13-10c-14-10-14-30-14-40v-29c0-8-7-15-15-15h-60c-8 0-15 7-15 15v77c0 27 16 48 41 48h49c29 0 31-20 31-20s5-18-4-26m223-274V43c0-24-30-31-46-15l-89 84a76 76 0 01-50 17H113c-52 1-93 46-93 98v2c0 52 41 91 93 91h152c19 0 37 8 51 20l88 86c16 16 46 10 46-14V276c30 0 48-21 48-48s-18-48-48-48"${3}/></g></svg>`;
function tmpl$2R($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2R, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_announcement = registerTemplate(tmpl$2R);
tmpl$2R.stylesheets = [];
tmpl$2R.stylesheetToken = "lwc-409t1v90jlo";
freezeTemplate(tmpl$2R);

const $fragment1$2Q = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M485 400H215c-8 0-15 7-15 15v30c0 8 7 15 15 15h270c8 0 15-7 15-15v-30c0-8-7-15-15-15M254 218L60 63c-6-5-15-4-20 3L23 90c-5 7-3 16 3 21l138 110c5 4 5 12 0 16L26 347c-6 5-8 15-3 21l17 26c5 7 14 8 20 3l194-155c8-6 8-18 0-24"${3}/></g></svg>`;
function tmpl$2Q($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2Q, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_apex = registerTemplate(tmpl$2Q);
tmpl$2Q.stylesheets = [];
tmpl$2Q.stylesheetToken = "lwc-3pc6997uam1";
freezeTemplate(tmpl$2Q);

const $fragment1$2P = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M190 436L25 270c-6-6-6-16 0-22l22-22c6-6 16-6 22 0l124 125c4 4 11 4 15 0l243-245c6-6 16-6 22 0l22 22c6 6 6 16 0 22L212 436c-6 7-16 7-22 0"${3}/></g></svg>`;
function tmpl$2P($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2P, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_approval = registerTemplate(tmpl$2P);
tmpl$2P.stylesheets = [];
tmpl$2P.stylesheetToken = "lwc-31t3ap4himh";
freezeTemplate(tmpl$2P);

const $fragment1$2O = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M485 220H153c-9 0-13-11-7-17l96-96c6-6 6-15 0-21l-22-22c-6-6-15-6-21 0L24 239c-6 6-6 15 0 21l175 175c6 6 15 6 21 0l21-21c6-6 6-15 0-21l-96-96c-6-6-2-17 7-17h332c8 0 15-7 15-15v-30c1-8-6-15-14-15"${3}/></g></svg>`;
function tmpl$2O($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2O, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_back = registerTemplate(tmpl$2O);
tmpl$2O.stylesheets = [];
tmpl$2O.stylesheetToken = "lwc-19msquojhm0";
freezeTemplate(tmpl$2O);

const $fragment1$2N = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M197 101h127c9 0 16-9 14-17-8-36-40-62-78-62s-70 27-78 62c-1 8 6 17 15 17m278 207c14 0 25-11 24-25-1-13-12-23-26-23h-70v-40c46-18 79-68 79-126 0-12-8-22-20-25-15-2-28 9-28 24 0 34-16 64-39 78-9-14-24-22-41-22H165c-17 0-32 9-41 22a89 89 0 01-39-76c0-13-10-25-22-25-14-1-25 10-25 23 0 59 33 109 79 127v40H47c-13 0-25 10-25 22-1 14 10 25 24 25h72v40c-46 18-79 68-79 126 0 12 8 22 20 25 15 2 28-9 28-24 0-33 15-63 38-77 14 45 48 79 92 94 10 3 21-5 21-15V285c0-13 10-25 22-25 14-1 25 10 25 24v192c0 11 10 18 21 15 44-14 79-49 92-94 22 14 37 43 38 75 0 13 10 25 22 25 14 1 25-10 25-24 0-59-33-109-79-127v-40h71z"${3}/></g></svg>`;
function tmpl$2N($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2N, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_bug = registerTemplate(tmpl$2N);
tmpl$2N.stylesheets = [];
tmpl$2N.stylesheetToken = "lwc-3rp0ke5b37c";
freezeTemplate(tmpl$2N);

const $fragment1$2M = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M485 378l-61-49a39 39 0 00-48-1l-52 38c-6 5-15 4-21-2l-78-70-70-78c-6-6-6-14-2-21l38-52c11-14 10-34-1-48l-49-61a40 40 0 00-59-3L32 83c-8 8-12 20-12 31 5 102 51 199 119 267s165 114 267 119c11 1 22-4 30-12l52-52c17-16 16-44-3-58"${3}/></g></svg>`;
function tmpl$2M($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2M, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_call = registerTemplate(tmpl$2M);
tmpl$2M.stylesheets = [];
tmpl$2M.stylesheetToken = "lwc-ofnqjsn9bs";
freezeTemplate(tmpl$2M);

const $fragment1$2L = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M450 384c-2 27-5 56-10 84-1 8-10 17-18 18a1450 1450 0 01-321 0c-8-1-17-9-18-18a855 855 0 010-268c1-8 10-16 18-18 33-4 65-6 97-8 0 0 26-1 24-26-2-22-40-37-40-74 0-30 30-54 79-54 48 0 78 24 78 54 0 38-37 52-39 74-2 24 24 26 24 26 33 1 66 4 98 8 8 1 17 9 18 18 5 31 8 60 10 91 0 9-7 18-16 18h-9c-9 0-23-7-29-14 0 0-21-22-44-23-37-1-65 31-65 66s28 68 64 67c22-1 44-23 44-23 7-6 20-12 29-12h9c11 0 18 6 17 14"${3}/></g></svg>`;
function tmpl$2L($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2L, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_canvas = registerTemplate(tmpl$2L);
tmpl$2L.stylesheets = [];
tmpl$2L.stylesheetToken = "lwc-10ghl8gl873";
freezeTemplate(tmpl$2L);

const $fragment1$2K = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M273 376c-30-12-35-23-35-35s8-23 18-32c18-15 26-39 26-64 0-47-29-85-83-85s-83 38-83 85c0 25 8 49 26 64 10 9 18 20 18 32s-5 23-35 35c-44 18-86 38-87 76 2 26 22 48 47 48h230c25 0 45-22 45-47-1-38-43-59-87-77m172-186c0-74-61-135-135-135V20l-68 55c-3 3-2 8 1 11l67 54v-35c47 0 85 38 85 85h-35l55 68c3 3 8 3 11 0l54-68z"${3}/></g></svg>`;
function tmpl$2K($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2K, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_change_owner = registerTemplate(tmpl$2K);
tmpl$2K.stylesheets = [];
tmpl$2K.stylesheetToken = "lwc-4o8ch0v95cs";
freezeTemplate(tmpl$2K);

const $fragment1$2J = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M200 375c0-8-7-15-15-15H35c-8 0-15 7-15 15v110c0 8 7 15 15 15h150c8 0 15-7 15-15zM81 220H32c-10 0-15 9-9 14l80 83c4 3 10 3 14 0l80-83c6-6 1-14-9-14h-47c0-50 49-100 99-100V60c-90 0-159 70-159 160m337-17c-4-3-10-3-14 0l-80 83c-6 6-1 14 9 14h48c0 60-41 100-101 100v60c90 0 161-70 161-160h49c10 0 15-9 9-14zm82-168c0-8-7-15-15-15H335c-8 0-15 7-15 15v110c0 8 7 15 15 15h150c8 0 15-7 15-15z"${3}/></g></svg>`;
function tmpl$2J($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2J, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_change_record_type = registerTemplate(tmpl$2J);
tmpl$2J.stylesheets = [];
tmpl$2J.stylesheetToken = "lwc-1jqn00tgss4";
freezeTemplate(tmpl$2J);

const $fragment1$2I = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M191 425L26 259c-6-6-6-16 0-22l22-22c6-6 16-6 22 0l124 125c4 4 11 4 15 0L452 95c6-6 16-6 22 0l22 22c6 6 6 16 0 22L213 425c-6 7-16 7-22 0"${3}/></g></svg>`;
function tmpl$2I($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2I, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_check = registerTemplate(tmpl$2I);
tmpl$2I.stylesheets = [];
tmpl$2I.stylesheetToken = "lwc-6c5erdo6vlm";
freezeTemplate(tmpl$2I);

const $fragment1$2H = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M460 20H180c-22 0-40 18-40 40v25c0 8 7 15 15 15h185c44 0 80 36 80 80v185c0 8 7 15 15 15h25c22 0 40-18 40-40V60c0-22-18-40-40-40M340 140H60c-22 0-40 18-40 40v280c0 22 18 40 40 40h280c22 0 40-18 40-40V180c0-22-18-40-40-40m-40 270c0 6-4 10-10 10H110c-6 0-10-4-10-10v-20c0-6 4-10 10-10h180c6 0 10 4 10 10zm0-80c0 6-4 10-10 10H110c-6 0-10-4-10-10v-20c0-6 4-10 10-10h180c6 0 10 4 10 10zm0-80c0 6-4 10-10 10H110c-6 0-10-4-10-10v-20c0-6 4-10 10-10h180c6 0 10 4 10 10z"${3}/></g></svg>`;
function tmpl$2H($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2H, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_clone = registerTemplate(tmpl$2H);
tmpl$2H.stylesheets = [];
tmpl$2H.stylesheetToken = "lwc-2dda4i4sbpi";
freezeTemplate(tmpl$2H);

const $fragment1$2G = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M316 258l131-131c6-6 6-15 0-21l-21-21c-6-6-15-6-21 0L274 216c-4 4-10 4-14 0L129 84c-6-6-15-6-21 0l-21 21c-6 6-6 15 0 21l131 131c4 4 4 10 0 14L86 403c-6 6-6 15 0 21l21 21c6 6 15 6 21 0l132-131c4-4 10-4 14 0l131 131c6 6 15 6 21 0l21-21c6-6 6-15 0-21L316 272c-3-4-3-10 0-14"${3}/></g></svg>`;
function tmpl$2G($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2G, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_close = registerTemplate(tmpl$2G);
tmpl$2G.stylesheets = [];
tmpl$2G.stylesheetToken = "lwc-4017v5kjupo";
freezeTemplate(tmpl$2G);

const $fragment1$2F = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M260 20C128 20 20 128 20 260s108 240 240 240 240-108 240-240S392 20 260 20m0 420c-99 0-180-81-180-180S161 80 260 80s180 81 180 180-81 180-180 180m34-178c-3-3-4-7-4-11v-96c0-8-7-15-15-15h-30c-8 0-15 7-15 15v121c0 4 2 8 4 11l74 74c6 6 15 6 21 0l21-21c6-6 6-15 0-21z"${3}/></g></svg>`;
function tmpl$2F($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2F, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_defer = registerTemplate(tmpl$2F);
tmpl$2F.stylesheets = [];
tmpl$2F.stylesheetToken = "lwc-3t49924dbol";
freezeTemplate(tmpl$2F);

const $fragment1$2E = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M455 100H330V60c0-22-18-40-40-40h-60c-22 0-40 18-40 40v40H65c-8 0-15 7-15 15v30c0 8 7 15 15 15h390c8 0 15-7 15-15v-30c0-8-7-15-15-15M230 70c0-6 4-10 10-10h40c6 0 10 4 10 10v30h-60zm185 130H105c-8 0-15 7-15 15v235c0 28 22 50 50 50h240c28 0 50-22 50-50V215c0-8-7-15-15-15M230 420c0 6-4 10-10 10h-20c-6 0-10-4-10-10V280c0-6 4-10 10-10h20c6 0 10 4 10 10zm100 0c0 6-4 10-10 10h-20c-6 0-10-4-10-10V280c0-6 4-10 10-10h20c6 0 10 4 10 10z"${3}/></g></svg>`;
function tmpl$2E($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2E, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_delete = registerTemplate(tmpl$2E);
tmpl$2E.stylesheets = [];
tmpl$2E.stylesheetToken = "lwc-2ju5o142jj0";
freezeTemplate(tmpl$2E);

const $fragment1$2D = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 52 52" part="icon"${2}><g${3}><path d="M44 4H8C6 4 4 6 4 8v36c0 2 2 4 4 4h36c2 0 4-2 4-4V8c0-2-2-4-4-4M12 14c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v10c0 .6-.4 1-1 1H13c-.6 0-1-.4-1-1zm24 26c0 .6-.4 1-1 1H13c-.6 0-1-.4-1-1v-2c0-.6.4-1 1-1h22c.6 0 1 .4 1 1zm4-8c0 .6-.4 1-1 1H13c-.6 0-1-.4-1-1v-2c0-.6.4-1 1-1h26c.6 0 1 .4 1 1zm0-8c0 .6-.4 1-1 1H29c-.6 0-1-.4-1-1v-2c0-.6.4-1 1-1h10c.6 0 1 .4 1 1zm0-8c0 .6-.4 1-1 1H29c-.6 0-1-.4-1-1v-2c0-.6.4-1 1-1h10c.6 0 1 .4 1 1z"${3}/></g></svg>`;
function tmpl$2D($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2D, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_description = registerTemplate(tmpl$2D);
tmpl$2D.stylesheets = [];
tmpl$2D.stylesheetToken = "lwc-5jlsi8q7ab3";
freezeTemplate(tmpl$2D);

const $fragment1$2C = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 52 52" part="icon"${2}><g${3}><circle cx="10" cy="10" r="6"${3}/><circle cx="10" cy="26" r="6"${3}/><circle cx="26" cy="10" r="6"${3}/><circle cx="42" cy="10" r="6"${3}/><circle cx="26" cy="26" r="6"${3}/><circle cx="42" cy="26" r="6"${3}/><circle cx="10" cy="42" r="6"${3}/><circle cx="26" cy="42" r="6"${3}/><circle cx="42" cy="42" r="6"${3}/></g></svg>`;
function tmpl$2C($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2C, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_dial_in = registerTemplate(tmpl$2C);
tmpl$2C.stylesheets = [];
tmpl$2C.stylesheetToken = "lwc-s638t457om";
freezeTemplate(tmpl$2C);

const $fragment1$2B = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M485 310h-30c-8 0-15 7-15 15v100c0 8-7 15-15 15H95c-8 0-15-7-15-15V325c0-8-7-15-15-15H35c-8 0-15 7-15 15v135c0 22 18 40 40 40h400c22 0 40-18 40-40V325c0-8-7-15-15-15m-235 66c6 6 15 6 21 0l135-135c6-6 6-15 0-21l-21-21c-6-6-15-6-21 0l-56 56c-6 6-17 2-17-7V35c-1-8-9-15-16-15h-30c-8 0-15 7-15 15v212c0 9-11 13-17 7l-56-56c-6-6-15-6-21 0l-21 22c-6 6-6 15 0 21z"${3}/></g></svg>`;
function tmpl$2B($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2B, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_download = registerTemplate(tmpl$2B);
tmpl$2B.stylesheets = [];
tmpl$2B.stylesheetToken = "lwc-708middcn1a";
freezeTemplate(tmpl$2B);

const $fragment1$2A = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M488 74l-42-42a39 39 0 00-56 0l-33 33c-4 4-4 10 0 14l85 85c4 4 10 4 14 0l33-33c15-16 15-41-1-57m-159 33c-4-4-10-4-14 0L54 368 21 481c-3 11 7 22 18 19l114-32h-1l261-261c4-4 4-10 0-14z"${3}/></g></svg>`;
function tmpl$2A($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2A, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_edit = registerTemplate(tmpl$2A);
tmpl$2A.stylesheets = [];
tmpl$2A.stylesheetToken = "lwc-g7221154c9";
freezeTemplate(tmpl$2A);

const $fragment1$2z = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M394 315c-2-2-6-2-8 0L269 432l-17 58c-2 6 4 11 10 10l59-17 117-117c2-2 2-6 0-8zm100-35l-22-22c-8-8-21-8-29 0l-20 21c-2 2-2 6 0 8l42 42c2 2 6 2 8 0l21-20c8-8 8-21 0-29M260 137c0 22-6 43-18 61-4 6-2 15 5 19 22 11 47 25 61 49 2 4 7 5 11 5h28c18 0 30-12 30-31-1-28-29-45-59-58-21-9-24-17-24-26s6-17 13-24c12-11 19-27 19-46-1-36-22-66-59-66-22 0-39 11-48 27 25 19 41 51 41 90m15 166c-1-32-33-46-67-61-23-10-27-19-27-29s6-20 14-27c14-13 21-31 21-52 0-39-23-73-65-73h-4c-42 0-65 34-65 73 0 21 7 39 21 52 8 7 14 17 14 27s-4 19-27 29c-34 15-66 30-67 61 2 21 17 37 37 37h180c20 0 35-16 35-37"${3}/></g></svg>`;
function tmpl$2z($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2z, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_edit_groups = registerTemplate(tmpl$2z);
tmpl$2z.stylesheets = [];
tmpl$2z.stylesheetToken = "lwc-4qbic8otj48";
freezeTemplate(tmpl$2z);

const $fragment1$2y = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M430 420h-30v-60h30c6 0 10-4 10-10V90c0-6-4-10-10-10H170c-6 0-10 4-10 10v30h-60V90c0-39 31-70 70-70h260c39 0 70 31 70 70v260c0 39-31 70-70 70M320 160H60c-22 0-40 18-40 40v260c0 22 18 40 40 40h260c22 0 40-18 40-40V200c0-22-18-40-40-40M148 415l-5 3-45 11c-4 1-8-3-7-7l11-45 2-4 1-1h5l37 37c2 3 2 6 1 6m109-110l-92 93q-3 3-6 0l-37-37c-2-1-2-4 0-5l93-93q3-3 6 0l37 37zm28-28l-10 10q-3 3-6 0l-37-37q-3-3 0-6l10-10c7-7 17-7 24 0l20 20c6 7 6 17-1 23"${3}/></g></svg>`;
function tmpl$2y($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2y, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_edit_relationship = registerTemplate(tmpl$2y);
tmpl$2y.stylesheets = [];
tmpl$2y.stylesheetToken = "lwc-5gdbadd2l77";
freezeTemplate(tmpl$2y);

const $fragment1$2x = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M249 301c6 6 15 6 21 0L496 91c5-8 4-21-12-21L36 71c-12 0-22 11-13 21zm251-128c0-10-12-16-20-9L303 327c-12 11-27 17-43 17s-31-6-43-16L41 164c-8-7-20-2-20 9l-1 227c0 22 18 40 40 40h400c22 0 40-18 40-40z"${3}/></g></svg>`;
function tmpl$2x($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2x, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_email = registerTemplate(tmpl$2x);
tmpl$2x.stylesheets = [];
tmpl$2x.stylesheetToken = "lwc-e9fc3tlrhp";
freezeTemplate(tmpl$2x);

const $fragment1$2w = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M280 35l-30 146c0 6 4 9 9 9h156c11 0 18 13 13 23L258 492c-7 14-28 9-28-7l30-172c0-6-5-4-11-4H85c-11 0-19-16-13-26L252 28c7-13 28-9 28 7"${3}/></g></svg>`;
function tmpl$2w($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2w, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_fallback = registerTemplate(tmpl$2w);
tmpl$2w.stylesheets = [];
tmpl$2w.stylesheetToken = "lwc-9lm0c794ot";
freezeTemplate(tmpl$2w);

const $fragment1$2v = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M482 40H38c-14 0-22 17-13 28l195 227c6 7 10 17 10 26v144c0 8 7 15 15 15h30c8 0 15-7 15-15V321c0-10 3-19 10-26L495 68c9-11 2-28-13-28"${3}/></g></svg>`;
function tmpl$2v($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2v, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_filter = registerTemplate(tmpl$2v);
tmpl$2v.stylesheets = [];
tmpl$2v.stylesheetToken = "lwc-608fghrmqeg";
freezeTemplate(tmpl$2v);

const $fragment1$2u = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M499 106c-21-41-74-117-172-72l-95 44-88 38c-25 12-79-5-110-16-9-3-17 6-13 15 21 41 74 117 172 72l183-81c25-12 79 5 110 16 9 2 17-7 13-16M288 234l-55 26-44 19c-22 12-69-4-97-15-8-4-15 6-11 14 18 40 65 112 151 68 54-27 99-45 99-45 22-12 69 4 97 15 8 3 15-6 11-15-18-39-65-111-151-67m-32 177l-24 14c-17 11-52-3-73-13-6-3-11 6-8 14 13 36 48 101 113 61l24-14c18-9 52 3 73 13 6 3 11-6 8-14-13-36-46-98-113-61"${3}/></g></svg>`;
function tmpl$2u($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2u, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_flow = registerTemplate(tmpl$2u);
tmpl$2u.stylesheets = [];
tmpl$2u.stylesheetToken = "lwc-260cafp4ncu";
freezeTemplate(tmpl$2u);

const $fragment1$2t = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M505 380h-45v-45c0-8-7-15-15-15h-30c-8 0-15 7-15 15v45h-45c-8 0-15 7-15 15v30c0 8 7 15 15 15h45v45c0 8 7 15 15 15h30c8 0 15-7 15-15v-45h45c8 0 15-7 15-15v-30c0-8-7-15-15-15m-165-40h10c6 0 10-4 10-10v-10c0-22 18-40 40-40h45c8 0 15-7 15-15V60c0-22-18-40-40-40H60c-22 0-40 18-40 40v360c0 22 18 40 40 40h225c9 0 16-7 15-16v-64c0-22 18-40 40-40m-80-230c0-6 4-10 10-10h100c6 0 10 4 10 10v20c0 6-4 10-10 10H270c-6 0-10-4-10-10zm0 80c0-6 4-10 10-10h100c6 0 10 4 10 10v20c0 6-4 10-10 10H270c-6 0-10-4-10-10zm-160-80c0-6 4-10 10-10h100c6 0 10 4 10 10v100c0 6-4 10-10 10H110c-6 0-10-4-10-10zm160 260c0 6-4 10-10 10H110c-6 0-10-4-10-10v-20c0-6 4-10 10-10h140c6 0 10 4 10 10zm-150-70c-6 0-10-4-10-10v-20c0-6 4-10 10-10h200c6 0 10 4 10 10v20c0 6-4 10-10 10z"${3}/></g></svg>`;
function tmpl$2t($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2t, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_follow = registerTemplate(tmpl$2t);
tmpl$2t.stylesheets = [];
tmpl$2t.stylesheetToken = "lwc-4fd2fpufl8j";
freezeTemplate(tmpl$2t);

const $fragment1$2s = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M495 336l-22-22c-6-6-16-6-22 0l-94 96c-4 4-11 4-15 0l-44-45c-6-6-16-6-22 0l-22 22c-6 6-6 16 0 22l84 86c6 6 16 6 22 0l134-137c7-5 7-15 1-22m-248 2q15-15 36-18c17-1 33 4 45 16l22 24 72-74c8-8 18-14 29-16 5-1 8-5 8-10V60c0-22-18-40-40-40H60c-22 0-40 18-40 40v360c0 22 18 40 40 40h164c9 0 13-11 7-17l-5-5a57 57 0 010-79zm13-228c0-6 4-10 10-10h100c6 0 10 4 10 10v20c0 6-4 10-10 10H270c-6 0-10-4-10-10zm0 80c0-6 4-10 10-10h100c6 0 10 4 10 10v20c0 6-4 10-10 10H270c-6 0-10-4-10-10zm-160-80c0-6 4-10 10-10h100c6 0 10 4 10 10v100c0 6-4 10-10 10H110c-6 0-10-4-10-10zm80 260c0 6-4 10-9 10h-61c-5 0-9-4-9-10v-20c0-6 4-10 9-10h61c5 0 9 4 9 10zm-70-70c-6 0-10-4-10-10v-20c0-6 4-10 10-10h200c6 0 10 4 10 10v20c0 6-4 10-10 10z"${3}/></g></svg>`;
function tmpl$2s($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2s, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_following = registerTemplate(tmpl$2s);
tmpl$2s.stylesheets = [];
tmpl$2s.stylesheetToken = "lwc-2b1c6ahtunp";
freezeTemplate(tmpl$2s);

const $fragment1$2r = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M270 30c6 0 10 4 10 10v459c0 6-4 10-10 10h-20c-6 0-10-4-10-10V40c0-6 4-10 10-10z"${3}/><path d="M260 172l-81-81c-4-4-4-10 0-14l14-14c4-4 10-4 14 0l53 53 53-53c4-4 10-4 14 0l14 14c4 4 4 10 0 14zm0 195l81 81c4 4 4 10 0 14l-14 14c-4 4-10 4-14 0l-53-53-53 53c-4 4-10 4-14 0l-14-14c-4-4-4-10 0-14zm211-211c3 5 2 11-4 14L72 403c-5 3-11 2-14-4l-10-17c-3-5-2-11 4-14l395-234c5-3 11-2 14 4z"${3}/><path d="M344 220l28-111c1-6 6-9 12-7l19 5c6 1 9 6 7 12l-19 73 73 19c6 1 9 6 7 12l-5 19c-1 6-6 9-12 7zm-168 99l-28 111c-1 6-6 9-12 7l-19-5c-6-1-9-6-7-12l19-73-73-19c-6-1-9-6-7-12l5-19c1-6 6-9 12-7zM59 139c3-5 9-7 14-4l395 234c5 3 7 9 4 14l-10 17c-3 5-9 7-14 4L52 170c-5-3-7-9-4-14z"${3}/><path d="M176 220L65 249c-6 1-11-1-12-7l-5-19c-1-6 1-11 7-12l73-19-19-73c-1-6 1-11 7-12l19-5c6-1 11 1 12 7zm167 99l111-29c6-1 11 1 12 7l5 19c1 6-1 11-7 12l-73 19 19 73c1 6-1 11-7 12l-19 5c-6 1-11-1-12-7z"${3}/></g></svg>`;
function tmpl$2r($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2r, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_freeze_user = registerTemplate(tmpl$2r);
tmpl$2r.stylesheets = [];
tmpl$2r.stylesheetToken = "lwc-10forb5negf";
freezeTemplate(tmpl$2r);

const $fragment1$2q = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M50 20c-17 0-30 13-30 30v420c0 16 13 30 30 30 16 0 30-13 30-30V50c0-17-13-30-30-30m438 45c-130 68-233-49-356-4-6 2-12 8-12 15v224c0 11 12 19 23 16 118-35 220 76 348 6 5-3 9-8 9-14V72c0-6-7-10-12-7m-28 227l-5 2c-10 5-26 6-53 6h-2v-50c-15 0-42-3-60-7v53l-46-9-14-4v-55c-17-5-43-10-60-14v57c-12-2-15-3-28-3l-16 1-16 1v-58c10-2 22-2 35-2s14 1 25 3v-60c-11-2-50-2-60 1V92l9-1c10-1 40 1 51 4v58l56 13 4 1v-58c18 5 39 11 60 14v57c17 3 44 5 60 5v-55h2c16 0 27-4 47-7l12-4v60c-18 5-37 7-56 7h-4v64h2c19 0 40-7 58-15v57z"${3}/><path d="M280 167v60l12 4c15 4 31 9 48 12v-62z"${3}/></g></svg>`;
function tmpl$2q($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2q, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_goal = registerTemplate(tmpl$2q);
tmpl$2q.stylesheets = [];
tmpl$2q.stylesheetToken = "lwc-1ua8icj6q9f";
freezeTemplate(tmpl$2q);

const $fragment1$2p = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M503 53l-36 36c-4 4-10 4-14 0l-46-46c-4-4-10-4-14 0l-36 36c-4 4-10 4-14 0l-36-36c-4-4-10-4-14 0l-36 36c-4 4-10 4-14 0l-36-36c-4-4-10-4-14 0l-36 36c-4 4-10 4-14 0l-36-36c-4-4-10-4-14 0L57 79c-4 4-10 4-14 0L17 53c-6-6-17-2-17 7v380c0 22 18 40 40 40h440c22 0 40-18 40-40V60c0-9-11-13-17-7M210 410c0 6-4 10-10 10H80c-6 0-10-4-10-10V230c0-6 4-10 10-10h120c6 0 10 4 10 10zm240 0c0 6-4 10-10 10H260c-6 0-10-4-10-10v-20c0-6 4-10 10-10h180c6 0 10 4 10 10zm0-70H250v-40h200zm0-90c0 6-4 10-10 10H260c-6 0-10-4-10-10v-20c0-6 4-10 10-10h180c6 0 10 4 10 10zm0-80c0 6-4 10-10 10H80c-6 0-10-4-10-10v-20c0-6 4-10 10-10h360c6 0 10 4 10 10z"${3}/></g></svg>`;
function tmpl$2p($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2p, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_google_news = registerTemplate(tmpl$2p);
tmpl$2p.stylesheets = [];
tmpl$2p.stylesheetToken = "lwc-5fdbeavofbj";
freezeTemplate(tmpl$2p);

const $fragment1$2o = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M260 20a239 239 0 100 480 239 239 0 100-480m0 121c17 0 30 13 30 30s-13 30-30 30-30-13-30-30 13-30 30-30m50 210c0 5-4 9-10 9h-80c-5 0-10-3-10-9v-20c0-5 4-11 10-11 5 0 10-3 10-9v-40c0-5-4-11-10-11-5 0-10-3-10-9v-20c0-5 4-11 10-11h60c5 0 10 5 10 11v80c0 5 4 9 10 9 5 0 10 5 10 11z"${3}/></g></svg>`;
function tmpl$2o($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2o, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_info = registerTemplate(tmpl$2o);
tmpl$2o.stylesheets = [];
tmpl$2o.stylesheetToken = "lwc-5d9029ri9r1";
freezeTemplate(tmpl$2o);

const $fragment1$2n = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M360 239c-1-28-28-45-57-58-20-9-24-17-24-26s6-17 12-24c13-11 19-27 19-46 0-35-20-65-57-65-22 0-37 11-47 27 25 19 40 52 40 90 0 22-6 43-17 61-4 6-2 15 5 19 21 11 45 25 59 49 2 4 6 5 11 5h27c17-1 29-13 29-32m-163 2c-23-10-26-19-26-29s6-20 14-27c13-13 20-31 20-52 0-39-23-73-63-73h-3c-40 0-63 34-63 73 0 21 7 39 20 52 8 7 14 17 14 27s-3 19-26 29c-33 15-64 30-65 61 1 22 16 38 35 38h174c19 0 34-16 34-37-1-32-33-47-65-62m288 99h-45v-45c0-8-7-15-15-15h-30c-8 0-15 7-15 15v45h-45c-8 0-15 7-15 15v30c0 8 7 15 15 15h45v45c0 8 7 15 15 15h30c8 0 15-7 15-15v-45h45c8 0 15-7 15-15v-30c0-8-7-15-15-15"${3}/></g></svg>`;
function tmpl$2n($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2n, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_join_group = registerTemplate(tmpl$2n);
tmpl$2n.stylesheets = [];
tmpl$2n.stylesheetToken = "lwc-4sjvhc78c1";
freezeTemplate(tmpl$2n);

const $fragment1$2m = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M276 283c-6 6-6 15 0 21l21 21c6 6 15 6 21 0l135-135c6-6 6-15 0-21L319 34c-6-6-15-6-21 0l-21 21c-6 6-6 15 0 21l57 56c16 18-10 17-10 17h-80c-95 1-176 79-174 174 2 92 77 167 170 167h35c8 0 15-7 15-15v-30c0-8-7-15-15-15h-32c-57 0-107-42-113-99-6-66 46-121 110-121h86c7 2 10 11 5 17z"${3}/></g></svg>`;
function tmpl$2m($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2m, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_lead_convert = registerTemplate(tmpl$2m);
tmpl$2m.stylesheets = [];
tmpl$2m.stylesheetToken = "lwc-2mfh8jqefk7";
freezeTemplate(tmpl$2m);

const $fragment1$2l = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M303 221c-20-9-24-17-24-26s6-17 12-24c12-11 18-27 18-46 1-35-19-65-56-65-22 0-37 11-47 27 25 19 40 52 40 90 0 22-6 43-17 61-4 6-2 15 5 19 21 11 45 25 59 49 2 4 6 5 11 5h27c17 0 29-12 29-31-1-29-28-46-57-59m-106 60c-23-10-26-19-26-29s6-20 14-27c13-13 20-31 20-52 0-39-23-73-63-73h-4c-40 0-63 34-63 73 0 21 7 39 20 52 8 7 14 17 14 27s-3 19-26 29c-33 15-64 30-65 61 2 22 17 38 36 38h174c19 0 34-16 34-37-1-32-33-47-65-62m123 144v-30c0-8 7-15 15-15h150c8 0 15 7 15 15v30c0 8-7 15-15 15H335c-8 0-15-7-15-15"${3}/></g></svg>`;
function tmpl$2l($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2l, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_leave_group = registerTemplate(tmpl$2l);
tmpl$2l.stylesheets = [];
tmpl$2l.stylesheetToken = "lwc-1e90hr14qhp";
freezeTemplate(tmpl$2l);

const $fragment1$2k = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M429 20H127c-27 0-49 24-49 48v16H62c-18 0-32 14-32 32s14 32 32 32h16v80H62c-18 0-32 14-32 32s14 32 32 32h16v80H62c-18 0-32 14-32 32s14 32 32 32h16v16c0 24 22 48 49 48h302c27 0 51-24 51-50V66c0-27-24-46-51-46m-29 322l-22 22c-5 5-12 8-18 7-53-3-103-27-138-62s-59-85-62-138c0-7 2-14 7-18l22-22c10-10 28-10 37 2l21 26c7 9 7 21 1 30l-18 26c-2 3-2 8 1 10l37 41 41 37c3 3 7 3 10 1l25-18c9-6 22-6 31 1l26 21c9 6 10 24-1 34"${3}/></g></svg>`;
function tmpl$2k($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2k, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_log_a_call = registerTemplate(tmpl$2k);
tmpl$2k.stylesheets = [];
tmpl$2k.stylesheetToken = "lwc-7n59gf0t0nr";
freezeTemplate(tmpl$2k);

const $fragment1$2j = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M387 402l-48 16-13 2c-14 0-28-7-37-18s-11-27-8-41l16-57 75-75c3-3 1-9-4-9H55c-8 0-15 7-15 15v185c0 22 18 40 40 40h280c22 0 40-18 40-40v-8c0-7-7-12-13-10M55 180h330c8 0 15-7 15-15v-25c0-22-18-40-40-40h-30V90c0-16-13-30-30-30-16 0-30 13-30 30v10H170V90c0-16-13-30-30-30-16 0-30 13-30 30v10H80c-22 0-40 18-40 40v25c0 8 7 15 15 15m380 51c-2-2-5-2-7 0l-94 94-14 47c-1 5 3 9 8 8l47-14 94-94c2-2 2-5 0-7zm80-29l-18-18c-6-6-17-6-24 0l-16 17c-2 2-2 5 0 7l34 34c2 2 5 2 7 0l17-16c7-6 7-17 0-24"${3}/></g></svg>`;
function tmpl$2j($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2j, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_log_event = registerTemplate(tmpl$2j);
tmpl$2j.stylesheets = [];
tmpl$2j.stylesheetToken = "lwc-4kvbokk6hq6";
freezeTemplate(tmpl$2j);

const $fragment1$2i = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M450 20H70c-28 0-50 22-50 50v380c0 27 22 50 50 50h380c27 0 50-22 50-50V70c0-28-22-50-50-50m-16 430H86c-9 0-16-7-16-16V86c0-9 7-16 16-16h348c9 0 16 7 16 16v348c0 9-7 16-16 16M219 119h-83c-9 0-17 7-17 17v83c0 9 7 17 17 17h83c9 0 17-7 17-17v-83c-1-9-8-17-17-17m165 0h-83c-9 0-17 7-17 17v83c0 9 7 17 17 17h83c9 0 17-7 17-17v-83c0-9-8-17-17-17M219 285h-83c-9 0-17 7-17 17v83c0 9 7 17 17 17h83c9 0 17-7 17-17v-83c-1-10-8-17-17-17m165 0h-83c-9 0-17 7-17 17v83c0 9 7 17 17 17h83c9 0 17-7 17-17v-83c0-10-8-17-17-17"${3}/></g></svg>`;
function tmpl$2i($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2i, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_manage_perm_sets = registerTemplate(tmpl$2i);
tmpl$2i.stylesheets = [];
tmpl$2i.stylesheetToken = "lwc-6qmbl2e5cco";
freezeTemplate(tmpl$2i);

const $fragment1$2h = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M488 95L344 23c-7-3-15-3-21 0L190 90 56 23c-8-4-18-4-25 1-7 4-11 12-11 20v360c0 9 5 17 13 21l144 72c7 3 15 3 21 0l134-67 133 67c3 2 7 3 11 3s9-1 13-4c7-4 11-12 11-20V116c0-9-4-17-12-21m-38 46v190c0 11-10 19-20 15-37-14-7-76-34-110-25-31-57 1-88-48-29-47 10-81 46-99 5-2 10-2 14 0l74 37c6 3 8 9 8 15M249 419c-6 3-13 2-18-2-10-9-18-23-18-37 0-24-40-16-40-64 0-39-46-49-85-45-10 1-17-6-17-16V109c0-12 12-20 22-14l86 43 2 1 3 2c36 21 29 38 14 64-17 29-24 0-48-8s-48 8-40 24 32 0 48 16 16 40 64 24 56-8 72 8 24 48 0 72c-14 14-20 44-26 64-1 4-4 8-8 10z"${3}/></g></svg>`;
function tmpl$2h($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2h, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_map = registerTemplate(tmpl$2h);
tmpl$2h.stylesheets = [];
tmpl$2h.stylesheetToken = "lwc-1k8631uhpa4";
freezeTemplate(tmpl$2h);

const $fragment1$2g = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M80 200c33 0 60 27 60 60s-27 60-60 60-60-27-60-60 27-60 60-60m180 0c33 0 60 27 60 60s-27 60-60 60-60-27-60-60 27-60 60-60m180 0c33 0 60 27 60 60s-27 60-60 60-60-27-60-60 27-60 60-60"${3}/></g></svg>`;
function tmpl$2g($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2g, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_more = registerTemplate(tmpl$2g);
tmpl$2g.stylesheets = [];
tmpl$2g.stylesheetToken = "lwc-4vsdf2fsf7p";
freezeTemplate(tmpl$2g);

const $fragment1$2f = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M300 290h165c8 0 15-7 15-15v-30c0-8-7-15-15-15H300c-6 0-10-4-10-10V55c0-8-7-15-15-15h-30c-8 0-15 7-15 15v165c0 6-4 10-10 10H55c-8 0-15 7-15 15v30c0 8 7 15 15 15h165c6 0 10 4 10 10v165c0 8 7 15 15 15h30c8 0 15-7 15-15V300c0-6 4-10 10-10"${3}/></g></svg>`;
function tmpl$2f($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2f, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new = registerTemplate(tmpl$2f);
tmpl$2f.stylesheets = [];
tmpl$2f.stylesheetToken = "lwc-3580knop89a";
freezeTemplate(tmpl$2f);

const $fragment1$2e = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M500 269c1-17-12-22-17-22H303c-16 0-18 17-18 18v195h215zM376 409c0 9-7 17-17 17h-17c-9 0-17-8-17-17v-17c0-9 7-17 17-17h17c9 0 17 8 17 17zm0-85c0 9-7 17-17 17h-17c-9 0-17-8-17-17v-17c0-9 7-17 17-17h17c9 0 17 8 17 17zm83 85c0 9-7 17-17 17h-17c-9 0-17-8-17-17v-17c0-9 7-17 17-17h17c9 0 17 8 17 17zm0-85c0 9-7 17-17 17h-17c-9 0-17-8-17-17v-17c0-9 7-17 17-17h17c9 0 17 8 17 17zM334 179V82c1-17-11-22-16-22H38c-16 0-18 17-18 18v382h215V216s0-20 18-20h65c10 0 16-10 16-17M111 401c0 9-7 17-17 17H78c-9 0-17-8-17-17v-17c0-9 7-17 17-17h17c9 0 17 8 17 17v17zm0-86c0 9-7 17-17 17H78c-9 0-17-8-17-17v-17c0-9 7-17 17-17h17c9 0 17 8 17 17v17zm0-85c0 9-7 17-17 17H78c-9 0-17-8-17-17v-17c0-9 7-17 17-17h17c9 0 17 8 17 17v17zm0-85c0 9-7 17-17 17H78c-9 0-17-8-17-17v-17c0-9 7-17 17-17h17c9 0 17 8 17 17v17zm91 256c0 9-7 17-17 17h-17c-9 0-17-8-17-17v-17c0-9 7-17 17-17h17c9 0 17 8 17 17zm0-86c0 9-7 17-17 17h-17c-9 0-17-8-17-17v-17c0-9 7-17 17-17h17c9 0 17 8 17 17zm0-85c0 9-7 17-17 17h-17c-9 0-17-8-17-17v-17c0-9 7-17 17-17h17c9 0 17 8 17 17zm0-85c0 9-7 17-17 17h-17c-9 0-17-8-17-17v-17c0-9 7-17 17-17h17c9 0 17 8 17 17zm91 0c0 9-7 17-17 17h-16c-9 0-17-8-17-17v-17c0-9 7-17 17-17h17c9 0 17 8 17 17v17z"${3}/></g></svg>`;
function tmpl$2e($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2e, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_account = registerTemplate(tmpl$2e);
tmpl$2e.stylesheets = [];
tmpl$2e.stylesheetToken = "lwc-5drb5o355ui";
freezeTemplate(tmpl$2e);

const $fragment1$2d = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 52 52" part="icon"${2}><g${3}><path d="M26 2C12.8 2 2 12.8 2 26s10.8 24 24 24 24-10.8 24-24S39.2 2 26 2m0 42c-9.9 0-18-8.1-18-18S16.1 8 26 8s18 8.1 18 18-8.1 18-18 18m0-32c-7.7 0-14 6.3-14 14s6.3 14 14 14 14-6.3 14-14-6.3-14-14-14m0 22c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8m0-12c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4"${3}/></g></svg>`;
function tmpl$2d($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2d, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_campaign = registerTemplate(tmpl$2d);
tmpl$2d.stylesheets = [];
tmpl$2d.stylesheetToken = "lwc-7urh5kuk27";
freezeTemplate(tmpl$2d);

const $fragment1$2c = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M150 130h40c6 0 10-4 10-10v-20h120v20c0 6 4 10 10 10h40c6 0 10-4 10-10V95c0-30-25-55-55-55H194c-30 0-54 24-54 54v26c0 6 4 10 10 10m310 40H60c-22 0-40 18-40 40v230c0 22 18 40 40 40h400c22 0 40-18 40-40V210c0-22-18-40-40-40"${3}/></g></svg>`;
function tmpl$2c($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2c, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_case = registerTemplate(tmpl$2c);
tmpl$2c.stylesheets = [];
tmpl$2c.stylesheetToken = "lwc-323bdvsahuc";
freezeTemplate(tmpl$2c);

const $fragment1$2b = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M150 110h40c6 0 10-4 10-10V80h100v20c0 6 4 10 10 10h40c6 0 10-4 10-10V75c0-30-25-55-55-55H194c-30 0-54 24-54 54v26c0 6 4 10 10 10m170 230h20v-20c0-22 18-40 40-40h60c13 0 24 6 31 15 3 4 9 1 9-3V190c0-22-18-40-40-40H60c-22 0-40 18-40 40v230c0 22 18 40 40 40h218c4 0 6-3 5-7-2-4-3-8-3-13v-60c0-22 18-40 40-40m165 40h-45v-45c0-8-7-15-15-15h-30c-8 0-15 7-15 15v45h-45c-8 0-15 7-15 15v30c0 8 7 15 15 15h45v45c0 8 7 15 15 15h30c8 0 15-7 15-15v-45h45c8 0 15-7 15-15v-30c0-8-7-15-15-15"${3}/></g></svg>`;
function tmpl$2b($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2b, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_child_case = registerTemplate(tmpl$2b);
tmpl$2b.stylesheets = [];
tmpl$2b.stylesheetToken = "lwc-6sff907motm";
freezeTemplate(tmpl$2b);

const $fragment1$2a = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M460 90H60c-27 0-50 22-50 50v240c0 27 23 50 50 50h400c28 0 50-22 50-50V140c0-28-22-50-50-50M248 372H104c-16 0-28-17-28-34 1-25 27-40 54-52 19-8 22-16 22-24s-5-16-12-22a55 55 0 01-17-41c0-32 19-58 52-58s52 27 52 58c0 17-6 32-17 41-7 6-12 13-12 22 0 8 2 16 22 23 27 12 53 28 54 53 3 17-10 34-26 34m195-58c0 9-8 17-17 17h-75c-9 0-17-7-17-17v-25c0-9 8-17 17-17h75c9 0 17 7 17 17zm0-91c0 9-8 17-17 17H302c-9 0-17-7-17-17v-25c0-9 8-17 17-17h125c9 0 17 7 17 17v25z"${3}/></g></svg>`;
function tmpl$2a($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2a, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_contact = registerTemplate(tmpl$2a);
tmpl$2a.stylesheets = [];
tmpl$2a.stylesheetToken = "lwc-f2ckivakgh";
freezeTemplate(tmpl$2a);

const $fragment1$29 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M294 455a47 47 0 01-69 0L57 277C7 226 7 141 57 89a124 124 0 01180 0l10 12c6 8 19 8 26 0l8-10 1-1c25-26 57-40 90-40 34 0 66 13 90 39 50 51 50 136 0 188 0 1-109 117-168 178"${3}/></g></svg>`;
function tmpl$29($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$29, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom1 = registerTemplate(tmpl$29);
tmpl$29.stylesheets = [];
tmpl$29.stylesheetToken = "lwc-39hbtdj7p5f";
freezeTemplate(tmpl$29);

const $fragment1$28 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M420 483c-76 30-196 22-261-48C1 266 139 20 329 20c32 0 62 6 91 18 12 5 13 21 3 28-61 43-102 114-102 194 0 81 40 152 101 195 11 7 9 23-2 28"${3}/></g></svg>`;
function tmpl$28($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$28, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom10 = registerTemplate(tmpl$28);
tmpl$28.stylesheets = [];
tmpl$28.stylesheetToken = "lwc-4id5cl2e52g";
freezeTemplate(tmpl$28);

const $fragment1$27 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M355 415H165c-6 0-9 5-8 11 8 31 51 55 102 55 52 0 95-24 102-55 3-6-1-11-6-11m97-375H68c-26 0-48 22-48 49v228c0 27 22 49 48 49h384c26 0 48-22 48-49V89c0-27-22-49-48-49m0 261c0 9-7 16-16 16H84c-9 0-16-7-16-16V105c0-9 7-16 16-16h352c9 0 16 7 16 16z"${3}/></g></svg>`;
function tmpl$27($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$27, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom100 = registerTemplate(tmpl$27);
tmpl$27.stylesheets = [];
tmpl$27.stylesheetToken = "lwc-4t1ildtf8eh";
freezeTemplate(tmpl$27);

const $fragment1$26 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M278 31l64 135 142 22c16 2 22 23 10 34L391 328l24 148c2 17-14 30-28 22l-127-70-127 70c-14 8-31-5-28-22l24-148L26 222c-11-12-5-32 10-34l142-22 64-135c8-15 29-15 36 0"${3}/></g></svg>`;
function tmpl$26($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$26, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom11 = registerTemplate(tmpl$26);
tmpl$26.stylesheets = [];
tmpl$26.stylesheetToken = "lwc-3ebgmsied8l";
freezeTemplate(tmpl$26);

const $fragment1$25 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 52 52" part="icon"${2}><g${3}><circle cx="26" cy="26" r="24"${3}/></g></svg>`;
function tmpl$25($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$25, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom12 = registerTemplate(tmpl$25);
tmpl$25.stylesheets = [];
tmpl$25.stylesheetToken = "lwc-1a1b0inccke";
freezeTemplate(tmpl$25);

const $fragment1$24 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M452 40H68c-26 0-48 21-48 47v47c0 9 7 16 16 16h448c9 0 16-7 16-16V87c0-26-22-47-48-47m0 157H68c-9 0-16 7-16 16v220c0 26 22 47 48 47h320c26 0 48-21 48-47V213c0-9-7-16-16-16m-104 71c0 13-10 24-24 24H196c-13 0-24-10-24-24 0-13 10-24 24-24h128c14 0 24 10 24 24"${3}/></g></svg>`;
function tmpl$24($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$24, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom13 = registerTemplate(tmpl$24);
tmpl$24.stylesheets = [];
tmpl$24.stylesheetToken = "lwc-4b2btm3543d";
freezeTemplate(tmpl$24);

const $fragment1$23 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M484 117h-48c-10 0-21-5-29-12l-38-33c-8-7-19-12-29-12h-94c-12 0-23 5-32 14l-50 41c-4 3-4 10-1 14l15 15c10 8 24 10 34 2l44-27c6-4 14-2 18 2l138 136c3 3 6 8 6 13v36c0 10 7 20 16 20h48c9 0 16-7 16-17V133c2-10-5-16-14-16M348 262l-86-85-24 15a74 74 0 01-87-7l-32-25c-7-6-11-12-12-21-2-9-8-14-16-14H36c-9 0-16 5-16 14v147c0 10 7 16 16 16h32c2 0 6-9 9-13 12-16 30-25 49-28 19-2 38 5 53 19l100 92c9 8 15 17 19 28 2 6 9 7 13 3l38-38c19-19 34-65 16-86zm-201 60c-10-10-26-8-34 3-9 11-7 28 3 37l100 91c5 5 11 6 18 6 6-1 12-4 16-10 9-11 7-28-3-37z"${3}/></g></svg>`;
function tmpl$23($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$23, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom14 = registerTemplate(tmpl$23);
tmpl$23.stylesheets = [];
tmpl$23.stylesheetToken = "lwc-5ov3do083lm";
freezeTemplate(tmpl$23);

const $fragment1$22 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M420 229c-28-12-32-22-32-34s8-22 18-31c17-15 26-36 26-60 0-45-28-84-79-84-43 0-70 29-77 66-1 3 1 6 3 8 36 26 58 69 58 121 0 36-12 69-34 94-3 4-2 10 3 13l46 22c5 3 10 5 16 5h92c22 0 40-18 40-39v-6c0-38-39-58-80-75M277 361c-34-14-38-26-38-40s10-26 21-37c19-18 30-42 30-70 0-53-34-98-93-98s-93 46-93 98c0 29 10 53 30 70 11 10 21 23 21 37s-5 26-38 40c-49 20-95 43-96 86v7c-1 25 21 46 48 46h256c26 0 48-21 48-46v-7c-1-43-47-66-96-86"${3}/></g></svg>`;
function tmpl$22($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$22, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom15 = registerTemplate(tmpl$22);
tmpl$22.stylesheets = [];
tmpl$22.stylesheetToken = "lwc-1htg7f27ff7";
freezeTemplate(tmpl$22);

const $fragment1$21 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M433 420h-8V244c0-9-7-16-16-16h-16c-9 0-16 7-16 16v176h-47V244c0-9-7-16-16-16h-16c-9 0-16 7-16 16v176h-47V244c0-9-7-16-16-16h-16c-9 0-16 7-16 16v176h-47V244c0-9-7-16-16-16h-16c-9 0-16 7-16 16v176h-5c-26 0-47 22-47 48v16c0 9 7 16 16 16h409c9 0 16-7 16-16v-16c-1-26-22-48-48-48m39-285L278 26a30 30 0 00-36 0L48 135c-5 3-8 8-8 14v15c0 9 7 16 16 16h409c9 0 16-7 16-16v-14c-1-6-4-12-9-15m-212 13c-22 0-39-18-39-40s17-40 39-40 39 18 39 40-17 40-39 40"${3}/></g></svg>`;
function tmpl$21($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$21, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom16 = registerTemplate(tmpl$21);
tmpl$21.stylesheets = [];
tmpl$21.stylesheetToken = "lwc-17oc7qr81fl";
freezeTemplate(tmpl$21);

const $fragment1$20 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M205 91c2 6 8 9 14 9h81c6 0 12-3 14-9l32-59c2-6-2-11-7-11H182c-6 0-10 6-7 11zm102 57h-94c-79 0-143 65-143 144v160c0 26 21 48 48 48h284c26 0 48-22 48-48V292c0-79-65-144-143-144m-23 269v27c0 5-5 8-10 8h-32c-5 0-6-3-6-8v-26c-24-5-44-15-49-20-6-6-8-11-3-18l10-16c2-4 7-6 12-6l8 2h1c16 10 30 14 40 14 11 0 20-6 20-12 0-5-3-13-33-23-27-10-60-26-60-63 0-22 14-47 54-55v-24c0-5 2-8 6-8h32c5 0 10 3 10 8v23c16 4 33 12 39 16 3 2 5 6 6 10s-1 8-3 10l-12 14c-3 4-9 7-13 7l-7-2c-16-9-29-14-38-14-13 0-19 6-19 10 0 6 3 12 30 22 33 11 70 29 70 67-1 27-22 50-53 57"${3}/></g></svg>`;
function tmpl$20($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$20, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom17 = registerTemplate(tmpl$20);
tmpl$20.stylesheets = [];
tmpl$20.stylesheetToken = "lwc-1daokasie5g";
freezeTemplate(tmpl$20);

const $fragment1$1$ = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M314 153h82c6 0 11-5 11-11 0-3-1-5-3-8L302 33c-3-2-5-3-8-3-6 0-11 5-11 11v81c0 17 14 31 31 31m181 104l-9-9c-6-6-15-6-22 0L345 367v28c0 2 0 4 2 4h26l3-1 119-118c7-8 7-17 0-23m-96 187h-71c-16 0-29-13-29-29v-54c0-8 2-16 9-21l95-95c3-3 5-7 5-11v-20c0-8-7-15-15-15H283c-26 0-46-21-46-46V45c0-8-7-15-16-15H66c-25 0-46 21-46 46v368c0 25 21 46 46 46h294c22 0 42-16 46-37 1-4-3-9-7-9M82 168c0-8 7-15 15-15h62c9 0 15 7 15 15v15c0 8-7 15-15 15H97c-9 0-15-7-15-15zm155 199c0 8-7 15-15 15H97c-9 0-15-7-15-15v-15c0-8 7-15 15-15h124c9 0 15 7 15 15v15zm31-92c0 8-7 15-15 15H97c-9 0-15-7-15-15v-15c0-8 7-15 15-15h155c9 0 15 7 15 15v15z"${3}/></g></svg>`;
function tmpl$1$($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1$, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom18 = registerTemplate(tmpl$1$);
tmpl$1$.stylesheets = [];
tmpl$1$.stylesheetToken = "lwc-5cnh8iqf9gk";
freezeTemplate(tmpl$1$);

const $fragment1$1_ = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M494 122c-2-6-9-7-14-3l-81 81c-6 6-16 6-22 0l-57-57c-6-6-6-16 0-22l82-81c4-4 2-11-3-14-14-4-29-6-43-6a143 143 0 00-133 198L36 404a56 56 0 000 79c11 11 26 17 40 17s29-6 40-17l186-186a143 143 0 00192-175"${3}/></g></svg>`;
function tmpl$1_($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1_, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom19 = registerTemplate(tmpl$1_);
tmpl$1_.stylesheets = [];
tmpl$1_.stylesheetToken = "lwc-4hh4cnricnc";
freezeTemplate(tmpl$1_);

const $fragment1$1Z = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M333 35C309 19 222 4 189 59c-16 26 3 73 18 103 4 7 12 11 20 8a99 99 0 0159-3c7 2 14-2 18-8a130 130 0 0131-35c38-33 22-73-2-89m-42 316c-10 3-20 5-31 5-10 0-19-2-28-4-7-2-15 2-18 8-6 10-15 23-31 36-40 32-24 73 0 89s112 31 144-24c15-26-2-72-17-102-4-7-12-10-19-8m170-164c-26-16-73 3-103 18-7 4-11 12-8 20a99 99 0 013 59c-2 7 2 14 8 18a130 130 0 0135 31c32 40 72 24 88 0s32-113-23-146M169 290c-3-10-5-20-5-31 0-10 2-19 4-28 2-7-2-15-8-18-10-6-23-15-36-31-32-40-73-24-89 0S4 293 59 326c26 15 72-2 102-17 7-4 10-12 8-19"${3}/><circle cx="260" cy="260" r="48"${3}/></g></svg>`;
function tmpl$1Z($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1Z, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom2 = registerTemplate(tmpl$1Z);
tmpl$1Z.stylesheets = [];
tmpl$1Z.stylesheetToken = "lwc-7lc7thhsq1u";
freezeTemplate(tmpl$1Z);

const $fragment1$1Y = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M164 242c0-6-8-10-13-6L39 321c-12 9-19 24-19 39v33c0 6 6 10 10 7l123-46c6-2 10-8 10-15zm177 223l-33-22V81c0-22-23-46-38-58-6-5-14-5-20 0-14 12-38 36-38 58v363l-37 24c-6 5-11 12-11 20v5c0 4 3 7 7 7h177c4 0 9-3 9-7-1-12-7-21-16-28m140-144l-112-86c-6-4-13 0-13 6v98c0 6 4 13 10 15l124 47c6 2 10-2 10-7v-33c0-16-7-31-19-40"${3}/></g></svg>`;
function tmpl$1Y($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1Y, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom20 = registerTemplate(tmpl$1Y);
tmpl$1Y.stylesheets = [];
tmpl$1Y.stylesheetToken = "lwc-64uf961rlcm";
freezeTemplate(tmpl$1Y);

const $fragment1$1X = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M321 429c-2-6-8-9-14-9h-93c-6 0-12 3-14 9l-22 59c-2 6 2 11 7 11h150c6 0 10-6 7-11zM452 20H68c-26 0-48 21-48 48v256c0 26 22 48 48 48h384c26 0 48-22 48-48V68c0-27-22-48-48-48M260 356c-14 0-24-10-24-24s10-24 24-24 24 10 24 24-10 24-24 24m192-80c0 9-7 16-16 16H84c-9 0-16-7-16-16V84c0-9 7-16 16-16h352c9 0 16 7 16 16z"${3}/></g></svg>`;
function tmpl$1X($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1X, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom21 = registerTemplate(tmpl$1X);
tmpl$1X.stylesheets = [];
tmpl$1X.stylesheetToken = "lwc-6utu2ckacn6";
freezeTemplate(tmpl$1X);

const $fragment1$1W = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M481 371l-50-40a48 48 0 00-58-2l-47 34c-6 5-15 4-21-2l-78-70-71-78c-6-6-6-14-2-21l34-47c13-18 12-42-2-58l-40-50a46 46 0 00-69-4L34 77a50 50 0 00-14 36 416 416 0 00386 387c14 1 26-5 36-14l43-43c21-21 19-54-4-72"${3}/></g></svg>`;
function tmpl$1W($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1W, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom22 = registerTemplate(tmpl$1W);
tmpl$1W.stylesheets = [];
tmpl$1W.stylesheetToken = "lwc-3j92d9ljbd7";
freezeTemplate(tmpl$1W);

const $fragment1$1V = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M250 306c6 6 15 6 22 0l226-206c4-8 3-20-13-20H37c-12 0-22 12-13 21zm250-118c0-10-13-16-20-9L304 340a63 63 0 01-86 0L41 180c-8-7-20-2-20 9v204c0 26 22 47 48 47h384c26 0 48-21 48-47z"${3}/></g></svg>`;
function tmpl$1V($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1V, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom23 = registerTemplate(tmpl$1V);
tmpl$1V.stylesheets = [];
tmpl$1V.stylesheetToken = "lwc-5ogclbnsrr5";
freezeTemplate(tmpl$1V);

const $fragment1$1U = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M403 20H117c-26 0-47 22-47 47v1c0 9 7 16 16 16h348c9 0 16-7 16-16v-1c0-25-21-47-47-47m-1 112H118c-9 0-16 7-16 16v336c0 9 7 16 16 16h88c9 0 15-7 15-16v-64c0-9 8-16 17-16h46c9 0 17 7 17 16v64c0 9 6 16 15 16h88c9 0 16-7 16-16V148c-2-9-9-16-18-16M236 348c0 9-7 16-16 16h-32c-9 0-16-7-16-16v-32c0-9 7-16 16-16h32c9 0 16 7 16 16zm0-112c0 9-7 16-16 16h-32c-9 0-16-7-16-16v-32c0-9 7-16 16-16h32c9 0 16 7 16 16zm111 112c0 9-7 16-16 16h-31c-9 0-16-7-16-16v-32c0-9 7-16 16-16h32c9 0 16 7 16 16v32zm0-112c0 9-7 16-16 16h-31c-9 0-16-7-16-16v-32c0-9 7-16 16-16h32c9 0 16 7 16 16v32z"${3}/></g></svg>`;
function tmpl$1U($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1U, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom24 = registerTemplate(tmpl$1U);
tmpl$1U.stylesheets = [];
tmpl$1U.stylesheetToken = "lwc-7a3k9kg916d";
freezeTemplate(tmpl$1U);

const $fragment1$1T = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M498 78c-6-30-30-54-61-58-22-3-42 4-57 16-5 4-4 10 2 14 37 19 68 47 92 81 3 5 10 5 14 0 10-15 14-33 10-53M137 50c5-2 6-10 2-14a71 71 0 00-57-16c-30 4-55 28-61 58-3 19 1 38 10 52 3 5 10 5 14 0 24-32 55-60 92-80m123 18A216 216 0 0086 412l-33 33a32 32 0 000 46c6 6 14 10 22 10s16-3 22-10l33-33c37 26 82 42 130 42s93-16 128-42l33 33c7 6 15 10 23 10s16-3 22-10c13-13 13-33 0-46l-33-33A216 216 0 00260 68M108 284a152 152 0 11304 0 152 152 0 01-304 0m176-10v-62c0-14-10-24-24-24s-24 10-24 24v72c0 6 2 13 7 17l56 56c5 5 11 7 17 7s12-2 17-7c10-10 10-25 0-34z"${3}/></g></svg>`;
function tmpl$1T($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1T, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom25 = registerTemplate(tmpl$1T);
tmpl$1T.stylesheets = [];
tmpl$1T.stylesheetToken = "lwc-7vauofqj143";
freezeTemplate(tmpl$1T);

const $fragment1$1S = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M68 20c-26 0-48 22-48 48 0 14 6 27 16 36v364c0 18 14 32 32 32s32-14 32-32V104c10-9 16-22 16-36 0-26-22-48-48-48m420 86c-126 66-211-47-330-4-6 2-10 8-10 15v206c0 10 10 18 21 15 114-34 199 73 323 5 5-2 8-8 8-14V114c0-7-6-11-12-8"${3}/></g></svg>`;
function tmpl$1S($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1S, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom26 = registerTemplate(tmpl$1S);
tmpl$1S.stylesheets = [];
tmpl$1S.stylesheetToken = "lwc-7varei1qdvd";
freezeTemplate(tmpl$1S);

const $fragment1$1R = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M65 356h390c8 0 15-7 15-15V104c0-24-20-44-45-44H95c-25 0-45 20-45 44v237c0 9 7 15 15 15m30-237c0-8 7-15 15-15h300c8 0 15 7 15 15v178c0 8-7 15-15 15H110c-8 0-15-7-15-15zm390 282H320c-8 0-15 7-15 15s-7 15-15 15h-60c-8 0-15-7-15-15s-7-15-15-15H35c-8 0-15 7-15 15 0 24 20 44 45 44h390c25 0 45-20 45-44 0-9-7-15-15-15"${3}/></g></svg>`;
function tmpl$1R($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1R, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom27 = registerTemplate(tmpl$1R);
tmpl$1R.stylesheets = [];
tmpl$1R.stylesheetToken = "lwc-nnhpsmgr1r";
freezeTemplate(tmpl$1R);

const $fragment1$1Q = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M372 20H148c-26 0-48 22-48 48v384c0 26 22 48 48 48h224c26 0 48-22 48-48V68c0-26-22-48-48-48M260 484c-14 0-24-10-24-24s10-24 24-24 24 10 24 24-10 24-24 24m112-80c0 9-7 16-16 16H164c-9 0-16-7-16-16V100c0-9 7-16 16-16h192c9 0 16 7 16 16z"${3}/></g></svg>`;
function tmpl$1Q($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1Q, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom28 = registerTemplate(tmpl$1Q);
tmpl$1Q.stylesheets = [];
tmpl$1Q.stylesheetToken = "lwc-1nvv9ibethm";
freezeTemplate(tmpl$1Q);

const $fragment1$1P = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M453 84h-15c-10 0-17 8-17 18v318l1 3 20 28q3 3 6 0l20-28c2-1 2-1 2-3V102c0-10-7-18-17-18M325 20H98c-26 0-48 22-48 48v384c0 26 22 48 48 48h226c27 0 48-22 48-48V68c1-26-21-48-47-48M212 484c-14 0-24-10-24-24s10-24 24-24 24 10 24 24-11 24-24 24m113-80c0 9-7 16-16 16H115c-9 0-16-7-16-16V100c0-9 7-16 16-16h194c9 0 16 7 16 16z"${3}/></g></svg>`;
function tmpl$1P($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1P, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom29 = registerTemplate(tmpl$1P);
tmpl$1P.stylesheets = [];
tmpl$1P.stylesheetToken = "lwc-1qfe1kqudjn";
freezeTemplate(tmpl$1P);

const $fragment1$1O = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M260 164a96 96 0 100 192 96 96 0 000-192m240 96c0-28-67-42-78-67-10-26 27-83 8-103s-77 18-102 7c-26-10-40-77-68-77s-42 67-67 78c-26 10-83-27-103-8s18 77 7 102c-10 26-77 40-77 68s67 42 78 67c10 26-27 83-8 103 19 19 77-18 102-7 25 10 39 78 67 78s42-67 67-78c26-10 83 26 102 7s-18-77-7-102c12-26 79-40 79-68M260 404c-79 0-144-65-144-144s65-144 144-144 144 65 144 144-65 144-144 144"${3}/></g></svg>`;
function tmpl$1O($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1O, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom3 = registerTemplate(tmpl$1O);
tmpl$1O.stylesheets = [];
tmpl$1O.stylesheetToken = "lwc-4u0oq5m5m1e";
freezeTemplate(tmpl$1O);

const $fragment1$1N = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M432 88c-44-44-103-68-164-68-14 0-24 10-24 24s10 24 24 24c49 0 95 19 131 54 34 35 54 82 54 131 0 14 10 24 24 24s24-10 24-24c-1-62-25-121-69-165m-164 28c-14 0-24 10-24 24s10 24 24 24a89 89 0 0189 89c0 14 10 24 24 24s24-10 24-24c0-36-14-71-40-96-27-26-61-41-97-41m-35 230l21-56c14 6 30 2 42-9 16-16 16-41 0-57s-41-16-57 0a42 42 0 00-8 45l-52 23-94-94c-6-6-18-6-23 1C2 271 6 379 74 446c67 67 175 71 247 12 7-6 7-17 1-23z"${3}/></g></svg>`;
function tmpl$1N($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1N, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom30 = registerTemplate(tmpl$1N);
tmpl$1N.stylesheets = [];
tmpl$1N.stylesheetToken = "lwc-2cu2qssf6u5";
freezeTemplate(tmpl$1N);

const $fragment1$1M = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M464 207L425 87c-7-22-29-37-53-37H148c-24 0-46 15-54 37L56 207c-21 6-36 23-36 45v93c0 20 14 37 32 44v65c0 9 7 16 16 16h64c9 0 16-7 16-16v-62h224v62c0 9 7 16 16 16h64c9 0 16-7 16-16v-64c18-6 32-23 32-44v-93c0-23-15-40-36-46M100 338c-22 0-40-17-40-39s18-39 40-39 40 17 40 39-18 39-40 39m176-132H118c-6 0-10-5-8-10l30-93c1-3 4-5 7-5h224c3 0 6 2 7 5l30 94c2 5-2 10-8 10H276zm136 132c-22 0-40-17-40-39s18-39 40-39 40 17 40 39-18 39-40 39"${3}/></g></svg>`;
function tmpl$1M($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1M, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom31 = registerTemplate(tmpl$1M);
tmpl$1M.stylesheets = [];
tmpl$1M.stylesheetToken = "lwc-58berr1ne0a";
freezeTemplate(tmpl$1M);

const $fragment1$1L = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M488 142L301 249l-12 3c-9 0-18-5-22-14-6-11 0-26 11-32l62-35v-61c0-6-6-10-12-7L100 233l-12 3c-8 0-17-4-21-12-6-11-2-26 9-33l39-22V36c1-9-6-16-15-16H36c-9 0-16 7-16 16v416c0 26 22 48 48 48h136c9 0 16-7 16-16v-56c0-9 7-16 16-16h48c9 0 16 7 16 16v56c0 9 7 16 16 16h136c26 0 48-22 48-48V150c0-7-6-11-12-8M140 364c0 9-7 16-16 16h-16c-9 0-16-7-16-16v-48c0-9 7-16 16-16h16c9 0 16 7 16 16zm96 0c0 9-7 16-16 16h-16c-9 0-16-7-16-16v-48c0-9 7-16 16-16h16c9 0 16 7 16 16zm96 0c0 9-7 16-16 16h-16c-9 0-16-7-16-16v-48c0-9 7-16 16-16h16c9 0 16 7 16 16zm96 0c0 9-7 16-16 16h-16c-9 0-16-7-16-16v-48c0-9 7-16 16-16h16c9 0 16 7 16 16z"${3}/></g></svg>`;
function tmpl$1L($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1L, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom32 = registerTemplate(tmpl$1L);
tmpl$1L.stylesheets = [];
tmpl$1L.stylesheetToken = "lwc-6p12kinc8p0";
freezeTemplate(tmpl$1L);

const $fragment1$1K = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M372 193H155c-8 0-15 7-15 15v59c0 8 7 15 15 15h218c8 0 15-7 15-15v-59c0-8-7-15-16-15m-104 67c-13 0-22-10-22-22 0-13 10-22 22-22s22 10 22 22-10 22-22 22M485 90H35c-8 0-15 7-15 15v15c0 16 13 30 30 30v266c0 7 7 14 15 14h15c8 0 15-7 15-15V149h338v266c0 8 7 15 15 15h15c8 0 15-7 15-15V149h-8c16 0 30-13 30-30v-15c0-7-7-14-15-14"${3}/></g></svg>`;
function tmpl$1K($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1K, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom33 = registerTemplate(tmpl$1K);
tmpl$1K.stylesheets = [];
tmpl$1K.stylesheetToken = "lwc-6sdhmjb8ktb";
freezeTemplate(tmpl$1K);

const $fragment1$1J = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M196 100h128c9 0 16-9 14-18-8-35-40-62-78-62s-70 27-78 62c-2 9 5 18 14 18m280 208c14 0 25-11 24-26-1-12-12-22-26-22h-70v-40c46-18 79-68 80-127 0-12-8-22-20-25-15-2-28 9-28 24 0 34-16 64-39 78-9-14-24-22-41-22H164c-17 0-32 9-41 22a89 89 0 01-39-77c0-13-10-25-22-26-14-1-26 10-26 24 0 59 34 110 80 128v40H46c-13 0-25 10-26 22-1 14 10 26 24 26h72v40c-46 18-79 68-80 127 0 12 8 22 20 25 15 2 28-9 28-24 0-34 15-63 38-78 14 45 49 80 93 94 10 3 21-5 21-15V286c0-13 10-25 22-26 14-1 26 10 26 24v193c0 11 10 18 21 15 44-14 79-50 93-94 22 14 38 43 38 76 0 13 10 25 22 26 14 1 26-10 26-24 0-59-34-110-80-128v-40z"${3}/></g></svg>`;
function tmpl$1J($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1J, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom34 = registerTemplate(tmpl$1J);
tmpl$1J.stylesheets = [];
tmpl$1J.stylesheetToken = "lwc-3h5ku0824dm";
freezeTemplate(tmpl$1J);

const $fragment1$1I = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M415 180c-14 0-25 10-25 24v40c0 70-59 128-131 128s-131-58-131-128v-40c0-14-11-24-25-24s-23 10-23 24v40c0 89 68 162 155 174v34h-41c-14 0-25 10-25 24s11 24 25 24h131c14 0 25-10 25-24s-11-24-25-24h-41v-34c88-12 156-85 156-174v-40c0-14-11-24-25-24M260 324c45 0 82-36 82-80V99c0-44-36-79-81-79h-2c-45 0-81 35-81 79v145c0 44 37 80 82 80"${3}/></g></svg>`;
function tmpl$1I($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1I, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom35 = registerTemplate(tmpl$1I);
tmpl$1I.stylesheets = [];
tmpl$1I.stylesheetToken = "lwc-7s3l579o9bb";
freezeTemplate(tmpl$1I);

const $fragment1$1H = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M172 436h-32c-5 0-11 3-13 8l-11 19c-6 11-4 26 6 33 4 3 9 4 13 4 8 0 16-4 20-12l23-40c4-6 0-12-6-12m222 8c-3-5-8-8-13-8h-32c-6 0-10 6-7 12l23 40c5 8 13 12 20 12 5 0 9-2 13-4 10-7 13-22 6-33zm-1-424H127c-26 0-47 22-47 48v272c0 26 21 48 47 48h266c26 0 47-22 47-48V68c0-26-21-48-47-48M150 356c-13 0-23-10-23-24s10-24 23-24 23 10 23 24-9 24-23 24m220 0c-13 0-23-10-23-24s10-24 23-24 23 10 23 24-10 24-23 24m23-96c0 9-7 16-16 16H143c-9 0-16-7-16-16V100c0-9 7-16 16-16h235c9 0 16 7 16 16v160z"${3}/></g></svg>`;
function tmpl$1H($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1H, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom36 = registerTemplate(tmpl$1H);
tmpl$1H.stylesheets = [];
tmpl$1H.stylesheetToken = "lwc-1ho8neir6an";
freezeTemplate(tmpl$1H);

const $fragment1$1G = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M485 305h-97v-88c20 17 46 28 75 28 13 0 22-10 22-22s-10-22-22-22c-41 0-75-37-75-82V95c8 0 15-7 15-15V65c0-8-7-15-15-15h-45c-8 0-15 7-15 15v15c0 8 7 15 15 15v22c0 46-37 82-82 82s-82-37-82-82V95c8 0 15-7 15-15V65c0-8-7-15-15-15h-45c-8 0-15 7-15 15v15c0 8 7 15 15 15v22c0 46-34 82-75 82-13 0-22 10-22 22s10 22 22 22c28 0 55-11 75-28v88H35c-8 2-15 9-15 17v36c0 8 7 17 15 17h30v81c0 8 7 16 15 16h45c8 0 15-8 15-16v-30c0-25 20-44 45-44h150c25 0 45 19 45 44v30c0 8 7 16 15 16h45c8 0 15-8 15-16v-81h30c8 0 15-8 15-17v-36c0-8-7-15-15-15m-307-91c22 19 51 31 82 31s60-11 82-31v91H178z"${3}/></g></svg>`;
function tmpl$1G($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1G, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom37 = registerTemplate(tmpl$1G);
tmpl$1G.stylesheets = [];
tmpl$1G.stylesheetToken = "lwc-3msoqetuo9i";
freezeTemplate(tmpl$1G);

const $fragment1$1F = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M260 220c-35 0-64 29-64 64s29 64 64 64 64-29 64-64-29-64-64-64m192-80h-65c-6 0-12-3-14-10l-21-44c-8-16-25-26-43-26h-98c-18 0-35 10-43 26l-21 44c-2 6-8 10-14 10H68c-26 0-48 22-48 48v224c0 26 22 48 48 48h384c26 0 48-22 48-48V188c0-26-22-48-48-48M260 398a112 112 0 110-224 112 112 0 010 224"${3}/></g></svg>`;
function tmpl$1F($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1F, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom38 = registerTemplate(tmpl$1F);
tmpl$1F.stylesheets = [];
tmpl$1F.stylesheetToken = "lwc-6cuhd4jok9p";
freezeTemplate(tmpl$1F);

const $fragment1$1E = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M369 89c-2-6-9-10-15-9L31 184c-8 2-12 11-10 19l13 50c2 8 10 14 18 12l82-11c2 9 6 18 12 25L76 468c-5 12 1 26 14 30l8 2c10 0 19-6 22-16l66-179c6 2 10 2 16 2l16-2 66 179c3 10 13 16 22 16l8-2c13-5 19-18 14-31l-70-190c9-12 14-27 14-43v-1l113-16c7-1 12-8 10-15zm130 113L455 38c-3-13-17-21-30-18s-21 17-18 30l44 163c3 13 17 21 30 18s21-17 18-29"${3}/></g></svg>`;
function tmpl$1E($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1E, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom39 = registerTemplate(tmpl$1E);
tmpl$1E.stylesheets = [];
tmpl$1E.stylesheetToken = "lwc-1cf7qlbgcdj";
freezeTemplate(tmpl$1E);

const $fragment1$1D = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M66 122l169-95c15-9 35-9 51 0l169 95c15 9 25 26 25 43v190c0 18-9 34-25 43l-169 95c-15 9-35 9-51 0L66 398c-15-9-26-25-26-43V165c0-18 11-34 26-43"${3}/></g></svg>`;
function tmpl$1D($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1D, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom4 = registerTemplate(tmpl$1D);
tmpl$1D.stylesheets = [];
tmpl$1D.stylesheetToken = "lwc-b4lb4nm91c";
freezeTemplate(tmpl$1D);

const $fragment1$1C = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M452 80H68c-26 0-48 21-48 47v266c0 26 22 47 48 47h384c26 0 48-21 48-47V127c0-26-22-47-48-47m0 47v47H68v-47zM68 393V252h384v141zm137-102c-11 0-21 5-26 14-1 2-3 2-4 0-6-9-15-14-26-14-18 0-32 14-32 31s14 31 32 31c11 0 21-5 26-14 1-2 3-2 4 0 6 9 15 14 26 14h1c17 0 31-13 31-31v-2c-1-15-15-29-32-29m183 8h-96c-9 0-16 7-16 16v15c0 9 7 16 16 16h96c9 0 16-7 16-16v-16c0-8-7-15-16-15"${3}/></g></svg>`;
function tmpl$1C($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1C, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom40 = registerTemplate(tmpl$1C);
tmpl$1C.stylesheets = [];
tmpl$1C.stylesheetToken = "lwc-7bei0e6fbvb";
freezeTemplate(tmpl$1C);

const $fragment1$1B = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M455 110H65c-25 0-45 20-45 44v212c0 24 20 44 45 44h390c25 0 45-20 45-44V154c0-24-20-44-45-44M118 366a50 50 0 00-52-51V205c29 0 52-23 52-51h285a50 50 0 0052 51v110a51 51 0 00-52 51z"${3}/><ellipse cx="260" cy="256" rx="75" ry="73"${3}/></g></svg>`;
function tmpl$1B($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1B, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom41 = registerTemplate(tmpl$1B);
tmpl$1B.stylesheets = [];
tmpl$1B.stylesheetToken = "lwc-3324badljoq";
freezeTemplate(tmpl$1B);

const $fragment1$1A = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M452 40H68c-26 0-48 21-48 47v47c0 9 7 16 16 16h448c9 0 16-7 16-16V87c0-26-22-47-48-47m0 157H68c-9 0-16 7-16 16v220c0 26 22 47 48 47h320c26 0 48-21 48-47V213c0-9-7-16-16-16m-104 71c0 13-10 24-24 24H196c-13 0-24-10-24-24 0-13 10-24 24-24h128c14 0 24 10 24 24"${3}/></g></svg>`;
function tmpl$1A($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1A, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom42 = registerTemplate(tmpl$1A);
tmpl$1A.stylesheets = [];
tmpl$1A.stylesheetToken = "lwc-26o47u4pcub";
freezeTemplate(tmpl$1A);

const $fragment1$1z = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M498 212l1-4v-10l-1-2-1-1-1-2-1-1-87-123c-4-5-10-9-17-9H129c-7 0-14 4-18 9L23 191l-1 1-1 2-1 1-1 2v10l1 4v1l1 3 1 1 1 1 219 236 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1h16l1-1 1-1 1-1 1-1 1-1 1-1 1-1 1-1 1-1 219-236 1-1 1-1zm-238-30h-35l35-58 35 58zm0 43h44l-44 141-44-141zm38-122h55l-20 57zm-110 57l-20-57h55zm-17 65l40 130L91 225zm178 0h80L309 355zm87-43h-66l22-61zm-309-61l22 61H84z"${3}/></g></svg>`;
function tmpl$1z($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1z, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom43 = registerTemplate(tmpl$1z);
tmpl$1z.stylesheets = [];
tmpl$1z.stylesheetToken = "lwc-1l8bg8vttqp";
freezeTemplate(tmpl$1z);

const $fragment1$1y = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M407 91c-41-53-75-71-147-71-32 0-71 13-87 16 0-9-7-16-16-16h-32c-9 0-16 7-16 16v64c0 9 7 16 16 16h31c9 0 16-7 16-16h18c13 0 23 10 23 23v1c0 14 10 24 24 24v128c-17 0-31 14-31 32v144c0 26 21 48 47 48h16c26 0 47-22 47-48V308c0-18-14-32-31-32V148c13 0 24-18 24-31v-1c0-12 9-22 21-22 31-2 49 11 57 18 5 4 13 5 17 1 7-5 9-15 3-22"${3}/></g></svg>`;
function tmpl$1y($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1y, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom44 = registerTemplate(tmpl$1y);
tmpl$1y.stylesheets = [];
tmpl$1y.stylesheetToken = "lwc-2uia2fq51cc";
freezeTemplate(tmpl$1y);

const $fragment1$1x = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M132 208h255v105H132z"${3}/><path d="M500 195v-40c0-25-20-45-45-45H65c-25 0-45 20-45 45v40c0 5 3 11 8 13 18 11 30 30 30 52s-12 41-30 52c-5 2-8 7-8 12v41c0 25 20 45 45 45h390c25 0 45-20 45-45v-40c0-5-3-11-8-13-18-11-30-30-30-52s12-41 30-52c5-3 8-7 8-13m-82 163H102c-8 0-15-7-15-15V178c0-8 7-15 15-15h315c8 0 15 7 15 15v165c0 8-6 15-14 15"${3}/></g></svg>`;
function tmpl$1x($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1x, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom45 = registerTemplate(tmpl$1x);
tmpl$1x.stylesheets = [];
tmpl$1x.stylesheetToken = "lwc-dtt8uehc1f";
freezeTemplate(tmpl$1x);

const $fragment1$1w = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M348 156H172c-9 0-16 7-16 16v176c0 9 7 16 16 16h176c9 0 16-7 16-16V172c0-9-7-16-16-16m140-78c7-3 12-8 12-16V36c0-9-7-16-16-16h-26c-7 0-13 5-15 12a40 40 0 01-76 0c-4-7-9-12-17-12h-37c-7 0-13 5-15 12a40 40 0 01-76 0c-3-7-8-12-16-12h-36c-7 0-13 5-15 12-5 16-21 28-39 28S83 48 78 32c-3-7-8-12-16-12H36c-9 0-16 7-16 16v26c0 8 5 13 12 16a40 40 0 010 76c-7 3-12 8-12 16v37c0 7 5 13 12 15a40 40 0 010 76c-7 3-12 8-12 16v36c0 7 5 13 12 15 16 5 28 21 28 39s-12 33-28 38c-7 3-12 8-12 16v26c0 9 7 16 16 16h26c7 0 13-5 15-12a40 40 0 0176 0c2 7 8 12 15 12h37c7 0 13-5 15-12a40 40 0 0176 0c2 7 8 12 15 12h39c7 0 13-5 15-12a40 40 0 0176 0c2 7 8 12 15 12h26c9 0 16-7 16-16v-26c0-7-5-13-12-15a40 40 0 010-76c7-2 12-8 12-15v-37c0-7-5-13-12-15a40 40 0 010-76c7-2 12-8 12-15v-39c0-7-5-13-12-15-16-5-28-20-28-38s14-34 30-39m-76 286c0 26-22 48-48 48H156c-26 0-48-22-48-48V156c0-26 22-48 48-48h208c26 0 48 22 48 48z"${3}/></g></svg>`;
function tmpl$1w($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1w, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom46 = registerTemplate(tmpl$1w);
tmpl$1w.stylesheets = [];
tmpl$1w.stylesheetToken = "lwc-2oth3c28jrr";
freezeTemplate(tmpl$1w);

const $fragment1$1v = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M366 436H89c-27 0-49 22-49 48v1c0 8 7 15 15 15h344c8 0 15-7 15-15v-1c1-26-21-48-48-48m109-253L345 65l21-31c3-5 1-11-5-12-40-8-64 19-64 19C46 41 87 312 99 375c2 7 8 13 16 13h221c7 0 11-8 7-13-45-54-68-114-83-152-2-6 4-14 11-10 59 30 84-2 124 22 20 12 44 9 60-7l22-22c4-6 4-16-2-23m-166-27c-14 0-24-10-24-24s11-24 24-24 24 10 24 24-10 24-24 24"${3}/></g></svg>`;
function tmpl$1v($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1v, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom47 = registerTemplate(tmpl$1v);
tmpl$1v.stylesheets = [];
tmpl$1v.stylesheetToken = "lwc-7ial5ss6jm8";
freezeTemplate(tmpl$1v);

const $fragment1$1u = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M484 52h-80V36c0-9-7-16-16-16H132c-9 0-16 7-16 16v16H36c-9 0-16 7-16 16v104c0 40 32 72 72 72h37a143 143 0 00264 0h35c40 0 72-32 72-72V68c0-9-7-16-16-16M92 196c-14 0-24-10-24-24v-72h48v85l1 11zm360-24c0 14-10 24-24 24h-25l1-10v-86h48zM340 452h-8c-26 0-48-22-48-48v-16c0-5-3-8-8-8h-32c-5 0-8 3-8 8v16c0 26-22 48-48 48h-8c-9 0-16 7-16 16v16c0 9 7 16 16 16h160c9 0 16-7 16-16v-16c0-9-7-16-16-16"${3}/></g></svg>`;
function tmpl$1u($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1u, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom48 = registerTemplate(tmpl$1u);
tmpl$1u.stylesheets = [];
tmpl$1u.stylesheetToken = "lwc-6ccdb2crv5k";
freezeTemplate(tmpl$1u);

const $fragment1$1t = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M260 188c-40 0-72 32-72 72s32 72 72 72 72-32 72-72-32-72-72-72m0 112c-22 0-40-18-40-40s18-40 40-40 40 18 40 40-18 40-40 40m0-280a240 240 0 100 480 240 240 0 100-480m0 423c0 10-8 17-18 16-96-8-173-85-182-182 0-9 7-17 17-17h16c8 0 15 6 16 14 7 72 65 130 137 137 8 1 14 8 14 16zm0-63c-66 0-120-54-120-120s54-120 120-120 120 54 120 120-54 120-120 120m183-120h-16c-8 0-15-6-16-14-7-72-65-130-137-137-8-1-14-8-14-16V77c0-10 8-17 18-16 97 8 174 86 182 182 0 9-7 17-17 17"${3}/></g></svg>`;
function tmpl$1t($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1t, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom49 = registerTemplate(tmpl$1t);
tmpl$1t.stylesheets = [];
tmpl$1t.stylesheetToken = "lwc-39b7j5t1113";
freezeTemplate(tmpl$1t);

const $fragment1$1s = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M491 58c-82-31-177-38-261-11-74 24-150 79-161 161-2 17-2 36 2 52l8 26c2 5 3 9 6 13l-10 14c-23 36-39 77-49 118-4 17-14 43 5 55 7 5 18 5 25 1 10-6 11-15 13-25 7-42 22-84 45-120 11-17 23-35 37-51 12-13 30-37 50-30s19 30 6 42-25 25-25 44c0 14 6 29 18 38 16 13 48 16 67 14 42-2 77-15 111-40 45-31 62-85 71-136 6-32 10-63 21-93q7.5-19.5 18-36c3-6 10-12 11-18 3-9-2-16-8-18"${3}/></g></svg>`;
function tmpl$1s($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1s, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom5 = registerTemplate(tmpl$1s);
tmpl$1s.stylesheets = [];
tmpl$1s.stylesheetToken = "lwc-65s3904r6s4";
freezeTemplate(tmpl$1s);

const $fragment1$1r = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M475 313a146 146 0 01-133-5c-2-2-6-2-8 0a146 146 0 01-144 0c-2-2-6-2-8 0-21 13-46 19-72 19-22 0-43-5-61-14-6-3-12 1-12 7v98c0 19 11 36 29 45 40 18 83 31 129 37 10 2 18-6 18-16v-61c0-27 22-48 47-48h1c26 0 47 22 47 48v61c0 10 9 17 18 16 45-6 88-19 129-37 18-8 29-25 29-45v-98c2-6-4-10-9-7m-366-35c29 0 54-12 70-32 3-4 9-4 12 0a93 93 0 00140 0c3-4 9-4 12 0 16 19 42 32 70 32 45 0 83-32 87-71 1-6-2-11-6-15L290 30a47 47 0 00-59 0L26 192c-4 3-6 9-6 15 6 40 44 71 89 71"${3}/></g></svg>`;
function tmpl$1r($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1r, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom50 = registerTemplate(tmpl$1r);
tmpl$1r.stylesheets = [];
tmpl$1r.stylesheetToken = "lwc-5lbmq29c7g1";
freezeTemplate(tmpl$1r);

const $fragment1$1q = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M185 65c20 14 39 46 47 71 2 6 6 10 12 10 6 2 10 2 16 2 9 0 16 0 23-3 20-7 38-16 53-31 24-25 33-60 24-89-29-9-64-1-88 24-7 7-13 15-17 24-13-20-28-38-45-49-12-7-27-3-34 9-6 11-1 25 9 32m242 117c-81-46-98 16-167 16s-86-62-167-16c-78 45-55 192-24 248 28 49 79 99 184 51 4-2 9-2 13 0 105 48 157-3 184-51 32-56 55-203-23-248"${3}/></g></svg>`;
function tmpl$1q($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1q, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom51 = registerTemplate(tmpl$1q);
tmpl$1q.stylesheets = [];
tmpl$1q.stylesheetToken = "lwc-3dd0e6emaob";
freezeTemplate(tmpl$1q);

const $fragment1$1p = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M499 141c2-26 0-51-4-76-3-21-19-37-40-40-26-4-50-6-76-4-7 0-10 9-6 14l112 112c6 4 14 0 14-6M310 38c-4-4-10-6-15-4A373 373 0 0035 291c-2 6 0 12 4 16l174 174c4 4 10 6 16 4a377 377 0 00257-260c2-6 0-11-4-15zm-67 314c-10 10-25 10-34 0l-45-45c-10-10-10-25 0-34 10-10 25-10 34 0l45 45c10 10 10 25 0 34m56-56c-10 10-25 10-34 0l-45-45c-10-10-10-25 0-34 10-10 25-10 34 0l45 45c10 10 10 25 0 34m56-56c-10 10-25 10-34 0l-45-45c-10-10-10-25 0-34 10-10 25-10 34 0l45 45c10 10 10 25 0 34M21 374c-2 27-1 54 4 82 3 21 19 37 40 40 27 4 54 6 82 4 7-1 10-9 6-14L34 368c-4-4-13-1-13 6"${3}/></g></svg>`;
function tmpl$1p($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1p, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom52 = registerTemplate(tmpl$1p);
tmpl$1p.stylesheets = [];
tmpl$1p.stylesheetToken = "lwc-ln14gst9oa";
freezeTemplate(tmpl$1p);

const $fragment1$1o = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M454 316h-5c-18 0-32-14-32-33V177c0-93-82-167-175-156-80 9-139 80-139 163v95c0 20-17 37-36 37h-1c-14 0-26 12-26 26v19c0 14 12 26 26 26h388c14 0 26-12 26-26v-19c0-14-12-26-26-26M312 436H208c-6 0-12 5-10 11 6 30 31 53 63 53s57-22 63-53c0-6-5-11-12-11"${3}/></g></svg>`;
function tmpl$1o($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1o, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom53 = registerTemplate(tmpl$1o);
tmpl$1o.stylesheets = [];
tmpl$1o.stylesheetToken = "lwc-14rsvuhrgjn";
freezeTemplate(tmpl$1o);

const $fragment1$1n = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M78 269c52-9 98-30 147-53l60-27c5-2 8-7 6-13-4-23-23-42-47-42h-16v-30c0-9-8-16-16-16V56c0-9-7-16-16-16h-32c-9 0-16 7-16 16v32c-8 0-16 7-16 16v30h-16c-26 0-48 24-48 51v75c0 6 5 10 10 9m358 158s58-90 64-216c0-9-7-17-17-17-190 7-279 122-448 129-9 0-15 8-15 16v60c0 26 20 46 45 48 84 5 264 17 367 34 10 2 20-8 18-18-2-13-6-27-14-36m-8-143c-14 0-24-10-24-24s10-24 24-24 24 10 24 24-10 24-24 24"${3}/></g></svg>`;
function tmpl$1n($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1n, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom54 = registerTemplate(tmpl$1n);
tmpl$1n.stylesheets = [];
tmpl$1n.stylesheetToken = "lwc-7deqt1aocak";
freezeTemplate(tmpl$1n);

const $fragment1$1m = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M125 333h98c8 0 15-7 15-15V99c0-16-15-29-30-29h-80c-10 0-17 7-17 17v232c-1 7 6 14 14 14m330-219v234c0 16-14 29-30 29H95c-17 0-30-13-30-29V114c-25 0-45 20-45 44v219c0 24 20 44 45 44h142c8 0 15 7 15 15s7 15 15 15h45c8 0 15-7 15-15s7-15 15-15h142c25 0 45-20 45-44V158c1-24-19-44-44-44M298 333h95c10 0 17-7 17-17V85c0-8-7-15-15-15h-82c-15 0-30 13-30 29v219c-1 8 6 15 15 15"${3}/></g></svg>`;
function tmpl$1m($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1m, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom55 = registerTemplate(tmpl$1m);
tmpl$1m.stylesheets = [];
tmpl$1m.stylesheetToken = "lwc-6tm5f55t1io";
freezeTemplate(tmpl$1m);

const $fragment1$1l = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M362 103c-50 50-111-11-167 45L34 308a47 47 0 000 66l56 56 56 56c18 18 48 18 66 0l162-161c56-56-6-117 45-167l13-13c3-3 3-8 0-11l-45-44c-3-3-8-3-11 0zm-39 205l-56 56c-6 6-16 6-22 0l-45-45-45-45c-6-6-6-16 0-22l56-56c6-6 16-6 22 0l45 45 45 45c7 6 7 16 0 22M495 58l-17-17-17-17c-6-6-16-6-22 0l-21 21c-3 3-3 8 0 11l44 44c3 3 8 3 11 0l21-20c8-5 8-15 1-22"${3}/></g></svg>`;
function tmpl$1l($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1l, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom56 = registerTemplate(tmpl$1l);
tmpl$1l.stylesheets = [];
tmpl$1l.stylesheetToken = "lwc-6bj1hstvh7b";
freezeTemplate(tmpl$1l);

const $fragment1$1k = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M284 290v202c0 7 7 10 12 7l158-91c15-9 25-26 25-44V183c0-7-7-10-12-7L292 276c-4 3-8 8-8 14m-16-57l176-100c6-3 6-11 0-14L285 27c-15-9-35-9-51 0L75 119c-5 3-5 11 1 14l176 100c5 3 11 3 16 0m-41 42L52 175c-5-3-12 1-12 8v181c0 18 10 35 25 44l158 91c6 3 12-1 12-7V290c1-6-3-11-8-15"${3}/></g></svg>`;
function tmpl$1k($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1k, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom57 = registerTemplate(tmpl$1k);
tmpl$1k.stylesheets = [];
tmpl$1k.stylesheetToken = "lwc-53gijbigg9l";
freezeTemplate(tmpl$1k);

const $fragment1$1j = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M395 228c-14 0-25-11-24-26 1-13 12-22 26-22h69c3 0 6-2 7-4q9-16.5 15-33c2-6-2-11-7-11h-51c-13 0-25-10-26-22-1-14 10-26 24-26h64c5 0 8-3 8-8V52c0-9-7-16-16-16h-85c-24 0-43 19-43 43v1c0 45-30 85-72 96v-66c17-10 27-28 24-49s-21-38-42-40a48.4 48.4 0 00-30 90v67a99 99 0 01-72-96v-2c0-24-19-43-43-43H36c-9 0-16 7-16 16v24c0 5 3 8 8 8h62c13 0 25 10 26 22 1 14-10 26-24 26H40c-6 0-10 6-7 11 4 10 9 22 15 33 2 2 4 4 7 4h69c13 0 25 10 26 22 1 14-10 26-24 26h-19c-7 0-11 10-5 14 34 29 78 49 136 49v182c0 13 10 25 22 26 14 1 26-10 26-24V292c58 0 102-21 136-49 6-5 2-14-5-14h-22z"${3}/></g></svg>`;
function tmpl$1j($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1j, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom58 = registerTemplate(tmpl$1j);
tmpl$1j.stylesheets = [];
tmpl$1j.stylesheetToken = "lwc-75e981u144a";
freezeTemplate(tmpl$1j);

const $fragment1$1i = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M397 108c8 0 13-6 13-14 0-6-3-11-9-14-10-6-26-33-32-50-2-6-8-10-14-10H163c-6 0-13 4-14 10-5 16-21 44-31 50-5 3-8 8-8 14 0 8 6 14 13 14zM110 451c0 27 21 49 47 49h205c26 0 47-22 47-48v-1c0-9-7-15-15-15H124c-7 0-14 7-14 15m300-79V172c0-9-7-16-16-16H126c-9 0-16 7-16 16v200c0 9 7 16 16 16h268c9 0 16-7 16-16"${3}/></g></svg>`;
function tmpl$1i($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1i, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom59 = registerTemplate(tmpl$1i);
tmpl$1i.stylesheets = [];
tmpl$1i.stylesheetToken = "lwc-3mo3qn13ped";
freezeTemplate(tmpl$1i);

const $fragment1$1h = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M260 470H52c-25 0-40-27-27-49L232 66c12-21 42-21 55 0l208 356c13 22-3 49-27 49H260z"${3}/></g></svg>`;
function tmpl$1h($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1h, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom6 = registerTemplate(tmpl$1h);
tmpl$1h.stylesheets = [];
tmpl$1h.stylesheetToken = "lwc-1oamu61o7cj";
freezeTemplate(tmpl$1h);

const $fragment1$1g = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M500 222C481 108 381 20 260 20S39 108 20 222c-1 8 7 13 13 8 12-10 27-16 45-16 22 0 42 10 54 26 3 4 10 4 13 0 13-16 32-26 54-26s42 10 54 26c3 4 10 4 13 0 13-16 32-26 54-26s42 10 54 26c3 4 10 4 13 0 13-16 32-26 54-26 17 0 33 6 45 16 7 5 15 0 14-8M356 404c-14 0-24 10-24 24s-10 24-24 24-24-10-24-24V316c0-14-10-24-24-24s-24 10-24 24v112c0 40 32 72 72 72s72-32 72-72c0-14-10-24-24-24"${3}/></g></svg>`;
function tmpl$1g($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1g, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom60 = registerTemplate(tmpl$1g);
tmpl$1g.stylesheets = [];
tmpl$1g.stylesheetToken = "lwc-6csubdjdom1";
freezeTemplate(tmpl$1g);

const $fragment1$1f = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M444 20h-32c-9 0-16 7-16 16v32c0 9-7 16-16 16h-16c-9 0-16-7-16-16V36c0-9-6-16-16-16h-32c-9 0-16 7-16 16v32c0 9-7 16-16 16h-16c-9 0-16-7-16-16V36c0-9-7-16-16-16h-32c-9 0-16 7-16 16v32c0 9-7 16-16 16h-16c-9 0-16-7-16-16V36c0-9-7-16-16-16H76c-9 0-16 7-16 16v80c0 26 22 48 48 48h304c26 0 48-22 48-48V36c0-9-7-16-16-16m-36 205c-1-8-8-14-16-14H128c-8 0-15 6-16 14L76 481c-2 10 6 18 16 18h103c9 0 17-7 17-16v-77c0-26 20-50 46-50 27-1 50 21 50 48v80c0 9 8 16 17 16h103c10 0 18-9 16-18z"${3}/></g></svg>`;
function tmpl$1f($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1f, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom61 = registerTemplate(tmpl$1f);
tmpl$1f.stylesheets = [];
tmpl$1f.stylesheetToken = "lwc-ohi73i4fr0";
freezeTemplate(tmpl$1f);

const $fragment1$1e = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M476 412H44c-13 0-24 10-24 24 0 13 10 24 24 24h432c13 0 24-10 24-24s-10-24-24-24M52 364h272v-32c0-9 7-16 16-16h80c9 0 16 7 16 16v32h32c9 0 16-7 16-16V76c0-9-7-16-16-16H52c-9 0-16 7-16 16v272c0 9 7 16 16 16m72-208c0-9 7-16 16-16h232c9 0 16 7 16 16v16c0 9-7 16-16 16H140c-9 0-16-7-16-16zm0 96c0-9 7-16 16-16h152c9 0 16 7 16 16v16c0 9-7 16-16 16H140c-9 0-16-7-16-16z"${3}/></g></svg>`;
function tmpl$1e($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1e, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom62 = registerTemplate(tmpl$1e);
tmpl$1e.stylesheets = [];
tmpl$1e.stylesheetToken = "lwc-5preuflr3ss";
freezeTemplate(tmpl$1e);

const $fragment1$1d = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M196 340h128c9 0 16-7 16-16V196c0-9-7-16-16-16H196c-9 0-16 7-16 16v128c0 9 7 16 16 16m280-56c14 0 24-10 24-24s-10-24-24-24h-40v-48h40c14 0 24-10 24-24s-10-24-24-24h-40v-8c0-26-22-48-48-48h-8V44c0-14-10-24-24-24s-24 10-24 24v40h-48V44c0-14-10-24-24-24s-24 10-24 24v40h-48V44c0-14-10-24-24-24s-24 10-24 24v40h-8c-26 0-48 22-48 48v8H44c-14 0-24 10-24 24s10 24 24 24h40v48H44c-14 0-24 10-24 24s10 24 24 24h40v48H44c-14 0-24 10-24 24s10 24 24 24h40v8c0 26 22 48 48 48h8v40c0 14 10 24 24 24s24-10 24-24v-40h48v40c0 14 10 24 24 24s24-10 24-24v-40h48v40c0 14 10 24 24 24s24-10 24-24v-40h8c26 0 48-22 48-48v-8h40c14 0 24-10 24-24s-10-24-24-24h-40v-48zm-88 80c0 14-10 24-24 24H156c-14 0-24-10-24-24V156c0-14 10-24 24-24h208c14 0 24 10 24 24z"${3}/></g></svg>`;
function tmpl$1d($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1d, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom63 = registerTemplate(tmpl$1d);
tmpl$1d.stylesheets = [];
tmpl$1d.stylesheetToken = "lwc-3g42fcp9o75";
freezeTemplate(tmpl$1d);

const $fragment1$1c = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M260 20C128 20 20 128 20 260s108 240 240 240 240-108 240-240S392 20 260 20m0 416a176 176 0 111-353 176 176 0 01-1 353m93-279l-133 48c-7 2-13 8-15 15l-48 133c-2 6 4 13 10 10l133-48c7-2 13-8 15-15l48-133c3-6-4-13-10-10m-93 135c-18 0-32-14-32-32s14-32 32-32 32 14 32 32-14 32-32 32"${3}/></g></svg>`;
function tmpl$1c($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1c, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom64 = registerTemplate(tmpl$1c);
tmpl$1c.stylesheets = [];
tmpl$1c.stylesheetToken = "lwc-7atb9tlelob";
freezeTemplate(tmpl$1c);

const $fragment1$1b = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M424 387H35c-8 0-15 7-15 15v1c0 26 21 47 47 47h326c26 0 47-21 47-48v-1c-1-7-8-14-16-14M408 70H36c-7 0-14 7-14 16-2 21-2 59 1 82 10 74 49 136 102 169 2 2 5 2 8 2h162l8-2c30-19 57-48 74-82 9 3 19 5 30 5 51 0 93-43 93-95s-41-95-92-95m0 142l-12-2q12-37 12-81v-13c26 0 47 21 47 48s-22 48-47 48"${3}/></g></svg>`;
function tmpl$1b($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1b, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom65 = registerTemplate(tmpl$1b);
tmpl$1b.stylesheets = [];
tmpl$1b.stylesheetToken = "lwc-749an7fjbc6";
freezeTemplate(tmpl$1b);

const $fragment1$1a = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M486 303L370 186a47 47 0 00-66 0L186 303a47 47 0 000 66l117 117c18 18 48 18 66 0l117-117c19-17 19-48 0-66m-220 53a27 27 0 01-39 0 27 27 0 010-39c11-11 29-11 39 0s10 28 0 39m90 91a27 27 0 01-39 0 27 27 0 010-39c11-11 29-11 39 0 10 10 10 28 0 39m0-181a27 27 0 01-39 0 27 27 0 010-39c11-11 29-11 39 0 10 10 10 28 0 39m90 90a27 27 0 01-39 0 27 27 0 010-39c11-11 29-11 39 0 12 11 12 28 0 39M284 128V68c0-26-22-48-48-48H68c-26 0-48 22-48 48v168c0 26 22 48 48 48h60c5 0 10-2 13-6l9-10 118-118 10-9c4-3 6-8 6-13M88 244c-15 0-28-13-28-28s13-28 28-28 28 13 28 28-13 28-28 28m64-64c-15 0-28-13-28-28s13-28 28-28 28 13 28 28-13 28-28 28m64-64c-15 0-28-13-28-28s13-28 28-28 28 13 28 28-13 28-28 28"${3}/></g></svg>`;
function tmpl$1a($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1a, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom66 = registerTemplate(tmpl$1a);
tmpl$1a.stylesheets = [];
tmpl$1a.stylesheetToken = "lwc-3aoafp6st2q";
freezeTemplate(tmpl$1a);

const $fragment1$19 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M292 284l-10-17c-4-6-10-10-18-10l-7 2-28 10c-11-10-23-16-37-21l-5-29c-2-10-10-15-20-15h-20c-10 0-18 6-20 16l-5 28c-13 5-25 12-37 22l-28-10-7-2c-7 0-14 4-18 10l-10 17c-5 9-3 19 5 26l24 19c-2 7-2 14-2 21l2 22-23 19c-8 6-10 18-5 26l10 17c4 6 10 10 18 10l7-2 28-10c11 10 23 17 37 21l5 30c2 10 10 17 20 17h20c10 0 18-7 20-17l5-30c14-5 27-13 39-22l26 10 7 2c7 0 14-4 18-10l10-16c5-9 3-20-5-26l-23-19c2-7 2-14 2-21l-2-22 23-19c6-8 8-19 4-27M157 406c-30 0-55-24-55-55s24-55 55-55c30 0 55 24 55 55s-26 55-55 55m337-235l-18-15 2-17-2-17 18-15c6-5 8-14 4-21l-8-14c-3-5-9-8-14-8l-6 1-23 9c-9-8-19-14-30-17l-4-24c-2-8-8-13-16-13h-16c-8 0-15 5-16 13l-4 23q-16 6-30 18l-23-10-6-1c-6 0-11 3-14 8l-8 13c-4 7-2 16 4 21l18 15-2 17 2 17-18 15c-6 5-8 14-4 21l8 14c3 5 9 8 14 8l6-1 23-9c9 8 19 14 30 17l4 23c2 8 8 14 16 14h16c8 0 15-6 16-14l4-24c11-4 22-10 31-18l22 9 6 1c6 0 11-3 14-8l8-13c4-4 2-12-4-18m-105 13c-24 0-44-20-44-44s20-44 44-44 44 20 44 44-19 44-44 44"${3}/></g></svg>`;
function tmpl$19($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$19, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom67 = registerTemplate(tmpl$19);
tmpl$19.stylesheets = [];
tmpl$19.stylesheetToken = "lwc-20q8jranu74";
freezeTemplate(tmpl$19);

const $fragment1$18 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M260 20C128 20 20 128 20 260s108 240 240 240 240-108 240-240S392 20 260 20m190 216h-63c-2-57-15-106-34-144 53 30 89 82 97 144M236 78v158h-55c4-75 28-134 55-158m0 206v158c-27-23-51-82-55-158zm48 158V284h55c-4 75-28 134-55 158m0-206V78c27 23 51 82 55 158zM167 92c-19 38-31 87-34 144H70c8-62 44-114 97-144M70 284h63c2 57 15 106 34 144-53-30-89-82-97-144m283 144c19-38 31-87 34-144h63c-8 62-44 114-97 144"${3}/></g></svg>`;
function tmpl$18($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$18, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom68 = registerTemplate(tmpl$18);
tmpl$18.stylesheets = [];
tmpl$18.stylesheetToken = "lwc-1ielbtcsvc8";
freezeTemplate(tmpl$18);

const $fragment1$17 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M281 221c-46-34-92-18-122 11-11 10-29 17-48 22-22 7-46 14-62 31-46 45-37 98 25 160l1 1 1 1c37 36 70 54 101 54 22 0 42-9 62-27 17-16 25-39 32-61 6-18 13-37 23-47 18-18 29-38 31-59 2-15-2-37-19-59 0-2-10-15-25-27m-99 193c-4 4-10 6-16 6s-11-2-15-6l-45-44c-9-9-9-22 0-31s22-9 31 0l44 44c9 9 9 22 1 31m38-65c-22 0-40-18-40-40s18-40 40-40 40 18 40 40-18 40-40 40M495 62l-37-37c-6-6-18-6-25 0l-41 41c-6 6-6 18 0 25l2 2-82 83c-3 3-3 9 0 12l23 22c3 3 8 3 11 0l82-82 2 2c6 6 18 6 25 0l41-41c6-9 6-20-1-27"${3}/></g></svg>`;
function tmpl$17($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$17, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom69 = registerTemplate(tmpl$17);
tmpl$17.stylesheets = [];
tmpl$17.stylesheetToken = "lwc-56rkqoh8ilj";
freezeTemplate(tmpl$17);

const $fragment1$16 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M71 500c-28 0-51-23-51-51V71c0-28 23-51 51-51h377c29 0 52 23 52 51v377c0 28-23 51-51 51H71z"${3}/></g></svg>`;
function tmpl$16($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$16, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom7 = registerTemplate(tmpl$16);
tmpl$16.stylesheets = [];
tmpl$16.stylesheetToken = "lwc-6k3l9gkdm7h";
freezeTemplate(tmpl$16);

const $fragment1$15 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M244 370l-92-91a51 51 0 00-69 0l-58 57c-6 6-6 17 0 22l11 12 11 11 93 91 6 6 18 17c6 6 17 6 23 0l58-57c18-18 18-49-1-68M94 336l12-11c6-6 16-6 22 0l70 68c6 6 6 17 0 22l-12 11c-6 6-16 6-22 0l-70-68c-7-6-7-16 0-22m100-83l75 73c2 2 3 2 6 2l34-1c4 0 7-3 7-7l1-30c0-4 3-7 7-7l30-1c4 0 7-3 7-7l1-30c0-4 3-7 7-7l30-1c4 0 7-3 7-7l1-30c0-4 3-7 7-7l30-1c4 0 7-3 7-7l1-30c0-4 3-6 6-7l33-5c6-1 9-7 6-12L428 27c-6-8-17-9-24-2L193 233c-5 5-5 14 1 20"${3}/></g></svg>`;
function tmpl$15($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$15, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom70 = registerTemplate(tmpl$15);
tmpl$15.stylesheets = [];
tmpl$15.stylesheetToken = "lwc-52id1rjcbg0";
freezeTemplate(tmpl$15);

const $fragment1$14 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M430 109A241 241 0 0020 280v74c0 26 22 47 48 47h32v38c0 20 15 38 36 41 24 2 44-16 44-39V301c0-20-15-38-36-41-24-2-44 16-44 39v55H84c-9 0-16-7-16-16v-58c0-104 84-190 186-193 53-2 102 17 139 53 38 36 58 84 58 135v63c0 9-7 16-16 16h-15v-53c0-20-15-38-36-41-24-2-44 16-44 39v140c0 20 15 38 36 41 24 2 44-16 44-39v-39h32c26 0 48-21 48-47v-75c0-63-24-125-70-171"${3}/></g></svg>`;
function tmpl$14($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$14, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom71 = registerTemplate(tmpl$14);
tmpl$14.stylesheets = [];
tmpl$14.stylesheetToken = "lwc-3eq5r2esd1c";
freezeTemplate(tmpl$14);

const $fragment1$13 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M476 20H44c-14 0-24 10-24 24s10 24 24 24h192v50c-86 11-152 84-152 173v55c0 58 46 106 106 106h142c58 0 105-47 105-106v-56c0-89-66-162-152-174V68h192c14 0 24-10 24-24s-11-24-25-24M372 290c0 23-18 42-42 42H190c-23 0-41-18-42-42v1-1 1c1-62 50-111 110-111h3c61 0 110 50 111 110"${3}/><circle cx="68" cy="468" r="32"${3}/><circle cx="452" cy="468" r="32"${3}/></g></svg>`;
function tmpl$13($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$13, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom72 = registerTemplate(tmpl$13);
tmpl$13.stylesheets = [];
tmpl$13.stylesheetToken = "lwc-15nbncq8gu5";
freezeTemplate(tmpl$13);

const $fragment1$12 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M48 140h424c10 0 18-10 15-20-10-33-24-63-43-90-6-8-17-9-23-2-19 18-46 28-74 28-30 0-57-12-77-32-6-6-16-6-22 0a110 110 0 01-151 4c-6-6-16-5-22 3-19 26-34 57-43 90-2 9 6 19 16 19m452 64c0-9-7-16-16-16H36c-9 0-16 7-16 16v3c0 150 104 274 240 293a289 289 0 00240-292z"${3}/></g></svg>`;
function tmpl$12($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$12, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom73 = registerTemplate(tmpl$12);
tmpl$12.stylesheets = [];
tmpl$12.stylesheetToken = "lwc-156odaahpf";
freezeTemplate(tmpl$12);

const $fragment1$11 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M301 444h-82c-9 0-16 7-16 16v24c0 9 7 16 16 16h82c9 0 16-7 16-16v-24c0-9-7-16-16-16M260 20C160 20 80 95 80 188c0 60 34 113 85 142 20 11 33 30 37 52 2 7 8 13 16 13h85c8 0 15-6 16-13 4-22 17-41 37-52 50-30 83-82 83-142 1-93-79-168-179-168m-56 75c-16 30-25 66-26 95 0 30 6 58 16 86 3 7-4 14-11 10-75-38-70-176 11-203 7-1 14 6 10 12m63 191c-2 6-12 6-15 0-13-31-16-68-17-102 1-34 4-70 17-102 2-6 12-6 15 0 13 31 16 68 17 102 0 34-4 70-17 102m67 1c-7 3-14-3-11-10 11-29 16-61 17-91-1-26-10-61-26-90-3-6 3-14 10-11 81 26 86 165 10 202"${3}/></g></svg>`;
function tmpl$11($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$11, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom74 = registerTemplate(tmpl$11);
tmpl$11.stylesheets = [];
tmpl$11.stylesheetToken = "lwc-3q81n7rl9rf";
freezeTemplate(tmpl$11);

const $fragment1$10 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M260 20c-14 0-24 10-24 24v432c0 14 10 24 24 24 132 0 240-108 240-240S392 20 260 20m190 216h-63c-2-57-15-106-34-144 53 30 89 82 97 144M284 442V284h55c-4 75-28 134-55 158m0-206V78c27 23 51 82 55 158zm69 192c19-38 31-87 34-144h63c-8 62-44 114-97 144M128 179c6 5 16 4 22-2l44-50c6-6 6-16-1-22l-44-44c-6-6-14-6-20-2l-9 6a239 239 0 000 390l9 6c6 4 14 3 20-2l44-44c6-6 6-16 1-22l-44-50c-6-6-15-7-22-2l-17 13a178 178 0 010-188z"${3}/></g></svg>`;
function tmpl$10($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$10, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom75 = registerTemplate(tmpl$10);
tmpl$10.stylesheets = [];
tmpl$10.stylesheetToken = "lwc-38qlf1qisi9";
freezeTemplate(tmpl$10);

const $fragment1$$ = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M259 304c-2-6-9-11-16-10h-7c-90 0-163-72-163-161v-4c0-8-11-11-15-5a113 113 0 0086 173l6 15 4 5 24 10c4 2 6 6 4 10l-8 23c-2 4 1 8 4 10l13 6c4 2 6 6 4 10l-7 25c-1 4 1 8 4 10l19 8c4 2 6 6 4 10l-7 25c-1 4 1 8 5 10l55 25c4 2 9 0 11-4l24-54c2-4 2-8 1-12zm216-8L345 162c6-20 6-42-2-65-15-43-55-74-102-77-70-3-127 56-120 126a113 113 0 00150 93l11 12c2 2 3 2 6 2h28c5 0 8 3 8 8l2 25c0 4 4 7 8 7h16c5 0 8 3 8 8l4 26c1 4 4 6 8 6h20c5 0 8 3 8 8l4 26c1 4 4 6 8 6h61c5 0 8-3 8-8v-59c1-4-1-8-4-10M219 156c-23 0-41-18-41-40s18-40 41-40 41 18 41 40-18 40-41 40"${3}/></g></svg>`;
function tmpl$$($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$$, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom76 = registerTemplate(tmpl$$);
tmpl$$.stylesheets = [];
tmpl$$.stylesheetToken = "lwc-3r2j82qj9fr";
freezeTemplate(tmpl$$);

const $fragment1$_ = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M115 196h31c5 0 8-3 8-8v-12c0-61 45-108 102-108s102 47 102 108v12c0 5 3 8 8 8h31c5 0 8-3 8-8v-12c0-87-65-156-149-156S107 89 107 176v12c0 5 3 8 8 8m298 48H107c-26 0-47 22-47 48v160c0 26 21 48 47 48h306c26 0 47-22 47-48V292c0-26-21-48-47-48M298 373c-7 11-11 24-8 37l5 24c2 9-5 18-14 18h-50c-9 0-16-10-14-18l5-25c3-13-1-26-8-36s-10-23-8-36c4-19 20-34 39-38 32-6 60 18 60 47 0 10-3 19-7 27"${3}/></g></svg>`;
function tmpl$_($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$_, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom77 = registerTemplate(tmpl$_);
tmpl$_.stylesheets = [];
tmpl$_.stylesheetToken = "lwc-4fdrqm3p16e";
freezeTemplate(tmpl$_);

const $fragment1$Z = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M486 95L342 23c-6-3-14-3-22 0L188 89 54 23c-7-4-16-4-23 0-7 5-11 13-11 21v360c0 9 5 18 14 22l144 72c6 3 14 3 22 0l133-66 134 66c3 2 7 2 10 2l13-3c7-5 11-13 11-21V116c-1-9-6-17-15-21m-34 46v190c0 11-11 19-22 15-37-14-8-76-34-110-25-31-58 1-88-48-30-47 10-81 46-99 5-2 10-2 14 0l74 38c7 2 10 8 10 14M248 419c-6 3-13 2-18-2-10-9-18-23-18-37 0-24-40-16-40-64 0-38-47-50-86-46-10 1-18-6-18-16V109c0-12 13-20 23-14l86 43 2 1 3 2c36 21 29 38 14 64-17 29-24 0-48-8s-48 8-40 24 32 0 48 16 16 40 64 24 56-8 72 8 24 48 0 72c-14 14-20 43-26 64-2 4-4 8-8 10z"${3}/></g></svg>`;
function tmpl$Z($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$Z, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom78 = registerTemplate(tmpl$Z);
tmpl$Z.stylesheets = [];
tmpl$Z.stylesheetToken = "lwc-50mohh50tif";
freezeTemplate(tmpl$Z);

const $fragment1$Y = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M178 193c-29 0-52 23-52 52s23 52 52 52 52-23 52-52-23-52-52-52m300 163H335v-59h15c8 0 15-7 15-15v-44c0-8-7-15-15-15h-17c-12-74-75-131-153-133-89-1-161 70-160 157 2 86 74 153 161 153h274v15c0 8 7 15 15 15h15c8 0 15-7 15-15v-37c0-12-10-22-22-22m-300-15c-54 0-97-43-97-96s43-96 97-96 97 43 97 96-43 96-97 96"${3}/></g></svg>`;
function tmpl$Y($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$Y, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom79 = registerTemplate(tmpl$Y);
tmpl$Y.stylesheets = [];
tmpl$Y.stylesheetToken = "lwc-21he83c3v7t";
freezeTemplate(tmpl$Y);

const $fragment1$X = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M237 30L48 238a32 32 0 000 43l189 209c13 14 34 14 46 0l189-208c11-12 11-31 0-43L283 30a32 32 0 00-46 0"${3}/></g></svg>`;
function tmpl$X($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$X, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom8 = registerTemplate(tmpl$X);
tmpl$X.stylesheets = [];
tmpl$X.stylesheetToken = "lwc-3emkqh3p4n4";
freezeTemplate(tmpl$X);

const $fragment1$W = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M97 337a76.5 76.5 0 100 153c42 0 77-34 77-77s-34-76-77-76m0 107c-17 0-31-14-31-31s14-31 31-31 31 14 31 31-14 31-31 31m326-107c-43 0-77 34-77 77s34 76 77 76a76.5 76.5 0 100-153m0 107c-17 0-31-14-31-31s14-31 31-31 31 14 31 31-14 31-31 31m-5-153c17-1 33 2 49 8 8 3 16-1 20-8 39-74-24-109-64-129-11-5-23 2-23 14v44c0 9-6 18-15 17-57-9-108-69-170-69s-70 61-70 61c-43 0-86-3-105-8-11-1-20 6-20 16 0 0 0 54 77 54 63 0 116 46 123 109 2 17 0 34-5 48-2 5 2 11 9 11h71c6 0 10-5 9-11-5-15-6-30-5-46 6-60 57-109 119-111M224 118c1 6 5 11 11 13l82 28c8 2 15-1 19-8l7-13c3-5-1-11-6-12-24-2-74-11-60-38 13-23 40-17 58-9 7 3 14-5 11-11a67 67 0 00-67-37c-36 4-62 39-57 75z"${3}/></g></svg>`;
function tmpl$W($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$W, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom80 = registerTemplate(tmpl$W);
tmpl$W.stylesheets = [];
tmpl$W.stylesheetToken = "lwc-7a18crslp71";
freezeTemplate(tmpl$W);

const $fragment1$V = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M475 20l-39 1c-123 6-265 37-272 39-10 3-16 13-16 22v262c-8-3-21-5-32-5-53 0-96 36-96 80s43 80 96 80 96-36 96-80V256c0-7 5-14 12-15 39-10 94-20 195-26 10-1 17 6 17 16v83c-8-3-21-5-32-5-53 0-96 36-96 80s43 80 96 80 96-36 96-80V44c0-14-11-25-25-24m-54 127c-98 6-147 15-190 25-10 2-19-6-19-16v-25c0-7 5-14 13-16 42-10 92-20 194-26 10-1 17 6 17 16v25c0 10-6 17-15 17"${3}/></g></svg>`;
function tmpl$V($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$V, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom81 = registerTemplate(tmpl$V);
tmpl$V.stylesheets = [];
tmpl$V.stylesheetToken = "lwc-4op5cami01c";
freezeTemplate(tmpl$V);

const $fragment1$U = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M485 215H327c-8 0-15 7-15 15v7c0 12-10 22-23 22-12 0-23-10-23-22v-7c0-8-7-15-15-15h-38 1c-44 2-83 28-104 64-8-3-16-4-24-4-38 0-68 30-68 67s32 68 70 68c8 0 17-1 24-4 21 37 60 62 104 64 73 4 134-55 134-128 0-4 0-9-1-13-1-7 5-15 12-16l127-28c7-1 12-7 12-15v-40c0-8-7-15-15-15M87 365c-13 0-23-10-23-22s10-22 23-22c3 0 7 1 9 2-2 9-2 19-2 28 0 5 1 8 2 12-3 1-6 2-9 2m203-203c13 0 23-10 23-22V72c-1-12-11-22-23-22-13 0-23 10-23 22v68c0 13 10 22 23 22m-108 8c5 5 11 7 17 7 5 0 11-1 15-5 10-8 11-22 2-31l-45-52c-8-10-23-10-32-2-10 8-11 22-2 31zm198 7c6 0 13-3 17-7l45-52c8-10 7-24-2-31-10-8-24-7-32 2l-45 52c-8 10-7 24 2 31 4 4 10 5 15 5"${3}/></g></svg>`;
function tmpl$U($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$U, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom82 = registerTemplate(tmpl$U);
tmpl$U.stylesheets = [];
tmpl$U.stylesheetToken = "lwc-301fj7595su";
freezeTemplate(tmpl$U);

const $fragment1$T = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M457 174c3 3 8 3 11 0l11-11c27-27 28-69 2-95l-35-35c-27-22-65-12-86 10l-11 11c-3 3-3 8 0 11zM313 98c-3-3-8-3-11 0L82 317c-12 12-21 26-26 43L21 468c-2 6-2 14 2 20 5 8 13 12 21 12l7-1 110-34c16-5 30-14 42-26l219-219c3-3 3-8 0-11zM146 419l-66 21 21-66c2-9 7-16 14-22l54 54c-7 6-15 11-23 13"${3}/></g></svg>`;
function tmpl$T($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$T, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom83 = registerTemplate(tmpl$T);
tmpl$T.stylesheets = [];
tmpl$T.stylesheetToken = "lwc-38kmioj83uf";
freezeTemplate(tmpl$T);

const $fragment1$S = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M456 372H64c-13 0-24 10-24 24s10 24 24 24h31l13 68c2 7 8 12 15 12h258c7 0 13-5 15-12l13-68h47c13 0 24-10 24-24s-10-24-24-24m-330-48h110v-45c-9-6-16-16-16-27 0-18 14-32 31-32s31 14 31 32c0 12-6 22-16 27v45h110c9 0 16-7 16-16v-24c0-49-46-66-82-81-24-10-28-20-28-30s7-20 15-27c14-13 23-31 23-53 0-39-25-74-69-74s-69 34-69 74c0 22 8 39 23 53 8 7 15 17 15 27s-4 19-28 30c-36 15-82 34-82 81v24c1 9 8 16 16 16"${3}/></g></svg>`;
function tmpl$S($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$S, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom84 = registerTemplate(tmpl$S);
tmpl$S.stylesheets = [];
tmpl$S.stylesheetToken = "lwc-5go4nnrrlr0";
freezeTemplate(tmpl$S);

const $fragment1$R = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M484 52H84V36c0-9-7-16-16-16H36c-9 0-16 7-16 16v448c0 9 7 16 16 16h32c9 0 16-7 16-16V116h400c9 0 16-7 16-16V68c0-9-7-16-16-16m-32 112H180c-26 0-48 22-48 48v176c0 26 22 48 48 48h272c26 0 48-22 48-48V212c0-26-22-48-48-48m-44 136h-20v80c0 5-3 8-8 8h-32c-5 0-8-3-8-8v-48c0-5-3-8-8-8h-32c-5 0-8 3-8 8v48c0 5-3 8-8 8h-32c-5 0-8-3-8-8v-80h-20c-4 0-6-5-2-7l90-87c3-2 7-2 10 0l90 87c2 2 0 7-4 7"${3}/></g></svg>`;
function tmpl$R($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$R, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom85 = registerTemplate(tmpl$R);
tmpl$R.stylesheets = [];
tmpl$R.stylesheetToken = "lwc-7dd87ucm31f";
freezeTemplate(tmpl$R);

const $fragment1$Q = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M164 100h32c5 0 8-3 8-8V68h112v24c0 5 3 8 8 8h32c5 0 8-3 8-8V68c0-26-22-48-48-48H204c-26 0-48 22-48 48v24c0 5 3 8 8 8m288 48H68c-26 0-48 22-48 48v256c0 26 22 48 48 48h384c26 0 48-22 48-48V196c0-26-22-48-48-48M260 436a112 112 0 110-224 112 112 0 010 224m48-136h-24v-24c0-9-7-16-16-16h-16c-9 0-16 7-16 16v24h-24c-9 0-16 7-16 16v16c0 9 7 16 16 16h24v24c0 9 7 16 16 16h16c9 0 16-7 16-16v-24h24c9 0 16-7 16-16v-16c0-9-7-16-16-16"${3}/></g></svg>`;
function tmpl$Q($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$Q, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom86 = registerTemplate(tmpl$Q);
tmpl$Q.stylesheets = [];
tmpl$Q.stylesheetToken = "lwc-7dp7u6o7su3";
freezeTemplate(tmpl$Q);

const $fragment1$P = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M456 20H64c-14 0-24 10-24 24v384c0 14 10 24 24 24h8v24c0 14 10 24 24 24h16c13 0 24-10 24-24v-24h251v24c0 14 10 24 24 24h16c13 0 24-10 24-24v-24h8c13 0 24-10 24-24V44c-3-14-13-24-27-24M111 404c-13 0-24-10-24-24V92c0-14 10-24 24-24h299c13 0 24 10 24 24v288c0 14-10 24-24 24zm259-288H150c-9 0-16 7-16 16v208c0 9 7 16 16 16h220c9 0 16-7 16-16V132c0-9-7-16-16-16m-37 144h-65c-9 16-27 32-49 32-30 0-53-26-53-56s24-56 53-56c22 0 41 16 49 32h64c12 0 21 12 21 24 1 12-8 24-20 24"${3}/></g></svg>`;
function tmpl$P($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$P, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom87 = registerTemplate(tmpl$P);
tmpl$P.stylesheets = [];
tmpl$P.stylesheetToken = "lwc-5u4t6o7p5c4";
freezeTemplate(tmpl$P);

const $fragment1$O = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M485 420H35c-8 0-15 6-15 14v1c0 36 45 65 80 65h320c35 0 80-29 80-65v-1c0-8-7-14-15-14M44 372h144c9 0 16-9 16-18V79c0-4-6-6-7-2L37 359c-3 6 1 13 7 13m224 0h200c10 0 17-9 16-18-7-58-17-237-221-333-5-2-11 1-11 7v326c0 9 7 18 16 18"${3}/></g></svg>`;
function tmpl$O($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$O, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom88 = registerTemplate(tmpl$O);
tmpl$O.stylesheets = [];
tmpl$O.stylesheetToken = "lwc-2d4vmf7lpg8";
freezeTemplate(tmpl$O);

const $fragment1$N = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M323 207c-3-4-10-3-12 2-10 14-19 34-19 59v88c0 13-10 24-24 24-13 0-24-10-24-24V83c0-61-54-71-93-56-10 3-20 10-27 18-5 6-10 10-18 13-14 3-39-10-52-18-7-4-17-2-21 4L23 58c-6 7-3 18 4 23 15 10 39 25 58 28 28 5 54-4 74-23l-1 1c6-5 15-13 22-4 16 24-48 129-48 281v13c0 65 66 121 130 124 69 3 126-52 126-120 0-34 13-57 26-70 3-3 3-8 0-11zm153 76c-6 0-12-2-17-7L331 149c-10-10-10-25 0-34 10-10 25-10 34 0l128 128c10 10 10 25 0 34-5 4-11 6-17 6"${3}/></g></svg>`;
function tmpl$N($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$N, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom89 = registerTemplate(tmpl$N);
tmpl$N.stylesheets = [];
tmpl$N.stylesheetToken = "lwc-560vag7bm53";
freezeTemplate(tmpl$N);

const $fragment1$M = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M495 173C472 78 372 20 262 20 128 20 20 127 20 260s108 240 242 240c186 0 171-94 112-131-35-22-54-73-19-109 65-67 170 40 140-87M130 340c-28 0-50-22-50-50s22-50 50-50 50 22 50 50-22 50-50 50m10-190c0-28 22-50 50-50s50 22 50 50-22 50-50 50-50-22-50-50m110 290c-28 0-50-22-50-50s22-50 50-50 50 22 50 50-22 50-50 50m90-260c-28 0-50-22-50-50s22-50 50-50 50 22 50 50-22 50-50 50"${3}/></g></svg>`;
function tmpl$M($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$M, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom9 = registerTemplate(tmpl$M);
tmpl$M.stylesheets = [];
tmpl$M.stylesheetToken = "lwc-6hbivmnl2c";
freezeTemplate(tmpl$M);

const $fragment1$L = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M479 69L284 97v275c0 5-3 8-8 8h-32c-5 0-8-3-8-8V105L48 133h-3c-12 0-22-9-24-21-2-13 7-26 19-27l149-22a79 79 0 01126-19l157-22c13-2 26 7 27 20 2 12-6 24-20 27M191 363c6-7 7-16 3-25l-64-151c-3-9-12-14-22-14s-18 5-22 14L22 339c-3 7-2 15 2 22 2 2 33 50 83 50 29 0 58-16 84-48m-83-105l34 82H74zm326-119c-4-9-13-14-22-14-10 0-18 6-22 14l-64 152c-3 7-2 15 2 22 2 2 33 50 83 50q45 0 84-48c6-7 7-16 3-25zm-22 71l34 82h-69zM260 428c-45 0-90 16-122 43-3 3-6 7-6 12v1c0 9 7 16 16 16h224c9 0 16-7 16-16v-1q0-7-6-12c-32-27-77-43-122-43"${3}/></g></svg>`;
function tmpl$L($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$L, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom90 = registerTemplate(tmpl$L);
tmpl$L.stylesheets = [];
tmpl$L.stylesheetToken = "lwc-1vmel6rq9lc";
freezeTemplate(tmpl$L);

const $fragment1$K = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M483 121c-24-7-45-24-59-46-10-17-11-55-37-55H133c-26 0-26 38-37 55-17 26-38 33-64 48s-2 79 4 102c25 89 72 171 146 230 21 17 43 31 67 43 22 11 58-20 74-32 42-30 76-67 103-110 23-37 41-77 54-118 5-17 10-34 13-51 3-14 10-37 6-51-2-7-9-13-16-15-37-11 11 3 0 0m-35 56a400 400 0 01-175 266l-13 7-13-8A389 389 0 0172 176l-2-16 14-9c25-15 48-42 62-70l6-14h216l4 10c14 30 38 59 68 76l10 6v1zm-196-61c-18 0-63 0-72 8-15 14-24 34-40 47-17 14-9 29-3 48a357 357 0 0083 138c4 4 41 41 41 18V132c-1-9-1-16-9-16"${3}/></g></svg>`;
function tmpl$K($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$K, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom91 = registerTemplate(tmpl$K);
tmpl$K.stylesheets = [];
tmpl$K.stylesheetToken = "lwc-7rmdoog4m2g";
freezeTemplate(tmpl$K);

const $fragment1$J = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M450 311l-182-83c-5-2-10-2-14 0L70 311c-10 5-14 17-7 26 19 27 31 62 36 78 2 6 7 10 13 12 63 15 115 51 137 68 6 5 15 5 22 0 22-17 74-53 137-68 6-2 11-6 13-12 5-17 17-52 36-78 6-8 3-21-7-26m-238 45c-14 0-24-14-24-32s10-32 24-32 24 14 24 32-10 32-24 32m96 0c-14 0-24-14-24-32s10-32 24-32 24 14 24 32-10 32-24 32M135 229l98-45a62 62 0 0155 1l97 45c6 2 11-2 11-7v-36c0-4-2-8-5-11-6-7-19-19-43-19v-47c0-6-3-11-8-14-9-5-24-12-48-16V36c0-9-7-16-16-16h-32c-9 0-16 7-16 16v43c-24 4-39 11-48 16-5 2-8 8-8 14v47c-24 0-37 12-43 18-3 3-5 7-5 11v36c0 6 6 10 11 8"${3}/></g></svg>`;
function tmpl$J($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$J, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom92 = registerTemplate(tmpl$J);
tmpl$J.stylesheets = [];
tmpl$J.stylesheetToken = "lwc-3gmau0uep5b";
freezeTemplate(tmpl$J);

const $fragment1$I = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M201 260h239c7 0 14-5 15-12l44-149c3-10-5-20-15-20H115l-6-22c-4-10-14-17-24-17H46c-13 0-25 9-26 22s11 25 24 25h23l76 250a24 24 0 0023 17h282c13 0 25-9 26-22s-11-25-24-25H202c-11 0-20-7-23-16v-1c-5-15 7-30 22-30"${3}/><ellipse cx="206" cy="441" rx="40" ry="39"${3}/><ellipse cx="401" cy="441" rx="40" ry="39"${3}/></g></svg>`;
function tmpl$I($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$I, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom93 = registerTemplate(tmpl$I);
tmpl$I.stylesheets = [];
tmpl$I.stylesheetToken = "lwc-2b28o1u5mh5";
freezeTemplate(tmpl$I);

const $fragment1$H = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M308 164V44c0-14-10-24-24-24h-32c-14 0-24 10-24 24s10 24 24 24h8v96a96 96 0 01-192 0V68h8c14 0 24-10 24-24S90 20 76 20H44c-14 0-24 10-24 24v120c0 79 65 144 144 144s144-65 144-144m192 96c0-40-32-72-72-72s-72 32-72 72c0 31 20 58 48 68v18c0 58-48 106-106 106h-2c-50 0-93-36-104-83-2-7-8-13-16-13h-16c-10 0-18 10-16 19 13 71 76 125 150 125h2c86 0 155-70 155-154v-18c29-10 49-37 49-68m-72 24c-14 0-24-10-24-24s10-24 24-24 24 10 24 24-10 24-24 24"${3}/></g></svg>`;
function tmpl$H($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$H, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom94 = registerTemplate(tmpl$H);
tmpl$H.stylesheets = [];
tmpl$H.stylesheetToken = "lwc-7o0ivmvr201";
freezeTemplate(tmpl$H);

const $fragment1$G = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M284 102V68h8c13 0 24-10 24-24 0-13-10-24-24-24h-64c-13 0-24 10-24 24 0 13 10 24 24 24h8v34c-99 12-176 96-176 198 0 110 90 200 200 200s200-90 200-200c0-102-77-186-176-198m-24 350c-84 0-152-68-152-152s68-152 152-152 152 68 152 152-68 152-152 152m53-234l-37 37c-5-2-10-3-16-3-26 0-48 22-48 48s22 48 48 48 48-22 48-48c0-6-1-11-3-16l37-37c8-8 8-21 0-29s-21-8-29 0"${3}/></g></svg>`;
function tmpl$G($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$G, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom95 = registerTemplate(tmpl$G);
tmpl$G.stylesheets = [];
tmpl$G.stylesheetToken = "lwc-5n0pae2umm3";
freezeTemplate(tmpl$G);

const $fragment1$F = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M495 90l-42-31c-6-4-12-6-19-6H292V36c0-9-7-16-16-16h-32c-9 0-16 7-16 16v16H68c-9 0-16 7-16 16v64c0 9 7 16 16 16h366c7 0 14-2 19-6l42-31c7-6 7-16 0-21m-43 138H292v-24c0-5-3-8-8-8h-48c-5 0-8 3-8 8v24H86c-7 0-14 2-19 6l-42 31c-7 5-7 15 0 21l42 31c6 4 12 6 19 6h366c9 0 16-7 16-16v-64c0-8-7-15-16-15M292 433v-53c0-5-3-8-8-8h-48c-5 0-8 3-8 8v53c-32 9-50 28-55 52-2 7 4 15 12 15h151c8 0 14-7 12-15-6-24-24-43-56-52"${3}/></g></svg>`;
function tmpl$F($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$F, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom96 = registerTemplate(tmpl$F);
tmpl$F.stylesheets = [];
tmpl$F.stylesheetToken = "lwc-1lihrtj3meh";
freezeTemplate(tmpl$F);

const $fragment1$E = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M342 293V103c0-47-36-83-82-83h-1c-46 0-82 37-82 83v190a120 120 0 0083 207c66 0 120-54 120-120 0-34-13-64-38-87m-19 87H197c-7 0-12-7-11-14 3-18 13-34 27-45 5-5 9-11 9-18V103c0-22 16-38 37-38h1c21 0 37 17 37 38v7h-22c-13 0-22 10-22 22s10 22 22 22h22v30h-22c-13 0-22 10-22 22s10 22 22 22h22v30h-22c-13 0-22 10-22 22s10 22 22 22h22c1 7 4 12 9 17 14 11 24 28 27 45 2 9-3 16-10 16"${3}/></g></svg>`;
function tmpl$E($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$E, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom97 = registerTemplate(tmpl$E);
tmpl$E.stylesheets = [];
tmpl$E.stylesheetToken = "lwc-2b83825vgmn";
freezeTemplate(tmpl$E);

const $fragment1$D = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M496 221l-59-59c-3-3-7-5-10-5h-61c-8 0-15 7-15 15v121c0 5 5 9 11 7 10-5 22-7 34-7a90 90 0 0179 47c2 4 8 5 11 2 9-8 15-20 15-34v-77c-1-3-2-7-5-10M350 385a45 45 0 1190 0 45 45 0 01-90 0M290 90H35c-8 0-15 7-15 15v204c0 14 6 26 15 34 4 3 9 2 11-2a90 90 0 01162 9c1 3 4 5 7 5h45a45 45 0 0045-45V105c0-8-7-15-15-15M80 385a45 45 0 1190 0 45 45 0 01-90 0"${3}/></g></svg>`;
function tmpl$D($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$D, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom98 = registerTemplate(tmpl$D);
tmpl$D.stylesheets = [];
tmpl$D.stylesheetToken = "lwc-3c6n47ee85d";
freezeTemplate(tmpl$D);

const $fragment1$C = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M452 166H318c-4-9-10-17-17-24l50-64c8-10 6-25-4-33s-26-6-34 4l-55 71-14-1-13 1-56-71c-8-10-23-12-34-4s-11 23-3 33l50 64c-7 7-13 15-17 24H68c-26 0-48 21-48 47v220c0 26 22 47 48 47h384c26 0 48-21 48-47V213c0-26-22-47-48-47m-64 251c0 9-7 16-16 16H84c-9 0-16-7-16-16V229c0-9 7-16 16-16h288c9 0 16 7 16 16zm56-78c-14 0-24-10-24-24s10-24 24-24 24 10 24 24-10 24-24 24m0-79c-14 0-24-10-24-23s10-24 24-24 24 10 24 24c0 13-10 23-24 23"${3}/></g></svg>`;
function tmpl$C($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$C, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_custom99 = registerTemplate(tmpl$C);
tmpl$C.stylesheets = [];
tmpl$C.stylesheetToken = "lwc-5oibekpqrl3";
freezeTemplate(tmpl$C);

const $fragment1$B = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M465 200H55c-8 0-15 7-15 15v245c0 22 18 40 40 40h360c22 0 40-18 40-40V215c0-8-7-15-15-15M190 420c0 6-4 10-10 10h-40c-6 0-10-4-10-10v-40c0-6 4-10 10-10h40c6 0 10 4 10 10zm0-100c0 6-4 10-10 10h-40c-6 0-10-4-10-10v-40c0-6 4-10 10-10h40c6 0 10 4 10 10zm100 100c0 6-4 10-10 10h-40c-6 0-10-4-10-10v-40c0-6 4-10 10-10h40c6 0 10 4 10 10zm0-100c0 6-4 10-10 10h-40c-6 0-10-4-10-10v-40c0-6 4-10 10-10h40c6 0 10 4 10 10zm100 100c0 6-4 10-10 10h-40c-6 0-10-4-10-10v-40c0-6 4-10 10-10h40c6 0 10 4 10 10zm0-100c0 6-4 10-10 10h-40c-6 0-10-4-10-10v-40c0-6 4-10 10-10h40c6 0 10 4 10 10zm50-250h-50V50c0-16-13-30-30-30-16 0-30 13-30 30v20H190V50c0-16-13-30-30-30-16 0-30 13-30 30v20H80c-22 0-40 18-40 40v25c0 8 7 15 15 15h410c8 0 15-7 15-15v-25c0-22-18-40-40-40"${3}/></g></svg>`;
function tmpl$B($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$B, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_event = registerTemplate(tmpl$B);
tmpl$B.stylesheets = [];
tmpl$B.stylesheetToken = "lwc-1bdjshbcbki";
freezeTemplate(tmpl$B);

const $fragment1$A = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M158 280q-21-31-21-72c0-46 19-84 49-107a62 62 0 00-56-31c-44 0-69 36-69 77 0 22 7 41 22 54 8 8 15 18 15 28s-4 20-29 31c-36 16-69 38-70 71 1 22 15 39 36 39h33c5 0 10-3 13-8 16-29 46-47 71-60 9-4 11-15 6-22m292-20c-25-11-29-20-29-31s7-21 15-28c15-14 22-32 22-54 0-41-24-77-69-77-26 0-46 13-57 31 30 23 49 61 49 107q0 41-21 72c-5 8-2 18 6 22 25 12 55 31 71 60 3 5 8 8 13 8h33c21 0 35-17 35-39 1-33-32-55-68-71m-124 73c-27-12-32-23-32-34 0-12 8-23 17-31 16-15 25-36 25-60 0-45-27-84-76-84s-76 39-76 84c0 24 9 45 25 60 9 9 17 20 17 31 0 12-4 22-32 34-40 17-78 36-79 72 0 24 18 44 41 44h208c23 0 41-20 41-44-1-36-39-54-79-72"${3}/></g></svg>`;
function tmpl$A($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$A, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_group = registerTemplate(tmpl$A);
tmpl$A.stylesheets = [];
tmpl$A.stylesheetToken = "lwc-62g6suktll8";
freezeTemplate(tmpl$A);

const $fragment1$z = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><circle cx="260" cy="92" r="72"${3}/><path d="M484 212H36c-16 0-22 20-9 29l117 75c6 4 9 11 6 18l-43 146c-5 16 16 27 28 15l114-120c6-7 18-7 24 0l114 120c11 12 32 1 28-15l-45-147c-2-6 1-14 6-18l117-75c13-8 7-28-9-28"${3}/></g></svg>`;
function tmpl$z($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$z, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_lead = registerTemplate(tmpl$z);
tmpl$z.stylesheets = [];
tmpl$z.stylesheetToken = "lwc-2urumr8ffpt";
freezeTemplate(tmpl$z);

const $fragment1$y = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M414 397l-9 9a51 51 0 01-37 15h-26c-24 0-50-19-50-52v-25c0-20 9-32 14-39l108-110c3-3 6-10 6-14V98c0-26-22-48-48-48H116c-26 0-48 24-48 48H52c-18 0-32 15-32 33s14 32 32 32h16v65H52c-18 0-32 14-32 32s14 32 32 32h16v65H52c-18 0-32 15-32 32 0 18 14 32 32 32h16c0 32 22 48 48 48h256c26 0 48-22 48-48v-21q0-7.5-6-3m-82-226c0 9-7 16-16 16H156c-9 0-16-7-16-16v-16c0-9 7-16 16-16h160c9 0 16 7 16 16zm-72 194c0 9-7 16-16 16h-88c-9 0-16-7-16-16v-16c0-9 7-16 16-16h88c9 0 16 7 16 16zm24-97c0 9-7 16-16 16H156c-9 0-16-7-16-16v-16c0-9 7-16 16-16h112c9 0 16 7 16 16zm211-44l-10-10c-6-6-16-6-22 0L341 340l-1 2v27c0 2 0 4 2 4h26l3-1 123-124c8-7 8-17 1-24"${3}/></g></svg>`;
function tmpl$y($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$y, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_note = registerTemplate(tmpl$y);
tmpl$y.stylesheets = [];
tmpl$y.stylesheetToken = "lwc-2h6lfscmt76";
freezeTemplate(tmpl$y);

const $fragment1$x = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M440 20H140c-22 0-40 18-40 40v30H70c-17 0-30 13-30 30s13 30 30 30h30v80H70c-17 0-30 13-30 30s13 30 30 30h30v80H70c-17 0-30 13-30 30s13 30 30 30h30v30c0 22 18 40 40 40h300c22 0 40-18 40-40V60c0-22-18-40-40-40m-70 340c0 6-4 10-10 10H220c-6 0-10-4-10-10v-20c0-6 4-10 10-10h140c6 0 10 4 10 10zm20-80c0 6-4 10-10 10H200c-6 0-10-4-10-10v-20c0-6 4-10 10-10h180c6 0 10 4 10 10zm20-100c0 6-4 10-10 10H180c-6 0-10-4-10-10v-60c0-6 4-10 10-10h220c6 0 10 4 10 10z"${3}/></g></svg>`;
function tmpl$x($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$x, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_notebook = registerTemplate(tmpl$x);
tmpl$x.stylesheets = [];
tmpl$x.stylesheetToken = "lwc-1jpbd6focj6";
freezeTemplate(tmpl$x);

const $fragment1$w = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M418 410H102c-8 0-14 7-14 14v1c0 25 20 45 45 45h255c25 0 45-20 45-45v-1c-1-7-7-14-15-14m37-308a45 45 0 00-29 79 80 80 0 01-76 48c-40-2-72-34-74-74l1-19c17-7 29-22 29-42-1-24-21-44-46-44s-45 20-45 45c0 19 12 35 28 42 2 6 2 12 2 19-2 40-34 72-74 74-34 2-64-19-77-48a45 45 0 00-29-79c-25 0-45 20-45 45s20 45 45 45l21 160c1 7 7 12 14 12h320c7 0 13-5 14-12l21-160c25 0 45-20 45-45s-20-46-45-46"${3}/></g></svg>`;
function tmpl$w($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$w, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_opportunity = registerTemplate(tmpl$w);
tmpl$w.stylesheets = [];
tmpl$w.stylesheetToken = "lwc-30fgmkp6t3s";
freezeTemplate(tmpl$w);

const $fragment1$v = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M417 332c-29-12-34-23-34-35s8-23 18-32c17-15 26-37 26-62 0-46-30-87-82-87s-82 40-82 87c0 26 10 46 26 62 10 9 18 20 18 32s-5 23-34 35c-43 18-83 40-84 78 0 25 19 50 43 50h224c25 0 43-25 43-50 2-37-39-60-82-78m-183-61c-3-4-19-24-18-78 1-53 24-66 24-66V75c0-9-9-15-15-15H35c-7 0-15 7-15 16v349h108c3-89 105-125 105-125 15-8 4-25 1-29M106 381c0 9-7 16-16 16H74c-9 0-16-7-16-16v-16c0-9 7-16 16-16h16c9 0 16 7 16 16zm0-79c0 9-7 16-16 16H74c-9 0-16-7-16-16v-16c0-9 7-16 16-16h16c9 0 16 7 16 16zm0-80c0 9-7 16-16 16H74c-9 0-16-7-16-16v-16c0-9 7-16 16-16h16c9 0 16 7 16 16zm0-79c0 9-7 16-16 16H74c-9 0-16-7-16-16v-16c0-9 7-16 16-16h16c9 0 16 7 16 16zm90 159c0 9-7 16-16 16h-16c-9 0-16-7-16-16v-16c0-9 7-16 16-16h16c9 0 16 7 16 16zm0-80c0 9-7 16-16 16h-16c-9 0-16-7-16-16v-16c0-9 7-16 16-16h16c9 0 16 7 16 16zm0-79c0 9-7 16-16 16h-16c-9 0-16-7-16-16v-16c0-9 7-16 16-16h16c9 0 16 7 16 16z"${3}/></g></svg>`;
function tmpl$v($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$v, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_person_account = registerTemplate(tmpl$v);
tmpl$v.stylesheets = [];
tmpl$v.stylesheetToken = "lwc-7cikmjr621i";
freezeTemplate(tmpl$v);

const $fragment1$u = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M240 70l-17-17c-5-5-12-5-17 0L100 158l-43-42c-5-5-12-5-17 0l-17 17c-5 5-5 12 0 17l59 59c5 5 11 7 17 7s12-2 17-7L240 87c4-4 4-12 0-17m244 114H275c-9 0-16-7-16-16v-32c0-9 7-16 16-16h209c9 0 16 7 16 16v32c0 9-7 16-16 16m0 143H227c-9 0-16-7-16-16v-32c0-9 7-16 16-16h257c9 0 16 7 16 16v32c0 9-7 16-16 16m-354 0H98c-9 0-16-7-16-16v-32c0-9 7-16 16-16h32c9 0 16 7 16 16v32c1 9-7 16-16 16m0 143H98c-9 0-16-7-16-16v-32c0-9 7-16 16-16h32c9 0 16 7 16 16v32c1 9-7 16-16 16m354 0H227c-9 0-16-7-16-16v-32c0-9 7-16 16-16h257c9 0 16 7 16 16v32c0 9-7 16-16 16"${3}/></g></svg>`;
function tmpl$u($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$u, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_new_task = registerTemplate(tmpl$u);
tmpl$u.stylesheets = [];
tmpl$u.stylesheetToken = "lwc-7je5m2shueg";
freezeTemplate(tmpl$u);

const $fragment1$t = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M100 181v4zm320 49H160v-47c0-53 40-100 93-103 49-3 90 28 103 72 1 4 5 8 10 8h41c6 0 11-6 10-12-16-76-84-132-165-128-85 4-150 77-152 161v49c-22 0-40 18-40 40v190c0 22 18 40 40 40h320c22 0 40-18 40-40V270c0-22-18-40-40-40M306 427c2 6-3 13-10 13h-73c-7 0-12-6-10-13l18-60a46 46 0 01-20-48c4-19 19-34 39-38 32-6 60 17 60 47 0 16-8 31-21 39z"${3}/></g></svg>`;
function tmpl$t($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$t, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_password_unlock = registerTemplate(tmpl$t);
tmpl$t.stylesheets = [];
tmpl$t.stylesheetToken = "lwc-7ammq91srop";
freezeTemplate(tmpl$t);

const $fragment1$s = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M518 251a288 288 0 00-516 0c-3 6-3 13 0 18a288 288 0 00516 0q4.5-9 0-18M260 370c-61 0-110-49-110-110s49-110 110-110 110 49 110 110-49 110-110 110m0-180c-39 0-70 31-70 70s31 70 70 70 70-31 70-70-31-70-70-70"${3}/></g></svg>`;
function tmpl$s($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$s, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_preview = registerTemplate(tmpl$s);
tmpl$s.stylesheets = [];
tmpl$s.stylesheetToken = "lwc-7mg6pgvgeg";
freezeTemplate(tmpl$s);

const $fragment1$r = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M90 35c0-8-7-15-15-15H45c-8 0-15 7-15 15v450c0 8 7 15 15 15h30c8 0 15-7 15-15zm385 42c-160 84-142-88-335-21-6 2-10 8-10 14v233c0 7 7 12 13 9 192-64 172 112 339 18 5-3 8-8 8-13V85c0-7-8-12-15-8"${3}/></g></svg>`;
function tmpl$r($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$r, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_priority = registerTemplate(tmpl$r);
tmpl$r.stylesheets = [];
tmpl$r.stylesheetToken = "lwc-52u8h0ueaf8";
freezeTemplate(tmpl$r);

const $fragment1$q = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M284 380h-50c-8 0-14-6-14-14v-15c0-42 27-80 67-94 12-4 23-11 32-21 50-60 4-132-56-134-22-1-43 7-59 22-13 12-21 27-23 44-1 6-7 11-15 11h-50c-9 0-16-7-15-16 4-38 21-72 48-99 32-30 73-46 117-45 83 3 151 71 154 154 3 70-40 133-105 157-9 4-15 11-15 20v15c0 9-8 15-16 15m16 105c0 8-7 15-15 15h-50c-8 0-15-7-15-15v-50c0-8 7-15 15-15h50c8 0 15 7 15 15z"${3}/></g></svg>`;
function tmpl$q($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$q, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_question_post_action = registerTemplate(tmpl$q);
tmpl$q.stylesheets = [];
tmpl$q.stylesheetToken = "lwc-1mio1ef3854";
freezeTemplate(tmpl$q);

const $fragment1$p = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M350 230H170c-6 0-10 4-10 10v30c0 6 4 10 10 10h180c6 0 10-4 10-10v-30c0-6-4-10-10-10m-20 90H190c-6 0-10 4-10 10v30c0 6 4 10 10 10h140c6 0 10-4 10-10v-30c0-6-4-10-10-10m128-197l-96-92c-8-7-18-11-28-11H186c-10 0-20 4-28 11l-96 92c-8 8-12 18-12 29v308c0 22 18 40 40 40h340c22 0 40-18 40-40V152c0-11-4-21-12-29M260 50c22 0 40 18 40 40s-18 40-40 40-40-18-40-40 18-40 40-40m150 375c0 8-7 15-15 15H125c-8 0-15-7-15-15V175c0-8 7-15 15-15h270c8 0 15 7 15 15z"${3}/></g></svg>`;
function tmpl$p($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$p, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_quote = registerTemplate(tmpl$p);
tmpl$p.stylesheets = [];
tmpl$p.stylesheetToken = "lwc-1c2hfhkkr5n";
freezeTemplate(tmpl$p);

const $fragment1$o = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M182 226c-5-6-2-16 5-18h90c67 0 121 57 115 126-6 59-58 103-118 103h-34c-8 0-16 7-16 16v31c0 8 7 16 16 16h36c97 0 175-78 177-174 2-99-82-180-181-181h-83s-27 1-10-18l59-58c6-6 6-16 0-22l-22-22c-6-6-16-6-22 0L54 166c-6 6-6 16 0 22l141 141c6 6 16 6 22 0l22-22c6-6 6-16 0-22z"${3}/></g></svg>`;
function tmpl$o($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$o, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_recall = registerTemplate(tmpl$o);
tmpl$o.stylesheets = [];
tmpl$o.stylesheetToken = "lwc-7ogh1hjcvrs";
freezeTemplate(tmpl$o);

const $fragment1$n = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M174 116h173c9 0 16-7 16-16V68c0-26-21-48-47-48H206c-26 0-47 22-47 48v32c-1 9 6 16 15 16m259-56h-16c-5 0-8 3-8 8v32c0 35-28 64-63 64H174c-35 0-63-29-63-64V68c0-5-3-8-8-8H87c-26 0-47 22-47 48v344c0 26 21 48 47 48h346c26 0 47-22 47-48V108c0-26-21-48-47-48M174 404c0 9-7 16-16 16h-16c-9 0-16-7-16-16v-16c0-9 7-16 16-16h16c9 0 16 7 16 16zm0-80c0 9-7 16-16 16h-16c-9 0-16-7-16-16v-16c0-9 7-16 16-16h16c9 0 16 7 16 16zm0-80c0 9-7 16-16 16h-16c-9 0-16-7-16-16v-16c0-9 7-16 16-16h16c9 0 16 7 16 16zm220 160c0 9-7 16-16 16H221c-9 0-16-7-16-16v-16c0-9 7-16 16-16h157c9 0 16 7 16 16zm0-80c0 9-7 16-16 16H221c-9 0-16-7-16-16v-16c0-9 7-16 16-16h157c9 0 16 7 16 16zm0-80c0 9-7 16-16 16H221c-9 0-16-7-16-16v-16c0-9 7-16 16-16h157c9 0 16 7 16 16z"${3}/></g></svg>`;
function tmpl$n($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$n, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_record = registerTemplate(tmpl$n);
tmpl$n.stylesheets = [];
tmpl$n.stylesheetToken = "lwc-41jhbek2qm5";
freezeTemplate(tmpl$n);

const $fragment1$m = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M465 40h-30c-8 0-15 7-15 15v70c0 9-5 13-12 7-3-4-6-7-10-10-50-50-120-71-192-57-25 5-49 15-70 29-61 40-96 105-97 175-1 54 20 108 58 147 40 42 94 65 152 65 51 0 99-18 137-50 7-6 7-16 1-22l-21-21c-5-5-14-6-20-1-36 30-85 42-134 30-13-3-26-9-38-16-57-35-84-101-68-167 3-13 9-26 16-38 28-49 77-76 129-76 40 0 78 16 106 44 5 4 9 9 12 14 3 8-4 12-13 12h-70c-8 0-15 7-15 15v31c0 8 6 14 14 14h183c7 0 13-6 13-13V55c-1-8-8-15-16-15"${3}/></g></svg>`;
function tmpl$m($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$m, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_refresh = registerTemplate(tmpl$m);
tmpl$m.stylesheets = [];
tmpl$m.stylesheetToken = "lwc-n2jrbdvnrn";
freezeTemplate(tmpl$m);

const $fragment1$l = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M316 258l131-131c6-6 6-15 0-21l-21-21c-6-6-15-6-21 0L274 216c-4 4-10 4-14 0L129 84c-6-6-15-6-21 0l-21 21c-6 6-6 15 0 21l131 131c4 4 4 10 0 14L86 403c-6 6-6 15 0 21l21 21c6 6 15 6 21 0l132-131c4-4 10-4 14 0l131 131c6 6 15 6 21 0l21-21c6-6 6-15 0-21L316 272c-3-4-3-10 0-14"${3}/></g></svg>`;
function tmpl$l($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$l, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_reject = registerTemplate(tmpl$l);
tmpl$l.stylesheets = [];
tmpl$l.stylesheetToken = "lwc-i8i7vq7b37";
freezeTemplate(tmpl$l);

const $fragment1$k = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M316 258l131-131c6-6 6-15 0-21l-21-21c-6-6-15-6-21 0L274 216c-4 4-10 4-14 0L129 84c-6-6-15-6-21 0l-21 21c-6 6-6 15 0 21l131 131c4 4 4 10 0 14L86 403c-6 6-6 15 0 21l21 21c6 6 15 6 21 0l132-131c4-4 10-4 14 0l131 131c6 6 15 6 21 0l21-21c6-6 6-15 0-21L316 272c-3-4-3-10 0-14"${3}/></g></svg>`;
function tmpl$k($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$k, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_remove = registerTemplate(tmpl$k);
tmpl$k.stylesheets = [];
tmpl$k.stylesheetToken = "lwc-ft3vh2g0us";
freezeTemplate(tmpl$k);

const $fragment1$j = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M360 200c0-22-18-40-40-40H60c-22 0-40 18-40 40v260c0 22 18 40 40 40h260c22 0 40-18 40-40zM110 350c-5 0-10-5-10-10v-20c0-5 5-10 10-10h160c5 0 10 5 10 10v20c0 5-5 10-10 10zm320 70h-30v-60h30c6 0 10-4 10-10V90c0-6-4-10-10-10H170c-6 0-10 4-10 10v30h-60V90c0-39 31-70 70-70h260c39 0 70 31 70 70v260c0 39-31 70-70 70"${3}/></g></svg>`;
function tmpl$j($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$j, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_remove_relationship = registerTemplate(tmpl$j);
tmpl$j.stylesheets = [];
tmpl$j.stylesheetToken = "lwc-6mg74pa9psq";
freezeTemplate(tmpl$j);

const $fragment1$i = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M465 40h-30c-8 0-15 7-15 15v70c0 9-5 13-12 7-3-4-6-7-10-10-50-50-120-71-192-57-25 5-49 15-70 29-61 40-96 105-97 175-1 54 20 108 58 147 40 42 94 65 152 65 51 0 99-18 137-50 7-6 7-16 1-22l-21-21c-5-5-14-6-20-1-36 30-85 42-134 30-13-3-26-9-38-16-57-35-84-101-68-167 3-13 9-26 16-38 28-49 77-76 129-76 40 0 78 16 106 44 5 4 9 9 12 14 3 8-4 12-13 12h-70c-8 0-15 7-15 15v31c0 8 6 14 14 14h183c7 0 13-6 13-13V55c-1-8-8-15-16-15"${3}/></g></svg>`;
function tmpl$i($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$i, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_reset_password = registerTemplate(tmpl$i);
tmpl$i.stylesheets = [];
tmpl$i.stylesheetToken = "lwc-3ll7ju9kmbt";
freezeTemplate(tmpl$i);

const $fragment1$h = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M485 320a16 16 0 0115 15v88q0 47-45 47h-90a16 15 0 010-31h83c17 0 23-6 23-23v-81a16 16 0 0115-15zm-450 0a16 16 0 0115 15v81c0 17 6 23 23 23h82a16 15 0 010 31H65q-45 0-45-47v-88a16 16 0 0115-15m167-180c7 0 13 5 13 10v220c0 6-6 10-13 10h-34c-7 0-13-5-13-10V150c0-6 6-10 13-10zm-87 0a10 10 0 0110 10v220a10 10 0 01-10 10h-10a10 10 0 01-10-10V150a10 10 0 0110-10zm150 0a10 10 0 0110 10v220a10 10 0 01-10 10h-10a10 10 0 01-10-10V150a10 10 0 0110-10zm150 0a10 10 0 0110 10v220a10 10 0 01-10 10h-10a10 10 0 01-10-10V150a10 10 0 0110-10zm-63 0c7 0 13 5 13 10v220c0 6-6 10-13 10h-34c-7 0-13-5-13-10V150c0-6 6-10 13-10zm103-90q45 0 45 47v88a15 15 0 01-30 0v-81c0-17-6-23-23-23h-82a16 15 0 010-31zm-300 0a16 15 0 010 31H73c-17 0-23 6-23 23v81a16 16 0 01-15 15 16 16 0 01-15-15V97q0-47 45-47z"${3}/></g></svg>`;
function tmpl$h($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$h, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_scan_disabled = registerTemplate(tmpl$h);
tmpl$h.stylesheets = [];
tmpl$h.stylesheetToken = "lwc-1jd7ia1n345";
freezeTemplate(tmpl$h);

const $fragment1$g = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M485 320a16 16 0 0115 15v88q0 47-45 47h-90a16 15 0 010-31h83c17 0 23-6 23-23v-81a16 16 0 0115-15zm-450 0a16 16 0 0115 15v81c0 17 6 23 23 23h82a16 15 0 010 31H65q-45 0-45-47v-88a16 16 0 0115-15m167-180c7 0 13 5 13 10v220c0 6-6 10-13 10h-34c-7 0-13-5-13-10V150c0-6 6-10 13-10zm-87 0a10 10 0 0110 10v220a10 10 0 01-10 10h-10a10 10 0 01-10-10V150a10 10 0 0110-10zm150 0a10 10 0 0110 10v220a10 10 0 01-10 10h-10a10 10 0 01-10-10V150a10 10 0 0110-10zm150 0a10 10 0 0110 10v220a10 10 0 01-10 10h-10a10 10 0 01-10-10V150a10 10 0 0110-10zm-63 0c7 0 13 5 13 10v220c0 6-6 10-13 10h-34c-7 0-13-5-13-10V150c0-6 6-10 13-10zm103-90q45 0 45 47v88a15 15 0 01-30 0v-81c0-17-6-23-23-23h-82a16 15 0 010-31zm-300 0a16 15 0 010 31H73c-17 0-23 6-23 23v81a16 16 0 01-15 15 16 16 0 01-15-15V97q0-47 45-47z"${3}/></g></svg>`;
function tmpl$g($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$g, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_scan_enabled = registerTemplate(tmpl$g);
tmpl$g.stylesheets = [];
tmpl$g.stylesheetToken = "lwc-1u157ogpkie";
freezeTemplate(tmpl$g);

const $fragment1$f = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M440 68c-88 0-156 69-156 157v211c0 8 7 15 15 15h167c8 0 15-7 15-15V270c0-8-7-15-15-15H342v-29c0-49 48-98 97-98h26c8 0 15-7 15-15V83c0-8-7-15-15-15zm-244 0c-88 0-156 69-156 158v211c0 8 7 15 15 15h167c8 0 15-7 15-15V270c0-8-7-15-15-15H99v-29c0-49 48-98 97-98h26c8 0 15-7 15-15V83c0-8-7-15-15-15z"${3}/></g></svg>`;
function tmpl$f($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$f, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_script = registerTemplate(tmpl$f);
tmpl$f.stylesheets = [];
tmpl$f.stylesheetToken = "lwc-5o8dv28cobg";
freezeTemplate(tmpl$f);

const $fragment1$e = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M485 300h-30c-8 0-15 7-15 15v110c0 8-7 15-15 15H95c-8 0-15-7-15-15V215c0-8 7-15 15-15h40c8 0 15-7 15-15v-30c0-8-7-15-15-15H60c-22 0-40 18-40 40v280c0 22 18 40 40 40h400c22 0 40-18 40-40V315c0-8-7-15-15-15M340 140c-100 0-191 89-199 194-1 8 6 16 15 16h30c8 0 14-6 15-13 7-75 71-137 149-137h16c9 0 13 11 7 17l-55 56c-6 6-6 15 0 21l21 21c6 6 15 6 21 0l136-135c6-6 6-15 0-21L361 24c-6-6-15-6-21 0l-21 21c-6 6-7 15-1 21l56 56c6 6 2 17-7 17z"${3}/></g></svg>`;
function tmpl$e($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$e, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_share = registerTemplate(tmpl$e);
tmpl$e.stylesheets = [];
tmpl$e.stylesheetToken = "lwc-46b5fuf0fe";
freezeTemplate(tmpl$e);

const $fragment1$d = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M410 160h78c4 0 7-5 4-9l-83-83c-4-3-9 0-9 4v78c0 6 4 10 10 10m80 40H380c-11 0-20-9-20-20V70c0-6-4-10-10-10H215c-8 0-15 7-15 15v40c0 4 2 8 4 11l56 56c8 8 14 19 16 31 2 16-3 31-14 43l-16 14c-5 5-10 8-16 11 7 3 15 5 23 6 26 2 47 24 47 51v22a52 52 0 01-56 50l-32-5c-6-2-12 3-12 10v31c0 8 7 15 15 15h270c8 0 15-7 15-15V210c0-6-4-10-10-10M260 359v-22c0-6-5-10-11-11-54-5-99-51-99-108v-12c0-6 8-10 12-5l40 40c4 4 11 4 15 0l15-15c4-4 4-11 0-15l-97-97c-4-4-11-4-15 0l-97 97c-4 4-4 11 0 15l15 15c4 4 11 5 15 1l42-40c5-5 14-1 14 5v19c0 72 63 138 139 144 7 0 12-5 12-11"${3}/></g></svg>`;
function tmpl$d($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$d, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_share_file = registerTemplate(tmpl$d);
tmpl$d.stylesheets = [];
tmpl$d.stylesheetToken = "lwc-7loc6001cfp";
freezeTemplate(tmpl$d);

const $fragment1$c = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M272 417l-21-3-21-6c-4-1-9 0-12 3l-5 5a79 79 0 01-106 6 77 77 0 01-4-112l76-76c10-10 22-16 34-20a79 79 0 0174 20l10 13c4 7 13 8 18 2l28-28c4-4 4-10 1-15l-14-16a128 128 0 00-71-37 143 143 0 00-124 37l-73 73C9 316 5 402 56 456c53 58 143 59 198 4l25-25c7-5 2-17-7-18M456 58c-55-51-141-47-193 6l-23 22c-7 7-2 19 7 20 14 1 28 4 42 8 4 1 9 0 12-3l5-5c29-29 76-32 106-6 34 29 35 81 4 112l-76 76a85 85 0 01-34 20 79 79 0 01-74-20l-10-13c-4-7-13-8-18-2l-28 28c-4 4-4 10-1 15l14 16a130 130 0 0070 37 143 143 0 00124-37l76-76c56-55 54-145-3-198"${3}/></g></svg>`;
function tmpl$c($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$c, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_share_link = registerTemplate(tmpl$c);
tmpl$c.stylesheets = [];
tmpl$c.stylesheetToken = "lwc-29ttf9lu41l";
freezeTemplate(tmpl$c);

const $fragment1$b = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M468 20H52c-18 0-32 14-32 32v64c0 18 14 32 32 32h416c18 0 32-14 32-32V52c0-18-14-32-32-32m-200 96V52h200v64zm200 80H52c-18 0-32 14-32 32v64c0 18 14 32 32 32h416c18 0 32-14 32-32v-64c0-18-14-32-32-32m-272 96v-64h272v64zm272 80H52c-18 0-32 14-32 32v64c0 18 14 32 32 32h416c18 0 32-14 32-32v-64c0-18-14-32-32-32m-128 96v-64h128v64z"${3}/></g></svg>`;
function tmpl$b($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$b, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_share_poll = registerTemplate(tmpl$b);
tmpl$b.stylesheets = [];
tmpl$b.stylesheetToken = "lwc-5fksnmb7obq";
freezeTemplate(tmpl$b);

const $fragment1$a = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M260 40C127 40 20 138 20 260c0 39 11 75 30 108 2 4 3 9 2 13l-22 69c-4 13 8 24 21 20l70-24c5-2 10-1 14 2 37 21 80 33 126 33 133 0 240-98 240-220-3-123-110-221-241-221"${3}/></g></svg>`;
function tmpl$a($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$a, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_share_post = registerTemplate(tmpl$a);
tmpl$a.stylesheets = [];
tmpl$a.stylesheetToken = "lwc-3brj680uhnm";
freezeTemplate(tmpl$a);

const $fragment1$9 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M452 140h-70c20-31 18-73-6-98a72 72 0 00-51-22c-21 0-42 10-57 26l-8 10-8-10a76 76 0 00-57-26c-19 0-37 8-50 22-25 26-26 67-6 98H69c-27 0-49 22-49 48v32c0 9 7 16 16 16h448c9 0 16-7 16-16v-32c0-26-22-48-48-48m-216 0c-17 0-41-6-54-21-12-13-14-34-2-44 5-5 10-6 15-6 8 0 16 4 22 10 14 15 19 41 19 57zm102-21a84 84 0 01-54 21v-5c0-16 6-42 19-57 6-6 14-10 22-10 4 0 10 1 16 6 10 12 9 32-3 45m114 165H284v216h138c26 0 46-21 46-46V300c0-9-7-16-16-16M52 300v152c0 26 22 48 48 48h136V284H68c-9 0-16 7-16 16"${3}/></g></svg>`;
function tmpl$9($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$9, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_share_thanks = registerTemplate(tmpl$9);
tmpl$9.stylesheets = [];
tmpl$9.stylesheetToken = "lwc-6v5ddvr9ikv";
freezeTemplate(tmpl$9);

const $fragment1$8 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M275 160c6-6 6-15 0-21L161 24c-6-6-15-6-21 0L25 139c-6 6-6 15 0 21l21 21c6 6 15 6 21 0l36-36c6-6 17-2 17 7v212c0 8 7 15 15 15h30c8 0 15-8 15-15V152c0-9 11-13 17-7l36 36c6 6 15 6 21 0zm220 200l-21-20c-6-6-15-6-21 0l-36 36c-6 6-17 2-17-7V155c0-8-7-15-15-15h-30c-8 0-15 8-15 15v212c0 9-11 13-17 7l-36-36c-6-6-15-6-21 0l-21 22c-6 6-6 15 0 21l115 115c6 6 15 6 21 0l115-115c5-6 5-16-1-21"${3}/></g></svg>`;
function tmpl$8($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$8, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_sort = registerTemplate(tmpl$8);
tmpl$8.stylesheets = [];
tmpl$8.stylesheetToken = "lwc-24rtgpb1cfi";
freezeTemplate(tmpl$8);

const $fragment1$7 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M452 292h-88c-26 0-48-22-48-48 4-71 37-75 40-121 3-48-27-91-74-101a97 97 0 00-118 94c0 53 36 53 40 128 0 26-22 48-48 48H68c-26 0-48 21-48 48v32c0 9 7 16 16 16h448c9 0 16-7 16-16v-32c0-27-22-48-48-48m1 144H67c-9 0-15 7-15 15v1c0 26 22 48 48 48h321c26 0 47-22 47-48v-1c0-8-7-15-15-15"${3}/></g></svg>`;
function tmpl$7($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$7, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_submit_for_approval = registerTemplate(tmpl$7);
tmpl$7.stylesheets = [];
tmpl$7.stylesheetToken = "lwc-63e0he37fq9";
freezeTemplate(tmpl$7);

const $fragment1$6 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M260 20a239 239 0 100 480 239 239 0 100-480m90 155c0 8-7 15-15 15h-95c-6 0-10 4-10 10v20c0 6 4 10 10 10h40c39 0 70 31 70 70v20c0 39-31 70-70 70h10v20c0 11-9 20-20 20s-20-9-20-20v-20h-65c-8 0-15-7-15-15v-30c0-8 7-15 15-15h95c6 0 10-4 10-10v-20c0-6-4-10-10-10h-40c-39 0-70-31-70-70v-20c0-39 31-70 70-70h10v-20c0-11 9-20 20-20s20 9 20 20v20h45c8 0 15 7 15 15z"${3}/></g></svg>`;
function tmpl$6($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$6, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_update = registerTemplate(tmpl$6);
tmpl$6.stylesheets = [];
tmpl$6.stylesheetToken = "lwc-6ahv7tolmrd";
freezeTemplate(tmpl$6);

const $fragment1$5 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M298 306l16 16c4 4 10 4 14 0l46-47c4-4 6-9 6-14V80c0-17-13-30-30-30H50c-17 0-30 13-30 30v220c0 17 13 30 30 30h137c5 0 10-2 14-6l17-17c8-8 18-14 29-16 18-4 37 2 51 15M100 140c0-6 4-10 10-10h180c6 0 10 4 10 10v20c0 6-4 10-10 10H110c-6 0-10-4-10-10zm10 110c-6 0-10-4-10-10v-20c0-6 4-10 10-10h140c6 0 10 4 10 10v20c0 6-4 10-10 10zm385 27l-22-22c-6-6-16-6-22 0L328 379c-4 4-11 4-15 0l-44-45c-6-6-16-6-22 0l-22 22c-6 6-6 16 0 22l85 86c6 6 16 6 22 0l163-164c7-7 7-17 0-23"${3}/></g></svg>`;
function tmpl$5($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$5, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_update_status = registerTemplate(tmpl$5);
tmpl$5.stylesheets = [];
tmpl$5.stylesheetToken = "lwc-9i91p94c9a";
freezeTemplate(tmpl$5);

const $fragment1$4 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M485 310h-30c-8 0-15 8-15 15v100c0 8-7 15-15 15H95c-8 0-15-7-15-15V325c0-7-7-15-15-15H35c-8 0-15 8-15 15v135c0 22 18 40 40 40h400c22 0 40-18 40-40V325c0-7-7-15-15-15M270 24c-6-6-15-6-21 0L114 159c-6 6-6 15 0 21l21 21c6 6 15 6 21 0l56-56c6-6 18-2 18 7v212c0 8 6 15 14 15h30c8 0 16-8 16-15V153c0-9 10-13 17-7l56 56c6 6 15 6 21 0l21-21c6-6 6-15 0-21z"${3}/></g></svg>`;
function tmpl$4($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$4, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_upload = registerTemplate(tmpl$4);
tmpl$4.stylesheets = [];
tmpl$4.stylesheetToken = "lwc-7n43g7ebue";
freezeTemplate(tmpl$4);

const $fragment1$3 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M500 430v22c0 26-22 48-48 48H68c-26 0-48-22-48-48v-22c0-58 68-94 132-122l6-3c5-2 10-2 15 1a155 155 0 00172 0c5-3 10-3 15-1l6 3c66 28 134 63 134 122M260 20c66 0 119 59 119 132s-53 132-119 132-119-59-119-132S194 20 260 20"${3}/></g></svg>`;
function tmpl$3($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$3, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_user = registerTemplate(tmpl$3);
tmpl$3.stylesheets = [];
tmpl$3.stylesheetToken = "lwc-39pvqbq7gv4";
freezeTemplate(tmpl$3);

const $fragment1$2 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M275 160c6-6 6-15 0-21L161 24c-6-6-15-6-21 0L25 139c-6 6-6 15 0 21l21 21c6 6 15 6 21 0l36-36c6-6 17-2 17 7v212c0 8 7 16 15 16h30c8 0 15-9 15-16V152c0-9 11-13 17-7l36 36c6 6 15 6 21 0zm220 200l-21-20c-6-6-15-6-21 0l-36 36c-6 6-17 2-17-7V155c0-8-7-15-15-15h-30c-8 0-15 8-15 15v212c0 9-11 13-17 7l-36-36c-6-6-15-6-21 0l-21 22c-6 6-6 15 0 21l115 115c6 6 15 6 21 0l115-115c5-6 5-16-1-21M160 460h-20c-11 0-20-9-20-20v-20c0-11 9-20 20-20h20c11 0 20 9 20 20v20c0 11-9 20-20 20m220-340h-20c-11 0-20-9-20-20V80c0-11 9-20 20-20h20c11 0 20 9 20 20v20c0 11-9 20-20 20"${3}/></g></svg>`;
function tmpl$2($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_user_activation = registerTemplate(tmpl$2);
tmpl$2.stylesheets = [];
tmpl$2.stylesheetToken = "lwc-5el2mjto2n0";
freezeTemplate(tmpl$2);

const $fragment1$1 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M360 200c0-22-18-40-40-40H60c-22 0-40 18-40 40v260c0 22 18 40 40 40h260c22 0 40-18 40-40zm70 220h-30v-60h30c6 0 10-4 10-10V90c0-6-4-10-10-10H170c-6 0-10 4-10 10v30h-60V90c0-39 31-70 70-70h260c39 0 70 31 70 70v260c0 39-31 70-70 70"${3}/></g></svg>`;
function tmpl$1($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$1, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_view_relationship = registerTemplate(tmpl$1);
tmpl$1.stylesheets = [];
tmpl$1.stylesheetToken = "lwc-3p7hmrkf6qe";
freezeTemplate(tmpl$1);

const $fragment1 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 520 520" part="icon"${2}><g${3}><path d="M270 20a239 239 0 100 480 239 239 0 100-480m30 343c-15 15-20 44-26 64-1 4-4 8-8 10l-10 5c-6 3-13 2-18-3-10-9-18-23-18-37 0-24-40-16-40-64 0-39-50-62-86-45l-9 3c-6 2-12-2-13-8l-2-28c0-48 17-92 45-126l2-1c24-28 55-50 91-62 9-3 17 7 12 15-4 6-6 12-6 17 1 21-19 34-28 31-8-3-30 11-10 21l11 5 2 1 3 2c36 21 29 38 14 64-17 28-24 0-48-8s-48 8-40 24 32 0 48 16 16 40 64 24 56-8 72 8c14 16 22 48-2 72m127-2c-19-22 0-73-23-102-25-31-57 1-88-48-29-47 8-86 46-99 10-4 21-5 32-5 2 0 5 1 7 3a198 198 0 0143 249c-4 6-12 7-17 2"${3}/></g></svg>`;
function tmpl($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var action_web_link = registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-4qantpto7n";
freezeTemplate(tmpl);

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
var templates = {
  action_add_contact,
  action_add_file,
  action_add_photo_video,
  action_add_relationship,
  action_adjust_value,
  action_announcement,
  action_apex,
  action_approval,
  action_back,
  action_bug,
  action_call,
  action_canvas,
  action_change_owner,
  action_change_record_type,
  action_check,
  action_clone,
  action_close,
  action_defer,
  action_delete,
  action_description,
  action_dial_in,
  action_download,
  action_edit,
  action_edit_groups,
  action_edit_relationship,
  action_email,
  action_fallback,
  action_filter,
  action_flow,
  action_follow,
  action_following,
  action_freeze_user,
  action_goal,
  action_google_news,
  action_info,
  action_join_group,
  action_lead_convert,
  action_leave_group,
  action_log_a_call,
  action_log_event,
  action_manage_perm_sets,
  action_map,
  action_more,
  action_new,
  action_new_account,
  action_new_campaign,
  action_new_case,
  action_new_child_case,
  action_new_contact,
  action_new_custom1,
  action_new_custom10,
  action_new_custom100,
  action_new_custom11,
  action_new_custom12,
  action_new_custom13,
  action_new_custom14,
  action_new_custom15,
  action_new_custom16,
  action_new_custom17,
  action_new_custom18,
  action_new_custom19,
  action_new_custom2,
  action_new_custom20,
  action_new_custom21,
  action_new_custom22,
  action_new_custom23,
  action_new_custom24,
  action_new_custom25,
  action_new_custom26,
  action_new_custom27,
  action_new_custom28,
  action_new_custom29,
  action_new_custom3,
  action_new_custom30,
  action_new_custom31,
  action_new_custom32,
  action_new_custom33,
  action_new_custom34,
  action_new_custom35,
  action_new_custom36,
  action_new_custom37,
  action_new_custom38,
  action_new_custom39,
  action_new_custom4,
  action_new_custom40,
  action_new_custom41,
  action_new_custom42,
  action_new_custom43,
  action_new_custom44,
  action_new_custom45,
  action_new_custom46,
  action_new_custom47,
  action_new_custom48,
  action_new_custom49,
  action_new_custom5,
  action_new_custom50,
  action_new_custom51,
  action_new_custom52,
  action_new_custom53,
  action_new_custom54,
  action_new_custom55,
  action_new_custom56,
  action_new_custom57,
  action_new_custom58,
  action_new_custom59,
  action_new_custom6,
  action_new_custom60,
  action_new_custom61,
  action_new_custom62,
  action_new_custom63,
  action_new_custom64,
  action_new_custom65,
  action_new_custom66,
  action_new_custom67,
  action_new_custom68,
  action_new_custom69,
  action_new_custom7,
  action_new_custom70,
  action_new_custom71,
  action_new_custom72,
  action_new_custom73,
  action_new_custom74,
  action_new_custom75,
  action_new_custom76,
  action_new_custom77,
  action_new_custom78,
  action_new_custom79,
  action_new_custom8,
  action_new_custom80,
  action_new_custom81,
  action_new_custom82,
  action_new_custom83,
  action_new_custom84,
  action_new_custom85,
  action_new_custom86,
  action_new_custom87,
  action_new_custom88,
  action_new_custom89,
  action_new_custom9,
  action_new_custom90,
  action_new_custom91,
  action_new_custom92,
  action_new_custom93,
  action_new_custom94,
  action_new_custom95,
  action_new_custom96,
  action_new_custom97,
  action_new_custom98,
  action_new_custom99,
  action_new_event,
  action_new_group,
  action_new_lead,
  action_new_note,
  action_new_notebook,
  action_new_opportunity,
  action_new_person_account,
  action_new_task,
  action_password_unlock,
  action_preview,
  action_priority,
  action_question_post_action,
  action_quote,
  action_recall,
  action_record,
  action_refresh,
  action_reject,
  action_remove,
  action_remove_relationship,
  action_reset_password,
  action_scan_disabled,
  action_scan_enabled,
  action_script,
  action_share,
  action_share_file,
  action_share_link,
  action_share_poll,
  action_share_post,
  action_share_thanks,
  action_sort,
  action_submit_for_approval,
  action_update,
  action_update_status,
  action_upload,
  action_user,
  action_user_activation,
  action_view_relationship,
  action_web_link
};

const __lwc_component_class_internal = registerComponent(templates, {
  tmpl: _tmpl,
  sel: "lightning-icon-svg-templates-action",
  apiVersion: 66
});

export { __lwc_component_class_internal as default };