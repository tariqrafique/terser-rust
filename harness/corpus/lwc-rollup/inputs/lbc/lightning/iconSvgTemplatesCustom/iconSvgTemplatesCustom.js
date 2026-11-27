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

const $fragment1$1M = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M543 741a60 60 0 01-87 0L246 516c-62-65-62-172 0-237 30-32 70-49 113-49s83 17 113 49l12 15c8 10 24 10 32 0l10-13 2-2a153 153 0 01226-1c62 65 62 172 0 237z"${3}/></g></svg>`;
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
var custom_custom1 = registerTemplate(tmpl$1M);
tmpl$1M.stylesheets = [];
tmpl$1M.stylesheetToken = "lwc-qca65b2vb";
freezeTemplate(tmpl$1M);

const $fragment1$1L = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M698 779c-94 38-242 28-323-60-195-211-24-519 211-519 39 0 77 8 112 22 15 6 16 26 4 35a298 298 0 00-1 487c13 9 11 29-3 35"${3}/></g></svg>`;
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
var custom_custom10 = registerTemplate(tmpl$1L);
tmpl$1L.stylesheets = [];
tmpl$1L.stylesheetToken = "lwc-1ma5oimcigs";
freezeTemplate(tmpl$1L);

const $fragment1$1K = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M61.9 72H38.1c-.7 0-1.1.6-1 1.3 1 3.8 6.4 6.7 12.8 6.7 6.5 0 11.9-2.9 12.8-6.7.3-.7-.2-1.3-.8-1.3M74 26H26a6 6 0 00-6 6v28a6 6 0 006 6h48a6 6 0 006-6V32a6 6 0 00-6-6m0 32a2 2 0 01-2 2H28a2 2 0 01-2-2V34c0-1.1.9-2 2-2h44a2 2 0 012 2z"${3}/></g></svg>`;
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
var custom_custom100 = registerTemplate(tmpl$1K);
tmpl$1K.stylesheets = [];
tmpl$1K.stylesheetToken = "lwc-34h0nahe623";
freezeTemplate(tmpl$1K);

const $fragment1$1J = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M448.9 386.5a74.7 74.7 0 11-.7 149.4 74.7 74.7 0 01.7-149.4m5 315c5.4-2.4 11.7-6 19.4-10.2a364 364 0 0158.9-28.3 391 391 0 01-16.4-37.7c0-.9-.6-2-1-3a174.2 174.2 0 11107.6-173.6c39.2 4.2 61.2 23.6 73 45.1a249 249 0 10-257.7 215.6l16.2-8zm298.8 22.3c-23.3-10.5-57.7-37-108.8-46 13.3-14 23-35.8 33.2-61.8 6-15 4.8-27.8 4.8-46 0-13.3 2.4-35-.9-46.9-11.3-39.8-39.8-51.1-73-51.1s-61.8 11-73 51.4c-3.3 12-.9 33.2-.9 46.9 0 18.2-1 31 4.8 46 10.1 26 19.9 47.8 33.2 61.9-51.3 9.3-85.4 35.8-108.6 46-47.8 21.1-48.1 44.5-48.1 44.5v39.5h384.5v-39.5c.6 0 .6-23.6-47.6-44.8h.4z"${3}/></g></svg>`;
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
var custom_custom101 = registerTemplate(tmpl$1J);
tmpl$1J.stylesheets = [];
tmpl$1J.stylesheetToken = "lwc-51ts8m2ad5h";
freezeTemplate(tmpl$1J);

const $fragment1$1I = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M312 607h-88a12 12 0 00-11 11v178a12 12 0 0011 11h88a12 12 0 0012-11V618a11 11 0 00-12-11m161-55h-87c-6 0-12 5-12 12v232a12 12 0 0012 12h87a12 12 0 0012-12V564a12 12 0 00-12-12m161-200h-87a12 12 0 00-12 11v433a12 12 0 0012 12h87a12 12 0 0012-12V363a11 11 0 00-12-11m162-140h-88a12 12 0 00-12 12v572a12 12 0 0012 12h88a12 12 0 0012-12V224a12 12 0 00-12-12"${3}/></g></svg>`;
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
var custom_custom102 = registerTemplate(tmpl$1I);
tmpl$1I.stylesheets = [];
tmpl$1I.stylesheetToken = "lwc-28gnomcea1g";
freezeTemplate(tmpl$1I);

const $fragment1$1H = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M761 549c-16-8-40-27-75-34 9-10 16-26 23-45q4.5-16.5 3-33c0-10 2-26 0-35-8-29-28-37-51-37s-43 8-51 37c-2 9 0 25 0 35-1 11 0 23 3 33 7 20 14 35 23 46-17 3-33 10-48 19a381 381 0 0150 26l21 11c27 13 42 27 51 39h85v-29s0-17-34-33m-420 23l21-11a374 374 0 0151-26 164 164 0 00-50-19c9-11 16-27 23-46 4-11 5-22 4-33 0-10 2-26-1-35-8-29-28-37-51-37s-43 8-50 37c-3 9-1 25-1 34a89 89 0 003 34c7 19 14 35 23 45-35 7-58 26-75 34-33 16-33 33-33 33v29h86a131 131 0 0150-39m309 20c-24-12-60-41-113-51 13-15 24-39 34-68 7-16 5-30 5-50 0-15 3-38-1-51-11-44-41-56-76-56-34 0-64 12-76 56-3 13 0 36 0 51 0 20-1 35 5 51 10 28 20 52 34 68-53 10-88 39-112 50-50 23-50 49-50 49v43l400 1v-44s0-26-50-49v-1z"${3}/></g></svg>`;
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
var custom_custom103 = registerTemplate(tmpl$1H);
tmpl$1H.stylesheets = [];
tmpl$1H.stylesheetToken = "lwc-763pq4g7oak";
freezeTemplate(tmpl$1H);

const $fragment1$1G = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M727 206H273a30 30 0 00-30 30v155h514V237a30 30 0 00-30-31M455 423v371h272a30 30 0 0030-30V422H456zm-212 0v340a30 30 0 0030 31h152V423z"${3}/></g></svg>`;
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
var custom_custom104 = registerTemplate(tmpl$1G);
tmpl$1G.stylesheets = [];
tmpl$1G.stylesheetToken = "lwc-3em54205bu9";
freezeTemplate(tmpl$1G);

const $fragment1$1F = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M761 263H240a36 36 0 00-36 36v26c0 3 1 5 3 7l263 215a43 43 0 0059 0l263-215a9 9 0 003-7v-25a36 36 0 00-34-37M204 379c0-3 2-6 5-8 3-1 7-1 10 2l127 113c2 1 3 4 3 6a9 9 0 01-2 7L219 619a8 8 0 01-9 2 9 9 0 01-6-8zm0 292c0-2 1-5 3-6l160-150a8 8 0 0112 0l68 60a77 77 0 00105 0l68-60c4-3 9-3 12 0l161 149a9 9 0 012 7v29a36 36 0 01-35 37H240a36 36 0 01-36-37zm592-58a9 9 0 01-6 8 9 9 0 01-9-2L653 499a9 9 0 01-2-7c0-3 1-5 3-7l128-113a8 8 0 019-1 9 9 0 015 8z"${3}/></g></svg>`;
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
var custom_custom105 = registerTemplate(tmpl$1F);
tmpl$1F.stylesheets = [];
tmpl$1F.stylesheetToken = "lwc-2rnn1vla61s";
freezeTemplate(tmpl$1F);

const $fragment1$1E = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M496 205c-119 1-215 98-214 217 0 176 214 373 214 373s215-205 215-373c0-119-96-216-215-217m0 311a93 93 0 1192-94 93 93 0 01-92 94"${3}/></g></svg>`;
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
var custom_custom106 = registerTemplate(tmpl$1E);
tmpl$1E.stylesheets = [];
tmpl$1E.stylesheetToken = "lwc-1v45p6ac93q";
freezeTemplate(tmpl$1E);

const $fragment1$1D = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path fill-rule="evenodd" d="M777 515h-59v262a12 12 0 01-13 12H586a12 12 0 01-11-13V574H430v203c1 6-4 12-10 12H300a12 12 0 01-13-13V515h-59c-5 0-11-3-11-8-2-5-2-10 3-13l275-275c5-5 13-5 15 0l275 275c5 3 5 8 3 13-3 5-5 8-11 8"${3}/></g></svg>`;
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
var custom_custom107 = registerTemplate(tmpl$1D);
tmpl$1D.stylesheets = [];
tmpl$1D.stylesheetToken = "lwc-25dugh0fc4q";
freezeTemplate(tmpl$1D);

const $fragment1$1C = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M479 603.5l4.2-28.2 39.6-27.3-8.7-37.2h-5.4l-42-3.3-16.2-22.8 9.3-48-31.2-20.1-3.9 3.9-31.5 27.9-27-4.2-26.4-40.8-35.7 9v5.7l-3 42.9-22.2 16.8-46.8-9.9-19.2 32.7 3.6 4.2 27 32.7-3.9 28.2-39.6 27 8.7 36.9 5.4.6 41.4 3.3L272 656l-9.6 48 31.5 19.8 4.2-3.6 31.5-28.2 27 4.2 26.1 40.8 36-9v-6l2.7-42 22.2-16.8 46.2 9.9 19.2-32.7-3.6-4.2-26.4-32.4zm-54.9 6.6a72 72 0 01-100.8 25.5 78 78 0 01-24.9-104.4 72 72 0 01100.8-25.8 78 78 0 0124.9 104.7m332.4-147.3l4.2-28.2 39.3-27-8.7-36.9h-5.4l-41.4-3.3L728 344l9.3-48-31.5-19.8-4.2 3.6-31.5 27.9-27-4.2-25.8-40.8-36 9-.6 6L578 320l-22.2 16.8-46.2-9.6-19.2 32.7 3.6 4.5 27 32.7-4.2 28.2-39.3 26.7 8.7 37.2h5.4l41.4 3.3 16.2 23.1-9.6 48 31.5 20.4 4.2-3.6 31.5-28.2 27 4.2 26.1 40.8 35.7-9 .3-5.7 3-42.9 22.2-16.8 46.5 9.6 19.2-32.7-3.6-4.2zm-55.2 6.6a72 72 0 01-100.8 25.5 77.5 77.5 0 01-24.6-104.4 72 72 0 01100.8-25.8 78 78 0 0124.6 104.7"${3}/></g></svg>`;
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
var custom_custom108 = registerTemplate(tmpl$1C);
tmpl$1C.stylesheets = [];
tmpl$1C.stylesheetToken = "lwc-57iou5ogn32";
freezeTemplate(tmpl$1C);

const $fragment1$1B = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M797 464l-14-21-41 18a305 305 0 00-249-146c-149 0-289 137-289 282v21h71l-1-12a83 83 0 010-9c0-117 99-213 219-213a220 220 0 01188 104l-139 60a81 81 0 00-90-9 77 77 0 00-33 105 81 81 0 00108 33 77 77 0 0042-77l129-77a206 206 0 0114 74v9l-1 12h72v-12a252 252 0 00-26-118l39-24z"${3}/></g></svg>`;
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
var custom_custom109 = registerTemplate(tmpl$1B);
tmpl$1B.stylesheets = [];
tmpl$1B.stylesheetToken = "lwc-6d0tibvovoa";
freezeTemplate(tmpl$1B);

const $fragment1$1A = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M522 214l80 169 177 27c20 3 28 29 13 43L664 585l30 185c3 21-17 37-35 27l-159-88-159 88c-18 10-39-6-35-27l30-185-129-132c-14-15-6-40 13-43l178-27 80-169c9-19 35-19 44 0"${3}/></g></svg>`;
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
var custom_custom11 = registerTemplate(tmpl$1A);
tmpl$1A.stylesheets = [];
tmpl$1A.stylesheetToken = "lwc-1tcr3u9q0ko";
freezeTemplate(tmpl$1A);

const $fragment1$1z = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M617 202H383a60 60 0 00-61 60v475a61 61 0 0061 61h234a61 61 0 0062-61V262a60 60 0 00-62-60m-161 35h88c3 0 5 2 5 5a6 6 0 01-5 5h-88a5 5 0 110-10m78 518a6 6 0 01-7 5h-56a6 6 0 01-5-5v-25c0-2 3-6 5-6h56c4 0 7 2 7 6zm109-73a6 6 0 01-7 6H365a6 6 0 01-8-6V287a8 8 0 018-8h272c4 0 7 4 7 8v395z"${3}/></g></svg>`;
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
var custom_custom110 = registerTemplate(tmpl$1z);
tmpl$1z.stylesheets = [];
tmpl$1z.stylesheetToken = "lwc-1ljrths4jq4";
freezeTemplate(tmpl$1z);

const $fragment1$1y = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M534 451l-1-1c-24-10-57-37-108-46 13-13 23-35 33-61 6-14 5-27 5-45 0-13 2-34-1-46-11-40-39-51-72-51s-62 11-73 51c-3 12 0 33 0 46 0 18-1 31 5 46 10 25 20 47 32 61-50 9-84 35-107 45-47 21-47 44-47 44v76h237a201 201 0 0197-119m94 254a78 78 0 1178-78 78 78 0 01-78 78m172-60v-38l-5-2-42-13-11-27 21-45-28-28-5 3-39 20-27-11-16-48h-40l-1 5-14 42-27 11-46-21-27 27 2 6 20 39-11 26-47 17v39l6 2 41 14 11 27-22 46 28 27 5-3 39-20 27 12 17 47h39l2-6 13-41 27-12 45 22 28-28-3-5-20-39 11-27z"${3}/></g></svg>`;
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
var custom_custom111 = registerTemplate(tmpl$1y);
tmpl$1y.stylesheets = [];
tmpl$1y.stylesheetToken = "lwc-2i6dujakt6";
freezeTemplate(tmpl$1y);

