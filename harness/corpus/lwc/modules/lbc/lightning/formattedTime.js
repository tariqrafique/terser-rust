import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./formattedTime.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { normalizeISOTime } from 'lightning/internationalizationLibrary';
import { features } from 'lightning/features';
import { privateContext } from 'lightning/utilsInternal';
const {
  setContext,
  assertContext
} = privateContext;
class FormattedTime extends LightningShadowBaseClass {
  constructor() {
    super();
    this._formattedTimeValue = null;
    this._inputValue = null;
    setContext(this);
  }
  set value(newValue) {
    if (features.enableAssertContext260Round2) {
      assertContext(this);
    }
    const normalizedValue = this.normalizeInputValue(newValue);
    if (normalizedValue !== this._inputValue) {
      const normalizedTime = normalizeISOTime(normalizedValue, 'medium');
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
  sel: "lightning-formatted-time",
  apiVersion: 66
});
export default __lwc_component_class_internal;