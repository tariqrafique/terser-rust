import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./select.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import labelRequired from '@salesforce/label/LightningControl.required';
import labelHelpTextAlternativeText from '@salesforce/label/LightningInput.helptextAlternativeText';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet, formatLabel } from 'lightning/utils';
import { classListMutation, normalizeBoolean, reflectAttribute, isNativeComponent, valueSetter } from 'lightning/utilsPrivate';
import { privateContext } from 'lightning/utilsInternal';
import { FieldConstraintApi, InteractingState, isEmptyString, getErrorMessage, normalizeVariant, VARIANT } from 'lightning/inputUtils';
import AriaObserver from 'lightning/ariaObserver';
import { features } from 'lightning/features';
const {
  setContext,
  assertContext
} = privateContext;
const i18n = {
  required: labelRequired,
  helpTextAlternativeText: labelHelpTextAlternativeText
};
class LightningSelect extends LightningShadowBaseClass {
  constructor() {
    super();
    this.label = void 0;
    this.name = void 0;
    this.messageWhenValueMissing = void 0;
    this.accessKey = void 0;
    this.autocomplete = void 0;
    this._options = [];
    this._helpMessage = '';
    this._selectedValue = void 0;
    this._variant = void 0;
    this._required = false;
    this._disabled = false;
    this._multiple = false;
    this._fieldLevelHelp = void 0;
    this._size = void 0;
    this._ariaDescribedBy = '';
    this._ariaLabelledBy = '';
    this._helpMessageChanged = false;
    this.ariaObserver = null;
    this._isNativeShadow = void 0;
    this._connected = void 0;
    this._rendered = void 0;
    this.interactingState = void 0;
    this.customErrorMessage = void 0;
    this._constraintApi = void 0;
    setContext(this);
    this.ariaObserver = new AriaObserver(this);
    this._isNativeShadow = isNativeComponent(this);
  }
  connectedCallback() {
    assertContext(this);
    super.connectedCallback();
    if (!this.ariaObserver) {
      this.ariaObserver = new AriaObserver(this);
    }
    this._connected = true;
    this.classList.add('slds-form-element');
    this.updateClassList();
    this.interactingState = new InteractingState();
    this.interactingState.onleave(() => this.reportValidity());
  }
  renderedCallback() {
    assertContext(this);
    if (this.isConnected) {
      this.ariaObserver.sync(this._isNativeShadow);
    }
    if (!this._rendered) {
      this.connectAriaDescribedBy();
      this.connectAriaLabelledBy();
      this._rendered = true;
    }
    if (this.options && this._selectedValue !== undefined) {
      this.selectOptionsByValue(this._selectedValue);
    }
    if (this._helpMessageChanged) {
      this.connectAriaDescribedBy();
      this._helpMessageChanged = false;
    }
  }
  disconnectedCallback() {
    this._connected = false;
    if (this.ariaObserver && this.ariaObserver.disconnect) {
      this.ariaObserver.disconnect();
      this.ariaObserver = null;
    }
  }
  get computedAriaInvalid() {
    return !!this._helpMessage || undefined;
  }
  get fieldLevelHelp() {
    return this._fieldLevelHelp;
  }
  set fieldLevelHelp(value) {
    this._fieldLevelHelp = value;
  }
  get variant() {
    return this._variant || VARIANT.STANDARD;
  }
  set variant(value) {
    this._variant = normalizeVariant(value);
    this.updateClassList();
    reflectAttribute(this, 'variant', this._variant);
  }
  get multiple() {
    return this._multiple;
  }
  set multiple(value) {
    this._multiple = normalizeBoolean(value);
    reflectAttribute(this, 'multiple', this._multiple);
  }
  get size() {
    if (!this.multiple) {
      return null;
    }
    if (this._size === undefined) {
      return '4';
    }
    return this._size;
  }
  set size(newValue) {
    this._size = newValue;
  }
  get required() {
    return this._required;
  }
  set required(value) {
    this._required = normalizeBoolean(value);
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = normalizeBoolean(value);
  }
  get value() {
    return this._selectedValue;
  }
  set value(newValue) {
    this._selectedValue = newValue;
    if (this.isConnected) {
      this.selectOptionsByValue(newValue);
    }
  }
  get options() {
    return this._options;
  }
  set options(newValue) {
    assertContext(this);
    this._options = newValue;
    if (this.isConnected && newValue) {
      this.selectOptionsByValue(this._selectedValue);
    }
  }
  get ariaDescribedBy() {
    return this._ariaDescribedBy;
  }
  set ariaDescribedBy(elements) {
    this._ariaDescribedBy = elements;
    this.connectAriaDescribedBy();
  }
  get ariaLabelledBy() {
    return this._ariaLabelledBy;
  }
  set ariaLabelledBy(references) {
    this._ariaLabelledBy = references;
    this.connectAriaLabelledBy();
  }
  updateClassList() {
    classListMutation(this.classList, {
      'slds-form-element_stacked': this.variant === VARIANT.LABEL_STACKED,
      'slds-form-element_horizontal': this.variant === VARIANT.LABEL_INLINE
    });
  }
  focus() {
    if (this.isConnected) {
      this.selectElement.focus();
    }
  }
  blur() {
    if (this.isConnected) {
      this.selectElement.blur();
    }
  }
  get validity() {
    return this._constraint.validity;
  }
  checkValidity() {
    return this._constraint.checkValidity();
  }
  setCustomValidity(message) {
    this._constraint.setCustomValidity(message);
    this.customErrorMessage = message;
  }
  reportValidity() {
    return this._constraint.reportValidity(message => {
      this._helpMessage = message;
      this._helpMessageChanged = true;
    });
  }
  showHelpMessageIfInvalid() {
    const validity = this.validity;
    if (validity.valid) {
      this._helpMessage = '';
      this.classList.remove('slds-has-error');
    } else {
      this.classList.add('slds-has-error');
      this._helpMessage = getErrorMessage(validity, {
        valueMissing: this.messageWhenValueMissing,
        customError: this.customErrorMessage
      });
      this._helpMessageChanged = true;
    }
  }
  get i18n() {
    return i18n;
  }
  get selectElement() {
    return this.template.querySelector('select');
  }
  get isLabelHidden() {
    return this.variant === VARIANT.LABEL_HIDDEN;
  }
  get computedLabelClass() {
    return classSet('slds-form-element__label').add({
      'slds-assistive-text': this.isLabelHidden
    }).toString();
  }
  get _constraint() {
    if (!this._constraintApi) {
      this._constraintApi = new FieldConstraintApi(() => this, {
        valueMissing: () => {
          const isMultipleAndNoValue = this.multiple && (!this.value || this.value.length === 0);
          return !this.disabled && this.required && (isEmptyString(this.value) || isMultipleAndNoValue);
        }
      });
    }
    return this._constraintApi;
  }
  handleChange(event) {
    event.preventDefault();
    event.stopPropagation();
    this._selectedValue = this.getSelectedOptionValues();
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: {
        value: this._selectedValue
      }
    }));
  }
  handleFocus() {
    this.interactingState.enter();
    this.dispatchEvent(new CustomEvent('focus'));
  }
  handleBlur() {
    this.interactingState.leave();
    this.dispatchEvent(new CustomEvent('blur'));
  }
  connectAriaDescribedBy() {
    if (!import.meta.env.SSR) {
      this.ariaObserver.connect({
        targetSelector: 'select',
        attribute: 'aria-describedby',
        relatedNodeIds: this.ariaDescribedBy,
        relatedNodes: this.template.querySelector('[data-help-message]')
      });
    }
  }
  connectAriaLabelledBy() {
    if (!import.meta.env.SSR) {
      this.ariaObserver.connect({
        targetSelector: 'select',
        attribute: 'aria-labelledby',
        relatedNodeIds: this.ariaLabelledBy
      });
    }
  }
  selectOptionsByValue(optionValue) {
    if (this.multiple) {
      if (Array.isArray(optionValue)) {
        const options = this.template.querySelectorAll('option');
        options.forEach(option => {
          option.selected = optionValue.includes(option.value);
        });
      }
    } else {
      valueSetter(this.selectElement, [HTMLSelectElement], optionValue);
    }
  }
  getSelectedOptionValues() {
    if (this.multiple) {
      const options = this.template.querySelectorAll('option');
      return Array.prototype.reduce.call(options, (selectedValues, option) => {
        if (option.selected) {
          selectedValues.push(option.value);
        }
        return selectedValues;
      }, []);
    }
    return this.selectElement.value;
  }
  get helptextAlternativeText() {
    return formatLabel(i18n.helpTextAlternativeText, this.label);
  }
  get isFixStaticErrorDOMEnabled() {
    return features.enableSelectStaticErrDom;
  }
  /*LWC compiler v9.5.3*/
}
LightningSelect.delegatesFocus = true;
LightningSelect.validationOptOut = ['class'];
_registerDecorators(LightningSelect, {
  publicProps: {
    label: {
      config: 0
    },
    name: {
      config: 0
    },
    messageWhenValueMissing: {
      config: 0
    },
    accessKey: {
      config: 0
    },
    autocomplete: {
      config: 0
    },
    fieldLevelHelp: {
      config: 3
    },
    variant: {
      config: 3
    },
    multiple: {
      config: 3
    },
    size: {
      config: 3
    },
    required: {
      config: 3
    },
    disabled: {
      config: 3
    },
    value: {
      config: 3
    },
    options: {
      config: 3
    },
    ariaDescribedBy: {
      config: 3
    },
    ariaLabelledBy: {
      config: 3
    },
    validity: {
      config: 1
    }
  },
  publicMethods: ["focus", "blur", "checkValidity", "setCustomValidity", "reportValidity", "showHelpMessageIfInvalid"],
  track: {
    _options: 1,
    _selectedValue: 1,
    _variant: 1,
    _fieldLevelHelp: 1,
    _size: 1
  },
  fields: ["_helpMessage", "_required", "_disabled", "_multiple", "_ariaDescribedBy", "_ariaLabelledBy", "_helpMessageChanged", "ariaObserver", "_isNativeShadow", "_connected", "_rendered", "interactingState", "customErrorMessage", "_constraintApi"]
});
const __lwc_component_class_internal = _registerComponent(LightningSelect, {
  tmpl: _tmpl,
  sel: "lightning-select",
  apiVersion: 66
});
export default __lwc_component_class_internal;