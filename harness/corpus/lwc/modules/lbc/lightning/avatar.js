import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./avatar.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet } from 'lightning/utils';
import { normalizeString, reflectAttribute } from 'lightning/utilsPrivate';
import { computeSldsClass, getIconColor } from 'lightning/iconUtils';
const DEFAULT_SIZE = 'medium';
const DEFAULT_VARIANT = 'square';
class LightningAvatar extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.alternativeText = '';
    this.initials = void 0;
    this._size = DEFAULT_SIZE;
    this._src = '';
    this._fallbackIconName = '';
    this._variant = DEFAULT_VARIANT;
  }
  set fallbackIconName(value) {
    this._fallbackIconName = value;
    reflectAttribute(this, 'icon-name', this._fallbackIconName);
  }
  get fallbackIconName() {
    return this._fallbackIconName;
  }
  get size() {
    return this._size;
  }
  set size(value) {
    this._size = normalizeString(value, {
      fallbackValue: DEFAULT_SIZE,
      validValues: ['x-small', 'small', 'medium', 'large']
    });
    reflectAttribute(this, 'size', this._size);
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
    reflectAttribute(this, 'variant', this._variant);
  }
  get computedClass() {
    const variant = this._variant;
    const size = this._size;
    return classSet('slds-avatar').add({
      'slds-avatar_x-small': size === 'x-small',
      'slds-avatar_small': size === 'small',
      'slds-avatar_medium': size === 'medium',
      'slds-avatar_large': size === 'large'
    }).add({
      'slds-avatar_circle': variant === 'circle'
    });
  }
  get computedInitialsClass() {
    return classSet('slds-avatar__initials').add(computeSldsClass(this.fallbackIconName)).toString();
  }
  get computedInitialsStyle() {
    if (this.fallbackIconName) {
      const color = getIconColor(this.fallbackIconName);
      if (color) {
        return `background-color: var(--slds-c-icon-color-background, ${color})`;
      }
    }
    const fallbackBGColor = '#0176d3';
    return `background-color: var(
            --slds-c-avatar-color-background,
            var(--slds-g-color-accent-container-2, ${fallbackBGColor})
        )`;
  }
  get showInitials() {
    return !this._src && this.initials;
  }
  get showIcon() {
    return !this._src && !this.initials;
  }
  handleImageError(event) {
    console.warn(`<lightning-avatar> Image with src="${event.target.src}" failed to load.`);
    this._src = '';
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningAvatar, {
  publicProps: {
    alternativeText: {
      config: 0
    },
    fallbackIconName: {
      config: 3
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
    _fallbackIconName: 1,
    _variant: 1
  }
});
const __lwc_component_class_internal = _registerComponent(LightningAvatar, {
  tmpl: _tmpl,
  sel: "lightning-avatar",
  apiVersion: 66
});
export default __lwc_component_class_internal;