const $fragment1$1x = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M511 502a567 567 0 00-257 0 73 73 0 00-50 65v52a72 72 0 0050 65l24 5 66 96c12 17 22 14 22-7v-79c49 1 98-3 145-15a73 73 0 0050-65v-52c-1-30-21-56-50-65m236-277a722 722 0 00-351 0 73 73 0 00-50 66v93a73 73 0 0050 66c64 16 130 23 196 21v109c0 21 10 25 21 7l90-128a670 670 0 0043-9 73 73 0 0050-66v-93a72 72 0 00-49-65z"${3}/></g></svg>`;
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
var custom_custom112 = registerTemplate(tmpl$1x);
tmpl$1x.stylesheets = [];
tmpl$1x.stylesheetToken = "lwc-56nulpinubq";
freezeTemplate(tmpl$1x);

const $fragment1$1w = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M271.6 590.4H729c3.4-.2 6-3 6-6.3v-316c0-6.7-5.2-9.8-11.9-9.8H277.5c-6.3 0-13 3.1-13 9.9v315.7c0 3.2 4 6.4 7.1 6.4zm39-279.5a6 6 0 015.8-5.9H683a6 6 0 016 6v227a6 6 0 01-6 5.8H316.2a6 6 0 01-6-5.9V311h.3zm484 422.5L736.2 615a6.6 6.6 0 00-5.1-3.6H268.8a6.6 6.6 0 00-5 3.6l-58.5 118.4a12.6 12.6 0 0010.5 18.5h568.4a12.6 12.6 0 0010.3-18.5zm-234.8-7.3H440.6a3.9 3.9 0 01-2.7-5.6l17-32.3c1-2 2.9-3.3 5-3.6h80.2c2 .1 4 1.1 5.1 2.8l17 33.1c1.2 2 0 5.6-2.4 5.6"${3}/></g></svg>`;
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
var custom_custom113 = registerTemplate(tmpl$1w);
tmpl$1w.stylesheets = [];
tmpl$1w.stylesheetToken = "lwc-6n7b7lo6ui2";
freezeTemplate(tmpl$1w);

const $fragment1$1v = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><circle cx="50" cy="50" r="30"${3}/></g></svg>`;
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
var custom_custom12 = registerTemplate(tmpl$1v);
tmpl$1v.stylesheets = [];
tmpl$1v.stylesheetToken = "lwc-34i8pnlhmu9";
freezeTemplate(tmpl$1v);

const $fragment1$1u = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M74 22H26a6 6 0 00-6 6v6c0 1.1.9 2 2 2h56a2 2 0 002-2v-6a6 6 0 00-6-6m0 20H26a2 2 0 00-2 2v28a6 6 0 006 6h40a6 6 0 006-6V44a2 2 0 00-2-2m-13 9a3 3 0 01-3 3H42a3 3 0 110-6h16a3 3 0 013 3"${3}/></g></svg>`;
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
var custom_custom13 = registerTemplate(tmpl$1u);
tmpl$1u.stylesheets = [];
tmpl$1u.stylesheetToken = "lwc-618ceakt22r";
freezeTemplate(tmpl$1u);

const $fragment1$1t = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M780 330h-60c-13 0-26-6-36-15l-48-41c-10-8-23-14-36-14H483c-15 0-29 6-40 17l-62 51c-5 4-5 12-1 17l19 18c13 10 30 12 43 3l55-33c7-5 17-3 23 3l173 168c4 4 7 10 7 16v45c0 12 9 25 20 25h60c11 0 20-9 20-21V350c0-12-9-20-20-20M610 510L502 405l-30 18c-15 9-32 14-49 14-21 0-43-8-60-22l-39-32c-9-7-14-15-15-26-2-11-10-17-20-17h-69c-11 0-20 6-20 18v182c0 12 9 20 20 20h40c3 0 7-11 11-16 15-20 37-31 61-34 24-2 47 6 66 23l125 114c11 10 19 21 24 35 3 7 11 9 16 4l47-47c24-24 42-80 20-106zm-251 74a28 28 0 00-42 4c-11 14-9 34 4 46l125 113c6 6 14 8 22 7s15-5 20-12c11-14 9-34-4-46z"${3}/></g></svg>`;
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
var custom_custom14 = registerTemplate(tmpl$1t);
tmpl$1t.stylesheets = [];
tmpl$1t.stylesheetToken = "lwc-21ron0k0nae";
freezeTemplate(tmpl$1t);

const $fragment1$1s = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M700 461c-35-15-40-28-40-42 0-15 10-28 22-39 21-19 32-45 32-75 0-56-35-105-98-105-54 0-87 36-96 82-1 4 1 8 4 10 45 32 73 86 73 151 0 45-15 86-43 117-4 5-3 13 4 16 17 7 37 17 57 28 6 4 13 6 20 6h115c28 0 50-22 50-49v-8c0-45-49-70-100-92M521 626c-42-17-48-33-48-50s12-33 26-46c24-22 38-52 38-88 0-66-42-123-116-123s-116 57-116 123c0 36 13 66 38 88 14 12 26 29 26 46s-6 32-48 50c-61 25-119 54-120 107v9c0 32 27 58 60 58h319c33 0 60-26 60-58v-9c0-53-58-82-119-107"${3}/></g></svg>`;
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
var custom_custom15 = registerTemplate(tmpl$1s);
tmpl$1s.stylesheets = [];
tmpl$1s.stylesheetToken = "lwc-6fck2o62bte";
freezeTemplate(tmpl$1s);

const $fragment1$1r = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M720 700h-10V480c0-11-9-20-20-20h-20c-11 0-20 9-20 20v220h-60V480c0-11-9-20-20-20h-20c-11 0-20 9-20 20v220h-60V480c0-11-9-20-20-20h-20c-11 0-20 9-20 20v220h-60V480c0-11-9-20-20-20h-20c-11 0-20 9-20 20v220h-10c-33 0-60 27-60 60v20c0 11 9 20 20 20h520c11 0 20-9 20-20v-20c0-33-27-60-60-60m50-356L523 208c-7-5-15-8-23-8s-16 3-23 8L230 344c-6 4-10 10-10 17v19c0 11 9 20 20 20h520c11 0 20-9 20-20v-18c0-7-4-14-10-18m-270 16c-28 0-50-22-50-50s22-50 50-50 50 22 50 50-22 50-50 50"${3}/></g></svg>`;
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
var custom_custom16 = registerTemplate(tmpl$1r);
tmpl$1r.stylesheets = [];
tmpl$1r.stylesheetToken = "lwc-qf0t700d2o";
freezeTemplate(tmpl$1r);

const $fragment1$1q = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M430 289c3 7 10 11 18 11h102c8 0 15-4 18-11l40-74c3-7-2-14-9-14H401c-7 0-12 8-9 14zm129 71H440c-99 0-180 81-180 180v200c0 33 27 60 60 60h359c33 0 61-27 61-60V540c0-99-82-180-181-180m-29 336v34c0 6-6 10-12 10h-40c-6 0-8-4-8-10v-33c-30-6-55-19-62-25-8-7-10-14-4-23l13-20c3-5 9-8 15-8 4 0 7 1 10 3h1c20 12 38 18 51 18 14 0 25-7 25-15 0-6-4-16-42-29-34-12-76-33-76-79 0-27 18-59 68-69v-30c0-6 3-10 8-10h40c6 0 12 4 12 10v30c20 5 42 15 49 20 4 2 6 7 7 12s-1 10-4 13l-15 18c-4 5-11 9-17 9l-9-2c-20-11-37-17-48-17-17 0-24 8-24 13 0 7 4 15 38 27 42 14 89 36 89 83 1 32-25 61-65 70"${3}/></g></svg>`;
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
var custom_custom17 = registerTemplate(tmpl$1q);
tmpl$1q.stylesheets = [];
tmpl$1q.stylesheetToken = "lwc-2pj382fbvg7";
freezeTemplate(tmpl$1q);

const $fragment1$1p = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M600 360h106c8 0 14-6 14-14 0-4-1-7-4-10L584 204c-3-3-6-4-10-4-8 0-14 6-14 14v106c0 22 18 40 40 40m234 136l-12-12c-8-8-20-8-28 0L640 639v37c0 3 0 5 3 5h33l4-1 154-154c8-10 8-22 0-30M709 740h-91c-21 0-38-17-38-38v-70c0-11 3-21 11-28l123-124c4-4 6-9 6-14v-26c0-11-9-20-20-20H560c-33 0-60-27-60-60V220c0-11-9-20-20-20H280c-33 0-60 27-60 60v480c0 33 27 60 60 60h380c29 0 54-21 59-48 1-6-4-12-10-12M300 380c0-11 9-20 20-20h80c11 0 20 9 20 20v20c0 11-9 20-20 20h-80c-11 0-20-9-20-20zm200 260c0 11-9 20-20 20H320c-11 0-20-9-20-20v-20c0-11 9-20 20-20h160c11 0 20 9 20 20zm40-120c0 11-9 20-20 20H320c-11 0-20-9-20-20v-20c0-11 9-20 20-20h200c11 0 20 9 20 20z"${3}/></g></svg>`;
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
var custom_custom18 = registerTemplate(tmpl$1p);
tmpl$1p.stylesheets = [];
tmpl$1p.stylesheetToken = "lwc-uhm3m995m5";
freezeTemplate(tmpl$1p);

const $fragment1$1o = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M792 328c-2-7-11-9-17-4L674 425c-8 8-20 8-28 0l-71-71c-8-8-8-20 0-28l102-102c5-5 3-14-4-17-17-4-35-7-53-7a180 180 0 00-167 247L220 681a71 71 0 0050 120c18 0 36-7 50-21l233-233a180 180 0 00239-219"${3}/></g></svg>`;
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
var custom_custom19 = registerTemplate(tmpl$1o);
tmpl$1o.stylesheets = [];
tmpl$1o.stylesheetToken = "lwc-4raarrhdat7";
freezeTemplate(tmpl$1o);

const $fragment1$1n = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M590 220c-30-20-138-39-180 30-20 33 4 91 22 128 5 9 15 14 25 10a122 122 0 0173-4c9 2 18-2 22-10 7-13 19-28 38-44 50-40 30-90 0-110m-52 394a121 121 0 01-73 1c-9-3-19 2-23 10-7 13-19 29-39 45-50 40-30 91 0 111s139 39 180-30c19-32-3-90-21-127-5-9-15-13-24-10m212-204c-33-20-91 4-128 22-9 5-14 15-10 25a122 122 0 014 73c-2 9 2 18 10 22 13 7 28 19 44 38 40 50 90 30 110 0s39-139-30-180M386 538a121 121 0 01-1-73c3-9-2-19-10-23-13-7-29-19-45-39-40-50-91-30-111 0s-39 138 30 180c32 19 90-3 127-21 9-5 13-15 10-24"${3}/><circle cx="500" cy="500" r="60"${3}/></g></svg>`;
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
var custom_custom2 = registerTemplate(tmpl$1n);
tmpl$1n.stylesheets = [];
tmpl$1n.stylesheetToken = "lwc-50gm2s2jnvh";
freezeTemplate(tmpl$1n);

const $fragment1$1m = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M380 477c0-8-10-13-16-8L224 577a60 60 0 00-24 48v41c0 7 7 12 13 9l154-58c8-3 13-10 13-19zm221 280l-41-27V276c0-27-29-57-48-72-7-6-18-6-25 0-18 15-48 45-48 72v454l-46 30c-8 6-14 15-14 25v6c0 5 4 9 9 9h221c5 0 11-4 11-9 0-14-8-26-19-34m175-180L636 469c-7-5-16 0-16 8v122c0 8 5 16 13 19l154 58c7 2 13-2 13-9v-41c0-20-9-38-24-49"${3}/></g></svg>`;
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
var custom_custom20 = registerTemplate(tmpl$1m);
tmpl$1m.stylesheets = [];
tmpl$1m.stylesheetToken = "lwc-blu9j06mm7";
freezeTemplate(tmpl$1m);

const $fragment1$1l = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M576 711c-3-7-10-11-18-11H442c-8 0-15 4-18 11l-27 74c-3 7 2 14 9 14h188c7 0 12-8 9-14zm164-511H260c-33 0-60 27-60 60v320c0 33 27 60 60 60h480c33 0 60-27 60-60V260c0-33-27-60-60-60M500 620c-17 0-30-13-30-30s13-30 30-30 30 13 30 30-13 30-30 30m240-100c0 11-9 20-20 20H280c-11 0-20-9-20-20V280c0-11 9-20 20-20h440c11 0 20 9 20 20z"${3}/></g></svg>`;
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
var custom_custom21 = registerTemplate(tmpl$1l);
tmpl$1l.stylesheets = [];
tmpl$1l.stylesheetToken = "lwc-2p29mqi1ive";
freezeTemplate(tmpl$1l);

const $fragment1$1k = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M777 639l-62-50a60 60 0 00-73-2l-59 43c-8 6-19 5-26-2l-97-88-89-98c-7-7-8-18-2-26l43-59c16-22 15-52-2-73l-50-62c-22-28-64-30-89-5l-54 54c-12 12-18 29-18 45 7 127 65 248 150 333s205 143 333 150c17 1 33-6 45-18l54-54c27-24 24-66-4-88"${3}/></g></svg>`;
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
var custom_custom22 = registerTemplate(tmpl$1k);
tmpl$1k.stylesheets = [];
tmpl$1k.stylesheetToken = "lwc-4srtnmkacq8";
freezeTemplate(tmpl$1k);

const $fragment1$1j = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M487 560c8 7 19 7 27 0l283-262c5-10 4-26-16-26l-560 1c-15 0-27 14-16 26zm313-150c0-13-16-20-25-11L555 603a78 78 0 01-54 21c-20 0-39-7-54-21L226 399a15 15 0 00-25 11v260c0 33 27 60 60 60h480c33 0 60-27 60-60z"${3}/></g></svg>`;
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
var custom_custom23 = registerTemplate(tmpl$1j);
tmpl$1j.stylesheets = [];
tmpl$1j.stylesheetToken = "lwc-3qdi48kpcmt";
freezeTemplate(tmpl$1j);

