import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./buttonMenuRecipes.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class ButtonMenuRecipes extends LightningElement {
  constructor(...args) {
    super(...args);
    this.selectedItemValue = void 0;
    // basic data source with minimal content
    this.myMenuItems = [{
      id: 'item-01',
      label: 'Alpha',
      value: 'alpha'
    }, {
      id: 'item-02',
      label: 'Beta',
      value: 'beta'
    }, {
      id: 'item-03',
      label: 'Gamma',
      value: 'gamma'
    }, {
      id: 'item-04',
      label: 'Delta',
      value: 'delta'
    }, {
      id: 'item-05',
      label: 'Epsilon',
      value: 'epsilon'
    }];
    // more complex data source with additional content
    this.myComplexMenuItems = [{
      id: 'item-01',
      label: 'Alpha',
      value: 'alpha',
      disabled: false,
      prefixIconName: 'utility:bookmark',
      iconName: 'utility:animal_and_nature'
    }, {
      id: 'item-02',
      label: 'Beta',
      value: 'beta',
      disabled: true,
      iconName: 'utility:company'
    }, {
      id: 'item-03',
      label: 'Gamma',
      value: 'gamma',
      prefixIconName: 'utility:date_input'
    }, {
      id: 'item-04',
      label: 'Delta',
      value: 'delta'
    }, {
      id: 'item-05',
      label: 'Epsilon',
      value: 'epsilon',
      iconName: 'utility:knowledge_base'
    }];
  }
  handleOnselect(event) {
    this.selectedItemValue = event.detail.value;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(ButtonMenuRecipes, {
  track: {
    selectedItemValue: 1
  },
  fields: ["myMenuItems", "myComplexMenuItems"]
});
const __lwc_component_class_internal = _registerComponent(ButtonMenuRecipes, {
  tmpl: _tmpl,
  sel: "c-button-menu-recipes",
  apiVersion: 66
});
export default __lwc_component_class_internal;