import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./prompt.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningInteractiveDialogBase from 'lightning/interactiveDialogBase';
import { parent, instanceName, secure } from 'lightning/overlayUtils';
import LightningPrimitiveOverlay from 'lightning/primitiveOverlay';
import { privateContext } from 'lightning/utilsInternal';
import labelDefault from '@salesforce/label/LightningPrompt.defaultLabel';
const {
  setContext,
  assertContext
} = privateContext;
class LightningPrompt extends LightningPrimitiveOverlay {
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
  constructor() {
    super();
    this.label = labelDefault;
    this.message = '';
    this.defaultValue = '';
    this.variant = 'header';
    this.theme = 'default';
    setContext(this);
  }
  renderedCallback() {
    assertContext(this);
    const evt = new CustomEvent('privatechildrender', {
      bubbles: true,
      detail: {
        message: this.message,
        label: this.label,
        hideCancel: false,
        showDescription: false,
        getOkValue: this.getOkValue.bind(this),
        getCancelValue: () => null,
        role: 'dialog'
      }
    });
    this.dispatchEvent(evt);
  }
  getOkValue() {
    if (this.template.querySelector('input')) {
      return this.template.querySelector('input').value;
    }
    return this.defaultValue;
  }
  /*LWC compiler v9.5.3*/
}
LightningPrompt[instanceName] = 'lightning-prompt';
LightningPrompt[parent] = LightningInteractiveDialogBase;
_registerDecorators(LightningPrompt, {
  publicProps: {
    label: {
      config: 0
    },
    message: {
      config: 0
    },
    defaultValue: {
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
const __lwc_component_class_internal = _registerComponent(LightningPrompt, {
  tmpl: _tmpl,
  sel: "lightning-prompt",
  apiVersion: 66
});
export default __lwc_component_class_internal;