const $fragment1$1i = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M68.1 20H31.9a6 6 0 00-5.9 5.9v.1c0 1.1.9 2 2 2h44a2 2 0 002-2v-.1a6 6 0 00-5.9-5.9M68 34H32a2 2 0 00-2 2v42c0 1.1.9 2 2 2h11.1c1.1 0 1.9-.9 1.9-2v-8c0-1.1 1-2 2.1-2h5.8c1.1 0 2.1.9 2.1 2v8c0 1.1.8 2 1.9 2H68a2 2 0 002-2V36a2 2 0 00-2-2M47 61a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4c0-1.1.9-2 2-2h4a2 2 0 012 2zm0-14a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4c0-1.1.9-2 2-2h4a2 2 0 012 2zm14 14a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4c0-1.1.9-2 2-2h4a2 2 0 012 2zm0-14a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4c0-1.1.9-2 2-2h4a2 2 0 012 2z"${3}/></g></svg>`;
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
var custom_custom24 = registerTemplate(tmpl$1i);
tmpl$1i.stylesheets = [];
tmpl$1i.stylesheetToken = "lwc-1eactscdke5";
freezeTemplate(tmpl$1i);

const $fragment1$1h = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M798 273a90 90 0 00-147-52c-6 5-5 13 2 17 46 24 85 59 115 101 4 6 13 6 17 0 13-19 18-42 13-66m-452-35c6-3 7-12 2-17a90 90 0 00-147 52c-4 24 1 47 13 65 4 6 13 6 17 0 30-41 69-76 115-100m154 22a270 270 0 00-217 430l-41 41a40 40 0 000 57c8 8 18 12 28 12s20-4 28-12l41-41a272 272 0 00321 0l41 41c9 8 19 12 29 12s20-4 28-12c16-16 16-41 0-57l-41-41a270 270 0 00-217-430M310 530a190 190 0 11380 0 190 190 0 01-380 0m220-12v-78c0-17-13-30-30-30s-30 13-30 30v90c0 8 3 16 9 21l70 70c6 6 14 9 21 9s15-3 21-9c12-12 12-31 0-42z"${3}/></g></svg>`;
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
var custom_custom25 = registerTemplate(tmpl$1h);
tmpl$1h.stylesheets = [];
tmpl$1h.stylesheetToken = "lwc-71sjjljfvkr";
freezeTemplate(tmpl$1h);

const $fragment1$1g = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M260 200a60 60 0 00-40 105v455c0 22 18 40 40 40s40-18 40-40V305a60 60 0 00-40-105m525 108c-157 82-264-59-412-5-8 3-13 10-13 19v258c0 13 13 23 26 19 142-43 249 91 404 6 6-3 10-10 10-17V317c0-8-8-13-15-9"${3}/></g></svg>`;
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
var custom_custom26 = registerTemplate(tmpl$1g);
tmpl$1g.stylesheets = [];
tmpl$1g.stylesheetToken = "lwc-osu1n2l2sd";
freezeTemplate(tmpl$1g);

const $fragment1$1f = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M24 63h52a2 2 0 002-2V29a6 6 0 00-6-6H28a6 6 0 00-6 6v32c0 1.1.9 2 2 2m4-32c0-1.1.9-2 2-2h40a2 2 0 012 2v24a2 2 0 01-2 2H30a2 2 0 01-2-2zm52 38H58a2 2 0 00-2 2 2 2 0 01-2 2h-8a2 2 0 01-2-2 2 2 0 00-2-2H20a2 2 0 00-2 2 6 6 0 006 6h52a6 6 0 006-6 2 2 0 00-2-2"${3}/></g></svg>`;
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
var custom_custom27 = registerTemplate(tmpl$1f);
tmpl$1f.stylesheets = [];
tmpl$1f.stylesheetToken = "lwc-1hh5fkh2t43";
freezeTemplate(tmpl$1f);

const $fragment1$1e = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M64 20H36a6 6 0 00-6 6v48a6 6 0 006 6h28a6 6 0 006-6V26a6 6 0 00-6-6M50 78c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3m14-10a2 2 0 01-2 2H38a2 2 0 01-2-2V30c0-1.1.9-2 2-2h24a2 2 0 012 2z"${3}/></g></svg>`;
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
var custom_custom28 = registerTemplate(tmpl$1e);
tmpl$1e.stylesheets = [];
tmpl$1e.stylesheetToken = "lwc-45j1ctlaepo";
freezeTemplate(tmpl$1e);

const $fragment1$1d = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M739 280h-18c-12 0-21 10-21 22v398l1 4 25 35c2 2 5 2 8 0l25-35 1-4V302c0-12-9-22-21-22m-159-80H300c-33 0-60 27-60 60v480c0 33 27 60 60 60h280c33 0 60-27 60-60V260c0-33-27-60-60-60M440 780c-17 0-30-13-30-30s13-30 30-30 30 13 30 30-13 30-30 30m140-100c0 11-9 20-20 20H320c-11 0-20-9-20-20V300c0-11 9-20 20-20h240c11 0 20 9 20 20z"${3}/></g></svg>`;
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
var custom_custom29 = registerTemplate(tmpl$1d);
tmpl$1d.stylesheets = [];
tmpl$1d.stylesheetToken = "lwc-4ccutsn0mh7";
freezeTemplate(tmpl$1d);

const $fragment1$1c = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M500 380c-66 0-120 54-120 120s54 120 120 120 120-54 120-120-54-120-120-120m300 120c0-35-84-53-97-84-13-32 33-104 9-128s-96 22-128 9c-31-13-49-97-84-97s-53 84-84 97c-32 13-104-33-128-9s22 96 9 128c-13 31-97 49-97 84s84 53 97 84c13 32-33 104-9 128s96-22 128-9c31 13 49 97 84 97s53-84 84-97c32-13 104 33 128 9s-22-96-9-128c13-31 97-49 97-84M500 680c-99 0-180-81-180-180s81-180 180-180 180 81 180 180-81 180-180 180"${3}/></g></svg>`;
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
var custom_custom3 = registerTemplate(tmpl$1c);
tmpl$1c.stylesheets = [];
tmpl$1c.stylesheetToken = "lwc-6k6hc4seasc";
freezeTemplate(tmpl$1c);

const $fragment1$1b = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M71.5 28.5A28.8 28.8 0 0051 20c-1.7 0-3 1.3-3 3s1.3 3 3 3c6.1 0 11.9 2.4 16.3 6.7A23.3 23.3 0 0174 49c0 1.7 1.3 3 3 3s3-1.3 3-3c0-7.7-3-15-8.5-20.5M51 32c-1.7 0-3 1.3-3 3s1.3 3 3 3a11 11 0 0111 11c0 1.7 1.3 3 3 3s3-1.3 3-3a17 17 0 00-17-17m-4.3 28.7l2.6-7a5 5 0 005.3-1.1c2-2 2-5.1 0-7.1s-5.1-2-7.1 0a5 5 0 00-1 5.6L40 54 28.3 42.3c-.8-.8-2.2-.8-2.9.1-7.5 9-7 22.4 1.5 30.8a23 23 0 0030.8 1.5c.9-.7.9-2.1.1-2.9z"${3}/></g></svg>`;
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
var custom_custom30 = registerTemplate(tmpl$1b);
tmpl$1b.stylesheets = [];
tmpl$1b.stylesheetToken = "lwc-6rqb5l1oe44";
freezeTemplate(tmpl$1b);

const $fragment1$1a = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M75.5 43.2l-4.9-15.4A6.9 6.9 0 0064 23H36a7 7 0 00-6.7 4.8l-4.8 15.4A6 6 0 0020 49v12c0 2.6 1.7 4.8 4 5.7V75c0 1.1.9 2 2 2h8a2 2 0 002-2v-8h28v8c0 1.1.9 2 2 2h8a2 2 0 002-2v-8.3a6 6 0 004-5.7V49a6 6 0 00-4.5-5.8M30 60c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5m22-17H32.2c-.7 0-1.2-.7-1-1.3l3.8-12c.1-.4.5-.7.9-.7h28c.4 0 .8.3.9.6l3.8 12.1c.2.6-.3 1.3-1 1.3zm17 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5"${3}/></g></svg>`;
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
var custom_custom31 = registerTemplate(tmpl$1a);
tmpl$1a.stylesheets = [];
tmpl$1a.stylesheetToken = "lwc-1plcetmbv08";
freezeTemplate(tmpl$1a);

const $fragment1$19 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M78.5 35.3L55.1 48.6c-.5.3-1 .4-1.5.4a3 3 0 01-2.7-1.7c-.7-1.4 0-3.2 1.4-4l7.8-4.4v-7.7c0-.8-.8-1.2-1.5-.9L30.1 46.6c-.5.3-1 .4-1.5.4-1 0-2.1-.5-2.6-1.5a3 3 0 011.1-4.1l4.9-2.8V22a2 2 0 00-2-2h-8a2 2 0 00-2 2v52a6 6 0 006 6h17a2 2 0 002-2v-7c0-1.1.9-2 2-2h6a2 2 0 012 2v7c0 1.1.9 2 2 2h17a6 6 0 006-6V36.2c0-.8-.8-1.3-1.5-.9M35 63a2 2 0 01-2 2h-2a2 2 0 01-2-2v-6c0-1.1.9-2 2-2h2a2 2 0 012 2zm12 0a2 2 0 01-2 2h-2a2 2 0 01-2-2v-6c0-1.1.9-2 2-2h2a2 2 0 012 2zm12 0a2 2 0 01-2 2h-2a2 2 0 01-2-2v-6c0-1.1.9-2 2-2h2a2 2 0 012 2zm12 0a2 2 0 01-2 2h-2a2 2 0 01-2-2v-6c0-1.1.9-2 2-2h2a2 2 0 012 2z"${3}/></g></svg>`;
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
var custom_custom32 = registerTemplate(tmpl$19);
tmpl$19.stylesheets = [];
tmpl$19.stylesheetToken = "lwc-76ls5a3db17";
freezeTemplate(tmpl$19);

const $fragment1$18 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M65 42H36a2 2 0 00-2 2v8c0 1.1.9 2 2 2h29a2 2 0 002-2v-8a2 2 0 00-2-2m-14 9c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3m29-23H20a2 2 0 00-2 2v2a4 4 0 004 4v36c0 1.1.9 2 2 2h2a2 2 0 002-2V36h45v36c0 1.1.9 2 2 2h2a2 2 0 002-2V36h-1a4 4 0 004-4v-2a2 2 0 00-2-2"${3}/></g></svg>`;
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
var custom_custom33 = registerTemplate(tmpl$18);
tmpl$18.stylesheets = [];
tmpl$18.stylesheetToken = "lwc-2g1e1rhb2dd";
freezeTemplate(tmpl$18);

const $fragment1$17 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M420 300h160c11 0 20-11 18-22-10-45-50-78-98-78s-88 34-98 78c-2 11 7 22 18 22m350 260c17 0 31-14 30-32-1-16-15-28-32-28h-88v-50c58-23 99-85 100-159 0-15-10-28-25-31-19-3-35 11-35 30 0 43-20 80-49 98a61 61 0 00-51-28H380c-21 0-40 11-51 28-29-18-49-54-49-96 0-16-12-31-28-32-18-1-32 13-32 30 0 74 42 137 100 160v50h-88c-16 0-31 12-32 28-1 17 13 32 30 32h90v50c-58 23-99 85-100 159 0 15 10 28 25 31 19 3 35-11 35-30 0-42 19-79 48-97 17 56 61 100 116 118 13 4 26-6 26-19V532c0-16 12-31 28-32 17-1 32 13 32 30v242c0 14 13 23 26 19 55-18 99-62 116-118 28 18 47 54 48 95 0 16 12 31 28 32 18 1 32-13 32-30 0-74-42-137-100-160v-50z"${3}/></g></svg>`;
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
var custom_custom34 = registerTemplate(tmpl$17);
tmpl$17.stylesheets = [];
tmpl$17.stylesheetToken = "lwc-2lkpgtmgtg5";
freezeTemplate(tmpl$17);

const $fragment1$16 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M69 40a3 3 0 00-3 3v5c0 8.8-7.2 16-16 16s-16-7.2-16-16v-5c0-1.7-1.3-3-3-3s-3 1.3-3 3v5a22 22 0 0019 21.8V74h-5c-1.7 0-3 1.3-3 3s1.3 3 3 3h16c1.7 0 3-1.3 3-3s-1.3-3-3-3h-5v-4.2A22 22 0 0072 48v-5a3 3 0 00-3-3M50 58a10 10 0 0010-10V29.9a9.9 9.9 0 00-9.9-9.9h-.2a9.9 9.9 0 00-9.9 9.9V48a10 10 0 0010 10"${3}/></g></svg>`;
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
var custom_custom35 = registerTemplate(tmpl$16);
tmpl$16.stylesheets = [];
tmpl$16.stylesheetToken = "lwc-5qad3g0r5gb";
freezeTemplate(tmpl$16);

const $fragment1$15 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M38.7 72h-4.1a2 2 0 00-1.7 1l-1.4 2.4c-.8 1.4-.5 3.2.8 4.1.5.4 1.1.5 1.7.5 1 0 2-.5 2.6-1.5l3-5c.4-.7-.1-1.5-.9-1.5m28.4 1a2 2 0 00-1.7-1h-4.1c-.8 0-1.3.8-.9 1.5l3 5A3 3 0 0066 80c.6 0 1.2-.2 1.7-.5 1.3-.9 1.6-2.8.8-4.1zM67 20H33a6 6 0 00-6 6v34a6 6 0 006 6h34a6 6 0 006-6V26a6 6 0 00-6-6M36 62c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3m28 0c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3m3-12a2 2 0 01-2 2H35a2 2 0 01-2-2V30c0-1.1.9-2 2-2h30a2 2 0 012 2z"${3}/></g></svg>`;
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
var custom_custom36 = registerTemplate(tmpl$15);
tmpl$15.stylesheets = [];
tmpl$15.stylesheetToken = "lwc-fgigdqavrq";
freezeTemplate(tmpl$15);

