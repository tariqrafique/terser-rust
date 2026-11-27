import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./groupedCombobox.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import labelRequired from '@salesforce/label/LightningControl.required';
import labelPlaceholder from '@salesforce/label/LightningCombobox.placeholder';
import labelHelpTextAlternativeText from '@salesforce/label/LightningInput.helptextAlternativeText';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet, formatLabel } from 'lightning/utils';
import { assert, synchronizeAttrs, reflectAttribute, classListMutation } from 'lightning/utilsPrivate';
import { isEmptyString, generateUniqueId, FieldConstraintApi, normalizeVariant, VARIANT } from 'lightning/inputUtils';
import { features } from 'lightning/features';
const i18n = {
  required: labelRequired,
  helpTextAlternativeText: labelHelpTextAlternativeText,
  placeholder: labelPlaceholder
};
class LightningGroupedCombobox extends LightningShadowBaseClass {
  constructor() {
    super();
    this.label = void 0;
    this.inputIconName = 'utility:search';
    this.inputIconSize = 'x-small';
    this.inputIconAlternativeText = void 0;
    this.inputMaxlength = void 0;
    this.showActivityIndicator = false;
    this.showDropdownActivityIndicator = false;
    this.placeholder = i18n.placeholder;
    this.messageWhenValueMissing = i18n.required;
    this.name = void 0;
    this.value = void 0;
    this.required = false;
    this.disabled = false;
    this.readOnly = false;
    this.inputPill = void 0;
    this.filterLabel = void 0;
    this.filterItems = void 0;
    this.filterInputText = void 0;
    this.disableDefaultHighlight = void 0;
    this.customRole = 'combobox';
    this.customAriaHasPopup = 'listbox';
    this._pills = void 0;
    this._variant = void 0;
    this._items = [];
    this._expandPillContainer = true;
    this._highlightedOptionElementId = '';
    this._helpMessage = void 0;
    this._fieldLevelHelp = void 0;
    this._inputText = '';
    this._filterInputId = void 0;
    this._mainInputId = void 0;
    this._initialized = false;
    this._interacting = void 0;
    this._mainInputId = generateUniqueId();
    this._filterInputId = generateUniqueId();
  }
  updateClassList() {
    classListMutation(this.classList, {
      'slds-form-element_stacked': this.variant === VARIANT.LABEL_STACKED,
      'slds-form-element_horizontal': this.variant === VARIANT.LABEL_INLINE
    });
  }
  connectedCallback() {
    super.connectedCallback();
    this._connected = true;
    this.classList.add('slds-form-element');
    this.updateClassList();
  }
  renderedCallback() {
    if (!this._initialized) {
      this._initialized = true;
      this.inputText = this._inputText;
    }
    this.synchronizeA11y();
    reflectAttribute(this.template.querySelector('[data-lookup]'), 'data-filter-on', this.computedHasFilter);
  }
  disconnectedCallback() {
    this._connected = false;
  }
  get inputText() {
    return this._inputText;
  }
  set inputText(text) {
    this._inputText = text;
    if (this._connected) {
      this.template.querySelector('[data-lookup]').inputText = text;
    }
  }
  get pills() {
    return this._pills;
  }
  set pills(newPills) {
    assert(Array.isArray(newPills), '"pills" must be an array.');
    if (this._connected && (!newPills || newPills.length === 0)) {
      if (this._focusOnPills) {
        requestAnimationFrame(() => {
          this.lookupCombobox.focus();
        });
      }
    }
    this._pills = newPills;
  }
  get fieldLevelHelp() {
    return this._fieldLevelHelp;
  }
  set fieldLevelHelp(value) {
    this._fieldLevelHelp = value;
  }
  get computedAriaInvalid() {
    if (!features.enableAriaInvalidGroupCombobox) {
      return undefined;
    }
    if (this.ariaInvalid !== null && this.ariaInvalid !== undefined) {
      return this.ariaInvalid;
    }
    return this._helpMessage ? true : undefined;
  }
  get variant() {
    return this._variant || VARIANT.STANDARD;
  }
  set variant(value) {
    this._variant = normalizeVariant(value);
    this.updateClassList();
    reflectAttribute(this, 'variant', this._variant);
  }
  set items(items = []) {
    this._items = items;
    if (items) {
      assert(Array.isArray(items), '"items" must be an array.');
    }
  }
  get items() {
    return this._items;
  }
  highlightInputText() {
    if (this._connected) {
      this.lookupCombobox.highlightInputText();
    }
  }
  focus() {
    if (this._connected) {
      if (this.computedHasFilter) {
        this.filterCombobox.focus();
      } else {
        this.lookupCombobox.focus();
      }
    }
  }
  focusAndOpenDropdownIfNotEmpty() {
    if (this._connected) {
      this.lookupCombobox.focusAndOpenDropdownIfNotEmpty();
    }
  }
  blur() {
    if (this._connected) {
      this.lookupCombobox.blur();
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
      reflectAttribute(this.template.querySelector('lightning-base-combobox'), 'invalid', !this.checkValidity());
      this._helpMessage = message;
    });
  }
  setCustomValidity(message) {
    this._constraint.setCustomValidity(message);
  }
  showHelpMessageIfInvalid() {
    this.reportValidity();
  }
  get computedUniqueHelpElementId() {
    return this._helpMessage ? this._mainInputId + '-error' : null;
  }
  get lookupCombobox() {
    return this.template.querySelector('[data-lookup]');
  }
  get filterCombobox() {
    return this.template.querySelector('[data-filter]');
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
  get computedComboboxGroupClass() {
    return classSet().add({
      'slds-combobox-group': this.computedHasFilter
    });
  }
  get computedHasFilter() {
    return Array.isArray(this.filterItems);
  }
  get computedLookupComboboxClass() {
    return classSet().add({
      'slds-has-selection': Array.isArray(this._pills) && this._pills.length > 0 || this.inputPill,
      'slds-combobox-addon_end': this.computedHasFilter
    });
  }
  get _hasPills() {
    return this.pills && this.pills.length > 0;
  }
  get _constraint() {
    if (!this._constraintApi) {
      this._constraintApi = new FieldConstraintApi(() => this, {
        valueMissing: () => !this.disabled && this.required && isEmptyString(this.value)
      });
    }
    return this._constraintApi;
  }
  handleLookupReady(event) {
    this._mainInputId = event.detail.id;
  }
  handleFilterReady(event) {
    this._filterInputId = event.detail.id;
  }
  handleDropdownOpenRequest() {
    this.dispatchEvent(new CustomEvent('dropdownopenrequest'));
  }
  handleDropdownOpen() {
    this.dispatchEvent(new CustomEvent('dropdownopen'));
  }
  handlePillRemove(event) {
    if (!this.disabled) {
      this.dispatchEvent(new CustomEvent('pillremove', {
        detail: event.detail
      }));
    }
  }
  handleClick() {
    this.dispatchEvent(new CustomEvent('inputclick'));
  }
  handleTextChange(event) {
    this._inputText = event.detail.text;
    this.dispatchEvent(new CustomEvent('textchange', {
      detail: {
        text: event.detail.text
      }
    }));
  }
  handleTextInput(event) {
    this._inputText = event.detail.text;
    this.dispatchEvent(new CustomEvent('textinput', {
      detail: {
        text: event.detail.text
      }
    }));
  }
  handleSelect(event) {
    this.dispatchEvent(new CustomEvent('select', {
      detail: {
        value: event.detail.value
      }
    }));
  }
  handleSelectFilter(event) {
    const selectedFilterValue = event.detail.value;
    this.dispatchEvent(new CustomEvent('selectfilter', {
      detail: {
        value: selectedFilterValue
      }
    }));
  }
  handleEndReached() {
    this.dispatchEvent(new CustomEvent('endreached'));
  }
  handleFocus() {
    this._interacting = true;
    this._expandPillContainer = true;
    this.dispatchEvent(new CustomEvent('focus'));
  }
  handlePillsFocus() {
    this.handleFocus();
    this._focusOnPills = true;
  }
  handlePillsBlur() {
    this.handleBlur();
    this._focusOnPills = false;
  }
  handleBlur() {
    this._interacting = false;
    requestAnimationFrame(() => {
      this.dispatchEvent(new CustomEvent('blur'));
      if (this.pills && this.pills.length > 0) {
        requestAnimationFrame(() => {
          if (this._connected) {
            const pillContainer = this.template.querySelector('lightning-pill-container');
            if (pillContainer) {
              pillContainer.scrollTop = 0;
            }
          }
        });
      }
    });
  }
  synchronizeA11y() {
    const lookupInputDescribedByElements = [];
    const label = this.template.querySelector('[data-main-label]');
    const filterLabel = this.template.querySelector('[data-filter-label]');
    const helpMessage = this.template.querySelector('[data-help-message]');
    const lookup = this.template.querySelector('[data-lookup]');
    if (lookup) {
      const inputPillIcon = lookup.shadowRoot.querySelector('[data-input-pill-search-icon]');
      if (inputPillIcon) {
        lookupInputDescribedByElements.push(inputPillIcon.id);
      }
      if (helpMessage && this._helpMessage) {
        lookupInputDescribedByElements.push(helpMessage.id);
      }
      lookup.inputDescribedByElements = lookupInputDescribedByElements;
    }
    synchronizeAttrs(label, {
      for: this._mainInputId
    });
    synchronizeAttrs(filterLabel, {
      for: this._filterInputId
    });
  }
  get helptextAlternativeText() {
    return formatLabel(i18n.helpTextAlternativeText, this.label);
  }
  handleFocusOut(e) {
    if (e?.relatedTarget?.dataset?.filterOn !== '' && !this._interacting) {
      this.reportValidity();
    }
  }
  /*LWC compiler v9.5.3*/
}
LightningGroupedCombobox.validationOptOut = ['class'];
_registerDecorators(LightningGroupedCombobox, {
  publicProps: {
    label: {
      config: 0
    },
    inputIconName: {
      config: 0
    },
    inputIconSize: {
      config: 0
    },
    inputIconAlternativeText: {
      config: 0
    },
    inputMaxlength: {
      config: 0
    },
    showActivityIndicator: {
      config: 0
    },
    showDropdownActivityIndicator: {
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
    value: {
      config: 0
    },
    required: {
      config: 0
    },
    disabled: {
      config: 0
    },
    readOnly: {
      config: 0
    },
    inputPill: {
      config: 0
    },
    filterLabel: {
      config: 0
    },
    filterItems: {
      config: 0
    },
    filterInputText: {
      config: 0
    },
    disableDefaultHighlight: {
      config: 0
    },
    customRole: {
      config: 0
    },
    customAriaHasPopup: {
      config: 0
    },
    inputText: {
      config: 3
    },
    pills: {
      config: 3
    },
    fieldLevelHelp: {
      config: 3
    },
    variant: {
      config: 3
    },
    items: {
      config: 3
    },
    validity: {
      config: 1
    }
  },
  publicMethods: ["highlightInputText", "focus", "focusAndOpenDropdownIfNotEmpty", "blur", "checkValidity", "reportValidity", "setCustomValidity", "showHelpMessageIfInvalid"],
  track: {
    _pills: 1,
    _variant: 1,
    _items: 1,
    _expandPillContainer: 1,
    _highlightedOptionElementId: 1,
    _helpMessage: 1,
    _fieldLevelHelp: 1,
    _inputText: 1
  },
  fields: ["_filterInputId", "_mainInputId", "_initialized", "_interacting"]
});
const __lwc_component_class_internal = _registerComponent(LightningGroupedCombobox, {
  tmpl: _tmpl,
  sel: "lightning-grouped-combobox",
  apiVersion: 66
});
export default __lwc_component_class_internal;