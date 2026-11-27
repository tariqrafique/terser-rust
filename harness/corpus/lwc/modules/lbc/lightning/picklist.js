import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./picklist.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import labelNoneLabel from '@salesforce/label/LightningPicklist.noneLabel';
import labelAvailable from '@salesforce/label/LightningPicklist.available';
import labelChosen from '@salesforce/label/LightningPicklist.chosen';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { normalizeBoolean, arraysEqual } from 'lightning/utilsPrivate';
import formFactor from '@salesforce/client/formFactor';
const i18n = {
  noneLabel: labelNoneLabel,
  available: labelAvailable,
  chosen: labelChosen
};
const PROGRAMMATIC_CHANGE = true;
class LightningPicklist extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this._internalValue = void 0;
    this._picklistValue = void 0;
    this._options = void 0;
    this._required = false;
    this._disabled = false;
    this._readOnly = false;
    this._size = 4;
    this._showActivityIndicator = false;
    this._fieldLevelHelp = void 0;
    this.label = void 0;
    this.name = void 0;
    this.placeholder = void 0;
    this.variant = void 0;
    this.autocomplete = 'off';
    this.suppressNoneOption = void 0;
  }
  set fieldLevelHelp(value) {
    this._fieldLevelHelp = value;
  }
  get fieldLevelHelp() {
    return this._fieldLevelHelp;
  }
  set value(newValue) {
    this._picklistValue = newValue;
    if (this.connected) {
      this.updateInternalValue(newValue, PROGRAMMATIC_CHANGE);
    }
  }
  get value() {
    return this._picklistValue;
  }
  set size(value) {
    this._size = this.normalizeSize(value);
  }
  get size() {
    return this._size;
  }
  set options(newOptions) {
    this._options = newOptions;
    if (this.connected) {
      this.updatePicklistOptions(newOptions);
    }
  }
  get options() {
    return this._options;
  }
  set multiple(value) {
    this._multiple = normalizeBoolean(value);
  }
  get multiple() {
    return this._multiple || false;
  }
  set required(value) {
    this._required = normalizeBoolean(value);
    this._requiredButDisabled = false;
  }
  get required() {
    return this._required;
  }
  set disabled(value) {
    this._disabled = normalizeBoolean(value);
    this._externalDisabled = value;
  }
  get disabled() {
    return this._disabled;
  }
  get readOnly() {
    return this._readOnly;
  }
  set readOnly(value) {
    this._readOnly = normalizeBoolean(value);
  }
  set showActivityIndicator(value) {
    this._showActivityIndicator = normalizeBoolean(value);
  }
  get showActivityIndicator() {
    return this._showActivityIndicator || false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.updatePicklistOptions(this._options, true);
    this.connected = true;
  }
  disconnectedCallback() {
    this.connected = false;
  }
  focus() {
    if (this.connected) {
      this.getElement.focus();
    }
  }
  blur() {
    if (this.connected) {
      this.getElement.blur();
    }
  }
  get validity() {
    if (this.connected) {
      return this.getElement.validity;
    }
    return null;
  }
  checkValidity() {
    if (this.connected) {
      return this.validity.valid;
    }
    return false;
  }
  setCustomValidity(message) {
    if (this.connected) {
      this.getElement.setCustomValidity(message);
    }
  }
  reportValidity() {
    if (this.connected) {
      return this.getElement.reportValidity();
    }
    return false;
  }
  showHelpMessageIfInvalid() {
    if (this.connected) {
      this.getElement.showHelpMessageIfInvalid();
    }
  }
  get i18n() {
    return i18n;
  }
  get internalValue() {
    return this._internalValue !== undefined ? this._internalValue : this.getInternalValue(this._picklistValue);
  }
  updateInternalValue(value, isProgrammatic) {
    const oldInternalValue = this.internalValue;
    this._internalValue = this.getInternalValue(value);
    if (!this.isSameValue(value, oldInternalValue)) {
      this._picklistValue = this.getPicklistValue(value);
      this.dispatchChangeEvent(isProgrammatic);
    }
  }
  get getElement() {
    return !import.meta.env.SSR ? this.template.querySelector('lightning-combobox,lightning-dual-listbox,lightning-select') : null;
  }
  get disableReordering() {
    return true;
  }
  get isDesktop() {
    return formFactor === 'Large';
  }
  updatePicklistOptions(options, addMissingValues) {
    const newOptions = options ? [...options] : [];
    const existingInternalValue = this.internalValue;
    if (addMissingValues) {
      this.addMissingValuesToOptions(newOptions, existingInternalValue);
    }
    this.maybeAddNoneOption(newOptions);
    this._options = newOptions;
    this.updateDisabledState(options);
    this.updateRequiredState(options);
    const value = this.getValueToSelect(this.options, existingInternalValue);
    this.updateInternalValue(value, PROGRAMMATIC_CHANGE);
  }
  isSameValue(value1, value2) {
    if (Array.isArray(value1) && Array.isArray(value2)) {
      const a = [...value1].sort();
      const b = [...value2].sort();
      return arraysEqual(a, b);
    }
    return value1 === value2;
  }
  handleChange(event) {
    event.preventDefault();
    event.stopPropagation();
    const newValue = event.target.value;
    this.updateInternalValue(newValue);
  }
  handleFocus() {
    this.dispatchEvent(new CustomEvent('focus'));
  }
  handleBlur() {
    this.dispatchEvent(new CustomEvent('blur'));
  }
  handleOpen() {
    this.dispatchEvent(new CustomEvent('open'));
  }
  maybeAddNoneOption(options) {
    if (this.shouldAddNoneOption(options.length)) {
      this.addOption(options, this.i18n.noneLabel, '');
    }
  }
  addOption(options, label, value) {
    options.unshift({
      label,
      value
    });
  }
  shouldDisablePicklist(options) {
    if (!options || options.length === 0) {
      return true;
    }
    return false;
  }
  shouldAddNoneOption(numberOfOptions) {
    if (this.multiple) {
      return false;
    }
    const isRequiredPicklist = this.required || this._requiredButDisabled;
    if (this.suppressNoneOption || isRequiredPicklist && numberOfOptions === 1) {
      return false;
    }
    return true;
  }
  updateDisabledState(options) {
    this._disabled = this._externalDisabled !== undefined ? normalizeBoolean(this._externalDisabled) : this.shouldDisablePicklist(options);
  }
  updateRequiredState(options) {
    const shouldDisable = this.shouldDisablePicklist(options);
    if (shouldDisable) {
      if (this._required) {
        this._required = false;
        this._requiredButDisabled = true;
      }
      if (this.connected && this.validity.valueMissing) {
        requestAnimationFrame(() => {
          this.showHelpMessageIfInvalid();
        });
      }
    } else if (this._requiredButDisabled) {
      this._requiredButDisabled = false;
      this._required = true;
    }
  }
  getValueToSelect(options, existingValue) {
    if (!options || options.length === 0) {
      return this.multiple ? [] : '';
    }
    if (this.isValueInOptions(existingValue, options)) {
      return existingValue;
    }
    if (this.multiple) {
      return [];
    }
    if (this.shouldAddNoneOption([...options].length)) {
      return '';
    }
    return options[0].value;
  }
  isValueInOptions(value, options) {
    if (!options || options.length === 0) {
      return false;
    }
    const valueIsInOptions = valueToCheck => options.some(option => {
      return option.value === valueToCheck;
    });
    let valueExists = false;
    if (Array.isArray(value)) {
      valueExists = value.every(valueToCheck => {
        return valueIsInOptions(valueToCheck);
      });
    } else {
      valueExists = valueIsInOptions(value);
    }
    return valueExists;
  }
  addMissingValuesToOptions(newOptions, value) {
    if (!value || Array.isArray(value) && value.length === 0) {
      return;
    }
    const valueIsInOptions = valueToCheck => {
      return newOptions.some(option => {
        return option.value === valueToCheck;
      });
    };
    const maybeAddOption = valueToCheck => {
      if (!valueIsInOptions(valueToCheck)) {
        this.addOption(newOptions, valueToCheck, valueToCheck);
      }
    };
    if (Array.isArray(value)) {
      value.forEach(valueToCheck => {
        maybeAddOption(valueToCheck);
      });
    } else {
      maybeAddOption(value);
    }
  }
  dispatchChangeEvent(isProgrammatic) {
    const detail = {
      value: this._picklistValue
    };
    if (isProgrammatic) {
      detail.programmatic = true;
    }
    if (!import.meta.env.SSR) {
      this.dispatchEvent(new CustomEvent('change', {
        composed: true,
        bubbles: true,
        detail
      }));
    }
  }
  getPicklistValue(value) {
    if (this.multiple && Array.isArray(value)) {
      return value.join(';');
    }
    return value;
  }
  getInternalValue(value) {
    if (this.multiple) {
      if (Array.isArray(value)) {
        return value;
      }
      return typeof value === 'string' && value !== '' && value.split(';') || [];
    }
    if (value == null) {
      return '';
    }
    return value;
  }
  normalizeSize(value) {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue) || parsedValue < 3 || parsedValue > 10) {
      return 4;
    }
    return parsedValue;
  }
  /*LWC compiler v9.5.3*/
}
LightningPicklist.delegatesFocus = true;
_registerDecorators(LightningPicklist, {
  publicProps: {
    label: {
      config: 0
    },
    name: {
      config: 0
    },
    placeholder: {
      config: 0
    },
    variant: {
      config: 0
    },
    autocomplete: {
      config: 0
    },
    suppressNoneOption: {
      config: 0
    },
    fieldLevelHelp: {
      config: 3
    },
    value: {
      config: 3
    },
    size: {
      config: 3
    },
    options: {
      config: 3
    },
    multiple: {
      config: 3
    },
    required: {
      config: 3
    },
    disabled: {
      config: 3
    },
    readOnly: {
      config: 3
    },
    showActivityIndicator: {
      config: 3
    },
    validity: {
      config: 1
    }
  },
  publicMethods: ["focus", "blur", "checkValidity", "setCustomValidity", "reportValidity", "showHelpMessageIfInvalid"],
  fields: ["_internalValue", "_picklistValue", "_options", "_required", "_disabled", "_readOnly", "_size", "_showActivityIndicator", "_fieldLevelHelp"]
});
const __lwc_component_class_internal = _registerComponent(LightningPicklist, {
  tmpl: _tmpl,
  sel: "lightning-picklist",
  apiVersion: 66
});
export default __lwc_component_class_internal;