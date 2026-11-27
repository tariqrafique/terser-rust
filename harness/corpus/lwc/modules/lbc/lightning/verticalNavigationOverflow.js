import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./verticalNavigationOverflow.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import showMoreLabel from '@salesforce/label/LightningVerticalNavigation.showMore';
import showLessLabel from '@salesforce/label/LightningVerticalNavigation.showLess';
import { privateContext } from 'lightning/utilsInternal';
const {
  setContext,
  assertContext
} = privateContext;
const SLDS_SHOW = 'slds-show';
const SLDS_HIDE = 'slds-hide';
const COLLAPSED_ICON = 'utility:chevronright';
const EXPANDED_ICON = 'utility:chevrondown';
class LightningVerticalNavigationSection extends LightningShadowBaseClass {
  get computedActionText() {
    return this._isExpanded ? showLessLabel : showMoreLabel;
  }
  get computedItemListClass() {
    return this._isExpanded ? SLDS_SHOW : SLDS_HIDE;
  }
  get computedIconName() {
    return this._isExpanded ? EXPANDED_ICON : COLLAPSED_ICON;
  }
  get computedAssistiveText() {
    return this._assistiveText || '';
  }
  toggleOverflow() {
    this._isExpanded = !this._isExpanded;
  }
  updateAssistiveText(assistiveText) {
    this._assistiveText = assistiveText;
  }
  constructor() {
    super();
    this._isExpanded = false;
    setContext(this);
  }
  connectedCallback() {
    assertContext(this);
    super.connectedCallback();
    if (!import.meta.env.SSR) {
      this.dispatchEvent(new CustomEvent('privateoverflowregister', {
        bubbles: true,
        composed: true,
        detail: {
          callbacks: {
            updateAssistiveText: this.updateAssistiveText.bind(this)
          }
        }
      }));
    }
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningVerticalNavigationSection, {
  track: {
    _isExpanded: 1
  }
});
const __lwc_component_class_internal = _registerComponent(LightningVerticalNavigationSection, {
  tmpl: _tmpl,
  sel: "lightning-vertical-navigation-overflow",
  apiVersion: 66
});
export default __lwc_component_class_internal;