import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./checkboxGroup.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import labelRequired from '@salesforce/label/c.lightning_LightningControl_required';
import { LightningElement } from 'lwc';
import { normalizeBoolean, synchronizeAttrs, getRealDOMId, classListMutation } from 'c/utilsPrivate';
import { FieldConstraintApi, debounce, normalizeVariant, VARIANT } from 'c/inputUtils';
import { classSet } from 'c/utils';
const i18n = {
  required: labelRequired
};
const DEBOUNCE_PERIOD = 200;
class cCheckboxGroup extends LightningElement {
  constructor() {
    super();
    this.label = void 0;
    this.options = void 0;
    this.messageWhenValueMissing = void 0;
    this.name = void 0;
    this._helpMessage = void 0;
    this._disabled = void 0;
    this._required = void 0;
    this._value = void 0;
    this.itemIndex = 0;
    this.debouncedShowIfBlurred = debounce(() => {
      if (!this.containsFocus) {
        this.showHelpMessageIfInvalid();
      }
    }, DEBOUNCE_PERIOD);
  }
  synchronizeA11y() {
    const inputs = this.template.querySelectorAll('input');
    Array.prototype.slice.call(inputs).forEach(input => {
      synchronizeAttrs(input, {
        'aria-describedby': this.computedUniqueHelpElementId
      });
    });
  }
  connectedCallback() {
    this.classList.add('slds-form-element');
    this.updateClassList();
  }
  updateClassList() {
    classListMutation(this.classList, {
      'slds-form-element_stacked': this.variant === VARIANT.LABEL_STACKED,
      'slds-form-element_horizontal': this.variant === VARIANT.LABEL_INLINE
    });
  }
  renderedCallback() {
    this.synchronizeA11y();
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
  }
  get disabled() {
    return this._disabled || false;
  }
  set disabled(value) {
    this._disabled = normalizeBoolean(value);
  }
  get required() {
    return this._required || false;
  }
  set required(value) {
    this._required = normalizeBoolean(value);
  }
  get variant() {
    return this._variant || VARIANT.STANDARD;
  }
  set variant(value) {
    this._variant = normalizeVariant(value);
    this.updateClassList();
  }
  get i18n() {
    return i18n;
  }
  get transformedOptions() {
    const {
      options,
      value
    } = this;
    if (Array.isArray(options)) {
      return options.map(option => ({
        label: option.label,
        value: option.value,
        id: `checkbox-${this.itemIndex++}`,
        isChecked: value.indexOf(option.value) !== -1
      }));
    }
    return [];
  }
  get validity() {
    return this._constraint.validity;
  }
  checkValidity() {
    return this._constraint.checkValidity();
  }
  reportValidity() {
    return this._constraint.reportValidity(message => {
      this._helpMessage = message;
    });
  }
  setCustomValidity(message) {
    this._constraint.setCustomValidity(message);
  }
  showHelpMessageIfInvalid() {
    this.reportValidity();
  }
  get computedUniqueHelpElementId() {
    const helpElement = this.template.querySelector('[data-helptext]');
    return getRealDOMId(helpElement);
  }
  focus() {
    const firstCheckbox = this.template.querySelector('input');
    if (firstCheckbox) {
      firstCheckbox.focus();
    }
  }
  handleFocus() {
    this.containsFocus = true;
    this.dispatchEvent(new CustomEvent('focus'));
  }
  handleBlur() {
    this.containsFocus = false;
    this.debouncedShowIfBlurred();
    this.dispatchEvent(new CustomEvent('blur'));
  }
  handleClick(event) {
    if (this.template.activeElement !== event.target) {
      event.target.focus();
    }
  }
  handleChange(event) {
    event.stopPropagation();
    const checkboxes = this.template.querySelectorAll('input');
    const value = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
    this._value = value;
    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        value
      },
      composed: true,
      bubbles: true,
      cancelable: true
    }));
  }
  get _constraint() {
    if (!this._constraintApi) {
      this._constraintApi = new FieldConstraintApi(() => this, {
        valueMissing: () => !this.disabled && this.required && this.value.length === 0
      });
    }
    return this._constraintApi;
  }
  get computedLegendClass() {
    const classnames = classSet('slds-form-element__legend slds-form-element__label');
    return classnames.add({
      'slds-assistive-text': this.variant === VARIANT.LABEL_HIDDEN
    }).toString();
  }
  /*LWC compiler v9.5.3*/
}
cCheckboxGroup.delegatesFocus = true;
_registerDecorators(cCheckboxGroup, {
  publicProps: {
    label: {
      config: 0
    },
    options: {
      config: 0
    },
    messageWhenValueMissing: {
      config: 0
    },
    name: {
      config: 0
    },
    value: {
      config: 3
    },
    disabled: {
      config: 3
    },
    required: {
      config: 3
    },
    variant: {
      config: 3
    },
    validity: {
      config: 1
    }
  },
  publicMethods: ["checkValidity", "reportValidity", "setCustomValidity", "showHelpMessageIfInvalid", "focus"],
  track: {
    _helpMessage: 1,
    _disabled: 1,
    _required: 1,
    _value: 1
  }
});
const __lwc_component_class_internal = _registerComponent(cCheckboxGroup, {
  tmpl: _tmpl,
  sel: "c-checkbox-group",
  apiVersion: 66
});
export default __lwc_component_class_internal;