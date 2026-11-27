import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./slider.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet } from 'lightning/utils';
import { assert, normalizeBoolean, normalizeNumber, normalizeString as normalize } from 'lightning/utilsPrivate';
import { getDecimalPlaces } from 'lightning/numberUtils';
import { numberFormat } from 'lightning/internationalizationLibrary';
import { InteractingState, normalizeVariant, FieldConstraintApiWithProxyInput, VARIANT } from 'lightning/inputUtils';
import { privateContext } from 'lightning/utilsInternal';
import { features } from 'lightning/features';
const defaultMin = 0;
const defaultMax = 100;
const defaultStep = 1;
const {
  setContext,
  assertContext
} = privateContext;
class LightningSlider extends LightningShadowBaseClass {
  constructor() {
    super();
    this.size = void 0;
    this.type = 'horizontal';
    this.label = void 0;
    this.messageWhenRangeOverflow = void 0;
    this.messageWhenRangeUnderflow = void 0;
    this.messageWhenStepMismatch = void 0;
    this.messageWhenValueMissing = void 0;
    this.messageWhenTooLong = void 0;
    this.messageWhenBadInput = void 0;
    this.messageWhenPatternMismatch = void 0;
    this.messageWhenTypeMismatch = void 0;
    this._helpMessage = void 0;
    this._min = defaultMin;
    this._max = defaultMax;
    this._step = defaultStep;
    this._variant = void 0;
    this._value = void 0;
    this._disabled = false;
    this.interactingState = new InteractingState();
    this.interactingState.onleave(() => this.showHelpMessageIfInvalid());
    setContext(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this.classList.add('slds-form-element');
    this.setAttribute('data-handles-touch', true);
    assert(this.label, `<lightning-slider> Missing required "label" attribute.`);
  }
  get min() {
    return this._min;
  }
  set min(value) {
    this._min = value || defaultMin;
    this._updateProxyInputAttributes('min');
  }
  get max() {
    return this._max;
  }
  set max(value) {
    if (features.enableSliderMax0Value) {
      this._max = normalizeNumber(value, {
        fallbackValue: defaultMax
      });
    } else {
      this._max = value || defaultMax;
    }
    this._updateProxyInputAttributes('max');
  }
  get step() {
    return this._step;
  }
  set step(value) {
    this._step = value || defaultStep;
    this._updateProxyInputAttributes('step');
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = normalizeBoolean(value);
    this._updateProxyInputAttributes('disabled');
  }
  get variant() {
    return this._variant || VARIANT.STANDARD;
  }
  set variant(value) {
    this._variant = normalizeVariant(value);
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
    this._updateProxyInputAttributes('value');
  }
  focus() {
    this.inputElement.focus();
  }
  blur() {
    this.inputElement.blur();
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
  get computedValue() {
    return Number.isFinite(parseFloat(this._value)) ? this._value : null;
  }
  get formattedValue() {
    assertContext(this);
    if (!Number.isFinite(parseFloat(this._value))) {
      return '';
    }
    const decimalPlaces = getDecimalPlaces(this._step);
    const formatConfig = {
      style: 'decimal'
    };
    if (decimalPlaces > 0) {
      formatConfig.minimumFractionDigits = decimalPlaces;
    }
    return numberFormat(formatConfig).format(this.computedValue);
  }
  get computedClass() {
    const {
      normalizedSize,
      normalizedType
    } = this;
    const classes = classSet('slds-slider');
    if (normalizedType === 'vertical') {
      classes.add('slds-slider_vertical');
    }
    if (normalizedSize) {
      classes.add(`slds-size_${normalizedSize}`);
    }
    return classes.toString();
  }
  get normalizedSize() {
    return normalize(this.size, {
      fallbackValue: '',
      validValues: ['x-small', 'small', 'medium', 'large']
    });
  }
  handleChange(event) {
    event.stopPropagation();
    const shouldIgnoreChangeEvent = this._value === event.target.value;
    if (shouldIgnoreChangeEvent) {
      return;
    }
    this.handleInput(event);
  }
  get normalizedType() {
    return normalize(this.type, {
      fallbackValue: 'horizontal',
      validValues: ['horizontal', 'vertical']
    });
  }
  get isLabelHidden() {
    return this.variant === VARIANT.LABEL_HIDDEN;
  }
  get computedLabelClass() {
    const classes = classSet();
    classes.add(this.isLabelHidden ? 'slds-assistive-text' : 'slds-slider-label__label');
    return classes.toString();
  }
  handleInput(event) {
    this.interactingState.interacting();
    event.stopPropagation();
    const newValue = event.target.value;
    this._value = newValue;
    this._updateProxyInputAttributes('value');
    const customEvent = this.createCustomChangeEvent(newValue);
    this.dispatchEvent(customEvent);
  }
  createCustomChangeEvent(value) {
    const detail = {
      value
    };
    return new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail
    });
  }
  handleFocus() {
    this.interactingState.enter();
    this.dispatchEvent(new CustomEvent('focus'));
  }
  handleBlur() {
    this.interactingState.leave();
    this.dispatchEvent(new CustomEvent('blur'));
  }
  handleTouchMove(event) {
    event.stopPropagation();
  }
  get inputElement() {
    return !import.meta.env.SSR ? this.template.querySelector('input') : null;
  }
  get computedAriaDescribedBy() {
    return this._helpMessage ? this.computedUniqueHelpElementId : null;
  }
  _updateProxyInputAttributes(attributes) {
    if (this._constraintApiProxyInputUpdater) {
      this._constraintApiProxyInputUpdater(attributes);
    }
  }
  get _constraint() {
    if (!this._constraintApi) {
      this._constraintApi = new FieldConstraintApiWithProxyInput(() => this);
      this._constraintApiProxyInputUpdater = this._constraint.setInputAttributes({
        type: () => 'range',
        value: () => this.value,
        max: () => this.max,
        min: () => this.min,
        step: () => this.step,
        disabled: () => this.disabled
      });
    }
    return this._constraintApi;
  }
  /*LWC compiler v9.5.3*/
}
LightningSlider.validationOptOut = ['class'];
_registerDecorators(LightningSlider, {
  publicProps: {
    size: {
      config: 0
    },
    type: {
      config: 0
    },
    label: {
      config: 0
    },
    messageWhenRangeOverflow: {
      config: 0
    },
    messageWhenRangeUnderflow: {
      config: 0
    },
    messageWhenStepMismatch: {
      config: 0
    },
    messageWhenValueMissing: {
      config: 0
    },
    messageWhenTooLong: {
      config: 0
    },
    messageWhenBadInput: {
      config: 0
    },
    messageWhenPatternMismatch: {
      config: 0
    },
    messageWhenTypeMismatch: {
      config: 0
    },
    min: {
      config: 3
    },
    max: {
      config: 3
    },
    step: {
      config: 3
    },
    disabled: {
      config: 3
    },
    variant: {
      config: 3
    },
    value: {
      config: 3
    },
    validity: {
      config: 1
    }
  },
  publicMethods: ["focus", "blur", "checkValidity", "reportValidity", "setCustomValidity", "showHelpMessageIfInvalid"],
  track: {
    _helpMessage: 1,
    _min: 1,
    _max: 1,
    _step: 1,
    _variant: 1,
    _value: 1,
    _disabled: 1
  }
});
const __lwc_component_class_internal = _registerComponent(LightningSlider, {
  tmpl: _tmpl,
  sel: "lightning-slider",
  apiVersion: 66
});
export default __lwc_component_class_internal;
LightningSlider.interopMap = {
  exposeNativeEvent: {
    change: true,
    focus: true,
    blur: true
  }
};