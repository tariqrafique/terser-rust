import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./accordionSection.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { classSet } from 'c/utils';
import { generateUniqueId } from 'c/inputUtils';
import { keyCodes } from 'c/utilsPrivate';
class cAccordionSection extends LightningElement {
  constructor(...args) {
    super(...args);
    this.name = void 0;
    this.label = void 0;
    this.title = void 0;
    this.privateIsOpen = false;
    this.pendingFocus = false;
    this.privateUniqueId = generateUniqueId('lgt-accordion-section');
  }
  connectedCallback() {
    this.setAttribute('role', 'listitem');
    this.classList.add('slds-accordion__list-item');
    this.registerSectionWithParent();
  }
  disconnectedCallback() {
    this.privateAccordionSectionObserver.notifySectionDeregister();
  }
  renderedCallback() {
    if (this.privateIsOpen && this.pendingFocus) {
      this.pendingFocus = false;
      this.focusSection();
    }
  }
  get computedAriaExpanded() {
    return this.privateIsOpen.toString();
  }
  get computedAriaHidden() {
    return (!this.privateIsOpen).toString();
  }
  get computedSectionClasses() {
    return classSet('slds-accordion__section').add({
      'slds-is-open': this.privateIsOpen
    }).toString();
  }
  get computedHidden() {
    return this.privateIsOpen ? '' : (!this.privateIsOpen).toString();
  }
  handleKeyDown(event) {
    switch (event.keyCode) {
      case keyCodes.up:
      case keyCodes.right:
      case keyCodes.down:
      case keyCodes.left:
        event.preventDefault();
        event.stopPropagation();
        this.privateAccordionSectionObserver.notifySectionKeyNav(event.keyCode);
        break;
      default:
        break;
    }
  }
  handleSelectSection() {
    this.pendingFocus = true;
    this.privateAccordionSectionObserver.notifySectionSelect();
  }
  registerSectionWithParent() {
    const detail = {
      targetId: this.privateUniqueId,
      targetName: this.name,
      openSection: this.openSection.bind(this),
      isOpen: this.isOpen.bind(this),
      closeSection: this.closeSection.bind(this),
      focusSection: this.focusSection.bind(this),
      ackParentAccordion: this.ackParentAccordion.bind(this)
    };
    this.dispatchEvent(new CustomEvent('privateaccordionsectionregister', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail
    }));
  }
  openSection() {
    this.privateIsOpen = true;
  }
  closeSection() {
    this.privateIsOpen = false;
  }
  focusSection() {
    const sectionButton = this.template.querySelector('button.section-control');
    sectionButton.blur();
    sectionButton.focus();
  }
  isOpen() {
    return this.privateIsOpen;
  }
  ackParentAccordion(accordionSectionObserver) {
    this.privateAccordionSectionObserver = accordionSectionObserver;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cAccordionSection, {
  publicProps: {
    name: {
      config: 0
    },
    label: {
      config: 0
    },
    title: {
      config: 0
    }
  },
  track: {
    privateIsOpen: 1
  },
  fields: ["pendingFocus", "privateUniqueId"]
});
const __lwc_component_class_internal = _registerComponent(cAccordionSection, {
  tmpl: _tmpl,
  sel: "c-accordion-section",
  apiVersion: 66
});
export default __lwc_component_class_internal;