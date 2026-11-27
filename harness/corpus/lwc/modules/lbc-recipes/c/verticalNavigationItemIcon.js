import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./verticalNavigationItemIcon.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
const DEFAULT_HREF = 'javascript:void(0);'; // eslint-disable-line no-script-url

class cVerticalNavigationItemIcon extends LightningElement {
  constructor(...args) {
    super(...args);
    this.label = void 0;
    this.name = void 0;
    this.iconName = void 0;
    this.href = DEFAULT_HREF;
    this._selected = false;
  }
  connectedCallback() {
    this.setAttribute('role', 'listitem');
    this.classList.add('slds-nav-vertical__item');
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
  select() {
    this._selected = true;
    this.classList.add('slds-is-active');
  }
  deselect() {
    this._selected = false;
    this.classList.remove('slds-is-active');
  }
  get ariaCurrent() {
    return this._selected ? 'page' : null;
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
_registerDecorators(cVerticalNavigationItemIcon, {
  publicProps: {
    label: {
      config: 0
    },
    name: {
      config: 0
    },
    iconName: {
      config: 0
    },
    href: {
      config: 0
    }
  },
  fields: ["_selected"]
});
const __lwc_component_class_internal = _registerComponent(cVerticalNavigationItemIcon, {
  tmpl: _tmpl,
  sel: "c-vertical-navigation-item-icon",
  apiVersion: 66
});
export default __lwc_component_class_internal;