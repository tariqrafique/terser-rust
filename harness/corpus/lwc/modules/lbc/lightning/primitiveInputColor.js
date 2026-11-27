import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveInputColor.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet } from 'lightning/utils';
import { VARIANT } from 'lightning/inputUtils';
import { reflectAttribute, isNativeComponent } from 'lightning/utilsPrivate';
import { privateContext } from 'lightning/utilsInternal';
import { features } from 'lightning/features';
const {
  setContext,
  assertContext
} = privateContext;
class LightningPrimitiveInputColor extends LightningShadowBaseClass {
  constructor() {
    super();
    this.hasExternalLabel = void 0;
    this.required = void 0;
    this.accessKey = void 0;
    this.label = void 0;
    this.fieldLevelHelp = void 0;
    this.helptextAlternativeText = void 0;
    this.helpMessage = void 0;
    this.disabled = void 0;
    this.name = void 0;
    this.autocomplete = void 0;
    this.ariaLabel = void 0;
    this.ariaInvalid = void 0;
    this.ariaDisabled = void 0;
    this.ariaKeyShortcuts = void 0;
    this.placeholder = void 0;
    this.pattern = void 0;
    this.variant = void 0;
    this._value = '';
    this.rendered = false;
    this.initialValueSet = false;
    if (features.enableAssertContext260) {
      setContext(this);
    }
  }
  focus() {
    if (this.rendered) {
      this.inputElement.focus();
    }
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = this.normalizeInput(value);
    if (this.rendered && this.inputElement.value !== this._value) {
      this.setInputValue(this._value);
    }
  }
  get inputElement() {
    if (!this.cachedInputElement) {
      let inputElement = this.template.querySelector('input');
      this.cachedInputElement = inputElement;
    }
    return this.cachedInputElement;
  }
  get ariaDescribedByElements() {
    return this.template.querySelector('[data-help-message]');
  }
  get ariaErrorMessageElement() {
    return this.template.querySelector('[data-help-message]');
  }
  get isNativeShadow() {
    return this._isNativeShadow;
  }
  connectedCallback() {
    super.connectedCallback();
    this._isNativeShadow = isNativeComponent(this);
  }
  disconnectedCallback() {
    this.rendered = false;
    this.initialValueSet = false;
    this.cachedInputElement = undefined;
  }
  renderedCallback() {
    this.rendered = true;
    if (!this.initialValueSet) {
      this.inputElement.value = this._value;
      this.initialValueSet = true;
    }
    reflectAttribute(this, 'disabled', this.disabled);
    reflectAttribute(this, 'invalid', !!this.helpMessage);
    reflectAttribute(this, 'variant', this.variant);
  }
  get computedColorLabelClass() {
    return classSet('slds-form-element__label slds-color-picker__summary-label').add({
      'slds-assistive-text': this.isLabelHidden
    });
  }
  get isLabelHidden() {
    return this.variant === VARIANT.LABEL_HIDDEN;
  }
  handleBlur() {
    this.dispatchEvent(new CustomEvent('blur'));
  }
  handleFocus() {
    this.dispatchEvent(new CustomEvent('focus'));
  }
  handleChange(event) {
    event.stopPropagation();
    this.dispatchCommitEvent();
    this.dispatchChangeEvent();
  }
  handleColorChange(event) {
    const selectedColor = event.detail.color;
    if (selectedColor !== this.inputElement.value) {
      this.setInputValue(selectedColor);
      this._value = selectedColor;
      this.focus();
      this.dispatchChangeEventWithDetail({
        value: selectedColor
      });
      this.dispatchCommitEvent();
    }
    this.template.querySelector('lightning-primitive-colorpicker-button').focus();
  }
  handleInput(event) {
    event.stopPropagation();
    this.dispatchChangeEvent();
  }
  dispatchChangeEventWithDetail(detail) {
    this.dispatchEvent(new CustomEvent('change', {
      composed: true,
      bubbles: true,
      detail
    }));
  }
  dispatchChangeEvent() {
    const detail = {
      value: this.inputElement.value
    };
    this._value = detail.value;
    this.dispatchChangeEventWithDetail(detail);
  }
  dispatchCommitEvent() {
    this.dispatchEvent(new CustomEvent('commit'));
  }
  setInputValue(value) {
    if (features.enableAssertContext260) {
      assertContext(this);
    }
    this.inputElement.value = value;
  }
  normalizeInput(value) {
    if (typeof value === 'number' || typeof value === 'string') {
      return String(value);
    }
    return '';
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningPrimitiveInputColor, {
  publicProps: {
    hasExternalLabel: {
      config: 0
    },
    required: {
      config: 0
    },
    accessKey: {
      config: 0
    },
    label: {
      config: 0
    },
    fieldLevelHelp: {
      config: 0
    },
    helptextAlternativeText: {
      config: 0
    },
    helpMessage: {
      config: 0
    },
    disabled: {
      config: 0
    },
    name: {
      config: 0
    },
    autocomplete: {
      config: 0
    },
    ariaLabel: {
      config: 0
    },
    ariaInvalid: {
      config: 0
    },
    ariaDisabled: {
      config: 0
    },
    ariaKeyShortcuts: {
      config: 0
    },
    placeholder: {
      config: 0
    },
    pattern: {
      config: 0
    },
    variant: {
      config: 0
    },
    value: {
      config: 3
    },
    inputElement: {
      config: 1
    },
    ariaDescribedByElements: {
      config: 1
    },
    ariaErrorMessageElement: {
      config: 1
    },
    isNativeShadow: {
      config: 1
    }
  },
  publicMethods: ["focus"],
  fields: ["_value", "rendered", "initialValueSet"]
});
const __lwc_component_class_internal = _registerComponent(LightningPrimitiveInputColor, {
  tmpl: _tmpl,
  sel: "lightning-primitive-input-color",
  apiVersion: 66
});
export default __lwc_component_class_internal;