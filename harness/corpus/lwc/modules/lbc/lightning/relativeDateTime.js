import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./relativeDateTime.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { assert } from 'lightning/utilsPrivate';
import { privateContext } from 'lightning/utilsInternal';
import { getFormattedRelativeDate, getTimeoutUnitsTillInvalid } from './utils';
const {
  setContext,
  assertContext
} = privateContext;
class LightningRelativeDateTime extends LightningShadowBaseClass {
  set value(next) {
    this.privateValue = next;
    this.updateFormattedValue();
  }
  get value() {
    return this.privateValue;
  }
  constructor() {
    super();
    this.formattedValue = '';
    this.privateValue = void 0;
    setContext(this);
  }
  disconnectedCallback() {
    this.cancelScheduledFormattedValueUpdate();
  }
  renderedCallback() {
    this.scheduleFormattedValueUpdate();
  }
  updateFormattedValue() {
    const oldFormattedValue = this.formattedValue;
    try {
      this.formattedValue = getFormattedRelativeDate(this.value);
    } catch (e) {
      const errorMessage = `<lightning-relative-date-time>: Error while formatting ` + `"${this.value}": ${e.message}`;
      assert(false, errorMessage);
      this.formattedValue = '';
    }
    return oldFormattedValue !== this.formattedValue;
  }
  scheduleFormattedValueUpdate() {
    assertContext(this);
    this.cancelScheduledFormattedValueUpdate();
    if (this.formattedValue !== '') {
      const units = getTimeoutUnitsTillInvalid(this.value);
      this.formattedValueUpdateTask = setTimeout(this.updateFormattedValue.bind(this), units);
    }
  }
  cancelScheduledFormattedValueUpdate() {
    clearTimeout(this.formattedValueUpdateTask);
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningRelativeDateTime, {
  publicProps: {
    value: {
      config: 3
    }
  },
  track: {
    formattedValue: 1
  },
  fields: ["privateValue"]
});
const __lwc_component_class_internal = _registerComponent(LightningRelativeDateTime, {
  tmpl: _tmpl,
  sel: "lightning-relative-date-time",
  apiVersion: 66
});
export default __lwc_component_class_internal;