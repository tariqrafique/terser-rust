import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./tabsetA11yTest.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class tabsetA11yTest extends LightningElement {
  constructor(...args) {
    super(...args);
    this.tabs = [];
  }
  getTabs() {
    return this.template.querySelectorAll('c-tab');
  }
  getTabBar() {
    return this.template.querySelector('c-tabset').shadowRoot.querySelector('c-tab-bar');
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(tabsetA11yTest, {
  publicProps: {
    tabs: {
      config: 0
    }
  },
  publicMethods: ["getTabs", "getTabBar"]
});
const __lwc_component_class_internal = _registerComponent(tabsetA11yTest, {
  tmpl: _tmpl,
  sel: "lightningtest-tabset-a11y-test",
  apiVersion: 66
});
export default __lwc_component_class_internal;