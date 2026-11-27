import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./baseComboboxFormattedText.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class cBaseComboboxFormattedText extends LightningElement {
  constructor(...args) {
    super(...args);
    this._text = '';
    this.hasParts = void 0;
  }
  get text() {
    return this._text;
  }
  set text(value) {
    this.hasParts = Array.isArray(value) && value.length > 0;
    if (this.hasParts) {
      this._text = value.map((part, i) => ({
        part,
        key: i
      }));
    } else {
      this._text = value;
    }
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cBaseComboboxFormattedText, {
  publicProps: {
    text: {
      config: 3
    }
  },
  track: {
    _text: 1,
    hasParts: 1
  }
});
const __lwc_component_class_internal = _registerComponent(cBaseComboboxFormattedText, {
  tmpl: _tmpl,
  sel: "c-base-combobox-formatted-text",
  apiVersion: 66
});
export default __lwc_component_class_internal;