import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveInputCheckboxButton.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import { classSetToString, reflectAttribute, normalizeBoolean, isNativeComponent } from 'lightning/utilsPrivate';
import { privateContext } from 'lightning/utilsInternal';
import { features } from 'lightning/features';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import standardTemplate from './primitiveInputCheckboxButton.html';
import oldTemplate from './primitiveInputCheckboxButtonOld.html';
const {
  setContext,
  assertContext
} = privateContext;
class LightningPrimitiveInputColor extends LightningShadowBaseClass {
  constructor() {
    super();
    this.ariaLabel = void 0;
    this.ariaInvalid = void 0;
    this.accessKey = void 0;
    this.name = void 0;
    this.required = void 0;
    this.readOnly = void 0;
    this.label = void 0;
    this.ariaKeyShortcuts = void 0;
    this.ariaDisabled = void 0;
    this.ariaRoleDescription = void 0;
    this._checked = false;
    this._disabled = false;
    this._helpMessage = '';
    this.rendered = false;
    this.initialValueSet = false;
    if (features.enableAssertContext260) {
      setContext(this);
    }
  }
  get checked() {
    if (this.initialValueSet) {
      return this.inputElement.checked;
    }
    return this._checked;
  }
  set checked(value) {
    this._checked = normalizeBoolean(value);
    if (this.rendered) {
      this.inputElement.checked = this._checked;
    }
    reflectAttribute(this, 'checked', this.checked);
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = normalizeBoolean(value);
    reflectAttribute(this, 'disabled', this.disabled);
  }
  get helpMessage() {
    return this._helpMessage;
  }
  set helpMessage(message) {
    this._helpMessage = message;
    reflectAttribute(this, 'invalid', !!message);
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
  get computedCheckboxButtonClass() {
    return classSetToString({
      'slds-checkbox-button': true,
      'slds-checkbox-button_is-checked': this.checked,
      'slds-checkbox-button_is-disabled': this.disabled
    });
  }
  get iconName() {
    return this._checked ? 'utility:check' : 'utility:add';
  }
  connectedCallback() {
    super.connectedCallback();
    this._isNativeShadow = isNativeComponent(this);
  }
  disconnectedCallback() {
    this.cachedInputElement = undefined;
    this.initialValueSet = false;
    this.rendered = false;
  }
  renderedCallback() {
    this.rendered = true;
    if (!this.initialValueSet) {
      this.inputElement.checked = this._checked;
      this.initialValueSet = true;
    }
  }
  render() {
    return features.enableUpdatedCheckboxButtonBlueprint ? standardTemplate : oldTemplate;
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
  handleClick() {
    if (this.template.activeElement === null) {
      this.template.querySelector("[type='checkbox']").focus();
    }
  }
  dispatchChangeEventWithDetail(detail) {
    this.dispatchEvent(new CustomEvent('change', {
      composed: true,
      detail
    }));
  }
  dispatchChangeEvent() {
    const detail = {};
    this._checked = this.inputElement.checked;
    reflectAttribute(this, 'checked', this._checked);
    detail.checked = this._checked;
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
    ariaLabel: {
      config: 0
    },
    ariaInvalid: {
      config: 0
    },
    accessKey: {
      config: 0
    },
    name: {
      config: 0
    },
    required: {
      config: 0
    },
    readOnly: {
      config: 0
    },
    label: {
      config: 0
    },
    ariaKeyShortcuts: {
      config: 0
    },
    ariaDisabled: {
      config: 0
    },
    ariaRoleDescription: {
      config: 0
    },
    checked: {
      config: 3
    },
    disabled: {
      config: 3
    },
    helpMessage: {
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
  fields: ["_checked", "_disabled", "_helpMessage", "rendered", "initialValueSet"]
});
const __lwc_component_class_internal = _registerComponent(LightningPrimitiveInputColor, {
  tmpl: _tmpl,
  sel: "lightning-primitive-input-checkbox-button",
  apiVersion: 66
});
export default __lwc_component_class_internal;