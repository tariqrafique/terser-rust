import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./radioGroup.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import labelRequired from '@salesforce/label/LightningControl.required';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { normalizeBoolean, synchronizeAttrs, getRealDOMId, normalizeString as normalize, classListMutation, reflectAttribute } from 'lightning/utilsPrivate';
import { isEmptyString, InteractingState, FieldConstraintApi, generateUniqueId, normalizeVariant, VARIANT } from 'lightning/inputUtils';
import { classSet } from 'lightning/utils';
import { privateContext } from 'lightning/utilsInternal';
import { features } from 'lightning/features';
const {
  setContext,
  assertContext
} = privateContext;
const i18n = {
  required: labelRequired
};
class LightningRadioGroup extends LightningShadowBaseClass {
  synchronizeA11y() {
    const inputs = this.template.querySelectorAll('input');
    Array.prototype.slice.call(inputs).forEach(input => {
      synchronizeAttrs(input, {
        'aria-describedby': this.computedUniqueHelpElementId
      });
    });
  }
  constructor() {
    super();
    this._variant = void 0;
    this.type = 'radio';
    this.label = void 0;
    this.options = void 0;
    this.messageWhenValueMissing = void 0;
    this.name = generateUniqueId();
    this._required = false;
    this._disabled = false;
    this._helpMessage = void 0;
    this._value = void 0;
    this.interactingState = void 0;
    this._constraintApi = void 0;
    setContext(this);
  }
  connectedCallback() {
    assertContext(this);
    super.connectedCallback();
    this.classList.add('slds-form-element');
    this.updateClassList();
    this.interactingState = new InteractingState();
    this.interactingState.onleave(this.showHelpMessageIfInvalid.bind(this));
  }
  updateClassList() {
    classListMutation(this.classList, {
      'slds-form-element_stacked': this.variant === VARIANT.LABEL_STACKED,
      'slds-form-element_horizontal': this.variant === VARIANT.LABEL_INLINE
    });
  }
  get fieldsetElement() {
    return this.template.querySelector('fieldset');
  }
  get ariaInvalid() {
    return this._helpMessage ? true : undefined;
  }
  renderedCallback() {
    this.synchronizeA11y();
    synchronizeAttrs(this.fieldsetElement, {
      'aria-describedby': getRealDOMId(this.template.querySelector('[data-help-message]'))
    });
    reflectAttribute(this, 'type', this.type);
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
  }
  get radioButtonElements() {
    return this.template.querySelectorAll('input');
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = normalizeBoolean(value);
    reflectAttribute(this, 'disabled', this._disabled);
  }
  get required() {
    return this._required;
  }
  set required(value) {
    this._required = normalizeBoolean(value);
  }
  get variant() {
    return this._variant || VARIANT.STANDARD;
  }
  set variant(value) {
    this._variant = normalizeVariant(value);
    this.updateClassList();
    reflectAttribute(this, 'variant', this._variant);
  }
  get i18n() {
    return i18n;
  }
  get transformedOptions() {
    const {
      options,
      value
    } = this;
    if (Array.isArray(options)) {
      return options.map((option, index) => ({
        label: option.label,
        value: option.value,
        isChecked: value === option.value,
        indexId: `radio-${index}`
      }));
    }
    return [];
  }
  get isRadio() {
    return this.normalizedType === 'radio';
  }
  get isButton() {
    return this.normalizedType === 'button';
  }
  get normalizedType() {
    return normalize(this.type, {
      fallbackValue: 'radio',
      validValues: ['radio', 'button']
    });
  }
  get validity() {
    return this._constraint.validity;
  }
  checkValidity() {
    return this._constraint.checkValidity();
  }
  reportValidity() {
    return this._constraint.reportValidity(message => {
      this._helpMessage = message;
    });
  }
  setCustomValidity(message) {
    this._constraint.setCustomValidity(message);
  }
  showHelpMessageIfInvalid() {
    this.reportValidity();
  }
  focus() {
    const firstRadio = this.template.querySelector('input');
    if (firstRadio) {
      firstRadio.focus();
    }
  }
  handleFocus() {
    this.interactingState.enter();
    this.dispatchEvent(new CustomEvent('focus'));
  }
  handleBlur() {
    this.interactingState.leave();
    this.dispatchEvent(new CustomEvent('blur'));
  }
  handleChange(event) {
    event.stopPropagation();
    this.interactingState.interacting();
    const value = Array.from(this.radioButtonElements).filter(radioButton => radioButton.checked).map(radioButton => radioButton.value).toString();
    this._value = value;
    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        value
      },
      composed: true,
      bubbles: true,
      cancelable: true
    }));
    this.reportValidity();
  }
  get computedUniqueHelpElementId() {
    return getRealDOMId(this.template.querySelector('[data-help-message]'));
  }
  get _constraint() {
    if (!this._constraintApi) {
      this._constraintApi = new FieldConstraintApi(() => this, {
        valueMissing: () => !this.disabled && this.required && isEmptyString(this.value)
      });
    }
    return this._constraintApi;
  }
  get computedLegendClass() {
    const classnames = classSet('slds-form-element__legend slds-form-element__label');
    return classnames.add({
      'slds-assistive-text': this.variant === VARIANT.LABEL_HIDDEN
    }).toString();
  }
  get isFixStaticErrorDOMEnabled() {
    return features.enableRadioGroupStaticErrDom;
  }
  /*LWC compiler v9.5.3*/
}
LightningRadioGroup.delegatesFocus = true;
LightningRadioGroup.validationOptOut = ['class'];
_registerDecorators(LightningRadioGroup, {
  publicProps: {
    type: {
      config: 0
    },
    label: {
      config: 0
    },
    options: {
      config: 0
    },
    messageWhenValueMissing: {
      config: 0
    },
    name: {
      config: 0
    },
    value: {
      config: 3
    },
    disabled: {
      config: 3
    },
    required: {
      config: 3
    },
    variant: {
      config: 3
    },
    validity: {
      config: 1
    }
  },
  publicMethods: ["checkValidity", "reportValidity", "setCustomValidity", "showHelpMessageIfInvalid", "focus"],
  track: {
    _required: 1,
    _disabled: 1,
    _helpMessage: 1,
    _value: 1
  },
  fields: ["_variant", "interactingState", "_constraintApi"]
});
const __lwc_component_class_internal = _registerComponent(LightningRadioGroup, {
  tmpl: _tmpl,
  sel: "lightning-radio-group",
  apiVersion: 66
});
export default __lwc_component_class_internal;