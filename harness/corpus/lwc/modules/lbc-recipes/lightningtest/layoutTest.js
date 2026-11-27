import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./layoutTest.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class LayoutTest extends LightningElement {
  constructor(...args) {
    super(...args);
    this.horizontalAlign = 'space';
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LayoutTest, {
  publicProps: {
    horizontalAlign: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(LayoutTest, {
  tmpl: _tmpl,
  sel: "lightningtest-layout-test",
  apiVersion: 66
});
export default __lwc_component_class_internal;