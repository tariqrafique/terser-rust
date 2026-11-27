import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./viewSource.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class ViewSource extends LightningElement {
  constructor(...args) {
    super(...args);
    this.baseURL = 'https://github.com/salesforce/base-components-recipes/tree/master/examples/lwc/';
    this.source = void 0;
  }
  get sourceURL() {
    return this.baseURL + this.source;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(ViewSource, {
  publicProps: {
    source: {
      config: 0
    }
  },
  fields: ["baseURL"]
});
const __lwc_component_class_internal = _registerComponent(ViewSource, {
  tmpl: _tmpl,
  sel: "c-view-source",
  apiVersion: 66
});
export default __lwc_component_class_internal;