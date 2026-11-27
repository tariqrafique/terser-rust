import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./icon.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classListMutation, normalizeString, isIE11, reflectAttribute } from 'lightning/utilsPrivate';
import { computeSldsClass, getCategory, isValidName, getIconColor } from 'lightning/iconUtils';
import { privateContext } from 'lightning/utilsInternal';
import { normalizeVariant } from './util';
const {
  setContext,
  assertContext
} = privateContext;
class LightningIcon extends LightningShadowBaseClass {
  get src() {
    return this.privateSrc;
  }
  set src(value) {
    assertContext(this);
    this.privateSrc = value;
    if (!value) {
      this.updateIconName(this.iconName);
    }
    if (value && isIE11) {
      this.setDefault();
      return;
    }
    this._src = value;
  }
  get iconName() {
    return this._privateIconName;
  }
  set iconName(value) {
    this._privateIconName = value;
    if (this.src) {
      return;
    }
    this.updateIconName(value);
  }
  updateIconName(iconName) {
    if (iconName === this._iconName) {
      return;
    }
    const classes = {};
    if (typeof this._iconName !== 'undefined') {
      const oldIconClass = computeSldsClass(this._iconName);
      Object.assign(classes, {
        [oldIconClass]: false
      });
    }
    if (isValidName(iconName)) {
      const isAction = getCategory(iconName) === 'action';
      const iconClass = computeSldsClass(iconName);
      Object.assign(classes, {
        'slds-icon_container_circle': isAction,
        [iconClass]: true
      });
      this._iconName = iconName;
      this.setAttribute('icon-name', iconName);
    } else {
      console.warn(`<lightning-icon> Invalid icon name ${iconName}`);
      Object.assign(classes, {
        'slds-icon_container_circle': false
      });
      this._iconName = undefined;
      this.removeAttribute('icon-name');
    }
    classListMutation(this.classList, classes);
  }
  get size() {
    return normalizeString(this._size, {
      fallbackValue: 'medium',
      validValues: ['xx-small', 'x-small', 'small', 'medium', 'large']
    });
  }
  set size(value) {
    this._size = value;
  }
  get variant() {
    return normalizeVariant(this._variant, this._iconName);
  }
  set variant(value) {
    this._variant = value;
  }
  constructor() {
    super();
    this._src = void 0;
    this._privateIconName = void 0;
    this._iconName = void 0;
    this._size = void 0;
    this._variant = void 0;
    this.alternativeText = void 0;
    this.privateSrc = void 0;
    setContext(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this.classList.add('slds-icon_container');
  }
  renderedCallback() {
    const hostElement = this.template.host;
    const attributeValue = hostElement.hasAttribute('data-input-pill-search-icon');
    if (attributeValue) {
      reflectAttribute(this.template.querySelector('lightning-primitive-icon'), 'data-input-pill-search-primicon', true);
    }
  }
  setDefault() {
    this._src = undefined;
    this.updateIconName('standard:default');
  }
  get iconBgColorStyle() {
    const iconName = this.iconName;
    if (isValidName(iconName)) {
      const sdsStylingHook = '--sds-c-icon-color-background';
      const sldsStylingHook = '--slds-c-icon-color-background';
      const fallBackColor = 'transparent';
      const color = getIconColor(iconName);
      const colorToUse = color ? color : fallBackColor;
      return `${sdsStylingHook}: var(${sldsStylingHook}, ${colorToUse})`;
    }
    return '';
  }
  /*LWC compiler v9.5.3*/
}
LightningIcon.validationOptOut = ['class'];
_registerDecorators(LightningIcon, {
  publicProps: {
    alternativeText: {
      config: 0
    },
    src: {
      config: 3
    },
    iconName: {
      config: 3
    },
    size: {
      config: 3
    },
    variant: {
      config: 3
    }
  },
  track: {
    _src: 1,
    _privateIconName: 1,
    _iconName: 1,
    _size: 1,
    _variant: 1
  },
  fields: ["privateSrc"]
});
const __lwc_component_class_internal = _registerComponent(LightningIcon, {
  tmpl: _tmpl,
  sel: "lightning-icon",
  apiVersion: 66
});
export default __lwc_component_class_internal;