import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./baseComboboxItem.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import card from './card.html';
import inline from './inline.html';
class cBaseComboboxItem extends LightningElement {
  constructor(...args) {
    super(...args);
    this.item = {};
  }
  connectedCallback() {
    if (this.item.selectable) {
      this.setAttribute('aria-selected', 'false');
    }
    if (this.item.type === 'option-inline') {
      this.classList.add('slds-media_small', 'slds-listbox__option_plain');
    } else {
      this.classList.add('slds-listbox__option_entity');
    }
  }
  get textHasParts() {
    const text = this.item.text;
    return text && Array.isArray(text) && text.length > 0;
  }
  get subTextHasParts() {
    const subText = this.item.subText;
    return subText && Array.isArray(subText) && subText.length > 0;
  }
  render() {
    if (this.item.type === 'option-card') {
      return card;
    }
    return inline;
  }
  highlight() {
    this.toggleHighlight(true);
  }
  removeHighlight() {
    this.toggleHighlight(false);
  }
  toggleHighlight(highlighted) {
    if (this.item.selectable) {
      this.setAttribute('aria-selected', highlighted ? 'true' : 'false');
      this.classList.toggle('slds-has-focus', highlighted);
    }
  }
  partsToText(parts) {
    if (parts && Array.isArray(parts) && parts.length > 0) {
      return parts.map(part => part.text).join('');
    }
    return parts;
  }
  get rightIconSize() {
    return this.item.rightIconSize || 'small';
  }
  get iconSize() {
    return this.item.iconSize || 'small';
  }
  get text() {
    return this.partsToText(this.item.text);
  }
  get subText() {
    return this.partsToText(this.item.subText);
  }
  get hasSubText() {
    const subText = this.item.subText;
    return subText && subText.length > 0;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cBaseComboboxItem, {
  publicProps: {
    item: {
      config: 0
    }
  },
  publicMethods: ["highlight", "removeHighlight"]
});
const __lwc_component_class_internal = _registerComponent(cBaseComboboxItem, {
  tmpl: _tmpl,
  sel: "c-base-combobox-item",
  apiVersion: 66
});
export default __lwc_component_class_internal;