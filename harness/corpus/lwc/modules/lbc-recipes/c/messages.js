import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./messages.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { parseError } from 'c/recordEditUtils';
class cMessages extends LightningElement {
  constructor(...args) {
    super(...args);
    this.err = {};
    this.hasError = false;
  }
  setError(err) {
    const parsedError = parseError(err);
    this.hasError = !!err;
    this.err = parsedError;
  }
  get error() {
    return this.err;
  }
  set error(val) {
    this.setError(val);
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cMessages, {
  publicProps: {
    error: {
      config: 3
    }
  },
  publicMethods: ["setError"],
  track: {
    err: 1,
    hasError: 1
  }
});
const __lwc_component_class_internal = _registerComponent(cMessages, {
  tmpl: _tmpl,
  sel: "c-messages",
  apiVersion: 66
});
export default __lwc_component_class_internal;