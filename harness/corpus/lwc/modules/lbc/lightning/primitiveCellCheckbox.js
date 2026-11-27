import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveCellCheckbox.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import labelSelectItem from '@salesforce/label/LightningDatatable.selectItem';
import PrimitiveDatatableCell from 'lightning/primitiveDatatableCell';
import { keyCodes } from 'lightning/utilsPrivate';
import checkbox from './checkbox.html';
import radio from './radio.html';
import { getRealDOMId, synchronizeAttrs, normalizeBoolean, reflectAttribute } from 'lightning/utilsPrivate';
const i18n = {
  selectItem: labelSelectItem
};
class PrimitiveCellCheckbox extends PrimitiveDatatableCell {
  constructor(...args) {
    super(...args);
    this._columnHeaderId = '';
    this._isSelected = false;
    this._isDisabled = false;
    this._type = 'checkbox';
    this.rowIndex = 0;
    this.dtContextId = void 0;
  }
  get type() {
    return this._type;
  }
  set type(value) {
    this._type = value;
    if (this._type === 'radio') {
      this.setCheckedAttribute(false);
    }
  }
  get isDisabled() {
    return this._isDisabled;
  }
  set isDisabled(value) {
    this._isDisabled = normalizeBoolean(value);
    if (!this.template.synthetic) {
      reflectAttribute(this, 'disabled', this._isDisabled);
    }
  }
  get isSelected() {
    return this._isSelected;
  }
  set isSelected(value) {
    this._isSelected = value;
    if (value && !this.hasAttribute('checked')) {
      this.setCheckedAttribute(true);
    } else if (!value && this.hasAttribute('checked')) {
      this.setCheckedAttribute(false);
    }
  }
  get columnHeaderId() {
    return this._columnHeaderId;
  }
  set columnHeaderId(id) {
    this._columnHeaderId = id || '';
    const labelId = this.computedLabelId;
    if (labelId && this._rendered) {
      synchronizeAttrs(this.refs.input, {
        'aria-labelledby': `${labelId} ${this._columnHeaderId}`
      });
    }
  }
  render() {
    if (this.type === 'radio') {
      return radio;
    }
    return checkbox;
  }
  renderedCallback() {
    this._rendered = true;
    synchronizeAttrs(this.refs.input, {
      'aria-labelledby': `${this.computedLabelId} ${this.columnHeaderId}`
    });
  }
  get computedLabelId() {
    if (this.isConnected && this._rendered) {
      return getRealDOMId(this.refs.label);
    }
    return null;
  }
  get selectItemAssistiveText() {
    return `${i18n.selectItem} ${this.rowIndex + 1}`;
  }
  get labelId() {
    const labelType = this.type === 'radio' ? 'radio' : 'check';
    return `${labelType}-button-label-${this.rowIndex + 1}`;
  }
  get computedOptionName() {
    return `${this.dtContextId}-options`;
  }
  handleRadioClick(event) {
    event.stopPropagation();
    if (!this.isSelected) {
      this.dispatchSelection(false);
    }
  }
  handleCheckboxClick(event) {
    event.stopPropagation();
    this.dispatchSelection(event.shiftKey);
  }
  setCheckedAttribute(setChecked = !this.hasAttribute('checked')) {
    if (!this.isDisabled && !this.template.synthetic) {
      if (setChecked) {
        this.setAttribute('checked', '');
      } else {
        this.removeAttribute('checked');
      }
    }
  }
  handleCheckboxContainerClick(event) {
    if (!this.isDisabled) {
      this.setCheckedAttribute();
      event.preventDefault();
      this.dispatchSelection(event.shiftKey);
    }
  }
  handleCheckboxContainerMouseDown(event) {
    if (event.shiftKey) {
      event.preventDefault();
    }
  }
  handleRadioKeyDown(event) {
    const keyCode = event.keyCode;
    if (keyCode === keyCodes.left || keyCode === keyCodes.right) {
      event.preventDefault();
    }
  }
  dispatchSelection(isMultipleSelection) {
    const {
      rowKeyValue,
      colKeyValue
    } = this;
    const actionName = !this.isSelected ? 'selectrow' : 'deselectrow';
    const actionEvent = new CustomEvent(actionName, {
      bubbles: true,
      composed: true,
      detail: {
        rowKeyValue,
        colKeyValue,
        isMultiple: isMultipleSelection
      }
    });
    this.dispatchEvent(actionEvent);
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(PrimitiveCellCheckbox, {
  publicProps: {
    rowIndex: {
      config: 0
    },
    dtContextId: {
      config: 0
    },
    type: {
      config: 3
    },
    isDisabled: {
      config: 3
    },
    isSelected: {
      config: 3
    },
    columnHeaderId: {
      config: 3
    }
  },
  fields: ["_columnHeaderId", "_isSelected", "_isDisabled", "_type"]
});
const __lwc_component_class_internal = _registerComponent(PrimitiveCellCheckbox, {
  tmpl: _tmpl,
  sel: "lightning-primitive-cell-checkbox",
  apiVersion: 66
});
export default __lwc_component_class_internal;