import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./formattedEmail.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import labelEmailLabel from '@salesforce/label/LightningFormattedEmail.emailIconLabel';
const i18n = {
  emailLabel: labelEmailLabel
};
class LightningFormattedEmail extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.value = void 0;
    this.label = void 0;
    this.tabIndex = void 0;
    this.hideIcon = false;
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
    if (this.emailAnchor) {
      this.emailAnchor.focus();
    }
  }
  blur() {
    if (this.emailAnchor) {
      this.emailAnchor.blur();
    }
  }
  click() {
    const anchor = this.emailAnchor;
    if (anchor && anchor.click) {
      anchor.click();
    }
  }
  get emailAnchor() {
    if (this._connected && this.hasValue) {
      return this.template.querySelector('a');
    }
    return undefined;
  }
  get trimmedValue() {
    return (this.value || '').trim();
  }
  get trimmedLabel() {
    return (this.label || '').trim();
  }
  get hasValue() {
    return !!this.trimmedValue;
  }
  get href() {
    return 'mailto:' + this.trimmedValue;
  }
  get computedLabel() {
    return this.trimmedLabel || this.trimmedValue;
  }
  get i18n() {
    return i18n;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningFormattedEmail, {
  publicProps: {
    value: {
      config: 0
    },
    label: {
      config: 0
    },
    tabIndex: {
      config: 0
    },
    hideIcon: {
      config: 0
    }
  },
  publicMethods: ["focus", "blur", "click"],
  fields: ["_connected"]
});
const __lwc_component_class_internal = _registerComponent(LightningFormattedEmail, {
  tmpl: _tmpl,
  sel: "lightning-formatted-email",
  apiVersion: 66
});
export default __lwc_component_class_internal;