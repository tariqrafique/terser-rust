import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./dualListboxRecipes.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class dualListboxRecipes extends LightningElement {
  constructor(...args) {
    super(...args);
    this._selectedSimpleListbox = [];
    this._selectedRequiredListbox = ['en'];
  }
  get options() {
    return [{
      label: 'English',
      value: 'en'
    }, {
      label: 'German',
      value: 'de'
    }, {
      label: 'Spanish',
      value: 'es'
    }, {
      label: 'French',
      value: 'fr'
    }, {
      label: 'Italian',
      value: 'it'
    }, {
      label: 'Japanese',
      value: 'ja'
    }];
  }
  get requiredOptions() {
    return ['en'];
  }
  get selectedSimpleListbox() {
    return this._selectedSimpleListbox.length ? this._selectedSimpleListbox : 'none';
  }
  get selectedRequiredListbox() {
    return this._selectedRequiredListbox.length ? this._selectedRequiredListbox : 'none';
  }
  handleChangeInSimpleListbox(e) {
    this._selectedSimpleListbox = e.detail.value;
  }
  handleChangeInRequiredListbox(e) {
    this._selectedRequiredListbox = e.detail.value;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(dualListboxRecipes, {
  track: {
    _selectedSimpleListbox: 1,
    _selectedRequiredListbox: 1
  }
});
const __lwc_component_class_internal = _registerComponent(dualListboxRecipes, {
  tmpl: _tmpl,
  sel: "c-dual-listbox-recipes",
  apiVersion: 66
});
export default __lwc_component_class_internal;