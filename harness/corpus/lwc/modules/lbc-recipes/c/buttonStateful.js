import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./buttonStateful.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { classSet } from 'c/utils';
import { normalizeBoolean, normalizeString as normalize } from 'c/utilsPrivate';
const DEFAULT_VARIANT = 'neutral';
class cButtonStateful extends LightningElement {
  constructor(...args) {
    super(...args);
    this.iconNameWhenOn = void 0;
    this.iconNameWhenOff = void 0;
    this.iconNameWhenHover = void 0;
    this.labelWhenOff = void 0;
    this.labelWhenOn = void 0;
    this.labelWhenHover = void 0;
    this.variant = DEFAULT_VARIANT;
    this.state = {
      isClicked: false
    };
    this._order = null;
  }
  get selected() {
    return this.state.selected || false;
  }
  set selected(value) {
    this.state.selected = normalizeBoolean(value);
  }
  focus() {
    this.template.querySelector('button').focus();
  }
  get computedButtonClass() {
    const classes = classSet('slds-button slds-button_stateful').add({
      'slds-button_neutral': this.normalizedVariant === 'neutral',
      'slds-button_brand': this.normalizedVariant === 'brand',
      'slds-button_inverse': this.normalizedVariant === 'inverse',
      'slds-button_destructive': this.normalizedVariant === 'destructive',
      'slds-button_success': this.normalizedVariant === 'success'
    }).add({
      'slds-not-selected': !this.selected,
      'slds-is-selected': this.selected && !this.state.isClicked,
      'slds-is-selected-clicked': this.selected && this.state.isClicked,
      'slds-button_first': this._order === 'first',
      'slds-button_middle': this._order === 'middle',
      'slds-button_last': this._order === 'last'
    });
    return classes.toString();
  }
  get normalizedVariant() {
    return normalize(this.variant, {
      fallbackValue: DEFAULT_VARIANT,
      validValues: ['neutral', 'brand', 'inverse', 'destructive', 'success', 'text']
    });
  }
  get privateLabelWhenOn() {
    let outputVal = this.labelWhenOn;
    if (this.isValidLabel(outputVal)) {
      return outputVal;
    }
    outputVal = '';
    // eslint-disable-next-line no-console
    console.warn(`<c-button-stateful> The "labelWhenOn" attribute value is required to show the label when selected has a value of true`);
    return outputVal;
  }
  get privateLabelWhenOff() {
    let outputVal = this.labelWhenOff;
    if (this.isValidLabel(outputVal)) {
      return outputVal;
    }
    outputVal = '';
    // eslint-disable-next-line no-console
    console.warn(`<c-button-stateful> The "labelWhenOff" attribute value is required to show the label when selected has a value of false`);
    return outputVal;
  }
  get privateLabelWhenHover() {
    const outputVal = this.labelWhenHover;
    if (this.isValidLabel(outputVal)) {
      return outputVal;
    }
    return this.privateLabelWhenOn;
  }
  get privateIconNameWhenHover() {
    if (this.iconNameWhenHover) {
      return this.iconNameWhenHover;
    }
    return this.iconNameWhenOn;
  }
  handleButtonClick() {
    this.state.isClicked = true;
  }
  handleButtonBlur() {
    this.state.isClicked = false;
    this.dispatchEvent(new CustomEvent('blur'));
  }
  handleButtonFocus() {
    this.dispatchEvent(new CustomEvent('focus'));
  }
  isValidLabel(labelVal) {
    if (typeof labelVal !== 'string' || labelVal.length === 0) {
      return false;
    }
    return true;
  }
  setOrder(order) {
    this._order = order;
  }
  connectedCallback() {
    const privatebuttonregister = new CustomEvent('privatebuttonregister', {
      bubbles: true,
      detail: {
        callbacks: {
          setOrder: this.setOrder.bind(this),
          setDeRegistrationCallback: deRegistrationCallback => {
            this._deRegistrationCallback = deRegistrationCallback;
          }
        }
      }
    });
    this.dispatchEvent(privatebuttonregister);
  }
  disconnectedCallback() {
    if (this._deRegistrationCallback) {
      this._deRegistrationCallback();
    }
  }
  /*LWC compiler v9.5.3*/
}
cButtonStateful.delegatesFocus = true;
_registerDecorators(cButtonStateful, {
  publicProps: {
    iconNameWhenOn: {
      config: 0
    },
    iconNameWhenOff: {
      config: 0
    },
    iconNameWhenHover: {
      config: 0
    },
    labelWhenOff: {
      config: 0
    },
    labelWhenOn: {
      config: 0
    },
    labelWhenHover: {
      config: 0
    },
    variant: {
      config: 0
    },
    selected: {
      config: 3
    }
  },
  publicMethods: ["focus"],
  track: {
    state: 1,
    _order: 1
  }
});
const __lwc_component_class_internal = _registerComponent(cButtonStateful, {
  tmpl: _tmpl,
  sel: "c-button-stateful",
  apiVersion: 66
});
export default __lwc_component_class_internal;
cButtonStateful.interopMap = {
  props: {
    selected: 'state'
  }
};