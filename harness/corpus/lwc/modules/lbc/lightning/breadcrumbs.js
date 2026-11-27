import _tmpl from "./breadcrumbs.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
class LightningBreadcrumbs extends LightningShadowBaseClass {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('aria-label', 'Breadcrumbs');
    this.setAttribute('role', 'navigation');
  }
  handleSlotChange() {
    const breadcrumbs = this.template.querySelector('slot').assignedNodes();
    const len = breadcrumbs.length;
    for (let i = 0; i < len; i++) {
      const breadcrumb = breadcrumbs[i];
      if (i === len - 1) {
        breadcrumb.ariaCurrent = 'page';
      } else {
        breadcrumb.ariaCurrent = null;
      }
    }
  }
  /*LWC compiler v9.5.3*/
}
const __lwc_component_class_internal = _registerComponent(LightningBreadcrumbs, {
  tmpl: _tmpl,
  sel: "lightning-breadcrumbs",
  apiVersion: 66
});
export default __lwc_component_class_internal;