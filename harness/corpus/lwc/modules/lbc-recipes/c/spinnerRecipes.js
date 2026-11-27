import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./spinnerRecipes.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class SpinnerRecipes extends LightningElement {
  constructor(...args) {
    super(...args);
    this.loaded = true;
  }
  handleClick() {
    this.loaded = !this.loaded;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(SpinnerRecipes, {
  track: {
    loaded: 1
  }
});
const __lwc_component_class_internal = _registerComponent(SpinnerRecipes, {
  tmpl: _tmpl,
  sel: "c-spinner-recipes",
  apiVersion: 66
});
export default __lwc_component_class_internal;