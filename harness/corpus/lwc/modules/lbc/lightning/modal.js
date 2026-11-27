import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./modal.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningPrimitiveOverlay from 'lightning/primitiveOverlay';
import { parent, instanceName, secure } from 'lightning/overlayUtils';
import LightningModalBase from 'lightning/modalBase';
import { normalizeBoolean } from 'lightning/utilsPrivate';
class LightningModal extends LightningPrimitiveOverlay {
  constructor(...args) {
    super(...args);
    this._disableClose = false;
    this.size = 'medium';
    this.label = '';
    this.description = '';
  }
  get disableClose() {
    return this._disableClose;
  }
  set disableClose(value) {
    const currentDisableClose = this._disableClose;
    this._disableClose = normalizeBoolean(value);
    if (currentDisableClose !== this._disableClose) {
      this.dispatchEvent(new CustomEvent('privatedisableclosebutton', {
        detail: {
          disableClose: this._disableClose,
          [secure]: true
        },
        bubbles: true
      }));
    }
  }
  close(result) {
    if (!this.disableClose) {
      const promise = new Promise(resolve => {
        this.dispatchEvent(new CustomEvent('privateclose', {
          detail: {
            resolve,
            [secure]: true
          },
          bubbles: true
        }));
      });
      super.close(result, promise);
    } else {
      let errorMsg = 'LightningModal - Any interactions (buttons, processes, etc) that call modal.close() should be ';
      errorMsg += '(a) disabled, while disableClose api set true, and ';
      errorMsg += '(b) re-enabled, when disableClose set false';
      console.error(errorMsg);
    }
  }
  connectedCallback() {
    if (this.constructor.name === 'LightningModal') {
      throw new Error('Use of <lightning-modal> as an element is not supported. See developer documentation for extending the LightningModal class.');
    }
  }
  /*LWC compiler v9.5.3*/
}
LightningModal[parent] = LightningModalBase;
LightningModal[instanceName] = 'lightning-modal';
_registerDecorators(LightningModal, {
  publicProps: {
    size: {
      config: 0
    },
    label: {
      config: 0
    },
    description: {
      config: 0
    },
    disableClose: {
      config: 3
    }
  },
  publicMethods: ["close"],
  fields: ["_disableClose"]
});
const __lwc_component_class_internal = _registerComponent(LightningModal, {
  tmpl: _tmpl,
  sel: "lightning-modal",
  apiVersion: 66
});
export default __lwc_component_class_internal;