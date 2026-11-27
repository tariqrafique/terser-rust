import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./carouselRecipes.html";
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
class BadgeRecipes extends LightningElement {
  constructor(...args) {
    super(...args);
    this.badgeLabel = 'badge Label';
  }
  handleButtonOneClick() {
    this.badgeLabel = null;
  }
  handleButtonTwoClick() {
    this.badgeLabel = 'Hello';
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(BadgeRecipes, {
  track: {
    badgeLabel: 1
  }
});
const __lwc_component_class_internal = _registerComponent(BadgeRecipes, {
  tmpl: _tmpl,
  sel: "c-carousel-recipes",
  apiVersion: 66
});
export default __lwc_component_class_internal;