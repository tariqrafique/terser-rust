import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./accordionMultiple.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class LightningExampleAccordionMultiple extends LightningElement {
  constructor(...args) {
    super(...args);
    this.activeSections = ['A', 'C'];
    this.activeSectionsMessage = '';
  }
  handleSectionToggle(event) {
    const openSections = event.detail.openSections;
    if (openSections.length === 0) {
      this.activeSectionsMessage = 'All sections are closed';
    } else {
      this.activeSectionsMessage = 'Open sections: ' + openSections.join(', ');
    }
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningExampleAccordionMultiple, {
  track: {
    activeSections: 1,
    activeSectionsMessage: 1
  }
});
const __lwc_component_class_internal = _registerComponent(LightningExampleAccordionMultiple, {
  tmpl: _tmpl,
  sel: "c-accordion-multiple",
  apiVersion: 66
});
export default __lwc_component_class_internal;