import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./inputName.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import labelFirstName from '@salesforce/label/LightningInputName.firstName';
import labelInformalName from '@salesforce/label/LightningInputName.informalName';
import labelLastName from '@salesforce/label/LightningInputName.lastName';
import labelMiddleName from '@salesforce/label/LightningInputName.middleName';
import labelNone from '@salesforce/label/LightningInputName.none';
import labelRequired from '@salesforce/label/LightningControl.required';
import labelSalutation from '@salesforce/label/LightningInputName.salutation';
import labelSuffix from '@salesforce/label/LightningInputName.suffix';
import labelHelpTextAlternativeText from '@salesforce/label/LightningInput.helptextAlternativeText';
import locale from '@salesforce/i18n/locale';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet, formatLabel } from 'lightning/utils';
import { assert, normalizeBoolean, classListMutation, reflectAttribute } from 'lightning/utilsPrivate';
import { isEmptyString, InteractingState, FieldConstraintApi, normalizeVariant, VARIANT } from 'lightning/inputUtils';
import { getFieldsOrder } from './nameFormatter';
import { privateContext } from 'lightning/utilsInternal';
import { features } from 'lightning/features';
const {
  setContext,
  assertContext
} = privateContext;
const FIELD_TYPE = {
  INPUT: 'input',
  PICKLIST: 'combobox'
};
const DEFAULT_MAXLENGTH = 40;
const DEFAULT_FIELD_META = {
  salutation: {
    inputType: FIELD_TYPE.PICKLIST
  },
  firstName: {},
  middleName: {},
  informalName: {},
  lastName: {
    maxlength: 80,
    required: true
  },
  suffix: {}
};
const i18n = {
  firstName: labelFirstName,
  informalName: labelInformalName,
  lastName: labelLastName,
  middleName: labelMiddleName,
  none: labelNone,
  required: labelRequired,
  salutation: labelSalutation,
  suffix: labelSuffix,
  helpTextAlternativeText: labelHelpTextAlternativeText
};
class LightningInputName extends LightningShadowBaseClass {
  constructor() {
    super();
    this.salutationLabel = void 0;
    this.firstNameLabel = void 0;
    this.middleNameLabel = void 0;
    this.lastNameLabel = void 0;
    this.suffixLabel = void 0;
    this.informalNameLabel = void 0;
    this.label = void 0;
    this.locale = locale;
    this.options = void 0;
    this.fieldsToDisplay = ['firstName', 'salutation', 'lastName'];
    this._salutation = '';
    this._lastName = '';
    this._firstName = '';
    this._middleName = '';
    this._informalName = '';
    this._suffix = '';
    this._disabled = false;
    this._readonly = false;
    this._required = false;
    this._variant = void 0;
    this._fieldLevelHelp = void 0;
    this._connected = void 0;
    this.interactingState = void 0;
    this._fieldConstraintApis = void 0;
    this._combinedConstraintApi = void 0;
    setContext(this);
  }
  connectedCallback() {
    assertContext(this);
    super.connectedCallback();
    this._connected = true;
    if (!import.meta.env.SSR) {
      this.classList.add('slds-form-element', 'slds-form-element_compound');
      this.updateClassList();
    }
    this.interactingState = new InteractingState({
      debounceInteraction: true
    });
    this.interactingState.onenter(() => {
      this.dispatchEvent(new CustomEvent('focus'));
    });
    this.interactingState.onleave(() => {
      this.showHelpMessageIfInvalid();
      this.dispatchEvent(new CustomEvent('blur'));
    });
  }
  updateClassList() {
    classListMutation(this.classList, {
      'slds-form-element_stacked': this.variant === VARIANT.LABEL_STACKED,
      'slds-form-element_horizontal': this.variant === VARIANT.LABEL_INLINE
    });
  }
  get computedPicklistClass() {
    const classes = classSet();
    return classes.add({
      'slds-size_1-of-1': true,
      'slds-form-element': !this.template['synthetic']
    }).toString();
  }
  disconnectedCallback() {
    this._connected = false;
  }
  get salutation() {
    return this._salutation;
  }
  set salutation(value) {
    this._salutation = value;
  }
  get firstName() {
    return this._firstName;
  }
  set firstName(value) {
    this._firstName = value;
  }
  get middleName() {
    return this._middleName;
  }
  set middleName(value) {
    this._middleName = value;
  }
  get informalName() {
    return this._informalName;
  }
  set informalName(value) {
    this._informalName = value;
  }
  get lastName() {
    return this._lastName;
  }
  set lastName(value) {
    this._lastName = value;
  }
  get suffix() {
    return this._suffix;
  }
  set suffix(value) {
    this._suffix = value;
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = normalizeBoolean(value);
  }
  get readOnly() {
    return this._readonly;
  }
  set readOnly(value) {
    this._readonly = normalizeBoolean(value);
  }
  get picklistReadOnly() {
    return features.enableInputNamePicklistRO ? this._readonly : false;
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
    reflectAttribute(this, 'variant', this.variant);
    this.updateClassList();
  }
  set fieldLevelHelp(value) {
    this._fieldLevelHelp = value;
  }
  get fieldLevelHelp() {
    return this._fieldLevelHelp;
  }
  focus() {
    this.template.querySelector('[data-field]').focus();
  }
  blur() {
    const inputs = this.template.querySelectorAll('[data-field]');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].blur();
    }
  }
  get validity() {
    return this._combinedConstraint.validity;
  }
  checkValidity() {
    return this._combinedConstraint.checkValidity();
  }
  showHelpMessageIfInvalid() {
    this.reportValidity();
  }
  setCustomValidityForField(message, fieldName) {
    assert(DEFAULT_FIELD_META[fieldName] !== undefined, `Invalid 'fieldName': ${fieldName}`);
    this._fieldConstraints[fieldName].setCustomValidity(message);
  }
  reportValidity() {
    const valid = this.checkValidity();
    if (!this._connected) {
      return valid;
    }
    this.fieldsToDisplay.forEach(field => {
      this._reportValidityForField(field);
    });
    return valid;
  }
  get i18n() {
    return i18n;
  }
  get isLabelHidden() {
    return this.variant === VARIANT.LABEL_HIDDEN;
  }
  get computedLegendClass() {
    return classSet('slds-form-element__label slds-form-element__legend').add({
      'slds-assistive-text': this.isLabelHidden
    }).toString();
  }
  handleFocus() {
    this.interactingState.enter();
  }
  handleBlur(event) {
    this.interactingState.leave();
    const field = event.target.dataset.field;
    this._reportValidityForField(field);
  }
  handleChange(event) {
    event.stopPropagation();
    const value = event.detail.value;
    const fieldName = event.target.dataset.field;
    if (this.getFieldValue(fieldName) === value) {
      return;
    }
    this[fieldName] = value;
    this.dispatchEvent(new CustomEvent('change', {
      composed: true,
      bubbles: true,
      detail: {
        salutation: this.salutation,
        firstName: this.firstName,
        middleName: this.middleName,
        lastName: this.lastName,
        informalName: this.informalName,
        suffix: this.suffix,
        validity: this.validity
      }
    }));
  }
  initializeFieldsMetaData(fieldsOrder) {
    const fields = [];
    fieldsOrder.forEach(fieldName => {
      fields.push({
        name: fieldName
      });
    });
    return fields;
  }
  getFieldObject(field) {
    const fieldDefault = DEFAULT_FIELD_META[field];
    const value = this[field];
    const label = this[`${field}Label`] || this.i18n[field];
    const fieldsToDisplay = this.fieldsToDisplay.map(fieldName => {
      return fieldName.toUpperCase();
    });
    if (fieldsToDisplay.indexOf(field.toUpperCase()) > -1) {
      return {
        isInput: fieldDefault.inputType !== 'combobox',
        isCombobox: fieldDefault.inputType === 'combobox',
        required: fieldDefault.required && this.required,
        options: this.options,
        placeholder: fieldDefault.inputType === 'combobox' ? this.i18n.none : label,
        maxlength: fieldDefault.maxlength || DEFAULT_MAXLENGTH,
        name: field,
        label,
        value
      };
    }
    return null;
  }
  get fieldsMetaData() {
    const fieldsOrder = getFieldsOrder(this.locale);
    const fieldsData = this.initializeFieldsMetaData(fieldsOrder);
    const fields = [];
    fieldsData.forEach(row => {
      const fieldName = row.name;
      const fieldObject = this.getFieldObject(fieldName);
      if (fieldObject) {
        fields.push(fieldObject);
      }
    });
    return fields;
  }
  getFieldValue(fieldName) {
    if (features.enableAssertContext260) {
      assertContext(this);
    }
    return this[fieldName];
  }
  getFieldElement(fieldName) {
    return this.template.querySelector(`[data-field="${fieldName}"]`);
  }
  get _fieldConstraints() {
    if (!this._fieldConstraintApis) {
      this._fieldConstraintApis = Object.keys(DEFAULT_FIELD_META).reduce((constraints, field) => {
        constraints[field] = new FieldConstraintApi(() => this.getFieldElement(field), {
          valueMissing: () => !this.disabled && this.required && this.fieldsToDisplay.indexOf(field) >= 0 && DEFAULT_FIELD_META[field].required && isEmptyString(this[field])
        });
        return constraints;
      }, {});
    }
    return this._fieldConstraintApis;
  }
  get _combinedConstraint() {
    if (!this._combinedConstraintApi) {
      this._combinedConstraintApi = new FieldConstraintApi(() => this, {
        customError: () => Object.values(this._fieldConstraints).some(constraint => constraint.validity.customError),
        valueMissing: () => Object.values(this._fieldConstraints).some(constraint => constraint.validity.valueMissing)
      });
    }
    return this._combinedConstraintApi;
  }
  _reportValidityForField(field) {
    if (this._fieldConstraints[field]) {
      this._fieldConstraints[field].reportValidity(helpMessage => {
        const fieldElement = this.getFieldElement(field);
        fieldElement.setCustomValidity(helpMessage);
        fieldElement.reportValidity();
      });
    }
  }
  get helptextAlternativeText() {
    return formatLabel(i18n.helpTextAlternativeText, this.label);
  }
  /*LWC compiler v9.5.3*/
}
LightningInputName.delegatesFocus = true;
_registerDecorators(LightningInputName, {
  publicProps: {
    salutationLabel: {
      config: 0
    },
    firstNameLabel: {
      config: 0
    },
    middleNameLabel: {
      config: 0
    },
    lastNameLabel: {
      config: 0
    },
    suffixLabel: {
      config: 0
    },
    informalNameLabel: {
      config: 0
    },
    label: {
      config: 0
    },
    locale: {
      config: 0
    },
    options: {
      config: 0
    },
    fieldsToDisplay: {
      config: 0
    },
    salutation: {
      config: 3
    },
    firstName: {
      config: 3
    },
    middleName: {
      config: 3
    },
    informalName: {
      config: 3
    },
    lastName: {
      config: 3
    },
    suffix: {
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
    variant: {
      config: 3
    },
    fieldLevelHelp: {
      config: 3
    },
    validity: {
      config: 1
    }
  },
  publicMethods: ["focus", "blur", "checkValidity", "showHelpMessageIfInvalid", "setCustomValidityForField", "reportValidity"],
  track: {
    _variant: 1,
    _fieldLevelHelp: 1
  },
  fields: ["_salutation", "_lastName", "_firstName", "_middleName", "_informalName", "_suffix", "_disabled", "_readonly", "_required", "_connected", "interactingState", "_fieldConstraintApis", "_combinedConstraintApi"]
});
const __lwc_component_class_internal = _registerComponent(LightningInputName, {
  tmpl: _tmpl,
  sel: "lightning-input-name",
  apiVersion: 66
});
export default __lwc_component_class_internal;