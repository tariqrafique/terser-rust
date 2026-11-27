import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./recordForm.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { getFieldsForLayout, densityValues, getCompoundFields, compoundFieldIsUpdateable, compoundFieldIsCreateable, isCompoundField, isPersonAccount, UNSUPPORTED_REFERENCE_FIELDS } from 'c/fieldUtils';
import { normalizeString, deepCopy } from 'c/utilsPrivate';
import { classSet } from 'c/utils';
import labelSave from '@salesforce/label/c.lightning_LightningRecordForm_save';
import labelCancel from '@salesforce/label/c.lightning_LightningRecordForm_cancel';
import labelLoading from '@salesforce/label/c.lightning_LightningRecordForm_loading';
import { normalizeRecordId } from 'c/recordUtils';
const EDIT_MODE = 'edit';
const VIEW_MODE = 'view';
const READ_ONLY_MODE = 'readonly';
function isUnsupportedReferenceField(name) {
  return UNSUPPORTED_REFERENCE_FIELDS.indexOf(name) !== -1;
}
class cRecordForm extends LightningElement {
  constructor(...args) {
    super(...args);
    this.readOnly = false;
    this._recordId = void 0;
    this._objectApiName = void 0;
    this._fields = [];
    this._editMode = false;
    this.cols = 1;
    this._loading = true;
    this.fieldsReady = false;
    this._recordTypeId = void 0;
    this._record = void 0;
    this._firstLoad = true;
    this._loadError = false;
    this._layout = void 0;
    this._dupMapper = {};
    this._mode = void 0;
    this._labelSave = labelSave;
    this._labelCancel = labelCancel;
    this._labelLoading = labelLoading;
    this._loadedPending = false;
    this._fieldsHandled = false;
    this._rawFields = void 0;
    this._isPersonAccount = false;
    this._density = densityValues.AUTO;
  }
  set mode(val) {
    val = val.toLowerCase();
    this._mode = val;
    switch (val) {
      case EDIT_MODE:
        this.readOnly = false;
        this._editMode = true;
        break;
      case VIEW_MODE:
        this.readOnly = false;
        this._editMode = false;
        break;
      case READ_ONLY_MODE:
        this.readOnly = true;
        this._editMode = false;
        break;
      default:
        this.readOnly = false;
        if (!this._recordId) {
          this._editMode = true;
        } else {
          this._editMode = false;
        }
    }
  }
  get mode() {
    return this._mode;
  }
  set layoutType(val) {
    if (val.match(/Full|Compact/)) {
      this._layout = val;
    } else {
      throw new Error(`Invalid layout "${val}". Layout must be "Full" or "Compact"`);
    }
  }
  get layoutType() {
    return this._layout;
  }
  get density() {
    return this._density;
  }
  set density(val) {
    this._density = normalizeString(val, {
      fallbackValue: densityValues.AUTO,
      validValues: [densityValues.AUTO, densityValues.COMPACT, densityValues.COMFY]
    });
  }
  set recordTypeId(val) {
    this._recordTypeId = val;
    this._fieldsHandled = false;
  }
  get recordTypeId() {
    return this._recordTypeId;
  }
  set recordId(val) {
    if (!val && !this._mode) {
      this._editMode = true;
    }
    this._recordId = normalizeRecordId(val);
    this._fieldsHandled = false;
  }
  get recordId() {
    return this._recordId;
  }
  set objectApiName(val) {
    this._objectApiName = val;
  }
  get objectApiName() {
    return this._objectApiName;
  }
  set columns(val) {
    this.cols = parseInt(val, 10);
    if (isNaN(this.cols) || this.cols < 1) {
      this.cols = 1;
    }
  }
  get columns() {
    return this.cols;
  }
  submit(fields) {
    this.template.querySelector('c-record-edit-form').submit(fields);
  }
  addField(val) {
    const fieldName = val.fieldApiName ? val.fieldApiName : val;
    if (!this._dupMapper[fieldName]) {
      this._fields.push(fieldName);
      this._dupMapper[fieldName] = true;
    }
  }
  connectedCallback() {
    if (!this._recordId && !this._mode) {
      this._editMode = true;
    }
  }
  set fields(val) {
    this.fieldsReady = true;
    this._fields = [];
    this._dupMapper = {};
    if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) {
        this.addField(val[i]);
      }
    } else {
      this.addField(val);
    }
  }
  get fields() {
    return this._rawFields;
  }
  get _editable() {
    return !this._loading && !this.readOnly && !this._loadError;
  }
  get _viewMode() {
    return !this._editMode;
  }
  set _viewMode(val) {
    this._editMode = !val;
  }
  get _rows() {
    const out = [];
    if (!this._objectInfo) {
      return out;
    }
    const rowLength = this.cols;
    const fields = this._fields.slice();
    let rowkey = 0;
    let thisRow = {
      fields: [],
      key: rowkey
    };
    while (fields.length > 0) {
      if (thisRow.fields.length < rowLength) {
        const field = fields.shift();
        if (this._objectInfo.fields && this._objectInfo.fields[field]) {
          const compound = isCompoundField(field, this._objectInfo, this._isPersonAccount);
          let compoundFields = [];
          if (compound) {
            compoundFields = getCompoundFields(field, this._record, this._objectInfo);
          }
          const hasFields = this._objectInfo && this._objectInfo.fields;
          const fieldUpdateable = compound ? compoundFieldIsUpdateable(compoundFields,
          // eslint-disable-line indent
          this._record,
          // eslint-disable-line indent
          this._objectInfo // eslint-disable-line indent
          ) // eslint-disable-line indent
          : hasFields && this._objectInfo.fields[field].updateable;
          const fieldCreateable = compound ? compoundFieldIsCreateable(compoundFields,
          // eslint-disable-line indent
          this._record,
          // eslint-disable-line indent
          this._objectInfo // eslint-disable-line indent
          ) // eslint-disable-line indent
          : hasFields && this._objectInfo.fields[field].createable;
          const shouldShowAsInputInEditMode = fieldUpdateable || !this._recordId && fieldCreateable;
          const updateable = !isUnsupportedReferenceField(field) && this._objectInfo ? shouldShowAsInputInEditMode : false;
          const editable = !isUnsupportedReferenceField(field) && this._editable && (hasFields && this._objectInfo.fields[field] ? fieldUpdateable : false);
          thisRow.fields.push({
            field,
            editable,
            updateable
          });
        }
      } else {
        out.push(thisRow);
        thisRow = {
          fields: [],
          key: ++rowkey
        };
      }
    }
    if (thisRow.fields.length) {
      out.push(thisRow);
    }
    return out;
  }
  get computedInputClass() {
    if (this.cols === 1) {
      return 'slds-form-element_1-col';
    }
    return '';
  }
  get computedOutputClass() {
    const classnames = classSet('slds-form-element_small slds-form-element_edit slds-hint-parent');
    return classnames.add({
      'slds-form-element_1-col': this.cols === 1
    }).toString();
  }
  toggleEdit(e) {
    if (e) {
      e.stopPropagation();
    }
    this._editMode = !this._editMode;
  }
  handleLoad(e) {
    e.stopPropagation();
    const apiName = this._objectApiName.objectApiName ? this._objectApiName.objectApiName : this._objectApiName;
    if (!this._fieldsHandled && this._layout && e.detail.objectInfos) {
      const layoutFields = getFieldsForLayout(e.detail, apiName, this._layout);
      this.fields = Object.keys(layoutFields);
      this._fieldsHandled = true;
    }
    const record = e.detail.records ? e.detail.records[this._recordId] : e.detail.record;
    this._record = record;
    this._isPersonAccount = record ? isPersonAccount(record) : false;
    if (this._firstLoad) {
      this._loading = false;
      this._firstLoad = false;
    }
    if (this._loadedPending) {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        this._loading = false;
        this._loadedPending = false;
      }, 0);
    }
    this._objectInfo = deepCopy(e.detail.objectInfos[apiName]);
    this.dispatchEvent(new CustomEvent('load', {
      detail: e.detail
    }));
  }
  handleError(e) {
    e.stopPropagation();
    this._loading = false;
    if (this._firstLoad) {
      this._loadError = true;
    }
    this.dispatchEvent(new CustomEvent('error', {
      detail: e.detail
    }));
  }
  handleSubmit(e) {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this._loading = !e.defaultPrevented;
    }, 0);
  }
  clearForm() {
    const inputFields = this.template.querySelectorAll('lightning-input-field');
    if (inputFields) {
      inputFields.forEach(field => {
        field.reset();
      });
    }
  }
  handleCancel(e) {
    if (this._recordId) {
      this.toggleEdit(e);
    } else {
      this.clearForm();
    }
    this.template.querySelector('c-messages').setError(null);
    this.dispatchEvent(new CustomEvent('cancel'));
  }
  handleSuccess(e) {
    e.stopPropagation();
    this._loadedPending = true;
    this._editMode = false;
    this.recordId = e.detail.id;
    this.dispatchEvent(new CustomEvent('success', {
      detail: e.detail
    }));
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cRecordForm, {
  publicProps: {
    mode: {
      config: 3
    },
    layoutType: {
      config: 3
    },
    density: {
      config: 3
    },
    recordTypeId: {
      config: 3
    },
    recordId: {
      config: 3
    },
    objectApiName: {
      config: 3
    },
    columns: {
      config: 3
    },
    fields: {
      config: 3
    }
  },
  publicMethods: ["submit"],
  track: {
    readOnly: 1,
    _recordId: 1,
    _objectApiName: 1,
    _fields: 1,
    _editMode: 1,
    cols: 1,
    _loading: 1,
    fieldsReady: 1,
    _recordTypeId: 1,
    _density: 1
  },
  fields: ["_record", "_firstLoad", "_loadError", "_layout", "_dupMapper", "_mode", "_labelSave", "_labelCancel", "_labelLoading", "_loadedPending", "_fieldsHandled", "_rawFields", "_isPersonAccount"]
});
const __lwc_component_class_internal = _registerComponent(cRecordForm, {
  tmpl: _tmpl,
  sel: "c-record-form",
  apiVersion: 66
});
export default __lwc_component_class_internal;