const $fragment1$14 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M80 56H67V44.2c2.7 2.3 6.2 3.8 10 3.8 1.7 0 3-1.3 3-3s-1.3-3-3-3c-5.5 0-10-4.9-10-11v-3a2 2 0 002-2v-2a2 2 0 00-2-2h-6a2 2 0 00-2 2v2c0 1.1.9 2 2 2v3a11 11 0 11-22 0v-3a2 2 0 002-2v-2a2 2 0 00-2-2h-6a2 2 0 00-2 2v2c0 1.1.9 2 2 2v3c0 6.1-4.5 11-10 11-1.7 0-3 1.3-3 3s1.3 3 3 3a15 15 0 0010-3.8V56H20a2 2 0 00-2 2v4.8c0 1.1.9 2.2 2 2.2h4v10.8c0 1.1.9 2.2 2 2.2h6c1.1 0 2-1.1 2-2.2v-4c0-3.3 2.7-5.8 6-5.8h20c3.3 0 6 2.5 6 5.8v4c0 1.1.9 2.2 2 2.2h6c1.1 0 2-1.1 2-2.2V65h4c1.1 0 2-1.1 2-2.2V58a2 2 0 00-2-2M39 43.9c3 2.5 6.8 4.1 11 4.1a16.6 16.6 0 0011-4.1V56H39z"${3}/></g></svg>`;
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
var custom_custom37 = registerTemplate(tmpl$14);
tmpl$14.stylesheets = [];
tmpl$14.stylesheetToken = "lwc-2qa10ajkjha";
freezeTemplate(tmpl$14);

const $fragment1$13 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M50 45a8 8 0 100 16 8 8 0 100-16m24-10h-8.1c-.8 0-1.5-.4-1.8-1.2l-2.6-5.5a6 6 0 00-5.4-3.3H43.9a6 6 0 00-5.4 3.3l-2.6 5.5a2 2 0 01-1.8 1.2H26a6 6 0 00-6 6v28a6 6 0 006 6h48a6 6 0 006-6V41a6 6 0 00-6-6M50 67.2c-7.7 0-14-6.3-14-14s6.3-14 14-14 14 6.3 14 14-6.3 14-14 14"${3}/></g></svg>`;
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
var custom_custom38 = registerTemplate(tmpl$13);
tmpl$13.stylesheets = [];
tmpl$13.stylesheetToken = "lwc-729qiirkdae";
freezeTemplate(tmpl$13);

const $fragment1$12 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M636 286c-2-8-11-13-19-11L214 405c-10 3-15 14-13 24l16 62c3 10 13 17 23 15l102-14c3 11 8 22 15 31l-87 236c-6 16 2 33 18 39l10 2c12 0 24-8 28-20l82-224c7 2 13 2 20 2l20-2 83 224c4 12 16 20 28 20l10-2c16-6 24-23 18-39l-87-237c11-15 18-34 18-54v-1l141-20c9-1 15-10 12-19zm163 141l-55-204c-4-16-21-26-37-22s-26 21-22 37l55 204c4 16 21 26 37 22s26-21 22-37"${3}/></g></svg>`;
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
var custom_custom39 = registerTemplate(tmpl$12);
tmpl$12.stylesheets = [];
tmpl$12.stylesheetToken = "lwc-5orgom55h9";
freezeTemplate(tmpl$12);

const $fragment1$11 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M262 327l208-119c19-11 43-11 62 0l207 119c19 11 31 32 31 54v238c0 22-11 43-31 54L532 792a62 62 0 01-62 0L262 673a64 64 0 01-32-54V381c0-22 13-43 32-54"${3}/></g></svg>`;
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
var custom_custom4 = registerTemplate(tmpl$11);
tmpl$11.stylesheets = [];
tmpl$11.stylesheetToken = "lwc-5r1n7indujr";
freezeTemplate(tmpl$11);

const $fragment1$10 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M74 28H26a6 6 0 00-6 6v34a6 6 0 006 6h48a6 6 0 006-6V34a6 6 0 00-6-6m0 6v6H26v-6zM26 68V50h48v18zm17.1-13c-1.4 0-2.6.7-3.3 1.8-.1.2-.4.2-.5 0A3.9 3.9 0 0036 55c-2.2 0-4 1.8-4 4s1.8 4 4 4c1.4 0 2.6-.7 3.3-1.8.1-.2.4-.2.5 0a3.9 3.9 0 003.3 1.8h.1c2.1 0 3.9-1.7 3.9-3.9v-.2a4 4 0 00-4-3.9M66 56H54a2 2 0 00-2 2v2c0 1.1.9 2 2 2h12a2 2 0 002-2v-2a2 2 0 00-2-2"${3}/></g></svg>`;
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
var custom_custom40 = registerTemplate(tmpl$10);
tmpl$10.stylesheets = [];
tmpl$10.stylesheetToken = "lwc-332gc46ujdh";
freezeTemplate(tmpl$10);

const $fragment1$$ = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M76 29H24a6 6 0 00-6 6v29a6 6 0 006 6h52a6 6 0 006-6V35a6 6 0 00-6-6M31 64a7 7 0 00-7-7V42a7 7 0 007-7h38a7 7 0 007 7v15a7 7 0 00-7 7z"${3}/><circle cx="50" cy="49" r="10"${3}/></g></svg>`;
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
var custom_custom41 = registerTemplate(tmpl$$);
tmpl$$.stylesheets = [];
tmpl$$.stylesheetToken = "lwc-22dso5jtqno";
freezeTemplate(tmpl$$);

const $fragment1$_ = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M74 22H26a6 6 0 00-6 6v6c0 1.1.9 2 2 2h56a2 2 0 002-2v-6a6 6 0 00-6-6m0 20H26a2 2 0 00-2 2v28a6 6 0 006 6h40a6 6 0 006-6V44a2 2 0 00-2-2m-13 9a3 3 0 01-3 3H42a3 3 0 110-6h16a3 3 0 013 3"${3}/></g></svg>`;
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
var custom_custom42 = registerTemplate(tmpl$_);
tmpl$_.stylesheets = [];
tmpl$_.stylesheetToken = "lwc-2ua4ptpv1h9";
freezeTemplate(tmpl$_);

const $fragment1$Z = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M817 432l2-6v-14l-1-3-1-2-2-3-1-2-120-170c-5-7-14-12-24-12H310c-10 0-19 5-25 13L165 403l-1 2-2 3-1 2-1 3v14l2 5v1l2 4 1 2 2 2 300 330 1 1 1 1 1 1 1 1 2 1 1 1 1 1 1 1h21l1-1 1-1 1-1 1-1 2-1 1-1 1-1 1-1 1-1 300-330 2-2 1-2c6-1 7-2 7-4m-327-42h-48l48-81 48 81zm0 60h60l-60 197-60-197zm52-170h75l-28 80zm-151 80l-28-80h75zm-23 90l55 181-165-181zm244 0h110L557 631zm120-60h-90l30-85zm-424-85l30 85h-90z"${3}/></g></svg>`;
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
var custom_custom43 = registerTemplate(tmpl$Z);
tmpl$Z.stylesheets = [];
tmpl$Z.stylesheetToken = "lwc-5bkbkqqk87u";
freezeTemplate(tmpl$Z);

const $fragment1$Y = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M69.7 28.9C64.4 22.3 60.1 20 51 20c-4.1 0-9 1.6-11 2a2 2 0 00-2-2h-4a2 2 0 00-2 2v8c0 1.1.9 2 2 2h4a2 2 0 002-2h2.1c1.6 0 2.9 1.3 2.9 2.9v.1a3 3 0 003 3v16a4 4 0 00-4 4v18a6 6 0 006 6h2a6 6 0 006-6V56a4 4 0 00-4-4V36c1.7 0 3-2.2 3-3.9V32c0-1.5 1.2-2.7 2.7-2.8a10 10 0 017.3 2.3c.6.5 1.6.6 2.2.1 1-.6 1.2-1.8.5-2.7"${3}/></g></svg>`;
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
var custom_custom44 = registerTemplate(tmpl$Y);
tmpl$Y.stylesheets = [];
tmpl$Y.stylesheetToken = "lwc-ngs67obfea";
freezeTemplate(tmpl$Y);

const $fragment1$X = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M33 43h34v14H33zm49-1.7V36a6 6 0 00-6-6H24a6 6 0 00-6 6v5.3a2 2 0 001 1.7 8 8 0 014 6.9c0 3-1.6 5.5-4 6.9-.6.4-1 1-1 1.7V64a6 6 0 006 6h52a6 6 0 006-6v-5.3a2 2 0 00-1-1.7 8 8 0 01-4-6.9c0-3 1.6-5.5 4-6.9.6-.5 1-1.1 1-1.9M71 63H29a2 2 0 01-2-2V39c0-1.1.9-2 2-2h42a2 2 0 012 2v22a2 2 0 01-2 2"${3}/></g></svg>`;
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
var custom_custom45 = registerTemplate(tmpl$X);
tmpl$X.stylesheets = [];
tmpl$X.stylesheetToken = "lwc-3outrcf8d5l";
freezeTemplate(tmpl$X);

const $fragment1$W = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M610 370H390c-11 0-20 9-20 20v220c0 11 9 20 20 20h220c11 0 20-9 20-20V390c0-11-9-20-20-20m175-98c9-3 15-10 15-19v-33c0-11-9-20-20-20h-33c-9 0-16 6-19 15-6 20-25 35-48 35s-41-15-48-35c-3-9-10-15-19-15h-46c-9 0-16 6-19 15-6 20-25 35-48 35s-41-15-48-35c-3-9-10-15-19-15h-46c-9 0-16 6-19 15-6 20-25 35-48 35-22 0-41-15-48-35-3-9-10-15-19-15h-33c-11 0-20 9-20 20v33c0 9 6 16 15 19 20 6 35 25 35 48s-15 41-35 48c-9 3-15 10-15 19v46c0 9 6 16 15 19 20 6 35 25 35 48s-15 41-35 48c-9 3-15 10-15 19v46c0 9 6 16 15 19 20 6 35 25 35 48s-15 41-35 48c-9 3-15 10-15 19v33c0 11 9 20 20 20h33c9 0 16-6 19-15 6-20 25-35 48-35 22 0 41 15 48 35 3 9 10 15 19 15h46c9 0 16-6 19-15 6-20 25-35 48-35s41 15 48 35c3 9 10 15 19 15h46c9 0 16-6 19-15 6-20 25-35 48-35s41 15 48 35c3 9 10 15 19 15h33c11 0 20-9 20-20v-33c0-9-6-16-15-19-20-6-35-25-35-48s15-41 35-48c9-3 15-10 15-19v-46c0-9-6-16-15-19-20-6-35-25-35-48s15-41 35-48c9-3 15-10 15-19v-46c0-9-6-16-15-19-20-6-35-25-35-48s15-41 35-48m-95 358c0 33-27 60-60 60H370c-33 0-60-27-60-60V370c0-33 27-60 60-60h260c33 0 60 27 60 60z"${3}/></g></svg>`;
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
var custom_custom46 = registerTemplate(tmpl$W);
tmpl$W.stylesheets = [];
tmpl$W.stylesheetToken = "lwc-718repla85b";
freezeTemplate(tmpl$W);

const $fragment1$V = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M640 720H300c-33 0-60 27-60 60v1c0 10 9 19 19 19h422c10 0 19-9 19-19v-1c0-33-27-60-60-60m134-316L615 256l26-39c4-6 1-14-6-15-49-10-79 24-79 24-308 0-258 339-243 418 2 9 10 16 20 16h271c8 0 13-10 8-16-55-67-84-142-102-190-3-8 5-17 13-13 73 37 103-3 152 28 24 15 54 11 74-9l27-27c6-8 6-21-2-29m-204-34c-17 0-30-13-30-30s13-30 30-30 30 13 30 30-13 30-30 30"${3}/></g></svg>`;
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
var custom_custom47 = registerTemplate(tmpl$V);
tmpl$V.stylesheets = [];
tmpl$V.stylesheetToken = "lwc-2jmonrirhd8";
freezeTemplate(tmpl$V);

const $fragment1$U = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M78 24H68v-2a2 2 0 00-2-2H34a2 2 0 00-2 2v2H22a2 2 0 00-2 2v13c0 5 4 9 9 9h4.6a18 18 0 0016.3 11c7.6.1 14-4.5 16.7-11H71c5 0 9-4 9-9V26a2 2 0 00-2-2M29 42a3 3 0 01-3-3v-9h6v10.6l.1 1.4zm45-3a3 3 0 01-3 3h-3.1l.1-1.3V30h6zM60 74h-1a6 6 0 01-6-6v-2c0-.6-.4-1-1-1h-4c-.6 0-1 .4-1 1v2a6 6 0 01-6 6h-1a2 2 0 00-2 2v2c0 1.1.9 2 2 2h20a2 2 0 002-2v-2a2 2 0 00-2-2"${3}/></g></svg>`;
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
var custom_custom48 = registerTemplate(tmpl$U);
tmpl$U.stylesheets = [];
tmpl$U.stylesheetToken = "lwc-49e1sr9mkr8";
freezeTemplate(tmpl$U);

const $fragment1$T = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M50 41c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9m0 14c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5"${3}/><path d="M50 20a30 30 0 100 60 30 30 0 000-60m0 52.9a2 2 0 01-2.2 2A25.1 25.1 0 0125 52.1c0-1.1.9-2.1 2.1-2.1h2c1 0 1.9.8 2 1.8.9 9 8.1 16.2 17.1 17.1a2 2 0 011.8 2zm0-7.9a15 15 0 110-30 15 15 0 010 30m22.9-15h-2a2 2 0 01-2-1.8c-.9-9-8.1-16.2-17.1-17.1a2 2 0 01-1.8-2v-2a2 2 0 012.2-2A25.1 25.1 0 0175 47.9c0 1.1-.9 2.1-2.1 2.1"${3}/></g></svg>`;
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
var custom_custom49 = registerTemplate(tmpl$T);
tmpl$T.stylesheets = [];
tmpl$T.stylesheetToken = "lwc-42th9pv101m";
freezeTemplate(tmpl$T);

const $fragment1$S = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M788 255a497 497 0 00-325-14c-93 31-188 100-202 204a207 207 0 0013 99l7 16-12 18c-29 45-49 96-61 148-5 22-17 54 6 70 9 6 22 6 31 1 12-7 14-19 16-32 9-53 27-106 56-151 14-22 29-44 46-64 15-16 37-47 62-38s24 38 7 53-31 31-31 55c0 18 8 36 23 48 20 16 60 20 84 18 53-3 96-19 139-50 56-39 78-107 89-172 7-40 12-80 26-118 6-16 14-32 23-46 4-7 12-15 14-23 3-10-3-19-11-22"${3}/></g></svg>`;
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
var custom_custom5 = registerTemplate(tmpl$S);
tmpl$S.stylesheets = [];
tmpl$S.stylesheetToken = "lwc-1tgg2j6nomg";
freezeTemplate(tmpl$S);

