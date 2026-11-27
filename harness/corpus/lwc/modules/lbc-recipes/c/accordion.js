import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./accordion.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { createAccordionManager } from 'c/accordionUtilsPrivate';
class cAccordion extends LightningElement {
  constructor() {
    super();
    this.privateIsSectionLessInLastRender = true;
    this._allowMultipleSectionsOpen = false;
    this.connected = false;
    this.privateAccordionManager = createAccordionManager();
    this.privateAccordionManager.attachOpenSectionObserver(() => {
      const openSections = this.activeSectionName;
      if (this.connected) {
        this.dispatchEvent(new CustomEvent('sectiontoggle', {
          detail: {
            openSections
          }
        }));
      }
    });
  }
  connectedCallback() {
    this.connected = true;
    this.setAttribute('role', 'list');
    this.classList.add('slds-accordion');
    this.addEventListener('privateaccordionsectionregister', this.handleSectionRegister.bind(this));
  }
  disconnectedCallback() {
    this.connected = false;
  }
  get title() {
    return this.getAttribute('title');
  }
  set title(value) {
    this.setAttribute('title', value);
  }
  get activeSectionName() {
    const openSections = this.privateAccordionManager.openSectionsNames;
    if (!this.allowMultipleSectionsOpen) {
      return openSections.length ? openSections[0] : undefined;
    }
    return openSections;
  }
  set activeSectionName(value) {
    this._activeSectionName = value;
    if (!this.privateIsSectionLessInLastRender) {
      this.privateAccordionManager.openSectionByName(value);
    }
  }
  get allowMultipleSectionsOpen() {
    return this._allowMultipleSectionsOpen;
  }
  set allowMultipleSectionsOpen(value) {
    this._allowMultipleSectionsOpen = value;
    this.privateAccordionManager.collapsible = value;
  }
  renderedCallback() {
    if (this.privateIsSectionLessInLastRender) {
      let hasOpenSection = false;
      if (this._activeSectionName) {
        hasOpenSection = this.privateAccordionManager.openSectionByName(this._activeSectionName);
      }
      if (!(this._allowMultipleSectionsOpen || hasOpenSection)) {
        this.privateAccordionManager.openFirstSection();
      }
    }
    this.privateIsSectionLessInLastRender = this.privateAccordionManager.sections.length === 0;
  }
  get openedSection() {
    return this.privateAccordionManager.openedSection;
  }
  handleSectionRegister(event) {
    event.stopPropagation();
    event.preventDefault();
    const {
      detail
    } = event;
    const accordionSection = {
      id: detail.targetId,
      name: detail.targetName,
      ref: event.target,
      open: detail.openSection,
      isOpen: detail.isOpen,
      close: detail.closeSection,
      focus: detail.focusSection,
      ackParentAccordion: detail.ackParentAccordion
    };
    this.privateAccordionManager.registerSection(accordionSection);
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cAccordion, {
  publicProps: {
    title: {
      config: 3
    },
    activeSectionName: {
      config: 3
    },
    allowMultipleSectionsOpen: {
      config: 3
    }
  },
  fields: ["privateIsSectionLessInLastRender", "_allowMultipleSectionsOpen", "connected"]
});
const __lwc_component_class_internal = _registerComponent(cAccordion, {
  tmpl: _tmpl,
  sel: "c-accordion",
  apiVersion: 66
});
export default __lwc_component_class_internal;