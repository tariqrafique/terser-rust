import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveCellEditableButton.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import labelEdit from '@salesforce/label/LightningDatatable.edit';
import labelEditHasError from '@salesforce/label/LightningDatatable.editHasError';
import { LightningElement } from 'lwc';
const i18n = {
  edit: labelEdit,
  editHasError: labelEditHasError
};
class PrivateCellEditableButton extends LightningElement {
  constructor(...args) {
    super(...args);
    this.columnLabel = void 0;
    this.hasError = void 0;
    this._htmlButton = null;
  }
  focus() {
    if (this.htmlButton) {
      this.htmlButton.focus();
    }
  }
  click() {
    if (this.htmlButton) {
      this.htmlButton.click();
    }
  }
  get tabIndex() {
    return this.getAttribute('tabindex');
  }
  set tabIndex(value) {
    this.setAttribute('tabindex', value);
  }
  get htmlButton() {
    if (!this._htmlButton) {
      this._htmlButton = this.refs.button;
    }
    return this._htmlButton;
  }
  disconnectedCallback() {
    this._htmlButton = null;
  }
  get assistiveText() {
    const suffix = this.hasError ? ` ${i18n.editHasError}` : '';
    return `${i18n.edit} ${this.columnLabel}${suffix}`;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(PrivateCellEditableButton, {
  publicProps: {
    columnLabel: {
      config: 0
    },
    hasError: {
      config: 0
    },
    tabIndex: {
      config: 3
    }
  },
  publicMethods: ["focus", "click"],
  fields: ["_htmlButton"]
});
const __lwc_component_class_internal = _registerComponent(PrivateCellEditableButton, {
  tmpl: _tmpl,
  sel: "lightning-primitive-cell-editable-button",
  apiVersion: 66
});
export default __lwc_component_class_internal;