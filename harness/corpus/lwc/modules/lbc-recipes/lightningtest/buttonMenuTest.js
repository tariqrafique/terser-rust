import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./buttonMenuTest.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class ButtonMenuTest extends LightningElement {
  constructor(...args) {
    super(...args);
    this.selectAction = void 0;
    this.focusAction = void 0;
  }
  handleSelect(event) {
    this.selectAction({
      selectEvent: event
    });
  }
  handleFocus(event) {
    this.focusAction({
      focusEvent: event
    });
  }
  get notChecked() {
    return undefined;
  }
  get unChecked() {
    return false;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(ButtonMenuTest, {
  publicProps: {
    selectAction: {
      config: 0
    },
    focusAction: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(ButtonMenuTest, {
  tmpl: _tmpl,
  sel: "lightningtest-button-menu-test",
  apiVersion: 66
});
export default __lwc_component_class_internal;