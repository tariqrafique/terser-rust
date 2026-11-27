import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./alert.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningInteractiveDialogBase from 'lightning/interactiveDialogBase';
import LightningPrimitiveOverlay from 'lightning/primitiveOverlay';
import { parent, instanceName, secure } from 'lightning/overlayUtils';
import labelDefault from '@salesforce/label/LightningAlert.defaultLabel';
class LightningAlert extends LightningPrimitiveOverlay {
  constructor(...args) {
    super(...args);
    this.label = labelDefault;
    this.message = '';
    this.variant = 'header';
    this.theme = 'default';
  }
  close(result) {
    const promise = new Promise(resolve => {
      if (!import.meta.env.SSR) {
        this.dispatchEvent(new CustomEvent('privateclose', {
          detail: {
            resolve,
            [secure]: true
          },
          bubbles: true
        }));
      }
    });
    super.close(result, promise);
  }
  renderedCallback() {
    const evt = new CustomEvent('privatechildrender', {
      bubbles: true,
      detail: {
        message: this.message,
        label: this.label,
        hideCancel: true,
        showDescription: true,
        role: 'alertdialog'
      }
    });
    this.dispatchEvent(evt);
  }
  /*LWC compiler v9.5.3*/
}
LightningAlert[instanceName] = 'lightning-alert';
LightningAlert[parent] = LightningInteractiveDialogBase;
_registerDecorators(LightningAlert, {
  publicProps: {
    label: {
      config: 0
    },
    message: {
      config: 0
    },
    variant: {
      config: 0
    },
    theme: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(LightningAlert, {
  tmpl: _tmpl,
  sel: "lightning-alert",
  apiVersion: 66
});
export default __lwc_component_class_internal;