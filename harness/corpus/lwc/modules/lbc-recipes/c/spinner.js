import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./spinner.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { classSet } from 'c/utils';
import { normalizeString as normalize } from 'c/utilsPrivate';
class cSpinner extends LightningElement {
  constructor(...args) {
    super(...args);
    this.alternativeText = void 0;
    this.size = 'medium';
    this.variant = void 0;
  }
  connectedCallback() {
    this.classList.add('slds-spinner_container');
    this.template.addEventListener('mousewheel', this.stopScrolling);
    this.template.addEventListener('touchmove', this.stopScrolling);
  }
  get normalizedVariant() {
    return normalize(this.variant, {
      fallbackValue: 'base',
      validValues: ['base', 'brand', 'inverse']
    });
  }
  get normalizedSize() {
    return normalize(this.size, {
      fallbackValue: 'medium',
      validValues: ['small', 'medium', 'large']
    });
  }
  get computedClass() {
    const {
      normalizedVariant,
      normalizedSize
    } = this;
    const classes = classSet('slds-spinner');
    if (normalizedVariant !== 'base') {
      classes.add(`slds-spinner_${normalizedVariant}`);
    }
    classes.add(`slds-spinner_${normalizedSize}`);
    return classes.toString();
  }
  get validAlternativeText() {
    const hasAlternativeText = !!this.alternativeText;
    if (!hasAlternativeText) {
      // eslint-disable-next-line no-console
      console.warn(`<c-spinner> The alternativeText attribute should not be empty. Please add a description of what is causing the wait.`);
    }
    return hasAlternativeText;
  }
  stopScrolling(event) {
    event.preventDefault();
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cSpinner, {
  publicProps: {
    alternativeText: {
      config: 0
    },
    size: {
      config: 0
    },
    variant: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(cSpinner, {
  tmpl: _tmpl,
  sel: "c-spinner",
  apiVersion: 66
});
export default __lwc_component_class_internal;