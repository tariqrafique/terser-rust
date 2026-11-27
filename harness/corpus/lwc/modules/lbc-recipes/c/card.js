import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./card.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { classSet } from 'c/utils';
import { isNarrow, isBase } from './utils';
class cCard extends LightningElement {
  constructor(...args) {
    super(...args);
    this.title = void 0;
    this.iconName = void 0;
    this.privateVariant = 'base';
    this.showFooter = true;
  }
  set variant(value) {
    if (isNarrow(value) || isBase(value)) {
      this.privateVariant = value;
    } else {
      this.privateVariant = 'base';
    }
  }
  get variant() {
    return this.privateVariant;
  }
  renderedCallback() {
    if (this.footerSlot) {
      this.showFooter = this.footerSlot.assignedElements().length !== 0;
    }
  }
  get footerSlot() {
    return this.template.querySelector('slot[name=footer]');
  }
  get computedWrapperClassNames() {
    return classSet('slds-card').add({
      'slds-card_narrow': isNarrow(this.privateVariant)
    });
  }
  get hasIcon() {
    return !!this.iconName;
  }
  get hasStringTitle() {
    return !!this.title;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cCard, {
  publicProps: {
    title: {
      config: 0
    },
    iconName: {
      config: 0
    },
    variant: {
      config: 3
    }
  },
  track: {
    privateVariant: 1,
    showFooter: 1
  }
});
const __lwc_component_class_internal = _registerComponent(cCard, {
  tmpl: _tmpl,
  sel: "c-card",
  apiVersion: 66
});
export default __lwc_component_class_internal;