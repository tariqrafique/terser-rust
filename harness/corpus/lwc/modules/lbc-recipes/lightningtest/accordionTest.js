import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./accordionTest.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class AccordionTest extends LightningElement {
  constructor(...args) {
    super(...args);
    this.isBVisible = false;
    this.activeSection = void 0;
    this.sectiontoggleHandler = void 0;
    this.allowMultipleSectionsOpen = false;
    this.isAccordionHidden = false;
  }
  getAccordionActiveSectionName() {
    return this.template.querySelector('c-accordion').activeSectionName;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(AccordionTest, {
  publicProps: {
    isBVisible: {
      config: 0
    },
    activeSection: {
      config: 0
    },
    sectiontoggleHandler: {
      config: 0
    },
    allowMultipleSectionsOpen: {
      config: 0
    },
    isAccordionHidden: {
      config: 0
    }
  },
  publicMethods: ["getAccordionActiveSectionName"]
});
const __lwc_component_class_internal = _registerComponent(AccordionTest, {
  tmpl: _tmpl,
  sel: "lightningtest-accordion-test",
  apiVersion: 66
});
export default __lwc_component_class_internal;