const $fragment1$R = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M766 563a176 176 0 01-166-7c-3-2-7-2-10 0a183 183 0 01-180 0c-3-2-7-2-10 0-26 16-57 24-90 24-27 0-53-6-76-17-6-3-14 2-14 9v121c0 24 14 45 36 55 50 22 104 38 161 46 12 2 23-8 23-20v-75c0-33 27-59 59-59h1c33 0 59 27 59 59v75c0 12 11 21 23 20 56-8 110-24 161-46 22-10 36-31 36-55V572c1-7-7-12-13-9m-456-43c36 0 67-15 87-39 4-5 11-5 15 0 20 24 52 39 87 39 36 0 67-15 87-39 4-5 11-5 15 0 20 24 52 39 87 39 56 0 103-39 109-88 1-7-2-14-8-18L536 214a60 60 0 00-74 0L207 414c-6 4-8 11-8 18 8 50 55 88 111 88"${3}/></g></svg>`;
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
var custom_custom50 = registerTemplate(tmpl$R);
tmpl$R.stylesheets = [];
tmpl$R.stylesheetToken = "lwc-7jq9pvqr7t8";
freezeTemplate(tmpl$R);

const $fragment1$Q = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M405 256c25 17 50 58 60 89 2 7 8 12 15 13 7 2 13 2 20 2 11 0 20 0 29-4 26-9 48-20 67-39 31-31 42-75 30-112-37-11-81-1-112 30-9 9-16 19-22 30-16-25-35-47-57-61-15-9-34-4-43 11-6 15 0 32 13 41m307 146c-103-58-125 20-212 20s-109-78-212-20c-100 57-71 241-31 310 36 61 101 124 234 64 5-2 12-2 17 0 133 60 199-3 234-64 41-69 70-254-30-310"${3}/></g></svg>`;
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
var custom_custom51 = registerTemplate(tmpl$Q);
tmpl$Q.stylesheets = [];
tmpl$Q.stylesheetToken = "lwc-4unprqdn9l8";
freezeTemplate(tmpl$Q);

const $fragment1$P = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M799 351c2-32 0-64-5-95-4-26-24-46-50-50-32-5-63-7-95-5-9 0-13 11-7 17l140 140c6 6 17 1 17-7M563 223c-5-5-13-7-19-5a475 475 0 00-325 321c-2 7 0 15 5 20l218 218c5 5 13 7 20 5a475 475 0 00321-325c2-7 0-14-5-19zm-84 393a29 29 0 01-42 0l-56-56a29 29 0 010-42c12-12 31-12 42 0l56 56c12 11 12 30 0 42m70-70a29 29 0 01-42 0l-56-56a29 29 0 010-42c12-12 31-12 42 0l56 56c12 11 12 30 0 42m70-71a29 29 0 01-42 0l-56-56a29 29 0 010-42c12-12 31-12 42 0l56 56c12 12 12 31 0 42M201 643c-2 34-1 68 5 102 4 26 24 46 50 50 34 5 68 7 102 5 9-1 13-11 7-17L218 636c-6-6-17-2-17 7"${3}/></g></svg>`;
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
var custom_custom52 = registerTemplate(tmpl$P);
tmpl$P.stylesheets = [];
tmpl$P.stylesheetToken = "lwc-faa58hm5uj";
freezeTemplate(tmpl$P);

const $fragment1$O = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M747 570h-6c-23 0-41-18-41-41V397c0-116-104-209-223-195a202 202 0 00-177 203v119c0 25-21 46-46 46h-1c-18 0-33 15-33 33v24c0 18 15 33 33 33h494c18 0 33-15 33-33v-24c0-18-15-33-33-33M566 720H434c-8 0-15 6-13 14 7 38 40 66 80 66s72-27 80-66c0-8-6-14-15-14"${3}/></g></svg>`;
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
var custom_custom53 = registerTemplate(tmpl$O);
tmpl$O.stylesheets = [];
tmpl$O.stylesheetToken = "lwc-4o4n6s61ndl";
freezeTemplate(tmpl$O);

const $fragment1$N = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M272 491c65-12 122-38 184-67l75-35c6-3 10-9 8-16-5-29-29-53-59-53h-20v-38c0-11-10-21-20-21v-41c0-11-9-21-20-21h-40c-11 0-20 9-20 21v41c-10 0-20 9-20 21v38h-20c-33 0-60 31-60 65v96c0 6 6 11 12 10m448 201s73-114 80-275c0-12-9-22-21-22-238 9-349 155-560 164-11 0-19 10-19 20v76c0 33 25 59 56 61 105 7 330 22 459 43 13 2 25-10 23-23-3-15-8-33-18-44m-10-182c-17 0-30-13-30-30s13-30 30-30 30 13 30 30-13 30-30 30"${3}/></g></svg>`;
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
var custom_custom54 = registerTemplate(tmpl$N);
tmpl$N.stylesheets = [];
tmpl$N.stylesheetToken = "lwc-2dnk837lum1";
freezeTemplate(tmpl$N);

const $fragment1$M = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M32 61h13a2 2 0 002-2V29c0-2.2-2-4-4-4H32.3a2.3 2.3 0 00-2.3 2.3V59c0 1.1.9 2 2 2m44-30v32a4 4 0 01-4 4H28a4 4 0 01-4-4V31a6 6 0 00-6 6v30a6 6 0 006 6h19a2 2 0 012 2c0 1.1.9 2 2 2h6a2 2 0 002-2c0-1.1.9-2 2-2h19a6 6 0 006-6V37a6 6 0 00-6-6M55 61h12.7a2.3 2.3 0 002.3-2.3V27a2 2 0 00-2-2H57c-2 0-4 1.8-4 4v30c0 1.1.9 2 2 2"${3}/></g></svg>`;
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
var custom_custom55 = registerTemplate(tmpl$M);
tmpl$M.stylesheets = [];
tmpl$M.stylesheetToken = "lwc-73uvlbdagpf";
freezeTemplate(tmpl$M);

const $fragment1$L = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M627 303c-63 63-139-14-209 56L217 560a59 59 0 000 83l70 70 70 70c23 23 60 23 83 0l202-202c70-70-7-146 56-209l16-16c4-4 4-10 0-14l-55-55c-4-4-10-4-14 0zm-48 257l-70 70c-8 8-20 8-28 0l-56-56-56-56c-8-8-8-20 0-28l70-70c8-8 20-8 28 0l56 56 56 56c8 8 8 20 0 28m215-313l-21-21-21-21c-8-8-20-8-28 0l-26 26c-4 4-4 10 0 14l55 55c4 4 10 4 14 0l26-26c9-6 9-19 1-27"${3}/></g></svg>`;
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
var custom_custom56 = registerTemplate(tmpl$L);
tmpl$L.stylesheets = [];
tmpl$L.stylesheetToken = "lwc-631otqha0i6";
freezeTemplate(tmpl$L);

const $fragment1$K = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M530 526v244c0 8 8 12 15 9l194-110c19-11 31-31 31-53V397c0-8-8-12-15-9L540 509c-6 4-10 10-10 17m-20-68l216-121c7-4 7-13 0-17L531 209a62 62 0 00-62 0L274 320c-7 4-7 13 0 17l216 121c6 3 14 3 20 0m-50 51L245 388c-7-4-15 1-15 9v218c0 22 12 42 31 53l194 110c7 4 15-1 15-9V526c0-7-4-13-10-17"${3}/></g></svg>`;
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
var custom_custom57 = registerTemplate(tmpl$K);
tmpl$K.stylesheets = [];
tmpl$K.stylesheetToken = "lwc-3ud552a7td6";
freezeTemplate(tmpl$K);

const $fragment1$J = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M670 460c-17 0-31-14-30-32 1-16 15-28 32-28h86c4 0 7-2 9-5 8-14 14-28 19-41 2-7-2-14-9-14h-64c-16 0-31-12-32-28-1-17 13-32 30-32h80c6 0 10-4 10-10v-30c0-11-9-20-20-20H674c-30 0-54 24-54 54v1c0 56-37 106-90 120v-83a60 60 0 10-89-52c0 22 12 41 30 52v84c-53-14-90-64-90-120v-1c0-30-24-54-54-54H220c-11 0-20 9-20 20v30c0 6 4 10 10 10h78c16 0 31 12 32 28 1 17-13 32-30 32h-65c-7 0-12 7-9 14 5 13 11 27 19 41 2 3 5 5 9 5h86c16 0 31 12 32 28 1 17-13 32-30 32h-24c-9 0-14 12-6 18 42 36 98 62 170 62v228c0 16 12 31 28 32 17 1 32-13 32-30V540c72 0 128-26 170-62 7-6 3-18-6-18z"${3}/></g></svg>`;
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
var custom_custom58 = registerTemplate(tmpl$J);
tmpl$J.stylesheets = [];
tmpl$J.stylesheetToken = "lwc-2ri7jg3s4mp";
freezeTemplate(tmpl$J);

const $fragment1$I = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M683 310c10 0 17-8 17-17 0-7-4-14-11-18-13-7-33-41-40-62-2-8-10-13-18-13H388c-8 0-16 5-18 13-6 20-27 55-39 62-6 4-10 10-10 18 0 10 8 17 17 17zM320 739c0 34 27 61 60 61h260c33 0 60-27 60-60v-1c0-11-9-19-19-19H339c-10 0-19 9-19 19m380-99V390c0-11-9-20-20-20H340c-11 0-20 9-20 20v250c0 11 9 20 20 20h340c11 0 20-9 20-20"${3}/></g></svg>`;
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
var custom_custom59 = registerTemplate(tmpl$I);
tmpl$I.stylesheets = [];
tmpl$I.stylesheetToken = "lwc-5pe6gkepot3";
freezeTemplate(tmpl$I);

const $fragment1$H = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M50 76H24a4 4 0 01-3.4-6l26-44c1.5-2.6 5.3-2.6 6.9 0l26 44a4 4 0 01-3.4 6z"${3}/></g></svg>`;
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
var custom_custom6 = registerTemplate(tmpl$H);
tmpl$H.stylesheets = [];
tmpl$H.stylesheetToken = "lwc-c8anobemub";
freezeTemplate(tmpl$H);

const $fragment1$G = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M80 45.3a30.4 30.4 0 00-60 0c-.2.9.9 1.6 1.6 1 1.5-1.3 3.4-2 5.6-2 2.8 0 5.2 1.3 6.8 3.3a1 1 0 001.6 0 8.6 8.6 0 0113.6 0 1 1 0 001.6 0 8.6 8.6 0 0113.6 0 1 1 0 001.6 0c1.6-2 4-3.3 6.8-3.3 2.1 0 4.1.8 5.6 2 .7.6 1.7 0 1.6-1M62 68c-1.7 0-3 1.3-3 3s-1.3 3-3 3-3-1.3-3-3V57c0-1.7-1.3-3-3-3s-3 1.3-3 3v14c0 5 4 9 9 9s9-4 9-9a3 3 0 00-3-3"${3}/></g></svg>`;
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
var custom_custom60 = registerTemplate(tmpl$G);
tmpl$G.stylesheets = [];
tmpl$G.stylesheetToken = "lwc-t3u1t5049t";
freezeTemplate(tmpl$G);

const $fragment1$F = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M73 20h-4a2 2 0 00-2 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4a2 2 0 00-2-2h-4a2 2 0 00-2 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4a2 2 0 00-2-2h-4a2 2 0 00-2 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4a2 2 0 00-2-2h-4a2 2 0 00-2 2v10a6 6 0 006 6h38a6 6 0 006-6V22a2 2 0 00-2-2m-4.5 25.7c-.1-1-1-1.7-2-1.7h-33c-1 0-1.9.7-2 1.7l-4.5 32a2 2 0 002 2.3h12.9c1.1 0 2.1-.9 2.1-2v-9.7c0-3.3 2.5-6.2 5.8-6.2a6 6 0 016.2 6v10c0 1.1 1 2 2.1 2H71a2 2 0 002-2.3z"${3}/></g></svg>`;
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
var custom_custom61 = registerTemplate(tmpl$F);
tmpl$F.stylesheets = [];
tmpl$F.stylesheetToken = "lwc-6j9vllm757i";
freezeTemplate(tmpl$F);

const $fragment1$E = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M77 70H23a3 3 0 100 6h54a3 3 0 100-6m-53-6h34v-4c0-1.1.9-2 2-2h10a2 2 0 012 2v4h4a2 2 0 002-2V28a2 2 0 00-2-2H24a2 2 0 00-2 2v34c0 1.1.9 2 2 2m9-26c0-1.1.9-2 2-2h29a2 2 0 012 2v2a2 2 0 01-2 2H35a2 2 0 01-2-2zm0 12c0-1.1.9-2 2-2h19a2 2 0 012 2v2a2 2 0 01-2 2H35a2 2 0 01-2-2z"${3}/></g></svg>`;
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
var custom_custom62 = registerTemplate(tmpl$E);
tmpl$E.stylesheets = [];
tmpl$E.stylesheetToken = "lwc-7rrq2bgqnoo";
freezeTemplate(tmpl$E);

const $fragment1$D = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M42 60h16a2 2 0 002-2V42a2 2 0 00-2-2H42a2 2 0 00-2 2v16c0 1.1.9 2 2 2m35-7c1.7 0 3-1.3 3-3s-1.3-3-3-3h-5v-6h5c1.7 0 3-1.3 3-3s-1.3-3-3-3h-5v-1a6 6 0 00-6-6h-1v-5c0-1.7-1.3-3-3-3s-3 1.3-3 3v5h-6v-5c0-1.7-1.3-3-3-3s-3 1.3-3 3v5h-6v-5c0-1.7-1.3-3-3-3s-3 1.3-3 3v5h-1a6 6 0 00-6 6v1h-5c-1.7 0-3 1.3-3 3s1.3 3 3 3h5v6h-5c-1.7 0-3 1.3-3 3s1.3 3 3 3h5v6h-5c-1.7 0-3 1.3-3 3s1.3 3 3 3h5v1a6 6 0 006 6h1v5c0 1.7 1.3 3 3 3s3-1.3 3-3v-5h6v5c0 1.7 1.3 3 3 3s3-1.3 3-3v-5h6v5c0 1.7 1.3 3 3 3s3-1.3 3-3v-5h1a6 6 0 006-6v-1h5c1.7 0 3-1.3 3-3s-1.3-3-3-3h-5v-6zM66 63a3 3 0 01-3 3H37a3 3 0 01-3-3V37a3 3 0 013-3h26a3 3 0 013 3z"${3}/></g></svg>`;
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
var custom_custom63 = registerTemplate(tmpl$D);
tmpl$D.stylesheets = [];
tmpl$D.stylesheetToken = "lwc-5masgrmbaaj";
freezeTemplate(tmpl$D);

