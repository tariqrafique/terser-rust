import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./recordViewFormRecipes.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import getRecord from '@salesforce/apex/GetAccountId.GetAccountId';
class RecordViewFormRecipes extends LightningElement {
  constructor(...args) {
    super(...args);
    this.accountId = void 0;
  }
  wiredProperty(value) {
    if (value.data) {
      this.accountId = value.data.Id;
    } else if (value.error) {
      console.log('OOOPS: ', value.error);
    }
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(RecordViewFormRecipes, {
  track: {
    accountId: 1
  },
  wire: {
    wiredProperty: {
      adapter: getRecord,
      method: 1,
      config: function ($cmp) {
        return {};
      }
    }
  }
});
const __lwc_component_class_internal = _registerComponent(RecordViewFormRecipes, {
  tmpl: _tmpl,
  sel: "c-record-view-form-recipes",
  apiVersion: 66
});
export default __lwc_component_class_internal;