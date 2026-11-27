import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./sliderRecipes.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class SliderRecipes extends LightningElement {
  constructor(...args) {
    super(...args);
    this.val = 50;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(SliderRecipes, {
  fields: ["val"]
});
const __lwc_component_class_internal = _registerComponent(SliderRecipes, {
  tmpl: _tmpl,
  sel: "c-slider-recipes",
  apiVersion: 66
});
export default __lwc_component_class_internal;