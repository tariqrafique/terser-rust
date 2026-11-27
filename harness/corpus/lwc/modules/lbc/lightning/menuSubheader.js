import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./menuSubheader.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
class LightningMenuSubheader extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.label = void 0;
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'presentation');
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningMenuSubheader, {
  publicProps: {
    label: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(LightningMenuSubheader, {
  tmpl: _tmpl,
  sel: "lightning-menu-subheader",
  apiVersion: 66
});
export default __lwc_component_class_internal;