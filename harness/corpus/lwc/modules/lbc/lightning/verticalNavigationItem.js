import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./verticalNavigationItem.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { sanitizeURL } from 'lightning/utilsPrivate';
import { privateContext } from 'lightning/utilsInternal';
const DEFAULT_HREF = 'javascript:void(0)';
const {
  setContext,
  assertContext
} = privateContext;
class LightningVerticalNavigationItem extends LightningShadowBaseClass {
  get href() {
    return this._href || DEFAULT_HREF;
  }
  set href(value) {
    this._href = sanitizeURL(value);
  }
  constructor() {
    super();
    this._rendered = false;
    this.label = void 0;
    this.name = void 0;
    this._href = void 0;
    this._selected = false;
    setContext(this);
  }
  connectedCallback() {
    super.connectedCallback();
    assertContext(this);
    this.setAttribute('role', 'listitem');
    this.classList.add('slds-nav-vertical__item');
    if (!import.meta.env.SSR) {
      this.dispatchEvent(new CustomEvent('privateitemregister', {
        bubbles: true,
        cancelable: true,
        detail: {
          callbacks: {
            select: this.select.bind(this),
            deselect: this.deselect.bind(this)
          },
          name: this.name
        }
      }));
    }
  }
  renderedCallback() {
    if (!this._rendered) {
      this._rendered = true;
    }
  }
  select() {
    this._selected = true;
    this.classList.add('slds-is-active');
  }
  deselect() {
    this._selected = false;
    this.classList.remove('slds-is-active');
  }
  get ariaCurrent() {
    return this._selected && this._rendered ? 'page' : null;
  }
  handleClick(event) {
    this.dispatchEvent(new CustomEvent('privateitemselect', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        name: this.name
      }
    }));
    if (this.href === DEFAULT_HREF) {
      event.preventDefault();
    }
  }
  /*LWC compiler v9.5.3*/
}
LightningVerticalNavigationItem.validationOptOut = ['class'];
_registerDecorators(LightningVerticalNavigationItem, {
  publicProps: {
    label: {
      config: 0
    },
    name: {
      config: 0
    },
    href: {
      config: 3
    }
  },
  track: {
    _href: 1,
    _selected: 1
  },
  fields: ["_rendered"]
});
const __lwc_component_class_internal = _registerComponent(LightningVerticalNavigationItem, {
  tmpl: _tmpl,
  sel: "lightning-vertical-navigation-item",
  apiVersion: 66
});
export default __lwc_component_class_internal;