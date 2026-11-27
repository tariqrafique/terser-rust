import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./menuDivider.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet } from 'lightning/utils';
import { normalizeString as normalize } from 'lightning/utilsPrivate';
class LightningMenuDivider extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this._variant = 'standard';
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'separator');
  }
  get variant() {
    return this._variant;
  }
  set variant(value) {
    this._variant = normalize(value, {
      fallbackValue: 'standard',
      validValues: ['standard', 'compact']
    });
  }
  get computedClass() {
    return classSet({
      'slds-has-divider_top-space': this.variant === 'standard',
      'slds-has-divider_top': this.variant === 'compact'
    }).toString();
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningMenuDivider, {
  publicProps: {
    variant: {
      config: 3
    }
  },
  track: {
    _variant: 1
  }
});
const __lwc_component_class_internal = _registerComponent(LightningMenuDivider, {
  tmpl: _tmpl,
  sel: "lightning-menu-divider",
  apiVersion: 66
});
export default __lwc_component_class_internal;