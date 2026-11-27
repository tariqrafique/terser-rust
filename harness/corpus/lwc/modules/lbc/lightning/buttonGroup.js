import _tmpl from "./buttonGroup.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { BUTTON_GROUP_ORDER } from 'lightning/utilsPrivate';
class LightningButtonGroup extends LightningShadowBaseClass {
  connectedCallback() {
    super.connectedCallback();
    this.classList.add('slds-button-group');
    this.setAttribute('role', 'group');
  }
  handleSlotChange(event) {
    const slot = event.target;
    const children = slot.assignedElements() || [];
    this.updateGroupOrder(children);
  }
  updateGroupOrder(children) {
    if (children.length) {
      if (children.length === 1) {
        children[0].groupOrder = null;
      } else {
        children[0].groupOrder = BUTTON_GROUP_ORDER.FIRST;
        children[children.length - 1].groupOrder = BUTTON_GROUP_ORDER.LAST;
        for (let i = 1; i < children.length - 1; i++) {
          children[i].groupOrder = BUTTON_GROUP_ORDER.MIDDLE;
        }
      }
    }
  }
  /*LWC compiler v9.5.3*/
}
LightningButtonGroup.validationOptOut = ['class'];
const __lwc_component_class_internal = _registerComponent(LightningButtonGroup, {
  tmpl: _tmpl,
  sel: "lightning-button-group",
  apiVersion: 66
});
export default __lwc_component_class_internal;