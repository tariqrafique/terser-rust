import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./recordFormRecipes.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import getRecord from '@salesforce/apex/GetAccountId.GetAccountId';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import REVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue';
import BILLING_FIELD from '@salesforce/schema/Account.BillingAddress';
class RecordFormEditExample extends LightningElement {
  constructor(...args) {
    super(...args);
    this.fields = [NAME_FIELD, REVENUE_FIELD, BILLING_FIELD];
    this.accountId = void 0;
  }
  wiredProperty(value) {
    if (value.data) {
      this.accountId = value.data.Id;
    } else if (value.error) {
      console.log('OOOPS: ', value.error);
    }
  }
  handleSubmit(event) {
    event.preventDefault(); // stop the form from submitting
    const fields = event.detail.fields;
    fields.LastName = 'My New Last Name'; // modify a field
    this.template.querySelector('c-record-form').submit(fields);
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(RecordFormEditExample, {
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
  },
  fields: ["fields"]
});
const __lwc_component_class_internal = _registerComponent(RecordFormEditExample, {
  tmpl: _tmpl,
  sel: "c-record-form-recipes",
  apiVersion: 66
});
export default __lwc_component_class_internal;