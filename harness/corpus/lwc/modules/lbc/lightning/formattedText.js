import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./formattedText.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { normalizeBoolean, parseToFormattedLinkifiedParts, parseToFormattedParts } from 'lightning/utilsPrivate';
class FormattedText extends LightningShadowBaseClass {
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
  get formattedParts() {
    if (!this.value || typeof this.value !== 'string') {
      return [];
    }
    return this.linkify ? parseToFormattedLinkifiedParts(this.value) : parseToFormattedParts(this.value);
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(FormattedText, {
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
const __lwc_component_class_internal = _registerComponent(FormattedText, {
  tmpl: _tmpl,
  sel: "lightning-formatted-text",
  apiVersion: 66
});
export default __lwc_component_class_internal;