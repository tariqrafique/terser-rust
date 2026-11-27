import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./combobox.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import labelRequired from '@salesforce/label/c.lightning_LightningControl_required';
import labelPlaceholder from '@salesforce/label/c.lightning_LightningCombobox_placeholder';
import { LightningElement } from 'lwc';
import { classSet } from 'c/utils';
import { normalizeBoolean, normalizeArray, synchronizeAttrs, classListMutation } from 'c/utilsPrivate';
import { isEmptyString, InteractingState, FieldConstraintApi, normalizeVariant, VARIANT } from 'c/inputUtils';
const i18n = {
  required: labelRequired,
  placeholder: labelPlaceholder
};
class cCombobox extends LightningElement {
  constructor(...args) {
    super(...args);
    this._ariaLabelledBy = '';
    this._ariaDescribedBy = '';
    this._fieldLevelHelp = '';
    this._selectedLabel = '';
    this._disabled = false;
    this._readOnly = false;
    this._spinnerActive = false;
    this._required = false;
    this.label = void 0;
    this.dropdownAlignment = 'left';
    this.placeholder = i18n.placeholder;
    this.messageWhenValueMissing = void 0;
    this.name = void 0;
    this._items = [];
    this._variant = void 0;
    this._helpMessage = void 0;
    this._labelForId = void 0;
  }
  renderedCallback() {
    this.synchronizeA11y();
  }
  connectedCallback() {
    this.classList.add('slds-form-element');
    this.updateClassList();
    this.interactingState = new InteractingState();
    this.interactingState.onleave(() => this.showHelpMessageIfInvalid());
    this.connected = true;
    this._items = this.generateItems(this.options);
    if (this.options && this.selectedValue !== undefined) {
      this.updateSelectedOptions();
    }
  }
  updateClassList() {
    classListMutation(this.classList, {
      'slds-form-element_stacked': this.variant === VARIANT.LABEL_STACKED,
      'slds-form-element_horizontal': this.variant === VARIANT.LABEL_INLINE
    });
  }
  disconnectedCallback() {
    this.connected = false;
  }
  get ariaLabelledBy() {
    return this._ariaLabelledBy;
  }
  set ariaLabelledBy(labelledBy) {
    this._ariaLabelledBy = labelledBy;
  }
  get ariaDescribedBy() {
    return this._ariaDescribedBy;
  }
  set ariaDescribedBy(describedBy) {
    this._ariaDescribedBy = describedBy;
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
  }
  get value() {
    return this.selectedValue;
  }
  set value(newValue) {
    if (newValue !== this.selectedValue) {
      this.selectedValue = newValue;
      if (this.connected && this.options) {
        this.updateSelectedOptions();
      }
    }
  }
  get options() {
    return this._options || [];
  }
  set options(newValue) {
    this._options = normalizeArray(newValue);
    if (this.connected) {
      this._items = this.generateItems(this._options);
      this.updateSelectedOptions();
    }
  }
  get disabled() {
    return this._disabled || this._readOnly || false;
  }
  set disabled(value) {
    this._disabled = normalizeBoolean(value);
  }
  get readOnly() {
    return this.disabled;
  }
  set readOnly(value) {
    this._readOnly = normalizeBoolean(value);
  }
  get required() {
    return this._required;
  }
  set required(value) {
    this._required = normalizeBoolean(value);
  }
  get spinnerActive() {
    return this._spinnerActive;
  }
  set spinnerActive(value) {
    this._spinnerActive = normalizeBoolean(value);
  }
  focus() {
    if (this.connected) {
      this.getBaseComboboxElement().focus();
    }
  }
  blur() {
    if (this.connected) {
      this.getBaseComboboxElement().blur();
    }
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
  handleComboboxReady(e) {
    this._labelForId = e.detail.id;
  }
  synchronizeA11y() {
    synchronizeAttrs(this.template.querySelector('label'), {
      for: this._labelForId
    });
    const baseCombobox = this.template.querySelector('c-base-combobox');
    baseCombobox.inputLabelledByElement = this.ariaLabelledBy;
    baseCombobox.inputDescribedByElements = this.computedAriaDescribedBy;
  }
  get i18n() {
    return i18n;
  }
  get isLabelHidden() {
    return this.variant === VARIANT.LABEL_HIDDEN;
  }
  get computedLabelClass() {
    return classSet('slds-form-element__label').add({
      'slds-assistive-text': this.isLabelHidden
    }).toString();
  }
  get computedAriaDescribedBy() {
    const describedByElements = [];
    if (this._helpMessage) {
      const helpText = this.template.querySelector('[data-help-text]');
      describedByElements.push(helpText);
    }
    if (typeof this.ariaDescribedBy === 'string') {
      describedByElements.push(this.ariaDescribedBy);
    }
    return describedByElements;
  }
  handleSelect(event) {
    if (event.detail.value === this.selectedValue) {
      return;
    }
    this.selectedValue = event.detail.value;
    this.updateSelectedOptions();
    this.dispatchEvent(new CustomEvent('change', {
      composed: true,
      bubbles: true,
      detail: {
        value: this.selectedValue
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
  handleDropdownOpen() {
    this.dispatchEvent(new CustomEvent('open'));
  }
  updateSelectedOptions() {
    this.updateSelectedLabelFromValue(this.selectedValue);
    this.markOptionSelectedFromValue(this.selectedValue);
  }
  markOptionSelectedFromValue(value) {
    if (this._items) {
      const selectedItem = this._items.find(item => item.value === value);
      if (this._selectedItem) {
        this._selectedItem.checked = false;
        this._selectedItem.iconName = undefined;
        this._selectedItem.highlight = false;
      }
      this._selectedItem = selectedItem;
      if (selectedItem) {
        selectedItem.iconName = 'utility:check';
        this._selectedItem.highlight = true;
        this._selectedItem.checked = true;
      }
      this._items = this._items.slice();
    }
  }
  updateSelectedLabelFromValue(newValue) {
    this._selectedLabel = this.getOptionLabelByValue(newValue);
  }
  getOptionLabelByValue(value) {
    const foundOption = this.options.find(option => option.value === value);
    if (foundOption) {
      return foundOption.label;
    }
    return '';
  }
  generateItems(options) {
    return options.map(option => {
      const type = option.description ? 'option-card' : 'option-inline';
      return {
        type,
        text: option.label,
        subText: option.description,
        highlight: this.value === option.value,
        iconSize: 'x-small',
        value: option.value
      };
    });
  }
  getBaseComboboxElement() {
    return this.template.querySelector('c-base-combobox');
  }
  get _constraint() {
    if (!this._constraintApi) {
      this._constraintApi = new FieldConstraintApi(() => this, {
        valueMissing: () => !this.disabled && this.required && isEmptyString(this.selectedValue)
      });
    }
    return this._constraintApi;
  }
  /*LWC compiler v9.5.3*/
}
cCombobox.delegatesFocus = true;
_registerDecorators(cCombobox, {
  publicProps: {
    label: {
      config: 0
    },
    dropdownAlignment: {
      config: 0
    },
    placeholder: {
      config: 0
    },
    messageWhenValueMissing: {
      config: 0
    },
    name: {
      config: 0
    },
    ariaLabelledBy: {
      config: 3
    },
    ariaDescribedBy: {
      config: 3
    },
    fieldLevelHelp: {
      config: 3
    },
    variant: {
      config: 3
    },
    value: {
      config: 3
    },
    options: {
      config: 3
    },
    disabled: {
      config: 3
    },
    readOnly: {
      config: 3
    },
    required: {
      config: 3
    },
    spinnerActive: {
      config: 3
    },
    validity: {
      config: 1
    }
  },
  publicMethods: ["focus", "blur", "checkValidity", "reportValidity", "setCustomValidity", "showHelpMessageIfInvalid"],
  track: {
    _ariaLabelledBy: 1,
    _ariaDescribedBy: 1,
    _fieldLevelHelp: 1,
    _selectedLabel: 1,
    _disabled: 1,
    _readOnly: 1,
    _spinnerActive: 1,
    _required: 1,
    _items: 1,
    _variant: 1,
    _helpMessage: 1
  },
  fields: ["_labelForId"]
});
const __lwc_component_class_internal = _registerComponent(cCombobox, {
  tmpl: _tmpl,
  sel: "c-combobox",
  apiVersion: 66
});
export default __lwc_component_class_internal;