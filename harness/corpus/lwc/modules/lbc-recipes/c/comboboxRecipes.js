import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./comboboxRecipes.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class ComboboxRecipes extends LightningElement {
  constructor(...args) {
    super(...args);
    this.value = 'inProgress';
    this.state = {
      progress: this.value,
      progressRequired: '',
      progressDisabled: ''
    };
  }
  get options() {
    return [{
      label: 'New',
      value: 'new'
    }, {
      label: 'In Progress',
      value: 'inProgress'
    }, {
      label: 'Finished',
      value: 'finished'
    }];
  }
  handleChange(event) {
    this.state[event.target.name] = event.detail.value;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(ComboboxRecipes, {
  track: {
    state: 1
  },
  fields: ["value"]
});
const __lwc_component_class_internal = _registerComponent(ComboboxRecipes, {
  tmpl: _tmpl,
  sel: "c-combobox-recipes",
  apiVersion: 66
});
export default __lwc_component_class_internal;