const $fragment1$C = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M50 20c-16.5 0-30 13.5-30 30s13.5 30 30 30 30-13.5 30-30-13.5-30-30-30m0 52a22 22 0 110-44 22 22 0 110 44m11.6-34.9l-16.6 6a3 3 0 00-1.9 1.9l-6 16.6a1 1 0 001.3 1.3l16.6-6a3 3 0 001.9-1.9l6-16.6a1 1 0 00-1.3-1.3M50 54c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4"${3}/></g></svg>`;
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
var custom_custom64 = registerTemplate(tmpl$C);
tmpl$C.stylesheets = [];
tmpl$C.stylesheetToken = "lwc-3v1v5h6f9jo";
freezeTemplate(tmpl$C);

const $fragment1$B = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M721 670H219c-10 0-19 9-19 19v1c0 33 27 60 60 60h420c33 0 60-27 60-60v-1c0-10-9-19-19-19m-21-400H221c-10 0-18 9-19 20-3 27-3 75 1 104 13 93 63 172 132 214 3 2 7 3 10 3h209c4 0 7-1 10-3 39-24 73-60 96-104a120 120 0 00159-114c0-66-53-120-119-120m0 180l-15-2q15-48 15-102v-16c33 0 60 27 60 60s-27 60-60 60"${3}/></g></svg>`;
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
var custom_custom65 = registerTemplate(tmpl$B);
tmpl$B.stylesheets = [];
tmpl$B.stylesheetToken = "lwc-4s07ba4kipp";
freezeTemplate(tmpl$B);

const $fragment1$A = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M783 553L637 407a59 59 0 00-83 0L407 553a59 59 0 000 83l146 146c23 23 60 23 83 0l146-146c24-22 24-60 1-83m-276 67a34 34 0 01-49 0 34 34 0 010-49c14-14 36-14 49 0 13 13 13 35 0 49m113 113a34 34 0 01-49 0 34 34 0 010-49c14-14 36-14 49 0 13 13 13 35 0 49m0-226a34 34 0 01-49 0 34 34 0 010-49c14-14 36-14 49 0 13 13 13 35 0 49m113 113a34 34 0 01-49 0 34 34 0 010-49c14-14 36-14 49 0 14 13 14 35 0 49M530 335v-75c0-33-27-60-60-60H260c-33 0-60 27-60 60v210c0 33 27 60 60 60h75c6 0 12-3 16-7l11-12 148-149 12-11c5-4 8-10 8-16M285 480c-19 0-35-16-35-35s16-35 35-35 35 16 35 35-16 35-35 35m80-80c-19 0-35-16-35-35s16-35 35-35 35 16 35 35-16 35-35 35m80-80c-19 0-35-16-35-35s16-35 35-35 35 16 35 35-16 35-35 35"${3}/></g></svg>`;
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
var custom_custom66 = registerTemplate(tmpl$A);
tmpl$A.stylesheets = [];
tmpl$A.stylesheetToken = "lwc-7kiu8bqdeg6";
freezeTemplate(tmpl$A);

const $fragment1$z = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M540 531l-12-21c-5-8-13-13-22-13l-9 2-35 13c-14-12-29-20-46-26l-6-36c-2-12-13-19-25-19h-25c-12 0-23 7-25 20l-6 35c-17 6-32 15-46 27l-35-13-9-2c-9 0-18 5-22 13l-12 21c-6 11-4 24 6 32l29 24a122 122 0 000 53l-29 24c-10 8-12 22-6 32l12 21c5 8 13 13 22 13l9-2 35-13c14 12 29 21 46 26l6 37c2 12 13 21 25 21h25c12 0 23-9 25-21l6-37c18-6 34-16 48-28l33 13 9 2c9 0 17-5 22-12l12-20c6-11 4-25-6-33l-29-24a122 122 0 000-53l29-24c9-8 12-22 6-32M372 683a68 68 0 110-136 68 68 0 010 136m420-293l-23-19 2-21-2-21 23-19c8-6 10-17 5-26l-10-17c-4-6-11-10-18-10l-7 1-29 11a98 98 0 00-37-21l-5-30c-2-10-10-16-20-16h-20c-10 0-19 6-20 16l-5 29c-14 5-26 12-37 22l-29-13-7-1c-7 0-14 4-18 10l-10 17c-5 9-3 20 5 26l23 19-2 21 2 21-23 19c-8 6-10 17-5 26l10 17c4 6 11 10 18 10l7-1 29-11c11 10 24 17 37 21l5 29c2 10 10 17 20 17h20c10 0 19-7 20-17l5-30c14-5 28-13 39-23l27 11 7 1c7 0 14-4 18-10l10-16c5-4 3-15-5-22m-131 16c-30 0-55-25-55-55s25-55 55-55 55 25 55 55-24 55-55 55"${3}/></g></svg>`;
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
var custom_custom67 = registerTemplate(tmpl$z);
tmpl$z.stylesheets = [];
tmpl$z.stylesheetToken = "lwc-75pfu9ukjf1";
freezeTemplate(tmpl$z);

const $fragment1$y = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M500 200c-165 0-300 135-300 300s135 300 300 300 300-135 300-300-135-300-300-300m238 270h-79c-3-71-19-133-43-180 66 37 112 103 122 180M470 273v197h-69c5-94 35-168 69-197m0 257v197c-34-29-64-103-69-197zm60 197V530h69c-5 94-35 168-69 197m0-257V273c34 29 64 103 69 197zM384 290c-24 47-39 109-43 180h-79c10-77 56-143 122-180M262 530h79c3 71 19 133 43 180a242 242 0 01-122-180m354 180c24-47 39-109 43-180h79c-10 77-56 143-122 180"${3}/></g></svg>`;
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
var custom_custom68 = registerTemplate(tmpl$y);
tmpl$y.stylesheets = [];
tmpl$y.stylesheetToken = "lwc-j83gfaj7u4";
freezeTemplate(tmpl$y);

const $fragment1$x = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M526 451c-57-43-115-22-153 14-14 13-36 21-60 28-28 9-57 18-78 39q-84 82.5 33 198l1 1 1 1c46 45 88 67 126 67 28 0 53-11 77-34 21-20 31-49 40-76 8-23 16-46 29-59 23-22 36-48 39-74 2-19-2-46-24-74 0 0-12-16-31-31M402 692c-5 5-12 8-20 8s-14-3-19-8l-55-55a27 27 0 010-39c11-11 28-11 39 0l55 55c11 11 11 28 0 39m48-82c-28 0-50-22-50-50s22-50 50-50 50 22 50 50-22 50-50 50m344-358l-46-46c-8-8-22-8-31 0l-51 51c-8 8-8 22 0 31l2 2-103 103c-4 4-4 11 0 15l29 27c4 4 10 4 14 0l102-102 2 2c8 8 22 8 31 0l51-51c8-9 8-23 0-32"${3}/></g></svg>`;
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
var custom_custom69 = registerTemplate(tmpl$x);
tmpl$x.stylesheets = [];
tmpl$x.stylesheetToken = "lwc-4t3gtc3slpt";
freezeTemplate(tmpl$x);

const $fragment1$w = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M28 78a6 6 0 01-6-6V28a6 6 0 016-6h44a6 6 0 016 6v44a6 6 0 01-6 6z"${3}/></g></svg>`;
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
var custom_custom7 = registerTemplate(tmpl$w);
tmpl$w.stylesheets = [];
tmpl$w.stylesheetToken = "lwc-1sqg308qnuq";
freezeTemplate(tmpl$w);

const $fragment1$v = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M479 638L364 525a62 62 0 00-86 0l-72 71c-8 8-8 21 0 28l14 14 14 14 116 114 7 7 22 21c8 8 21 8 29 0l72-71c23-23 23-61-1-85m-187-42l15-14c8-8 20-8 28 0l87 85c8 8 8 21 0 28l-15 14c-8 8-20 8-28 0l-87-85c-8-8-8-21 0-28m125-104l93 91c2 2 4 3 7 3l43-1c5 0 9-4 9-9l1-37c0-5 4-9 9-9l38-1c5 0 9-4 9-9l1-37c0-5 4-9 9-9l38-1c5 0 9-4 9-9l1-37c0-5 4-9 9-9l38-1c5 0 9-4 9-9l1-38c0-5 4-8 8-9l41-6c7-1 11-9 7-15l-88-130c-7-10-21-11-30-3L416 467c-6 6-6 18 1 25"${3}/></g></svg>`;
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
var custom_custom70 = registerTemplate(tmpl$v);
tmpl$v.stylesheets = [];
tmpl$v.stylesheetToken = "lwc-3bmpn2nnqa6";
freezeTemplate(tmpl$v);

const $fragment1$u = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M71.2 30.8A30 30 0 0049.1 22 30.6 30.6 0 0020 52.6V62a6 6 0 006 6h4v4.8c0 2.6 1.9 4.9 4.5 5.2a5 5 0 005.5-5V55.2c0-2.6-1.9-4.9-4.5-5.2a5 5 0 00-5.5 5v7h-2a2 2 0 01-2-2v-7.4A24.5 24.5 0 0149.3 28 24 24 0 0174 52v8a2 2 0 01-2 2h-2v-6.8c0-2.6-1.9-4.9-4.5-5.2a5 5 0 00-5.5 5v17.8c0 2.6 1.9 4.9 4.5 5.2a5 5 0 005.5-5v-5h4a6 6 0 006-6v-9.4c0-8.1-3-16-8.8-21.8"${3}/></g></svg>`;
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
var custom_custom71 = registerTemplate(tmpl$u);
tmpl$u.stylesheets = [];
tmpl$u.stylesheetToken = "lwc-4k7bu9ek53m";
freezeTemplate(tmpl$u);

const $fragment1$t = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M770 200H230c-17 0-30 13-30 30s13 30 30 30h240v62a218 218 0 00-190 217v69c0 73 58 132 132 132h177c73 0 131-59 131-133v-69c0-111-82-203-190-217v-61h240c17 0 30-13 30-30s-13-30-30-30M640 538c0 29-23 52-52 52H412c-29 0-51-23-52-52v1-1 1c1-77 62-139 138-139h4c76 0 137 62 138 138"${3}/><circle cx="260" cy="760" r="40"${3}/><circle cx="740" cy="760" r="40"${3}/></g></svg>`;
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
var custom_custom72 = registerTemplate(tmpl$t);
tmpl$t.stylesheets = [];
tmpl$t.stylesheetToken = "lwc-3k49fjudo1n";
freezeTemplate(tmpl$t);

const $fragment1$s = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M235 350h530c13 0 23-13 19-25-12-41-30-79-54-112-7-10-21-11-29-3a137 137 0 01-188-5c-8-7-20-7-27 0-25 25-59 40-96 40-35 0-67-13-92-35-9-8-22-6-29 3-24 33-42 71-54 112-3 12 7 25 20 25m565 80c0-11-9-20-20-20H220c-11 0-20 9-20 20v4c0 186 130 341 300 365a361 361 0 00300-365z"${3}/></g></svg>`;
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
var custom_custom73 = registerTemplate(tmpl$s);
tmpl$s.stylesheets = [];
tmpl$s.stylesheetToken = "lwc-7vbabl7jjrd";
freezeTemplate(tmpl$s);

const $fragment1$r = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M560 730H460c-11 0-20 9-20 20v30c0 11 9 20 20 20h100c11 0 20-9 20-20v-30c0-11-9-20-20-20m-50-530c-122 0-220 94-220 210 0 75 41 141 104 178 24 14 40 38 45 65 2 9 10 16 20 16h104c10 0 18-7 20-16 5-27 21-51 45-65 61-37 102-103 102-178 0-116-98-210-220-210m-68 94c-20 38-31 83-32 119 0 37 7 73 20 108 4 9-5 17-14 13-92-47-86-220 14-254 8-3 16 6 12 14m77 238c-3 8-15 8-18 0-16-39-20-85-21-127 1-42 5-88 21-127 3-8 15-8 18 0 16 39 20 85 21 127-1 42-5 88-21 127m81 2c-8 4-17-4-14-13 14-36 20-76 21-114-1-32-12-76-32-113-4-8 4-17 12-14 100 34 106 207 13 254"${3}/></g></svg>`;
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
var custom_custom74 = registerTemplate(tmpl$r);
tmpl$r.stylesheets = [];
tmpl$r.stylesheetToken = "lwc-1am7u59a89c";
freezeTemplate(tmpl$r);

const $fragment1$q = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M500 200c-17 0-30 13-30 30v540c0 17 13 30 30 30 165 0 300-135 300-300S665 200 500 200m238 270h-79c-3-71-19-133-43-180 66 37 112 103 122 180M530 727V530h69c-5 94-35 168-69 197m0-257V273c34 29 64 103 69 197zm86 240c24-47 39-109 43-180h79c-10 77-56 143-122 180M335 399c8 6 20 5 27-3l55-62c7-8 7-20-1-27l-55-55c-7-7-17-8-25-3l-11 7a301 301 0 0011 495c8 5 18 4 25-3l55-55c7-7 8-20 1-27l-55-62c-7-8-19-9-27-3l-21 16c-22-34-34-74-34-117s12-83 34-117z"${3}/></g></svg>`;
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
var custom_custom75 = registerTemplate(tmpl$q);
tmpl$q.stylesheets = [];
tmpl$q.stylesheetToken = "lwc-10r3p7c13vc";
freezeTemplate(tmpl$q);

