import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./baseFormattedText.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import { isTextIgnoreRTL, normalizeBoolean, parseToFormattedLinkifiedParts } from 'lightning/utilsPrivate';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
class BaseFormattedText extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.value = '';
    this._linkify = false;
  }
  get linkify() {
    return this._linkify;
  }
  set linkify(value) {
    this._linkify = normalizeBoolean(value);
  }
  get shouldFormat() {
    return this.linkify && this.isString;
  }
  get isString() {
    return this.value && typeof this.value === 'string';
  }
  get isObject() {
    return typeof this.value === 'object';
  }
  get normalizedValue() {
    if (this.isObject) {
      return '';
    }
    return this.value;
  }
  get formattedParts() {
    if (!this.isString) {
      return [];
    }
    return parseToFormattedLinkifiedParts(this.value, true);
  }
  get ignoreRTL() {
    return isTextIgnoreRTL(this.value);
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(BaseFormattedText, {
  publicProps: {
    value: {
      config: 0
    },
    linkify: {
      config: 3
    }
  },
  track: {
    _linkify: 1
  }
});
const __lwc_component_class_internal = _registerComponent(BaseFormattedText, {
  tmpl: _tmpl,
  sel: "lightning-base-formatted-text",
  apiVersion: 66
});
export default __lwc_component_class_internal;