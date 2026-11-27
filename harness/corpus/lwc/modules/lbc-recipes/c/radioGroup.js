import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./radioGroup.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import labelRequired from '@salesforce/label/c.lightning_LightningControl_required';
import { LightningElement } from 'lwc';
import { normalizeBoolean, synchronizeAttrs, getRealDOMId, normalizeString as normalize, classListMutation } from 'c/utilsPrivate';
import { isEmptyString, InteractingState, FieldConstraintApi, generateUniqueId, normalizeVariant, VARIANT } from 'c/inputUtils';
import { classSet } from 'c/utils';
const i18n = {
  required: labelRequired
};
class cRadioGroup extends LightningElement {
  constructor(...args) {
    super(...args);
    this.type = 'radio';
    this.label = void 0;
    this.options = void 0;
    this.messageWhenValueMissing = void 0;
    this.name = generateUniqueId();
    this._required = false;
    this._disabled = false;
    this._helpMessage = void 0;
    this._value = void 0;
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
    this.interactingState = new InteractingState();
    this.interactingState.onleave(this.showHelpMessageIfInvalid.bind(this));
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
  get radioButtonElements() {
    return this.template.querySelectorAll('input');
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = normalizeBoolean(value);
  }
  get required() {
    return this._required;
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
      return options.map((option, index) => ({
        label: option.label,
        value: option.value,
        isChecked: value === option.value,
        indexId: `radio-${index}`
      }));
    }
    return [];
  }
  get isRadio() {
    return this.normalizedType === 'radio';
  }
  get isButton() {
    return this.normalizedType === 'button';
  }
  get normalizedType() {
    return normalize(this.type, {
      fallbackValue: 'radio',
      validValues: ['radio', 'button']
    });
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
  focus() {
    const firstRadio = this.template.querySelector('input');
    if (firstRadio) {
      firstRadio.focus();
    }
  }
  handleFocus() {
    this.interactingState.enter();
    this.dispatchEvent(new CustomEvent('focus'));
  }
  handleBlur() {
    this.interactingState.leave();
    this.dispatchEvent(new CustomEvent('blur'));
  }
  handleChange(event) {
    event.stopPropagation();
    this.interactingState.interacting();
    const value = Array.from(this.radioButtonElements).filter(radioButton => radioButton.checked).map(radioButton => radioButton.value).toString();
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
  get computedUniqueHelpElementId() {
    return getRealDOMId(this.template.querySelector('[data-help-message]'));
  }
  get _constraint() {
    if (!this._constraintApi) {
      this._constraintApi = new FieldConstraintApi(() => this, {
        valueMissing: () => !this.disabled && this.required && isEmptyString(this.value)
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
cRadioGroup.delegatesFocus = true;
_registerDecorators(cRadioGroup, {
  publicProps: {
    type: {
      config: 0
    },
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
    _required: 1,
    _disabled: 1,
    _helpMessage: 1,
    _value: 1
  }
});
const __lwc_component_class_internal = _registerComponent(cRadioGroup, {
  tmpl: _tmpl,
  sel: "c-radio-group",
  apiVersion: 66
});
export default __lwc_component_class_internal;