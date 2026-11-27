import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveInputFile.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { isNativeComponent, reflectAttribute } from 'lightning/utilsPrivate';
import labelRequired from '@salesforce/label/LightningControl.required';
import labelInputFileBodyText from '@salesforce/label/LightningInputFile.bodyText';
import labelInputFileButtonLabel from '@salesforce/label/LightningInputFile.buttonLabel';
const i18n = {
  required: labelRequired,
  inputFileBodyText: labelInputFileBodyText,
  inputFileButtonLabel: labelInputFileButtonLabel
};
class LightningPrimitiveInputFile extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this._files = null;
    this._helpMessage = '';
    this.accept = void 0;
    this.accessKey = void 0;
    this.ariaInvalid = void 0;
    this.disabled = void 0;
    this.label = void 0;
    this.labelClass = void 0;
    this.multiple = void 0;
    this.name = void 0;
    this.readOnly = void 0;
    this.required = void 0;
    this.ariaLabel = void 0;
    this.ariaKeyShortcuts = void 0;
    this.ariaDisabled = void 0;
    this.ariaRoleDescription = void 0;
  }
  get files() {
    return this._files;
  }
  set files(value) {
    if (value && !import.meta.env.SSR) {
      if (value instanceof FileList) {
        this._files = value;
      } else {
        const dataTransfer = new DataTransfer();
        if (Array.isArray(value)) {
          let logError = false;
          for (const file of value) {
            if (file instanceof File) {
              dataTransfer.items.add(file);
            } else {
              logError = true;
            }
          }
          if (logError) {
            console.error('lightning-input type=file only supports FileList, File, or an Array of File objects in the files property');
          }
        } else if (value instanceof File) {
          dataTransfer.items.add(value);
        } else {
          console.error('lightning-input type=file only supports FileList, File, or an Array of File objects in the files property');
        }
        this._files = dataTransfer.files;
        requestAnimationFrame(() => {
          if (this.inputElement) {
            this.inputElement.files = dataTransfer.files;
          }
        });
      }
    }
  }
  get inputElement() {
    return this.template.querySelector('input');
  }
  get ariaDescribedByElements() {
    return this.template.querySelector('[data-help-message]');
  }
  get ariaErrorMessageElement() {
    return this.template.querySelector('[data-help-message]');
  }
  get ariaLabelledByElements() {
    return [this.template.querySelector('[data-form-label]'), this.template.querySelector('[data-file-selector-label]')];
  }
  get isNativeShadow() {
    return this._isNativeShadow;
  }
  get helpMessage() {
    return this._helpMessage;
  }
  set helpMessage(message) {
    this._helpMessage = message;
    reflectAttribute(this, 'invalid', !!message);
  }
  get variant() {
    return this._variant;
  }
  set variant(variant) {
    this._variant = variant;
    reflectAttribute(this, 'variant', variant);
  }
  get i18n() {
    return i18n;
  }
  handleDropFiles(event) {
    this._files = event.dataTransfer && event.dataTransfer.files;
    this.dispatchEvent(new CustomEvent('change'));
    this.dispatchEvent(new CustomEvent('reportvalidity'));
  }
  handleBlur() {
    this.dispatchEvent(new CustomEvent('blur'));
  }
  handleFocus() {
    this.dispatchEvent(new CustomEvent('focus'));
  }
  handleFileClick() {
    this.inputElement.value = null;
  }
  handleChange() {
    this._files = this.inputElement.files;
    this.dispatchEvent(new CustomEvent('change'));
    this.dispatchEvent(new CustomEvent('reportvalidity'));
  }
  connectedCallback() {
    super.connectedCallback();
    this._isNativeShadow = isNativeComponent(this);
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningPrimitiveInputFile, {
  publicProps: {
    accept: {
      config: 0
    },
    accessKey: {
      config: 0
    },
    ariaInvalid: {
      config: 0
    },
    disabled: {
      config: 0
    },
    label: {
      config: 0
    },
    labelClass: {
      config: 0
    },
    multiple: {
      config: 0
    },
    name: {
      config: 0
    },
    readOnly: {
      config: 0
    },
    required: {
      config: 0
    },
    ariaLabel: {
      config: 0
    },
    ariaKeyShortcuts: {
      config: 0
    },
    ariaDisabled: {
      config: 0
    },
    ariaRoleDescription: {
      config: 0
    },
    files: {
      config: 3
    },
    inputElement: {
      config: 1
    },
    ariaDescribedByElements: {
      config: 1
    },
    ariaErrorMessageElement: {
      config: 1
    },
    ariaLabelledByElements: {
      config: 1
    },
    isNativeShadow: {
      config: 1
    },
    helpMessage: {
      config: 3
    },
    variant: {
      config: 3
    }
  },
  fields: ["_files", "_helpMessage"]
});
const __lwc_component_class_internal = _registerComponent(LightningPrimitiveInputFile, {
  tmpl: _tmpl,
  sel: "lightning-primitive-input-file",
  apiVersion: 66
});
export default __lwc_component_class_internal;