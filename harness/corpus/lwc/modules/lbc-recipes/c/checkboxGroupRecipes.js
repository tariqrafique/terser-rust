import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./checkboxGroupRecipes.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/*
 * !! NOTE: Do not commit changes to this file. It is intended as a starter shell only.
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class CheckboxGroupRecipes extends LightningElement {
  constructor(...args) {
    super(...args);
    this.value1 = ['option1'];
    this.value2 = [];
    this.value3 = [];
  }
  get options() {
    return [{
      label: 'Ross',
      value: 'option1'
    }, {
      label: 'Rachel',
      value: 'option2'
    }, {
      label: 'Bob',
      value: 'option3'
    }, {
      label: 'Greg',
      value: 'option4'
    }, {
      label: 'Lokesh',
      value: 'option5'
    }];
  }
  get selectedValues() {
    return this.value1.join(',');
  }
  handleChangeOne(e) {
    this.value1 = e.detail.value;
  }
  handleChangeTwo(e) {
    this.value2 = e.detail.value;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(CheckboxGroupRecipes, {
  track: {
    value1: 1,
    value2: 1,
    value3: 1
  }
});
const __lwc_component_class_internal = _registerComponent(CheckboxGroupRecipes, {
  tmpl: _tmpl,
  sel: "c-checkbox-group-recipes",
  apiVersion: 66
});
export default __lwc_component_class_internal;