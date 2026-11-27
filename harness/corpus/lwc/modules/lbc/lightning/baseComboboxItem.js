import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./baseComboboxItem.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import card from './card.html';
import inline from './inline.html';
class LightningBaseComboboxItem extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.item = {};
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.item.selectable) {
      this.setAttribute('aria-selected', 'false');
    }
    if (this.item.type === 'option-inline') {
      this.classList.add('slds-media_small', 'slds-listbox__option_plain');
    } else {
      this.classList.add('slds-listbox__option_entity');
    }
  }
  renderedCallback() {
    this.setAttribute('aria-selected', this.item.checked);
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
_registerDecorators(LightningBaseComboboxItem, {
  publicProps: {
    item: {
      config: 0
    }
  },
  publicMethods: ["highlight", "removeHighlight"]
});
const __lwc_component_class_internal = _registerComponent(LightningBaseComboboxItem, {
  tmpl: _tmpl,
  sel: "lightning-base-combobox-item",
  apiVersion: 66
});
export default __lwc_component_class_internal;