import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./stackedTab.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
class LightningStackedTab extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.label = void 0;
    this.iconName = 'utility:chevronright';
  }
  focus() {
    this.template.querySelector('button').focus();
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningStackedTab, {
  publicProps: {
    label: {
      config: 0
    },
    iconName: {
      config: 0
    }
  },
  publicMethods: ["focus"]
});
const __lwc_component_class_internal = _registerComponent(LightningStackedTab, {
  tmpl: _tmpl,
  sel: "lightning-stacked-tab",
  apiVersion: 66
});
export default __lwc_component_class_internal;