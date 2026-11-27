import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./buttonGroupRecipes.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class ButtonGroupRecipes extends LightningElement {
  constructor(...args) {
    super(...args);
    this.buttonStatefulState = false;
    this.buttonIconStatefulState = false;
  }
  handleButtonStatefulClick() {
    this.buttonStatefulState = !this.buttonStatefulState;
  }
  handleButtonIconStatefulClick() {
    this.buttonIconStatefulState = !this.buttonIconStatefulState;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(ButtonGroupRecipes, {
  track: {
    buttonStatefulState: 1,
    buttonIconStatefulState: 1
  }
});
const __lwc_component_class_internal = _registerComponent(ButtonGroupRecipes, {
  tmpl: _tmpl,
  sel: "c-button-group-recipes",
  apiVersion: 66
});
export default __lwc_component_class_internal;