import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveDatatableIeditPanel.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import labelEdit from '@salesforce/label/LightningDatatable.edit';
import labelUpdateSelectedItems from '@salesforce/label/LightningDatatable.updateSelectedItems';
import labelCancel from '@salesforce/label/LightningDatatable.cancel';
import labelApply from '@salesforce/label/LightningDatatable.apply';
import { getStatCount } from 'lightning/overlayManager';
import { formatLabel } from 'lightning/utils';
import { features } from 'lightning/features';
const i18n = {
  edit: labelEdit,
  updateSelectedItems: labelUpdateSelectedItems,
  cancel: labelCancel,
  apply: labelApply
};
class PrimitiveDatatableIeditPanel extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this._focusTimeout = null;
    this._forceRerenderHackKey = [''];
    this._tableInModal = false;
    this.customErrorValidationMessage = void 0;
    this.visible = void 0;
    this.rowKeyValue = void 0;
    this.colKeyValue = void 0;
    this.editedValue = void 0;
    this.columnDef = void 0;
    this.isMassEditEnabled = false;
    this.numberOfSelectedRows = void 0;
    this.resolvedTypeAttributes = void 0;
  }
  get isEditableValid() {
    if (!this.columnDef.editableCustomType || this.inputableElement?.isEditableCustomValid) {
      return true;
    } else if (this.columnDef.editableCustomType) {
      console.error('Editable custom types must define an editTemplate that includes an element with attribute data-inputable set to "true"');
    }
    return false;
  }
  get isMassEditChecked() {
    return this.isMassEditEnabled && this.refs.massSelectCheckbox.checked;
  }
  get value() {
    return this.inputableElement ? this.inputableElement.value : null;
  }
  get validity() {
    return this.inputableElement.validity;
  }
  focus() {
    const elem = this.inputableElement;
    clearTimeout(this._focusTimeout);
    if (elem) {
      elem.focus();
    }
  }
  getPositionedElement() {
    return this.refs.section;
  }
  get computedStyle() {
    const styleHash = {
      'z-index': 1000,
      'background-color': 'var(--slds-g-color-surface-1, #fff)',
      'margin-top': '1px'
    };
    styleHash.display = this.visible ? 'block' : 'none';
    return Object.keys(styleHash).map(styleProp => `${styleProp}:${styleHash[styleProp]}`).join(';');
  }
  get inputableElement() {
    return !import.meta.env.SSR ? this.template.querySelector('.dt-type-edit-factory') : null;
  }
  get inputKey() {
    return this.rowKeyValue + this.colKeyValue;
  }
  get required() {
    return this.columnDef.typeAttributes && this.columnDef.typeAttributes.required;
  }
  get massEditCheckboxLabel() {
    return formatLabel(i18n.updateSelectedItems, this.numberOfSelectedRows);
  }
  get dialogAriaLabel() {
    const columnName = this.columnDef.label;
    return `${i18n.edit} ${columnName}`;
  }
  get i18n() {
    return i18n;
  }
  handleFormStartFocus() {
    clearTimeout(this._focusTimeout);
    if (this.isMassEditEnabled) {
      this.focusLastElement();
    } else {
      this.triggerEditFinished({
        reason: 'tab-pressed-prev'
      });
    }
  }
  handleFormEndsFocus() {
    clearTimeout(this._focusTimeout);
    if (this.isMassEditEnabled) {
      this.focus();
    } else {
      this.triggerEditFinished({
        reason: 'tab-pressed-next'
      });
    }
  }
  handlePanelLostFocus() {
    if (this.visible) {
      const isModalOpen = getStatCount('lwcModalCount') || getStatCount('auraModalCount');
      if (!this.template.activeElement && (!isModalOpen || this._tableInModal)) {
        this.triggerEditFinished({
          reason: 'lost-focus'
        });
      }
    }
  }
  handleTypeElemFocus() {
    clearTimeout(this._focusTimeout);
  }
  handleTypeElemBlur() {
    if (this.visible && !this.template.activeElement) {
      const blurRowKeyValue = this.rowKeyValue;
      const blurColKeyValue = this.colKeyValue;
      this._focusTimeout = setTimeout(() => {
        if (features.enableDtInlineEditBlurRace && (this.rowKeyValue !== blurRowKeyValue || this.colKeyValue !== blurColKeyValue)) {
          return;
        }
        this.handlePanelLostFocus();
      }, 0);
    }
  }
  handleEditFormSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isMassEditEnabled) {
      this.processSubmission();
    }
    return false;
  }
  handleCellKeydown(event) {
    const {
      keyCode
    } = event;
    if (keyCode === 27) {
      event.preventDefault();
      event.stopPropagation();
      this.cancelEditing();
    }
  }
  handleMassCheckboxChange(event) {
    const customEvent = new CustomEvent('masscheckboxchange', {
      detail: {
        checked: event.detail.checked
      }
    });
    this.dispatchEvent(customEvent);
  }
  triggerEditFinished(detail) {
    detail.rowKeyValue = detail.rowKeyValue || this.rowKeyValue;
    detail.colKeyValue = detail.colKeyValue || this.colKeyValue;
    const event = new CustomEvent('ieditfinished', {
      detail
    });
    this.dispatchEvent(event);
  }
  connectedCallback() {
    super.connectedCallback();
    this._tableInModal = !import.meta.env.SSR && !!this.template.host.closest('lightning-modal, .uiModal');
  }
  disconnectedCallback() {
    this._tableInModal = false;
  }
  focusLastElement() {
    this.refs.formLastElement.focus();
  }
  processSubmission() {
    if (this.validity.valid) {
      this.triggerEditFinished({
        reason: 'submit-action'
      });
    } else {
      this.inputableElement.showHelpMessageIfInvalid();
    }
  }
  cancelEditing() {
    this.triggerEditFinished({
      reason: 'edit-canceled'
    });
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(PrimitiveDatatableIeditPanel, {
  publicProps: {
    customErrorValidationMessage: {
      config: 0
    },
    visible: {
      config: 0
    },
    rowKeyValue: {
      config: 0
    },
    colKeyValue: {
      config: 0
    },
    editedValue: {
      config: 0
    },
    columnDef: {
      config: 0
    },
    isMassEditEnabled: {
      config: 0
    },
    numberOfSelectedRows: {
      config: 0
    },
    resolvedTypeAttributes: {
      config: 0
    },
    isEditableValid: {
      config: 1
    },
    isMassEditChecked: {
      config: 1
    },
    value: {
      config: 1
    },
    validity: {
      config: 1
    }
  },
  publicMethods: ["focus", "getPositionedElement"],
  fields: ["_focusTimeout", "_forceRerenderHackKey", "_tableInModal"]
});
const __lwc_component_class_internal = _registerComponent(PrimitiveDatatableIeditPanel, {
  tmpl: _tmpl,
  sel: "lightning-primitive-datatable-iedit-panel",
  apiVersion: 66
});
export default __lwc_component_class_internal;