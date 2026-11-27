import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./tabOverflow.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
const NUM_OF_TABS = 30;
class TabsetOverflow extends LightningElement {
  constructor(...args) {
    super(...args);
    this.activeValueMessage = '';
  }
  get tabs() {
    const tabs = [];
    for (let i = 0; i < NUM_OF_TABS; i++) {
      tabs.push({
        value: `${i}`,
        label: `Item ${i}`,
        content: `Tab Content ${i}`
      });
    }
    return tabs;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(TabsetOverflow, {
  track: {
    activeValueMessage: 1
  }
});
const __lwc_component_class_internal = _registerComponent(TabsetOverflow, {
  tmpl: _tmpl,
  sel: "c-tab-overflow",
  apiVersion: 66
});
export default __lwc_component_class_internal;