const $fragment1$p = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M529 553c-3-8-11-14-20-13h-9c-110 0-200-90-200-200v-5c0-10-13-14-18-6a142 142 0 00106 215l7 19c1 3 3 5 5 6l30 13c5 2 7 8 5 13l-10 29c-2 5 1 10 5 12l16 7c5 2 7 8 5 13l-9 31c-1 5 1 10 5 12l23 10c5 2 7 8 5 13l-8 31c-1 5 1 10 6 12l68 31c5 2 11 0 13-5l30-67c2-5 2-10 1-15zm265-10L635 377c7-25 7-52-3-81-19-53-68-92-125-95-86-4-156 69-147 156a140 140 0 00185 116l14 15c2 2 4 3 7 3h34c6 0 10 4 10 10l3 31c0 5 5 9 10 9h17c6 0 10 4 10 10l5 32c1 5 5 8 10 8h25c6 0 10 4 10 10l5 32c1 5 5 8 10 8h75c6 0 10-4 10-10v-73q0-10.5-6-15M480 370c-28 0-50-22-50-50s22-50 50-50 50 22 50 50c0 27-22 50-50 50"${3}/></g></svg>`;
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
var custom_custom76 = registerTemplate(tmpl$p);
tmpl$p.stylesheets = [];
tmpl$p.stylesheetToken = "lwc-4iunev7n0s9";
freezeTemplate(tmpl$p);

const $fragment1$o = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M320 420h40c6 0 10-4 10-10v-15c0-76 57-135 130-135s130 59 130 135v15c0 6 4 10 10 10h40c6 0 10-4 10-10v-15c0-109-83-195-190-195s-190 86-190 195v15c0 6 4 10 10 10m380 60H310c-33 0-60 27-60 60v200c0 33 27 60 60 60h390c33 0 60-27 60-60V540c0-33-27-60-60-60M553 641c-9 14-14 30-10 46l7 30c2 11-6 23-18 23h-64c-12 0-20-12-18-23l7-31c4-16-1-32-10-45s-13-29-10-45c5-24 25-43 50-48 41-8 76 22 76 59 0 13-4 24-10 34"${3}/></g></svg>`;
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
var custom_custom77 = registerTemplate(tmpl$o);
tmpl$o.stylesheets = [];
tmpl$o.stylesheetToken = "lwc-50l9il2rfoq";
freezeTemplate(tmpl$o);

const $fragment1$n = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M783 293l-180-90c-8-4-18-4-27 0l-166 83-167-83c-9-5-20-4-29 1-9 6-14 16-14 26v450c0 11 6 22 17 27l180 90c8 4 18 4 27 0l166-83 167 83c4 2 9 3 13 3 5 0 11-2 16-4 9-6 14-16 14-26V320c0-11-6-22-17-27m-43 58v237c0 14-14 24-27 19-46-18-10-95-43-137-31-39-72 1-110-60-37-59 13-101 57-124q9-4.5 18 0l93 47c8 3 12 10 12 18M485 699c-7 4-16 3-22-3a64 64 0 01-23-46c0-30-50-20-50-80 0-48-59-62-108-57-12 1-22-8-22-20V311c0-15 16-25 29-18l108 54 3 1 4 2c45 26 36 48 17 80-21 36-30 0-60-10s-60 10-50 30 40 0 60 20 20 50 80 30 70-10 90 10 30 60 0 90c-18 18-25 54-33 80-2 5-5 10-10 13z"${3}/></g></svg>`;
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
var custom_custom78 = registerTemplate(tmpl$n);
tmpl$n.stylesheets = [];
tmpl$n.stylesheetToken = "lwc-3orojuud7k5";
freezeTemplate(tmpl$n);

const $fragment1$m = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M39 41a7 7 0 00-7 7c0 3.9 3.1 7 7 7s7-3.1 7-7a7 7 0 00-7-7m40 22H60v-8h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2.3c-1.6-10-10-17.8-20.4-18A21 21 0 0018 48.3 21.3 21.3 0 0039.5 69H76v2c0 1.1.9 2 2 2h2a2 2 0 002-2v-5a3 3 0 00-3-3m-40-2a13 13 0 110-26 13 13 0 110 26"${3}/></g></svg>`;
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
var custom_custom79 = registerTemplate(tmpl$m);
tmpl$m.stylesheets = [];
tmpl$m.stylesheetToken = "lwc-6jd1dep910f";
freezeTemplate(tmpl$m);

const $fragment1$l = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M470 213L230 473a40 40 0 000 54l240 260c16 17 43 17 59 0l240-260c14-15 14-39 0-54L529 213a41 41 0 00-59 0"${3}/></g></svg>`;
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
var custom_custom8 = registerTemplate(tmpl$l);
tmpl$l.stylesheets = [];
tmpl$l.stylesheetToken = "lwc-4vvk725dbv4";
freezeTemplate(tmpl$l);

const $fragment1$k = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M290 600c-55 0-100 45-100 100s45 100 100 100 100-45 100-100-45-100-100-100m0 140c-22 0-40-18-40-40s18-40 40-40 40 18 40 40-18 40-40 40m420-140c-55 0-100 45-100 100s45 100 100 100 100-45 100-100-45-100-100-100m0 140c-22 0-40-18-40-40s18-40 40-40 40 18 40 40-18 40-40 40m-6-200c22-1 43 3 63 10 10 4 21-1 26-10 51-97-31-142-83-168-14-6-30 3-30 18v58c0 12-8 24-20 22-74-12-140-90-220-90s-90 80-90 80c-56 0-111-4-136-10-12-3-24 7-24 20 0 0 0 70 100 70a159 159 0 01153 205c-2 7 3 14 11 14h92c8 0 13-7 11-14a161 161 0 01147-205M453 315c1 8 7 15 14 17l106 36c10 3 20-1 25-10l9-17c4-7-1-15-8-16-31-3-96-15-77-50 17-30 52-22 75-12 9 4 18-6 14-15a86 86 0 00-87-48c-47 5-80 51-74 98z"${3}/></g></svg>`;
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
var custom_custom80 = registerTemplate(tmpl$k);
tmpl$k.stylesheets = [];
tmpl$k.stylesheetToken = "lwc-4psps1cqrfc";
freezeTemplate(tmpl$k);

const $fragment1$j = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M769 200l-49 1c-154 8-331 46-340 49-12 4-20 16-20 28v326c-10-4-26-6-40-6-66 0-120 45-120 100s54 100 120 100 120-45 120-100V494c0-9 6-17 15-19 49-12 117-25 244-33 12-1 21 8 21 20v103c-10-4-26-6-40-6-66 0-120 45-120 100s54 100 120 100 120-45 120-100V230c0-17-14-31-31-30m-68 158c-122 7-184 19-237 31-13 3-24-7-24-20v-31c0-9 6-17 16-20 52-12 115-25 243-33 12-1 21 8 21 20v32c0 12-8 21-19 21"${3}/></g></svg>`;
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
var custom_custom81 = registerTemplate(tmpl$j);
tmpl$j.stylesheets = [];
tmpl$j.stylesheetToken = "lwc-73rui2ek1i0";
freezeTemplate(tmpl$j);

const $fragment1$i = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M80 44H59a2 2 0 00-2 2v1a3 3 0 11-6 0v-1a2 2 0 00-2-2h-5 .1a17 17 0 00-13.8 8.6 9 9 0 100 16.8A17 17 0 0044.1 78 17 17 0 0062 61l-.1-1.8a2 2 0 011.6-2.2l16.9-3.7a2 2 0 001.6-2V46a2 2 0 00-2-2M27 64c-1.7 0-3-1.3-3-3s1.3-3 3-3c.4 0 .9.1 1.2.3-.2 1.2-.2 2.5-.2 3.8l.2 1.6zm27-27a3 3 0 003-3v-9c0-1.7-1.3-3-3-3s-3 1.3-3 3v9a3 3 0 003 3m-14.3 1c.6.7 1.4 1 2.3 1a3 3 0 002-.7 3 3 0 00.3-4.2l-6-7a3 3 0 00-4.2-.3 3 3 0 00-.3 4.2zM66 39c.8 0 1.7-.4 2.3-1l6-7a3 3 0 00-4.5-3.9l-6 7a3 3 0 00.3 4.2c.5.5 1.2.7 1.9.7"${3}/></g></svg>`;
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
var custom_custom82 = registerTemplate(tmpl$i);
tmpl$i.stylesheets = [];
tmpl$i.stylesheetToken = "lwc-6u3792eui3k";
freezeTemplate(tmpl$i);

const $fragment1$h = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M746 393c4 4 10 4 14 0l14-14c34-34 35-86 2-119l-44-44c-34-28-81-15-108 12l-14 14c-4 4-4 10 0 14zm-180-95c-4-4-10-4-14 0L277 571q-22.5 22.5-33 54l-42 135c-3 8-2 18 2 25 6 10 16 15 26 15l9-1 137-43c20-6 38-17 53-32l274-274c4-4 4-10 0-14zM358 699l-82 26 26-82c3-11 9-20 17-28l67 67c-8 8-18 14-28 17"${3}/></g></svg>`;
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
var custom_custom83 = registerTemplate(tmpl$h);
tmpl$h.stylesheets = [];
tmpl$h.stylesheetToken = "lwc-752tvha8vc5";
freezeTemplate(tmpl$h);

const $fragment1$g = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M750 640H250c-17 0-30 13-30 30s13 30 30 30h40l17 85c2 9 10 15 19 15h329c9 0 17-6 19-15l16-85h60c17 0 30-13 30-30s-13-30-30-30m-420-60h140v-56c-12-7-20-20-20-34 0-22 18-40 40-40s40 18 40 40c0 15-8 28-20 34v56h140c11 0 20-9 20-20v-30c0-61-58-82-104-101-31-13-36-25-36-37 0-13 9-25 19-34 18-16 29-39 29-66 0-49-32-92-88-92s-88 43-88 92c0 27 10 49 29 66 10 9 19 21 19 34s-5 24-36 37c-46 19-104 43-104 101v30c0 11 9 20 20 20"${3}/></g></svg>`;
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
var custom_custom84 = registerTemplate(tmpl$g);
tmpl$g.stylesheets = [];
tmpl$g.stylesheetToken = "lwc-1mojbdek354";
freezeTemplate(tmpl$g);

const $fragment1$f = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M78 24H28v-2a2 2 0 00-2-2h-4a2 2 0 00-2 2v56c0 1.1.9 2 2 2h4a2 2 0 002-2V32h50a2 2 0 002-2v-4a2 2 0 00-2-2m-4 14H40a6 6 0 00-6 6v22a6 6 0 006 6h34a6 6 0 006-6V44a6 6 0 00-6-6m-5.5 17H66v10a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6a1 1 0 00-1-1h-4a1 1 0 00-1 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V55h-2.5a.5.5 0 01-.3-.9l11.2-10.9a1 1 0 011.3 0l11.2 10.9a.5.5 0 01-.4.9"${3}/></g></svg>`;
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
var custom_custom85 = registerTemplate(tmpl$f);
tmpl$f.stylesheets = [];
tmpl$f.stylesheetToken = "lwc-3blibholl2a";
freezeTemplate(tmpl$f);

const $fragment1$e = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M38 30h4a1 1 0 001-1v-3h14v3a1 1 0 001 1h4a1 1 0 001-1v-3a6 6 0 00-6-6H43a6 6 0 00-6 6v3a1 1 0 001 1m36 6H26a6 6 0 00-6 6v32a6 6 0 006 6h48a6 6 0 006-6V42a6 6 0 00-6-6M50 72c-7.7 0-14-6.3-14-14s6.3-14 14-14 14 6.3 14 14-6.3 14-14 14m6-17h-3v-3a2 2 0 00-2-2h-2a2 2 0 00-2 2v3h-3a2 2 0 00-2 2v2c0 1.1.9 2 2 2h3v3c0 1.1.9 2 2 2h2a2 2 0 002-2v-3h3a2 2 0 002-2v-2a2 2 0 00-2-2"${3}/></g></svg>`;
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
var custom_custom86 = registerTemplate(tmpl$e);
tmpl$e.stylesheets = [];
tmpl$e.stylesheetToken = "lwc-79669gur8om";
freezeTemplate(tmpl$e);

const $fragment1$d = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M75 20H25a3 3 0 00-3 3v48a3 3 0 003 3h1v3a3 3 0 003 3h2a3 3 0 003-3v-3h32v3a3 3 0 003 3h2a3 3 0 003-3v-3h1a3 3 0 003-3V23a3 3 0 00-3-3M31 68a3 3 0 01-3-3V29a3 3 0 013-3h38a3 3 0 013 3v36a3 3 0 01-3 3zm33-36H36a2 2 0 00-2 2v26c0 1.1.9 2 2 2h28a2 2 0 002-2V34a2 2 0 00-2-2m-4.7 18H51c-1.1 2-3.4 4-6.2 4-3.8 0-6.8-3.2-6.8-7s3-7 6.8-7c2.8 0 5.2 2 6.2 4h8.2c1.5 0 2.7 1.5 2.7 3s-1.1 3-2.6 3"${3}/></g></svg>`;
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
var custom_custom87 = registerTemplate(tmpl$d);
tmpl$d.stylesheets = [];
tmpl$d.stylesheetToken = "lwc-105h4fvfcmb";
freezeTemplate(tmpl$d);

const $fragment1$c = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M781 700H219c-10 0-19 8-19 18v1c0 45 56 81 100 81h400c44 0 100-36 100-81v-1c0-10-9-18-19-18m-551-60h180c11 0 20-11 20-22V274c0-5-7-7-9-2L221 624c-3 7 1 16 9 16m280 0h250c12 0 21-11 20-23-9-72-21-296-276-416-6-3-14 1-14 9v408c0 11 9 22 20 22"${3}/></g></svg>`;
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
var custom_custom88 = registerTemplate(tmpl$c);
tmpl$c.stylesheets = [];
tmpl$c.stylesheetToken = "lwc-2a1s9ifr5pu";
freezeTemplate(tmpl$c);

