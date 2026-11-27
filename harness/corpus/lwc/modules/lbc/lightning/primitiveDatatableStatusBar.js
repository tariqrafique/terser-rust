import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveDatatableStatusBar.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import labelSave from '@salesforce/label/LightningDatatable.save';
import labelCancel from '@salesforce/label/LightningDatatable.cancel';
import labelError from '@salesforce/label/LightningDatatable.error';
import { features } from 'lightning/features';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
const i18n = {
  save: labelSave,
  cancel: labelCancel,
  error: labelError
};
class LightningPrimitiveDatatableStatusBar extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.privateError = {};
  }
  connectedCallback() {
    super.connectedCallback();
    if (features.enableDTHeightCalcForScrollbar) {
      this.style.display = 'block';
      this.style.height = '3rem';
    }
  }
  get error() {
    return this.privateError;
  }
  set error(value) {
    this.privateError = value;
    if (this.showError && this.isSaveBtnFocused()) {
      this.handleShowError();
    }
  }
  get i18n() {
    return i18n;
  }
  get showError() {
    const {
      error
    } = this;
    if (error && (error.title || error.messages)) {
      return true;
    }
    return false;
  }
  get showErrorBubble() {
    const {
      error
    } = this;
    if (error && error.showBubble) {
      return true;
    }
    return false;
  }
  get bubbleOffset() {
    return {
      vertical: -10
    };
  }
  isSaveBtnFocused() {
    return !import.meta.env.SSR ? this.template.querySelector('button.save-btn:focus') !== null : false;
  }
  handleCancelButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('privatecancel', {
      bubbles: true,
      composed: true,
      cancelable: true
    }));
  }
  handleSaveButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();
    if (document.activeElement !== event.target) {
      event.target.focus();
    }
    this.dispatchEvent(new CustomEvent('privatesave', {
      bubbles: true,
      composed: true,
      cancelable: true
    }));
  }
  handleShowError() {
    Promise.resolve().then(() => {
      const trigger = this.refs.tooltip;
      if (trigger) {
        if (this.showErrorBubble) {
          trigger.showBubble();
        } else {
          trigger.focus();
        }
      }
    });
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningPrimitiveDatatableStatusBar, {
  publicProps: {
    error: {
      config: 3
    }
  },
  track: {
    privateError: 1
  }
});
const __lwc_component_class_internal = _registerComponent(LightningPrimitiveDatatableStatusBar, {
  tmpl: _tmpl,
  sel: "lightning-primitive-datatable-status-bar",
  apiVersion: 66
});
export default __lwc_component_class_internal;