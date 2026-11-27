import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./formattedLookupRecipes.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import getRecord from '@salesforce/apex/GetAccountId.GetAccountId';
class FormattedLookupRecipes extends LightningElement {
  constructor(...args) {
    super(...args);
    this.accountId = void 0;
    this.accountName = void 0;
  }
  wiredProperty(value) {
    if (value.data) {
      this.accountId = value.data.Id;
      this.accountName = value.data.Name;
    } else if (value.error) {
      console.log('OOOPS: ', value.error);
    }
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(FormattedLookupRecipes, {
  track: {
    accountId: 1,
    accountName: 1
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
const __lwc_component_class_internal = _registerComponent(FormattedLookupRecipes, {
  tmpl: _tmpl,
  sel: "c-formatted-lookup-recipes",
  apiVersion: 66
});
export default __lwc_component_class_internal;