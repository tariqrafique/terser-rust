import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./badge.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import { classSet } from 'lightning/utils';
import { normalizeString } from 'lightning/utilsPrivate';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
const DEFAULT_POSITION = 'start';
class LightningBadge extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this._iconPosition = DEFAULT_POSITION;
    this.label = void 0;
    this.iconName = void 0;
    this.iconAlternativeText = void 0;
  }
  get iconPosition() {
    return this._iconPosition;
  }
  set iconPosition(value) {
    this._iconPosition = normalizeString(value, {
      fallbackValue: DEFAULT_POSITION,
      validValues: ['start', 'end']
    });
  }
  connectedCallback() {
    super.connectedCallback();
    this.classList.add('slds-badge');
  }
  get computedClass() {
    const iconClass = classSet('slds-badge__icon');
    iconClass.add(this.isIconBeforeLabel ? 'slds-badge__icon_left' : 'slds-badge__icon_right');
    return iconClass.toString();
  }
  get isIconBeforeLabel() {
    return this._iconPosition !== 'end';
  }
  /*LWC compiler v9.5.3*/
}
LightningBadge.validationOptOut = ['class'];
_registerDecorators(LightningBadge, {
  publicProps: {
    label: {
      config: 0
    },
    iconName: {
      config: 0
    },
    iconAlternativeText: {
      config: 0
    },
    iconPosition: {
      config: 3
    }
  },
  fields: ["_iconPosition"]
});
const __lwc_component_class_internal = _registerComponent(LightningBadge, {
  tmpl: _tmpl,
  sel: "lightning-badge",
  apiVersion: 66
});
export default __lwc_component_class_internal;