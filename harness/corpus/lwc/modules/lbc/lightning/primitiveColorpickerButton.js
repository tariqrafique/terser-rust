import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveColorpickerButton.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import labelA11yTriggerText from '@salesforce/label/LightningColorPicker.a11yTriggerText';
import labelA11yDefaultText from '@salesforce/label/LightningColorPicker.a11yDefaultText';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { Direction, AutoPosition } from 'lightning/positionLibrary';
import { normalizeBoolean, reflectAttribute } from 'lightning/utilsPrivate';
const i18n = {
  a11yTriggerText: labelA11yTriggerText,
  a11yDefaultText: labelA11yDefaultText
};
class PrimitiveColorpickerButton extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this._isColorPickerPanelOpen = false;
    this._value = '';
    this._disabled = false;
    this.ariaDisabled = void 0;
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
  }
  get assistiveValue() {
    return this.value ? this.value : this.i18n.a11yDefaultText;
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = normalizeBoolean(value);
    reflectAttribute(this, 'disabled', this.disabled);
  }
  focus() {
    const button = this.template.querySelector('button');
    return button && button.focus();
  }
  blur() {
    const button = this.template.querySelector('button');
    return button && button.blur();
  }
  get colorInputStyle() {
    return `background: ${this.value || '#5679C0'};`;
  }
  handleColorPickerToggleClick(event) {
    event.preventDefault();
    this._isColorPickerPanelOpen = !this._isColorPickerPanelOpen;
    if (this._isColorPickerPanelOpen) {
      this.startColorPickerPositioning();
    } else {
      this.stopColorPickerPositioning();
    }
  }
  startColorPickerPositioning() {
    if (!this._autoPosition) {
      this._autoPosition = new AutoPosition(this);
    }
    this._autoPosition.start({
      target: () => this.template.querySelector('button.slds-color-picker__summary-button'),
      element: () => this.template.querySelector('lightning-color-picker-panel').shadowRoot.querySelector('section'),
      align: {
        horizontal: Direction.Left,
        vertical: Direction.Top
      },
      targetAlign: {
        horizontal: Direction.Left,
        vertical: Direction.Bottom
      },
      autoFlip: true
    });
  }
  stopColorPickerPositioning() {
    if (this._autoPosition) {
      this._autoPosition.stop();
    }
  }
  handleUpdateColorEvent(event) {
    event.stopPropagation();
    const detail = event.detail;
    this._isColorPickerPanelOpen = false;
    this.stopColorPickerPositioning();
    this.dispatchEvent(new CustomEvent('change', {
      detail
    }));
  }
  get i18n() {
    return i18n;
  }
  /*LWC compiler v9.5.3*/
}
PrimitiveColorpickerButton.delegatesFocus = true;
_registerDecorators(PrimitiveColorpickerButton, {
  publicProps: {
    ariaDisabled: {
      config: 0
    },
    value: {
      config: 3
    },
    assistiveValue: {
      config: 1
    },
    disabled: {
      config: 3
    }
  },
  publicMethods: ["focus", "blur"],
  track: {
    _isColorPickerPanelOpen: 1,
    _value: 1,
    _disabled: 1
  }
});
const __lwc_component_class_internal = _registerComponent(PrimitiveColorpickerButton, {
  tmpl: _tmpl,
  sel: "lightning-primitive-colorpicker-button",
  apiVersion: 66
});
export default __lwc_component_class_internal;