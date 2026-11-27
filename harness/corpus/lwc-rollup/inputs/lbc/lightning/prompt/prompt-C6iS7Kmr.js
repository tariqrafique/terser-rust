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
var assert$1 = /*#__PURE__*/Object.freeze({
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
  /** Detached {@linkcode Object.getOwnPropertySymbols}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols MDN Reference}. */
  getOwnPropertySymbols: getOwnPropertySymbols$1,
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
function safelyCallGetter(target, key) {
  // Arbitrary getters can throw. We don't want to throw an error just due to dev-mode-only mutation tracking
  // (which is only used for performance debugging) so ignore errors here.
  try {
    return target[key];
  } catch (_err) {
    /* ignore */
  }
}
function isRevokedProxy(target) {
  try {
    // `str in obj` will never throw for normal objects or active proxies,
    // but the operation is not allowed for revoked proxies
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    '' in target;
    return false;
  } catch (_) {
    return true;
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
/**
 * Deeply track all objects in a target and associate with a given key.
 * @param key - key associated with the object in the component
 * @param target - tracked target object
 */
function trackTargetForMutationLogging(key, target) {
  assertNotProd();
  if (targetsToPropertyKeys.has(target)) {
    // Guard against recursive objects - don't traverse forever
    return;
  }
  // Revoked proxies (e.g. window props in LWS sandboxes) throw an error if we try to track them
  if (isObject(target) && !isNull(target) && !isRevokedProxy(target)) {
    // only track non-primitives; others are invalid as WeakMap keys
    targetsToPropertyKeys.set(target, key);
    // Deeply traverse arrays and objects to track every object within
    if (isArray$1(target)) {
      for (let i = 0; i < target.length; i++) {
        trackTargetForMutationLogging(toPrettyMemberNotation(key, i), safelyCallGetter(target, i));
      }
    } else {
      // Track only own property names and symbols (including non-enumerated)
      // This is consistent with what observable-membrane does:
      // https://github.com/salesforce/observable-membrane/blob/b85417f/src/base-handler.ts#L142-L143
      // Note this code path is very hot, hence doing two separate for-loops rather than creating a new array.
      for (const prop of getOwnPropertyNames$1(target)) {
        trackTargetForMutationLogging(toPrettyMemberNotation(key, prop), safelyCallGetter(target, prop));
      }
      for (const prop of getOwnPropertySymbols$1(target)) {
        trackTargetForMutationLogging(toPrettyMemberNotation(key, prop), safelyCallGetter(target, prop));
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
function getReactiveProxy(value) {
  // On the server side, we don't need mutation tracking. Skipping it improves performance.
  return reactiveMembrane.getProxy(value);
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
      assert$1.isTrue(vm.elm instanceof Element, `this.hostElement should be an Element, found: ${vm.elm}`);
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
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function createObservedFieldPropertyDescriptor(key) {
  return {
    get() {
      const vm = getAssociatedVM(this);
      const val = vm.cmpFields[key];
      componentValueObserved(vm, key, val);
      return val;
    },
    set(newValue) {
      const vm = getAssociatedVM(this);
      updateComponentValue(vm, key, newValue);
    },
    enumerable: true,
    configurable: true
  };
}

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
function storeWiredMethodMeta(descriptor, adapter, configCallback, dynamic) {
  // support for callable adapters
  if (adapter.adapter) {
    adapter = adapter.adapter;
  }
  const method = descriptor.value;
  const def = {
    adapter,
    method,
    configCallback,
    dynamic
  };
  WireMetaMap.set(descriptor, def);
}
function storeWiredFieldMeta(descriptor, adapter, configCallback, dynamic) {
  // support for callable adapters
  if (adapter.adapter) {
    adapter = adapter.adapter;
  }
  const def = {
    adapter,
    configCallback,
    dynamic
  };
  WireMetaMap.set(descriptor, def);
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
      assert$1.invariant(wireDef, `Internal Error: invalid wire definition found.`);
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
function createPublicPropertyDescriptor(key) {
  return {
    get() {
      const vm = getAssociatedVM(this);
      if (isBeingConstructed(vm)) {
        if (process.env.NODE_ENV !== 'production') {
          logError(`Can’t read the value of property \`${toString(key)}\` from the constructor because the owner component hasn’t set the value yet. Instead, use the constructor to set a default value for the property.`, vm);
        }
        return;
      }
      const val = vm.cmpProps[key];
      componentValueObserved(vm, key, val);
      return val;
    },
    set(newValue) {
      const vm = getAssociatedVM(this);
      if (process.env.NODE_ENV !== 'production') {
        const vmBeingRendered = getVMBeingRendered();
        if (isInvokingRender) {
          logError(`render() method has side effects on the state of property "${toString(key)}"`, isNull(vmBeingRendered) ? vm : vmBeingRendered);
        }
        if (isUpdatingTemplate) {
          logError(`Updating the template has side effects on the state of property "${toString(key)}"`, isNull(vmBeingRendered) ? vm : vmBeingRendered);
        }
      }
      vm.cmpProps[key] = newValue;
      componentValueMutated(vm, key);
    },
    enumerable: true,
    configurable: true
  };
}
function createPublicAccessorDescriptor(key, descriptor) {
  const {
    get,
    set,
    enumerable,
    configurable
  } = descriptor;
  assert$1.invariant(isFunction$1(get), `Invalid public accessor ${toString(key)} decorated with @api. The property is missing a getter.`);
  return {
    get() {
      if (process.env.NODE_ENV !== 'production') {
        // Assert that the this value is an actual Component with an associated VM.
        getAssociatedVM(this);
      }
      return get.call(this);
    },
    set(newValue) {
      const vm = getAssociatedVM(this);
      if (process.env.NODE_ENV !== 'production') {
        const vmBeingRendered = getVMBeingRendered();
        if (isInvokingRender) {
          logError(`render() method has side effects on the state of property "${toString(key)}"`, isNull(vmBeingRendered) ? vm : vmBeingRendered);
        }
        if (isUpdatingTemplate) {
          logError(`Updating the template has side effects on the state of property "${toString(key)}"`, isNull(vmBeingRendered) ? vm : vmBeingRendered);
        }
      }
      if (set) {
        set.call(this, newValue);
      } else if (process.env.NODE_ENV !== 'production') {
        logError(`Invalid attempt to set a new value for property "${toString(key)}" that does not has a setter decorated with @api.`, vm);
      }
    },
    enumerable,
    configurable
  };
}
function internalTrackDecorator(key) {
  return {
    get() {
      const vm = getAssociatedVM(this);
      const val = vm.cmpFields[key];
      componentValueObserved(vm, key, val);
      return val;
    },
    set(newValue) {
      const vm = getAssociatedVM(this);
      if (process.env.NODE_ENV !== 'production') {
        const vmBeingRendered = getVMBeingRendered();
        if (isInvokingRender) {
          logError(`${vmBeingRendered}.render() method has side effects on the state of ${vm}.${toString(key)}`);
        }
        if (isUpdatingTemplate) {
          logError(`Updating the template of ${vmBeingRendered} has side effects on the state of ${vm}.${toString(key)}`);
        }
      }
      const reactiveOrAnyValue = getReactiveProxy(newValue);
      if (process.env.NODE_ENV !== 'production') {
        trackTargetForMutationLogging(key, newValue);
      }
      updateComponentValue(vm, key, reactiveOrAnyValue);
    },
    enumerable: true,
    configurable: true
  };
}
function internalWireFieldDecorator(key) {
  return {
    get() {
      const vm = getAssociatedVM(this);
      componentValueObserved(vm, key);
      return vm.cmpFields[key];
    },
    set(value) {
      const vm = getAssociatedVM(this);
      /**
       * Reactivity for wired fields is provided in wiring.
       * We intentionally add reactivity here since this is just
       * letting the author to do the wrong thing, but it will keep our
       * system to be backward compatible.
       */
      updateComponentValue(vm, key, value);
    },
    enumerable: true,
    configurable: true
  };
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function getClassDescriptorType(descriptor) {
  if (isFunction$1(descriptor.value)) {
    return 'method';
  } else if (isFunction$1(descriptor.set) || isFunction$1(descriptor.get)) {
    return 'accessor';
  } else {
    return 'field';
  }
}
function validateObservedField(Ctor, fieldName, descriptor) {
  assertNotProd(); // this method should never leak to prod
  if (!isUndefined$1(descriptor)) {
    const type = getClassDescriptorType(descriptor);
    const message = `Invalid observed ${fieldName} field. Found a duplicate ${type} with the same name.`;
    // TODO [#4450]: this should throw, not log
    logError(message);
  }
}
function validateFieldDecoratedWithTrack(Ctor, fieldName, descriptor) {
  assertNotProd(); // this method should never leak to prod
  if (!isUndefined$1(descriptor)) {
    const type = getClassDescriptorType(descriptor);
    // TODO [#4450]: this should throw, not log
    logError(`Invalid @track ${fieldName} field. Found a duplicate ${type} with the same name.`);
  }
}
function validateFieldDecoratedWithWire(Ctor, fieldName, descriptor) {
  assertNotProd(); // this method should never leak to prod
  if (!isUndefined$1(descriptor)) {
    const type = getClassDescriptorType(descriptor);
    // TODO [#4450]: this should throw, not log
    logError(`Invalid @wire ${fieldName} field. Found a duplicate ${type} with the same name.`);
  }
}
function validateMethodDecoratedWithWire(Ctor, methodName, descriptor) {
  assertNotProd(); // this method should never leak to prod
  if (isUndefined$1(descriptor) || !isFunction$1(descriptor.value) || isFalse(descriptor.writable)) {
    // TODO [#4450]: This line of code does not seem possible to reach.
    logError(`Invalid @wire ${methodName} field. The field should have a valid writable descriptor.`);
  }
}
function validateFieldDecoratedWithApi(Ctor, fieldName, descriptor) {
  assertNotProd(); // this method should never leak to prod
  if (!isUndefined$1(descriptor)) {
    const type = getClassDescriptorType(descriptor);
    const message = `Invalid @api ${fieldName} field. Found a duplicate ${type} with the same name.`;
    // TODO [#4450]: this should throw, not log
    logError(message);
  }
}
function validateAccessorDecoratedWithApi(Ctor, fieldName, descriptor) {
  assertNotProd(); // this method should never leak to prod
  if (isFunction$1(descriptor.set)) {
    if (!isFunction$1(descriptor.get)) {
      // TODO [#4450]: This line of code does not seem possible to reach.
      logError(`Missing getter for property ${fieldName} decorated with @api in ${Ctor}. You cannot have a setter without the corresponding getter.`);
    }
  } else if (!isFunction$1(descriptor.get)) {
    // TODO [#3441]: This line of code does not seem possible to reach.
    logError(`Missing @api get ${fieldName} accessor.`);
  }
}
function validateMethodDecoratedWithApi(Ctor, methodName, descriptor) {
  assertNotProd(); // this method should never leak to prod
  if (isUndefined$1(descriptor) || !isFunction$1(descriptor.value) || isFalse(descriptor.writable)) {
    // TODO [#3441]: This line of code does not seem possible to reach.
    logError(`Invalid @api ${methodName} method.`);
  }
}
/**
 * INTERNAL: This function can only be invoked by compiled code. The compiler
 * will prevent this function from being imported by user-land code.
 * @param Ctor
 * @param meta
 */
function registerDecorators(Ctor, meta) {
  const proto = Ctor.prototype;
  const {
    publicProps,
    publicMethods,
    wire,
    track,
    fields
  } = meta;
  const apiMethods = create(null);
  const apiFields = create(null);
  const wiredMethods = create(null);
  const wiredFields = create(null);
  const observedFields = create(null);
  const apiFieldsConfig = create(null);
  let descriptor;
  if (!isUndefined$1(publicProps)) {
    for (const fieldName in publicProps) {
      const propConfig = publicProps[fieldName];
      apiFieldsConfig[fieldName] = propConfig.config;
      descriptor = getOwnPropertyDescriptor$1(proto, fieldName);
      if (propConfig.config > 0) {
        if (isUndefined$1(descriptor)) {
          // TODO [#3441]: This line of code does not seem possible to reach.
          throw new Error();
        }
        // accessor declaration
        if (process.env.NODE_ENV !== 'production') {
          validateAccessorDecoratedWithApi(Ctor, fieldName, descriptor);
        }
        descriptor = createPublicAccessorDescriptor(fieldName, descriptor);
      } else {
        // field declaration
        if (process.env.NODE_ENV !== 'production') {
          validateFieldDecoratedWithApi(Ctor, fieldName, descriptor);
        }
        // [W-9927596] If a component has both a public property and a private setter/getter
        // with the same name, the property is defined as a public accessor. This branch is
        // only here for backward compatibility reasons.
        if (!isUndefined$1(descriptor) && !isUndefined$1(descriptor.get)) {
          descriptor = createPublicAccessorDescriptor(fieldName, descriptor);
        } else {
          descriptor = createPublicPropertyDescriptor(fieldName);
        }
      }
      apiFields[fieldName] = descriptor;
      defineProperty(proto, fieldName, descriptor);
    }
  }
  if (!isUndefined$1(publicMethods)) {
    forEach.call(publicMethods, methodName => {
      descriptor = getOwnPropertyDescriptor$1(proto, methodName);
      if (process.env.NODE_ENV !== 'production') {
        validateMethodDecoratedWithApi(Ctor, methodName, descriptor);
      }
      if (isUndefined$1(descriptor)) {
        throw new Error();
      }
      apiMethods[methodName] = descriptor;
    });
  }
  if (!isUndefined$1(wire)) {
    for (const fieldOrMethodName in wire) {
      const {
        adapter,
        method,
        config: configCallback,
        dynamic = []
      } = wire[fieldOrMethodName];
      descriptor = getOwnPropertyDescriptor$1(proto, fieldOrMethodName);
      if (method === 1) {
        if (process.env.NODE_ENV !== 'production') {
          if (!adapter) {
            // TODO [#4450]: this should throw, not log
            logError(`@wire on method "${fieldOrMethodName}": adapter id must be truthy.`);
          }
          validateMethodDecoratedWithWire(Ctor, fieldOrMethodName, descriptor);
        }
        if (isUndefined$1(descriptor)) {
          throw new Error(`Missing descriptor for wired method "${fieldOrMethodName}".`);
        }
        wiredMethods[fieldOrMethodName] = descriptor;
        storeWiredMethodMeta(descriptor, adapter, configCallback, dynamic);
      } else {
        if (process.env.NODE_ENV !== 'production') {
          if (!adapter) {
            // TODO [#4450]: this should throw, not log
            logError(`@wire on field "${fieldOrMethodName}": adapter id must be truthy.`);
          }
          validateFieldDecoratedWithWire(Ctor, fieldOrMethodName, descriptor);
        }
        descriptor = internalWireFieldDecorator(fieldOrMethodName);
        wiredFields[fieldOrMethodName] = descriptor;
        storeWiredFieldMeta(descriptor, adapter, configCallback, dynamic);
        defineProperty(proto, fieldOrMethodName, descriptor);
      }
    }
  }
  if (!isUndefined$1(track)) {
    for (const fieldName in track) {
      descriptor = getOwnPropertyDescriptor$1(proto, fieldName);
      if (process.env.NODE_ENV !== 'production') {
        validateFieldDecoratedWithTrack(Ctor, fieldName, descriptor);
      }
      descriptor = internalTrackDecorator(fieldName);
      defineProperty(proto, fieldName, descriptor);
    }
  }
  if (!isUndefined$1(fields)) {
    for (let i = 0, n = fields.length; i < n; i++) {
      const fieldName = fields[i];
      descriptor = getOwnPropertyDescriptor$1(proto, fieldName);
      if (process.env.NODE_ENV !== 'production') {
        validateObservedField(Ctor, fieldName, descriptor);
      }
      // [W-9927596] Only mark a field as observed whenever it isn't a duplicated public nor
      // tracked property. This is only here for backward compatibility purposes.
      const isDuplicatePublicProp = !isUndefined$1(publicProps) && fieldName in publicProps;
      const isDuplicateTrackedProp = !isUndefined$1(track) && fieldName in track;
      if (!isDuplicatePublicProp && !isDuplicateTrackedProp) {
        observedFields[fieldName] = createObservedFieldPropertyDescriptor(fieldName);
      }
    }
  }
  setDecoratorsMeta(Ctor, {
    apiMethods,
    apiFields,
    apiFieldsConfig,
    wiredMethods,
    wiredFields,
    observedFields
  });
  return Ctor;
}
const signedDecoratorToMetaMap = new Map();
function setDecoratorsMeta(Ctor, meta) {
  signedDecoratorToMetaMap.set(Ctor, meta);
}
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
/**
 * EXPERIMENTAL: This function acts like a hook for Lightning Locker Service and other similar
 * libraries to sanitize vulnerable attributes.
 * @param tagName
 * @param namespaceUri
 * @param attrName
 * @param attrValue
 */
function sanitizeAttribute(tagName, namespaceUri, attrName, attrValue) {
  // locker-service patches this function during runtime to sanitize vulnerable attributes. When
  // ran off-core this function becomes a noop and returns the user authored value.
  return attrValue;
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
      assert$1.isFalse(node === root, `Reached the root without finding all parts. Found ${numFoundParts}, needed ${numParts}.`);
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
    assert$1.isTrue(numFoundParts === numParts, `Should have found all parts by now. Found ${numFoundParts}, needed ${numParts}.`);
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
    assert$1.isTrue(currParts.length === prevParts?.length, 'Expected static parts to be the same for the same element. This is an error with the LWC framework itself.');
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
          assert$1.isTrue(vm.state === 0 /* VMState.created */, `${vm} cannot be recycled.`);
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
    assert$1.isTrue(isArray$1(vnode.children), `Invalid vnode for a custom element, it must have children defined.`);
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
    assert$1.isTrue(isString(sel), `h() 1st argument sel must be a string.`);
    assert$1.isTrue(isObject(data), `h() 2nd argument data must be an object.`);
    assert$1.isTrue(isArray$1(children), `h() 3rd argument children must be an array.`);
    assert$1.isTrue('key' in data, ` <${sel}> "key" attribute is invalid or missing for ${vmBeingRendered}. Key inside iterator is either undefined or null.`);
    // checking reserved internal data properties
    assert$1.isFalse(data.className && data.classMap, `vnode.data.className and vnode.data.classMap ambiguous declaration.`);
    assert$1.isFalse(data.styleDecls && data.style, `vnode.data.styleDecls and vnode.data.style ambiguous declaration.`);
    forEach.call(children, childVnode => {
      if (childVnode != null) {
        assert$1.isTrue('type' in childVnode && 'sel' in childVnode && 'elm' in childVnode && 'key' in childVnode, `${childVnode} is not a vnode.`);
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
    assert$1.isTrue(isString(slotName), `s() 1st argument slotName must be a string.`);
    assert$1.isTrue(isObject(data), `s() 2nd argument data must be an object.`);
    assert$1.isTrue(isArray$1(children), `h() 3rd argument children must be an array.`);
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
    assert$1.isTrue(isString(sel), `c() 1st argument sel must be a string.`);
    assert$1.isTrue(isFunction$1(Ctor), `c() 2nd argument Ctor must be a function.`);
    assert$1.isTrue(isObject(data), `c() 3nd argument data must be an object.`);
    assert$1.isTrue(arguments.length === 3 || isArray$1(children), `c() 4nd argument data must be an array.`);
    // checking reserved internal data properties
    assert$1.isFalse(data.className && data.classMap, `vnode.data.className and vnode.data.classMap ambiguous declaration.`);
    assert$1.isFalse(data.styleDecls && data.style, `vnode.data.styleDecls and vnode.data.style ambiguous declaration.`);
    if (data.style && !isString(data.style)) {
      logError(`Invalid 'style' attribute passed to <${sel}> is ignored. This attribute must be a string value.`, vmBeingRendered);
    }
    if (arguments.length === 4) {
      forEach.call(children, childVnode => {
        if (childVnode != null) {
          assert$1.isTrue('type' in childVnode && 'sel' in childVnode && 'elm' in childVnode && 'key' in childVnode, `${childVnode} is not a vnode.`);
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
    assert$1.isFalse(isUndefined$1(iterable[SymbolIterator]), `Invalid template iteration for value \`${toString(iterable)}\` in ${vmBeingRendered}. It must be an array-like object.`);
  }
  const iterator = iterable[SymbolIterator]();
  if (process.env.NODE_ENV !== 'production') {
    assert$1.isTrue(iterator && isFunction$1(iterator.next), `Invalid iterator function for "${toString(iterable)}" in ${vmBeingRendered}.`);
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
    assert$1.isTrue(isArray$1(items), 'flattening api can only work with arrays.');
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
    assert$1.isTrue(isString(sel), `dc() 1st argument sel must be a string.`);
    assert$1.isTrue(isObject(data), `dc() 3nd argument data must be an object.`);
    assert$1.isTrue(arguments.length === 3 || isArray$1(children), `dc() 4nd argument data must be an array.`);
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
    assert$1.isTrue(isObject(data), `dc() 2nd argument data must be an object.`);
    assert$1.isTrue(arguments.length === 3 || isArray$1(children), `dc() 3rd argument data must be an array.`);
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
    assert$1.isTrue(isArray$1(vnodes), 'sc() api can only work with arrays.');
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
    assert$1.isTrue(isArray$1(cmpSlots.slotAssignments[slotName]), `Slots can only be set to an array, instead received ${toString(cmpSlots.slotAssignments[slotName])} for slot "${slotName}" in ${vm}.`);
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
      assert$1.isTrue(isFunction$1(fn), `Invalid event handler for event '${event.type}' on ${vm}.`);
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
    assert$1.invariant(vm.isDirty, `${vm} is not dirty.`);
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
    assert$1.isFalse(vm.isDirty, `markComponentAsDirty() for ${vm} should not be called when the component is already dirty.`);
    assert$1.isFalse(isInvokingRender, `markComponentAsDirty() for ${vm} cannot be called during rendering of ${vmBeingRendered}.`);
    assert$1.isFalse(isUpdatingTemplate, `markComponentAsDirty() for ${vm} cannot be called while updating template of ${vmBeingRendered}.`);
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
      assert$1.isTrue(vm.state === 1 /* VMState.connected */ || vm.state === 2 /* VMState.disconnected */, `${vm} must have been connected.`);
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
    assert$1.invariant(rehydrateQueue.length, `If rehydrateQueue was scheduled, it is because there must be at least one VM on this pending queue instead of ${rehydrateQueue}.`);
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
    assert$1.isTrue(vm.state !== 2 /* VMState.disconnected */, `${vm} must be inserted.`);
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
    assert$1.isTrue(node, `callNodeSlot() should not be called for a non-object`);
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
/**
 * EXPERIMENTAL: This function is almost identical to document.createElement with the slightly
 * difference that in the options, you can pass the `is` property set to a Constructor instead of
 * just a string value. The intent is to allow the creation of an element controlled by LWC without
 * having to register the element as a custom element.
 *
 * NOTE: The returned type incorrectly includes _all_ properties defined on the component class,
 * even though the runtime object only uses those decorated with `@api`. This is due to a
 * limitation of TypeScript. To avoid inferring incorrect properties, provide an explicit generic
 * parameter, e.g. `createElement<typeof LightningElement>('x-foo', { is: FooCtor })`.
 * @param sel The tagname of the element to create
 * @param options Control the behavior of the created element
 * @param options.is The LWC component that the element should be
 * @param options.mode What kind of shadow root to use
 * @returns The created HTML element
 * @throws Throws when called with invalid parameters.
 * @example
 * const el = createElement('x-foo', { is: FooCtor });
 */
function createElement(sel, options) {
  if (!isObject(options) || isNull(options)) {
    throw new TypeError(`"createElement" function expects an object as second parameter but received "${toString(options)}".`);
  }
  const Ctor = options.is;
  if (!isFunction$1(Ctor)) {
    throw new TypeError(`"createElement" function expects an "is" option with a valid component constructor.`);
  }
  const {
    createCustomElement
  } = renderer;
  // tagName must be all lowercase, unfortunately, we have legacy code that is
  // passing `sel` as a camel-case, which makes them invalid custom elements name
  // the following line guarantees that this does not leaks beyond this point.
  const tagName = StringToLowerCase.call(sel);
  const useNativeCustomElementLifecycle = !lwcRuntimeFlags.DISABLE_NATIVE_CUSTOM_ELEMENT_LIFECYCLE;
  const isFormAssociated = shouldBeFormAssociated(Ctor);
  // the custom element from the registry is expecting an upgrade callback
  /*
   * Note: if the upgradable constructor does not expect, or throw when we new it
   * with a callback as the first argument, we could implement a more advanced
   * mechanism that only passes that argument if the constructor is known to be
   * an upgradable custom element.
   */
  const upgradeCallback = elm => {
    createVM(elm, Ctor, renderer, {
      tagName,
      mode: options.mode !== 'closed' ? 'open' : 'closed',
      owner: null
    });
    if (!useNativeCustomElementLifecycle) {
      // Monkey-patch on-demand, because `lwcRuntimeFlags.DISABLE_NATIVE_CUSTOM_ELEMENT_LIFECYCLE` may be set to
      // `true` lazily, after `@lwc/engine-dom` has finished initializing but before a component has rendered.
      monkeyPatchDomAPIs();
      ConnectingSlot.set(elm, connectRootElement);
      DisconnectingSlot.set(elm, disconnectRootElement);
    }
  };
  return createCustomElement(tagName, upgradeCallback, useNativeCustomElementLifecycle, isFormAssociated);
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

function stylesheet$n(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return [((useActualHostSelector ? ":host([data-render-mode='shadow']) *" + shadowSelector + ",:host([data-render-mode='shadow']) " + shadowSelector + "::before,:host([data-render-mode='shadow']) " : hostSelector + "[data-render-mode='shadow'] *" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] " + shadowSelector + "::before," + hostSelector + "[data-render-mode='shadow'] ")), shadowSelector, "::after {box-sizing: border-box;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) h1" + shadowSelector + ",:host([data-render-mode='shadow']) h2" + shadowSelector + ",:host([data-render-mode='shadow']) h3" + shadowSelector + ",:host([data-render-mode='shadow']) h4" + shadowSelector + ",:host([data-render-mode='shadow']) h5" + shadowSelector + ",:host([data-render-mode='shadow']) h6" : hostSelector + "[data-render-mode='shadow'] h1" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] h2" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] h3" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] h4" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] h5" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] h6")), shadowSelector, " {font-weight: var(--slds-s-heading-font-weight, inherit);margin-block-start: var(\n --slds-s-heading-spacing-block-start,\n var(--slds-s-heading-spacing-block)\n );margin-block-end: var(\n --slds-s-heading-spacing-block-end,\n var(--slds-s-heading-spacing-block)\n );font-size: 1em;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) a" : hostSelector + "[data-render-mode='shadow'] a")), shadowSelector, " {color: var(--slds-s-link-color);text-decoration: var(--_slds-g-font-decoration, none);transition: color 0.1s linear;background-color: transparent;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) a:active" + shadowSelector + ",:host([data-render-mode='shadow']) a:hover" : hostSelector + "[data-render-mode='shadow'] a:active" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] a:hover")), shadowSelector, " {outline: 0;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) a:hover" + shadowSelector + ",:host([data-render-mode='shadow']) a:focus" : hostSelector + "[data-render-mode='shadow'] a:hover" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] a:focus")), shadowSelector, " {text-decoration: var(--_slds-g-font-decoration-hover, underline);color: var(\n --slds-g-link-color-hover,\n var(--slds-g-color-brand-base-30, #014486)\n );}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) a:active" : hostSelector + "[data-render-mode='shadow'] a:active")), shadowSelector, " {color: var(\n --slds-g-link-color-active,\n var(--slds-g-color-brand-base-30, #014486)\n );}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) a:focus-visible" : hostSelector + "[data-render-mode='shadow'] a:focus-visible")), shadowSelector, " {outline-color: var(\n --_slds-g-color-outline,\n var(--slds-g-color-brand-base-50, #0176d3)\n );}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) a:focus" : hostSelector + "[data-render-mode='shadow'] a:focus")), shadowSelector, " {box-shadow: var(--_slds-g-shadow);border-color: var(--_slds-g-color-border);border-width: var(--_slds-g-sizing-border);border-style: var(--_slds-g-style-border);outline: var(--_slds-g-font-decoration-hover);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) a" + shadowSelector + ",:host([data-render-mode='shadow']) button" : hostSelector + "[data-render-mode='shadow'] a" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] button")), shadowSelector, " {cursor: pointer;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) p" : hostSelector + "[data-render-mode='shadow'] p")), shadowSelector, " {margin-block-start: var(\n --slds-s-content-spacing-block-start,\n var(--slds-s-content-spacing-block, 0)\n );margin-block-end: var(\n --slds-s-content-spacing-block-end,\n var(--slds-s-content-spacing-block, 0)\n );margin-inline-start: 0;margin-inline-end: 0;padding-block-start: 0;padding-block-end: 0;padding-inline-start: 0;padding-inline-end: 0;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) ol" + shadowSelector + ",:host([data-render-mode='shadow']) ul" : hostSelector + "[data-render-mode='shadow'] ol" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] ul")), shadowSelector, " {list-style: none;padding: 0;margin-block-start: var(\n --slds-s-content-spacing-block-start,\n var(--slds-s-content-spacing-block)\n );margin-block-end: var(\n --slds-s-content-spacing-block-end,\n var(--slds-s-content-spacing-block)\n );}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) button" + shadowSelector + ",:host([data-render-mode='shadow']) [type='button']" + shadowSelector + ",:host([data-render-mode='shadow']) [type='reset']" + shadowSelector + ",:host([data-render-mode='shadow']) [type='submit']" : hostSelector + "[data-render-mode='shadow'] button" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] [type='button']" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] [type='reset']" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] [type='submit']")), shadowSelector, " {-webkit-appearance: button;appearance: button;cursor: pointer;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) [type='search']" : hostSelector + "[data-render-mode='shadow'] [type='search']")), shadowSelector, " {-webkit-appearance: textfield;outline-offset: -2px;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) [type='search']" + shadowSelector + "::-webkit-search-decoration,:host([data-render-mode='shadow']) [type='search']" + shadowSelector + "::-webkit-search-cancel-button,:host([data-render-mode='shadow']) [type='search']" + shadowSelector + "::-webkit-search-results-button,:host([data-render-mode='shadow']) [type='search']" : hostSelector + "[data-render-mode='shadow'] [type='search']" + shadowSelector + "::-webkit-search-decoration," + hostSelector + "[data-render-mode='shadow'] [type='search']" + shadowSelector + "::-webkit-search-cancel-button," + hostSelector + "[data-render-mode='shadow'] [type='search']" + shadowSelector + "::-webkit-search-results-button," + hostSelector + "[data-render-mode='shadow'] [type='search']")), shadowSelector, "::-webkit-search-results-decoration {display: none;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) select" : hostSelector + "[data-render-mode='shadow'] select")), shadowSelector, " {color: inherit;font: inherit;margin: 0;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) input:focus" + shadowSelector + ",:host([data-render-mode='shadow']) button:focus" + shadowSelector + ",:host([data-render-mode='shadow']) select:focus" + shadowSelector + ",:host([data-render-mode='shadow']) textarea:focus" : hostSelector + "[data-render-mode='shadow'] input:focus" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] button:focus" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] select:focus" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] textarea:focus")), shadowSelector, " {outline-offset: 0;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) " : hostSelector + "[data-render-mode='shadow'] ")), shadowSelector, "::-moz-focus-inner {border-style: none;padding: 0;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) " : hostSelector + "[data-render-mode='shadow'] ")), shadowSelector, "::-webkit-search-decoration {-webkit-appearance: none;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) " : hostSelector + "[data-render-mode='shadow'] ")), shadowSelector, "::-webkit-file-upload-button {-webkit-appearance: button;font: inherit;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) :-moz-focusring" : hostSelector + "[data-render-mode='shadow'] :-moz-focusring")), shadowSelector, " {outline: 1px dotted ButtonText;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) :-moz-ui-invalid" : hostSelector + "[data-render-mode='shadow'] :-moz-ui-invalid")), shadowSelector, " {box-shadow: none;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) code" + shadowSelector + ",:host([data-render-mode='shadow']) kbd" + shadowSelector + ",:host([data-render-mode='shadow']) samp" + shadowSelector + ",:host([data-render-mode='shadow']) pre" : hostSelector + "[data-render-mode='shadow'] code" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] kbd" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] samp" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] pre")), shadowSelector, " {font-family: var(\n --slds-g-font-family-monospace,\n Consolas,\n Menlo,\n Monaco,\n Courier,\n monospace,\n monospace\n );font-size: var(--slds-g-font-size-base, 0.875rem, 1rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) img" + shadowSelector + ",:host([data-render-mode='shadow']) [type='image']" + shadowSelector + ",:host([data-render-mode='shadow']) canvas" + shadowSelector + ",:host([data-render-mode='shadow']) [type='canvas']" : hostSelector + "[data-render-mode='shadow'] img" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] [type='image']" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] canvas" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] [type='canvas']")), shadowSelector, " {max-width: 100%;height: auto;border: 0;vertical-align: middle;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) iframe" : hostSelector + "[data-render-mode='shadow'] iframe")), shadowSelector, " {border-style: none;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) svg:not([fill])" : hostSelector + "[data-render-mode='shadow'] svg:not([fill])")), shadowSelector, " {fill: currentColor;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) abbr[title]" : hostSelector + "[data-render-mode='shadow'] abbr[title]")), shadowSelector, " {text-decoration: none;cursor: help;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) table" : hostSelector + "[data-render-mode='shadow'] table")), shadowSelector, " {border-collapse: collapse;border-spacing: 0;border: 0;width: 100%;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) hr" : hostSelector + "[data-render-mode='shadow'] hr")), shadowSelector, " {display: block;margin: var(--slds-g-spacing-6, 2rem, 2rem) 0;border-top: var(--slds-g-sizing-border-1, 1px, 1px) solid\n var(--slds-g-color-border-base-1, #c9c9c9);height: var(--slds-g-sizing-border-1, 1px, 1px);clear: both;box-sizing: content-box;border: 0;padding: 0;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) abbr[title]" : hostSelector + "[data-render-mode='shadow'] abbr[title]")), shadowSelector, " {border-bottom: var(--slds-g-sizing-border-1, 1px, 1px) dotted;text-decoration: none;border: 0;cursor: help;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) caption" + shadowSelector + ",:host([data-render-mode='shadow']) th" + shadowSelector + ",:host([data-render-mode='shadow']) td" : hostSelector + "[data-render-mode='shadow'] caption" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] th" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] td")), shadowSelector, " {text-align: left;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) td" + shadowSelector + ",:host([data-render-mode='shadow']) th" : hostSelector + "[data-render-mode='shadow'] td" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] th")), shadowSelector, " {padding: 0;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) dl" : hostSelector + "[data-render-mode='shadow'] dl")), shadowSelector, " {margin: 0;padding: 0;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) dd" : hostSelector + "[data-render-mode='shadow'] dd")), shadowSelector, " {margin: 0;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) pre" : hostSelector + "[data-render-mode='shadow'] pre")), shadowSelector, " {overflow: auto;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) mark" : hostSelector + "[data-render-mode='shadow'] mark")), shadowSelector, " {background-color: #ff0;color: #000;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) small" : hostSelector + "[data-render-mode='shadow'] small")), shadowSelector, " {font-size: 80%;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) sub" + shadowSelector + ",:host([data-render-mode='shadow']) sup" : hostSelector + "[data-render-mode='shadow'] sub" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] sup")), shadowSelector, " {font-size: 75%;line-height: 0;position: relative;vertical-align: baseline;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) sup" : hostSelector + "[data-render-mode='shadow'] sup")), shadowSelector, " {top: -0.5em;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) sub" : hostSelector + "[data-render-mode='shadow'] sub")), shadowSelector, " {bottom: -0.25em;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) b" + shadowSelector + ",:host([data-render-mode='shadow']) strong" + shadowSelector + ",:host([data-render-mode='shadow']) dfn" : hostSelector + "[data-render-mode='shadow'] b" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] strong" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] dfn")), shadowSelector, " {font-weight: var(--slds-g-font-weight-7, 700, 700);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) b" + shadowSelector + ",:host([data-render-mode='shadow']) strong" : hostSelector + "[data-render-mode='shadow'] b" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] strong")), shadowSelector, " {font-weight: var(--slds-g-font-weight-bold, bold, bold);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) [data-f6-region].f6-highlight" : hostSelector + "[data-render-mode='shadow'] [data-f6-region].f6-highlight")), shadowSelector, " {position: relative;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) [data-f6-region].f6-highlight" : hostSelector + "[data-render-mode='shadow'] [data-f6-region].f6-highlight")), shadowSelector, "::after {width: 100%;height: 100%;content: '';outline: rgb(94, 158, 214) 3px solid;outline-offset: -3px;position: absolute;top: 0;left: 0;z-index: 9999;}"].join('');
  /*LWC compiler v9.5.3*/
}
var stylesheet0$6 = [stylesheet$n];

function stylesheet$m(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return [((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) fieldset" : hostSelector + "[data-render-mode=\"shadow\"] fieldset")), shadowSelector, " {border: 0;margin: 0;padding: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element")), shadowSelector, " {position: relative;min-width: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element__label" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element__label")), shadowSelector, " {overflow-wrap: break-word;word-wrap: break-word;hyphens: auto;display: inline-block;color: var(--slds-s-label-color, var(--slds-g-color-on-surface-2, #2e2e2e));font-size: var(--slds-s-label-font-size, var(--slds-g-font-scale-neg-2, 0.625rem));padding-inline-end: var(--slds-g-spacing-2, 0.5rem);padding-block-start: var(--slds-g-spacing-1, 0.25rem);margin-block-end: var(--slds-s-label-spacing-gap, calc(var(--slds-g-spacing-1, 0.25rem) / 2));}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element__label:empty" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element__label:empty")), shadowSelector, " {margin: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element__control" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element__control")), shadowSelector, " {clear: inline-start;position: relative;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element__control" + shadowSelector + " .slds-radio" + shadowSelector + ",:host([data-render-mode=\"shadow\"]) .slds-form-element__control" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element__control" + shadowSelector + " .slds-radio" + shadowSelector + "," + hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element__control")), shadowSelector, " .slds-checkbox", shadowSelector, " {display: block;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [dir='rtl']" : hostSelector + "[data-render-mode=\"shadow\"] [dir='rtl']")), shadowSelector, " .slds-form-element__label", shadowSelector, " {padding-inline-end: 0;padding-inline-start: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [dir='rtl']" : hostSelector + "[data-render-mode=\"shadow\"] [dir='rtl']")), shadowSelector, " .slds-form-element__control", shadowSelector, " {clear: inline-end;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element__icon" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element__icon")), shadowSelector, " {display: inline-block;position: relative;padding-block-start: var(--slds-g-spacing-1, 0.25rem);vertical-align: top;line-height: var(--slds-g-font-lineheight-1, 1);z-index: 1;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element__icon" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element__icon")), shadowSelector, " .slds-button_icon", shadowSelector, " {position: relative;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) div[data-name^='dt-inline-edit-']" : hostSelector + "[data-render-mode=\"shadow\"] div[data-name^='dt-inline-edit-']")), shadowSelector, " {width: 100%;padding-inline-start: var(--slds-g-spacing-3, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element__help" + shadowSelector + ",:host([data-render-mode=\"shadow\"]) .slds-form-element__helper" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element__help" + shadowSelector + "," + hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element__helper")), shadowSelector, " {font-size: var(--slds-s-helptext-font-size, var(--slds-g-font-scale-neg-2, 0.625rem));margin-block-start: calc(var(--slds-g-spacing-1, 0.25rem) / 2);display: block;color: var(--slds-s-helptext-color);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element_edit" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element_edit")), shadowSelector, " .slds-form-element__static", shadowSelector, " {width: calc(100% - var(--slds-g-sizing-7, 1.5rem));}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element_readonly" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element_readonly")), shadowSelector, " {flex-basis: 0%;border-bottom: var(--slds-g-sizing-border-1, 1px) solid var(--slds-g-color-border-1, var(--slds-g-color-neutral-base-80));margin-block-end: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element_readonly" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element_readonly")), shadowSelector, " .slds-form-element__control", shadowSelector, " {padding-block-start: calc(var(--slds-g-spacing-1, 0.25rem) / 2);padding-block-end: calc(var(--slds-g-spacing-1, 0.25rem) / 2);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element_readonly" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element_readonly")), shadowSelector, " .slds-form-element__label", shadowSelector, " {margin-block-end: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element__legend" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element__legend")), shadowSelector, " {font-weight: var(--slds-g-font-weight-7, 700);float: inline-start;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [dir='rtl']" : hostSelector + "[data-render-mode=\"shadow\"] [dir='rtl']")), shadowSelector, " .slds-form-element__legend", shadowSelector, " {float: inline-end;padding-inline-end: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element__addon" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element__addon")), shadowSelector, " {display: inline-block;margin-block-start: 0;margin-block-end: 0;margin-inline-start: var(--slds-g-spacing-2, 0.5rem);margin-inline-end: var(--slds-g-spacing-2, 0.5rem);align-self: center;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element__static" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element__static")), shadowSelector, " {overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;display: inline-block;font-size: var(--slds-s-label-font-size, var(--slds-g-font-scale-neg-1, 0.75rem));font-weight: var(--slds-g-font-weight-4, 400);color: var(--slds-g-color-neutral-base-10, #181818);width: 100%;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element__static.slds-text-longform" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element__static.slds-text-longform")), shadowSelector, " *:last-child", shadowSelector, " {margin-block-end: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element__static:empty" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element__static:empty")), shadowSelector, " {min-height: calc(var(--slds-g-sizing-6, 1.25rem) + 1px);vertical-align: bottom;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element__static--edit" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element__static--edit")), shadowSelector, " {width: calc(100% - var(--slds-g-sizing-7, 1.5rem));}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-required" : hostSelector + "[data-render-mode=\"shadow\"] .slds-required")), shadowSelector, " {color: var(--slds-g-color-error-1, #ba0517);margin-block-start: 0;margin-block-end: 0;margin-inline-start: calc(var(--slds-g-spacing-1, 0.25rem) / 2);margin-inline-end: calc(var(--slds-g-spacing-1, 0.25rem) / 2);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-has-error" + shadowSelector + " .slds-form-element__help" + shadowSelector + ",:host([data-render-mode=\"shadow\"][invalid]) .slds-form-element__help" : hostSelector + "[data-render-mode=\"shadow\"] .slds-has-error" + shadowSelector + " .slds-form-element__help" + shadowSelector + "," + hostSelector + "[invalid][data-render-mode=\"shadow\"] .slds-form-element__help")), shadowSelector, " {color: var(--slds-g-color-error-1, #ba0517);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form_inline" + shadowSelector + " .slds-form-element" + shadowSelector + ",:host([data-render-mode=\"shadow\"]) .slds-form_inline" + shadowSelector + " .slds-form-element__label" + shadowSelector + ",:host([data-render-mode=\"shadow\"]) .slds-form_inline" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form_inline" + shadowSelector + " .slds-form-element" + shadowSelector + "," + hostSelector + "[data-render-mode=\"shadow\"] .slds-form_inline" + shadowSelector + " .slds-form-element__label" + shadowSelector + "," + hostSelector + "[data-render-mode=\"shadow\"] .slds-form_inline")), shadowSelector, " .slds-form-element__control", shadowSelector, " {display: block;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form_inline" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form_inline")), shadowSelector, " .slds-form-element", shadowSelector, " + .slds-form-element", shadowSelector, " {margin-block-start: var(--slds-g-spacing-3, 0.75rem);}@media (width >= 30em) {", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form_inline" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form_inline")), shadowSelector, " .slds-form-element", shadowSelector, " {margin-inline-end: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form_inline" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form_inline")), shadowSelector, " .slds-form-element", shadowSelector, " + .slds-form-element", shadowSelector, " {margin-block-start: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form_inline" + shadowSelector + " .slds-form-element" + shadowSelector + ",:host([data-render-mode=\"shadow\"]) .slds-form_inline" + shadowSelector + " .slds-form-element__label" + shadowSelector + ",:host([data-render-mode=\"shadow\"]) .slds-form_inline" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form_inline" + shadowSelector + " .slds-form-element" + shadowSelector + "," + hostSelector + "[data-render-mode=\"shadow\"] .slds-form_inline" + shadowSelector + " .slds-form-element__label" + shadowSelector + "," + hostSelector + "[data-render-mode=\"shadow\"] .slds-form_inline")), shadowSelector, " .slds-form-element__control", shadowSelector, " {display: inline-block;vertical-align: middle;margin-block-end: 0;}}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element__legend_has-tooltip" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element__legend_has-tooltip")), shadowSelector, " {float: inline-start;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element_address" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element_address")), shadowSelector, " .slds-form-element__row", shadowSelector, " {align-items: flex-end;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-stacked']) {" : hostSelector + "[variant='label-stacked'][data-render-mode=\"shadow\"] {")), "display: block;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-stacked']:not(.slds-form-element_readonly)) {" : hostSelector + ":not(.slds-form-element_readonly)[variant='label-stacked'][data-render-mode=\"shadow\"] {")), "margin-block-end: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-stacked']:not(.slds-is-editing)) {" : hostSelector + ":not(.slds-is-editing)[variant='label-stacked'][data-render-mode=\"shadow\"] {")), "padding-block-start: 0;padding-block-end: 0;padding-inline-start: var(--slds-g-spacing-1, 0.25rem);padding-inline-end: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-stacked']) .slds-form-element" : hostSelector + "[variant='label-stacked'][data-render-mode=\"shadow\"] .slds-form-element")), shadowSelector, " {padding: 0;margin-block-end: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-stacked']:not([class*='slds-size'])) {" : hostSelector + ":not([class*='slds-size'])[variant='label-stacked'][data-render-mode=\"shadow\"] {")), "width: 100%;flex-basis: 100%;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-stacked']) .slds-checkbox" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='label-stacked']) .slds-radio" : hostSelector + "[variant='label-stacked'][data-render-mode=\"shadow\"] .slds-checkbox" + shadowSelector + "," + hostSelector + "[variant='label-stacked'][data-render-mode=\"shadow\"] .slds-radio")), shadowSelector, " {display: block;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-stacked']) .slds-form-element__label" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant=\"label-stacked\"]) " + shadowSelector + "::part(rich-text-label),:host([data-render-mode=\"shadow\"][variant='label-stacked']) .slds-form-element__control" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant=\"label-stacked\"]) " : hostSelector + "[variant='label-stacked'][data-render-mode=\"shadow\"] .slds-form-element__label" + shadowSelector + "," + hostSelector + "[variant=\"label-stacked\"][data-render-mode=\"shadow\"] " + shadowSelector + "::part(rich-text-label)," + hostSelector + "[variant='label-stacked'][data-render-mode=\"shadow\"] .slds-form-element__control" + shadowSelector + "," + hostSelector + "[variant=\"label-stacked\"][data-render-mode=\"shadow\"] ")), shadowSelector, "::part(rich-text-editor-container) {padding-inline-start: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-stacked']) .slds-form-element__control" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='label-stacked']) " : hostSelector + "[variant='label-stacked'][data-render-mode=\"shadow\"] .slds-form-element__control" + shadowSelector + "," + hostSelector + "[variant='label-stacked'][data-render-mode=\"shadow\"] ")), shadowSelector, "::part(rich-text-editor-container) {width: 100%;flex-basis: 100%;clear: inline-start;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [dir='rtl']" : hostSelector + "[data-render-mode=\"shadow\"] [dir='rtl']")), shadowSelector, " :host([data-render-mode=\"shadow\"][variant='label-stacked']) .slds-form-element__control", shadowSelector, " {clear: inline-end;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-stacked']) .slds-form-element__icon" : hostSelector + "[variant='label-stacked'][data-render-mode=\"shadow\"] .slds-form-element__icon")), shadowSelector, " {float: none;padding-block-start: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']) {" : hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] {")), "display: block;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-form-element" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='label-inline']) [variant='label-inline']" : hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] .slds-form-element" + shadowSelector + "," + hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] [variant='label-inline']")), shadowSelector, " {padding: 0;margin-block-end: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline'].slds-form-element_horizontal) {" : hostSelector + ".slds-form-element_horizontal[variant='label-inline'][data-render-mode=\"shadow\"] {")), "padding: var(--slds-g-spacing-1, 0.25rem);margin-block-end: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']:not(.slds-form-element_readonly)) {" : hostSelector + ":not(.slds-form-element_readonly)[variant='label-inline'][data-render-mode=\"shadow\"] {")), "margin-block-end: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']:not([class*='slds-size'])) {" : hostSelector + ":not([class*='slds-size'])[variant='label-inline'][data-render-mode=\"shadow\"] {")), "width: 100%;flex-basis: 100%;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']:not(.slds-is-editing)) {" : hostSelector + ":not(.slds-is-editing)[variant='label-inline'][data-render-mode=\"shadow\"] {")), "padding: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline'].slds-is-edited) {" : hostSelector + ".slds-is-edited[variant='label-inline'][data-render-mode=\"shadow\"] {")), "padding-block-start: calc(var(--slds-g-spacing-4, 1rem) + var(--slds-g-spacing-1, 0.25rem));}@media (width >= 48em) {", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline'].slds-form-element_horizontal.slds-form-element_1-col) .slds-form-element__label" : hostSelector + ".slds-form-element_1-col.slds-form-element_horizontal[variant='label-inline'][data-render-mode=\"shadow\"] .slds-form-element__label")), shadowSelector, " {max-width: calc((50% - 33.333%) - var(--slds-g-sizing-6, 1.25rem));}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline'].slds-form-element_horizontal.slds-form-element_1-col) .slds-form-element__control" : hostSelector + ".slds-form-element_1-col.slds-form-element_horizontal[variant='label-inline'][data-render-mode=\"shadow\"] .slds-form-element__control")), shadowSelector, " {padding-inline-start: calc((50% - 33.333%) - var(--slds-g-sizing-3, 0.5rem));}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-form-element__label" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='label-inline']) " : hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] .slds-form-element__label" + shadowSelector + "," + hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] ")), shadowSelector, "::part(rich-text-label) {float: inline-start;max-width: calc(\n 33% - var(--slds-g-sizing-6, 1.25rem)\n );flex-basis: calc(33% - var(--slds-g-sizing-6, 1.25rem));margin-block-end: 0;position: relative;z-index: 1;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']) lightning-helptext" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='label-inline']) " : hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] lightning-helptext" + shadowSelector + "," + hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] ")), shadowSelector, "::part(helptext) {float: inline-start;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-form-element__control" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='label-inline']) " : hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] .slds-form-element__control" + shadowSelector + "," + hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] ")), shadowSelector, "::part(rich-text-editor-container) {margin-inline-start: 33%;clear: none;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-form-element__control" : hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] .slds-form-element__control")), shadowSelector, " .slds-form-element__control", shadowSelector, " {padding-inline-start: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-form-element__icon" : hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] .slds-form-element__icon")), shadowSelector, " {float: inline-start;padding-block-start: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-checkbox_standalone" : hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] .slds-checkbox_standalone")), shadowSelector, " {padding-block: var(--slds-g-spacing-1, 0.25rem);padding-inline: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-checkbox:not(.slds-checkbox_stacked)" + shadowSelector + " .slds-form-element__label" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-radio" + shadowSelector + " .slds-form-element__label" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-form-element" + shadowSelector + " .slds-checkbox:not(.slds-checkbox_stacked)" + shadowSelector + " .slds-form-element__label" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-form-element" + shadowSelector + " .slds-radio" + shadowSelector + " .slds-form-element__label" + shadowSelector + ",:host([data-render-mode=\"shadow\"]) .slds-form_stacked" + shadowSelector + " :host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-checkbox:not(.slds-checkbox_stacked)" + shadowSelector + " .slds-form-element__label" + shadowSelector + ",:host([data-render-mode=\"shadow\"]) .slds-form_stacked" : hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] .slds-checkbox:not(.slds-checkbox_stacked)" + shadowSelector + " .slds-form-element__label" + shadowSelector + "," + hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] .slds-radio" + shadowSelector + " .slds-form-element__label" + shadowSelector + "," + hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] .slds-form-element" + shadowSelector + " .slds-checkbox:not(.slds-checkbox_stacked)" + shadowSelector + " .slds-form-element__label" + shadowSelector + "," + hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] .slds-form-element" + shadowSelector + " .slds-radio" + shadowSelector + " .slds-form-element__label" + shadowSelector + "," + hostSelector + "[data-render-mode=\"shadow\"] .slds-form_stacked" + shadowSelector + " :host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-checkbox:not(.slds-checkbox_stacked)" + shadowSelector + " .slds-form-element__label" + shadowSelector + "," + hostSelector + "[data-render-mode=\"shadow\"] .slds-form_stacked")), shadowSelector, " :host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-radio", shadowSelector, " .slds-form-element__label", shadowSelector, " {position: relative;float: none;max-width: 100%;width: auto;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-form-element__row" + shadowSelector + " .slds-form-element__label" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-form-element__row" + shadowSelector + " .slds-form-element__control" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-dueling-list__column" : hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] .slds-form-element__row" + shadowSelector + " .slds-form-element__label" + shadowSelector + "," + hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] .slds-form-element__row" + shadowSelector + " .slds-form-element__control" + shadowSelector + "," + hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] .slds-dueling-list__column")), shadowSelector, " .slds-form-element__label", shadowSelector, " {width: auto;max-width: 100%;flex-basis: auto;float: none;position: relative;padding-inline-start: 0;margin-block-end: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-dueling-list" : hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] .slds-dueling-list")), shadowSelector, " {clear: none;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-input-has-icon_left" : hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] .slds-input-has-icon_left")), shadowSelector, " .slds-input__icon", shadowSelector, " {inset-inline-start: calc(33% + var(--slds-g-sizing-4, 0.75rem));}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-input-has-icon_left-right" : hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] .slds-input-has-icon_left-right")), shadowSelector, " .slds-input__icon_left", shadowSelector, " {inset-inline-start: calc(33% + var(--slds-g-sizing-4, 0.75rem));}}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']) .slds-form-element__help" : hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] .slds-form-element__help")), shadowSelector, " {margin-inline-start: 33%;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element_compound" + shadowSelector + " .slds-form-element__row" + shadowSelector + ",:host([data-render-mode=\"shadow\"].slds-form-element_compound) .slds-form-element__row" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element_compound" + shadowSelector + " .slds-form-element__row" + shadowSelector + "," + hostSelector + ".slds-form-element_compound[data-render-mode=\"shadow\"] .slds-form-element__row")), shadowSelector, " {display: flex;margin-block-end: var(--slds-g-spacing-1, 0.25rem);margin-inline-start: calc(var(--slds-g-spacing-1, 0.25rem) * -1);margin-inline-end: calc(var(--slds-g-spacing-1, 0.25rem) * -1);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element_compound" + shadowSelector + " .slds-form-element__row" + shadowSelector + " .slds-form-element__label" + shadowSelector + ",:host([data-render-mode=\"shadow\"].slds-form-element_compound) .slds-form-element__row" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element_compound" + shadowSelector + " .slds-form-element__row" + shadowSelector + " .slds-form-element__label" + shadowSelector + "," + hostSelector + ".slds-form-element_compound[data-render-mode=\"shadow\"] .slds-form-element__row")), shadowSelector, " .slds-form-element__label", shadowSelector, " {padding-block-start: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element_compound" + shadowSelector + " .slds-form-element" + shadowSelector + ",:host([data-render-mode=\"shadow\"].slds-form-element_compound) .slds-form-element" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element_compound" + shadowSelector + " .slds-form-element" + shadowSelector + "," + hostSelector + ".slds-form-element_compound[data-render-mode=\"shadow\"] .slds-form-element")), shadowSelector, " {padding-inline-start: var(--slds-g-spacing-1, 0.25rem);padding-inline-end: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form_compound" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form_compound")), shadowSelector, " {width: 100%;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form_compound" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form_compound")), shadowSelector, " > .slds-form-element", shadowSelector, " {margin-block-start: 0;margin-block-end: 0;margin-inline-start: 0;margin-inline-end: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form_compound" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form_compound")), shadowSelector, " .slds-form-element__row", shadowSelector, " {display: flex;margin-block-start: 0;margin-block-end: var(--slds-g-spacing-1, 0.25rem);margin-inline-start: 0;margin-inline-end: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form_compound" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form_compound")), shadowSelector, " .slds-form-element__row", shadowSelector, " + .slds-form-element__row", shadowSelector, " {clear: both;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form_compound" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form_compound")), shadowSelector, " .slds-form-element__row", shadowSelector, " .slds-form-element", shadowSelector, " {margin-block-end: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form_compound" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form_compound")), shadowSelector, " .slds-form-element__row", shadowSelector, " .slds-form-element", shadowSelector, " + .slds-form-element", shadowSelector, " {padding-inline-start: var(--slds-g-spacing-2, 0.5rem);margin-block-start: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form_compound" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form_compound")), shadowSelector, " .slds-form-element__row", shadowSelector, " .slds-form-element__label", shadowSelector, " {padding-block-start: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form__row" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form__row")), shadowSelector, " {display: flex;flex-wrap: wrap;margin-inline-start: calc(var(--slds-g-spacing-3, 0.75rem) * -1);margin-inline-end: calc(var(--slds-g-spacing-3, 0.75rem) * -1);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form__item" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form__item")), shadowSelector, " {display: flex;flex: 1 1 0%;min-width: 280px;padding-inline-start: var(--slds-g-spacing-3, 0.75rem);padding-inline-end: var(--slds-g-spacing-3, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-is-edited" : hostSelector + "[data-render-mode=\"shadow\"] .slds-is-edited")), shadowSelector, " {background: var(--slds-g-color-palette-yellow-90, #f9e3b6);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-is-edited" : hostSelector + "[data-render-mode=\"shadow\"] .slds-is-edited")), shadowSelector, " .slds-form-element__undo", shadowSelector, " {inset-block-start: calc(var(--slds-g-spacing-1, 0.25rem) * -5);inset-inline-end: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-form-element__undo" : hostSelector + "[data-render-mode=\"shadow\"] .slds-form-element__undo")), shadowSelector, " {position: absolute;inset-block-start: 0;inset-inline-end: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-hidden']) .slds-form-element__label" : hostSelector + "[variant='label-hidden'][data-render-mode=\"shadow\"] .slds-form-element__label")), shadowSelector, " {display: none;}"].join('');
  /*LWC compiler v9.5.3*/
}
var stylesheet1$8 = [stylesheet$m];

function stylesheet$l(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return [((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='input-container']" : hostSelector + "[data-render-mode=\"shadow\"] [part~='input-container']")), shadowSelector, " {display: flex;align-items: center;gap: var(--sds-c-inputtext-spacing-gap, var(--slds-s-input-spacing-gap));min-height: var(--sds-c-inputtext-sizing-height, var(--slds-s-input-sizing-height));padding-inline-start: var(\n --sds-c-inputtext-spacing-inlinestart,\n var(--sds-c-inputtext-spacing-inline, var(--slds-s-input-spacing))\n );padding-inline-end: var(\n --sds-c-inputtext-spacing-inlineend,\n var(--sds-c-inputtext-spacing-inline, var(--slds-s-input-spacing))\n );padding-block-start: var(\n --sds-c-inputtext-spacing-blockstart,\n var(--sds-c-inputtext-spacing-block, var(--slds-s-input-spacing))\n );padding-block-end: var(\n --sds-c-inputtext-spacing-blockend,\n var(--sds-c-inputtext-spacing-block, var(--slds-s-input-spacing))\n );background: var(--sds-c-inputtext-color-background, var(--slds-s-input-color-background));border-block-start: var(\n --sds-c-inputtext-sizing-border-blockstart,\n var(--sds-c-inputtext-sizing-border, 1px)\n )\n solid\n var(\n --sds-c-inputtext-color-border-blockstart,\n var(--sds-c-inputtext-color-border, var(--slds-s-input-color-border, currentColor))\n );border-inline-start: var(\n --sds-c-inputtext-sizing-border-inlinestart,\n var(--sds-c-inputtext-sizing-border, 1px)\n )\n solid\n var(\n --sds-c-inputtext-color-border-inlinestart,\n var(--sds-c-inputtext-color-border, var(--slds-s-input-color-border, currentColor))\n );border-inline-end: var(--sds-c-inputtext-sizing-border-inlineend, var(--sds-c-inputtext-sizing-border, 1px))\n solid\n var(\n --sds-c-inputtext-color-border-inlineend,\n var(--sds-c-inputtext-color-border, var(--slds-s-input-color-border, currentColor))\n );border-block-end: var(--sds-c-inputtext-sizing-border-blockend, var(--sds-c-inputtext-sizing-border, 1px))\n solid\n var(\n --sds-c-inputtext-color-border-blockend,\n var(--sds-c-inputtext-color-border, var(--slds-s-input-color-border, currentColor))\n );border-radius: var(--sds-c-inputtext-radius-border, var(--slds-s-input-radius-border));box-shadow: var(--sds-c-inputtext-shadow, var(--slds-s-input-shadow));}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='input']" : hostSelector + "[data-render-mode=\"shadow\"] [part~='input']")), shadowSelector, " {width: 100%;height: 100%;padding: 0;font-size: var(--sds-c-inputtext-font-size, var(--slds-s-input-font-size));color: var(--sds-c-inputtext-text-color, var(--slds-s-input-text-color));line-height: 1;border: none;background: transparent;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][active]) [part~='input-container']" : hostSelector + "[active][data-render-mode=\"shadow\"] [part~='input-container']")), shadowSelector, " {--sds-c-inputtext-color-background: var(\n --sds-c-inputtext-color-background-active,\n var(--slds-s-input-color-background-active)\n );--sds-c-inputtext-color-border: var(\n --sds-c-inputtext-color-border-active,\n var(--slds-s-input-color-border-active)\n );--sds-c-inputtext-shadow: var(--sds-c-inputtext-shadow-active, var(--slds-s-input-shadow-active));}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='input']" : hostSelector + "[data-render-mode=\"shadow\"] [part~='input']")), shadowSelector, "::placeholder {color: var(--sds-c-inputtext-text-color-placeholder, var(--slds-s-input-text-color-placeholder));font-style: var(--sds-c-inputtext-font-style-placeholder, var(--slds-s-input-font-style-placeholder));}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='input-container']:focus-within" : hostSelector + "[data-render-mode=\"shadow\"] [part~='input-container']:focus-within")), shadowSelector, " {--sds-c-inputtext-color-border: var(\n --sds-c-inputtext-color-border-focus,\n var(--slds-s-input-color-border-focus, revert)\n );--sds-c-inputtext-shadow: var(--sds-c-inputtext-shadow-focus, var(--slds-s-input-shadow-focus));--sds-c-inputtext-color-background: var(\n --sds-c-inputtext-color-background-focus,\n var(--slds-s-input-color-background-focus, revert)\n );--sds-c-inputtext-text-color: var(\n --sds-c-inputtext-text-color-focus,\n var(--slds-s-input-text-color-focus, revert)\n );}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='input']:focus" : hostSelector + "[data-render-mode=\"shadow\"] [part~='input']:focus")), shadowSelector, " {outline: none;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='label-container']" : hostSelector + "[data-render-mode=\"shadow\"] [part='label-container']")), shadowSelector, " {display: inline-flex;align-items: center;gap: var(--sds-c-inputtext-label-spacing-gap, var(--slds-s-label-spacing-gap));padding-inline-start: var(\n --sds-c-inputtext-label-spacing-inlinestart,\n var(--sds-c-inputtext-label-spacing-inline, var(--slds-s-label-spacing))\n );padding-inline-end: var(\n --sds-c-inputtext-label-spacing-inlineend,\n var(--sds-c-inputtext-label-spacing-inline, var(--slds-s-label-spacing))\n );padding-block-start: var(\n --sds-c-inputtext-label-spacing-blockstart,\n var(--sds-c-inputtext-label-spacing-block, var(--slds-s-label-spacing))\n );padding-block-end: var(\n --sds-c-inputtext-label-spacing-blockend,\n var(--sds-c-inputtext-label-spacing-block, var(--slds-s-label-spacing))\n );color: var(--sds-c-inputtext-label-color, var(--slds-s-label-color));}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='label']" : hostSelector + "[data-render-mode=\"shadow\"] [part='label']")), shadowSelector, " {font-size: var(--sds-c-inputtext-label-font-size, var(--slds-s-label-font-size));font-weight: var(--sds-c-inputtext-label-font-weight, var(--slds-s-label-font-weight));}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='help-text visible']" : hostSelector + "[data-render-mode=\"shadow\"] [part='help-text visible']")), shadowSelector, " {font-size: var(--sds-c-inputtext-helptext-font-size, var(--slds-s-helptext-font-size));color: var(--sds-c-inputtext-helptext-text-color, var(--slds-s-helptext-text-color));padding-inline-start: var(\n --sds-c-inputtext-helptext-spacing-inlinestart,\n var(--sds-c-inputtext-helptext-spacing-inline, var(--slds-s-helptext-spacing))\n );padding-inline-end: var(\n --sds-c-inputtext-helptext-spacing-inlineend,\n var(--sds-c-inputtext-helptext-spacing-inline, var(--slds-s-helptext-spacing))\n );padding-block-start: var(\n --sds-c-inputtext-helptext-spacing-blockstart,\n var(--sds-c-inputtext-helptext-spacing-block, var(--slds-s-helptext-spacing))\n );padding-block-end: var(\n --sds-c-inputtext-helptext-spacing-blockend,\n var(--sds-c-inputtext-helptext-spacing-block, var(--slds-s-helptext-spacing))\n );}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][disabled]) {" : hostSelector + "[disabled][data-render-mode=\"shadow\"] {")), "--sds-c-inputtext-color-background: var(\n --sds-c-inputtext-color-background-disabled,\n var(--slds-s-input-color-background-disabled)\n );--sds-c-inputtext-color-border: var(\n --sds-c-inputtext-color-border-disabled,\n var(--slds-s-input-color-border-disabled)\n );}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][label-hidden]) [part='label-container']" : hostSelector + "[label-hidden][data-render-mode=\"shadow\"] [part='label-container']")), shadowSelector, " {position: absolute !important;margin: -1px !important;border: 0 !important;padding: 0 !important;width: 1px !important;height: 1px !important;overflow: hidden !important;clip: rect(0 0 0 0) !important;text-transform: none !important;white-space: nowrap !important;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='input-text']" : hostSelector + "[data-render-mode=\"shadow\"] [part='input-text']")), shadowSelector, " {--slds-c-icon-color-foreground: var(\n --slds-c-inputtext-icon-color-foreground,\n var(--slds-g-color-on-surface-1, #747474)\n );--slds-c-icon-sizing: var(--slds-c-inputtext-icon-sizing, 14px);--sds-c-inputtext-sizing-height: var(--slds-c-inputtext-sizing-height, var(--slds-g-sizing-9, 2rem));--sds-c-inputtext-color-background: var(\n --slds-c-inputtext-color-background,\n var(--slds-g-color-surface-container-1, #ffffff)\n );--sds-c-inputtext-color-background-focus: var(\n --slds-c-inputtext-color-background-focus,\n var(--slds-g-color-surface-container-1, #ffffff)\n );--sds-c-inputtext-text-color: var(--slds-c-inputtext-text-color);--sds-c-inputtext-font-size: var(--slds-c-inputtext-font-size, var(--slds-g-font-size-base, 0.8125rem));--sds-c-inputtext-text-color-placeholder: var(\n --slds-c-inputtext-text-color-placeholder,\n var(--slds-g-color-on-surface-1, #747474)\n );--sds-c-inputtext-color-border: var(--slds-c-inputtext-color-border, var(--slds-g-color-border-2, var(--slds-g-color-neutral-base-50)));--sds-c-inputtext-sizing-border: var(--slds-c-inputtext-sizing-border);--sds-c-inputtext-radius-border: var(--slds-c-inputtext-radius-border, var(--slds-g-radius-border-2, 0.25rem));display: flex;flex-wrap: wrap;flex-direction: column;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='input-container']" : hostSelector + "[data-render-mode=\"shadow\"] [part='input-container']")), shadowSelector, " {flex: 1 0 100%;align-items: stretch;--sds-c-inputtext-spacing-inline: 0;--sds-c-inputtext-spacing-block: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='input-container'][type='range']" : hostSelector + "[data-render-mode=\"shadow\"] [part='input-container'][type='range']")), shadowSelector, " {border: none;display: inline-block;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='input-container']" : hostSelector + "[data-render-mode=\"shadow\"] [part='input-container']")), shadowSelector, " .slds-input__icon:not(button)", shadowSelector, " {pointer-events: none;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='input'][type='range']" : hostSelector + "[data-render-mode=\"shadow\"] [part='input'][type='range']")), shadowSelector, " {min-height: calc(1.875rem + (1px * 2));margin: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='input-container'][type='range']:focus-within" + shadowSelector + ",:host([data-render-mode=\"shadow\"]) [part='input-container'][type='range']:active" : hostSelector + "[data-render-mode=\"shadow\"] [part='input-container'][type='range']:focus-within" + shadowSelector + "," + hostSelector + "[data-render-mode=\"shadow\"] [part='input-container'][type='range']:active")), shadowSelector, " {--sds-c-inputtext-color-border: var(--slds-g-color-border-accent-1, #0176d3);--sds-c-inputtext-shadow: 0 0 3px var(--slds-g-color-accent-2, var(--lwc-brandPrimaryActive, var(--slds-g-color-brand-base-50)));--sds-c-inputtext-color-background: var(--slds-g-color-surface-container-1, #ffffff);outline: 0;border-width: var(--sds-c-inputtext-sizing-border, var(--slds-g-sizing-border-1, 1px));border-color: var(--sds-c-inputtext-color-border, var(--slds-g-color-border-2, var(--slds-g-color-neutral-base-50)));}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='input']" : hostSelector + "[data-render-mode=\"shadow\"] [part='input']")), shadowSelector, " {padding-inline-start: var(--slds-c-inputtext-spacing-inlinestart, var(--slds-g-spacing-3, 0.75rem));padding-inline-end: var(--slds-c-inputtext-spacing-inlineend, var(--slds-g-spacing-4, 1rem));height: unset;font-family: var(--slds-g-font-family, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol');}", ((useActualHostSelector ? ":host(:not([disabled])) [part='input-container']:focus-within" + shadowSelector + ",:host(:not([disabled])) [part='input-container']:active" : hostSelector + ":not([disabled]) [part='input-container']:focus-within" + shadowSelector + "," + hostSelector + ":not([disabled]) [part='input-container']:active")), shadowSelector, " {--sds-c-inputtext-color-border: var(--slds-g-color-border-accent-1, #0176d3);--sds-c-inputtext-shadow: 0 0 var(--slds-g-sizing-border-3, 3px) var(--slds-g-color-accent-2, var(--lwc-brandPrimaryActive, var(--slds-g-color-brand-base-50)));--sds-c-inputtext-color-background: var(--slds-g-color-surface-container-1, #ffffff);outline: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][readonly]) [part='input-text']" : hostSelector + "[readonly][data-render-mode=\"shadow\"] [part='input-text']")), shadowSelector, " {--sds-c-inputtext-spacing-inline-start-readonly: 0;--sds-c-inputtext-color-border-focus: transparent;--slds-c-inputtext-color-border: transparent;--slds-c-inputtext-color-background: transparent;--slds-c-inputtext-color-background-focus: transparent;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][readonly]) [part='input-container']:focus-within" + shadowSelector + ",:host([data-render-mode=\"shadow\"][readonly]) [part='input-container']:active" : hostSelector + "[readonly][data-render-mode=\"shadow\"] [part='input-container']:focus-within" + shadowSelector + "," + hostSelector + "[readonly][data-render-mode=\"shadow\"] [part='input-container']:active")), shadowSelector, " {--sds-c-inputtext-color-border: var(--slds-g-color-disabled-container-2, #c9c9c9);--sds-c-inputtext-shadow: 0 0 var(--slds-g-sizing-border-3, 3px) var(--slds-g-color-accent-2, var(--lwc-brandPrimaryActive, var(--slds-g-color-brand-base-50)));--sds-c-inputtext-color-background: transparent;outline: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][invalid]) [part='input-text']" : hostSelector + "[invalid][data-render-mode=\"shadow\"] [part='input-text']")), shadowSelector, " {--sds-c-inputtext-shadow: 0 0 0 var(--slds-g-sizing-border-1, 1px) inset var(--slds-g-color-error-1, #ba0517);--slds-c-inputtext-color-border: var(--slds-g-color-border-error-1, #ba0517);--slds-c-icon-color-foreground: var(--slds-g-color-error-1, #ba0517);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][invalid]) .slds-input-has-icon" : hostSelector + "[invalid][data-render-mode=\"shadow\"] .slds-input-has-icon")), shadowSelector, " .slds-button_icon:hover", shadowSelector, " {--slds-c-icon-color-foreground: var(--slds-g-color-error-1, #ba0517);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][invalid]) input[type='search']" : hostSelector + "[invalid][data-render-mode=\"shadow\"] input[type='search']")), shadowSelector, " {--slds-c-input-color-background: var(--slds-s-input-color-background-invalid);--slds-c-input-color-border: var(--slds-g-color-border-error-1, #ba0517);--slds-c-input-text-color: var(--slds-s-input-color-invalid);background-clip: padding-box;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][invalid]) input[type='search']" : hostSelector + "[invalid][data-render-mode=\"shadow\"] input[type='search']")), shadowSelector, " + lightning-primitive-icon", shadowSelector, "::part(icon) {fill: var(--slds-g-color-error-1, #ba0517);color: var(--slds-g-color-error-1, #ba0517);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][invalid]) [part='input-container']:focus-within" : hostSelector + "[invalid][data-render-mode=\"shadow\"] [part='input-container']:focus-within")), shadowSelector, " {--sds-c-inputtext-shadow:\n var(--slds-g-color-error-base-50, #ea001e) 0 0 0 var(--slds-g-sizing-border-1, 1px) inset,\n 0 0 var(--slds-g-sizing-border-3, 3px) var(--slds-g-color-border-error-1, #ba0517);--sds-c-inputtext-color-border: var(--slds-g-color-error-1, #ba0517);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][disabled]) [part='input-container']" + shadowSelector + ",:host([data-render-mode=\"shadow\"][disabled]) [part='input']" : hostSelector + "[disabled][data-render-mode=\"shadow\"] [part='input-container']" + shadowSelector + "," + hostSelector + "[disabled][data-render-mode=\"shadow\"] [part='input']")), shadowSelector, " {cursor: not-allowed;--sds-c-inputtext-color-background: var(\n --slds-s-input-color-background-disabled,\n var(--slds-g-color-disabled-container-1, #ffffff)\n );--sds-c-inputtext-color-border: var(--slds-g-color-border-disabled-1, #c9c9c9);--sds-c-inputtext-text-color: var(--slds-g-color-on-disabled-2, #939393);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][disabled]) [part='input-text']" : hostSelector + "[disabled][data-render-mode=\"shadow\"] [part='input-text']")), shadowSelector, " {--sds-c-inputtext-text-color-placeholder: var(--slds-g-color-on-disabled-2, #939393);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='input-text']" : hostSelector + "[data-render-mode=\"shadow\"] [part='input-text']")), shadowSelector, " [part='label']", shadowSelector, " {padding-block-start: var(--slds-g-spacing-1, 0.25rem);padding-inline-end: var(--slds-g-spacing-2, 0.5rem);color: var(--slds-c-inputtext-label-color, var(--slds-g-color-on-surface-2, #2e2e2e));margin-block-end: var(--slds-g-sizing-1, 0.125rem);display: inline-flex;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='start']" : hostSelector + "[data-render-mode=\"shadow\"] [part='start']")), shadowSelector, " {--slds-c-icon-spacing-inlineend: var(--slds-g-spacing-2, 0.5rem);}@media (width >= 48em) {", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']) [part='input-text']" : hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] [part='input-text']")), shadowSelector, " {display: block;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']) [part='label']" : hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] [part='label']")), shadowSelector, " {float: left;max-width: calc(33% - 1.125rem);padding-block-start: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']) [part='input-container']" : hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] [part='input-container']")), shadowSelector, " {margin-inline-start: 33%;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='label-inline']) [part='inline-help']" : hostSelector + "[variant='label-inline'][data-render-mode=\"shadow\"] [part='inline-help']")), shadowSelector, " {float: left;padding-block-start: var(--slds-g-spacing-1, 0.25rem);}}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) input[type='search']" : hostSelector + "[data-render-mode=\"shadow\"] input[type='search']")), shadowSelector, " + lightning-primitive-icon", shadowSelector, "::part(icon) {left: var(--slds-g-spacing-3, 0.75rem);fill: var(--slds-g-color-on-surface-1, #747474);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-input-has-icon" : hostSelector + "[data-render-mode=\"shadow\"] .slds-input-has-icon")), shadowSelector, " .slds-button_icon", shadowSelector, " {background-color: transparent;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-input-has-icon" + shadowSelector + " .slds-button_icon:focus" + shadowSelector + ",:host([data-render-mode=\"shadow\"]) .slds-input-has-icon" : hostSelector + "[data-render-mode=\"shadow\"] .slds-input-has-icon" + shadowSelector + " .slds-button_icon:focus" + shadowSelector + "," + hostSelector + "[data-render-mode=\"shadow\"] .slds-input-has-icon")), shadowSelector, " .slds-button_icon:hover", shadowSelector, " {--slds-c-icon-color-foreground: var(--slds-g-color-accent-3, #0b5cab);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-input-has-icon" : hostSelector + "[data-render-mode=\"shadow\"] .slds-input-has-icon")), shadowSelector, " .slds-input__icon", shadowSelector, " {width: 0.875rem;height: 0.875rem;position: absolute;top: 50%;margin-top: -0.4375rem;line-height: 1;border: 0;z-index: 2;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-input-has-icon_left" : hostSelector + "[data-render-mode=\"shadow\"] .slds-input-has-icon_left")), shadowSelector, " {--slds-c-inputtext-spacing-inlinestart: var(--slds-g-spacing-6, 2rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-input-has-icon_left" + shadowSelector + " .slds-input__icon" + shadowSelector + ",:host([data-render-mode=\"shadow\"]) .slds-input-has-icon_left-right" : hostSelector + "[data-render-mode=\"shadow\"] .slds-input-has-icon_left" + shadowSelector + " .slds-input__icon" + shadowSelector + "," + hostSelector + "[data-render-mode=\"shadow\"] .slds-input-has-icon_left-right")), shadowSelector, " .slds-input__icon_left", shadowSelector, " {inset-inline-start: var(--slds-g-spacing-3, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-input-has-icon_left" : hostSelector + "[data-render-mode=\"shadow\"] .slds-input-has-icon_left")), shadowSelector, " lightning-primitive-icon", shadowSelector, "::part(icon) {left: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-input-has-icon_right" : hostSelector + "[data-render-mode=\"shadow\"] .slds-input-has-icon_right")), shadowSelector, " {--slds-c-inputtext-spacing-inlineend: var(--slds-g-spacing-6, 2rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-input-has-icon_right" + shadowSelector + " .slds-input__icon" + shadowSelector + ",:host([data-render-mode=\"shadow\"]) .slds-input-has-icon_left-right" : hostSelector + "[data-render-mode=\"shadow\"] .slds-input-has-icon_right" + shadowSelector + " .slds-input__icon" + shadowSelector + "," + hostSelector + "[data-render-mode=\"shadow\"] .slds-input-has-icon_left-right")), shadowSelector, " .slds-input__icon_right", shadowSelector, " {inset-inline-end: var(--slds-g-spacing-3, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-input-has-icon_left-right" : hostSelector + "[data-render-mode=\"shadow\"] .slds-input-has-icon_left-right")), shadowSelector, " {--slds-c-inputtext-spacing-inlinestart: var(--slds-g-spacing-6, 2rem);--slds-c-inputtext-spacing-inlineend: var(--slds-g-spacing-6, 2rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-assistive-text" : hostSelector + "[data-render-mode=\"shadow\"] .slds-assistive-text")), shadowSelector, " {position: absolute !important;margin: -1px !important;border: 0 !important;padding: 0 !important;width: 1px !important;height: 1px !important;overflow: hidden !important;clip: rect(0 0 0 0) !important;text-transform: none !important;white-space: nowrap !important;}"].join('');
  /*LWC compiler v9.5.3*/
}
var stylesheet2$2 = [stylesheet$l];

function stylesheet$k(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  return "div" + shadowSelector + " {display: block;}";
  /*LWC compiler v9.5.3*/
}
var stylesheet3$2 = [stylesheet$k];

var stylesheet0$5 = [stylesheet0$6, stylesheet1$8, stylesheet2$2, stylesheet3$2];

var _implicitStylesheets$5 = [stylesheet0$5];

const $fragment1$5 = parseFragment`<label class="slds-form-element__label slds-no-flex${0}"${"a0:for"} part="label"${2}>${"t1"}</label>`;
const stc0$9 = {
  attrs: {
    "part": "input-text"
  },
  key: 0
};
const stc1$3 = {
  classMap: {
    "slds-form-element__control": true,
    "slds-grow": true
  },
  attrs: {
    "part": "input-container"
  },
  key: 3
};
const stc2$3 = {
  "slds-input": true
};
function tmpl$a($api, $cmp, $slotset, $ctx) {
  const {gid: api_scoped_id, d: api_dynamic_text, sp: api_static_part, st: api_static_fragment, h: api_element} = $api;
  return [api_element("div", stc0$9, [api_static_fragment($fragment1$5, 2, [api_static_part(0, {
    attrs: {
      "for": api_scoped_id("input")
    }
  }, null), api_static_part(1, null, api_dynamic_text($cmp.message))]), api_element("div", stc1$3, [api_element("input", {
    classMap: stc2$3,
    attrs: {
      "id": api_scoped_id("input"),
      "part": "input"
    },
    props: {
      "value": $cmp.defaultValue
    },
    key: 4
  })])])];
  /*LWC compiler v9.5.3*/
}
var _tmpl$b = registerTemplate(tmpl$a);
tmpl$a.stylesheets = [];
tmpl$a.stylesheetToken = "lwc-56g1usf24bk";
if (_implicitStylesheets$5) {
  tmpl$a.stylesheets.push.apply(tmpl$a.stylesheets, _implicitStylesheets$5);
}
freezeTemplate(tmpl$a);

function stylesheet$j(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  return ".fix-slds-modal" + shadowSelector + " {visibility: visible;z-index: unset;}.fix-slds-backdrop" + shadowSelector + " {z-index: unset;}.slds-modal_prompt" + shadowSelector + " {font-size: 0.8125rem;line-height: 1.5;}";
  /*LWC compiler v9.5.3*/
}
var stylesheet0$4 = [stylesheet$j];

function stylesheet$i(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return "*" + shadowSelector + ",*" + shadowSelector + "::before,*" + shadowSelector + "::after {box-sizing: border-box;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button']" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button']")) + shadowSelector + " {display: inline-flex;gap: var(--sds-c-button-spacing-gap, var(--slds-s-button-spacing-gap));background: var(--sds-c-button-color-background, var(--slds-s-button-color-background));color: var(--sds-c-button-text-color, var(--slds-s-button-color));font-weight: var(--sds-c-button-font-weight, var(--slds-s-button-font-weight));font-size: var(--sds-c-button-font-size, var(--slds-s-button-font-size, inherit));line-height: var(--sds-c-button-font-lineheight);height: var(--sds-c-button-sizing-height);width: var(--sds-c-button-sizing-width);padding-inline-start: var(\n --sds-c-button-spacing-inlinestart,\n var(\n --sds-c-button-spacing-inline,\n var(--sds-c-button-spacing, var(--slds-s-button-spacing-inline, var(--slds-s-button-spacing)))\n )\n );padding-inline-end: var(\n --sds-c-button-spacing-inlineend,\n var(\n --sds-c-button-spacing-inline,\n var(--sds-c-button-spacing, var(--slds-s-button-spacing-inline, var(--slds-s-button-spacing)))\n )\n );padding-block-start: var(\n --sds-c-button-spacing-blockstart,\n var(\n --sds-c-button-spacing-block,\n var(--sds-c-button-spacing, var(--slds-s-button-spacing-block, var(--slds-s-button-spacing)))\n )\n );padding-block-end: var(\n --sds-c-button-spacing-blockend,\n var(\n --sds-c-button-spacing-block,\n var(--sds-c-button-spacing, var(--slds-s-button-spacing-block, var(--slds-s-button-spacing)))\n )\n );border-width: var(--sds-c-button-sizing-border, var(--slds-s-button-sizing-border, 1px));border-style: solid;border-color: var(--sds-c-button-color-border, var(--slds-s-button-color-border, currentColor));border-start-start-radius: var(\n --sds-c-button-radius-border-startstart,\n var(\n --sds-c-button-radius-border,\n var(--slds-s-button-radius-border-startstart, var(--slds-s-button-radius-border))\n )\n );border-start-end-radius: var(\n --sds-c-button-radius-border-startend,\n var(\n --sds-c-button-radius-border,\n var(--slds-s-button-radius-border-startend, var(--slds-s-button-radius-border))\n )\n );border-end-start-radius: var(\n --sds-c-button-radius-border-endstart,\n var(\n --sds-c-button-radius-border,\n var(--slds-s-button-radius-border-endstart, var(--slds-s-button-radius-border))\n )\n );border-end-end-radius: var(\n --sds-c-button-radius-border-endend,\n var(\n --sds-c-button-radius-border,\n var(--slds-s-button-radius-border-endend, var(--slds-s-button-radius-border))\n )\n );box-shadow: var(--sds-c-button-shadow, var(--slds-s-button-shadow));text-decoration: var(--sds-c-button-font-decoration);white-space: normal;user-select: none;align-items: center;justify-content: center;appearance: none;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button']:hover" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button']:hover")) + shadowSelector + " {--sds-c-button-text-color: var(--sds-c-button-text-color-hover, var(--slds-s-button-color-hover, revert));--sds-c-button-color-background: var(\n --sds-c-button-color-background-hover,\n var(--slds-s-button-color-background-hover, revert)\n );--sds-c-button-color-border: var(\n --sds-c-button-color-border-hover,\n var(--slds-s-button-color-border-hover, revert)\n );--sds-c-button-shadow: var(--sds-c-button-shadow-hover, var(--slds-s-button-shadow-hover, revert));cursor: pointer;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button']:focus" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button']:focus")) + shadowSelector + " {--sds-c-button-color-background: var(\n --sds-c-button-color-background-focus,\n var(--slds-s-button-color-background-focus, revert)\n );--sds-c-button-color-border: var(\n --sds-c-button-color-border-focus,\n var(--slds-s-button-color-border-focus, revert)\n );--sds-c-button-text-color: var(--sds-c-button-text-color-focus, var(--slds-s-button-color-focus, revert));--sds-c-button-shadow: var(--sds-c-button-shadow-focus, var(--slds-s-button-shadow-focus, revert));outline: 0;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button']:active" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button']:active")) + shadowSelector + " {--sds-c-button-text-color: var(--sds-c-button-text-color-active, var(--slds-s-button-color-active, revert));--sds-c-button-color-background: var(\n --sds-c-button-color-background-active,\n var(--slds-s-button-color-background-active, revert)\n );--sds-c-button-color-border: var(\n --sds-c-button-color-border-active,\n var(--slds-s-button-color-border-active, revert)\n );--sds-c-button-shadow: var(--sds-c-button-shadow-active, var(--slds-s-button-shadow-active, revert));}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button']:disabled" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button']:disabled")) + shadowSelector + " {--sds-c-button-text-color: var(--sds-c-button-text-color-disabled);--sds-c-button-color-background: var(--sds-c-button-color-background-disabled);--sds-c-button-color-border: var(--sds-c-button-color-border-disabled);--sds-c-button-shadow: var(--sds-c-button-shadow-disabled);pointer-events: none;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button']:disabled" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button']:disabled")) + shadowSelector + " *" + shadowSelector + " {pointer-events: none;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='button'][aria-pressed='true']" : hostSelector + "[data-render-mode=\"shadow\"] [part='button'][aria-pressed='true']")) + shadowSelector + " {--sds-c-button-color-background: var(--sds-c-button-color-background-pressed, revert);--sds-c-button-color-border: var(--sds-c-button-color-border-pressed, revert);--sds-c-button-text-color: var(--sds-c-button-text-color-pressed, revert);--sds-c-button-shadow: var(--sds-c-button-shadow-pressed, revert);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button']" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button']")) + shadowSelector + " {gap: var(--slds-g-spacing-2, 0.5rem);--slds-c-icon-sizing-border: 0;--slds-c-icon-sizing: 0.875rem;--slds-c-icon-color-foreground: currentcolor;--sds-c-button-font-lineheight: var(\n --slds-c-button-neutral-font-lineheight,\n var(--slds-s-button-font-lineheight, 1.875rem)\n );--sds-c-button-spacing-inline: var(\n --slds-c-button-neutral-spacing-inline,\n var(--slds-s-button-spacing-inline, var(--slds-g-spacing-4, 1rem)) ;\n );--sds-c-button-spacing-block: var(--slds-c-button-neutral-spacing-block);--sds-c-button-radius-border-startstart: var(\n --slds-c-button-radius-border-startstart,\n var(\n --slds-c-button-radius-border,\n var(--slds-s-button-radius-border-startstart, var(--slds-s-button-radius-border))\n )\n );--sds-c-button-radius-border-endstart: var(\n --slds-c-button-radius-border-endstart,\n var(\n --slds-c-button-radius-border,\n var(--slds-s-button-radius-border-endstart, var(--slds-s-button-radius-border))\n )\n );--sds-c-button-radius-border-startend: var(\n --slds-c-button-radius-border-startend,\n var(\n --slds-c-button-radius-border,\n var(--slds-s-button-radius-border-startend, var(--slds-s-button-radius-border))\n )\n );--sds-c-button-radius-border-endend: var(\n --slds-c-button-radius-border-endend,\n var(\n --slds-c-button-radius-border,\n var(--slds-s-button-radius-border-endend, var(--slds-s-button-radius-border))\n )\n );--sds-c-button-color-background: var(\n --slds-c-button-neutral-color-background,\n var(--slds-g-color-surface-container-1, #ffffff)\n );--sds-c-button-color-background-hover: var(\n --slds-c-button-neutral-color-background-hover,\n var(--slds-g-color-surface-container-2, #f3f3f3)\n );--sds-c-button-color-background-focus: var(\n --slds-c-button-neutral-color-background-focus,\n var(--slds-g-color-surface-container-2, #f3f3f3)\n );--sds-c-button-color-background-active: var(\n --slds-c-button-neutral-color-background-active,\n var(--slds-g-color-surface-container-2, #f3f3f3)\n );--sds-c-button-color-border: var(--slds-c-button-neutral-color-border, var(--slds-g-color-border-2, var(--slds-g-color-neutral-base-50)));--sds-c-button-color-border-hover: var(\n --slds-c-button-neutral-color-border-hover,\n var(--slds-g-color-border-2, var(--slds-g-color-neutral-base-50))\n );--sds-c-button-color-border-focus: var(\n --slds-c-button-neutral-color-border-focus,\n var(--slds-g-color-border-2, var(--slds-g-color-neutral-base-50))\n );--sds-c-button-color-border-active: var(\n --slds-c-button-neutral-color-border-active,\n var(--slds-g-color-border-2, var(--slds-g-color-neutral-base-50))\n );--sds-c-button-text-color: var(--slds-c-button-neutral-text-color, var(--slds-g-color-accent-2, var(--lwc-brandPrimaryActive, var(--slds-g-color-brand-base-50))));--sds-c-button-text-color-hover: var(\n --slds-c-button-neutral-text-color-hover,\n var(--slds-s-button-color-hover, var(--slds-g-color-accent-3, #0b5cab))\n );--sds-c-button-text-color-focus: var(\n --slds-c-button-neutral-text-color-focus,\n var(--slds-g-color-accent-3, #0b5cab)\n );--sds-c-button-text-color-active: var(\n --slds-c-button-neutral-text-color-active,\n var(--slds-g-color-accent-3, #0b5cab)\n );--sds-c-button-shadow: var(--slds-c-button-neutral-shadow);--sds-c-button-shadow-focus: var(--slds-c-button-neutral-shadow-focus);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button']:disabled" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button']:disabled")) + shadowSelector + " {--sds-c-button-color-border-disabled: var(--slds-g-color-border-disabled-1, #c9c9c9);--sds-c-button-text-color-disabled: var(--slds-g-color-on-disabled-1, #c9c9c9);--sds-c-button-color-background-disabled: var(--slds-g-color-disabled-container-1, #ffffff);pointer-events: auto;cursor: default;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='brand']) [part~='button']" : hostSelector + "[variant='brand'][data-render-mode=\"shadow\"] [part~='button']")) + shadowSelector + " {--slds-c-button-neutral-color-background: var(\n --slds-c-button-brand-color-background,\n var(--slds-g-color-accent-container-1, var(--lwc-brandAccessible, var(--slds-g-color-brand-base-50)))\n );--slds-c-button-neutral-color-background-hover: var(\n --slds-c-button-brand-color-background-hover,\n var(--slds-g-color-accent-container-2, var(--lwc-brandAccessibleActive, var(--slds-g-color-brand-base-40)))\n );--slds-c-button-neutral-color-background-focus: var(\n --slds-c-button-brand-color-background-focus,\n var(--slds-g-color-accent-container-2, var(--lwc-brandAccessibleActive, var(--slds-g-color-brand-base-40)))\n );--slds-c-button-neutral-color-background-active: var(\n --slds-c-button-brand-color-background-active,\n var(--slds-g-color-accent-container-2, var(--lwc-brandAccessibleActive, var(--slds-g-color-brand-base-40)))\n );--slds-c-button-neutral-color-border: var(\n --slds-c-button-brand-color-border,\n var(--slds-g-color-border-accent-1, #0176d3)\n );--slds-c-button-neutral-color-border-hover: var(\n --slds-c-button-brand-color-border-hover,\n var(--slds-g-color-border-accent-2, #0b5cab)\n );--slds-c-button-neutral-color-border-focus: var(\n --slds-c-button-brand-color-border-focus,\n var(--slds-g-color-border-accent-2, #0b5cab)\n );--slds-c-button-neutral-color-border-active: var(\n --slds-c-button-brand-color-border-active,\n var(--slds-g-color-border-accent-2, #0b5cab)\n );--sds-c-button-text-color: var(--slds-c-button-brand-text-color, var(--slds-g-color-on-accent-1, var(--slds-g-color-brand-base-100)));}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='brand-outline']) [part~='button']" : hostSelector + "[variant='brand-outline'][data-render-mode=\"shadow\"] [part~='button']")) + shadowSelector + " {--slds-c-button-neutral-color-border: var(--slds-g-color-border-accent-2, #0b5cab);--slds-c-button-neutral-color-border-hover: var(--slds-g-color-border-accent-2, #0b5cab);--slds-c-button-neutral-color-border-focus: var(--slds-g-color-border-accent-2, #0b5cab);--slds-c-button-neutral-color-border-active: var(--slds-g-color-border-accent-2, #0b5cab);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='inverse']) [part~='button']" : hostSelector + "[variant='inverse'][data-render-mode=\"shadow\"] [part~='button']")) + shadowSelector + " {--slds-c-button-neutral-color-background: transparent;--slds-c-button-neutral-color-background-hover: var(--slds-g-color-surface-container-2, #f3f3f3);--slds-c-button-neutral-color-background-focus: var(--slds-g-color-surface-container-2, #f3f3f3);--slds-c-button-neutral-color-background-active: var(--slds-g-color-surface-container-2, #f3f3f3);--slds-c-button-neutral-color-border: var(--slds-g-color-neutral-base-100, #ffffff);--slds-c-button-neutral-color-border-hover: var(--slds-g-color-neutral-base-100, #ffffff);--slds-c-button-neutral-color-border-focus: var(--slds-g-color-neutral-base-100, #ffffff);--slds-c-button-neutral-color-border-active: var(--slds-g-color-neutral-base-100, #ffffff);--slds-c-button-neutral-text-color: var(--slds-g-color-on-accent-1, var(--slds-g-color-brand-base-100));--slds-c-button-neutral-text-color-hover: var(--slds-g-color-accent-2, var(--lwc-brandPrimaryActive, var(--slds-g-color-brand-base-50)));--slds-c-button-neutral-text-color-active: var(--slds-g-color-accent-2, var(--lwc-brandPrimaryActive, var(--slds-g-color-brand-base-50)));}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='inverse']) [part~='button']:disabled" : hostSelector + "[variant='inverse'][data-render-mode=\"shadow\"] [part~='button']:disabled")) + shadowSelector + " {--sds-c-button-color-background: transparent;--sds-c-button-color-border: var(--slds-g-color-border-disabled-2, #aeaeae);--sds-c-button-text-color: var(--slds-g-color-disabled-2, #aeaeae);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='destructive']) [part~='button']" : hostSelector + "[variant='destructive'][data-render-mode=\"shadow\"] [part~='button']")) + shadowSelector + " {--slds-c-button-neutral-color-background: var(--slds-g-color-error-container-1, #ba0517);--slds-c-button-neutral-color-background-hover: var(--slds-g-color-error-container-2, #8e030f);--slds-c-button-neutral-color-background-focus: var(--slds-g-color-error-container-2, #8e030f);--slds-c-button-neutral-color-background-active: var(--slds-g-color-error-container-2, #8e030f);--slds-c-button-neutral-color-border: var(--slds-g-color-border-error-1, #ba0517);--slds-c-button-neutral-color-border-hover: var(--slds-g-color-border-error-2, #8e030f);--slds-c-button-neutral-color-border-focus: var(--slds-g-color-border-error-2, #8e030f);--slds-c-button-neutral-color-border-active: var(--slds-g-color-border-error-2, #8e030f);--sds-c-button-text-color: var(--slds-g-color-on-error-1, #ffffff);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='success']) [part~='button']" : hostSelector + "[variant='success'][data-render-mode=\"shadow\"] [part~='button']")) + shadowSelector + " {--slds-c-button-neutral-color-background: var(--slds-g-color-success-container-1, #2e844a);--slds-c-button-neutral-color-background-hover: var(--slds-g-color-success-container-2, #194e31);--slds-c-button-neutral-color-background-focus: var(--slds-g-color-success-container-2, #194e31);--slds-c-button-neutral-color-background-active: var(--slds-g-color-success-container-2, #194e31);--slds-c-button-neutral-color-border: var(--slds-g-color-border-success-1, #2e844a);--slds-c-button-neutral-color-border-hover: var(--slds-g-color-border-success-2);--slds-c-button-neutral-color-border-focus: var(--slds-g-color-border-success-2);--slds-c-button-neutral-color-border-active: var(--slds-g-color-border-success-2);--slds-c-button-neutral-text-color: var(--slds-g-color-on-success-1, #ffffff);--slds-c-button-neutral-text-color-hover: var(--slds-g-color-on-success-1, #ffffff);--slds-c-button-neutral-text-color-focus: var(--slds-g-color-on-success-1, #ffffff);--slds-c-button-neutral-text-color-active: var(--slds-g-color-on-success-1, #ffffff);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='destructive-text']) [part~='button']" : hostSelector + "[variant='destructive-text'][data-render-mode=\"shadow\"] [part~='button']")) + shadowSelector + " {--slds-c-button-neutral-text-color: var(--slds-g-color-error-1, #ba0517);--slds-c-button-neutral-text-color-hover: var(--slds-g-color-error-1, #ba0517);--slds-c-button-neutral-text-color-focus: var(--slds-g-color-error-1, #ba0517);--slds-c-button-neutral-text-color-active: var(--slds-g-color-error-1, #ba0517);--slds-c-button-neutral-color-border-hover: var(\n --slds-c-button-neutral-color-border,\n var(--slds-g-color-border-1, var(--slds-g-color-neutral-base-80))\n );--slds-c-button-neutral-color-border-focus: var(\n --slds-c-button-neutral-color-border,\n var(--slds-g-color-border-1, var(--slds-g-color-neutral-base-80))\n );--slds-c-button-neutral-color-border-active: var(\n --slds-c-button-neutral-color-border,\n var(--slds-g-color-border-1, var(--slds-g-color-neutral-base-80))\n );}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='brand']) [part~='button']:disabled" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='success']) [part~='button']:disabled" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='destructive']) [part~='button']:disabled" : hostSelector + "[variant='brand'][data-render-mode=\"shadow\"] [part~='button']:disabled" + shadowSelector + "," + hostSelector + "[variant='success'][data-render-mode=\"shadow\"] [part~='button']:disabled" + shadowSelector + "," + hostSelector + "[variant='destructive'][data-render-mode=\"shadow\"] [part~='button']:disabled")) + shadowSelector + " {--sds-c-button-color-background: var(--slds-g-color-disabled-container-2, #c9c9c9);--sds-c-button-color-border: var(--slds-g-color-border-disabled-1, #c9c9c9);--sds-c-button-text-color: var(--slds-g-color-on-disabled-2, #939393);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='base']) [part~='button']" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='text']) [part~='button']" : hostSelector + "[variant='base'][data-render-mode=\"shadow\"] [part~='button']" + shadowSelector + "," + hostSelector + "[variant='text'][data-render-mode=\"shadow\"] [part~='button']")) + shadowSelector + " {--sds-c-button-spacing-inline: 0;--slds-c-button-neutral-text-color: var(--slds-g-color-accent-2, var(--lwc-brandPrimaryActive, var(--slds-g-color-brand-base-50)));--slds-c-button-neutral-color-border: transparent;--slds-c-button-neutral-color-border-hover: transparent;--slds-c-button-neutral-color-border-focus: transparent;--slds-c-button-neutral-color-border-active: var(--slds-g-color-border-accent-2, #0b5cab);--slds-c-button-neutral-color-background: transparent;--slds-c-button-neutral-color-background-hover: transparent;--slds-c-button-neutral-color-background-focus: transparent;--slds-c-button-neutral-color-background-active: transparent;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='base']) [part~='button']:disabled" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='text']) [part~='button']:disabled" : hostSelector + "[variant='base'][data-render-mode=\"shadow\"] [part~='button']:disabled" + shadowSelector + "," + hostSelector + "[variant='text'][data-render-mode=\"shadow\"] [part~='button']:disabled")) + shadowSelector + " {--sds-c-button-color-background: transparent;--sds-c-button-color-border: transparent;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][stretch]) [part~='button']" : hostSelector + "[stretch][data-render-mode=\"shadow\"] [part~='button']")) + shadowSelector + " {--sds-c-button-sizing-width: 100%;justify-content: center;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='brand']) [part~='button']" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='brand-outline']) [part~='button']" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='inverse']) [part~='button']" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='success']) [part~='button']" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='destructive']) [part~='button']" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='destructive-text']) [part~='button']" : hostSelector + "[variant='brand'][data-render-mode=\"shadow\"] [part~='button']" + shadowSelector + "," + hostSelector + "[variant='brand-outline'][data-render-mode=\"shadow\"] [part~='button']" + shadowSelector + "," + hostSelector + "[variant='inverse'][data-render-mode=\"shadow\"] [part~='button']" + shadowSelector + "," + hostSelector + "[variant='success'][data-render-mode=\"shadow\"] [part~='button']" + shadowSelector + "," + hostSelector + "[variant='destructive'][data-render-mode=\"shadow\"] [part~='button']" + shadowSelector + "," + hostSelector + "[variant='destructive-text'][data-render-mode=\"shadow\"] [part~='button']")) + shadowSelector + " {justify-content: center;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='start']" : hostSelector + "[data-render-mode=\"shadow\"] [part~='start']")) + shadowSelector + " {display: inline-flex;padding-inline-end: 0;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='end']" : hostSelector + "[data-render-mode=\"shadow\"] [part~='end']")) + shadowSelector + " {display: inline-flex;padding-inline-start: 0;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-assistive-text" : hostSelector + "[data-render-mode=\"shadow\"] .slds-assistive-text")) + shadowSelector + " {position: absolute !important;margin: -1px !important;border: 0 !important;padding: 0 !important;width: 1px !important;height: 1px !important;overflow: hidden !important;clip: rect(0 0 0 0) !important;text-transform: none !important;white-space: nowrap !important;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-button_reset" : hostSelector + "[data-render-mode=\"shadow\"] .slds-button_reset")) + shadowSelector + " {font-size: inherit;color: inherit;line-height: inherit;padding: 0;background: transparent;border: 0;text-align: inherit;}";
  /*LWC compiler v9.5.3*/
}
var stylesheet1$7 = [stylesheet$i];

function stylesheet$h(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='modal-backdrop']" : hostSelector + "[data-render-mode=\"shadow\"] [part='modal-backdrop']")) + shadowSelector + " {--slds-c-backdrop-color-background: var(--slds-c-modalbase-backdrop-color-background);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='modal']" : hostSelector + "[data-render-mode=\"shadow\"] [part='modal']")) + shadowSelector + " {--slds-c-modalbody-shadow: var(--slds-c-modal-shadow);--slds-c-modalfooter-shadow: var(--slds-c-modal-shadow);--slds-c-modalheader-color-border: var(--slds-c-modal-color-border);--slds-c-modalfooter-color-border: var(--slds-c-modal-color-border);--slds-c-modalheader-radius-border: var(--slds-c-modal-radius-border);--slds-c-modalbody-radius-border: var(--slds-c-modal-radius-border);--slds-c-modalfooter-radius-border: var(--slds-c-modal-radius-border);--slds-c-modalheader-sizing-border: var(--slds-c-modal-sizing-border);--slds-c-modalfooter-sizing-border: var(--slds-c-modal-sizing-border);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-backdrop" : hostSelector + "[data-render-mode=\"shadow\"] .slds-backdrop")) + shadowSelector + " {transition-duration: 0.4s;width: 100%;height: 100%;opacity: 0;visibility: hidden;position: fixed;inset-block-start: 0;inset-inline-end: 0;inset-block-end: 0;inset-inline-start: 0;background: var(\n --slds-c-modalbase-backdrop-color-background,\n var(--slds-g-color-neutral-10-opacity-50, rgba(8, 7, 7, 60%))\n );z-index: 9000;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-backdrop_open" : hostSelector + "[data-render-mode=\"shadow\"] .slds-backdrop_open")) + shadowSelector + " {visibility: visible;opacity: 1;transition: opacity 0.4s linear;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal")) + shadowSelector + " {opacity: 0;visibility: hidden;transition:\n transform 0.1s linear,\n opacity 0.1s;position: fixed;inset-block-start: 0;inset-inline-end: 0;inset-block-end: 0;inset-inline-start: 0;z-index: 9001;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal__container" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal__container")) + shadowSelector + " {position: relative;transform: translate(0, 0);transition:\n transform 0.1s linear,\n opacity 0.1s linear;display: flex;flex-direction: column;justify-content: center;margin: 0 var(--slds-g-spacing-6, 2rem);height: 100%;padding: var(--slds-g-spacing-8, 3rem) 0 var(--slds-g-spacing-12, 5rem) 0;border-radius: var(--slds-g-spacing-1, 0.25rem);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal__close" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal__close")) + shadowSelector + " {width: 2rem;height: 2rem;margin-inline-start: auto;position: relative;background-color: var(--slds-g-color-neutral-base-100, #ffffff);border-radius: 0.25rem;bottom: 0.5rem;flex-shrink: 0;justify-content: center;display: inline-flex;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-fade-in-open" : hostSelector + "[data-render-mode=\"shadow\"] .slds-fade-in-open")) + shadowSelector + " {opacity: 1;visibility: visible;transition: opacity 0.1s linear;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-fade-in-open" : hostSelector + "[data-render-mode=\"shadow\"] .slds-fade-in-open")) + shadowSelector + " .slds-modal__container-reset" + shadowSelector + " {opacity: 1;visibility: visible;transform: translate(0, 0);}@media (width >= 48em) {" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal__container" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal__container")) + shadowSelector + " {margin: 0 auto;width: 50%;max-width: 40rem;min-width: 20rem;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal_small" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_small")) + shadowSelector + " .slds-modal__container" + shadowSelector + " {width: 60%;max-width: 52.0625rem;min-width: 40rem;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal_medium" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_medium")) + shadowSelector + " .slds-modal__container" + shadowSelector + " {width: 70%;max-width: 75rem;min-width: 40rem;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal_large" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_large")) + shadowSelector + " .slds-modal__container" + shadowSelector + " {width: 90%;max-width: none;min-width: 40rem;}}@media (width >= 48em) {" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal_full" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_full")) + shadowSelector + " .slds-modal__container" + shadowSelector + " {width: 90%;max-width: none;min-width: 40rem;}}@media (width <= 30em) {" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal_full" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_full")) + shadowSelector + " {inset-block-start: env(safe-area-inset-top, 0);inset-block-end: auto;height: calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom));}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal_full" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_full")) + shadowSelector + " .slds-modal__container" + shadowSelector + " {width: 100%;max-width: none;min-width: 0;margin: 0;padding: var(--slds-g-spacing-4, 1rem) 0 0 0;background-color: var(--slds-c-modalbase-color-background, var(--slds-g-color-surface-1, #ffffff));border-radius: 0;display: grid;height: 100dvh;grid-template-columns: 1fr;grid-template-rows: min-content min-content 1fr min-content;grid-template-areas: 'close' 'header' 'content' 'footer';}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal_full" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_full")) + shadowSelector + " .slds-modal__close" + shadowSelector + " {grid-area: close;inset-inline-end: var(--slds-g-spacing-4, 1rem);--slds-c-button-color-background: var(--slds-g-color-surface-container-1, #ffffff, white);--slds-c-button-color-background-active: var(--slds-g-color-surface-container-1, #ffffff, white);color: var(--slds-g-color-on-surface-1, #747474);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal_full" + shadowSelector + " .slds-modal__close:hover" + shadowSelector + ",:host([data-render-mode=\"shadow\"]) .slds-modal_full" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_full" + shadowSelector + " .slds-modal__close:hover" + shadowSelector + "," + hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_full")) + shadowSelector + " .slds-modal__close:focus" + shadowSelector + " {color: var(--slds-g-color-accent-3, #0b5cab);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal_full" + shadowSelector + " lightning-button-icon" + shadowSelector + " + div" + shadowSelector + ",:host([data-render-mode=\"shadow\"]) .slds-modal_full" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_full" + shadowSelector + " lightning-button-icon" + shadowSelector + " + div" + shadowSelector + "," + hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_full")) + shadowSelector + " lightning-modal" + shadowSelector + " {display: contents;}}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-assistive-text" : hostSelector + "[data-render-mode=\"shadow\"] .slds-assistive-text")) + shadowSelector + " {position: absolute !important;margin: -1px !important;border: 0 !important;padding: 0 !important;width: 1px !important;height: 1px !important;overflow: hidden !important;clip: rect(0 0 0 0) !important;text-transform: none !important;white-space: nowrap !important;}";
  /*LWC compiler v9.5.3*/
}
var stylesheet2$1 = [stylesheet$h];

function stylesheet$g(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal__header" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal__header")) + shadowSelector + " {--slds-c-modal-header-color-background: var(--slds-c-modalheader-color-background);--slds-c-modal-header-text-color: var(--slds-c-modalheader-text-color);--slds-c-modal-header-spacing-block-start: var(--slds-c-modalheader-spacing-block-start);--slds-c-modal-header-spacing-inline-end: var(--slds-c-modalheader-spacing-inline-end);--slds-c-modal-header-spacing-block-end: var(--slds-c-modalheader-spacing-block-end);--slds-c-modal-header-spacing-inline-start: var(--slds-c-modalheader-spacing-inline-start);--slds-c-modal-heading-font-size: var(--slds-c-modalheader-heading-font-size);--slds-c-modal-heading-font-weight: var(--slds-c-modalheader-heading-font-weight);--slds-c-modal-heading-font-lineheight: var(--slds-c-modalheader-heading-font-lineheight);position: relative;border-start-end-radius: var(--slds-c-modalheader-radius-border, var(--slds-g-radius-border-2, 0.25rem));border-start-start-radius: var(--slds-c-modalheader-radius-border, var(--slds-g-radius-border-2, 0.25rem));border-block-end-width: var(--slds-c-modalheader-sizing-border, var(--slds-g-sizing-border-2, 2px));border-block-end-style: solid;border-block-end-color: var(--slds-c-modalheader-color-border, var(--slds-g-color-border-1, var(--slds-g-color-neutral-base-80)));background-color: var(--slds-c-modalheader-color-background, var(--slds-g-color-surface-container-1, #ffffff));color: var(--slds-c-modalheader-text-color);flex-shrink: 0;padding-block-start: var(--slds-c-modalheader-spacing-block-start, var(--slds-g-spacing-4, 1rem));padding-inline-end: var(--slds-c-modalheader-spacing-inline-end, var(--slds-g-spacing-4, 1rem));padding-block-end: var(--slds-c-modalheader-spacing-block-end, var(--slds-g-spacing-4, 1rem));padding-inline-start: var(--slds-c-modalheader-spacing-inline-start, var(--slds-g-spacing-4, 1rem));text-align: center;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal__title" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal__title")) + shadowSelector + " {font-weight: var(--slds-c-modalheader-heading-font-weight);font-size: var(--slds-c-modalheader-heading-font-size, 1.25rem);line-height: var(--slds-c-modalheader-heading-font-lineheight, var(--slds-g-font-lineheight-2, 1.25));}@media (width <= 30em) {" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][data-size='full']) [part='modal-header']" : hostSelector + "[data-size='full'][data-render-mode=\"shadow\"] [part='modal-header']")) + shadowSelector + " {grid-area: header;border-start-start-radius: 0;border-start-end-radius: 0;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][data-size='full']) {" : hostSelector + "[data-size='full'][data-render-mode=\"shadow\"] {")) + "display: contents;}}";
  /*LWC compiler v9.5.3*/
}
var stylesheet3$1 = [stylesheet$g];

function stylesheet$f(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal__content_headless" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal__content_headless")) + shadowSelector + " {border-start-end-radius: var(--slds-c-modalbody-radius-border, var(--slds-g-radius-border-2, 0.25rem));border-start-start-radius: var(--slds-c-modalbody-radius-border, var(--slds-g-radius-border-2, 0.25rem));}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal__content" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal__content")) + shadowSelector + " {--slds-c-modal-content-color-background: var(--slds-c-modalbody-color-background);--slds-c-modal-content-text-color: var(--slds-c-modalbody-text-color);background-color: var(--slds-c-modalbody-color-background, var(--slds-g-color-surface-container-1, #ffffff));color: var(--slds-c-modalbody-text-color);overflow: hidden;overflow-y: auto;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal__content_footless" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal__content_footless")) + shadowSelector + " {border-bottom-right-radius: var(--slds-c-modalbody-radius-border, var(--slds-g-radius-border-2, 0.25rem));border-bottom-left-radius: var(--slds-c-modalbody-radius-border, var(--slds-g-radius-border-2, 0.25rem));box-shadow: var(--slds-c-modalbody-shadow, var(--slds-g-shadow-2, 0px 2px 3px 0px #00000027));}@media (width <= 30em) {" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][data-size='full']) [part='modal-body']" : hostSelector + "[data-size='full'][data-render-mode=\"shadow\"] [part='modal-body']")) + shadowSelector + " {grid-area: content;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][data-size='full'][data-variant-footless]) [part='modal-body']" : hostSelector + "[data-variant-footless][data-size='full'][data-render-mode=\"shadow\"] [part='modal-body']")) + shadowSelector + " {border-end-end-radius: 0;border-end-start-radius: 0;box-shadow: none;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][data-size='full']) {" : hostSelector + "[data-size='full'][data-render-mode=\"shadow\"] {")) + "display: contents;}}";
  /*LWC compiler v9.5.3*/
}
var stylesheet4 = [stylesheet$f];

function stylesheet$e(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal__footer" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal__footer")) + shadowSelector + " {--slds-c-modal-footer-color-background: var(--slds-c-modalfooter-color-background);--slds-c-modal-footer-text-color: var(--slds-c-modalfooter-text-color);--slds-c-modal-footer-spacing-block-start: var(--slds-c-modalfooter-spacing-block-start);--slds-c-modal-footer-spacing-inline-end: var(--slds-c-modalfooter-spacing-inline-end);--slds-c-modal-footer-spacing-block-end: var(--slds-c-modalfooter-spacing-block-end);--slds-c-modal-footer-spacing-inline-start: var(--slds-c-modalfooter-spacing-inline-start);border-end-end-radius: var(--slds-c-modalfooter-radius-border, var(--slds-g-radius-border-2, 0.25rem));border-end-start-radius: var(--slds-c-modalfooter-radius-border, var(--slds-g-radius-border-2, 0.25rem));border-block-start-width: var(--slds-c-modalfooter-sizing-border, var(--slds-g-sizing-border-2, 2px));border-block-start-style: solid;border-block-start-color: var(--slds-c-modalfooter-color-border, var(--slds-g-color-border-1, var(--slds-g-color-neutral-base-80)));background-color: var(--slds-c-modalfooter-color-background, var(--slds-g-color-surface-container-2, #f3f3f3));color: var(--slds-c-modalfooter-text-color);-ms-flex-negative: 0;flex-shrink: 0;padding-block-start: var(--slds-c-modalfooter-spacing-block-start, var(--slds-g-spacing-3, 0.75rem));padding-inline-end: var(--slds-c-modalfooter-spacing-inline-end, var(--slds-g-spacing-4, 1rem));padding-block-end: var(--slds-c-modalfooter-spacing-block-end, var(--slds-g-spacing-3, 0.75rem));padding-inline-start: var(--slds-c-modalfooter-spacing-inline-start, var(--slds-g-spacing-4, 1rem));text-align: right;box-shadow: var(--slds-c-modalfooter-shadow, 0 2px 3px 0 rgba(0, 0, 0, 16%));}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-hide" : hostSelector + "[data-render-mode=\"shadow\"] .slds-hide")) + shadowSelector + " {display: none !important;}@media (width <= 30em) {" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][data-size='full']) [part='modal-footer']" : hostSelector + "[data-size='full'][data-render-mode=\"shadow\"] [part='modal-footer']")) + shadowSelector + " {grid-area: footer;border-start-end-radius: 0;border-end-start-radius: 0;box-shadow: none;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][data-size='full']) {" : hostSelector + "[data-size='full'][data-render-mode=\"shadow\"] {")) + "display: contents;}}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal__footer" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal__footer")) + shadowSelector + " .slds-button" + shadowSelector + " + .slds-button" + shadowSelector + " {margin-inline-start: var(--slds-g-spacing-2, 0.5rem);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"].slds-modal__footer_directional) " : hostSelector + ".slds-modal__footer_directional[data-render-mode=\"shadow\"] ")) + shadowSelector + "::slotted(.slds-button:first-child) {float: inline-start;margin-inline-start: 0;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"].slds-modal__footer_directional) " : hostSelector + ".slds-modal__footer_directional[data-render-mode=\"shadow\"] ")) + shadowSelector + "::slotted(.slds-button) {margin-inline-start: var(--slds-g-spacing-2, 0.5rem);}";
  /*LWC compiler v9.5.3*/
}
var stylesheet5 = [stylesheet$e];

function stylesheet$d(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  return ".slds-modal_prompt" + shadowSelector + " {--slds-c-modalheader-sizing-border: 0;--slds-c-modalfooter-sizing-border: 0;}.slds-modal_prompt" + shadowSelector + " .slds-modal__close" + shadowSelector + " {display: none;}.slds-modal_prompt" + shadowSelector + " .slds-modal__content" + shadowSelector + " {padding-block: var(--slds-g-spacing-4, 1rem);padding-inline: var(--slds-g-spacing-6, 2rem);}.slds-modal_prompt" + shadowSelector + " .slds-modal__footer" + shadowSelector + " {text-align: center;}[part='button'].slds-button_brand" + shadowSelector + " {--slds-c-button-neutral-color-background: var(--slds-g-color-accent-container-1, var(--lwc-brandAccessible, var(--slds-g-color-brand-base-50)));--slds-c-button-neutral-color-background-hover: var(--slds-g-color-accent-container-2, var(--lwc-brandAccessibleActive, var(--slds-g-color-brand-base-40)));--slds-c-button-neutral-color-background-focus: var(--slds-g-color-accent-container-2, var(--lwc-brandAccessibleActive, var(--slds-g-color-brand-base-40)));--slds-c-button-neutral-color-background-active: var(--slds-g-color-accent-container-2, var(--lwc-brandAccessibleActive, var(--slds-g-color-brand-base-40)));--slds-c-button-neutral-color-border: var(--slds-g-color-border-accent-1, #0176d3);--slds-c-button-neutral-color-border-hover: var(--slds-g-color-border-accent-2, #0b5cab);--slds-c-button-neutral-color-border-focus: var(--slds-g-color-border-accent-2, #0b5cab);--slds-c-button-neutral-color-border-active: var(--slds-g-color-border-accent-2, #0b5cab);--sds-c-button-text-color: var(--slds-g-color-on-accent-1, var(--slds-g-color-brand-base-100)) !important;}";
  /*LWC compiler v9.5.3*/
}
var stylesheet6 = [stylesheet$d];

function stylesheet$c(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-theme_default" + shadowSelector + ",:host([data-interactive-dialog]) .slds-theme_default" : hostSelector + "[data-render-mode='shadow'] .slds-theme_default" + shadowSelector + "," + hostSelector + "[data-interactive-dialog] .slds-theme_default")) + shadowSelector + " {background-color: var(--slds-g-color-neutral-base-100, #fff);color: var(--slds-g-color-neutral-base-10, #181818);}" + ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-theme_shade" + shadowSelector + ",:host([data-interactive-dialog]) .slds-theme_shade" : hostSelector + "[data-render-mode='shadow'] .slds-theme_shade" + shadowSelector + "," + hostSelector + "[data-interactive-dialog] .slds-theme_shade")) + shadowSelector + " {background-color: var(--slds-g-color-neutral-base-95, #f3f3f3);}" + ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-theme_inverse" + shadowSelector + ",:host([data-interactive-dialog]) .slds-theme_inverse" : hostSelector + "[data-render-mode='shadow'] .slds-theme_inverse" + shadowSelector + "," + hostSelector + "[data-interactive-dialog] .slds-theme_inverse")) + shadowSelector + " {color: var(--slds-g-color-neutral-base-100, #fff);background-color: var(--slds-g-color-brand-base-10, #001639);border-color: var(--slds-g-color-brand-base-10, #001639);}" + ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-theme_alt-inverse" + shadowSelector + ",:host([data-interactive-dialog]) .slds-theme_alt-inverse" : hostSelector + "[data-render-mode='shadow'] .slds-theme_alt-inverse" + shadowSelector + "," + hostSelector + "[data-interactive-dialog] .slds-theme_alt-inverse")) + shadowSelector + " {color: var(--slds-g-color-neutral-base-100, #fff);background-color: var(--slds-g-color-brand-base-20, #032d60);border-color: var(--slds-g-color-brand-base-20, #032d60);}" + ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-theme_success" + shadowSelector + ",:host([data-interactive-dialog]) .slds-theme_success" : hostSelector + "[data-render-mode='shadow'] .slds-theme_success" + shadowSelector + "," + hostSelector + "[data-interactive-dialog] .slds-theme_success")) + shadowSelector + " {color: var(--slds-g-color-neutral-base-100, #fff);background-color: var(--slds-g-color-success-base-50, #2e844a);--slds-g-link-color: var(--slds-g-color-neutral-base-100, #fff);--slds-g-link-color-active: var(\n --slds-g-color-neutral-100-opacity-50,\n rgb(255 255 255 / 50%)\n );--slds-g-link-color-hover: var(--slds-g-color-neutral-base-100, #fff);--_slds-g-font-decoration: underline;--_slds-g-font-decoration-hover: none;}" + ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-theme_info" + shadowSelector + ",:host([data-interactive-dialog]) .slds-theme_info" : hostSelector + "[data-render-mode='shadow'] .slds-theme_info" + shadowSelector + "," + hostSelector + "[data-interactive-dialog] .slds-theme_info")) + shadowSelector + " {color: var(--slds-g-color-neutral-base-100, #fff);background-color: var(--slds-g-color-neutral-base-50, #747474);--slds-g-link-color: var(--slds-g-color-neutral-base-100, #fff);--slds-g-link-color-active: var(\n --slds-g-color-neutral-100-opacity-50,\n rgb(255 255 255 / 50%)\n );--slds-g-link-color-hover: var(--slds-g-color-neutral-base-100, #fff);--_slds-g-font-decoration: underline;--_slds-g-font-decoration-hover: none;}" + ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-theme_warning" + shadowSelector + ",:host([data-interactive-dialog]) .slds-theme_warning" : hostSelector + "[data-render-mode='shadow'] .slds-theme_warning" + shadowSelector + "," + hostSelector + "[data-interactive-dialog] .slds-theme_warning")) + shadowSelector + " {background-color: var(--slds-g-color-warning-base-60, #fe9339);color: var(--slds-g-color-neutral-base-10, #181818);--slds-g-link-color: var(--slds-g-color-neutral-base-10, #181818);--slds-g-link-color-active: var(--slds-g-color-neutral-base-30, #514f4d);--slds-g-link-color-hover: var(--slds-g-color-neutral-base-10, #181818);--_slds-g-font-decoration: underline;--_slds-g-font-decoration-hover: none;--_slds-g-shadow: 0 0 3px var(--slds--g-color-neutral-base-30, #514f4d);--_slds-g-style-border: solid;--_slds-g-sizing-border: var(--slds-g-sizing-border-1);--_slds-g-color-border: var(--slds-g-color-neutral-base-30, #514f4d);--_slds-g-color-outline: transparent;}" + ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-theme_warning" : hostSelector + "[data-render-mode='shadow'] .slds-theme_warning")) + shadowSelector + " " + shadowSelector + "::part(button) {color: var(--slds-g-color-on-warning-1);text-decoration: underline;--slds-c-icon-color-foreground: var(--slds-g-color-on-warning-1);}" + ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-theme_warning" : hostSelector + "[data-render-mode='shadow'] .slds-theme_warning")) + shadowSelector + " ::part(button):hover" + shadowSelector + " {color: color-mix(in oklab, currentColor, transparent 25%);--slds-c-icon-color-foreground: color-mix(\n in oklab,\n var(--slds-g-color-on-warning-1),\n transparent 25%\n );}" + ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-theme_warning" : hostSelector + "[data-render-mode='shadow'] .slds-theme_warning")) + shadowSelector + " ::part(button):focus" + shadowSelector + " {color: var(--slds-g-color-neutral-base-30, #514f4d);box-shadow: 0 0 3px var(--slds-g-color-neutral-base-30, #514f4d);border: 1px solid var(--slds-g-color-neutral-base-30, #514f4d);}" + ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-theme_warning" : hostSelector + "[data-render-mode='shadow'] .slds-theme_warning")) + shadowSelector + " ::part(button):active" + shadowSelector + " {color: var(--slds-g-color-neutral-base-50, #706e6b);}" + ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-theme_warning" : hostSelector + "[data-render-mode='shadow'] .slds-theme_warning")) + shadowSelector + " " + shadowSelector + "::part(boundary) {--slds-c-icon-color-foreground: var(\n --slds-g-color-neutral-base-30,\n #514f4d\n );}" + ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-theme_error" + shadowSelector + ",:host([data-interactive-dialog]) .slds-theme_error" : hostSelector + "[data-render-mode='shadow'] .slds-theme_error" + shadowSelector + "," + hostSelector + "[data-interactive-dialog] .slds-theme_error")) + shadowSelector + " {color: var(--slds-g-color-neutral-base-100, #fff);background-color: var(--slds-g-color-error-base-40, #ea001e);--slds-g-link-color: var(--slds-g-color-neutral-base-100, #fff);--slds-g-link-color-active: var(\n --slds-g-color-neutral-100-opacity-50,\n rgb(255 255 255 / 50%)\n );--slds-g-link-color-hover: var(--slds-g-color-neutral-base-100, #fff);--_slds-g-font-decoration: underline;--_slds-g-font-decoration-hover: none;}" + ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-theme_offline" + shadowSelector + ",:host([data-interactive-dialog]) .slds-theme_offline" : hostSelector + "[data-render-mode='shadow'] .slds-theme_offline" + shadowSelector + "," + hostSelector + "[data-interactive-dialog] .slds-theme_offline")) + shadowSelector + " {color: var(--slds-g-color-neutral-base-100, #fff);background-color: var(--slds-g-color-neutral-base-30, #444);}" + ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-theme_alert-texture" + shadowSelector + ",:host([data-interactive-dialog]) .slds-theme_alert-texture" : hostSelector + "[data-render-mode='shadow'] .slds-theme_alert-texture" + shadowSelector + "," + hostSelector + "[data-interactive-dialog] .slds-theme_alert-texture")) + shadowSelector + " {background-image: linear-gradient(\n 45deg,\n rgb(0 0 0 / 2.5%) 25%,\n transparent 25%,\n transparent 50%,\n rgb(0 0 0 / 2.5%) 50%,\n rgb(0 0 0 / 2.5%) 75%,\n transparent 75%,\n transparent\n );background-size: 64px 64px;}" + ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-theme_inverse-text" + shadowSelector + ",:host([data-interactive-dialog]) .slds-theme_inverse-text" : hostSelector + "[data-render-mode='shadow'] .slds-theme_inverse-text" + shadowSelector + "," + hostSelector + "[data-interactive-dialog] .slds-theme_inverse-text")) + shadowSelector + " {color: var(--slds-g-color-neutral-base-100, #fff);}";
  /*LWC compiler v9.5.3*/
}
var stylesheet7 = [stylesheet$c];

var stylesheet1$6 = [stylesheet0$6, stylesheet1$7, stylesheet2$1, stylesheet3$1, stylesheet4, stylesheet5, stylesheet6, stylesheet7];

var _implicitStylesheets$4 = [stylesheet0$4, stylesheet1$6];

function stylesheet$b(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  return "div[data-start]" + shadowSelector + ",div[data-end]" + shadowSelector + " {position: fixed;top: 1rem;left: 1rem;}";
  /*LWC compiler v9.5.3*/
}
var _implicitStylesheets$3 = [stylesheet$b];

const $fragment1$4 = parseFragment`<div${"a0:tabindex"} data-start${3}></div>`;
const $fragment2$2 = parseFragment`<div${"a0:tabindex"} data-end${3}></div>`;
const stc0$8 = [];
function tmpl$9($api, $cmp, $slotset, $ctx) {
  const {ti: api_tab_index, b: api_bind, sp: api_static_part, st: api_static_fragment, s: api_slot} = $api;
  const {_m0, _m1, _m2, _m3, _m4} = $ctx;
  return [api_static_fragment($fragment1$4, 1, [api_static_part(0, {
    on: _m1 || ($ctx._m1 = {
      "focus": api_bind($cmp._focusLastElement)
    }),
    attrs: {
      "tabindex": api_tab_index($cmp._bookendTabIndex)
    }
  }, null)]), api_slot("", {
    key: 2,
    on: _m2 || ($ctx._m2 = {
      "focusin": api_bind($cmp._handleFocusIn),
      "focusout": api_bind($cmp._handleFocusOut)
    })
  }, stc0$8, $slotset), api_static_fragment($fragment2$2, 4, [api_static_part(0, {
    on: _m4 || ($ctx._m4 = {
      "focus": api_bind($cmp._focusFirstElement)
    }),
    attrs: {
      "tabindex": api_tab_index($cmp._bookendTabIndex)
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var _tmpl$a = registerTemplate(tmpl$9);
tmpl$9.slots = [""];
tmpl$9.stylesheets = [];
tmpl$9.stylesheetToken = "lwc-654o76jjrnk";
if (_implicitStylesheets$3) {
  tmpl$9.stylesheets.push.apply(tmpl$9.stylesheets, _implicitStylesheets$3);
}
freezeTemplate(tmpl$9);

const stc0$7 = [];
function tmpl$8($api, $cmp, $slotset, $ctx) {
  return stc0$7;
  /*LWC compiler v9.5.3*/
}
var _tmpl$9 = registerTemplate(tmpl$8);
tmpl$8.stylesheets = [];
tmpl$8.stylesheetToken = "lwc-758d5qnnql0";
freezeTemplate(tmpl$8);

class LightningShadowBaseClass extends LightningElement {
  connectedCallback() {
    if (!this.template['synthetic']) {
      this.setAttribute('data-render-mode', 'shadow');
    }
  }
  /*LWC compiler v9.5.3*/
}
const __lwc_component_class_internal$d = registerComponent(LightningShadowBaseClass, {
  tmpl: _tmpl$9,
  sel: "lightning-shadow-base-class-private",
  apiVersion: 66
});

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
!import.meta.env.SSR ? HTMLTextAreaElement.prototype.setRangeText : null;

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
function assert(condition, message) {
  if (process.env.NODE_ENV !== 'production') {
    if (!condition) {
      throw new Error(message);
    }
  }
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const ARIA_PROP_LIST = ['activeDescendant', 'atomic', 'autoComplete', 'busy', 'checked', 'colCount', 'colIndex', 'colSpan', 'controls', 'current', 'describedAt', 'describedBy', 'description', 'details', 'disabled', 'dropEffect', 'errorMessage', 'expanded', 'flowTo', 'grabbed', 'hasPopup', 'hidden', 'invalid', 'keyShortcuts', 'label', 'labelledBy', 'level', 'live', 'modal', 'multiLine', 'multiSelectable', 'orientation', 'owns', 'placeholder', 'posInSet', 'pressed', 'readOnly', 'relevant', 'required', 'roleDescription', 'rowCount', 'rowIndex', 'rowSpan', 'selected', 'setSize', 'sort', 'valueMax', 'valueMin', 'valueNow', 'valueText'];
const getAriaLookup = (list, type = 'default') => {
  const length = list ? list.length : 0;
  if (length === 0) {
    throw new Error('List of aria properties is required');
  }
  const lookupObj = {};
  if (type === 'default') {
    for (let i = 0; i < length; i += 1) {
      const name = list[i];
      const nameUpperCase = name.toUpperCase();
      if (!lookupObj[nameUpperCase]) {
        lookupObj[nameUpperCase] = `aria-${name.toLowerCase()}`;
      }
    }
    return lookupObj;
  }
  for (let i = 0; i < length; i += 1) {
    const name = list[i];
    const ariaPropertyLowerCase = `aria-${name.toLowerCase()}`;
    if (!lookupObj[ariaPropertyLowerCase]) {
      const ariaPropertyCamelCase = `aria${name[0].toUpperCase()}${name.slice(1)}`;
      lookupObj[ariaPropertyLowerCase] = ariaPropertyCamelCase;
    }
  }
  return lookupObj;
};
const ARIA = getAriaLookup(ARIA_PROP_LIST);
getAriaLookup(ARIA_PROP_LIST, 'cc');
let ariaDescriptionSupported = null;
function isAriaDescriptionSupported() {
  if (ariaDescriptionSupported !== null) {
    return ariaDescriptionSupported;
  }
  const testVal = 'test ability to set';
  try {
    const span = document.createElement('span');
    span.ariaDescription = testVal;
    const ariaDescVal = span.getAttribute(ARIA.DESCRIPTION);
    ariaDescriptionSupported = testVal === ariaDescVal;
  } catch (e) {
    ariaDescriptionSupported = false;
  }
  return ariaDescriptionSupported;
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const FALLBACK_URL = 'javascript:void(0)';
const IS_SCRIPT_OR_DATA = /^(?:\w+script|data):/i;
const IS_HTML_ENTITY = /&#(\w+)(^\w|;)?/g;
const htmlCtrlEntityRegex = /&(newline|tab);/gi;
const ctrlCharactersRegex = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;
function decodeHtmlCharacters(str) {
  return str.replace(IS_HTML_ENTITY, (match, dec) => {
    return String.fromCharCode(dec);
  });
}
function sanitizeURL(url) {
  if (url) {
    const sanitizedUrl = decodeHtmlCharacters(url).replace(htmlCtrlEntityRegex, '').replace(ctrlCharactersRegex, '').trim();
    return sanitizedUrl.match(IS_SCRIPT_OR_DATA) ? FALLBACK_URL : url;
  }
  return FALLBACK_URL;
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
function makeEverythingExceptElementInert(blockingElement) {
  const savedInertElements = [];
  let nonInertElement = blockingElement;
  let parent = nonInertElement.parentNode instanceof ShadowRoot ? nonInertElement.parentNode.host : nonInertElement.parentNode;
  while (parent != null) {
    if (parent.nodeType === Node.ELEMENT_NODE) {
      let child = parent.firstChild;
      if (child === null && parent.shadowRoot) {
        child = parent.shadowRoot.firstChild;
      }
      while (child !== null) {
        if (child.nodeType === Node.ELEMENT_NODE && child !== nonInertElement && child.localName !== 'head') {
          savedInertElements.push({
            node: child,
            ariaHidden: child.ariaHidden
          });
          child.ariaHidden = 'true';
        }
        child = child.nextSibling;
      }
      nonInertElement = parent;
      parent = parent.parentNode;
    } else if (parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      parent = parent.host;
    } else {
      parent = parent.parentNode;
    }
  }
  return savedInertElements;
}
function restoreInertness(savedInertElements) {
  for (let i = 0, {
      length
    } = savedInertElements; i < length; i += 1) {
    const element = savedInertElements[i];
    const {
      node
    } = element;
    if (node) {
      node.ariaHidden = element.ariaHidden;
    }
  }
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
function hasAnimation() {
  if (!import.meta.env.SSR) {
    if (!window.matchMedia) {
      return true;
    }
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return !(!mediaQuery || mediaQuery.matches);
  }
  return false;
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
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

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const isIE11 = !import.meta.env.SSR && isIE11Test(navigator);
!import.meta.env.SSR && isChromeTest(navigator);
const isSafari = !import.meta.env.SSR && isSafariTest(navigator);
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
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
function classNamesHash(hash, classes) {
  if (typeof classes === 'string') {
    const array = classes.trim().split(/\s+/);
    for (let i = 0, {
        length
      } = array; i < length; i += 1) {
      hash[array[i]] = true;
    }
    return hash;
  }
  return Object.assign(hash, classes);
}
const proto = Object.defineProperties(Object.create(null), {
  add: {
    value(className) {
      return classNamesHash(this, className);
    }
  },
  invert: {
    value() {
      const keys = Object.keys(this);
      for (let i = 0, {
          length
        } = keys; i < length; i += 1) {
        const key = keys[i];
        this[key] = !this[key];
      }
      return this;
    }
  },
  toString: {
    value() {
      let string = '';
      const keys = Object.keys(this);
      for (let i = 0, {
          length
        } = keys; i < length; i += 1) {
        const key = keys[i];
        if (this[key]) {
          string += (string.length ? ' ' : '') + key;
        }
      }
      return string;
    }
  }
});
function classSet(config) {
  return classNamesHash(Object.create(proto), config);
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
function formatLabel(str, ...args) {
  let replacements = [];
  if (Array.isArray(args[0])) {
    replacements = args[0];
  } else {
    replacements = args;
  }
  return str.replace(/{(\d+)}/g, (match, i) => {
    const replacement = replacements[i];
    return replacement !== null && replacement !== undefined ? replacement : '';
  });
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const isMacOSTest = ({
  userAgent
}) => {
  return /(macintosh|macintel|macppc|mac68k|macos)/i.test(userAgent);
};
const isiOSTest = ({
  userAgent
}) => {
  return /(iphone|ipad|ipod)/i.test(userAgent);
};
const isWindowsOSTest = ({
  userAgent
}) => {
  return /(win32|win64|windows)/i.test(userAgent);
};
const isAndroidOSTest = ({
  userAgent
}) => {
  return /android/i.test(userAgent);
};
!import.meta.env.SSR && isMacOSTest(navigator);
!import.meta.env.SSR && isWindowsOSTest(navigator);
!import.meta.env.SSR && isiOSTest(navigator);
!import.meta.env.SSR && isAndroidOSTest(navigator);

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const ISO8601_STRICT_PATTERN = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d[:]?\d\d)|Z)?)?)?)?$/i;
const ISO8601_TIME_PATTERN = /^\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d[:]?\d\d)|Z)?$/i;
const STANDARD_TIME_FORMAT = 'HH:mm:ss.SSS';
const STANDARD_DATE_FORMAT = 'YYYY-MM-DD';
const TIME_SEPARATOR = 'T';
const TIMEZONE_INDICATOR = /(Z|([+-])(\d{2})[:]?(\d{2}))$/i;
function isValidISODateTimeString(dateTimeString) {
  return isValidISO8601String(dateTimeString) && isValidDate(dateTimeString);
}
function isValidISOTimeString(timeString) {
  if (!isValidISO8601TimeString(timeString)) {
    return false;
  }
  const timeOnly = removeTimeZoneSuffix(timeString);
  return isValidDate(`2018-09-09T${timeOnly}Z`);
}
function removeTimeZoneSuffix(dateTimeString) {
  if (typeof dateTimeString === 'string') {
    return dateTimeString.split(TIMEZONE_INDICATOR)[0];
  }
  return dateTimeString;
}
function isValidISO8601String(dateTimeString) {
  if (typeof dateTimeString !== 'string') {
    return false;
  }
  return ISO8601_STRICT_PATTERN.test(dateTimeString);
}
function isValidISO8601TimeString(timeString) {
  if (typeof timeString !== 'string') {
    return false;
  }
  return ISO8601_TIME_PATTERN.test(timeString);
}
function isValidDate(value) {
  const timeStamp = Date.parse(value);
  return isFinite(timeStamp);
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
let activeTooltip$1;
function hasActiveTooltip() {
  return !!activeTooltip$1;
}
function getActiveTooltip() {
  return activeTooltip$1;
}
function setActiveTooltip(tooltip) {
  activeTooltip$1 = tooltip;
}

var _tmpl$8 = void 0;

class Observable {
  constructor() {
    this._observers = void 0;
    this._observers = [];
  }
  subscribe(func) {
    const unsubscribe = fn => this._observers = this._observers.filter(observer => observer !== fn);
    this._observers.push(func);
    return () => unsubscribe(func);
  }
  notify(data) {
    this._observers.forEach(observer => observer(data));
  }
}
registerComponent(Observable, {
  tmpl: _tmpl$8,
  sel: "lightning-utils-private",
  apiVersion: 66
});

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const LIGHTNING_TAG_REGEXP = /^LIGHTNING/i;
const LIGHTNING_DASH_NAME_REGEXP = /-\w/g;
function dashWordCharReplacement(dashWordCharMatch) {
  return dashWordCharMatch[1].toUpperCase();
}
function synchronizeHTMLElementAttrs(element, attrs) {
  const attrNames = Object.keys(attrs);
  for (let i = 0, {
      length
    } = attrNames; i < length; i += 1) {
    const attrName = attrNames[i];
    const attrValue = attrs[attrName];
    if (attrValue) {
      element.setAttribute(attrName, attrValue);
    } else {
      element.removeAttribute(attrName);
    }
  }
}
function synchronizeLightningElementAttrs(element, attrs) {
  const attrNames = Object.keys(attrs);
  for (let i = 0, {
      length
    } = attrNames; i < length; i += 1) {
    const attrName = attrNames[i];
    const attrValue = attrs[attrName];
    const normalizedName = attrName.replace(LIGHTNING_DASH_NAME_REGEXP, dashWordCharReplacement);
    element[normalizedName] = attrValue || null;
  }
}
function synchronizeAttrs(element, attrs) {
  if (element) {
    if (LIGHTNING_TAG_REGEXP.test(element.tagName)) {
      synchronizeLightningElementAttrs(element, attrs);
    } else {
      synchronizeHTMLElementAttrs(element, attrs);
    }
  }
}
function getRealDOMId(el) {
  if (typeof el === 'string') {
    return el.length > 0 ? el : null;
  }
  return typeof el === 'object' && el !== null ? el.getAttribute('id') : null;
}
const DEFAULT_MODAL_ZINDEX = 9000;
const DEFAULT_ZINDEX_OFFSET = 100;
const DEFAULT_ZINDEX_BASELINE = DEFAULT_MODAL_ZINDEX + DEFAULT_ZINDEX_OFFSET;
function getZIndexBaseline() {
  const modalZindexValueLwc = !import.meta.env.SSR ? (window.getComputedStyle(document.documentElement) || document.documentElement.style).getPropertyValue('--lwc-zIndexModal') : DEFAULT_MODAL_ZINDEX.toString();
  const baseZindexModalLwc = parseInt(modalZindexValueLwc, 10);
  return isNaN(baseZindexModalLwc) ? DEFAULT_ZINDEX_BASELINE : baseZindexModalLwc + DEFAULT_ZINDEX_OFFSET;
}
const BUTTON_GROUP_ORDER = {
  FIRST: 'first',
  MIDDLE: 'middle',
  LAST: 'last',
  ONLY: 'only'
};
function buttonGroupOrderClass(groupOrder) {
  return {
    [BUTTON_GROUP_ORDER.FIRST]: 'slds-button_first',
    [BUTTON_GROUP_ORDER.MIDDLE]: 'slds-button_middle',
    [BUTTON_GROUP_ORDER.LAST]: 'slds-button_last',
    [BUTTON_GROUP_ORDER.ONLY]: 'single-button'
  }[groupOrder];
}
function isNativeComponent(cmp) {
  return cmp?.template && !cmp.template.synthetic;
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
var dir = "ltr";

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const POSITION_ATTR_NAME = 'data-position-id';
class BrowserWindow {
  get window() {
    if (!this._window) {
      this._window = window;
      if (!this.window.getComputedStyle) {
        this.window.getComputedStyle = node => {
          return node.style;
        };
      }
    }
    return this._window;
  }
  mockWindow(value) {
    this._window = value;
  }
  get documentElement() {
    assert(this.window.document, 'Missing window.document');
    return this.window.document.documentElement;
  }
  get MutationObserver() {
    return this.window.MutationObserver;
  }
  isWindow(element) {
    return element && (element.toString() === '[object Window]' || element instanceof Window);
  }
}
const WindowManager = new BrowserWindow();
function isShadowRoot(node) {
  return node && node.nodeType === 11;
}
function enumerateParent(elem, stopEl, checker) {
  if (!elem || elem === stopEl || elem === document.body) {
    return null;
  }
  try {
    const computedStyle = WindowManager.window.getComputedStyle(elem);
    if (!computedStyle) {
      return null;
    }
    if (checker(computedStyle)) {
      return elem;
    }
    return enumerateParent(isShadowRoot(elem.parentNode) ? elem.parentNode.host : elem.parentNode, stopEl, checker);
  } catch (e) {
    return null;
  }
}
function getScrollableParent(elem, stopEl) {
  return enumerateParent(elem, stopEl, computedStyle => {
    const overflow = computedStyle['overflow-y'];
    return overflow === 'auto' || overflow === 'scroll';
  });
}
function getScrollableParentFromEventPath(eventPath) {
  let computedStyle;
  let overflow;
  for (let i = 0; i < eventPath.length; i++) {
    const element = eventPath[i];
    if (element instanceof HTMLElement) {
      computedStyle = WindowManager.window.getComputedStyle(element);
      overflow = computedStyle['overflow-y'];
      if (overflow === 'auto' || overflow === 'scroll') {
        return element;
      }
    }
  }
  return null;
}
function queryOverflowHiddenParent(elem, stopEl) {
  return enumerateParent(elem, stopEl, computedStyle => {
    return computedStyle['overflow-x'] === 'hidden' || computedStyle['overflow-y'] === 'hidden';
  });
}
function isInDom(el) {
  if (el === WindowManager.window) {
    return true;
  }
  if (!isShadowRoot(el.parentNode) && el.parentNode && el.parentNode.tagName && el.parentNode.tagName.toUpperCase() === 'BODY') {
    return true;
  }
  if (isShadowRoot(el.parentNode) && el.parentNode.host) {
    return isInDom(el.parentNode.host);
  }
  if (el.parentNode) {
    return isInDom(el.parentNode);
  }
  return false;
}
function isDomNode(obj) {
  return obj.nodeType && (obj.nodeType === 1 || obj.nodeType === 11);
}
function timeout(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
function getPositionTarget(element) {
  return element.tagName === 'TEXTAREA' ? isShadowRoot(element.parentNode) ? element.parentNode.host : element.parentNode : element;
}
let lastId = 1000000;
function generateUniqueSelector() {
  return `lgcp-${lastId++}`;
}
function normalizeElement(element) {
  if (!element) {
    return null;
  }
  const selector = generateUniqueSelector();
  element.setAttribute(POSITION_ATTR_NAME, selector);
  element = document.querySelector(`[${POSITION_ATTR_NAME}="${selector}"]`) || element;
  return element;
}
function normalizePosition(element, overlay, nextIndex, target, alignWidth) {
  const isFixed = overlay.isInside || !alignWidth && queryOverflowHiddenParent(target, WindowManager.window);
  element.style.position = isFixed ? 'fixed' : 'absolute';
  element.style.zIndex = nextIndex || 0;
  element.style.left = '-9999px';
  element.style.right = 'auto';
  element.style.top = '0px';
  return {
    element,
    overlay
  };
}
function requestAnimationFrameAsPromise() {
  return new Promise(resolve => {
    requestAnimationFrame(() => resolve());
  });
}
function isPx(value) {
  return value.slice(-2) === 'px';
}
function pxToFloat(value) {
  return value && isPx(value) ? parseFloat(value) : 0;
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
var gateStub = {
  isOpen: () => true
};

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */

var gates = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ENABLE_COLOR_ICONS_MENU_ITEM: gateStub,
    colorPickerButtonNotAnchorTag: gateStub,
    enableA11yMultiColSortModal: gateStub,
    enableAriaInvalidGroupCombobox: gateStub,
    enableAssertContext260: gateStub,
    enableAssertContext260Round2: gateStub,
    enableAssertContextForBarcodeScanner: gateStub,
    enableBaseComboboxNullCheck: gateStub,
    enableCalendarGridCellAriaFix: gateStub,
    enableCalendarMinMaxNavigation: gateStub,
    enableCarouselRTLFix: gateStub,
    enableCheckboxGroupStaticErrDom: gateStub,
    enableColorPickerEscapeStopPropagation: gateStub,
    enableComboboxElementInternals: gateStub,
    enableComboboxPlaceholderA11y: gateStub,
    enableConsolidateTypeAttributes: gateStub,
    enableDTAutoInlineEditFix: gateStub,
    enableDTHeightCalcForScrollbar: gateStub,
    enableDatatableHoverStyling: gateStub,
    enableDatatablePositionOverride: gateStub,
    enableDatatableUseClientWidth: gateStub,
    enableDatatableVoiceoverFix: gateStub,
    enableDateInvalidYearHandling: gateStub,
    enableDatepickerAriaDescribedByDedup: gateStub,
    enableDisabledOptDualListbox: gateStub,
    enableDisabledRowsAttribute: gateStub,
    enableDropdownCloseDelay: gateStub,
    enableDtInlineEditBlurRace: gateStub,
    enableDualListboxA11yReqOptionErrFix: gateStub,
    enableDualListboxButtonDisablingFix: gateStub,
    enableDualListboxSingleCharTypeahead: gateStub,
    enableFontSizeThirteen: gateStub,
    enableFormattedRichTextNoNestedShadow: gateStub,
    enableFormattedRichTextParts: gateStub,
    enableGeolocationTimeout: gateStub,
    enableHelptextA11yInModal: gateStub,
    enableIndeterminateForInput: gateStub,
    enableInputModeOverride: gateStub,
    enableInputNamePicklistRO: gateStub,
    enableInputSearchCommitEvent: gateStub,
    enableLargeNumberFormatting: gateStub,
    enableLookupFieldObjApiName: gateStub,
    enableMaxEditLimit: gateStub,
    enableMessageToLabelLink: gateStub,
    enableMobileGroupedCbAriaUpdates: gateStub,
    enableNoDescribedbyTooltip: gateStub,
    enableOutputFieldReadOnlyClass: gateStub,
    enableParseErrorSafeAccess: gateStub,
    enablePositionLibFlipCalcWithViewportRight: gateStub,
    enablePositionLibraryFlipInOverlay: gateStub,
    enablePositionLibraryTransformScaleFix: gateStub,
    enableRadioGroupStaticErrDom: gateStub,
    enableReadOnlyTimepickerFix: gateStub,
    enableRelativeDateTimeLocale: gateStub,
    enableSelectStaticErrDom: gateStub,
    enableSliderMax0Value: gateStub,
    enableTabsetRTLFix: gateStub,
    enableTextareaReadOnlyStatic: gateStub,
    enableTimeIntervalApi: gateStub,
    enableTooltipFlashingFix: gateStub,
    enableTooltipHoverDismiss: gateStub,
    enableTreeGackFix: gateStub,
    enableTreeGridRTLFix: gateStub,
    enableTreeGridSecondArrKeyUpdate: gateStub,
    enableUpdatedCheckboxButtonBlueprint: gateStub,
    enableWcagRichTextDark: gateStub,
    enableWcagRichTextLight: gateStub,
    enableaftersanitizationhook: gateStub,
    enablemcsfocusorderonadddelete: gateStub,
    primitiveThemeProviderDisabled: gateStub
});

const resolved = Object.create(null);
for (const [name, gate] of Object.entries(gates)) {
  if (name !== '__lwc_hmr_context') {
    resolved[name] = gate.isOpen({
      fallback: false
    });
  }
}
const __lwc_component_class_internal$c = registerComponent(resolved, {
  tmpl: _tmpl$8,
  sel: "features-gates",
  apiVersion: 66
});

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const _features = Object.assign(Object.create(null), __lwc_component_class_internal$c);
const errorMessage = 'This object and its prototype are immutable. Object values can only be updated with `setFeatureForTest()`';
const features = new Proxy(_features, {
  set() {
    throw new TypeError(errorMessage);
  },
  defineProperty() {
    throw new TypeError(errorMessage);
  },
  deleteProperty() {
    throw new TypeError(errorMessage);
  },
  setPrototypeOf() {
    throw new TypeError(errorMessage);
  }
});

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const Direction = {
  Center: 'center',
  Middle: 'middle',
  Right: 'right',
  Left: 'left',
  Bottom: 'bottom',
  Top: 'top',
  Default: 'default'
};
const VerticalMap = {
  top: Direction.Top,
  bottom: Direction.Bottom,
  center: Direction.Middle
};
const HorizontalMap = {
  left: Direction.Left,
  right: Direction.Right,
  center: Direction.Center
};
const FlipMap = {
  left: Direction.Right,
  right: Direction.Left,
  top: Direction.Bottom,
  bottom: Direction.Top,
  center: Direction.Center,
  default: Direction.Right
};
function getContainerSize(parent) {
  if (parent) {
    return parent.getBoundingClientRect();
  }
  const rect = {
    width: WindowManager.window.innerWidth || document.body.clientWidth || 0,
    height: WindowManager.window.innerHeight || document.body.clientHeight || 0,
    top: 0,
    left: 0
  };
  rect.bottom = rect.height;
  rect.right = rect.width;
  return rect;
}
function normalizeDirection(direction, defaultValue) {
  return normalizeString(direction, {
    fallbackValue: defaultValue || Direction.Default,
    validValues: [Direction.Center, Direction.Right, Direction.Left, Direction.Bottom, Direction.Top, Direction.Middle, Direction.Default]
  });
}
function mapToHorizontal(value) {
  value = normalizeDirection(value, Direction.Left);
  return HorizontalMap[value];
}
function mapToVertical(value) {
  value = normalizeDirection(value, Direction.Left);
  return VerticalMap[value];
}
function flipDirection(value) {
  value = normalizeDirection(value, Direction.Left);
  return FlipMap[value];
}
function checkFlipPossibility(parent, element, target, leftAsBoundary) {
  const viewPort = getContainerSize(parent);
  const windowViewPort = getContainerSize();
  const elemRect = element.getBoundingClientRect();
  const referenceElemRect = target.getBoundingClientRect();
  const height = typeof elemRect.height !== 'undefined' ? elemRect.height : elemRect.bottom - elemRect.top;
  const width = typeof elemRect.width !== 'undefined' ? elemRect.width : elemRect.right - elemRect.left;
  let rightAsBoundary = false;
  let isRTL = false;
  if (document.dir === 'rtl') {
    rightAsBoundary = leftAsBoundary;
    leftAsBoundary = false;
    isRTL = true;
  }
  const aboveSpace = referenceElemRect.top - viewPort.top - height;
  const belowSpace = viewPort.height - referenceElemRect.bottom - height;
  let hasSpaceAbove = aboveSpace >= 0 || parent == null && belowSpace < 0 && aboveSpace > belowSpace;
  let hasSpaceBelow = belowSpace >= 0 || aboveSpace < 0 && belowSpace > aboveSpace;
  let shouldAlignToRight = false;
  if (parent) {
    if (!features.enablePositionLibFlipCalcWithViewportRight) {
      shouldAlignToRight = referenceElemRect.right - viewPort.left >= width && referenceElemRect.left + width > (rightAsBoundary ? referenceElemRect.right : viewPort.width);
    } else {
      shouldAlignToRight = referenceElemRect.right - viewPort.left >= width && referenceElemRect.left + width > (rightAsBoundary ? referenceElemRect.right : viewPort.right);
    }
  } else {
    shouldAlignToRight = referenceElemRect.right >= width && referenceElemRect.left + width > (rightAsBoundary ? referenceElemRect.right : viewPort.width);
  }
  let shouldAlignToLeft = false;
  if (parent) {
    shouldAlignToLeft = referenceElemRect.left + width <= viewPort.right && referenceElemRect.right - viewPort.left - width < (leftAsBoundary ? referenceElemRect.left : 0);
  } else {
    shouldAlignToLeft = referenceElemRect.left + width <= viewPort.width && referenceElemRect.right - width < (leftAsBoundary ? referenceElemRect.left : 0);
  }
  const spaceRemainingRight = viewPort.width - referenceElemRect.left;
  const spaceRemainingLeft = referenceElemRect.right;
  if (!shouldAlignToLeft && !shouldAlignToRight && parent) {
    shouldAlignToRight = (referenceElemRect.right - viewPort.left >= width || referenceElemRect.right >= width) && referenceElemRect.left + width > (rightAsBoundary ? referenceElemRect.right : viewPort.width);
    shouldAlignToLeft = (referenceElemRect.left + width <= viewPort.right || referenceElemRect.left + width <= windowViewPort.width) && referenceElemRect.right - width < (leftAsBoundary ? referenceElemRect.left : 0);
  } else if (!shouldAlignToLeft && !shouldAlignToRight && spaceRemainingRight < width && spaceRemainingLeft < width) {
    shouldAlignToRight = spaceRemainingLeft > spaceRemainingRight;
    shouldAlignToLeft = spaceRemainingLeft < spaceRemainingRight;
  }
  if (isRTL && !shouldAlignToLeft && !shouldAlignToRight && element.tagName === 'LIGHTNING-PRIMITIVE-BUBBLE') {
    shouldAlignToRight = spaceRemainingLeft > spaceRemainingRight;
    shouldAlignToLeft = spaceRemainingLeft < spaceRemainingRight;
  }
  if (!hasSpaceAbove && !hasSpaceBelow && parent && element.style && element.style.position === 'fixed') {
    hasSpaceAbove = referenceElemRect.top - windowViewPort.top - height > 0;
    hasSpaceBelow = windowViewPort.height - referenceElemRect.bottom - height > 0;
  }
  const centerOverflow = {
    left: referenceElemRect.left - width * 0.5 < 0,
    right: referenceElemRect.right + width * 0.5 > viewPort.width,
    top: referenceElemRect.top - height * 0.5 < 0,
    bottom: referenceElemRect.bottom + height * 0.5 > viewPort.height
  };
  return {
    shouldAlignToLeft,
    shouldAlignToRight,
    hasSpaceAbove,
    hasSpaceBelow,
    centerOverflow
  };
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
class Transformer {
  constructor(pad, boxDirections, transformX, transformY) {
    this.pad = pad || 0;
    this.boxDirections = boxDirections || {
      left: true,
      right: true
    };
    this.transformX = transformX || function () {};
    this.transformY = transformY || function () {};
  }
  transform() {}
}
class TopTransformer extends Transformer {
  transform(targetBox, elementBox) {
    return {
      top: Math.floor(this.transformY(targetBox.top, targetBox, elementBox) + this.pad)
    };
  }
  /*LWC compiler v9.5.3*/
}
class BottomTransFormer extends Transformer {
  transform(targetBox, elementBox) {
    return {
      top: Math.floor(this.transformY(targetBox.top, targetBox, elementBox) - elementBox.height - this.pad)
    };
  }
  /*LWC compiler v9.5.3*/
}
class CenterTransformer extends Transformer {
  transform(targetBox, elementBox) {
    return {
      left: Math.floor(this.transformX(targetBox.left, targetBox, elementBox) - 0.5 * elementBox.width)
    };
  }
  /*LWC compiler v9.5.3*/
}
class MiddleTransformer extends Transformer {
  transform(targetBox, elementBox) {
    return {
      top: Math.floor(0.5 * (2 * targetBox.top + targetBox.height - elementBox.height))
    };
  }
  /*LWC compiler v9.5.3*/
}
class LeftTransformer extends Transformer {
  transform(targetBox, elementBox) {
    return {
      left: Math.floor(this.transformX(targetBox.left, targetBox, elementBox) + this.pad)
    };
  }
  /*LWC compiler v9.5.3*/
}
class RightTransformer extends Transformer {
  transform(targetBox, elementBox) {
    return {
      left: Math.floor(this.transformX(targetBox.left, targetBox, elementBox) - elementBox.width - this.pad)
    };
  }
  /*LWC compiler v9.5.3*/
}
class BelowTransformer extends Transformer {
  transform(targetBox, elementBox) {
    const top = targetBox.top + targetBox.height + this.pad;
    return elementBox.top < top ? {
      top
    } : {};
  }
  /*LWC compiler v9.5.3*/
}
const MIN_HEIGHT = 36;
const MIN_WIDTH = 36;
class ShrinkingBoxTransformer extends Transformer {
  transform(targetBox, elementBox) {
    const retBox = {};
    if (this.boxDirections.top && elementBox.top < targetBox.top + this.pad) {
      retBox.top = targetBox.top + this.pad;
      retBox.height = Math.max(elementBox.height - (retBox.top - elementBox.top), MIN_HEIGHT);
    }
    if (this.boxDirections.left && elementBox.left < targetBox.left + this.pad) {
      retBox.left = targetBox.left + this.pad;
      retBox.width = Math.max(elementBox.width - (retBox.left - elementBox.left), MIN_WIDTH);
    }
    if (this.boxDirections.right && elementBox.left + elementBox.width > targetBox.left + targetBox.width - this.pad) {
      retBox.right = targetBox.left + targetBox.width - this.pad;
      retBox.width = Math.max(retBox.right - (retBox.left || elementBox.left), MIN_WIDTH);
    }
    if (this.boxDirections.bottom && elementBox.top + elementBox.height > targetBox.top + targetBox.height - this.pad) {
      retBox.bottom = targetBox.top + targetBox.height - this.pad;
      retBox.height = Math.max(retBox.bottom - (retBox.top || elementBox.top), MIN_HEIGHT);
    }
    return retBox;
  }
  /*LWC compiler v9.5.3*/
}
class BoundingBoxTransformer extends Transformer {
  transform(targetBox, elementBox) {
    const retBox = {};
    if (this.boxDirections.top && elementBox.top < targetBox.top + this.pad) {
      retBox.top = targetBox.top + this.pad;
    }
    if (this.boxDirections.left && elementBox.left < targetBox.left + this.pad) {
      retBox.left = targetBox.left + this.pad;
    }
    if (this.boxDirections.right && elementBox.left + elementBox.width > targetBox.left + targetBox.width - this.pad) {
      retBox.left = targetBox.left + targetBox.width - elementBox.width - this.pad;
    }
    if (this.boxDirections.bottom && elementBox.top + elementBox.height > targetBox.top + targetBox.height - this.pad) {
      retBox.top = targetBox.top + targetBox.height - elementBox.height - this.pad;
    }
    return retBox;
  }
  /*LWC compiler v9.5.3*/
}
class InverseBoundingBoxTransformer extends Transformer {
  transform(targetBox, elementBox) {
    const retBox = {};
    if (this.boxDirections.left && targetBox.left - this.pad < elementBox.left) {
      retBox.left = targetBox.left - this.pad;
    }
    if (this.boxDirections.right && elementBox.left + elementBox.width < targetBox.left + targetBox.width + this.pad) {
      retBox.left = targetBox.width + this.pad - elementBox.width + targetBox.left;
    }
    if (this.boxDirections.top && targetBox.top < elementBox.top + this.pad) {
      retBox.top = targetBox.top - this.pad;
    }
    if (this.boxDirections.bottom && elementBox.top + elementBox.height < targetBox.top + targetBox.height + this.pad) {
      retBox.top = targetBox.height + this.pad - elementBox.height + targetBox.top;
    }
    return retBox;
  }
  /*LWC compiler v9.5.3*/
}
const TransformFunctions = {
  center(input, targetBox) {
    return Math.floor(input + 0.5 * targetBox.width);
  },
  right(input, targetBox) {
    return input + targetBox.width;
  },
  left(input) {
    return input;
  },
  bottom(input, targetBox) {
    return input + targetBox.height;
  }
};
const Transformers = {
  top: TopTransformer,
  bottom: BottomTransFormer,
  center: CenterTransformer,
  middle: MiddleTransformer,
  left: LeftTransformer,
  right: RightTransformer,
  below: BelowTransformer,
  'bounding box': BoundingBoxTransformer,
  'shrinking box': ShrinkingBoxTransformer,
  'inverse bounding box': InverseBoundingBoxTransformer,
  default: Transformer
};
function toTransformFunctions(value) {
  return TransformFunctions[value] || TransformFunctions.left;
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
class TransformBuilder {
  type(value) {
    this._type = value;
    return this;
  }
  align(horizontal, vertical) {
    this._transformX = toTransformFunctions(horizontal);
    this._transformY = toTransformFunctions(vertical);
    return this;
  }
  pad(value) {
    this._pad = parseInt(value, 10);
    return this;
  }
  boxDirections(value) {
    this._boxDirections = value;
    return this;
  }
  build() {
    const AConstructor = Transformers[this._type] ? Transformers[this._type] : Transformers[Direction.Default];
    return new AConstructor(this._pad || 0, this._boxDirections || {}, this._transformX || toTransformFunctions(Direction.left), this._transformY || toTransformFunctions(Direction.left));
  }
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
class Constraint {
  constructor(type, config) {
    const {
      target,
      element,
      pad,
      boxDirections
    } = config;
    const {
      horizontal,
      vertical
    } = config.targetAlign;
    this._element = element;
    this._targetElement = target;
    this.destroyed = false;
    this._transformer = new TransformBuilder().type(type).align(horizontal, vertical).pad(pad).boxDirections(boxDirections).build();
  }
  detach() {
    this._disabled = true;
  }
  attach() {
    this._disabled = false;
  }
  computeDisplacement() {
    if (!this._disabled) {
      this._targetElement.refresh();
      this._element.refresh();
      this._pendingBox = this._transformer.transform(this._targetElement, this._element);
    }
    return this;
  }
  computePosition() {
    const el = this._element;
    if (!this._disabled) {
      Object.keys(this._pendingBox).forEach(key => {
        el.setDirection(key, this._pendingBox[key]);
      });
    }
    return this;
  }
  destroy() {
    this._element.release();
    this._targetElement.release();
    this._disabled = true;
    this.destroyed = true;
  }
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const contextWeakMap = new WeakMap();
function createPrivateContext() {
  return {
    setContext: (instance, store = {}) => {
      contextWeakMap.set(instance, store);
    },
    getContext: instance => {
      return contextWeakMap.get(instance);
    },
    assertContext: instance => {
      if (!contextWeakMap.has(instance)) {
        throw new TypeError('Invalid `this`. This function can only be invoked as a method of the component that defined it.');
      }
    }
  };
}
const privateContext = createPrivateContext();

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const {
  setContext: setContext$3,
  assertContext: assertContext$3
} = privateContext;
class ElementProxy {
  constructor(el, id) {
    setContext$3(this);
    this.id = id;
    this.width = 0;
    this.height = 0;
    this.left = 0;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this._dirty = false;
    this._node = null;
    this._releaseCb = null;
    if (!el) {
      throw new Error('Element missing');
    }
    if (WindowManager.isWindow(el)) {
      el = WindowManager.window;
    }
    this._node = el;
    this.setupObserver();
    this.refresh();
  }
  setupObserver() {
    if (WindowManager.MutationObserver && !this._node.isObserved) {
      this._observer = new WindowManager.MutationObserver(this.refresh.bind(this));
      if (!WindowManager.isWindow(this._node)) {
        this._observer.observe(this._node, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        });
        this._node.isObserved = true;
      }
    }
  }
  setReleaseCallback(cb, scope) {
    if (features.enableAssertContext260Round2) {
      assertContext$3(this);
    }
    const scopeObj = scope || this;
    this._releaseCb = cb.bind(scopeObj);
  }
  checkNodeIsInDom() {
    if (!isInDom(this._node)) {
      return false;
    }
    return true;
  }
  refresh() {
    const w = WindowManager.window;
    if (!this.isDirty()) {
      if (!this.checkNodeIsInDom()) {
        return this.release();
      }
      let box, x, scrollTop, scrollLeft;
      if (typeof w.pageYOffset !== 'undefined') {
        scrollTop = w.pageYOffset;
        scrollLeft = w.pageXOffset;
      } else {
        scrollTop = w.scrollY;
        scrollLeft = w.scrollX;
      }
      if (!WindowManager.isWindow(this._node)) {
        this._node.offsetHeight;
        box = this._node.getBoundingClientRect();
        for (x in box) {
          this[x] = Math.floor(box[x]);
        }
        this.setAdjustedBoundingRect(this, box);
        this.top = Math.floor(this.top + scrollTop);
        this.bottom = Math.floor(this.top + box.height);
        this.left = Math.floor(this.left + scrollLeft);
        this.right = Math.floor(this.left + box.width);
      } else {
        box = {};
        this.width = WindowManager.documentElement.clientWidth;
        this.height = WindowManager.documentElement.clientHeight;
        this.left = scrollLeft;
        this.top = scrollTop;
        this.right = WindowManager.documentElement.clientWidth + scrollLeft;
        this.bottom = WindowManager.documentElement.clientHeight;
      }
      this._dirty = false;
    }
    return this._dirty;
  }
  getNode() {
    return this._node;
  }
  isDirty() {
    return this._dirty;
  }
  getElementZoomRatio(style) {
    const element = this._node;
    if (features.enablePositionLibraryTransformScaleFix) {
      if (!import.meta.env.SSR && 'currentCSSZoom' in Element.prototype) {
        return element.currentCSSZoom;
      }
      return parseFloat(style.zoom) || 1;
    }
    const rect = element.getBoundingClientRect();
    const offsetWidth = element.offsetWidth || Math.round(rect.width) || 1;
    const offsetHeight = element.offsetHeight || Math.round(rect.height) || 1;
    const actualWidth = Math.round(rect.width);
    const actualHeight = Math.round(rect.height);
    const widthRatio = Number((actualWidth / offsetWidth).toFixed(2));
    const heightRatio = Number((actualHeight / offsetHeight).toFixed(2));
    return Math.min(widthRatio, heightRatio);
  }
  setAdjustedBoundingRect(varToSet, boundingRect, computedStyle, zoomLevel) {
    if (features.enablePositionLibraryTransformScaleFix && !import.meta.env.SSR && isSafari) {
      const style = computedStyle || getComputedStyle(this._node);
      const zoom = zoomLevel || this.getElementZoomRatio(style);
      if (zoom !== 1) {
        const rect = boundingRect || this._node.getBoundingClientRect();
        for (const x in rect) {
          varToSet[x] = rect[x] * zoom;
        }
        return true;
      }
    }
    return false;
  }
  bake() {
    const w = WindowManager.window;
    let absPos = {};
    const style = w.getComputedStyle(this._node) || this._node.style;
    const zoomLevel = this.getElementZoomRatio(style);
    const setAbsPos = this.setAdjustedBoundingRect(absPos, null, style, zoomLevel);
    if (!setAbsPos) {
      absPos = this._node.getBoundingClientRect();
    }
    const hasPageOffset = typeof w.pageYOffset !== 'undefined';
    const scrollTop = hasPageOffset ? w.pageYOffset : w.scrollY;
    const scrollLeft = hasPageOffset ? w.pageXOffset : w.scrollX;
    const originalLeft = style.left.match(/auto|fixed/) ? '0' : pxToFloat(style.left);
    const originalTop = style.top.match(/auto|fixed/) ? '0' : pxToFloat(style.top);
    const adjustForZoom = value => value / zoomLevel;
    const marginTop = adjustForZoom(pxToFloat(style.marginTop));
    const adjustedAbsPosTop = adjustForZoom(Math.round(absPos.top)) + scrollTop - (adjustForZoom(this.top) < adjustForZoom(Math.round(absPos.top)) + scrollTop ? marginTop : -marginTop);
    const marginAdjustment = adjustForZoom(this.top) < adjustForZoom(adjustedAbsPosTop) ? marginTop : -marginTop;
    const zoomAdjustedAbsLeft = adjustForZoom(Math.round(absPos.left) + scrollLeft);
    const zoomAdjustedAbsTop = adjustForZoom(Math.round(absPos.top) + scrollTop);
    let leftDif = Math.round(adjustForZoom(this.left) - zoomAdjustedAbsLeft);
    const topDif = Math.round(adjustForZoom(this.top) - (zoomAdjustedAbsTop + marginAdjustment));
    const viewPortWidth = w.innerWidth || document.body.clientWidth;
    let rightPos = parseInt(style.right, 10);
    const elementWidth = this._node.offsetWidth;
    const zoomAdjustedWidth = elementWidth * zoomLevel;
    if (originalLeft + leftDif + zoomAdjustedWidth > viewPortWidth && rightPos <= 0) {
      rightPos = rightPos < 0 ? -rightPos : leftDif;
      this._node.style.right = `${-rightPos}px`;
      leftDif = 0;
    }
    this._node.style.left = `${originalLeft + leftDif}px`;
    this._node.style.top = `${originalTop + topDif}px`;
    if (this._restoreSize) {
      if (this.originalHeight === undefined) {
        this.originalHeight = this._node.style.height;
      }
      if (this.originalWidth === undefined) {
        this.originalWidth = this._node.style.width;
      }
      const adjustedWidth = adjustForZoom(this.width);
      const adjustedHeight = adjustForZoom(this.height);
      this._node.style.width = `${adjustedWidth}px`;
      this._node.style.height = `${adjustedHeight}px`;
    }
    this._dirty = false;
  }
  setDirection(direction, val) {
    this[direction] = val;
    this._dirty = true;
    if (direction === 'height' || direction === 'width') {
      this._restoreSize = true;
    }
  }
  release() {
    if (this._restoreSize) {
      this._node.style.width = this.originalWidth;
      this._node.style.height = this.originalHeight;
      if (this._removeMinHeight) {
        this._node.style.minHeight = '';
      }
    }
    if (this._releaseCb) {
      this._releaseCb(this);
    }
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }
  querySelectorAll(selector) {
    return this._node.querySelectorAll(selector);
  }
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
class ProxyCache {
  constructor() {
    this.proxyCache = {};
  }
  get count() {
    return Object.keys(this.proxyCache).length;
  }
  releaseOrphanProxies() {
    for (const proxy in this.proxyCache) {
      if (!this.proxyCache[proxy].el.checkNodeIsInDom()) {
        this.proxyCache[proxy].el.release();
      }
    }
  }
  bakeOff() {
    for (const proxy in this.proxyCache) {
      if (this.proxyCache[proxy].el.isDirty()) {
        this.proxyCache[proxy].el.bake();
      }
    }
  }
  getReferenceCount(proxy) {
    const id = proxy.id;
    if (!id || !this.proxyCache[id]) {
      return 0;
    }
    return this.proxyCache[id].refCount;
  }
  release(proxy) {
    const proxyInstance = this.proxyCache[proxy.id];
    if (proxyInstance) {
      --proxyInstance.refCount;
    }
    if (proxyInstance && proxyInstance.refCount <= 0) {
      delete this.proxyCache[proxy.id];
    }
  }
  reset() {
    this.proxyCache = {};
  }
  create(element) {
    let key = 'window';
    if (!WindowManager.isWindow(element)) {
      key = element ? element.getAttribute(POSITION_ATTR_NAME) : null;
      assert(key && element.nodeType && (element.nodeType !== 1 || element.nodeType !== 11), `Element Proxy requires an element and has property ${POSITION_ATTR_NAME}`);
    }
    if (this.proxyCache[key]) {
      this.proxyCache[key].refCount++;
      return this.proxyCache[key].el;
    }
    const newProxy = new ElementProxy(element, key);
    newProxy.setReleaseCallback(release, newProxy);
    this.proxyCache[key] = {
      el: newProxy,
      refCount: 1
    };
    timeout(0).then(() => {
      this.releaseOrphanProxies();
    });
    return this.proxyCache[key].el;
  }
}
const elementProxyCache = new ProxyCache();
function bakeOff() {
  elementProxyCache.bakeOff();
}
function release(proxy) {
  return elementProxyCache.release(proxy);
}
function createProxy(element) {
  return elementProxyCache.create(element);
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
class RepositionQueue {
  constructor() {
    this.callbacks = [];
    this.repositionScheduled = false;
    this._constraints = [];
    this.timeoutId = 0;
    this.lastIndex = getZIndexBaseline();
    this.eventsBound = false;
  }
  get nextIndex() {
    return this.lastIndex++;
  }
  get constraints() {
    return this._constraints;
  }
  set constraints(value) {
    this._constraints = this._constraints.concat(value);
  }
  dispatchRepositionCallbacks() {
    while (this.callbacks.length > 0) {
      this.callbacks.shift()();
    }
  }
  add(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
      return true;
    }
    return false;
  }
  scheduleReposition(callback) {
    if (this.timeoutId === 0) {
      this.timeoutId = setTimeout(() => {
        this.reposition(callback);
      }, 10);
    }
  }
  reposition(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
    }
    clearTimeout(this.timeoutId);
    this.timeoutId = 0;
    if (!this.repositionScheduled) {
      requestAnimationFrame(() => {
        this.repositionScheduled = false;
        this._constraints = this._constraints.filter(constraint => {
          if (!constraint.destroyed) {
            constraint.computeDisplacement().computePosition();
            return true;
          }
          return false;
        });
        bakeOff();
        this.dispatchRepositionCallbacks();
      });
      this.repositionScheduled = true;
    }
  }
  get repositioning() {
    if (!this._reposition) {
      this._reposition = this.scheduleReposition.bind(this);
    }
    return this._reposition;
  }
  bindEvents() {
    if (!this.eventsBound) {
      window.addEventListener('resize', this.repositioning);
      window.addEventListener('scroll', this.repositioning);
      this.eventsBound = true;
    }
  }
  detachEvents() {
    window.removeEventListener('resize', this.repositioning);
    window.removeEventListener('scroll', this.repositioning);
    this.eventsBound = false;
  }
  rebase(index) {
    if (this.lastIndex <= index) {
      this.lastIndex = index + 1;
    }
  }
}
const positionQueue = new RepositionQueue();
function scheduleReposition(callback) {
  positionQueue.scheduleReposition(callback);
}
function bindEvents() {
  positionQueue.bindEvents();
}
function addConstraints(list) {
  positionQueue.constraints = list;
}
function reposition(callback) {
  positionQueue.reposition(callback);
}
function nextIndex() {
  return positionQueue.nextIndex;
}
function rebaseIndex(index) {
  return positionQueue.rebase(index);
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
class Relationship {
  constructor(config, constraintList, scrollableParent, observer) {
    this.config = config;
    this.constraintList = constraintList;
    this.scrollableParent = scrollableParent;
    this.observer = observer;
  }
  disable() {
    this.constraintList.forEach(constraintToDisable => {
      constraintToDisable.detach();
    });
  }
  enable() {
    this.constraintList.forEach(constraintToEnable => {
      constraintToEnable.attach();
    });
  }
  destroy() {
    if (this.config.removeListeners) {
      this.config.removeListeners();
      this.config.removeListeners = undefined;
    }
    while (this.constraintList.length > 0) {
      this.constraintList.pop().destroy();
    }
    if (this.config.appendToBody && this.config.element) {
      const nodeToRemove = document.querySelector(`[${POSITION_ATTR_NAME}="${this.config.element.getAttribute(POSITION_ATTR_NAME)}"]`);
      if (nodeToRemove) {
        nodeToRemove.parentNode.removeChild(nodeToRemove);
      }
    }
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
  reposition() {
    return new Promise(resolve => {
      reposition(() => {
        resolve();
      });
    });
  }
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const OVERLAY_TYPE = {
  NONE: 'none',
  MODAL: 'uiModal',
  DIALOG: 'lightning-dialog',
  POPOVER: 'lightning-popover',
  PANEL: 'uiPanel',
  LIGHTNING_OVERLAY: 'overlay-surface',
  SLDSMODAL: 'slds-modal'
};
function isOverlay(element) {
  const isDialog = element.localName === OVERLAY_TYPE.DIALOG;
  if (isDialog) {
    return OVERLAY_TYPE.DIALOG;
  }
  const isPopover = element.localName === OVERLAY_TYPE.POPOVER;
  if (isPopover) {
    return OVERLAY_TYPE.POPOVER;
  }
  const isLightningOverlay = element.classList && element.classList.contains(OVERLAY_TYPE.LIGHTNING_OVERLAY);
  if (isLightningOverlay) {
    return OVERLAY_TYPE.LIGHTNING_OVERLAY;
  }
  const isModal = element.classList && element.classList.contains(OVERLAY_TYPE.MODAL);
  if (isModal) {
    return OVERLAY_TYPE.MODAL;
  }
  const isPanel = element.classList && element.classList.contains(OVERLAY_TYPE.PANEL);
  if (isPanel) {
    return OVERLAY_TYPE.PANEL;
  }
  const isSldsModal = element.classList && element.classList.contains(OVERLAY_TYPE.SLDSMODAL);
  if (isSldsModal) {
    return OVERLAY_TYPE.SLDSMODAL;
  }
  return OVERLAY_TYPE.NONE;
}
function isInsideOverlay(element) {
  if (!element) {
    return {
      isInside: false,
      type: null,
      overlay: null
    };
  }
  const type = isOverlay(element);
  if (type !== OVERLAY_TYPE.NONE) {
    return {
      isInside: true,
      type,
      overlay: element
    };
  }
  if (!element.parentNode) {
    return {
      isInside: false,
      type: null,
      overlay: null
    };
  }
  return isInsideOverlay(isShadowRoot(element.parentNode) ? element.parentNode.host : element.parentNode);
}
class OverlayDetector {
  constructor(element) {
    this._element = element;
    this._detection = isInsideOverlay(this._element) || {
      isInside: false,
      overlay: null
    };
  }
  get isInsideModal() {
    return this.isInside && (this._detection.type === OVERLAY_TYPE.MODAL || this._detection.type === OVERLAY_TYPE.DIALOG || this._detection.type === OVERLAY_TYPE.SLDSMODAL);
  }
  get isInside() {
    return this._detection.isInside;
  }
  get overlay() {
    return this._detection.overlay;
  }
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const DEFAULT_MIN_HEIGHT = '1.875rem';
function setupObserver(config, scrollableParent) {
  const observedElement = config.element;
  let observer = null;
  if (WindowManager.MutationObserver && !observedElement.isObserved) {
    observer = new WindowManager.MutationObserver(() => {});
    observer.observe(observedElement, {
      attributes: true,
      subtree: true,
      childList: true
    });
    observedElement.isObserved = true;
  }
  if (scrollableParent) {
    scrollableParent.addEventListener('scroll', scheduleReposition);
    config.removeListeners = () => {
      scrollableParent.removeEventListener('scroll', scheduleReposition);
    };
  }
  return observer;
}
function validateConfig(config) {
  assert(config.element && isDomNode(config.element), 'Element is undefined or missing, or not a Dom Node');
  assert(config.target && (WindowManager.isWindow(config.target) || isDomNode(config.target)), 'Target is undefined or missing');
}
function createRelationship(originalConfig, disableReposition, eventComposedPath) {
  bindEvents();
  let scrollableParent = getScrollableParent(getPositionTarget(originalConfig.target), WindowManager.window);
  if (!scrollableParent && eventComposedPath) {
    scrollableParent = getScrollableParentFromEventPath(eventComposedPath);
  }
  const config = normalizeConfig(scrollableParent, originalConfig);
  if (config.alignWidth && config.element.style.position === 'fixed') {
    config.element.style.width = config.target.getBoundingClientRect().width + 'px';
  }
  const constraintList = [];
  const observer = setupObserver(config, scrollableParent);
  if (config.appendToBody) {
    document.body.appendChild(config.element);
  }
  config.element = createProxy(config.element);
  config.target = createProxy(config.target);
  const horizontalConfig = Object.assign({}, config);
  if (horizontalConfig.padLeft !== undefined) {
    horizontalConfig.pad = horizontalConfig.padLeft;
  }
  const verticalConfig = Object.assign({}, config);
  if (verticalConfig.padTop !== undefined) {
    verticalConfig.pad = verticalConfig.padTop;
  }
  constraintList.push(new Constraint(mapToHorizontal(config.align.horizontal), horizontalConfig));
  constraintList.push(new Constraint(mapToVertical(config.align.vertical), verticalConfig));
  const autoShrink = config.autoShrink.height || config.autoShrink.width;
  if (config.scrollableParentBound && scrollableParent) {
    const parent = normalizeElement(scrollableParent);
    const boxConfig = {
      element: config.element,
      enabled: config.enabled,
      target: createProxy(parent),
      align: {},
      targetAlign: {},
      pad: 3,
      boxDirections: {
        top: true,
        bottom: true,
        left: true,
        right: true
      }
    };
    if (autoShrink) {
      const style = boxConfig.element.getNode().style;
      if (!style.minHeight) {
        style.minHeight = config.minHeight;
        boxConfig.element._removeMinHeight = true;
      }
      boxConfig.boxDirections = {
        top: !!config.autoShrink.height,
        bottom: !!config.autoShrink.height,
        left: !!config.autoShrink.width,
        right: !!config.autoShrink.width
      };
      constraintList.push(new Constraint('shrinking box', boxConfig));
    } else {
      constraintList.push(new Constraint('bounding box', boxConfig));
    }
  }
  if (config.keepInViewport) {
    constraintList.push(new Constraint('bounding box', {
      element: config.element,
      enabled: config.enabled,
      target: createProxy(window),
      align: {},
      targetAlign: {},
      pad: 3,
      boxDirections: {
        top: true,
        bottom: true,
        left: true,
        right: true
      }
    }));
  }
  addConstraints(constraintList);
  {
    reposition();
  }
  return new Relationship(config, constraintList, scrollableParent, observer);
}
function isAutoFlipHorizontal(config) {
  return config.autoFlip || config.autoFlipHorizontal;
}
function isAutoFlipVertical(config) {
  return config.autoFlip || config.autoFlipVertical;
}
function normalizeAlignments(config, flipConfig) {
  const align = {
    horizontal: config.align.horizontal,
    vertical: config.align.vertical
  };
  const targetAlign = {
    horizontal: config.targetAlign.horizontal,
    vertical: config.targetAlign.vertical
  };
  if (document.dir === 'rtl') {
    align.horizontal = flipDirection(align.horizontal);
    targetAlign.horizontal = flipDirection(targetAlign.horizontal);
  }
  let vFlip = false;
  if (isAutoFlipVertical(config)) {
    if (align.vertical === Direction.Bottom) {
      vFlip = !flipConfig.hasSpaceAbove && flipConfig.hasSpaceBelow;
    } else if (align.vertical === Direction.Top) {
      vFlip = flipConfig.hasSpaceAbove && !flipConfig.hasSpaceBelow;
    } else if (align.vertical === Direction.Center) {
      if (flipConfig.centerOverflow.top && !flipConfig.centerOverflow.bottom) {
        align.vertical = targetAlign.vertical = Direction.Top;
      } else if (flipConfig.centerOverflow.bottom && !flipConfig.centerOverflow.top) {
        align.vertical = targetAlign.vertical = Direction.Bottom;
      }
    }
  }
  let hFlip = false;
  if (isAutoFlipHorizontal(config)) {
    if (align.horizontal === Direction.Left) {
      hFlip = flipConfig.shouldAlignToRight && !flipConfig.shouldAlignToLeft;
    } else if (align.horizontal === Direction.Right) {
      hFlip = flipConfig.shouldAlignToLeft && !flipConfig.shouldAlignToRight;
    } else if (align.horizontal === Direction.Center) {
      if (flipConfig.centerOverflow.left && !flipConfig.centerOverflow.right) {
        align.horizontal = targetAlign.horizontal = Direction.Left;
      } else if (flipConfig.centerOverflow.right && !flipConfig.centerOverflow.left) {
        align.horizontal = targetAlign.horizontal = Direction.Right;
      }
    }
  }
  return {
    align: {
      horizontal: hFlip ? flipDirection(align.horizontal) : normalizeDirection(align.horizontal, Direction.Left),
      vertical: vFlip ? flipDirection(align.vertical) : normalizeDirection(align.vertical, Direction.Top)
    },
    targetAlign: {
      horizontal: hFlip ? flipDirection(targetAlign.horizontal) : normalizeDirection(targetAlign.horizontal, Direction.Left),
      vertical: vFlip ? flipDirection(targetAlign.vertical) : normalizeDirection(targetAlign.vertical, Direction.Bottom)
    }
  };
}
function normalizeConfig(parent, config) {
  config.align = config.align || {};
  config.targetAlign = config.targetAlign || {};
  const flipConfig = checkFlipPossibility(config.overlay.isInside && (!features.enablePositionLibraryFlipInOverlay || !config.flipInOverlay) ? null : parent, config.element, config.target, config.leftAsBoundary);
  const {
    align,
    targetAlign
  } = normalizeAlignments(config, flipConfig);
  if (config.isInsideModal && !flipConfig.hasSpaceAbove && !flipConfig.hasSpaceBelow) {
    config.scrollableParentBound = true;
  }
  return {
    target: config.target,
    element: config.element,
    align,
    targetAlign,
    alignWidth: config.alignWidth,
    scrollableParentBound: config.scrollableParentBound,
    keepInViewport: config.keepInViewport,
    pad: config.pad,
    padTop: config.padTop,
    padLeft: config.padLeft,
    autoShrink: {
      height: config.autoShrink || config.autoShrinkHeight,
      width: config.autoShrink || config.autoShrinkWidth
    },
    minHeight: config.minHeight || DEFAULT_MIN_HEIGHT
  };
}
function toElement(root, target) {
  if (target && typeof target === 'string') {
    return root.querySelector(target);
  } else if (target && typeof target === 'function') {
    return target();
  }
  return target;
}
function startPositioning(root, config, disableReposition) {
  assert(root, 'Root is undefined or missing');
  assert(config, 'Config is undefined or missing');
  const node = normalizeElement(root);
  const target = toElement(node, config.target);
  const element = toElement(node, config.element);
  if (!target || !element) {
    return null;
  }
  config.target = normalizeElement(target);
  config.element = normalizeElement(element);
  const result = new OverlayDetector(config.element);
  config.isInsideModal = result.isInsideModal;
  if (config.isInsideModal && result.overlay) {
    const index = parseInt(result.overlay.style.zIndex, 10);
    rebaseIndex(index);
  }
  const targetResult = new OverlayDetector(config.target);
  if (targetResult.isInsideModal && targetResult.overlay) {
    const index = parseInt(targetResult.overlay.style.zIndex, 10);
    rebaseIndex(index);
  }
  const overlayCheck = normalizePosition(config.element, result, nextIndex(), config.target, config.alignWidth);
  config.element = overlayCheck.element;
  config.overlay = overlayCheck.overlay;
  validateConfig(config);
  const relationship = createRelationship(config);
  root.dispatchEvent(new CustomEvent('privatescrollablecontainer', {
    composed: true,
    bubbles: true,
    detail: {
      callback: eventComposedPath => {
        const updatedReltnWrtoScrollParent = createRelationship(config, disableReposition, eventComposedPath);
        relationship.config.align.horizontal = updatedReltnWrtoScrollParent.config.align.horizontal;
        relationship.config.align.vertical = updatedReltnWrtoScrollParent.config.align.vertical;
      }
    }
  }));
  return relationship;
}
function stopPositioning(relationship) {
  if (relationship) {
    relationship.destroy();
  }
}
class AutoPosition {
  constructor(root) {
    this._autoPositionUpdater = null;
    this._root = root;
  }
  start(config) {
    return requestAnimationFrameAsPromise().then(() => {
      let promise = Promise.resolve();
      if (!this._autoPositionUpdater) {
        this._autoPositionUpdater = startPositioning(this._root, config);
      } else {
        promise = promise.then(() => {
          return this._autoPositionUpdater.reposition();
        });
      }
      return promise.then(() => {
        return this._autoPositionUpdater;
      });
    });
  }
  stop() {
    if (this._autoPositionUpdater) {
      stopPositioning(this._autoPositionUpdater);
      this._autoPositionUpdater = null;
    }
    return Promise.resolve();
  }
}

function stylesheet$a(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  return ".fix-popover_tooltip_alignment" + shadowSelector + " {min-width: inherit;}";
  /*LWC compiler v9.5.3*/
}
var stylesheet0$3 = [stylesheet$a];

function stylesheet$9(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return [((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='overlay']" : hostSelector + "[data-render-mode=\"shadow\"] [part~='overlay']")), shadowSelector, " {--slds-c-tooltip-sizing-width-max: var(--slds-c-tooltip-sizing-max-width);--slds-c-tooltip-position-zindex: var(--slds-c-popover-position-zindex);background-color: var(--slds-c-tooltip-color-background, #032d60);color: var(--slds-c-tooltip-text-color, #fff);border-radius: 0.25rem;border-width: 0;box-shadow: 0 2px 3px 0 rgb(0 0 0 / 16%);padding-inline-start: 0.75rem;padding-inline-end: 0.75rem;padding-block-start: 0.5rem;padding-block-end: 0.5rem;z-index: var(--slds-c-tooltip-position-zindex);font-size: var(--slds-c-tooltip-font-size, 0.75rem);max-width: var(--slds-c-tooltip-sizing-width-max, 20rem);position: relative;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='overlay']" : hostSelector + "[data-render-mode=\"shadow\"] [part~='overlay']")), shadowSelector, "::after {box-shadow: -1px -1px 0 0 rgba(0, 0, 0, 16%);z-index: -1;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_top" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top")), shadowSelector, "::before {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;left: 50%;top: -0.5rem;margin-left: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_top" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top")), shadowSelector, "::after {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;left: 50%;top: -0.5rem;margin-left: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_top-left" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_top-left-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-left" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-left-corner")), shadowSelector, "::before {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;left: 50%;top: -0.5rem;margin-left: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_top-left" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_top-left-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-left" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-left-corner")), shadowSelector, "::after {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;left: 50%;top: -0.5rem;margin-left: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_top-left" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_top-left" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_top-left-corner" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_top-left-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-left" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-left" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-left-corner" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-left-corner")), shadowSelector, "::after {left: 1.5rem;top: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_top-right" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_top-right-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-right" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-right-corner")), shadowSelector, "::before {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;left: 50%;top: -0.5rem;margin-left: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_top-right" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_top-right-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-right" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-right-corner")), shadowSelector, "::after {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;left: 50%;top: -0.5rem;margin-left: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_top-right" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_top-right" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_top-right-corner" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_top-right-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-right" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-right" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-right-corner" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-right-corner")), shadowSelector, "::after {left: auto;right: 1.5rem;top: -0.5rem;margin-right: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom")), shadowSelector, "::before {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;left: 50%;bottom: -0.5rem;margin-left: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom")), shadowSelector, "::after {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;left: 50%;bottom: -0.5rem;margin-left: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom")), shadowSelector, "::after {box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 16%);z-index: -1;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-left" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-left-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-left" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-left-corner")), shadowSelector, "::before {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;left: 50%;bottom: -0.5rem;margin-left: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-left" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-left-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-left" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-left-corner")), shadowSelector, "::after {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;left: 50%;bottom: -0.5rem;margin-left: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-left" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-left-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-left" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-left-corner")), shadowSelector, "::after {box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 16%);z-index: -1;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-left" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-left" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-left-corner" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-left-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-left" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-left" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-left-corner" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-left-corner")), shadowSelector, "::after {left: 1.5rem;top: 100%;margin-top: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-right" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-right-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-right" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-right-corner")), shadowSelector, "::before {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;left: 50%;bottom: -0.5rem;margin-left: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-right" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-right-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-right" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-right-corner")), shadowSelector, "::after {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;left: 50%;bottom: -0.5rem;margin-left: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-right" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-right-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-right" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-right-corner")), shadowSelector, "::after {box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 16%);z-index: -1;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-right" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-right" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-right-corner" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-right-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-right" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-right" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-right-corner" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-right-corner")), shadowSelector, "::after {left: auto;right: 1.5rem;top: 100%;margin-top: -0.5rem;margin-right: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_left" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left")), shadowSelector, "::before {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;top: 50%;left: -0.5rem;margin-top: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_left" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left")), shadowSelector, "::after {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;top: 50%;left: -0.5rem;margin-top: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_left" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left")), shadowSelector, "::after {box-shadow: -1px 1px 2px 0 rgba(0, 0, 0, 16%);z-index: -1;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_left-top" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_left-top-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-top" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-top-corner")), shadowSelector, "::before {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;top: 50%;left: -0.5rem;margin-top: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_left-top" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_left-top-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-top" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-top-corner")), shadowSelector, "::after {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;top: 50%;left: -0.5rem;margin-top: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_left-top" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_left-top-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-top" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-top-corner")), shadowSelector, "::after {box-shadow: -1px 1px 2px 0 rgba(0, 0, 0, 16%);z-index: -1;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_left-top" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_left-top" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_left-top-corner" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_left-top-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-top" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-top" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-top-corner" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-top-corner")), shadowSelector, "::after {top: 1.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_left-bottom" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_left-bottom-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-bottom" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-bottom-corner")), shadowSelector, "::before {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;top: 50%;left: -0.5rem;margin-top: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_left-bottom" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_left-bottom-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-bottom" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-bottom-corner")), shadowSelector, "::after {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;top: 50%;left: -0.5rem;margin-top: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_left-bottom" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_left-bottom-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-bottom" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-bottom-corner")), shadowSelector, "::before {margin-bottom: -1px;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_left-bottom" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_left-bottom-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-bottom" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-bottom-corner")), shadowSelector, "::after {box-shadow: -1px 2px 3px 0 rgba(0, 0, 0, 16%);z-index: -1;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_left-bottom" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_left-bottom" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_left-bottom-corner" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_left-bottom-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-bottom" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-bottom" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-bottom-corner" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-bottom-corner")), shadowSelector, "::after {top: auto;bottom: 1rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_right" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right")), shadowSelector, "::before {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;top: 50%;right: -0.5rem;margin-top: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_right" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right")), shadowSelector, "::after {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;top: 50%;right: -0.5rem;margin-top: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_right" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right")), shadowSelector, "::after {box-shadow: 1px -1px 2px 0 rgba(0, 0, 0, 16%);z-index: -1;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_right-top" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_right-top-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-top" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-top-corner")), shadowSelector, "::before {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;top: 50%;right: -0.5rem;margin-top: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_right-top" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_right-top-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-top" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-top-corner")), shadowSelector, "::after {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;top: 50%;right: -0.5rem;margin-top: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_right-top" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_right-top-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-top" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-top-corner")), shadowSelector, "::after {box-shadow: 1px -1px 2px 0 rgba(0, 0, 0, 16%);z-index: -1;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_right-top" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_right-top" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_right-top-corner" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_right-top-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-top" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-top" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-top-corner" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-top-corner")), shadowSelector, "::after {top: 1.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_right-bottom" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_right-bottom-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-bottom" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-bottom-corner")), shadowSelector, "::before {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;top: 50%;right: -0.5rem;margin-top: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_right-bottom" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_right-bottom-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-bottom" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-bottom-corner")), shadowSelector, "::after {width: 1rem;height: 1rem;position: absolute;transform: rotate(45deg);content: '';background-color: inherit;top: 50%;right: -0.5rem;margin-top: -0.5rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_right-bottom" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_right-bottom-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-bottom" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-bottom-corner")), shadowSelector, "::before {margin-bottom: -1px;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_right-bottom" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_right-bottom-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-bottom" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-bottom-corner")), shadowSelector, "::after {box-shadow: 2px -1px 3px 0 rgba(0, 0, 0, 16%);z-index: -1;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_right-bottom" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_right-bottom" + shadowSelector + "::after,:host([data-render-mode=\"shadow\"]) .slds-nubbin_right-bottom-corner" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_right-bottom-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-bottom" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-bottom" + shadowSelector + "::after," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-bottom-corner" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-bottom-corner")), shadowSelector, "::after {top: auto;bottom: 1rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_top-left-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-left-corner")), shadowSelector, " {border-radius: 0.125rem 0.25rem 0.25rem 0.25rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_top-left-corner" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_top-left-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-left-corner" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-left-corner")), shadowSelector, "::after {left: 0.75rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-left-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-left-corner")), shadowSelector, " {border-radius: 0.25rem 0.25rem 0.25rem 0.125rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-left-corner" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-left-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-left-corner" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-left-corner")), shadowSelector, "::after {left: 0.75rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_top-right-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-right-corner")), shadowSelector, " {border-radius: 0.25rem 0.125rem 0.25rem 0.25rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_top-right-corner" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_top-right-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-right-corner" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_top-right-corner")), shadowSelector, "::after {right: 0.75rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-right-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-right-corner")), shadowSelector, " {border-radius: 0.25rem 0.25rem 0.125rem 0.25rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-right-corner" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_bottom-right-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-right-corner" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_bottom-right-corner")), shadowSelector, "::after {right: 0.75rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_left-top-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-top-corner")), shadowSelector, " {border-radius: 0.125rem 0.25rem 0.25rem 0.25rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_left-top-corner" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_left-top-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-top-corner" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-top-corner")), shadowSelector, "::after {top: 0.75rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_right-top-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-top-corner")), shadowSelector, " {border-radius: 0.25rem 0.125rem 0.25rem 0.25rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_right-top-corner" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_right-top-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-top-corner" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-top-corner")), shadowSelector, "::after {top: 0.75rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_left-bottom-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-bottom-corner")), shadowSelector, " {border-radius: 0.25rem 0.25rem 0.25rem 0.125rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_left-bottom-corner" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_left-bottom-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-bottom-corner" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_left-bottom-corner")), shadowSelector, "::after {bottom: 0.25rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_right-bottom-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-bottom-corner")), shadowSelector, " {border-radius: 0.25rem 0.25rem 0.125rem 0.25rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-nubbin_right-bottom-corner" + shadowSelector + "::before,:host([data-render-mode=\"shadow\"]) .slds-nubbin_right-bottom-corner" : hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-bottom-corner" + shadowSelector + "::before," + hostSelector + "[data-render-mode=\"shadow\"] .slds-nubbin_right-bottom-corner")), shadowSelector, "::after {bottom: 0.25rem;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-rise-from-ground" : hostSelector + "[data-render-mode=\"shadow\"] .slds-rise-from-ground")), shadowSelector, " {visibility: visible;opacity: 1;transform: translate(0%, 0%);transition:\n opacity 0.1s linear,\n visibility 0.1s linear,\n transform 0.1s linear;will-change: transform;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-fall-into-ground" : hostSelector + "[data-render-mode=\"shadow\"] .slds-fall-into-ground")), shadowSelector, " {visibility: hidden;opacity: 0;transform: translate(0%, 0%);transition:\n opacity 0.1s linear,\n visibility 0.1s linear,\n transform 0.1s linear;will-change: transform;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-slide-from-bottom-to-top" : hostSelector + "[data-render-mode=\"shadow\"] .slds-slide-from-bottom-to-top")), shadowSelector, " {transform: translateY(10%);will-change: transform;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-slide-from-top-to-bottom" : hostSelector + "[data-render-mode=\"shadow\"] .slds-slide-from-top-to-bottom")), shadowSelector, " {transform: translateY(-10%);will-change: transform;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-slide-from-right-to-left" : hostSelector + "[data-render-mode=\"shadow\"] .slds-slide-from-right-to-left")), shadowSelector, " {transform: translateX(5%);will-change: transform;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-slide-from-left-to-right" : hostSelector + "[data-render-mode=\"shadow\"] .slds-slide-from-left-to-right")), shadowSelector, " {transform: translateX(-5%);will-change: transform;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-hide" : hostSelector + "[data-render-mode=\"shadow\"] .slds-hide")), shadowSelector, " {display: none;}"].join('');
  /*LWC compiler v9.5.3*/
}
var stylesheet1$5 = [stylesheet$9];

var stylesheet1$4 = [stylesheet0$6, stylesheet1$5];

var _implicitStylesheets$2 = [stylesheet0$3, stylesheet1$4];

const stc0$6 = {
  "part": "overlay"
};
const stc1$2 = {
  "slds-popover__body": true
};
const stc2$2 = {
  lwc: {
    dom: "manual"
  }
};
function tmpl$7($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, b: api_bind, h: api_element} = $api;
  const {_m0, _m1} = $ctx;
  return [api_element("div", {
    className: api_normalize_class_name($cmp.computedPopoverClass),
    attrs: stc0$6,
    key: 0,
    on: _m0 || ($ctx._m0 = {
      "transitionend": api_bind($cmp.handleTransitionEnd)
    })
  }, [api_element("div", {
    classMap: stc1$2,
    context: stc2$2,
    key: 1,
    on: _m1 || ($ctx._m1 = {
      "mouseleave": api_bind($cmp.handleMouseLeave)
    })
  })])];
  /*LWC compiler v9.5.3*/
}
var _tmpl$7 = registerTemplate(tmpl$7);
tmpl$7.stylesheets = [];
tmpl$7.stylesheetToken = "lwc-5fnnbdvmu3k";
if (_implicitStylesheets$2) {
  tmpl$7.stylesheets.push.apply(tmpl$7.stylesheets, _implicitStylesheets$2);
}
freezeTemplate(tmpl$7);

const DEFAULT_ALIGN = {
  horizontal: 'left',
  vertical: 'bottom'
};
const POPOVER_MIN_HEIGHT = 32;
const DEFAULT_INVISIBLE_DIV_STYLES = {
  height: '1rem',
  position: 'absolute',
  left: '0',
  marginLeft: '0'
};
class LightningPrimitiveBubble extends __lwc_component_class_internal$d {
  constructor(...args) {
    super(...args);
    this.state = {
      visible: false,
      hidden: true,
      contentId: ''
    };
    this.disableVisibilityChangeOnLeave = void 0;
    this.divEl = void 0;
  }
  get contentId() {
    return this.state.contentId;
  }
  set contentId(value) {
    this.state.contentId = value;
    if (this.state.inDOM) {
      this.divEl.setAttribute('id', this.state.contentId);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'tooltip');
    this.setAttribute('aria-hidden', true);
    this.setAttribute('class', 'slds-scope');
    this.state.inDOM = true;
  }
  disconnectedCallback() {
    this.state.inDOM = false;
  }
  renderedCallback() {
    this.setContentManually();
    this.setIdManually();
    this.createInvisibleDivManually();
  }
  set content(value) {
    this.state.content = value;
    if (this.state.inDOM) {
      this.setContentManually();
    }
  }
  get content() {
    return this.state.content || '';
  }
  get align() {
    return this.state.align || DEFAULT_ALIGN;
  }
  set align(value) {
    this.state.align = value;
  }
  get visible() {
    return this.state.visible;
  }
  set visible(value) {
    this.state.visible = value;
    if (this.state.visible) {
      this.state.hidden = false;
    }
    if (this.state.hidden) {
      this.setAttribute('aria-hidden', true);
    } else {
      this.removeAttribute('aria-hidden');
    }
  }
  handleTransitionEnd() {
    if (!this.state.visible) {
      this.state.hidden = true;
      this.setAttribute('aria-hidden', true);
    }
  }
  setIdManually() {
    this.setAttribute('id', this.state.contentId);
  }
  setContentManually() {
    this.template.querySelector('.slds-popover__body').textContent = this.state.content;
  }
  createInvisibleDivManually() {
    if (this.state.visible) {
      const popoverParent = this.template.querySelector('.slds-popover');
      const popoverBody = this.template.querySelector('.slds-popover__body');
      const invisibleDiv = document.createElement('div');
      const {
        vertical
      } = this.align;
      let computedStyle = null;
      if (window && popoverParent && popoverBody) {
        computedStyle = window.getComputedStyle(popoverParent);
        invisibleDiv.style.width = computedStyle.getPropertyValue('width');
        if (vertical === 'bottom') {
          invisibleDiv.style.top = Math.max(POPOVER_MIN_HEIGHT, popoverParent.offsetHeight) + 'px';
        } else {
          invisibleDiv.style.top = '-1rem';
        }
      }
      invisibleDiv.style.height = DEFAULT_INVISIBLE_DIV_STYLES.height;
      invisibleDiv.style.position = DEFAULT_INVISIBLE_DIV_STYLES.position;
      invisibleDiv.style.left = DEFAULT_INVISIBLE_DIV_STYLES.left;
      invisibleDiv.style.marginLeft = DEFAULT_INVISIBLE_DIV_STYLES.marginLeft;
      popoverBody.appendChild(invisibleDiv);
    }
  }
  get computedPopoverClass() {
    const classes = classSet('slds-popover').add('slds-popover_tooltip').add('fix-popover_tooltip_alignment');
    classes.add({
      'slds-rise-from-ground': this.visible,
      'slds-fall-into-ground': !this.visible,
      'slds-hide': this.state.hidden
    });
    const {
      horizontal,
      vertical
    } = this.align;
    classes.add({
      'slds-nubbin_top-left': horizontal === 'left' && vertical === 'top',
      'slds-nubbin_top-right': horizontal === 'right' && vertical === 'top',
      'slds-nubbin_bottom-left': horizontal === 'left' && vertical === 'bottom',
      'slds-nubbin_bottom-right': horizontal === 'right' && vertical === 'bottom',
      'slds-nubbin_bottom': horizontal === 'center' && vertical === 'bottom',
      'slds-nubbin_top': horizontal === 'center' && vertical === 'top',
      'slds-nubbin_left': horizontal === 'left' && vertical === 'center',
      'slds-nubbin_right': horizontal === 'right' && vertical === 'center'
    });
    return classes.toString();
  }
  handleMouseLeave() {
    if (!this.disableVisibilityChangeOnLeave) {
      this.visible = false;
    }
  }
  /*LWC compiler v9.5.3*/
}
registerDecorators(LightningPrimitiveBubble, {
  publicProps: {
    disableVisibilityChangeOnLeave: {
      config: 0
    },
    contentId: {
      config: 3
    },
    content: {
      config: 3
    },
    align: {
      config: 3
    },
    visible: {
      config: 3
    }
  },
  track: {
    state: 1
  },
  fields: ["divEl"]
});
const __lwc_component_class_internal$b = registerComponent(LightningPrimitiveBubble, {
  tmpl: _tmpl$7,
  sel: "lightning-primitive-bubble",
  apiVersion: 66
});

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const screenReaderOnlyStyles = `
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
`;
let microtaskQueued = false;
const queue = [];
function flushQueue() {
  const sortedQueue = [...queue].sort((a, b) => a.priority - b.priority);
  queue.length = 0;
  microtaskQueued = false;
  sortedQueue.forEach(({
    callback
  }) => callback());
}
function queueMicrotaskWithPriority(priority, callback) {
  queue.push({
    callback,
    priority
  });
  if (microtaskQueued) {
    return;
  }
  microtaskQueued = true;
  Promise.resolve().then(flushQueue);
}
function getChildNodesIgnoringShadowRoot(node) {
  if (node.shadowRoot) {
    return node.shadowRoot.childNodes;
  } else if (typeof node.assignedNodes === 'function') {
    const assigned = node.assignedNodes();
    return assigned.length ? assigned : node.childNodes;
  }
  return node.childNodes;
}
function getParentIgnoringShadowRoot(element) {
  if (typeof element.assignedNodes !== 'function' && element.assignedSlot && element.assignedSlot.parentElement) {
    return element.assignedSlot.parentElement;
  }
  if (element.parentElement) {
    return element.parentElement;
  }
  const rootNode = element.getRootNode();
  if (rootNode !== document) {
    return rootNode.host;
  }
  return null;
}
function isAncestor(node, possibleAncestor) {
  let ancestor = node;
  while (ancestor !== null && ancestor !== undefined) {
    ancestor = getParentIgnoringShadowRoot(ancestor);
    if (ancestor === possibleAncestor) {
      return true;
    }
  }
  return false;
}
class DeepMutationObserver {
  constructor(rootNode) {
    this._observers = [];
    this._callbacks = [];
    const observedNodes = [];
    const alreadyObserved = node => {
      return observedNodes.some(otherNode => otherNode.contains(node));
    };
    const observe = node => {
      if (!alreadyObserved(node)) {
        observedNodes.push(node);
        const observer = new MutationObserver(() => this._mutationCallback());
        observer.observe(node, {
          subtree: true,
          attributes: true,
          childList: true,
          characterData: true
        });
        this._observers.push(observer);
      }
      getChildNodesIgnoringShadowRoot(node).forEach(child => observe(child));
    };
    observe(rootNode);
  }
  onMutation(callback) {
    this._callbacks.push(callback);
  }
  _mutationCallback() {
    queueMicrotaskWithPriority(0, () => this._callbacks.forEach(callback => callback()));
  }
  disconnect() {
    this._observers.forEach(observer => observer.disconnect());
    this._observers = undefined;
    this._callbacks = undefined;
  }
}
function collateTasks(tasks) {
  const mapOfFromRootsToTasks = new Map();
  tasks.forEach(task => {
    const {
      fromNode
    } = task;
    const fromRoot = fromNode.getRootNode();
    let collatedTask = mapOfFromRootsToTasks.get(fromRoot);
    if (!collatedTask) {
      collatedTask = {
        relationships: [],
        redundantChildNodes: new Set()
      };
      mapOfFromRootsToTasks.set(fromRoot, collatedTask);
    }
    collatedTask.relationships.push(task);
  });
  mapOfFromRootsToTasks.forEach(value => {
    const {
      relationships,
      redundantChildNodes
    } = value;
    const allToNodes = relationships.map(relationship => relationship.toNodes).flat();
    for (let i = 0; i < allToNodes.length; i++) {
      for (let j = i + 1; j < allToNodes.length; j++) {
        const toNodeA = allToNodes[i];
        const toNodeB = allToNodes[j];
        if (toNodeA && toNodeB && i !== j) {
          if (isAncestor(toNodeA, toNodeB)) {
            redundantChildNodes.add(toNodeA);
          } else if (isAncestor(toNodeB, toNodeA)) {
            redundantChildNodes.add(toNodeB);
          }
        }
      }
    }
  });
  return mapOfFromRootsToTasks;
}
function getAttributes(node) {
  const res = {};
  const {
    attributes
  } = node;
  for (let i = 0; i < attributes.length; i++) {
    const attribute = attributes[i];
    res[attribute.name] = attribute.value;
  }
  return res;
}
const stableIds = new WeakMap();
function generateId() {
  return 'shadow-aria-' + Math.floor(Math.random() * 1000000000).toString(16);
}
function getStableId(referenceNode) {
  let id = stableIds.get(referenceNode);
  if (!id) {
    id = generateId();
    stableIds.set(referenceNode, id);
  }
  return id;
}
const TABBABLE_TAG_NAMES = new Set(['a', 'audio', 'button', 'details', 'input', 'select', 'summary', 'textarea', 'video']);
function redirectEvents(fromNode, toNode) {
  if (fromNode && toNode) {
    redirectFocusEvent(fromNode, toNode);
  }
}
function redirectFocusEvent(fromNode, toNode) {
  fromNode.addEventListener('focus', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    toNode.dispatchEvent(new event.constructor(event.type, event));
    toNode.focus();
  });
}
const STYLE_PROPS_TO_MIRROR = ['display', 'visibility'];
function mirrorNode(node, existingNode) {
  if (node.nodeType === Node.TEXT_NODE) {
    if (existingNode && existingNode.nodeType === Node.TEXT_NODE) {
      if (existingNode.textContent !== node.textContent) {
        existingNode.textContent = node.textContent;
      }
      return existingNode;
    }
    return node.cloneNode();
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return document.createComment('shadow-aria-deleted');
  }
  let {
    tagName
  } = node;
  if (['style', 'link', 'script'].includes(tagName.toLowerCase())) {
    return document.createComment('shadow-aria-deleted');
  }
  if (tagName.includes('-') || tagName.toLowerCase() === 'slot') {
    tagName = 'div';
  }
  let oldAttributes;
  let mirroredNode;
  if (existingNode && existingNode.nodeType === Node.ELEMENT_NODE && existingNode.tagName.toLowerCase() === tagName.toLowerCase()) {
    mirroredNode = existingNode;
    oldAttributes = getAttributes(mirroredNode);
  } else {
    mirroredNode = document.createElement(tagName);
  }
  const newAttributes = Object.fromEntries([...Object.entries(getAttributes(node))].filter(([name]) => name.toLowerCase().startsWith('aria-') || name.toLowerCase() === 'role'));
  const computedStyle = getComputedStyle(node);
  let newStyle = '';
  STYLE_PROPS_TO_MIRROR.forEach(prop => newStyle += `${prop}:${computedStyle[prop]};`);
  if (computedStyle?.display !== 'contents') {
    newAttributes.id = getStableId(node);
  }
  newAttributes.style = newStyle;
  if (TABBABLE_TAG_NAMES.has(tagName.toLowerCase())) {
    newAttributes.tabindex = '-1';
  }
  Object.entries(newAttributes).forEach(([name, value]) => {
    if (!oldAttributes || oldAttributes[name] !== value) {
      mirroredNode.setAttribute(name, value);
    }
  });
  if (oldAttributes) {
    Object.keys(oldAttributes).forEach(name => {
      if (!(name in newAttributes)) {
        mirroredNode.removeAttribute(name);
      }
    });
  }
  redirectEvents(mirroredNode, node);
  return mirroredNode;
}
function patchMirrorDomTree(root, existingRoot, trackedNodes) {
  const trackedNodesToMirroredNodes = new Map();
  const mirrorNodeRecursive = (node, existingNode) => {
    const mirroredNode = mirrorNode(node, existingNode);
    if (mirroredNode.nodeType === Node.COMMENT_NODE) {
      return mirroredNode;
    }
    if (trackedNodes.has(node)) {
      trackedNodesToMirroredNodes.set(node, mirroredNode);
    }
    const childNodes = getChildNodesIgnoringShadowRoot(node);
    if (existingNode && existingNode.childNodes.length === childNodes.length) {
      for (let i = 0; i < childNodes.length; i++) {
        const existingChild = existingNode.childNodes[i];
        const child = childNodes[i];
        const newChild = mirrorNodeRecursive(child, existingChild);
        if (newChild !== existingChild) {
          existingNode.replaceChild(newChild, existingChild);
        }
      }
    } else {
      if (existingNode) {
        while (existingNode.childNodes.length) {
          existingNode.childNodes[existingNode.childNodes.length - 1].remove();
        }
      }
      childNodes.forEach(childNode => {
        const mirrorChild = mirrorNodeRecursive(childNode, null);
        mirroredNode.appendChild(mirrorChild);
      });
    }
    return mirroredNode;
  };
  const mirroredDomTree = mirrorNodeRecursive(root, existingRoot);
  return {
    mirroredNode: mirroredDomTree,
    trackedNodesToMirroredNodes
  };
}
function updateAttribute(fromNode, toNodes, relationship) {
  const newIds = toNodes.map(toNode => toNode.getAttribute('id'));
  const existingIds = splitIds$1(fromNode.getAttribute(relationship));
  const linkedNodeIds = newIds.filter(newId => !existingIds.includes(newId));
  const unlinkedNodeIds = existingIds.filter(existingId => !newIds.includes(existingId));
  fromNode.setAttribute(relationship, newIds.join(' '));
  return {
    linkedNodeIds,
    unlinkedNodeIds
  };
}
function splitIds$1(ids) {
  if (!ids) {
    return [];
  }
  return ids.trim().split(/\s+/);
}
const SINGLE_TARGET_ARIA_RELATIONSHIPS = ['aria-activedescendant', 'aria-errormessage'];
const mirroredEnvironments = new WeakMap();
const taskQueue = [];
function processTask(fromRoot, task) {
  const mirroredEnvironment = getMirroredEnvironment(fromRoot);
  mirrorNodes(mirroredEnvironment, task);
  linkAndObserveNodes(mirroredEnvironment, task);
}
function getMirroredEnvironment(fromRoot) {
  let mirroredEnvironment = mirroredEnvironments.get(fromRoot);
  if (!mirroredEnvironment) {
    const mirrorRoot = document.createElement('div');
    mirrorRoot.setAttribute('class', 'aria-element-reflection-mirror');
    mirrorRoot.setAttribute('style', screenReaderOnlyStyles);
    const fromAnchorRoot = fromRoot.body || fromRoot;
    fromAnchorRoot.appendChild(mirrorRoot);
    mirroredEnvironment = {
      redundantChildNodes: new Set(),
      nodesToMirroredNodes: new Map(),
      mirrorRoot
    };
    mirroredEnvironments.set(fromRoot, mirroredEnvironment);
  }
  return mirroredEnvironment;
}
function mirrorNodes(mirroredEnvironment, task) {
  const {
    redundantChildNodes,
    nodesToMirroredNodes,
    mirrorRoot
  } = mirroredEnvironment;
  task.redundantChildNodes.forEach(node => redundantChildNodes.add(node));
  const rootToNodes = new Set(task.relationships.map(({
    toNodes
  }) => toNodes).flat().filter(Boolean).filter(_ => !redundantChildNodes.has(_)));
  rootToNodes.forEach(toNode => {
    const trackedNodes = new Set([...redundantChildNodes, toNode]);
    const {
      node: existingMirroredNode = null,
      usage = 0
    } = nodesToMirroredNodes.get(toNode) || {};
    const {
      mirroredNode,
      trackedNodesToMirroredNodes
    } = patchMirrorDomTree(toNode, existingMirroredNode, trackedNodes);
    if (mirroredNode !== existingMirroredNode) {
      if (existingMirroredNode) {
        mirrorRoot.removeChild(existingMirroredNode);
      }
      mirrorRoot.appendChild(mirroredNode);
    }
    trackedNodesToMirroredNodes.forEach((trackedMirroredNode, trackedNode) => nodesToMirroredNodes.set(trackedNode, {
      node: trackedMirroredNode,
      usage
    }));
  });
}
function linkAndObserveNodes(mirroredEnvironment, task) {
  const {
    nodesToMirroredNodes
  } = mirroredEnvironment;
  task.relationships.forEach(collatedRelationship => {
    const {
      fromNode,
      toNodes,
      relationship,
      track,
      signal,
      mirrorOnly
    } = collatedRelationship;
    if (toNodes?.length) {
      if (!mirrorOnly) {
        const mirroredNodes = toNodes.map(toNode => nodesToMirroredNodes.get(toNode).node);
        const {
          linkedNodeIds,
          unlinkedNodeIds
        } = updateAttribute(fromNode, mirroredNodes, relationship);
        updateNodeUsage(mirroredEnvironment, unlinkedNodeIds, linkedNodeIds);
        if (track) {
          observeNode(fromNode, toNodes, signal);
        }
      }
    } else {
      const {
        unlinkedNodeIds
      } = updateAttribute(fromNode, [], relationship);
      updateNodeUsage(mirroredEnvironment, unlinkedNodeIds);
      fromNode.removeAttribute(relationship);
    }
  });
}
function updateNodeUsage(mirroredEnvironment, unlinkedNodes, linkedNodes = []) {
  const {
    nodesToMirroredNodes,
    mirrorRoot
  } = mirroredEnvironment;
  nodesToMirroredNodes.forEach((mirroredNode, node) => {
    if (linkedNodes.includes(mirroredNode.node.id)) {
      mirroredNode.usage++;
    } else if (unlinkedNodes.includes(mirroredNode.node.id) && --mirroredNode.usage <= 0) {
      nodesToMirroredNodes.delete(node);
      if (mirroredNode.node.parentElement === mirrorRoot) {
        mirrorRoot.removeChild(mirroredNode.node);
      }
    }
  });
}
function observeNode(fromNode, toNodes, signal) {
  toNodes.forEach(toNode => {
    const mutationObserver = new DeepMutationObserver(toNode);
    mutationObserver.onMutation(() => {
      updateAriaRelationship(fromNode, [toNode]);
    });
    if (signal) {
      signal.addEventListener('abort', () => {
        mutationObserver.disconnect();
      });
    }
  });
}
function processQueue() {
  const mapOfFromRootsToTasks = collateTasks(taskQueue);
  taskQueue.length = 0;
  mapOfFromRootsToTasks.forEach((task, fromRoot) => processTask(fromRoot, task));
}
function updateAriaRelationship(fromNode, toNodes) {
  queueTask({
    fromNode,
    toNodes,
    mirrorOnly: true
  });
}
function queueTask(task) {
  taskQueue.push(task);
  queueMicrotaskWithPriority(1, processQueue);
}
function massageToNodes(toNodes, relationship) {
  if (!Array.isArray(toNodes)) {
    toNodes = [toNodes];
  }
  toNodes = toNodes.filter(Boolean);
  if (toNodes.length > 1 && SINGLE_TARGET_ARIA_RELATIONSHIPS.includes(relationship)) {
    console.warn(`Multiple targets passed to aria relationship "${relationship}". ` + 'This API only accepts a single target. Ignoring elements beyond the first one.');
    toNodes = toNodes.slice(0, 1);
  }
  return toNodes;
}
function setAriaRelationship(fromNode, toNodes, relationship, options = {}) {
  const {
    track,
    signal
  } = options;
  toNodes = massageToNodes(toNodes, relationship);
  queueTask({
    fromNode,
    toNodes,
    relationship,
    track,
    signal
  });
}
function setAriaActiveDescendant(fromNode, toNodes, options) {
  setAriaRelationship(fromNode, toNodes, 'aria-activedescendant', options);
}
function setAriaControls(fromNode, toNodes, options) {
  setAriaRelationship(fromNode, toNodes, 'aria-controls', options);
}
function setAriaDescribedBy(fromNode, toNodes, options) {
  setAriaRelationship(fromNode, toNodes, 'aria-describedby', options);
}
function setAriaDetails(fromNode, toNodes, options) {
  setAriaRelationship(fromNode, toNodes, 'aria-details', options);
}
function setAriaErrorMessage(fromNode, toNodes, options) {
  setAriaRelationship(fromNode, toNodes, 'aria-errormessage', options);
}
function setAriaLabelledBy(fromNode, toNodes, options) {
  setAriaRelationship(fromNode, toNodes, 'aria-labelledby', options);
}

const SUPPORTED_ATTRIBUTES_ARRAY = [['aria-controls', {
  ariaReflection: 'ariaControlsElements',
  polyfill: setAriaControls
}], ['aria-labelledby', {
  ariaReflection: 'ariaLabelledByElements',
  polyfill: setAriaLabelledBy
}], ['aria-describedby', {
  ariaReflection: 'ariaDescribedByElements',
  polyfill: setAriaDescribedBy
}], ['aria-errormessage', {
  ariaReflection: 'ariaErrorMessageElements',
  polyfill: setAriaErrorMessage
}], ['aria-activedescendant', {
  ariaReflection: 'ariaActiveDescendantElement',
  polyfill: setAriaActiveDescendant
}], ['aria-details', {
  ariaReflection: 'ariaDetailsElements',
  polyfill: setAriaDetails
}]];
const SUPPORTED_ATTRIBUTES_MAP = new Map(SUPPORTED_ATTRIBUTES_ARRAY);
let BROWSER_SUPPORTS_ARIA_ELEMENT_REFLECTION;
if (!import.meta.env.SSR) {
  BROWSER_SUPPORTS_ARIA_ELEMENT_REFLECTION = [...SUPPORTED_ATTRIBUTES_MAP.values()].every(({
    ariaReflection
  }) => ariaReflection in Element.prototype);
}
function extractElements(root, ids) {
  if (typeof ids !== 'string' || ids === '') {
    return [];
  }
  return splitIds(ids).map(id => root.querySelector(`[id*="${id}"]`)).filter(el => !!el);
}
function splitIds(ids) {
  return ids ? (ids + '').trim().split(/\s+/) : [];
}
class AriaObserver {
  constructor(component) {
    this.component = void 0;
    this.template = void 0;
    this.isNativeShadow = void 0;
    this.state = void 0;
    this.liveIds = void 0;
    this.guid = void 0;
    this.placeholderContainer = void 0;
    this.ariaReflectionMap = void 0;
    this.nodeMap = void 0;
    this._root = void 0;
    this.mo = void 0;
    this.component = component;
    this.template = component.template;
    this.isNativeShadow = isNativeComponent(component);
    this.state = {};
    this.liveIds = {};
    this.guid = guid();
    this.placeholderContainer = null;
    this.ariaReflectionMap = new Map();
    this.nodeMap = new Map();
  }
  connectLiveIdRef(refs, callback) {
    const selector = (refs + '').trim().split(/\s+/).map(ref => `[id*="${ref}"]`).join(',');
    let liveId;
    if (this.liveIds[refs]) {
      this.liveIds[refs].callbacks.push(callback);
    } else {
      liveId = {
        refs,
        selector,
        callbacks: [callback]
      };
      this.liveIds[refs] = liveId;
    }
  }
  connect({
    attribute,
    targetSelector,
    targetNode,
    relatedNodeIds,
    relatedNodes
  }) {
    this.state[attribute] = this.state[attribute] || {};
    const attrState = this.state[attribute];
    attrState.targetNode = targetNode;
    attrState.targetSelector = targetSelector;
    attrState.relatedNodes = (!Array.isArray(relatedNodes) ? [relatedNodes] : relatedNodes).filter(Boolean);
    attrState.relatedNodeIds = Array.isArray(relatedNodeIds) ? relatedNodeIds.join(' ') : relatedNodeIds;
    if (this.component.isConnected) {
      this.privateUpdate(attribute);
    }
  }
  sync(isNativeShadow) {
    if (isNativeShadow != null) {
      this.isNativeShadow = isNativeShadow;
    }
    if (!this.component.isConnected) {
      throw new Error(`Invalid sync invocation. It can only be invoked during renderedCallback().`);
    }
    if (!this.root) {
      this.root = this.template && this.template.host ? this.template.host.getRootNode() : null;
    }
    this.privateUpdateLiveIds();
    for (const attrName in this.state) {
      if (Object.prototype.hasOwnProperty.call(this.state, attrName)) {
        this.privateUpdate(attrName);
      }
    }
  }
  get privateIsMoRequired() {
    return this.isNativeShadow || Object.keys(this.liveIds).length !== 0;
  }
  get root() {
    return this._root;
  }
  set root(root) {
    this._root = root;
    if (this._root && this.privateIsMoRequired) {
      this.privateCreateMutationObserver();
    }
  }
  privateUpdate(attrName) {
    const {
      targetSelector,
      targetNode = this.template.querySelector(targetSelector),
      relatedNodeIds,
      relatedNodes
    } = this.state[attrName];
    if (!targetNode) {
      return;
    }
    const attribute = SUPPORTED_ATTRIBUTES_MAP.get(attrName);
    if (!attribute) {
      throw new Error(`${attrName} is not supported by AriaObserver. Supported attributes: ${Array.from(SUPPORTED_ATTRIBUTES_MAP.keys())}`);
    }
    if (this.isNativeShadow) {
      const allRelatedNodes = [...relatedNodes, ...extractElements(this.root, relatedNodeIds)];
      if (BROWSER_SUPPORTS_ARIA_ELEMENT_REFLECTION) {
        if (features.enableMobileGroupedCbAriaUpdates && attrName === 'aria-activedescendant') {
          const elem = relatedNodes?.length > 0 ? relatedNodes[0] : null;
          targetNode[attribute.ariaReflection] = elem;
        } else {
          targetNode[attribute.ariaReflection] = relatedNodes;
        }
      } else {
        attribute.polyfill(targetNode, allRelatedNodes, attrName);
      }
      const rootNode = targetNode.getRootNode();
      for (let i = 0; i < allRelatedNodes.length; i++) {
        this.privateAddNestedReferences(rootNode, allRelatedNodes[i]);
      }
    } else {
      const attributeValue = [...splitIds(relatedNodeIds), ...relatedNodes.map(n => n.id)].join(' ');
      if (attributeValue) {
        targetNode.setAttribute(attrName, attributeValue);
      } else {
        targetNode.removeAttribute(attrName);
      }
    }
  }
  privateExtractCorrectElements(selector = '', elements) {
    const selectors = selector.split(/\s/g);
    const matchSelectors = `(${selectors.join('|')})`;
    const regex = new RegExp(`^${matchSelectors}(-[0-9]+)$`);
    return [...elements].filter(element => {
      return regex.test(element.id);
    });
  }
  privateCreateMutationObserver() {
    this.disconnect();
    this.mo = new MutationObserver(() => {
      if (!this.component.isConnected) {
        return;
      }
      this.sync();
    });
    this.mo.observe(this.root, {
      characterData: true,
      childList: true,
      subtree: true
    });
  }
  privateExtractIds(elements) {
    return elements.map(el => {
      return el.getAttribute('id');
    }).join(' ');
  }
  privateUpdateLiveIds() {
    const root = this.template && this.template.host ? this.template.host.getRootNode() : null;
    if (!root) {
      return;
    }
    for (const liveId in this.liveIds) {
      if (Object.prototype.hasOwnProperty.call(this.liveIds, liveId)) {
        const thisId = this.liveIds[liveId];
        if (!thisId.elements || !thisId.elements.length) {
          const splitRefIds = splitIds(liveId);
          try {
            const refElements = Array.from(root.querySelectorAll(thisId.selector));
            thisId.elements = refElements.sort((a, b) => {
              const idA = a.getAttribute('id')?.replace(/-[0-9]+$/g, '');
              const idB = b.getAttribute('id')?.replace(/-[0-9]+$/g, '');
              return splitRefIds.indexOf(idA) - splitRefIds.indexOf(idB);
            });
          } catch (error) {
            if (error instanceof DOMException) {
              console.warn(`lightning/ariaObserver could not find elements to connect live IDs due to an invalid id selector.\n\n${error.message}`);
            }
            return;
          }
        }
        const newThisId = this.privateExtractCorrectElements(thisId.refs, thisId.elements);
        const newIds = this.privateExtractIds(newThisId);
        if (newIds.length && newIds !== thisId.ids) {
          for (let i = 0; i < thisId.callbacks.length; i++) {
            thisId.callbacks[i](newIds);
          }
          thisId.ids = newIds;
        }
      }
    }
  }
  privateAddNestedReferences(rootNode, relatedNode) {
    for (let i = 0; i < SUPPORTED_ATTRIBUTES_ARRAY.length; i++) {
      const [attrName, {
        polyfill
      }] = SUPPORTED_ATTRIBUTES_ARRAY[i];
      const attrValue = relatedNode.getAttribute(attrName);
      if (attrValue) {
        let mirroredNode = this.nodeMap.get(relatedNode);
        if (!mirroredNode) {
          let ariaReflection = this.ariaReflectionMap.get(rootNode);
          if (!ariaReflection) {
            ariaReflection = rootNode.querySelector('.aria-element-reflection-mirror');
            this.ariaReflectionMap.set(rootNode, ariaReflection);
          }
          if (ariaReflection) {
            mirroredNode = ariaReflection.querySelector(`[${attrName}='${attrValue}']`);
            this.nodeMap.set(relatedNode, mirroredNode);
          }
        }
        if (mirroredNode) {
          const nestedReferenceNodes = extractElements(this.root, attrValue);
          polyfill(mirroredNode, nestedReferenceNodes, attrName);
        }
      }
    }
  }
  disconnect() {
    if (this.mo) {
      this.mo.disconnect();
      this.mo = undefined;
    }
  }
}
const __lwc_component_class_internal$a = registerComponent(AriaObserver, {
  tmpl: _tmpl$8,
  sel: "lightning-aria-observer",
  apiVersion: 66
});

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const BUBBLE_PREFIX = `salesforce-lightning-tooltip-bubble`;
const BUBBLE_MODAL_PREFIX = `salesforce-lightning-tooltip-modal-portal`;
const BUBBLE_GUID = guid();
const BUBBLE_ID = `${BUBBLE_PREFIX}_${BUBBLE_GUID}`;
const BUBBLE_MODAL_ID = `${BUBBLE_MODAL_PREFIX}_${BUBBLE_GUID}`;
function isResizeObserverSupported() {
  return window.ResizeObserver != null;
}
let CACHED_BUBBLE_ELEMENT;
let activeTooltip;
function getCachedBubbleElement() {
  if (!CACHED_BUBBLE_ELEMENT) {
    CACHED_BUBBLE_ELEMENT = createElement('lightning-primitive-bubble', {
      is: __lwc_component_class_internal$b
    });
    CACHED_BUBBLE_ELEMENT.contentId = BUBBLE_ID;
    CACHED_BUBBLE_ELEMENT.contentModalPortalId = features.enableHelptextA11yInModal ? BUBBLE_MODAL_ID : undefined;
    CACHED_BUBBLE_ELEMENT.style.position = 'absolute';
    CACHED_BUBBLE_ELEMENT.style.minWidth = '75px';
    CACHED_BUBBLE_ELEMENT.disableVisibilityChangeOnLeave = true;
  }
  return CACHED_BUBBLE_ELEMENT;
}
const ARIA_DESCRIBEDBY = 'aria-describedby';
const MODAL_SELECTOR = '[data-modal][aria-modal="true"]';
const MODAL_TOOLTIP_PORTAL_SELECTOR = '[data-modal-tooltip-portal]';
const BUBBLE_BODY_SELECTOR = '.slds-popover__body';
function findTooltipPortalElement(target) {
  if (import.meta.env.SSR || !target) {
    return null;
  }
  const dialog = target.closest?.(MODAL_SELECTOR);
  const HTMLElementCtor = globalThis?.HTMLElement;
  if (!dialog || !HTMLElementCtor || !(dialog instanceof HTMLElementCtor)) {
    return null;
  }
  return dialog.querySelector?.(MODAL_TOOLTIP_PORTAL_SELECTOR);
}
const NUBBIN_SIZE = 16;
const NUBBIN_OFFSET = 24;
const TooltipType = {
  Info: 'info',
  Toggle: 'toggle'
};
class Tooltip {
  constructor(value, config) {
    this._autoPosition = null;
    this._disabled = true;
    this._initialized = false;
    this._visible = false;
    this._isFocusEvent = false;
    this._initialResize = true;
    this._ariaObserver = null;
    this._resizeObserver = void 0;
    this._config = {};
    this._value = '';
    this._root = void 0;
    this._target = void 0;
    this._element = void 0;
    this._type = void 0;
    this.boundHandleTooltipMouseLeave = void 0;
    this._modalPortalElement = null;
    this._isTooltipInModal = false;
    this._handleTooltipMouseLeave = event => {
      if (!this._visible) {
        return;
      }
      if (event instanceof MouseEvent && event.clientX && event.clientY) {
        try {
          const target = this._target();
          if (target) {
            const {
              clientX,
              clientY
            } = event;
            const {
              left,
              right,
              top,
              bottom
            } = target.getBoundingClientRect();
            const tolerance = 1;
            if (clientX >= left - tolerance && clientX <= right + tolerance && clientY >= top - tolerance && clientY <= bottom + tolerance) {
              return;
            }
          }
        } catch (ex) {}
      }
      this.hide();
    };
    assert(!!config.target, 'target for tooltip is undefined or missing');
    this.value = value;
    this._root = config.root;
    this._target = config.target;
    this._config = {
      ...config
    };
    this._config.align = config.align || {};
    this._config.targetAlign = config.targetAlign || {};
    this._config.disableAriaDescribedBy = config.disableAriaDescribedBy || false;
    this._type = normalizeString(config.type, {
      fallbackValue: TooltipType.Info,
      validValues: Object.values(TooltipType)
    });
    this._element = config.element;
    if (!import.meta.env.SSR && !this._element) {
      this._element = getCachedBubbleElement;
      const bubbleElement = getCachedBubbleElement();
      if (bubbleElement.parentNode === null) {
        document.body.appendChild(bubbleElement);
      }
    }
    this.handleDocumentTouch = this.handleDocumentTouch.bind(this);
    this.handleEscape = this.handleEscape.bind(this);
    this.hide = this.hide.bind(this);
    if (features.enableTooltipFlashingFix) {
      this.boundHandleTooltipMouseLeave = this._handleTooltipMouseLeave.bind(this);
    }
  }
  detach() {
    this._disabled = true;
  }
  attach() {
    this._disabled = false;
  }
  initialize() {
    const target = this._target();
    if (!this._initialized && target) {
      switch (this._type) {
        case TooltipType.Toggle:
          this.addToggleListeners();
          break;
        case TooltipType.Info:
        default:
          this.addInfoListeners();
          break;
      }
      if (!this._config.disableAriaDescribedBy) {
        this._ariaObserver = new __lwc_component_class_internal$a(this._root);
        this._ariaObserver.connect({
          attribute: ARIA_DESCRIBEDBY,
          targetNode: this._target(),
          relatedNodes: this._element()
        });
      }
      this._initialized = true;
    }
  }
  getDescriptionElement() {
    const {
      _modalPortalElement,
      _isTooltipInModal
    } = this;
    return features.enableHelptextA11yInModal && _isTooltipInModal && _modalPortalElement ? _modalPortalElement : this._element();
  }
  disconnect() {
    if (this._ariaObserver) {
      this._ariaObserver.disconnect();
    }
    this._modalPortalElement = null;
    this._isTooltipInModal = false;
    if (this._visible) {
      this.hide();
    }
  }
  addInfoListeners() {
    const target = this._target();
    if (!this._initialized && target) {
      ['mouseenter', 'focus'].forEach(name => target.addEventListener(name, () => this.show()));
      ['mouseleave', 'blur', 'click', 'keydown'].forEach(name => target.addEventListener(name, event => {
        if (!this._visible) {
          return;
        }
        this.hideIfNotSelfCover(event);
        if (event.key === 'Escape') {
          event.stopPropagation();
        }
      }));
    }
  }
  hideIfNotSelfCover(event) {
    if (!this._visible) {
      return;
    }
    const tooltip = this._element();
    if (event.type === 'mouseleave' && event instanceof MouseEvent && event.clientX && event.clientY) {
      try {
        const yOffset = tooltip.align.vertical === 'top' ? 1 : 0;
        const elementMouseIsOver = document.elementFromPoint ? document.elementFromPoint(event.clientX, event.clientY + yOffset) : null;
        if (elementMouseIsOver === this._element()) {
          if (!isResizeObserverSupported()) {
            this.startPositioning();
          }
          return;
        }
      } catch (ex) {}
    }
    this.hide();
  }
  handleDocumentTouch() {
    if (this._visible) {
      this.hide();
    }
  }
  addToggleListeners() {
    const target = this._target();
    if (!this._initialized && target) {
      target.addEventListener('touchstart', e => {
        e.stopPropagation();
        this.toggle();
      });
      ['mouseenter', 'focus'].forEach(eventName => target.addEventListener(eventName, event => this.show(event)));
      ['mouseleave', 'blur'].forEach(eventName => target.addEventListener(eventName, event => this.hideIfNotSelfCover(event)));
      target.addEventListener('keydown', event => {
        if (event.key === 'Escape' && this._visible) {
          this.hideIfNotSelfCover(event);
          event.stopPropagation();
        }
      });
    }
  }
  handleEscape(e) {
    if (features.enableTooltipHoverDismiss && e.key === 'Escape') {
      e.stopPropagation();
      this.hideIfNotSelfCover(e);
    } else if (e.key === 'Escape' && this._isFocusEvent) {
      e.stopPropagation();
      this.hideIfNotSelfCover(e);
    }
  }
  get resizeObserver() {
    if (!this._resizeObserver) {
      this._resizeObserver = this._buildResizeObserver(() => {
        if (this._visible && this._autoPosition) {
          const tooltip = this._element();
          if (!features.enableTooltipHoverDismiss && activeTooltip !== this || features.enableTooltipHoverDismiss && getActiveTooltip() !== this) {
            this.hide(false);
            return;
          }
          this.startPositioning().then(() => {
            if (this._initialResize) {
              if (features.enableTooltipFlashingFix) {
                tooltip.addEventListener('mouseleave', this.boundHandleTooltipMouseLeave);
              } else {
                tooltip.addEventListener('mouseleave', this.hide);
              }
              this._initialResize = false;
            }
          }).catch(() => {});
        }
      });
    }
    return this._resizeObserver;
  }
  show(ev) {
    if (this._disabled || this._visible) {
      return;
    }
    const currentActiveTooltip = features.enableTooltipHoverDismiss ? getActiveTooltip() : activeTooltip;
    if (currentActiveTooltip && currentActiveTooltip !== this && currentActiveTooltip._visible) {
      currentActiveTooltip.hide(false);
    }
    if (features.enableTooltipHoverDismiss) {
      setActiveTooltip(this);
    } else {
      const that = this;
      activeTooltip = that;
    }
    this._isFocusEvent = ev && (ev.type === 'focus' ? true : false);
    this._visible = true;
    this._initialResize = true;
    const tooltip = this._element();
    const target = this._target();
    tooltip.visible = this._visible;
    const {
      _value
    } = this;
    tooltip.content = _value;
    if (!import.meta.env.SSR && target && features.enableHelptextA11yInModal) {
      this._modalPortalElement = null;
      const portal = findTooltipPortalElement(target);
      if (portal?.isConnected) {
        this._modalPortalElement = portal;
        this._isTooltipInModal = true;
        portal.textContent = '';
        portal.setAttribute('id', tooltip.contentModalPortalId);
        portal.removeAttribute('aria-hidden');
        const bubbleBody = tooltip.shadowRoot?.querySelector(BUBBLE_BODY_SELECTOR);
        if (bubbleBody) {
          bubbleBody.setAttribute('aria-hidden', 'true');
        }
        portal.textContent = _value;
      }
    }
    if (this._ariaObserver && this._root && this._root.isConnected) {
      if (features.enableHelptextA11yInModal) {
        this._ariaObserver.connect({
          attribute: ARIA_DESCRIBEDBY,
          targetNode: this._target(),
          relatedNodes: this.getDescriptionElement()
        });
      }
      this._ariaObserver.sync();
    }
    this.startPositioning();
    document.addEventListener('keydown', this.handleEscape);
    document.addEventListener('touchstart', this.handleDocumentTouch);
    this.resizeObserver.observe(tooltip);
  }
  hide(hideBubble = true) {
    this._visible = false;
    const tooltip = this._element();
    const {
      _isTooltipInModal,
      _modalPortalElement
    } = this;
    if (features.enableHelptextA11yInModal && _isTooltipInModal && _modalPortalElement) {
      const portal = _modalPortalElement;
      portal.setAttribute('aria-hidden', 'true');
      portal.removeAttribute('id');
      portal.textContent = '';
      const bubbleBody = tooltip.shadowRoot ? tooltip.shadowRoot.querySelector(BUBBLE_BODY_SELECTOR) : null;
      if (bubbleBody) {
        bubbleBody.removeAttribute('aria-hidden');
      }
      this._isTooltipInModal = false;
      this._modalPortalElement = null;
    }
    if (hideBubble) {
      tooltip.visible = this._visible;
    }
    this.stopPositioning();
    document.removeEventListener('touchstart', this.handleDocumentTouch);
    document.removeEventListener('keydown', this.handleEscape);
    if (features.enableTooltipFlashingFix) {
      tooltip.removeEventListener('mouseleave', this.boundHandleTooltipMouseLeave);
    } else {
      tooltip.removeEventListener('mouseleave', this.hide);
    }
    this.resizeObserver.unobserve(tooltip);
    if (features.enableTooltipHoverDismiss) {
      setActiveTooltip(null);
    } else {
      activeTooltip = null;
    }
  }
  toggle() {
    if (this._visible) {
      this.hide();
    } else {
      this.show();
    }
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
    this._disabled = !value;
  }
  get initialized() {
    return this._initialized;
  }
  get visible() {
    return this._visible;
  }
  startPositioning() {
    if (!this._autoPosition) {
      this._autoPosition = new AutoPosition(this._root);
    }
    const align = {
      horizontal: this._config.align.horizontal || Direction.Left,
      vertical: this._config.align.vertical || Direction.Bottom
    };
    const targetAlign = {
      horizontal: this._config.targetAlign.horizontal || Direction.Left,
      vertical: this._config.targetAlign.vertical || Direction.Top
    };
    const targetBox = this._target().getBoundingClientRect();
    const padLeft = targetBox.width * 0.5 - NUBBIN_OFFSET;
    return this._autoPosition.start({
      target: this._target,
      element: this._element,
      align,
      targetAlign,
      autoFlip: true,
      padTop: NUBBIN_SIZE,
      padLeft
    }).then(autoPositionUpdater => {
      if (autoPositionUpdater) {
        const tooltip = this._element();
        tooltip.align = autoPositionUpdater.config.align;
        tooltip.visible = this._visible;
      }
    });
  }
  stopPositioning() {
    if (this._autoPosition) {
      this._autoPosition.stop();
    }
  }
  _buildResizeObserver(callback) {
    if (isResizeObserverSupported()) {
      return new ResizeObserver(callback);
    }
    return {
      observe() {},
      disconnect() {},
      unobserve() {}
    };
  }
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
function findAllTabbableElements(container) {
  const result = [];
  traverseActiveTreeRecursively(container, element => {
    try {
      if (isTabbable({
        element: element,
        rootContainer: container
      })) {
        result.push(element);
      }
    } catch (e) {
      console.warn(e);
    }
  });
  return result;
}
function getElementWithFocus() {
  let currentFocusedElement = document.activeElement;
  while (currentFocusedElement) {
    if (currentFocusedElement.shadowRoot) {
      const nextFocusedElement = currentFocusedElement.shadowRoot.activeElement;
      if (nextFocusedElement) {
        currentFocusedElement = nextFocusedElement;
      } else {
        return currentFocusedElement;
      }
    } else if (currentFocusedElement.contentDocument) {
      const nextFocusedElement = currentFocusedElement.contentDocument.activeElement;
      if (nextFocusedElement) {
        currentFocusedElement = nextFocusedElement;
      } else {
        return currentFocusedElement;
      }
    } else {
      return currentFocusedElement;
    }
  }
  return undefined;
}
function returnFocusToElement(element) {
  const isSavedElemInDOM = document.body.contains(element);
  if (element) {
    if (isSavedElemInDOM) {
      element.focus();
      return true;
    }
    const isElementInDOM = isElementInDocument(element);
    if (isElementInDOM) {
      element.focus();
      return true;
    }
  }
  return false;
}
function isElementInDocument(element) {
  let currentElement = element;
  while (currentElement && currentElement.parentNode) {
    if (currentElement.parentNode === document) {
      return true;
    } else if (currentElement.parentNode instanceof DocumentFragment) {
      currentElement = currentElement.parentNode.host;
    } else {
      currentElement = currentElement.parentNode;
    }
  }
  return false;
}
function traverseActiveTreeRecursively(node, callback) {
  if (!node) {
    return;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.hasAttribute('inert')) {
      return;
    }
    if (isIframe(node)) {
      if (isIframeOfSameOrigin(node)) {
        traverseActiveTreeRecursively(node.contentDocument, callback);
      } else if (callback) {
        callback(node);
      }
      return;
    }
    if (callback) {
      callback(node);
    }
    if (node.shadowRoot) {
      traverseActiveTreeRecursively(node.shadowRoot, callback);
      return;
    }
    if (node.localName === 'slot') {
      const slottedNodes = node.assignedNodes({
        flatten: true
      });
      for (let i = 0; i < slottedNodes.length; i++) {
        traverseActiveTreeRecursively(slottedNodes[i], callback);
      }
      return;
    }
  }
  let child = node.firstChild;
  while (child !== null) {
    traverseActiveTreeRecursively(child, callback);
    child = child.nextSibling;
  }
}
function isIframe(node) {
  return node.tagName === 'IFRAME' || node instanceof HTMLIFrameElement;
}
function isIframeOfSameOrigin(iframe) {
  return !!iframe.contentDocument;
}
const ELEMENTS_WITH_DISABLED_ATTRIBUTE = ['button', 'select', 'textarea', 'input'];
const ELEMENTS_WITH_TABINDEX_ZERO_BY_DEFAULT = ['a', 'select', 'textarea', 'input', 'button', 'iframe', 'object', 'area', 'frame'];
function isTabbable({
  element,
  rootContainer
}) {
  const elementLocalName = element.localName;
  if (elementLocalName === 'input' && elementLocalName.type === 'hidden') {
    return false;
  }
  const tabIndexAttribute = element.getAttribute('tabindex');
  if (tabIndexAttribute === '-1') {
    return false;
  }
  if (element.disabled && ELEMENTS_WITH_DISABLED_ATTRIBUTE.includes(element.localName)) {
    return false;
  }
  const hasTabIndexZero = tabIndexAttribute === '0' || element.tabIndex === 0 && ELEMENTS_WITH_TABINDEX_ZERO_BY_DEFAULT.includes(element.localName);
  return hasTabIndexZero && isElementVisible(element) && isParentCustomElementTabbable({
    element,
    rootContainer
  });
}
function isElementVisible(element) {
  const {
    width,
    height
  } = element.getBoundingClientRect();
  const nonZeroSize = width > 0 || height > 0;
  return nonZeroSize && getComputedStyle(element).visibility !== 'hidden';
}
function isParentCustomElementTabbable({
  element,
  rootContainer
}) {
  const parentRoot = rootContainer.getRootNode();
  const ownerDocument = element.ownerDocument;
  let root = element.getRootNode();
  while (root !== parentRoot && root !== ownerDocument) {
    const host = root.host;
    if (host.getAttribute('tabindex') === '-1') {
      return false;
    }
    root = host && host.getRootNode();
  }
  return true;
}

class FocusTrap extends __lwc_component_class_internal$d {
  constructor(...args) {
    super(...args);
    this._startNode = void 0;
    this._endNode = void 0;
    this._focused = false;
    this._initialized = false;
    this._pendingFocusOut = false;
  }
  renderedCallback() {
    if (!this._initialized) {
      this._initialized = true;
      this._startNode = this.template.querySelector('[data-start]');
      this._endNode = this.template.querySelector('[data-end]');
    }
  }
  focus() {
    if (!this._focused) {
      this._focusFirstElement();
    }
  }
  get _bookendTabIndex() {
    return this._focused ? '0' : '-1';
  }
  _handleFocusIn() {
    if (this._pendingFocusOut) {
      this._pendingFocusOut = false;
    }
    this._focused = true;
  }
  _handleFocusOut() {
    this._pendingFocusOut = true;
    requestAnimationFrame(() => {
      if (this._pendingFocusOut) {
        this._focused = false;
      }
    });
  }
  _moveFocusTo(elementLocation) {
    const focusableElements = this._getFocusableElements();
    if (focusableElements.length > 0) {
      let node;
      if (elementLocation === 'last') {
        node = focusableElements[focusableElements.length - 1];
      } else if (elementLocation === 'first') {
        node = focusableElements[0];
      }
      node.focus();
    }
  }
  _focusFirstElement() {
    this._moveFocusTo('first');
  }
  _focusLastElement() {
    this._moveFocusTo('last');
  }
  _getFocusableElements() {
    return findAllTabbableElements(this.template.querySelector('slot'));
  }
  /*LWC compiler v9.5.3*/
}
registerDecorators(FocusTrap, {
  publicMethods: ["focus"],
  fields: ["_startNode", "_endNode", "_focused", "_initialized", "_pendingFocusOut"]
});
const __lwc_component_class_internal$9 = registerComponent(FocusTrap, {
  tmpl: _tmpl$a,
  sel: "lightning-focus-trap",
  apiVersion: 66
});

const $fragment1$3 = parseFragment`<div${"c0"} part="modal-backdrop" role="presentation" data-backdrop${2}></div>`;
const $fragment2$1 = parseFragment`<span${"a0:id"} class="slds-assistive-text${0}" data-aria-description${2}>${"t1"}</span>`;
const $fragment3$1 = parseFragment`<div${"c0"} part="modal-header"${2}><h1 tabindex="-1" class="slds-modal__title slds-hyphenate${0}"${"a1:id"} data-modal-heading${2}>${"t2"}</h1></div>`;
const $fragment4$1 = parseFragment`<button part="button" class="slds-button slds-button_neutral${0}" data-cancel-button${2}>${"t1"}</button>`;
const $fragment5 = parseFragment`<button part="button" class="slds-button slds-button_brand${0}" data-ok-button${2}>${"t1"}</button>`;
const stc0$5 = {
  key: 2
};
const stc1$1 = {
  classMap: {
    "slds-modal__container": true
  },
  key: 6
};
const stc2$1 = {
  "part": "modal-body",
  "data-slot": ""
};
const stc3$1 = {
  lwc: {
    dom: "manual"
  }
};
const stc4$1 = {
  classMap: {
    "slds-modal__footer": true,
    "slds-theme_default": true
  },
  attrs: {
    "part": "modal-footer"
  },
  key: 10
};
function tmpl$6($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment, b: api_bind, gid: api_scoped_id, d: api_dynamic_text, h: api_element, c: api_custom_element} = $api;
  const {_m0, _m1, _m2, _m3, _m4} = $ctx;
  return [api_static_fragment($fragment1$3, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.modalBackdropCssClasses)
  }, null)]), api_custom_element("lightning-focus-trap", __lwc_component_class_internal$9, stc0$5, [api_element("section", {
    className: api_normalize_class_name($cmp.computedModalCssClasses),
    attrs: {
      "role": $cmp.role,
      "tabindex": "-1",
      "aria-modal": "true",
      "part": "modal",
      "aria-label": $cmp.ariaLabel,
      "data-modal": ""
    },
    key: 3,
    on: _m0 || ($ctx._m0 = {
      "keydown": api_bind($cmp.handleModalKeyDown),
      "privateclose": api_bind($cmp.handlePrivateClose),
      "privatechildrender": api_bind($cmp.handlePrivateChildRender)
    })
  }, [$cmp.showAriaDescribedBy ? api_static_fragment($fragment2$1, 5, [api_static_part(0, {
    attrs: {
      "id": api_scoped_id("modal-description")
    }
  }, null), api_static_part(1, null, api_dynamic_text($cmp.description))]) : null, api_element("div", stc1$1, [$cmp.showHeader ? api_static_fragment($fragment3$1, 8, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedModalHeaderCssClasses)
  }, null), api_static_part(1, {
    attrs: {
      "id": api_scoped_id("prompt-heading-id")
    }
  }, null), api_static_part(2, null, api_dynamic_text($cmp.label))]) : null, api_element("div", {
    className: api_normalize_class_name($cmp.computedModalContentCssClasses),
    attrs: stc2$1,
    context: stc3$1,
    key: 9
  }), api_element("div", stc4$1, [!$cmp.hideCancel ? api_static_fragment($fragment4$1, 12, [api_static_part(0, {
    on: _m2 || ($ctx._m2 = {
      "click": api_bind($cmp.handleCloseClick)
    })
  }, null), api_static_part(1, null, api_dynamic_text($cmp.cancelText))]) : null, api_static_fragment($fragment5, 14, [api_static_part(0, {
    on: _m4 || ($ctx._m4 = {
      "click": api_bind($cmp.handleOkClick)
    })
  }, null), api_static_part(1, null, api_dynamic_text($cmp.okText))])])])])])];
  /*LWC compiler v9.5.3*/
}
var _tmpl$6 = registerTemplate(tmpl$6);
tmpl$6.stylesheets = [];
tmpl$6.stylesheetToken = "lwc-6jtsd8ngusp";
if (_implicitStylesheets$4) {
  tmpl$6.stylesheets.push.apply(tmpl$6.stylesheets, _implicitStylesheets$4);
}
freezeTemplate(tmpl$6);

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const parent = Symbol('parent');
const instanceName = Symbol('instanceName');
const secure = Symbol('secure event');
function normalizeStyle(style) {
  const props = {};
  if (typeof style === 'string') {
    const regex = /([\w-]*)\s*:\s*([^;]*)/g;
    let match;
    while (match = regex.exec(style)) {
      if (match[1].startsWith('--')) {
        props[match[1]] = match[2].trim();
      } else {
        console.warn(`Overlay 'style' only supports CSS Variables (invalid '${match[1]}' set)`);
      }
    }
  } else if (style && typeof style === 'object') {
    Object.keys(style).forEach(property => {
      if (property.startsWith('--') && typeof style[property] === 'string') {
        props[property] = style[property];
      } else {
        console.warn(`Overlay 'style' only supports CSS Variables (invalid '${property}' set)`);
      }
    });
  }
  return Object.keys(props).map(property => {
    return `${property}:${props[property]}`;
  }).join(';');
}
function normalizeApis(apis) {
  if (apis && typeof apis === 'object') {
    const normalizedApis = {
      ...apis
    };
    if (apis.style) {
      normalizedApis.style = normalizeStyle(apis.style);
    }
    return normalizedApis;
  }
  return {};
}

function stylesheet$8(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return ((useActualHostSelector ? ".fix-slds-modal" + shadowSelector + ",:host([data-render-mode='shadow']) .fix-slds-modal" : ".fix-slds-modal" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] .fix-slds-modal")) + shadowSelector + " {visibility: visible;z-index: unset;}" + ((useActualHostSelector ? ".fix-slds-backdrop" + shadowSelector + ",:host([data-render-mode='shadow']) .fix-slds-backdrop" : ".fix-slds-backdrop" + shadowSelector + "," + hostSelector + "[data-render-mode='shadow'] .fix-slds-backdrop")) + shadowSelector + " {z-index: unset;}";
  /*LWC compiler v9.5.3*/
}
var stylesheet0$2 = [stylesheet$8];

function stylesheet$7(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='modal-backdrop']" : hostSelector + "[data-render-mode=\"shadow\"] [part='modal-backdrop']")) + shadowSelector + " {--slds-c-backdrop-color-background: var(--slds-c-modalbase-backdrop-color-background);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='modal']" : hostSelector + "[data-render-mode=\"shadow\"] [part='modal']")) + shadowSelector + " {--slds-c-modalbody-shadow: var(--slds-c-modal-shadow);--slds-c-modalfooter-shadow: var(--slds-c-modal-shadow);--slds-c-modalheader-color-border: var(--slds-c-modal-color-border);--slds-c-modalfooter-color-border: var(--slds-c-modal-color-border);--slds-c-modalheader-radius-border: var(--slds-c-modal-radius-border);--slds-c-modalbody-radius-border: var(--slds-c-modal-radius-border);--slds-c-modalfooter-radius-border: var(--slds-c-modal-radius-border);--slds-c-modalheader-sizing-border: var(--slds-c-modal-sizing-border);--slds-c-modalfooter-sizing-border: var(--slds-c-modal-sizing-border);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-backdrop" : hostSelector + "[data-render-mode=\"shadow\"] .slds-backdrop")) + shadowSelector + " {transition-duration: 0.4s;width: 100%;height: 100%;opacity: 0;visibility: hidden;position: fixed;inset-block-start: 0;inset-inline-end: 0;inset-block-end: 0;inset-inline-start: 0;background: var(\n --slds-c-modalbase-backdrop-color-background,\n var(--slds-g-color-neutral-10-opacity-50, rgba(8, 7, 7, 60%))\n );z-index: 9000;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-backdrop_open" : hostSelector + "[data-render-mode=\"shadow\"] .slds-backdrop_open")) + shadowSelector + " {visibility: visible;opacity: 1;transition: opacity 0.4s linear;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal")) + shadowSelector + " {opacity: 0;visibility: hidden;transition:\n transform 0.1s linear,\n opacity 0.1s;position: fixed;inset-block-start: 0;inset-inline-end: 0;inset-block-end: 0;inset-inline-start: 0;z-index: 9001;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal__container" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal__container")) + shadowSelector + " {position: relative;transform: translate(0, 0);transition:\n transform 0.1s linear,\n opacity 0.1s linear;display: flex;flex-direction: column;justify-content: center;margin: 0 var(--slds-g-spacing-6, 2rem);height: 100%;padding: var(--slds-g-spacing-8, 3rem) 0 var(--slds-g-spacing-12, 5rem) 0;border-radius: var(--slds-g-spacing-1, 0.25rem);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal__close" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal__close")) + shadowSelector + " {width: 2rem;height: 2rem;margin-inline-start: auto;position: relative;background-color: var(--slds-g-color-neutral-base-100, #ffffff);border-radius: 0.25rem;bottom: 0.5rem;flex-shrink: 0;justify-content: center;display: inline-flex;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-fade-in-open" : hostSelector + "[data-render-mode=\"shadow\"] .slds-fade-in-open")) + shadowSelector + " {opacity: 1;visibility: visible;transition: opacity 0.1s linear;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-fade-in-open" : hostSelector + "[data-render-mode=\"shadow\"] .slds-fade-in-open")) + shadowSelector + " .slds-modal__container-reset" + shadowSelector + " {opacity: 1;visibility: visible;transform: translate(0, 0);}@media (width >= 48em) {" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal__container" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal__container")) + shadowSelector + " {margin: 0 auto;width: 50%;max-width: 40rem;min-width: 20rem;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal_small" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_small")) + shadowSelector + " .slds-modal__container" + shadowSelector + " {width: 60%;max-width: 52.0625rem;min-width: 40rem;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal_medium" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_medium")) + shadowSelector + " .slds-modal__container" + shadowSelector + " {width: 70%;max-width: 75rem;min-width: 40rem;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal_large" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_large")) + shadowSelector + " .slds-modal__container" + shadowSelector + " {width: 90%;max-width: none;min-width: 40rem;}}@media (width >= 48em) {" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal_full" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_full")) + shadowSelector + " .slds-modal__container" + shadowSelector + " {width: 90%;max-width: none;min-width: 40rem;}}@media (width <= 30em) {" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal_full" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_full")) + shadowSelector + " {inset-block-start: env(safe-area-inset-top, 0);inset-block-end: auto;height: calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom));}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal_full" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_full")) + shadowSelector + " .slds-modal__container" + shadowSelector + " {width: 100%;max-width: none;min-width: 0;margin: 0;padding: var(--slds-g-spacing-4, 1rem) 0 0 0;background-color: var(--slds-c-modalbase-color-background, var(--slds-g-color-surface-1, #ffffff));border-radius: 0;display: grid;height: 100dvh;grid-template-columns: 1fr;grid-template-rows: min-content min-content 1fr min-content;grid-template-areas: 'close' 'header' 'content' 'footer';}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal_full" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_full")) + shadowSelector + " .slds-modal__close" + shadowSelector + " {grid-area: close;inset-inline-end: var(--slds-g-spacing-4, 1rem);--slds-c-button-color-background: var(--slds-g-color-surface-container-1, #ffffff, white);--slds-c-button-color-background-active: var(--slds-g-color-surface-container-1, #ffffff, white);color: var(--slds-g-color-on-surface-1, #747474);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal_full" + shadowSelector + " .slds-modal__close:hover" + shadowSelector + ",:host([data-render-mode=\"shadow\"]) .slds-modal_full" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_full" + shadowSelector + " .slds-modal__close:hover" + shadowSelector + "," + hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_full")) + shadowSelector + " .slds-modal__close:focus" + shadowSelector + " {color: var(--slds-g-color-accent-3, #0b5cab);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-modal_full" + shadowSelector + " lightning-button-icon" + shadowSelector + " + div" + shadowSelector + ",:host([data-render-mode=\"shadow\"]) .slds-modal_full" : hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_full" + shadowSelector + " lightning-button-icon" + shadowSelector + " + div" + shadowSelector + "," + hostSelector + "[data-render-mode=\"shadow\"] .slds-modal_full")) + shadowSelector + " lightning-modal" + shadowSelector + " {display: contents;}}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-assistive-text" : hostSelector + "[data-render-mode=\"shadow\"] .slds-assistive-text")) + shadowSelector + " {position: absolute !important;margin: -1px !important;border: 0 !important;padding: 0 !important;width: 1px !important;height: 1px !important;overflow: hidden !important;clip: rect(0 0 0 0) !important;text-transform: none !important;white-space: nowrap !important;}";
  /*LWC compiler v9.5.3*/
}
var stylesheet1$3 = [stylesheet$7];

var stylesheet1$2 = [stylesheet0$6, stylesheet1$3];

function stylesheet$6(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  return "div[data-slot]" + shadowSelector + " {display: contents;}@media only screen and (max-width: 42.688rem) {.slds-modal__container__reflow_resize" + shadowSelector + " {margin-left: 0.1rem;margin-right: 0.1rem;padding-top: 0.5rem;padding-bottom: 0;overflow: hidden;}}";
  /*LWC compiler v9.5.3*/
}
var _implicitStylesheets$1 = [stylesheet0$2, stylesheet1$2, stylesheet$6];

function stylesheet$5(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return ["*", shadowSelector, ",*", shadowSelector, "::before,*", shadowSelector, "::after {box-sizing: border-box;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button']" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button']")), shadowSelector, " {display: inline-flex;gap: var(--sds-c-button-spacing-gap, var(--slds-s-button-spacing-gap));background: var(--sds-c-button-color-background, var(--slds-s-button-color-background));color: var(--sds-c-button-text-color, var(--slds-s-button-color));font-weight: var(--sds-c-button-font-weight, var(--slds-s-button-font-weight));font-size: var(--sds-c-button-font-size, var(--slds-s-button-font-size, inherit));line-height: var(--sds-c-button-font-lineheight);height: var(--sds-c-button-sizing-height);width: var(--sds-c-button-sizing-width);padding-inline-start: var(\n --sds-c-button-spacing-inlinestart,\n var(\n --sds-c-button-spacing-inline,\n var(--sds-c-button-spacing, var(--slds-s-button-spacing-inline, var(--slds-s-button-spacing)))\n )\n );padding-inline-end: var(\n --sds-c-button-spacing-inlineend,\n var(\n --sds-c-button-spacing-inline,\n var(--sds-c-button-spacing, var(--slds-s-button-spacing-inline, var(--slds-s-button-spacing)))\n )\n );padding-block-start: var(\n --sds-c-button-spacing-blockstart,\n var(\n --sds-c-button-spacing-block,\n var(--sds-c-button-spacing, var(--slds-s-button-spacing-block, var(--slds-s-button-spacing)))\n )\n );padding-block-end: var(\n --sds-c-button-spacing-blockend,\n var(\n --sds-c-button-spacing-block,\n var(--sds-c-button-spacing, var(--slds-s-button-spacing-block, var(--slds-s-button-spacing)))\n )\n );border-width: var(--sds-c-button-sizing-border, var(--slds-s-button-sizing-border, 1px));border-style: solid;border-color: var(--sds-c-button-color-border, var(--slds-s-button-color-border, currentColor));border-start-start-radius: var(\n --sds-c-button-radius-border-startstart,\n var(\n --sds-c-button-radius-border,\n var(--slds-s-button-radius-border-startstart, var(--slds-s-button-radius-border))\n )\n );border-start-end-radius: var(\n --sds-c-button-radius-border-startend,\n var(\n --sds-c-button-radius-border,\n var(--slds-s-button-radius-border-startend, var(--slds-s-button-radius-border))\n )\n );border-end-start-radius: var(\n --sds-c-button-radius-border-endstart,\n var(\n --sds-c-button-radius-border,\n var(--slds-s-button-radius-border-endstart, var(--slds-s-button-radius-border))\n )\n );border-end-end-radius: var(\n --sds-c-button-radius-border-endend,\n var(\n --sds-c-button-radius-border,\n var(--slds-s-button-radius-border-endend, var(--slds-s-button-radius-border))\n )\n );box-shadow: var(--sds-c-button-shadow, var(--slds-s-button-shadow));text-decoration: var(--sds-c-button-font-decoration);white-space: normal;user-select: none;align-items: center;justify-content: center;appearance: none;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button']:hover" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button']:hover")), shadowSelector, " {--sds-c-button-text-color: var(--sds-c-button-text-color-hover, var(--slds-s-button-color-hover, revert));--sds-c-button-color-background: var(\n --sds-c-button-color-background-hover,\n var(--slds-s-button-color-background-hover, revert)\n );--sds-c-button-color-border: var(\n --sds-c-button-color-border-hover,\n var(--slds-s-button-color-border-hover, revert)\n );--sds-c-button-shadow: var(--sds-c-button-shadow-hover, var(--slds-s-button-shadow-hover, revert));cursor: pointer;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button']:focus" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button']:focus")), shadowSelector, " {--sds-c-button-color-background: var(\n --sds-c-button-color-background-focus,\n var(--slds-s-button-color-background-focus, revert)\n );--sds-c-button-color-border: var(\n --sds-c-button-color-border-focus,\n var(--slds-s-button-color-border-focus, revert)\n );--sds-c-button-text-color: var(--sds-c-button-text-color-focus, var(--slds-s-button-color-focus, revert));--sds-c-button-shadow: var(--sds-c-button-shadow-focus, var(--slds-s-button-shadow-focus, revert));outline: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button']:active" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button']:active")), shadowSelector, " {--sds-c-button-text-color: var(--sds-c-button-text-color-active, var(--slds-s-button-color-active, revert));--sds-c-button-color-background: var(\n --sds-c-button-color-background-active,\n var(--slds-s-button-color-background-active, revert)\n );--sds-c-button-color-border: var(\n --sds-c-button-color-border-active,\n var(--slds-s-button-color-border-active, revert)\n );--sds-c-button-shadow: var(--sds-c-button-shadow-active, var(--slds-s-button-shadow-active, revert));}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button']:disabled" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button']:disabled")), shadowSelector, " {--sds-c-button-text-color: var(--sds-c-button-text-color-disabled);--sds-c-button-color-background: var(--sds-c-button-color-background-disabled);--sds-c-button-color-border: var(--sds-c-button-color-border-disabled);--sds-c-button-shadow: var(--sds-c-button-shadow-disabled);pointer-events: none;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button']:disabled" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button']:disabled")), shadowSelector, " *", shadowSelector, " {pointer-events: none;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='button'][aria-pressed='true']" : hostSelector + "[data-render-mode=\"shadow\"] [part='button'][aria-pressed='true']")), shadowSelector, " {--sds-c-button-color-background: var(--sds-c-button-color-background-pressed, revert);--sds-c-button-color-border: var(--sds-c-button-color-border-pressed, revert);--sds-c-button-text-color: var(--sds-c-button-text-color-pressed, revert);--sds-c-button-shadow: var(--sds-c-button-shadow-pressed, revert);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button']" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button']")), shadowSelector, " {gap: var(--slds-g-spacing-2, 0.5rem);--slds-c-icon-sizing-border: 0;--slds-c-icon-sizing: 0.875rem;--slds-c-icon-color-foreground: currentcolor;--sds-c-button-font-lineheight: var(\n --slds-c-button-neutral-font-lineheight,\n var(--slds-s-button-font-lineheight, 1.875rem)\n );--sds-c-button-spacing-inline: var(\n --slds-c-button-neutral-spacing-inline,\n var(--slds-s-button-spacing-inline, var(--slds-g-spacing-4, 1rem)) ;\n );--sds-c-button-spacing-block: var(--slds-c-button-neutral-spacing-block);--sds-c-button-radius-border-startstart: var(\n --slds-c-button-radius-border-startstart,\n var(\n --slds-c-button-radius-border,\n var(--slds-s-button-radius-border-startstart, var(--slds-s-button-radius-border))\n )\n );--sds-c-button-radius-border-endstart: var(\n --slds-c-button-radius-border-endstart,\n var(\n --slds-c-button-radius-border,\n var(--slds-s-button-radius-border-endstart, var(--slds-s-button-radius-border))\n )\n );--sds-c-button-radius-border-startend: var(\n --slds-c-button-radius-border-startend,\n var(\n --slds-c-button-radius-border,\n var(--slds-s-button-radius-border-startend, var(--slds-s-button-radius-border))\n )\n );--sds-c-button-radius-border-endend: var(\n --slds-c-button-radius-border-endend,\n var(\n --slds-c-button-radius-border,\n var(--slds-s-button-radius-border-endend, var(--slds-s-button-radius-border))\n )\n );--sds-c-button-color-background: var(\n --slds-c-button-neutral-color-background,\n var(--slds-g-color-surface-container-1, #ffffff)\n );--sds-c-button-color-background-hover: var(\n --slds-c-button-neutral-color-background-hover,\n var(--slds-g-color-surface-container-2, #f3f3f3)\n );--sds-c-button-color-background-focus: var(\n --slds-c-button-neutral-color-background-focus,\n var(--slds-g-color-surface-container-2, #f3f3f3)\n );--sds-c-button-color-background-active: var(\n --slds-c-button-neutral-color-background-active,\n var(--slds-g-color-surface-container-2, #f3f3f3)\n );--sds-c-button-color-border: var(--slds-c-button-neutral-color-border, var(--slds-g-color-border-2, var(--slds-g-color-neutral-base-50)));--sds-c-button-color-border-hover: var(\n --slds-c-button-neutral-color-border-hover,\n var(--slds-g-color-border-2, var(--slds-g-color-neutral-base-50))\n );--sds-c-button-color-border-focus: var(\n --slds-c-button-neutral-color-border-focus,\n var(--slds-g-color-border-2, var(--slds-g-color-neutral-base-50))\n );--sds-c-button-color-border-active: var(\n --slds-c-button-neutral-color-border-active,\n var(--slds-g-color-border-2, var(--slds-g-color-neutral-base-50))\n );--sds-c-button-text-color: var(--slds-c-button-neutral-text-color, var(--slds-g-color-accent-2, var(--lwc-brandPrimaryActive, var(--slds-g-color-brand-base-50))));--sds-c-button-text-color-hover: var(\n --slds-c-button-neutral-text-color-hover,\n var(--slds-s-button-color-hover, var(--slds-g-color-accent-3, #0b5cab))\n );--sds-c-button-text-color-focus: var(\n --slds-c-button-neutral-text-color-focus,\n var(--slds-g-color-accent-3, #0b5cab)\n );--sds-c-button-text-color-active: var(\n --slds-c-button-neutral-text-color-active,\n var(--slds-g-color-accent-3, #0b5cab)\n );--sds-c-button-shadow: var(--slds-c-button-neutral-shadow);--sds-c-button-shadow-focus: var(--slds-c-button-neutral-shadow-focus);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button']:disabled" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button']:disabled")), shadowSelector, " {--sds-c-button-color-border-disabled: var(--slds-g-color-border-disabled-1, #c9c9c9);--sds-c-button-text-color-disabled: var(--slds-g-color-on-disabled-1, #c9c9c9);--sds-c-button-color-background-disabled: var(--slds-g-color-disabled-container-1, #ffffff);pointer-events: auto;cursor: default;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='brand']) [part~='button']" : hostSelector + "[variant='brand'][data-render-mode=\"shadow\"] [part~='button']")), shadowSelector, " {--slds-c-button-neutral-color-background: var(\n --slds-c-button-brand-color-background,\n var(--slds-g-color-accent-container-1, var(--lwc-brandAccessible, var(--slds-g-color-brand-base-50)))\n );--slds-c-button-neutral-color-background-hover: var(\n --slds-c-button-brand-color-background-hover,\n var(--slds-g-color-accent-container-2, var(--lwc-brandAccessibleActive, var(--slds-g-color-brand-base-40)))\n );--slds-c-button-neutral-color-background-focus: var(\n --slds-c-button-brand-color-background-focus,\n var(--slds-g-color-accent-container-2, var(--lwc-brandAccessibleActive, var(--slds-g-color-brand-base-40)))\n );--slds-c-button-neutral-color-background-active: var(\n --slds-c-button-brand-color-background-active,\n var(--slds-g-color-accent-container-2, var(--lwc-brandAccessibleActive, var(--slds-g-color-brand-base-40)))\n );--slds-c-button-neutral-color-border: var(\n --slds-c-button-brand-color-border,\n var(--slds-g-color-border-accent-1, #0176d3)\n );--slds-c-button-neutral-color-border-hover: var(\n --slds-c-button-brand-color-border-hover,\n var(--slds-g-color-border-accent-2, #0b5cab)\n );--slds-c-button-neutral-color-border-focus: var(\n --slds-c-button-brand-color-border-focus,\n var(--slds-g-color-border-accent-2, #0b5cab)\n );--slds-c-button-neutral-color-border-active: var(\n --slds-c-button-brand-color-border-active,\n var(--slds-g-color-border-accent-2, #0b5cab)\n );--sds-c-button-text-color: var(--slds-c-button-brand-text-color, var(--slds-g-color-on-accent-1, var(--slds-g-color-brand-base-100)));}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='brand-outline']) [part~='button']" : hostSelector + "[variant='brand-outline'][data-render-mode=\"shadow\"] [part~='button']")), shadowSelector, " {--slds-c-button-neutral-color-border: var(--slds-g-color-border-accent-2, #0b5cab);--slds-c-button-neutral-color-border-hover: var(--slds-g-color-border-accent-2, #0b5cab);--slds-c-button-neutral-color-border-focus: var(--slds-g-color-border-accent-2, #0b5cab);--slds-c-button-neutral-color-border-active: var(--slds-g-color-border-accent-2, #0b5cab);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='inverse']) [part~='button']" : hostSelector + "[variant='inverse'][data-render-mode=\"shadow\"] [part~='button']")), shadowSelector, " {--slds-c-button-neutral-color-background: transparent;--slds-c-button-neutral-color-background-hover: var(--slds-g-color-surface-container-2, #f3f3f3);--slds-c-button-neutral-color-background-focus: var(--slds-g-color-surface-container-2, #f3f3f3);--slds-c-button-neutral-color-background-active: var(--slds-g-color-surface-container-2, #f3f3f3);--slds-c-button-neutral-color-border: var(--slds-g-color-neutral-base-100, #ffffff);--slds-c-button-neutral-color-border-hover: var(--slds-g-color-neutral-base-100, #ffffff);--slds-c-button-neutral-color-border-focus: var(--slds-g-color-neutral-base-100, #ffffff);--slds-c-button-neutral-color-border-active: var(--slds-g-color-neutral-base-100, #ffffff);--slds-c-button-neutral-text-color: var(--slds-g-color-on-accent-1, var(--slds-g-color-brand-base-100));--slds-c-button-neutral-text-color-hover: var(--slds-g-color-accent-2, var(--lwc-brandPrimaryActive, var(--slds-g-color-brand-base-50)));--slds-c-button-neutral-text-color-active: var(--slds-g-color-accent-2, var(--lwc-brandPrimaryActive, var(--slds-g-color-brand-base-50)));}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='inverse']) [part~='button']:disabled" : hostSelector + "[variant='inverse'][data-render-mode=\"shadow\"] [part~='button']:disabled")), shadowSelector, " {--sds-c-button-color-background: transparent;--sds-c-button-color-border: var(--slds-g-color-border-disabled-2, #aeaeae);--sds-c-button-text-color: var(--slds-g-color-disabled-2, #aeaeae);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='destructive']) [part~='button']" : hostSelector + "[variant='destructive'][data-render-mode=\"shadow\"] [part~='button']")), shadowSelector, " {--slds-c-button-neutral-color-background: var(--slds-g-color-error-container-1, #ba0517);--slds-c-button-neutral-color-background-hover: var(--slds-g-color-error-container-2, #8e030f);--slds-c-button-neutral-color-background-focus: var(--slds-g-color-error-container-2, #8e030f);--slds-c-button-neutral-color-background-active: var(--slds-g-color-error-container-2, #8e030f);--slds-c-button-neutral-color-border: var(--slds-g-color-border-error-1, #ba0517);--slds-c-button-neutral-color-border-hover: var(--slds-g-color-border-error-2, #8e030f);--slds-c-button-neutral-color-border-focus: var(--slds-g-color-border-error-2, #8e030f);--slds-c-button-neutral-color-border-active: var(--slds-g-color-border-error-2, #8e030f);--sds-c-button-text-color: var(--slds-g-color-on-error-1, #ffffff);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='success']) [part~='button']" : hostSelector + "[variant='success'][data-render-mode=\"shadow\"] [part~='button']")), shadowSelector, " {--slds-c-button-neutral-color-background: var(--slds-g-color-success-container-1, #2e844a);--slds-c-button-neutral-color-background-hover: var(--slds-g-color-success-container-2, #194e31);--slds-c-button-neutral-color-background-focus: var(--slds-g-color-success-container-2, #194e31);--slds-c-button-neutral-color-background-active: var(--slds-g-color-success-container-2, #194e31);--slds-c-button-neutral-color-border: var(--slds-g-color-border-success-1, #2e844a);--slds-c-button-neutral-color-border-hover: var(--slds-g-color-border-success-2);--slds-c-button-neutral-color-border-focus: var(--slds-g-color-border-success-2);--slds-c-button-neutral-color-border-active: var(--slds-g-color-border-success-2);--slds-c-button-neutral-text-color: var(--slds-g-color-on-success-1, #ffffff);--slds-c-button-neutral-text-color-hover: var(--slds-g-color-on-success-1, #ffffff);--slds-c-button-neutral-text-color-focus: var(--slds-g-color-on-success-1, #ffffff);--slds-c-button-neutral-text-color-active: var(--slds-g-color-on-success-1, #ffffff);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='destructive-text']) [part~='button']" : hostSelector + "[variant='destructive-text'][data-render-mode=\"shadow\"] [part~='button']")), shadowSelector, " {--slds-c-button-neutral-text-color: var(--slds-g-color-error-1, #ba0517);--slds-c-button-neutral-text-color-hover: var(--slds-g-color-error-1, #ba0517);--slds-c-button-neutral-text-color-focus: var(--slds-g-color-error-1, #ba0517);--slds-c-button-neutral-text-color-active: var(--slds-g-color-error-1, #ba0517);--slds-c-button-neutral-color-border-hover: var(\n --slds-c-button-neutral-color-border,\n var(--slds-g-color-border-1, var(--slds-g-color-neutral-base-80))\n );--slds-c-button-neutral-color-border-focus: var(\n --slds-c-button-neutral-color-border,\n var(--slds-g-color-border-1, var(--slds-g-color-neutral-base-80))\n );--slds-c-button-neutral-color-border-active: var(\n --slds-c-button-neutral-color-border,\n var(--slds-g-color-border-1, var(--slds-g-color-neutral-base-80))\n );}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='brand']) [part~='button']:disabled" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='success']) [part~='button']:disabled" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='destructive']) [part~='button']:disabled" : hostSelector + "[variant='brand'][data-render-mode=\"shadow\"] [part~='button']:disabled" + shadowSelector + "," + hostSelector + "[variant='success'][data-render-mode=\"shadow\"] [part~='button']:disabled" + shadowSelector + "," + hostSelector + "[variant='destructive'][data-render-mode=\"shadow\"] [part~='button']:disabled")), shadowSelector, " {--sds-c-button-color-background: var(--slds-g-color-disabled-container-2, #c9c9c9);--sds-c-button-color-border: var(--slds-g-color-border-disabled-1, #c9c9c9);--sds-c-button-text-color: var(--slds-g-color-on-disabled-2, #939393);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='base']) [part~='button']" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='text']) [part~='button']" : hostSelector + "[variant='base'][data-render-mode=\"shadow\"] [part~='button']" + shadowSelector + "," + hostSelector + "[variant='text'][data-render-mode=\"shadow\"] [part~='button']")), shadowSelector, " {--sds-c-button-spacing-inline: 0;--slds-c-button-neutral-text-color: var(--slds-g-color-accent-2, var(--lwc-brandPrimaryActive, var(--slds-g-color-brand-base-50)));--slds-c-button-neutral-color-border: transparent;--slds-c-button-neutral-color-border-hover: transparent;--slds-c-button-neutral-color-border-focus: transparent;--slds-c-button-neutral-color-border-active: var(--slds-g-color-border-accent-2, #0b5cab);--slds-c-button-neutral-color-background: transparent;--slds-c-button-neutral-color-background-hover: transparent;--slds-c-button-neutral-color-background-focus: transparent;--slds-c-button-neutral-color-background-active: transparent;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='base']) [part~='button']:disabled" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='text']) [part~='button']:disabled" : hostSelector + "[variant='base'][data-render-mode=\"shadow\"] [part~='button']:disabled" + shadowSelector + "," + hostSelector + "[variant='text'][data-render-mode=\"shadow\"] [part~='button']:disabled")), shadowSelector, " {--sds-c-button-color-background: transparent;--sds-c-button-color-border: transparent;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][stretch]) [part~='button']" : hostSelector + "[stretch][data-render-mode=\"shadow\"] [part~='button']")), shadowSelector, " {--sds-c-button-sizing-width: 100%;justify-content: center;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='brand']) [part~='button']" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='brand-outline']) [part~='button']" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='inverse']) [part~='button']" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='success']) [part~='button']" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='destructive']) [part~='button']" + shadowSelector + ",:host([data-render-mode=\"shadow\"][variant='destructive-text']) [part~='button']" : hostSelector + "[variant='brand'][data-render-mode=\"shadow\"] [part~='button']" + shadowSelector + "," + hostSelector + "[variant='brand-outline'][data-render-mode=\"shadow\"] [part~='button']" + shadowSelector + "," + hostSelector + "[variant='inverse'][data-render-mode=\"shadow\"] [part~='button']" + shadowSelector + "," + hostSelector + "[variant='success'][data-render-mode=\"shadow\"] [part~='button']" + shadowSelector + "," + hostSelector + "[variant='destructive'][data-render-mode=\"shadow\"] [part~='button']" + shadowSelector + "," + hostSelector + "[variant='destructive-text'][data-render-mode=\"shadow\"] [part~='button']")), shadowSelector, " {justify-content: center;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='start']" : hostSelector + "[data-render-mode=\"shadow\"] [part~='start']")), shadowSelector, " {display: inline-flex;padding-inline-end: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='end']" : hostSelector + "[data-render-mode=\"shadow\"] [part~='end']")), shadowSelector, " {display: inline-flex;padding-inline-start: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-assistive-text" : hostSelector + "[data-render-mode=\"shadow\"] .slds-assistive-text")), shadowSelector, " {position: absolute !important;margin: -1px !important;border: 0 !important;padding: 0 !important;width: 1px !important;height: 1px !important;overflow: hidden !important;clip: rect(0 0 0 0) !important;text-transform: none !important;white-space: nowrap !important;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-button_reset" : hostSelector + "[data-render-mode=\"shadow\"] .slds-button_reset")), shadowSelector, " {font-size: inherit;color: inherit;line-height: inherit;padding: 0;background: transparent;border: 0;text-align: inherit;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button-icon']" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button-icon']")), shadowSelector, " {display: inline-flex;--slds-c-icon-sizing-border: 0;--slds-c-icon-sizing: 0.875rem;--slds-c-icon-color-foreground: var(--slds-c-buttonicon-color-foreground, var(--slds-g-color-on-surface-1, #747474));--sds-c-button-spacing-inline: 0;--sds-c-button-sizing-height: var(--slds-g-sizing-9, 2rem);--sds-c-button-sizing-width: var(--slds-g-sizing-9, 2rem);--slds-c-button-neutral-color-background: transparent;--slds-c-button-neutral-color-background-hover: transparent;--slds-c-button-neutral-color-background-focus: transparent;--slds-c-button-neutral-color-background-active: transparent;--slds-c-button-neutral-color-border: var(--slds-g-color-border-2, var(--slds-g-color-neutral-base-50));--slds-c-button-neutral-color-border-hover: var(--slds-g-color-border-2, var(--slds-g-color-neutral-base-50));--slds-c-button-neutral-color-border-focus: var(--slds-g-color-border-2, var(--slds-g-color-neutral-base-50));--slds-c-button-neutral-color-border-active: var(--slds-g-color-border-2, var(--slds-g-color-neutral-base-50));--sds-c-button-color-background-disabled: var(--slds-g-color-surface-container-1, #ffffff);--sds-c-button-color-border-disabled: var(--slds-g-color-border-disabled-1, #c9c9c9);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button-icon']:hover" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button-icon']:hover")), shadowSelector, " {--slds-c-icon-color-foreground: var(\n --slds-c-buttonicon-color-foreground-hover,\n var(--slds-g-color-accent-3, #0b5cab)\n );}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button-icon']:focus" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button-icon']:focus")), shadowSelector, " {--slds-c-icon-color-foreground: var(\n --slds-c-buttonicon-color-foreground-focus,\n var(--slds-g-color-accent-3, #0b5cab)\n );}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button-icon']:active" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button-icon']:active")), shadowSelector, " {--slds-c-icon-color-foreground: var(\n --slds-c-buttonicon-color-foreground-active,\n var(--slds-g-color-accent-3, #0b5cab)\n );--sds-c-button-shadow-active: none;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='button-icon']:disabled" : hostSelector + "[data-render-mode=\"shadow\"] [part~='button-icon']:disabled")), shadowSelector, " {--slds-c-icon-color-foreground: var(--slds-g-color-disabled-1, #c9c9c9);--sds-c-button-color-background-disabled: transparent;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='bare']) [part~='button-icon']" : hostSelector + "[variant='bare'][data-render-mode=\"shadow\"] [part~='button-icon']")), shadowSelector, " {--sds-c-button-sizing-height: auto;--sds-c-button-sizing-width: auto;--slds-c-button-neutral-color-border: transparent;--slds-c-button-neutral-color-border-hover: transparent;--slds-c-button-neutral-color-border-focus: transparent;--slds-c-button-neutral-color-border-active: var(--slds-g-color-border-accent-3, #014486);--sds-c-button-color-background-disabled: transparent;--sds-c-button-color-border-disabled: transparent;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='container']) [part~='button-icon']" : hostSelector + "[variant='container'][data-render-mode=\"shadow\"] [part~='button-icon']")), shadowSelector, " {--slds-c-button-neutral-color-border: transparent;--slds-c-button-neutral-color-border-hover: transparent;--slds-c-button-neutral-color-border-focus: transparent;--slds-c-button-neutral-color-border-active: var(--slds-g-color-border-accent-3, #014486);--sds-c-button-color-background-disabled: transparent;--sds-c-button-color-border-disabled: transparent;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='brand']) [part~='button-icon']" : hostSelector + "[variant='brand'][data-render-mode=\"shadow\"] [part~='button-icon']")), shadowSelector, " {--slds-c-icon-color-foreground: var(--slds-g-color-on-accent-1, var(--slds-g-color-brand-base-100));}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='bare-inverse']) [part~='button-icon']" : hostSelector + "[variant='bare-inverse'][data-render-mode=\"shadow\"] [part~='button-icon']")), shadowSelector, " {--sds-c-button-sizing-height: auto;--sds-c-button-sizing-width: auto;--slds-c-button-neutral-color-border: transparent;--slds-c-button-neutral-color-border-hover: transparent;--slds-c-button-neutral-color-border-focus: var(--slds-g-color-neutral-base-100, #ffffff);--slds-c-button-neutral-color-border-active: var(--slds-g-color-neutral-base-100, #ffffff);--sds-c-button-shadow-focus: 0 0 3px var(--slds-g-color-neutral-base-100, #ffffff);--slds-c-buttonicon-color-foreground: var(--slds-g-color-neutral-base-100, #ffffff);--slds-c-buttonicon-color-foreground-hover: color-mix(\n in oklab,\n var(--slds-g-color-on-surface-inverse-1, #ffffff),\n transparent 25%\n );--slds-c-buttonicon-color-foreground-focus: var(--slds-g-color-neutral-base-95, #f3f3f3);--slds-c-buttonicon-color-foreground-active: var(--slds-g-color-neutral-base-90, #e5e5e5);--sds-c-button-color-background-disabled: transparent;--sds-c-button-color-border-disabled: transparent;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='border-inverse']) [part~='button-icon']" : hostSelector + "[variant='border-inverse'][data-render-mode=\"shadow\"] [part~='button-icon']")), shadowSelector, " {--slds-c-button-neutral-color-border: var(--slds-g-color-neutral-base-100, #ffffff);--slds-c-button-neutral-color-border-hover: var(--slds-g-color-neutral-base-100, #ffffff);--slds-c-button-neutral-color-border-focus: var(--slds-g-color-neutral-base-100, #ffffff);--slds-c-button-neutral-color-border-active: var(--slds-g-color-neutral-base-100, #ffffff);--sds-c-button-shadow-focus: 0 0 3px var(--slds-g-color-neutral-base-100, #ffffff);--slds-c-buttonicon-color-foreground: var(--slds-g-color-neutral-base-100, #ffffff);--slds-c-buttonicon-color-foreground-hover: var(--slds-g-color-neutral-base-95, #f3f3f3);--slds-c-buttonicon-color-foreground-focus: var(--slds-g-color-neutral-base-95, #f3f3f3);--slds-c-buttonicon-color-foreground-active: var(--slds-g-color-neutral-base-90, #e5e5e5);--sds-c-button-color-background-disabled: transparent;--sds-c-button-color-border-disabled: var(--slds-g-color-border-disabled-2, #aeaeae);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='border-filled']) [part~='button-icon']" : hostSelector + "[variant='border-filled'][data-render-mode=\"shadow\"] [part~='button-icon']")), shadowSelector, " {--slds-c-button-neutral-color-background: var(--slds-g-color-surface-container-1, #ffffff);--slds-c-button-neutral-color-background-hover: var(--slds-g-color-surface-container-1, #ffffff);--slds-c-button-neutral-color-background-focus: var(--slds-g-color-surface-container-1, #ffffff);--slds-c-button-neutral-color-background-active: var(--slds-g-color-surface-container-1, #ffffff);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='border-filled']) [part~='button-icon']:disabled" : hostSelector + "[variant='border-filled'][data-render-mode=\"shadow\"] [part~='button-icon']:disabled")), shadowSelector, " {--sds-c-button-color-background-disabled: var(--slds-g-color-disabled-container-1, #ffffff);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][size='xx-small']) [part~='button-icon']" : hostSelector + "[size='xx-small'][data-render-mode=\"shadow\"] [part~='button-icon']")), shadowSelector, " {--sds-c-button-sizing-height: var(--slds-g-sizing-5, 1rem);--sds-c-button-sizing-width: var(--slds-g-sizing-5, 1rem);--slds-c-icon-sizing: var(--slds-g-sizing-3, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][size='x-small']) [part~='button-icon']" : hostSelector + "[size='x-small'][data-render-mode=\"shadow\"] [part~='button-icon']")), shadowSelector, " {--sds-c-button-sizing-height: var(--slds-g-sizing-6, 1.25rem);--sds-c-button-sizing-width: var(--slds-g-sizing-6, 1.25rem);--slds-c-icon-sizing: var(--slds-g-sizing-4, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][size='small']) [part~='button-icon']" : hostSelector + "[size='small'][data-render-mode=\"shadow\"] [part~='button-icon']")), shadowSelector, " {--sds-c-button-sizing-height: var(--slds-g-sizing-7, 1.5rem);--sds-c-button-sizing-width: var(--slds-g-sizing-7, 1.5rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][size='large']) [part~='button-icon']" : hostSelector + "[size='large'][data-render-mode=\"shadow\"] [part~='button-icon']")), shadowSelector, " {--sds-c-button-sizing-height: var(--slds-g-sizing-10, 3rem);--sds-c-button-sizing-width: var(--slds-g-sizing-10, 3rem);--slds-c-icon-sizing: var(--slds-g-sizing-7, 1.5rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][size='x-small'][variant='bare']) [part~='button-icon']" : hostSelector + "[variant='bare'][size='x-small'][data-render-mode=\"shadow\"] [part~='button-icon']")), shadowSelector, " {--slds-c-buttonicon-spacing-block: 0;--slds-c-buttonicon-spacing-inline: 0;--slds-c-icon-sizing: var(--slds-g-sizing-3, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][size='small'][variant='bare']) [part~='button-icon']" : hostSelector + "[variant='bare'][size='small'][data-render-mode=\"shadow\"] [part~='button-icon']")), shadowSelector, " {--slds-c-buttonicon-spacing-block: 0;--slds-c-buttonicon-spacing-inline: 0;--slds-c-icon-sizing: var(--slds-g-sizing-4, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][size='large'][variant='bare']) [part~='button-icon']" + shadowSelector + ",:host([data-render-mode=\"shadow\"][size='large'][variant='bare-inverse']) [part~='button-icon']" : hostSelector + "[variant='bare'][size='large'][data-render-mode=\"shadow\"] [part~='button-icon']" + shadowSelector + "," + hostSelector + "[variant='bare-inverse'][size='large'][data-render-mode=\"shadow\"] [part~='button-icon']")), shadowSelector, " {--sds-c-button-sizing-height: auto;--sds-c-button-sizing-width: auto;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='end']" : hostSelector + "[data-render-mode=\"shadow\"] [part='end']")), shadowSelector, " {padding-inline-start: 0;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-assistive-text" : hostSelector + "[data-render-mode=\"shadow\"] .slds-assistive-text")), shadowSelector, " {position: absolute !important;margin: -1px !important;border: 0 !important;padding: 0 !important;width: 1px !important;height: 1px !important;overflow: hidden !important;clip: rect(0 0 0 0) !important;text-transform: none !important;white-space: nowrap !important;}", ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][size='large']) [part~='button-icon']" + shadowSelector + ",:host([data-render-mode=\"shadow\"][size='medium']) [part~='button-icon']" : hostSelector + "[size='large'][data-render-mode=\"shadow\"] [part~='button-icon']" + shadowSelector + "," + hostSelector + "[size='medium'][data-render-mode=\"shadow\"] [part~='button-icon']")), shadowSelector, " {height: var(--slds-c-buttonicon-sizing-height, var(--slds-g-sizing-9, 2rem));}"].join('');
  /*LWC compiler v9.5.3*/
}
var stylesheet1$1 = [stylesheet$5];

var stylesheet0$1 = [stylesheet0$6, stylesheet1$1];

function stylesheet$4(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  return "lightning-primitive-icon" + shadowSelector + " {display: contents;}";
  /*LWC compiler v9.5.3*/
}
var _implicitStylesheets = [stylesheet0$1, stylesheet$4];

function stylesheet$3(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return [((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-top_none" + shadowSelector + ",:host([data-render-mode='shadow'].slds-m-top_none) {" : hostSelector + "[data-render-mode='shadow'] .slds-m-top_none" + shadowSelector + "," + hostSelector + ".slds-m-top_none[data-render-mode='shadow'] {")), "margin-top: 0 !important;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-top_xxx-small" : hostSelector + "[data-render-mode='shadow'] .slds-m-top_xxx-small")), shadowSelector, " {margin-block-start: calc(var(--slds-g-spacing-1, 0.25rem) / 2);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-top_xx-small" : hostSelector + "[data-render-mode='shadow'] .slds-m-top_xx-small")), shadowSelector, " {margin-block-start: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-top_x-small" : hostSelector + "[data-render-mode='shadow'] .slds-m-top_x-small")), shadowSelector, " {margin-block-start: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-top_small" : hostSelector + "[data-render-mode='shadow'] .slds-m-top_small")), shadowSelector, " {margin-block-start: var(--slds-g-spacing-3, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-top_medium" : hostSelector + "[data-render-mode='shadow'] .slds-m-top_medium")), shadowSelector, " {margin-block-start: var(--slds-g-spacing-4, 1rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-top_large" : hostSelector + "[data-render-mode='shadow'] .slds-m-top_large")), shadowSelector, " {margin-block-start: var(--slds-g-spacing-5, 1.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-top_x-large" : hostSelector + "[data-render-mode='shadow'] .slds-m-top_x-large")), shadowSelector, " {margin-block-start: var(--slds-g-spacing-6, 2rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-top_xx-large" : hostSelector + "[data-render-mode='shadow'] .slds-m-top_xx-large")), shadowSelector, " {margin-block-start: var(--slds-g-spacing-8, 3rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-right_none" : hostSelector + "[data-render-mode='shadow'] .slds-m-right_none")), shadowSelector, " {margin-inline-end: 0 !important;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-right_xxx-small" : hostSelector + "[data-render-mode='shadow'] .slds-m-right_xxx-small")), shadowSelector, " {margin-inline-end: calc(var(--slds-g-spacing-1, 0.25rem) / 2);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-right_xx-small" + shadowSelector + ",:host([data-render-mode='shadow'].slds-m-right_xx-small) {" : hostSelector + "[data-render-mode='shadow'] .slds-m-right_xx-small" + shadowSelector + "," + hostSelector + ".slds-m-right_xx-small[data-render-mode='shadow'] {")), "margin-inline-end: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-right_x-small" + shadowSelector + ",:host([data-render-mode='shadow'].slds-m-right_x-small) {" : hostSelector + "[data-render-mode='shadow'] .slds-m-right_x-small" + shadowSelector + "," + hostSelector + ".slds-m-right_x-small[data-render-mode='shadow'] {")), "margin-inline-end: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-right_small" + shadowSelector + ",:host([data-render-mode='shadow'].slds-m-right_small) {" : hostSelector + "[data-render-mode='shadow'] .slds-m-right_small" + shadowSelector + "," + hostSelector + ".slds-m-right_small[data-render-mode='shadow'] {")), "margin-inline-end: var(--slds-g-spacing-3, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-right_medium" : hostSelector + "[data-render-mode='shadow'] .slds-m-right_medium")), shadowSelector, " {margin-inline-end: var(--slds-g-spacing-4, 1rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-right_large" : hostSelector + "[data-render-mode='shadow'] .slds-m-right_large")), shadowSelector, " {margin-inline-end: var(--slds-g-spacing-5, 1.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-right_x-large" : hostSelector + "[data-render-mode='shadow'] .slds-m-right_x-large")), shadowSelector, " {margin-inline-end: var(--slds-g-spacing-6, 2rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-right_xx-large" : hostSelector + "[data-render-mode='shadow'] .slds-m-right_xx-large")), shadowSelector, " {margin-inline-end: var(--slds-g-spacing-8, 3rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-bottom_none" + shadowSelector + ",:host([data-render-mode='shadow'].slds-m-bottom_none) {" : hostSelector + "[data-render-mode='shadow'] .slds-m-bottom_none" + shadowSelector + "," + hostSelector + ".slds-m-bottom_none[data-render-mode='shadow'] {")), "margin-block-end: 0 !important;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-bottom_xxx-small" : hostSelector + "[data-render-mode='shadow'] .slds-m-bottom_xxx-small")), shadowSelector, " {margin-block-end: calc(var(--slds-g-spacing-1, 0.25rem) / 2);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-bottom_xx-small" : hostSelector + "[data-render-mode='shadow'] .slds-m-bottom_xx-small")), shadowSelector, " {margin-block-end: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-bottom_x-small" : hostSelector + "[data-render-mode='shadow'] .slds-m-bottom_x-small")), shadowSelector, " {margin-block-end: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-bottom_small" : hostSelector + "[data-render-mode='shadow'] .slds-m-bottom_small")), shadowSelector, " {margin-block-end: var(--slds-g-spacing-3, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-bottom_medium" : hostSelector + "[data-render-mode='shadow'] .slds-m-bottom_medium")), shadowSelector, " {margin-block-end: var(--slds-g-spacing-4, 1rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-bottom_large" : hostSelector + "[data-render-mode='shadow'] .slds-m-bottom_large")), shadowSelector, " {margin-block-end: var(--slds-g-spacing-5, 1.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-bottom_x-large" : hostSelector + "[data-render-mode='shadow'] .slds-m-bottom_x-large")), shadowSelector, " {margin-block-end: var(--slds-g-spacing-6, 2rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-bottom_xx-large" : hostSelector + "[data-render-mode='shadow'] .slds-m-bottom_xx-large")), shadowSelector, " {margin-block-end: var(--slds-g-spacing-8, 3rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-left_none" : hostSelector + "[data-render-mode='shadow'] .slds-m-left_none")), shadowSelector, " {margin-inline-start: 0 !important;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-left_xxx-small" : hostSelector + "[data-render-mode='shadow'] .slds-m-left_xxx-small")), shadowSelector, " {margin-inline-start: calc(var(--slds-g-spacing-1, 0.25rem) / 2);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-left_xx-small" + shadowSelector + ",:host([data-render-mode='shadow'].slds-m-left_xx-small) {" : hostSelector + "[data-render-mode='shadow'] .slds-m-left_xx-small" + shadowSelector + "," + hostSelector + ".slds-m-left_xx-small[data-render-mode='shadow'] {")), "margin-inline-start: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-left_x-small" + shadowSelector + ",:host([data-render-mode='shadow'].slds-m-left_x-small) {" : hostSelector + "[data-render-mode='shadow'] .slds-m-left_x-small" + shadowSelector + "," + hostSelector + ".slds-m-left_x-small[data-render-mode='shadow'] {")), "margin-inline-start: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-left_small" : hostSelector + "[data-render-mode='shadow'] .slds-m-left_small")), shadowSelector, " {margin-inline-start: var(--slds-g-spacing-3, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-left_medium" : hostSelector + "[data-render-mode='shadow'] .slds-m-left_medium")), shadowSelector, " {margin-inline-start: var(--slds-g-spacing-4, 1rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-left_large" : hostSelector + "[data-render-mode='shadow'] .slds-m-left_large")), shadowSelector, " {margin-inline-start: var(--slds-g-spacing-5, 1.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-left_x-large" : hostSelector + "[data-render-mode='shadow'] .slds-m-left_x-large")), shadowSelector, " {margin-inline-start: var(--slds-g-spacing-6, 2rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-left_xx-large" + shadowSelector + ",:host([data-render-mode='shadow'].slds-m-left_xx-large) {" : hostSelector + "[data-render-mode='shadow'] .slds-m-left_xx-large" + shadowSelector + "," + hostSelector + ".slds-m-left_xx-large[data-render-mode='shadow'] {")), "margin-inline-start: var(--slds-g-spacing-8, 3rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-horizontal_none" + shadowSelector + ",:host([data-render-mode='shadow'].slds-m-horizontal_none) {" : hostSelector + "[data-render-mode='shadow'] .slds-m-horizontal_none" + shadowSelector + "," + hostSelector + ".slds-m-horizontal_none[data-render-mode='shadow'] {")), "margin-inline-start: 0 !important;margin-inline-end: 0 !important;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-horizontal_xxx-small" : hostSelector + "[data-render-mode='shadow'] .slds-m-horizontal_xxx-small")), shadowSelector, " {margin-inline-start: calc(var(--slds-g-spacing-1, 0.25rem) / 2);margin-inline-end: calc(var(--slds-g-spacing-1, 0.25rem) / 2);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-horizontal_xx-small" : hostSelector + "[data-render-mode='shadow'] .slds-m-horizontal_xx-small")), shadowSelector, " {margin-inline-start: var(--slds-g-spacing-1, 0.25rem);margin-inline-end: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-horizontal_x-small" : hostSelector + "[data-render-mode='shadow'] .slds-m-horizontal_x-small")), shadowSelector, " {margin-inline-start: var(--slds-g-spacing-2, 0.5rem);margin-inline-end: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-horizontal_small" : hostSelector + "[data-render-mode='shadow'] .slds-m-horizontal_small")), shadowSelector, " {margin-inline-start: var(--slds-g-spacing-3, 0.75rem);margin-inline-end: var(--slds-g-spacing-3, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-horizontal_medium" : hostSelector + "[data-render-mode='shadow'] .slds-m-horizontal_medium")), shadowSelector, " {margin-inline-start: var(--slds-g-spacing-4, 1rem);margin-inline-end: var(--slds-g-spacing-4, 1rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-horizontal_large" : hostSelector + "[data-render-mode='shadow'] .slds-m-horizontal_large")), shadowSelector, " {margin-inline-start: var(--slds-g-spacing-5, 1.5rem);margin-inline-end: var(--slds-g-spacing-5, 1.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-horizontal_x-large" : hostSelector + "[data-render-mode='shadow'] .slds-m-horizontal_x-large")), shadowSelector, " {margin-inline-start: var(--slds-g-spacing-6, 2rem);margin-inline-end: var(--slds-g-spacing-6, 2rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-horizontal_xx-large" : hostSelector + "[data-render-mode='shadow'] .slds-m-horizontal_xx-large")), shadowSelector, " {margin-inline-start: var(--slds-g-spacing-8, 3rem);margin-inline-end: var(--slds-g-spacing-8, 3rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-vertical_none" : hostSelector + "[data-render-mode='shadow'] .slds-m-vertical_none")), shadowSelector, " {margin-block-start: 0 !important;margin-block-end: 0 !important;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-vertical_xxx-small" : hostSelector + "[data-render-mode='shadow'] .slds-m-vertical_xxx-small")), shadowSelector, " {margin-block-start: calc(var(--slds-g-spacing-1, 0.25rem) / 2);margin-block-end: calc(var(--slds-g-spacing-1, 0.25rem) / 2);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-vertical_xx-small" : hostSelector + "[data-render-mode='shadow'] .slds-m-vertical_xx-small")), shadowSelector, " {margin-block-start: var(--slds-g-spacing-1, 0.25rem);margin-block-end: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-vertical_x-small" : hostSelector + "[data-render-mode='shadow'] .slds-m-vertical_x-small")), shadowSelector, " {margin-block-start: var(--slds-g-spacing-2, 0.5rem);margin-block-end: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-vertical_small" : hostSelector + "[data-render-mode='shadow'] .slds-m-vertical_small")), shadowSelector, " {margin-block-start: var(--slds-g-spacing-3, 0.75rem);margin-block-end: var(--slds-g-spacing-3, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-vertical_medium" : hostSelector + "[data-render-mode='shadow'] .slds-m-vertical_medium")), shadowSelector, " {margin-block-start: var(--slds-g-spacing-4, 1rem);margin-block-end: var(--slds-g-spacing-4, 1rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-vertical_large" : hostSelector + "[data-render-mode='shadow'] .slds-m-vertical_large")), shadowSelector, " {margin-block-start: var(--slds-g-spacing-5, 1.5rem);margin-block-end: var(--slds-g-spacing-5, 1.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-vertical_x-large" : hostSelector + "[data-render-mode='shadow'] .slds-m-vertical_x-large")), shadowSelector, " {margin-block-start: var(--slds-g-spacing-6, 2rem);margin-block-end: var(--slds-g-spacing-6, 2rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-vertical_xx-large" : hostSelector + "[data-render-mode='shadow'] .slds-m-vertical_xx-large")), shadowSelector, " {margin-block-start: var(--slds-g-spacing-8, 3rem);margin-block-end: var(--slds-g-spacing-8, 3rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-around_none" : hostSelector + "[data-render-mode='shadow'] .slds-m-around_none")), shadowSelector, " {margin: 0 !important;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-around_xxx-small" : hostSelector + "[data-render-mode='shadow'] .slds-m-around_xxx-small")), shadowSelector, " {margin: calc(var(--slds-g-spacing-1, 0.25rem) / 2);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-around_xx-small" + shadowSelector + ",:host([data-render-mode='shadow'].slds-m-around_xx-small) {" : hostSelector + "[data-render-mode='shadow'] .slds-m-around_xx-small" + shadowSelector + "," + hostSelector + ".slds-m-around_xx-small[data-render-mode='shadow'] {")), "margin: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-around_x-small" : hostSelector + "[data-render-mode='shadow'] .slds-m-around_x-small")), shadowSelector, " {margin: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-around_small" : hostSelector + "[data-render-mode='shadow'] .slds-m-around_small")), shadowSelector, " {margin: var(--slds-g-spacing-3, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-around_medium" + shadowSelector + ",:host([data-render-mode='shadow'].slds-m-around_medium) {" : hostSelector + "[data-render-mode='shadow'] .slds-m-around_medium" + shadowSelector + "," + hostSelector + ".slds-m-around_medium[data-render-mode='shadow'] {")), "margin: var(--slds-g-spacing-4, 1rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-around_large" + shadowSelector + ",:host([data-render-mode='shadow'].slds-m-around_large) {" : hostSelector + "[data-render-mode='shadow'] .slds-m-around_large" + shadowSelector + "," + hostSelector + ".slds-m-around_large[data-render-mode='shadow'] {")), "margin: var(--slds-g-spacing-5, 1.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-around_x-large" : hostSelector + "[data-render-mode='shadow'] .slds-m-around_x-large")), shadowSelector, " {margin: var(--slds-g-spacing-6, 2rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-m-around_xx-large" : hostSelector + "[data-render-mode='shadow'] .slds-m-around_xx-large")), shadowSelector, " {margin: var(--slds-g-spacing-8, 3rem);}"].join('');
  /*LWC compiler v9.5.3*/
}
var stylesheet1 = [stylesheet$3];

function stylesheet$2(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return [((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-top_none" : hostSelector + "[data-render-mode='shadow'] .slds-p-top_none")), shadowSelector, " {padding-block-start: 0 !important;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-top_xxx-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-top_xxx-small")), shadowSelector, " {padding-block-start: calc(var(--slds-g-spacing-1, 0.25rem) / 2);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-top_xx-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-top_xx-small")), shadowSelector, " {padding-block-start: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-top_x-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-top_x-small")), shadowSelector, " {padding-block-start: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-top_small" : hostSelector + "[data-render-mode='shadow'] .slds-p-top_small")), shadowSelector, " {padding-block-start: var(--slds-g-spacing-3, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-top_medium" : hostSelector + "[data-render-mode='shadow'] .slds-p-top_medium")), shadowSelector, " {padding-block-start: var(--slds-g-spacing-4, 1rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-top_large" : hostSelector + "[data-render-mode='shadow'] .slds-p-top_large")), shadowSelector, " {padding-block-start: var(--slds-g-spacing-5, 1.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-top_x-large" : hostSelector + "[data-render-mode='shadow'] .slds-p-top_x-large")), shadowSelector, " {padding-block-start: var(--slds-g-spacing-6, 2rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-top_xx-large" : hostSelector + "[data-render-mode='shadow'] .slds-p-top_xx-large")), shadowSelector, " {padding-block-start: var(--slds-g-spacing-8, 3rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-right_none" : hostSelector + "[data-render-mode='shadow'] .slds-p-right_none")), shadowSelector, " {padding-inline-end: 0 !important;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-right_xxx-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-right_xxx-small")), shadowSelector, " {padding-inline-end: calc(var(--slds-g-spacing-1, 0.25rem) / 2);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-right_xx-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-right_xx-small")), shadowSelector, " {padding-inline-end: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-right_x-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-right_x-small")), shadowSelector, " {padding-inline-end: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-right_small" + shadowSelector + ",:host([data-render-mode='shadow'].slds-p-right_small) {" : hostSelector + "[data-render-mode='shadow'] .slds-p-right_small" + shadowSelector + "," + hostSelector + ".slds-p-right_small[data-render-mode='shadow'] {")), "padding-inline-end: var(--slds-g-spacing-3, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-right_medium" + shadowSelector + ",:host([data-render-mode='shadow'].slds-p-right_medium) {" : hostSelector + "[data-render-mode='shadow'] .slds-p-right_medium" + shadowSelector + "," + hostSelector + ".slds-p-right_medium[data-render-mode='shadow'] {")), "padding-inline-end: var(--slds-g-spacing-4, 1rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-right_large" + shadowSelector + ",:host([data-render-mode='shadow'].slds-p-right_large) {" : hostSelector + "[data-render-mode='shadow'] .slds-p-right_large" + shadowSelector + "," + hostSelector + ".slds-p-right_large[data-render-mode='shadow'] {")), "padding-inline-end: var(--slds-g-spacing-5, 1.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-right_x-large" : hostSelector + "[data-render-mode='shadow'] .slds-p-right_x-large")), shadowSelector, " {padding-inline-end: var(--slds-g-spacing-6, 2rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-right_xx-large" : hostSelector + "[data-render-mode='shadow'] .slds-p-right_xx-large")), shadowSelector, " {padding-inline-end: var(--slds-g-spacing-8, 3rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-bottom_none" : hostSelector + "[data-render-mode='shadow'] .slds-p-bottom_none")), shadowSelector, " {padding-block-end: 0 !important;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-bottom_xxx-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-bottom_xxx-small")), shadowSelector, " {padding-block-end: calc(var(--slds-g-spacing-1, 0.25rem) / 2);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-bottom_xx-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-bottom_xx-small")), shadowSelector, " {padding-block-end: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-bottom_x-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-bottom_x-small")), shadowSelector, " {padding-block-end: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-bottom_small" : hostSelector + "[data-render-mode='shadow'] .slds-p-bottom_small")), shadowSelector, " {padding-block-end: var(--slds-g-spacing-3, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-bottom_medium" : hostSelector + "[data-render-mode='shadow'] .slds-p-bottom_medium")), shadowSelector, " {padding-block-end: var(--slds-g-spacing-4, 1rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-bottom_large" : hostSelector + "[data-render-mode='shadow'] .slds-p-bottom_large")), shadowSelector, " {padding-block-end: var(--slds-g-spacing-5, 1.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-bottom_x-large" : hostSelector + "[data-render-mode='shadow'] .slds-p-bottom_x-large")), shadowSelector, " {padding-block-end: var(--slds-g-spacing-6, 2rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-bottom_xx-large" : hostSelector + "[data-render-mode='shadow'] .slds-p-bottom_xx-large")), shadowSelector, " {padding-block-end: var(--slds-g-spacing-8, 3rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-left_none" : hostSelector + "[data-render-mode='shadow'] .slds-p-left_none")), shadowSelector, " {padding-inline-start: 0 !important;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-left_xxx-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-left_xxx-small")), shadowSelector, " {padding-inline-start: calc(var(--slds-g-spacing-1, 0.25rem) / 2);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-left_xx-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-left_xx-small")), shadowSelector, " {padding-inline-start: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-left_x-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-left_x-small")), shadowSelector, " {padding-inline-start: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-left_small" + shadowSelector + ",:host([data-render-mode='shadow'].slds-p-left_small) {" : hostSelector + "[data-render-mode='shadow'] .slds-p-left_small" + shadowSelector + "," + hostSelector + ".slds-p-left_small[data-render-mode='shadow'] {")), "padding-inline-start: var(--slds-g-spacing-3, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-left_medium" + shadowSelector + ",:host([data-render-mode='shadow'].slds-p-left_medium) {" : hostSelector + "[data-render-mode='shadow'] .slds-p-left_medium" + shadowSelector + "," + hostSelector + ".slds-p-left_medium[data-render-mode='shadow'] {")), "padding-inline-start: var(--slds-g-spacing-4, 1rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-left_large" + shadowSelector + ",:host([data-render-mode='shadow'].slds-p-left_large) {" : hostSelector + "[data-render-mode='shadow'] .slds-p-left_large" + shadowSelector + "," + hostSelector + ".slds-p-left_large[data-render-mode='shadow'] {")), "padding-inline-start: var(--slds-g-spacing-5, 1.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-left_x-large" : hostSelector + "[data-render-mode='shadow'] .slds-p-left_x-large")), shadowSelector, " {padding-inline-start: var(--slds-g-spacing-6, 2rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-left_xx-large" : hostSelector + "[data-render-mode='shadow'] .slds-p-left_xx-large")), shadowSelector, " {padding-inline-start: var(--slds-g-spacing-8, 3rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-horizontal_none" : hostSelector + "[data-render-mode='shadow'] .slds-p-horizontal_none")), shadowSelector, " {padding-inline-start: 0 !important;padding-inline-end: 0 !important;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-horizontal_xxx-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-horizontal_xxx-small")), shadowSelector, " {padding-inline-start: calc(var(--slds-g-spacing-1, 0.25rem) / 2);padding-inline-end: calc(var(--slds-g-spacing-1, 0.25rem) / 2);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-horizontal_xx-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-horizontal_xx-small")), shadowSelector, " {padding-inline-start: var(--slds-g-spacing-1, 0.25rem);padding-inline-end: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-horizontal_x-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-horizontal_x-small")), shadowSelector, " {padding-inline-start: var(--slds-g-spacing-2, 0.5rem);padding-inline-end: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-horizontal_small" : hostSelector + "[data-render-mode='shadow'] .slds-p-horizontal_small")), shadowSelector, " {padding-inline-start: var(--slds-g-spacing-3, 0.75rem);padding-inline-end: var(--slds-g-spacing-3, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-horizontal_medium" : hostSelector + "[data-render-mode='shadow'] .slds-p-horizontal_medium")), shadowSelector, " {padding-inline-start: var(--slds-g-spacing-4, 1rem);padding-inline-end: var(--slds-g-spacing-4, 1rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-horizontal_large" : hostSelector + "[data-render-mode='shadow'] .slds-p-horizontal_large")), shadowSelector, " {padding-inline-start: var(--slds-g-spacing-5, 1.5rem);padding-inline-end: var(--slds-g-spacing-5, 1.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-horizontal_x-large" : hostSelector + "[data-render-mode='shadow'] .slds-p-horizontal_x-large")), shadowSelector, " {padding-inline-start: var(--slds-g-spacing-6, 2rem);padding-inline-end: var(--slds-g-spacing-6, 2rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-horizontal_xx-large" : hostSelector + "[data-render-mode='shadow'] .slds-p-horizontal_xx-large")), shadowSelector, " {padding-inline-start: var(--slds-g-spacing-8, 3rem);padding-inline-end: var(--slds-g-spacing-8, 3rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-vertical_none" : hostSelector + "[data-render-mode='shadow'] .slds-p-vertical_none")), shadowSelector, " {padding-block-start: 0 !important;padding-block-end: 0 !important;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-vertical_xxx-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-vertical_xxx-small")), shadowSelector, " {padding-block-start: calc(var(--slds-g-spacing-1, 0.25rem) / 2);padding-block-end: calc(var(--slds-g-spacing-1, 0.25rem) / 2);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-vertical_xx-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-vertical_xx-small")), shadowSelector, " {padding-block-start: var(--slds-g-spacing-1, 0.25rem);padding-block-end: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-vertical_x-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-vertical_x-small")), shadowSelector, " {padding-block-start: var(--slds-g-spacing-2, 0.5rem);padding-block-end: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-vertical_small" : hostSelector + "[data-render-mode='shadow'] .slds-p-vertical_small")), shadowSelector, " {padding-block-start: var(--slds-g-spacing-3, 0.75rem);padding-block-end: var(--slds-g-spacing-3, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-vertical_medium" : hostSelector + "[data-render-mode='shadow'] .slds-p-vertical_medium")), shadowSelector, " {padding-block-start: var(--slds-g-spacing-4, 1rem);padding-block-end: var(--slds-g-spacing-4, 1rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-vertical_large" : hostSelector + "[data-render-mode='shadow'] .slds-p-vertical_large")), shadowSelector, " {padding-block-start: var(--slds-g-spacing-5, 1.5rem);padding-block-end: var(--slds-g-spacing-5, 1.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-vertical_x-large" : hostSelector + "[data-render-mode='shadow'] .slds-p-vertical_x-large")), shadowSelector, " {padding-block-start: var(--slds-g-spacing-6, 2rem);padding-block-end: var(--slds-g-spacing-6, 2rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-vertical_xx-large" : hostSelector + "[data-render-mode='shadow'] .slds-p-vertical_xx-large")), shadowSelector, " {padding-block-start: var(--slds-g-spacing-8, 3rem);padding-block-end: var(--slds-g-spacing-8, 3rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-around_none" : hostSelector + "[data-render-mode='shadow'] .slds-p-around_none")), shadowSelector, " {padding: 0 !important;}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-around_xxx-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-around_xxx-small")), shadowSelector, " {padding: calc(var(--slds-g-spacing-1, 0.25rem) / 2);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-around_xx-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-around_xx-small")), shadowSelector, " {padding: var(--slds-g-spacing-1, 0.25rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-around_x-small" : hostSelector + "[data-render-mode='shadow'] .slds-p-around_x-small")), shadowSelector, " {padding: var(--slds-g-spacing-2, 0.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-around_small" + shadowSelector + ",:host([data-render-mode='shadow'].slds-p-around_small) {" : hostSelector + "[data-render-mode='shadow'] .slds-p-around_small" + shadowSelector + "," + hostSelector + ".slds-p-around_small[data-render-mode='shadow'] {")), "padding: var(--slds-g-spacing-3, 0.75rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-around_medium" + shadowSelector + ",:host([data-render-mode='shadow'].slds-p-around_medium) {" : hostSelector + "[data-render-mode='shadow'] .slds-p-around_medium" + shadowSelector + "," + hostSelector + ".slds-p-around_medium[data-render-mode='shadow'] {")), "padding: var(--sds-spacing-4, 1rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-around_large" + shadowSelector + ",:host([data-render-mode='shadow'].slds-p-around_large) {" : hostSelector + "[data-render-mode='shadow'] .slds-p-around_large" + shadowSelector + "," + hostSelector + ".slds-p-around_large[data-render-mode='shadow'] {")), "padding: var(--sds-spacing-5, 1.5rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-around_x-large" : hostSelector + "[data-render-mode='shadow'] .slds-p-around_x-large")), shadowSelector, " {padding: var(--sds-spacing-6, 2rem);}", ((useActualHostSelector ? ":host([data-render-mode='shadow']) .slds-p-around_xx-large" : hostSelector + "[data-render-mode='shadow'] .slds-p-around_xx-large")), shadowSelector, " {padding: var(--sds-spacing-8, 3rem);}"].join('');
  /*LWC compiler v9.5.3*/
}
var stylesheet2 = [stylesheet$2];

function stylesheet$1(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) {" : hostSelector + "[data-render-mode=\"shadow\"] {")) + "display: inline-flex;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='boundary']" : hostSelector + "[data-render-mode=\"shadow\"] [part~='boundary']")) + shadowSelector + " {padding-block-start: var(\n --sds-c-icon-spacing-blockstart,\n var(--sds-c-icon-spacing-block, var(--sds-c-icon-spacing, var(--slds-s-icon-spacing)))\n );padding-block-end: var(\n --sds-c-icon-spacing-blockend,\n var(--sds-c-icon-spacing-block, var(--sds-c-icon-spacing, var(--slds-s-icon-spacing)))\n );padding-inline-start: var(\n --sds-c-icon-spacing-inlinestart,\n var(--sds-c-icon-spacing-inline, var(--sds-c-icon-spacing, var(--slds-s-icon-spacing)))\n );padding-inline-end: var(\n --sds-c-icon-spacing-inlineend,\n var(--sds-c-icon-spacing-inline, var(--sds-c-icon-spacing, var(--slds-s-icon-spacing)))\n );border-radius: var(--sds-c-icon-radius-border, var(--slds-s-icon-radius-border));border-width: var(--sds-c-icon-sizing-border, var(--slds-s-icon-sizing-border));border-style: solid;border-color: var(--sds-c-icon-color-border, var(--slds-s-icon-color-border, transparent));background-color: var(--sds-c-icon-color-background, var(--slds-s-icon-color-background));}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part~='icon']" : hostSelector + "[data-render-mode=\"shadow\"] [part~='icon']")) + shadowSelector + " {display: flex;height: var(--sds-c-icon-sizing-height, var(--sds-c-icon-sizing, var(--slds-s-icon-sizing)));width: var(--sds-c-icon-sizing-width, var(--sds-c-icon-sizing, var(--slds-s-icon-sizing)));color: var(--sds-c-icon-color-foreground, var(--slds-s-icon-color-foreground));}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) svg" : hostSelector + "[data-render-mode=\"shadow\"] svg")) + shadowSelector + " {width: 100%;height: 100%;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) {" : hostSelector + "[data-render-mode=\"shadow\"] {")) + "vertical-align: middle;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][size='xxx-small']),:host([data-render-mode=\"shadow\"]) .slds-icon_xxx-small" : hostSelector + "[size='xxx-small'][data-render-mode=\"shadow\"]," + hostSelector + "[data-render-mode=\"shadow\"] .slds-icon_xxx-small")) + shadowSelector + " {--slds-c-icon-sizing: var(--slds-g-sizing-3, 0.5rem);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][size='xx-small']),:host([data-render-mode=\"shadow\"]) .slds-icon_xx-small" : hostSelector + "[size='xx-small'][data-render-mode=\"shadow\"]," + hostSelector + "[data-render-mode=\"shadow\"] .slds-icon_xx-small")) + shadowSelector + " {--slds-c-icon-sizing: calc(var(--slds-g-sizing-1, 0.125rem) + var(--slds-g-sizing-4, 0.75rem));}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][size='x-small']),:host([data-render-mode=\"shadow\"]) .slds-icon_x-small" : hostSelector + "[size='x-small'][data-render-mode=\"shadow\"]," + hostSelector + "[data-render-mode=\"shadow\"] .slds-icon_x-small")) + shadowSelector + " {--slds-c-icon-sizing: var(--slds-g-sizing-5, 1rem);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][size='small']),:host([data-render-mode=\"shadow\"]) .slds-icon_small" : hostSelector + "[size='small'][data-render-mode=\"shadow\"]," + hostSelector + "[data-render-mode=\"shadow\"] .slds-icon_small")) + shadowSelector + " {--slds-c-icon-sizing: var(--slds-g-sizing-7, 1.5rem);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][size='large']),:host([data-render-mode=\"shadow\"]) .slds-icon_large" : hostSelector + "[size='large'][data-render-mode=\"shadow\"]," + hostSelector + "[data-render-mode=\"shadow\"] .slds-icon_large")) + shadowSelector + " {--slds-c-icon-sizing: var(--slds-g-sizing-10, 3rem);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='warning']) {" : hostSelector + "[variant='warning'][data-render-mode=\"shadow\"] {")) + "--slds-c-icon-color-foreground: var(--slds-g-color-warning-1, #fe9339);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='success']) {" : hostSelector + "[variant='success'][data-render-mode=\"shadow\"] {")) + "--slds-c-icon-color-foreground: var(--slds-g-color-success-1, #2e844a);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='error']) {" : hostSelector + "[variant='error'][data-render-mode=\"shadow\"] {")) + "--slds-c-icon-color-foreground: var(--slds-g-color-error-1, #ba0517);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][variant='light']) {" : hostSelector + "[variant='light'][data-render-mode=\"shadow\"] {")) + "--slds-c-icon-color-foreground: var(--slds-g-color-neutral-base-70, #aeaeae);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='boundary']" : hostSelector + "[data-render-mode=\"shadow\"] [part='boundary']")) + shadowSelector + " {--sds-c-icon-radius-border: var(--slds-c-icon-radius-border, var(--slds-g-radius-border-2, 0.25rem));--sds-c-icon-sizing-border: var(--slds-c-icon-sizing-border, 0);--sds-c-icon-color-border: var(--slds-c-icon-color-border);--sds-c-icon-spacing-block-start: var(--slds-c-icon-spacing-blockstart, var(--slds-c-icon-spacing-block));--sds-c-icon-spacing-block-end: var(--slds-c-icon-spacing-blockend, var(--slds-c-icon-spacing-block));--sds-c-icon-spacing-inline-start: var(\n --slds-c-icon-spacing-inlinestart,\n var(--slds-c-icon-spacing-inline)\n );--sds-c-icon-spacing-inline-end: var(--slds-c-icon-spacing-inlineend, var(--slds-c-icon-spacing-inline));display: inline-flex;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-input__icon" : hostSelector + "[data-render-mode=\"shadow\"] .slds-input__icon")) + shadowSelector + " [part='boundary']" + shadowSelector + " {border-style: none;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) [part='icon']" : hostSelector + "[data-render-mode=\"shadow\"] [part='icon']")) + shadowSelector + " {--sds-c-icon-color-foreground: var(--slds-c-icon-color-foreground, var(--slds-g-color-on-accent-1, var(--slds-g-color-brand-base-100)));--sds-c-icon-sizing-height: var(\n --slds-c-icon-sizing-height,\n var(--slds-c-icon-sizing, var(--slds-g-sizing-9, 2rem))\n );--sds-c-icon-sizing-width: var(\n --slds-c-icon-sizing-width,\n var(--slds-c-icon-sizing, var(--slds-g-sizing-9, 2rem))\n );}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][icon-name*='action']),:host([data-render-mode=\"shadow\"]) .slds-icon_container_circle" : hostSelector + "[icon-name*='action'][data-render-mode=\"shadow\"]," + hostSelector + "[data-render-mode=\"shadow\"] .slds-icon_container_circle")) + shadowSelector + " {--slds-c-icon-spacing-block: var(--slds-g-sizing-3, 0.5rem);--slds-c-icon-spacing-inline: var(--slds-g-sizing-3, 0.5rem);--slds-c-icon-radius-border: calc(var(--slds-g-radius-border-circle, 100%) / 2);--slds-c-icon-sizing-border: var(--slds-g-sizing-3, 0.5rem);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-icon" : hostSelector + "[data-render-mode=\"shadow\"] .slds-icon")) + shadowSelector + " {display: inline-flex;height: var(\n --slds-c-icon-sizing-height,\n var(--slds-c-icon-sizing, var(--slds-s-icon-sizing, var(--slds-g-sizing-9, 2rem)))\n );width: var(\n --slds-c-icon-sizing-width,\n var(--slds-c-icon-sizing, var(--slds-s-icon-sizing, var(--slds-g-sizing-9, 2rem)))\n );fill: var(--slds-c-icon-color-foreground, var(--slds-g-color-neutral-base-100, #ffffff));}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-icon-text-default" : hostSelector + "[data-render-mode=\"shadow\"] .slds-icon-text-default")) + shadowSelector + " {--slds-c-icon-color-foreground: var(\n --slds-c-icon-color-foreground-default,\n var(--sds-c-icon-color-foreground-default, var(--slds-g-color-on-surface-1, #747474))\n );}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-icon-text-default.slds-is-disabled" : hostSelector + "[data-render-mode=\"shadow\"] .slds-icon-text-default.slds-is-disabled")) + shadowSelector + " {fill: var(--slds-g-color-disabled-1, #c9c9c9);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-assistive-text" : hostSelector + "[data-render-mode=\"shadow\"] .slds-assistive-text")) + shadowSelector + " {position: absolute !important;margin: -1px !important;border: 0 !important;padding: 0 !important;width: 1px !important;height: 1px !important;overflow: hidden !important;clip: rect(0 0 0 0) !important;text-transform: none !important;white-space: nowrap !important;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-icon_disabled" : hostSelector + "[data-render-mode=\"shadow\"] .slds-icon_disabled")) + shadowSelector + " {background-color: currentcolor;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-input__icon" : hostSelector + "[data-render-mode=\"shadow\"] .slds-input__icon")) + shadowSelector + " {--slds-c-icon-sizing: calc(var(--slds-g-sizing-1, 0.125rem) + var(--slds-g-sizing-4, 0.75rem));position: absolute;top: 50%;margin-block-start: -0.4375rem;line-height: var(--slds-g-font-lineheight-1, 1);border: 0;z-index: 2;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][data-input-pill-search-primicon]) .slds-icon" : hostSelector + "[data-input-pill-search-primicon][data-render-mode=\"shadow\"] .slds-icon")) + shadowSelector + " {--sds-c-icon-sizing-height: 1.25rem;--sds-c-icon-sizing-width: 1.25rem;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][data-input-pill-close-primicon]) [part='icon']" : hostSelector + "[data-input-pill-close-primicon][data-render-mode=\"shadow\"] [part='icon']")) + shadowSelector + " {--sds-c-icon-color-foreground: none;}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"][data-input-pill-close-primicon]) [part='icon']:hover" : hostSelector + "[data-input-pill-close-primicon][data-render-mode=\"shadow\"] [part='icon']:hover")) + shadowSelector + " {--sds-c-icon-color-foreground: var(--slds-g-color-accent-4);}" + ((useActualHostSelector ? ":host([data-render-mode=\"shadow\"]) .slds-icon_container" : hostSelector + "[data-render-mode=\"shadow\"] .slds-icon_container")) + shadowSelector + " {border-radius: var(--slds-c-icon-radius-border, var(--slds-s-icon-radius-border));background-color: var(\n --slds-c-icon-color-background,\n var(--slds-s-icon-color-background, var(--sds-c-icon-color-background))\n );}";
  /*LWC compiler v9.5.3*/
}
var stylesheet3 = [stylesheet$1];

var stylesheet0 = [stylesheet0$6, stylesheet1, stylesheet2, stylesheet3];

function stylesheet(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  return ".private-dt-sort-icon" + shadowSelector + " {display: inline-block;}";
  /*LWC compiler v9.5.3*/
}
var iconStylesheets = [stylesheet0, stylesheet];

const $fragment1$2 = parseFragment`<svg${"c0"} focusable="false"${"a0:data-key"} aria-hidden="true" part="icon"${2}><use${"a1:href"}${3}/></svg>`;
function tmpl$5($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, fid: api_scoped_frag_id, sp: api_static_part, st: api_static_fragment} = $api;
  return [api_static_fragment($fragment1$2, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.computedClass),
    attrs: {
      "data-key": $cmp.name
    }
  }, null), api_static_part(1, {
    attrs: {
      "href": sanitizeAttribute("use", "http://www.w3.org/2000/svg", "href", api_scoped_frag_id($cmp.href))
    }
  }, null)])];
  /*LWC compiler v9.5.3*/
}
var _tmpl$5 = registerTemplate(tmpl$5);
tmpl$5.stylesheets = [];
tmpl$5.stylesheetToken = "lwc-25f9lgh55ct";
if (iconStylesheets) {
  tmpl$5.stylesheets.push.apply(tmpl$5.stylesheets, iconStylesheets);
}
freezeTemplate(tmpl$5);

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
var labelSecondsLater = "in a few seconds";

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
var labelSecondsAgo = "a few seconds ago";

const fallbackFutureLabel = 'in {0} {1}';
const fallbackPastLabel = '{0} {1} ago';
const fallbackPluralSuffix = 's';
const units = {
  SECONDS: {
    name: 'second',
    threshold: 45
  },
  MINUTES: {
    name: 'minute',
    threshold: 45
  },
  HOURS: {
    name: 'hour',
    threshold: 22
  },
  DAYS: {
    name: 'day',
    threshold: 26
  },
  MONTHS: {
    name: 'month',
    threshold: 11
  },
  YEARS: {
    name: 'year'
  }
};
const SECOND_TO_MILLISECONDS = 1000;
const MINUTE_TO_MILLISECONDS = 6e4;
const HOUR_TO_MILLISECONDS = 36e5;
const DAY_TO_MILLISECONDS = 864e5;
class Duration {
  constructor(milliseconds) {
    this.milliseconds = 0;
    if (typeof milliseconds !== 'number') {
      this.isValid = false;
      console.warn(`The value of milliseconds passed into Duration must be of type number,
                but we are getting the ${typeof milliseconds} value "${milliseconds}" instead.
                `);
      return;
    }
    this.isValid = true;
    this.milliseconds = milliseconds;
  }
  humanize(locale) {
    if (!this.isValid) {
      return '';
    }
    const unit = findBestUnitMatch(this);
    if (unit === units.SECONDS) {
      const isLater = this.milliseconds > 0;
      return isLater ? labelSecondsLater : labelSecondsAgo;
    }
    return format(locale, this.asIn(unit), unit.name);
  }
  asIn(unit) {
    switch (unit) {
      case units.SECONDS:
        return Math.round(this.milliseconds / SECOND_TO_MILLISECONDS);
      case units.MINUTES:
        return Math.round(this.milliseconds / MINUTE_TO_MILLISECONDS);
      case units.HOURS:
        return Math.round(this.milliseconds / HOUR_TO_MILLISECONDS);
      case units.DAYS:
        return Math.round(this.milliseconds / DAY_TO_MILLISECONDS);
      case units.MONTHS:
        return Math.round(daysToMonth(this.milliseconds / DAY_TO_MILLISECONDS));
      case units.YEARS:
      default:
        return Math.round(daysToMonth(this.milliseconds / DAY_TO_MILLISECONDS) / 12);
    }
  }
}
const __lwc_component_class_internal$8 = registerComponent(Duration, {
  tmpl: _tmpl$8,
  sel: "lightning-config-provider",
  apiVersion: 66
});
function daysToMonth(days) {
  const daysToMonthRatio = 4800 / 146097;
  return days * daysToMonthRatio;
}
function findBestUnitMatch(duration) {
  const match = Object.keys(units).find(key => {
    const unit = units[key];
    return unit === units.YEARS || Math.abs(duration.asIn(unit)) < unit.threshold;
  });
  return units[match];
}
function format(locale, value, unit) {
  if (Intl && Intl.RelativeTimeFormat) {
    const formatter = new Intl.RelativeTimeFormat(locale, {
      style: 'long',
      numeric: 'always'
    });
    return formatter.format(value, unit);
  }
  return fallbackFormatter(value, unit);
}
function fallbackFormatter(value, unit) {
  console.warn(`The current environment does not support formatters for relative time.`);
  const absoluteValue = Math.abs(value);
  const unitString = absoluteValue !== 1 ? unit + fallbackPluralSuffix : unit;
  const label = value > 0 ? fallbackFutureLabel : fallbackPastLabel;
  return formatLabel(label, absoluteValue, unitString);
}

registerComponent(JSON.parse('{"adlm":"𞥐𞥑𞥒𞥓𞥔𞥕𞥖𞥗𞥘𞥙","ahom":"𑜰𑜱𑜲𑜳𑜴𑜵𑜶𑜷𑜸𑜹","arab":"٠١٢٣٤٥٦٧٨٩","arabext":"۰۱۲۳۴۵۶۷۸۹","bali":"᭐᭑᭒᭓᭔᭕᭖᭗᭘᭙","beng":"০১২৩৪৫৬৭৮৯","bhks":"𑱐𑱑𑱒𑱓𑱔𑱕𑱖𑱗𑱘𑱙","brah":"𑁦𑁧𑁨𑁩𑁪𑁫𑁬𑁭𑁮𑁯","cakm":"𑄶𑄷𑄸𑄹𑄺𑄻𑄼𑄽𑄾𑄿","cham":"꩐꩑꩒꩓꩔꩕꩖꩗꩘꩙","deva":"०१२३४५६७८९","fullwide":"０１２３４５６７８９","gong":"𑶠𑶡𑶢𑶣𑶤𑶥𑶦𑶧𑶨𑶩","gonm":"𑵐𑵑𑵒𑵓𑵔𑵕𑵖𑵗𑵘𑵙","gujr":"૦૧૨૩૪૫૬૭૮૯","guru":"੦੧੨੩੪੫੬੭੮੯","hanidec":"〇一二三四五六七八九","hmng":"𖭐𖭑𖭒𖭓𖭔𖭕𖭖𖭗𖭘𖭙","hmnp":"𞅀𞅁𞅂𞅃𞅄𞅅𞅆𞅇𞅈𞅉","java":"꧐꧑꧒꧓꧔꧕꧖꧗꧘꧙","kali":"꤀꤁꤂꤃꤄꤅꤆꤇꤈꤉","khmr":"០១២៣៤៥៦៧៨៩","knda":"೦೧೨೩೪೫೬೭೮೯","lana":"᪀᪁᪂᪃᪄᪅᪆᪇᪈᪉","lanatham":"᪐᪑᪒᪓᪔᪕᪖᪗᪘᪙","laoo":"໐໑໒໓໔໕໖໗໘໙","latn":"0123456789","lepc":"᱀᱁᱂᱃᱄᱅᱆᱇᱈᱉","limb":"᥆᥇᥈᥉᥊᥋᥌᥍᥎᥏","mathbold":"𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗","mathdbl":"𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡","mathmono":"𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿","mathsanb":"𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵","mathsans":"𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫","mlym":"൦൧൨൩൪൫൬൭൮൯","modi":"𑙐𑙑𑙒𑙓𑙔𑙕𑙖𑙗𑙘𑙙","mong":"᠐᠑᠒᠓᠔᠕᠖᠗᠘᠙","mroo":"𖩠𖩡𖩢𖩣𖩤𖩥𖩦𖩧𖩨𖩩","mtei":"꯰꯱꯲꯳꯴꯵꯶꯷꯸꯹","mymr":"၀၁၂၃၄၅၆၇၈၉","mymrshan":"႐႑႒႓႔႕႖႗႘႙","mymrtlng":"꧰꧱꧲꧳꧴꧵꧶꧷꧸꧹","newa":"𑑐𑑑𑑒𑑓𑑔𑑕𑑖𑑗𑑘𑑙","nkoo":"߀߁߂߃߄߅߆߇߈߉","olck":"᱐᱑᱒᱓᱔᱕᱖᱗᱘᱙","orya":"୦୧୨୩୪୫୬୭୮୯","osma":"𐒠𐒡𐒢𐒣𐒤𐒥𐒦𐒧𐒨𐒩","rohg":"𐴰𐴱𐴲𐴳𐴴𐴵𐴶𐴷𐴸𐴹","saur":"꣐꣑꣒꣓꣔꣕꣖꣗꣘꣙","shrd":"𑇐𑇑𑇒𑇓𑇔𑇕𑇖𑇗𑇘𑇙","sind":"𑋰𑋱𑋲𑋳𑋴𑋵𑋶𑋷𑋸𑋹","sinh":"෦෧෨෩෪෫෬෭෮෯","sora":"𑃰𑃱𑃲𑃳𑃴𑃵𑃶𑃷𑃸𑃹","sund":"᮰᮱᮲᮳᮴᮵᮶᮷᮸᮹","takr":"𑛀𑛁𑛂𑛃𑛄𑛅𑛆𑛇𑛈𑛉","talu":"᧐᧑᧒᧓᧔᧕᧖᧗᧘᧙","tamldec":"௦௧௨௩௪௫௬௭௮௯","telu":"౦౧౨౩౪౫౬౭౮౯","thai":"๐๑๒๓๔๕๖๗๘๙","tibt":"༠༡༢༣༤༥༦༧༨༩","tirh":"𑓐𑓑𑓒𑓓𑓔𑓕𑓖𑓗𑓘𑓙","vaii":"꘠꘡꘢꘣꘤꘥꘦꘧꘨꘩","wara":"𑣠𑣡𑣢𑣣𑣤𑣥𑣦𑣧𑣨𑣩","wcho":"𞋰𞋱𞋲𞋳𞋴𞋵𞋶𞋷𞋸𞋹"}'), {
  tmpl: _tmpl$8,
  sel: "package-scoped-imports",
  apiVersion: 66
});

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DATE_FORMAT = {
  short: 'M/d/yy',
  medium: 'MMM d, y',
  long: 'MMMM d, y'
};
const TIME_FORMAT = {
  short: 'h:mm a',
  medium: 'h:mm:ss a',
  long: 'h:mm:ss a'
};
const TIME_FORMAT_SIMPLE = {
  short: 'h:m a',
  medium: 'h:m:s a',
  long: 'h:m:s a'
};
function formatDate(value, format) {
  let isUTC = false;
  let dateString = value;
  if (typeof value === 'string') {
    dateString = value.split(TIME_SEPARATOR)[0];
    isUTC = true;
  }
  return formatDateInternal(dateString, format, isUTC);
}
function formatDateUTC(value, format) {
  return formatDateInternal(value, format, true);
}
function formatTime(date, format) {
  if (!isDate(date)) {
    return new Date('');
  }
  const hours = (date.getHours() + 11) % 12 + 1;
  const suffix = date.getHours() >= 12 ? 'PM' : 'AM';
  switch (format) {
    case STANDARD_TIME_FORMAT:
      return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${doublePad(date.getMilliseconds())}`;
    case TIME_FORMAT.short:
      return `${hours}:${pad(date.getMinutes())} ${suffix}`;
    case TIME_FORMAT.medium:
    case TIME_FORMAT.long:
    default:
      return `${hours}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${suffix}`;
  }
}
function formatDateTimeUTC(value) {
  if (!isDate(value)) {
    return new Date('');
  }
  const date = new Date(value.getTime());
  return `${formatDateUTC(date)}, ${formatTime(addTimezoneOffset(date))}`;
}
function parseDateTimeISO8601(value) {
  let isoString = null;
  let shouldAddOffset = true;
  if (isValidISOTimeString(value)) {
    isoString = `${getTodayInISO()}T${addTimezoneSuffix(value)}`;
  } else if (isValidISODateTimeString(value)) {
    if (value.indexOf(TIME_SEPARATOR) > 0) {
      isoString = addTimezoneSuffix(value);
      shouldAddOffset = false;
    } else {
      isoString = `${value}T00:00:00.000Z`;
    }
  }
  if (isoString) {
    const parsedDate = new Date(isoString);
    if (shouldAddOffset) {
      addTimezoneOffset(parsedDate);
    }
    return parsedDate;
  }
  return null;
}
function parseDateTime(value, format) {
  if (format === STANDARD_DATE_FORMAT && isValidISODateTimeString(value)) {
    return parseDateTimeISO8601(value);
  }
  if (Object.values(DATE_FORMAT).includes(format)) {
    return parseFormattedDate(value, format);
  }
  if (Object.values(TIME_FORMAT_SIMPLE).includes(format)) {
    return parseFormattedTime(value);
  }
  return null;
}
function parseDateTimeUTC(value) {
  return parseDateTimeISO8601(addTimezoneSuffix(value));
}
function isBefore(date1, date2, unit) {
  const normalizedDate1 = getDate(date1);
  const normalizedDate2 = getDate(date2);
  if (!normalizedDate1 || !normalizedDate2) {
    return false;
  }
  return startOf(normalizedDate1, unit).getTime() < startOf(normalizedDate2, unit).getTime();
}
function isAfter(date1, date2, unit) {
  const normalizedDate1 = getDate(date1);
  const normalizedDate2 = getDate(date2);
  if (!normalizedDate1 || !normalizedDate2) {
    return false;
  }
  return startOf(normalizedDate1, unit).getTime() > startOf(normalizedDate2, unit).getTime();
}
function UTCToWallTime(date, timezone, callback) {
  const utcDate = new Date(date.getTime());
  callback(subtractTimezoneOffset(utcDate));
}
function WallTimeToUTC(date, timezone, callback) {
  const localDate = new Date(date.getTime());
  callback(addTimezoneOffset(localDate));
}
function translateToOtherCalendar(date) {
  return date;
}
function translateFromOtherCalendar(date) {
  return date;
}
function translateToLocalizedDigits(input) {
  return input;
}
function translateFromLocalizedDigits(input) {
  return input;
}
function getNumberFormat() {
  return {
    format: value => {
      console.warn(`The current environment does not support large numbers and the original value of ${value} will be returned.`);
      return value;
    }
  };
}
function duration(minutes) {
  return new __lwc_component_class_internal$8(minutes * 60 * 1000);
}
function displayDuration(value, withSuffix, localeParam = 'en') {
  return value.humanize(localeParam);
}
function parseFormattedTime(value) {
  const values = value.trim().split(/[:.\s*]/);
  const length = values.length;
  if (!values || length < 2 || length > 5) {
    return null;
  }
  const ampm = values[length - 1];
  const isBeforeNoon = ampm.toLowerCase() === 'am';
  const isAfternoon = ampm.toLowerCase() === 'pm';
  values.splice(-1, 1);
  const allNumbers = values.every(item => !isNaN(item));
  if (!isAfternoon && !isBeforeNoon || !allNumbers) {
    return null;
  }
  const hours = values[0];
  const hour24 = pad(isAfternoon ? hours % 12 + 12 : hours % 12);
  const minutes = length >= 3 && values[1] || '0';
  const seconds = length >= 4 && values[2] || '0';
  const milliseconds = length === 5 && values[3] || '0';
  const newDate = new Date(getTodayInISO());
  newDate.setHours(hour24, minutes, seconds, milliseconds);
  return isDate(newDate) ? newDate : null;
}
function parseFormattedDate(value, format) {
  let pattern = /^([a-zA-Z]{3})\s*(\d{1,2}),\s*(\d{4})$/;
  switch (format) {
    case DATE_FORMAT.short:
      pattern = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/;
      break;
    case DATE_FORMAT.long:
      pattern = /^([a-zA-Z]+)\s*(\d{1,2}),\s*(\d{4})$/;
      break;
  }
  const match = pattern.exec(value.trim());
  if (!match) {
    return null;
  }
  let month = match[1];
  const day = match[2];
  const year = match[3];
  if (format !== DATE_FORMAT.short) {
    month = MONTH_NAMES.findIndex(item => item.toLowerCase().includes(month.toLowerCase()));
    month += 1;
  }
  const isoValue = `${year}-${pad(month)}-${pad(day)}`;
  const newDate = new Date(`${isoValue}T00:00:00.000Z`);
  return isDate(newDate) ? addTimezoneOffset(newDate) : null;
}
function formatDateInternal(value, format, isUTC) {
  const date = getDate(value);
  if (!date) {
    return new Date('');
  }
  if (isUTC && isDate(value)) {
    addTimezoneOffset(date);
  }
  switch (format) {
    case STANDARD_DATE_FORMAT:
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    case DATE_FORMAT.short:
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear() % 100}`;
    case DATE_FORMAT.long:
      return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    case DATE_FORMAT.medium:
    default:
      {
        const shortMonthName = MONTH_NAMES[date.getMonth()].substring(0, 3);
        return `${shortMonthName} ${date.getDate()}, ${date.getFullYear()}`;
      }
  }
}
function startOf(date, unit) {
  switch (unit) {
    case 'day':
      date.setHours(0);
      date.setMinutes(0);
    case 'minute':
      date.setSeconds(0);
      date.setMilliseconds(0);
      break;
  }
  return date;
}
function isDate(value) {
  return Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime());
}
function addTimezoneSuffix(value) {
  return removeTimeZoneSuffix(value) + 'Z';
}
function addTimezoneOffset(date) {
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  return date;
}
function subtractTimezoneOffset(date) {
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date;
}
function getDate(value) {
  if (!value) {
    return null;
  }
  if (isDate(value)) {
    return new Date(value.getTime());
  }
  if (isFinite(value) && (typeof value === 'number' || typeof value === 'string')) {
    return new Date(parseInt(value, 10));
  }
  if (typeof value === 'string') {
    return parseDateTimeISO8601(value);
  }
  return null;
}
function getTodayInISO() {
  return new Date().toISOString().split('T')[0];
}
function pad(n) {
  return Number(n) < 10 ? '0' + n : n;
}
function doublePad(n) {
  return Number(n) < 10 ? '00' + n : Number(n) < 100 ? '0' + n : n;
}
var localizationService = {
  formatDate,
  formatDateUTC,
  formatTime,
  formatDateTimeUTC,
  parseDateTimeISO8601,
  parseDateTime,
  parseDateTimeUTC,
  isBefore,
  isAfter,
  UTCToWallTime,
  WallTimeToUTC,
  translateToOtherCalendar,
  translateFromOtherCalendar,
  translateToLocalizedDigits,
  translateFromLocalizedDigits,
  getNumberFormat,
  duration,
  displayDuration
};

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
function getConfigFromAura($A) {
  return {
    getLocalizationService() {
      return $A.localizationService;
    },
    getPathPrefix() {
      return $A.getContext().getPathPrefix();
    },
    getToken(name) {
      return $A.getToken(name);
    }
  };
}
function createStandAloneConfig() {
  return {
    getLocalizationService() {
      return localizationService;
    },
    getPathPrefix() {
      return '';
    },
    getToken() {
      return undefined;
    },
    getOneConfig() {
      return {
        densitySetting: ''
      };
    }
  };
}
function getDefaultConfig() {
  if (!import.meta.env.SSR && window.$A !== undefined && window.$A.localizationService) {
    return getConfigFromAura(window.$A);
  }
  return createStandAloneConfig();
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
getDefaultConfig();

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const validNameRe = /^([a-zA-Z]+):([a-zA-Z]\w*)$/;
Object.assign(Object.create(null), {
  action: 'lightning.actionSprite',
  custom: 'lightning.customSprite',
  doctype: 'lightning.doctypeSprite',
  standard: 'lightning.standardSprite',
  utility: 'lightning.utilitySprite'
});
Object.assign(Object.create(null), {
  action: 'lightning.actionSpriteRtl',
  custom: 'lightning.customSpriteRtl',
  doctype: 'lightning.doctypeSpriteRtl',
  standard: 'lightning.standardSpriteRtl',
  utility: 'lightning.utilitySpriteRtl'
});
Object.assign(Object.create(null), {
  'lightning.actionSprite': '/assets/icons/action-sprite/svg/symbols.svg',
  'lightning.actionSpriteRtl': '/assets/icons/action-sprite/svg/symbols.svg',
  'lightning.customSprite': '/assets/icons/custom-sprite/svg/symbols.svg',
  'lightning.customSpriteRtl': '/assets/icons/custom-sprite/svg/symbols.svg',
  'lightning.doctypeSprite': '/assets/icons/doctype-sprite/svg/symbols.svg',
  'lightning.doctypeSpriteRtl': '/assets/icons/doctype-sprite/svg/symbols.svg',
  'lightning.standardSprite': '/assets/icons/standard-sprite/svg/symbols.svg',
  'lightning.standardSpriteRtl': '/assets/icons/standard-sprite/svg/symbols.svg',
  'lightning.utilitySprite': '/assets/icons/utility-sprite/svg/symbols.svg',
  'lightning.utilitySpriteRtl': '/assets/icons/utility-sprite/svg/symbols.svg'
});
const getMatchAtIndex = index => iconName => {
  const result = validNameRe.exec(iconName);
  return result ? result[index] : '';
};
const getName = getMatchAtIndex(2);
const isValidName = iconName => validNameRe.test(iconName);

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const importPromises = {};
const iconTemplateCache = {};
function hasIconLibrary(dir, category) {
  const cacheKey = makeCacheKey(dir, category);
  return !!iconTemplateCache[cacheKey];
}
function getIconLibrary(dir, category) {
  const cacheKey = makeCacheKey(dir, category);
  return iconTemplateCache[cacheKey] || null;
}
function fetchIconLibrary(dir, category) {
  const cacheKey = makeCacheKey(dir, category);
  if (importPromises[cacheKey]) {
    return importPromises[cacheKey];
  }
  const promise = fetchIconTemplate(dir, category);
  promise.then(tmpl => {
    iconTemplateCache[cacheKey] = tmpl;
    delete importPromises[cacheKey];
  }).catch(() => {
    delete importPromises[cacheKey];
  });
  importPromises[cacheKey] = promise;
  return promise;
}
function makeCacheKey(dir, category) {
  return `${category}${dir}`;
}
async function fetchIconTemplate(dir, category) {
  {
    switch (category) {
      case 'utility':
        {
          const {
            default: Lib
          } = await import('./iconSvgTemplatesUtility-!~{002}~.js');
          return Lib;
        }
      case 'action':
        {
          const {
            default: Lib
          } = await import('./iconSvgTemplatesAction-!~{003}~.js');
          return Lib;
        }
      case 'standard':
        {
          const {
            default: Lib
          } = await import('./iconSvgTemplatesStandard-!~{004}~.js');
          return Lib;
        }
      case 'doctype':
        {
          const {
            default: Lib
          } = await import('./iconSvgTemplatesDoctype-!~{005}~.js');
          return Lib;
        }
      case 'custom':
        {
          const {
            default: Lib
          } = await import('./iconSvgTemplatesCustom-!~{006}~.js');
          return Lib;
        }
      default:
        return null;
    }
  }
}

class LightningPrimitiveIcon extends __lwc_component_class_internal$d {
  constructor(...args) {
    super(...args);
    this.src = void 0;
    this.svgClass = void 0;
    this._size = 'medium';
    this._variant = '';
    this._iconLibrary = null;
    this._iconName = null;
  }
  get size() {
    return this._size;
  }
  set size(val) {
    this._size = val;
    this.setAttribute('size', this.normalizeSize(this._size));
  }
  get variant() {
    return this._variant;
  }
  set variant(val) {
    this._variant = val;
    this.setAttribute('variant', this.normalizeVariant(this._variant));
  }
  get iconName() {
    return this._iconName;
  }
  set iconName(value) {
    if (value !== this._iconName) {
      this._iconName = value;
      this.requestIconTemplates();
    }
  }
  get category() {
    if (isValidName(this._iconName)) {
      const [spriteName] = this._iconName.split(':');
      return spriteName;
    }
    return null;
  }
  get isReady() {
    return !!this._iconLibrary;
  }
  async requestIconTemplates() {
    if (hasIconLibrary(dir, this.category)) {
      this._iconLibrary = getIconLibrary(dir, this.category);
      return;
    }
    if (this.category) {
      try {
        this._iconLibrary = null;
        if (!import.meta.env.SSR) {
          this._iconLibrary = await fetchIconLibrary(dir, this.category);
        }
      } catch (e) {
        console.warn(`<lightning-primitive-icon> failed to dynamically import icon templates for ${this.category}: ${e.message}`);
      }
    }
  }
  renderedCallback() {
    if (this.isReady || this.iconName !== this.prevIconName) {
      this.prevIconName = this.iconName;
    }
  }
  render() {
    if (this.isReady) {
      if (!this.src) {
        const name = this.iconName;
        if (isValidName(name)) {
          const [spriteName, iconName] = name.split(':');
          const template = this._iconLibrary[`${spriteName}_${iconName}`];
          if (template) {
            return template;
          }
        }
      }
    }
    return _tmpl$5;
  }
  get href() {
    return this.src ? sanitizeURL(this.src) : '';
  }
  get name() {
    return getName(this.iconName);
  }
  normalizeSize(val) {
    return normalizeString(val, {
      fallbackValue: 'medium',
      validValues: ['xx-small', 'x-small', 'small', 'medium', 'large']
    });
  }
  normalizeVariant(val) {
    return normalizeString(val, {
      fallbackValue: '',
      validValues: ['bare', 'error', 'inverse', 'warning', 'success']
    });
  }
  get computedClass() {
    const classes = classSet(this.svgClass);
    if (this._variant !== 'bare') {
      classes.add('slds-icon');
    }
    switch (this._variant) {
      case 'error':
        classes.add('slds-icon-text-error');
        break;
      case 'warning':
        classes.add('slds-icon-text-warning');
        break;
      case 'success':
        classes.add('slds-icon-text-success');
        break;
      case 'inverse':
      case 'bare':
        break;
      default:
        if (!this.src) {
          classes.add('slds-icon-text-default');
        }
    }
    if (this._size !== 'medium') {
      classes.add(`slds-icon_${this._size}`);
    }
    return classes.toString();
  }
  /*LWC compiler v9.5.3*/
}
LightningPrimitiveIcon.validationOptOut = ['class'];
LightningPrimitiveIcon.stylesheets = [iconStylesheets];
registerDecorators(LightningPrimitiveIcon, {
  publicProps: {
    src: {
      config: 0
    },
    svgClass: {
      config: 0
    },
    size: {
      config: 3
    },
    variant: {
      config: 3
    },
    iconName: {
      config: 3
    }
  },
  fields: ["_size", "_variant", "_iconLibrary", "_iconName"]
});
const __lwc_component_class_internal$7 = registerComponent(LightningPrimitiveIcon, {
  tmpl: _tmpl$5,
  sel: "lightning-primitive-icon",
  apiVersion: 66
});

const $fragment1$1 = parseFragment`<span class="slds-assistive-text${0}"${2}>${"t1"}</span>`;
const stc0$4 = {
  "exportparts": "icon"
};
function tmpl$4($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, ti: api_tab_index, b: api_bind, c: api_custom_element, d: api_dynamic_text, sp: api_static_part, st: api_static_fragment, h: api_element} = $api;
  const {_m0} = $ctx;
  return [api_element("button", {
    className: api_normalize_class_name($cmp.computedButtonClass),
    attrs: {
      "disabled": $cmp.disabled ? "" : null,
      "name": $cmp.name,
      "title": $cmp.computedTitle,
      "accesskey": $cmp.accessKey,
      "type": $cmp.normalizedType,
      "value": $cmp.value,
      "aria-label": $cmp.ariaLabel,
      "aria-expanded": $cmp.computedAriaExpanded,
      "aria-live": $cmp.computedAriaLive,
      "aria-atomic": $cmp.computedAriaAtomic,
      "aria-haspopup": $cmp.computedAriaHasPopup,
      "part": "button button-icon",
      "tabindex": api_tab_index($cmp.tabIndex)
    },
    key: 0,
    on: _m0 || ($ctx._m0 = {
      "focus": api_bind($cmp.handleFocus),
      "blur": api_bind($cmp.handleBlur)
    })
  }, [api_custom_element("lightning-primitive-icon", __lwc_component_class_internal$7, {
    attrs: stc0$4,
    props: {
      "iconName": $cmp.iconName,
      "svgClass": $cmp.computedIconClass,
      "variant": "bare"
    },
    key: 1
  }), $cmp.alternativeText ? api_static_fragment($fragment1$1, 3, [api_static_part(1, null, api_dynamic_text($cmp.alternativeText))]) : null])];
  /*LWC compiler v9.5.3*/
}
var _tmpl$4 = registerTemplate(tmpl$4);
tmpl$4.stylesheets = [];
tmpl$4.stylesheetToken = "lwc-3o1g0ksgj78";
if (_implicitStylesheets) {
  tmpl$4.stylesheets.push.apply(tmpl$4.stylesheets, _implicitStylesheets);
}
freezeTemplate(tmpl$4);

const stc0$3 = [];
function tmpl$3($api, $cmp, $slotset, $ctx) {
  return stc0$3;
  /*LWC compiler v9.5.3*/
}
var _tmpl$3 = registerTemplate(tmpl$3);
tmpl$3.stylesheets = [];
tmpl$3.stylesheetToken = "lwc-50rp014c9i6";
freezeTemplate(tmpl$3);

class LightningPrimitiveButton extends __lwc_component_class_internal$d {
  set disabled(value) {
    this.originalDisabledValue = value;
    this.state.disabled = normalizeBoolean(value);
  }
  get disabled() {
    return this.state.disabled;
  }
  set ariaLabelledBy(value) {
    this.originalAriaLabelledBy = value;
    this.ariaObserver.connect({
      targetSelector: 'button',
      attribute: 'aria-labelledby',
      relatedNodeIds: value
    });
  }
  get ariaLabelledBy() {
    return this.originalAriaLabelledBy;
  }
  set ariaDescribedBy(value) {
    this.originalAriaDescribedBy = value;
    this.ariaObserver.connect({
      targetSelector: 'button',
      attribute: 'aria-describedby',
      relatedNodeIds: value
    });
  }
  get ariaDescribedBy() {
    return this.originalAriaDescribedBy;
  }
  set ariaControls(value) {
    this.originalAriaControls = value;
    this.setAttribute('aria-controls', value);
  }
  get ariaControls() {
    return this.originalAriaControls;
  }
  set ariaOwns(value) {
    this.originalAriaOwns = value;
    this.setAttribute('aria-owns', value);
  }
  get ariaOwns() {
    return this.originalAriaOwns;
  }
  set ariaDetails(value) {
    this.originalAriaDetails = value;
    this.setAttribute('aria-details', value);
  }
  get ariaDetails() {
    return this.originalAriaDetails;
  }
  set ariaFlowTo(value) {
    this.originalAriaFlowTo = value;
    this.setAttribute('aria-flowto', value);
  }
  get ariaFlowTo() {
    return this.originalAriaFlowTo;
  }
  get ariaExpanded() {
    return this.originalAriaExpanded !== undefined ? String(this.originalAriaExpanded) : null;
  }
  set ariaExpanded(value) {
    this.originalAriaExpanded = value;
    if (typeof value === 'string') {
      this.state.ariaExpanded = normalizeString(value, {
        fallbackValue: null,
        validValues: ['true', 'false']
      });
    } else if (typeof value === 'boolean') {
      this.state.ariaExpanded = normalizeBoolean(value);
    }
  }
  get computedAriaExpanded() {
    return this.state.ariaExpanded;
  }
  set ariaPressed(value) {
    this.originalAriaPressed = value;
    this.state.ariaPressed = normalizeString(value, {
      fallbackValue: null,
      validValues: ['true', 'false']
    });
  }
  get ariaPressed() {
    return this.originalAriaPressed;
  }
  get computedAriaPressed() {
    return this.state.ariaPressed;
  }
  set ariaHidden(value) {
    this.originalAriaHidden = value;
    this.state.ariaHidden = normalizeString(value, {
      fallbackValue: null,
      validValues: ['true', 'false']
    });
  }
  get ariaHidden() {
    return this.originalAriaHidden;
  }
  get computedAriaHidden() {
    return this.state.ariaHidden;
  }
  set ariaHasPopup(value) {
    this.originalAriaHasPopup = value;
    this.state.ariaHasPopup = normalizeString(value, {
      fallbackValue: null,
      validValues: ['true', 'dialog', 'menu', 'listbox', 'tree', 'grid']
    });
  }
  get ariaHasPopup() {
    return this.originalAriaHasPopup;
  }
  get computedAriaHasPopup() {
    return this.state.ariaHasPopup;
  }
  set ariaRelevant(value) {
    this.originalAriaRelevant = value;
    this.state.ariaRelevant = normalizeString(value, {
      fallbackValue: null,
      validValues: ['additions', 'removals', 'text', 'all']
    });
  }
  get ariaRelevant() {
    return this.originalAriaRelevant;
  }
  get computedAriaRelevant() {
    return this.state.ariaRelevant;
  }
  set ariaLive(value) {
    this.originalAriaLive = value;
    this.state.ariaLive = normalizeString(value, {
      fallbackValue: null,
      validValues: ['polite', 'assertive', 'off']
    });
  }
  get ariaLive() {
    return this.originalAriaLive;
  }
  get computedAriaLive() {
    return this.state.ariaLive;
  }
  set ariaAtomic(value) {
    this.originalAriaAtomic = value;
    this.state.ariaAtomic = normalizeString(value, {
      fallbackValue: null,
      validValues: ['true', 'false']
    });
  }
  get ariaAtomic() {
    return this.originalAriaAtomic;
  }
  get computedAriaAtomic() {
    return this.state.ariaAtomic;
  }
  set ariaBusy(value) {
    this.originalAriaBusy = value;
    this.state.ariaBusy = normalizeString(value, {
      fallbackValue: null,
      validValues: ['true', 'false']
    });
  }
  get ariaBusy() {
    return this.originalAriaBusy;
  }
  get computedAriaBusy() {
    return this.state.ariaBusy;
  }
  get computedButtonClass() {
    const classes = classSet('slds-button');
    classes.add(buttonGroupOrderClass(this.groupOrder));
    return classes.toString();
  }
  focus() {}
  constructor() {
    super();
    this._initialized = false;
    this.state = {
      ariaAtomic: null,
      ariaBusy: null,
      ariaControls: null,
      ariaDetails: null,
      ariaDescribedBy: null,
      ariaExpanded: null,
      ariaFlowTo: null,
      ariaHasPopup: null,
      ariaHidden: null,
      ariaLabelledBy: null,
      ariaLive: null,
      ariaOwns: null,
      ariaPressed: null,
      ariaRelevant: null,
      disabled: false
    };
    this.ariaObserver = void 0;
    this.originalAriaAtomic = void 0;
    this.originalAriaBusy = void 0;
    this.originalAriaControls = void 0;
    this.originalAriaDetails = void 0;
    this.originalAriaDescribedBy = void 0;
    this.originalAriaExpanded = void 0;
    this.originalAriaFlowTo = void 0;
    this.originalAriaHasPopup = void 0;
    this.originalAriaHidden = void 0;
    this.originalAriaLabelledBy = void 0;
    this.originalAriaLive = void 0;
    this.originalAriaOwns = void 0;
    this.originalAriaPressed = void 0;
    this.originalAriaRelevant = void 0;
    this.originalDisabledValue = void 0;
    this.accessKey = void 0;
    this.title = void 0;
    this.ariaLabel = void 0;
    this.ariaCurrent = void 0;
    this.ariaKeyShortcuts = void 0;
    this.groupOrder = '';
    this.ariaObserver = new __lwc_component_class_internal$a(this);
    if (isIE11 && !import.meta.env.SSR) {
      this.template.addEventListener('click', event => {
        if (this.disabled) {
          event.stopImmediatePropagation();
        }
      });
    }
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.ariaObserver) {
      this.ariaObserver = new __lwc_component_class_internal$a(this);
    }
  }
  renderedCallback() {
    if (this.isConnected) {
      this.ariaObserver.sync();
    }
  }
  disconnectedCallback() {
    if (this.ariaObserver) {
      this.ariaObserver.disconnect();
      this.ariaObserver = undefined;
    }
  }
  /*LWC compiler v9.5.3*/
}
registerDecorators(LightningPrimitiveButton, {
  publicProps: {
    disabled: {
      config: 3
    },
    accessKey: {
      config: 0
    },
    title: {
      config: 0
    },
    ariaLabel: {
      config: 0
    },
    ariaLabelledBy: {
      config: 3
    },
    ariaDescribedBy: {
      config: 3
    },
    ariaControls: {
      config: 3
    },
    ariaOwns: {
      config: 3
    },
    ariaDetails: {
      config: 3
    },
    ariaFlowTo: {
      config: 3
    },
    ariaExpanded: {
      config: 3
    },
    ariaPressed: {
      config: 3
    },
    ariaHidden: {
      config: 3
    },
    ariaCurrent: {
      config: 0
    },
    ariaKeyShortcuts: {
      config: 0
    },
    ariaHasPopup: {
      config: 3
    },
    ariaRelevant: {
      config: 3
    },
    ariaLive: {
      config: 3
    },
    ariaAtomic: {
      config: 3
    },
    ariaBusy: {
      config: 3
    },
    groupOrder: {
      config: 0
    }
  },
  publicMethods: ["focus"],
  track: {
    state: 1
  },
  fields: ["_initialized", "ariaObserver", "originalAriaAtomic", "originalAriaBusy", "originalAriaControls", "originalAriaDetails", "originalAriaDescribedBy", "originalAriaExpanded", "originalAriaFlowTo", "originalAriaHasPopup", "originalAriaHidden", "originalAriaLabelledBy", "originalAriaLive", "originalAriaOwns", "originalAriaPressed", "originalAriaRelevant", "originalDisabledValue"]
});
const __lwc_component_class_internal$6 = registerComponent(LightningPrimitiveButton, {
  tmpl: _tmpl$3,
  sel: "lightning-primitive-button",
  apiVersion: 66
});

const DEFAULT_SIZE = 'medium';
const DEFAULT_VARIANT = 'border';
const DEFAULT_TYPE = 'button';
const relatedTarget = Symbol('relatedTarget');
const {
  setContext: setContext$2,
  assertContext: assertContext$2
} = privateContext;
class LightningButtonIcon extends __lwc_component_class_internal$6 {
  get variant() {
    return this._originalVariant;
  }
  set variant(val) {
    this._originalVariant = val;
    this._variant = this.normalizeVariant(val);
    this.setAttribute('variant', this._variant);
  }
  get size() {
    return this._originalSize;
  }
  set size(val) {
    this._originalSize = val;
    this._size = this.normalizeSize(val);
    this.setAttribute('size', this._size);
  }
  get tooltip() {
    return this._tooltip ? this._tooltip.value : undefined;
  }
  set tooltip(value) {
    assertContext$2(this);
    this.tooltipValue = value;
    if (this._tooltip) {
      this._tooltip.value = value;
    } else if (value && this.rendered) {
      this.createTooltip(value);
    }
  }
  createTooltip(value) {
    this._tooltip = new Tooltip(value, {
      root: this,
      target: () => this.template.querySelector('button'),
      type: this.tooltipType,
      disableAriaDescribedBy: features.enableNoDescribedbyTooltip && value === this.alternativeText
    });
    this._tooltip.initialize();
  }
  render() {
    return _tmpl$4;
  }
  get computedTitle() {
    if (this.title) {
      return this.title;
    }
    if (!this.disableAlternativeTextTitle) {
      return this.alternativeText;
    }
    return null;
  }
  normalizeVariant(variant) {
    if (features.enableAssertContext260Round2) {
      assertContext$2(this);
    }
    return normalizeString(variant, {
      fallbackValue: DEFAULT_VARIANT,
      validValues: ['bare', 'brand', 'container', 'border', 'border-filled', 'bare-inverse', 'border-inverse']
    });
  }
  get normalizedType() {
    return normalizeString(this.type, {
      fallbackValue: DEFAULT_TYPE,
      validValues: ['button', 'reset', 'submit']
    });
  }
  normalizeSize(size) {
    return normalizeString(size, {
      fallbackValue: DEFAULT_SIZE,
      validValues: ['xx-small', 'x-small', 'small', 'medium', 'large']
    });
  }
  get variantBase() {
    return this._variant.split('-')[0];
  }
  get variantModifier() {
    return this._variant.split('-')[1] || '';
  }
  get computedButtonClass() {
    const classes = classSet(super.computedButtonClass);
    const isBare = this.variantBase === 'bare';
    classes.add('slds-button_icon');
    if (!isBare) {
      switch (this._size) {
        case 'small':
          classes.add('slds-button_icon-small');
          break;
        case 'x-small':
          classes.add('slds-button_icon-x-small');
          break;
        case 'xx-small':
          classes.add('slds-button_icon-xx-small');
          break;
        case 'large':
          console.warn(`<lightning-button-icon> The non-bare variants of buttonIcon do not support a size value of "large". Supported values include "xx-small", "x-small", "small", and "medium". Falling back to size value "medium".`);
      }
    }
    return classes.add({
      'slds-button_icon-bare': isBare,
      'slds-button_icon-container': this._variant === 'container',
      'slds-button_icon-border': this._variant === 'border',
      'slds-button_icon-border-filled': this._variant === 'border-filled',
      'slds-button_icon-border-inverse': this._variant === 'border-inverse',
      'slds-button_icon-inverse': this._variant === 'bare-inverse',
      'slds-button_icon-brand': this._variant === 'brand'
    }).toString();
  }
  get computedIconClass() {
    const isBare = this.variantBase === 'bare';
    const iconClass = this.iconClass || '';
    const classes = classSet('slds-button__icon');
    classes.add(iconClass);
    if (isBare) {
      switch (this._size) {
        case 'large':
          classes.add('slds-button__icon_large');
          break;
        case 'small':
          classes.add('slds-button__icon_small');
          break;
        case 'xx-small':
          console.warn(`<lightning-button-icon> The bare variant of buttonIcon does not support a size value of "xx-small". Supported values include "x-small", "small", "medium", and "large". The default is "medium".`);
        case 'x-small':
          classes.add('slds-button__icon_x-small');
          break;
      }
    }
    return classes.toString();
  }
  handleFocus(event) {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('focus'));
  }
  handleBlur(event) {
    this.dispatchEvent(new CustomEvent('blur', {
      detail: {
        [relatedTarget]: event.relatedTarget
      }
    }));
  }
  focus() {
    if (this._connected) {
      this.template.querySelector('button').focus();
    }
  }
  click() {
    if (this._connected) {
      this.template.querySelector('button').click();
    }
  }
  constructor() {
    super();
    this._tooltipCreated = false;
    this.name = void 0;
    this.value = void 0;
    this.tabIndex = void 0;
    this._variant = DEFAULT_VARIANT;
    this._originalVariant = void 0;
    this._originalSize = void 0;
    this._connected = void 0;
    this.iconName = void 0;
    this.iconClass = void 0;
    this._size = DEFAULT_SIZE;
    this.type = DEFAULT_TYPE;
    this.alternativeText = void 0;
    this.tooltipType = TooltipType.Info;
    this.disableAlternativeTextTitle = false;
    this._tooltip = null;
    this.tooltipValue = null;
    this.rendered = false;
    setContext$2(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this._connected = true;
  }
  renderedCallback() {
    assertContext$2(this);
    super.renderedCallback();
    if (this.tooltipValue && !this._tooltip) {
      this.createTooltip(this.tooltipValue);
    }
    this.template.host.style.pointerEvents = this.disabled ? 'none' : '';
    this.rendered = true;
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._connected = false;
    this.rendered = false;
    if (this._tooltip) {
      this._tooltip.disconnect();
    }
  }
  /*LWC compiler v9.5.3*/
}
LightningButtonIcon.delegatesFocus = true;
registerDecorators(LightningButtonIcon, {
  publicProps: {
    name: {
      config: 0
    },
    value: {
      config: 0
    },
    tabIndex: {
      config: 0
    },
    variant: {
      config: 3
    },
    iconName: {
      config: 0
    },
    iconClass: {
      config: 0
    },
    size: {
      config: 3
    },
    type: {
      config: 0
    },
    alternativeText: {
      config: 0
    },
    tooltipType: {
      config: 0
    },
    disableAlternativeTextTitle: {
      config: 0
    },
    tooltip: {
      config: 3
    }
  },
  publicMethods: ["focus", "click"],
  fields: ["_tooltipCreated", "_variant", "_originalVariant", "_originalSize", "_connected", "_size", "_tooltip", "tooltipValue", "rendered"]
});
const __lwc_component_class_internal$5 = registerComponent(LightningButtonIcon, {
  tmpl: _tmpl$4,
  sel: "lightning-button-icon",
  apiVersion: 66
});

const $fragment1 = parseFragment`<div${"c0"} part="modal-backdrop" role="presentation" data-backdrop${2}></div>`;
const $fragment2 = parseFragment`<span${"a0:id"} class="slds-assistive-text${0}" data-aria-description${2}>${"t1"}</span>`;
const $fragment3 = parseFragment`<span aria-live="polite" role="status" class="slds-assistive-text${0}" data-aria-live-message${2}>${"t1"}</span>`;
const $fragment4 = parseFragment`<span class="slds-assistive-text${0}" aria-hidden="true" data-modal-tooltip-portal${2}></span>`;
const stc0$2 = {
  key: 2
};
const stc1 = {
  "role": "dialog",
  "tabindex": "-1",
  "aria-modal": "true",
  "part": "modal",
  "data-modal": ""
};
const stc2 = {
  classMap: {
    "slds-modal__container": true
  },
  attrs: {
    "data-container": ""
  },
  key: 10
};
const stc3 = {
  "data-close-button": ""
};
const stc4 = {
  attrs: {
    "data-slot": ""
  },
  context: {
    lwc: {
      dom: "manual"
    }
  },
  key: 12
};
function tmpl$2($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment, b: api_bind, gid: api_scoped_id, d: api_dynamic_text, c: api_custom_element, h: api_element} = $api;
  const {_m0, _m1} = $ctx;
  return [api_static_fragment($fragment1, 1, [api_static_part(0, {
    className: api_normalize_class_name($cmp.modalBackdropCssClasses)
  }, null)]), api_custom_element("lightning-focus-trap", __lwc_component_class_internal$9, stc0$2, [api_element("section", {
    className: api_normalize_class_name($cmp.modalCssClasses),
    attrs: stc1,
    key: 3,
    on: _m0 || ($ctx._m0 = {
      "keydown": api_bind($cmp.handleModalKeyDown),
      "privatemodalheaderregister": api_bind($cmp.handleHeaderRegister),
      "privatemodalbodyregister": api_bind($cmp.handleBodyRegister),
      "privatemodalfooterregister": api_bind($cmp.handleFooterRegister),
      "privateclose": api_bind($cmp.handlePrivateClose),
      "privatedisableclosebutton": api_bind($cmp.handlePrivateDisableCloseButton),
      "focusin": api_bind($cmp.handleModalBaseFocusin),
      "privatelightningmodallastfocus": api_bind($cmp.handleLastFocusedElem)
    })
  }, [$cmp.showAriaDescribedBy ? api_static_fragment($fragment2, 5, [api_static_part(0, {
    attrs: {
      "id": api_scoped_id("modal-description")
    }
  }, null), api_static_part(1, null, api_dynamic_text($cmp.description))]) : null, $cmp.showAriaLiveMessage ? api_static_fragment($fragment3, 7, [api_static_part(1, null, api_dynamic_text($cmp.ariaLiveMessage))]) : null, $cmp.isHelptextA11yInModalEnabled ? api_static_fragment($fragment4, 9) : null, api_element("div", stc2, [api_custom_element("lightning-button-icon", __lwc_component_class_internal$5, {
    className: api_normalize_class_name($cmp.computedCloseButtonCssClass),
    attrs: stc3,
    props: {
      "iconName": "utility:close",
      "variant": "bare",
      "alternativeText": $cmp.closeButtonAltText,
      "size": "large",
      "disabled": $cmp.disableCloseButton
    },
    key: 11,
    on: _m1 || ($ctx._m1 = {
      "click": api_bind($cmp.handleCloseClick)
    })
  }), api_element("div", stc4)])])])];
  /*LWC compiler v9.5.3*/
}
var _tmpl$2 = registerTemplate(tmpl$2);
tmpl$2.stylesheets = [];
tmpl$2.stylesheetToken = "lwc-6o6likdls9f";
if (_implicitStylesheets$1) {
  tmpl$2.stylesheets.push.apply(tmpl$2.stylesheets, _implicitStylesheets$1);
}
freezeTemplate(tmpl$2);

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
var closeButtonAltText = "Cancel and close";

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
var disableCloseBtnMessage = "Processing";

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const TYPE_MODAL = 'lightning-modal';
const TYPE_OVERLAY = 'lightning-overlay';
const TYPE_ALERT = 'lightning-alert';
const TYPE_CONFIRM = 'lightning-confirm';
const TYPE_PROMPT = 'lightning-prompt';
const TYPE_PRIMITIVE_OVERLAY = 'lightning-primitive-overlay';
const TYPE_TOAST_CONTAINER = 'lightning-toast-container';
const LWC_OVERLAY_ENGINE = 'lwc';
const LWC_OVERLAY_STARTING_ZINDEX = 9000;
const LWC_TOAST_CONTAINER_STARTING_ZINDEX = 10000;
const LWC_ZINDEX_INCREMENT = 2;
const LWC_ZINDEX_OFFSET = 1;
const LWC_OVERLAY_TYPES = Object.freeze({
  [TYPE_PRIMITIVE_OVERLAY]: {
    pos: 'absolute'
  },
  [TYPE_MODAL]: {
    pos: 'absolute'
  },
  [TYPE_OVERLAY]: {
    pos: 'absolute'
  },
  [TYPE_ALERT]: {
    pos: 'absolute'
  },
  [TYPE_CONFIRM]: {
    pos: 'absolute'
  },
  [TYPE_PROMPT]: {
    pos: 'absolute'
  },
  [TYPE_TOAST_CONTAINER]: {
    pos: 'fixed',
    maxNum: 1,
    statName: 'lwcToastContainerCount'
  }
});
const AURA_OVERLAY_ENGINE = 'aura';
const AURA_STARTING_ZINDEX = 9001;
const AURA_OVERLAY_TYPES = {
  'ui:modal': {
    pos: 'absolute'
  }
};
const state = {
  stack: [],
  callback: null,
  mixedOverlayPresent: false,
  auraHighestZindex: 9001,
  auraOverlayActive: false,
  auraModalCount: 0,
  auraAllOverlayCount: 0,
  lwcModalCount: 0,
  lwcToastContainerCount: 0,
  lwcOverlayCount: 0,
  lwcAllOverlayCount: 0
};
function triggerLwcContainerCallback() {
  if (state.callback && state.lwcAllOverlayCount > 0) {
    state.callback(state);
  }
}
function normalizeOverlayDetails(overlayEngine, overlayType, overlayDetails) {
  const overlayObject = {};
  const missingRequiredValues = !overlayEngine || !overlayType;
  const reqdValuesNotCorrectType = (overlayEngine !== LWC_OVERLAY_ENGINE || overlayEngine !== AURA_OVERLAY_ENGINE) && typeof overlayType !== 'string';
  if (missingRequiredValues || reqdValuesNotCorrectType) {
    return null;
  }
  overlayObject.overlayEngine = overlayEngine;
  overlayObject.overlayType = overlayType;
  if (overlayDetails) {
    const {
      zIndex,
      id,
      index
    } = overlayDetails;
    const cleanedDetails = {};
    if (zIndex !== undefined || zIndex !== null) {
      const zIndexNumber = parseInt(zIndex, 10);
      const isZIndexANumber = !Number.isNaN(zIndexNumber);
      if (isZIndexANumber) {
        cleanedDetails.zIndex = zIndexNumber;
      }
    }
    if (id && typeof id === 'string') {
      cleanedDetails.id = id;
    }
    if (index !== undefined || index !== null && typeof index === 'number') {
      cleanedDetails.index = index;
    }
    overlayObject.overlayDetails = cleanedDetails;
  }
  return overlayObject;
}
function getOverlayStackStats() {
  const stats = {
    hasLwc: false,
    lwcOverlays: 0,
    lwcAllOverlays: 0,
    lwcModals: 0,
    lwcToastContainers: 0,
    hasAura: false,
    auraModals: 0,
    auraOverlays: 0,
    auraAllOverlays: 0,
    auraOverlayActive: false,
    auraHighestZIndex: null
  };
  const stackLength = state.stack.length;
  state.stack.forEach(({
    overlayEngine,
    overlayType,
    overlayDetails
  }, stackIndex) => {
    const isLwc = overlayEngine === LWC_OVERLAY_ENGINE;
    const isAura = overlayEngine === AURA_OVERLAY_ENGINE;
    if (isLwc) {
      if (!stats.hasLwc) {
        stats.hasLwc = true;
      }
      const typeExists = !!LWC_OVERLAY_TYPES[overlayType];
      if (overlayType && typeExists) {
        const isModalType = overlayType === TYPE_MODAL;
        const isToastContainerType = overlayType === TYPE_TOAST_CONTAINER;
        if (isModalType) {
          stats.lwcModals++;
        } else if (isToastContainerType) {
          stats.lwcToastContainers++;
        } else {
          stats.lwcOverlays++;
        }
        stats.lwcAllOverlays++;
      }
    }
    if (isAura) {
      if (!stats.hasAura) {
        stats.hasAura = true;
      }
      if (overlayType) {
        const isModalType = !!AURA_OVERLAY_TYPES[overlayType];
        if (isModalType) {
          stats.auraModals++;
        } else {
          stats.auraOverlays++;
        }
        stats.auraAllOverlays++;
      }
      if (overlayDetails && overlayDetails.zIndex) {
        const {
          zIndex
        } = overlayDetails;
        const {
          auraHighestZIndex
        } = stats;
        const zIndexIsNumber = !isNaN(zIndex);
        if (zIndexIsNumber && (!auraHighestZIndex || zIndex > auraHighestZIndex)) {
          stats.auraHighestZIndex = zIndex;
        }
      }
      if (stackLength === stackIndex + 1) {
        stats.auraOverlayActive = true;
      }
    }
  });
  return stats;
}
function updateStateWithStackStats(stats) {
  if (!stats) {
    return;
  }
  if (stats.hasAura) {
    state.auraModalCount = stats.auraModals;
    state.auraOverlayCount = stats.auraOverlays;
    state.auraAllOverlayCount = stats.auraAllOverlays;
    state.auraOverlayActive = stats.auraOverlayActive;
    if (stats.auraHighestZIndex) {
      state.auraHighestZindex = stats.auraHighestZIndex;
    }
  } else {
    initAuraOverlayState();
  }
  if (stats.hasLwc) {
    state.lwcModalCount = stats.lwcModals;
    state.lwcToastContainerCount = stats.lwcToastContainers;
    state.lwcOverlayCount = stats.lwcOverlays;
    state.lwcAllOverlayCount = stats.lwcAllOverlays;
  } else {
    initLwcOverlayState();
  }
  state.mixedOverlayPresent = stats.hasLwc && stats.hasAura;
}
function updateSharedOverlayState() {
  if (state.stack.length === 0) {
    initAuraOverlayState();
    initLwcOverlayState();
  } else {
    const stats = getOverlayStackStats();
    updateStateWithStackStats(stats);
  }
}
function cleanOverlayDetails(details) {
  const cleanedDetails = {};
  const detailsKeys = {
    id: 'string',
    zIndex: 'number',
    index: 'number'
  };
  if (!details || typeof details !== 'object') {
    return cleanedDetails;
  }
  Object.entries(details).forEach(([key, value]) => {
    if (detailsKeys[key] && typeof value === detailsKeys[key]) {
      cleanedDetails[key] = value;
    }
  });
  return cleanedDetails;
}
function addOverlayToSharedState(overlayObject) {
  const {
    overlayEngine,
    overlayType,
    overlayDetails: initialOverlayDetails
  } = overlayObject;
  const missingValues = !overlayObject || !overlayEngine || !overlayType;
  const standardEngines = overlayEngine === LWC_OVERLAY_ENGINE || overlayEngine === AURA_OVERLAY_ENGINE;
  if (missingValues || !standardEngines) {
    return;
  }
  const overlayDetails = cleanOverlayDetails(initialOverlayDetails);
  state.stack.push({
    overlayEngine,
    overlayType,
    overlayDetails
  });
  updateSharedOverlayState();
  triggerLwcContainerCallback();
}
function removeOverlayFromSharedState(overlayObject) {
  const stackLength = state.stack.length;
  const {
    overlayEngine,
    overlayDetails
  } = overlayObject;
  const missingValues = !overlayObject || !overlayEngine;
  const standardEngines = overlayEngine === LWC_OVERLAY_ENGINE || overlayEngine === AURA_OVERLAY_ENGINE;
  let overlayId = null;
  let indexToRemove = null;
  if (stackLength === 0 || missingValues || !standardEngines) {
    return;
  }
  if (overlayDetails && overlayDetails.id) {
    overlayId = overlayDetails.id;
  }
  if (overlayId) {
    for (let index = stackLength - 1; index > -1; index--) {
      if (state.stack[index]) {
        const {
          overlayDetails: {
            id: oId
          }
        } = state.stack[index];
        if (oId && oId === overlayId) {
          indexToRemove = index;
          break;
        }
      }
    }
  }
  if (indexToRemove !== null) {
    state.stack.splice(indexToRemove, 1);
    updateSharedOverlayState();
    triggerLwcContainerCallback();
  }
}
function subscribeOverlay(shouldCall, callback) {
  state.callback = callback;
  if (shouldCall) {
    triggerLwcContainerCallback();
  }
}
function getStatCount(statName) {
  return !state || !state[statName] ? null : state[statName];
}
function initLwcOverlayState() {
  state.lwcModalCount = 0;
  state.lwcToastContainerCount = 0;
  state.lwcOverlayCount = 0;
  state.lwcAllOverlayCount = 0;
}
function initAuraOverlayState() {
  state.auraModalCount = 0;
  state.auraOverlayCount = 0;
  state.auraAllOverlayCount = 0;
  state.auraHighestZindex = AURA_STARTING_ZINDEX;
  state.auraOverlayActive = false;
  state.auraOverlayPresent = false;
}
function isLwcModalActive() {
  let isLwcModal = false;
  if (state.stack?.length > 0) {
    const top = state.stack[state.stack.length - 1];
    isLwcModal = top?.overlayEngine === LWC_OVERLAY_ENGINE && top?.overlayType === TYPE_MODAL;
  }
  return isLwcModal;
}

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const MODAL_SELECTORS = ['lightning-modal-header', 'lightning-modal-body', 'lightning-modal-footer', 'lightning-focus-trap', 'lightning-overlay-container'];
function modalFocusinEventHandler(e) {
  const {
    isModalClosing,
    lastFocusedElement
  } = this;
  if (!isLwcModalActive() || isModalClosing) {
    return;
  }
  let isTargetRelatedToModal = null;
  if (e.target && typeof e.target.closest === 'function') {
    isTargetRelatedToModal = e.target.closest(MODAL_SELECTORS.join(','));
  } else if (e.relatedTarget && typeof e.relatedTarget.closest === 'function') {
    isTargetRelatedToModal = e.relatedTarget.closest(MODAL_SELECTORS.join(','));
  }
  if (isTargetRelatedToModal) {
    this.lastFocusedElement = getElementWithFocus();
    this.dispatchEvent(new CustomEvent('privatelightningmodallastfocus', {
      composed: true,
      bubbles: true,
      detail: {
        [secure]: true,
        privatelightningmodallastfocus: this.lastFocusedElement
      }
    }));
  } else if (lastFocusedElement) {
    if (!lastFocusedElement.ariaHasPopup) {
      returnFocusToElement(lastFocusedElement);
    }
  }
}

const {
  setContext: setContext$1,
  assertContext: assertContext$1
} = privateContext;
const DEBOUNCE_RESIZE = 300;
const SMALL_SCREEN_SIZE = 480;
const SIZE_SMALL = 'small';
const SIZE_MEDIUM = 'medium';
const SIZE_LARGE = 'large';
const SIZE_FULL = 'full';
let lwcModalCount = 0;
let originalBodyOverflow = null;
class LightningModalBase extends __lwc_component_class_internal$d {
  constructor() {
    super();
    this.initialRender = true;
    this.autoFocusCompletedOnce = false;
    this.timeoutId = 0;
    this.disableCloseButton = false;
    this.sectionAriaBusy = null;
    this.closeButtonAltText = closeButtonAltText;
    this.disableCloseBtnMessage = disableCloseBtnMessage;
    this.isModalClosing = false;
    this.isSmallScreenSize = null;
    this.headerRegistered = false;
    this.headerHeight = 0;
    this.headerDefaultSlotIsPopulated = false;
    this.headerSlotWrapperId = null;
    this.headerSlotHasRendered = false;
    this.headerLabelId = null;
    this.headerLabelIsPopulated = null;
    this.headerTitleRef = null;
    this.bodyRegistered = false;
    this.bodyDefaultSlotIsPopulated = false;
    this.bodySlotHasRendered = false;
    this.bodyId = null;
    this.baseUpdateBodyCallback = null;
    this.bodyResizeScheduled = false;
    this.bodyTabElemRef = null;
    this.windowResizeEventBound = false;
    this.windowOrientationEventBound = false;
    this.portraitMatchMedia = null;
    this.screenOrientationChangeHandler = null;
    this.focusinEventBound = false;
    this.lastFocusedElement = null;
    this.footerRegistered = false;
    this.footerHeight = 0;
    this.footerSlotHasRendered = false;
    this.footerDefaultSlotIsPopulated = false;
    this.modalLabel = null;
    this.modalLabelledBy = null;
    this.modalDescribedBy = null;
    this.showAriaLiveMessage = false;
    this.ariaLiveMessage = '';
    this.isModalOpen = false;
    this.isModalTransitioningIn = false;
    this.savedInertElements = [];
    this.savedActiveElement = void 0;
    this.ariaObserver = null;
    this.updateHeaderCallback = void 0;
    this.updateFooterCallback = void 0;
    this._resizing = void 0;
    this._size = null;
    this.unsetAriaLabelAndError = () => {
      synchronizeAttrs(this.modalWrapper, {
        [ARIA.LABELLEDBY]: null,
        [ARIA.LABEL]: null
      });
      this.errorLabelRequired();
      if (this.ariaObserver) {
        this.ariaObserver.disconnect();
      }
    };
    this.handleWindowResizeEvent = () => {
      this.scheduleWindowResizeEvent();
    };
    this.handleModalBaseFocusin = modalFocusinEventHandler.bind(this);
    setContext$1(this);
    this.ariaObserver = new __lwc_component_class_internal$a(this);
  }
  get label() {
    const modal = this.modal;
    if (!modal) {
      return '';
    }
    return modal.label;
  }
  get description() {
    const modal = this.modal;
    if (!modal) {
      return '';
    }
    return modal.description;
  }
  normalizeSize(sizeValue) {
    const sizeDefault = SIZE_MEDIUM;
    return normalizeString(sizeValue, {
      fallbackValue: sizeDefault,
      validValues: [SIZE_FULL, SIZE_SMALL, SIZE_MEDIUM, SIZE_LARGE]
    });
  }
  get isModalSizeNotSet() {
    return this._size === null;
  }
  get size() {
    const sizeDefault = SIZE_MEDIUM;
    return this._size || sizeDefault;
  }
  set size(value) {
    this._size = value ? this.normalizeSize(value) : null;
  }
  get disableClose() {
    const modal = this.modal;
    if (!modal) {
      return false;
    }
    return modal.disableClose;
  }
  get defaultSlot() {
    return this.template.querySelector('[data-slot]');
  }
  get modalWrapper() {
    return this.template.querySelector('[data-modal]');
  }
  get modal() {
    return !import.meta.env.SSR && this.defaultSlot && this.defaultSlot.childNodes[0] || null;
  }
  get modalDescSpan() {
    return this.template.querySelector('[data-aria-description]');
  }
  get modalCloseButton() {
    return this.template.querySelector('[data-close-button]');
  }
  get modalElement() {
    const modalSlot = this.defaultSlot;
    if (!modalSlot) {
      return null;
    }
    return modalSlot.querySelector('lightning-modal');
  }
  get modalBackdrop() {
    return this.template.querySelector('[data-backdrop]');
  }
  get backdropDimensions() {
    const backdropElem = this.modalBackdrop;
    const backdropRect = backdropElem ? backdropElem.getBoundingClientRect() : {};
    const {
      height,
      width
    } = backdropRect;
    return {
      height: height || 0,
      width: width || 0
    };
  }
  get modalCssClasses() {
    const classes = classSet('slds-modal fix-slds-modal');
    const sizeDefault = SIZE_MEDIUM;
    const modalSize = this._size === null ? sizeDefault : this.size;
    if (hasAnimation()) {
      classes.add({
        'slds-fade-in-open': this.isModalTransitioningIn
      });
    } else {
      classes.add({
        'slds-fade-in-open': true
      });
    }
    classes.add({
      'slds-modal_full': modalSize === SIZE_FULL,
      'slds-modal_medium': modalSize === SIZE_MEDIUM,
      'slds-modal_large': modalSize === SIZE_LARGE,
      'slds-modal_small': modalSize === SIZE_SMALL
    });
    return classes.toString();
  }
  get modalBackdropCssClasses() {
    let classes = classSet('slds-backdrop fix-slds-backdrop');
    if (hasAnimation()) {
      classes.add({
        'slds-backdrop_open': this.isModalOpen
      });
    } else {
      classes = classes.add({
        'slds-backdrop_open': true
      });
    }
    return classes.toString();
  }
  get isDescriptionSet() {
    const {
      description
    } = this;
    return !!description?.trim().length;
  }
  get computedCloseButtonCssClass() {
    const classes = classSet('slds-button slds-button_icon slds-modal__close');
    const fullScreenActive = this.isSmallScreenSize && this.size === SIZE_FULL;
    classes.add({
      'slds-modal_full-close-button': fullScreenActive
    });
    return classes.toString();
  }
  get showAriaDescribedBy() {
    return !isAriaDescriptionSupported() && this.isDescriptionSet;
  }
  get modalResizing() {
    if (features.enableAssertContext260Round2) {
      assertContext$1(this);
    }
    if (!this._resizing) {
      this._resizing = this.scheduleWindowResizeEvent.bind(this);
    }
    return this._resizing;
  }
  get isHelptextA11yInModalEnabled() {
    return features.enableHelptextA11yInModal;
  }
  toggleDisableCloseButton() {
    const isSwitchingToDisabled = !this.disableCloseButton && this.disableClose;
    const disableCloseButtonMessage = isSwitchingToDisabled ? this.disableCloseBtnMessage : '';
    if (isSwitchingToDisabled) {
      this.ariaLiveMessage = disableCloseButtonMessage;
      this.showAriaLiveMessage = true;
      synchronizeAttrs(this.modalWrapper, {
        [`${ARIA.BUSY}`]: true
      });
      synchronizeAttrs(this.modalCloseButton, {
        disabled: 'disabled'
      });
      this.disableCloseButton = true;
    } else {
      this.ariaLiveMessage = disableCloseBtnMessage;
      this.showAriaLiveMessage = false;
      synchronizeAttrs(this.modalWrapper, {
        [`${ARIA.BUSY}`]: null
      });
      synchronizeAttrs(this.modalCloseButton, {
        disabled: null
      });
      this.disableCloseButton = false;
    }
  }
  saveActiveElement() {
    this.savedActiveElement = getElementWithFocus();
  }
  renderBackgroundInert() {
    this.savedInertElements = makeEverythingExceptElementInert(this.template.host);
  }
  renderBackgroundActive() {
    restoreInertness(this.savedInertElements);
    this.savedInertElements = [];
  }
  returnFocusToBackground() {
    const {
      savedActiveElement
    } = this;
    const elementWasFocused = returnFocusToElement(savedActiveElement);
    if (!elementWasFocused) {
      console.warn('Modal :: Nothing to return focus to');
    }
  }
  queueShowModal() {
    if (this.isModalOpen && !this.isModalTransitioningIn) {
      this.isModalTransitioningIn = true;
    }
  }
  openModal() {
    this.saveActiveElement();
    this.renderBackgroundInert();
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      if (lwcModalCount === 0) {
        if (!import.meta.env.SSR) {
          originalBodyOverflow = getComputedStyle(document.body).overflow;
          document.body.style.overflow = 'hidden';
        }
      }
      lwcModalCount++;
    }
  }
  handleModalCloseState() {
    if (this.isModalOpen) {
      this.isModalOpen = false;
      lwcModalCount--;
      if (lwcModalCount === 0) {
        if (!import.meta.env.SSR) {
          document.body.style.overflow = originalBodyOverflow;
        }
        originalBodyOverflow = null;
      }
    }
  }
  closeModal() {
    this.returnFocusToBackground();
    this.renderBackgroundActive(this.savedInertElements);
    if (this.ariaObserver) {
      this.ariaObserver.disconnect();
      this.ariaObserver = undefined;
    }
  }
  updateAriaDescription() {
    const {
      description
    } = this;
    if (isAriaDescriptionSupported()) {
      const descriptionToSet = this.isDescriptionSet ? description : null;
      return synchronizeAttrs(this.modalWrapper, {
        [ARIA.DESCRIPTION]: descriptionToSet
      });
    }
    const spanId = this.isDescriptionSet && this.modalDescSpan.id || null;
    return synchronizeAttrs(this.modalWrapper, {
      [ARIA.DESCRIBEDBY]: spanId
    });
  }
  updateAriaLabel() {
    const {
      label,
      headerRegistered,
      headerLabelId,
      headerLabelIsPopulated
    } = this;
    const labelIsEmpty = label === '' || label.trim().length === 0;
    if (headerRegistered) {
      if (headerLabelId && headerLabelIsPopulated) {
        if (this.ariaObserver) {
          this.ariaObserver.connect({
            targetNode: this.modalWrapper,
            attribute: 'aria-labelledby',
            relatedNodes: [this.headerTitleRef]
          });
        }
        synchronizeAttrs(this.modalWrapper, {
          [ARIA.LABEL]: null
        });
      } else {
        this.unsetAriaLabelAndError();
      }
    } else if (!labelIsEmpty) {
      synchronizeAttrs(this.modalWrapper, {
        [ARIA.LABELLEDBY]: null,
        [ARIA.LABEL]: label
      });
    } else if (!this.isModalClosing) {
      this.unsetAriaLabelAndError();
    }
  }
  errorLabelRequired() {
    let errorMsg = 'LightningModal - Templates with <lightning-modal-header> should define the label attribute as an attribute on <lightning-modal-header label="Modal Heading"> .';
    errorMsg += ' Templates without <lightning-modal-header> should define the label attribute in the Modal.open({ label: "Modal Heading" })';
    console.error(errorMsg);
  }
  handleCloseClick() {
    if (!this.disableCloseButton) {
      this.modal.close();
    }
  }
  handlePrivateClose(e) {
    if (!(e.detail && e.detail[secure])) {
      console.error('Invalid access to privateclose event');
      return;
    }
    this.handleModalCloseState();
    this.isModalClosing = true;
    if (hasAnimation()) {
      this.modalWrapper.classList.remove('slds-fade-in-open');
      this.modalBackdrop.classList.remove('slds-backdrop_open');
      this.modalBackdrop.addEventListener('transitionend', () => {
        e.detail.resolve();
      });
    } else {
      e.detail.resolve();
    }
    if (this.headerRegistered && this.unregisterHeader) {
      this.unregisterHeader();
    }
    if (this.bodyRegistered && this.unregisterBody) {
      this.unregisterBody();
    }
    if (this.footerRegistered && this.unregisterFooter) {
      this.unregisterFooter();
    }
    this.closeModal();
  }
  handlePrivateDisableCloseButton(e) {
    if (!(e.detail && e.detail[secure])) {
      console.error('Invalid access to privatedisableclose event');
      return;
    }
    this.toggleDisableCloseButton();
  }
  handleModalKeyDown(e) {
    const {
      ctrlKey,
      metaKey,
      shiftKey,
      key
    } = e;
    const hasModifier = ctrlKey || metaKey || shiftKey;
    if ((!features.enableTooltipHoverDismiss || !hasActiveTooltip()) && !hasModifier && !this.disableCloseButton && (key === 'Esc' || key === 'Escape')) {
      e.stopPropagation();
      e.preventDefault();
      this.handleCloseClick();
    }
  }
  focusFirstElement() {
    const {
      autoFocusCompletedOnce,
      modalElement
    } = this;
    if (autoFocusCompletedOnce || !modalElement) {
      return;
    }
    const {
      bodyRegistered,
      footerRegistered,
      headerRegistered,
      headerTitleRef,
      headerDefaultSlotIsPopulated,
      headerSlotHasRendered,
      bodyDefaultSlotIsPopulated,
      bodySlotHasRendered,
      bodyTabElemRef,
      footerDefaultSlotIsPopulated,
      footerSlotHasRendered
    } = this;
    const waitForHeaderSlotRender = headerRegistered && headerDefaultSlotIsPopulated && !headerSlotHasRendered;
    const waitForBodySlotRender = bodyRegistered && bodyDefaultSlotIsPopulated && !bodySlotHasRendered;
    const waitForFooterSlotRender = footerRegistered && footerDefaultSlotIsPopulated && !footerSlotHasRendered;
    if (waitForHeaderSlotRender || waitForBodySlotRender || waitForFooterSlotRender) {
      return;
    }
    const modalHeadingElem = headerRegistered && headerTitleRef ? headerTitleRef : null;
    const preferredFocusElem = modalHeadingElem ? modalHeadingElem : bodyTabElemRef || null;
    const closeButtonElem = this.modalCloseButton;
    const outerModalElem = this.modalWrapper;
    const fallbackFocusElem = this.disableCloseButton ? outerModalElem : closeButtonElem;
    const focusElem = preferredFocusElem ? preferredFocusElem : fallbackFocusElem;
    if (focusElem !== null) {
      this.lastFocusedElement = focusElem;
      requestAnimationFrame(() => {
        focusElem?.focus();
      });
      this.autoFocusCompletedOnce = true;
    } else {
      console.error('LightningModal - at least one focusable element is required, none found.');
    }
  }
  unregisterBody() {
    this.initBodyState();
  }
  registerBody({
    bodyId,
    bodyIsPopulated,
    updateBodyCallback,
    defaultSlotHasRendered,
    unRegisterCallback,
    firstTabbableElemRef
  }) {
    this.bodyRegistered = true;
    this.bodyDefaultSlotIsPopulated = bodyIsPopulated;
    this.bodySlotHasRendered = defaultSlotHasRendered;
    this.bodyId = bodyId;
    this.baseUpdateBodyCallback = updateBodyCallback;
    this.bodyTabElemRef = firstTabbableElemRef || null;
    unRegisterCallback(() => {
      this.unregisterBody();
    });
    this.updateModalBodyHeight();
    if (this.isModalSizeNotSet) {
      this.size = this.modal?.size || null;
    }
    if (!this.windowResizeEventBound) {
      this.addWindowResizeEventListener();
    }
    if (!this.windowOrientationEventBound) {
      this.addOrientationChangeListener();
    }
    if (!this.focusinEventBound) {
      this.addFocusinEventListener();
    }
  }
  handleBodyRegister(e) {
    const {
      detail
    } = e;
    this.registerBody(detail);
    e.stopPropagation();
  }
  initBodyState() {
    this.bodyRegistered = false;
    this.bodyDefaultSlotIsPopulated = false;
    this.bodySlotHasRendered = false;
    this.bodyId = null;
    this.baseUpdateBodyCallback = null;
    this.bodyResizeScheduled = false;
    this.bodyTabElemRef = null;
    this.removeModalEventListeners();
  }
  unregisterHeader() {
    this.initHeaderState();
    this.updateAriaLabel();
  }
  updateHeaderHeight(value) {
    this.headerHeight = !Number.isNaN(value) && value >= 0 ? value : 0;
  }
  registerHeader({
    defaultSlotIsPopulated,
    defaultSlotWrapperId,
    defaultSlotHasRendered,
    unRegisterCallback,
    labelIsPopulated,
    headerHeight,
    headerRef,
    labelId
  }) {
    this.headerRegistered = true;
    this.updateHeaderHeight(headerHeight);
    this.headerDefaultSlotIsPopulated = defaultSlotIsPopulated;
    this.headerSlotHasRendered = defaultSlotHasRendered;
    this.headerSlotWrapperId = defaultSlotWrapperId;
    this.headerLabelId = labelId;
    this.headerLabelIsPopulated = labelIsPopulated;
    this.headerTitleRef = headerRef;
    unRegisterCallback(() => {
      this.unregisterHeader();
    });
    if (this.bodyRegistered) {
      this.updateModalBodyHeight();
    }
    if (this.isModalSizeNotSet) {
      this.size = this.modal?.size || null;
    }
  }
  handleHeaderRegister(e) {
    const {
      detail
    } = e;
    this.registerHeader(detail);
    this.updateAriaLabel();
    e.stopPropagation();
  }
  initHeaderState() {
    this.headerRegistered = false;
    this.headerHeight = 0;
    this.headerDefaultSlotIsPopulated = false;
    this.headerSlotWrapperId = null;
    this.headerSlotHasRendered = false;
    this.headerLabelId = null;
    this.headerLabelIsPopulated = null;
    this.headerTitleRef = null;
  }
  unregisterFooter() {
    this.initFooterState();
  }
  updateFooterHeight(value) {
    this.footerHeight = !Number.isNaN(value) && value >= 0 ? value : 0;
  }
  registerFooter({
    defaultSlotIsPopulated,
    defaultSlotHasRendered,
    footerHeight,
    unRegisterCallback
  }) {
    this.footerRegistered = true;
    this.footerDefaultSlotIsPopulated = defaultSlotIsPopulated;
    this.footerSlotHasRendered = defaultSlotHasRendered;
    this.updateFooterHeight(footerHeight);
    unRegisterCallback(() => {
      this.unregisterFooter();
    });
    if (this.bodyRegistered) {
      this.updateModalBodyHeight();
    }
    if (this.isModalSizeNotSet) {
      this.size = this.modal?.size || null;
    }
  }
  handleFooterRegister(e) {
    const {
      detail
    } = e;
    this.registerFooter(detail);
    e.stopPropagation();
  }
  initFooterState() {
    this.footerRegistered = false;
    this.footerHeight = 0;
    this.footerSlotHasRendered = false;
    this.footerDefaultSlotIsPopulated = false;
  }
  updateModalBodyHeight() {
    {
      this.template.querySelector('[data-container]').classList.add('slds-modal__container__reflow_resize');
    }
    clearTimeout(this.timeoutId);
    this.timeoutId = 0;
    if (this.updateHeaderCallback) {
      this.updateHeaderCallback({
        size: this.size
      });
    }
    if (this.updateFooterCallback) {
      this.updateFooterCallback({
        size: this.size
      });
    }
    if (this.bodyRegistered && !this.bodyResizeScheduled) {
      this.setIsSmallScreenSize();
      requestAnimationFrame(() => {
        this.bodyResizeScheduled = false;
        if (this.baseUpdateBodyCallback) {
          const values = {
            footerHeight: this.footerHeight || 0,
            headerHeight: this.headerHeight || 0,
            backdropHeight: this.backdropDimensions.height,
            backdropWidth: this.backdropDimensions.width,
            sizeSetFull: this.size === SIZE_FULL,
            isSmallScreenSize: this.isSmallScreenSize,
            size: this.size
          };
          this.baseUpdateBodyCallback(values);
        }
      });
      this.bodyResizeScheduled = true;
    }
  }
  scheduleWindowResizeEvent() {
    if (this.timeoutId === 0) {
      this.timeoutId = setTimeout(() => {
        this.updateModalBodyHeight();
      }, DEBOUNCE_RESIZE);
    }
  }
  addWindowResizeEventListener() {
    if (!import.meta.env.SSR && !this.windowResizeEventBound) {
      window.addEventListener('resize', this.handleWindowResizeEvent);
      this.windowResizeEventBound = true;
    }
  }
  removeWindowResizeEventListener() {
    if (!import.meta.env.SSR && this.windowResizeEventBound) {
      window.removeEventListener('resize', this.handleWindowResizeEvent);
      clearTimeout(this.timeoutId);
      this.timeoutId = 0;
      this.windowResizeEventBound = false;
    }
  }
  removeOrientationChangeListener() {
    if (this.windowOrientationEventBound && this.portraitMatchMedia) {
      this.portraitMatchMedia.removeEventListener('change', this.screenOrientationChangeHandler);
      this.portraitMatchMedia = null;
      this.windowOrientationEventBound = false;
    }
    if (this.screenOrientationChangeHandler) {
      this.screenOrientationChangeHandler = null;
    }
  }
  addOrientationChangeListener() {
    if (!import.meta.env.SSR) {
      this.portraitMatchMedia = window.matchMedia('(orientation: portrait)');
      this.screenOrientationChangeHandler = this.handleWindowResizeEvent.bind(this);
      if (this.portraitMatchMedia) {
        this.portraitMatchMedia.addEventListener('change', this.screenOrientationChangeHandler);
        this.windowOrientationEventBound = true;
      }
    }
  }
  addFocusinEventListener() {
    if (!this.focusinEventBound) {
      this.focusinEventBound = true;
      window.addEventListener('focusin', modalFocusinEventHandler.bind(this));
    }
  }
  removeFocusinEventListener() {
    if (this.focusinEventBound) {
      this.focusinEventBound = false;
      window.removeEventListener('focusin', modalFocusinEventHandler.bind(this));
    }
  }
  handleLastFocusedElem(e) {
    if (!(e.detail && e.detail[secure])) {
      console.error('Invalid access to onprivatelightningmodallastfocus event');
      return;
    }
    e.stopPropagation();
    this.lastFocusedElement = e.detail.privatelightningmodallastfocus;
  }
  setIsSmallScreenSize() {
    if (!import.meta.env.SSR) {
      const docElem = document && document.documentElement || null;
      const browserWidth = docElem ? docElem.clientWidth : window.innerWidth;
      const isSmallScreenSize = browserWidth <= SMALL_SCREEN_SIZE;
      if (isSmallScreenSize !== this.isSmallScreenSize) {
        this.isSmallScreenSize = isSmallScreenSize;
      }
    }
  }
  removeModalEventListeners() {
    this.removeWindowResizeEventListener();
    this.removeOrientationChangeListener();
    this.removeFocusinEventListener();
  }
  initBaseState() {
    this.initialRender = true;
    this.autoFocusCompletedOnce = false;
    this.windowResizeEventBound = false;
    this.timeoutId = 0;
    this.disableCloseButton = false;
    this.modalLabel = null;
    this.modalLabelledBy = null;
    this.modalDescribedBy = null;
    this.showAriaLiveMessage = false;
    this.ariaLiveMessage = '';
    this.savedInertElements = [];
    this.savedActiveElement = null;
    this.isModalOpen = false;
    this.isModalTransitioningIn = false;
    this.isModalClosing = false;
    this._size = null;
    this.isSmallScreenSize = null;
  }
  initModalState() {
    this.initBaseState();
    this.initHeaderState();
    this.initBodyState();
    this.initFooterState();
  }
  connectedCallback() {
    super.connectedCallback();
    this.initModalState();
    this.setIsSmallScreenSize();
  }
  disconnectedCallback() {
    this.handleModalCloseState();
    this.removeModalEventListeners();
    this.closeModal();
  }
  renderedCallback() {
    if (this.initialRender) {
      this.openModal();
      this.initialRender = false;
    } else {
      this.updateAriaLabel();
      this.updateAriaDescription();
      if (!this.isModalTransitioningIn) {
        this.queueShowModal();
      }
      if (!this.autoFocusCompletedOnce) {
        this.toggleDisableCloseButton();
        this.focusFirstElement();
      }
      if (this.isModalSizeNotSet) {
        this.size = this.modal?.size || null;
      }
    }
    this.updateModalBodyHeight();
  }
  /*LWC compiler v9.5.3*/
}
LightningModalBase[instanceName] = 'lightning-modal-base';
registerDecorators(LightningModalBase, {
  publicProps: {
    defaultSlot: {
      config: 1
    }
  },
  track: {
    savedActiveElement: 1
  },
  fields: ["initialRender", "autoFocusCompletedOnce", "timeoutId", "disableCloseButton", "sectionAriaBusy", "closeButtonAltText", "disableCloseBtnMessage", "isModalClosing", "isSmallScreenSize", "headerRegistered", "headerHeight", "headerDefaultSlotIsPopulated", "headerSlotWrapperId", "headerSlotHasRendered", "headerLabelId", "headerLabelIsPopulated", "headerTitleRef", "bodyRegistered", "bodyDefaultSlotIsPopulated", "bodySlotHasRendered", "bodyId", "baseUpdateBodyCallback", "bodyResizeScheduled", "bodyTabElemRef", "windowResizeEventBound", "windowOrientationEventBound", "portraitMatchMedia", "screenOrientationChangeHandler", "focusinEventBound", "lastFocusedElement", "footerRegistered", "footerHeight", "footerSlotHasRendered", "footerDefaultSlotIsPopulated", "modalLabel", "modalLabelledBy", "modalDescribedBy", "showAriaLiveMessage", "ariaLiveMessage", "isModalOpen", "isModalTransitioningIn", "savedInertElements", "ariaObserver", "updateHeaderCallback", "updateFooterCallback", "_resizing", "_size", "unsetAriaLabelAndError", "handleWindowResizeEvent", "handleModalBaseFocusin"]
});
const __lwc_component_class_internal$4 = registerComponent(LightningModalBase, {
  tmpl: _tmpl$2,
  sel: "lightning-modal-base",
  apiVersion: 66
});

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
var labelOK = "OK";

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
var labelCancel = "Cancel";

const themeOptions = ['default', 'shade', 'inverse', 'alt-inverse', 'success', 'info', 'warning', 'error', 'offline'];
class LightningModal extends __lwc_component_class_internal$4 {
  constructor(...args) {
    super(...args);
    this.label = void 0;
    this.description = void 0;
    this.okText = labelOK;
    this.cancelText = labelCancel;
  }
  getChildProperty(property) {
    if (this.defaultSlot) {
      return this.defaultSlot.firstChild[property];
    }
    return null;
  }
  setVariant() {
    const variant = this.getChildProperty('variant');
    const normalizedVariant = normalizeString(variant, {
      fallbackValue: 'header',
      validValues: ['header', 'headerless']
    });
    this.showHeader = normalizedVariant === 'header';
  }
  setChildProperties(detail) {
    this.role = detail.role;
    this.label = detail.label;
    this.hideCancel = detail.hideCancel;
    this.getOkValue = detail.getOkValue;
    this.getCancelValue = detail.getCancelValue;
    this.description = detail.showDescription ? detail.message : '';
    this.setVariant();
  }
  updateAriaLabelledBy() {
    if (this.showHeader) {
      const heading = this.template.querySelector('[data-modal-heading]');
      const headingId = getRealDOMId(heading);
      synchronizeAttrs(this.modalWrapper, {
        'aria-labelledby': headingId
      });
    }
  }
  get ariaLabel() {
    return this.showHeader ? null : this.label;
  }
  get computedModalHeaderCssClasses() {
    const theme = this.getChildProperty('theme');
    const normalizedTheme = normalizeString(theme, {
      fallbackValue: 'default',
      validValues: themeOptions
    });
    const classes = classSet('slds-modal__header slds-theme_alert-texture');
    classes.add(`slds-theme_${normalizedTheme}`);
    return classes.toString();
  }
  get computedModalContentCssClasses() {
    const classes = classSet('slds-modal__content slds-p-around_medium');
    classes.add({
      'slds-modal__content_headless': !this.showHeader
    });
    return classes.toString();
  }
  get computedModalCssClasses() {
    const classes = classSet('slds-modal fix-slds-modal slds-modal_prompt');
    if (hasAnimation()) {
      classes.add({
        'slds-fade-in-open': this.isModalTransitioningIn
      });
    } else {
      classes.add({
        'slds-fade-in-open': true
      });
    }
    return classes.toString();
  }
  handleOkClick() {
    let okValue;
    if (this.getOkValue) {
      okValue = this.getOkValue();
    }
    this.modal.close(okValue);
  }
  handleCloseClick() {
    let cancelValue;
    if (this.getCancelValue) {
      cancelValue = this.getCancelValue();
    }
    this.modal.close(cancelValue);
  }
  focusElement() {
    if (this.showHeader) {
      const header = this.template.querySelector('.slds-modal__title');
      requestAnimationFrame(() => {
        header.focus();
      });
    } else {
      const tabbableElems = findAllTabbableElements(this.template.querySelector('.slds-modal__container'));
      if (tabbableElems && tabbableElems.length) {
        const focusElem = tabbableElems[0];
        focusElem.focus();
        if (focusElem.select) {
          focusElem.select();
        }
      } else {
        this.modalWrapper.focus();
      }
    }
  }
  handlePrivateChildRender(event) {
    event.stopPropagation();
    this.setChildProperties(event.detail || {});
    if (!this.isModalTransitioningIn) {
      this.queueShowModal();
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('data-interactive-dialog', true);
  }
  renderedCallback() {
    if (this.initialRender) {
      this.openModal();
      this.initialRender = false;
    } else {
      if (!this.isModalTransitioningIn) {
        this.queueShowModal();
      }
      this.template.host.style = 'z-index: 9099; position: absolute;';
      this.updateAriaDescription();
      this.updateAriaLabelledBy();
      if (!this.autoFocusCompletedOnce) {
        this.focusElement();
        this.autoFocusCompletedOnce = true;
      }
    }
  }
  /*LWC compiler v9.5.3*/
}
LightningModal[instanceName] = 'lightning-interactive-dialog-base';
registerDecorators(LightningModal, {
  fields: ["label", "description", "okText", "cancelText"]
});
const __lwc_component_class_internal$3 = registerComponent(LightningModal, {
  tmpl: _tmpl$6,
  sel: "lightning-interactive-dialog-base",
  apiVersion: 66
});

const stc0$1 = [];
function tmpl$1($api, $cmp, $slotset, $ctx) {
  return stc0$1;
  /*LWC compiler v9.5.3*/
}
var _tmpl$1 = registerTemplate(tmpl$1);
tmpl$1.stylesheets = [];
tmpl$1.stylesheetToken = "lwc-63dd3nje2h7";
freezeTemplate(tmpl$1);

const stc0 = {
  attrs: {
    "data-overlay-container": ""
  },
  context: {
    lwc: {
      dom: "manual"
    }
  },
  key: 0
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {h: api_element} = $api;
  return [api_element("div", stc0)];
  /*LWC compiler v9.5.3*/
}
var _tmpl = registerTemplate(tmpl);
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-6g5m5782a6m";
freezeTemplate(tmpl);

class LightningOverlayContainer extends __lwc_component_class_internal$d {
  constructor(...args) {
    super(...args);
    this.stack = [];
    this.afterFirstRender = false;
  }
  get root() {
    return this.template.querySelector('[data-overlay-container]');
  }
  push(scope, apis) {
    apis = apis || {};
    if (typeof apis !== 'object') {
      throw new Error('Invalid .open() or .open({}) argument.');
    }
    if ('innerHTML' in apis || 'outerHTML' in apis) {
      throw new Error('Illegal api values');
    }
    const {
      [instanceName]: overlayInstanceName,
      [parent]: overlayParent
    } = scope;
    if (!this.isOverlayAllowedToAdd(overlayInstanceName)) {
      return Promise.reject();
    }
    const element = createElement(overlayInstanceName, {
      is: scope
    });
    const normalizedApis = normalizeApis(apis);
    Object.entries(normalizedApis).forEach(([key, value]) => {
      const keyLower = key.toLowerCase();
      const match = keyLower.match(/^on(.+)/);
      if (match) {
        const eventName = match[1];
        element.addEventListener(eventName, value);
      } else {
        element[key] = value;
      }
    });
    let promise = null;
    const id = guid();
    if (overlayParent) {
      const parentElement = createElement(overlayParent[instanceName], {
        is: overlayParent
      });
      if (overlayInstanceName === 'lightning-overlay') {
        parentElement.focusTrapEnabled = apis.enableFocusTrap;
      }
      this.root.appendChild(parentElement);
      parentElement.defaultSlot.appendChild(element);
      promise = new Promise(resolve => {
        this.stack.push({
          resolve,
          element,
          parentElement,
          id
        });
      });
    } else {
      this.root.appendChild(element);
      promise = new Promise(resolve => {
        this.stack.push({
          resolve,
          element,
          id
        });
      });
    }
    const overlayDetails = normalizeOverlayDetails(LWC_OVERLAY_ENGINE, overlayInstanceName, {
      id
    });
    addOverlayToSharedState(overlayDetails);
    return promise;
  }
  findElementInStack(element) {
    return this.stack.find(item => item.element === element);
  }
  findElementIndexInStack(element) {
    return this.stack.indexOf(item => item.element === element);
  }
  pop(element, result, promise) {
    const stackItemToRemove = this.findElementInStack(element);
    if (stackItemToRemove && !stackItemToRemove.isClosing) {
      stackItemToRemove.isClosing = true;
      const {
        element: elem,
        parentElement,
        resolve,
        id
      } = stackItemToRemove;
      resolve(result);
      if (promise) {
        promise.then(() => {
          this.removeOverlay(elem, parentElement, id);
        });
      } else {
        this.removeOverlay(elem, parentElement, id);
      }
    } else {
      console.info('The LightningOverlay extended component is closed or in the process of closing. this.close() was previously called.');
    }
    return null;
  }
  removeOverlay(element, parentElement, id) {
    const overlayType = element && element.tagName.toLowerCase();
    if (parentElement) {
      const defaultSlot = parentElement.defaultSlot;
      if (parentElement.parentNode) {
        parentElement.parentNode.removeChild(parentElement);
      }
      if (defaultSlot && defaultSlot.firstElementChild) {
        defaultSlot.removeChild(defaultSlot.firstElementChild);
      }
    } else if (element) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      } else {
        element.remove();
      }
    }
    const indexToRemove = this.findElementIndexInStack(element);
    if (indexToRemove > -1) {
      this.stack.splice(indexToRemove, 1);
    }
    const overlayDetails = normalizeOverlayDetails(LWC_OVERLAY_ENGINE, overlayType, {
      id
    });
    removeOverlayFromSharedState(overlayDetails);
  }
  connectedCallback() {
    subscribeOverlay(this.afterFirstRender, state => {
      const {
        mixedOverlayPresent,
        auraHighestZindex,
        lwcAllOverlayCount,
        stack
      } = state;
      if (lwcAllOverlayCount === 0) {
        return;
      }
      let lwcZIndexToSet = LWC_OVERLAY_STARTING_ZINDEX;
      let lwcOverlayCount = 0;
      const lwcToastContainerZIndexToSet = LWC_TOAST_CONTAINER_STARTING_ZINDEX;
      stack.forEach((overlayObject, stackIndex) => {
        const {
          overlayEngine,
          overlayType,
          overlayDetails
        } = overlayObject;
        let overlayElem;
        const positionToSet = LWC_OVERLAY_TYPES[overlayType] && LWC_OVERLAY_TYPES[overlayType].pos || 'fixed';
        const isToastContainer = overlayType === TYPE_TOAST_CONTAINER;
        if (!mixedOverlayPresent) {
          overlayElem = this.root.childNodes[lwcOverlayCount];
          if (overlayElem) {
            const zIndexToSet = isToastContainer ? lwcToastContainerZIndexToSet : lwcZIndexToSet;
            overlayElem.style.zIndex = zIndexToSet;
            overlayElem.style.position = positionToSet;
            const updateDetailsObject = {
              zIndex: zIndexToSet
            };
            const updatedOverlayObject = normalizeOverlayDetails(overlayEngine, overlayType, Object.assign({}, overlayDetails, updateDetailsObject));
            if (updatedOverlayObject !== null) {
              state.stack[stackIndex] = updatedOverlayObject;
            }
            lwcOverlayCount += 1;
          }
        } else if (overlayEngine === LWC_OVERLAY_ENGINE) {
          overlayElem = this.root.childNodes[lwcOverlayCount];
          const existingZindexValueIsSet = !!(overlayDetails && overlayDetails.zIndex);
          const existingZindexValue = overlayDetails && overlayDetails.zIndex;
          let lwcZIndex;
          if (!existingZindexValueIsSet || Number.isNaN(existingZindexValue)) {
            if (isToastContainer) {
              lwcZIndex = lwcToastContainerZIndexToSet;
            } else {
              lwcZIndexToSet = stackIndex !== 0 ? auraHighestZindex + LWC_ZINDEX_OFFSET : lwcZIndexToSet;
              lwcZIndex = lwcZIndexToSet;
            }
            const updateDetailsObject = {
              zIndex: lwcZIndex
            };
            const updatedOverlayObj = normalizeOverlayDetails(overlayEngine, overlayType, Object.assign({}, overlayDetails, updateDetailsObject));
            if (updatedOverlayObj !== null) {
              state.stack[stackIndex] = updatedOverlayObj;
            }
          } else if (isToastContainer) {
            lwcZIndex = existingZindexValue >= LWC_TOAST_CONTAINER_STARTING_ZINDEX ? existingZindexValue : LWC_TOAST_CONTAINER_STARTING_ZINDEX;
          } else {
            lwcZIndexToSet = existingZindexValue >= LWC_OVERLAY_STARTING_ZINDEX ? existingZindexValue : LWC_OVERLAY_STARTING_ZINDEX;
            lwcZIndex = lwcZIndexToSet;
          }
          if (overlayElem) {
            overlayElem.style.zIndex = lwcZIndex;
            overlayElem.style.position = positionToSet;
            lwcOverlayCount += 1;
          }
        } else {
          lwcZIndexToSet += LWC_ZINDEX_INCREMENT;
        }
      });
    });
    this.afterFirstRender = true;
  }
  isOverlayAllowedToAdd(overlayType) {
    const isApprovedOverlayType = !!LWC_OVERLAY_TYPES[overlayType];
    if (!isApprovedOverlayType) {
      return false;
    }
    const {
      maxNum,
      statName
    } = LWC_OVERLAY_TYPES[overlayType];
    const maxNumNotSet = typeof maxNum === 'undefined';
    const count = statName && getStatCount(statName) || 0;
    return maxNumNotSet || maxNum > count;
  }
  /*LWC compiler v9.5.3*/
}
registerDecorators(LightningOverlayContainer, {
  publicMethods: ["push", "pop"],
  fields: ["stack", "afterFirstRender"]
});
const __lwc_component_class_internal$2 = registerComponent(LightningOverlayContainer, {
  tmpl: _tmpl,
  sel: "lightning-overlay-container",
  apiVersion: 66
});

const ROOT = 'body';
const OVERLAY_CONTAINER = 'lightning-overlay-container';
function container() {
  let element = document.querySelector(`${ROOT} > ${OVERLAY_CONTAINER}`);
  if (!element) {
    element = createElement(OVERLAY_CONTAINER, {
      is: __lwc_component_class_internal$2
    });
    element.classList.add('slds-scope');
    document.body.appendChild(element);
  }
  return element;
}
class LightningPrimitiveOverlay extends __lwc_component_class_internal$d {
  static open(apis) {
    if (!import.meta.env.SSR) {
      return container().push(this, apis);
    }
    return new Promise(() => {});
  }
  close(result, promise) {
    if (!import.meta.env.SSR) {
      container().pop(this.template.host, result, promise);
    }
  }
  /*LWC compiler v9.5.3*/
}
LightningPrimitiveOverlay[instanceName] = 'lightning-primitive-overlay';
registerDecorators(LightningPrimitiveOverlay, {
  publicMethods: ["close"]
});
const __lwc_component_class_internal$1 = registerComponent(LightningPrimitiveOverlay, {
  tmpl: _tmpl$1,
  sel: "lightning-primitive-overlay",
  apiVersion: 66
});

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
var labelDefault = "Prompt";

const {
  setContext,
  assertContext
} = privateContext;
class LightningPrompt extends __lwc_component_class_internal$1 {
  close(result) {
    const promise = new Promise(resolve => {
      if (!import.meta.env.SSR) {
        this.dispatchEvent(new CustomEvent('privateclose', {
          detail: {
            resolve,
            [secure]: true
          },
          bubbles: true
        }));
      }
    });
    super.close(result, promise);
  }
  constructor() {
    super();
    this.label = labelDefault;
    this.message = '';
    this.defaultValue = '';
    this.variant = 'header';
    this.theme = 'default';
    setContext(this);
  }
  renderedCallback() {
    assertContext(this);
    const evt = new CustomEvent('privatechildrender', {
      bubbles: true,
      detail: {
        message: this.message,
        label: this.label,
        hideCancel: false,
        showDescription: false,
        getOkValue: this.getOkValue.bind(this),
        getCancelValue: () => null,
        role: 'dialog'
      }
    });
    this.dispatchEvent(evt);
  }
  getOkValue() {
    if (this.template.querySelector('input')) {
      return this.template.querySelector('input').value;
    }
    return this.defaultValue;
  }
  /*LWC compiler v9.5.3*/
}
LightningPrompt[instanceName] = 'lightning-prompt';
LightningPrompt[parent] = __lwc_component_class_internal$3;
registerDecorators(LightningPrompt, {
  publicProps: {
    label: {
      config: 0
    },
    message: {
      config: 0
    },
    defaultValue: {
      config: 0
    },
    variant: {
      config: 0
    },
    theme: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = registerComponent(LightningPrompt, {
  tmpl: _tmpl$b,
  sel: "lightning-prompt",
  apiVersion: 66
});

export { _tmpl$8 as _, registerComponent as a, __lwc_component_class_internal as b, freezeTemplate as f, parseFragment as p, registerTemplate as r, sanitizeAttribute as s };