import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveDatatableIeditTypeFactory.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import { assert } from 'lightning/utilsPrivate';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import TextTpl from './text.html';
import PhoneTpl from './phone.html';
import EmailTpl from './email.html';
import PercentTpl from './percent.html';
import UrlTpl from './url.html';
import CurrencyTpl from './currency.html';
import NumberTpl from './number.html';
import BooleanTpl from './boolean.html';
import DateLocalTpl from './dateLocal.html';
import DateTpl from './date.html';
import DefaultTpl from './default.html';
const TYPE_TEMPLATE_MAPPINGS = {
  text: TextTpl,
  phone: PhoneTpl,
  email: EmailTpl,
  percent: PercentTpl,
  url: UrlTpl,
  currency: CurrencyTpl,
  number: NumberTpl,
  boolean: BooleanTpl,
  'date-local': DateLocalTpl,
  date: DateTpl
};
const INVALID_TYPE_MESSAGE = 'column type not supported for inline edit';
class LightningPrimitiveDatatableIeditTypeFactory extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.columnLabel = void 0;
    this.editedValue = void 0;
    this.required = void 0;
    this.typeAttributes = void 0;
  }
  get columnDef() {
    return this._columnDef;
  }
  set columnDef(value) {
    assert(TYPE_TEMPLATE_MAPPINGS.hasOwnProperty(value.type) || value.editableCustomType, INVALID_TYPE_MESSAGE);
    this._columnDef = value;
    this.columnLabel = value.label;
  }
  get customErrorValidationMessage() {
    return this._customErrorValidationMessage;
  }
  set customErrorValidationMessage(value) {
    this._customErrorValidationMessage = value;
    if (value && import.meta.env.SSR) {
      this.setAndReportInputValidity();
    }
  }
  setAndReportInputValidity() {
    if (this.concreteComponent) {
      this.concreteComponent.setCustomValidity(this.customErrorValidationMessage);
      this.concreteComponent.reportValidity();
    }
  }
  get isEditableCustomValid() {
    return this.isValidCustomType && this.concreteComponent;
  }
  get value() {
    if (this.columnDef.type === 'boolean') {
      return this.concreteComponent?.checked;
    }
    return this.concreteComponent?.value;
  }
  get validity() {
    return this.concreteComponent?.validity;
  }
  focus() {
    if (this.concreteComponent) {
      this.concreteComponent.focus();
    }
  }
  showHelpMessageIfInvalid() {
    this.concreteComponent.showHelpMessageIfInvalid();
  }
  get columnType() {
    return this._columnDef.type;
  }
  get concreteComponent() {
    return !import.meta.env.SSR ? this.template.querySelector('[data-inputable="true"]') : null;
  }
  get customEditTemplate() {
    return this._columnDef.editTemplate;
  }
  get editedDateValue() {
    const dateValue = new Date(this.editedValue);
    if (this.editedValue === null || isNaN(dateValue.getTime())) {
      return '';
    }
    return dateValue.toISOString();
  }
  get isValidCustomType() {
    return this._columnDef.editableCustomType && this._columnDef.editTemplate;
  }
  get typeAttributeStep() {
    return this._columnDef && this._columnDef.typeAttributes && this._columnDef.typeAttributes.step || '0.01';
  }
  handleComponentFocus() {
    this.dispatchEvent(new CustomEvent('focus'));
  }
  handleComponentBlur() {
    this.dispatchEvent(new CustomEvent('blur'));
  }
  handleComponentChange() {
    this.showHelpMessageIfInvalid();
  }
  render() {
    return this.isValidCustomType ? this.customEditTemplate : TYPE_TEMPLATE_MAPPINGS[this.columnType] || DefaultTpl;
  }
  renderedCallback() {
    if (this.concreteComponent) {
      this.concreteComponent.addEventListener('focus', this.handleComponentFocus.bind(this));
      this.concreteComponent.addEventListener('blur', this.handleComponentBlur.bind(this));
      this.concreteComponent.addEventListener('change', this.handleComponentChange.bind(this));
      if (this.customErrorValidationMessage) {
        this.setAndReportInputValidity();
      }
    }
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningPrimitiveDatatableIeditTypeFactory, {
  publicProps: {
    editedValue: {
      config: 0
    },
    required: {
      config: 0
    },
    typeAttributes: {
      config: 0
    },
    columnDef: {
      config: 3
    },
    customErrorValidationMessage: {
      config: 3
    },
    isEditableCustomValid: {
      config: 1
    },
    value: {
      config: 1
    },
    validity: {
      config: 1
    }
  },
  publicMethods: ["focus", "showHelpMessageIfInvalid"],
  fields: ["columnLabel"]
});
const __lwc_component_class_internal = _registerComponent(LightningPrimitiveDatatableIeditTypeFactory, {
  tmpl: _tmpl,
  sel: "lightning-primitive-datatable-iedit-type-factory",
  apiVersion: 66
});
export default __lwc_component_class_internal;