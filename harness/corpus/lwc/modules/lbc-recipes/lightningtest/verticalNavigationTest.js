import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./verticalNavigationTest.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class ctestVerticalNavigationTest extends LightningElement {
  constructor(...args) {
    super(...args);
    this.compact = void 0;
    this.shaded = void 0;
    this.selectedItem = void 0;
    this.ariaLabel = void 0;
  }
  handleBeforeSelect(event) {
    const mockBeforeSelectEvent = new CustomEvent('mockbeforeselect', {
      cancelable: true
    });
    this.dispatchEvent(mockBeforeSelectEvent);
    if (mockBeforeSelectEvent.defaultPrevented) {
      event.preventDefault();
    }
  }
  handleSelect() {
    this.dispatchEvent(new CustomEvent('mockselect'));
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(ctestVerticalNavigationTest, {
  publicProps: {
    compact: {
      config: 0
    },
    shaded: {
      config: 0
    },
    selectedItem: {
      config: 0
    },
    ariaLabel: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(ctestVerticalNavigationTest, {
  tmpl: _tmpl,
  sel: "lightningtest-vertical-navigation-test",
  apiVersion: 66
});
export default __lwc_component_class_internal;