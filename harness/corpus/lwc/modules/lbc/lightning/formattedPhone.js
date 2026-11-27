import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./formattedPhone.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { toNorthAmericanPhoneNumber } from 'lightning/utilsPrivate';
class LightningFormattedPhone extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.value = void 0;
    this.disabled = false;
    this.tabIndex = void 0;
    this._connected = false;
  }
  connectedCallback() {
    super.connectedCallback();
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
    if (this._connected && this.showLink && !this.disabled) {
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
_registerDecorators(LightningFormattedPhone, {
  publicProps: {
    value: {
      config: 0
    },
    disabled: {
      config: 0
    },
    tabIndex: {
      config: 0
    }
  },
  publicMethods: ["focus", "blur", "click"],
  fields: ["_connected"]
});
const __lwc_component_class_internal = _registerComponent(LightningFormattedPhone, {
  tmpl: _tmpl,
  sel: "lightning-formatted-phone",
  apiVersion: 66
});
export default __lwc_component_class_internal;