const $fragment1$b = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M579 434c-4-5-12-4-15 2-12 17-24 43-24 74v110c0 16-13 30-30 30-16 0-30-13-30-30V278c0-77-67-89-116-70-13 4-25 12-34 22-6 7-13 13-22 16-18 6-49-11-65-21-9-5-21-3-27 5l-12 17c-7 9-4 23 5 29 19 12 49 31 72 35 35 6 67-5 93-29l-1 1c7-6 19-16 27-5 20 30-60 161-60 352v16c0 81 82 151 163 155 86 4 157-65 157-150 0-43 16-71 32-88 4-4 4-10 0-14zm191 96q-12 0-21-9L589 361a29 29 0 010-42c12-12 31-12 42 0l160 160c12 12 12 31 0 42q-9 9-21 9"${3}/></g></svg>`;
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
var custom_custom89 = registerTemplate(tmpl$b);
tmpl$b.stylesheets = [];
tmpl$b.stylesheetToken = "lwc-144shtv86op";
freezeTemplate(tmpl$b);

const $fragment1$a = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M62 20H45.1a6 6 0 00-5.6 3.8L29 50.9a3 3 0 002.8 4.1H49l-6.4 22.4a2 2 0 003.4 1.8L72.3 48c1.7-1.9.3-5-2.3-5H57l11.4-18.4a3 3 0 00-2.6-4.6z"${3}/></g></svg>`;
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
var custom_custom9 = registerTemplate(tmpl$a);
tmpl$a.stylesheets = [];
tmpl$a.stylesheetToken = "lwc-2i2frd81lis";
freezeTemplate(tmpl$a);

const $fragment1$9 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M774 260l-244 36v344c0 6-4 10-10 10h-40c-6 0-10-4-10-10V305l-236 35h-4c-15 0-28-11-30-26-2-16 9-32 25-34l186-28c17-31 50-53 88-53 28 0 52 11 70 29l197-28c16-2 32 9 34 25 2 17-9 32-26 35M413 629c7-9 9-20 4-31l-80-190c-4-11-15-18-27-18s-23 7-28 18l-80 190c-4 9-3 19 2 28 2 3 41 63 104 63 37 0 73-20 105-60M310 497l43 103h-86zm408-149a31 31 0 00-56 0l-80 190c-4 9-3 19 2 28 2 3 41 63 104 63q55.5 0 105-60c7-9 9-20 4-31zm-28 89l43 103h-86zM500 710c-56 0-113 20-153 54-4 4-7 9-7 15v1c0 11 9 20 20 20h280c11 0 20-9 20-20v-1c0-6-2-11-7-15-40-34-97-54-153-54"${3}/></g></svg>`;
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
var custom_custom90 = registerTemplate(tmpl$9);
tmpl$9.stylesheets = [];
tmpl$9.stylesheetToken = "lwc-ihqsdf1u7q";
freezeTemplate(tmpl$9);

const $fragment1$8 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M778 326c-30-9-56-30-73-57-13-21-14-69-46-69H341c-33 0-33 48-46 69-21 33-48 41-80 60-33 19-2 99 5 127 31 111 90 214 182 287a462 462 0 0084 54c27 14 72-25 92-40 52-37 95-84 129-137 29-46 51-96 67-148 6-21 12-42 16-64 4-18 13-46 7-64-2-8-10-15-19-18-46-14 14 4 0 0m-44 70a497 497 0 01-218 332l-16 10-16-10a486 486 0 01-218-332l-4-21 18-11c31-19 60-52 77-87l8-18h270l5 13c17 38 48 74 85 95l13 7v1zm-245-76c-23 0-79 0-90 10-19 17-30 42-50 59-21 18-11 36-4 60a462 462 0 00104 173c5 5 51 51 51 22V340c0-11 0-20-11-20"${3}/></g></svg>`;
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
var custom_custom91 = registerTemplate(tmpl$8);
tmpl$8.stylesheets = [];
tmpl$8.stylesheetToken = "lwc-3m34ia0decv";
freezeTemplate(tmpl$8);

const $fragment1$7 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M737 564L509 460q-9-4.5-18 0L263 564c-13 6-17 21-9 33 24 34 39 78 45 98 2 8 9 13 16 15 79 19 144 64 171 85a23 23 0 0027 0c27-21 93-66 171-85 8-2 14-7 16-15 6-21 21-65 45-98 9-11 5-27-8-33m-297 56c-17 0-30-18-30-40s13-40 30-40 30 18 30 40-13 40-30 40m120 0c-17 0-30-18-30-40s13-40 30-40 30 18 30 40-13 40-30 40M344 461l122-56a79 79 0 0169 1l121 56c7 3 14-2 14-9v-45c0-5-2-10-6-14-8-9-24-24-54-24v-59c0-7-4-14-10-17-11-6-30-15-60-20v-54c0-11-9-20-20-20h-40c-11 0-20 9-20 20v54c-30 5-49 14-60 20-6 3-10 10-10 17v59c-30 0-46 15-54 23-4 4-6 9-6 14v45c0 7 7 12 14 9"${3}/></g></svg>`;
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
var custom_custom92 = registerTemplate(tmpl$7);
tmpl$7.stylesheets = [];
tmpl$7.stylesheetToken = "lwc-1fac0qui2nb";
freezeTemplate(tmpl$7);

const $fragment1$6 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M424 500h295c9 0 17-6 19-15l54-190c4-13-6-25-19-25H317l-8-28c-4-13-16-22-29-22h-48c-16 0-31 12-32 28-1 17 13 32 30 32h28l94 318c4 13 15 22 29 22h348c16 0 31-12 32-28 1-17-13-32-30-32H425c-13 0-25-9-28-21v-1c-7-19 8-38 27-38"${3}/><circle cx="430" cy="730" r="50"${3}/><circle cx="670" cy="730" r="50"${3}/></g></svg>`;
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
var custom_custom93 = registerTemplate(tmpl$6);
tmpl$6.stylesheets = [];
tmpl$6.stylesheetToken = "lwc-7s8mm26rk8m";
freezeTemplate(tmpl$6);

const $fragment1$5 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M56 38V23a3 3 0 00-3-3h-4c-1.7 0-3 1.3-3 3s1.3 3 3 3h1v12c0 6.6-5.4 12-12 12s-12-5.4-12-12V26h1c1.7 0 3-1.3 3-3s-1.3-3-3-3h-4a3 3 0 00-3 3v15c0 9.9 8.1 18 18 18s18-8.1 18-18"${3}/><path d="M80 50c0-5-4-9-9-9s-9 4-9 9c0 3.9 2.5 7.2 6 8.5v2.2C68 68 62 74 54.7 74h-.3c-6.3 0-11.6-4.5-13-10.4a2 2 0 00-2-1.6h-2a2 2 0 00-2 2.4A19.3 19.3 0 0054.3 80h.3C65.3 80 74 71.3 74 60.7v-2.2c3.5-1.3 6-4.6 6-8.5m-9 3c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3"${3}/></g></svg>`;
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
var custom_custom94 = registerTemplate(tmpl$5);
tmpl$5.stylesheets = [];
tmpl$5.stylesheetToken = "lwc-4sc191g0evf";
freezeTemplate(tmpl$5);

const $fragment1$4 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M53 30.2V26h1a3 3 0 100-6h-8a3 3 0 100 6h1v4.2a25 25 0 106 0M50 74a19 19 0 110-38 19 19 0 010 38m6.6-29.2L52 49.4c-.6-.2-1.3-.4-2-.4a6 6 0 106 6c0-.7-.1-1.4-.4-2l4.6-4.6c1-1 1-2.6 0-3.6a2.4 2.4 0 00-3.6 0"${3}/></g></svg>`;
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
var custom_custom95 = registerTemplate(tmpl$4);
tmpl$4.stylesheets = [];
tmpl$4.stylesheetToken = "lwc-r8khda83i0";
freezeTemplate(tmpl$4);

const $fragment1$3 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M794 287l-52-39c-7-5-15-8-24-8H540v-20c0-11-9-20-20-20h-40c-11 0-20 9-20 20v20H260c-11 0-20 9-20 20v80c0 11 9 20 20 20h457c9 0 17-3 24-8l52-39c9-7 9-19 1-26m-54 173H540v-30c0-6-4-10-10-10h-60c-6 0-10 4-10 10v30H283c-9 0-17 3-24 8l-52 39c-9 6-9 19 0 26l52 39c7 5 15 8 24 8h457c11 0 20-9 20-20v-80c0-11-9-20-20-20M540 716v-66c0-6-4-10-10-10h-60c-6 0-10 4-10 10v66c-40 11-62 35-69 65-2 9 5 19 15 19h189c10 0 17-9 15-19-8-30-30-54-70-65"${3}/></g></svg>`;
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
var custom_custom96 = registerTemplate(tmpl$3);
tmpl$3.stylesheets = [];
tmpl$3.stylesheetToken = "lwc-4h6uvtem5ke";
freezeTemplate(tmpl$3);

const $fragment1$2 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 1000 1000" part="icon"${2}><g${3}><path d="M600 544V291c0-62-48-111-109-111h-2c-61 0-109 49-109 111v253a160 160 0 10220 0m-26 116H406c-9 0-16-9-15-18 4-24 17-45 36-60 7-6 12-15 12-24V291c0-29 22-51 49-51h2c28 0 49 22 49 51v9h-30c-17 0-30 13-30 30s13 30 30 30h30v40h-30c-17 0-30 13-30 30s13 30 30 30h30v40h-30c-17 0-30 13-30 30s13 30 30 30h30c1 9 5 16 12 22 19 15 32 37 36 60 3 9-4 18-13 18"${3}/></g></svg>`;
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
var custom_custom97 = registerTemplate(tmpl$2);
tmpl$2.stylesheets = [];
tmpl$2.stylesheetToken = "lwc-srutdi0l5l";
freezeTemplate(tmpl$2);

const $fragment1$1 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M81.4 46.4l-7.8-7.8a2 2 0 00-1.4-.6H64a2 2 0 00-2 2v16a1 1 0 001.4.9 12 12 0 0115.1 5.3c.3.5 1 .7 1.5.3 1.2-1.1 2-2.7 2-4.5V47.8c0-.5-.2-1-.6-1.4"${3}/><path d="M54 29H20a2 2 0 00-2 2v27c0 1.8.8 3.4 2 4.5.5.4 1.2.3 1.5-.3a12 12 0 0121.6 1.2q.3.6.9.6h6a6 6 0 006-6V31a2 2 0 00-2-2"${3}/><circle cx="68" cy="68" r="6"${3}/><circle cx="32" cy="68" r="6"${3}/></g></svg>`;
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
var custom_custom98 = registerTemplate(tmpl$1);
tmpl$1.stylesheets = [];
tmpl$1.stylesheetToken = "lwc-5o7jc876ubm";
freezeTemplate(tmpl$1);

const $fragment1 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" viewBox="0 0 100 100" part="icon"${2}><g${3}><path d="M74 36H57.2a9.4 9.4 0 00-2.1-3.1l6.3-8.1a3 3 0 00-.5-4.2 3 3 0 00-4.2.5l-7 9L48 30l-1.6.1-7-9a3 3 0 00-4.2-.5 3 3 0 00-.5 4.2l6.3 8.1c-.9.9-1.6 1.9-2.1 3.1H26a6 6 0 00-6 6v28a6 6 0 006 6h48a6 6 0 006-6V42a6 6 0 00-6-6m-8 32a2 2 0 01-2 2H28a2 2 0 01-2-2V44c0-1.1.9-2 2-2h36a2 2 0 012 2zm7-10c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3m0-10c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3"${3}/></g></svg>`;
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
var custom_custom99 = registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-6of07u607pu";
freezeTemplate(tmpl);

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
var templates = {
  custom_custom1,
  custom_custom10,
  custom_custom100,
  custom_custom101,
  custom_custom102,
  custom_custom103,
  custom_custom104,
  custom_custom105,
  custom_custom106,
  custom_custom107,
  custom_custom108,
  custom_custom109,
  custom_custom11,
  custom_custom110,
  custom_custom111,
  custom_custom112,
  custom_custom113,
  custom_custom12,
  custom_custom13,
  custom_custom14,
  custom_custom15,
  custom_custom16,
  custom_custom17,
  custom_custom18,
  custom_custom19,
  custom_custom2,
  custom_custom20,
  custom_custom21,
  custom_custom22,
  custom_custom23,
  custom_custom24,
  custom_custom25,
  custom_custom26,
  custom_custom27,
  custom_custom28,
  custom_custom29,
  custom_custom3,
  custom_custom30,
  custom_custom31,
  custom_custom32,
  custom_custom33,
  custom_custom34,
  custom_custom35,
  custom_custom36,
  custom_custom37,
  custom_custom38,
  custom_custom39,
  custom_custom4,
  custom_custom40,
  custom_custom41,
  custom_custom42,
  custom_custom43,
  custom_custom44,
  custom_custom45,
  custom_custom46,
  custom_custom47,
  custom_custom48,
  custom_custom49,
  custom_custom5,
  custom_custom50,
  custom_custom51,
  custom_custom52,
  custom_custom53,
  custom_custom54,
  custom_custom55,
  custom_custom56,
  custom_custom57,
  custom_custom58,
  custom_custom59,
  custom_custom6,
  custom_custom60,
  custom_custom61,
  custom_custom62,
  custom_custom63,
  custom_custom64,
  custom_custom65,
  custom_custom66,
  custom_custom67,
  custom_custom68,
  custom_custom69,
  custom_custom7,
  custom_custom70,
  custom_custom71,
  custom_custom72,
  custom_custom73,
  custom_custom74,
  custom_custom75,
  custom_custom76,
  custom_custom77,
  custom_custom78,
  custom_custom79,
  custom_custom8,
  custom_custom80,
  custom_custom81,
  custom_custom82,
  custom_custom83,
  custom_custom84,
  custom_custom85,
  custom_custom86,
  custom_custom87,
  custom_custom88,
  custom_custom89,
  custom_custom9,
  custom_custom90,
  custom_custom91,
  custom_custom92,
  custom_custom93,
  custom_custom94,
  custom_custom95,
  custom_custom96,
  custom_custom97,
  custom_custom98,
  custom_custom99
};

const __lwc_component_class_internal = registerComponent(templates, {
  tmpl: _tmpl,
  sel: "lightning-icon-svg-templates-custom",
  apiVersion: 66
});

export { __lwc_component_class_internal as default };