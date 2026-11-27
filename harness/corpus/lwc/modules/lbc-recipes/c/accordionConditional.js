import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./accordionConditional.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class LightningExampleAccordionConditional extends LightningElement {
  constructor(...args) {
    super(...args);
    this.activeSectionMessage = '';
    this.isDVisible = false;
  }
  handleToggleSection(event) {
    this.activeSectionMessage = 'Open section name:  ' + event.detail.openSections;
  }
  handleToggleSectionD() {
    this.isDVisible = !this.isDVisible;
  }
  get isMessageVisible() {
    return this.activeSectionMessage.length > 0;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningExampleAccordionConditional, {
  track: {
    activeSectionMessage: 1,
    isDVisible: 1
  }
});
const __lwc_component_class_internal = _registerComponent(LightningExampleAccordionConditional, {
  tmpl: _tmpl,
  sel: "c-accordion-conditional",
  apiVersion: 66
});
export default __lwc_component_class_internal;