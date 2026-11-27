import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./recordEditFormRecipes.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import getRecord from '@salesforce/apex/GetAccountId.GetAccountId';
class RecordEditFormRecipes extends LightningElement {
  constructor(...args) {
    super(...args);
    this.accountId = void 0;
    this.formStatus = 'Form loaded';
  }
  wiredProperty(value) {
    if (value.data) {
      this.accountId = value.data.Id;
    } else if (value.error) {
      console.log('OOOPS: ', value.error);
    }
  }
  handleSuccess() {
    this.formStatus = 'Form successfully submitted';
  }
  handleError(e) {
    this.formStatus = 'We encountered an error';
    console.log('An error occurred: ', e);
  }
  handleCancel(event) {
    this.formStatus = 'Cancel button clicked';
    event.preventDefault();
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(RecordEditFormRecipes, {
  track: {
    accountId: 1,
    formStatus: 1
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
const __lwc_component_class_internal = _registerComponent(RecordEditFormRecipes, {
  tmpl: _tmpl,
  sel: "c-record-edit-form-recipes",
  apiVersion: 66
});
export default __lwc_component_class_internal;