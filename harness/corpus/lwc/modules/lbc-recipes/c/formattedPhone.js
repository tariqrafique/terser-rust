import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./formattedPhone.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { toNorthAmericanPhoneNumber } from 'c/utilsPrivate';
class cFormattedPhone extends LightningElement {
  constructor(...args) {
    super(...args);
    this.value = void 0;
    this.tabIndex = void 0;
    this._connected = false;
  }
  connectedCallback() {
    this._connected = true;
  }
  disconnectedCallback() {
    this._connected = false;
  }
  focus() {
    if (this.phoneAnchor) {
      this.phoneAnchor.focus();
    }
  }
  blur() {
    if (this.phoneAnchor) {
      this.phoneAnchor.blur();
    }
  }
  click() {
    const anchor = this.phoneAnchor;
    if (anchor && anchor.click) {
      anchor.click();
    }
  }
  get phoneAnchor() {
    if (this._connected && this.showLink) {
      return this.template.querySelector('a');
    }
    return undefined;
  }
  get showLink() {
    return this.value != null && this.value !== '';
  }
  get formattedPhoneNumber() {
    return toNorthAmericanPhoneNumber(this.value);
  }
  get link() {
    return `tel:${this.value}`;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cFormattedPhone, {
  publicProps: {
    value: {
      config: 0
    },
    tabIndex: {
      config: 0
    }
  },
  publicMethods: ["focus", "blur", "click"],
  fields: ["_connected"]
});
const __lwc_component_class_internal = _registerComponent(cFormattedPhone, {
  tmpl: _tmpl,
  sel: "c-formatted-phone",
  apiVersion: 66
});
export default __lwc_component_class_internal;