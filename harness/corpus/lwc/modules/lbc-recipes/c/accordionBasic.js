import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./accordionBasic.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class AccordionBasic extends LightningElement {
  constructor(...args) {
    super(...args);
    this.activeSectionMessage = '';
  }
  handleToggleSection(event) {
    this.activeSectionMessage = 'Open section name:  ' + event.detail.openSections;
  }
  handleSetActiveSectionC() {
    const accordion = this.template.querySelector('.example-accordion');
    accordion.activeSectionName = 'C';
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(AccordionBasic, {
  track: {
    activeSectionMessage: 1
  }
});
const __lwc_component_class_internal = _registerComponent(AccordionBasic, {
  tmpl: _tmpl,
  sel: "c-accordion-basic",
  apiVersion: 66
});
export default __lwc_component_class_internal;