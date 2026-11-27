import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./formattedTime.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { normalizeISOTime } from 'c/internationalizationLibrary';
class FormattedTime extends LightningElement {
  constructor(...args) {
    super(...args);
    this._formattedTimeValue = null;
    this._inputValue = null;
  }
  set value(newValue) {
    const normalizedValue = this.normalizeInputValue(newValue);
    if (normalizedValue !== this._inputValue) {
      const normalizedTime = normalizeISOTime(normalizedValue);
      this._inputValue = normalizedTime.isoValue;
      this._formattedTimeValue = normalizedTime.displayValue;
    }
  }
  get value() {
    return this._inputValue;
  }
  get formattedTime() {
    return this._formattedTimeValue;
  }
  normalizeInputValue(value) {
    if (!value || value === '') {
      return null;
    }
    return value;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(FormattedTime, {
  publicProps: {
    value: {
      config: 3
    }
  },
  track: {
    _formattedTimeValue: 1
  },
  fields: ["_inputValue"]
});
const __lwc_component_class_internal = _registerComponent(FormattedTime, {
  tmpl: _tmpl,
  sel: "c-formatted-time",
  apiVersion: 66
});
export default __lwc_component_class_internal;