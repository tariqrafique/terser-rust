import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./button.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import { classSet } from 'lightning/utils';
import { getKineticsAttributes, animate } from './kinetics';
import { hasAnimation, normalizeString as normalize, normalizeBoolean, reflectAttribute } from 'lightning/utilsPrivate';
import LightningPrimitiveButton from 'lightning/primitiveButton';
import template from './button.html';
class LightningButton extends LightningPrimitiveButton {
  constructor(...args) {
    super(...args);
    this._normalizedVariant = 'neutral';
    this._stretch = false;
    this.name = void 0;
    this.value = void 0;
    this.label = void 0;
    this.tabIndex = void 0;
    this.originalVariant = void 0;
    this._connected = void 0;
    this.iconName = void 0;
    this.iconPosition = 'left';
    this._originalStretch = false;
    this._normalizedStretch = false;
    this.type = 'button';
    this._disableAnimation = false;
  }
  get variant() {
    return this.originalVariant;
  }
  set variant(value) {
    this.originalVariant = value;
    this._normalizedVariant = normalize(value, {
      fallbackValue: 'neutral',
      validValues: ['base', 'neutral', 'brand', 'brand-outline', 'destructive', 'destructive-text', 'inverse', 'success']
    });
    reflectAttribute(this, 'variant', this._normalizedVariant);
  }
  get stretch() {
    return this._originalStretch;
  }
  set stretch(value) {
    this._originalStretch = value;
    this._normalizedStretch = normalizeBoolean(value);
    reflectAttribute(this, 'stretch', this._normalizedStretch);
  }
  get disableAnimation() {
    return this._disableAnimation;
  }
  set disableAnimation(value) {
    this._disableAnimation = normalizeBoolean(value);
  }
  render() {
    return template;
  }
  get computedButtonClass() {
    const classes = classSet(super.computedButtonClass);
    return classes.add({
      'slds-button_neutral': this._normalizedVariant === 'neutral',
      'slds-button_brand': this._normalizedVariant === 'brand',
      'slds-button_outline-brand': this._normalizedVariant === 'brand-outline',
      'slds-button_destructive': this._normalizedVariant === 'destructive',
      'slds-button_text-destructive': this._normalizedVariant === 'destructive-text',
      'slds-button_inverse': this._normalizedVariant === 'inverse',
      'slds-button_success': this._normalizedVariant === 'success',
      'slds-button_stretch': this.stretch
    }).toString();
  }
  get normalizedType() {
    return normalize(this.type, {
      fallbackValue: 'button',
      validValues: ['button', 'reset', 'submit']
    });
  }
  get normalizedIconPosition() {
    return normalize(this.iconPosition, {
      fallbackValue: 'left',
      validValues: ['left', 'right']
    });
  }
  get showIconLeft() {
    return this.iconName && this.normalizedIconPosition === 'left';
  }
  get showIconRight() {
    return this.iconName && this.normalizedIconPosition === 'right';
  }
  get computedIconClass() {
    return classSet('slds-button__icon').add({
      'slds-button__icon_left': this.normalizedIconPosition === 'left',
      'slds-button__icon_right': this.normalizedIconPosition === 'right'
    }).toString();
  }
  handleButtonFocus() {
    this.dispatchEvent(new CustomEvent('focus'));
  }
  handleButtonBlur() {
    this.dispatchEvent(new CustomEvent('blur'));
  }
  handleButtonClick() {
    if (!this.template['synthetic'] && this.normalizedType === 'submit') {
      const form = this.template.host.closest('form');
      if (form) {
        form.requestSubmit();
      }
    }
  }
  focus() {
    if (this._connected) {
      this.button.focus();
    }
  }
  click() {
    if (this._connected) {
      this.button.click();
    }
  }
  get button() {
    return !import.meta.env.SSR ? this.template.querySelector('button') : null;
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.template['synthetic']) {
      this.setAttribute('data-render-mode', 'shadow');
    }
    if (!this._connected) {
      reflectAttribute(this, 'variant', this._normalizedVariant);
      this._connected = true;
    }
  }
  renderedCallback() {
    super.renderedCallback();
    this.template.host.style.pointerEvents = this.disabled ? 'none' : '';
    if (!this.disabled && hasAnimation() && !this._disableAnimation) {
      const attributes = getKineticsAttributes(this._normalizedVariant);
      attributes.forEach(({
        name,
        value
      }) => {
        this.button.setAttribute(name, value);
      });
      animate(this.button);
    } else {
      const attributes = getKineticsAttributes(this._normalizedVariant);
      attributes.forEach(({
        name
      }) => {
        this.button.removeAttribute(name);
      });
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._connected = false;
  }
  /*LWC compiler v9.5.3*/
}
LightningButton.delegatesFocus = true;
LightningButton.interopMap = void 0;
_registerDecorators(LightningButton, {
  publicProps: {
    name: {
      config: 0
    },
    value: {
      config: 0
    },
    label: {
      config: 0
    },
    tabIndex: {
      config: 0
    },
    variant: {
      config: 3
    },
    iconName: {
      config: 0
    },
    iconPosition: {
      config: 0
    },
    stretch: {
      config: 3
    },
    type: {
      config: 0
    },
    disableAnimation: {
      config: 3
    }
  },
  publicMethods: ["focus", "click"],
  fields: ["_normalizedVariant", "_stretch", "originalVariant", "_connected", "_originalStretch", "_normalizedStretch", "_disableAnimation"]
});
const __lwc_component_class_internal = _registerComponent(LightningButton, {
  tmpl: _tmpl,
  sel: "lightning-button",
  apiVersion: 66
});
export default __lwc_component_class_internal;
LightningButton.interopMap = {
  exposeNativeEvent: {
    click: true,
    focus: true,
    blur: true
  }
};