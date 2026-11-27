import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./tileRecipes.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class TileRecipes extends LightningElement {
  constructor(...args) {
    super(...args);
    this.actions = [{
      label: 'Edit',
      value: 'edit',
      iconName: 'utility:edit'
    }, {
      label: 'Delete',
      value: 'delete',
      iconName: 'utility:delete'
    }];
  }
  handleAction(event) {
    const actionValue = event.detail.action.value;
    console.log(`Action value selected: ${actionValue}`);
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(TileRecipes, {
  fields: ["actions"]
});
const __lwc_component_class_internal = _registerComponent(TileRecipes, {
  tmpl: _tmpl,
  sel: "c-tile-recipes",
  apiVersion: 66
});
export default __lwc_component_class_internal;