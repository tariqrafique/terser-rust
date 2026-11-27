import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./buttonStatefulRecipes.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class ButtonStatefulRecipes extends LightningElement {
  constructor(...args) {
    super(...args);
    this.isSelected = false;
  }
  handleClick() {
    this.isSelected = !this.isSelected;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(ButtonStatefulRecipes, {
  track: {
    isSelected: 1
  }
});
const __lwc_component_class_internal = _registerComponent(ButtonStatefulRecipes, {
  tmpl: _tmpl,
  sel: "c-button-stateful-recipes",
  apiVersion: 66
});
export default __lwc_component_class_internal;