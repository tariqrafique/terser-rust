import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./radioGroupRecipes.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class RadioGroupRecipes extends LightningElement {
  constructor(...args) {
    super(...args);
    this.value1 = '';
    this.value2 = '';
    this.value3 = '';
    this.value4 = '';
    this.value5 = '';
    this.value6 = '';
  }
  get options() {
    return [{
      label: 'Sales',
      value: 'option1'
    }, {
      label: 'Force',
      value: 'option2'
    }];
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(RadioGroupRecipes, {
  track: {
    value1: 1,
    value2: 1,
    value3: 1,
    value4: 1,
    value5: 1,
    value6: 1
  }
});
const __lwc_component_class_internal = _registerComponent(RadioGroupRecipes, {
  tmpl: _tmpl,
  sel: "c-radio-group-recipes",
  apiVersion: 66
});
export default __lwc_component_class_internal;