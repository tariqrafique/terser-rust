import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./buttonRecipes.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class ButtonRecipes extends LightningElement {
  constructor(...args) {
    super(...args);
    this.clickedButtonLabel = void 0;
  }
  handleClick(event) {
    this.clickedButtonLabel = event.target.label;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(ButtonRecipes, {
  track: {
    clickedButtonLabel: 1
  }
});
const __lwc_component_class_internal = _registerComponent(ButtonRecipes, {
  tmpl: _tmpl,
  sel: "c-button-recipes",
  apiVersion: 66
});
export default __lwc_component_class_internal;