import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./menuDivider.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { classSet } from 'c/utils';
import { normalizeString as normalize } from 'c/utilsPrivate';
class cMenuDivider extends LightningElement {
  constructor(...args) {
    super(...args);
    this._variant = 'standard';
  }
  connectedCallback() {
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
_registerDecorators(cMenuDivider, {
  publicProps: {
    variant: {
      config: 3
    }
  },
  track: {
    _variant: 1
  }
});
const __lwc_component_class_internal = _registerComponent(cMenuDivider, {
  tmpl: _tmpl,
  sel: "c-menu-divider",
  apiVersion: 66
});
export default __lwc_component_class_internal;