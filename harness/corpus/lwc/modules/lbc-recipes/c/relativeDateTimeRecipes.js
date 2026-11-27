import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./relativeDateTimeRecipes.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class RelativeDateTimeRecipes extends LightningElement {
  constructor(...args) {
    super(...args);
    this.SfdcDay = new Date('1999-02-01');
    this.today9AM = new Date().setHours(9, 0, 0, 0);
    this.now = Date.now();
    this.future20500104 = new Date('2050-01-04');
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(RelativeDateTimeRecipes, {
  fields: ["SfdcDay", "today9AM", "now", "future20500104"]
});
const __lwc_component_class_internal = _registerComponent(RelativeDateTimeRecipes, {
  tmpl: _tmpl,
  sel: "c-relative-date-time-recipes",
  apiVersion: 66
});
export default __lwc_component_class_internal;