import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./accordionChild.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class AccordionChild extends LightningElement {
  constructor(...args) {
    super(...args);
    this.value = void 0;
    this.divContent = '';
  }
  renderedCallback() {
    if (this.value > 0) {
      const myWidth = this.template.querySelector('div').clientWidth;
      if (myWidth > 0) {
        this.divContent = 'visible';
      }
    }
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(AccordionChild, {
  publicProps: {
    value: {
      config: 0
    }
  },
  track: {
    divContent: 1
  }
});
const __lwc_component_class_internal = _registerComponent(AccordionChild, {
  tmpl: _tmpl,
  sel: "lightningtest-accordion-child",
  apiVersion: 66
});
export default __lwc_component_class_internal;