import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./baseComboboxFormattedText.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
class LightningBaseComboboxFormattedText extends LightningShadowBaseClass {
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
_registerDecorators(LightningBaseComboboxFormattedText, {
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
const __lwc_component_class_internal = _registerComponent(LightningBaseComboboxFormattedText, {
  tmpl: _tmpl,
  sel: "lightning-base-combobox-formatted-text",
  apiVersion: 66
});
export default __lwc_component_class_internal;