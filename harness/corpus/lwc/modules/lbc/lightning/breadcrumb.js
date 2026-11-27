import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./breadcrumb.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { sanitizeURL } from 'lightning/utilsPrivate';
const DEFAULT_HREF = '#';
class LightningBreadcrumb extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.label = void 0;
    this.name = void 0;
    this._ariaCurrent = void 0;
    this.connected = void 0;
    this._href = void 0;
  }
  get ariaCurrent() {
    return this._ariaCurrent;
  }
  set ariaCurrent(value) {
    this._ariaCurrent = value;
  }
  get href() {
    return this._href || DEFAULT_HREF;
  }
  set href(value) {
    this._href = sanitizeURL(value);
  }
  focus() {
    if (this.connected) {
      this.linkElement.focus();
    }
  }
  blur() {
    if (this.connected) {
      this.linkElement.blur();
    }
  }
  get linkElement() {
    return !import.meta.env.SSR ? this.template.querySelector('a') : null;
  }
  handleClick(e) {
    if (!this._href) {
      e.preventDefault();
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.connected = true;
    this.classList.add('slds-breadcrumb__item');
    this.setAttribute('role', 'listitem');
  }
  disconnectedCallback() {
    this.connected = false;
  }
  /*LWC compiler v9.5.3*/
}
LightningBreadcrumb.validationOptOut = ['class'];
_registerDecorators(LightningBreadcrumb, {
  publicProps: {
    label: {
      config: 0
    },
    name: {
      config: 0
    },
    ariaCurrent: {
      config: 3
    },
    href: {
      config: 3
    }
  },
  publicMethods: ["focus", "blur"],
  track: {
    _ariaCurrent: 1,
    _href: 1
  },
  fields: ["connected"]
});
const __lwc_component_class_internal = _registerComponent(LightningBreadcrumb, {
  tmpl: _tmpl,
  sel: "lightning-breadcrumb",
  apiVersion: 66
});
export default __lwc_component_class_internal;