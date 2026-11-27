import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./badge.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { classSet } from 'c/utils';
import { normalizeString } from 'c/utilsPrivate';
const DEFAULT_POSITION = 'start';
class cBadge extends LightningElement {
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
    this.classList.add('slds-badge');
  }
  get computedClass() {
    let iconClass = classSet('slds-badge__icon');
    iconClass.add(this.isIconBeforeLabel ? 'slds-badge__icon_left' : 'slds-badge__icon_right');
    return iconClass.toString();
  }
  get isIconBeforeLabel() {
    return this._iconPosition !== 'end';
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cBadge, {
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
const __lwc_component_class_internal = _registerComponent(cBadge, {
  tmpl: _tmpl,
  sel: "c-badge",
  apiVersion: 66
});
export default __lwc_component_class_internal;