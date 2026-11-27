import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./input.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class Input extends LightningElement {
  constructor(...args) {
    super(...args);
    this.accept = void 0;
    this.autocomplete = void 0;
    this.checked = void 0;
    this.dateAriaControls = void 0;
    this.dateAriaDescribedBy = void 0;
    this.dateAriaLabel = void 0;
    this.dateAriaLabelledBy = void 0;
    this.dateStyle = void 0;
    this.fieldLevelHelp = void 0;
    this.files = void 0;
    this.formatFractionDigits = void 0;
    this.formatter = void 0;
    this.isLoading = void 0;
    this.label = void 0;
    this.max = void 0;
    this.maxLength = void 0;
    this.messageToggleActive = void 0;
    this.messageToggleInactive = void 0;
    this.messageWhenBadInput = void 0;
    this.messageWhenPatternMismatch = void 0;
    this.messageWhenRangeOverflow = void 0;
    this.messageWhenRangeUnderflow = void 0;
    this.messageWhenStepMismatch = void 0;
    this.messageWhenTooLong = void 0;
    this.messageWhenTooShort = void 0;
    this.messageWhenTypeMismatch = void 0;
    this.messageWhenValueMissing = void 0;
    this.min = void 0;
    this.minLength = void 0;
    this.multiple = void 0;
    this.name = void 0;
    this.pattern = void 0;
    this.placeholder = void 0;
    this.step = void 0;
    this.timeAriaControls = void 0;
    this.timeAriaDescribedBy = void 0;
    this.timeAriaLabelledBy = void 0;
    this.timeStyle = void 0;
    this.timezone = void 0;
    this.type = void 0;
    this.validity = void 0;
    this.variant = void 0;
    this._disabled = false;
    this._readOnly = false;
    this._required = false;
    this._value = '';
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
  }
  get readOnly() {
    return this._readOnly;
  }
  set readOnly(value) {
    this._readOnly = value;
  }
  get required() {
    return this._required;
  }
  set required(value) {
    this._required = value;
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
  }
  focus() {
    this.template.querySelector('input').focus();
  }
  blur() {
    this.template.querySelector('input').blur();
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(Input, {
  publicProps: {
    accept: {
      config: 0
    },
    autocomplete: {
      config: 0
    },
    checked: {
      config: 0
    },
    dateAriaControls: {
      config: 0
    },
    dateAriaDescribedBy: {
      config: 0
    },
    dateAriaLabel: {
      config: 0
    },
    dateAriaLabelledBy: {
      config: 0
    },
    dateStyle: {
      config: 0
    },
    disabled: {
      config: 3
    },
    fieldLevelHelp: {
      config: 0
    },
    files: {
      config: 0
    },
    formatFractionDigits: {
      config: 0
    },
    formatter: {
      config: 0
    },
    isLoading: {
      config: 0
    },
    label: {
      config: 0
    },
    max: {
      config: 0
    },
    maxLength: {
      config: 0
    },
    messageToggleActive: {
      config: 0
    },
    messageToggleInactive: {
      config: 0
    },
    messageWhenBadInput: {
      config: 0
    },
    messageWhenPatternMismatch: {
      config: 0
    },
    messageWhenRangeOverflow: {
      config: 0
    },
    messageWhenRangeUnderflow: {
      config: 0
    },
    messageWhenStepMismatch: {
      config: 0
    },
    messageWhenTooLong: {
      config: 0
    },
    messageWhenTooShort: {
      config: 0
    },
    messageWhenTypeMismatch: {
      config: 0
    },
    messageWhenValueMissing: {
      config: 0
    },
    min: {
      config: 0
    },
    minLength: {
      config: 0
    },
    multiple: {
      config: 0
    },
    name: {
      config: 0
    },
    pattern: {
      config: 0
    },
    placeholder: {
      config: 0
    },
    readOnly: {
      config: 3
    },
    required: {
      config: 3
    },
    step: {
      config: 0
    },
    timeAriaControls: {
      config: 0
    },
    timeAriaDescribedBy: {
      config: 0
    },
    timeAriaLabelledBy: {
      config: 0
    },
    timeStyle: {
      config: 0
    },
    timezone: {
      config: 0
    },
    type: {
      config: 0
    },
    validity: {
      config: 0
    },
    value: {
      config: 3
    },
    variant: {
      config: 0
    }
  },
  publicMethods: ["focus", "blur"],
  track: {
    _disabled: 1,
    _readOnly: 1,
    _required: 1,
    _value: 1
  }
});
const __lwc_component_class_internal = _registerComponent(Input, {
  tmpl: _tmpl,
  sel: "lightning-input",
  apiVersion: 66
});
export default __lwc_component_class_internal;