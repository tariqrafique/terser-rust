import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./avatar.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { classSet } from 'c/utils';
import { classListMutation, normalizeString } from 'c/utilsPrivate';
import { computeSldsClass } from 'c/iconUtils';
const DEFAULT_SIZE = 'medium';
const DEFAULT_VARIANT = 'square';
class cAvatar extends LightningElement {
  constructor(...args) {
    super(...args);
    this.alternativeText = '';
    this.fallbackIconName = void 0;
    this.initials = void 0;
    this._size = DEFAULT_SIZE;
    this._src = '';
    this._variant = DEFAULT_VARIANT;
  }
  get size() {
    return this._size;
  }
  set size(value) {
    this._size = normalizeString(value, {
      fallbackValue: DEFAULT_SIZE,
      validValues: ['x-small', 'small', 'medium', 'large']
    });
    this.updateClassList();
  }
  get src() {
    return this._src;
  }
  set src(value) {
    this._src = typeof value === 'string' && value.trim() || '';
  }
  get variant() {
    return this._variant;
  }
  set variant(value) {
    this._variant = normalizeString(value, {
      fallbackValue: DEFAULT_VARIANT,
      validValues: ['circle', 'square']
    });
    this.updateClassList();
  }
  connectedCallback() {
    this.updateClassList();
  }
  updateClassList() {
    const size = this._size;
    const variant = this._variant;
    const classes = classSet('slds-avatar').add({
      'slds-avatar_x-small': size === 'x-small',
      'slds-avatar_small': size === 'small',
      'slds-avatar_medium': size === 'medium',
      'slds-avatar_large': size === 'large'
    }).add({
      'slds-avatar_circle': variant === 'circle'
    });
    classListMutation(this.classList, classes);
  }
  get computedInitialsClass() {
    return classSet('slds-avatar__initials').add(computeSldsClass(this.fallbackIconName)).toString();
  }
  get showInitials() {
    return !this._src && this.initials;
  }
  get showIcon() {
    return !this._src && !this.initials;
  }
  handleImageError(event) {
    // eslint-disable-next-line no-console
    console.warn(`<c-avatar> Image with src="${event.target.src}" failed to load.`);
    this._src = '';
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cAvatar, {
  publicProps: {
    alternativeText: {
      config: 0
    },
    fallbackIconName: {
      config: 0
    },
    initials: {
      config: 0
    },
    size: {
      config: 3
    },
    src: {
      config: 3
    },
    variant: {
      config: 3
    }
  },
  track: {
    _size: 1,
    _src: 1,
    _variant: 1
  }
});
const __lwc_component_class_internal = _registerComponent(cAvatar, {
  tmpl: _tmpl,
  sel: "c-avatar",
  apiVersion: 66
});
export default __lwc_component_class_internal;