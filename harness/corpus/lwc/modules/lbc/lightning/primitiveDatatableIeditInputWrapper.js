import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveDatatableIeditInputWrapper.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
class LightningPrimitiveDatatableIeditInputWrapper extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.required = void 0;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningPrimitiveDatatableIeditInputWrapper, {
  publicProps: {
    required: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(LightningPrimitiveDatatableIeditInputWrapper, {
  tmpl: _tmpl,
  sel: "lightning-primitive-datatable-iedit-input-wrapper",
  apiVersion: 66
});
export default __lwc_component_class_internal;