import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./menuSubheader.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class cMenuSubheader extends LightningElement {
  constructor(...args) {
    super(...args);
    this.label = void 0;
  }
  connectedCallback() {
    this.classList.add('slds-dropdown__header');
    this.classList.add('slds-truncate');
    this.setAttribute('role', 'separator');
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cMenuSubheader, {
  publicProps: {
    label: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(cMenuSubheader, {
  tmpl: _tmpl,
  sel: "c-menu-subheader",
  apiVersion: 66
});
export default __lwc_component_class_internal;