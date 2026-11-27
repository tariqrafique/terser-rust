import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./verticalNavigationSection.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { guid } from 'c/utilsPrivate';
class cVerticalNavigationSection extends LightningElement {
  constructor(...args) {
    super(...args);
    this.headingId = guid();
    this._label = void 0;
  }
  set label(label) {
    this._label = label;
  }
  get label() {
    return this._label || '';
  }
  handleOverflowRegister(event) {
    event.stopPropagation();
    const item = event.detail;
    item.callbacks.updateAssistiveText(this.label);
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cVerticalNavigationSection, {
  publicProps: {
    label: {
      config: 3
    }
  },
  track: {
    _label: 1
  },
  fields: ["headingId"]
});
const __lwc_component_class_internal = _registerComponent(cVerticalNavigationSection, {
  tmpl: _tmpl,
  sel: "c-vertical-navigation-section",
  apiVersion: 66
});
export default __lwc_component_class_internal;