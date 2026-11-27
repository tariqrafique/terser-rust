import _tmpl from "./shadowBaseClassPrivate.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
class LightningShadowBaseClass extends LightningElement {
  connectedCallback() {
    if (!this.template['synthetic']) {
      this.setAttribute('data-render-mode', 'shadow');
    }
  }
  /*LWC compiler v9.5.3*/
}
const __lwc_component_class_internal = _registerComponent(LightningShadowBaseClass, {
  tmpl: _tmpl,
  sel: "lightning-shadow-base-class-private",
  apiVersion: 66
});
export default __lwc_component_class_internal;