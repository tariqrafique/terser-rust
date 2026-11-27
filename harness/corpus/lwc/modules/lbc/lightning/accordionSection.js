import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./accordionSection.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { generateUniqueId } from 'lightning/inputUtils';
import { keyCodes, isHeadingLevelValid, classSetToString } from 'lightning/utilsPrivate';
import { privateContext } from 'lightning/utilsInternal';
import { classSet } from 'lightning/utils';
import DIR from '@salesforce/i18n/dir';
const {
  setContext,
  assertContext
} = privateContext;
class LightningAccordionSection extends LightningShadowBaseClass {
  get headingLevel() {
    return this._privateHeadingAriaLevel;
  }
  set headingLevel(value) {
    if (isHeadingLevelValid(value)) {
      this._privateHeadingAriaLevel = value;
    }
  }
  constructor() {
    super();
    this.name = void 0;
    this.label = void 0;
    this.title = void 0;
    this.privateIsOpen = false;
    this._privateHeadingAriaLevel = void 0;
    this._slotAssignedElement = void 0;
    this.pendingFocus = false;
    this.privateUniqueId = generateUniqueId('lgt-accordion-section');
    setContext(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'listitem');
    this.classList.add('slds-accordion__list-item');
    this.registerSectionWithParent();
  }
  disconnectedCallback() {
    if (this.privateAccordionSectionObserver) {
      this.privateAccordionSectionObserver.notifySectionDeregister();
    }
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
  get computedHeaderClass() {
    return classSetToString({
      'slds-accordion__summary-heading': true,
      'slds-m-right_small': this.hostDirection === 'ltr' && this._slotAssignedElement && this._slotAssignedElement !== 'lightning-button-menu',
      'slds-m-left_small': this.hostDirection === 'rtl' && this._slotAssignedElement
    });
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
  handleSlotChange(event) {
    const slot = event.target;
    const children = slot.assignedElements() || [];
    if (children.length) {
      this._slotAssignedElement = children[0].tagName.toLowerCase();
    }
  }
  get hostDirection() {
    if (import.meta.env.SSR) {
      return DIR || 'ltr';
    }
    const host = this.template.host;
    if (host.parentElement) {
      return window.getComputedStyle(host.parentElement).direction.toLowerCase() || 'ltr';
    }
    return DIR || 'ltr';
  }
  get accordionTitleIcon() {
    if (this.privateIsOpen) {
      return 'utility:switch';
    }
    return this.hostDirection === 'ltr' ? 'utility:chevronright' : 'utility:chevronleft';
  }
  registerSectionWithParent() {
    assertContext(this);
    const detail = {
      targetId: this.privateUniqueId,
      targetName: this.name,
      openSection: this.openSection.bind(this),
      isOpen: this.isOpen.bind(this),
      closeSection: this.closeSection.bind(this),
      focusSection: this.focusSection.bind(this),
      ackParentAccordion: this.ackParentAccordion.bind(this)
    };
    if (!import.meta.env.SSR) {
      this.dispatchEvent(new CustomEvent('privateaccordionsectionregister', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail
      }));
    }
  }
  openSection() {
    this.privateIsOpen = true;
  }
  closeSection() {
    this.privateIsOpen = false;
  }
  focusSection() {
    const sectionButton = !import.meta.env.SSR ? this.template.querySelector('button.section-control') : null;
    if (sectionButton) {
      sectionButton.blur();
      sectionButton.focus();
    }
  }
  isOpen() {
    return this.privateIsOpen;
  }
  ackParentAccordion(accordionSectionObserver) {
    this.privateAccordionSectionObserver = accordionSectionObserver;
  }
  /*LWC compiler v9.5.3*/
}
LightningAccordionSection.validationOptOut = ['class'];
_registerDecorators(LightningAccordionSection, {
  publicProps: {
    name: {
      config: 0
    },
    label: {
      config: 0
    },
    title: {
      config: 0
    },
    headingLevel: {
      config: 3
    }
  },
  track: {
    privateIsOpen: 1
  },
  fields: ["_privateHeadingAriaLevel", "_slotAssignedElement", "pendingFocus", "privateUniqueId"]
});
const __lwc_component_class_internal = _registerComponent(LightningAccordionSection, {
  tmpl: _tmpl,
  sel: "lightning-accordion-section",
  apiVersion: 66
});
export default __lwc_component_class_internal;