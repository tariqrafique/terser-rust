import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./spinner.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet } from 'lightning/utils';
import { normalizeString as normalize } from 'lightning/utilsPrivate';
import { features } from 'lightning/features';
import { privateContext } from 'lightning/utilsInternal';
const {
  setContext,
  assertContext
} = privateContext;
const DEFAULT_SIZE = 'medium';
const DEFAULT_VARIANT = 'base';
class LightningSpinner extends LightningShadowBaseClass {
  get size() {
    return this._originalSize;
  }
  set size(val) {
    if (features.enableAssertContext260Round2) {
      assertContext(this);
    }
    this._originalSize = val;
    this._privateSize = this.normalizeSize(val);
    this.setAttribute('size', this._privateSize);
  }
  get variant() {
    return this._originalVariant;
  }
  set variant(val) {
    this._originalVariant = val;
    this._privateVariant = this.normalizeVariant(val);
    if (this._privateVariant !== DEFAULT_VARIANT) {
      this.setAttribute('variant', this._privateVariant);
    }
  }
  constructor() {
    super();
    this.alternativeText = void 0;
    this._originalSize = DEFAULT_SIZE;
    this._privateSize = DEFAULT_SIZE;
    this._originalVariant = void 0;
    this._privateVariant = DEFAULT_VARIANT;
    this._altText = null;
    this.stopScrolling = event => {
      event.preventDefault();
    };
    setContext(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this.classList.add('slds-spinner_container');
    if (!import.meta.env.SSR) {
      this.template.addEventListener('mousewheel', this.stopScrolling);
      this.template.addEventListener('touchmove', this.stopScrolling);
    }
  }
  renderedCallback() {
    setTimeout(() => {
      this._altText = this.alternativeText;
    }, 0);
  }
  normalizeVariant(variant) {
    return normalize(variant, {
      fallbackValue: DEFAULT_VARIANT,
      validValues: ['base', 'brand', 'inverse']
    });
  }
  normalizeSize(size) {
    return normalize(size, {
      fallbackValue: DEFAULT_SIZE,
      validValues: ['xx-small', 'x-small', 'small', 'medium', 'large']
    });
  }
  get computedClass() {
    const classes = classSet('slds-spinner');
    if (this._privateVariant !== DEFAULT_VARIANT) {
      classes.add(`slds-spinner_${this._privateVariant}`);
    }
    classes.add(`slds-spinner_${this._privateSize}`);
    return classes.toString();
  }
  get validAlternativeText() {
    const hasAlternativeText = !!this.alternativeText;
    if (!hasAlternativeText) {
      console.warn(`<lightning-spinner> The alternativeText attribute should not be empty. Please add a description of what is causing the wait.`);
    }
    return hasAlternativeText;
  }
  /*LWC compiler v9.5.3*/
}
LightningSpinner.validationOptOut = ['class'];
_registerDecorators(LightningSpinner, {
  publicProps: {
    alternativeText: {
      config: 0
    },
    size: {
      config: 3
    },
    variant: {
      config: 3
    }
  },
  track: {
    _originalVariant: 1
  },
  fields: ["_originalSize", "_privateSize", "_privateVariant", "_altText", "stopScrolling"]
});
const __lwc_component_class_internal = _registerComponent(LightningSpinner, {
  tmpl: _tmpl,
  sel: "lightning-spinner",
  apiVersion: 66
});
export default __lwc_component_class_internal;