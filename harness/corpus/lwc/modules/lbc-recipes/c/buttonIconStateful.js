import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./buttonIconStateful.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { registerComponent as _registerComponent } from 'lwc';
import { classSet } from 'c/utils';
import { normalizeString, normalizeBoolean } from 'c/utilsPrivate';
import cPrimitiveButton from 'c/primitiveButton';
import template from './buttonIconStateful.html';
const DEFAULT_SIZE = 'medium';
const DEFAULT_VARIANT = 'border';
class cButtonIconStateful extends cPrimitiveButton {
  constructor(...args) {
    super(...args);
    this.name = void 0;
    this.value = void 0;
    this.variant = DEFAULT_VARIANT;
    this.iconName = void 0;
    this.size = DEFAULT_SIZE;
    this.alternativeText = void 0;
    this._order = null;
  }
  render() {
    return template;
  }
  get computedTitle() {
    return this.state.title || this.alternativeText || null;
  }
  get normalizedVariant() {
    return normalizeString(this.variant, {
      fallbackValue: DEFAULT_VARIANT,
      validValues: ['border', 'border-filled', 'border-inverse']
    });
  }
  get normalizedSize() {
    return normalizeString(this.size, {
      fallbackValue: DEFAULT_SIZE,
      validValues: ['xx-small', 'x-small', 'small', 'medium']
    });
  }
  get selected() {
    return this.state.selected || false;
  }
  set selected(value) {
    this.state.selected = normalizeBoolean(value);
  }
  get computedAriaPressed() {
    return String(this.selected);
  }
  get computedButtonClass() {
    const {
      normalizedSize,
      normalizedVariant
    } = this;
    const classes = classSet('slds-button slds-button_icon');
    switch (normalizedSize) {
      case 'small':
        classes.add('slds-button_icon-small');
        break;
      case 'x-small':
        classes.add('slds-button_icon-x-small');
        break;
      case 'xx-small':
        classes.add('slds-button_icon-xx-small');
        break;
      case 'medium':
      default:
    }
    classes.add({
      'slds-button_icon-border': normalizedVariant === 'border',
      'slds-button_icon-border-filled': normalizedVariant === 'border-filled',
      'slds-button_icon-border slds-button_icon-inverse': normalizedVariant === 'border-inverse',
      'slds-is-selected': this.selected === true,
      'slds-button_first': this._order === 'first',
      'slds-button_middle': this._order === 'middle',
      'slds-button_last': this._order === 'last'
    });
    return classes.toString();
  }
  focus() {
    this.template.querySelector('button').focus();
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
cButtonIconStateful.delegatesFocus = true;
_registerDecorators(cButtonIconStateful, {
  publicProps: {
    name: {
      config: 0
    },
    value: {
      config: 0
    },
    variant: {
      config: 0
    },
    iconName: {
      config: 0
    },
    size: {
      config: 0
    },
    alternativeText: {
      config: 0
    },
    selected: {
      config: 3
    }
  },
  publicMethods: ["focus"],
  track: {
    _order: 1
  }
});
const __lwc_component_class_internal = _registerComponent(cButtonIconStateful, {
  tmpl: _tmpl,
  sel: "c-button-icon-stateful",
  apiVersion: 66
});
export default __lwc_component_class_internal;