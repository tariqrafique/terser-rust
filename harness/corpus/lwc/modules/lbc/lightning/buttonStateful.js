import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./buttonStateful.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet } from 'lightning/utils';
import { normalizeBoolean, normalizeString as normalize, buttonGroupOrderClass } from 'lightning/utilsPrivate';
import { reflectAttribute } from 'lightning/utilsPrivate';
import { features } from 'lightning/features';
import { privateContext } from 'lightning/utilsInternal';
const {
  setContext,
  assertContext
} = privateContext;
const DEFAULT_VARIANT = 'neutral';
class LightningButtonStateful extends LightningShadowBaseClass {
  get variant() {
    return this._originalVariant;
  }
  set variant(value) {
    this._originalVariant = value;
    this._privateVariant = this.normalizeVariant(value);
    reflectAttribute(this, 'variant', this._privateVariant);
  }
  get selected() {
    return this.state.selected || false;
  }
  set selected(value) {
    this.state.selected = normalizeBoolean(value);
  }
  constructor() {
    super();
    this._originalVariant = DEFAULT_VARIANT;
    this._privateVariant = DEFAULT_VARIANT;
    this.state = {
      isClicked: false
    };
    this.disabled = void 0;
    this.iconNameWhenOn = void 0;
    this.iconNameWhenOff = void 0;
    this.iconNameWhenHover = void 0;
    this.labelWhenOff = void 0;
    this.labelWhenOn = void 0;
    this.labelWhenHover = void 0;
    this.groupOrder = '';
    setContext(this);
  }
  renderedCallback() {
    this.template.host.style.pointerEvents = this.disabled ? 'none' : '';
  }
  focus() {
    if (!import.meta.env.SSR) {
      this.template.querySelector('button').focus();
    }
  }
  get computedButtonClass() {
    const classes = classSet('slds-button slds-button_stateful').add({
      'slds-button_neutral': this._privateVariant === 'neutral',
      'slds-button_brand': this._privateVariant === 'brand',
      'slds-button_inverse': this._privateVariant === 'inverse',
      'slds-button_destructive': this._privateVariant === 'destructive',
      'slds-button_success': this._privateVariant === 'success'
    }).add({
      'slds-not-selected': !this.selected,
      'slds-is-selected': this.selected && !this.state.isClicked,
      'slds-is-selected-clicked': this.selected && this.state.isClicked
    }).add(buttonGroupOrderClass(this.groupOrder));
    return classes.toString();
  }
  normalizeVariant(value) {
    if (features.enableAssertContext260Round2) {
      assertContext(this);
    }
    return normalize(value, {
      fallbackValue: DEFAULT_VARIANT,
      validValues: ['neutral', 'brand', 'inverse', 'destructive', 'success', 'text']
    });
  }
  get privateLabelWhenOn() {
    let outputVal = this.labelWhenOn;
    if (this.isValidLabel(outputVal)) {
      return outputVal;
    }
    outputVal = '';
    console.warn(`<lightning-button-stateful> The "labelWhenOn" attribute value is required to show the label when selected has a value of true`);
    return outputVal;
  }
  get privateLabelWhenOff() {
    let outputVal = this.labelWhenOff;
    if (this.isValidLabel(outputVal)) {
      return outputVal;
    }
    outputVal = '';
    console.warn(`<lightning-button-stateful> The "labelWhenOff" attribute value is required to show the label when selected has a value of false`);
    return outputVal;
  }
  get privateLabelWhenHover() {
    const outputVal = this.labelWhenHover;
    if (this.isValidLabel(outputVal)) {
      return outputVal;
    }
    return this.privateLabelWhenOn;
  }
  get privateIconNameWhenHover() {
    if (this.iconNameWhenHover) {
      return this.iconNameWhenHover;
    }
    return this.iconNameWhenOn;
  }
  handleButtonClick() {
    this.state.isClicked = true;
  }
  handleButtonBlur() {
    this.state.isClicked = false;
    this.dispatchEvent(new CustomEvent('blur'));
  }
  handleButtonFocus() {
    this.dispatchEvent(new CustomEvent('focus'));
  }
  get computedAriaPressed() {
    return String(this.state.selected);
  }
  isValidLabel(labelVal) {
    if (typeof labelVal !== 'string' || labelVal.length === 0) {
      return false;
    }
    return true;
  }
  /*LWC compiler v9.5.3*/
}
LightningButtonStateful.delegatesFocus = true;
_registerDecorators(LightningButtonStateful, {
  publicProps: {
    disabled: {
      config: 0
    },
    iconNameWhenOn: {
      config: 0
    },
    iconNameWhenOff: {
      config: 0
    },
    iconNameWhenHover: {
      config: 0
    },
    labelWhenOff: {
      config: 0
    },
    labelWhenOn: {
      config: 0
    },
    labelWhenHover: {
      config: 0
    },
    groupOrder: {
      config: 0
    },
    variant: {
      config: 3
    },
    selected: {
      config: 3
    }
  },
  publicMethods: ["focus"],
  track: {
    state: 1
  },
  fields: ["_originalVariant", "_privateVariant"]
});
const __lwc_component_class_internal = _registerComponent(LightningButtonStateful, {
  tmpl: _tmpl,
  sel: "lightning-button-stateful",
  apiVersion: 66
});
export default __lwc_component_class_internal;
LightningButtonStateful['interopMap'] = {
  props: {
    selected: 'state'
  }
};